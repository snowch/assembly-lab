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
  SECTION_KINDS,
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
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(meetTheMachine)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
    expect([lesson.module, lesson.order]).toEqual([0, 0]);
  });

  it("introduces the six terms of the module plan, and passes the term gate", () => {
    expect(lesson.introduces).toEqual([
      "instruction",
      "register",
      "listing",
      "assembly language",
      "operand",
      "program counter",
    ]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the terms the lesson withholds", () => {
    const withheld =
      /\b(flags?|hex|hexadecimal|signed|unsigned|address(es)?|stack|link register|calling convention|opcode|mnemonic)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
  });

  it("carries an originality note, as the plan states it", () => {
    expect(lesson.originalityNote.textbookExample).toContain("hello, world");
    expect(lesson.originalityNote.howThisDiffers).toContain("deleted `ret`");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
    expect(Object.keys(book.timeModelNotes)).toEqual([STEPS]);
  });

  it("gates the stepper behind the prediction before it, in the same lesson", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    for (const x of lesson.sections.flatMap((s) => s.interactives)) {
      const after = x.props["after"];
      if (typeof after !== "string") continue;
      // A figure that stays shut waits for a prediction above it. The arguments figure is the one
      // exception the lesson means: it draws the mapping first and reveals the first instruction's
      // result only after the prediction below it has been checked, so the diagram is on the page
      // before the learner answers and nothing of the result is.
      if (x.id === "arg-registers") continue;
      expect(ids.indexOf(after), x.id).toBeLessThan(ids.indexOf(x.id));
    }
    expect(ids.indexOf("predict-total")).toBeGreaterThan(ids.indexOf("arg-registers"));
  });

  it("gives the construction challenge the gate add, sub and ret, and the registers w0 to w3", () => {
    const c = challenge("fix-fuel-used");
    expect(c.allowedConstructs).toEqual(["add", "sub", "ret"]);
    expect(c.palette).toEqual(["w0", "w1", "w2", "w3"]);
    expect(c.initial.text).toBe("sub w0, w1, w0\nret");
    expect(c.reference.text).toBe("sub w0, w0, w1\nret");
    expect(testCount(c)).toBe(3);
  });
});

describe("the challenges", () => {
  it.each(["fix-fuel-used", "trace-the-call"])(
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

  it("fix-fuel-used: the starting point fails all three calls but (45, 45)", () => {
    const c = challenge("fix-fuel-used");
    const verdict = grade(c, c.initial);
    expect(verdict.failures.map((f) => f.label)).toEqual(["fuel_used(50, 38)", "fuel_used(60, 5)"]);
    expect(verdict.failures[0]?.actual).toEqual({ w0: "-12" });
  });

  it("fix-fuel-used: the reversed subtraction is answered with the lesson's sentence about the order", () => {
    const c = challenge("fix-fuel-used");
    const verdict = grade(c, c.initial);
    expect(verdict.failures.map((f) => f.detail)).toEqual([
      quoted(PROSE.fixReversedFeedback),
      quoted(PROSE.fixReversedFeedback),
    ]);
    // The sentence says what to look at, not the answer.
    expect(PROSE.fixReversedFeedback).not.toMatch(/sub w0, w0, w1/);
  });

  it("fix-fuel-used: any other wrong result keeps the usual card, with its values", () => {
    const c = challenge("fix-fuel-used");
    // add w0, w0, w1 gives 88, 90 and 65: right for none of the three calls, and not reversed.
    const verdict = grade(c, { text: "add w0, w0, w1\nret" });
    expect(verdict.failures).toHaveLength(3);
    for (const f of verdict.failures) expect(f.detail).toBeUndefined();
    expect(verdict.failures.map((f) => f.actual)).toEqual([
      { w0: "88" },
      { w0: "90" },
      { w0: "65" },
    ]);
    // A program that returns 0 gets the (45, 45) call right; the other two fail with no sentence.
    const zero = grade(c, { text: "sub w0, w0, w0\nret" });
    expect(zero.failures).toHaveLength(2);
    expect(zero.failures.every((f) => f.detail === undefined)).toBe(true);
  });

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
    expect(container.querySelectorAll("section.lesson-section")).toHaveLength(10);
    const problems = [...container.querySelectorAll(".interactive-problem, .interactive-missing")];
    expect(problems.map((p) => p.textContent)).toEqual([]);
    // The two steppers wait for their predictions; nothing of either run is on the page yet.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(2);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
  });
});

describe("the editor's keys", () => {
  it("fix-fuel-used offers , and w, the registers w0 to w3, and no number pad", () => {
    const c = challenge("fix-fuel-used");
    expect(c.initial.data?.["editor"]).toEqual({
      symbols: [",", "w"],
      registers: ["w0", "w1", "w2", "w3"],
      numberPad: false,
    });
    expect(c.palette).toEqual(["w0", "w1", "w2", "w3"]);
  });

  it("still accepts x typed, because the machine takes it", () => {
    const c = challenge("fix-fuel-used");
    expect(grade(c, { text: "sub x0, x0, x1\nret" }).passed).toBe(true);
  });
});
