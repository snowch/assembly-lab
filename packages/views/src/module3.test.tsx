// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 3's figures, rendered: the warning word, the function run on a word of the learner's own,
// the shift, the prediction checked by running the model, the stepper that draws every register as
// bits, the two listings side by side; and the assembly editor's number pad with a sign, which the
// mask in `and w0, w0, -113` needs. Every value on a row of bits is the model's.

import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Artifact, type Lesson } from "@platform/lesson-schema";

import { LESSONS } from "@al/content";

import { AnswerEditor } from "./AnswerEditor";
import { AssemblyEditor } from "./AssemblyEditor";
import { grade } from "./grader";
import { BitOpsFigure } from "./interactives/BitOpsFigure";
import { ListingCompareFigure } from "./interactives/ListingCompareFigure";
import { ProbePrediction } from "./interactives/ProbePrediction";
import { ShiftFigure } from "./interactives/ShiftFigure";
import { WarningWordFigure } from "./interactives/WarningWordFigure";
import { WordStepperFigure } from "./interactives/WordStepperFigure";
import { VIEW_STRINGS as S } from "./strings";

const recorded = (c: string, label: string, ...instructions: string[]) => ({
  c,
  listing: [`${label}:`, ...instructions.map((i) => `  ${i} C1`)].join("\n"),
});
const CLEAR_DOOR = recorded(
  "unsigned clear_door(unsigned w) { return w & ~DOOR_OPEN; }",
  "clear_door",
  "and w0, w0, -5",
  "ret",
);
const GEAR_OF = recorded(
  "unsigned gear_of(unsigned w) { return (w >> 4) & 7; }",
  "gear_of",
  "ubfx x0, x0, 4, 3",
  "ret",
);
const SET_GEAR = recorded(
  "unsigned set_gear(unsigned w, unsigned g) { return (w & ~(7u << 4)) | ((g & 7) << 4); }",
  "set_gear",
  "bfi w0, w1, 4, 3",
  "ret",
);
const WARN_FUEL = recorded(
  "unsigned warn_fuel(unsigned w) { return w | FUEL_LOW; }",
  "warn_fuel",
  "orr w0, w0, 1",
  "ret",
);
const HALVE_GRADIENT = recorded(
  "int halve_gradient(int g) { return g >> 1; }",
  "halve_gradient",
  "asr w0, w0, 1",
  "ret",
);
const HALVE_COUNT = recorded(
  "unsigned halve_count(unsigned n) { return n >> 1; }",
  "halve_count",
  "lsr w0, w0, 1",
  "ret",
);
const KEY = [
  { from: 0, to: 0, label: "fuel low" },
  { from: 1, to: 1, label: "service due" },
  { from: 2, to: 2, label: "door open" },
  { from: 3, to: 3, label: "lights on" },
  { from: 4, to: 6, label: "gear" },
];

function figure(
  View: typeof WarningWordFigure,
  id: string,
  kind: string,
  props: Record<string, unknown>,
  store = new LessonStore(memoryStorage(), "assembly-lab", "test"),
) {
  const interactive = Interactive.parse({ id, kind, timeModel: "steps", caption: "c", props });
  const view = render(<View lesson={{} as Lesson} interactive={interactive} store={store} />);
  return { ...view, store };
}

/** The 32 bits of a row, highest first, as a string. */
const bits = (container: HTMLElement, row: string) =>
  [...container.querySelectorAll(`[data-row="${row}"] .al-bit`)].map((b) => b.textContent).join("");
/** The bit numbers a mark is on in a row. */
const marked = (container: HTMLElement, row: string, mark: string) =>
  [...container.querySelectorAll(`[data-row="${row}"] .al-bit[data-${mark}="true"]`)]
    .map((b) => Number(b.getAttribute("data-bit")))
    .sort((a, b) => a - b);
const pad32 = (n: number) => (n >>> 0).toString(2).padStart(32, "0");
const keyRow = (container: HTMLElement, key: string) =>
  [...(container.querySelector(`[data-key="${key}"]`)?.querySelectorAll("td") ?? [])].map(
    (td) => td.textContent,
  );

