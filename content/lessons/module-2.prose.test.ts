// Copyright © 2026 Christopher Snow

// Module 2's words are docs/notes/module-2/prose.md's, kept word for word. This test holds each
// lesson to that file in both directions: every line of the file's part for the lesson is somewhere
// in the lesson (so nothing was dropped), and every string the lesson takes from the file is in it
// (so nothing was reworded). The strings the file does not give are the labels marked DRAFT, and
// this test lists them, so a new one is a decision somebody sees.

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { ARITH_STRINGS as A } from "@al/views";
import { learnerText, termProblems } from "@platform/lesson-schema";

import { LESSONS } from ".";
import { LABELS as L1 } from "./adding-and-the-flags.labels";
import { PROSE as P1 } from "./adding-and-the-flags.prose";
import { LABELS as L2 } from "./subtracting-and-the-tick-counter.labels";
import { PROSE as P2 } from "./subtracting-and-the-tick-counter.prose";

/** Words as a reader sees them: no code marks, no emphasis, one space between words. */
const flat = (s: string) => s.replace(/[`*]/g, "").replace(/\s+/g, " ").trim();

const file = readFileSync(new URL("../../docs/notes/module-2/prose.md", import.meta.url), "utf8");

/**
 * The file's part for one lesson, from its "## 0." heading to the next heading of the first level:
 * the next lesson, or the interface strings that close the file.
 */
function partOf(n: number): string {
  const start = file.indexOf(`\n# Lesson ${n}:`);
  if (start < 0) throw new Error(`prose.md has no part for lesson ${n}`);
  const rest = file.slice(start + 1);
  const end = rest.indexOf("\n# ", 3);
  const part = end < 0 ? rest : rest.slice(0, end);
  return part.slice(part.indexOf("## 0. "));
}

/** The interface strings that close the file: what the figures and the graders say. */
const interfaceLines = file.slice(file.indexOf("\n# Interface strings"));

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
    canonicalCaptions: [L1.captions.adder, L1.captions.adderCarryOut],
    own: [
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
    canonicalCaptions: [L2.captions.ring],
    own: [
      L2.captions.subtractWrapped,
      L2.captions.subtractNoWrap,
      L2.captions.subtractOwn,
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
    // The caption of the figure that opens when `elapsed` is passed.
    marks: 1,
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
    // Captions recorded in the prose file appear there in italics.
    expect(captions.filter((x) => fileFlat.includes(flat(x)))).toEqual(c.canonicalCaptions);
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

describe("module 2, the improved text: closed notes, gated texts and the last section", () => {
  const lessons = [
    {
      id: "adding-and-the-flags",
      prose: P1,
      gated: P1.flagsAfter,
      gatedFigure: "add-carry-out",
      gate: "predict-flags",
    },
    {
      id: "subtracting-and-the-tick-counter",
      prose: P2,
      gated: P2.elapsedAfter,
      gatedFigure: "subtract-own",
      gate: "write-elapsed",
    },
  ] as const;

  it.each(lessons)(
    "$id: the last section is What you now know, a list and a question, and a closed Answer",
    ({ id, prose }) => {
      const lesson = LESSONS.find((l) => l.id === id)!;
      const last = lesson.sections[9]!;
      expect(last.title).toBe("What you now know");
      expect(last.prose).toBe(prose.reflection);
      // Count the takeaways separately from any fresh inputs supplied for the question.
      expect(
        last.prose
          .split("\n\n")[0]!
          .split("\n")
          .filter((l) => l.startsWith("- ")),
      ).toHaveLength(6);
      expect(last.prose).toMatch(/\n\n\*\*Question:\*\* .*\?$/);
      expect(last.details?.summary).toBe("Answer");
      expect(last.details?.prose).toBe(prose.reflectionAnswer);
      // The answer is in the closed note only, never in the section's own words.
      expect(last.prose).not.toContain(prose.reflectionAnswer);
    },
  );

  it.each(lessons)(
    "$id: the closed notes and the gated text are read by the term gate and the lessons' checks",
    ({ id, gated }) => {
      const lesson = LESSONS.find((l) => l.id === id)!;
      const read = learnerText(lesson);
      expect(read).toContain(gated);
      for (const s of lesson.sections) if (s.details) expect(read).toContain(s.details.prose);
      expect(termProblems(LESSONS)).toEqual([]);
    },
  );

  it.each(lessons)(
    "$id: the text shown after a challenge is in the figure that waits for the pass, and nowhere else",
    ({ id, gated, gatedFigure, gate }) => {
      const lesson = LESSONS.find((l) => l.id === id)!;
      const figure = lesson.sections
        .flatMap((s) => s.interactives)
        .find((x) => x.id === gatedFigure)!;
      expect(figure.props["afterChallenge"]).toBe(gate);
      expect(figure.props["note"]).toBe(gated);
      for (const s of lesson.sections) {
        expect(s.prose).not.toContain(gated);
        expect(s.details?.prose ?? "").not.toContain(gated);
      }
      for (const c of lesson.challenges) {
        expect(c.task).not.toContain(gated);
        for (const h of c.hints) expect(h).not.toContain(gated);
      }
    },
  );

  it("lesson 1: the gate for its text is the challenge that asks for the three additions", () => {
    const lesson = LESSONS.find((l) => l.id === "adding-and-the-flags")!;
    const mount = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.props["challengeId"] === "predict-flags")!;
    expect(mount).toBeDefined();
    expect(lesson.challenges.find((c) => c.id === "predict-flags")!.task).toContain(
      "A wrong flag is named, and the answers you got right stay.",
    );
  });

  it("lesson 2: the task shows next to the editor, and does not give the solution", () => {
    const task = LESSONS.find((l) => l.id === "subtracting-and-the-tick-counter")!.challenges.find(
      (c) => c.id === "write-elapsed",
    )!.task;
    for (const fact of ["now arrives in w0.", "then arrives in w1.", "Return the result in w0."])
      expect(flat(task)).toContain(fact);
    expect(task).not.toMatch(/sub w0, w0, w1/);
    expect(flat(task)).toContain("Four calls test it, two of them across the wrap.");
  });
});

describe("module 2, the interface strings", () => {
  /** The lines of the file's closing part, by their text. */
  const lines = interfaceLines
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "" && !l.startsWith("#"));
  const has = (line: string) => lines.includes(line);
  /** A line said for the carry into bit 31 as 7 and the carry out of it as 8, written with its slots. */
  const slotted = (line: string) => line.replace(/\b7\b/g, "{in}").replace(/\b8\b/g, "{out}");

  it("says, for the carries at bit 31, the lines the file gives with the carries in their slots", () => {
    expect(has(slotted(A.adder.final.carryInto(7)))).toBe(true);
    expect(has(slotted(A.adder.final.carryOutOf(8)))).toBe(true);
    expect(has(A.adder.final.c(0))).toBe(true);
    expect(has(A.adder.final.c(1))).toBe(true);
    expect(has(slotted(A.adder.final.v(0, 7, 8)))).toBe(true);
    expect(has(slotted(A.adder.final.v(1, 7, 8)))).toBe(true);
  });

  it("says, after a subtraction, that C = 0 is a borrow and C = 1 is no borrow", () => {
    expect(has(A.adder.final.cSub(0))).toBe(true);
    expect(has(A.adder.final.cSub(1))).toBe(true);
  });

  it("says, for a wrong flag, its letter and the sentence the file gives for it", () => {
    for (const flag of ["n", "z", "c", "v"] as const)
      expect(has(A.grader.flagRuleLine(flag.toUpperCase(), A.grader.flagRule[flag]))).toBe(true);
  });

  it("says, after an add, which register changed and that the flags were not updated", () => {
    expect(has(A.stepper.notUpdated("w0", "add"))).toBe(true);
  });

  it("has no em dash", () => {
    expect(interfaceLines).not.toContain("—");
  });
});
