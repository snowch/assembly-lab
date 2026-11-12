// Copyright © 2026 Christopher Snow

import type { RecordedProgram } from "../listing";
import { calculatorReading } from "@al/machine";
import { fourBitFlags } from "../flag-primer";
import { columnWork } from "../arith";
import { traceOf } from "../trace";

export const FLAG_NAMES = ["n", "z", "c", "v"] as const;
export type FlagName = (typeof FLAG_NAMES)[number];
export type Digit = 0 | 1;
export type Width = 4 | 32;
export type Reading = "unsigned" | "signed";
export function readings(value: bigint, width: Width) {
  const bits = BigInt.asUintN(width, value);
  return {
    bits: bits.toString(2).padStart(width, "0"),
    hex: `0x${bits.toString(16).padStart(width / 4, "0")}`,
    unsigned: calculatorReading(bits, width, "unsigned").toString(),
    signed: calculatorReading(bits, width, "signed").toString(),
  };
}

/** Four-place miniatures read the real model's low columns; real calls use the recorded program. */
export function flagsModel(program: RecordedProgram, width: Width, a: number, b: number) {
  const small = width === 4 ? fourBitFlags(a, b) : undefined;
  const trace = small ? undefined : traceOf(program, { entry: "plus", args: [a, b] });
  const step = trace?.result.steps[0];
  const record = step?.addition;
  if (!small && (!record || record.subtraction || record.width !== 32)) {
    throw new Error("The flags lesson needs a recorded 32-bit addition.");
  }
  const columns =
    small?.addition.columns ?? Array.from({ length: width }, (_, i) => columnWork(record!, i));
  const top = columns[width - 1]!;
  const machineFlags = small?.flags ?? step!.flagsAfter;
  const flags = Object.fromEntries(
    FLAG_NAMES.map((name) => [name, Number(machineFlags[name])]),
  ) as Record<FlagName, Digit>;
  return {
    width,
    a: readings(BigInt(a), width),
    b: readings(BigInt(b), width),
    result: readings(small ? BigInt(small.addition.result.unsigned) : record!.result, width),
    flags,
    columns,
    unsignedSum: (BigInt(a) + BigInt(b)).toString(),
    signedSum: (
      calculatorReading(BigInt(a), width, "signed") + calculatorReading(BigInt(b), width, "signed")
    ).toString(),
    carryIn: top.carryIn,
    carryOut: top.carryOut,
  };
}
export type FlagsModel = ReturnType<typeof flagsModel>;
