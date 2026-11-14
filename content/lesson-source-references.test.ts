// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { LESSONS } from "./lessons";
import { TAUGHT } from "./lessons/introduced";
import { FIRST_INSTRUCTION_FORMS, lessonSources } from "./lesson-source-references";
import { INSTRUCTION_REFERENCE_CATALOG as I } from "./instruction-reference-catalog";
import { createBook } from "../apps/course/src/book";

describe("lesson primary references", () => {
  it("covers every introduced mnemonic with a precise form and every published lesson with relevant sources", () => {
    const missing: string[] = [];
    for (const lesson of LESSONS) {
      const sources = lessonSources(lesson);
      if (!sources.instructions.length && !sources.otherSources.length)
        missing.push(`${lesson.id}: no sources`);
      for (const mnemonic of TAUGHT[lesson.id] ?? []) {
        const key = FIRST_INSTRUCTION_FORMS[mnemonic as keyof typeof FIRST_INSTRUCTION_FORMS];
        if (!key || !sources.instructions.some((ref) => ref.url === I[key].url))
          missing.push(`${lesson.id}: ${mnemonic}`);
      }
      const urls = [...sources.instructions, ...sources.otherSources].map((ref) => ref.url);
      expect(new Set(urls).size, lesson.id).toBe(urls.length);
      for (const url of urls) expect(new URL(url).protocol).toBe("https:");
    }
    expect(missing).toEqual([]);
  });
  it("links introduced instructions in presentation prose while keeping graders and source data identical", () => {
    const book = createBook();
    const missing: string[] = [];
    for (const source of LESSONS) {
      const shown = book.lessons.find((lesson) => lesson.id === source.id)!;
      expect(shown.challenges.map((challenge) => challenge.initial)).toEqual(
        source.challenges.map((challenge) => challenge.initial),
      );
      for (const mnemonic of TAUGHT[source.id] ?? []) {
        if (source.id === "adding-and-the-flags") continue;
        const ref = I[FIRST_INSTRUCTION_FORMS[mnemonic as keyof typeof FIRST_INSTRUCTION_FORMS]];
        if (!JSON.stringify(shown.sections).includes(ref.url))
          missing.push(`${source.id}: ${mnemonic}`);
      }
    }
    expect(missing).toEqual([]);
  });
  it("keeps A32 and A64 references separate and preserves the introductory reference prose at the bottom", () => {
    expect(
      lessonSources({ id: "a32-conditions", module: 14 }).instructions.every((ref) =>
        ref.url.includes("/ddi0597/"),
      ),
    ).toBe(true);
    expect(lessonSources({ id: "one-addition", module: 0 }).authoredProse).toContain(
      "Both references are free",
    );
    expect(lessonSources({ id: "returning-to-caller", module: 0 }).authoredProse).toContain(
      "procedure call standard",
    );
    for (const id of ["one-addition", "returning-to-caller"])
      expect(
        LESSONS.find((lesson) => lesson.id === id)!.sections.some((section) =>
          section.details?.summary.includes("Arm"),
        ),
      ).toBe(false);
  });
});

it("maps newly taught address forms to their actual split lessons", () => {
  const book = createBook();
  const traversal = book.lessons.find((lesson) => lesson.id === "traversing-arrays")!;
  const strings = book.lessons.find((lesson) => lesson.id === "zero-terminated-strings")!;
  expect(lessonSources(traversal).instructions.map((ref) => ref.url)).toContain(
    I["add-extended-register"].url,
  );
  expect(lessonSources(strings).instructions.map((ref) => ref.url)).toContain(
    I["ldrb-register"].url,
  );
  expect(JSON.stringify(traversal.sections)).toContain(
    "[`add x3, x0, w1, uxtw 2`](" + I["add-extended-register"].url + ")",
  );
  expect(JSON.stringify(strings.sections)).toContain(
    "[`ldrb w2, [x3, x0]`](" + I["ldrb-register"].url + ")",
  );
});
