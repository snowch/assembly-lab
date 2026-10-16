// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 2, lesson 2 as content: it parses and passes the schema's checks and the term gate, it
// names only figures and a model the book has, each challenge's reference passes its tests and its
// starting point does not, the tempting answer cannot be written with the gate's instructions, a
// wrong answer is answered without the right value, and the whole page renders with no figure
// problem.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { INTERACTIVES, STEPS, createBook, grade } from "@al/views";
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
import { subtractingAndTheTickCounter } from "./subtracting-and-the-tick-counter";

const lesson = LESSONS.find((l) => l.id === "subtracting-and-the-tick-counter")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

describe("the lesson", () => {
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(subtractingAndTheTickCounter)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
    expect([lesson.module, lesson.order]).toEqual([2, 1]);
  });

  it("introduces borrow and wrap, and passes the term gate", () => {
    expect(lesson.introduces).toEqual(["borrow", "wrap"]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the terms a later module introduces", () => {
    const withheld = /\b(conditions?|branch\w*|compare|two's complement|opcode|mnemonic)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
  });

  it("names cmp, cmn and cset nowhere: the listing it describes is described in words", () => {
    expect(learnerText(lesson).filter((t) => /\b(cmp|cmn|cset)\b/.test(t))).toEqual([]);
  });

  it("carries an originality note that names the textbook example", () => {
    expect(lesson.originalityNote.textbookExample).toContain("odometer");
    expect(lesson.originalityNote.howThisDiffers).toContain("millisecond counter");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
  });

  it("gates the ring, the two adders and the stepper behind the prediction before each, in the same lesson", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    const gated = lesson.sections
      .flatMap((s) => s.interactives)
      .filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => x.id)).toEqual([
      "counter-ring",
      "subtract-wrapped",
      "subtract-no-wrap",
      "step-negs",
    ]);
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string), x.id).toBeLessThan(ids.indexOf(x.id));
  });

  it("gives the construction challenge the gate add, sub, adds, subs and ret, and not neg", () => {
    const c = challenge("write-elapsed");
    expect(c.allowedConstructs).toEqual(["add", "sub", "adds", "subs", "ret"]);
    expect(c.palette).toEqual(["w0", "w1"]);
    expect(c.initial.text).toBe("ret");
    expect(c.reference.text).toBe("sub w0, w0, w1\nret");
    expect(testCount(c)).toBe(4);
  });
});

describe("the challenges", () => {
  it.each(["write-elapsed", "one-step-past"])(
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

  it("write-elapsed: the starting point fails all four calls", () => {
    const c = challenge("write-elapsed");
    const verdict = grade(c, c.initial);
    expect(verdict.failures.map((f) => f.label)).toEqual([
      "elapsed(5000, 1000)",
      "elapsed(86400000, 3600000)",
      "elapsed(250, 4294967046)",
      "elapsed(30, 4294966296)",
    ]);
  });

  it("write-elapsed: the other order of the operands fails, and so does adding", () => {
    const c = challenge("write-elapsed");
    expect(grade(c, { text: "sub w0, w1, w0\nret" }).passed).toBe(false);
    expect(grade(c, { text: "add w0, w0, w1\nret" }).passed).toBe(false);
    // The flag-setting form also answers it, which is fine.
    expect(grade(c, { text: "subs w0, w0, w1\nret" }).passed).toBe(true);
  });

  it("write-elapsed: neg is not met yet, so the gate refuses it before the failure experiment", () => {
    const c = challenge("write-elapsed");
    const verdict = grade(c, { text: "neg w1, w1\nadd w0, w0, w1\nret" });
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toContain("You have not met `neg`");
  });

  it("write-elapsed: a wrong answer shows its values as unsigned numbers, not negative ones", () => {
    const c = challenge("write-elapsed");
    // sub the other way round: 1000 minus 5000 is −4000 signed and 4294963296 unsigned.
    const verdict = grade(c, { text: "sub w0, w1, w0\nret" });
    const first = verdict.failures[0]!;
    expect(first.label).toBe("elapsed(5000, 1000)");
    expect(first.actual).toEqual({ w0: "4294963296" });
    expect(first.expected).toEqual({ w0: "4000" });
    for (const f of verdict.failures)
      for (const v of [...Object.values(f.actual), ...Object.values(f.expected)])
        expect(v, f.label).not.toMatch(/^-/);
  });

  it("write-elapsed: the tempting answer, a test for the wrap and 2^32 added, cannot be written", () => {
    const c = challenge("write-elapsed");
    for (const instruction of [
      "cmp w0, w1",
      "b.lo wrapped",
      "cset w2, cc",
      "csel w0, w0, w1, cc",
    ]) {
      const verdict = grade(c, { text: `${instruction}\nsub w0, w0, w1\nret` });
      expect(verdict.blocked, instruction).toContain("You have not met");
    }
  });

  it("write-elapsed: asks for the wrap in two of its four calls", () => {
    const c = challenge("write-elapsed");
    if (c.tests.kind !== "answers") throw new Error("answers");
    const wrapped = c.tests.cases.filter((t) => Number(t.given["w1"]) > Number(t.given["w0"]));
    expect(wrapped).toHaveLength(2);
  });

  it("one-step-past: a wrong result or a wrong C is told which it was, and never the value", () => {
    const c = challenge("one-step-past");
    const wrongResult = grade(c, { answers: { result: "4294967295", c: "0" } });
    expect(wrongResult.failures.map((f) => f.label)).toEqual([
      "The result of elapsed(0, 4294967295)",
    ]);
    const wrongC = grade(c, { answers: { result: "1", c: "1" } });
    expect(wrongC.failures.map((f) => f.label)).toEqual(["C after subs"]);
    expect(JSON.stringify([wrongResult, wrongC])).not.toMatch(/"1"|"0"/);
    // A negative number is not the same answer as the unsigned one with the same bits.
    expect(grade(c, { answers: { result: "-4294967295", c: "0" } }).passed).toBe(false);
  });

  it("one-step-past: both answers are asked for before anything is graded", () => {
    const c = challenge("one-step-past");
    expect(grade(c, { answers: { result: "1" } }).blocked).toContain("C after");
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
    // The ring, the two adders and the stepper wait for their predictions; nothing of any run is
    // on the page.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(4);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
  });
});
