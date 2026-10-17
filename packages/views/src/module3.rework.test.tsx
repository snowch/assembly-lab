// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 3's figures after the rework of 17 October 2026: the warning word with its bits numbered,
// labelled and bracketed; the field read out of 0x35; the bit operations with their rule, their
// aligned rows, their marked columns and the column read out in one line; the mask of the first
// prediction as -5 and as its low eight bits; the learner's own instructions stepped; what leaving
// out the clear does, bit by bit; the learner's code beside GCC's `bfi`; the shift with its
// direction, its lost and filled bits; and the division correction before and after each step.
// Every value on a row is the model's: each test runs the machine itself and compares.

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TEXT_BASE, assemble, run, stateAfter } from "@al/machine";
import { LESSONS } from "@al/content";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import {
  CLEAR_DOOR,
  DIV2,
  GEAR_OF,
  HALVE_GRADIENT,
  SET_GEAR,
  SET_GEAR_REFERENCE_TEXT,
  SET_GEAR_WITHOUT_CLEAR,
  TOGGLE_LIGHTS,
  WARN_FUEL,
} from "../../../content/lessons/logic-shifts-masks.listings";

import { BfiCompare } from "./interactives/BfiCompare";
import { BitOpsFigure } from "./interactives/BitOpsFigure";
import { ClearCompare } from "./interactives/ClearCompare";
import { FieldReadingFigure } from "./interactives/FieldReadingFigure";
import { ProbePrediction } from "./interactives/ProbePrediction";
import { ShiftFigure } from "./interactives/ShiftFigure";
import { SolutionStepper, derivedFrom, withoutComments } from "./interactives/SolutionStepper";
import { WarningWordFigure } from "./interactives/WarningWordFigure";
import { WordStepperFigure, operandOf } from "./interactives/WordStepperFigure";
import { VIEW_STRINGS as S } from "./strings";
import { traceOf, viewAt, wValue } from "./trace";

vi.setConfig({ testTimeout: 30_000 });

const masks = LESSONS.find((l) => l.id === "masks") as Lesson;
const SET = "write-set-gear";
const CALLS: readonly (readonly [number, number])[] = [
  [0x35, 5],
  [0, 7],
  [0xffffffff, 0],
  [0x1234, 13],
];

function mount(
  View: typeof WarningWordFigure,
  id: string,
  kind: string,
  props: Record<string, unknown>,
  store = new LessonStore(memoryStorage(), "assembly-lab", "masks"),
) {
  const interactive = Interactive.parse({ id, kind, timeModel: "steps", caption: "c", props });
  const view = render(<View lesson={masks} interactive={interactive} store={store} />);
  return { ...view, store };
}

/** The 32 bits of a row of bits, highest first. */
const bits = (c: HTMLElement, row: string) =>
  [...c.querySelectorAll(`[data-row="${row}"] .al-bit`)].map((b) => b.textContent).join("");
/** The bit numbers a mark is on in a row of 32 bits. */
const marked = (c: HTMLElement, row: string, mark: string) =>
  [...c.querySelectorAll(`[data-row="${row}"] .al-bit[data-${mark}="true"]`)]
    .map((b) => Number(b.getAttribute("data-bit")))
    .sort((a, b) => a - b);
/** The bits of a row of big cells, highest first (the low byte unless the row says otherwise). */
const cells = (c: HTMLElement, row: string) =>
  [...c.querySelectorAll(`[data-row="${row}"] .al-cell-bit`)].map((b) => b.textContent).join("");
/** The bit numbers a mark is on in a row of big cells. */
const cellMarked = (c: HTMLElement, row: string, mark: string) =>
  [...c.querySelectorAll(`[data-row="${row}"] .al-cell[data-${mark}="true"]`)]
    .map((b) => Number(b.getAttribute("data-bit")))
    .sort((a, b) => a - b);
/** The bit numbers that carry a tag in a row of big cells. */
const tagged = (c: HTMLElement, row: string, tag: string) =>
  [...c.querySelectorAll(`[data-row="${row}"] .al-cell[data-tag="${tag}"]`)]
    .map((b) => Number(b.getAttribute("data-bit")))
    .sort((a, b) => a - b);
const pad = (n: number, width = 32) => (n >>> 0).toString(2).padStart(width, "0");
const low8 = (n: number) => pad(n & 0xff, 8);
const valueOf = (c: HTMLElement, row: string) =>
  Number(c.querySelector(`[data-row="${row}"]`)?.getAttribute("data-value"));

/** Assemble text and run it as a call, the way the grader does: the independent check. */
function ranText(text: string, args: readonly number[]) {
  const { program, errors } = assemble(text);
  if (!program) throw new Error(errors.map((e) => e.key).join(", "));
  return run(program, {
    entry: TEXT_BASE,
    args: args.map((value) => ({ value: BigInt(value), width: 32 })),
  });
}

// ---------------------------------------------------------------------------------------------

