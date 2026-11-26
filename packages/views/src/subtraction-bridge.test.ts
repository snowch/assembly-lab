// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { traceOf } from "./trace";
import { additionSteps } from "./arith";
import { subtractionBoundary, subtractionBridge } from "./subtraction-bridge";

const program = { listing: "calculate:\nsubs w0, w0, w1\nret", c: "" };
const recordOf = (a: number, b: number) =>
  additionSteps(traceOf(program, { entry: "calculate", args: [a, b] }))[0]!.addition!;

describe("the subtraction width bridge", () => {
  it("holds b fixed and shows the exact carry boundary, including equality", () => {
    const cases = subtractionBoundary(program, { entry: "calculate", args: [8, 3] });
    expect(
      cases.map(({ small }) => [
        small.a,
        small.b,
        small.inverted,
        small.fullSum,
        small.carryOut,
        small.patterns.result,
        small.result,
      ]),
    ).toEqual([
      [6n, 8n, 7n, 14n, 0, "1110", 14n],
      [7n, 8n, 7n, 15n, 0, "1111", 15n],
      [8n, 8n, 7n, 16n, 1, "0000", 0n],
      [9n, 8n, 7n, 17n, 1, "0001", 1n],
    ]);
    expect(cases.map(({ wide }) => [wide.carryOut, wide.result])).toEqual([
      [0, 4294967294n],
      [0, 4294967295n],
      [1, 0n],
      [1, 1n],
    ]);
    expect(cases.map(({ small }) => small.top)).toEqual([
      { bit: 3, a: 0, b: 0, carryIn: 1, total: 1, kept: 1, carryOut: 0 },
      { bit: 3, a: 0, b: 0, carryIn: 1, total: 1, kept: 1, carryOut: 0 },
      { bit: 3, a: 1, b: 0, carryIn: 1, total: 2, kept: 0, carryOut: 1 },
      { bit: 3, a: 1, b: 0, carryIn: 1, total: 2, kept: 0, carryOut: 1 },
    ]);
  });

  it("reads the proposed 8 minus 3 diagram from the machine record", () => {
    const { small, wide } = subtractionBridge(recordOf(8, 3));
    expect(small).toMatchObject({
      minimum: 0n,
      maximum: 15n,
      inverted: 12n,
      allOnes: 15n,
      range: 16n,
      fullSum: 21n,
      result: 5n,
      carryOut: 1,
      patterns: { minimum: "0000", b: "0011", inverted: "1100", allOnes: "1111", result: "0101" },
    });
    expect(wide).toMatchObject({
      minimum: 0n,
      maximum: 4294967295n,
      inverted: 4294967292n,
      allOnes: 4294967295n,
      range: 4294967296n,
      fullSum: 4294967301n,
      result: 5n,
      carryOut: 1,
      patterns: { minimum: "00000000000000000000000000000000" },
    });
  });

  it("preserves unsigned carry/no-borrow across all four-bit input pairs, including zero", () => {
    for (let a = 0; a < 16; a++)
      for (let b = 0; b < 16; b++) {
        const record = recordOf(a, b);
        for (const view of Object.values(subtractionBridge(record))) {
          expect(view.fullSum).toBe(BigInt(a) + view.range - BigInt(b));
          expect(BigInt(view.carryOut) * view.range + view.result).toBe(view.fullSum);
          expect(view.carryOut).toBe(record.carryOut);
          expect(view.carryOut).toBe(a >= b ? 1 : 0);
          expect(view.top.carryOut).toBe(view.carryOut);
          expect(view.top.total).toBe(view.top.kept + 2 * view.top.carryOut);
          expect(view.b & view.inverted).toBe(0n);
          expect(view.patterns.result).toHaveLength(view.width);
        }
      }
  });

  it("rejects a miniature that would silently change the prepared inputs", () => {
    expect(() => subtractionBridge(recordOf(16, 3))).toThrow(/inputs/);
    expect(() => subtractionBridge({ ...recordOf(8, 3), subtraction: false })).toThrow(
      /subtraction record/,
    );
  });
});
