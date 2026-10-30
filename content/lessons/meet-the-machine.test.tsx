// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 0's lesson as content: it parses and passes the schema's checks and the term gate, it
// names only figures and a model the book has, each challenge's reference passes its tests and its
// starting point does not, a wrong answer is answered in the lesson's own words without the right
// value, and the whole page renders with no figure problem.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { INTERACTIVES, STEPS, createBook, grade, quoted } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import {
  checkLesson,
  learnerText,
  modelProblems,
  parseLesson,
  termProblems,
  testCount,
} from "@platform/lesson-schema";

import { LESSONS } from ".";
import { meetTheMachine } from "./meet-the-machine";
import { PROSE } from "./meet-the-machine.prose";

const lesson = LESSONS.find((l) => l.id === "meet-the-machine")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

describe("the lesson", () => {
  it("parses and passes the schema's checks: selected sections in order, every challenge mounted", () => {
    expect(() => parseLesson(meetTheMachine)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([
      "investigation",
      "failureExperiment",
      "challenge",
    ]);
    expect([lesson.module, lesson.order]).toEqual([0, 6]);
  });

  it("introduces the opening terms, including the small function call, and passes the term gate", () => {
    expect(lesson.introduces).toEqual([]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the terms the lesson withholds", () => {
    const withheld =
      /\b(flags?|hex|hexadecimal|signed|unsigned|address(es)?|stack|link register|calling convention|opcode|mnemonic)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
  });

  it("carries an originality note, as the plan states it", () => {
    expect(lesson.originalityNote.textbookExample).toContain("individual mechanics");
    expect(lesson.originalityNote.howThisDiffers).toContain("earlier Fundamentals lessons");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
    expect(book.timeModelNotes).toEqual({});
  });

  it("opens the synthesis walkthrough directly and preserves the new failure experiment gate", () => {
    const figures = lesson.sections.flatMap((s) => s.interactives);
    const ids = figures.map((x) => x.id);
    expect(ids).not.toContain("predict-total");
    expect(ids).not.toContain("trip-listing");
    expect(ids).not.toContain("arg-registers");
    expect(figures.find((x) => x.id === "step-trip")?.props["after"]).toBeUndefined();
    expect(figures.find((x) => x.id === "step-no-ret")?.props["after"]).toBe("predict-no-ret");
    expect(ids.indexOf("predict-no-ret")).toBeLessThan(ids.indexOf("step-no-ret"));
    expect(lesson.sections.at(-1)?.details).toBeUndefined();
  });
});

describe("the challenges", () => {
  it.each(["trace-the-call"])(
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

  it("trace-the-call: a wrong w1 is answered with the lesson's sentence, not the value", () => {
    const c = challenge("trace-the-call");
    const verdict = grade(c, { answers: { w0: "670", w1: "30000" } });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.detail).toBe(quoted(PROSE.traceFeedbackW1));
    expect(JSON.stringify(verdict)).not.toContain("28750");
  });

  it("trace-the-call: a wrong w0 is answered with the lesson's sentence, not the value", () => {
    const c = challenge("trace-the-call");
    const verdict = grade(c, { answers: { w0: "1250", w1: "28750" } });
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.detail).toBe(quoted(PROSE.traceFeedbackW0));
    expect(JSON.stringify(verdict)).not.toContain("670");
  });
});

describe("the page", () => {
  it("renders every section and figure with no problem note", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelectorAll("section.lesson-section")).toHaveLength(
      lesson.sections.length,
    );
    const problems = [...container.querySelectorAll(".interactive-problem, .interactive-missing")];
    expect(problems.map((p) => p.textContent)).toEqual([]);
    // Only the new failure experiment waits for a prediction; the complete walkthrough is open.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(1);
    expect(container.querySelector("#ix-step-trip .al-listing")).not.toBeNull();
    expect(container.querySelector("#ix-step-no-ret .al-locked")).not.toBeNull();
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(1);
  });
});
