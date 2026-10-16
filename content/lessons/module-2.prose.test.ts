// Copyright © 2026 Christopher Snow

// Module 2's words are docs/notes/module-2/prose.md's, kept word for word. This test holds each
// lesson to that file in both directions: every line of the file's part for the lesson is somewhere
// in the lesson (so nothing was dropped), and every string the lesson takes from the file is in it
// (so nothing was reworded). The strings the file does not give are the labels marked DRAFT, and
// this test lists them, so a new one is a decision somebody sees.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { LABELS as L1 } from "./adding-and-the-flags.labels";
import { PROSE as P1 } from "./adding-and-the-flags.prose";
import { LABELS as L2 } from "./subtracting-and-the-tick-counter.labels";
import { PROSE as P2 } from "./subtracting-and-the-tick-counter.prose";

/** Words as a reader sees them: no code marks, no emphasis, one space between words. */
const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();

const file = readFileSync(new URL("../../docs/notes/module-2/prose.md", import.meta.url), "utf8");

/** The file's part for one lesson, from its "## 0." heading to the next lesson or the end. */
function partOf(n: number): string {
  const start = file.indexOf(`\n# Lesson ${n}:`);
  if (start < 0) throw new Error(`prose.md has no part for lesson ${n}`);
  const rest = file.slice(start + 1);
  const end = rest.indexOf("\n# Lesson ", 3);
  const part = end < 0 ? rest : rest.slice(0, end);
  return part.slice(part.indexOf("## 0. "));
}

/** Every string anywhere in a value. */
function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

const cases = [
  {
    n: 1,
    id: "adding-and-the-flags",
    title: "Adding, and the four flags",
    prose: P1,
    labels: L1,
    labelsFile: "./adding-and-the-flags.labels.ts",
    // The captions, field labels and test names the file does not give: each was drafted for the
    // page, and the file's parts name none of them.
    own: [
      L1.captions.adderCarryOut,
      L1.captions.predictReadings,
      L1.captions.predictAdd,
      L1.captions.stepAdd,
      L1.captions.flags,
      L1.captions.overflow,
      L1.challenges.overflow.field,
      L1.challenges.overflow.test,
      // The twelve fields of the prediction: a flag's letter, then the addition.
      ...L1.challenges.flags.additions.flatMap((a) =>
        ["N", "Z", "C", "V"].map((flag) => L1.challenges.flags.field(flag, a.text)),
      ),
    ],
    draftOptions: [] as string[],
    replaced: [] as string[],
    // Those, and the template that makes a field's label from a flag and an addition.
    marks: 0,
  },
  {
    n: 2,
    id: "subtracting-and-the-tick-counter",
    title: "Subtracting, and the tick counter",
    prose: P2,
    labels: L2,
    labelsFile: "./subtracting-and-the-tick-counter.labels.ts",
    own: [
      L2.captions.subtractWrapped,
      L2.captions.subtractNoWrap,
      L2.captions.predictElapsed,
      L2.captions.predictNegs,
      L2.captions.stepNegs,
      L2.captions.elapsed,
      L2.captions.step,
      L2.challenges.step.fields.result,
      L2.challenges.step.fields.c,
      L2.challenges.step.tests.result,
      L2.challenges.step.tests.c,
    ],
    draftOptions: [] as string[],
    replaced: [] as string[],
    marks: 0,
  },
] as const;

