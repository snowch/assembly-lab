// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 3's first lesson as content: it parses and passes the schema's checks and the term gate,
// it names only figures and a model the book has, each challenge's reference passes its tests and
// its starting point does not, a wrong answer is answered without the right value, the written
// challenge accepts only the instructions its task allows, and the whole page renders with no
// figure problem.

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
import { masks, MASKS_INSTRUCTIONS } from "./masks";
import { PROSE } from "./masks.prose";
import { SET_GEAR_START_TEXT } from "./logic-shifts-masks.listings";

const lesson = LESSONS.find((l) => l.id === "masks")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

describe("the lesson", () => {
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(masks)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
    expect([lesson.module, lesson.order]).toEqual([3, 0]);
  });

  it("introduces mask and field, and passes the term gate with every lesson written", () => {
    expect(lesson.introduces).toEqual(["mask", "field"]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the terms the lesson withholds", () => {
    // Lesson 2's terms are its own; the rest wait for later modules.
    const withheld =
      /\b(shift\w*|sign extension|condition\w*|branch\w*|two's complement|encoding|opcode|mnemonic|immediate|barrel)\b/i;
    expect(learnerText(lesson).filter((t) => withheld.test(t))).toEqual([]);
  });

  it("carries an originality note that names the textbook example and the lesson's difference", () => {
    expect(lesson.originalityNote.textbookExample).toContain("file permissions");
    expect(lesson.originalityNote.howThisDiffers).toContain("`set_gear`");
    expect(lesson.originalityNote.howThisDiffers).toContain("`bfi`");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
    expect(Object.keys(book.timeModelNotes)).toEqual([STEPS]);
  });

  it("gates the bit figure and the stepper behind the prediction before each, in the same lesson", () => {
    const all = lesson.sections.flatMap((s) => s.interactives);
    const ids = all.map((x) => x.id);
    const gated = all.filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => [x.id, x.props["after"]])).toEqual([
      ["mask-bits", "predict-minus-five"],
      ["read-gear", "predict-minus-five"],
      ["step-no-clear", "predict-no-clear"],
      ["compare-no-clear", "predict-no-clear"],
    ]);
    // The two figures after the written challenge wait for the challenge, not for a prediction.
    const waits = all.filter((x) => "afterRun" in x.props || "afterChallenge" in x.props);
    expect(waits.map((x) => [x.id, x.props["afterRun"] ?? x.props["afterChallenge"]])).toEqual([
      ["step-solution", "write-set-gear"],
      ["compare-bfi", "write-set-gear"],
    ]);
    for (const x of waits)
      expect(ids.indexOf("write-set-gear-here")).toBeLessThan(ids.indexOf(x.id));
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string)).toBeLessThan(ids.indexOf(x.id));
  });

  it("does not show the recipe for set_gear, the challenge's answer, in the Investigation's figure", () => {
    const figure = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "mask-bits")!;
    const entries = (figure.props["functions"] as { entry: string }[]).map((f) => f.entry);
    expect(entries).toEqual(["warn_fuel", "clear_door", "toggle_lights"]);
    expect(JSON.stringify(figure.props)).not.toContain("7u << 4");
  });

  it("shows only instructions its gate has: the lesson's, and ret", () => {
    const allowed = new Set<string>([...MASKS_INSTRUCTIONS, "ret"]);
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
    for (const c of lesson.challenges) {
      walk(c.initial.data);
      for (const l of parseListing(`${c.reference.text ?? ""}\n${c.initial.text ?? ""}`))
        if (l.kind === "instruction") used.add(l.text.split(" ")[0] as string);
    }
    expect([...used].filter((m) => !allowed.has(m))).toEqual([]);
    expect(used.size).toBeGreaterThan(5);
  });

  it("gives the written challenge the gate and, orr, lsl and ret, and the registers w0 to w3", () => {
    const c = challenge("write-set-gear");
    expect(c.allowedConstructs).toEqual(["and", "orr", "lsl", "ret"]);
    expect(c.palette).toEqual(["w0", "w1", "w2", "w3"]);
    expect(c.initial.text).toBe(SET_GEAR_START_TEXT);
    expect(testCount(c)).toBe(4);
  });
});

