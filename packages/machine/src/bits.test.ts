// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { MASK64, flagsOf, fn, x, type Arg } from "./testing.ts";

const M32 = 0xffffffffn;

/** Run one line with x1, x2, ... as arguments and read x0. */
const one = (line: string, ...args: Arg[]): bigint => x(fn(`  ${line}`, [0, ...args]), 0);

describe("shifts", () => {
  it.each([
    ["lsl x0, x1, 4", [0x1234n], 0x12340n],
    ["lsl x0, x1, 63", [3n], 0x8000000000000000n],
    ["lsl x0, x1, 0", [5n], 5n],
    ["lsl w0, w1, 31", [3n], 0x80000000n],
    ["lsl w0, w1, 4", [0xffffffffn], 0xfffffff0n],
    ["lsr x0, x1, 4", [0x1234n], 0x123n],
    ["lsr x0, x1, 63", [MASK64], 1n],
    ["lsr w0, w1, 31", [0x80000000n], 1n],
    ["lsr w0, w1, 4", [0xffffffffffffffffn], 0x0fffffffn],
    ["asr x0, x1, 4", [0x8000000000000000n], 0xf800000000000000n],
    ["asr x0, x1, 63", [0x8000000000000000n], MASK64],
    ["asr w0, w1, 4", [0x80000000n], 0xf8000000n],
    ["asr w0, w1, 31", [0x7fffffffn], 0n],
    ["ror x0, x1, 4", [0x1n], 0x1000000000000000n],
    ["ror x0, x1, 0", [0x1n], 1n],
    ["ror w0, w1, 4", [0x1n], 0x10000000n],
    ["ror w0, w1, 31", [0x80000000n], 0x1n],
  ] as [string, Arg[], bigint][])("%s", (line, args, want) => {
    expect(one(line, ...args)).toBe(want);
  });

  it("by a register takes the amount modulo the width", () => {
    expect(one("lsl w0, w1, w2", 1n, 33n)).toBe(2n);
    expect(one("lsl w0, w1, w2", 1n, 32n)).toBe(1n);
    expect(one("lsl x0, x1, x2", 1n, 65n)).toBe(2n);
    expect(one("lsl x0, x1, x2", 1n, 64n)).toBe(1n);
    expect(one("lsr x0, x1, x2", 0x8000000000000000n, 127n)).toBe(1n);
    expect(one("lsr w0, w1, w2", 0x80000000n, 63n)).toBe(1n);
    expect(one("asr w0, w1, w2", 0x80000000n, 32n)).toBe(0x80000000n);
    expect(one("asr w0, w1, w2", 0x80000000n, 33n)).toBe(0xc0000000n);
    expect(one("asr x0, x1, x2", 0x8000000000000000n, 64n)).toBe(0x8000000000000000n);
    expect(one("ror w0, w1, w2", 1n, 33n)).toBe(0x80000000n);
    expect(one("ror x0, x1, x2", 1n, 65n)).toBe(0x8000000000000000n);
    // Only the low bits of the amount register count.
    expect(one("lsl x0, x1, x2", 1n, 0x100000003n)).toBe(8n);
    expect(one("lslv x0, x1, x2".replace("lslv", "lsl"), 1n, 3n)).toBe(8n);
  });

  it("shifts do not change the flags", () => {
    expect(fn("  lsl x0, x1, 1", [0, 1], { flags: flagsOf("1111") }).final.flags).toEqual({
      n: true,
      z: true,
      c: true,
      v: true,
    });
  });
});