describe.each(cases)("module 2, lesson $n: the lesson's words", (c) => {
  const lesson = LESSONS.find((l) => l.id === c.id)!;
  const body = partOf(c.n);
  const fileFlat = flat(body);

  /** Everything the lesson shows a learner, including the labels in challenge data. */
  const shown = flat(
    [
      ...learnerText(lesson),
      ...lesson.challenges.flatMap((ch) => [
        ...ch.fields.map((f) => f.label),
        ...(ch.tests.kind === "answers"
          ? ch.tests.cases.flatMap((t) => [t.label, ...Object.values(t.given).map(String)])
          : []),
      ]),
    ].join("\n"),
  );

  /** The file's lines that carry words, without their list marks. */
  const wordsOfFile = body
    .split("\n")
    .filter((l) => l.trim() !== "" && !l.startsWith("## ") && !l.startsWith("*Shown after"))
    .map((l) => l.replace(/^- /, "").replace(/^\d+\. /, ""))
    .filter((l) => !(c.replaced as readonly string[]).includes(l));

  it("take the lesson's title from the file's heading", () => {
    const heading = new RegExp(`^# Lesson ${c.n}: (.*)$`, "m").exec(file)?.[1];
    expect(lesson.title).toBe(heading);
    expect(lesson.title).toBe(c.title);
  });

  it("include every line of the file's part for the lesson", () => {
    expect(wordsOfFile.length).toBeGreaterThan(30);
    expect(wordsOfFile.filter((l) => !shown.includes(flat(l)))).toEqual([]);
  });

  it("include every section heading of the file, as the section's title", () => {
    const headings = [...body.matchAll(/^## (\d+)\. (.*)$/gm)]
      .filter((m) => Number(m[1]) >= 1 && Number(m[1]) <= 10)
      .map((m) => flat(m[2] as string));
    expect(lesson.sections.map((s) => s.title)).toEqual(headings);
  });

  it("take every string of the prose, hint and label files from the file", () => {
    const strings = [
      ...stringsIn(c.prose),
      ...stringsIn(c.labels.objectives),
      ...stringsIn(
        Object.values(c.labels.options)
          .flat()
          .map((o) => o.label)
          .filter((label) => !(c.draftOptions as readonly string[]).includes(label)),
      ),
      ...stringsIn(c.labels.titles),
    ];
    const chunks = strings.flatMap((s) => s.split("\n").map((x) => x.replace(/^- /, "")));
    expect(chunks.filter((x) => x.trim() !== "" && !fileFlat.includes(flat(x)))).toEqual([]);
  });

  it("keep the objectives as the file has them, and each option's label too", () => {
    expect(lesson.objectives).toEqual([...c.labels.objectives]);
    for (const o of Object.values(c.labels.options).flat())
      if (!(c.draftOptions as readonly string[]).includes(o.label))
        expect(fileFlat, o.label).toContain(flat(o.label));
  });

  it("have only the captions and labels drafted for the page, each through the prose process", () => {
    const captions = lesson.sections.flatMap((s) => s.interactives.map((x) => x.caption));
    // The one caption the file gives is the one in italics under the figure.
    expect(captions.filter((x) => fileFlat.includes(flat(x)))).toHaveLength(1);
    const pieces = [
      ...captions,
      ...lesson.challenges.flatMap((ch) => [
        ...ch.fields.map((f) => f.label),
        // The name of a call (`elapsed(5000, 1000)`) is a call, not a sentence, and is not drafted.
        ...(ch.tests.kind === "answers" && ch.gradedDirection === "answer"
          ? ch.tests.cases.map((t) => t.label)
          : []),
      ]),
    ];
    const drafted = pieces.filter((x) => !fileFlat.includes(flat(x)));
    expect([...new Set(drafted)].sort()).toEqual([...new Set(c.own)].sort());
    const source = readFileSync(new URL(c.labelsFile, import.meta.url), "utf8");
    expect(source.match(/\/\/ DRAFT/g) ?? []).toHaveLength(c.marks);
  });

  it("keep the figures' captions and the challenges' titles as plain text", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives) expect(x.caption, x.id).not.toMatch(/[`*]/);
    for (const ch of lesson.challenges) expect(ch.title, ch.id).not.toMatch(/[`*]/);
  });

  it("name each challenge by the title the file gives it in bold", () => {
    for (const ch of lesson.challenges)
      expect(
        file.includes(`**${ch.title.replace("Write elapsed", "Write `elapsed`")}**`),
        ch.id,
      ).toBe(true);
  });

  it("use no em dash", () => {
    expect(learnerText(lesson).filter((t) => t.includes("—"))).toEqual([]);
  });
});
