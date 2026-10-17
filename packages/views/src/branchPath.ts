// Copyright © 2026 Christopher Snow

// What the figures that follow a run through branches read out of it: for each instruction that ran,
// in order, whether it was a branch to a label and, if so, whether it was taken (the trace's
// `branch.taken`); and, for the stepper, the sentence for a step that ran a branch (what the trace
// says about `branch.taken` and `nextPc`). A `ret` is marked as a taken branch by the trace, and goes
// back to the code that called the function; it is not a branch to a label, and is never one here.

import type { Instruction, Step } from "@al/machine";

import { BRANCH_STRINGS as B } from "./strings.branch";
import type { StepView, Trace } from "./trace";

/** How a branch to a label went: taken, or not taken. `b` is always taken. */
export interface BranchOutcome {
  readonly taken: boolean;
  /** `b` has no condition; the rest are conditional. */
  readonly conditional: boolean;
  /** The label the branch names. */
  readonly label: string;
}

export interface PathItem {
  /** The index into the run's steps. */
  readonly step: number;
  /** The index into the trace's lines. */
  readonly line: number;
  readonly text: string;
  /** Present only for a branch to a label that ran. */
  readonly branch: BranchOutcome | null;
}

/** An instruction that goes to a label when it branches: `b`, `b.cond`, `cbz`, `cbnz`, `tbz`, `tbnz`. */
export function goesToLabel(ins: Instruction): boolean {
  const op = ins.op;
  return (op.k === "b" && !op.link) || op.k === "bcond" || op.k === "cbz" || op.k === "tbz";
}

const instructionAt = (trace: Trace, step: Step): Instruction | undefined =>
  trace.program.instructions.find((i) => i.address === step.address);

const words = (text: string): string => text.replace(/\s+/g, " ").trim();

/** The outcome of the branch a step ran, or null if the step did not run a branch to a label. */
export function outcomeOf(trace: Trace, step: Step): BranchOutcome | null {
  const ins = instructionAt(trace, step);
  if (ins === undefined || !goesToLabel(ins) || step.branch === null) return null;
  const label = ins.operands.find((o) => o.kind === "label");
  if (label === undefined) return null;
  return { taken: step.branch.taken, conditional: ins.op.k !== "b", label: label.text };
}

/** Every instruction that ran, in order, with the outcome of each branch to a label. */
export function pathOf(trace: Trace): PathItem[] {
  return trace.result.steps.map((step, i) => ({
    step: i,
    line: trace.lineAt.get(step.address) ?? -1,
    text: words(step.text),
    branch: outcomeOf(trace, step),
  }));
}

/**
 * The sentence for the step that has just run, when it ran a branch to a label: whether it was taken
 * and what runs next. The next instruction is the one at the pc the step left (`nextPc`).
 */
export function branchStatusAt(trace: Trace, view: StepView): string | null {
  if (view.k === 0) return null;
  const step = trace.result.steps[view.k - 1];
  if (step === undefined) return null;
  const outcome = outcomeOf(trace, step);
  if (outcome === null) return null;
  const nextLine = trace.lineAt.get(step.nextPc);
  const next = nextLine === undefined ? undefined : trace.lines[nextLine];
  if (next === undefined || next.kind !== "instruction") return null;
  const branch = words(step.text);
  if (!outcome.conditional) return B.status.always(branch, outcome.label, next.text);
  return outcome.taken
    ? B.status.taken(branch, next.text, outcome.label)
    : B.status.notTaken(branch, next.text);
}

/** Whether the step that has just run took a branch to a label (the next instruction is a jump). */
export function jumpedAt(trace: Trace, view: StepView): boolean {
  if (view.k === 0) return false;
  const step = trace.result.steps[view.k - 1];
  const outcome = step ? outcomeOf(trace, step) : null;
  return outcome?.taken === true;
}
