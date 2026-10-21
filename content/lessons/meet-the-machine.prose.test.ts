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

/**
 * The file's lines that carry words, without their list marks or stage-direction wrappers. A line
 * that begins `*Shown`, `*Closed note` or `*Answer (closed` says when something appears and is not
 * itself shown; a `*Feedback for ...:*` line is shown without that lead-in.
 */
const wordsOfFile = body
  .split("\n")
  .filter(
    (l) =>
      l.trim() !== "" &&
      !l.startsWith("## ") &&
      !l.startsWith("*Shown") &&
      !l.startsWith("*Closed note") &&
      !l.startsWith("*Answer (closed"),
  )
  .map((l) =>
    l
      .replace(/^- /, "")
      .replace(/^\d+\. /, "")
      .replace(/^\*Feedback for [^:]*:\* /, ""),
  );

/** The strings of a section's figures' props, found by the figure's id. */
const figure = (id: string) =>
  lesson.sections.flatMap((s) => s.interactives).find((x) => x.id === id)!;

describe("the closed notes and the wrong-answer sentences", () => {
  it("hang two closed notes under the listing, with the file's titles and words", () => {
    expect(figure("trip-listing").props["notes"]).toEqual([PROSE.compilerNote, PROSE.lineNote]);
    const titles = [...body.matchAll(/^\*Closed note under the listing[^\n]*\n\n\*\*(.*)\*\*$/gm)];
    expect(titles.map((m) => m[1])).toEqual([PROSE.compilerNote.summary, PROSE.lineNote.summary]);
    // The notes replace the open paragraph that used to sit under the listing.
    expect(figure("trip-listing").after).toBeUndefined();
  });

  it("give each wrong option of the two predictions the file's sentence, and the right option none", () => {
    const feedbackOf = (id: string) =>
      Object.fromEntries(
        (figure(id).props["options"] as { value: string; feedback?: string }[]).map((o) => [
          o.value,
          o.feedback,
        ]),
      );
    expect(feedbackOf("predict-total")).toEqual({
      w0: undefined,
      "new-place": PROSE.predictionFeedback["new-place"],
      "not-kept": PROSE.predictionFeedback["not-kept"],
      w3: PROSE.predictionFeedback.w3,
    });
    expect(feedbackOf("predict-no-ret")).toEqual({
      "232": PROSE.failureFeedback["232"],
      "147": undefined,
      error: PROSE.failureFeedback.error,
      "0": PROSE.failureFeedback["0"],
    });
  });

  it("close the last section with the question's answer as its closed note, titled Answer", () => {
    const last = lesson.sections.at(-1)!;
    expect(last.details).toEqual({ summary: "Answer", prose: PROSE.reflectionAnswer });
    expect(last.prose).not.toContain(PROSE.reflectionAnswer);
    expect(last.title).toBe("What you now know");
  });

  it("give the stepper the file's sentence for the end of the run, and the other steppers none", () => {
    expect(figure("step-trip").props["endNote"]).toBe(PROSE.investigationEnd);
    expect(figure("step-no-ret").props["endNote"]).toBeUndefined();
  });

  it("invite a best guess before the ret prediction, and give that prediction its own button", () => {
    const props = figure("predict-no-ret").props;
    expect(props["intro"]).toBe(PROSE.failureInvitation);
    expect(props["commitLabel"]).toBe(LABELS.commit.noRet);
    // The invitation is a discovery lead-in, not knowledge the file gives: it neither names where
    // the run goes nor says the value.
    const flatInvitation = flat(PROSE.failureInvitation);
    expect(flatInvitation).not.toContain("fuel_used");
    expect(flatInvitation).not.toContain("147");
    // The ordinary prediction keeps the shared workflow.
    const total = figure("predict-total").props;
    expect(total["intro"]).toBeUndefined();
    expect(total["commitLabel"]).toBeUndefined();
  });

  it("give the construction challenge's three cases the sentence for the reversed subtraction", () => {
    const c = lesson.challenges.find((x) => x.id === "fix-fuel-used")!;
    if (c.tests.kind !== "answers") throw new Error("answer tests");
    for (const t of c.tests.cases)
      expect(t.given["misconception.feedback"], t.label).toBe(PROSE.fixReversedFeedback);
  });
});

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
    expect(fileFlat).toContain(flat(LABELS.captions.predictTotal));
    expect(fileFlat).toContain(flat(LABELS.captions.argRegisters));
    expect(fileFlat).toContain(flat(LABELS.captions.operandRoles));
    const own = [
      LABELS.captions.predictNoRet,
      LABELS.captions.noRet,
      LABELS.captions.fix,
      LABELS.captions.trace,
    ];
    expect(Object.keys(LABELS.captions)).toHaveLength(5 + own.length);
    for (const caption of own) expect(fileFlat, caption).not.toContain(flat(caption));
    const source = readFileSync(new URL("./meet-the-machine.labels.ts", import.meta.url), "utf8");
    // Each of the four went through the prose process (16 October 2026); a new caption arrives
    // marked DRAFT, and this count fails until it has been through it too.
    expect(source.match(/\/\/ DRAFT/g) ?? []).toHaveLength(2);
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
