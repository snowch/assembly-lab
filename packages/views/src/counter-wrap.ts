// Copyright © 2026 Christopher Snow

import { fourBitAddition, fourBitSubtraction } from "./four-bit-arithmetic";

export const COUNTER_WRAP_START = 13;
export const COUNTER_WRAP_RANGE = 16;
export const COUNTER_WRAP_TICKS = COUNTER_WRAP_RANGE - COUNTER_WRAP_START;

/** A four-place mathematical view of the existing machine-backed ADD/SUB model.
 * No four-bit Arm register or architectural flag is simulated here. */
export function counterWrap(ticks: number, start = COUNTER_WRAP_START) {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks >= COUNTER_WRAP_RANGE)
    throw new Error("The interval must be fewer than sixteen whole ticks.");
  // Also validates the starting four-bit value, including the zero-tick case.
  let value = fourBitAddition(start, 0).result;
  const readings = [value];
  let addition: ReturnType<typeof fourBitAddition> | null = null;
  for (let tick = 0; tick < ticks; tick++) {
    addition = fourBitAddition(value.unsigned, 1);
    value = addition.result;
    readings.push(value);
  }
  const elapsed = fourBitSubtraction(value.unsigned, start).result;
  return { start, ticks, readings, value, addition, elapsed };
}
