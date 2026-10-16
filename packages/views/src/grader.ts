// Copyright © 2026 Christopher Snow

// The grader. A challenge says how it is graded with `tests: { kind: "answers", grader, cases }`.
//
// "run-registers" grades written assembly: the learner's text is assembled with the lesson's gate
// (the challenge's `allowedConstructs`), each case's call is run (`given` holds the arguments, as
// `w0`, `w1` and on), and the registers the case's `expect` names are compared. A text that does
// not assemble gives a verdict that is `blocked`, with each error against its line.
//
// "registers-at-return" grades the learner's answers: the challenge's `initial.data.program` is run
// for each case's call, and each field the case's `expect` maps to a register (`{ w0: "w0" }`) is
// compared with what that register holds at the return. The expected values are what the model
// computes, never values in the lesson's data. A wrong field gives the case's own sentence for
// that field (`given["feedback.<field>"]`) as the failure's detail, and never the right value.

import { fieldList } from "./fields";
import { TEXT_BASE, assemble, run } from "@al/machine";
import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import type { AnswerField, Artifact, Challenge } from "@platform/lesson-schema";

import {
  OUTCOMES_AT_RETURN,
  SMALLEST_SETTING_FLAG,
  gradeOutcomes,
  gradeSmallest,
} from "./grader-arith";
import { RecordedSchema, introducedOf } from "./interactives/props";
import { errorSentence, stopSentence } from "./messages";
import {
  BIT_READINGS,
  PATTERN_READINGS,
  REGISTERS_AFTER,
  gradeBitReadings,
  gradePatternReadings,
  gradeRegistersAfter,
} from "./readingGraders";
import { VIEW_STRINGS as S, plain, quoted } from "./strings";
import { traceOf, wValue, wValueAsInt } from "./trace";

export const RUN_REGISTERS = "run-registers";
export const REGISTERS_AT_RETURN = "registers-at-return";

type Cases = Extract<Challenge["tests"], { kind: "answers" }>["cases"];
type Case = Cases[number];

function answerTests(challenge: Challenge) {
  if (challenge.tests.kind !== "answers") throw new Error(`${challenge.id} has no answer tests`);
  return challenge.tests;
}

/** Whether a challenge is graded by running the learner's text. */
export function isWritten(challenge: Challenge): boolean {
  return challenge.tests.kind === "answers" && challenge.tests.grader === RUN_REGISTERS;
}

/** The arguments of a case: `w0`, `w1` and on, in order. */
function argsOf(given: Case["given"]): number[] {
  const args: number[] = [];
  for (let n = 0; n < 8; n++) {
    const v = given[`w${n}`];
    if (v === undefined) break;
    args.push(Number(v));
  }
  return args;
}

/** The number in `wN`'s name; null for any other name. */
function registerNumber(name: string): number | null {
  const m = /^w(\d{1,2})$/.exec(name);
  return m ? Number(m[1]) : null;
}

/** A value in lesson data (a number or a string of digits) as a 32-bit pattern. */
const pattern = (v: string | number): bigint => BigInt.asUintN(32, BigInt(v));

export function gradeWritten(challenge: Challenge, artifact: Artifact): Verdict {
  const { cases } = answerTests(challenge);
  const total = cases.length;
  const text = artifact.text ?? challenge.initial.text ?? "";
  if (text.trim() === "")
    return { passed: false, total, failures: [], blocked: S.grader.nothingWritten };
  const { program, errors } = assemble(text, {
    allowed: new Set(challenge.allowedConstructs),
    introduced: introducedOf(challenge),
  });
  if (program === null) {
    const lines = errors.map((e) => S.editor.lineProblem(e.line, errorSentence(e)));
    return { passed: false, total, failures: [], blocked: lines.join("\n") };
  }
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const args = argsOf(c.given);
    const inputs = Object.fromEntries(args.map((v, n) => [`w${n}`, String(v)]));
    const result = run(program, {
      entry: TEXT_BASE,
      args: args.map((value) => ({ value: BigInt(value), width: 32 })),
    });
    const stopped = stopSentence(result.stop);
    // (A verdict's detail is plain text, so the code in the machine's sentence is set in quotes.)
    if (stopped !== null) {
      failures.push({
        index,
        label: c.label,
        inputs,
        actual: {},
        expected: {},
        detail: quoted(stopped),
      });
      return;
    }
    const actual: Record<string, string> = {};
    const expected: Record<string, string> = {};
    let ok = true;
    for (const [name, want] of Object.entries(c.expect)) {
      const n = registerNumber(name);
      if (n === null) throw new Error(`${challenge.id}: ${name} is not a w register`);
      actual[name] = String(wValueAsInt(result.final, n));
      expected[name] = String(want);
      if (pattern(want) !== BigInt.asUintN(32, result.final.x[n] ?? 0n)) ok = false;
    }
    if (!ok) failures.push({ index, label: c.label, inputs, actual, expected });
  });
  return { passed: failures.length === 0, total, failures };
}

