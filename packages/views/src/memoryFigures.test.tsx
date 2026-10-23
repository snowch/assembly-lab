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
  it("keeps declared array elements grouped while byte values and access highlights follow the trace", () => {
    const { container } = draw({
      program: { c: "", listing: "f:\n str w1, [x0, 4]\n ret" },
      call: { ...call, memory: [1, 2, 3, 4, 5, 6, 7, 8] },
      memory: { address: 0x410000, length: 8, elementBytes: 4, firstElement: 2 },
    });
    const groups = [...container.querySelectorAll("[data-element]")];
    expect(groups.map((g) => g.getAttribute("aria-label"))).toEqual(["Element 2", "Element 3"]);
    expect(
      groups.map((g) =>
        [...g.querySelectorAll("[data-address]")].map((c) => c.getAttribute("data-address")),
      ),
    ).toEqual([
      ["0x410000", "0x410001", "0x410002", "0x410003"],
      ["0x410004", "0x410005", "0x410006", "0x410007"],
    ]);
    fireEvent.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(groups[0]!.querySelectorAll('[data-access="stored"]')).toHaveLength(0);
    expect(groups[1]!.querySelectorAll('[data-access="stored"]')).toHaveLength(4);
    expect([...groups[1]!.querySelectorAll(".al-memory-value")].map((e) => e.textContent)).toEqual([
      "78",
      "56",
      "34",
      "12",
    ]);
    fireEvent.click(screen.getByRole("button", { name: S.stepper.back }));
    expect(groups[1]!.querySelectorAll('[data-access="stored"]')).toHaveLength(0);
    expect([...groups[1]!.querySelectorAll(".al-memory-value")].map((e) => e.textContent)).toEqual([
      "05",
      "06",
      "07",
      "08",
    ]);
  });

  it("optionally shows arithmetic flags across a store and rewinds them", () => {
    const { container } = draw({
      program: { c: "", listing: "f:\nadds w0, w0, w1\nstr w0, [x2]\ncset w0, vs\nret" },
      call: {
        entry: "f",
        args: [2147483647, 1, { value: "0x410000", width: 64 }],
        memory: [0, 0, 0, 0],
      },
      registers: ["w0", "w1", "x2"],
      extension: false,
      flags: true,
    });
    const flag = (name: string) => container.querySelector(`[data-flag="${name}"]`)!;
    expect(flag("v")).toHaveAttribute("data-value", "0");
    const next = screen.getByRole("button", { name: S.stepper.next });
    fireEvent.click(next);
    expect(flag("v")).toHaveAttribute("data-value", "1");
    expect(flag("c")).toHaveAttribute("data-value", "0");
    fireEvent.click(next);
    expect(flag("v")).toHaveAttribute("data-value", "1");
    expect(container.querySelector('[data-address="0x410003"] .al-memory-value')).toHaveTextContent(
      "80",
    );
    fireEvent.click(screen.getByRole("button", { name: S.stepper.reset }));
    expect(flag("v")).toHaveAttribute("data-value", "0");
  });

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

  it("keeps source addresses aligned with increasing register bits and labels each extension region once", () => {
    const { container } = draw({});
    fireEvent.click(screen.getByRole("button", { name: S.stepper.next }));
    const cells = [...container.querySelectorAll(".al-memory-register-byte")];
    expect(cells.map((cell) => cell.getAttribute("data-byte"))).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
    ]);
    const regions = [...container.querySelectorAll(".al-memory-region")];
    expect(regions).toHaveLength(3);
    expect(regions[0]).toHaveTextContent(M.loadedBits);
    expect(regions[0]).toHaveTextContent("0x410000");
    expect(regions[1]).toHaveTextContent(M.signFill);
    expect(regions[2]).toHaveTextContent(M.clearedUpper);
    expect(container.querySelectorAll(".al-memory-bits")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: M.showBits }));
    expect(container.querySelectorAll(".al-memory-bits")).toHaveLength(8);
    expect(screen.getByRole("button", { name: M.hideBits })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: M.hideBits }));
    expect(container.querySelectorAll(".al-memory-bits")).toHaveLength(0);
    // Rewinding removes the result but retains all original addressed source bytes.
    fireEvent.click(screen.getByRole("button", { name: S.stepper.back }));
    expect(container.querySelector(".al-memory-transfer")).toBeNull();
    expect(container.querySelectorAll(".al-memory-cells [data-address]")).toHaveLength(4);
  });

  it("compares the same executed moment without retaining another instruction's result", () => {
    const program = (instruction: string) => ({ c: "", listing: `f:\n ${instruction}\n ret` });
    const { container } = draw({
      cases: [
        {
          label: "unsigned",
          program: program("ldrb w1, [x0]"),
          call,
          registers: ["x0", "w1", "x1"],
        },
        {
          label: "signed",
          program: program("ldrsb w1, [x0]"),
          call,
          registers: ["x0", "w1", "x1"],
        },
      ],
    });
    expect(container.querySelector(".al-status")).toHaveTextContent("ldrb w1, [x0]");
    expect(container.querySelector(".al-memory-source-details")).not.toHaveAttribute("open");
    expect(container.querySelector(".al-memory-source-details .al-listing")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(container.querySelector('[data-register="w1"]')).toHaveTextContent("0x000000f9");
    const choose = screen.getByRole("combobox", { name: M.comparison });
    fireEvent.change(choose, { target: { value: "1" } });
    expect(container.querySelector('[data-figure="memory-stepper"]')).toHaveAttribute(
      "data-k",
      "1",
    );
    expect(container.querySelector('[data-register="w1"]')).toHaveTextContent("0xfffffff9");
    expect(container.querySelectorAll('[data-role="signFill"]')).toHaveLength(3);
    expect(container.querySelector(".al-memory-case-summary")).toHaveTextContent("0x410000");
    fireEvent.click(screen.getByRole("button", { name: S.stepper.reset }));
    expect(choose).toHaveValue("1");
    expect(container.querySelector(".al-memory-transfer")).toBeNull();
    expect(container.querySelector('[data-register="w1"]')).toHaveTextContent("0x12345678");
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
