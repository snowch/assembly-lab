// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ChallengeEditor,
  VIEW_STRINGS,
  createBook,
  fieldList,
  grade,
  introducedOf,
} from "@al/views";
import { assemble, message } from "@al/machine";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, testCount } from "@platform/lesson-schema";
import { LESSONS } from ".";

const load = LESSONS.find((l) => l.id === "constants-and-widths")!;
const lesson = LESSONS.find((l) => l.id === "building-constants")!;
const widths = LESSONS.find((l) => l.id === "register-widths")!;
const units = [load, lesson, widths];
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) =>
  units.flatMap((unit) => unit.challenges).find((c) => c.id === id)!;

it("separates testing a constant, building it and predicting register writes", () => {
  expect(units.map((unit) => unit.challenges.map((c) => c.id))).toEqual([
    [],
    ["build-1000000"],
    ["predict-two-registers"],
  ]);
  for (const unit of units) expect(checkLesson(unit)).toEqual([]);
  expect(load.sections.map((part) => part.kind)).toEqual([
    "question",
    "motivation",
    "prediction",
    "investigation",
  ]);
  expect(lesson.sections.map((part) => part.kind)).toEqual(["construction"]);
  expect(widths.introduces).toEqual(["w register", "x register"]);
});

it.each(units)("renders $id with its own local controls and gates", (unit) => {
  const view = render(<LessonView book={book} lesson={unit} storage={memoryStorage()} />);
  expect(
    view.container.querySelectorAll(".interactive-problem, .interactive-missing"),
  ).toHaveLength(0);
  expect(view.container.querySelectorAll("section.challenge")).toHaveLength(unit.challenges.length);
});