describe("bit fields and extensions", () => {
  it.each([
    ["ubfx x0, x1, 8, 8", [0x12345678n], 0x56n],
    ["ubfx w0, w1, 4, 28", [0xffffffffn], 0x0fffffffn],
    ["ubfx x0, x1, 0, 64", [MASK64], MASK64],
    ["ubfx x0, x1, 63, 1", [MASK64], 1n],
    ["sbfx w0, w1, 4, 4", [0xf0n], 0xffffffffn],
    ["sbfx x0, x1, 4, 4", [0x70n], 7n],
    ["sbfx x0, x1, 60, 4", [0x8000000000000000n], MASK64 - 7n],
    ["ubfiz x0, x1, 4, 8", [0xffn], 0xff0n],
    ["ubfiz x0, x1, 60, 4", [0xffn], 0xf000000000000000n],
    ["ubfiz w0, w1, 28, 4", [0xffn], 0xf0000000n],
    ["sbfiz x0, x1, 4, 8", [0x80n], MASK64 - 0x7ffn],
    ["sbfiz w0, w1, 4, 8", [0x80n], 0xfffff800n],
    ["sbfiz x0, x1, 4, 8", [0x7fn], 0x7f0n],
    ["uxtb w0, w1", [0x1ffn], 0xffn],
    ["uxth w0, w1", [0x1ffffn], 0xffffn],
    ["sxtb w0, w1", [0x80n], 0xffffff80n],
    ["sxtb x0, w1", [0x80n], MASK64 - 0x7fn],
    ["sxth w0, w1", [0x8000n], 0xffff8000n],
    ["sxth x0, w1", [0x7fffn], 0x7fffn],
    ["sxtw x0, w1", [0x80000000n], 0xffffffff80000000n],
    ["sxtw x0, w1", [0x7fffffffn], 0x7fffffffn],
  ] as [string, Arg[], bigint][])("%s", (line, args, want) => {
    expect(one(line, ...args)).toBe(want);
  });

  it("bfi and bfxil keep the rest of the destination", () => {
    expect(x(fn("  bfi x0, x1, 8, 8", [MASK64, 0]), 0)).toBe(MASK64 - 0xff00n);
    expect(x(fn("  bfi x0, x1, 8, 8", [0, 0xabcd]), 0)).toBe(0xcd00n);
    expect(x(fn("  bfi x0, x1, 60, 4", [0, 0xff]), 0)).toBe(0xf000000000000000n);
    expect(x(fn("  bfi w0, w1, 28, 4", [0x1111111111111111n, 0xff]), 0)).toBe(0xf1111111n);
    expect(x(fn("  bfxil x0, x1, 4, 8", [MASK64, 0x1234]), 0)).toBe(MASK64 - 0xffn + 0x23n);
    expect(x(fn("  bfxil w0, w1, 4, 8", [0xffffffffffffffffn, 0x1234]), 0)).toBe(0xffffff23n);
    expect(x(fn("  bfi x0, xzr, 4, 4", [MASK64]), 0)).toBe(MASK64 - 0xf0n);
  });
});

describe("conditions", () => {
  const flagSets = Array.from({ length: 16 }, (_, i) => i.toString(2).padStart(4, "0"));
  // What the manual's condition table says each one is, written here from its words.
  const holds: Record<string, (n: boolean, z: boolean, c: boolean, v: boolean) => boolean> = {
    eq: (_n, z) => z,
    ne: (_n, z) => !z,
    cs: (_n, _z, c) => c,
    hs: (_n, _z, c) => c,
    cc: (_n, _z, c) => !c,
    lo: (_n, _z, c) => !c,
    mi: (n) => n,
    pl: (n) => !n,
    vs: (_n, _z, _c, v) => v,
    vc: (_n, _z, _c, v) => !v,
    hi: (_n, z, c) => c && !z,
    ls: (_n, z, c) => !(c && !z),
    ge: (n, _z, _c, v) => n === v,
    lt: (n, _z, _c, v) => n !== v,
    gt: (n, z, _c, v) => !z && n === v,
    le: (n, z, _c, v) => z || n !== v,
    al: () => true,
  };
  for (const [cond, test] of Object.entries(holds)) {
    it(`${cond} at every setting of the flags`, () => {
      for (const bits of flagSets) {
        const f = flagsOf(bits);
        const want = test(f.n, f.z, f.c, f.v) ? 1n : 0n;
        // csel carries both choices to every condition, `al` included.
        const r = fn(`  csel x0, x1, x2, ${cond}`, [0, 1, 0], { flags: f });
        expect(x(r, 0), `${cond} at ${bits}`).toBe(want);
        if (cond !== "al") {
          const s = fn(`  cset x0, ${cond}`, [], { flags: f });
          expect(x(s, 0), `cset ${cond} at ${bits}`).toBe(want);
        }
      }
    });
  }

  it("the select family", () => {
    const eq = flagsOf("0100");
    const ne = flagsOf("0000");
    const args: Arg[] = [0, 10, 20];
    expect(x(fn("  csel x0, x1, x2, eq", args, { flags: eq }), 0)).toBe(10n);
    expect(x(fn("  csel x0, x1, x2, eq", args, { flags: ne }), 0)).toBe(20n);
    expect(x(fn("  csinc x0, x1, x2, eq", args, { flags: eq }), 0)).toBe(10n);
    expect(x(fn("  csinc x0, x1, x2, eq", args, { flags: ne }), 0)).toBe(21n);
    expect(x(fn("  csinv x0, x1, x2, eq", args, { flags: ne }), 0)).toBe(MASK64 - 20n);
    expect(x(fn("  csneg x0, x1, x2, eq", args, { flags: ne }), 0)).toBe(MASK64 - 19n);
    expect(x(fn("  csneg w0, w1, w2, eq", args, { flags: ne }), 0)).toBe(0xffffffecn);
    expect(x(fn("  csinc w0, w1, w2, eq", [0, 1, M32], { flags: ne }), 0)).toBe(0n);
    // cset, csetm, cinc, cneg are these with the condition inverted.
    expect(x(fn("  cset w0, eq", [], { flags: eq }), 0)).toBe(1n);
    expect(x(fn("  cset w0, eq", [], { flags: ne }), 0)).toBe(0n);
    expect(x(fn("  csetm x0, eq", [], { flags: eq }), 0)).toBe(MASK64);
    expect(x(fn("  csetm w0, eq", [], { flags: eq }), 0)).toBe(M32);
    expect(x(fn("  csetm x0, eq", [], { flags: ne }), 0)).toBe(0n);
    expect(x(fn("  cinc x0, x1, eq", args, { flags: eq }), 0)).toBe(11n);
    expect(x(fn("  cinc x0, x1, eq", args, { flags: ne }), 0)).toBe(10n);
    expect(x(fn("  cneg x0, x1, eq", args, { flags: eq }), 0)).toBe(MASK64 - 9n);
    expect(x(fn("  cneg x0, x1, eq", args, { flags: ne }), 0)).toBe(10n);
    // The zero register as a source.
    expect(x(fn("  csel x0, xzr, x2, eq", args, { flags: eq }), 0)).toBe(0n);
    expect(x(fn("  csinc x0, xzr, xzr, ne", [], { flags: eq }), 0)).toBe(1n);
  });
});

