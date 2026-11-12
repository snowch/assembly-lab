// Copyright © 2026 Christopher Snow

import type { Flags } from "@al/machine";
import { fourBitAddition } from "./four-bit-arithmetic";

export const FLAG_PRIMER_INPUTS = {
  n: [8, 1],
  z: [0, 0],
  c: [15, 2],
  v: [7, 1],
  practice: [8, 9],
} as const;
export const PRIMER_FLAGS = ["n", "z", "c", "v"] as const;
export type PrimerFlag = (typeof PRIMER_FLAGS)[number];

/** Teaching-width flags from the model's low four columns, NOT its real 32-bit PSTATE. */
export function fourBitFlags(a: number, b: number) {
  const addition = fourBitAddition(a, b);
  const top = addition.columns[3]!;
  const flags: Flags = {
    n: top.kept === 1,
    z: addition.result.unsigned === 0,
    c: top.carryOut === 1,
    v: top.carryIn !== top.carryOut,
  };
  return { addition, flags, signedSum: addition.a.signed + addition.b.signed };
}
export type PrimerAttempt = { choices: Partial<Record<PrimerFlag, "0" | "1">>; submitted: boolean };
export function primerAttempt(raw: unknown): PrimerAttempt {
  const value = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const choices: PrimerAttempt["choices"] = {};
  const source =
    value.choices && typeof value.choices === "object"
      ? (value.choices as Record<string, unknown>)
      : {};
  for (const key of PRIMER_FLAGS)
    if (source[key] === "0" || source[key] === "1") choices[key] = source[key];
  return { choices, submitted: value.submitted === true };
}
export function primerReady(a: PrimerAttempt) {
  return PRIMER_FLAGS.every((key) => a.choices[key] !== undefined);
}
export function primerCorrect(a: PrimerAttempt) {
  const { flags } = fourBitFlags(...FLAG_PRIMER_INPUTS.practice);
  return (
    primerReady(a) && PRIMER_FLAGS.every((key) => a.choices[key] === String(Number(flags[key])))
  );
}
