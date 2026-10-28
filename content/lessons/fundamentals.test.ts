// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseLesson, learnerText, termPattern } from "@platform/lesson-schema";
import { traceOf, viewAt, wValue } from "@al/views";
import { parseRegName } from "@al/machine";
import { grade } from "../../packages/views/src/grader";
import { fundamentalsLessons } from "./fundamentals";
import { FUNDAMENTALS_PROSE, SYNTHESIS_COPY, FUNDAMENTALS_MODULE } from "./fundamentals.prose";
import { FUNDAMENTALS_LABELS } from "./fundamentals.labels";

const lessons = fundamentalsLessons.map(parseLesson);
const flat = (value: string) => value.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();
const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(strings)
      : value && typeof value === "object"
        ? Object.values(value).flatMap(strings)
        : [];

describe("visible Fundamentals lessons", () => {
  it("keeps shifting out of the visible addition text while linking the official reference", () => {
    const visible = learnerText(lessons[0]!)
      .join("\n")
      .replace(/https?:\/\/[^\s)]+/g, " ");
    expect(visible).not.toMatch(termPattern("shift"));
  });
  it("gives each mechanism a stable lesson and mounts both reuse and subtraction", () => {
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "one-addition",
      "adding-a-constant",
      "tiny-function",
      "returning-to-caller",
      "subtraction-and-reuse",
      "instructions-in-sequence",
    ]);
    expect(lessons.map((lesson) => lesson.order)).toEqual([0, 1, 2, 3, 4, 5]);
    for (const lesson of lessons) {
      expect(lesson.sections).toHaveLength(
        lesson.id === "adding-a-constant"
          ? 3
          : ["tiny-function", "returning-to-caller"].includes(lesson.id)
            ? 4
            : lesson.id === "instructions-in-sequence"
              ? 8
              : 9,
      );
      for (const figure of lesson.sections
        .flatMap((section) => section.interactives)
        .filter((figure) => figure.kind === "primitive-operation")) {
        expect(figure.props["stage"]).toBeDefined();
        expect(figure.props["stages"]).toBeUndefined();
      }
    }
    expect(
      lessons
        .find((lesson) => lesson.id === "subtraction-and-reuse")!
        .sections.flatMap((section) => section.interactives)
        .filter((figure) => figure.kind === "primitive-operation"),
    ).toHaveLength(2);
  });

  it.each(lessons)("grades fresh inputs in $id without requiring the worked result", (lesson) => {
    const challenge = lesson.challenges[0]!;
    expect(grade(challenge, challenge.initial).passed).toBe(false);
    expect(grade(challenge, challenge.reference).passed).toBe(true);
    expect(
      grade(challenge, {
        answers: Object.fromEntries(challenge.fields.map((field) => [field.id, "999"])),
      }).passed,
    ).toBe(false);
    expect(challenge.initial.data?.["program"]).toBeUndefined();
    expect(challenge.initial.data?.["model"]).toBeDefined();
  });

  it("pins every fresh challenge result and the wrapper return's lack of register writes", () => {
    expect(lessons.map((lesson) => lesson.challenges[0]!.reference.answers)).toEqual([
      { w1: "19", w0: "14" },
      { w1: "13", w0: "10" },
      { w0: "10", w1: "4" },
      { w0: "5", w1: "10" },
      { w1: "13", w0: "18" },
      { w2: "10", w1: "4" },
    ]);
    for (const lesson of lessons) {
      const challenge = lesson.challenges[0]!;
      if (challenge.tests.kind !== "answers") throw new Error("Answer challenge expected");
      const test = challenge.tests.cases[0]!;
      const args = Array.from({ length: 3 }, (_, n) => test.given[`w${n}`])
        .filter((n) => n !== undefined)
        .map(Number);
      const trace = traceOf(challenge.initial.data!["model"] as { c: string; listing: string }, {
        entry: String(test.given["entry"]),
        args,
      });
      expect(trace.result.stop.kind).toBe("returned");
      expect(trace.result.steps.at(-1)!.writes).toEqual([]);
      const final = viewAt(trace, trace.result.steps.length).state;
      for (const field of challenge.fields)
        expect(String(wValue(final, Number(field.id.slice(1))))).toBe(
          challenge.reference.answers![field.id],
        );
    }
  });

  it("uses the later constant term only to name the linked follow-up lesson", () => {
    expect(learnerText(lessons[0]!).filter((text) => /\bconstant\w*/i.test(text))).toEqual([
      FUNDAMENTALS_PROSE.addition.registerViews.after,
    ]);
  });

  it("grounds the opening register count and both name widths in the machine", () => {
    const worked = lessons[0]!.sections
      .flatMap((section) => section.interactives)
      .find((figure) => figure.id === "worked-addition")!;
    const stage = worked.props["stage"] as {
      program: { c: string; listing: string };
      call: { entry: string; args: number[] };
    };
    const state = viewAt(traceOf(stage.program, stage.call), 0).state;
    expect(state.x).toHaveLength(31);
    expect(parseRegName(`x${state.x.length - 1}`)).toMatchObject({
      n: 30,
      width: 64,
      role: "general",
    });
    expect(parseRegName(`w${state.x.length - 1}`)).toMatchObject({
      n: 30,
      width: 32,
      role: "general",
    });
    expect(parseRegName(`x${state.x.length}`)).toBeNull();
    expect(parseRegName("x0")).toMatchObject({ n: 0, width: 64 });
    expect(parseRegName("w0")).toMatchObject({ n: 0, width: 32 });
  });

  it("pins stated numeric inputs and results to the checked primitive traces", () => {
    // Existing primitive facts check all worked calls; fresh challenge traces are checked above.
    // Width and compiler/version values are pinned by the recorded increment listing facts.
    // The unshifted immediate limit is Arm DDI0602 ADD (immediate)'s imm12 range;
    // arith.test.ts also checks 4095 and the larger, shifted 4096 encoding.
    const pinned = new Set([
      0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 20, 31, 32, 64, 16.1, 4095,
    ]);
    const text = lessons
      .flatMap(learnerText)
      .join("\n")
      // Reference URL issue dates are document identities, not arithmetic claims.
      // Exact checked destinations remain covered by the browser link assertions.
      .replace(/https?:\/\/[^\s)]+/g, " ")
      .replace(/[A-Za-z_][A-Za-z_0-9]*/g, " ");
    expect(
      [...text.matchAll(/\d+(?:\.\d+)?/g)]
        .map((match) => Number(match[0]))
        .filter((number) => !pinned.has(number)),
    ).toEqual([]);
  });

  it("keeps all drafted words and labels in the canonical prose record", () => {
    const canonical = flat(
      readFileSync(new URL("../../docs/notes/fundamentals/prose.md", import.meta.url), "utf8"),
    );
    for (const value of [...strings(FUNDAMENTALS_PROSE), ...strings(FUNDAMENTALS_LABELS)])
      expect(canonical).toContain(flat(value));
    const body = readFileSync(
      new URL("../../docs/notes/fundamentals/prose.md", import.meta.url),
      "utf8",
    ).split("## One addition")[1]!;
    const drafted = flat(
      [
        ...strings(FUNDAMENTALS_PROSE),
        ...strings(FUNDAMENTALS_LABELS),
        ...strings(SYNTHESIS_COPY),
        ...strings(FUNDAMENTALS_MODULE),
      ].join("\n"),
    );
    for (const line of body.split("\n").filter((line) => line.trim() && !line.startsWith("#")))
      expect(drafted).toContain(flat(line));
    const shown = flat(
      [...lessons.flatMap(learnerText), ...strings(FUNDAMENTALS_LABELS)].join("\n"),
    );
    expect(shown).toContain("add_ints(6, 4)");
    expect(shown).not.toContain("Next activity");
  });
});
