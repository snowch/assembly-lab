// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The adder's optional detail: a step by group of four, the column just worked as a calculation, the
// carries at bit 31 with the lines for C and V, the labels of the top bit and the lowest bit, the
// second number of a subtraction as it was given, and a figure that opens at its final state. Every
// number comes from the simulator's record, and each test holds the figure to that record. Without
// the optional props the figure is as it always was.

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Challenge, Interactive, type Lesson } from "@platform/lesson-schema";

import {
  additionSteps,
  bitAt,
  columnWork,
  endOfGroup,
  hex32,
  secondAsGiven,
  topCarries,
} from "./arith";
import { AdderFigure } from "./interactives/AdderFigure";
import { ARITH_STRINGS as A } from "./strings.arith";
import { traceOf } from "./trace";

// Thirty-two presses of a button, and the grid read after each, take a while on a busy machine.
vi.setConfig({ testTimeout: 30_000 });

const PLUS = { c: "", listing: "plus:\n  adds w0, w0, w1\n  ret" };
const SUBS = { c: "", listing: "elapsed_subs:\n  subs w0, w0, w1\n  ret" };

const plus = (a: number, b: number) => ({ program: PLUS, call: { entry: "plus", args: [a, b] } });
const subs = (a: number, b: number) => ({
  program: SUBS,
  call: { entry: "elapsed_subs", args: [a, b] },
});

function figure(
  props: Record<string, unknown>,
  store = new LessonStore(memoryStorage(), "assembly-lab", "test"),
  lesson = {} as Lesson,
) {
  const interactive = Interactive.parse({
    id: "f",
    kind: "adder",
    timeModel: "steps",
    caption: "c",
    props,
  });
  const view = render(<AdderFigure lesson={lesson} interactive={interactive} store={store} />);
  return { ...view, store };
}

const button = (name: string) => screen.getByRole("button", { name });
const cell = (container: HTMLElement, row: string, column: number) =>
  container.querySelector(`[data-row="${row}"][data-col="${column}"]`) as HTMLElement;
const flags = (container: HTMLElement) =>
  ["n", "z", "c", "v"].map(
    (f) => (container.querySelector(`[data-flag="${f}"]`) as HTMLElement).dataset["value"],
  );
const line = (container: HTMLElement, key: string) =>
  container.querySelector(`.al-adder-final [data-line="${key}"]`)?.textContent;
const calc = (container: HTMLElement, key: string) =>
  container.querySelector(`.al-adder-calc [data-calc="${key}"] dd`)?.textContent;
const recordOf = (props: ReturnType<typeof plus>) =>
  additionSteps(traceOf(props.program, props.call))[0]!.addition!;

/** Everything a state of the figure shows: each cell's value and the flags, the calculation and the panel. */
function state(container: HTMLElement) {
  const cells = [...container.querySelectorAll(".al-adder-cell[data-row]")].map(
    (c) =>
      `${c.getAttribute("data-row")}${c.getAttribute("data-col")}=${c.getAttribute("data-value")}`,
  );
  return {
    cells,
    flags: flags(container),
    done: container.querySelector(".al-adder")?.getAttribute("data-done"),
    calc: container.querySelector(".al-adder-calc")?.textContent,
    panel: container.querySelector(".al-adder-final")?.textContent ?? null,
  };
}