describe("multiply and divide", () => {
  it.each([
    ["mul x0, x1, x2", [6n, 7n], 42n],
    ["mul x0, x1, x2", [MASK64, 2n], MASK64 - 1n],
    ["mul w0, w1, w2", [0x10000n, 0x10000n], 0n],
    ["mul w0, w1, w2", [0xffffffffn, 0xffffffffn], 1n],
    ["madd x0, x1, x2, x3", [6n, 7n, 8n], 50n],
    ["madd w0, w1, w2, w3", [0xffffffffn, 2n, 5n], 3n],
    ["msub x0, x1, x2, x3", [6n, 7n, 50n], 8n],
    ["mneg x0, x1, x2", [6n, 7n], MASK64 - 41n],
    ["mneg w0, w1, w2", [1n, 1n], M32],
    ["smull x0, w1, w2", [0xffffffffn, 0xffffffffn], 1n],
    ["smull x0, w1, w2", [0x80000000n, 2n], MASK64 - 0xffffffffn],
    ["umull x0, w1, w2", [0xffffffffn, 0xffffffffn], 0xfffffffe00000001n],
    ["smaddl x0, w1, w2, x3", [0xffffffffn, 5n, 100n], 95n],
    ["umaddl x0, w1, w2, x3", [0xffffffffn, 2n, 1n], 0x1ffffffffn],
    ["smulh x0, x1, x2", [MASK64, MASK64], 0n],
    ["smulh x0, x1, x2", [0x8000000000000000n, 0x8000000000000000n], 0x4000000000000000n],
    ["smulh x0, x1, x2", [MASK64, 1n], MASK64],
    ["umulh x0, x1, x2", [MASK64, MASK64], MASK64 - 1n],
    ["umulh x0, x1, x2", [0x100000000n, 0x100000000n], 1n],
    ["sdiv x0, x1, x2", [MASK64 - 6n, 2n], MASK64 - 2n],
    ["sdiv x0, x1, x2", [7n, MASK64 - 1n], MASK64 - 2n],
    ["sdiv w0, w1, w2", [0xfffffff9n, 2n], 0xfffffffdn],
    ["udiv x0, x1, x2", [MASK64, 2n], 0x7fffffffffffffffn],
    ["udiv w0, w1, w2", [7n, 2n], 3n],
    // Division by zero gives zero and the run goes on.
    ["sdiv x0, x1, x2", [7n, 0n], 0n],
    ["udiv x0, x1, x2", [7n, 0n], 0n],
    ["sdiv w0, w1, w2", [7n, 0n], 0n],
    ["udiv w0, w1, w2", [0xffffffffn, 0n], 0n],
    // The most negative value divided by -1 is itself.
    ["sdiv x0, x1, x2", [0x8000000000000000n, MASK64], 0x8000000000000000n],
    ["sdiv w0, w1, w2", [0x80000000n, M32], 0x80000000n],
    ["udiv x0, x1, x2", [0x8000000000000000n, MASK64], 0n],
  ] as [string, Arg[], bigint][])("%s with %s", (line, args, want) => {
    expect(one(line, ...args)).toBe(want);
  });

  it("a division by zero does not stop the run", () => {
    const r = fn("  udiv x0, x1, x2\n  add x3, x0, 5", [9, 9, 0]);
    expect(r.stop.kind).toBe("returned");
    expect(x(r, 3)).toBe(5n);
  });
});
