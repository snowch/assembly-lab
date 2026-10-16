// Copyright © 2026 Christopher Snow

// The counter as a ring: what the simulator says about two readings of a 32-bit counter. The
// distance is what the recorded subtraction returns for the call; the flag is C after the same
// subtraction with the flags set (`subs`). Where the readings sit on the ring is arithmetic of the
// drawing only: a value's place is its share of the 2^32 values.

import { wValue, traceOf, type TraceCall } from "./trace";
import type { RecordedProgram } from "./listing";

/** How many values a 32-bit counter takes before it wraps. */
export const COUNTER_VALUES = 2 ** 32;

export interface RingReading {
  readonly now: number;
  readonly then: number;
  /** `now - then`, as the recorded function returns it. */
  readonly elapsed: number;
  /** C after the same subtraction with `subs`: 0 when a borrow was needed. */
  readonly c: 0 | 1;
  /** Whether the counter wrapped between the two readings: the subtraction needed a borrow. */
  readonly wrapped: boolean;
}

/**
 * Runs `elapsed(now, then)` for the call (`args` are `now` then `then`) on the recorded function,
 * and the same two readings through `borrowProgram`, whose function does `subs` and returns.
 */
export function ringReading(
  program: Pick<RecordedProgram, "listing">,
  borrowProgram: Pick<RecordedProgram, "listing">,
  call: TraceCall,
  borrowEntry: string,
): RingReading {
  const [now, then] = call.args;
  if (now === undefined || then === undefined)
    throw new Error("The counter's ring needs two readings, now and then.");
  const distance = traceOf(program, call);
  const borrow = traceOf(borrowProgram, { entry: borrowEntry, args: call.args });
  const c = borrow.result.final.flags.c ? 1 : 0;
  return {
    now,
    then,
    elapsed: wValue(distance.result.final, 0),
    c,
    wrapped: c === 0,
  };
}

/** A point on a circle at a share of the way round, clockwise from the top. */
export function onRing(cx: number, cy: number, r: number, share: number): [number, number] {
  const angle = 2 * Math.PI * share;
  return [cx + r * Math.sin(angle), cy - r * Math.cos(angle)];
}
