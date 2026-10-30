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
  type MemoryTraceCall,
  type RecordedProgram,
} from "@al/views";
import { LessonStore, LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, modelProblems, termProblems, testCount } from "@platform/lesson-schema";
import { LESSONS } from ".";
import {
  ADJUST_GRADIENT_TEXT,
  COPY_DISTANCE_TEXT,
  READ_SENSORS_TEXT,
  SAVE_DISTANCE_TEXT,
  SENSOR_ADDRESS,
} from "./memory.listings";

const lessons = LESSONS.filter((lesson) => lesson.module === 6);
const challenge = (id: string) => lessons.flatMap((l) => l.challenges).find((c) => c.id === id)!;
const figures = lessons.flatMap((l) => l.sections.flatMap((s) => s.interactives));
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });

describe("Module 6 lesson structure", () => {
  it("separates first memory transfers, transfer widths, load interpretation and register conversion", () => {
    expect(lessons.map((l) => [l.id, l.module, l.order])).toEqual([
      ["memory-and-addresses", 6, 0],
      ["transfer-widths", 6, 1],
      ["loading-widths", 6, 2],
      ["extending-register-values", 6, 3],
    ]);
    for (const lesson of lessons) {
      expect(checkLesson(lesson)).toEqual([]);
      const expected: Record<string, string[]> = {
        "memory-and-addresses": ["write-save-distance"],
        "transfer-widths": ["write-copy-distance"],
        "loading-widths": ["write-adjust-gradient", "write-read-sensors"],
        "extending-register-values": [],
      };
      expect(lesson.challenges.map((c) => c.id)).toEqual(expected[lesson.id]);
    }
    expect(termProblems(LESSONS)).toEqual([]);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
  });

  it("keeps memory predictions local and opens the separate register investigations", () => {
    for (const lesson of lessons) {
      const all = lesson.sections.flatMap((s) => s.interactives);
      for (const [index, figure] of all.entries()) {
        if (figure.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(figure.kind);
        if (figure.kind !== "memory-stepper") continue;
        if (lesson.id === "extending-register-values") {
          expect(figure.props["after"]).toBeUndefined();
          continue;
        }
        expect(figure.props["after"]).toBeTypeOf("string");
        const earlier = all.findIndex((f) => f.id === figure.props["after"]);
        expect(earlier).toBeGreaterThanOrEqual(0);
        expect(earlier).toBeLessThan(index);
        expect(all[earlier]!.kind).toBe("memory-prediction");
      }
    }
  });

  it("keeps pointer and byte-order qualifications local to each memory activity", () => {
    for (const id of ["memory-and-addresses", "transfer-widths"]) {
      const lesson = lessons.find((l) => l.id === id)!;
      const prose = lesson.sections.map((s) => s.prose).join("\n");
      expect(prose).toContain("its C pointer must also refer to storage for the declared type");
      expect(prose).toContain("the byte at the lowest address supplies the lowest 8 bits");
    }
    const widths = lessons.find((l) => l.id === "transfer-widths")!;
    expect(widths.sections.map((s) => s.prose).join("\n")).toContain(
      "Keep the address elsewhere if you will need it again",
    );
    const wide = widths.sections
      .flatMap((s) => s.interactives)
      .filter((f) => ["step-read-long", "step-save-long"].includes(f.id));
    expect(wide).toHaveLength(2);
    for (const figure of wide) expect(figure.props["after"]).toBe("predict-wide-fuel-store");
  });

  it("every memory figure returns normally with its published fixture and call", () => {
    for (const figure of figures.filter((f) =>
      ["memory-stepper", "memory-prediction"].includes(f.kind),
    )) {
      const trace = traceOf(
        figure.props["program"] as RecordedProgram,
        figure.props["call"] as MemoryTraceCall,
      );
      expect(trace.result.stop.kind, figure.id).toBe("returned");
    }
  });

  it("pins all four predictions to the actual figure runs", () => {
    for (const [id, answer] of [
      ["predict-read-distance", "0x12345678"],
      ["predict-wide-fuel-store", "78 56 34 12"],
      ["predict-signed-gradient", "0xfffffff9"],
      ["predict-unsigned-gradient", "0x00000103"],
    ]) {
      const figure = figures.find((f) => f.id === id)!;
      const trace = traceOf(
        figure.props["program"] as RecordedProgram,
        figure.props["call"] as MemoryTraceCall,
      );
      const value =
        id === "predict-wide-fuel-store"
          ? [...trace.result.read(SENSOR_ADDRESS, 4)!]
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(" ")
          : `0x${BigInt.asUintN(32, trace.result.final.x[0]!).toString(16).padStart(8, "0")}`;
      expect(value).toBe(answer);
      expect(figure.props["options"]).toEqual(
        expect.arrayContaining([expect.objectContaining({ value: answer })]),
      );
    }
  });

  it("provides tap-editor registers and complete address operands for every reference", () => {
    for (const c of lessons.flatMap((l) => l.challenges)) {
      const editor = c.initial.data?.["editor"] as { registers: string[]; addresses: string[] };
      for (const register of c.reference.text!.match(/\b[wx]\d+\b/g) ?? [])
        expect(editor.registers).toContain(register);
      for (const address of c.reference.text!.match(/\[[^\]]+\]/g) ?? [])
        expect(editor.addresses).toContain(address);
    }
  });

  it("mounts the C signed-conversion qualification beside the register extension examples", () => {
    const section = lessons
      .find((l) => l.id === "extending-register-values")!
      .sections.find((s) => s.kind === "question")!;
    expect(section.details?.prose).toContain("implementation-defined");
  });
});

