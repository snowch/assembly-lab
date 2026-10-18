// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createBook, grade, traceOf, type MemoryTraceCall, type RecordedProgram } from "@al/views";
import { LessonStore, LessonView, memoryStorage } from "@platform/lesson-runtime";
import { Lesson, checkLesson, testCount } from "@platform/lesson-schema";
import { productsAndWidths } from "./products-and-widths";
import { divisionAndRemainders } from "./division-and-remainders";
import * as R from "./products.listings";
const lessons = [productsAndWidths, divisionAndRemainders].map((l) => Lesson.parse(l));
const book = createBook({ title: "Assembly Lab", lessons });
const challenges = lessons.flatMap((l) => l.challenges);
const challenge = (id: string) => challenges.find((c) => c.id === id)!;
const figures = lessons.flatMap((l) => l.sections.flatMap((s) => s.interactives));
describe("Module 8 lessons", () => {
  it.each(lessons)("$id has ten sections and two mounted challenges", (lesson) => {
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections).toHaveLength(10);
    expect(lesson.challenges).toHaveLength(2);
  });
  it.each(challenges)("$id reference passes and starting program fails", (c) => {
    expect(grade(c, c.reference)).toEqual({ passed: true, total: testCount(c), failures: [] });
    expect(grade(c, c.initial).passed).toBe(false);
  });
  it("gates every computed diagram and stepper behind an earlier prediction", () => {
    for (const lesson of lessons) {
      const all = lesson.sections.flatMap((s) => s.interactives);
      all.forEach((f, i) => {
        if (!["memory-stepper", "product-halves", "division-parts"].includes(f.kind)) return;
        const gate = all.findIndex((other) => other.id === f.props["after"]);
        expect(gate).toBeGreaterThanOrEqual(0);
        expect(gate).toBeLessThan(i);
        expect(all[gate]!.kind).toBe("memory-prediction");
      });
    }
  });
  it.each([
    ["predict-low-product", 32, "0x00000000"],
    ["predict-late-widening", 64, "0x00000000fffffffe"],
    ["predict-signed-quotient", 32, "0xfffffffd"],
    ["predict-unsigned-remainder", 32, "0x00000004"],
  ] as const)("%s offers the exact model answer", (id, width, answer) => {
    const f = figures.find((f) => f.id === id)!;
    const r = traceOf(f.props["program"] as RecordedProgram, f.props["call"] as MemoryTraceCall);
    expect(
      `0x${BigInt.asUintN(width, r.result.final.x[0]!)
        .toString(16)
        .padStart(width / 4, "0")}`,
    ).toBe(answer);
    expect(f.props["options"]).toEqual(
      expect.arrayContaining([expect.objectContaining({ value: answer })]),
    );
  });
  it("rejects lost high bits and signed multiplication of unsigned inputs", () => {
    const c = challenge("write-wide-product");
    expect(grade(c, { text: "mul w0, w0, w1\nret" }).passed).toBe(false);
    expect(grade(c, { text: "smull x0, w0, w1\nret" }).passed).toBe(false);
  });
  it("keeps wide failure values exact beyond Number.MAX_SAFE_INTEGER", () => {
    const c = challenge("write-wide-product");
    const verdict = grade(c, c.initial);
    const failure = verdict.failures.find((f) => f.index === 1)!;
    expect(failure.expected["x0"]).toBe("18446744065119617025");
    expect(failure.actual["x0"]).toBe("1");
  });
  it("rejects wrong division reading, quotient return and swapped msub operands", () => {
    const c = challenge("write-remainder");
    for (const text of [
      R.REMAINDER_TEXT.replace("sdiv", "udiv"),
      "sdiv w0, w0, w1\nret",
      R.REMAINDER_TEXT.replace("w2, w1, w0", "w2, w0, w1"),
    ])
      expect(grade(c, { text }).passed).toBe(false);
  });
  it("rejects narrow products and premature division for consumption", () => {
    const c = challenge("write-consumption");
    expect(
      grade(c, { text: R.CONSUMPTION_TEXT.replace("umull x0, w0, w2", "mul w0, w0, w2") }).passed,
    ).toBe(false);
    expect(grade(c, { text: "udiv w0, w0, w1\nmov w2, #100\numull x0, w0, w2\nret" }).passed).toBe(
      false,
    );
  });
  it("rejects dividing by uninitialised upper bits above the w1 distance", () => {
    const c = challenge("write-consumption");
    expect(grade(c, { text: R.CONSUMPTION_TEXT.replace("mov w1, w1\n", "") }).passed).toBe(false);
    expect(grade(c, c.reference).passed).toBe(true);
  });
  it("accepts an alternative product-plus-add solution and a branchless A64 zero convention", () => {
    expect(
      grade(challenge("write-scaled-total"), { text: "mul w0, w0, w1\nadd w0, w0, w2\nret" })
        .passed,
    ).toBe(true);
    expect(
      grade(challenge("write-consumption"), {
        text: "mov w2, #100\numull x0, w0, w2\nmov w1, w1\nudiv x0, x0, x1\nret",
      }).passed,
    ).toBe(true);
  });
  it("offers phone-editor registers for every reference", () => {
    for (const c of challenges) {
      const editor = c.initial.data?.["editor"] as { registers: string[] };
      for (const r of c.reference.text!.match(/\b[wx]\d+\b/g) ?? [])
        expect(editor.registers).toContain(r);
    }
  });
  it.each(lessons)("$id renders all figures without premature results", (lesson) => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelectorAll(".interactive-problem,.interactive-missing")).toHaveLength(0);
    expect(container.querySelectorAll("section.lesson-section")).toHaveLength(10);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
  });
  it.each(lessons)("$id renders all unlocked diagrams", (lesson) => {
    const storage = memoryStorage();
    const store = new LessonStore(storage, "assembly-lab", lesson.id);
    for (const f of lesson.sections
      .flatMap((s) => s.interactives)
      .filter((f) => f.kind === "memory-prediction"))
      store.setSlot(f.id, { choice: "wrong" });
    const { container } = render(<LessonView book={book} lesson={lesson} storage={storage} />);
    expect(
      [...container.querySelectorAll(".interactive-problem,.interactive-missing")].map(
        (x) => x.textContent,
      ),
    ).toEqual([]);
  });
});
