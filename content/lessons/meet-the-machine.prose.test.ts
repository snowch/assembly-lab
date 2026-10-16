// Copyright © 2026 Christopher Snow

// The lesson's words are docs/notes/module-0/prose.md's, kept word for word. This test holds the
// lesson to that file in both directions: every line of the file is somewhere in the lesson (so
// nothing was dropped), and every string the lesson takes from the file is in it (so nothing was
// reworded). The strings the file does not give are five captions of the lesson's own, drafted by
// Haiku, and this test lists them, so a new one is a decision somebody sees.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { learnerText } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { LABELS } from "./meet-the-machine.labels";
import { PROSE } from "./meet-the-machine.prose";

const lesson = LESSONS.find((l) => l.id === "meet-the-machine")!;

/** Words as a reader sees them: no code marks, no emphasis, one space between words. */
const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();

const file = readFileSync(new URL("../../docs/notes/module-0/prose.md", import.meta.url), "utf8");
const body = file.slice(file.indexOf("## 0. "));
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

/** The file's lines that carry words, without their list marks or stage-direction wrappers. */
const wordsOfFile = body
  .split("\n")
  .filter((l) => l.trim() !== "" && !l.startsWith("## ") && !l.startsWith("*Shown after"))
  .map((l) =>
    l
      .replace(/^- /, "")
      .replace(/^\d+\. /, "")
      .replace(/^\*Feedback for a wrong `w\d`:\* /, ""),
  );

describe("the lesson's words", () => {
  it("include every line of docs/notes/module-0/prose.md", () => {
    expect(wordsOfFile.length).toBeGreaterThan(40);
    expect(wordsOfFile.filter((l) => !shown.includes(flat(l)))).toEqual([]);
  });

  it("include every section heading of the file, as the section's title", () => {
    const headings = [...body.matchAll(/^## (\d+)\. (.*)$/gm)]
      .filter((m) => Number(m[1]) >= 1 && Number(m[1]) <= 10)
      .map((m) => flat(m[2] as string));
    expect(lesson.sections.map((s) => s.title)).toEqual(headings);
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
    // An option's value is the machine's name for it; its label is the file's words.
    walk([...LABELS.options.total, ...LABELS.options.noRet].map((o) => o.label));
    walk(LABELS.challenges);
    const chunks = strings.flatMap((s) => s.split("\n").map((c) => c.replace(/^- /, "")));
    expect(chunks.filter((c) => c.trim() !== "" && !fileFlat.includes(flat(c)))).toEqual([]);
  });

  it("have the captions the file gives, and only five captions of their own, each drafted by Haiku", () => {
    expect(fileFlat).toContain(flat(LABELS.captions.listing));
    expect(fileFlat).toContain(flat(LABELS.captions.stepper));
    const own = [
      LABELS.captions.predictTotal,
      LABELS.captions.predictNoRet,
      LABELS.captions.noRet,
      LABELS.captions.fix,
      LABELS.captions.trace,
    ];
    expect(Object.keys(LABELS.captions)).toHaveLength(2 + own.length);
    for (const caption of own) expect(fileFlat, caption).not.toContain(flat(caption));
    const source = readFileSync(new URL("./meet-the-machine.labels.ts", import.meta.url), "utf8");
    // Each of the five went through the prose process (16 October 2026); a new caption arrives
    // marked DRAFT, and this count fails until it has been through it too.
    expect(source.match(/\/\/ DRAFT/g) ?? []).toHaveLength(0);
  });

  it("keep the figures' captions as plain text, and the objectives as the file has them", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives) expect(x.caption, x.id).not.toMatch(/[`*]/);
    expect(lesson.objectives).toEqual([...LABELS.objectives]);
  });

  it("use no em dash", () => {
    expect(learnerText(lesson).filter((t) => t.includes("—"))).toEqual([]);
  });
});
