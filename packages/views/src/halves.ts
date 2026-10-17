// Copyright © 2026 Christopher Snow

// What the wide stepper's two Module 1 modes read out of a run: a `w` register as two halves of 16
// bits, each tagged by the last instruction as new or kept, and an `x` register as two halves of 32
// bits, tagged when a write to its `w` name cleared the upper half. Every bit is the simulator's
// own value for the register before and after the last step, and every tag compares those two
// states with the instruction the step ran.

import { bitsOf, viewAt, wValue, type Trace } from "./trace";

/** What the last instruction did to a half of a 16-bit pair: put a value in it, or left it as it was. */
export type HalfTag = "new" | "kept";

export interface Halves16 {
  /** The register's 32 bits, most significant first, as the model holds them after the step. */
  readonly bits: string;
  /** The four hexadecimal digits of each half. */
  readonly upper: string;
  readonly lower: string;
  /** What the last instruction did to each half; null before any instruction has run. */
  readonly tag: { readonly upper: HalfTag; readonly lower: HalfTag } | null;
}

/** The four hexadecimal digits of 16 bits. */
const hex4 = (bits: string): string =>
  [0, 4, 8, 12].map((i) => parseInt(bits.slice(i, i + 4), 2).toString(16)).join("");

/**
 * The register `w<register>` as two halves of 16 bits after `k` instructions have run. A half is
 * "new" when the last instruction wrote the register whole (any instruction but `movk`) or when its
 * bits differ from what they were before; a half is "kept" when the instruction left it alone, or
 * wrote the other half of the register only.
 */
export function halves16(trace: Trace, k: number, register: number): Halves16 {
  const after = viewAt(trace, k);
  const bits = bitsOf(wValue(after.state, register));
  const base = { bits, upper: hex4(bits.slice(0, 16)), lower: hex4(bits.slice(16)) };
  if (after.k === 0) return { ...base, tag: null };
  const before = bitsOf(wValue(viewAt(trace, after.k - 1).state, register));
  const step = trace.result.steps[after.k - 1];
  const ins = trace.program.instructions.find((i) => i.address === step?.address);
  if (!after.written.has(register)) return { ...base, tag: { upper: "kept", lower: "kept" } };
  // Any instruction but `movk` writes the whole register, so both halves are what it put there.
  if (ins?.op.k !== "movk") return { ...base, tag: { upper: "new", lower: "new" } };
  return {
    ...base,
    tag: {
      upper: bits.slice(0, 16) === before.slice(0, 16) ? "kept" : "new",
      lower: bits.slice(16) === before.slice(16) ? "kept" : "new",
    },
  };
}

/** What a write did to each 32-bit half of an `x` register: wrote it, or (the upper half) cleared it. */
export type WideTag = "written" | "cleared";

export interface Wide64 {
  readonly tag: { readonly upper: WideTag; readonly lower: WideTag } | null;
  /** True when the last instruction wrote the `w` name and so cleared the upper 32 bits. */
  readonly clearedByW: boolean;
}

/**
 * How the last instruction treated `x<register>`: nothing if it did not write it; "written" for
 * both halves if it wrote the `x` name; for the `w` name, "written" for the lower half and
 * "cleared" for the upper one when it is 0 after the step.
 */
export function wide64(trace: Trace, k: number, register: number): Wide64 {
  const after = viewAt(trace, k);
  if (after.k === 0 || !after.written.has(register)) return { tag: null, clearedByW: false };
  const step = trace.result.steps[after.k - 1];
  const ins = trace.program.instructions.find((i) => i.address === step?.address);
  const written = (ins?.operands[0]?.text ?? "").toLowerCase();
  const x = BigInt.asUintN(64, after.state.x[register] ?? 0n);
  if (written === `w${register}` && x >> 32n === 0n)
    return { tag: { upper: "cleared", lower: "written" }, clearedByW: true };
  return { tag: { upper: "written", lower: "written" }, clearedByW: false };
}
