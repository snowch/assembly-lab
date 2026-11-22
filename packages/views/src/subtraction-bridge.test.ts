// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { traceOf } from "./trace";
import { additionSteps } from "./arith";
import { subtractionBridge } from "./subtraction-bridge";

const program = { listing: "calculate:\nsubs w0, w0, w1\nret", c: "" };
const recordOf = (a: number, b: number) =>
  additionSteps(traceOf(program, { entry: "calculate", args: [a, b] }))[0]!.addition!;

describe("the subtraction width bridge", () => {
  it("reads the proposed 8 minus 3 diagram from the machine record", () => {
    const { small, wide } = subtractionBridge(recordOf(8, 3));
    expect(small).toMatchObject({
      inverted: 12n,
      allOnes: 15n,
      range: 16n,
      fullSum: 21n,
      result: 5n,
      carryOut: 1,
      patterns: { b: "0011", inverted: "1100", allOnes: "1111", result: "0101" },
    });
    expect(wide).toMatchObject({
      inverted: 4294967292n,
      allOnes: 4294967295n,
      range: 4294967296n,
      fullSum: 4294967301n,
      result: 5n,
      carryOut: 1,
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
