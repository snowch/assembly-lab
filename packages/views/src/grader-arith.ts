// Copyright © 2026 Christopher Snow

// The graders Module 2 adds, for answers that are read off a run of the challenge's program: a
// register at the return or a flag, and the smallest number that sets a flag. Like the grader for
// registers, the expected value is what the model computes, never a number in the lesson's data,
// and a wrong answer is never told the right value.
//
// "outcomes-at-return" runs `initial.data.program` for each case (`given.entry`, and the arguments
// as `w0`, `w1` and on). Each field the case's `expect` maps to `w<N>` is compared with that
// register's value (read as an unsigned number, so a negative answer is not the same answer), and
// each mapped to `n`, `z`, `c` or `v` with that flag. A case's `given["feedback.<field>"]` is the
// sentence said for a wrong field; with none, the failure names the case only.
//
// "smallest-setting-flag" asks for the smallest positive number that, as `w1`, sets a flag after the
// program runs with the other arguments the case gives. The case's `given.flag` names the flag and
// its `expect` maps one field to `w1`. An answer passes when it sets the flag and the number below
// it does not (or is 0), which for the lesson's operand is the only such number.

import { fieldList } from "./fields";
import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import type { AnswerField, Artifact, Challenge } from "@platform/lesson-schema";

import { flagNamed } from "./arith";
import { RecordedSchema } from "./interactives/props";
import { stopSentence } from "./messages";
import { VIEW_STRINGS as S, plain } from "./strings";
import { ARITH_STRINGS as A } from "./strings.arith";
import { traceOf, wValue } from "./trace";

export const OUTCOMES_AT_RETURN = "outcomes-at-return";
export const SMALLEST_SETTING_FLAG = "smallest-setting-flag";

type Cases = Extract<Challenge["tests"], { kind: "answers" }>["cases"];
type Case = Cases[number];

function casesOf(challenge: Challenge): Cases {
  if (challenge.tests.kind !== "answers") throw new Error(`${challenge.id} has no answer tests`);
  return challenge.tests.cases;
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

/** The answers to grade: the challenge's starting answers, then the learner's. */
function answersOf(challenge: Challenge, artifact: Artifact): Record<string, string> {
  return { ...(challenge.initial.answers ?? {}), ...(artifact.answers ?? {}) };
}

/** A whole number written in decimal (no sign but a minus, no point); null if it is not one. */
function wholeNumber(answer: string | undefined): bigint | null {
  if (answer === undefined || !/^\s*-?\d+\s*$/.test(answer)) return null;
  return BigInt(answer.trim());
}

function programOf(challenge: Challenge) {
  const program = RecordedSchema.safeParse(challenge.initial.data?.["program"]);
  if (!program.success) throw new Error(`${challenge.id}: ${S.grader.noProgram}`);
  return program.data;
}

/** The answers that must be given, or a verdict that says which are missing or not whole numbers. */
function unanswered(challenge: Challenge, answers: Record<string, string>, ids: string[]) {
  const total = casesOf(challenge).length;
  const named = (id: string) =>
    plain(challenge.fields.find((f: AnswerField) => f.id === id)?.label ?? id);
  const missing = ids.filter((id) => (answers[id] ?? "").trim() === "");
  if (missing.length > 0)
    return {
      passed: false,
      total,
      failures: [],
      blocked: S.grader.unanswered(fieldList(missing.map(named)), missing.length),
    } satisfies Verdict;
  const notWhole = ids.find((id) => wholeNumber(answers[id]) === null);
  if (notWhole !== undefined)
    return {
      passed: false,
      total,
      failures: [],
      blocked: S.grader.notWhole(named(notWhole)),
    } satisfies Verdict;
  return null;
}

export function gradeOutcomes(challenge: Challenge, artifact: Artifact): Verdict {
  const cases = casesOf(challenge);
  const total = cases.length;
  const answers = answersOf(challenge, artifact);
  const checked = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const blocked = unanswered(challenge, answers, checked);
  if (blocked) return blocked;

  const program = programOf(challenge);
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const trace = traceOf(program, {
      entry: String(c.given["entry"] ?? ""),
      args: argsOf(c.given),
    });
    const stopped = stopSentence(trace.result.stop);
    if (stopped !== null) throw new Error(`${challenge.id}: ${stopped}`);
    const wrong = Object.entries(c.expect).filter(([field, what]) => {
      const name = String(what);
      const flag = flagNamed(trace.result.final.flags, name);
      const register = /^w(\d{1,2})$/.exec(name);
      if (flag === null && register === null)
        throw new Error(`${challenge.id}: ${name} is neither a w register nor a flag`);
      const expected =
        flag !== null ? BigInt(flag) : BigInt(wValue(trace.result.final, Number(register![1])));
      return wholeNumber(answers[field]) !== expected;
    });
    if (wrong.length === 0) return;
    const detail = wrong
      .map(([field]) => plain(String(c.given[`feedback.${field}`] ?? "")))
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

export function gradeSmallest(challenge: Challenge, artifact: Artifact): Verdict {
  const cases = casesOf(challenge);
  const total = cases.length;
  const answers = answersOf(challenge, artifact);
  const checked = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const blocked = unanswered(challenge, answers, checked);
  if (blocked) return blocked;

  const program = programOf(challenge);
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const entry = String(c.given["entry"] ?? "");
    const flag = String(c.given["flag"] ?? "");
    const field = Object.keys(c.expect)[0] ?? "";
    const given = argsOf(c.given);
    const setsFlag = (value: bigint): boolean => {
      const arg = Number(BigInt.asUintN(32, value));
      const trace = traceOf(program, { entry, args: [...given, arg] });
      const set = flagNamed(trace.result.final.flags, flag);
      if (set === null) throw new Error(`${challenge.id}: ${flag} is not a flag`);
      return set === 1;
    };
    const answer = wholeNumber(answers[field]) ?? 0n;
    let detail: string | undefined;
    if (answer < 1n || answer >= 2n ** 32n || !setsFlag(answer))
      detail = A.grader.flagClear(flag.toUpperCase());
    else if (answer > 1n && setsFlag(answer - 1n)) detail = A.grader.notSmallest;
    if (detail !== undefined)
      failures.push({ index, label: plain(c.label), inputs: {}, actual: {}, expected: {}, detail });
  });
  return { passed: failures.length === 0, total, failures };
}