describe("the adder, with its detail", () => {
  it("gives 0x7fffffff plus 1 its flags N 1, Z 0, C 0 and V 1, and says carry into bit 31 is 1 and out is 0", () => {
    const props = plus(0x7fffffff, 1);
    const { container } = figure({ ...props, detail: true });
    expect(container.querySelector(".al-adder-final")).toBeNull();
    fireEvent.click(button(A.adder.all));
    expect(flags(container)).toEqual(["1", "0", "0", "1"]);
    expect(topCarries(recordOf(props))).toEqual({ into: 1, out: 0 });
    expect(line(container, "into")).toBe("Carry into bit 31: 1");
    expect(line(container, "out")).toBe("Carry out of bit 31: 0");
    expect(line(container, "c")).toBe("C = 0: no carry left bit 31, so the unsigned result fits");
    expect(line(container, "v")).toBe(
      "V = 1: the carries differ (1 in, 0 out), so the signed result does not fit",
    );
  });

  it("gives 0xffffffff plus 1 N 0, Z 1, C 1 and V 0: a carry into bit 31 and out of it", () => {
    const props = plus(0xffffffff, 1);
    const { container } = figure({ ...props, detail: true });
    fireEvent.click(button(A.adder.all));
    expect(flags(container)).toEqual(["0", "1", "1", "0"]);
    expect(topCarries(recordOf(props))).toEqual({ into: 1, out: 1 });
    expect(line(container, "c")).toBe(
      "C = 1: a carry left bit 31, so the unsigned result does not fit",
    );
    expect(line(container, "v")).toBe(
      "V = 0: the carries match (1 in, 1 out), so the signed result fits",
    );
  });

  it("gives 0x80000000 plus 0x80000000 N 0, Z 1, C 1 and V 1: no carry into bit 31, one out of it", () => {
    const props = plus(0x80000000, 0x80000000);
    const { container } = figure({ ...props, detail: true });
    fireEvent.click(button(A.adder.all));
    expect(flags(container)).toEqual(["0", "1", "1", "1"]);
    expect(topCarries(recordOf(props))).toEqual({ into: 0, out: 1 });
    expect(line(container, "into")).toBe("Carry into bit 31: 0");
    expect(line(container, "out")).toBe("Carry out of bit 31: 1");
    expect(line(container, "v")).toBe(
      "V = 1: the carries differ (0 in, 1 out), so the signed result does not fit",
    );
  });

  it("gives 0xc0000000 plus 0xc0000000 the result 0x80000000 with C 1 and V 0", () => {
    const props = plus(0xc0000000, 0xc0000000);
    const { container } = figure({ ...props, detail: true });
    fireEvent.click(button(A.adder.all));
    expect(hex32(recordOf(props).result)).toBe("0x80000000");
    expect(flags(container)).toEqual(["1", "0", "1", "0"]);
    expect(topCarries(recordOf(props))).toEqual({ into: 1, out: 1 });
  });

  it("agrees, for every addition, with the record: the panel's carries and its C and V are the record's", () => {
    for (const [a, b] of [
      [0x7fffffff, 1],
      [0xffffffff, 1],
      [5, 3],
      [0x80000000, 0x80000000],
      [0xc0000000, 0xc0000000],
      [0x80000000, 0xffffffff],
      [0x40000000, 0x40000000],
    ] as const) {
      const props = plus(a, b);
      const { container, unmount } = figure({ ...props, detail: true });
      fireEvent.click(button(A.adder.all));
      const { into, out } = topCarries(recordOf(props));
      expect(line(container, "into"), `${a} + ${b}`).toBe(`Carry into bit 31: ${into}`);
      expect(line(container, "out"), `${a} + ${b}`).toBe(`Carry out of bit 31: ${out}`);
      // C is the carry out of bit 31, and V is 1 when the two carries differ.
      expect(flags(container)[2], `${a} + ${b}`).toBe(String(out));
      expect(flags(container)[3], `${a} + ${b}`).toBe(String(into === out ? 0 : 1));
      unmount();
    }
  });

  it("shows the panel only when column 31 is done, and takes it away when Back leaves column 31", () => {
    const { container } = figure({ ...plus(0x7fffffff, 1), detail: true });
    fireEvent.click(button(A.adder.all));
    expect(container.querySelector(".al-adder-final")).not.toBeNull();
    fireEvent.click(button(A.adder.back));
    expect(container.querySelector(".al-adder-final")).toBeNull();
    expect(container.querySelector(".al-flags")).toHaveAttribute("data-known", "false");
  });

  it("marks bit 31's column by a frame in every row and by the text bit 31, and the lowest bit by bit 0", () => {
    const { container } = figure({ ...plus(5, 3), detail: true });
    for (const row of ["carry", "a", "b", "sum"])
      expect(cell(container, row, 31)).toHaveAttribute("data-top-bit", "true");
    expect(cell(container, "a", 30)).not.toHaveAttribute("data-top-bit");
    expect(container.querySelector('[data-mark="top"]')).toHaveTextContent("bit 31");
    expect(container.querySelector('[data-mark="low"]')).toHaveTextContent("bit 0");
    // Without the detail, neither label nor frame.
    const plain = figure({ ...plus(5, 3) });
    expect(plain.container.querySelector("[data-mark]")).toBeNull();
    expect(plain.container.querySelector("[data-top-bit]")).toBeNull();
  });

  it("keeps its 33 places in groups of four, and in groups of eight without the detail", () => {
    const detail = figure({ ...plus(5, 3), detail: true });
    expect(detail.container.querySelectorAll('[data-row="sum"] .al-adder-group')).toHaveLength(9);
    expect(detail.container.querySelectorAll('[data-row="carry"] .al-adder-cell')).toHaveLength(33);
    detail.unmount();
    const plain = figure({ ...plus(5, 3) });
    expect(plain.container.querySelectorAll('[data-row="sum"] .al-adder-group')).toHaveLength(5);
  });
});

