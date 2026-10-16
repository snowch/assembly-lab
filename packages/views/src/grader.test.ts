// Copyright © 2026 Christopher Snow

// The grader's verdicts: for written assembly, a text that passes, one that fails, one that does
// not assemble, one the gate refuses and one that does not return; for answers, the right ones,
// each wrong field answered in the case's own sentence without the right value, and the fields
// left empty or not numbers.

import { describe, expect, it } from "vitest";

import { sentence } from "./messages";
import { grade, gradeAnswers, gradeWritten } from "./grader";
import { VIEW_STRINGS as S, quoted } from "./strings";
import { answers, written } from "./testing";

describe("grading written assembly", () => {
  it("passes the reference, and every test with it", () => {
    const verdict = gradeWritten(written, written.reference);
    expect(verdict).toEqual({ passed: true, total: 3, failures: [] });
  });

  it("fails the starting point on the two calls it gets wrong, with what it returned and what was expected", () => {
    const verdict = gradeWritten(written, written.initial);
    expect(verdict.passed).toBe(false);
    expect(verdict.total).toBe(3);
    expect(verdict.failures.map((f) => [f.index, f.label])).toEqual([
      [0, "fuel_used(50, 38)"],
      [2, "fuel_used(60, 5)"],
    ]);
    expect(verdict.failures[0]).toMatchObject({
      inputs: { w0: "50", w1: "38" },
      actual: { w0: "-12" },
      expected: { w0: "12" },
    });
    expect(verdict.failures[1]).toMatchObject({ actual: { w0: "-55" }, expected: { w0: "55" } });
  });

  it("takes the instructions as written, with a label or a blank line before them", () => {
    expect(gradeWritten(written, { text: "\nfuel_used:\n  sub w0, w0, w1\n  ret\n" }).passed).toBe(
      true,
    );
  });

  it("is blocked, with the machine's sentence against the line, when the text does not assemble", () => {
    const verdict = gradeWritten(written, { text: "sub w0, w0\nret" });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures).toEqual([]);
    expect(verdict.blocked).toBe(`Line 1: ${sentence("operands.few", { text: "sub w0, w0" })}`);
  });

  it("is blocked, naming the instruction, when the text uses one the gate has not allowed", () => {
    const verdict = gradeWritten(written, { text: "mov w0, w1\nret" });
    expect(verdict.blocked).toContain("You have not met `mov` yet");
    expect(verdict.blocked).toMatch(/^Line 1: /);
  });

  it("lists every line that does not assemble", () => {
    const verdict = gradeWritten(written, { text: "sub w0, w0\nadd w0\nret" });
    expect(verdict.blocked?.split("\n")).toHaveLength(2);
  });

  it("is blocked when nothing is written", () => {
    expect(gradeWritten(written, { text: "  \n" }).blocked).toBeDefined();
    expect(gradeWritten(written, {}).passed).toBe(false);
  });

  it("fails each call, with the machine's sentence, when the run does not return", () => {
    const verdict = gradeWritten(written, { text: "sub w0, w0, w1" });
    expect(verdict.blocked).toBeUndefined();
    expect(verdict.failures).toHaveLength(3);
    // The machine's own sentence for a run that went past its last instruction, whatever its
    // wording: the template, with each parameter allowed to be anything.
    const template = quoted(
      sentence("fault.ranOffEnd", {
        line: "\u0000",
        text: "\u0000",
      }),
    );
    const pattern = template
      .split("\u0000")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*");
    expect(verdict.failures[0]?.detail).toMatch(new RegExp(`^${pattern}$`));
  });

  it("prints the code in a detail inside curly quotes, never in backticks", () => {
    const detail = gradeWritten(written, { text: "sub w0, w0, w1" }).failures[0]?.detail;
    expect(detail).toBe(
      "The run went past the end of the instructions without running a \u201cret\u201d. The last instruction it ran was line 1, \u201csub w0, w0, w1\u201d.",
    );
    expect(detail).not.toContain("`");
    expect(detail).toContain("\u201csub w0, w0, w1\u201d");
  });

  it("is what grade() does for a challenge that names the run-registers grader", () => {
    expect(grade(written, written.reference).passed).toBe(true);
  });
});

