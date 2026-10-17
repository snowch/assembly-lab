// Copyright © 2026 Christopher Snow

// What each lesson teaches, as the gate counts it: every instruction a lesson's prose names as an
// instruction is one the lesson teaches or an earlier lesson taught, and every instruction a
// challenge allows is taught by then. The prose is read as a learner reads it (`learnerText`).

import { describe, expect, it } from "vitest";

import { subsetMnemonics } from "@al/machine";
import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { TAUGHT, introducedBy } from "./introduced";

const MNEMONICS = new Set(subsetMnemonics());
const CONDITIONAL = /^b\.?(eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)$/;

/** The gate's name for a mnemonic a learner can type: every conditional branch is `b.cond`. */
const gateName = (m: string): string => (CONDITIONAL.test(m) ? "b.cond" : m);

/**
 * The instructions a piece of text names in code marks: the first word of a code span, when that
 * is one of the machine's mnemonics (`orr w0, w0, 1` names `orr`; `lsl` names `lsl`). A span of
 * more than one line is read line by line, as a listing is.
 */
export function instructionsNamedIn(text: string): string[] {
  const out: string[] = [];
  for (const span of text.matchAll(/`([^`]+)`/g)) {
    for (const line of (span[1] as string).split("\n")) {
      const words = line.trim().split(/[\s,]+/);
      const first = words[0] ?? "";
      // A lone `b` is the C variable `b` as often as the branch instruction.
      if (first === "b" && words.length === 1) continue;
      if (MNEMONICS.has(first) || CONDITIONAL.test(first)) out.push(gateName(first));
    }
  }
  return out;
}

/**
 * Instructions a lesson may name before it teaches them, with the reason, decided here:
 *
 * - Module 1 says `lsl 16` in `movk`, "which Module 3 explains": `lsl` is the shift that names the
 *   upper half there, and the lesson says so.
 * - Module 2's first lesson shows `cmn` and `cset` in a recorded listing in a closed note that says a
 *   later module explains them. They are read, not written, and the gate does not count them as met
 *   there: `cmn w0, w1` typed in Module 2 still says "not met yet".
 */
const NAMED_BEFORE_TAUGHT: Readonly<Record<string, readonly string[]>> = {
  "constants-and-widths": ["lsl"],
  "adding-and-the-flags": ["cmn", "cset"],
};

describe("what each lesson teaches", () => {
  it("lists every lesson, and only lessons the course has", () => {
    expect(Object.keys(TAUGHT).sort()).toEqual(LESSONS.map((l) => l.id).sort());
  });

  it("names no instruction twice", () => {
    const all = Object.values(TAUGHT).flat();
    expect(new Set(all).size).toBe(all.length);
  });

  it("names only instructions the machine has", () => {
    for (const name of Object.values(TAUGHT).flat()) expect(MNEMONICS.has(name), name).toBe(true);
  });

  it("includes every instruction a challenge of the lesson or an earlier one allows", () => {
    LESSONS.forEach((lesson, index) => {
      const taught = new Set(LESSONS.slice(0, index + 1).flatMap((l) => TAUGHT[l.id] ?? []));
      for (const c of lesson.challenges)
        for (const name of c.allowedConstructs ?? [])
          expect(taught.has(name), `${lesson.id}: ${c.id} allows ${name}`).toBe(true);
    });
  });

  it("counts an instruction as met from the lesson that teaches it", () => {
    const at = (id: string) =>
      new Set(
        introducedBy(
          LESSONS,
          LESSONS.findIndex((l) => l.id === id),
        ),
      );
    expect(at("masks").has("bfi")).toBe(true);
    expect(at("masks").has("lsr")).toBe(false);
    expect(at("shifts").has("lsr")).toBe(true);
    expect(at("compare-and-choose").has("tst")).toBe(true);
    expect(at("compare-and-choose").has("cbnz")).toBe(false);
    expect(at("branches").has("cbnz")).toBe(true);
    expect(at("subtracting-and-the-tick-counter").has("neg")).toBe(true);
    expect(at("subtracting-and-the-tick-counter").has("cset")).toBe(false);
  });

  it("is enough for every instruction the lessons' prose names to be taught by that lesson", () => {
    const problems: string[] = [];
    LESSONS.forEach((lesson, index) => {
      const taught = new Set(LESSONS.slice(0, index + 1).flatMap((l) => TAUGHT[l.id] ?? []));
      const shown = new Set(NAMED_BEFORE_TAUGHT[lesson.id] ?? []);
      const named = new Set(instructionsNamedIn(learnerText(lesson).join("\n")));
      for (const name of named)
        if (!taught.has(name) && !shown.has(name)) problems.push(`${lesson.id} names ${name}`);
    });
    expect(problems).toEqual([]);
  });

  it("allows an exception only where the lesson really names the instruction", () => {
    for (const [id, names] of Object.entries(NAMED_BEFORE_TAUGHT)) {
      const lesson = LESSONS.find((l) => l.id === id)!;
      const named = new Set(instructionsNamedIn(learnerText(lesson).join("\n")));
      for (const name of names) expect(named.has(name), `${id} ${name}`).toBe(true);
    }
  });
});
