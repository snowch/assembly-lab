// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 2, lesson 2 as content: it parses and passes the schema's checks and the term gate, it
// names only figures and a model the book has, each challenge's reference passes its tests and its
// starting point does not, the tempting answer cannot be written with the gate's instructions, a
// wrong answer is answered without the right value, and the whole page renders with no figure
// problem.

import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ARITH_STRINGS, BOOK_ID, INTERACTIVES, STEPS, createBook, grade } from "@al/views";
import { LessonStore, LessonView, memoryStorage } from "@platform/lesson-runtime";
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
import { PROSE } from "./subtracting-and-the-tick-counter.prose";

const lesson = LESSONS.find((l) => l.id === "subtracting-and-the-tick-counter")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;

// Rendering a whole lesson and pressing its buttons takes a while on a busy machine.
vi.setConfig({ testTimeout: 30_000 });

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

  it("gates a third adder behind the construction challenge, after the challenge in the page", () => {
    const figures = lesson.sections.flatMap((s) => s.interactives);
    const gated = figures.filter((x) => typeof x.props["afterChallenge"] === "string");
    expect(gated.map((x) => x.id)).toEqual(["subtract-own"]);
    const mount = figures.find(
      (m) => m.props["challengeId"] === gated[0]!.props["afterChallenge"],
    )!;
    expect(figures.indexOf(mount)).toBeLessThan(figures.indexOf(gated[0]!));
    // It draws one of the challenge's own calls, which the learner's elapsed has just passed.
    const call = gated[0]!.props["call"] as { args: number[] };
    const c = challenge("write-elapsed");
    if (c.tests.kind !== "answers") throw new Error("answers");
    expect(c.tests.cases.map((t) => [t.given["w0"], t.given["w1"]])).toContainEqual(call.args);
  });

  it("says nowhere that a subtraction, or C, counts or detects how many times a counter wrapped", () => {
    const sentences = [
      ...learnerText(lesson),
      ...Object.values(ARITH_STRINGS.ring).flatMap((v) => (typeof v === "string" ? [v] : [])),
    ].flatMap((t) => t.split(/(?<=[.?!])\s+/));
    const about = sentences.filter(
      (t) =>
        /\bwraps?\b|\bwrapped\b/i.test(t) &&
        /how many|number of|counts? (the )?wraps|detect/i.test(t),
    );
    // The only such sentences are the denials.
    expect(about.length).toBeGreaterThan(0);
    expect(about.every((t) => /not record|does not/.test(t))).toBe(true);
    // And it says what a borrow means only under the assumption.
    expect(PROSE.generalisation).toContain(
      "When the counter advances normally and fewer than 2³² ticks have passed, C = 0 also means the counter wrapped once between the readings.",
    );
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

  it("write-elapsed: neg is taught by this lesson, so the gate says what the challenge allows, not that neg is not met", () => {
    const c = challenge("write-elapsed");
    const verdict = grade(c, { text: "neg w1, w1\nadd w0, w0, w1\nret" });
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toContain("This challenge allows only");
    expect(verdict.blocked).not.toContain("not met");
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
    // The adder after the construction challenge waits for it too.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(5);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    // The closed answer of the last section, and no other closed note.
    expect(container.querySelectorAll("details.lesson-details")).toHaveLength(1);
  });

  it("shows nothing of the negs explanation, the strip's split or the closed answer before they are earned", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    const page = container.textContent ?? "";
    expect(page).not.toContain("the largest signed 32-bit value");
    expect(page).not.toContain("Counting forward from 4294966296");
    expect(page).not.toContain(PROSE.elapsedAfter.slice(0, 40));
    expect(container.querySelector("#ix-counter-ring svg")).toBeNull();
    const answer = container.querySelector("details.lesson-details") as HTMLDetailsElement;
    expect(answer.open).toBe(false);
    expect(within(answer).getByText("Answer")).toBeTruthy();
  });

  it("opens the adder that follows the construction challenge only once elapsed passes, and then says what the subtraction kept", () => {
    // The work the learner has saved is read when the page opens: one page for each piece of work.
    const pageWith = (text: string | null) => {
      const storage = memoryStorage();
      if (text !== null)
        new LessonStore(storage, BOOK_ID, lesson.id).setChallenge("write-elapsed", (c) => ({
          ...c,
          artifact: { text },
        }));
      const view = render(<LessonView book={book} lesson={lesson} storage={storage} />);
      return view;
    };
    const none = pageWith(null);
    expect(none.container.querySelector("#ix-subtract-own .al-locked")).not.toBeNull();
    expect(none.container.textContent).not.toContain(PROSE.elapsedAfter.slice(0, 40));
    none.unmount();
    // An addition does not pass the four calls, so the adder stays shut.
    const wrong = pageWith("add w0, w0, w1\nret");
    expect(wrong.container.querySelector("#ix-subtract-own .al-locked")).not.toBeNull();
    expect(wrong.container.textContent).not.toContain(PROSE.elapsedAfter.slice(0, 40));
    wrong.unmount();
    const { container } = pageWith("sub w0, w0, w1\nret");
    const own = () => container.querySelector("#ix-subtract-own") as HTMLElement;
    expect(own().querySelector(".al-locked")).toBeNull();
    expect(own().querySelector(".al-adder-note")?.textContent).toContain(
      "A single 32-bit subtraction keeps the low 32 bits of now - then.",
    );
    // It opens at the final state of the call: 250 minus 4294967046 is 500, with a borrow.
    expect(own().querySelector('[data-line="result"]')?.textContent).toBe(
      "Result: 0x000001f4, which is 500",
    );
    expect(own().querySelector('[data-line="c"]')?.textContent).toBe("C = 0: a borrow was needed");
  });

  it("opens the two subtraction figures at their final states once the prediction is checked, side by side in order", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    const prediction = container.querySelector("#ix-predict-elapsed") as HTMLElement;
    fireEvent.click(within(prediction).getByRole("radio", { name: "2000" }));
    fireEvent.click(within(prediction).getByRole("button", { name: "Check your prediction" }));
    const line = (id: string, key: string) =>
      container.querySelector(`#ix-${id} [data-line="${key}"]`)?.textContent;
    expect(line("subtract-wrapped", "c")).toBe("C = 0: a borrow was needed");
    expect(line("subtract-no-wrap", "c")).toBe("C = 1: no borrow");
    expect(line("subtract-no-wrap", "result")).toBe("Result: 0x00001964, which is 6500");
    expect(line("subtract-wrapped", "result")).toBe("Result: 0x000007d0, which is 2000");
    const order = [...container.querySelectorAll("figure.interactive")].map((f) => f.id);
    expect(order.indexOf("ix-subtract-wrapped")).toBeLessThan(order.indexOf("ix-subtract-no-wrap"));
    // Each has its column-by-column view: the controls to step from the start.
    for (const id of ["subtract-wrapped", "subtract-no-wrap"])
      expect(
        within(container.querySelector(`#ix-${id}`) as HTMLElement).getByRole("button", {
          name: ARITH_STRINGS.adder.reset,
        }),
      ).toBeTruthy();
  });
});
