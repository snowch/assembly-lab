// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 2, lesson 1 as content: it parses and passes the schema's checks and the term gate, it
// names only figures and a model the book has, each challenge's reference passes its tests and its
// starting point does not, a wrong answer is answered without the right value, and the whole page
// renders with no figure problem.

import { fireEvent, render, within } from "@testing-library/react";
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
import { PROSE } from "./adding-and-the-flags.prose";

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

  it("gates a second adder behind the flags challenge, after the challenge in the page", () => {
    const figures = lesson.sections.flatMap((s) => s.interactives);
    const ids = figures.map((x) => x.id);
    const gated = figures.filter((x) => typeof x.props["afterChallenge"] === "string");
    expect(gated.map((x) => x.id)).toEqual(["add-carry-out"]);
    for (const x of gated) {
      const challengeId = x.props["afterChallenge"] as string;
      expect(lesson.challenges.map((c) => c.id)).toContain(challengeId);
      // The challenge is mounted by a figure of the same id as its mount, earlier in the page.
      const mount = figures.find((m) => m.props["challengeId"] === challengeId)!;
      expect(ids.indexOf(mount.id), x.id).toBeLessThan(ids.indexOf(x.id));
    }
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
    // Twelve choices are not listed: the sentence says to choose, and names none of them.
    expect(verdict.blocked).toBe(ARITH_STRINGS.grader.chooseFirst);
  });

  it("predict-flags: a wrong flag is told by its own rule, so no verdict shows empty lists", () => {
    const c = challenge("predict-flags");
    const verdict = grade(c, { answers: { ...c.reference.answers, "second-z": "1" } });
    expect(verdict.failures.map((f) => [f.label, f.detail])).toEqual([
      ["5 plus 3", `Z: ${ARITH_STRINGS.grader.flagRule.z}`],
    ]);
  });

  it("predict-flags: each wrong flag of an addition is named with the sentence for that flag, and no value", () => {
    const c = challenge("predict-flags");
    const wrong = { ...c.reference.answers, "third-n": "1", "third-c": "0", "third-v": "0" };
    const verdict = grade(c, { answers: wrong });
    expect(verdict.failures.map((f) => f.label)).toEqual(["0x80000000 plus 0x80000000"]);
    const rule = ARITH_STRINGS.grader.flagRule;
    expect(verdict.failures[0]?.detail).toBe(`N: ${rule.n} C: ${rule.c} V: ${rule.v}`);
    // The flags that were right are not named, and no value is given.
    expect(verdict.failures[0]?.detail).not.toContain("Z:");
    expect(verdict.failures[0]?.actual).toEqual({});
    expect(verdict.failures[0]?.expected).toEqual({});
  });

  it("predict-flags: the twelve choices are drawn as one group for each addition, N, Z, C and V in each", () => {
    const c = challenge("predict-flags");
    const groups = (
      c.initial.data?.["editor"] as {
        groups: { label: string; fields: { id: string; label: string }[] }[];
      }
    ).groups;
    expect(groups.map((g) => g.label)).toEqual([
      "`0xffffffff` plus 1",
      "5 plus 3",
      "`0x80000000` plus `0x80000000`",
    ]);
    expect(groups.flatMap((g) => g.fields.map((f) => f.id))).toEqual(c.fields.map((f) => f.id));
    expect(groups.every((g) => g.fields.map((f) => f.label).join("") === "NZCV")).toBe(true);
    // Every case asks for the rule of each wrong flag.
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases.every((t) => t.given["feedback"] === "rule")).toBe(true);
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
    expect(grade(c, { answers: {} }).blocked).toMatch(/^Nothing is graded until /);
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
    // The adder and the stepper wait for their predictions, and the second adder for the flags
    // challenge; nothing of any run is on the page.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(3);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    // The closed note on GCC's check, and the closed answer to the last section's question.
    expect(container.querySelectorAll("details.lesson-details")).toHaveLength(2);
  });

  it("draws the flags challenge as three separate groups of N, Z, C and V, with no answer chosen", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    const c = container.querySelector('section.challenge[data-challenge="predict-flags"]')!;
    const groups = c.querySelectorAll("fieldset.answer-group");
    expect(groups).toHaveLength(3);
    for (const g of groups)
      expect([...g.querySelectorAll(".answer-compact > legend")].map((l) => l.textContent)).toEqual(
        ["N", "Z", "C", "V"],
      );
    expect(c.querySelectorAll("input[type=radio]:checked")).toHaveLength(0);
  });

  it("keeps the answers that were right when the learner runs the tests, fails, and tries again", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    const c = container.querySelector(
      'section.challenge[data-challenge="predict-flags"]',
    ) as HTMLElement;
    const answers = { ...challenge("predict-flags").reference.answers, "third-v": "0" };
    for (const [id, value] of Object.entries(answers))
      fireEvent.click(c.querySelector(`[data-field="${id}"] input[value="${value}"]`)!);
    fireEvent.click(within(c).getByRole("button", { name: /Run tests/ }));
    expect(c.querySelector(".verdict-failure .verdict-detail")?.textContent).toBe(
      `V: ${ARITH_STRINGS.grader.flagRule.v}`,
    );
    // Every answer is still chosen, the wrong one too: nothing was cleared by the failure.
    const chosen = (id: string) =>
      (c.querySelector(`[data-field="${id}"] input:checked`) as HTMLInputElement | null)?.value;
    for (const [id, value] of Object.entries(answers)) expect(chosen(id), id).toBe(value);
    // Mend the one wrong flag: the others need no touching.
    fireEvent.click(c.querySelector('[data-field="third-v"] input[value="1"]')!);
    fireEvent.click(within(c).getByRole("button", { name: /Run tests/ }));
    expect(c.querySelector(".challenge-complete")).not.toBeNull();
  });

  it("shows the text after the flags challenge, and the adder it follows, only once the challenge passes", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    const note = PROSE.flagsAfter.split(". ")[0]!;
    expect(container.textContent).not.toContain(note);
    const c = container.querySelector(
      'section.challenge[data-challenge="predict-flags"]',
    ) as HTMLElement;
    for (const [id, value] of Object.entries(challenge("predict-flags").reference.answers!))
      fireEvent.click(c.querySelector(`[data-field="${id}"] input[value="${value}"]`)!);
    fireEvent.click(within(c).getByRole("button", { name: /Run tests/ }));
    expect(container.querySelector("#ix-add-carry-out .al-adder-note")?.textContent).toContain(
      note,
    );
  });

  it("opens no result before it is earned: the stepper and the adder wait for their predictions", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    for (const id of ["add-columns", "step-add", "add-carry-out"])
      expect(container.querySelector(`#ix-${id} .al-locked`), id).not.toBeNull();
    expect(container.querySelector(".al-adder-final")).toBeNull();
    expect(container.querySelector(".al-flag-tag")).toBeNull();
  });
});
