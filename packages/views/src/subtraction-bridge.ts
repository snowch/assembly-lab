// Copyright © 2026 Christopher Snow

import type { Addition } from "@al/machine";
import { additionSteps, columnWork, secondAsGiven } from "./arith";
import type { RecordedProgram } from "./listing";
import { traceOf, type TraceCall } from "./trace";

export const SUBTRACTION_BOUNDARY_INPUTS = [
  [7, 8],
  [8, 8],
  [9, 8],
] as const;

/** Independent runs of the same recorded instruction, one on each side of equality. */
export function subtractionBoundary(program: RecordedProgram, call: TraceCall, which = 0) {
  return SUBTRACTION_BOUNDARY_INPUTS.map(([a, b]) => {
    const trace = traceOf(program, { ...call, args: [a, b] });
    const record = additionSteps(trace)[which]?.addition;
    if (!record || record.a !== BigInt(a) || secondAsGiven(record) !== BigInt(b))
      throw new Error(
        "The boundary examples need an instruction that subtracts the supplied inputs.",
      );
    return subtractionBridge(record);
  });
}

/** Two views of one real subtraction record, with the same small unsigned inputs. */
export function subtractionBridge(record: Addition) {
  if (!record.subtraction || record.width !== 32 || record.carryIn !== 1)
    throw new Error("The subtraction bridge needs a 32-bit subtraction record.");
  const a = record.a;
  const b = secondAsGiven(record);
  if (a > 15n || b > 15n)
    throw new Error("The subtraction bridge's inputs must fit its four-bit teaching view.");

  function view(width: 4 | 32) {
    const mask = (1n << BigInt(width)) - 1n;
    const inverted = record.b & mask;
    const allOnes = b + inverted;
    const range = allOnes + BigInt(record.carryIn);
    const fullSum = a + inverted + BigInt(record.carryIn);
    const result = record.result & mask;
    const carryOut = columnWork(record, width - 1).carryOut;
    const bits = (value: bigint) => value.toString(2).padStart(width, "0");
    return {
      width,
      a,
      b,
      inverted,
      allOnes,
      range,
      fullSum,
      result,
      carryIn: record.carryIn,
      carryOut,
      patterns: {
        a: bits(a),
        b: bits(b),
        inverted: bits(inverted),
        allOnes: bits(allOnes),
        carryIn: bits(BigInt(record.carryIn)),
        result: bits(result),
      },
    };
  }
  return { small: view(4), wide: view(32) };
}
