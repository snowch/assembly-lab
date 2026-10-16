// Copyright © 2026 Christopher Snow

// The graders Module 2 adds: answers read off a run, as a register or a flag, and the smallest
// number that sets a flag. A wrong answer is told which test it failed and never the right value; an
// answer left empty or not a number is asked for before anything is graded.

import { describe, expect, it } from "vitest";

import { Challenge } from "@platform/lesson-schema";

import { fieldList } from "./fields";
import { grade } from "./grader";
import { ARITH_STRINGS as A } from "./strings.arith";
import { VIEW_STRINGS as S } from "./strings";

const PLUS = { c: "", listing: "plus:\n  adds w0, w0, w1\n  ret" };
const SUBS = { c: "", listing: "gap:\n  subs w0, w0, w1\n  ret" };
const hints = ["a", "b", "c", "d", "e"] as const;

/** Flags of two additions, answered as 0 or 1, each from a field. */
const flags = Challenge.parse({
  id: "flags",
  title: "Flags",
  task: "Give the flags.",
  gradedDirection: "answer",
  fields: ["a-n", "a-c", "b-n", "b-v"].map((id) => ({
    id,
    label: `\`${id.slice(2).toUpperCase()}\` for ${id.slice(0, 1)}`,
    kind: "choice",
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
    ],
  })),
  initial: { data: { program: PLUS } },
  tests: {
    kind: "answers",
    grader: "outcomes-at-return",
    cases: [
      {
        label: "a",
        given: { entry: "plus", w0: 0xffffffff, w1: 1, "feedback.a-c": "Look at the carry." },
        expect: { "a-n": "n", "a-c": "c" },
      },
      {
        label: "b",
        given: { entry: "plus", w0: 0x7fffffff, w1: 1 },
        expect: { "b-n": "N", "b-v": "v" },
      },
    ],
  },
  hints,
  reference: { answers: { "a-n": "0", "a-c": "1", "b-n": "1", "b-v": "1" } },
});

/** A register and a flag after a subtraction, answered as numbers. */
const gap = Challenge.parse({
  id: "gap",
  title: "Gap",
  task: "Give the result and C.",
  gradedDirection: "answer",
  fields: [
    { id: "result", label: "The result", kind: "number" },
    { id: "c", label: "C after `subs`", kind: "number" },
  ],
  initial: { data: { program: SUBS } },
  tests: {
    kind: "answers",
    grader: "outcomes-at-return",
    cases: [
      { label: "result", given: { entry: "gap", w0: 0, w1: 4294967295 }, expect: { result: "w0" } },
      { label: "c", given: { entry: "gap", w0: 0, w1: 4294967295 }, expect: { c: "c" } },
    ],
  },
  hints,
  reference: { answers: { result: "1", c: "0" } },
});

/** The smallest number added to 0x7ffffffe that sets V. */
const smallest = Challenge.parse({
  id: "smallest",
  title: "Smallest",
  task: "Give the number.",
  gradedDirection: "answer",
  fields: [{ id: "number", label: "The number", kind: "number" }],
  initial: { data: { program: PLUS } },
  tests: {
    kind: "answers",
    grader: "smallest-setting-flag",
    cases: [
      {
        label: "V",
        given: { entry: "plus", w0: 0x7ffffffe, flag: "v" },
        expect: { number: "w1" },
      },
    ],
  },
  hints,
  reference: { answers: { number: "2" } },
});

describe("the outcomes at return, for flags", () => {
  it("passes the answers the run gives, flag by flag, and the flag's letter in either case", () => {
    const verdict = grade(flags, flags.reference);
    expect(verdict).toEqual({ passed: true, total: 2, failures: [] });
  });

  it("fails the case with a wrong flag, says the case's own sentence, and never the value", () => {
    const answers = { ...flags.reference.answers, "a-c": "0" };
    const verdict = grade(flags, { answers });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["a"]);
    expect(verdict.failures[0]?.detail).toBe("Look at the carry.");
    expect(JSON.stringify(verdict)).not.toContain('"1"');
  });

  it("fails a case with no sentence of its own by naming the case only", () => {
    const answers = { ...flags.reference.answers, "b-v": "0" };
    const verdict = grade(flags, { answers });
    expect(verdict.failures).toEqual([
      { index: 1, label: "b", inputs: {}, actual: {}, expected: {} },
    ]);
  });

  it("asks for every answer before it grades any", () => {
    const answers = { ...flags.reference.answers };
    delete answers["b-n"];
    const verdict = grade(flags, { answers });
    expect(verdict.blocked).toBe(S.grader.unanswered(fieldList(["N for b"]), 1));
    expect(grade(flags, { answers: {} }).blocked).toMatch(/^Nothing is graded until /);
  });

  it("fails the starting point, which has answered nothing", () => {
    expect(grade(flags, flags.initial).passed).toBe(false);
  });
});

describe("the outcomes at return, for a register and a flag", () => {
  it("passes 1 and 0, the register as an unsigned number and the flag as 0 or 1", () => {
    expect(grade(gap, gap.reference)).toEqual({ passed: true, total: 2, failures: [] });
  });

  it("fails the result alone, or C alone, naming which", () => {
    expect(grade(gap, { answers: { result: "2", c: "0" } }).failures.map((f) => f.label)).toEqual([
      "result",
    ]);
    expect(grade(gap, { answers: { result: "1", c: "1" } }).failures.map((f) => f.label)).toEqual([
      "c",
    ]);
  });

  it("does not take a negative number for the unsigned result with the same bits", () => {
    expect(grade(gap, { answers: { result: "-4294967295", c: "0" } }).passed).toBe(false);
  });

  it("asks for a whole number before it grades", () => {
    expect(grade(gap, { answers: { result: "one", c: "0" } }).blocked).toBe(
      S.grader.notWhole("The result"),
    );
  });

  it("says a run that does not return is a mistake in the lesson, not in the answer", () => {
    const broken = Challenge.parse({
      ...gap,
      initial: { data: { program: { c: "", listing: "gap:\n  b gap" } } },
    });
    expect(() => grade(broken, broken.reference)).toThrow();
  });
});

describe("the smallest number that sets a flag", () => {
  it("passes 2 and no other number", () => {
    expect(grade(smallest, smallest.reference).passed).toBe(true);
    for (const n of ["1", "3", "4", "100", "2147483647", "0", "-2", "4294967298"])
      expect(grade(smallest, { answers: { number: n } }).passed, n).toBe(false);
  });

  it("says that the flag is 0 for a number too small, and that a smaller one sets it for a number too big", () => {
    expect(grade(smallest, { answers: { number: "1" } }).failures[0]?.detail).toBe(
      A.grader.flagClear("V"),
    );
    expect(grade(smallest, { answers: { number: "5" } }).failures[0]?.detail).toBe(
      A.grader.notSmallest,
    );
    // Neither sentence says the number.
    expect(A.grader.flagClear("V")).not.toContain("2");
    expect(A.grader.notSmallest).not.toContain("2");
  });

  it("asks for a whole number first", () => {
    expect(grade(smallest, { answers: { number: "" } }).blocked).toMatch(
      /^Nothing is graded until /,
    );
    expect(grade(smallest, { answers: { number: "2.5" } }).blocked).toContain("whole number");
  });
});
