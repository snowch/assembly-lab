// Copyright © 2026 Christopher Snow

// The grader for answers read off a run: what a function returns, how many instructions it takes, and
// whether a condition holds after a compare. The expected value is what the model gives, and a wrong
// answer is never told the right one.

import { describe, expect, it } from "vitest";

import { Challenge } from "@platform/lesson-schema";

import { grade } from "./grader";
import { BRANCH_OUTCOMES } from "./grader-branch";

const program = {
  c: "",
  listing: [
    "f:",
    "  cmp w0, 10",
    "  bgt .Lbig",
    "  mov w0, -2",
    "  ret",
    ".Lbig:",
    "  mov w0, 2",
    "  ret",
  ].join("\n"),
};

const runs = Challenge.parse({
  id: "runs",
  title: "Runs",
  task: "Run it.",
  gradedDirection: "answer",
  fields: [
    { id: "small", label: "`f(3)` returns", kind: "number" },
    { id: "smallSteps", label: "instructions run for `f(3)`", kind: "number" },
    { id: "big", label: "`f(30)` returns", kind: "number" },
    { id: "bigSteps", label: "instructions run for `f(30)`", kind: "number" },
  ],
  initial: { data: { program } },
  tests: {
    kind: "answers",
    grader: BRANCH_OUTCOMES,
    cases: [
      { label: "f(3) returns", given: { entry: "f", w0: 3 }, expect: { small: "w0" } },
      { label: "f(3) steps", given: { entry: "f", w0: 3 }, expect: { smallSteps: "steps" } },
      {
        label: "f(30) returns",
        given: { entry: "f", w0: 30, "feedback.big": "Look at the branch." },
        expect: { big: "w0" },
      },
      { label: "f(30) steps", given: { entry: "f", w0: 30 }, expect: { bigSteps: "steps" } },
    ],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { answers: { small: "-2", smallSteps: "4", big: "2", bigSteps: "4" } },
});

const holds = Challenge.parse({
  id: "holds",
  title: "Holds",
  task: "Say.",
  gradedDirection: "answer",
  fields: [
    { id: "ge", label: "`ge`", kind: "number" },
    { id: "cs", label: "`cs`", kind: "number" },
  ],
  initial: { data: { program: { c: "", listing: "cmp w0, w1" } } },
  tests: {
    kind: "answers",
    grader: BRANCH_OUTCOMES,
    cases: [
      { label: "ge", given: { w0: 0xfffffffb, w1: 2 }, expect: { ge: "holds:ge" } },
      { label: "cs", given: { w0: 0xfffffffb, w1: 2 }, expect: { cs: "holds:cs" } },
    ],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { answers: { ge: "0", cs: "1" } },
});

describe("branch-outcomes, for what a run gives", () => {
  it("passes the right result and count for each case", () => {
    const v = grade(runs, runs.reference);
    expect(v.passed).toBe(true);
    expect(v.total).toBe(4);
  });

  it("takes a negative result as the pattern it stands for, and a count exactly", () => {
    expect(
      grade(runs, { answers: { ...runs.reference.answers, small: "4294967294" } }).passed,
    ).toBe(true);
    expect(grade(runs, { answers: { ...runs.reference.answers, small: "2" } }).passed).toBe(false);
    expect(grade(runs, { answers: { ...runs.reference.answers, smallSteps: "-4" } }).passed).toBe(
      false,
    );
  });

  it("names each wrong field's case and gives the case's own sentence, never the value", () => {
    const v = grade(runs, { answers: { small: "-2", smallSteps: "5", big: "3", bigSteps: "4" } });
    expect(v.failures.map((f) => f.label)).toEqual(["f(3) steps", "f(30) returns"]);
    expect(v.failures[1]!.detail).toBe("Look at the branch.");
    // A field with no sentence of its own is named, never given its value.
    expect(v.failures[0]!.detail).toMatch(/^Your answer for \u2018.+\u2019 is not right\.$/);
    expect(JSON.stringify(v)).not.toMatch(/"(4|2|-2)"/);
  });

  it("asks for every field before it grades anything, and for whole numbers", () => {
    expect(grade(runs, { answers: { small: "-2" } }).blocked).toContain("instructions run for");
    expect(grade(runs, { answers: { ...runs.reference.answers, big: "two" } }).blocked).toContain(
      "whole number",
    );
  });
});

describe("branch-outcomes, for whether a condition holds", () => {
  it("passes the right 1 and 0, read from the model's own compare", () => {
    expect(grade(holds, holds.reference).passed).toBe(true);
    const wrong = grade(holds, { answers: { ge: "1", cs: "1" } });
    expect(wrong.failures.map((f) => f.label)).toEqual(["ge"]);
  });

  it("refuses 2, 1 for no and 0 for yes", () => {
    expect(grade(holds, { answers: { ge: "2", cs: "1" } }).passed).toBe(false);
    expect(grade(holds, { answers: { ge: "1", cs: "0" } }).failures).toHaveLength(2);
  });
});
