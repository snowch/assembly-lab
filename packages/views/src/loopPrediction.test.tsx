// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { LoopPrediction } from "./interactives/LoopPrediction";
import { LOOP_STRINGS as L } from "./strings.loop";
import { ARITH_STRINGS as A } from "./strings.arith";
import { VIEW_STRINGS as S } from "./strings";

const program = {
  c: "",
  listing: "f:\n cbz w1, done\nbody:\n lsr w0, w0, 1\n subs w1, w1, 1\n b.ne body\ndone:\n ret",
};
function figure(props: Record<string, unknown> = {}, choice?: string) {
  const store = new LessonStore(memoryStorage(), "assembly-lab", "loop-prediction");
  if (choice !== undefined) store.setSlot("p", { choice });
  const interactive = Interactive.parse({
    id: "p",
    kind: "loop-prediction",
    timeModel: "steps",
    caption: "c",
    props: {
      program,
      call: { entry: "f", args: [128, 3] },
      measure: "body-visits",
      bodyLabel: "body",
      question: "Count the body executions",
      inputs: [0, 1],
      options: [
        { value: "3", label: "Three" },
        { value: "2", label: "Two" },
        { value: "returned", label: "Returned" },
        { value: "limit", label: "Limit" },
      ],
      ...props,
    },
  });
  return render(<LoopPrediction lesson={{} as Lesson} interactive={interactive} store={store} />);
}
function commit(label: string) {
  fireEvent.click(screen.getByRole("radio", { name: label }));
  fireEvent.click(screen.getByRole("button", { name: S.prediction.commit }));
}

describe("loop prediction", () => {
  it("waits for commitment, then counts executed body instructions rather than backward branches", () => {
    const { container } = figure();
    expect(container.querySelector(".al-outcome")).toBeNull();
    commit("Three");
    expect(screen.getByRole("status")).toHaveTextContent(L.iterations(3));
    expect(screen.getByRole("status")).toHaveClass("al-match");
    expect(screen.getByText(A.prediction.registers)).toBeVisible();
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent("128");
  });

  it("reports a limited trace as a limit, without grading its partial body count as a completed run", () => {
    figure({ call: { entry: "f", args: [128, 3], maxSteps: 4 } });
    commit("Limit");
    expect(screen.getByRole("status")).toHaveTextContent(L.limited(4));
    expect(screen.getByRole("status")).toHaveClass("al-match");
    expect(screen.getByRole("status")).not.toHaveTextContent(L.iterations(1));
  });

  it("measures a returned stop and its result from the run", () => {
    figure({ measure: "stop", call: { entry: "f", args: [128, 0] } });
    commit("Returned");
    expect(screen.getByRole("status")).toHaveTextContent(L.returned(128));
    expect(screen.getByRole("status")).toHaveClass("al-match");
  });

  it("recomputes a saved commitment against the present program", () => {
    figure({ call: { entry: "f", args: [128, 2] } }, "3");
    expect(screen.getByRole("status")).toHaveTextContent(L.iterations(2));
    expect(screen.getByRole("status")).toHaveClass("al-nomatch");
  });

  it("rejects an unbounded requested budget and a missing body label", () => {
    const { unmount } = figure({ call: { entry: "f", args: [128, 3], maxSteps: 100000 } });
    expect(screen.getByRole("note")).toHaveClass("interactive-problem");
    unmount();
    figure({ bodyLabel: undefined });
    expect(screen.getByRole("note")).toHaveClass("interactive-problem");
  });
});