describe("the adder's steps, by column, by group and all at once", () => {
  it("reaches the same state with Next group and with Show all as with 32 single steps", () => {
    const props = { ...plus(0x7fffffff, 1), detail: true };
    const single = figure(props);
    for (let i = 0; i < 32; i++) fireEvent.click(button(A.adder.next));
    const afterColumns = state(single.container);
    single.unmount();
    const groups = figure(props);
    for (let i = 0; i < 8; i++) fireEvent.click(button(A.adder.nextGroup));
    const afterGroups = state(groups.container);
    groups.unmount();
    const all = figure(props);
    fireEvent.click(button(A.adder.all));
    const afterAll = state(all.container);
    expect(afterGroups).toEqual(afterColumns);
    expect(afterAll).toEqual(afterColumns);
    expect(afterColumns.done).toBe("32");
    expect(afterColumns.panel).not.toBeNull();
  });

  it("works a group of four and says which columns: Columns 0 to 3 worked, then 4 to 7", () => {
    const { container } = figure({ ...plus(0x7fffffff, 1), detail: true });
    fireEvent.click(button(A.adder.nextGroup));
    expect(screen.getByRole("status")).toHaveTextContent("Columns 0 to 3 worked.");
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "4");
    expect(cell(container, "sum", 3)).toHaveAttribute("data-shown", "true");
    expect(cell(container, "sum", 4)).toHaveAttribute("data-shown", "false");
    fireEvent.click(button(A.adder.nextGroup));
    expect(screen.getByRole("status")).toHaveTextContent("Columns 4 to 7 worked.");
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "8");
  });

  it("goes only to the end of the group it is in: from column 6 it works columns 6 to 7", () => {
    figure({ ...plus(0x7fffffff, 1), detail: true });
    for (let i = 0; i < 6; i++) fireEvent.click(button(A.adder.next));
    fireEvent.click(button(A.adder.nextGroup));
    expect(screen.getByRole("status")).toHaveTextContent("Columns 6 to 7 worked.");
    expect(endOfGroup(6)).toBe(8);
    expect(endOfGroup(8)).toBe(12);
    expect(endOfGroup(28)).toBe(32);
    expect(endOfGroup(31)).toBe(32);
  });

  it("says nothing of a group after a single step, and a group move ends at the top bit", () => {
    const { container } = figure({ ...plus(0x7fffffff, 1), detail: true });
    fireEvent.click(button(A.adder.nextGroup));
    fireEvent.click(button(A.adder.next));
    expect(screen.getByRole("status")).not.toHaveTextContent("worked");
    for (let i = 0; i < 7; i++) fireEvent.click(button(A.adder.nextGroup));
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "32");
    expect(button(A.adder.nextGroup)).toBeDisabled();
  });

  it("goes Back to the previous column, and the calculation follows", () => {
    const props = plus(0x7fffffff, 1);
    const record = recordOf(props);
    const { container } = figure({ ...props, detail: true });
    for (let i = 0; i < 5; i++) fireEvent.click(button(A.adder.next));
    const five = state(container);
    fireEvent.click(button(A.adder.next));
    expect(container.querySelector(".al-adder-calc")).toHaveAttribute("data-column", "5");
    fireEvent.click(button(A.adder.back));
    expect(state(container)).toEqual(five);
    expect(container.querySelector(".al-adder-calc")).toHaveAttribute("data-column", "4");
    expect(calc(container, "carry-in")).toBe(String(bitAt(record.carries, 4)));
    fireEvent.click(button(A.adder.reset));
    expect(container.querySelector(".al-adder-calc")).toHaveAttribute("data-column", "none");
  });

  it("has every control as a button that the keyboard reaches and presses", async () => {
    const user = userEvent.setup();
    const { container } = figure({ ...plus(5, 3), detail: true });
    await user.tab();
    expect(button(A.adder.next)).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "1");
    await user.tab();
    expect(button(A.adder.nextGroup)).toHaveFocus();
    await user.keyboard(" ");
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "4");
    expect(
      within(container.querySelector(".al-controls") as HTMLElement)
        .getAllByRole("button")
        .map((b) => b.textContent),
    ).toEqual([A.adder.next, A.adder.nextGroup, A.adder.back, A.adder.all, A.adder.reset]);
  });
});

