// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createBook, grade } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, testCount } from "@platform/lesson-schema";
import { LESSONS } from ".";
import { PROSE } from "./masks.prose";

const lesson = LESSONS.find((l) => l.id === "masks")!;
const fields = LESSONS.find((l) => l.id === "reading-and-writing-fields")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) =>
  [lesson, fields].flatMap((unit) => unit.challenges).find((c) => c.id === id)!;

it("gives mask and field operations separate checks without a remote prediction gate", () => {
  expect(lesson.introduces).toEqual(["mask"]);
  expect(fields.introduces).toEqual(["field"]);
  expect(challenge("trace-three-results").fields.map((f) => f.id)).toEqual([
    "after_orr",
    "after_and",
  ]);
  expect(challenge("trace-gear-field").fields.map((f) => f.id)).toEqual(["the_gear"]);
  expect(
    fields.sections.flatMap((part) => part.interactives).find((f) => f.id === "read-gear")!.props[
      "after"
    ],
  ).toBeUndefined();
});

it.each([lesson, fields])("renders $id with its own local controls and gates", (unit) => {
  expect(checkLesson(unit)).toEqual([]);
  const view = render(<LessonView book={book} lesson={unit} storage={memoryStorage()} />);
  expect(
    view.container.querySelectorAll(".interactive-problem, .interactive-missing"),
  ).toHaveLength(0);
  expect(view.container.querySelectorAll("section.challenge")).toHaveLength(unit.challenges.length);
});

describe("the challenges", () => {
  it.each(["write-set-gear", "trace-three-results", "trace-gear-field"])(
    "%s: the reference passes every test and the starting point does not",
    (id) => {
      const c = challenge(id);
      const passing = grade(c, c.reference);
      expect(passing.blocked).toBeUndefined();
      expect(passing.passed).toBe(true);
      expect(passing.total).toBe(testCount(c));
      expect(grade(c, c.initial).passed).toBe(false);
    },
  );

  it("write-set-gear: the starting point fails all four calls", () => {
    const c = challenge("write-set-gear");
    const verdict = grade(c, c.initial);
    expect(verdict.failures.map((f) => f.label)).toEqual([
      "set_gear(0x35, 5)",
      "set_gear(0, 7)",
      "set_gear(0xffffffff, 0)",
      "set_gear(0x1234, 13)",
    ]);
  });

  it("write-set-gear: leaving out the clear, or the mask on g, fails the calls that need them", () => {
    const c = challenge("write-set-gear");
    const noClear = grade(c, {
      text: "and w1, w1, 7\nlsl w1, w1, 4\norr w0, w0, w1\nret",
    });
    expect(noClear.passed).toBe(false);
    expect(noClear.failures.map((f) => f.label)).toEqual([
      "set_gear(0x35, 5)",
      "set_gear(0xffffffff, 0)",
      "set_gear(0x1234, 13)",
    ]);
    const noMask = grade(c, { text: "lsl w1, w1, 4\nand w0, w0, -113\norr w0, w0, w1\nret" });
    expect(noMask.passed).toBe(false);
    expect(noMask.failures.map((f) => f.label)).toEqual(["set_gear(0x1234, 13)"]);
  });

  it("write-set-gear: GCC's bfi is an instruction the task does not allow, and is refused", () => {
    const c = challenge("write-set-gear");
    const verdict = grade(c, { text: "bfi w0, w1, 4, 3\nret" });
    expect(verdict.passed).toBe(false);
    // bfi is taught in this lesson, so the gate says what the challenge allows, not "not met".
    expect(verdict.blocked).toContain("This challenge allows only");
    expect(verdict.blocked).not.toContain("not met");
  });

  it("trace-three-results: a wrong answer is rejected without the right value", () => {
    const c = challenge("trace-three-results");
    const verdict = grade(c, {
      answers: { after_orr: "0x2b", after_and: "0x2a", the_gear: "0x2" },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["after and"]);
    expect(JSON.stringify(verdict)).not.toContain("0x22");
  });

  it("trace-three-results: each wrong field gets its own sentence, never the value, and a chained `and` gets the chained one", () => {
    const c = challenge("trace-three-results");
    const right = { after_orr: "0x2b", after_and: "0x22", the_gear: "0x2" };
    // The verdict shows no code marks: they come out as curly quotes. Put them back to compare.
    const detail = (answers: Record<string, string>) =>
      grade(c, { answers: { ...right, ...answers } }).failures.map((f) =>
        f.detail?.replace(/“([^”]*)”/g, "`$1`"),
      );
    expect(detail({ after_orr: "0x2a" })).toEqual([PROSE.traceFeedback.after_orr]);
    expect(detail({ after_and: "0x2a" })).toEqual([PROSE.traceFeedback.after_and]);
    expect(
      grade(challenge("trace-gear-field"), { answers: { the_gear: "0x5" } }).failures.map(
        (f) => f.detail,
      ),
    ).toEqual([PROSE.traceFeedback.the_gear]);
    // 0x23 is what the same `and` gives on 0x2b, the `orr` result, run on the model: the chained mistake.
    expect(detail({ after_and: "0x23" })).toEqual([PROSE.traceFeedback.chained]);
    expect(detail({ after_and: "23" })).toEqual([PROSE.traceFeedback.chained]);
    // Any other wrong `and` answer is the ordinary sentence, and the right answer is none.
    expect(detail({ after_and: "0x24" })).toEqual([PROSE.traceFeedback.after_and]);
    expect(detail({})).toEqual([]);
    // Two wrong fields, two cases, two sentences.
    expect(detail({ after_orr: "0x0", the_gear: "0x0" })).toEqual([PROSE.traceFeedback.after_orr]);
    // No sentence gives the value of any of the three answers.
    const all = Object.values(PROSE.traceFeedback).join(" ");
    expect(all).not.toMatch(/0x2b|0x22|0x23/);
    expect(all).not.toMatch(/\b0x2\b(?!a)/);
  });

  it("trace-three-results: answers are read as hexadecimal, with or without 0x", () => {
    const c = challenge("trace-three-results");
    expect(grade(c, { answers: { after_orr: "2B", after_and: "22", the_gear: "2" } }).passed).toBe(
      true,
    );
    // 34 is 0x34 here, not 0x22.
    expect(
      grade(c, { answers: { after_orr: "0x2b", after_and: "34", the_gear: "2" } }).passed,
    ).toBe(false);
  });

  it("trace-three-results: an answer that is not hexadecimal is asked for again, and nothing is graded", () => {
    const c = challenge("trace-three-results");
    const verdict = grade(c, {
      answers: { after_orr: "0x2b", after_and: "banana", the_gear: "2" },
    });
    expect(verdict.blocked).toContain("hexadecimal");
    expect(grade(c, { answers: { after_orr: "0x2b" } }).blocked).toContain("after and");
  });
});
