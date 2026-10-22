// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SECTION_KINDS, checkLesson, termProblems } from "@platform/lesson-schema";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { createBook, gradeWritten } from "@al/views";
import { LESSONS } from ".";
import { TRIP_DISTANCE } from "./meet-the-machine.listings";
import { NATIVE_CALL, BROKEN_TRIP, TWICE_TEXT, NATIVE_CASES } from "./native.listings";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import EVIDENCE from "./module-12.evidence.json" with { type: "json" };

const lessons = LESSONS.filter((lesson) => lesson.module === 12);
afterEach(cleanup);
describe("final core native module", () => {
  it("precedes optional A without changing its stored-work ID", () => {
    expect(lessons.map((l) => l.id)).toEqual([
      "from-function-to-executable",
      "debug-native-instructions",
    ]);
    expect(LESSONS.at(-1)?.id).toBe("same-c-on-a32");
    expect(LESSONS.at(-1)?.module).toBe(13);
    expect(termProblems(LESSONS)).toEqual([]);
  });
  it.each(lessons)(
    "$id: renders ten sections, a mounted challenge, and no broken figures",
    (lesson) => {
      expect(checkLesson(lesson)).toEqual([]);
      expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
      const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
      const { container } = render(
        <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
      );
      expect(container.querySelector(".al-problem")).toBeNull();
      expect(container.querySelectorAll("section.lesson-section")).toHaveLength(10);
      expect(container.querySelectorAll("section.challenge")).toHaveLength(1);
      for (const challenge of lesson.challenges) {
        expect(gradeWritten(challenge, challenge.initial).passed).toBe(false);
        expect(gradeWritten(challenge, challenge.reference).passed).toBe(true);
        expect(challenge.hints).toHaveLength(5);
      }
    },
  );
  it("agrees with each recorded native stop, including ret leaving w0 unwritten", () => {
    for (const [program, record] of [
      [TRIP_DISTANCE, EVIDENCE.good],
      [BROKEN_TRIP, EVIDENCE.broken],
    ] as const) {
      const trace = traceOf(program, NATIVE_CALL);
      expect(record.registers).toEqual(
        Array.from({ length: 5 }, (_, k) =>
          [0, 1, 2, 3].map((n) => wValue(viewAt(trace, k).state, n)),
        ),
      );
      expect(viewAt(trace, 4).written.has(0)).toBe(false);
      expect(record.pcOffsets).toEqual([0, 4, 8, 12]);
      expect(record.returnTo).toBe("main");
    }
    expect(EVIDENCE.stdout).toBe("trip_distance(120, 85, 42, 15) = 232");
    expect(EVIDENCE.exitCode).toBe(0);
    expect(EVIDENCE.brokenExitCode).toBe(1);
  });
  it("checks behaviour instead of exact reference text and shares native cases", () => {
    const challenge = lessons[1]!.challenges[0]!;
    const alternative = TWICE_TEXT.replace(
      "sub w0, w0, w3\nsub w0, w0, w3",
      "add w3, w3, w3\nsub w0, w0, w3",
    );
    expect(gradeWritten(challenge, { text: alternative }).passed).toBe(true);
    const harness = readFileSync(
      new NodeURL("../../apps/course/public/native/verify-challenge.c", import.meta.url),
      "utf8",
    );
    for (const [a, b, c, d] of NATIVE_CASES)
      expect(harness.replace(/\s/g, "")).toContain(`{${a},${b},${c},${d},${a + b + c - 2 * d}}`);
  });
});
