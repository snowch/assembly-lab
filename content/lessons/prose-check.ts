// Copyright © 2026 Christopher Snow

// For the prose tests of Module 3's lessons: the part of docs/notes/module-3/prose.md that holds
// one lesson's words, and the ways a lesson's strings are compared with it. A lesson's words are
// the file's, kept word for word; italics are captions or stage directions, a bold line is a
// prediction's question or a challenge's title, and "Field labels:" names the labels of an
// answers challenge's fields.

import { readFileSync } from "node:fs";

import { learnerText, type Lesson } from "@platform/lesson-schema";

/** Words as a reader sees them: no code marks, no emphasis, one space between words. */
export const flat = (s: string): string => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();

const file = readFileSync(new URL("../../docs/notes/module-3/prose.md", import.meta.url), "utf8");

/** The part of the file under "# Lesson <n>", from its "## 0." on. */
export function partOf(n: 1 | 2): string {
  const start = file.indexOf(`# Lesson ${n}:`);
  const next = file.indexOf(`# Lesson ${n + 1}:`);
  const body = file.slice(start, next < 0 ? undefined : next);
  return body.slice(body.indexOf("## 0. "));
}

/** The labels the "Field labels:" lines give, in order. */
export function fieldLabelsOf(part: string): string[] {
  return part
    .split("\n")
    .filter((l) => l.startsWith("Field labels"))
    .flatMap((l) => [...l.matchAll(/"([^"]+)"/g)].map((m) => m[1] as string));
}

/** The file's lines that carry words, without their list marks. */
export function wordsOf(part: string): string[] {
  return part
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

/** Every string in a value, with a list's items and a text's paragraphs apart. */
export function stringsIn(value: unknown): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") out.push(...v.split("\n").map((c) => c.replace(/^- /, "")));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(value);
  return out.filter((c) => c.trim() !== "");
}

/** Everything the lesson shows a learner, including the labels in its challenges' data. */
export function shownOf(lesson: Lesson): string {
  return flat(
    [
      ...learnerText(lesson),
      ...lesson.challenges.flatMap((c) => [
        ...c.fields.map((f) => f.label),
        ...(c.tests.kind === "answers" ? c.tests.cases.map((t) => t.label) : []),
      ]),
    ].join("\n"),
  );
}

/** A line of the file without the ; or . that closes a list item. */
export const withoutClosing = (s: string): string => s.replace(/[;.]$/, "");
