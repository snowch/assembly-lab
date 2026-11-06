// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { TRIP_REMAINING, TRIP_REMAINING_U } from "../../../content/lessons/module-1.listings";
import { traceOf, wValue } from "./trace";
import { subtractionWork } from "./subtraction-work";

const traces = (args: number[]) =>
  [TRIP_REMAINING, TRIP_REMAINING_U].map((recorded, index) =>
    traceOf(recorded, { entry: index === 0 ? "trip_remaining" : "trip_remaining_u", args }),
  );
const altered = (listing: string, args: number[]) => traceOf({ listing }, { entry: "other", args });

describe("the arithmetic reminder follows the actual returned subtraction", () => {
  it.each([
    { a: 3, b: 5, opposite: 4294967291, result: 4294967294 },
    { a: 8, b: 2, opposite: 4294967294, result: 6 },
    { a: 7, b: 0, opposite: 0, result: 7 },
    { a: 0, b: 4294967295, opposite: 1, result: 1 },
    { a: 4294967295, b: 1, opposite: 4294967295, result: 4294967294 },
    { a: 1, b: 2147483648, opposite: 2147483648, result: 2147483649 },
  ])("retains the model's 32 places for $a minus $b", ({ a, b, opposite, result }) => {
    const runs = traces([a, b]);
    const work = subtractionWork(runs);
    expect(work).toEqual({
      width: 32,
      first: a,
      second: b,
      inverted: 4294967295 - b,
      one: 1,
      opposite,
      result,
    });
    expect(runs.map((trace) => wValue(trace.result.final, 0))).toEqual([result, result]);
    expect(BigInt.asUintN(32, BigInt(a) + BigInt(opposite))).toBe(BigInt(result));
  });

  it("does not invent a shared calculation for different operations giving the same word", () => {
    const left = traces([3, 3])[0]!;
    const right = altered("other:\nmov w2, 0\nsub w0, w2, w2\nret", [3, 3]);
    expect(wValue(left.result.final, 0)).toBe(wValue(right.result.final, 0));
    expect(subtractionWork([left, right])).toBeNull();
    const differentInputs = traces([4, 6])[1]!;
    const negativeTwo = traces([3, 5])[0]!;
    expect(wValue(differentInputs.result.final, 0)).toBe(wValue(negativeTwo.result.final, 0));
    expect(subtractionWork([negativeTwo, differentInputs])).toBeNull();
  });

  it("rejects a fault, a later replacement, a different result, or a different width", () => {
    const left = traces([3, 5])[0]!;
    for (const right of [
      altered("other:\nsub w0, w0, w1\nldr w1, [x2]\nret", [3, 5]),
      altered("other:\nsub w0, w0, w1\nadd w0, w0, 0\nret", [3, 5]),
      altered("other:\nsub w0, w1, w0\nret", [3, 5]),
      altered("other:\nsub x0, x0, x1\nret", [3, 5]),
    ])
      expect(subtractionWork([left, right])).toBeNull();
    for (const listing of [
      "other:\nsub w0, w0, w1\nldr w1, [x2]\nret",
      "other:\nsub w0, w0, w1\nadd w0, w0, 0\nret",
      "other:\nsub x0, x0, x1\nret",
    ]) {
      const trace = altered(listing, [3, 5]);
      expect(subtractionWork([trace, trace])).toBeNull();
    }
    expect(subtractionWork([])).toBeNull();
    expect(subtractionWork([left])).toBeNull();
  });
});