describe("the warning word, reworked", () => {
  const KEY = [
    { from: 0, to: 0, label: "fuel low" },
    { from: 1, to: 1, label: "service due" },
    { from: 2, to: 2, label: "door open" },
    { from: 3, to: 3, label: "lights on" },
    { from: 4, to: 6, label: "gear" },
  ];
  const props = { program: GEAR_OF, call: { entry: "gear_of", args: [0x35] }, entries: KEY };

  it("draws bits 7 to 31 as unused in this example, and says so, with the numbers from the entries", () => {
    const { container } = mount(WarningWordFigure, "w", "warning-word", props);
    expect(marked(container, "word", "unused")).toEqual(
      Array.from({ length: 25 }, (_, i) => i + 7),
    );
    expect(container.querySelector(".al-unused-note")).toHaveTextContent(S.warning.unused(7, 31));
    expect(container.querySelector(".al-unused-note")).toHaveTextContent(
      "Bits 7 to 31 are not used in this example.",
    );
    // The 32 bits are still there, in four groups of eight.
    expect(container.querySelectorAll(".al-bit")).toHaveLength(32);
  });

  it("numbers and labels bits 0 to 6: four warnings as separate on or off bits, and the gear as one bracketed field with the value gear_of returned", () => {
    const { container } = mount(WarningWordFigure, "w", "warning-word", props);
    const use = container.querySelector(".al-use") as HTMLElement;
    const numbers = [...use.querySelectorAll(".al-cell-n")].map((n) => n.textContent);
    expect(numbers).toEqual(["6", "5", "4", "3", "2", "1", "0"]);
    expect([...use.querySelectorAll(".al-cell-bit")].map((b) => b.textContent).join("")).toBe(
      pad(0x35, 7),
    );
    const label = (k: string) => use.querySelector(`[data-entry="${k}"]`);
    expect(label("0-0")).toHaveTextContent("fuel lowon");
    expect(label("1-1")).toHaveTextContent("service dueoff");
    expect(label("2-2")).toHaveTextContent("door openon");
    expect(label("3-3")).toHaveTextContent("lights onoff");
    expect(label("4-6")).toHaveTextContent("gear3");
    expect(label("4-6")).toHaveAttribute("data-kind", "field");
    expect(label("0-0")).toHaveAttribute("data-kind", "bit");
    // The gear is read by the model: gear_of(0x35) leaves 3 in w0.
    const trace = traceOf(GEAR_OF, { entry: "gear_of", args: [0x35] });
    expect(String(wValue(trace.result.final, 0))).toBe(
      label("4-6")?.querySelector(".al-use-state")?.textContent,
    );
    // Nothing is run for the labels beyond the one call; the key table is still there.
    expect(container.querySelector('[data-key="4-6"]')).not.toBeNull();
  });

  it("marks a named warning's bit in both drawings when it is focused, and the gear's three bits for the field", async () => {
    const user = userEvent.setup();
    const { container } = mount(WarningWordFigure, "w", "warning-word", props);
    expect(marked(container, "word", "picked")).toEqual([]);
    const door = container.querySelector('[data-entry="2-2"]') as HTMLElement;
    act(() => door.focus());
    expect(marked(container, "word", "picked")).toEqual([2]);
    expect(
      [...container.querySelectorAll(".al-use .al-cell[data-picked='true']")].map((c) =>
        Number(c.getAttribute("data-bit")),
      ),
    ).toEqual([2]);
    expect(door).toHaveAttribute("aria-pressed", "true");
    await user.click(container.querySelector('[data-entry="4-6"]') as HTMLElement);
    expect(marked(container, "word", "picked")).toEqual([4, 5, 6]);
    // Moving away from the label takes the mark off.
    fireEvent.blur(container.querySelector('[data-entry="4-6"]') as HTMLElement);
    expect(marked(container, "word", "picked")).toEqual([]);
  });

  it("makes each label a button, so the keyboard and a thumb can reach it", () => {
    const { container } = mount(WarningWordFigure, "w", "warning-word", props);
    const labels = [...container.querySelectorAll(".al-use-label")];
    expect(labels).toHaveLength(5);
    for (const l of labels) expect(l.tagName).toBe("BUTTON");
  });
});

// ---------------------------------------------------------------------------------------------

describe("the field read out of 0x35", () => {
  const props = { program: GEAR_OF, call: { entry: "gear_of", args: [0x35] } };

  it("draws the low byte of the word with bits 6 to 4 underlined and numbered, the same byte after the run, and the sentence", () => {
    const { container } = mount(FieldReadingFigure, "f", "field-reading", props);
    expect(cells(container, "word")).toBe(low8(0x35));
    expect(cellMarked(container, "word", "field")).toEqual([4, 5, 6]);
    expect([...container.querySelectorAll(".al-cell-n")].map((n) => n.textContent)).toEqual([
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
      "1",
      "0",
    ]);
    // After the run, the selected bits are at the bottom: 011 is 3.
    const trace = traceOf(GEAR_OF, { entry: "gear_of", args: [0x35] });
    const gear = wValue(trace.result.final, 0);
    expect(gear).toBe(3);
    expect(cells(container, "result")).toBe(low8(gear));
    expect(cellMarked(container, "result", "field")).toEqual([0, 1, 2]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Bits 6 to 4 are 011. gear_of(0x35) gives 3.",
    );
  });
});

// ---------------------------------------------------------------------------------------------

