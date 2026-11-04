// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { createBook, grade } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, modelProblems, termProblems } from "@platform/lesson-schema";
import { LESSONS, SOURCE_LESSONS } from ".";
import { FOUR_BIT_PROSE } from "./four-bit-arithmetic.prose";

const index = LESSONS.findIndex((entry) => entry.id === "four-bit-arithmetic");
const lesson = LESSONS[index]!;
const challenge = lesson.challenges[0]!;

it("puts the arithmetic mechanism after readings and before the 32-bit program", () => {
  expect(LESSONS.slice(index - 1, index + 2).map((entry) => entry.id)).toEqual([
    "same-bits-two-readings",
    "four-bit-arithmetic",
    "arithmetic-on-register-bits",
  ]);
  expect(checkLesson(lesson)).toEqual([]);
  expect(modelProblems([lesson], ["steps"])).toEqual([]);
  expect(termProblems(LESSONS)).toEqual([]);
  expect(termProblems(SOURCE_LESSONS)).toEqual([]);
  const view = render(
    <LessonView
      book={createBook({ title: "Assembly Lab", lessons: LESSONS })}
      lesson={lesson}
      storage={memoryStorage()}
    />,
  );
  expect(
    view.container.querySelectorAll(".interactive-problem, .interactive-missing"),
  ).toHaveLength(0);
  expect(view.container.querySelectorAll(".al-four-arithmetic")).toHaveLength(3);
  expect(view.container.textContent).not.toContain(FOUR_BIT_PROSE.practice.solved);
});

it("grades all three parts, blocks blanks and rejects plausible mistakes independently", () => {
  expect(grade(challenge, challenge.initial)).toMatchObject({ passed: false, total: 3 });
  expect(grade(challenge, challenge.initial).blocked).toBeTruthy();
  expect(grade(challenge, challenge.reference)).toMatchObject({
    passed: true,
    total: 3,
    failures: [],
  });
  for (const [field, value] of [
    ["negated", "1100"], // inversion without the extra one
    ["result", "10011"], // retaining a fifth bit
    ["result", "11"], // required four-place representation
    ["result", "00x1"],
    ["carry", "keep"],
    ["carry", "sign"],
  ]) {
    const verdict = grade(challenge, {
      answers: { ...challenge.reference.answers, [field!]: value! },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]!.expected).toEqual({});
    expect(verdict.failures[0]!.detail).toBeTruthy();
  }
  expect(
    grade(challenge, { answers: { ...challenge.reference.answers, result: " 00 11 " } }).passed,
  ).toBe(true);
});

it("computes answers from the inputs rather than trusting the stored reference", () => {
  if (challenge.tests.kind !== "answers") throw new Error("Expected answer cases");
  const variant = {
    ...challenge,
    tests: {
      ...challenge.tests,
      cases: challenge.tests.cases.map((c) => ({ ...c, given: { ...c.given, a: 5, b: 2 } })),
    },
  };
  expect(grade(variant, challenge.reference).passed).toBe(false);
  expect(
    grade(variant, { answers: { negated: "1110", result: "0011", carry: "discard" } }).passed,
  ).toBe(true);
});

it("keeps learner prose in its separate drafting record", () => {
  const draft = readFileSync("docs/notes/four-bit-arithmetic/draft.md", "utf8");
  function strings(value: unknown): string[] {
    if (typeof value === "string") return value.split("\n\n").filter(Boolean);
    if (!value || typeof value !== "object") return [];
    return Object.entries(value).flatMap(([key, child]) => (key === "value" ? [] : strings(child)));
  }
  for (const text of strings(FOUR_BIT_PROSE)) expect(draft).toContain(text);
});
