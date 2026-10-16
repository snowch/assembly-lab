// Copyright © 2026 Christopher Snow

// What Module 2's figures read out of a run: the steps that added or subtracted, a bit of a
// pattern, the four flags as digits. The figures draw these; nothing here works out an answer the
// model has not.

import type { Flags, Step } from "@al/machine";

import type { Trace } from "./trace";

/** The steps of a run that added or subtracted, in order: each has the carry into every bit. */
export function additionSteps(trace: Trace): Step[] {
  return trace.result.steps.filter((s) => s.addition !== null);
}

/** Bit `i` of a pattern, counting from the right. */
export function bitAt(value: bigint, i: number): 0 | 1 {
  return Number((value >> BigInt(i)) & 1n) === 1 ? 1 : 0;
}

/** A 32-bit pattern as `0x` and eight hexadecimal digits. */
export function hex32(value: number | bigint): string {
  return `0x${BigInt.asUintN(32, BigInt(value)).toString(16).padStart(8, "0")}`;
}

/** The four flags as digits, in the order the course draws them: N, Z, C, V. */
export function flagDigits(f: Flags): [number, number, number, number] {
  return [Number(f.n), Number(f.z), Number(f.c), Number(f.v)];
}

/** The flag a lesson's data names with one letter, as 0 or 1; null for any other name. */
export function flagNamed(f: Flags, name: string): 0 | 1 | null {
  switch (name.toLowerCase()) {
    case "n":
      return f.n ? 1 : 0;
    case "z":
      return f.z ? 1 : 0;
    case "c":
      return f.c ? 1 : 0;
    case "v":
      return f.v ? 1 : 0;
    default:
      return null;
  }
}
