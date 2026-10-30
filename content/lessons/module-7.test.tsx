// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createBook, grade, traceOf, type MemoryTraceCall, type RecordedProgram } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, testCount } from "@platform/lesson-schema";
import { LESSONS } from ".";
import * as A from "./arrays.listings";
const lessons = LESSONS.filter((l) => l.module === 7);
const traversingArrays = lessons.find((l) => l.id === "traversing-arrays")!;
const challenges = lessons.flatMap((l) => l.challenges!);
const figures = lessons.flatMap((l) => l.sections.flatMap((s) => s.interactives ?? []));
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => challenges.find((c) => c.id === id)!;
describe("Module7 lessons", () => {
  it("separates element selection from pointer traversal before the strings investigation", () => {
    expect(lessons.map((l) => [l.id, l.module, l.order])).toEqual([
      ["array-addresses", 7, 0],
      ["traversing-arrays", 7, 1],
      ["zero-terminated-strings", 7, 2],
    ]);
    for (const l of lessons) {
      expect(checkLesson(l)).toEqual([]);
      expect(l.challenges).toHaveLength(l.id === "zero-terminated-strings" ? 2 : 1);
    }
  });
  it("every memory figure returns with its actual fixture", () => {
    for (const f of figures.filter((f) => f.kind.startsWith("memory-"))) {
      const r = traceOf(
        f.props!["program"] as RecordedProgram,
        f.props!["call"] as MemoryTraceCall,
      );
      expect(r.result.stop.kind, f.id).toBe("returned");
    }
  });
  it("gates memory diagrams behind earlier predictions", () => {
    for (const l of lessons) {
      const fs = l.sections.flatMap((s) => s.interactives ?? []);
      for (const [i, f] of fs.entries())
        if (f.kind === "memory-stepper") {
          if (l.id === "traversing-arrays") {
            expect(f.props!["after"]).toBeUndefined();
            continue;
          }
          const p = fs.findIndex((p) => p.id === f.props!["after"]);
          expect(p).toBeGreaterThanOrEqual(0);
          expect(p).toBeLessThan(i);
          expect(fs[p]!.kind).toBe("memory-prediction");
        }
    }
  });
  it.each(challenges)("$id reference passes and starting work fails", (c) => {
    expect(grade(c, c.reference)).toEqual({ passed: true, total: testCount(c), failures: [] });
    expect(grade(c, c.initial).passed).toBe(false);
  });
  it("rejects an unscaled array index", () =>
    expect(
      grade(challenge("write-read-trip"), { text: A.READ_TRIP_TEXT.replace(", lsl #2", "") })
        .passed,
    ).toBe(false));
  it("rejects a sum that advances by one byte or misses the empty case", () => {
    const c = challenge("write-sum-trips");
    expect(grade(c, { text: A.SUM_TRIPS_TEXT.replace("], #4", "], #1") }).passed).toBe(false);
    expect(grade(c, { text: A.SUM_TRIPS_TEXT.replace("cbz w1, done\n", "") }).passed).toBe(false);
  });
  it("rejects counting the terminator and ignoring the supplied capacity", () => {
    const c = challenge("write-label-length");
    expect(grade(c, { text: A.WALK_LABEL.listing }).passed).toBe(false);
    expect(
      grade(c, {
        text: A.LENGTH_TEXT.replace("cbz w2, done\nadd x0, x0, #1", "add x0, x0, #1\ncbz w2, done"),
      }).passed,
    ).toBe(false);
  });
  it("rejects treating ASCII zero as the terminator and counting every byte", () => {
    const c = challenge("write-count-marker");
    expect(
      grade(c, { text: A.COUNT_MARKER_TEXT.replace("cbz w3, done", "cmp w3, #48\nb.eq done") })
        .passed,
    ).toBe(false);
    expect(grade(c, { text: A.COUNT_MARKER_TEXT.replace("b.ne next\n", "") }).passed).toBe(false);
  });
  it("offers every reference address and register in the phone editor", () => {
    for (const c of challenges) {
      const e = c.initial.data!["editor"] as { addresses: string[]; registers: string[] };
      for (const r of c.reference.text!.match(/\b[wx]\d+\b/g) ?? [])
        expect(e.registers).toContain(r);
      for (const address of c.reference.text!.match(/\[[^\]]+\](?:, #\d+)?/g) ?? [])
        expect(e.addresses).toContain(address);
    }
  });
  it.each(lessons)("$id renders all sections without revealing a result", (lesson) => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelectorAll("section.lesson-section")).toHaveLength(
      lesson.sections.length,
    );
    expect(container.querySelectorAll("section.challenge")).toHaveLength(lesson.challenges.length);
    expect(container.querySelectorAll(".interactive-problem,.interactive-missing")).toHaveLength(0);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
  });
  it("post-index visual highlights the old address while showing the advanced pointer", () => {
    const storage = memoryStorage();
    const { container } = render(
      <LessonView book={book} lesson={traversingArrays} storage={storage} />,
    );
    const figure = container.querySelector('#ix-step-array-offset [data-figure="memory-stepper"]')!;
    expect(figure).not.toBeNull();
    fireEvent.change(figure.querySelector("select")!, { target: { value: "2" } });
    const next = [...figure.querySelectorAll("button")].find((b) => b.textContent === "Next")!;
    fireEvent.click(next);
    expect(figure.querySelector('[data-register="x0"]')!.textContent).toContain("0000000000410004");
    expect(figure.querySelector('[data-address="0x410000"]')!.getAttribute("data-access")).toBe(
      "loaded",
    );
  });
});
