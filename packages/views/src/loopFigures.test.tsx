// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { LoopFigure } from "./interactives/LoopFigure";
import { StepperFigure } from "./interactives/StepperFigure";
import { stopSentence } from "./messages";
import { LOOP_STRINGS as L } from "./strings.loop";
import { VIEW_STRINGS as S } from "./strings";

const program = {
  c: "",
  listing: "f:\n cbz w1, done\nbody:\n lsr w0, w0, 1\n subs w1, w1, 1\n b.ne body\ndone:\n ret",
};
const runs = [
  { label: "zero", call: { entry: "f", args: [128, 0] } },
  { label: "three", call: { entry: "f", args: [128, 3] } },
];

function loop(props: Record<string, unknown>) {
  const interactive = Interactive.parse({
    id: "l",
    kind: "loop-runs",
    timeModel: "steps",
    caption: "c",
    props: { program, runs, bodyLabel: "body", ...props },
  });
  return render(
    <LoopFigure
      lesson={{} as Lesson}
      interactive={interactive}
      store={new LessonStore(memoryStorage(), "assembly-lab", "test")}
    />,
  );
}

describe("loop execution bars", () => {
  it("keeps every result hidden until the prediction is committed", () => {
    const { container } = loop({ after: "predict" });
    expect(screen.getByRole("note")).toHaveTextContent(S.stepper.locked);
    expect(container.querySelector(".al-loop-bars")).toBeNull();
    expect(container.textContent).not.toContain("128");
  });

  it("draws zero and three body operations, and updates the history for the selected run", () => {
    const { container } = loop({});
    expect(
      [...container.querySelectorAll(".al-loop-bar-row")].map((row) =>
        row.getAttribute("data-visits"),
      ),
    ).toEqual(["0", "3"]);
    expect(screen.getByText(L.noIterations)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "three" }));
    expect(
      [...container.querySelectorAll(".al-loop-values strong")].map((node) => node.textContent),
    ).toEqual(["128", "64", "32", "16"]);
    expect(screen.getByRole("status")).toHaveTextContent(L.returned(16));
    expect(screen.getByRole("button", { name: "three" })).toHaveAttribute("aria-pressed", "true");
  });

  it("calls a truncated trace partial and never reports its last register as a return", () => {
    const { container } = loop({
      runs: [{ label: "limited", call: { entry: "f", args: [128, 3], maxSteps: 4 } }],
    });
    expect(container.querySelector(".al-loop-bar-row")).toHaveAttribute("data-returned", "false");
    expect(screen.getByText(L.partialIterations(1))).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(L.limited(4));
    expect(screen.getByRole("status")).not.toHaveTextContent(L.returned(64));
  });

  it("bounds the visible history even when a call reaches its instruction budget", () => {
    const { container } = loop({
      runs: [{ label: "long", call: { entry: "f", args: [128, 0xffffffff] } }],
    });
    expect(container.querySelectorAll(".al-loop-values li")).toHaveLength(13);
    expect(screen.getByRole("status")).toHaveTextContent(L.limited(256));
    expect(screen.getByText(L.moreHistory(73))).toBeVisible();
  });

  it("rejects a preset that would request an excessive trace", () => {
    loop({ runs: [{ label: "huge", call: { entry: "f", args: [128, 3], maxSteps: 1000000 } }] });
    expect(screen.getByRole("note")).toHaveClass("interactive-problem");
  });
});

describe("a stepper stopped on a backward branch", () => {
  it("shows the budget stop rather than promising a next step", () => {
    const interactive = Interactive.parse({
      id: "s",
      kind: "stepper",
      timeModel: "steps",
      caption: "c",
      props: {
        program,
        call: { entry: "f", args: [128, 3], maxSteps: 4 },
        registers: [0, 1],
        branchStatus: true,
      },
    });
    render(
      <StepperFigure
        lesson={{} as Lesson}
        interactive={interactive}
        store={new LessonStore(memoryStorage(), "assembly-lab", "test")}
      />,
    );
    const next = screen.getByRole("button", { name: S.stepper.next });
    for (let i = 0; i < 4; i++) fireEvent.click(next);
    expect(next).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      stopSentence({ kind: "limit", steps: 4 })!,
    );
  });
});
