// Copyright © 2026 Christopher Snow

// The lesson's words are docs/notes/module-3/prose.md's (the part under "# Lesson 2"), kept word
// for word. This test holds the lesson to that file in both directions: every line of the part is
// somewhere in the lesson (so nothing was dropped), and every string the lesson takes from the file
// is in it (so nothing was reworded). The strings the file does not give are six captions and the
// two type names over the listings, drafted with the figures, and this test lists them, so a new
// one is a decision somebody sees.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { LABELS } from "./shifts.labels";
import { PROSE } from "./shifts.prose";
import {
  fieldLabelsOf,
  flat,
  partOf,
  shownOf,
  stringsIn,
  withoutClosing,
  wordsOf,
} from "./prose-check";

const lesson = LESSONS.find((l) => l.id === "shifts")!;
const part = partOf(2);
const partFlat = flat(part);
const shown = shownOf(lesson);

describe("the lesson's words", () => {
  it("include every line of the lesson's part of docs/notes/module-3/prose.md", () => {
    const words = wordsOf(part);
    expect(words.length).toBeGreaterThan(40);
    expect(words.filter((l) => !shown.includes(flat(withoutClosing(l))))).toEqual([]);
  });

  it("include every field label the file gives", () => {
    const labels = fieldLabelsOf(part);
    expect(labels).toHaveLength(9);
    expect(labels.filter((l) => !shown.includes(flat(l)))).toEqual([]);
  });

  it("include every section heading of the file, as the section's title", () => {
    const headings = [...part.matchAll(/^## (\d+)\. (.*)$/gm)]
      .filter((m) => Number(m[1]) >= 1 && Number(m[1]) <= 10)
      .map((m) => flat(m[2] as string));
    expect(lesson.sections.map((s) => s.title)).toEqual(headings);
  });

  it("take every string of the prose, hint and label files from the file", () => {
    const strings = [
      ...stringsIn(PROSE),
      ...stringsIn(LABELS.objectives),
      ...stringsIn(LABELS.titles),
      ...stringsIn(LABELS.captions),
      // An option's value is the model's name for it; its label is the file's words.
      ...stringsIn([...LABELS.options.fill, ...LABELS.options.firstAdd].map((o) => o.label)),
      ...stringsIn(LABELS.challenges),
    ];
    expect(strings.length).toBeGreaterThan(40);
    expect(strings.filter((c) => !partFlat.includes(flat(c)))).toEqual([]);
  });

  it("have the caption the file gives, and only the drafted ones besides, none of them in the file", () => {
    expect(partFlat).toContain(flat(LABELS.captions.shiftWord));
    const own = Object.values(LABELS.drafts.captions);
    expect(own).toHaveLength(6);
    for (const caption of own) expect(partFlat, caption).not.toContain(flat(caption));
    // Six captions and two type names, each marked DRAFT in the source and listed in the build report.
    const source = readFileSync(new URL("./shifts.labels.ts", import.meta.url), "utf8");
    expect(source.match(/\/\/ DRAFT/g) ?? []).toHaveLength(
      own.length + Object.keys(LABELS.drafts.types).length,
    );
    expect(Object.values(LABELS.drafts.types)).toEqual(["int", "unsigned"]);
  });

  it("keep the figures' captions as plain text, and the objectives as the file has them", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives) expect(x.caption, x.id).not.toMatch(/[`*]/);
    expect(lesson.objectives).toEqual([...LABELS.objectives]);
    for (const o of lesson.objectives) expect(part).toContain(`- ${o}`);
  });

  it("use no em dash", () => {
    expect(learnerText(lesson).filter((t) => t.includes("—"))).toEqual([]);
  });
});