describe("the warning word", () => {
  const props = { program: GEAR_OF, call: { entry: "gear_of", args: [0x35] }, entries: KEY };

  it("draws the word the call starts with as 32 bits, and a key that reads each labelled bit from it", () => {
    const { container } = figure(WarningWordFigure, "w", "warning-word", props);
    expect(bits(container, "word")).toBe(pad32(0x35));
    expect(container.querySelectorAll(".al-bit")).toHaveLength(32);
    expect(container.querySelector(".al-reg-value")).toHaveTextContent("0x35 (53)");
    expect(keyRow(container, "0-0")).toEqual(["fuel low", "1"]);
    expect(keyRow(container, "1-1")).toEqual(["service due", "0"]);
    expect(keyRow(container, "2-2")).toEqual(["door open", "1"]);
    expect(keyRow(container, "3-3")).toEqual(["lights on", "0"]);
    expect(keyRow(container, "4-6")).toEqual(["gear", "3"]);
  });

  it("numbers the groups of eight above the bits, for counting to a bit", () => {
    const { container } = figure(WarningWordFigure, "w", "warning-word", props);
    expect(container.querySelector(".al-ruler")).toHaveTextContent("3124231615870");
  });

  it("says what is wrong with props that do not fit", () => {
    const { container } = figure(WarningWordFigure, "w", "warning-word", { program: 1 });
    expect(container.querySelector(".interactive-problem")).toHaveTextContent(/warning-word \(w\)/);
  });
});

describe("the bit figure", () => {
  const functions = [
    { entry: "warn_fuel", program: WARN_FUEL, returns: "word" },
    { entry: "clear_door", program: CLEAR_DOOR, returns: "word" },
    { entry: "gear_of", program: GEAR_OF, returns: "number" },
    { entry: "set_gear", program: SET_GEAR, returns: "word", second: true },
  ];
  const props = { functions, start: "clear_door", word: 0xf, secondValue: 5, entries: KEY };
  const chip = (name: string) => screen.getByRole("button", { name });

  it("starts on the function it is told to, runs it on the word, and draws the word, the mask and the answer", () => {
    const { container } = figure(BitOpsFigure, "b", "bit-ops", props);
    expect(chip("clear_door")).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".al-code-ins")).toHaveTextContent("and w0, w0, -5");
    expect(container.querySelector(".al-code-c")).toHaveTextContent("clear_door(unsigned w)");
    expect(bits(container, "word")).toBe(pad32(0xf));
    expect(bits(container, "mask")).toBe(pad32(-5));
    expect(bits(container, "result")).toBe(pad32(0xb));
    expect(container.querySelector('[data-row="mask"] .al-reg-value')).toHaveTextContent(
      "0xfffffffb (-5)",
    );
    expect(marked(container, "result", "changed")).toEqual([2]);
    expect(screen.getByRole("status")).toHaveTextContent("w0 holds 0xb, which is 11.");
    expect(screen.getByRole("status")).toHaveTextContent("Bits that changed: 2.");
    // The key reads the labelled bits before and after.
    expect(keyRow(container, "2-2")).toEqual(["door open", "1", "0"]);
    expect(keyRow(container, "0-0")).toEqual(["fuel low", "1", "1"]);
  });

  it("runs the function on a word the learner types, in hexadecimal or decimal", async () => {
    const user = userEvent.setup();
    const { container } = figure(BitOpsFigure, "b", "bit-ops", props);
    const input = screen.getByLabelText(S.bitOps.inputLabel("w0"));
    await user.clear(input);
    await user.type(input, "0xffffffff");
    expect(bits(container, "result")).toBe(pad32(0xfffffffb));
    await user.clear(input);
    await user.type(input, "-1");
    expect(bits(container, "result")).toBe(pad32(0xfffffffb));
    await user.clear(input);
    await user.type(input, "0");
    expect(marked(container, "result", "changed")).toEqual([]);
    expect(screen.getByRole("status")).toHaveTextContent(S.bitOps.unchanged);
  });

  it("keeps the last word it could read, and says so, when the learner types something else", async () => {
    const user = userEvent.setup();
    const { container } = figure(BitOpsFigure, "b", "bit-ops", props);
    const input = screen.getByLabelText(S.bitOps.inputLabel("w0"));
    await user.clear(input);
    await user.type(input, "banana");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(S.bitOps.inputProblem)).toBeInTheDocument();
    // Nothing the learner typed reached the model; the figure still shows a run, of the starting word.
    expect(bits(container, "word")).toBe(pad32(0xf));
  });

  it("underlines the field of ubfx in the word, and shows the gear at the bottom of the answer", async () => {
    const user = userEvent.setup();
    const { container } = figure(BitOpsFigure, "b", "bit-ops", props);
    await user.click(chip("gear_of"));
    const input = screen.getByLabelText(S.bitOps.inputLabel("w0"));
    await user.clear(input);
    await user.type(input, "0x35");
    expect(marked(container, "word", "field")).toEqual([4, 5, 6]);
    expect(marked(container, "result", "field")).toEqual([0, 1, 2]);
    expect(bits(container, "result")).toBe(pad32(3));
    // A result that is a plain number has no key to the warning word.
    expect(container.querySelector(".al-key")).toBeNull();
    expect(container.querySelector('[data-row="mask"]')).toBeNull();
  });

  it("takes a second value for bfi, and puts its low 3 bits into the field", async () => {
    const user = userEvent.setup();
    const { container } = figure(BitOpsFigure, "b", "bit-ops", props);
    await user.click(chip("set_gear"));
    const word = screen.getByLabelText(S.bitOps.inputLabel("w0"));
    await user.clear(word);
    await user.type(word, "0x35");
    expect(bits(container, "second")).toBe(pad32(5));
    expect(bits(container, "result")).toBe(pad32(0x55));
    expect(marked(container, "second", "field")).toEqual([0, 1, 2]);
    expect(marked(container, "result", "field")).toEqual([4, 5, 6]);
    expect(marked(container, "result", "changed")).toEqual([5, 6]);
    expect(keyRow(container, "4-6")).toEqual(["gear", "3", "5"]);
    const second = screen.getByLabelText(S.bitOps.inputLabel("w1"));
    await user.clear(second);
    await user.type(second, "13");
    // Only the low 3 bits of the second value land.
    expect(bits(container, "result")).toBe(pad32(0x55));
  });

  it("stays shut until the prediction before it is checked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure(BitOpsFigure, "b", "bit-ops", { ...props, after: "p" }, store);
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelectorAll(".al-bit")).toHaveLength(0);
  });
});

