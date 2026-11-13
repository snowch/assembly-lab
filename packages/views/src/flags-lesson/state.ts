// Copyright © 2026 Christopher Snow

import type { Artifact, Challenge } from "@platform/lesson-schema";
import type { LessonStore } from "@platform/lesson-runtime";
import { grade } from "../grader";
import { FLAG_NAMES, type Digit, type FlagName, type Reading } from "./model";

export const FLAGS_VIEW_SLOT = "flags-lesson-presentation";
export type Answers = { choices: Partial<Record<FlagName, Digit>>; checked: boolean };
export type FlagsState = {
  example: number;
  mini: Answers & { intent: "c" | "v" | null };
  arm: {
    draft: number | null;
    committed: number | null;
    open: boolean;
    reading: Reading;
    bits: boolean;
    trace: boolean;
    done: number;
  };
  practice: { index: number; cases: Answers[] };
};
export const emptyAnswers = (): Answers => ({ choices: {}, checked: false });
export const blank = (caseCount: number): FlagsState => ({
  example: 0,
  mini: { ...emptyAnswers(), intent: null },
  arm: {
    draft: null,
    committed: null,
    open: false,
    reading: "unsigned",
    bits: false,
    trace: false,
    done: 0,
  },
  practice: { index: 0, cases: Array.from({ length: caseCount }, emptyAnswers) },
});
const object = (x: unknown): Record<string, unknown> =>
  x !== null && typeof x === "object" ? (x as Record<string, unknown>) : {};
export const validIndex = (v: unknown, length: number): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= 0 && v < length;
function cleanAnswers(raw: unknown): Answers {
  const value = object(raw),
    source = object(value["choices"]);
  const choices: Answers["choices"] = {};
  for (const flag of FLAG_NAMES)
    if (source[flag] === 0 || source[flag] === 1) choices[flag] = source[flag];
  return { choices, checked: value["checked"] === true };
}
export function restore(raw: unknown, caseCount: number): FlagsState {
  const s = blank(caseCount),
    value = object(raw),
    mini = object(value["mini"]),
    arm = object(value["arm"]),
    practice = object(value["practice"]);
  s.example = validIndex(value["example"], 4) ? value["example"] : 0;
  s.mini = {
    ...cleanAnswers(mini),
    intent: mini["intent"] === "c" || mini["intent"] === "v" ? mini["intent"] : null,
  };
  s.arm = {
    draft: validIndex(arm["draft"], 4) ? arm["draft"] : null,
    committed: validIndex(arm["committed"], 4) ? arm["committed"] : null,
    open: arm["open"] === true,
    reading: arm["reading"] === "signed" ? "signed" : "unsigned",
    bits: arm["bits"] === true,
    trace: arm["trace"] === true,
    done:
      typeof arm["done"] === "number" && Number.isInteger(arm["done"])
        ? Math.max(0, Math.min(32, arm["done"]))
        : 0,
  };
  const cases = Array.isArray(practice["cases"]) ? practice["cases"] : [];
  s.practice = {
    index: validIndex(practice["index"], caseCount) ? practice["index"] : 0,
    cases: Array.from({ length: caseCount }, (_, i) => cleanAnswers(cases[i])),
  };
  return s;
}
export function caseFields(challenge: Challenge, index: number): string[] {
  if (challenge.tests.kind !== "answers" || !challenge.tests.cases[index])
    throw new Error("Missing flags challenge case.");
  return Object.keys(challenge.tests.cases[index].expect);
}
export function currentArtifact(store: LessonStore, challenge: Challenge): Artifact {
  return store.challenge(challenge.id)?.artifact ?? challenge.initial;
}
export function complete(answer: Answers) {
  return FLAG_NAMES.every((flag) => answer.choices[flag] !== undefined);
}
export function committedCase(
  store: LessonStore,
  challenge: Challenge,
  index: number,
  answer: Answers,
): boolean {
  const artifact = currentArtifact(store, challenge);
  return (
    complete(answer) &&
    caseFields(challenge, index).every(
      (field, n) => artifact.answers?.[field] === String(answer.choices[FLAG_NAMES[n]!]),
    )
  );
}
export function gradeCase(store: LessonStore, challenge: Challenge, index: number) {
  if (challenge.tests.kind !== "answers") throw new Error("Missing flags answer tests.");
  const fields = caseFields(challenge, index);
  return grade(
    {
      ...challenge,
      fields: challenge.fields.filter((f) => fields.includes(f.id)),
      tests: { ...challenge.tests, cases: [challenge.tests.cases[index]!] },
    },
    currentArtifact(store, challenge),
  );
}
/** Only the current submitted case is committed. Editing it removes its old proof from the canonical grader. */
export function commitCase(
  store: LessonStore,
  challenge: Challenge,
  index: number,
  answer: Answers,
  submitted: boolean,
) {
  const artifact = currentArtifact(store, challenge),
    answers = { ...artifact.answers };
  caseFields(challenge, index).forEach((field, n) => {
    delete answers[field];
    if (submitted && complete(answer)) answers[field] = String(answer.choices[FLAG_NAMES[n]!]);
  });
  const nextArtifact = { ...artifact, answers };
  const passed = submitted && grade(challenge, nextArtifact).passed;
  store.setChallenge(challenge.id, (previous) => ({
    ...previous,
    artifact: nextArtifact,
    attempts: previous.attempts + Number(submitted),
    ...(passed && !previous.firstPassedAt ? { firstPassedAt: new Date().toISOString() } : {}),
  }));
}
/** Migrate existing course predictions and graded answers without treating prototype checks as grades. */
export function stateFor(store: LessonStore, challenge: Challenge): FlagsState {
  if (challenge.tests.kind !== "answers") throw new Error("Missing flags answer tests.");
  const caseCount = challenge.tests.cases.length;
  const raw = store.slot(FLAGS_VIEW_SLOT);
  const s = restore(raw, caseCount);
  const prediction = object(store.slot("predict-readings"));
  const options = ["both", "unsigned", "signed", "neither"];
  const committed =
    typeof prediction["choice"] === "string" ? options.indexOf(prediction["choice"]) : -1;
  s.arm.committed = committed < 0 ? null : committed;
  if (raw === undefined) {
    s.arm.draft = s.arm.committed;
    const artifact = currentArtifact(store, challenge);
    s.practice.cases = Array.from({ length: caseCount }, (_, index) => {
      const choices: Answers["choices"] = {};
      caseFields(challenge, index).forEach((field, n) => {
        const v = artifact.answers?.[field];
        if (v === "0" || v === "1") choices[FLAG_NAMES[n]!] = Number(v) as Digit;
      });
      return { choices, checked: complete({ choices, checked: false }) };
    });
  }
  s.practice.cases.forEach((answer, i) => {
    answer.checked = committedCase(store, challenge, i, answer);
  });
  return s;
}
