// Copyright © 2026 Christopher Snow

// What Module 2's figures read out of a run: the steps that added or subtracted, a bit of a
// pattern, the four flags as digits. The figures draw these; nothing here works out an answer the
// model has not.

import type { Addition, Flags, Step } from "@al/machine";

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

/** What one column of an addition worked out, every part read from the simulator's record. */
export interface ColumnWork {
  readonly bit: number;
  readonly carryIn: 0 | 1;
  readonly a: 0 | 1;
  readonly b: 0 | 1;
  /** The three bits added up: 0, 1, 2 or 3. */
  readonly total: number;
  /** The result bit the column keeps. */
  readonly kept: 0 | 1;
  /** The carry the column passes to the next one on the left. */
  readonly carryOut: 0 | 1;
}

/** Column `bit` of a recorded addition (0 is the rightmost): its three bits, its total, its two outputs. */
export function columnWork(record: Addition, bit: number): ColumnWork {
  const carryIn = bitAt(record.carries, bit);
  const a = bitAt(record.a, bit);
  const b = bitAt(record.b, bit);
  return {
    bit,
    carryIn,
    a,
    b,
    total: carryIn + a + b,
    kept: bitAt(record.result, bit),
    carryOut: bit === record.width - 1 ? record.carryOut : bitAt(record.carries, bit + 1),
  };
}

/** The carry into the top bit and the carry out of it: the two carries that give V, and the second gives C. */
export function topCarries(record: Addition): { into: 0 | 1; out: 0 | 1 } {
  return { into: bitAt(record.carries, record.width - 1), out: record.carryOut };
}

/**
 * The second number as the instruction was given it. The record keeps it with every bit changed for
 * a subtraction, so this changes them back; for an addition it is the record's own.
 */
export function secondAsGiven(record: Addition): bigint {
  return record.subtraction ? ~record.b & ((1n << BigInt(record.width)) - 1n) : record.b;
}

/** How many columns are worked once a move to the end of the group of four that holds column `done` is made. */
export function endOfGroup(done: number, columns = 32): number {
  return Math.min(columns, (Math.floor(done / 4) + 1) * 4);
}