describe("the bit operations, reworked", () => {
  const FUNCTIONS = [
    { entry: "warn_fuel", program: WARN_FUEL, returns: "word" },
    { entry: "clear_door", program: CLEAR_DOOR, returns: "word" },
    { entry: "toggle_lights", program: TOGGLE_LIGHTS, returns: "word" },
    { entry: "gear_of", program: GEAR_OF, returns: "number" },
  ];
  const KEY = [
    { from: 0, to: 0, label: "fuel low" },
    { from: 4, to: 6, label: "gear" },
  ];
  const props = { functions: FUNCTIONS, start: "clear_door", word: 0xf, entries: KEY };
  const chip = (name: string) => screen.getByRole("button", { name });

  it("states a one-line rule for the chosen operation: and, orr and eor", async () => {
    const user = userEvent.setup();
    const { container } = mount(BitOpsFigure, "b", "bit-ops", props);
    expect(container.querySelector(".al-rule")).toHaveTextContent(S.bitOps.rule.and);
    await user.click(chip("warn_fuel"));
    expect(container.querySelector(".al-rule")).toHaveTextContent(S.bitOps.rule.orr);
    await user.click(chip("toggle_lights"));
    expect(container.querySelector(".al-rule")).toHaveTextContent(S.bitOps.rule.eor);
    // The rules say what the mask bit does: a 0 clears, a 1 sets, a 1 flips.
    expect(S.bitOps.rule.and).toMatch(/0 clears/);
    expect(S.bitOps.rule.orr).toMatch(/1 sets/);
    expect(S.bitOps.rule.eor).toMatch(/1 flips/);
    // A function that is not a logic operation has no rule.
    await user.click(chip("gear_of"));
    expect(container.querySelector(".al-rule")).toBeNull();
  });

  it("draws the word, the mask and the result as three rows of the same 32 columns", () => {
    const { container } = mount(BitOpsFigure, "b", "bit-ops", props);
    for (const row of ["word", "mask", "result"]) {
      expect(container.querySelectorAll(`[data-row="${row}"] .al-bit`)).toHaveLength(32);
      expect(
        [...container.querySelectorAll(`[data-row="${row}"] .al-bit`)].map((b) =>
          b.getAttribute("data-bit"),
        ),
      ).toEqual(Array.from({ length: 32 }, (_, i) => String(31 - i)));
    }
    expect(bits(container, "word")).toBe(pad(0xf));
    expect(bits(container, "mask")).toBe(pad(0xfffffffb));
    expect(bits(container, "result")).toBe(pad(0xb));
  });

  it("marks the changed bits by shape and by a glyph under them, and leaves the kept bits plain", async () => {
    const user = userEvent.setup();
    const { container } = mount(BitOpsFigure, "b", "bit-ops", props);
    const glyphs = (row: string) =>
      [...container.querySelectorAll(`[data-row="${row}"] .al-mark`)]
        .filter((m) => m.textContent !== "")
        .map((m) => [Number(m.getAttribute("data-bit")), m.textContent]);
    expect(marked(container, "result", "changed")).toEqual([2]);
    expect(glyphs("changed")).toEqual([[2, S.bitOps.changedGlyph]]);
    // The kept bits have neither mark.
    expect(marked(container, "result", "changed")).not.toContain(0);
    await user.click(chip("toggle_lights"));
    expect(glyphs("changed")).toEqual([[3, S.bitOps.changedGlyph]]);
    // A word the instruction leaves alone has no changed bit and no glyph row.
    const input = screen.getByLabelText(S.bitOps.inputLabel("w0"));
    await user.clear(input);
    await user.type(input, "0");
    await user.click(chip("clear_door"));
    expect(marked(container, "result", "changed")).toEqual([]);
    expect(container.querySelector('[data-row="changed"]')).toBeNull();
  });

  it("orr 1 changes only bit 0 when it was 0, and eor 8 flips only bit 3, on the model's own run", async () => {
    const user = userEvent.setup();
    const { container } = mount(BitOpsFigure, "b", "bit-ops", props);
    const input = screen.getByLabelText(S.bitOps.inputLabel("w0"));
    await user.click(chip("warn_fuel"));
    await user.clear(input);
    await user.type(input, "0x34");
    expect(marked(container, "result", "changed")).toEqual([0]);
    await user.clear(input);
    await user.type(input, "0x35");
    expect(marked(container, "result", "changed")).toEqual([]);
    await user.click(chip("toggle_lights"));
    expect(marked(container, "result", "changed")).toEqual([3]);
    expect(bits(container, "result")).toBe(pad(0x35 ^ 8));
  });

  it("shows the input, the mask and the result of a column in one line when it is pressed, and in all three rows", async () => {
    const user = userEvent.setup();
    const { container } = mount(BitOpsFigure, "b", "bit-ops", props);
    const readout = () => container.querySelector('[data-readout="column"]');
    expect(readout()).toHaveTextContent(S.bitOps.pickHint);
    await user.click(container.querySelector('[data-row="mask"] [data-bit="2"]') as HTMLElement);
    expect(readout()).toHaveTextContent("Bit 2: input 1, mask 0, result 0.");
    for (const row of ["word", "mask", "result"])
      expect(marked(container, row, "picked")).toEqual([2]);
    await user.click(container.querySelector('[data-row="word"] [data-bit="5"]') as HTMLElement);
    expect(readout()).toHaveTextContent("Bit 5: input 0, mask 1, result 0.");
    expect(marked(container, "result", "picked")).toEqual([5]);
  });

  it("steps along the bits with two buttons and with the arrow keys of the result row", async () => {
    const user = userEvent.setup();
    const { container } = mount(BitOpsFigure, "b", "bit-ops", props);
    await user.click(chip(S.bitOps.higherBit));
    expect(marked(container, "result", "picked")).toEqual([0]);
    await user.click(chip(S.bitOps.higherBit));
    await user.click(chip(S.bitOps.higherBit));
    expect(container.querySelector('[data-readout="column"]')).toHaveTextContent(
      "Bit 2: input 1, mask 0, result 0.",
    );
    await user.click(chip(S.bitOps.lowerBit));
    expect(marked(container, "result", "picked")).toEqual([1]);
    // The result row is one stop for the keyboard: the picked bit, and the arrows move along.
    const stop = container.querySelector('[data-row="result"] [tabindex="0"]') as HTMLElement;
    expect(stop.getAttribute("data-bit")).toBe("1");
    expect(stop).toHaveAttribute("role", "button");
    fireEvent.keyDown(stop, { key: "ArrowLeft" });
    expect(marked(container, "result", "picked")).toEqual([2]);
    fireEvent.keyDown(
      container.querySelector('[data-row="result"] [tabindex="0"]') as HTMLElement,
      {
        key: "ArrowRight",
      },
    );
    expect(marked(container, "result", "picked")).toEqual([1]);
    // The ends are the ends.
    for (let i = 0; i < 40; i++)
      fireEvent.keyDown(
        container.querySelector('[data-row="result"] [tabindex="0"]') as HTMLElement,
        {
          key: "ArrowRight",
        },
      );
    expect(marked(container, "result", "picked")).toEqual([0]);
  });

  it("reads a column of a function with no mask without a mask in the line", async () => {
    const user = userEvent.setup();
    const { container } = mount(BitOpsFigure, "b", "bit-ops", props);
    await user.click(chip("gear_of"));
    const input = screen.getByLabelText(S.bitOps.inputLabel("w0"));
    await user.clear(input);
    await user.type(input, "0x35");
    await user.click(container.querySelector('[data-row="word"] [data-bit="4"]') as HTMLElement);
    expect(container.querySelector('[data-readout="column"]')).toHaveTextContent(
      "Bit 4: input 1, result 0.",
    );
  });
});