describe("the column just worked", () => {
  it("is the record's: the carry in, the two bits, the total, the bit kept and the carry out of each column", () => {
    const props = plus(0x7fffffff, 1);
    const record = recordOf(props);
    const { container } = figure({ ...props, detail: true });
    for (let column = 0; column < 32; column++) {
      fireEvent.click(button(A.adder.next));
      const work = columnWork(record, column);
      expect(calc(container, "carry-in"), `column ${column}`).toBe(
        String(bitAt(record.carries, column)),
      );
      expect(calc(container, "a"), `column ${column}`).toBe(String(bitAt(record.a, column)));
      expect(calc(container, "b"), `column ${column}`).toBe(String(bitAt(record.b, column)));
      expect(calc(container, "kept"), `column ${column}`).toBe(
        String(bitAt(record.result, column)),
      );
      expect(calc(container, "total"), `column ${column}`).toBe(
        `${work.carryIn} + ${work.a} + ${work.b} = ${work.total}`,
      );
      // The total is the kept bit and twice the carry out: 0, 1, 2 or 3.
      expect(work.total, `column ${column}`).toBe(2 * work.carryOut + work.kept);
      const into = column === 31 ? record.carryOut : bitAt(record.carries, column + 1);
      expect(calc(container, "carry-out"), `column ${column}`).toBe(String(into));
      expect(container.querySelector(".al-adder-calc-head")).toHaveTextContent(`Column ${column}`);
    }
  });

  it("is drawn beside the grid, with nothing worked yet at the start", () => {
    const { container } = figure({ ...plus(5, 3), detail: true });
    expect(container.querySelector(".al-adder-main > .al-adder-rows")).not.toBeNull();
    expect(container.querySelector(".al-adder-main > .al-adder-calc")).not.toBeNull();
    expect(container.querySelector(".al-adder-calc-head")).toHaveTextContent(A.adder.calc.none);
  });

  it("names the second number as changed for a subtraction, and not for an addition", () => {
    const sub = figure({ ...subs(1000, 4294966296), detail: true });
    fireEvent.click(button(A.adder.next));
    expect(sub.container.querySelector('[data-calc="b"] dt')).toHaveTextContent(
      A.adder.calc.bitOfChanged("w1"),
    );
    sub.unmount();
    const add = figure({ ...plus(5, 3), detail: true });
    fireEvent.click(button(A.adder.next));
    expect(add.container.querySelector('[data-calc="b"] dt')).toHaveTextContent(
      A.adder.calc.bitOf("w1"),
    );
  });
});

