// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 4, lesson 1 as content: it parses and passes the schema's checks and the term gate, it names
// only figures and a model the book has, each challenge's reference passes its tests and its
// starting point does not, the wrong answers are refused (the signed condition, the larger and not
// the smaller, a condition of the wrong kind), the instructions the lesson has not met are refused, a
// wrong answer is told which field was wrong and never the value, and the whole page renders with no
// figure problem.

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
import { compareAndChoose } from "./compare-and-choose";

const lesson = LESSONS.find((l) => l.id === "compare-and-choose")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

describe("the lesson", () => {
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(compareAndChoose)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
    expect([lesson.module, lesson.order]).toEqual([4, 0]);
  });

  it("introduces condition, and passes the term gate with every lesson before and after it", () => {
    expect(lesson.introduces).toEqual(["condition"]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the words the lesson after it introduces, or the ones the brief withholds", () => {
    const withheld =
      /\b(branch\w*|labels?|taken|wzr|bgt|cbz|tbz|jump\w*|goto|link register|stack|program counter|pipeline\w*|speculat\w*|sign extension|two's complement|encoding|opcode|mnemonic|immediate|barrel shifter|loops?)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
    // `b` as an instruction: a lone b between code marks or spaces.
    expect(learnerText(lesson).filter((t) => /`b\s/.test(t))).toEqual([]);
  });

  it("uses call only as the word for a test: five calls test it", () => {
    const uses = learnerText(lesson).flatMap((t) => t.match(/\bcalls?\b[^.]*/gi) ?? []);
    expect(uses.every((u) => /^calls test it/i.test(u))).toBe(true);
  });

  it("uses word only for the warning word, and bic, mvn and bl nowhere", () => {
    expect(learnerText(lesson).filter((t) => /\b(bic|mvn|bl)\b/.test(t))).toEqual([]);
    expect(learnerText(lesson).filter((t) => /(?<!warning )\bwords?\b/i.test(t))).toEqual([]);
  });

  it("carries an originality note that names the textbook example", () => {
    expect(lesson.originalityNote.textbookExample).toContain("larger of two numbers");
    expect(lesson.originalityNote.howThisDiffers).toContain("steeper_s");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
  });

  it("gates the listings and the stepper behind the prediction before each, in the same lesson", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    const gated = lesson.sections
      .flatMap((s) => s.interactives)
      .filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => x.id)).toEqual(["compare-steeper", "step-steeper-ge"]);
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string), x.id).toBeLessThan(ids.indexOf(x.id));
  });

  it("gives the construction challenge the gate cmp, csel and ret, and the two registers", () => {
    const c = challenge("write-less-fuel");
    expect(c.allowedConstructs).toEqual(["cmp", "csel", "ret"]);
    expect(c.palette).toEqual(["w0", "w1"]);
    expect(c.initial.text).toBe("ret");
    expect(c.reference.text).toBe("cmp w0, w1\ncsel w0, w0, w1, cc\nret");
    expect(testCount(c)).toBe(5);
  });

  it("offers the keys the challenge uses: commas and w, no # and no number pad", () => {
    const c = challenge("write-less-fuel");
    expect(c.initial.data?.["editor"]).toEqual({
      symbols: [",", "w"],
      registers: ["w0", "w1"],
      numberPad: false,
    });
  });

  it("starts the condition table at a pair the last challenge does not ask about", () => {
    const table = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.kind === "condition-table")!;
    expect(table.props["start"]).toEqual(["8", "8"]);
    expect(JSON.stringify(table.props)).not.toMatch(/0xfffffffb|4294967291|-5/);
  });
});

describe("the challenges", () => {
  it.each(["write-less-fuel", "read-four-conditions"])(
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

  it("write-less-fuel: the starting point fails (7, 3) and (0x80000000, 1), the others it passes", () => {
    const c = challenge("write-less-fuel");
    const verdict = grade(c, c.initial);
    expect(verdict.failures.map((f) => f.label)).toEqual([
      "less_fuel(7, 3)",
      "less_fuel(0x80000000, 1)",
    ]);
  });

  it("write-less-fuel: the signed condition lt fails the two calls with the top bit set, and returns 0x80000000", () => {
    const c = challenge("write-less-fuel");
    const verdict = grade(c, { text: "cmp w0, w1\ncsel w0, w0, w1, lt\nret" });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual([
      "less_fuel(0x80000000, 1)",
      "less_fuel(1, 0x80000000)",
    ]);
    // Unsigned, as the expected value is: a card never sets a signed number beside an unsigned one.
    for (const f of verdict.failures) expect(f.actual["w0"]).toBe("2147483648");
  });

  it("write-less-fuel: the larger of two (hi) fails, and so does the compare the wrong way round", () => {
    const c = challenge("write-less-fuel");
    expect(grade(c, { text: "cmp w0, w1\ncsel w0, w0, w1, hi\nret" }).passed).toBe(false);
    // lo is the other spelling of cc, and passes.
    expect(grade(c, { text: "cmp w0, w1\ncsel w0, w0, w1, lo\nret" }).passed).toBe(true);
    expect(grade(c, { text: "cmp w1, w0\ncsel w0, w0, w1, cc\nret" }).passed).toBe(false);
    expect(grade(c, { text: "cmp w1, w0\ncsel w0, w1, w0, cc\nret" }).passed).toBe(true);
  });

  it("write-less-fuel: instructions the lesson has not met are refused with the plain message", () => {
    const c = challenge("write-less-fuel");
    for (const instruction of [
      "cset w0, cc",
      "b.cc done",
      "cbz w0, done",
      "lsr w0, w0, 31",
      "subs w0, w0, w1",
    ]) {
      const verdict = grade(c, { text: `${instruction}\ncmp w0, w1\ncsel w0, w0, w1, cc\nret` });
      // One the course has not met yet, or one an earlier challenge allowed that this one does not.
      expect(verdict.blocked, instruction).toMatch(/You have not met|This challenge allows only/);
    }
  });

  it("write-less-fuel: five calls, two with the top bit of one value set", () => {
    const c = challenge("write-less-fuel");
    if (c.tests.kind !== "answers") throw new Error("answers");
    const top = c.tests.cases.filter(
      (t) => Number(t.given["w0"]) >= 0x80000000 || Number(t.given["w1"]) >= 0x80000000,
    );
    expect(c.tests.cases).toHaveLength(5);
    expect(top).toHaveLength(2);
  });

  it("read-four-conditions: a wrong field is named and the value is never told", () => {
    const c = challenge("read-four-conditions");
    const wrong = grade(c, { answers: { ge: "1", cs: "1", lt: "1", cc: "0" } });
    expect(wrong.passed).toBe(false);
    expect(wrong.failures.map((f) => f.label)).toEqual(["Whether ge holds"]);
    const swapped = grade(c, { answers: { ge: "1", cs: "0", lt: "0", cc: "1" } });
    expect(swapped.failures.map((f) => f.label)).toEqual([
      "Whether ge holds",
      "Whether cs holds",
      "Whether lt holds",
      "Whether cc holds",
    ]);
    expect(JSON.stringify([wrong, swapped])).not.toMatch(/"1"|"0"/);
  });

  it("read-four-conditions: 1 for yes and 0 for no are the only answers, and a blank is not graded", () => {
    const c = challenge("read-four-conditions");
    expect(grade(c, { answers: { ge: "2", cs: "1", lt: "1", cc: "0" } }).passed).toBe(false);
    expect(grade(c, { answers: { ge: "yes", cs: "1", lt: "1", cc: "0" } }).blocked).toContain(
      "whole number",
    );
    expect(grade(c, { answers: { ge: "0", cs: "1", lt: "1" } }).blocked).toContain("cc");
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
    // The two listings and the stepper wait for their predictions; nothing of either run is on the page.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(2);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    expect(container.querySelector('[data-figure="condition-table"]')).not.toBeNull();
  });
});
