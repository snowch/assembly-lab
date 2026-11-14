// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { calculatorAdditionCarries } from "./index.ts";
import { fn } from "./testing.ts";

function ripple(a: bigint, b: bigint, width: number) {
  let carry = 0;
  let carries = 0n;
  for (let bit = 0; bit < width; bit++) {
    carries |= BigInt(carry) << BigInt(bit);
    const total = Number((a >> BigInt(bit)) & 1n) + Number((b >> BigInt(bit)) & 1n) + carry;
    carry = total >= 2 ? 1 : 0;
  }
  const intoSign = Number((carries >> BigInt(width - 1)) & 1n);
  return {
    carries: carries.toString(),
    intoSign,
    out: carry,
    c: carry,
    v: intoSign === carry ? 0 : 1,
  };
}

describe("calculator addition carries", () => {
  it("matches column propagation for every four-bit operand pair and all top-carry pairs", () => {
    const seen = new Set<string>();
    for (let a = 0n; a < 16n; a++)
      for (let b = 0n; b < 16n; b++) {
        const actual = calculatorAdditionCarries(a.toString(), b.toString(), 4);
        expect(actual).toEqual(ripple(a, b, 4));
        expect(BigInt(actual.carries) & 1n).toBe(0n);
        seen.add(`${actual.intoSign}${actual.out}`);
        const signedA = BigInt.asIntN(4, a);
        const signedB = BigInt.asIntN(4, b);
        expect(actual.v).toBe(signedA + signedB < -8n || signedA + signedB > 7n ? 1 : 0);
      }
    expect([...seen].sort()).toEqual(["00", "01", "10", "11"]);
  });

  for (const width of [32, 64] as const) {
    it(`matches the ${width}-bit simulator and an independent carry recurrence`, () => {
      const high = 1n << BigInt(width - 1);
      const mask = 2n ** BigInt(width) - 1n;
      const samples = [0n, 1n, 2n, high - 2n, high - 1n, high, high + 1n, mask - 1n, mask];
      const register = width === 32 ? "w" : "x";
      for (const a of samples)
        for (const b of samples) {
          const actual = calculatorAdditionCarries(a.toString(), b.toString(), width);
          expect(actual).toEqual(ripple(a, b, width));
          const run = fn(`  adds ${register}2, ${register}0, ${register}1`, [a, b]);
          const addition = run.steps[0]!.addition!;
          expect(actual.carries).toBe(addition.carries.toString());
          expect(actual.out).toBe(addition.carryOut);
          expect(actual.c).toBe(Number(run.final.flags.c));
          expect(actual.v).toBe(Number(run.final.flags.v));
        }
    });
  }

  it("pins the user's addition and the three other sign-bit carry combinations", () => {
    expect(calculatorAdditionCarries("2147483646", "2", 32)).toEqual({
      carries: "4294967292",
      intoSign: 1,
      out: 0,
      c: 0,
      v: 1,
    });
    expect(calculatorAdditionCarries("4294967295", "1", 32)).toEqual({
      carries: "4294967294",
      intoSign: 1,
      out: 1,
      c: 1,
      v: 0,
    });
    expect(calculatorAdditionCarries("2147483648", "2147483648", 32)).toEqual({
      carries: "0",
      intoSign: 0,
      out: 1,
      c: 1,
      v: 1,
    });
    expect(calculatorAdditionCarries("0", "1", 32)).toEqual({
      carries: "0",
      intoSign: 0,
      out: 0,
      c: 0,
      v: 0,
    });
  });

  it("rejects invalid patterns instead of generating misleading carries", () => {
    expect(() => calculatorAdditionCarries("4294967296", "0", 32)).toThrow(RangeError);
    expect(() => calculatorAdditionCarries("0", "-1", 64)).toThrow(TypeError);
  });
});
