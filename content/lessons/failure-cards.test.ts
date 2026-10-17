// Copyright © 2026 Christopher Snow

// A failure card never comes up empty. The platform's verdict view prints the labels Inputs, Actual
// and Expected whenever a failure has no `detail`, with nothing under them when the failure holds no
// values either. So every failure any grader returns, for any lesson's challenge, carries a detail
// or the values to print. Each challenge is tried with its reference, and with each answer in turn
// changed to something else; a written challenge is tried with its starting text and with a text
// that only returns.

import { describe, expect, it } from "vitest";

import { grade } from "@al/views";
import type { Artifact, Challenge } from "@platform/lesson-schema";

import { LESSONS } from ".";

/** The ways an answer can be wrong: the other whole numbers near it, a flipped bit, another word. */
function changes(answer: string): string[] {
  const out: string[] = [];
  // A field of 32 bits takes only 32 bits.
  if (/^[01]{32}$/.test(answer))
    return [
      answer.replace(/^./, (b) => (b === "0" ? "1" : "0")),
      answer.replace(/.$/, (b) => (b === "0" ? "1" : "0")),
    ];
  if (/^-?\d+$/.test(answer)) out.push(String(Number(answer) + 1), String(Number(answer) - 1));
  if (/^(0x)?[0-9a-f]{1,8}$/i.test(answer)) out.push("0x0", "ffffffff", "1");
  out.push("0", "7", "orr", "tst");
  return [...new Set(out)].filter((a) => a !== answer);
}

/** Whether a failure shows something under its labels. */
const shows = (f: {
  detail?: string | undefined;
  actual: Record<string, string>;
  expected: Record<string, string>;
}): boolean =>
  (f.detail ?? "").trim() !== "" ||
  (Object.keys(f.actual).length > 0 && Object.keys(f.expected).length > 0);

describe("the failure cards", () => {
  const answered = LESSONS.flatMap((lesson) =>
    lesson.challenges
      .filter((c) => c.gradedDirection !== "write")
      .map((c) => [`${lesson.id}: ${c.id}`, c] as const),
  );
  const written = LESSONS.flatMap((lesson) =>
    lesson.challenges
      .filter((c) => c.gradedDirection === "write")
      .map((c) => [`${lesson.id}: ${c.id}`, c] as const),
  );

  it("are tried on a good many challenges", () => {
    expect(answered.length).toBeGreaterThan(8);
    expect(written.length).toBeGreaterThan(4);
  });

  it.each(answered)(
    "%s: a wrong answer in any one field gives a card with something in it",
    (_, c) => {
      const reference = c.reference.answers ?? {};
      expect(grade(c, { answers: reference }).passed).toBe(true);
      let tried = 0;
      for (const [field, right] of Object.entries(reference)) {
        for (const wrong of changes(right)) {
          const verdict = grade(c, { answers: { ...reference, [field]: wrong } });
          if (verdict.passed || verdict.blocked !== undefined) continue;
          tried++;
          for (const f of verdict.failures)
            expect(shows(f), `${c.id}: ${field} = ${wrong} gave an empty card`).toBe(true);
        }
      }
      expect(tried, `${c.id}: no wrong answer reached a failure`).toBeGreaterThan(0);
    },
  );

  it.each(written)("%s: a wrong program gives a card with something in it", (_, c: Challenge) => {
    const artifacts: Artifact[] = [c.initial, { text: "ret" }, { text: "mov w0, 0\nret" }];
    let tried = 0;
    for (const artifact of artifacts) {
      const verdict = grade(c, artifact);
      if (verdict.passed || verdict.blocked !== undefined) continue;
      tried++;
      for (const f of verdict.failures) expect(shows(f), `${c.id}: an empty card`).toBe(true);
    }
    expect(tried, `${c.id}: no program reached a failure`).toBeGreaterThan(0);
  });

  it("name the field, and never the value, when a case has no sentence of its own", () => {
    const holds = LESSONS.find((l) => l.id === "compare-and-choose")!.challenges.find(
      (c) => c.id === "read-four-conditions",
    )!;
    const reference = holds.reference.answers!;
    const verdict = grade(holds, {
      answers: { ...reference, ge: String(1 - Number(reference.ge)) },
    });
    expect(verdict.failures.map((f) => f.detail)).toEqual(["Your answer for ‘ge’ is not right."]);
  });
});

// The written challenges whose C is `unsigned` (the functions' recorded C in docs/notes/module-N/
// listings.md and the lessons' tasks). Their cases say so, so a failure card prints the same
// reading for what the program returned and what was expected. The others are `int` (Module 0's
// `fuel_used`, Module 1's `odometer_limit`).
const UNSIGNED_WRITTEN = [
  "write-elapsed",
  "write-set-gear",
  "write-less-fuel",
  "write-fuel-warning",
  "write-dim-up",
  "write-dim-down",
  "write-dim-until-dark",
];

describe("the written challenges' readings", () => {
  const all = LESSONS.flatMap((l) => l.challenges.filter((c) => c.gradedDirection === "write"));

  it("are unsigned in every case of an unsigned function, and absent from the others", () => {
    for (const c of all) {
      const readings =
        c.tests.kind === "answers" ? c.tests.cases.map((t) => t.given["reading"]) : [];
      const want = UNSIGNED_WRITTEN.includes(c.id) ? "unsigned" : undefined;
      expect(readings, c.id).toEqual(readings.map(() => want));
    }
    expect(all.map((c) => c.id)).toEqual(expect.arrayContaining(UNSIGNED_WRITTEN));
  });

  it("show a failure of set_gear with both values unsigned", () => {
    const setGear = all.find((c) => c.id === "write-set-gear")!;
    const verdict = grade(setGear, setGear.initial);
    const card = verdict.failures.find((f) => f.label === "set_gear(0xffffffff, 0)")!;
    expect(card.expected).toEqual({ w0: "4294967183" });
    expect(Number(card.actual["w0"])).toBeGreaterThanOrEqual(0);
  });
});