describe("the challenges", () => {
  it.each(["build-1000000", "predict-two-registers"])(
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

  it("build-1000000: the starting text is blocked with the machine's sentence against line 1", () => {
    const c = challenge("build-1000000");
    const verdict = grade(c, c.initial);
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toBe("Line 1: No single instruction can put `1000000` in a register.");
  });

  it("build-1000000: the text the tap editor builds passes, and so does movk alone with the lower half first", () => {
    const c = challenge("build-1000000");
    expect(grade(c, { text: "mov w0, #16960\nmovk w0, #15, lsl 16\nret" }).passed).toBe(true);
    expect(grade(c, { text: "movk w0, #16960\nmovk w0, #15, lsl 16\nret" }).passed).toBe(true);
  });

  it("build-1000000: only the lower half, or no ret, or an instruction not yet met, does not pass", () => {
    const c = challenge("build-1000000");
    const lower = grade(c, { text: "mov w0, 16960\nret" });
    expect(lower.passed).toBe(false);
    expect(lower.failures[0]?.actual).toEqual({ w0: "16960" });
    expect(grade(c, { text: "mov w0, 16960\nmovk w0, 15, lsl 16" }).passed).toBe(false);
    const gate = grade(c, { text: "mov w0, 16960\nadd w0, w0, 1\nret" });
    expect(gate.passed).toBe(false);
    expect(gate.blocked).toContain("Line 2:");
  });

  it("build-1000000: add and sub are met (Module 0) but not allowed here, and the sentence says what is allowed", () => {
    const c = challenge("build-1000000");
    const allowedHere = message("gate.notAllowedHere", { allowed: "`mov`, `movk` and `ret`" });
    expect(allowedHere).toBe("This challenge allows only `mov`, `movk` and `ret`.");
    for (const line of ["add w0, w0, 15", "sub w0, w0, 1"]) {
      const verdict = grade(c, { text: `mov w0, 16960\n${line}\nret` });
      expect(verdict.blocked, line).toBe(`Line 2: ${allowedHere}`);
      expect(verdict.blocked, line).not.toContain("not met");
      expect(verdict.blocked, line).not.toContain("yet");
    }
  });

  it("build-1000000: an instruction no lesson so far has introduced is still not met yet", () => {
    const c = challenge("build-1000000");
    // adds, subs and neg are Module 2's second lesson; b is in no lesson yet.
    for (const line of ["adds w0, w0, 1", "neg w0, w0", "b done"]) {
      const verdict = grade(c, { text: `mov w0, 16960\n${line}\nret` });
      expect(verdict.blocked, line).toContain("You have not met");
      expect(verdict.blocked, line).not.toContain("allows only");
    }
  });

  it("build-1000000: the editor shows the same sentence against the line", () => {
    const c = challenge("build-1000000");
    expect(introducedOf(c)).toEqual(new Set(["add", "sub", "ret", "bl", "mov", "movk"]));
    const errors = assemble("mov w0, 1\nadd w0, w0, 15\nret", {
      allowed: new Set(c.allowedConstructs),
      introduced: introducedOf(c),
    }).errors;
    expect(errors.map((e) => [e.line, e.key])).toEqual([[2, "gate.notAllowedHere"]]);
  });

  it("build-1000000: the keyboard row has the comma and w only, and the tap mode only w0", () => {
    const c = challenge("build-1000000");
    expect(c.initial.data?.["editor"]).toEqual({
      symbols: [",", "w"],
      registers: ["w0"],
      numberPad: true,
    });
    const { container } = render(
      <ChallengeEditor lesson={lesson} challenge={c} artifact={c.initial} onChange={() => {}} />,
    );
    expect([...container.querySelectorAll(".asm-bar .asm-key")].map((k) => k.textContent)).toEqual([
      ",",
      "w",
    ]);
  });

  it("the figures before the challenge hold neither of odometer_limit's instructions", () => {
    const construction = lesson.sections.findIndex((s) => s.kind === "construction");
    const props = [...load.sections, ...lesson.sections.slice(0, construction)]
      .flatMap((s) => s.interactives.map((x) => JSON.stringify(x.props)))
      .join("\n");
    expect(props).not.toContain("16960");
    expect(props).not.toContain("movk");
    expect(props).not.toContain("odometer_limit");
    // service_interval stays, with its test against the recorded listing.
    expect(props).toContain("service_interval");
  });

  it("the words before Build 1000000 give neither of 1000000's halves, in hexadecimal or decimal", () => {
    const construction = lesson.sections.findIndex((s) => s.kind === "construction");
    const words = [...load.sections, ...lesson.sections.slice(0, construction)]
      .flatMap((s) => [s.title, s.prose, s.details?.prose ?? ""])
      .join("\n");
    // The prediction names 1000000 as the Question's number and prints the halves of the other three.
    expect(words).toContain("0x0001 1170");
    expect(words).toContain("The fourth, 1000000, is the odometer limit from the first section");
    for (const half of ["0x000f 4240", "0x000f4240", "4240", "16960", "0xf,"])
      expect(words).not.toContain(half);
  });

  it("build-1000000: a second mov replaces the whole register, so mov then mov does not pass", () => {
    const c = challenge("build-1000000");
    expect(grade(c, { text: "mov w0, 16960\nmov w0, 15\nret" }).passed).toBe(false);
  });

  it("predict-two-registers: the answer a 32-bit comparison would let through fails", () => {
    const c = challenge("predict-two-registers");
    const kept = grade(c, { answers: { x1: String(0xffffffff00000005n), w2: "1000000" } });
    expect(kept.failures.map((f) => f.label)).toEqual(["x1 at the end"]);
    expect(JSON.stringify(kept)).not.toMatch(/\b5\b/);
    const wrapped = grade(c, { answers: { x1: "5", w2: String(1000000 + 2 ** 32) } });
    expect(wrapped.failures.map((f) => f.label)).toEqual(["w2 at the end"]);
  });

  it("predict-two-registers: a hexadecimal answer is refused as a number not written in decimal, not as 'not a whole number'", () => {
    const c = challenge("predict-two-registers");
    const verdict = grade(c, { answers: { x1: "0x5", w2: "1000000" } });
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toBe(VIEW_STRINGS.grader.notWhole("x1 at the end"));
    expect(verdict.blocked).toBe(
      "The answer for x1 at the end must be a whole number written in decimal.",
    );
    // Hexadecimal is still not accepted.
    expect(grade(c, { answers: { x1: "0x5", w2: "0x000f4240" } }).passed).toBe(false);
  });

  it("predict-two-registers: asks for both numbers before it grades anything", () => {
    const c = challenge("predict-two-registers");
    const verdict = grade(c, { answers: { x1: "5" } });
    expect(verdict.blocked).toBe(VIEW_STRINGS.grader.unanswered(fieldList(["w2 at the end"]), 1));
  });
});
