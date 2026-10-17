// Copyright © 2026 Christopher Snow

// The lesson's words are docs/notes/module-3/prose.md's (the part under "# Lesson 1"), kept word
// for word. This test holds the lesson to that file in both directions: every line of the part is
// somewhere in the lesson (so nothing was dropped), and every string the lesson takes from the file
// is in it (so nothing was reworded). The strings the file does not give are nine captions (four of them DRAFT) and the
// five labels in the warning word's key, drafted with the figures, and this test lists them, so a
// new one is a decision somebody sees.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { learnerText, termProblems } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { LABELS } from "./masks.labels";
import { PROSE } from "./masks.prose";
import {
  feedbackOf,
  fieldLabelsOf,
  flat,
  notesOf,
  partOf,
  shownOf,
  stringsIn,
  withoutClosing,
  wordsOf,
} from "./prose-check";

const lesson = LESSONS.find((l) => l.id === "masks")!;
const part = partOf(1);
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
    expect(labels).toHaveLength(3);
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
      ...stringsIn([...LABELS.options.minusFive, ...LABELS.options.noClear].map((o) => o.label)),
      ...stringsIn(LABELS.challenges),
    ];
    expect(strings.length).toBeGreaterThan(40);
    expect(strings.filter((c) => !partFlat.includes(flat(c)))).toEqual([]);
  });

  it("have the two captions the file gives, and only the drafted ones besides, none of them in the file", () => {
    expect(partFlat).toContain(flat(LABELS.captions.warningWord));
    expect(partFlat).toContain(flat(LABELS.captions.maskBits));
    const own = Object.values(LABELS.drafts.captions);
    expect(own).toHaveLength(9);
    for (const caption of own) expect(partFlat, caption).not.toContain(flat(caption));
    // Five captions and five labels went through the prose process on 17 October 2026. Added for
    // the figures' rework that day, and marked DRAFT until they have been through it: the changed
    // title of section 4, and the captions of the field reading, the solution stepper, the
    // comparison with GCC's function and the comparison without the clear.
    const source = readFileSync(new URL("./masks.labels.ts", import.meta.url), "utf8");
    expect(source.match(/\/\/ DRAFT/g) ?? []).toHaveLength(5);
    expect(LABELS.titles.investigation).toBe("Masks, fields and the three rules");
    expect(LABELS.drafts.keyEntries.map((e) => e.label)).toEqual([
      "fuel low",
      "service due",
      "door open",
      "lights on",
      "gear",
    ]);
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

describe("the closed notes, the held-back texts and the feedback", () => {
  it("open with the summaries the file gives, in the sections it puts them in", () => {
    expect(notesOf(part)).toEqual(["Which compiler?", "Answer"]);
    const withNote = lesson.sections.filter((s) => s.details);
    expect(withNote.map((s) => [s.kind, s.details?.summary])).toEqual([
      ["prediction", "Which compiler?"],
      ["reflection", "Answer"],
    ]);
    // The note's words are the file's, word for word (the file's lines under the marker).
    for (const s of withNote) expect(partFlat).toContain(flat(s.details!.prose));
  });

  it("keep the answer to the closing question out of the section's prose, in the closed note", () => {
    const reflection = lesson.sections.find((s) => s.kind === "reflection")!;
    expect(reflection.prose).toContain("What does `ubfx x0, x0, 4, 3` give");
    expect(reflection.prose).not.toContain("0x43");
    expect(reflection.details?.prose).toContain("0x43");
    expect(lesson.sections.at(-1)?.title).toBe("What you now know");
  });

  it("hold back the text after the challenge has been run and the text after it passes: they are in their figures, not in a section's prose", () => {
    const sections = lesson.sections.map((s) => s.prose).join("\n");
    expect(sections).not.toContain("Step through your own instructions");
    expect(sections).not.toContain("GCC writes the field in one instruction");
    const figures = lesson.sections.flatMap((s) => s.interactives);
    const stepper = figures.find((x) => x.kind === "solution-stepper")!;
    const compare = figures.find((x) => x.kind === "bfi-compare")!;
    expect(stepper.props["intro"]).toBe(PROSE.afterRun);
    expect(compare.props["note"]).toBe(PROSE.afterPass);
    expect(partFlat).toContain(flat(PROSE.afterRun));
    for (const line of stringsIn(PROSE.afterPass)) expect(partFlat).toContain(flat(line));
    // Both figures wait for the challenge they follow.
    expect(stepper.props["afterRun"]).toBe("write-set-gear");
    expect(compare.props["afterChallenge"]).toBe("write-set-gear");
  });

  it("give each wrong field of the three results its sentence from the file, and the chained answer its own", () => {
    const c = lesson.challenges.find((x) => x.id === "trace-three-results")!;
    const feedback = feedbackOf(c);
    expect(feedback).toHaveLength(4);
    for (const sentence of feedback) expect(partFlat).toContain(flat(sentence));
    if (c.tests.kind !== "answers") throw new Error("answer tests");
    expect(
      c.tests.cases.map((t) => Object.keys(t.given).filter((k) => k.includes("feedback"))),
    ).toEqual([
      ["feedback.after_orr"],
      ["feedback.after_and", "feedback.chained.after_and"],
      ["feedback.the_gear"],
    ]);
    // None of them says a value the learner is asked for.
    for (const sentence of feedback) expect(sentence).not.toMatch(/0x2b|0x22|0x23|\b0x2\b/);
  });

  it("read by the term gate: the notes and the held-back texts are lesson text, and so are the feedback sentences", () => {
    const text = learnerText(lesson);
    expect(text).toContain(PROSE.afterRun);
    expect(text).toContain(PROSE.afterPass);
    expect(text).toContain(PROSE.predictionNote.prose);
    expect(text).toContain(PROSE.reflectionNote.prose);
    // The gate on every lesson, with each lesson's feedback sentences added to its text.
    const withFeedback = LESSONS.map((l) => ({
      ...l,
      modelVsReality: [l.modelVsReality, ...l.challenges.flatMap(feedbackOf)].join("\n"),
    }));
    expect(termProblems(withFeedback)).toEqual([]);
  });
});
