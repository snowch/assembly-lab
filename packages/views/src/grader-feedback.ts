// Copyright © 2026 Christopher Snow

// What a written challenge says to a learner whose program failed a test, chosen by what the run
// shows. A challenge asks for it in `initial.data.feedback`: a rule, and the sentences the lesson
// gives for it (the lesson's words, in the lesson's files). The rule looks at the runs that failed:
// which calls failed, what each returned against what the test wanted, and which instructions ran.
// It never says the value a test wanted. Each sentence is said once, on the first failure it fits;
// the other failures keep the values the card prints.
//
//   "less-fuel":    `topBit` when every failing call has a value with its top bit set; then, for a
//                   call, `larger` when the program returned the larger value, and `equal` for a
//                   call whose two values are equal.
//   "fuel-warning": `topBit` when the only failing call is the one with the top bit of `litres`
//                   set; then, for a call, `overwritten` when the run moved a value into `w0` and
//                   read `w0` again afterwards, `zeroFirst` when `litres` of 0 returned 1, and
//                   `label` for any other wrong value.

import type { Program, Step } from "@al/machine";
import type { VerdictFailure } from "@platform/lesson-runtime";
import type { Challenge } from "@platform/lesson-schema";
import { z } from "zod";

import { quoted } from "./strings";

const FeedbackSchema = z.object({
  rule: z.enum(["less-fuel", "fuel-warning"]),
  sentences: z.record(z.string(), z.string()),
});

/** What the run of one failed call showed. */
export interface FailedRun {
  /** `w0`, `w1` and on, as the call gave them. */
  readonly args: readonly number[];
  /** What `w0` held when the run returned, as an unsigned number. */
  readonly actual: number;
  readonly steps: readonly Step[];
  readonly program: Program;
}

const TOP = 0x80000000;
const hasTopBit = (args: readonly number[]): boolean => args.some((a) => a >= TOP);

/** The instructions that read `w0` by naming it: a compare or a test of a register. */
const READERS = new Set(["cmp", "cmn", "cbz", "cbnz", "tbz", "tbnz"]);

/** Whether the run moved a value into `w0` and then read `w0` in a compare or a test. */
export function overwroteAnInput(run: FailedRun): boolean {
  const at = (step: Step) => run.program.instructions.find((i) => i.address === step.address);
  let moved = false;
  for (const step of run.steps) {
    const ins = at(step);
    if (ins === undefined) continue;
    if (moved && READERS.has(ins.mnemonic)) {
      if (ins.operands.some((o) => o.kind === "reg" && o.text.toLowerCase() === "w0")) return true;
    }
    if (ins.mnemonic === "mov" && ins.operands[0]?.text.toLowerCase() === "w0") moved = true;
  }
  return false;
}

/** The sentence for each failure, by its index in the challenge's tests, or none. */
function chooseLessFuel(
  runs: ReadonlyMap<number, FailedRun>,
  s: Readonly<Record<string, string>>,
): Map<number, string> {
  const out = new Map<number, string>();
  const failed = [...runs.entries()].sort(([x], [y]) => x - y);
  const first = failed[0];
  if (first === undefined) return out;
  if (failed.every(([, r]) => hasTopBit(r.args))) {
    if (s["topBit"] !== undefined) out.set(first[0], s["topBit"]);
    return out;
  }
  const said = new Set<string>();
  for (const [index, run] of failed) {
    const [a = 0, b = 0] = run.args;
    const key = a !== b && run.actual === Math.max(a, b) ? "larger" : a === b ? "equal" : null;
    if (key === null || said.has(key) || s[key] === undefined) continue;
    said.add(key);
    out.set(index, s[key]);
  }
  return out;
}

function chooseFuelWarning(
  runs: ReadonlyMap<number, FailedRun>,
  s: Readonly<Record<string, string>>,
): Map<number, string> {
  const out = new Map<number, string>();
  const failed = [...runs.entries()].sort(([x], [y]) => x - y);
  const first = failed[0];
  if (first === undefined) return out;
  if (failed.every(([, r]) => (r.args[0] ?? 0) >= TOP)) {
    if (s["topBit"] !== undefined) out.set(first[0], s["topBit"]);
    return out;
  }
  const said = new Set<string>();
  for (const [index, run] of failed) {
    const litres = run.args[0] ?? 0;
    const key = overwroteAnInput(run)
      ? "overwritten"
      : litres === 0 && run.actual === 1
        ? "zeroFirst"
        : "label";
    if (said.has(key) || s[key] === undefined) continue;
    said.add(key);
    out.set(index, s[key]);
  }
  return out;
}

/**
 * The failures, each with its sentence as the `detail` the card prints in place of the values, where
 * the challenge's rule has one for it. `runs` holds the failed calls that ran to a return, by index.
 */
export function withFeedback(
  challenge: Challenge,
  failures: readonly VerdictFailure[],
  runs: ReadonlyMap<number, FailedRun>,
): VerdictFailure[] {
  const parsed = FeedbackSchema.safeParse(challenge.initial.data?.["feedback"]);
  if (!parsed.success) return [...failures];
  const { rule, sentences } = parsed.data;
  const chosen =
    rule === "less-fuel" ? chooseLessFuel(runs, sentences) : chooseFuelWarning(runs, sentences);
  return failures.map((f) => {
    const detail = chosen.get(f.index);
    // A verdict prints its detail as plain text, so the code in a sentence is set in quotes.
    return detail === undefined ? f : { ...f, detail: quoted(detail) };
  });
}
