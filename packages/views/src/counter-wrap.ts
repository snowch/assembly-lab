// Copyright © 2026 Christopher Snow

import { fourBitAddition, fourBitSubtraction } from "./four-bit-arithmetic";

export const COUNTER_WRAP_START = 13;
export const COUNTER_WRAP_RANGE = 16;
export const COUNTER_WRAP_TICKS = COUNTER_WRAP_RANGE - COUNTER_WRAP_START;

/** A bounded recent history, independent of the fixed elapsed-time example. */
export interface CounterExplorerState {
  readings: number[];
}

function validExplorerState(saved: unknown): saved is CounterExplorerState {
  if (!saved || typeof saved !== "object" || !("readings" in saved)) return false;
  const readings = saved.readings;
  if (!Array.isArray(readings) || readings.length < 1 || readings.length > 5) return false;
  return Array.from(readings).every((value, index) => {
    if (!Number.isInteger(value) || value < 0 || value >= COUNTER_WRAP_RANGE) return false;
    if (index === 0) return true;
    const difference = (value - readings[index - 1] + COUNTER_WRAP_RANGE) % COUNTER_WRAP_RANGE;
    return difference === 1 || difference === COUNTER_WRAP_RANGE - 1;
  });
}

/** Rendering a migrated view never overwrites its original saved tick count. */
export function restoreCounterExplorer(
  saved: unknown,
  legacyTicks?: unknown,
): CounterExplorerState {
  if (validExplorerState(saved)) return { readings: [...saved.readings] };
  if (
    saved === undefined &&
    typeof legacyTicks === "number" &&
    Number.isInteger(legacyTicks) &&
    legacyTicks >= 0 &&
    legacyTicks < COUNTER_WRAP_RANGE
  ) {
    return {
      readings: counterWrap(Math.min(legacyTicks, COUNTER_WRAP_TICKS)).readings.map(
        (reading) => reading.unsigned,
      ),
    };
  }
  return { readings: [COUNTER_WRAP_START] };
}

export function counterChange(before: number, direction: -1 | 1) {
  if (direction === 1) {
    const work = fourBitAddition(before, 1);
    return {
      direction,
      before: work.a,
      result: work.result,
      marker: work.carryOut,
      wrapped: work.carryOut === 1,
    };
  }
  if (direction !== -1) throw new Error("Choose a +1 or -1 counter operation.");
  const work = fourBitSubtraction(before, 1);
  const borrow = 1 - work.addition.carryOut;
  return {
    direction,
    before: work.a,
    result: work.result,
    marker: borrow,
    wrapped: borrow === 1,
  };
}

export function counterExplorerView(state: CounterExplorerState) {
  if (!validExplorerState(state)) throw new Error("Invalid counter history.");
  const current = state.readings[state.readings.length - 1]!;
  const previous = state.readings[state.readings.length - 2];
  const value = fourBitAddition(current, 0).result;
  const change =
    previous === undefined
      ? null
      : counterChange(previous, current === (previous + 1) % COUNTER_WRAP_RANGE ? 1 : -1);
  return { value, change, readings: state.readings };
}

export function moveCounterExplorer(state: CounterExplorerState, direction: -1 | 1) {
  const { value } = counterExplorerView(state);
  const change = counterChange(value.unsigned, direction);
  return { readings: [...state.readings, change.result.unsigned].slice(-5) };
}

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
