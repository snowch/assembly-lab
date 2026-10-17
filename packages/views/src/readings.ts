// Copyright © 2026 Christopher Snow

// A register's 32 bits and the ways to read them, for Module 1's figures and graders. The register
// is made by the model: the pattern is put in `w0` by `mov` and `movk`, the program is run, and
// the readings are taken from what `w0` holds (trace.ts's `wValue` and `wValueAsInt`). The worths
// that are summed on the page are the powers of two the lesson names; a test holds every sum to the
// model's reading.

import { TEXT_BASE, assemble, run, type MachineState } from "@al/machine";

import type { RecordedProgram } from "./listing";
import { traceOf, wValue, wValueAsInt, type TraceCall } from "./trace";

/**
 * The 32 bits `wN` holds when a recorded program's call has run: the register as the model leaves
 * it. A figure that starts from what an earlier figure left uses this, so the pattern is the
 * model's and is written nowhere in the lesson.
 */
export function patternAfterRun(
  recorded: Pick<RecordedProgram, "listing">,
  call: TraceCall,
  register = 0,
): string {
  return patternOf(wValue(traceOf(recorded, call).result.final, register));
}

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

/**
 * The top bit's part of each reading, the other 31 bits' part, and the whole, for one pattern. The
 * parts are what the model's register gives for the pattern with only that part set (the top bit
 * alone, the other 31 bits alone), so the table that shows them is the sum the lesson describes:
 * `top + other` is the reading, in each column. With the top bit clear the two readings agree, so
 * `other` is one number for both columns.
 */
export interface TopBitTable {
  readonly top: { readonly unsigned: number; readonly signed: number };
  readonly other: number;
  readonly unsigned: number;
  readonly signed: number;
}

export function topBitTable(pattern: string): TopBitTable {
  if (!isPattern(pattern)) throw new Error("A pattern is 32 characters, each a 0 or a 1.");
  const topAlone = readingsOfPattern("1" + "0".repeat(31));
  const rest = readingsOfPattern("0" + pattern.slice(1));
  const whole = readingsOfPattern(pattern);
  return {
    top:
      pattern[0] === "1"
        ? { unsigned: topAlone.unsigned, signed: topAlone.signed }
        : { unsigned: 0, signed: 0 },
    other: rest.unsigned,
    unsigned: whole.unsigned,
    signed: whole.signed,
  };
}

/** What the learner has typed into a hexadecimal entry for a register's 32 bits. */
export type HexEntry =
  | { readonly kind: "empty" }
  | { readonly kind: "ok"; readonly pattern: string }
  | { readonly kind: "invalid" };

/**
 * Reads typed hexadecimal as 32 bits: one to eight hexadecimal digits, with `0x` in front or not,
 * the missing digits on the left being 0. Nothing typed, or only `0x`, is "empty": the entry is
 * waiting for digits. Anything else is "invalid", and changes no bit.
 */
export function parseHexEntry(text: string): HexEntry {
  const typed = text.trim();
  if (typed === "" || /^0x$/i.test(typed)) return { kind: "empty" };
  const m = /^(?:0x)?([0-9a-f]{1,8})$/i.exec(typed);
  return m
    ? { kind: "ok", pattern: patternOf(BigInt(`0x${m[1] as string}`)) }
    : { kind: "invalid" };
}

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