describe("the shift figure", () => {
  const props = { ops: ["lsl", "lsr", "asr"], amounts: [1, 2, 3, 4, 8], word: -7 };
  const chip = (name: string, group: string) =>
    within(screen.getByRole("group", { name: group })).getByRole("button", { name });

  it("shows -7 before and after the first shift, the bits that fell off, and what filled the gap", () => {
    const { container } = figure(ShiftFigure, "s", "shift", props);
    expect(container.querySelector("[data-figure]")).toHaveAttribute("data-op", "lsl");
    expect(bits(container, "before")).toBe(pad32(0xfffffff9));
    expect(bits(container, "after")).toBe(pad32(0xfffffff2));
    expect(marked(container, "before", "lost")).toEqual([31]);
    expect(marked(container, "after", "fill")).toEqual([0]);
    expect(container.querySelector('[data-part="fell"]')).toHaveTextContent("Fell off: 1");
    expect(container.querySelector('[data-part="filled"]')).toHaveTextContent("Filled with: 0");
  });

  it("fills the top with zeros for lsr and with copies of the old top bit for asr", async () => {
    const user = userEvent.setup();
    const { container } = figure(ShiftFigure, "s", "shift", props);
    await user.click(chip("lsr", S.shift.instruction));
    expect(bits(container, "after")).toBe(pad32(0x7ffffffc));
    expect(marked(container, "before", "lost")).toEqual([0]);
    expect(marked(container, "after", "fill")).toEqual([31]);
    expect(container.querySelector('[data-part="filled"]')).toHaveTextContent("Filled with: 0");
    expect(screen.getByRole("status")).toHaveTextContent(
      "w0 holds 0x7ffffffc: 2147483644 as unsigned, 2147483644 as signed.",
    );
    await user.click(chip("asr", S.shift.instruction));
    expect(bits(container, "after")).toBe(pad32(0xfffffffc));
    expect(container.querySelector('[data-part="filled"]')).toHaveTextContent("Filled with: 1");
    expect(screen.getByRole("status")).toHaveTextContent("-4 as signed");
  });

  it("shifts by the amount chosen: the top n bits are filled, and n bits fall off", async () => {
    const user = userEvent.setup();
    const { container } = figure(ShiftFigure, "s", "shift", props);
    await user.click(chip("asr", S.shift.instruction));
    await user.click(chip("4", S.shift.by));
    expect(bits(container, "after")).toBe(pad32(0xffffffff));
    expect(marked(container, "after", "fill")).toEqual([28, 29, 30, 31]);
    expect(marked(container, "before", "lost")).toEqual([0, 1, 2, 3]);
    expect(container.querySelector('[data-part="fell"]')).toHaveTextContent("Fell off: 1001");
    await user.click(chip("lsl", S.shift.instruction));
    await user.click(chip("8", S.shift.by));
    expect(bits(container, "after")).toBe(pad32(0xfffff900));
    expect(chip("8", S.shift.by)).toHaveAttribute("aria-pressed", "true");
  });

  it("shifts a word the learner types", async () => {
    const user = userEvent.setup();
    const { container } = figure(ShiftFigure, "s", "shift", props);
    const input = screen.getByLabelText(S.shift.inputLabel);
    await user.clear(input);
    await user.type(input, "0x35");
    await user.click(chip("lsr", S.shift.instruction));
    expect(bits(container, "after")).toBe(pad32(0x1a));
    await user.clear(input);
    await user.type(input, "zzz");
    expect(screen.getByText(S.shift.inputProblem)).toBeInTheDocument();
  });

  it("stays shut until the prediction before it is checked", () => {
    const { container } = figure(ShiftFigure, "s", "shift", { ...props, after: "p" });
    expect(container.querySelector(".al-locked")).not.toBeNull();
  });
});