// ---------------------------------------------------------------------------------------------

describe("the mask of the first prediction", () => {
  const props = {
    question: "**Why?**",
    options: [
      { value: "counted-backwards", label: "backwards" },
      { value: "cleared:2", label: "every bit set except bit 2" },
      { value: "subtracts", label: "subtracts" },
      { value: "listing-error", label: "error" },
    ],
    explain: "It is a mask.",
    program: CLEAR_DOOR,
    call: { entry: "clear_door", args: [0xffffffff] },
    measure: { kind: "cleared-bits" },
    maskView: { word: 0xf },
  };

  it("shows nothing of the mask until a choice is checked", () => {
    const { container } = mount(ProbePrediction, "p", "probe-prediction", props);
    expect(container.querySelector(".al-maskview")).toBeNull();
    expect(container.querySelector('[data-view="mask"]')).toBeNull();
  });

  it("after the commit, shows the mask as -5 and 0xfffffffb, the low eight bits of word, mask and result, bit 2 marked in all three, and the full 32 bits one press away", async () => {
    const user = userEvent.setup();
    const { container } = mount(ProbePrediction, "p", "probe-prediction", props);
    await user.click(screen.getByRole("radio", { name: "every bit set except bit 2" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    const view = container.querySelector(".al-maskview") as HTMLElement;
    expect(view.querySelector(".al-maskline")).toHaveTextContent(
      "The mask is -5, which is 0xfffffffb.",
    );
    expect(cells(view, "view-word")).toBe("00001111");
    expect(cells(view, "view-mask")).toBe("11111011");
    expect(cells(view, "view-result")).toBe("00001011");
    // The three rows are what the model ran: clear_door(0xf).
    const trace = traceOf(CLEAR_DOOR, { entry: "clear_door", args: [0xf] });
    expect(valueOf(view, "view-word")).toBe(0xf);
    expect(valueOf(view, "view-result")).toBe(wValue(trace.result.final, 0));
    expect(valueOf(view, "view-mask")).toBe(0xfffffffb);
    for (const row of ["view-word", "view-mask", "view-result"])
      expect(cellMarked(view, row, "picked")).toEqual([2]);
    expect(tagged(view, "view-result", "changed")).toEqual([2]);
    expect(view.querySelector('[data-row="view-word"] .al-cell-n')).toHaveTextContent("7");
    expect(view).toHaveTextContent("Dotted frame: Bit 2, the only bit where the mask has a 0.");
    // The full 32 bits are in a closed part.
    const all = view.querySelector("details.al-all32") as HTMLDetailsElement;
    expect(all.open).toBe(false);
    expect(all.querySelectorAll('[data-row="full-mask"] .al-bit')).toHaveLength(32);
    expect(bits(view, "full-mask")).toBe(pad(0xfffffffb));
    expect(bits(view, "full-result")).toBe(pad(0xb));
    // The first run, on a word with every bit set, is still shown.
    expect(bits(container, "ran-after")).toBe(pad(0xfffffffb));
  });
});

// ---------------------------------------------------------------------------------------------

describe("the learner's own instructions, stepped", () => {
  const SOLUTIONS: Record<string, string> = {
    reference: SET_GEAR_REFERENCE_TEXT,
    // The mask on g after the shift, and the clear first.
    "and after lsl": "and w0, w0, -113\nlsl w1, w1, 4\nand w1, w1, 112\norr w0, w0, w1\nret",
    // Other registers for the pieces; comments and blank lines in the text.
    "other registers":
      "// the gear\nand w2, w1, 7\nlsl w2, w2, 4\n\nand w3, w0, -113 // the word\norr w0, w3, w2\nret",
  };
  const props = { afterRun: SET, intro: "Step through.", field: { from: 4, to: 6 } };
  const next = () => screen.getByRole("button", { name: S.stepper.next });

  function stored(text: string | undefined, attempts = 1) {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "masks");
    if (text !== undefined)
      store.setChallenge(SET, (c) => ({ ...c, artifact: { text }, attempts }));
    return store;
  }

  it("is shut until the challenge has been run: nothing saved, saved but not run, or nothing written", () => {
    for (const store of [
      stored(undefined),
      stored(SET_GEAR_REFERENCE_TEXT, 0),
      stored("  \n", 1),
    ]) {
      const { container, unmount } = mount(SolutionStepper, "s", "solution-stepper", props, store);
      expect(container.querySelector(".al-locked")).toHaveTextContent(S.solution.locked);
      expect(container.querySelector(".al-cellrow")).toBeNull();
      expect(container.textContent).not.toContain("Step through.");
      unmount();
    }
  });

  it("opens once the challenge has been run, with the intro above, the learner's instructions and the arguments of the first call", () => {
    const { container } = mount(
      SolutionStepper,
      "s",
      "solution-stepper",
      props,
      stored(SET_GEAR_REFERENCE_TEXT),
    );
    expect(container.querySelector(".al-locked")).toBeNull();
    expect(container.textContent).toContain("Step through.");
    expect([...container.querySelectorAll(".al-insn .al-text")].map((t) => t.textContent)).toEqual(
      SET_GEAR_REFERENCE_TEXT.split("\n"),
    );
    // The four test calls of the challenge are offered.
    expect([...container.querySelectorAll(".asm-chips .chip")].map((c) => c.textContent)).toEqual([
      "set_gear(0x35, 5)",
      "set_gear(0, 7)",
      "set_gear(0xffffffff, 0)",
      "set_gear(0x1234, 13)",
    ]);
    expect(cells(container, "w0")).toBe(low8(0x35));
    expect(cells(container, "w1")).toBe(low8(5));
  });

  it.each(Object.entries(SOLUTIONS))(
    "%s: after every instruction, for every one of the four calls, the register it wrote is what the machine's own run left",
    async (_name, text) => {
      const user = userEvent.setup();
      const { container } = mount(SolutionStepper, "s", "solution-stepper", props, stored(text));
      for (const [index, [w, g]] of CALLS.entries()) {
        const chips = container.querySelectorAll(".asm-chips .chip");
        await user.click(chips[index] as HTMLElement);
        const direct = ranText(withoutComments(text), [w, g]);
        for (let k = 1; k <= direct.steps.length; k++) {
          await user.click(next());
          expect(container.querySelector("[data-figure]")).toHaveAttribute("data-k", String(k));
          const step = direct.steps[k - 1]!;
          const wrote = step.writes.flatMap((x) => (typeof x.reg === "number" ? [x.reg] : []));
          if (wrote.length === 0) {
            // The ret: the register the result is in.
            expect(valueOf(container, "w0")).toBe(wValue(stateAfter(direct, k - 1), 0));
            continue;
          }
          for (const n of wrote) {
            expect(valueOf(container, `w${n}`)).toBe(wValue(stateAfter(direct, k - 1), n));
            expect(cells(container, `w${n}`)).toBe(low8(wValue(stateAfter(direct, k - 1), n)));
            expect(valueOf(container, `w${n}-before`)).toBe(
              wValue(k === 1 ? direct.initial : stateAfter(direct, k - 2), n),
            );
          }
        }
        // And the end of the run is the answer the challenge expects.
        expect(wValue(direct.final, 0)).toBe((((w & ~0x70) | ((g & 7) << 4)) >>> 0) as number);
        await user.click(screen.getByRole("button", { name: S.stepper.reset }));
      }
    },
  );

  it("marks the bits an instruction cleared, moved or combined, and the bits outside 4 to 6 unchanged when they are", async () => {
    const user = userEvent.setup();
    const { container } = mount(
      SolutionStepper,
      "s",
      "solution-stepper",
      props,
      stored(SET_GEAR_REFERENCE_TEXT),
    );
    // set_gear(0x35, 5): and w1, w1, 7 clears nothing of 5; lsl moves bits 0 and 2 to 4 and 6.
    await user.click(next());
    expect(tagged(container, "w1", "cleared")).toEqual([]);
    await user.click(next());
    expect(cells(container, "w1")).toBe(low8(0x50));
    expect(tagged(container, "w1", "moved")).toEqual([4, 6]);
    // The word 0x35 clears bits 4 and 5 with the mask, and every bit outside the field is unchanged.
    await user.click(next());
    expect(cells(container, "w0")).toBe(low8(0x05));
    expect(tagged(container, "w0", "cleared")).toEqual([4, 5]);
    expect(tagged(container, "w0", "kept")).toEqual([0, 1, 2, 3, 7]);
    // The orr combines bits 4 and 6 and keeps the rest.
    await user.click(next());
    expect(cells(container, "w0")).toBe(low8(0x55));
    expect(tagged(container, "w0", "combined")).toEqual([4, 6]);
    expect(tagged(container, "w0", "kept")).toEqual([0, 1, 2, 3, 7]);
    // The legend names the glyphs in use.
    expect(container.querySelector(".al-cell-legend")).toHaveTextContent(S.cells.tag.combined);
    expect(container.querySelector(".al-cell-legend")).toHaveTextContent(S.cells.tag.kept);
    // The 32 bits are one press away, with the glyphs under them.
    const all = container.querySelector("details.al-all32") as HTMLDetailsElement;
    expect(all.open).toBe(false);
    expect(bits(container, "full-after")).toBe(pad(0x55));
    expect(all.querySelectorAll('[data-row="full-marks"] .al-mark')).toHaveLength(32);
  });

  it("clears bit 3 of g = 13 with the mask of 7, and keeps the field bits of the word it started with out of 'unchanged'", async () => {
    const user = userEvent.setup();
    const { container } = mount(
      SolutionStepper,
      "s",
      "solution-stepper",
      props,
      stored(SET_GEAR_REFERENCE_TEXT),
    );
    await user.click(container.querySelectorAll(".asm-chips .chip")[3] as HTMLElement);
    await user.click(next());
    expect(cells(container, "w1")).toBe(low8(13 & 7));
    expect(tagged(container, "w1", "cleared")).toEqual([3]);
    // g is not the word: nothing it holds is marked unchanged.
    expect(tagged(container, "w1", "kept")).toEqual([]);
    for (let i = 0; i < 3; i++) await user.click(next());
    expect(cells(container, "w0")).toBe(low8(0x1254));
    expect(tagged(container, "w0", "kept")).toEqual([0, 1, 2, 3, 7]);
  });

  it("works for a solution that mishandles the word: bits outside the field that changed are not marked unchanged", async () => {
    const user = userEvent.setup();
    // No shift: g = 7 lands in bits 0 to 2, outside the field.
    const { container } = mount(
      SolutionStepper,
      "s",
      "solution-stepper",
      props,
      stored("and w1, w1, 7\norr w0, w0, w1\nret"),
    );
    await user.click(container.querySelectorAll(".asm-chips .chip")[1] as HTMLElement);
    await user.click(next());
    await user.click(next());
    expect(cells(container, "w0")).toBe(low8(7));
    expect(tagged(container, "w0", "combined")).toEqual([0, 1, 2]);
    expect(tagged(container, "w0", "kept")).toEqual([3, 7]);
  });

  it("follows what the registers hold: a register made from the word is the one marked unchanged", () => {
    const trace = traceOf(
      {
        listing:
          "f:\n  and w2, w1, 7\n  lsl w2, w2, 4\n  and w3, w0, -113\n  orr w0, w3, w2\n  ret",
      },
      { entry: "f", args: [0x35, 5] },
    );
    const sets = derivedFrom(trace).map((s) => [...s].sort());
    expect(sets).toEqual([[0], [0], [0], [0, 3], [0, 3], [0, 3]]);
  });

  it("says so when the saved instructions do not assemble, and shows no run", () => {
    const { container } = mount(
      SolutionStepper,
      "s",
      "solution-stepper",
      props,
      stored("and w1, w1, 7\nfoo w0\nret"),
    );
    expect(container.querySelector(".al-locked")).toHaveTextContent(S.solution.noRun);
    expect(container.querySelector(".al-cellrow")).toBeNull();
  });

  it("only runs the instructions the challenge allows: a branch in the saved text is refused, not run", () => {
    const { container } = mount(
      SolutionStepper,
      "s",
      "solution-stepper",
      props,
      stored("loop:\n b loop\nret"),
    );
    expect(container.querySelector(".al-locked")).toHaveTextContent(S.solution.noRun);
  });
});

// ---------------------------------------------------------------------------------------------

describe("what leaving out the clear does", () => {
  const props = {
    without: SET_GEAR_WITHOUT_CLEAR,
    gcc: SET_GEAR,
    call: { entry: "set_gear", args: [0x35, 5] },
    field: { from: 4, to: 6 },
    after: "p",
  };

  it("stays shut until the prediction before it is checked, and shows no value", () => {
    const { container } = mount(ClearCompare, "c", "clear-compare", props);
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelector(".al-cellrow")).toBeNull();
    expect(container.textContent).not.toContain("0x75");
  });

  it("shows the old word, the new gear moved into place, the OR without the clear (0x75) and with it (0x55, from GCC's function on the model), with the surviving old field bits marked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "masks");
    store.setSlot("p", { choice: "117" });
    const { container } = mount(ClearCompare, "c", "clear-compare", props, store);
    expect(container.querySelector(".al-locked")).toBeNull();
    expect(cells(container, "old")).toBe(low8(0x35));
    expect(cells(container, "moved")).toBe(low8(0x50));
    expect(cells(container, "without")).toBe(low8(0x75));
    expect(cells(container, "with")).toBe(low8(0x55));
    // Each is a value of the model.
    const mine = traceOf(SET_GEAR_WITHOUT_CLEAR, { entry: "set_gear", args: [0x35, 5] });
    const gcc = traceOf(SET_GEAR, { entry: "set_gear", args: [0x35, 5] });
    expect(valueOf(container, "without")).toBe(wValue(mine.result.final, 0));
    expect(valueOf(container, "with")).toBe(wValue(gcc.result.final, 0));
    expect(valueOf(container, "moved")).toBe(wValue(viewAt(mine, 2).state, 1));
    // The old gear's bits 4 and 5 are set, and still set under the OR; the OR's answer differs
    // from the answer with the clear at bit 5 alone.
    expect(tagged(container, "old", "survives")).toEqual([4, 5]);
    expect(tagged(container, "without", "survives")).toEqual([4]);
    expect(tagged(container, "without", "differs")).toEqual([5]);
    expect(cellMarked(container, "without", "changed")).toEqual([5]);
    expect(tagged(container, "with", "survives")).toEqual([]);
    expect(cellMarked(container, "old", "field")).toEqual([4, 5, 6]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Without the clear the OR gives 0x75. With the clear, GCC's function gives 0x55.",
    );
    expect(container.querySelector(".al-cell-legend")).toHaveTextContent(S.cells.tag.survives);
    expect(container.querySelector(".al-cell-legend")).toHaveTextContent(S.cells.tag.differs);
  });
});

