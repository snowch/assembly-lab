// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 3's second lesson as content: it parses and passes the schema's checks and the term gate,
// it names only figures and a model the book has, each challenge's reference passes its tests and
// its starting point does not, a wrong answer is answered without the right value, and the whole
// page renders with no figure problem.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { INTERACTIVES, STEPS, createBook, grade, parseListing } from "@al/views";
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
import { MASKS_INSTRUCTIONS } from "./masks";
import { SHIFTS_INSTRUCTIONS, shifts } from "./shifts";

const lesson = LESSONS.find((l) => l.id === "shifts")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

describe("the lesson", () => {
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(shifts)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
    expect([lesson.module, lesson.order]).toEqual([3, 1]);
  });

  it("introduces shift, logical shift and arithmetic shift, and passes the term gate with every lesson written", () => {
    expect(lesson.introduces).toEqual(["shift", "logical shift", "arithmetic shift"]);
    expect(termProblems(LESSONS)).toEqual([]);
    // The first lesson of the module comes first, and does not use the word.
    const first = LESSONS.find((l) => l.id === "masks")!;
    expect(first.order).toBeLessThan(lesson.order);
    expect(learnerText(first).filter((t) => /\bshift/i.test(t))).toEqual([]);
  });

  it("uses none of the terms the lesson withholds", () => {
    const withheld =
      /\b(sign extension|condition\w*|branch\w*|two's complement|encoding|opcode|mnemonic|immediate|barrel)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
  });

  it("carries an originality note that names the textbook example and the lesson's difference", () => {
    expect(lesson.originalityNote.textbookExample).toContain("powers of two");
    expect(lesson.originalityNote.howThisDiffers).toContain("C type");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
    expect(Object.keys(book.timeModelNotes)).toEqual([STEPS]);
  });

  it("gates the shift figure and the stepper behind the prediction before each, in the same lesson", () => {
    const all = lesson.sections.flatMap((s) => s.interactives);
    const ids = all.map((x) => x.id);
    const gated = all.filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => [x.id, x.props["after"]])).toEqual([
      ["shift-word", "predict-fill"],
      ["step-div2", "predict-first-add"],
    ]);
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string)).toBeLessThan(ids.indexOf(x.id));
  });

  it("shows only instructions its gate has: the first lesson's, lsr and asr, and add and ret", () => {
    const allowed = new Set<string>([...MASKS_INSTRUCTIONS, ...SHIFTS_INSTRUCTIONS, "add", "ret"]);
    const used = new Set<string>();
    const walk = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        if (typeof o["listing"] === "string")
          for (const l of parseListing(o["listing"]))
            if (l.kind === "instruction") used.add(l.text.split(" ")[0] as string);
        Object.values(o).forEach(walk);
      }
    };
    for (const s of lesson.sections) for (const x of s.interactives) walk(x.props);
    // The graders' own programs are the one place an instruction the lesson has not met is run
    // (`sdiv`, for C's `/ 4`): the learner is never shown them.
    const shownToLearner = [...used];
    expect(shownToLearner.filter((m) => !allowed.has(m))).toEqual([]);
    expect(used.size).toBeGreaterThan(3);
  });
});

describe("the challenges", () => {
  it.each(["compare-shifts", "pick-instruction"])(
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

  it("compare-shifts: a wrong answer is rejected by name, and never with the right value", () => {
    const c = challenge("compare-shifts");
    const verdict = grade(c, {
      answers: {
        asr21: "5",
        lsr21: "5",
        div21: "5",
        // The shift's answer given for the division, and the division's for the shift.
        asr_neg: "-5",
        lsr_neg: "1073741818",
        div_neg: "-6",
      },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["asr of −21 by 2", "-21 / 4"]);
    const shown = JSON.stringify(verdict);
    expect(shown).not.toContain('"-6"');
    expect(shown).not.toMatch(/-6[^0-9]*"?\}?$/);
  });

  it("compare-shifts: the unsigned reading of lsr is asked for, and the signed one is wrong", () => {
    const c = challenge("compare-shifts");
    const verdict = grade(c, {
      answers: {
        asr21: "5",
        lsr21: "5",
        div21: "5",
        asr_neg: "-6",
        lsr_neg: "-1073741830",
        div_neg: "-5",
      },
    });
    expect(verdict.failures.map((f) => f.label)).toEqual([
      "lsr of −21 by 2 (−21 taken as unsigned)",
    ]);
  });

  it("compare-shifts: asks for every answer first, and for whole numbers", () => {
    const c = challenge("compare-shifts");
    expect(grade(c, { answers: { asr21: "5" } }).blocked).toContain("lsr");
    const words = {
      asr21: "five",
      lsr21: "5",
      div21: "5",
      asr_neg: "-6",
      lsr_neg: "1073741818",
      div_neg: "-5",
    };
    expect(grade(c, { answers: words }).blocked).toContain("whole number");
  });

  it("pick-instruction: a wrong instruction is rejected by name, and the answer is read as its first word in any case", () => {
    const c = challenge("pick-instruction");
    const verdict = grade(c, { answers: { shr_int: "lsr", shr_unsigned: "lsr", shl: "lsl" } });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["int x >> 3"]);
    expect(
      grade(c, { answers: { shr_int: "ASR", shr_unsigned: "`lsr`", shl: "lsl w0, w0, 3" } }).passed,
    ).toBe(true);
    expect(JSON.stringify(verdict)).not.toContain("asr");
  });

  it("pick-instruction: asks for all three before it grades anything", () => {
    const c = challenge("pick-instruction");
    const verdict = grade(c, { answers: { shr_int: "asr" } });
    expect(verdict.blocked).toContain("x >> 3");
    expect(verdict.failures).toEqual([]);
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
    // The shift figure and the stepper wait for their predictions; nothing of either run is on the page.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(2);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    // The prediction shows the word it takes, before anything is committed.
    expect(container.querySelectorAll('[data-figure="probe-prediction"] .al-bit')).toHaveLength(32);
  });
});