describe("the adder drawing a subtraction, with the detail", () => {
  it("draws the second operand as given, then with every bit changed, and the carry in of 1", () => {
    const props = subs(1000, 4294966296);
    const record = recordOf(props);
    const { container } = figure({ ...props, detail: true });
    // As given: the argument of the call. Changed: the record's own.
    expect(secondAsGiven(record)).toBe(4294966296n);
    expect(container.querySelector('[data-row="b-given"]')).toHaveTextContent("w1");
    expect(container.querySelector('[data-row="b-given"]')).toHaveTextContent(hex32(4294966296));
    expect(container.querySelector('[data-row="b"]')).toHaveTextContent(A.adder.turnedOver("w1"));
    for (let column = 0; column < 32; column++) {
      expect(cell(container, "b-given", column).dataset["value"], `given ${column}`).toBe(
        String(bitAt(4294966296n, column)),
      );
      expect(cell(container, "b", column).dataset["value"], `changed ${column}`).toBe(
        String(bitAt(record.b, column)),
      );
      // Every bit changed: the two rows differ in every column.
      expect(cell(container, "b", column).dataset["value"]).not.toBe(
        cell(container, "b-given", column).dataset["value"],
      );
    }
    expect(record.carryIn).toBe(1);
    expect(cell(container, "carry", 0).dataset["value"]).toBe("1");
    expect(container.querySelector('[data-row="carry"] .al-adder-value')).toHaveTextContent(
      `${A.adder.calc.carryIn}: 1`,
    );
  });

  it("has no second-number row for an addition, and the carry in is 0", () => {
    const { container } = figure({ ...plus(5, 3), detail: true });
    expect(container.querySelector('[data-row="b-given"]')).toBeNull();
    expect(container.querySelector('[data-row="carry"] .al-adder-value')).toHaveTextContent(
      `${A.adder.calc.carryIn}: 0`,
    );
  });

  it("opens at its final state: 1000 minus 4294966296 gives 2000 with C 0, a borrow, and a carry out of 0", () => {
    const props = subs(1000, 4294966296);
    const { container } = figure({ ...props, detail: true, summary: true, opensAtEnd: true });
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "32");
    expect(line(container, "result")).toBe("Result: 0x000007d0, which is 2000");
    expect(line(container, "c")).toBe("C = 0: a borrow was needed");
    expect(flags(container)).toEqual(["0", "0", "0", "0"]);
    expect(recordOf(props).carryOut).toBe(0);
    expect(topCarries(recordOf(props))).toEqual({ into: 0, out: 0 });
  });

  it("opens at its final state: 9000 minus 2500 gives 6500 with C 1, and no borrow", () => {
    const props = subs(9000, 2500);
    const { container } = figure({ ...props, detail: true, summary: true, opensAtEnd: true });
    expect(line(container, "result")).toBe("Result: 0x00001964, which is 6500");
    expect(line(container, "c")).toBe("C = 1: no borrow");
    expect(flags(container)).toEqual(["0", "0", "1", "0"]);
    expect(recordOf(props).result).toBe(6500n);
    expect(recordOf(props).carryOut).toBe(1);
  });

  it("opens with 296 minus 4294967000 as 592 with C 0, the answer to the lesson's question", () => {
    const props = subs(296, 4294967000);
    const { container } = figure({ ...props, detail: true, summary: true, opensAtEnd: true });
    expect(line(container, "result")).toBe("Result: 0x00000250, which is 592");
    expect(line(container, "c")).toBe("C = 0: a borrow was needed");
  });

  it("steps back from its final state, one column at a time, to the start", () => {
    const { container } = figure({
      ...subs(9000, 2500),
      detail: true,
      summary: true,
      opensAtEnd: true,
    });
    fireEvent.click(button(A.adder.back));
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "31");
    expect(container.querySelector(".al-adder-final")).toBeNull();
    fireEvent.click(button(A.adder.reset));
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "0");
    expect(cell(container, "sum", 0)).toHaveAttribute("data-shown", "false");
    fireEvent.click(button(A.adder.all));
    expect(line(container, "c")).toBe("C = 1: no borrow");
  });

  it("agrees with the record for any subtraction: C is 1 exactly when a carry leaves bit 31", () => {
    for (const [a, b] of [
      [1000, 4294966296],
      [9000, 2500],
      [296, 4294967000],
      [0, 4294967295],
      [5, 5],
      [5, 3],
    ] as const) {
      const props = subs(a, b);
      const { container, unmount } = figure({
        ...props,
        detail: true,
        summary: true,
        opensAtEnd: true,
      });
      const out = recordOf(props).carryOut;
      expect(flags(container)[2], `${a} - ${b}`).toBe(String(out));
      expect(line(container, "c"), `${a} - ${b}`).toBe(
        out === 1 ? "C = 1: no borrow" : "C = 0: a borrow was needed",
      );
      expect(a >= b, `${a} - ${b}`).toBe(out === 1);
      unmount();
    }
  });
});