// ---------------------------------------------------------------------------------------------

describe("the learner's code beside GCC's bfi", () => {
  const props = {
    afterChallenge: SET,
    note: "Both return `0x55`.",
    gcc: SET_GEAR,
    call: { entry: "set_gear", args: [0x35, 5] },
    field: { from: 4, to: 6 },
  };
  function stored(text: string, attempts = 1) {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "masks");
    store.setChallenge(SET, (c) => ({ ...c, artifact: { text }, attempts }));
    return store;
  }

  it("is shut until the challenge passes, and shows nothing of GCC's function or the answer before", () => {
    for (const store of [
      new LessonStore(memoryStorage(), "assembly-lab", "masks"),
      stored("ret"),
      stored("and w1, w1, 7\nlsl w1, w1, 4\norr w0, w0, w1\nret"),
    ]) {
      const { container, unmount } = mount(BfiCompare, "b", "bfi-compare", props, store);
      expect(container.querySelector(".al-locked")).toHaveTextContent(S.bfi.locked);
      expect(container.textContent).not.toContain("bfi");
      expect(container.textContent).not.toContain("Both return");
      unmount();
    }
  });

  it("opens when the saved work passes: the learner's code and GCC's both give 0x55, from two runs of the model", () => {
    const { container } = mount(
      BfiCompare,
      "b",
      "bfi-compare",
      props,
      stored(SET_GEAR_REFERENCE_TEXT),
    );
    expect(container.querySelector(".al-locked")).toBeNull();
    expect(container.textContent).toContain("Both return");
    expect(container.querySelector(".al-listing")).toHaveTextContent("bfi w0, w1, 4, 3");
    expect(cells(container, "yours")).toBe(low8(0x55));
    expect(cells(container, "gcc")).toBe(low8(0x55));
    const gcc = traceOf(SET_GEAR, { entry: "set_gear", args: [0x35, 5] });
    const mine = ranText(SET_GEAR_REFERENCE_TEXT, [0x35, 5]);
    expect(valueOf(container, "gcc")).toBe(wValue(gcc.result.final, 0));
    expect(valueOf(container, "yours")).toBe(wValue(mine.final, 0));
    expect(screen.getByRole("status")).toHaveTextContent(
      "set_gear(0x35, 5) gives 0x55 from your code and from GCC's.",
    );
  });

  it("works for any solution that passes, not only the reference", () => {
    const { container } = mount(
      BfiCompare,
      "b",
      "bfi-compare",
      props,
      stored("and w0, w0, -113\nlsl w1, w1, 4\nand w1, w1, 112\norr w0, w0, w1\nret"),
    );
    expect(cells(container, "yours")).toBe(low8(0x55));
  });
});

