// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 4, lesson 2 as content: it parses and passes the schema's checks and the term gate, it names
// only figures and a model the book has, each challenge's reference passes its tests and its starting
// point does not, the wrong answers are refused (the signed condition, the inclusive condition, the
// tests in the wrong order), the instructions the lesson has not met are refused, a wrong answer is
// told which field was wrong and never the value, and the whole page renders with no figure problem.

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
import { branches } from "./branches";
import {
  DESCRIBE_BGE,
  FUEL_WARNING_SHARED_RET_TEXT,
  FUEL_WARNING_STARTING_TEXT,
  FUEL_WARNING_TEXT,
} from "./branches.listings";

const lesson = LESSONS.find((l) => l.id === "branches")!;
const units = [
  lesson,
  ...["zero-and-threshold-branches", "register-and-bit-branches"].map((id) =>
    LESSONS.find((l) => l.id === id)!,
  ),
];
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) =>
  units.flatMap((unit) => unit.challenges).find((c) => c.id === id)!;
const text = (t: string) => ({ text: t });

describe("the lesson", () => {
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(branches)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual(
      SECTION_KINDS.filter(
        (kind) => !["construction", "explanation", "generalisation", "reflection"].includes(kind),
      ),
    );
    expect([lesson.module, lesson.order]).toEqual([4, 2]);
  });

  it("introduces branch, taken and wzr, and passes the term gate with every lesson before and after it", () => {
    expect(lesson.introduces).toEqual(["branch", "taken", "wzr"]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the words the brief withholds", () => {
    const withheld =
      /\b(jump\w*|goto|link register|stack|program counter|pipeline\w*|speculat\w*|sign extension|two's complement|encoding|opcode|mnemonic|immediate|barrel shifter|loops?|bic|mvn|bl)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
  });

  it("uses call only as the word for a test: five calls test it", () => {
    const uses = learnerText(lesson).flatMap((t) => t.match(/\bcall\w*\b[^.]*/gi) ?? []);
    expect(uses.every((u) => /^calls test it/i.test(u))).toBe(true);
  });

  it("uses word only for the warning word, and label only for an assembly label", () => {
    expect(learnerText(lesson).filter((t) => /(?<!warning )\bwords?\b/i.test(t))).toEqual([]);
    // "Field labels" is not part of the page's words; every other use is a label in the listing.
    const uses = learnerText(lesson).flatMap((t) => t.match(/[^.]*\blabel\w*[^.]*/gi) ?? []);
    expect(uses.length).toBeGreaterThan(0);
    expect(uses.filter((u) => /labelled/i.test(u))).toEqual([]);
  });

  it("carries an originality note that names the textbook example", () => {
    expect(lesson.originalityNote.textbookExample).toContain("flowchart");
    expect(lesson.originalityNote.howThisDiffers).toContain("describe");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
  });

  it("gates the stepper and the arrows behind the prediction before each, in the same lesson", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    const gated = lesson.sections
      .flatMap((s) => s.interactives)
      .filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => x.id)).toEqual([
      "step-describe",
      "describe-arrows",
      "step-describe-bge",
    ]);
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string), x.id).toBeLessThan(ids.indexOf(x.id));
  });

  it("counts the instructions run in the stepper, and starts the arrows at a gradient the last challenge does not ask about", () => {
    const stepper = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.kind === "stepper")!;
    expect(stepper.props["count"]).toBe(true);
    const arrows = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.kind === "branch-listing")!;
    expect(arrows.props["start"]).toBe(15);
    expect(arrows.props["presets"]).toEqual([15, 10, -15, 0]);
  });

  it("runs describe with bge on describe(10) in a stepper after the failure experiment's prediction, with flags and the count", () => {
    const stepper = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "step-describe-bge")!;
    expect(stepper.kind).toBe("stepper");
    expect(stepper.props["program"]).toEqual(DESCRIBE_BGE);
    expect(stepper.props["call"]).toEqual({ entry: "describe", args: [10] });
    expect(stepper.props["flags"]).toBe(true);
    expect(stepper.props["count"]).toBe(true);
    expect(stepper.props["after"]).toBe("predict-describe-bge");
    expect(lesson.sections.find((s) => s.kind === "failureExperiment")?.interactives).toContain(
      stepper,
    );
  });

  it("gives the construction challenge the gate cmp, b.cond, cbz, b, mov and ret, and a tap editor that can build labels", () => {
    const c = challenge("write-fuel-warning");
    expect(c.allowedConstructs).toEqual(["cmp", "b.cond", "cbz", "b", "mov", "ret"]);
    expect(c.palette).toEqual(["w0", "w1"]);
    expect(c.initial.text).toBe(FUEL_WARNING_STARTING_TEXT);
    expect(c.reference.text).toBe(FUEL_WARNING_TEXT);
    expect(testCount(c)).toBe(5);
    const editor = c.initial.data?.["editor"] as { labels: string[] };
    // Every label the reference defines or names can be tapped.
    for (const name of FUEL_WARNING_TEXT.match(/\.L\w+/g) ?? [])
      expect(editor.labels).toContain(name);
    for (const name of FUEL_WARNING_SHARED_RET_TEXT.match(/\.L\w+/g) ?? [])
      expect(editor.labels).toContain(name);
  });
});

