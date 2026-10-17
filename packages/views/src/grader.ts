// Copyright © 2026 Christopher Snow

// The grader. A challenge says how it is graded with `tests: { kind: "answers", grader, cases }`.
//
// "run-registers" grades written assembly: the learner's text is assembled with the lesson's gate
// (the challenge's `allowedConstructs`), each case's call is run (`given` holds the arguments, as
// `w0`, `w1` and on), and the registers the case's `expect` names are compared. A text that does
// not assemble gives a verdict that is `blocked`, with each error against its line.
//
// A case may name a mistake it expects (`given["misconception.value"]`, the value the one
// register the case checks holds when the mistake is made, which the lesson works out on the model,
// and `given["misconception.feedback"]`, the sentence for it). A failed case whose register holds
// exactly that value shows the sentence in place of the usual card; every other failure keeps the
// usual card.
//
// "registers-at-return" grades the learner's answers: the challenge's `initial.data.program` is run
// for each case's call, and each field the case's `expect` maps to a register (`{ w0: "w0" }`) is
// compared with what that register holds at the return. The expected values are what the model
// computes, never values in the lesson's data. A wrong field gives the case's own sentence for
// that field (`given["feedback.<field>"]`) as the failure's detail, and never the right value.

import { failureDetail, fieldList } from "./fields";
import { TEXT_BASE, assemble, run } from "@al/machine";
import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import type { AnswerField, Artifact, Challenge } from "@platform/lesson-schema";

import {
  OUTCOMES_AT_RETURN,
  SMALLEST_SETTING_FLAG,
  gradeOutcomes,
  gradeSmallest,
} from "./grader-arith";
import { BRANCH_OUTCOMES, gradeBranchOutcomes } from "./grader-branch";
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
/** As "registers-at-return", for answers written in hexadecimal (`0x2b`, or `2b`). */
export const HEX_REGISTERS_AT_RETURN = "hex-registers-at-return";
/**
 * Grades answers that name an instruction: each case runs the challenge's hidden program from the
 * label `entry` and compares the answer with the mnemonic of the first instruction that runs.
 */
export const INSTRUCTION_AT_ENTRY = "instruction-at-entry";

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
      // A test whose `given.reading` is "unsigned" shows its values as the unsigned numbers they are.
      const unsigned = c.given["reading"] === "unsigned";
      actual[name] = String(unsigned ? wValue(result.final, n) : wValueAsInt(result.final, n));
      expected[name] = String(unsigned ? pattern(want) : want);
      if (pattern(want) !== BigInt.asUintN(32, result.final.x[n] ?? 0n)) ok = false;
    }
    if (!ok) {
      const feedback = c.given["misconception.feedback"];
      const mistaken = c.given["misconception.value"];
      const names = Object.keys(c.expect);
      const only = names.length === 1 ? registerNumber(names[0] as string) : null;
      const isMistake =
        feedback !== undefined &&
        mistaken !== undefined &&
        only !== null &&
        pattern(mistaken) === BigInt.asUintN(32, result.final.x[only] ?? 0n);
      failures.push({
        index,
        label: c.label,
        inputs,
        actual,
        expected,
        ...(isMistake ? { detail: quoted(String(feedback)) } : {}),
      });
    }
  });
  return { passed: failures.length === 0, total, failures };
}

/**
 * An answer that is a whole number, as a 32-bit pattern; null if it is not one. In radix 16 it is
 * hexadecimal digits with an optional `0x`, and no sign.
 */
function answerPattern(answer: string | undefined, radix: 10 | 16 = 10): bigint | null {
  if (answer === undefined) return null;
  if (radix === 16) {
    const m = /^\s*(?:0x)?([0-9a-f]{1,8})\s*$/i.exec(answer);
    return m ? BigInt(`0x${m[1] as string}`) : null;
  }
  if (!/^\s*-?\d+\s*$/.test(answer)) return null;
  return pattern(answer.trim());
}

/** The program a case of an answers challenge runs: the one it shows, or one it keeps to itself. */
function programOf(challenge: Challenge) {
  const data = challenge.initial.data;
  const program = RecordedSchema.safeParse(data?.["program"] ?? data?.["model"]);
  if (!program.success) throw new Error(`${challenge.id}: ${S.grader.noProgram}`);
  return program.data;
}

export function gradeAnswers(
  challenge: Challenge,
  artifact: Artifact,
  radix: 10 | 16 = 10,
): Verdict {
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
      blocked:
        radix === 16 ? S.answers.unanswered(fields) : S.grader.unanswered(fields, missing.length),
    };
  }
  const notWhole = checked.find((id) => answerPattern(answers[id], radix) === null);
  if (notWhole !== undefined)
    return {
      passed: false,
      total,
      failures: [],
      blocked:
        radix === 16
          ? S.answers.notHex(fieldList([named(notWhole)]))
          : S.grader.notWhole(fieldList([named(notWhole)])),
    };

  const program = programOf(challenge);
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const entry = String(c.given["entry"] ?? "");
    const trace = traceOf(program, { entry, args: argsOf(c.given) });
    const wrong = Object.entries(c.expect).filter(([field, reg]) => {
      const n = registerNumber(String(reg));
      if (n === null) throw new Error(`${challenge.id}: ${String(reg)} is not a w register`);
      return answerPattern(answers[field], radix) !== BigInt(wValue(trace.result.final, n));
    });
    if (wrong.length === 0) return;
    // The case's own sentence for each wrong field, with its code in quotes (a verdict shows no
    // code marks). It says what to look at, never the value.
    const detail = failureDetail(
      wrong.map(([field]) => field),
      c.given,
      named,
      quoted,
    );
    failures.push({ index, label: plain(c.label), inputs: {}, actual: {}, expected: {}, detail });
  });
  return { passed: failures.length === 0, total, failures };
}

/** The instruction an answer names: its first word, in lower case, without code marks. */
const mnemonicOf = (answer: string): string =>
  answer.replace(/`/g, "").trim().split(/\s+/)[0]?.toLowerCase() ?? "";

export function gradeInstructions(challenge: Challenge, artifact: Artifact): Verdict {
  const { cases } = answerTests(challenge);
  const total = cases.length;
  const answers = { ...(challenge.initial.answers ?? {}), ...(artifact.answers ?? {}) };
  const named = (id: string) => plain(challenge.fields.find((f) => f.id === id)?.label ?? id);
  const checked = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const missing = checked.filter((id) => (answers[id] ?? "").trim() === "");
  if (missing.length > 0)
    return {
      passed: false,
      total,
      failures: [],
      blocked: S.answers.unanswered(missing.map(named).join(", ")),
    };
  const program = programOf(challenge);
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const entry = String(c.given["entry"] ?? "");
    const trace = traceOf(program, { entry, args: argsOf(c.given) });
    // The instruction the model ran first is the answer.
    const ran = mnemonicOf(trace.result.steps[0]?.text ?? "");
    const wrong = Object.keys(c.expect).filter((field) => mnemonicOf(answers[field] ?? "") !== ran);
    if (wrong.length === 0) return;
    const detail = failureDetail(wrong, c.given, named, plain);
    failures.push({ index, label: plain(c.label), inputs: {}, actual: {}, expected: {}, detail });
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
  if (grader === BRANCH_OUTCOMES) return gradeBranchOutcomes(challenge, artifact);
  if (grader === HEX_REGISTERS_AT_RETURN) return gradeAnswers(challenge, artifact, 16);
  if (grader === INSTRUCTION_AT_ENTRY) return gradeInstructions(challenge, artifact);
  throw new Error(`${challenge.id}: there is no grader called ${grader}`);
}
