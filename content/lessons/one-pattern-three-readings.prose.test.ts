// Copyright © 2026 Christopher Snow

// The first lesson's words are docs/notes/module-1/prose.md's, kept word for word. This test holds
// the lesson to that file in both directions: every line of the file's Lesson 1 is somewhere in the
// lesson (so nothing was dropped), and every string the lesson takes from the file is in it (so
// nothing was reworded). The strings the file does not give are four captions of the lesson's own,
// marked DRAFT, and this test lists them, so a new one is a decision somebody sees.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { LABELS } from "./one-pattern-three-readings.labels";
import { PROSE } from "./one-pattern-three-readings.prose";
import { fieldLabelsOf, flat, headingsOf, lessonBody, wordsOf } from "./module-1.prose-file";

const lesson = LESSONS.find((l) => l.id === "one-pattern-three-readings")!;
const body = lessonBody(1);
const fileFlat = flat(body);

/** Everything the lesson shows a learner, including the labels and feedback in challenge data. */
const shown = flat(
  [
    ...learnerText(lesson),
    ...lesson.challenges.flatMap((c) => [
      ...c.fields.map((f) => f.label),
      ...(c.tests.kind === "answers"
        ? c.tests.cases.flatMap((t) => [t.label, ...Object.values(t.given).map(String)])
        : []),
    ]),
  ].join("\n"),
);

describe("the lesson's words", () => {
  it("include every line of docs/notes/module-1/prose.md's Lesson 1", () => {
    const words = wordsOf(body);
    expect(words.length).toBeGreaterThan(40);
    expect(words.filter((l) => !shown.includes(flat(l)))).toEqual([]);
  });

  it("include each field label the file names, as a field's label, in order", () => {
    const labels = fieldLabelsOf(body);
    expect(labels).toHaveLength(8);
    expect(lesson.challenges.flatMap((c) => c.fields.map((f) => flat(f.label)))).toEqual(
      labels.map(flat),
    );
  });

  it("include every section heading of the file, as the section's title", () => {
    expect(lesson.sections.map((s) => s.title)).toEqual(headingsOf(body));
  });

  it("take every string of the prose, hint and label files from the file", () => {
    const strings: string[] = [];
    const walk = (v: unknown) => {
      if (typeof v === "string") strings.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
    };
    walk(PROSE);
    walk(LABELS.objectives);
    walk(LABELS.titles);
    // An option's value is the machine's name for it; its label is the file's words.
    walk([...LABELS.options.add12, ...LABELS.options.compare].map((o) => o.label));
    walk(LABELS.challenges);
    const chunks = strings.flatMap((s) => s.split("\n").map((c) => c.replace(/^- /, "")));
    expect(chunks.filter((c) => c.trim() !== "" && !fileFlat.includes(flat(c)))).toEqual([]);
  });

  it("have the captions the file gives, and only four captions of their own, each through the prose process", () => {
    expect(fileFlat).toContain(flat(LABELS.captions.fuelRun));
    expect(fileFlat).toContain(flat(LABELS.captions.reader));
    expect(fileFlat).toContain(flat(LABELS.captions.compare));
    const own = [
      LABELS.captions.predictAdd12,
      LABELS.captions.stepAdd12,
      LABELS.captions.make,
      LABELS.captions.read,
    ];
    expect(Object.keys(LABELS.captions)).toHaveLength(3 + own.length);
    for (const caption of own) expect(fileFlat, caption).not.toContain(flat(caption));
    const source = readFileSync(
      new URL("./one-pattern-three-readings.labels.ts", import.meta.url),
      "utf8",
    );
    // Each of the four is marked; one that goes through the prose process loses its mark, and the
    // count here goes down with it.
    expect(source.match(/^\s*\/\/ DRAFT$/gm) ?? []).toHaveLength(0);
  });

  it("keep the figures' captions as plain text, and the objectives as the file has them", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives) expect(x.caption, x.id).not.toMatch(/[`*]/);
    expect(lesson.objectives).toEqual([...LABELS.objectives]);
  });

  it("use no em dash, and write minus as the minus sign", () => {
    const text = learnerText(lesson);
    expect(text.filter((t) => t.includes("—"))).toEqual([]);
    expect(text.filter((t) => /(^|[\s(])-\d/.test(t.replace(/`[^`]*`/g, "")))).toEqual([]);
  });
});
