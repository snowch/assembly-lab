// Copyright © 2026 Christopher Snow

// A register's 32 bits and the ways to read them, for Module 1's figures and graders. The register
// is made by the model: the pattern is put in `w0` by `mov` and `movk`, the program is run, and
// the readings are taken from what `w0` holds (trace.ts's `wValue` and `wValueAsInt`). The worths
// that are summed on the page are the powers of two the lesson names; a test holds every sum to the
// model's reading.

import { TEXT_BASE, assemble, run, type MachineState } from "@al/machine";

import { wValue, wValueAsInt } from "./trace";

/** Thirty-two zeros: a register with no bit set. */
export const NO_BITS = "0".repeat(32);

/** The minus sign the lessons write, not the hyphen the keyboard types. */
export const MINUS = "−";

/** Whether `text` is 32 characters, each a 0 or a 1. */
export const isPattern = (text: string | undefined): text is string =>
  text !== undefined && /^[01]{32}$/.test(text);

/** The 32 bits of a value as written: the most significant first. */
export function patternOf(value: number | bigint): string {
  return BigInt.asUintN(32, BigInt(value)).toString(2).padStart(32, "0");
}

/**
 * The machine state after `w0` is set to a pattern with the instructions a learner meets in
 * Module 1: `mov` for the lower 16 bits and `movk` for the upper 16.
 */
export function stateHolding(pattern: string): MachineState {
  if (!isPattern(pattern)) throw new Error("A pattern is 32 characters, each a 0 or a 1.");
  const lower = parseInt(pattern.slice(16), 2);
  const upper = parseInt(pattern.slice(0, 16), 2);
  const { program, errors } = assemble(`mov w0, ${lower}\nmovk w0, ${upper}, lsl 16\nret\n`);
  if (program === null) throw new Error(`The pattern did not assemble: ${errors[0]?.key ?? ""}`);
  return run(program, { entry: TEXT_BASE }).final;
}

/** What `w0` holds, read the three ways, all taken from the model's state. */
export interface Readings {
  readonly pattern: string;
  /** Eight hexadecimal digits, lower case, without the `0x`. */
  readonly digits: string;
  readonly unsigned: number;
  readonly signed: number;
}

export function readingsOf(state: MachineState): Readings {
  const unsigned = wValue(state, 0);
  return {
    pattern: patternOf(unsigned),
    digits: unsigned.toString(16).padStart(8, "0"),
    unsigned,
    signed: wValueAsInt(state, 0),
  };
}

/** The readings of a pattern, by way of the model. */
export const readingsOfPattern = (pattern: string): Readings => readingsOf(stateHolding(pattern));

/** The readings of a value in 0 to 4294967295 or −2147483648 to 2147483647. */
export const readingsOfValue = (value: number | bigint): Readings =>
  readingsOfPattern(patternOf(value));

/** A whole number as the lessons write it: a minus sign, not a hyphen. */
export const shown = (n: number): string => (n < 0 ? `${MINUS}${-n}` : String(n));

/**
 * The worth of each bit that is 1, highest first, as the lessons state them: bit `n` is worth
 * 2 to the power `n`, except that the top bit is worth minus that in the signed reading.
 */
export function worths(pattern: string, reading: "unsigned" | "signed"): number[] {
  const out: number[] = [];
  for (let i = 0; i < 32; i++) {
    if (pattern[i] !== "1") continue;
    const bit = 31 - i;
    const worth = 2 ** bit;
    out.push(bit === 31 && reading === "signed" ? -worth : worth);
  }
  return out;
}

/** A number written in a learner's answer: a whole number, with a hyphen or the minus sign. */
export function wholeNumber(answer: string | undefined): bigint | null {
  if (answer === undefined) return null;
  const text = answer.trim().replaceAll(MINUS, "-");
  return /^-?\d+$/.test(text) ? BigInt(text) : null;
}
