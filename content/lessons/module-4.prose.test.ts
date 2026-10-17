// Copyright © 2026 Christopher Snow

// Module 4's words are docs/notes/module-4/prose.md's, kept word for word. This test holds each
// lesson to that file in both directions: every line of the file's part for the lesson is somewhere
// in the lesson (so nothing was dropped), and every string the lesson takes from the file is in it
// (so nothing was reworded). The strings the file does not give are the captions and the names of
// tests marked DRAFT, and this test lists them, so a new one is a decision somebody sees.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { LABELS as L1 } from "./compare-and-choose.labels";
import { PROSE as P1 } from "./compare-and-choose.prose";
import { LABELS as L2 } from "./branches.labels";
import { PROSE as P2 } from "./branches.prose";
import { fieldLabelsOf, flat, headingsOf, lessonBody, wordsOf } from "./module-4.prose-file";

/** Every string anywhere in a value. */
function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

const cases = [
  {
    n: 1 as const,
    id: "compare-and-choose",
    title: "Compare, and the condition that carries the type",
    prose: P1,
    labels: L1,
    labelsFile: "./compare-and-choose.labels.ts",
    // The captions and the names of tests the file does not give: each was drafted for the page, and
    // the file's parts name none of them.
    own: [
      L1.captions.predictChange,
      L1.captions.lessFuel,
      L1.captions.predictGe,
      L1.captions.stepGe,
      L1.captions.holds,
      ...Object.values(L1.challenges.holds.tests),
    ],
    // The file gives these captions, in italics under their figures.
    given: [L1.captions.runs, L1.captions.diff, L1.captions.conditions],
  },
  {
    n: 2 as const,
    id: "branches",
    title: "Branches, and the run that skips",
    prose: P2,
    labels: L2,
    labelsFile: "./branches.labels.ts",
    own: [
      L2.captions.predictCount,
      L2.captions.stepCount,
      L2.captions.fuelWarning,
      L2.captions.predictBge,
      L2.captions.stepBge,
      L2.captions.counts,
    ],
    given: [L2.captions.listing, L2.captions.arrows],
  },
];

describe.each(cases)("module 4, lesson $n: the lesson's words", (c) => {
  const lesson = LESSONS.find((l) => l.id === c.id)!;
  const body = lessonBody(c.n);
  const fileFlat = flat(body);

  /** Everything the lesson shows a learner, including the labels in challenge data. */
  const shown = flat(
    [
      ...learnerText(lesson),
      ...lesson.challenges.flatMap((ch) => [
        ...ch.fields.map((f) => f.label),
        ...(ch.tests.kind === "answers" ? ch.tests.cases.map((t) => t.label) : []),
      ]),
    ].join("\n"),
  );

  it("take the lesson's title from the file's heading", () => {
    const heading = new RegExp(`^# Lesson ${c.n}: (.*)$`, "m").exec(
      readFileSync(new URL("../../docs/notes/module-4/prose.md", import.meta.url), "utf8"),
    )?.[1];
    expect(lesson.title).toBe(heading);
    expect(lesson.title).toBe(c.title);
  });

  it("include every line of the file's part for the lesson", () => {
    const words = wordsOf(body);
    expect(words.length).toBeGreaterThan(40);
    expect(words.filter((l) => !shown.includes(flat(l)))).toEqual([]);
  });

  it("include each field label the file names, as a field's label, in order", () => {
    const labels = fieldLabelsOf(body);
    expect(labels).toHaveLength(c.n === 1 ? 4 : 6);
    expect(lesson.challenges.flatMap((ch) => ch.fields.map((f) => flat(f.label)))).toEqual(
      labels.map(flat),
    );
  });

  it("include every section heading of the file, as the section's title", () => {
    expect(lesson.sections.map((s) => s.title)).toEqual(headingsOf(body));
  });

  it("take every string of the prose, hint and label files from the file", () => {
    const strings = [
      ...stringsIn(c.prose),
      ...stringsIn(c.labels.objectives),
      ...stringsIn(c.labels.titles),
      ...Object.values(c.labels.options)
        .flat()
        .map((o) => o.label),
      ...stringsIn(c.labels.challenges),
    ];
    // A name of a call or of a test is not a sentence of the file's; the others are.
    const names = new Set<string>([
      ...c.own,
      ...(c.n === 1 ? L1.challenges.lessFuel.tests : L2.challenges.fuelWarning.tests),
    ]);
    const chunks = strings
      .filter((s) => !names.has(s))
      .flatMap((s) => s.split("\n").map((x: string) => x.replace(/^- /, "")));
    expect(chunks.filter((x) => x.trim() !== "" && !fileFlat.includes(flat(x)))).toEqual([]);
  });

  it("keep the objectives as the file has them, and each option's label too", () => {
    expect(lesson.objectives).toEqual([...c.labels.objectives]);
    for (const o of Object.values(c.labels.options).flat())
      expect(fileFlat, o.label).toContain(flat(o.label));
  });

  it("have the captions the file gives, and only the captions and test names drafted for the page", () => {
    const captions = lesson.sections.flatMap((s) => s.interactives.map((x) => x.caption));
    for (const caption of c.given) expect(fileFlat, caption).toContain(flat(caption));
    const fromFile = captions.filter((x) => fileFlat.includes(flat(x)));
    expect([...new Set(fromFile)].sort()).toEqual([...c.given].sort());
    const drafted = [
      ...captions,
      // The name of a test of an answer challenge is a sentence of the page's own.
      ...lesson.challenges.flatMap((ch) =>
        ch.gradedDirection === "answer" && ch.tests.kind === "answers"
          ? ch.tests.cases.map((t) => t.label).filter((x) => !fileFlat.includes(flat(x)))
          : [],
      ),
    ].filter((x) => !fileFlat.includes(flat(x)));
    expect([...new Set(drafted)].sort()).toEqual([...new Set(c.own)].sort());
    // Each is marked DRAFT where it is written until it has been through the prose process; the
    // ones that have are listed, and nothing else is marked.
    const checked: readonly string[] = [L2.captions.stepBge];
    const source = readFileSync(new URL(c.labelsFile, import.meta.url), "utf8");
    expect(source.match(/^\s*\/\/ DRAFT$/gm) ?? []).toHaveLength(
      c.own.filter((x) => !checked.includes(x)).length,
    );
  });

  it("keep the figures' captions and the challenges' titles as plain text", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives) expect(x.caption, x.id).not.toMatch(/[`*]/);
    for (const ch of lesson.challenges) expect(ch.title, ch.id).not.toMatch(/[`*]/);
  });

  it("name each challenge by the title the file gives it in bold", () => {
    const bold = [...body.matchAll(/^\*\*(.*)\*\*$/gm)].map((m) => flat(m[1] as string));
    for (const ch of lesson.challenges) expect(bold, ch.id).toContain(ch.title);
  });

  it("give each prediction its question and options as the file has them", () => {
    const bold = [...body.matchAll(/^\*\*(.*)\*\*$/gm)].map((m) => m[1] as string);
    for (const s of lesson.sections)
      for (const x of s.interactives) {
        const question = x.props["question"];
        if (typeof question === "string") expect(bold, x.id).toContain(question.slice(2, -2));
      }
  });

  it("use no em dash", () => {
    expect(learnerText(lesson).filter((t) => t.includes("—"))).toEqual([]);
  });
});
