// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { readFileSync } from "node:fs";
import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Lesson, SECTION_KINDS, checkLesson, testCount } from "@platform/lesson-schema";
import { grade, createBook } from "@al/views";
import { DEFAULT_STRINGS } from "../../platform/lesson-runtime/src/strings";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { fromCToInstructions } from "./from-c-to-instructions";
import { compileALoop } from "./compile-a-loop";
import { compileC } from "@al/compiler";
import { runC } from "../../packages/views/src/compilerRun";
import { assemblyOf, parseListing } from "../../packages/views/src/listing";
import * as C from "./c-compiler.listings";

const lessons = [fromCToInstructions, compileALoop].map((l) => Lesson.parse(l));
describe("Module 10 lesson contracts", () => {
  it.each(lessons)(
    "$id has ten sections, two mounted exercises and gated compilation",
    (lesson) => {
      expect(checkLesson(lesson)).toEqual([]);
      expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
      expect(lesson.challenges).toHaveLength(2);
      const figures = lesson.sections.flatMap((s) => s.interactives);
      for (const challenge of lesson.challenges) {
        expect(figures.some((f) => f.props["challengeId"] === challenge.id)).toBe(true);
        expect(challenge.hints).toHaveLength(5);
      }
      for (const [i, figure] of figures.entries())
        if (figure.kind === "compiler-playground") {
          const gate = figures.findIndex((f) => f.id === figure.props["after"]);
          expect(gate).toBeGreaterThanOrEqual(0);
          expect(gate).toBeLessThan(i);
          expect(figures[gate]!.kind).toBe("trace-prediction");
        }
    },
  );
  it.each(lessons.flatMap((l) => l.challenges))(
    "$id reference passes and starter fails",
    (challenge) => {
      expect(grade(challenge, challenge.reference)).toEqual({
        passed: true,
        total: testCount(challenge),
        failures: [],
      });
      expect(grade(challenge, challenge.initial).passed).toBe(false);
    },
  );
  it("blocks malformed C and rejects unsafe executed paths without awarding completion", () => {
    const challenge = lessons[0]!.challenges[1]!;
    expect(grade(challenge, { text: "int f(int a) { return a; }" }).blocked).toBeTruthy();
    const verdict = grade(challenge, {
      text: "unsigned f(unsigned a, unsigned b, unsigned c) { return a / (b-b); }",
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures).toHaveLength(5);
    expect(verdict.failures.every((f) => f.detail?.includes("zero"))).toBe(true);
  });
  it("shows C test inputs, actual return and expected return in a failed card", () => {
    const lesson = lessons[0]!;
    const book = createBook({ title: "Assembly Lab", lessons });
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    const challenge = container.querySelector('[data-challenge="write-cap-charge"]')!;
    fireEvent.click(
      within(challenge as HTMLElement).getByRole("button", { name: DEFAULT_STRINGS.challenge.run }),
    );
    const failure = challenge.querySelector(".verdict-failure")!;
    expect(failure.querySelector(".verdict-detail")).toBeNull();
    expect(failure.querySelector(".verdict-values")).toHaveTextContent("w0=6");
    expect(failure.querySelector(".verdict-values")).toHaveTextContent("w1=4");
    expect(failure.querySelector(".verdict-values")).toHaveTextContent("w2=20");
    expect(failure.querySelector(".verdict-values")).toHaveTextContent("w0=0");
    expect(failure.querySelector(".verdict-values")).toHaveTextContent("w0=20");
  });
  it.each(lessons)("$id renders every figure and C challenge", (lesson) => {
    const book = createBook({ title: "Assembly Lab", lessons });
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelector(".interactive-problem,.interactive-missing")).toBeNull();
    expect(container.querySelectorAll(".al-locked")).toHaveLength(2);
    expect(container.querySelectorAll(".al-c-editor")).toHaveLength(1);
  });
});
describe("Module 10 checked numbers and recorded programs", () => {
  it.each([
    [C.TRIP_SOURCE, [6, 4], 31],
    [C.WRONG_TRIP_SOURCE, [6, 4], 24],
    [C.ACCUMULATED_SOURCE, [3, 4], 12],
    [C.WRONG_ACCUMULATED_SOURCE, [3, 4], 16],
    [C.WRONG_ACCUMULATED_SOURCE, [0, 4], 4],
    [C.ACCUMULATED_SOURCE, [0, 4], 0],
    [C.DIM_SOURCE, [0xffffffff, 32], 0],
    [C.CAP_SOURCE, [0x80000000, 2, 100], 0],
  ] as const)("executes source with %j to %j", (source, args, expected) => {
    const result = runC(source, args);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(expected);
  });
  it.each([
    [C.TRIP_SOURCE, "trip_charge"],
    [C.ACCUMULATED_SOURCE, "accumulated_charge"],
    [C.CAP_SOURCE, "cap_charge"],
    [C.DIM_SOURCE, "course_while"],
    [C.WRONG_TRIP_SOURCE, "ui-missing-fee"],
    [C.WRONG_ACCUMULATED_SOURCE, "ui-extra-iteration"],
    [C.CAP_START, "ui-cap-start"],
    [C.DIM_START, "ui-dim-start"],
  ])("retains the source and generated output for %s", (source, name) => {
    const record = JSON.parse(
      readFileSync(`${process.cwd()}/docs/notes/module-10/compiler/${name}.course.json`, "utf8"),
    );
    const compiled = compileC(source!);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;
    expect(record.source).toBe(source);
    expect(record.listing).toBe(compiled.listing);
    // The record pins emitted instructions and their source lines. Loop-phase cues are
    // additional AST-derived UI metadata, independently checked in compiler.test.ts.
    expect(record.lineMap).toEqual(
      compiled.lineMap.map(({ assemblyLine, cLine }) => ({ assemblyLine, cLine })),
    );
    const phases = new Set(
      compiled.lineMap.flatMap((entry) => (entry.loopPhase ? [entry.loopPhase] : [])),
    );
    if (["accumulated_charge", "course_while", "ui-extra-iteration"].includes(name!)) {
      expect(phases).toContain("condition");
      expect(phases).toContain("body");
      expect(phases).toContain("repeat");
      if (name !== "course_while") {
        expect(phases).toContain("initialisation");
        expect(phases).toContain("update");
      }
    } else expect(phases.size).toBe(0);
  });
  it.each([
    [C.TRIP, "module10-trip-charge-course"],
    [C.ACCUMULATED, "module10-accumulated-charge-course"],
    [C.WRONG_TRIP, "module10-ui-missing-fee"],
    [C.WRONG_ACCUMULATED, "module10-ui-extra-iteration"],
  ] as const)("keeps displayed code in the real-tools corpus", (program, name) => {
    const corpus = readFileSync(`${process.cwd()}/scripts/real-tools/corpus/${name}.s`, "utf8");
    const lines = assemblyOf(parseListing(program.listing)).trim();
    const normalise = (s: string) =>
      s
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim();
    expect(normalise(corpus)).toContain(normalise(lines));
  });
});