describe("the adder without the detail", () => {
  it("has no group button, no calculation, no panel and no labels, as it always had none", () => {
    const { container } = figure({ ...plus(0x7fffffff, 1) });
    expect(screen.queryByRole("button", { name: A.adder.nextGroup })).toBeNull();
    expect(container.querySelector(".al-adder-calc")).toBeNull();
    expect(container.querySelector(".al-adder-final")).toBeNull();
    expect(container.querySelector(".al-adder-lower")).toBeNull();
    expect(container.querySelector(".al-adder-note")).toBeNull();
    expect(container.querySelector('[data-row="marks"]')).toBeNull();
  });

  it("still counts its columns from 1 in its status, and ends with the top-bit sentence", () => {
    figure({ ...plus(0x7fffffff, 1) });
    fireEvent.click(button(A.adder.next));
    expect(screen.getByRole("status")).toHaveTextContent(/^Column 1: /);
    fireEvent.click(button(A.adder.all));
    expect(screen.getByRole("status")).toHaveTextContent(A.adder.topBit);
  });
});

describe("the note under the adder", () => {
  const GATE = Challenge.parse({
    id: "gate",
    title: "Gate",
    task: "Give N.",
    gradedDirection: "answer",
    fields: [
      {
        id: "n",
        label: "N",
        kind: "choice",
        options: [
          { value: "0", label: "0" },
          { value: "1", label: "1" },
        ],
      },
    ],
    initial: { data: { program: PLUS } },
    tests: {
      kind: "answers",
      grader: "outcomes-at-return",
      cases: [{ label: "5 plus 3", given: { entry: "plus", w0: 5, w1: 3 }, expect: { n: "n" } }],
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: { answers: { n: "0" } },
  });
  const lesson = { challenges: [GATE] } as unknown as Lesson;
  const NOTE = "C and V are separate tests.";

  it("is not on the page while the challenge is not passed, and is once it is", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure(
      { ...plus(1, 0xffffffff), afterChallenge: "gate", detail: true, note: NOTE },
      store,
      lesson,
    );
    expect(container.textContent).not.toContain(NOTE);
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "1" } } })));
    expect(container.textContent).not.toContain(NOTE);
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "0" } } })));
    expect(container.querySelector(".al-adder-note")).toHaveTextContent(NOTE);
  });
});