describe("Module 6 challenges", () => {
  it.each([
    "write-save-distance",
    "write-copy-distance",
    "write-adjust-gradient",
    "write-read-sensors",
  ])("%s: reference passes all cases and initial work fails", (id) => {
    const c = challenge(id);
    expect(grade(c, c.reference)).toEqual({ passed: true, total: testCount(c), failures: [] });
    expect(grade(c, c.initial).passed).toBe(false);
  });

  it("catches a wide store that overwrites neighbours and the address stored as data", () => {
    const c = challenge("write-save-distance");
    expect(grade(c, { text: SAVE_DISTANCE_TEXT.replace("w1", "x1") }).passed).toBe(false);
    expect(grade(c, { text: SAVE_DISTANCE_TEXT.replace("w1", "w0") }).passed).toBe(false);
    expect(grade(c, { text: "str w1, [x0, #4]\nret" }).passed).toBe(false);
  });

  it("requires both the memory copy and its return value", () => {
    const c = challenge("write-copy-distance");
    expect(grade(c, { text: "ldr w0, [x0]\nret" }).passed).toBe(false);
    expect(grade(c, { text: "ldr w2, [x0]\nstr w2, [x1]\nret" }).passed).toBe(false);
    expect(grade(c, { text: COPY_DISTANCE_TEXT.replace("[x1]", "[x0]") }).passed).toBe(false);
  });

  it("rejects zero extension for a signed gradient and a missing correction", () => {
    const c = challenge("write-adjust-gradient");
    const verdict = grade(c, { text: ADJUST_GRADIENT_TEXT.replace("ldrsb", "ldrb") });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.index)).toEqual([0, 3, 4, 5]);
    expect(grade(c, { text: "ldrsb w0, [x0]\nret" }).passed).toBe(false);
  });

  it("rejects each incorrect signedness or width in the sensor record", () => {
    const c = challenge("write-read-sensors");
    for (const text of [
      READ_SENSORS_TEXT.replace("ldrsb w1", "ldrb w1"),
      READ_SENSORS_TEXT.replace("ldrb w2", "ldrsb w2"),
      READ_SENSORS_TEXT.replace("ldrh w3", "ldrb w3"),
      READ_SENSORS_TEXT.replace("ldrh w3", "ldrsh w3"),
      READ_SENSORS_TEXT.replace("#5", "#4"),
      READ_SENSORS_TEXT.replace("ldr w0, [x0]", "ldrb w0, [x0]"),
    ])
      expect(grade(c, { text }).passed).toBe(false);
  });

  it("rejects using the pointer after overwriting its w view", () => {
    const c = challenge("write-read-sensors");
    const wrong = `ldr w0, [x0]\n${READ_SENSORS_TEXT.replace("ldr w0, [x0]\n", "")}`;
    const verdict = grade(c, { text: wrong });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.every((f) => Object.keys(f.actual).length === 0)).toBe(true);
  });

  it("also accepts preserving the pointer in another x register", () => {
    const c = challenge("write-read-sensors");
    const alternative = `mov x4, x0\nldr w0, [x4]\n${READ_SENSORS_TEXT.replace("ldr w0, [x0]\n", "").replaceAll("[x0", "[x4")}`;
    expect(grade(c, { text: alternative }).passed).toBe(true);
  });

  it("reports sensor fields with their own signed or unsigned readings", () => {
    const c = challenge("write-read-sensors");
    const verdict = grade(c, { text: READ_SENSORS_TEXT.replace("ldrsb w1", "ldrb w1") });
    const normal = verdict.failures.find((f) => f.index === 0)!;
    expect(normal.expected["w0"]).toBe("305419896");
    expect(normal.expected["w1"]).toBe("-7");
    expect(normal.actual["w1"]).toBe("249");
  });

  it("blocks untaught instructions and operations outside each exercise", () => {
    for (const c of lessons.flatMap((l) => l.challenges))
      expect(
        grade(c, { text: `bl target\n${c.reference.text}\ntarget:\nret` }).blocked,
      ).toBeDefined();
    expect(
      grade(challenge("write-save-distance"), { text: "strb w1, [x0]\nret" }).blocked,
    ).toBeDefined();
  });

  it("regrades stored work rather than trusting an old completion mark", () => {
    const lesson = lessons.find((l) => l.id === "loading-widths")!;
    const c = challenge("write-read-sensors");
    const store = new LessonStore(memoryStorage(), "assembly-lab", lesson.id);
    store.setChallenge(c.id, (current) => ({
      ...current,
      artifact: { text: "ret" },
      verdict: { passed: true, total: 5, failures: [] },
    }));
    expect(passedChallenge(lesson, store.get(), c.id)).toBe(false);
    store.setChallenge(c.id, (current) => ({
      ...current,
      artifact: c.reference,
      verdict: { passed: false, total: 5, failures: [] },
    }));
    expect(passedChallenge(lesson, store.get(), c.id)).toBe(true);
  });
});

describe("Module 6 pages", () => {
  it.each(lessons)(
    "$id renders its selected sections with no broken figure or premature outcome",
    (lesson) => {
      const { container } = render(
        <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
      );
      expect(container.querySelectorAll("section.lesson-section")).toHaveLength(
        lesson.sections.length,
      );
      expect(container.querySelectorAll("section.challenge")).toHaveLength(
        lesson.challenges.length,
      );
      expect(
        [...container.querySelectorAll(".interactive-problem, .interactive-missing")].map(
          (n) => n.textContent,
        ),
      ).toEqual([]);
      expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
      expect(container.querySelectorAll(".al-locked")).toHaveLength(
        lesson.sections
          .flatMap((s) => s.interactives)
          .filter((f) => typeof f.props["after"] === "string").length,
      );
    },
  );
});
