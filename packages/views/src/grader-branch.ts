// Copyright © 2026 Christopher Snow

// The grader Module 4 adds, for answers that are read off a run on the model: what a function
// returns, how many instructions a run takes, and whether a condition holds after a `cmp`. As with
// the other graders, the expected value is what the model computes, never a number in the lesson's
// data, and a wrong answer is never told the right value.
//
// "branch-outcomes" grades one field for each case. A case's `given` holds the arguments (`w0`,
// `w1` and on, as 32-bit patterns) and, for the cases that run the challenge's program
// (`initial.data.program`), the label to start at as `entry`. Each field the case's `expect` maps
// is compared with:
//
//   - "w0": the 32-bit pattern `w0` holds when the run returns (a negative answer is the pattern it
//     stands for, as in the other graders);
//   - "steps": the number of instructions the run took, `ret` included, exactly;
//   - "holds:<condition>": 1 if the condition holds after `cmp w0, w1` on the case's two values and
//     0 if it does not, exactly. The model runs a `cset` to find out.
//
// A case's `given["feedback.<field>"]` is the sentence said for a wrong field; with none, the failure
// says the answer for that field is not right (it names the field, never the value).

import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import type { AnswerField, Artifact, Challenge } from "@platform/lesson-schema";

import { compareResult } from "./branch";
import { failureDetail, fieldList } from "./fields";
import { RecordedSchema } from "./interactives/props";
import { stopSentence } from "./messages";
import { VIEW_STRINGS as S, plain } from "./strings";
import { BRANCH_STRINGS as B } from "./strings.branch";
import { traceOf, wValue } from "./trace";

export const BRANCH_OUTCOMES = "branch-outcomes";

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

/** A whole number written in decimal (no sign but a minus, no point); null if it is not one. */
function wholeNumber(answer: string | undefined): bigint | null {
  if (answer === undefined || !/^\s*-?\d+\s*$/.test(answer)) return null;
  return BigInt(answer.trim());
}

export function gradeBranchOutcomes(challenge: Challenge, artifact: Artifact): Verdict {
  const cases = casesOf(challenge);
  const total = cases.length;
  const answers = { ...(challenge.initial.answers ?? {}), ...(artifact.answers ?? {}) };
  const named = (id: string) =>
    plain(challenge.fields.find((f: AnswerField) => f.id === id)?.label ?? id);
  const checked = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const missing = checked.filter((id) => (answers[id] ?? "").trim() === "");
  if (missing.length > 0)
    return {
      passed: false,
      total,
      failures: [],
      blocked: S.grader.unanswered(fieldList(missing.map(named)), missing.length),
    };
  const notWhole = checked.find((id) => wholeNumber(answers[id]) === null);
  if (notWhole !== undefined)
    return { passed: false, total, failures: [], blocked: S.grader.notWhole(named(notWhole)) };

  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const args = argsOf(c.given);
    const wrong = Object.entries(c.expect).filter(([field, what]) => {
      const answer = wholeNumber(answers[field]) as bigint;
      const kind = String(what);
      if (kind.startsWith("holds:")) {
        const condition = kind.slice("holds:".length);
        const holds = compareResult(args[0] ?? 0, args[1] ?? 0, [condition]).holds[condition];
        return answer !== (holds ? 1n : 0n);
      }
      const program = RecordedSchema.safeParse(challenge.initial.data?.["program"]);
      if (!program.success) throw new Error(`${challenge.id}: ${S.grader.noProgram}`);
      const trace = traceOf(program.data, { entry: String(c.given["entry"] ?? ""), args });
      const stopped = stopSentence(trace.result.stop);
      if (stopped !== null) throw new Error(`${challenge.id}: ${B.grader.cannotRun} ${stopped}`);
      if (kind === "w0")
        return BigInt.asUintN(32, answer) !== BigInt(wValue(trace.result.final, 0));
      if (kind === "steps") return answer !== BigInt(trace.result.steps.length);
      throw new Error(`${challenge.id}: ${kind} is neither w0, steps nor holds:<condition>`);
    });
    if (wrong.length === 0) return;
    const detail = failureDetail(
      wrong.map(([field]) => field),
      c.given,
      named,
      plain,
    );
    failures.push({ index, label: plain(c.label), inputs: {}, actual: {}, expected: {}, detail });
  });
  return { passed: failures.length === 0, total, failures };
}