/** An answer that is a whole number, as a 32-bit pattern; null if it is not one. */
function answerPattern(answer: string | undefined): bigint | null {
  if (answer === undefined || !/^\s*-?\d+\s*$/.test(answer)) return null;
  return pattern(answer.trim());
}

export function gradeAnswers(challenge: Challenge, artifact: Artifact): Verdict {
  const { cases } = answerTests(challenge);
  const total = cases.length;
  const answers = { ...(challenge.initial.answers ?? {}), ...(artifact.answers ?? {}) };
  const fieldOf = (id: string): AnswerField | undefined =>
    challenge.fields.find((f) => f.id === id);
  const named = (id: string) => plain(fieldOf(id)?.label ?? id);
  // Every field the cases check must be answered with a whole number before anything is graded.
  const checked = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const missing = checked.filter((id) => (answers[id] ?? "").trim() === "");
  if (missing.length > 0) {
    const fields = fieldList(missing.map(named));
    return {
      passed: false,
      total,
      failures: [],
      blocked: S.grader.unanswered(fields, missing.length),
    };
  }
  const notWhole = checked.find((id) => answerPattern(answers[id]) === null);
  if (notWhole !== undefined)
    return { passed: false, total, failures: [], blocked: S.grader.notWhole(named(notWhole)) };

  const program = RecordedSchema.safeParse(challenge.initial.data?.["program"]);
  if (!program.success) throw new Error(`${challenge.id}: ${S.grader.noProgram}`);
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const entry = String(c.given["entry"] ?? "");
    const trace = traceOf(program.data, { entry, args: argsOf(c.given) });
    const wrong = Object.entries(c.expect).filter(([field, reg]) => {
      const n = registerNumber(String(reg));
      if (n === null) throw new Error(`${challenge.id}: ${String(reg)} is not a w register`);
      return answerPattern(answers[field]) !== BigInt(wValue(trace.result.final, n));
    });
    if (wrong.length === 0) return;
    // The case's own sentence for each wrong field, with its code in quotes (a verdict shows no
    // code marks). It says what to look at, never the value.
    const detail = wrong
      .map(([field]) => quoted(String(c.given[`feedback.${field}`] ?? "")))
      .filter((s) => s !== "")
      .join(" ");
    failures.push({
      index,
      label: plain(c.label),
      inputs: {},
      actual: {},
      expected: {},
      ...(detail !== "" ? { detail } : {}),
    });
  });
  return { passed: failures.length === 0, total, failures };
}

export function grade(challenge: Challenge, artifact: Artifact): Verdict {
  const { grader } = answerTests(challenge);
  if (grader === RUN_REGISTERS) return gradeWritten(challenge, artifact);
  if (grader === REGISTERS_AT_RETURN) return gradeAnswers(challenge, artifact);
  if (grader === OUTCOMES_AT_RETURN) return gradeOutcomes(challenge, artifact);
  if (grader === SMALLEST_SETTING_FLAG) return gradeSmallest(challenge, artifact);
  if (grader === BIT_READINGS) return gradeBitReadings(challenge, artifact);
  if (grader === PATTERN_READINGS) return gradePatternReadings(challenge, artifact);
  if (grader === REGISTERS_AFTER) return gradeRegistersAfter(challenge, artifact);
  throw new Error(`${challenge.id}: there is no grader called ${grader}`);
}