describe("the challenges", () => {
  it.each(["write-set-gear", "trace-three-results"])(
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

  it("write-set-gear: the starting point fails all four calls", () => {
    const c = challenge("write-set-gear");
    const verdict = grade(c, c.initial);
    expect(verdict.failures.map((f) => f.label)).toEqual([
      "set_gear(0x35, 5)",
      "set_gear(0, 7)",
      "set_gear(0xffffffff, 0)",
      "set_gear(0x1234, 13)",
    ]);
  });

  it("write-set-gear: leaving out the clear, or the mask on g, fails the calls that need them", () => {
    const c = challenge("write-set-gear");
    const noClear = grade(c, {
      text: "and w1, w1, 7\nlsl w1, w1, 4\norr w0, w0, w1\nret",
    });
    expect(noClear.passed).toBe(false);
    expect(noClear.failures.map((f) => f.label)).toEqual([
      "set_gear(0x35, 5)",
      "set_gear(0xffffffff, 0)",
      "set_gear(0x1234, 13)",
    ]);
    const noMask = grade(c, { text: "lsl w1, w1, 4\nand w0, w0, -113\norr w0, w0, w1\nret" });
    expect(noMask.passed).toBe(false);
    expect(noMask.failures.map((f) => f.label)).toEqual(["set_gear(0x1234, 13)"]);
  });

  it("write-set-gear: GCC's bfi is an instruction the task does not allow, and is refused", () => {
    const c = challenge("write-set-gear");
    const verdict = grade(c, { text: "bfi w0, w1, 4, 3\nret" });
    expect(verdict.passed).toBe(false);
    // bfi is taught in this lesson, so the gate says what the challenge allows, not "not met".
    expect(verdict.blocked).toContain("This challenge allows only");
    expect(verdict.blocked).not.toContain("not met");
  });

  it("trace-three-results: a wrong answer is rejected without the right value", () => {
    const c = challenge("trace-three-results");
    const verdict = grade(c, {
      answers: { after_orr: "0x2b", after_and: "0x2a", the_gear: "0x2" },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["after and"]);
    expect(JSON.stringify(verdict)).not.toContain("0x22");
  });

  it("trace-three-results: each wrong field gets its own sentence, never the value, and a chained `and` gets the chained one", () => {
    const c = challenge("trace-three-results");
    const right = { after_orr: "0x2b", after_and: "0x22", the_gear: "0x2" };
    // The verdict shows no code marks: they come out as curly quotes. Put them back to compare.
    const detail = (answers: Record<string, string>) =>
      grade(c, { answers: { ...right, ...answers } }).failures.map((f) =>
        f.detail?.replace(/“([^”]*)”/g, "`$1`"),
      );
    expect(detail({ after_orr: "0x2a" })).toEqual([PROSE.traceFeedback.after_orr]);
    expect(detail({ after_and: "0x2a" })).toEqual([PROSE.traceFeedback.after_and]);
    expect(detail({ the_gear: "0x5" })).toEqual([PROSE.traceFeedback.the_gear]);
    // 0x23 is what the same `and` gives on 0x2b, the `orr` result, run on the model: the chained mistake.
    expect(detail({ after_and: "0x23" })).toEqual([PROSE.traceFeedback.chained]);
    expect(detail({ after_and: "23" })).toEqual([PROSE.traceFeedback.chained]);
    // Any other wrong `and` answer is the ordinary sentence, and the right answer is none.
    expect(detail({ after_and: "0x24" })).toEqual([PROSE.traceFeedback.after_and]);
    expect(detail({})).toEqual([]);
    // Two wrong fields, two cases, two sentences.
    expect(detail({ after_orr: "0x0", the_gear: "0x0" })).toEqual([
      PROSE.traceFeedback.after_orr,
      PROSE.traceFeedback.the_gear,
    ]);
    // No sentence gives the value of any of the three answers.
    const all = Object.values(PROSE.traceFeedback).join(" ");
    expect(all).not.toMatch(/0x2b|0x22|0x23/);
    expect(all).not.toMatch(/\b0x2\b(?!a)/);
  });

  it("trace-three-results: answers are read as hexadecimal, with or without 0x", () => {
    const c = challenge("trace-three-results");
    expect(grade(c, { answers: { after_orr: "2B", after_and: "22", the_gear: "2" } }).passed).toBe(
      true,
    );
    // 34 is 0x34 here, not 0x22.
    expect(
      grade(c, { answers: { after_orr: "0x2b", after_and: "34", the_gear: "2" } }).passed,
    ).toBe(false);
  });

  it("trace-three-results: an answer that is not hexadecimal is asked for again, and nothing is graded", () => {
    const c = challenge("trace-three-results");
    const verdict = grade(c, {
      answers: { after_orr: "0x2b", after_and: "banana", the_gear: "2" },
    });
    expect(verdict.blocked).toContain("hexadecimal");
    expect(grade(c, { answers: { after_orr: "0x2b" } }).blocked).toContain("the gear");
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
    // The bit figure, the stepper and the comparison wait for their predictions, and the solution
    // stepper and the comparison with GCC's function wait for the challenge; nothing of any run is
    // on the page.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(6);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    expect(container.querySelectorAll('[data-figure="warning-word"] .al-bit')).toHaveLength(32);
  });
});