describe("the prediction checked by the model", () => {
  const fillProps = {
    question: "**What fills the top bit?**",
    options: [
      { value: "copy", label: "A copy" },
      { value: "zero", label: "A 0" },
      { value: "fell-off", label: "The bit that fell off" },
      { value: "shorter", label: "Nothing" },
    ],
    explain: "It is a copy.",
    program: HALVE_GRADIENT,
    call: { entry: "halve_gradient", args: [-7] },
    measure: { kind: "fill-rule" },
    showStart: true,
  };

  it("shows the word it takes, and nothing of the run, until a choice is checked", () => {
    const { container } = figure(ProbePrediction, "p", "probe-prediction", fillProps);
    expect(bits(container, "start")).toBe(pad32(0xfffffff9));
    expect(container.querySelector(".al-outcome")).toBeNull();
    expect(screen.getByRole("button", { name: S.prediction.commit })).toBeDisabled();
  });

  it("says the choice matches when the model's run fits it, and shows the word before and after", async () => {
    const user = userEvent.setup();
    const { container } = figure(ProbePrediction, "p", "probe-prediction", fillProps);
    await user.click(screen.getByRole("radio", { name: "A copy" }));
    expect(container.querySelector(".al-outcome")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).toHaveTextContent(S.prediction.match);
    expect(container.querySelector(".al-outcome")).toHaveTextContent("copy of the old top bit");
    expect(container.querySelector(".al-outcome")).toHaveTextContent("It is a copy.");
    expect(bits(container, "ran-before")).toBe(pad32(0xfffffff9));
    expect(bits(container, "ran-after")).toBe(pad32(0xfffffffc));
    expect(marked(container, "ran-after", "changed")).toEqual([0, 2]);
  });

  it("says the choice does not match when it does not, and lets the learner choose again", async () => {
    const user = userEvent.setup();
    const { container } = figure(ProbePrediction, "p", "probe-prediction", fillProps);
    await user.click(screen.getByRole("radio", { name: "A 0" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).toHaveTextContent(S.prediction.noMatch);
    await user.click(screen.getByRole("radio", { name: "A copy" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).not.toBeNull();
  });

  it("opens the stepper that waits for it, by id", async () => {
    const user = userEvent.setup();
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    figure(ProbePrediction, "p", "probe-prediction", fillProps, store);
    const stepper = figure(
      WordStepperFigure,
      "s",
      "word-stepper",
      {
        program: HALVE_COUNT,
        call: { entry: "halve_count", args: [-7] },
        registers: [0],
        after: "p",
      },
      store,
    );
    expect(stepper.container.querySelector(".al-locked")).not.toBeNull();
    await user.click(screen.getByRole("radio", { name: "A 0" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    stepper.unmount();
    const opened = figure(
      WordStepperFigure,
      "s",
      "word-stepper",
      {
        program: HALVE_COUNT,
        call: { entry: "halve_count", args: [-7] },
        registers: [0],
        after: "p",
      },
      store,
    );
    expect(opened.container.querySelector(".al-locked")).toBeNull();
  });
});

describe("the stepper that draws registers as bits", () => {
  const DIV2 = recorded(
    "int div2(int g) { return g / 2; }",
    "div2",
    "add w0, w0, w0, lsr 31",
    "asr w0, w0, 1",
    "ret",
  );
  const props = {
    program: DIV2,
    call: { entry: "div2", args: [-7] },
    registers: [0],
    reading: "signed",
  };
  const next = () => screen.getByRole("button", { name: S.stepper.next });

  it("shows w0 as bits with its hexadecimal and signed values after each Next: -7, -6, -3", async () => {
    const user = userEvent.setup();
    const { container } = figure(WordStepperFigure, "s", "word-stepper", props);
    const value = () => container.querySelector('[data-register="w0"] .al-reg-value')?.textContent;
    expect(value()).toBe("0xfffffff9 (-7)");
    await user.click(next());
    expect(value()).toBe("0xfffffffa (-6)");
    expect(bits(container, "w0")).toBe(pad32(-6));
    expect(container.querySelector('[data-register="w0"]')).toHaveAttribute("data-changed", "true");
    await user.click(next());
    expect(value()).toBe("0xfffffffd (-3)");
    await user.click(next());
    expect(next()).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(S.stepper.ended);
  });

  it("draws the C beside the instructions, or the instructions alone", () => {
    const withC = figure(WordStepperFigure, "s", "word-stepper", props);
    expect(withC.container.querySelector(".al-c")).not.toBeNull();
    withC.unmount();
    const without = figure(WordStepperFigure, "s", "word-stepper", { ...props, showC: false });
    expect(without.container.querySelector(".al-c")).toBeNull();
    expect(without.container.querySelectorAll(".al-insn")).toHaveLength(3);
  });
});

describe("the two listings side by side", () => {
  it("draw each C and its instructions, and mark the instruction that differs", () => {
    const { container } = figure(ListingCompareFigure, "c", "listing-compare", {
      sides: [
        { title: "int", program: HALVE_GRADIENT },
        { title: "unsigned", program: HALVE_COUNT },
      ],
    });
    expect(
      [...container.querySelectorAll(".al-compare-side .al-pane-head")].map((h) => h.textContent),
    ).toEqual(["int", "unsigned"]);
    const insns = (side: string) =>
      [...container.querySelectorAll(`[data-side="${side}"] .al-insn`)].map((r) => [
        r.querySelector(".al-text")?.textContent,
        r.getAttribute("data-differs"),
      ]);
    expect(insns("int")).toEqual([
      ["asr w0, w0, 1", "true"],
      ["ret", "false"],
    ]);
    expect(insns("unsigned")).toEqual([
      ["lsr w0, w0, 1", "true"],
      ["ret", "false"],
    ]);
    expect(container.querySelector('[data-side="int"] .al-compare-c')).toHaveTextContent(
      "halve_gradient",
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});

describe("the editor's number pad, for a mask", () => {
  const challenge = LESSONS.find((l) => l.id === "masks")!.challenges.find(
    (c) => c.id === "write-set-gear",
  )!;

  function Harness({ start, seen }: { start: Artifact; seen: (text: string | undefined) => void }) {
    const [artifact, setArtifact] = useState<Artifact>(start);
    return (
      <AssemblyEditor
        lesson={{} as Lesson}
        challenge={challenge}
        artifact={artifact}
        onChange={(next) => {
          setArtifact(next);
          seen(next.text);
        }}
      />
    );
  }
  const group = (name: string) => screen.getByRole("group", { name });

  beforeEach(() => {
    localStorage.clear();
  });

  it("builds set_gear from chips and the pad alone, a sign key included, and the grader passes it", async () => {
    const user = userEvent.setup();
    let latest: string | undefined;
    render(<Harness start={{ text: "ret" }} seen={(t) => (latest = t)} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    const keys = () => within(screen.getByRole("group", { name: S.editor.numberPad }));
    const press = async (digits: string) => {
      for (const d of digits) await user.click(keys().getByRole("button", { name: d }));
    };
    const instruction = (name: string) =>
      user.click(within(group(S.editor.instruction)).getByRole("button", { name }));
    const operand = (n: number, name: string) =>
      user.click(within(group(S.editor.operand(n))).getByRole("button", { name }));
    const number = (n: number, digits: string) =>
      user
        .click(within(group(S.editor.operand(n))).getByRole("button", { name: S.editor.number }))
        .then(() => press(digits));

    // Line 1: the starting `ret` becomes `and w1, w1, 7`.
    await user.click(screen.getByRole("button", { name: /ret/ }));
    await instruction("and");
    await operand(1, "w1");
    await operand(2, "w1");
    await number(3, "7");
    expect(latest).toBe("and w1, w1, #7");
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await instruction("lsl");
    await operand(1, "w1");
    await operand(2, "w1");
    await number(3, "4");
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await instruction("and");
    await operand(1, "w0");
    await operand(2, "w0");
    await number(3, "113");
    // The sign key makes the mask negative: -113 is every bit set except bits 4 to 6.
    await user.click(keys().getByRole("button", { name: S.tap.sign }));
    expect(latest).toBe("and w1, w1, #7\nlsl w1, w1, #4\nand w0, w0, #-113");
    expect(screen.getByText(S.editor.numberShown("-113"))).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await instruction("orr");
    await operand(1, "w0");
    await operand(2, "w0");
    await operand(3, "w1");
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await instruction("ret");
    expect(latest).toBe("and w1, w1, #7\nlsl w1, w1, #4\nand w0, w0, #-113\norr w0, w0, w1\nret");
    expect(grade(challenge, { text: latest }).passed).toBe(true);
  });

  it("offers the sign key for a mask and not for a shift's amount or an add's constant", async () => {
    const user = userEvent.setup();
    render(<Harness start={{ text: "lsl w1, w1, 4\nand w0, w0, 7" }} seen={() => {}} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: /lsl w1, w1, 4/ }));
    expect(screen.queryByRole("button", { name: S.tap.sign })).toBeNull();
    await user.click(screen.getByRole("button", { name: S.editor.done }));
    await user.click(screen.getByRole("button", { name: /and w0, w0, 7/ }));
    expect(screen.getByRole("button", { name: S.tap.sign })).toBeInTheDocument();
  });

  it("changes the sign back, and takes the sign off with the last digit", async () => {
    const user = userEvent.setup();
    let latest: string | undefined;
    render(<Harness start={{ text: "and w0, w0, #-5" }} seen={(t) => (latest = t)} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: /and w0, w0, #-5/ }));
    await user.click(screen.getByRole("button", { name: S.tap.sign }));
    expect(latest).toBe("and w0, w0, #5");
    await user.click(screen.getByRole("button", { name: S.tap.sign }));
    expect(latest).toBe("and w0, w0, #-5");
    await user.click(screen.getByRole("button", { name: S.editor.deleteDigit }));
    expect(latest).toBe("and w0, w0");
  });
});

describe("the answer boxes", () => {
  const challengeOf = (lessonId: string, id: string) =>
    LESSONS.find((l) => l.id === lessonId)!.challenges.find((c) => c.id === id)!;
  const modeOf = (c: ReturnType<typeof challengeOf>, field: string) => {
    const { container } = render(
      <AnswerEditor lesson={{} as Lesson} challenge={c} artifact={{}} onChange={() => {}} />,
    );
    const mode = container
      .querySelector(`[data-field="${field}"] input`)
      ?.getAttribute("inputmode");
    return { mode, container };
  };

  it("give a field that takes a negative number the full keyboard, and a plain count the number keypad", () => {
    expect(modeOf(challengeOf("shifts", "compare-shifts"), "asr_neg").mode).toBe("text");
    expect(modeOf(challengeOf("meet-the-machine", "trace-the-call"), "w0").mode).toBe("numeric");
  });

  it("show no program for a challenge that keeps its program to itself", () => {
    const { container } = modeOf(challengeOf("masks", "trace-three-results"), "after_orr");
    expect(container.querySelector(".al-listing")).toBeNull();
  });
});
