// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 2, lesson 1 as content: it parses and passes the schema's checks and the term gate, it
// names only figures and a model the book has, each challenge's reference passes its tests and its
// starting point does not, a wrong answer is answered without the right value, and the whole page
// renders with no figure problem.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ARITH_STRINGS, INTERACTIVES, STEPS, createBook, grade } from "@al/views";
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
import { addingAndTheFlags } from "./adding-and-the-flags";

const lesson = LESSONS.find((l) => l.id === "adding-and-the-flags")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

describe("the lesson", () => {
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(addingAndTheFlags)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
    expect([lesson.module, lesson.order]).toEqual([2, 0]);
  });

  it("introduces carry, flag and overflow, and passes the term gate", () => {
    expect(lesson.introduces).toEqual(["carry", "flag", "overflow"]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the terms lesson 2 and later modules introduce", () => {
    const withheld =
      /\b(borrow\w*|wrap\w*|conditions?|branch\w*|compare|two's complement|opcode|mnemonic)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
  });

  it("names cmn and cset only inside the closed note's quoted listing", () => {
    const outside = learnerText(lesson).filter(
      (t) => /\b(cmn|cset)\b/.test(t) && !t.includes("add_overflows:"),
    );
    expect(outside).toEqual([]);
  });

  it("carries an originality note that names the textbook example", () => {
    expect(lesson.originalityNote.textbookExample).toContain("8-bit");
    expect(lesson.originalityNote.howThisDiffers).toContain("32 bits");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
  });

  it("gates the adder and the stepper behind the prediction before each, in the same lesson", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    const gated = lesson.sections
      .flatMap((s) => s.interactives)
      .filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => x.id)).toEqual(["add-columns", "step-add"]);
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string), x.id).toBeLessThan(ids.indexOf(x.id));
  });

  it("asks the prediction challenge for twelve flags, in four letters for each of three additions", () => {
    const c = challenge("predict-flags");
    expect(c.fields.map((f) => f.id)).toEqual(
      ["first", "second", "third"].flatMap((a) => ["n", "z", "c", "v"].map((f) => `${a}-${f}`)),
    );
    expect(c.fields.every((f) => f.kind === "choice")).toBe(true);
    expect(testCount(c)).toBe(3);
    expect(testCount(challenge("smallest-overflow"))).toBe(1);
  });
});

describe("the challenges", () => {
  it.each(["predict-flags", "smallest-overflow"])(
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

  it("predict-flags: an answer that is wrong for one addition fails that addition only, and names no flag", () => {
    const c = challenge("predict-flags");
    const answers = { ...c.reference.answers, "first-c": "0" };
    const verdict = grade(c, { answers });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["0xffffffff plus 1"]);
    expect(JSON.stringify(verdict)).not.toMatch(/"first-c"/);
  });

  it("predict-flags: an unanswered flag is asked for before anything is graded", () => {
    const c = challenge("predict-flags");
    const answers = { ...c.reference.answers };
    delete answers["third-v"];
    const verdict = grade(c, { answers });
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toContain("V for 0x80000000 plus 0x80000000");
  });

  it("smallest-overflow: only 2 passes, and a wrong answer is told only what it got wrong", () => {
    const c = challenge("smallest-overflow");
    const pass = (n: string) => grade(c, { answers: { number: n } });
    expect(pass("2").passed).toBe(true);
    // 1 does not set V: 0x7ffffffe plus 1 is 0x7fffffff, which fits.
    expect(pass("1").failures[0]?.detail).toBe(ARITH_STRINGS.grader.flagClear("V"));
    // 3 sets V, but 2 does too.
    expect(pass("3").failures[0]?.detail).toBe(ARITH_STRINGS.grader.notSmallest);
    // 0 and negative numbers are not positive; a number with no V does not pass.
    expect(pass("0").passed).toBe(false);
    expect(pass("-5").passed).toBe(false);
    expect(pass("2147483648").passed).toBe(false);
    expect(JSON.stringify(pass("1"))).not.toContain('"2"');
  });

  it("smallest-overflow: an answer that is not a whole number is asked for again", () => {
    const c = challenge("smallest-overflow");
    expect(grade(c, { answers: { number: "two" } }).blocked).toContain("whole number");
    expect(grade(c, { answers: {} }).blocked).toContain("first");
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
    // The adder and the stepper wait for their predictions; nothing of either run is on the page.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(2);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    expect(container.querySelectorAll("details.lesson-details")).toHaveLength(1);
  });
});
