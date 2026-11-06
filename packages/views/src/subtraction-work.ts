// Copyright © 2026 Christopher Snow

// Read the subtraction that actually supplied both returned words. The auxiliary
// ADD runs expose its two's complement working; they are not source execution.
import { assemble, run, type Addition, type Program } from "@al/machine";
import { secondAsGiven } from "./arith";
import { wValue, type Trace } from "./trace";

export interface SubtractionWork {
  readonly width: 32;
  readonly first: number;
  readonly second: number;
  readonly inverted: number;
  readonly one: number;
  readonly opposite: number;
  readonly result: number;
}

const assembled = assemble("working:\nadd w0, w0, w1\nret");
if (assembled.program === null) throw new Error("The subtraction working did not assemble.");
const ADD: Program = assembled.program;

function add(a: bigint, b: bigint): Addition | null {
  const result = run(ADD, {
    entry: "working",
    args: [a, b].map((value) => ({ value, width: 32 as const })),
  });
  return result.stop.kind === "returned" ? (result.steps[0]?.addition ?? null) : null;
}

function returnedSubtraction(trace: Trace): Addition | null {
  if (trace.result.stop.kind !== "returned") return null;
  const lastWrite = [...trace.result.steps]
    .reverse()
    .find((step) => step.writes.some((write) => write.reg === 0));
  const record = lastWrite?.addition;
  if (
    !lastWrite ||
    !record ||
    record.width !== 32 ||
    !record.subtraction ||
    record.carryIn !== 1 ||
    record.result !== BigInt(wValue(trace.result.final, 0)) ||
    !lastWrite.writes.some((write) => write.reg === 0 && write.after === record.result)
  )
    return null;
  return record;
}

const programOperations = (trace: Trace): string =>
  JSON.stringify(
    trace.program.instructions.map((instruction) => instruction.op),
    (_key, value) => (typeof value === "bigint" ? `${value}n` : value),
  );

/** A shared calculation only when the same final SUB really produced both returned words. */
export function subtractionWork(traces: readonly Trace[]): SubtractionWork | null {
  if (traces.length !== 2) return null;
  const [left, right] = traces;
  if (!left || !right || programOperations(left) !== programOperations(right)) return null;
  const a = returnedSubtraction(left);
  const b = returnedSubtraction(right);
  if (
    !a ||
    !b ||
    a.a !== b.a ||
    a.b !== b.b ||
    a.carryIn !== b.carryIn ||
    a.result !== b.result ||
    a.carries !== b.carries ||
    a.carryOut !== b.carryOut
  )
    return null;

  const opposite = add(a.b, BigInt(a.carryIn));
  if (!opposite) return null;
  const sum = add(a.a, opposite.result);
  if (!sum || sum.result !== a.result) return null;
  return {
    width: 32,
    first: Number(sum.a),
    second: Number(secondAsGiven(a)),
    inverted: Number(opposite.a),
    one: Number(opposite.b),
    opposite: Number(sum.b),
    result: Number(a.result),
  };
}
