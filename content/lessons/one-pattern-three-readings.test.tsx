// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VIEW_STRINGS, createBook, grade } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, testCount } from "@platform/lesson-schema";
import { LESSONS } from ".";

const lesson = LESSONS.find((l) => l.id === "same-bits-two-readings")!;
const units = [
  "one-pattern-three-readings",
  "same-bits-two-readings",
  "arithmetic-on-register-bits",
].map((id) => LESSONS.find((l) => l.id === id)!);
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

it("teaches hexadecimal before the two readings and keeps their practice together", () => {
  expect(units.map((unit) => unit.introduces)).toEqual([
    ["hexadecimal"],
    ["unsigned reading", "signed reading", "top bit", "two’s complement"],
    ["overflow", "undefined behaviour", "wrap"],
  ]);
  expect(units.map((unit) => unit.challenges.map((c) => c.id))).toEqual([
    [],
    ["make-minus-three"],
    [],
  ]);
  expect(units[2]!.sections.flatMap((part) => part.interactives.map((f) => f.id))).toEqual([
    "compare-int-unsigned",
  ]);
  const comparison = units[2]!.sections.flatMap((part) => part.interactives)[0]!;
  expect(comparison.props["callComparison"]).toEqual({
    args: [3, 5],
    leftType: "signed",
    rightType: "unsigned",
    workedReadings: true,
  });
});

it.each(units)("renders $id with no missing activity or challenge", (unit) => {
  expect(checkLesson(unit)).toEqual([]);
  const view = render(<LessonView book={book} lesson={unit} storage={memoryStorage()} />);
  expect(
    view.container.querySelectorAll(".interactive-problem, .interactive-missing"),
  ).toHaveLength(0);
  expect(view.container.querySelectorAll("section.challenge")).toHaveLength(unit.challenges.length);
});

describe("the challenges", () => {
  it.each(["make-minus-three"])(
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

  it("make-minus-three: two tests, on a field of 32 bits and a number", () => {
    const c = challenge("make-minus-three");
    expect(testCount(c)).toBe(2);
    expect(c.fields.map((f) => [f.id, f.kind])).toEqual([
      ["bits", "bits"],
      ["unsigned", "number"],
    ]);
    expect(c.fields[0]).toMatchObject({ width: 32, weights: "signed" });
  });

  it("make-minus-three: the pattern for −12 is wrong, and says what it reads as, not what is right", () => {
    const c = challenge("make-minus-three");
    const verdict = grade(c, {
      answers: { bits: "1".repeat(28) + "0100", unsigned: "4294967284" },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["the bits of w0"]);
    expect(verdict.failures[0]?.detail).toBe(VIEW_STRINGS.readings.bitsRead("−12"));
    expect(JSON.stringify(verdict)).not.toContain("4294967293");
  });

  it("make-minus-three: an all-ones boundary pattern does not solve the fresh challenge", () => {
    const verdict = grade(challenge("make-minus-three"), {
      answers: { bits: "1".repeat(32), unsigned: "4294967295" },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((failure) => failure.label)).toEqual(["the bits of w0"]);
    expect(verdict.failures[0]?.detail).toBe(VIEW_STRINGS.readings.bitsRead("−1"));
    expect(JSON.stringify(verdict)).not.toContain("4294967293");
  });

  it("make-minus-three: a number that is not the unsigned reading of the learner's bits is wrong", () => {
    const c = challenge("make-minus-three");
    const verdict = grade(c, { answers: { bits: "1".repeat(30) + "01", unsigned: "-3" } });
    expect(verdict.failures.map((f) => f.label)).toEqual(["its unsigned reading"]);
    expect(JSON.stringify(verdict)).not.toContain("4294967293");
  });
});

it("keeps both new reading tasks on a keyboard that can enter a minus sign", () => {
  const { container } = render(
    <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
  );
  const fields = container.querySelectorAll("[data-reading-task] input");
  expect(fields).toHaveLength(4);
  for (const field of fields) {
    expect(field).toHaveAttribute("type", "text");
    expect(field.getAttribute("inputmode")).not.toBe("numeric");
  }
});
