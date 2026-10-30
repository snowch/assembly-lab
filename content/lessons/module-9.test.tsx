// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { checkLesson, testCount } from "@platform/lesson-schema";
import { grade, createBook } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { LESSONS } from ".";
import { FADE_TEXT, RESERVE_TEXT, COUNT_TEXT } from "./calls.listings";

const lessons = LESSONS.filter((l) => l.module === 9);
const challenges = lessons.flatMap((l) => l.challenges);

describe("Module 9 lesson contracts", () => {
  it.each(lessons)("$id has ordered sections and locally mounted exercises", (lesson) => {
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.challenges).toHaveLength(1);
    const figures = lesson.sections.flatMap((s) => s.interactives);
    const ungated = figures.filter(
      (f) => f.kind === "stack-stepper" && f.props["after"] === undefined,
    );
    expect(ungated.map((f) => f.id)).toEqual(
      lesson.id === "calls-and-returns" ? ["step-small-returning-call"] : [],
    );
    for (const challenge of lesson.challenges) {
      expect(figures.some((f) => f.props["challengeId"] === challenge.id)).toBe(true);
      expect(challenge.hints).toHaveLength(5);
    }
    for (const [i, figure] of figures.entries())
      if (figure.kind === "stack-stepper") {
        if (figure.id === "step-small-returning-call") continue;
        const gate = figures.findIndex((f) => f.id === figure.props["after"]);
        expect(gate).toBeGreaterThanOrEqual(0);
        expect(gate).toBeLessThan(i);
        expect(["memory-prediction", "loop-prediction"]).toContain(figures[gate]!.kind);
      }
  });
  it("completes the smaller call before introducing reserve preservation", () => {
    const small = lessons.find((l) => l.id === "calls-and-returns")!;
    const reserve = lessons.find((l) => l.id === "preserving-values-across-calls")!;
    expect(small.challenges.map((c) => c.id)).toEqual(["write-call-report"]);
    expect(small.sections.flatMap((s) => s.interactives).map((f) => f.id)).toContain(
      "step-small-returning-call",
    );
    expect(reserve.challenges.map((c) => c.id)).toEqual(["write-preserve-reserve"]);
    const figures = reserve.sections.flatMap((s) => s.interactives);
    expect(figures.findIndex((f) => f.id === "calls-and-returns-listing")).toBeLessThan(
      figures.findIndex((f) => f.id === "predict-calls-and-returns"),
    );
  });
  it("completes recursive frame repair before a separate progress and counting activity", () => {
    const frames = lessons.find((l) => l.id === "recursive-calls")!;
    const progress = lessons.find((l) => l.id === "making-recursive-progress")!;
    expect(frames.challenges.map((c) => c.id)).toEqual(["write-fade-sum"]);
    expect(progress.challenges.map((c) => c.id)).toEqual(["write-lit-count"]);
    const figures = frames.sections.flatMap((s) => s.interactives);
    expect(figures.find((f) => f.id === "step-recursive-calls")!.props["after"]).toBe(
      "predict-recursive-calls",
    );
    const deepest = figures.find((f) => f.id === "inspect-recursive-calls-stack")!;
    expect(deepest.props["initialStep"]).toBe(22);
    expect(deepest.props["after"]).toBe("predict-recursive-calls");
    expect(progress.sections.flatMap((s) => s.interactives).map((f) => f.id)).toEqual([
      "predict-recursive-calls-failure",
      "step-recursive-calls-failure",
      "write-lit-count",
    ]);
    expect(progress.sections.map((s) => s.prose).join("\n")).toContain(
      "The simulator uses a fixed, prepared stack",
    );
  });
  it.each(challenges)("$id reference passes and starter fails", (challenge) => {
    expect(grade(challenge, challenge.reference)).toEqual({
      passed: true,
      total: testCount(challenge),
      failures: [],
    });
    expect(grade(challenge, challenge.initial).passed).toBe(false);
  });
  it("requires an executed helper call even when an inline calculation returns the right answer", () => {
    const c = challenges.find((c) => c.id === "write-call-report")!;
    const v = grade(c, {
      text: "report_once:\n lsr w0,w0,#1\n add w0,w0,#1\n ret\nhalf_distance:\n lsr w0,w0,#1\n ret",
    });
    expect(v.passed).toBe(false);
    expect(v.failures).toHaveLength(5);
    expect(v.failures.every((f) => f.detail?.includes("half_distance"))).toBe(true);
  });
  it("requires recursive calls for nonzero cases while allowing the zero base case", () => {
    const c = challenges.find((c) => c.id === "write-lit-count")!;
    const v = grade(c, {
      text: "lit_count:\n mov w1,#0\nagain:\n cbz w0,done\n add w1,w1,#1\n lsr w0,w0,#1\n b again\ndone:\n mov w0,w1\n ret",
    });
    expect(v.passed).toBe(false);
    expect(v.failures).toHaveLength(4);
    expect(v.failures.map((f) => f.index)).toEqual([1, 2, 3, 4]);
  });
  it("rejects saving only w19 and losing the caller's high bits", () => {
    const c = challenges.find((c) => c.id === "write-preserve-reserve")!;
    const broken = RESERVE_TEXT.replace("str x19", "str w19").replace("ldr x19", "ldr w19");
    const verdict = grade(c, { text: broken });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.some((f) => f.actual?.["x19"] !== f.expected?.["x19"])).toBe(true);
  });
  it("rejects an omitted SP restoration even if the function eventually returns", () => {
    const c = challenges.find((c) => c.id === "write-lit-count")!;
    const broken = COUNT_TEXT.replace("ldp x29, x30, [sp], #16", "ldp x29, x30, [sp]");
    expect(grade(c, { text: broken }).passed).toBe(false);
  });
  it("rejects a recursive return that loses saved x19", () => {
    const c = challenges.find((c) => c.id === "write-fade-sum")!;
    expect(
      grade(c, { text: FADE_TEXT.replace(/ldr\s+x19, \[sp, 16\]/, "mov x19, #0") }).passed,
    ).toBe(false);
  });
  it.each(lessons)("$id renders all figures without a props problem", (lesson) => {
    const book = createBook({ title: "Assembly Lab", lessons });
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelector(".interactive-problem")).toBeNull();
    expect(container.querySelectorAll(".al-locked")).toHaveLength(
      lesson.id === "recursive-calls" ? 2 : 1,
    );
  });
});
