// Copyright © 2026 Christopher Snow

import { type Trace } from "./trace";

/** The three destination registers come from the same model run. No product is recomputed. */
export function productHalves(trace: Trace) {
  if (trace.result.stop.kind !== "returned") throw new Error("Product trace did not return.");
  const x = trace.result.final.x;
  const half = (index: number) => {
    const value = BigInt.asUintN(64, x[index] ?? 0n);
    return {
      hex: `0x${value.toString(16).padStart(16, "0")}`,
      bytes: Array.from({ length: 8 }, (_, i) =>
        Number((value >> BigInt((7 - i) * 8)) & 255n)
          .toString(16)
          .padStart(2, "0"),
      ),
    };
  };
  return {
    inputs: [0, 1].map(
      (index) =>
        `0x${BigInt.asUintN(64, trace.result.initial.x[index] ?? 0n)
          .toString(16)
          .padStart(16, "0")}`,
    ),
    low: half(2),
    unsignedHigh: half(3),
    signedHigh: half(4),
  };
}

/** A bounded diagram of signed division; all displayed outcomes are simulator registers. */
export function divisionParts(trace: Trace) {
  if (trace.result.stop.kind !== "returned") throw new Error("Division trace did not return.");
  const signed = (value: bigint) => Number(BigInt.asIntN(32, value));
  const dividend = signed(trace.result.initial.x[0] ?? 0n);
  const divisor = signed(trace.result.initial.x[1] ?? 0n);
  const quotient = signed(trace.result.final.x[2] ?? 0n);
  const remainder = signed(trace.result.final.x[0] ?? 0n);
  if (divisor === 0 || Math.abs(quotient) > 16 || Math.abs(dividend) > 256)
    throw new Error("Division diagram requires a small nonzero divisor and bounded inputs.");
  return {
    dividend,
    divisor,
    quotient,
    remainder,
    groups: Array.from(
      { length: Math.abs(quotient) },
      () => Math.sign(dividend) * Math.abs(divisor),
    ),
  };
}