// ---------------------------------------------------------------------------------------------

describe("the shift, reworked", () => {
  const props = { ops: ["lsl", "lsr", "asr"], amounts: [1, 2, 3, 4, 8], word: -7 };
  const chip = (name: string, group: string) =>
    within(screen.getByRole("group", { name: group })).getByRole("button", { name });
  const glyphs = (c: HTMLElement, row: string) =>
    [...c.querySelectorAll(`[data-row="${row}"] .al-mark`)]
      .filter((m) => m.textContent !== "")
      .map((m) => [Number(m.getAttribute("data-bit")), m.textContent]);

  it("states the direction and what fills the gap in one line, with an arrow", async () => {
    const user = userEvent.setup();
    const { container } = mount(ShiftFigure, "s", "shift", props);
    const line = () => container.querySelector(".al-direction") as HTMLElement;
    expect(line()).toHaveAttribute("data-dir", "left");
    expect(line()).toHaveTextContent("lsl moves every bit 1 place left.");
    expect(line()).toHaveTextContent(S.shift.rule.lsl);
    expect(line().querySelector(".al-arrow")).toHaveTextContent("←");
    await user.click(chip("lsr", S.shift.instruction));
    expect(line()).toHaveAttribute("data-dir", "right");
    expect(line()).toHaveTextContent("lsr moves every bit 1 place right.");
    expect(line()).toHaveTextContent("filled with zeros");
    expect(line().querySelector(".al-arrow")).toHaveTextContent("→");
    await user.click(chip("asr", S.shift.instruction));
    expect(line()).toHaveTextContent("filled with copies of the old top bit");
    await user.click(chip("3", S.shift.by));
    expect(line()).toHaveTextContent("asr moves every bit 3 places right.");
  });

  it("marks the filled top bit of -7 in the asr result and in the lsr result, by shape and by a + under it, and the lost bit by a ×", async () => {
    const user = userEvent.setup();
    const { container } = mount(ShiftFigure, "s", "shift", props);
    await user.click(chip("asr", S.shift.instruction));
    expect(bits(container, "after")).toBe(pad(0xfffffffc));
    expect(marked(container, "after", "fill")).toEqual([31]);
    expect(glyphs(container, "filled")).toEqual([[31, S.shift.filledGlyph]]);
    expect(glyphs(container, "lost")).toEqual([[0, S.shift.lostGlyph]]);
    expect(container.querySelector('[data-part="filled"]')).toHaveTextContent("Filled with: 1");
    await user.click(chip("lsr", S.shift.instruction));
    expect(bits(container, "after")).toBe(pad(0x7ffffffc));
    expect(marked(container, "after", "fill")).toEqual([31]);
    expect(glyphs(container, "filled")).toEqual([[31, S.shift.filledGlyph]]);
    expect(container.querySelector('[data-part="filled"]')).toHaveTextContent("Filled with: 0");
    expect(screen.getByRole("status")).toHaveTextContent("2147483644 as unsigned");
  });

  it("marks the lost and filled bits for lsl, lsr and asr at every amount", async () => {
    const user = userEvent.setup();
    const { container } = mount(ShiftFigure, "s", "shift", props);
    for (const op of ["lsl", "lsr", "asr"] as const)
      for (const amount of [1, 2, 3, 4, 8]) {
        await user.click(chip(op, S.shift.instruction));
        await user.click(chip(String(amount), S.shift.by));
        const lost = op === "lsl" ? range(32 - amount, 31) : range(0, amount - 1);
        const filled = op === "lsl" ? range(0, amount - 1) : range(32 - amount, 31);
        expect(marked(container, "before", "lost"), `${op} ${amount}`).toEqual(lost);
        expect(marked(container, "after", "fill"), `${op} ${amount}`).toEqual(filled);
        const numbers = (row: string) =>
          glyphs(container, row)
            .map((g) => Number(g[0]))
            .sort((a, b) => a - b);
        expect(numbers("lost")).toEqual(lost);
        expect(numbers("filled")).toEqual(filled);
      }
  });
});

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