describe("grading answers", () => {
  it("passes the reference", () => {
    expect(gradeAnswers(answers, answers.reference)).toEqual({
      passed: true,
      total: 2,
      failures: [],
    });
  });

  it("computes the expected values by running the program, not from the lesson's data", () => {
    // The reference above is 65 and 30 only because the run leaves 100 - 30 - 5 and 30.
    expect(gradeAnswers(answers, { answers: { w0: "65", w1: "30" } }).passed).toBe(true);
    expect(gradeAnswers(answers, { answers: { w0: "66", w1: "30" } }).passed).toBe(false);
  });

  it("answers a wrong w1 with its sentence, and says nothing of the right value", () => {
    const verdict = gradeAnswers(answers, { answers: { w0: "65", w1: "7" } });
    expect(verdict.passed).toBe(false);
    expect(verdict.total).toBe(2);
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]).toMatchObject({
      label: "w1 at the end",
      detail: "Which line writes w1?",
      inputs: {},
      actual: {},
      expected: {},
    });
    expect(JSON.stringify(verdict)).not.toMatch(/\b30\b/);
  });

  it("answers a wrong w0 with its sentence", () => {
    const verdict = gradeAnswers(answers, { answers: { w0: "95", w1: "30" } });
    expect(verdict.failures.map((f) => f.detail)).toEqual(["Do each sub in turn."]);
    expect(JSON.stringify(verdict)).not.toContain("65");
  });

  it("answers both when both are wrong", () => {
    const verdict = gradeAnswers(answers, { answers: { w0: "0", w1: "0" } });
    expect(verdict.failures.map((f) => f.label)).toEqual(["w0 at the end", "w1 at the end"]);
  });

  it("is blocked, naming the fields, when one is left empty", () => {
    const verdict = gradeAnswers(answers, { answers: { w0: "65", w1: "  " } });
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toBe(S.grader.unanswered("\u201cw1 at the end\u201d", 1));
  });

  it("reads as one sentence whether one field is empty or all of them", () => {
    expect(gradeAnswers(answers, {}).blocked).toBe(
      S.grader.unanswered("\u201cw0 at the end\u201d and \u201cw1 at the end\u201d", 2),
    );
    expect(gradeAnswers(answers, { answers: { w0: " " } }).blocked).toBe(
      S.grader.unanswered("\u201cw0 at the end\u201d and \u201cw1 at the end\u201d", 2),
    );
  });

  it("is blocked when an answer is not a whole number", () => {
    expect(gradeAnswers(answers, { answers: { w0: "six", w1: "30" } }).blocked).toContain("w0");
    expect(gradeAnswers(answers, { answers: { w0: "65.5", w1: "30" } }).passed).toBe(false);
  });

  it("takes a number with spaces round it, and a negative as the 32 bits it names", () => {
    expect(gradeAnswers(answers, { answers: { w0: " 65 ", w1: "30 " } }).passed).toBe(true);
    expect(gradeAnswers(answers, { answers: { w0: String(65 - 2 ** 32), w1: "30" } }).passed).toBe(
      true,
    );
  });

  it("is what grade() does for a challenge that names the registers-at-return grader", () => {
    expect(grade(answers, answers.reference).passed).toBe(true);
    expect(grade(answers, answers.initial).passed).toBe(false);
  });
});

describe("grade()", () => {
  it("refuses a challenge whose grader it does not have, so a typo is loud", () => {
    const odd = { ...written, tests: { ...written.tests, grader: "nothing" } };
    expect(() => grade(odd, written.reference)).toThrow(/no grader called nothing/);
  });
});
