// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The figures Module 2 adds, rendered: the adder draws the simulator's own record of an addition,
// column by column, and shows the flags only when the last column is added; the prediction about a
// run takes its right option from the run; the counter's ring shows the distance and C from the
// simulator; the stepper can draw the four flags; a listing with no C draws no C pane; a choice is a
// row of radio buttons.

import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Challenge, Interactive, type Lesson } from "@platform/lesson-schema";

import { AnswerEditor } from "./AnswerEditor";
import { additionSteps, bitAt } from "./arith";
import { AdderFigure } from "./interactives/AdderFigure";
import { CounterRing } from "./interactives/CounterRing";
import { RunPrediction } from "./interactives/RunPrediction";
import { StepperFigure } from "./interactives/StepperFigure";
import { ARITH_STRINGS as A } from "./strings.arith";
import { VIEW_STRINGS as S } from "./strings";
import { traceOf } from "./trace";

// Thirty-two presses of a button take a while on a busy machine.
vi.setConfig({ testTimeout: 30_000 });

const PLUS = { c: "", listing: "plus:\n  adds w0, w0, w1\n  ret" };
const SUM_FLAGS = {
  c: "",
  listing: "sum_flags:\n  adds w2, w1, w1\n  add w0, w0, w1\n  ret",
};
const NEGS = { c: "", listing: "negate_flags:\n  negs w0, w0\n  ret" };
const ELAPSED = {
  c: "unsigned elapsed(unsigned now, unsigned then) { return now - then; }",
  listing: "elapsed:\n  sub w0, w0, w1 C1\n  ret C1",
};
const ELAPSED_SUBS = "elapsed_subs:\n  subs w0, w0, w1\n  ret";

function figure(
  View: typeof AdderFigure,
  kind: string,
  props: Record<string, unknown>,
  store = new LessonStore(memoryStorage(), "assembly-lab", "test"),
  id = "f",
) {
  const interactive = Interactive.parse({ id, kind, timeModel: "steps", caption: "c", props });
  const view = render(<View lesson={{} as Lesson} interactive={interactive} store={store} />);
  return { ...view, store };
}

const cell = (container: HTMLElement, row: string, column: number) =>
  container.querySelector(`[data-row="${row}"][data-col="${column}"]`) as HTMLElement;
const reg = (container: HTMLElement) =>
  container.querySelector(".al-reg[data-changed='true']")?.getAttribute("data-register");
