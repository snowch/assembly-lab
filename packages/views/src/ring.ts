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
  /**
   * Whether the subtraction needed a borrow (C is 0 after `subs`). That is all it says. Under the
   * lesson's assumption, that the counter advances normally and fewer than 2^32 ticks passed
   * between the readings, a borrow means the counter wrapped once between them. The subtraction
   * cannot say how many times a counter wrapped.
   */
  readonly borrowed: boolean;
  /**
   * The elapsed ticks split at the wrap, for a subtraction that borrowed: the ticks from `then` to
   * the wrap, and the ticks after it up to `now`. Their sum is `elapsed`. Null when nothing was
   * borrowed, and the whole of `elapsed` is one stretch.
   */
  readonly segments: { readonly before: number; readonly after: number } | null;
}

/**
 * The two stretches of a borrowed subtraction: the ticks that take `then` to the wrap (2^32 minus
 * `then`) and the rest of the distance, which is where `now` is counted from 0. The distance is the
 * model's, so the two always sum to it.
 */
export function segmentsOf(
  then: number,
  elapsed: number,
): { readonly before: number; readonly after: number } {
  const before = COUNTER_VALUES - then;
  return { before, after: elapsed - before };
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
    borrowed: c === 0,
    segments: c === 0 ? segmentsOf(then, wValue(distance.result.final, 0)) : null,
  };
}

/** A point on a circle at a share of the way round, clockwise from the top. */
export function onRing(cx: number, cy: number, r: number, share: number): [number, number] {
  const angle = 2 * Math.PI * share;
  return [cx + r * Math.sin(angle), cy - r * Math.cos(angle)];
}
