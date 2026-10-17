// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { MemoryStepper } from "./interactives/MemoryStepper";
import { MemoryPrediction } from "./interactives/MemoryPrediction";
import { VIEW_STRINGS as S } from "./strings";
import { MEMORY_STRINGS as M } from "./strings.memory";

const call = {
  entry: "f",
  args: [{ value: "0x410000", width: 64 }, 0x12345678],
  memory: [0xf9, 0xff, 0xaa, 0xbb],
};
function draw(props: Record<string, unknown>) {
  return render(
    <MemoryStepper
      lesson={{} as Lesson}
      interactive={Interactive.parse({
        id: "step",
        kind: "memory-stepper",
        timeModel: "steps",
        caption: "c",
        props: {
          program: { c: "", listing: "f:\n ldrsb w1, [x0]\n strb w1, [x0, 2]\n ret" },
          call,
          registers: ["x0", "w1", "x1"],
          memory: { address: 0x410000, length: 4 },
          extension: true,
          ...props,
        },
      })}
      store={new LessonStore(memoryStorage(), "assembly-lab", "test")}
    />,
  );
}

describe("memory stepper", () => {
  it("reveals no listing, memory or result before a gated prediction", () => {
    const { container } = draw({ after: "predict" });
    expect(screen.getByRole("note")).toHaveTextContent(S.stepper.locked);
    expect(container.querySelector(".al-memory-cells")).toBeNull();
    expect(container.textContent).not.toContain("410000");
  });

  it("steps and rewinds memory, flags accessed cells, and separates sign fill from cleared upper bits", () => {
    const { container } = draw({});
    const next = screen.getByRole("button", { name: S.stepper.next });
    const back = screen.getByRole("button", { name: S.stepper.back });
    const cell = (address: string) => container.querySelector(`[data-address="${address}"]`)!;
    expect(cell("0x410002").querySelector(".al-memory-value")).toHaveTextContent("aa");
    fireEvent.click(next);
    expect(cell("0x410000")).toHaveAttribute("data-access", "loaded");
    expect(container.querySelectorAll('[data-role="signFill"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-role="clearedUpper"]')).toHaveLength(4);
    expect(container.querySelector('[data-register="x1"]')).toHaveTextContent("0x00000000fffffff9");
    fireEvent.click(next);
    expect(cell("0x410002")).toHaveAttribute("data-access", "stored");
    expect(cell("0x410002").querySelector(".al-memory-value")).toHaveTextContent("f9");
    expect(container.querySelectorAll(".al-memory-register-byte")).toHaveLength(1);
    expect(cell("0x410002").querySelector(".al-memory-access")).toHaveTextContent(M.stored);
    expect(container.querySelector('[data-role="source"] .al-memory-role')).toHaveTextContent(
      M.storeSource,
    );
    expect(container.querySelector('[data-register="w1"]')).toHaveAttribute(
      "data-changed",
      "false",
    );
    fireEvent.click(back);
    expect(cell("0x410002").querySelector(".al-memory-value")).toHaveTextContent("aa");
    fireEvent.click(screen.getByRole("button", { name: S.stepper.reset }));
    expect(container.querySelector(".al-memory-transfer")).toBeNull();
    expect(back).toBeDisabled();
  });

  it("draws register-only extension without pretending it accessed memory", () => {
    const { container } = draw({
      program: { c: "", listing: "f:\n sxtb w1, w0\n ret" },
      call: { entry: "f", args: [249] },
      memory: undefined,
    });
    fireEvent.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(container.querySelector(".al-memory-cells")).toBeNull();
    expect(container.querySelector('[data-transfer="extend"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-role="copiedBits"]')).toHaveLength(1);
    expect(container.querySelector('[data-register="x1"]')).toHaveTextContent("0x00000000fffffff9");
  });
});

describe("memory predictions", () => {
  it.each([
    [{ kind: "memory-at-end", address: 0x410000, length: 4 }, "78 56 34 12"],
    [{ kind: "register-at-end", register: "x0" }, "0x0000000000410000"],
  ])("measures the committed answer from the model: %j", (measure, answer) => {
    const { container } = render(
      <MemoryPrediction
        lesson={{} as Lesson}
        interactive={Interactive.parse({
          id: "predict",
          kind: "memory-prediction",
          timeModel: "steps",
          caption: "c",
          props: {
            program: { c: "", listing: "f:\n str w1, [x0]\n ret" },
            call,
            measure,
            question: "Choose",
            options: [
              { value: answer, label: "first" },
              { value: "wrong", label: "second" },
            ],
            explain: "After committing.",
          },
        })}
        store={new LessonStore(memoryStorage(), "assembly-lab", "test")}
      />,
    );
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.textContent).not.toContain(answer);
    fireEvent.click(screen.getByRole("radio", { name: "first" }));
    fireEvent.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(screen.getByRole("status")).toHaveTextContent(answer);
    expect(screen.getByRole("status")).toHaveClass("al-match");
  });
});
