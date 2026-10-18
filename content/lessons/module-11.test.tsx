// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  INTERACTIVES,
  STEPS,
  createBook,
  grade,
  traceOf,
  type MemoryTraceCall,
  type RecordedProgram,
} from "@al/views";
import { LessonStore, LessonView, memoryStorage } from "@platform/lesson-runtime";
import { Lesson, SECTION_KINDS, checkLesson, modelProblems } from "@platform/lesson-schema";
import { cAndOverflow } from "./c-and-overflow";
import { checkedArithmetic } from "./checked-arithmetic";
import { CHECKED_TRIP, CHECKED_TRIP_WRONG, CHECKED_RESULT_ADDRESS } from "./c-boundaries.listings";
const lessons = [cAndOverflow, checkedArithmetic].map((l) => Lesson.parse(l));
const challenges = lessons.flatMap((l) => l.challenges);

describe("Module 11 lesson contracts", () => {
  it("has two lessons, ten sections and two mounted exercises per lesson", () => {
    expect(lessons.map((l) => l.id)).toEqual(["c-and-overflow", "checked-arithmetic"]);
    for (const l of lessons) {
      expect(checkLesson(l)).toEqual([]);
      expect(l.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
      expect(l.challenges).toHaveLength(2);
    }
    expect(modelProblems(lessons, [STEPS])).toEqual([]);
  });
  it.each(challenges)("$id: its reference passes and the starting program fails", (c) => {
    expect(grade(c, c.reference).passed).toBe(true);
    expect(grade(c, c.initial).passed).toBe(false);
  });
  it("keeps the final solution hidden until the saved program actually passes", () => {
    const lesson = lessons[0]!;
    const challenge = lesson.challenges.find((c) => c.id === "write-safe-increment")!;
    const store = new LessonStore(memoryStorage(), "assembly-lab", lesson.id);
    const interactive = lesson.sections
      .flatMap((s) => s.interactives)
      .find((f) => f.id === "safe-increment-listing")!;
    const Figure = INTERACTIVES[interactive.kind]!;
    const { container } = render(
      <Figure lesson={lesson} interactive={interactive} store={store} />,
    );
    expect(container.querySelector(".al-listing")).toBeNull();
    act(() =>
      store.setChallenge(challenge.id, (current) => ({
        ...current,
        artifact: challenge.reference,
      })),
    );
    expect(container.querySelector(".al-listing")).not.toBeNull();
    act(() =>
      store.setChallenge(challenge.id, (current) => ({ ...current, artifact: challenge.initial })),
    );
    expect(container.querySelector(".al-listing")).toBeNull();
  });
  it("does not mark the unchanged return as different when the other compilation inserts instructions", () => {
    const lesson = lessons[0]!;
    const interactive = lesson.sections
      .flatMap((s) => s.interactives)
      .find((f) => f.id === "compare-increment-options")!;
    const Figure = INTERACTIVES[interactive.kind]!;
    const { container } = render(
      <Figure
        lesson={lesson}
        interactive={interactive}
        store={new LessonStore(memoryStorage(), "assembly-lab", lesson.id)}
      />,
    );
    const returns = [...container.querySelectorAll(".al-pair-insn")].filter(
      (row) => row.querySelector("code")?.textContent === "ret",
    );
    expect(returns).toHaveLength(2);
    for (const row of returns) expect(row.getAttribute("data-differs")).toBe("false");
    expect(container.querySelectorAll('[data-differs="true"]').length).toBeGreaterThan(0);
  });
  it("does not accept a signed range check for the unsigned fuel input", () => {
    const c = challenges.find((c) => c.id === "write-fuel-fits")!;
    expect(grade(c, { text: "cmp w0, #255\ncset w0, le\nret" }).passed).toBe(false);
  });
  it("rejects carry as the signed checked-add result, and rejects overwriting the next record", () => {
    const c = challenges.find((c) => c.id === "write-checked-trip")!;
    expect(grade(c, { text: CHECKED_TRIP_WRONG.listing }).passed).toBe(false);
    expect(grade(c, { text: "adds w0, w0, w1\nstr x0, [x2]\ncset w0, vs\nret" }).passed).toBe(
      false,
    );
  });
  it("all run figures have a valid model run and every stepper follows a prediction", () => {
    for (const lesson of lessons) {
      const all = lesson.sections.flatMap((s) => s.interactives);
      for (const [i, f] of all.entries()) {
        if (f.kind === "challenge") continue;
        expect(INTERACTIVES[f.kind]).toBeDefined();
        if (!f.props["call"]) continue;
        const trace = traceOf(
          f.props["program"] as RecordedProgram,
          f.props["call"] as MemoryTraceCall,
        );
        expect(trace.result.stop.kind, f.id).toBe("returned");
        if (f.kind === "stepper" || f.kind === "memory-stepper") {
          const earlier = all.findIndex((p) => p.id === f.props["after"]);
          expect(earlier, f.id).toBeGreaterThanOrEqual(0);
          expect(earlier, f.id).toBeLessThan(i);
          expect(all[earlier]!.kind).toMatch(/prediction$/);
        }
      }
    }
  });
  it("pins every overflow fixture's signed result and leaves the following record intact", () => {
    const pairs = [
      [1, 2, 0],
      [2147483647, 1, 1],
      [-2147483648, -1, 1],
      [-1, 1, 0],
      [0, 0, 0],
      [2147483647, 0, 0],
      [-2147483648, 0, 0],
    ];
    for (const [a, b, overflow] of pairs) {
      const trace = traceOf(CHECKED_TRIP, {
        entry: "checked_trip",
        args: [a!, b!, { value: CHECKED_RESULT_ADDRESS, width: 64 }],
        memory: [170, 187, 204, 221, 17, 34, 51, 68],
      });
      expect(trace.result.final.x[0]).toBe(BigInt(overflow!));
      const bytes = trace.result.read(CHECKED_RESULT_ADDRESS, 8)!;
      const sum = (a! + b!) >>> 0;
      expect([...bytes]).toEqual([
        sum & 255,
        (sum >>> 8) & 255,
        (sum >>> 16) & 255,
        sum >>> 24,
        17,
        34,
        51,
        68,
      ]);
    }
  });
  it.each(lessons)(
    "$id renders without unsupported figures or exposed stepper answers",
    (lesson) => {
      const book = createBook({ title: "Assembly Lab", lessons });
      const { container } = render(
        <LessonView lesson={lesson} book={book} storage={memoryStorage()} />,
      );
      expect(container.querySelectorAll(".interactive-problem")).toHaveLength(0);
      expect(
        container.querySelectorAll('[data-figure="stepper"], [data-figure="memory-stepper"]'),
      ).toHaveLength(0);
    },
  );
});
