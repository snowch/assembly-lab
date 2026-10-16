// Copyright © 2026 Christopher Snow

// The graders of Module 1's answers challenges. Each reads the learner's answers (by field id), and
// every value it checks them against is taken from the model, never from the lesson's data.
//
// "bit-readings": a challenge with a field of 32 bits and a number. A case's `given.reading` is
// `unsigned` or `signed`. A case whose `expect` maps the bits field to a number checks that the
// bits, read that way, give that number (the target is the challenge's own, and the page says what
// the learner's bits do read as, which is not the answer). A case whose `expect` maps a number
// field to the name of the bits field checks that the number is what the learner's own bits give
// when read that way.
//
// "pattern-readings": a case's `given.pattern` is a number written in hexadecimal; its `expect`
// maps a number field to `unsigned` or `signed`. The pattern is put in `w0` on the model, and the
// field must be the reading of what `w0` then holds. The comparison is exact: 4294967096 is not
// −200.
//
// "registers-after": the challenge's `initial.data.program` is run from its first instruction,
// and a case's `expect` maps a number field to the register it is about (`x1`, `w2`). The field
// must be the register's value after the program's last instruction, as an unsigned or a signed
// whole number of the register's width. A wrong field gets a sentence that names the register and
// never says the value.

import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import type { AnswerField, Artifact, Challenge } from "@platform/lesson-schema";

import { stateAfter } from "@al/machine";

import { RecordedSchema } from "./interactives/props";
import {
  NO_BITS,
  isPattern,
  readingsOfPattern,
  readingsOfValue,
  shown,
  wholeNumber,
} from "./readings";
import { VIEW_STRINGS as S, plain } from "./strings";
import { traceText } from "./traceText";

export const BIT_READINGS = "bit-readings";
export const PATTERN_READINGS = "pattern-readings";
export const REGISTERS_AFTER = "registers-after";

type Cases = Extract<Challenge["tests"], { kind: "answers" }>["cases"];

function casesOf(challenge: Challenge): Cases {
  if (challenge.tests.kind !== "answers") throw new Error(`${challenge.id} has no answer tests`);
  return challenge.tests.cases;
}

function answersOf(challenge: Challenge, artifact: Artifact): Record<string, string> {
  return { ...(challenge.initial.answers ?? {}), ...(artifact.answers ?? {}) };
}

const nameOf = (challenge: Challenge, id: string): string =>
  plain(challenge.fields.find((f: AnswerField) => f.id === id)?.label ?? id);

/** Why nothing can be graded yet: a number field that is empty or is not a whole number. */
function blockedBy(
  challenge: Challenge,
  answers: Record<string, string>,
  ids: readonly string[],
): string | undefined {
  const empty = ids.filter((id) => (answers[id] ?? "").trim() === "");
  if (empty.length > 0)
    return S.grader.unanswered(empty.map((id) => nameOf(challenge, id)).join(", "));
  const bad = ids.find((id) => wholeNumber(answers[id]) === null);
  if (bad !== undefined) return S.grader.notWhole(nameOf(challenge, bad));
  return undefined;
}

const reading = (given: Cases[number]["given"]): "unsigned" | "signed" => {
  const r = given["reading"];
  if (r !== "unsigned" && r !== "signed") throw new Error(`a case reads the bits as ${String(r)}`);
  return r;
};

function failure(index: number, c: Cases[number], detail: string): VerdictFailure {
  return { index, label: plain(c.label), inputs: {}, actual: {}, expected: {}, detail };
}

export function gradeBitReadings(challenge: Challenge, artifact: Artifact): Verdict {
  const cases = casesOf(challenge);
  const total = cases.length;
  const answers = answersOf(challenge, artifact);
  const numbers = [
    ...new Set(
      cases.flatMap((c) =>
        Object.entries(c.expect).flatMap(([field, spec]) =>
          typeof spec === "string" ? [field] : [],
        ),
      ),
    ),
  ];
  const blocked = blockedBy(challenge, answers, numbers);
  if (blocked !== undefined) return { passed: false, total, failures: [], blocked };
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const way = reading(c.given);
    for (const [field, spec] of Object.entries(c.expect)) {
      if (typeof spec === "number") {
        const bits = answers[field] ?? NO_BITS;
        if (!isPattern(bits)) throw new Error(`${challenge.id}: ${field} is not 32 bits`);
        const got = readingsOfPattern(bits)[way];
        if (got !== spec) failures.push(failure(index, c, S.readings.bitsRead(shown(got))));
      } else {
        const bits = answers[spec] ?? NO_BITS;
        if (!isPattern(bits)) throw new Error(`${challenge.id}: ${spec} is not 32 bits`);
        const want = BigInt(readingsOfPattern(bits)[way]);
        if (wholeNumber(answers[field]) !== want)
          failures.push(failure(index, c, S.readings.notThis));
      }
    }
  });
  return { passed: failures.length === 0, total, failures };
}

export function gradePatternReadings(challenge: Challenge, artifact: Artifact): Verdict {
  const cases = casesOf(challenge);
  const total = cases.length;
  const answers = answersOf(challenge, artifact);
  const fields = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const blocked = blockedBy(challenge, answers, fields);
  if (blocked !== undefined) return { passed: false, total, failures: [], blocked };
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const readings = readingsOfValue(BigInt(String(c.given["pattern"])));
    for (const [field, way] of Object.entries(c.expect)) {
      if (way !== "unsigned" && way !== "signed")
        throw new Error(`${challenge.id}: ${String(way)} is not a reading`);
      if (wholeNumber(answers[field]) !== BigInt(readings[way]))
        failures.push(failure(index, c, S.readings.notThis));
    }
  });
  return { passed: failures.length === 0, total, failures };
}

/** The number in `xN` or `wN`, and whether the register is read at 64 bits. */
function registerNamed(name: string): { n: number; wide: boolean } {
  const m = /^([xw])(\d{1,2})$/.exec(name);
  if (!m) throw new Error(`${name} is not a register`);
  return { n: Number(m[2]), wide: m[1] === "x" };
}

export function gradeRegistersAfter(challenge: Challenge, artifact: Artifact): Verdict {
  const cases = casesOf(challenge);
  const total = cases.length;
  const answers = answersOf(challenge, artifact);
  const fields = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const blocked = blockedBy(challenge, answers, fields);
  if (blocked !== undefined) return { passed: false, total, failures: [], blocked };
  const program = RecordedSchema.safeParse(challenge.initial.data?.["program"]);
  if (!program.success) throw new Error(`${challenge.id}: ${S.grader.noProgram}`);
  const { result } = traceText(program.data.listing);
  const state = stateAfter(result, result.steps.length - 1);
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    for (const [field, register] of Object.entries(c.expect)) {
      const { n, wide } = registerNamed(String(register));
      const bits = wide ? 64 : 32;
      const held = BigInt.asUintN(bits, state.x[n] ?? 0n);
      const given = wholeNumber(answers[field]);
      const right = given !== null && (given === held || given === BigInt.asIntN(bits, held));
      if (!right) failures.push(failure(index, c, S.readings.registerWrong(String(register))));
    }
  });
  return { passed: failures.length === 0, total, failures };
}
