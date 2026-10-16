// Copyright © 2026 Christopher Snow

// docs/notes/module-1/prose.md holds the words of both lessons of Module 1, one after the other.
// The two lessons' prose tests read it through this file: the part of it that is one lesson's, and
// the few helpers they share.

import { readFileSync } from "node:fs";

const file = readFileSync(new URL("../../docs/notes/module-1/prose.md", import.meta.url), "utf8");

/** Words as a reader sees them: no code marks, no emphasis, one space between words. */
export const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();

/** The body of lesson `n` (1 or 2): from its part 0 to the next lesson, or to the end of the file. */
export function lessonBody(n: 1 | 2): string {
  const start = file.indexOf(`\n# Lesson ${n}:`);
  if (start < 0) throw new Error(`prose.md has no Lesson ${n}`);
  const rest = file.slice(start + 1);
  const next = rest.indexOf("\n# Lesson ", 3);
  const lesson = next < 0 ? rest : rest.slice(0, next);
  return lesson.slice(lesson.indexOf("## 0. "));
}

/**
 * The lines of a lesson's body that carry words the lesson shows, without their list marks:
 * headings, the stage direction after a prediction, and the lines that name the fields a challenge
 * asks for are left out (the fields' labels are held to the file one by one).
 */
export function wordsOf(body: string): string[] {
  return body
    .split("\n")
    .filter(
      (l) =>
        l.trim() !== "" &&
        !l.startsWith("## ") &&
        !l.startsWith("*Shown after") &&
        !l.startsWith("Field labels"),
    )
    .map((l) => l.replace(/^- /, "").replace(/^\d+\. /, ""));
}

/** The quoted labels of the "Field labels" lines of a body, in order. */
export function fieldLabelsOf(body: string): string[] {
  return body
    .split("\n")
    .filter((l) => l.startsWith("Field labels"))
    .flatMap((l) => [...l.matchAll(/"([^"]+)"/g)].map((m) => m[1] as string));
}

/** The headings of parts 1 to 10, as the sections' titles. */
export function headingsOf(body: string): string[] {
  return [...body.matchAll(/^## (\d+)\. (.*)$/gm)]
    .filter((m) => Number(m[1]) >= 1 && Number(m[1]) <= 10)
    .map((m) => flat(m[2] as string));
}
