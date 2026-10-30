// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnswerEditor, VIEW_STRINGS, createBook, grade } from "@al/views";
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
    ["unsigned reading", "signed reading", "top bit"],
    [],
  ]);
  expect(units.map((unit) => unit.challenges.map((c) => c.id))).toEqual([
    [],
    ["make-minus-one", "two-readings-each"],
    [],
  ]);
  expect(units[2]!.sections.flatMap((part) => part.interactives.map((f) => f.id))).toEqual([
    "run-fuel-used",
    "predict-add-12",
    "step-add-12",
    "compare-int-unsigned",
  ]);
  expect(
    units[2]!.sections.flatMap((part) => part.interactives).find((f) => f.id === "step-add-12")!
      .props["after"],
  ).toBe("predict-add-12");
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
  it.each(["make-minus-one", "two-readings-each"])(
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

  it("make-minus-one: two tests, on a field of 32 bits and a number", () => {
    const c = challenge("make-minus-one");
    expect(testCount(c)).toBe(2);
    expect(c.fields.map((f) => [f.id, f.kind])).toEqual([
      ["bits", "bits"],
      ["unsigned", "number"],
    ]);
    expect(c.fields[0]).toMatchObject({ width: 32, weights: "signed" });
  });

  it("make-minus-one: the pattern for −12 is wrong, and says what it reads as, not what is right", () => {
    const c = challenge("make-minus-one");
    const verdict = grade(c, {
      answers: { bits: "1".repeat(28) + "0100", unsigned: "4294967284" },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["the bits of w0"]);
    expect(verdict.failures[0]?.detail).toBe(VIEW_STRINGS.readings.bitsRead("−12"));
    expect(JSON.stringify(verdict)).not.toContain("4294967295");
  });

  it("make-minus-one: a number that is not the unsigned reading of the learner's bits is wrong", () => {
    const c = challenge("make-minus-one");
    const verdict = grade(c, { answers: { bits: "1".repeat(32), unsigned: "-1" } });
    expect(verdict.failures.map((f) => f.label)).toEqual(["its unsigned reading"]);
    expect(JSON.stringify(verdict)).not.toContain("4294967295");
  });

  it("two-readings-each: six tests, and a pair of readings swapped fails both", () => {
    const c = challenge("two-readings-each");
    expect(testCount(c)).toBe(6);
    const swapped = grade(c, {
      answers: {
        u1: "42",
        s1: "42",
        u2: "-2147483648",
        s2: "2147483648",
        u3: "-200",
        s3: "4294967096",
      },
    });
    expect(swapped.failures.map((f) => f.label)).toEqual([
      "unsigned reading of 0x80000000",
      "signed reading of 0x80000000",
      "unsigned reading of 0xffffff38",
      "signed reading of 0xffffff38",
    ]);
    expect(JSON.stringify(swapped.failures)).not.toMatch(/4294967096|2147483648/);
  });

  it("two-readings-each: the minus sign the lesson prints is accepted as a typed answer", () => {
    const c = challenge("two-readings-each");
    const answers = { ...c.reference.answers, s2: "−2147483648", s3: "−200" };
    expect(grade(c, { answers }).passed).toBe(true);
  });
});

describe("the answer boxes of Two readings each", () => {
  const modeOf = (field: string) => {
    const { container } = render(
      <AnswerEditor
        lesson={{} as typeof lesson}
        challenge={challenge("two-readings-each")}
        artifact={{}}
        onChange={() => {}}
      />,
    );
    return container.querySelector(`[data-field="${field}"] input`)?.getAttribute("inputmode");
  };

  it("give the three signed readings, which are negative or can be, the full keyboard", () => {
    // A number keypad has no minus sign on every phone, and −2147483648 and −200 are answers.
    expect(["s1", "s2", "s3"].map(modeOf)).toEqual(["text", "text", "text"]);
  });

  it("keep the number keypad for the three unsigned readings, which are never negative", () => {
    expect(["u1", "u2", "u3"].map(modeOf)).toEqual(["numeric", "numeric", "numeric"]);
  });

  it("still take the lowest signed answer the keyboard can give them", () => {
    const c = challenge("two-readings-each");
    expect(c.fields.filter((f) => f.min !== undefined).map((f) => [f.id, f.min])).toEqual([
      ["s1", -2147483648],
      ["s2", -2147483648],
      ["s3", -2147483648],
    ]);
  });
});
