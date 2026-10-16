// Copyright © 2026 Christopher Snow

// Register names, condition names and the immediates a logical instruction can hold.

import type { Cond, ExtendKind, ShiftKind, Width } from "./types.ts";

/** GNU as takes a name written all in lower case or all in upper case, and no mixture. */
export const sameCase = (s: string): boolean => s === s.toLowerCase() || s === s.toUpperCase();

export interface RegName {
  /** 0 to 30; 31 for `sp`, `wsp`, `xzr` and `wzr`. */
  n: number;
  width: Width;
  role: "general" | "zero" | "sp";
}

/** The register a name stands for, or `null`. Case does not matter. `x31` is not a register. */
export function parseRegName(text: string): RegName | null {
  if (!sameCase(text.trim())) return null;
  const t = text.trim().toLowerCase();
  if (t === "sp") return { n: 31, width: 64, role: "sp" };
  if (t === "wsp") return { n: 31, width: 32, role: "sp" };
  if (t === "xzr") return { n: 31, width: 64, role: "zero" };
  if (t === "wzr") return { n: 31, width: 32, role: "zero" };
  if (t === "lr") return { n: 30, width: 64, role: "general" };
  if (t === "fp") return { n: 29, width: 64, role: "general" };
  if (t === "ip0") return { n: 16, width: 64, role: "general" };
  if (t === "ip1") return { n: 17, width: 64, role: "general" };
  const m = /^([xw])(0|[1-9]|[12][0-9]|30)$/.exec(t);
  if (!m) return null;
  return { n: Number(m[2]), width: m[1] === "x" ? 64 : 32, role: "general" };
}

const CONDS: Record<string, Cond> = {
  eq: "eq",
  ne: "ne",
  cs: "cs",
  hs: "cs",
  cc: "cc",
  lo: "cc",
  mi: "mi",
  pl: "pl",
  vs: "vs",
  vc: "vc",
  hi: "hi",
  ls: "ls",
  ge: "ge",
  lt: "lt",
  gt: "gt",
  le: "le",
  al: "al",
};

/** The condition a name stands for, or `null`. `hs` and `lo` are `cs` and `cc`. */
export function parseCond(text: string): Cond | null {
  if (!sameCase(text.trim())) return null;
  return CONDS[text.trim().toLowerCase()] ?? null;
}

const INVERSE: Record<Cond, Cond> = {
  eq: "ne",
  ne: "eq",
  cs: "cc",
  cc: "cs",
  mi: "pl",
  pl: "mi",
  vs: "vc",
  vc: "vs",
  hi: "ls",
  ls: "hi",
  ge: "lt",
  lt: "ge",
  gt: "le",
  le: "gt",
  al: "al",
};

export const invertCond = (c: Cond): Cond => INVERSE[c];

export const SHIFT_KINDS: readonly string[] = ["lsl", "lsr", "asr", "ror"];
export const EXTEND_KINDS: readonly string[] = [
  "uxtb",
  "uxth",
  "uxtw",
  "uxtx",
  "sxtb",
  "sxth",
  "sxtw",
  "sxtx",
];

export const isShiftKind = (s: string): s is ShiftKind => SHIFT_KINDS.includes(s);
export const isExtendKind = (s: string): s is ExtendKind => EXTEND_KINDS.includes(s);

export const maskOf = (w: number): bigint => (1n << BigInt(w)) - 1n;

/** True when `value` (a `w`-bit pattern) can be the immediate of `and`, `orr` or `eor`. */
export function isBitmaskImmediate(value: bigint, w: Width): boolean {
  const all = maskOf(w);
  const v = value & all;
  if (v === 0n || v === all) return false;
  let size: number = w;
  while (size > 2) {
    const half = size / 2;
    const m = maskOf(half);
    if ((v & m) !== ((v >> BigInt(half)) & m)) break;
    size = half;
  }
  const elem = v & maskOf(size);
  const em = maskOf(size);
  for (let r = 0; r < size; r++) {
    const rot = ((elem >> BigInt(r)) | (elem << BigInt(size - r))) & em;
    // A run of ones from bit 0, and not every bit.
    if (rot !== em && ((rot + 1n) & rot) === 0n && rot !== 0n) return true;
  }
  return false;
}

/**
 * The `w`-bit pattern of an immediate written as a number, or `null` when the number does not fit
 * in `w` bits the way GNU as takes it: for `w` registers the upper 32 bits of the 64-bit value
 * must all be zero or all be one.
 */
export function immediatePattern(value: bigint, w: Width): bigint | null {
  const u = BigInt.asUintN(64, value);
  if (w === 64) return u;
  const upper = u >> 32n;
  if (upper !== 0n && upper !== 0xffffffffn) return null;
  return u & 0xffffffffn;
}