// ---------------------------------------------------------------------------------------------

describe("the division correction", () => {
  const props = {
    program: DIV2,
    call: { entry: "div2", args: [-7] },
    calls: [
      { label: "div2(-7)", call: { entry: "div2", args: [-7] } },
      { label: "div2(7)", call: { entry: "div2", args: [7] } },
    ],
    registers: [0],
    reading: "signed",
    showC: true,
    operand: true,
  };
  const next = () => screen.getByRole("button", { name: S.stepper.next });
  const fact = (c: HTMLElement, which: string) =>
    c.querySelector(`.al-facts [data-fact="${which}"]`);

  it("shows w0 before and after each step, and for the add the shifted operand: -7, 1, -6 and then -6, -3", async () => {
    const user = userEvent.setup();
    const { container } = mount(WordStepperFigure, "d", "word-stepper", props);
    expect(container.querySelector(".al-facts")).toBeNull();
    await user.click(next());
    expect(fact(container, "before")).toHaveTextContent("0xfffffff9 (-7)");
    expect(fact(container, "operand")).toHaveTextContent("0x1 (1)");
    expect(fact(container, "operand")?.querySelector("th")).toHaveTextContent("Operand w0, lsr 31");
    expect(fact(container, "after")).toHaveTextContent("0xfffffffa (-6)");
    // before + operand = after, on the numbers the rows carry.
    const n = (which: string) => Number(fact(container, which)?.getAttribute("data-value"));
    expect((n("before") + n("operand")) >>> 0).toBe(n("after"));
    await user.click(next());
    expect(fact(container, "before")).toHaveTextContent("0xfffffffa (-6)");
    expect(fact(container, "operand")).toBeNull();
    expect(fact(container, "after")).toHaveTextContent("0xfffffffd (-3)");
    // The ret writes no register: no table.
    await user.click(next());
    expect(container.querySelector(".al-facts")).toBeNull();
  });

  it("offers div2(7) as a second call: the operand is 0, w0 stays 7, and the result is 3", async () => {
    const user = userEvent.setup();
    const { container } = mount(WordStepperFigure, "d", "word-stepper", props);
    await user.click(next());
    await user.click(screen.getByRole("button", { name: "div2(7)" }));
    expect(container.querySelector("[data-figure]")).toHaveAttribute("data-k", "0");
    expect(bits(container, "w0")).toBe(pad(7));
    await user.click(next());
    expect(fact(container, "before")).toHaveTextContent("0x7 (7)");
    expect(fact(container, "operand")).toHaveTextContent("0x0 (0)");
    expect(fact(container, "after")).toHaveTextContent("0x7 (7)");
    await user.click(next());
    expect(fact(container, "after")).toHaveTextContent("0x3 (3)");
    await user.click(screen.getByRole("button", { name: "div2(-7)" }));
    await user.click(next());
    expect(fact(container, "operand")).toHaveTextContent("0x1 (1)");
  });

  it("shows no operand and no choice of call when the figure is not asked for them", () => {
    const { container } = mount(WordStepperFigure, "d", "word-stepper", {
      program: DIV2,
      call: { entry: "div2", args: [-7] },
      registers: [0],
    });
    expect(container.querySelector(".asm-chips")).toBeNull();
    expect(container.querySelector(".al-facts")).toBeNull();
  });

  it("works the operand out from the state before the add: before + operand = after for words of every kind, and nothing else writes w0 first", () => {
    for (const word of [-7, 7, -1, 0, 1, 100, -100, 2147483647, -2147483648]) {
      const trace = traceOf(DIV2, { entry: "div2", args: [word] });
      const operand = operandOf(trace, 1);
      expect(operand, String(word)).not.toBeNull();
      const before = wValue(viewAt(trace, 0).state, 0);
      const after = wValue(viewAt(trace, 1).state, 0);
      expect(operand!.value).toBe(before >>> 31);
      expect((before + operand!.value) >>> 0).toBe(after);
      expect(operand!.register).toBe(0);
      expect(operand!.text).toBe("w0, lsr 31");
      // The asr has no shifted operand, and the ret has no operand at all.
      expect(operandOf(trace, 2)).toBeNull();
      expect(operandOf(trace, 3)).toBeNull();
      // Forming the operand wrote nothing: w0 before the add is the argument.
      expect(trace.result.steps[0]!.writes).toHaveLength(1);
      expect(trace.result.steps[0]!.writes[0]!.before & 0xffffffffn).toBe(BigInt(before));
    }
  });

  it("is the same stepper for the first prediction's function: halve_gradient has no shifted operand", () => {
    const trace = traceOf(HALVE_GRADIENT, { entry: "halve_gradient", args: [-7] });
    expect(operandOf(trace, 1)).toBeNull();
  });
});
