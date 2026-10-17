// Copyright © 2026 Christopher Snow

// Counts executions of one labelled body instruction, not taken backedges. A returning loop with
// three body executions usually takes its backward branch only twice. A limited trace reports
// only the body operations observed; it cannot establish how many a complete run would execute.

import { viewAt, wValue, type Trace } from "./trace";

export interface BodyVisit {
  /** Number of instructions already executed, including this body instruction. */
  readonly step: number;
  /** Value after the body instruction executed. */
  readonly value: number;
}

export interface LoopSummary {
  readonly initial: number;
  readonly visits: readonly BodyVisit[];
  readonly returned: boolean;
}

export function loopSummary(trace: Trace, bodyLabel: string, register = 0): LoopSummary {
  const address = trace.program.symbols[bodyLabel]?.address;
  if (
    address === undefined ||
    !trace.program.instructions.some((instruction) => instruction.address === address)
  )
    throw new Error(`The loop body label ${bodyLabel} does not name an instruction.`);
  const visits: BodyVisit[] = [];
  trace.result.steps.forEach((step, index) => {
    if (step.address === address)
      visits.push({ step: index + 1, value: wValue(viewAt(trace, index + 1).state, register) });
  });
  return {
    initial: wValue(trace.result.initial, register),
    visits,
    returned: trace.result.stop.kind === "returned",
  };
}
