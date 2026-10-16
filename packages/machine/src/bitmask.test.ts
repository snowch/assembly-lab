// Copyright © 2026 Christopher Snow

// The rule the message `immediate.bitmask` states, held to the model: the constant of `and`, `orr`
// and `eor` is one run of 1s across the register's bits that does not fill them all (the run may
// wrap round from the top bit to bit 0), or a shorter run like that repeated in every 2, 4, 8, 16
// (or, in 64 bits, 32) bits. The rule is built here from its words, apart from the model's own test
// of a constant, so the two can disagree.

import { describe, expect, it } from "vitest";

import { assemble } from "./assemble.ts";
import { message } from "./strings.ts";
import { isBitmaskImmediate } from "./regs.ts";

/** Every constant the rule allows in `bits` bits, built from its words. */
function allowed(bits: 32 | 64): Set<bigint> {
  const out = new Set<bigint>();
  for (let size = 2; size <= bits; size *= 2) {
    for (let ones = 1; ones < size; ones++) {
      // A run of `ones` 1s starting at each bit of the element, wrapping round the element's top.
      for (let start = 0; start < size; start++) {
        let element = 0n;
        for (let k = 0; k < ones; k++) element |= 1n << BigInt((start + k) % size);
        let value = 0n;
        for (let at = 0; at < bits; at += size) value |= element << BigInt(at);
        out.add(value);
      }
    }
  }
  return out;
}

describe("the constant of and, orr and eor", () => {
  it("is allowed in 32 bits for exactly the 1302 constants the rule gives", () => {
    const rule = allowed(32);
    expect(rule.size).toBe(1302);
    for (const v of rule) expect(isBitmaskImmediate(v, 32), v.toString(16)).toBe(true);
  });

  it("is refused in 32 bits for every other constant tried", () => {
    const rule = allowed(32);
    // A fixed spread of patterns: a stride through all 2^32 values, and the neighbours of the rule's.
    const tried: bigint[] = [];
    for (let v = 0x1234567n; v < 1n << 32n; v += 0x10001n * 7n) tried.push(v);
    for (const v of rule) tried.push(v ^ 1n, v ^ 0x80000000n, v ^ 0x100n);
    for (const v of tried) {
      const u = BigInt.asUintN(32, v);
      expect(isBitmaskImmediate(u, 32), u.toString(16)).toBe(rule.has(u));
    }
  });

  it("is allowed in 64 bits for exactly the 5334 constants the rule gives", () => {
    const rule = allowed(64);
    expect(rule.size).toBe(5334);
    for (const v of rule) expect(isBitmaskImmediate(v, 64), v.toString(16)).toBe(true);
  });

  it("agrees with the examples the message gives, and with the wrap and the repeat", () => {
    const yes = [0xf0n, 0xffffff8fn, 0xf000000fn, 0x55555555n, 0x00ff00ffn, 0x7fffffffn];
    const no = [0x8fn, 0n, 0xffffffffn, 0x101n, 0x49249249n, 0x205n];
    for (const v of yes) expect(isBitmaskImmediate(v, 32), v.toString(16)).toBe(true);
    for (const v of no) expect(isBitmaskImmediate(v, 32), v.toString(16)).toBe(false);
  });
});

describe("the message for a constant the instruction cannot hold", () => {
  const first = (source: string) => assemble(`f:\n  ${source}\n  ret`).errors[0];

  it("states the rule, with the register's width", () => {
    const e = first("and w0, w0, 0x8f");
    expect(e?.key).toBe("immediate.bitmask");
    const text = message(e!.key, e!.params);
    expect(text).toContain("Across the 32 bits");
    expect(text).toContain("wrap round from the top bit to bit 0");
    expect(text).toContain("repeated in every 2, 4, 8 or 16 bits");
    expect(text).toContain("`0xf0` is one run; `0x8f` is not.");
    expect(message(first("and x0, x0, 0x8f")!.key, first("and x0, x0, 0x8f")!.params)).toContain(
      "Across the 64 bits",
    );
  });

  it("is the same for orr and eor, and for a constant that is not a pattern of the register", () => {
    for (const line of ["orr w0, w0, 0x8f", "eor w0, w0, 0x8f", "and w0, w0, 0x1ffffffff"])
      expect(first(line)?.key, line).toBe("immediate.bitmask");
  });

  it("says the turned-over constant for bic, and accepts what the rule gives", () => {
    expect(first("bic w0, w0, 0x70f0")?.key).toBe("immediate.bitmaskBic");
    expect(first("bic w0, w0, 0x70")).toBeUndefined();
    expect(first("and w0, w0, 0xffffff8f")).toBeUndefined();
    expect(first("and w0, w0, 0xf000000f")).toBeUndefined();
  });
});