const flag = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-flag="${name}"]`) as HTMLElement;

describe("the adder", () => {
  const props = { program: PLUS, call: { entry: "plus", args: [0x7fffffff, 1] } };
  const record = additionSteps(traceOf(PLUS, props.call))[0]!.addition!;

  it("draws the two numbers whole, and the answer, the carries and the flags not yet", () => {
    const { container } = figure(AdderFigure, "adder", props);
    for (let column = 0; column < 32; column++) {
      expect(cell(container, "a", column).dataset["value"]).toBe(String(bitAt(record.a, column)));
      expect(cell(container, "b", column).dataset["value"]).toBe(String(bitAt(record.b, column)));
      expect(cell(container, "sum", column).dataset["shown"]).toBe("false");
    }
    // Only the carry into the rightmost column is known: the carry in, 0.
    expect(cell(container, "carry", 0).dataset["value"]).toBe("0");
    expect(cell(container, "carry", 1).dataset["shown"]).toBe("false");
    expect(container.querySelector(".al-flags")).toHaveAttribute("data-known", "false");
    expect(screen.getByRole("status")).toHaveTextContent(A.adder.start);
  });

  it("adds a column to each press: the answer bit and the carry into the next column come from the record", async () => {
    const user = userEvent.setup();
    const { container } = figure(AdderFigure, "adder", props);
    for (let column = 0; column < 32; column++) {
      await user.click(screen.getByRole("button", { name: A.adder.next }));
      expect(cell(container, "sum", column).dataset["value"], `answer bit ${column}`).toBe(
        String(bitAt(record.result, column)),
      );
      const intoNext = column === 31 ? record.carryOut : bitAt(record.carries, column + 1);
      expect(cell(container, "carry", column + 1).dataset["value"], `carry ${column + 1}`).toBe(
        String(intoNext),
      );
      expect(container.querySelector('[data-current="true"]')).not.toBeNull();
      expect(cell(container, "sum", column).dataset["current"]).toBe("true");
      if (column < 31) {
        expect(cell(container, "sum", column + 1).dataset["shown"]).toBe("false");
        expect(container.querySelector(".al-flags")).toHaveAttribute("data-known", "false");
      }
    }
    expect(screen.getByRole("button", { name: A.adder.next })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(A.adder.done);
  });

  it("shows N 1, Z 0, C 0 and V 1 when the last column is added, and the carry into and out of the top bit", async () => {
    const user = userEvent.setup();
    const { container } = figure(AdderFigure, "adder", props);
    await user.click(screen.getByRole("button", { name: A.adder.all }));
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "1",
      "0",
      "0",
      "1",
    ]);
    expect(container.querySelector('[data-top="in"]')).toHaveAttribute("data-value", "1");
    expect(container.querySelector('[data-top="out"]')).toHaveAttribute("data-value", "0");
    // A carry runs through every column into the top bit.
    for (let column = 1; column <= 31; column++)
      expect(cell(container, "carry", column).dataset["value"]).toBe("1");
    expect(cell(container, "sum", 31).dataset["value"]).toBe("1");
  });

  it("goes back a column, and Reset starts again", async () => {
    const user = userEvent.setup();
    const { container } = figure(AdderFigure, "adder", props);
    await user.click(screen.getByRole("button", { name: A.adder.all }));
    await user.click(screen.getByRole("button", { name: A.adder.back }));
    expect(container.querySelector(".al-flags")).toHaveAttribute("data-known", "false");
    expect(cell(container, "sum", 31).dataset["shown"]).toBe("false");
    expect(cell(container, "sum", 30).dataset["shown"]).toBe("true");
    await user.click(screen.getByRole("button", { name: A.adder.reset }));
    expect(cell(container, "sum", 0).dataset["shown"]).toBe("false");
    expect(screen.getByRole("button", { name: A.adder.back })).toBeDisabled();
  });

  it("draws 5 plus 3 with the flags the model gives: all four 0", async () => {
    const user = userEvent.setup();
    const { container } = figure(AdderFigure, "adder", {
      ...props,
      call: { entry: "plus", args: [5, 3] },
    });
    await user.click(screen.getByRole("button", { name: A.adder.all }));
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "0",
      "0",
      "0",
      "0",
    ]);
  });

  it("stays shut until the prediction it follows has been checked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure(AdderFigure, "adder", { ...props, after: "p" }, store);
    expect(container.querySelector(".al-locked")).toHaveTextContent(S.stepper.locked);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.querySelector(".al-adder-cell")).toBeNull();
  });

  it("says in its last status that column 32 is the top bit and that V compares the two carries", async () => {
    const user = userEvent.setup();
    figure(AdderFigure, "adder", props);
    await user.click(screen.getByRole("button", { name: A.adder.all }));
    expect(screen.getByRole("status")).toHaveTextContent(A.adder.topBit);
    expect(A.adder.topBit).toMatch(/top bit/);
    expect(A.adder.topBit).toMatch(
      /V is 1 when the carry into the top bit differs from the carry out of it/,
    );
  });

  it("says what the two thick underlines are in text a touch screen can read, not in a title alone", () => {
    const { container } = figure(AdderFigure, "adder", props);
    const key = container.querySelector(".al-adder-key");
    expect(key).toHaveTextContent(A.adder.topKey);
    // The key is visible text: not inside the aria-hidden rows of cells.
    expect(key?.closest("[aria-hidden='true']")).toBeNull();
    expect(A.adder.topKey).toMatch(/carry out of the top bit/);
    expect(A.adder.topKey).toMatch(/carry into the top bit/);
  });
});

describe("the adder, shut until a challenge is passed", () => {
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
  const props = {
    program: PLUS,
    call: { entry: "plus", args: [1, 0xffffffff] },
    afterChallenge: "gate",
  };
  const interactive = Interactive.parse({
    id: "f",
    kind: "adder",
    timeModel: "steps",
    caption: "c",
    props,
  });

  it("shows the lock, and no cell, while the work for the challenge is missing or wrong", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = render(
      <AdderFigure lesson={lesson} interactive={interactive} store={store} />,
    );
    expect(container.querySelector(".al-locked")).toHaveTextContent(A.adder.lockedUntilPassed);
    expect(container.querySelector(".al-adder-cell")).toBeNull();
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "1" } } })));
    expect(container.querySelector(".al-locked")).not.toBeNull();
  });

  it("opens once the saved work passes, and shuts again if it stops passing", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = render(
      <AdderFigure lesson={lesson} interactive={interactive} store={store} />,
    );
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "0" } } })));
    expect(container.querySelector(".al-locked")).toBeNull();
    expect(container.querySelectorAll(".al-adder-cell").length).toBeGreaterThan(0);
    act(() => store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "1" } } })));
    expect(container.querySelector(".al-locked")).not.toBeNull();
  });

  it("draws 1 plus 0xffffffff with a carry out of the top bit: Z 1, C 1, N 0, V 0", async () => {
    const user = userEvent.setup();
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    store.setChallenge("gate", (c) => ({ ...c, artifact: { answers: { n: "0" } } }));
    const { container } = render(
      <AdderFigure lesson={lesson} interactive={interactive} store={store} />,
    );
    await user.click(screen.getByRole("button", { name: A.adder.all }));
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "0",
      "1",
      "1",
      "0",
    ]);
    expect(container.querySelector('[data-top="in"]')).toHaveAttribute("data-value", "1");
    expect(container.querySelector('[data-top="out"]')).toHaveAttribute("data-value", "1");
  });
});

describe("the adder drawing a subtraction", () => {
  const sub = (args: number[]) => ({
    program: { c: "", listing: ELAPSED_SUBS },
    call: { entry: "elapsed_subs", args },
  });

  it("turns the second number over, carries 1 into the rightmost column, and ends with C 0 across a wrap", async () => {
    const user = userEvent.setup();
    const props = sub([1000, 4294966296]);
    const record = additionSteps(traceOf(props.program, props.call))[0]!.addition!;
    const { container } = figure(AdderFigure, "adder", props);
    expect(container.querySelector('[data-row="b"]')).toHaveTextContent(A.adder.turnedOver("w1"));
    expect(cell(container, "carry", 0).dataset["value"]).toBe("1");
    for (let column = 0; column < 32; column++)
      expect(cell(container, "b", column).dataset["value"]).toBe(String(bitAt(record.b, column)));
    await user.click(screen.getByRole("button", { name: A.adder.all }));
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "0",
      "0",
      "0",
      "0",
    ]);
    expect(container.querySelector('[data-top="out"]')).toHaveAttribute("data-value", "0");
    expect(screen.getByRole("status")).toHaveTextContent(A.adder.topBit);
  });

  it("ends with C 1 and a carry out of the top bit when nothing wrapped", async () => {
    const user = userEvent.setup();
    const { container } = figure(AdderFigure, "adder", sub([9000, 2500]));
    await user.click(screen.getByRole("button", { name: A.adder.all }));
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "0",
      "0",
      "1",
      "0",
    ]);
    expect(container.querySelector('[data-top="out"]')).toHaveAttribute("data-value", "1");
  });
});

describe("the prediction about a run", () => {
  const choose = async (name: string | RegExp) => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
  };

  const readings = {
    question: "**Which readings are right?**",
    options: [
      { value: "both", label: "Both" },
      { value: "unsigned", label: "Only the unsigned" },
      { value: "signed", label: "Only the signed" },
      { value: "neither", label: "Neither" },
    ],
    explain: "The answer is `0x80000000`.",
    program: PLUS,
    call: { entry: "plus", args: [0x7fffffff, 1] },
    measure: { kind: "readings" },
    inputs: [0, 1],
  };

  it("shows the program and the registers it starts with, and nothing of the run, until the learner checks", () => {
    const { container } = figure(RunPrediction, "run-prediction", readings);
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "2147483647",
    );
    expect(container.querySelector('[data-register="w1"] .al-reg-value')).toHaveTextContent("1");
    expect(container.querySelector(".al-insn .al-text")).toHaveTextContent("adds w0, w0, w1");
    // No C pane: the program is the lesson's own assembly.
    expect(container.querySelector(".al-c")).toBeNull();
    expect(container.querySelector(".al-outcome")).toBeNull();
    expect(container.textContent).not.toContain("The simulator ran");
    expect(screen.getByRole("button", { name: S.prediction.commit })).toBeDisabled();
  });

  it("takes the right readings from the run: unsigned right, signed wrong", async () => {
    const { container } = figure(RunPrediction, "run-prediction", readings);
    await choose("Only the unsigned");
    expect(container.querySelector(".al-match")).toHaveTextContent(
      "Read as unsigned, the answer is right. Read as signed, the answer is wrong.",
    );
    expect(container.querySelector(".al-outcome")).toHaveTextContent("The answer is 0x80000000.");
  });

  it("says no match for another option, and for both readings right when nothing overflowed", async () => {
    const wrong = figure(RunPrediction, "run-prediction", readings);
    await choose("Both");
    expect(wrong.container.querySelector(".al-nomatch")).toHaveTextContent(S.prediction.noMatch);
    wrong.unmount();
    const small = figure(RunPrediction, "run-prediction", {
      ...readings,
      call: { entry: "plus", args: [5, 3] },
    });
    await choose("Both");
    expect(small.container.querySelector(".al-match")).toHaveTextContent(
      "right. Read as signed, the answer is right",
    );
  });

  it("reads 0xffffffff plus 1 as wrong unsigned and right signed", async () => {
    const { container } = figure(RunPrediction, "run-prediction", {
      ...readings,
      call: { entry: "plus", args: [0xffffffff, 1] },
    });
    await choose("Only the signed");
    expect(container.querySelector(".al-match")).toHaveTextContent(
      "Read as unsigned, the answer is wrong. Read as signed, the answer is right.",
    );
  });

  const flags = {
    question: "**After `add`, what do the flags show?**",
    options: [
      { value: "v", label: "V is 1, as with `adds`" },
      { value: "none", label: "All four are still 0" },
      { value: "error", label: "The run stops with an error" },
      { value: "c", label: "C is 1" },
    ],
    program: SUM_FLAGS,
    call: { entry: "sum_flags", args: [0x7fffffff, 1] },
    measure: { kind: "flags" },
  };

  it("takes the flags after add from the run: all four still 0", async () => {
    const { container } = figure(RunPrediction, "run-prediction", flags);
    await choose("All four are still 0");
    expect(container.querySelector(".al-match")).toHaveTextContent(
      "When it ended, N was 0, Z was 0, C was 0 and V was 0.",
    );
  });

  it("says V, and not all four 0, for a run that leaves V set", async () => {
    const { container } = figure(RunPrediction, "run-prediction", {
      ...flags,
      program: PLUS,
      call: { entry: "plus", args: [0x7fffffff, 1] },
    });
    await choose(/^V is 1/);
    expect(container.querySelector(".al-match")).toHaveTextContent(
      "N was 1, Z was 0, C was 0 and V was 1",
    );
  });

  const register = {
    question: "**What does `w0` hold afterwards?**",
    options: [
      { value: "0x80000000", label: "`0x80000000`, unchanged" },
      { value: "0x7fffffff", label: "`0x7fffffff`" },
      { value: "0x00000000", label: "0" },
      { value: "error", label: "The run stops with an error" },
    ],
    program: NEGS,
    call: { entry: "negate_flags", args: [0x80000000] },
    measure: { kind: "register", register: 0, as: "hex", flags: true },
    inputs: [0],
  };

  it("takes a register's value in hexadecimal from the run, and says the flags too", async () => {
    const { container } = figure(RunPrediction, "run-prediction", register);
    await choose(/unchanged/);
    expect(container.querySelector(".al-match")).toHaveTextContent(
      "w0 held 0x80000000 when the run ended. N was 1, Z was 0, C was 0 and V was 1.",
    );
  });

  it("takes a register's value in decimal from the run: elapsed(1000, 4294966296) is 2000", async () => {
    const { container } = figure(RunPrediction, "run-prediction", {
      question: "**What does it return?**",
      options: [
        { value: "2000", label: "2000" },
        { value: "-4294965296", label: "−4294965296" },
        { value: "4294965296", label: "4294965296" },
        { value: "0", label: "0" },
      ],
      program: ELAPSED,
      call: { entry: "elapsed", args: [1000, 4294966296] },
      measure: { kind: "register", register: 0, as: "decimal" },
      inputs: [0, 1],
    });
    expect(container.querySelector(".al-c")).not.toBeNull();
    await choose("4294965296");
    expect(container.querySelector(".al-nomatch")).toHaveTextContent("w0 held 2000");
    await choose("2000");
    expect(container.querySelector(".al-match")).not.toBeNull();
  });

  it("keeps the commitment in the lesson's stored state, so it survives a reload", async () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const first = figure(RunPrediction, "run-prediction", flags, store);
    await choose("All four are still 0");
    first.unmount();
    const again = figure(RunPrediction, "run-prediction", flags, store);
    expect(again.container.querySelector(".al-match")).not.toBeNull();
  });
});

describe("the counter's ring", () => {
  const props = {
    program: ELAPSED,
    call: { entry: "elapsed", args: [1000, 4294966296] },
    borrowProgram: { listing: ELAPSED_SUBS },
    borrowEntry: "elapsed_subs",
  };
  const row = (container: HTMLElement, name: string) =>
    container.querySelector(`[data-row="${name}"] dd`)!.textContent;

  it("shows then, now, the distance from the recorded function and C from subs", () => {
    const { container } = figure(CounterRing, "counter-ring", props);
    expect(row(container, "then")).toBe("4294966296");
    expect(row(container, "now")).toBe("1000");
    expect(row(container, "elapsed")).toBe("2000");
    expect(row(container, "c")).toBe(`0 (${A.ring.borrowed})`);
    // The wrap is marked on the enlarged strip.
    expect(container.querySelector("svg")).toHaveAttribute("data-borrowed", "true");
    expect(container.querySelector('[data-mark="wrap"]')).not.toBeNull();
  });

  it("places the wrap by how far from then it falls: 1000 of 2000 is halfway", () => {
    const { container } = figure(CounterRing, "counter-ring", props);
    const wrap = container.querySelector('[data-mark="wrap"] line')!;
    const x = Number(wrap.getAttribute("x1"));
    expect(x).toBeCloseTo((20 + 300) / 2, 5);
  });

  it("marks no wrap, and C 1, for readings the counter did not wrap between", () => {
    const { container } = figure(CounterRing, "counter-ring", {
      ...props,
      call: { entry: "elapsed", args: [5000, 1000] },
    });
    expect(row(container, "elapsed")).toBe("4000");
    expect(row(container, "c")).toBe(`1 (${A.ring.notBorrowed})`);
    expect(container.querySelector("svg")).toHaveAttribute("data-borrowed", "false");
    expect(container.querySelector('[data-mark="wrap"]')).toBeNull();
  });

  it("can show the recorded function above the ring", () => {
    const { container } = figure(CounterRing, "counter-ring", { ...props, listing: true });
    expect(container.querySelector(".al-insn .al-text")).toHaveTextContent("sub w0, w0, w1");
    expect(container.querySelector(".al-c")).not.toBeNull();
  });

  it("stays shut until the prediction it follows has been checked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure(CounterRing, "counter-ring", { ...props, after: "p" }, store);
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });
});

describe("the stepper with the flags", () => {
  const next = () => screen.getByRole("button", { name: S.stepper.next });

  it("draws the flags under the registers, and outlines the ones the last instruction changed", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "stepper", {
      program: NEGS,
      call: { entry: "negate_flags", args: [0x80000000] },
      registers: [0],
      flags: true,
    });
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "0",
      "0",
      "0",
      "0",
    ]);
    await user.click(next());
    // negs of 0x80000000 gives 0x80000000, N 1 and V 1; C is 0 as before, so only N and V changed.
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "1",
      "0",
      "0",
      "1",
    ]);
    expect(
      [...container.querySelectorAll(".al-flag[data-changed='true']")].map((e) =>
        e.getAttribute("data-flag"),
      ),
    ).toEqual(["n", "v"]);
    expect(reg(container)).toBe("w0");
  });

  it("keeps the flags after add as they were: all four 0 after adds then add", async () => {
    const user = userEvent.setup();
    const { container } = figure(StepperFigure, "stepper", {
      program: SUM_FLAGS,
      call: { entry: "sum_flags", args: [0x7fffffff, 1] },
      registers: [0, 1, 2],
      flags: true,
    });
    await user.click(next());
    await user.click(next());
    expect(within(container).getByRole("status")).toHaveTextContent("Ran add w0, w0, w1.");
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent(
      "2147483648",
    );
    expect(["n", "z", "c", "v"].map((f) => flag(container, f).dataset["value"])).toEqual([
      "0",
      "0",
      "0",
      "0",
    ]);
    expect(container.querySelector(".al-flag[data-changed='true']")).toBeNull();
  });

  it("draws no flags unless it is asked to", () => {
    const { container } = figure(StepperFigure, "stepper", {
      program: NEGS,
      call: { entry: "negate_flags", args: [1] },
      registers: [0],
    });
    expect(container.querySelector(".al-flags")).toBeNull();
  });
});

describe("a listing with no C", () => {
  it("draws the instructions alone, with no C pane and no C line column", () => {
    const { container } = figure(StepperFigure, "stepper", {
      program: PLUS,
      call: { entry: "plus", args: [1, 2] },
      registers: [0],
    });
    expect(container.querySelector(".al-listing")).toHaveAttribute("data-c", "none");
    expect(container.querySelector(".al-c")).toBeNull();
    expect(container.querySelector(".al-ctag")).toBeNull();
  });
});

describe("an answer that is chosen", () => {
  const challenge = Challenge.parse({
    id: "pick",
    title: "Pick",
    task: "Pick.",
    gradedDirection: "answer",
    fields: [
      {
        id: "a",
        label: "`N` for the first",
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
      cases: [{ label: "c", given: { entry: "plus", w0: 1, w1: 1 }, expect: { a: "n" } }],
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: { answers: { a: "0" } },
  });

  it("is a row of radio buttons, none chosen at first, and the choice is the field's answer", async () => {
    const user = userEvent.setup();
    let artifact = {};
    const { container, rerender } = render(
      <AnswerEditor
        lesson={{} as Lesson}
        challenge={challenge}
        artifact={artifact}
        onChange={(a) => (artifact = a)}
      />,
    );
    const radios = within(container).getAllByRole("radio");
    expect(radios.map((r) => (r as HTMLInputElement).checked)).toEqual([false, false]);
    await user.click(radios[1]!);
    expect(artifact).toEqual({ answers: { a: "1" } });
    rerender(
      <AnswerEditor
        lesson={{} as Lesson}
        challenge={challenge}
        artifact={artifact}
        onChange={(a) => (artifact = a)}
      />,
    );
    expect((within(container).getAllByRole("radio")[1] as HTMLInputElement).checked).toBe(true);
    expect(container.querySelector("legend code")).toHaveTextContent("N");
  });
});
