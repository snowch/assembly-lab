// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { LESSONS } from "@al/content";
import { grade, HEX_REGISTERS_AT_RETURN } from "./grader";
import { answers as patternAnswers } from "./testing";

function exercise(id: string) {
  const challenge = LESSONS.flatMap((lesson) => lesson.challenges).find((item) => item.id === id);
  if (!challenge) throw new Error(`Missing challenge ${id}`);
  return challenge;
}

function reference(id: string) {
  const answers = exercise(id).reference.answers;
  if (!answers) throw new Error(`Missing reference answers for ${id}`);
  return answers;
}

describe("feedback from the submitted value and the requested reading", () => {
  it("accepts taught decimal notation in an explicitly signed exercise", () => {
    const answers = Object.fromEntries(
      Object.entries(reference("compare-shifts")).map(([field, value]) => [
        field,
        BigInt(value).toLocaleString("en-GB").replace("-", "−"),
      ]),
    );
    expect(grade(exercise("compare-shifts"), { answers }).passed).toBe(true);
  });

  it("rejects an unsigned equivalent when the task requests the signed number", () => {
    const answers = { ...reference("compare-shifts") };
    answers["asr_neg"] = String(BigInt(answers["asr_neg"] as string) + 2n ** 32n);
    const verdict = grade(exercise("compare-shifts"), { answers });
    expect(verdict.blocked).toBeUndefined();
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.detail).toContain("does not match the signed reading");
    expect(verdict.failures[0]?.expected).toEqual({});
    expect(grade(exercise("compare-shifts"), { answers: reference("compare-shifts") }).passed).toBe(
      true,
    );
  });

  it("accepts grouped hexadecimal answers while still rejecting more than 32 bits", () => {
    if (patternAnswers.tests.kind !== "answers") throw new Error("Answer cases required");
    const challenge = {
      ...patternAnswers,
      tests: { ...patternAnswers.tests, grader: HEX_REGISTERS_AT_RETURN },
    };
    expect(grade(challenge, { answers: { w0: "0x0000 0041", w1: "0000 001e" } }).passed).toBe(true);
    expect(grade(challenge, { answers: { w0: "0x100000041", w1: "001e" } }).blocked).toBeDefined();
  });

  it.each(["0", "−1", "4,294,967,298"])("does not invent flag results for operand %s", (value) => {
    const challenge = exercise("smallest-overflow");
    const field = Object.keys(reference(challenge.id))[0] as string;
    const verdict = grade(challenge, { answers: { [field]: value } });
    expect(verdict.blocked).toBeUndefined();
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.detail).toContain("outside this range");
    expect(verdict.failures[0]?.detail).toContain("flag calculation was not run");
    expect(verdict.failures[0]?.detail).not.toContain("is 0 for the number");
  });
});

describe("field-specific feedback after submission", () => {
  it("shows observed flags and their condition rule without returning the answer", () => {
    const challenge = exercise("read-four-conditions");
    const answers = { ...reference(challenge.id) };
    const field = Object.keys(answers)[0] as string;
    answers[field] = answers[field] === "1" ? "0" : "1";
    const verdict = grade(challenge, { answers });
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.detail).toMatch(/N=[01], Z=[01], C=[01], V=[01]/);
    expect(verdict.failures[0]?.detail).toContain("Apply the rule");
    expect(verdict.failures[0]?.expected).toEqual({});
  });

  it("explains a count discrepancy while withholding the expected count", () => {
    const challenge = exercise("count-describe-runs");
    if (challenge.tests.kind !== "answers") throw new Error("Answer cases required");
    const field = challenge.tests.cases
      .flatMap((item) => Object.entries(item.expect))
      .find(([, kind]) => kind === "steps")?.[0];
    if (!field) throw new Error("Missing count case");
    const answers = { ...reference(challenge.id) };
    const submitted = String(BigInt(answers[field] as string) + 1n);
    answers[field] = submitted;
    const verdict = grade(challenge, { answers });
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.detail).toContain(`your count of ${submitted} is too high`);
    expect(verdict.failures[0]?.detail).toContain("branch");
    expect(verdict.failures[0]?.actual).toEqual({});
    expect(verdict.failures[0]?.expected).toEqual({});
  });

  it("gives an action for each wrong A32 field without leaking its expected token", () => {
    let checked = 0;
    for (const lesson of LESSONS.filter((item) => item.module === 14)) {
      for (const challenge of lesson.challenges) {
        for (const [field, expected] of Object.entries(challenge.reference.answers ?? {})) {
          const typed = challenge.fields.find((item) => item.id === field);
          const wrong =
            typed?.kind === "number" ? String(BigInt(expected) + 1n) : "not-an-instruction";
          const answers = { ...challenge.reference.answers, [field]: wrong };
          const verdict = grade(challenge, { answers });
          expect(verdict.failures).toHaveLength(1);
          expect(verdict.failures[0]?.detail).toMatch(/Find|Run/);
          expect(verdict.failures[0]?.detail).not.toContain(expected);
          expect(verdict.failures[0]?.detail).not.toContain("`");
          expect(verdict.failures[0]?.expected).toEqual({});
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe("recorded numerical answers are numbers, not token spellings", () => {
  it.each(["0x17", "0X17", "0x0000 0017", "023", "+23"])("accepts equivalent %s", (result) => {
    const challenge = exercise("read-a32-target");
    const answers = { ...reference(challenge.id), result };
    expect(grade(challenge, { answers }).passed).toBe(true);
  });

  it("distinguishes an invalid number format from a wrong numerical result", () => {
    const challenge = exercise("read-a32-target");
    const answers = { ...reference(challenge.id), result: "twenty-three" };
    const verdict = grade(challenge, { answers });
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.detail).toContain("whole number");
    expect(verdict.failures[0]?.detail).toContain("hexadecimal");
  });
});
