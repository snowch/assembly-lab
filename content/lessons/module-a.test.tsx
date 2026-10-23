// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseLesson, checkLesson, SECTION_KINDS, testCount } from "@platform/lesson-schema";
import { LessonStore, LessonView, memoryStorage } from "@platform/lesson-runtime";
import { createBook, passedChallenge } from "@al/views";
import { gradeRecorded } from "../../packages/views/src/grader-recorded";
import { sameCOnA32 } from "./same-c-on-a32";

const lesson = parseLesson(sameCOnA32);
describe("Optional A teaches through recorded comparisons and A64 execution", () => {
  it("has ten ordered sections, two mounted exercises and five hints each", () => {
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.module).toBe(13);
    expect(lesson.sections.map((section) => section.kind)).toEqual([...SECTION_KINDS]);
    expect(lesson.challenges).toHaveLength(2);
    for (const challenge of lesson.challenges) {
      expect(challenge.hints).toHaveLength(5);
      expect(
        lesson.sections
          .flatMap((section) => section.interactives)
          .some((figure) => figure.props["challengeId"] === challenge.id),
      ).toBe(true);
    }
  });
  it.each(lesson.challenges)(
    "$id: reference passes, empty and wrong work fails, stored passes are regraded",
    (challenge) => {
      expect(gradeRecorded(challenge, challenge.reference)).toEqual({
        passed: true,
        total: testCount(challenge),
        failures: [],
      });
      expect(gradeRecorded(challenge, challenge.initial).passed).toBe(false);
      const wrong = {
        answers: Object.fromEntries(challenge.fields.map((field) => [field.id, "wrong"])),
      };
      const verdict = gradeRecorded(challenge, wrong);
      expect(verdict.passed).toBe(false);
      expect(verdict.failures).toHaveLength(testCount(challenge));
      const store = new LessonStore(memoryStorage(), "assembly-lab", lesson.id);
      store.setChallenge(challenge.id, (current) => ({
        ...current,
        artifact: wrong,
        verdict: { passed: true, total: 99, failures: [] },
      }));
      expect(passedChallenge(lesson, store.get(), challenge.id)).toBe(false);
      for (const failure of verdict.failures) expect(JSON.stringify(failure.expected)).toBe("{}");
    },
  );
  it("accepts whitespace/code quoting but rejects copying extra operands or partial helper names", () => {
    const read = lesson.challenges[0]!,
      final = lesson.challenges[1]!;
    expect(
      gradeRecorded(read, { answers: { conditional: " `MOVCS` ", return: "bx" } }).passed,
    ).toBe(true);
    expect(
      gradeRecorded(read, { answers: { conditional: "movcs r0, r1", return: "bx lr" } }).passed,
    ).toBe(false);
    expect(
      gradeRecorded(final, { answers: { ...final.reference.answers, helper: "uidiv" } }).passed,
    ).toBe(false);
  });
  it("never feeds A32 records to the A64 stepper or the written-assembly editor", () => {
    for (const figure of lesson.sections.flatMap((section) => section.interactives)) {
      if (figure.kind === "stepper" || figure.kind === "run-prediction")
        expect(JSON.stringify(figure.props["program"])).not.toMatch(/\br[0-9]|\bbx\b/);
      expect(figure.kind).not.toBe("assembly-editor");
    }
    expect(lesson.challenges.every((challenge) => challenge.gradedDirection === "answer")).toBe(
      true,
    );
  });
  it("renders the complete page without figure errors and keeps the first trace gated", () => {
    const book = createBook({ title: "Assembly Lab", lessons: [lesson] });
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelector(".al-problem")).toBeNull();
    expect(container.querySelector("#ix-step-a64-limit .al-locked")).not.toBeNull();
    expect(container.querySelectorAll('[data-figure="listing-pair"]')).toHaveLength(6);
    const references = container.querySelectorAll(".al-recorded-reference");
    expect(references).toHaveLength(3);
    for (const reference of references) {
      expect(reference).not.toHaveAttribute("open");
      expect(reference.querySelectorAll(".al-listing")).toHaveLength(2);
    }
  });
});
