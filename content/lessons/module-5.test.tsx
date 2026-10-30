// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  INTERACTIVES,
  STEPS,
  createBook,
  grade,
  passedChallenge,
  traceOf,
  viewAt,
  wValue,
} from "@al/views";
import { LessonStore, LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, modelProblems, termProblems, testCount } from "@platform/lesson-schema";
import { LESSONS } from ".";
import { DIM_DO, DIM_UP_TEXT, DIM_DOWN_TEXT, DIM_UNTIL_DARK_TEXT } from "./loops.listings";

const lessons = LESSONS.filter((lesson) => lesson.module === 5);
const challenge = (id: string) => lessons.flatMap((l) => l.challenges).find((c) => c.id === id)!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });

describe("Module 5 lesson structure", () => {
  it("contains five focused lessons with locally mounted challenges", () => {
    expect(lessons.map((l) => [l.id, l.module, l.order])).toEqual([
      ["counting-up", 5, 0],
      ["writing-an-upward-loop", 5, 1],
      ["counting-down", 5, 2],
      ["testing-before-and-after", 5, 3],
      ["stopping-when-work-ends", 5, 4],
    ]);
    for (const lesson of lessons) {
      expect(checkLesson(lesson)).toEqual([]);
      expect(lesson.sections.length).toBeGreaterThan(0);
      const mounted = lesson.sections
        .flatMap((s) => s.interactives)
        .filter((f) => f.kind === "challenge");
      expect(mounted.map((f) => f.props["challengeId"])).toEqual(
        lesson.challenges.map((c) => c.id),
      );
    }
    expect(termProblems(LESSONS)).toEqual([]);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
  });

  it("uses registered figures and gates observations behind earlier predictions", () => {
    for (const lesson of lessons) {
      const figures = lesson.sections.flatMap((s) => s.interactives);
      const ids = figures.map((f) => f.id);
      for (const f of figures) {
        if (f.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(f.kind);
        if (typeof f.props["after"] === "string") {
          expect(ids.indexOf(f.props["after"])).toBeGreaterThanOrEqual(0);
          expect(ids.indexOf(f.props["after"])).toBeLessThan(ids.indexOf(f.id));
        }
        if (f.kind === "loop-runs") expect(f.props["after"]).toBeDefined();
      }
    }
  });

  it("keeps the final count-up calls out of all preceding figures", () => {
    const up = lessons[0]!;
    const props = up.sections.flatMap((s) => s.interactives.map((x) => x.props));
    for (const args of [
      [128, 7, 7],
      [128, 7, 8],
      [128, 7, 9],
    ])
      expect(JSON.stringify(props)).not.toContain(JSON.stringify(args));
  });

  it("shows the broken countdown's assembly, count and flags behind its prediction", () => {
    const figure = lessons
      .find((l) => l.id === "testing-before-and-after")!
      .sections.flatMap((s) => s.interactives)
      .find((f) => f.id === "step-dim-down-wrong")!;
    expect(figure.kind).toBe("stepper");
    expect(figure.props["registers"]).toEqual([0, 1]);
    expect(figure.props["flags"]).toBe(true);
    expect(figure.props["count"]).toBe(true);
    expect(figure.props["after"]).toBe("predict-dim-do-zero");
    expect(figure.props["call"]).toEqual({ entry: "dim_down_wrong", args: [128, 3], maxSteps: 20 });
  });

  it("gates the do-loop stepper and exposes the zero count wrapping on its first subtraction", () => {
    const figure = lessons
      .find((l) => l.id === "testing-before-and-after")!
      .sections.flatMap((s) => s.interactives)
      .find((f) => f.id === "step-dim-do-zero")!;
    expect(figure.kind).toBe("stepper");
    expect(figure.props["program"]).toEqual(DIM_DO);
    expect(figure.props["registers"]).toEqual([0, 1]);
    expect(figure.props["flags"]).toBe(true);
    expect(figure.props["count"]).toBe(true);
    expect(figure.props["branchStatus"]).toBe(true);
    expect(figure.props["after"]).toBe("predict-dim-do-zero");
    expect(figure.props["call"]).toEqual({ entry: "dim_do", args: [128, 0], maxSteps: 20 });
    const trace = traceOf(DIM_DO, { entry: "dim_do", args: [128, 0], maxSteps: 20 });
    const afterSub = viewAt(trace, 2);
    expect(wValue(afterSub.state, 1)).toBe(0xffffffff);
    expect(afterSub.state.flags.z).toBe(false);
  });

  it("offers every register and reference label in the tap editor", () => {
    for (const c of lessons
      .flatMap((l) => l.challenges)
      .filter((c) => c.gradedDirection === "write")) {
      const editor = c.initial.data?.["editor"] as { registers: string[]; labels: string[] };
      for (const register of c.reference.text!.match(/\bw\d+\b/g) ?? [])
        expect(editor.registers).toContain(register);
      for (const label of c.reference.text!.match(/^\w+(?=:)/gm) ?? [])
        expect(editor.labels).toContain(label);
    }
  });
});

describe("Module 5 challenges", () => {
  it.each(["write-dim-up", "count-dim-up-runs", "write-dim-down", "write-dim-until-dark"])(
    "%s: reference passes every case and starting work does not",
    (id) => {
      const c = challenge(id);
      expect(grade(c, c.reference)).toEqual({ passed: true, total: testCount(c), failures: [] });
      expect(grade(c, c.initial).passed).toBe(false);
    },
  );

  it("rejects signed count-up comparisons across the top bit", () => {
    const c = challenge("write-dim-up");
    const wrong = DIM_UP_TEXT.replace("b.cs", "b.ge").replace("b.cc", "b.lt");
    const verdict = grade(c, { text: wrong });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.index)).toContain(6);
  });

  it("rejects an omitted first test, reversed repetition and inclusive end points", () => {
    const c = challenge("write-dim-up");
    for (const text of [
      DIM_UP_TEXT.replace("cmp w1, w2\nb.cs done\n", ""),
      DIM_UP_TEXT.replace("b.cc again", "b.cs again"),
      DIM_UP_TEXT.replace("b.cs done", "b.hi done").replace("b.cc again", "b.ls again"),
    ])
      expect(grade(c, { text }).passed).toBe(false);
  });

  it("rejects removing the initial zero check and using the wrong subtraction branch", () => {
    const c = challenge("write-dim-down");
    expect(grade(c, { text: DIM_DOWN_TEXT.replace("cbz w1, done\n", "") }).passed).toBe(false);
    expect(grade(c, { text: DIM_DOWN_TEXT.replace("b.ne again", "b.eq again") }).passed).toBe(
      false,
    );
  });

  it("rejects a return value that happens to be correct only after hitting the instruction limit", () => {
    const c = challenge("write-dim-until-dark");
    const verdict = grade(c, { text: DIM_DOWN_TEXT });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.index)).toEqual([2, 3, 4]);
    expect(verdict.failures.every((f) => Object.keys(f.actual).length === 0)).toBe(true);
  });

  it("requires both capstone stopping tests", () => {
    const c = challenge("write-dim-until-dark");
    expect(grade(c, { text: DIM_UNTIL_DARK_TEXT.replace("cbz w1, done\n", "") }).passed).toBe(
      false,
    );
    expect(grade(c, { text: DIM_UNTIL_DARK_TEXT.replace("cbz w0, done\n", "") }).passed).toBe(
      false,
    );
  });

  it("rejects instructions outside the lesson challenge's gate", () => {
    for (const id of ["write-dim-up", "write-dim-down", "write-dim-until-dark"]) {
      const c = challenge(id);
      for (const ins of ["bl again", "mul w0, w0, w1", "mov w0, #0"]) {
        expect(grade(c, { text: `${ins}\n${c.reference.text}` }).blocked).toMatch(
          /You have not met|This challenge allows only/,
        );
      }
    }
    const down = challenge("write-dim-down");
    expect(
      grade(down, { text: DIM_DOWN_TEXT.replace("subs w1, w1, #1", "sub w1, w1, #1\ncmp w1, #0") })
        .blocked,
    ).toBeDefined();
  });

  it("grades all final answer fields from the model and never reveals a wrong field's expected answer", () => {
    const c = challenge("count-dim-up-runs");
    const verdict = grade(c, {
      answers: { ...c.reference.answers, resultTwo: "31", stepsOne: "6" },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.index)).toEqual([3, 4]);
    expect(verdict.failures.every((f) => Object.keys(f.expected).length === 0)).toBe(true);
    expect(grade(c, { answers: { resultZero: "128" } }).blocked).toBeDefined();
  });

  it("regrades restored work instead of trusting an old completion mark", () => {
    const lesson = lessons.find((l) => l.id === "stopping-when-work-ends")!;
    const c = challenge("write-dim-until-dark");
    const store = new LessonStore(memoryStorage(), "assembly-lab", lesson.id);
    store.setChallenge(c.id, (current) => ({
      ...current,
      artifact: { text: "ret" },
      verdict: { passed: true, total: 6, failures: [] },
    }));
    expect(passedChallenge(lesson, store.get(), c.id)).toBe(false);
    store.setChallenge(c.id, (current) => ({
      ...current,
      artifact: c.reference,
      verdict: { passed: false, total: 6, failures: [] },
    }));
    expect(passedChallenge(lesson, store.get(), c.id)).toBe(true);
  });
});

describe("Module 5 pages", () => {
  it.each(lessons)("$id renders its selected sections and no broken figure", (lesson) => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelectorAll("section.lesson-section")).toHaveLength(
      lesson.sections.length,
    );
    expect(container.querySelectorAll("section.challenge")).toHaveLength(lesson.challenges.length);
    expect(
      [...container.querySelectorAll(".interactive-problem, .interactive-missing")].map(
        (n) => n.textContent,
      ),
    ).toEqual([]);
    expect(container.querySelectorAll(".al-outcome, .al-loop-bars")).toHaveLength(0);
    expect(container.querySelectorAll(".al-locked")).toHaveLength(
      lesson.sections
        .flatMap((s) => s.interactives)
        .filter((f) => typeof f.props["after"] === "string").length,
    );
  });
});
