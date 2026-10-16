// Copyright © 2026 Christopher Snow

// Helpers for the machine's tests: assemble a source that must be right, and run a call on it.

import { assemble } from "./assemble.ts";
import { run } from "./run.ts";
import type { Call, CallArgument, Flags, Program, RunResult, Width } from "./types.ts";

/** Assemble a source that must have no errors. */
export function build(source: string): Program {
  const { program, errors } = assemble(source);
  if (program === null) {
    throw new Error(
      `The source did not assemble: ${errors.map((e) => `line ${e.line}: ${e.key}`).join(", ")}`,
    );
  }
  return program;
}

export type Arg = bigint | number | [bigint | number, Width];

const toArg = (a: Arg): CallArgument =>
  Array.isArray(a) ? { value: BigInt(a[0]), width: a[1] } : { value: BigInt(a), width: 64 };

export function flagsOf(bits: string): Flags {
  return { n: bits[0] === "1", z: bits[1] === "1", c: bits[2] === "1", v: bits[3] === "1" };
}

export function flagBits(f: Flags): string {
  return `${f.n ? 1 : 0}${f.z ? 1 : 0}${f.c ? 1 : 0}${f.v ? 1 : 0}`;
}

/** Assemble `source` and run `f` (or the entry in `extra`) with `args`. */
export function exec(source: string, args: Arg[] = [], extra: Partial<Call> = {}): RunResult {
  return run(build(source), { entry: "f", args: args.map(toArg), ...extra });
}

/** The body of a function `f` that is assembled and run. */
export function fn(body: string, args: Arg[] = [], extra: Partial<Call> = {}): RunResult {
  return exec(`f:\n${body}\n  ret\n`, args, extra);
}

/** x`n` after the run. */
export const x = (r: RunResult, n: number): bigint => r.final.x[n] as bigint;

export const MASK64 = (1n << 64n) - 1n;
