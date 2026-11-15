// Copyright © 2026 Christopher Snow

import { expect, it } from "vitest";
import { calculatorArithmeticFlags } from "./index.ts";
import { fn } from "./testing.ts";

for (const width of [32, 64] as const)
  for (const operation of ["add", "subtract"] as const) {
    it(`${width}-bit calculator ${operation} conditions match the simulator at signed and unsigned boundaries`, () => {
      const top = 1n << BigInt(width - 1),
        mask = (top << 1n) - 1n;
      const samples = [0n, 1n, 2n, top - 2n, top - 1n, top, top + 1n, mask - 1n, mask];
      const reg = width === 32 ? "w" : "x",
        mnemonic = operation === "add" ? "adds" : "subs";
      for (const a of samples)
        for (const b of samples) {
          const flags = fn(`  ${mnemonic} ${reg}2, ${reg}0, ${reg}1`, [a, b]).final.flags;
          expect(calculatorArithmeticFlags(a.toString(), operation, b.toString(), width)).toEqual({
            n: Number(flags.n),
            z: Number(flags.z),
            c: Number(flags.c),
            v: Number(flags.v),
          });
        }
    });
  }

it("rejects malformed or out-of-width flags sources", () => {
  expect(() => calculatorArithmeticFlags("4294967296", "subtract", "1", 32)).toThrow(RangeError);
  expect(() => calculatorArithmeticFlags("0", "add", "-1", 64)).toThrow(TypeError);
});
