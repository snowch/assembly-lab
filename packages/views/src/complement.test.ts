// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble, run } from "@al/machine";
import { FOUR_BIT_LIMITS, fourBitNegation, fourBitReadings } from "./complement";

describe("four-bit explanatory patterns backed by register states", () => {
  it("reads every pattern by its positional weights", () => {
    for (let value = 0; value < 16; value++) {
      const r = fourBitReadings(value.toString(2).padStart(4, "0"));
      expect(r.unsigned).toBe(value);
      expect(r.signed).toBe(value < 8 ? value : value - 16);
      expect(r.places.map((p) => p.unsignedWeight)).toEqual([8, 4, 2, 1]);
      expect(r.places.map((p) => p.signedWeight)).toEqual([-8, 4, 2, 1]);
      expect(r.places.reduce((sum, p) => sum + p.unsigned, 0)).toBe(r.unsigned);
      expect(r.places.reduce((sum, p) => sum + p.signed, 0)).toBe(r.signed);
    }
  });

  it("matches the low four bits of an actual model NEG for every pattern", () => {
    const { program } = assemble("negate:\nneg w0, w0\nret");
    expect(program).not.toBeNull();
    for (let value = 0; value < 16; value++) {
      const n = fourBitNegation(value.toString(2).padStart(4, "0"));
      const state = run(program!, { entry: "negate", args: [{ value: BigInt(value), width: 32 }] });
      expect(state.stop.kind).toBe("returned");
      expect(n.after.unsigned).toBe(Number((state.final.x[0] ?? 0n) & 15n));
      expect(n.inverted.unsigned).toBe(15 - value);
      expect(n.fullSum).toBe(16 - value);
      expect(n.discarded).toBe(value === 0);
      expect(n.outsideSignedRange).toBe(value === 8);
    }
  });

  it("pins the worked pattern, limits and single zero", () => {
    expect(FOUR_BIT_LIMITS).toEqual({
      unsignedMin: 0,
      unsignedMax: 15,
      signedMin: -8,
      signedMax: 7,
    });
    const n = fourBitNegation("1010");
    expect([
      n.before.unsigned,
      n.before.signed,
      n.inverted.pattern,
      n.after.pattern,
      n.after.signed,
    ]).toEqual([10, -6, "0101", "0110", 6]);
    expect(fourBitNegation("0000").fullPattern).toBe("10000");
    expect(fourBitNegation("1000").after.pattern).toBe("1000");
    expect(
      Array.from({ length: 16 }, (_, x) => fourBitReadings(x.toString(2).padStart(4, "0")))
        .filter((r) => r.signed === 0)
        .map((r) => r.pattern),
    ).toEqual(["0000"]);
    expect(() => fourBitReadings("10102")).toThrow();
  });
});