describe("the challenges", () => {
  it.each(["write-fuel-warning", "count-describe-runs"])(
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

  it("write-fuel-warning: the starting point fails the first two calls and passes the rest", () => {
    const c = challenge("write-fuel-warning");
    const verdict = grade(c, c.initial);
    expect(verdict.failures.map((f) => f.label)).toEqual([
      "fuel_warning(0, 10)",
      "fuel_warning(9, 10)",
    ]);
  });

  it("write-fuel-warning: a second answer, with b.cs and two b instructions to one ret, also passes", () => {
    const c = challenge("write-fuel-warning");
    const verdict = grade(c, text(FUEL_WARNING_SHARED_RET_TEXT));
    expect(verdict.blocked).toBeUndefined();
    expect(verdict.passed).toBe(true);
  });

  it("write-fuel-warning: the GCC spelling blo passes, and so does lo", () => {
    const c = challenge("write-fuel-warning");
    expect(grade(c, text(FUEL_WARNING_TEXT.replace("b.cc", "blo"))).passed).toBe(true);
    expect(grade(c, text(FUEL_WARNING_TEXT.replace("b.cc", "b.lo"))).passed).toBe(true);
  });

  it("write-fuel-warning: the signed b.lt fails only the call with the top bit set, returning 1", () => {
    const c = challenge("write-fuel-warning");
    const verdict = grade(c, text(FUEL_WARNING_TEXT.replace("b.cc", "b.lt")));
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["fuel_warning(0x80000000, 10)"]);
    expect(verdict.failures[0]!.actual["w0"]).toBe("1");
  });

  it("write-fuel-warning: b.ls fails litres equal to reserve, returning 1", () => {
    const c = challenge("write-fuel-warning");
    const verdict = grade(c, text(FUEL_WARNING_TEXT.replace("b.cc", "b.ls")));
    expect(verdict.failures.map((f) => f.label)).toEqual(["fuel_warning(10, 10)"]);
    expect(verdict.failures[0]!.actual["w0"]).toBe("1");
  });

  it("write-fuel-warning: the compare before the test for 0 fails the call with 0, returning 1", () => {
    const c = challenge("write-fuel-warning");
    const wrong = [
      "cmp w0, w1",
      "b.cc .Llow",
      "cbz w0, .Lempty",
      "mov w0, 0",
      "ret",
      ".Llow:",
      "mov w0, 1",
      "ret",
      ".Lempty:",
      "mov w0, 2",
      "ret",
    ].join("\n");
    const verdict = grade(c, text(wrong));
    expect(verdict.failures.map((f) => f.label)).toEqual(["fuel_warning(0, 10)"]);
    expect(verdict.failures[0]!.actual["w0"]).toBe("1");
  });

  it("write-fuel-warning: cset, csel, tbz and bl are refused with the plain message, and b and blo are not", () => {
    const c = challenge("write-fuel-warning");
    for (const instruction of [
      "cset w0, lo",
      "csel w0, w0, w1, lo",
      "tbz w0, 3, .Lx",
      "bl fuel_warning",
    ]) {
      const verdict = grade(c, text(`${instruction}\n${FUEL_WARNING_TEXT}`));
      // One the course has not met yet, or one an earlier challenge allowed that this one does not.
      expect(verdict.blocked, instruction).toMatch(/You have not met|This challenge allows only/);
    }
    expect(grade(c, text(FUEL_WARNING_SHARED_RET_TEXT)).blocked).toBeUndefined();
  });

  it("write-fuel-warning: an undefined label is an error, and a run that never returns is a failed call", () => {
    const c = challenge("write-fuel-warning");
    expect(grade(c, text("cbz w0, .Lnowhere\nret")).blocked).toBeDefined();
    const spin = grade(c, text(".Lspin:\nb .Lspin"));
    expect(spin.passed).toBe(false);
    expect(spin.failures).toHaveLength(5);
  });

  it("count-describe-runs: a wrong field is named and the value is never told", () => {
    const c = challenge("count-describe-runs");
    const right = c.reference.answers!;
    const wrong = grade(c, { answers: { ...right, steps11: "6", resultM10: "1" } });
    expect(wrong.passed).toBe(false);
    expect(wrong.failures.map((f) => f.label)).toEqual([
      "instructions run for describe(11)",
      "describe(-10) returns",
    ]);
    expect(JSON.stringify(wrong)).not.toMatch(/"(5|0|2)"/);
  });

  it("count-describe-runs: −2 is the answer for describe(-11), written as a negative number or as its pattern", () => {
    const c = challenge("count-describe-runs");
    const right = c.reference.answers!;
    expect(grade(c, { answers: { ...right, resultM11: "-2" } }).passed).toBe(true);
    expect(grade(c, { answers: { ...right, resultM11: "4294967294" } }).passed).toBe(true);
    expect(grade(c, { answers: { ...right, resultM11: "2" } }).passed).toBe(false);
    // The number of instructions is exact.
    expect(grade(c, { answers: { ...right, stepsM10: "-6" } }).passed).toBe(false);
  });

  it("count-describe-runs: every field is asked for before anything is graded", () => {
    const c = challenge("count-describe-runs");
    expect(grade(c, { answers: { result11: "2" } }).blocked).toContain("instructions run for");
    expect(grade(c, { answers: { ...c.reference.answers!, steps11: "five" } }).blocked).toContain(
      "whole number",
    );
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
    // The stepper and the arrows wait for the prediction; nothing of either run is on the page.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(3);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(1);
    expect(container.querySelector('[data-figure="listing"]')).not.toBeNull();
  });
});
