// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { STACK_TOP } from "./layout.ts";
import { MASK64, flagBits, flagsOf, fn, x, type Arg } from "./testing.ts";

const M32 = 0xffffffffn;

describe("move", () => {
  it.each([
    ["mov x0, 0x1234", 0x1234n],
    ["mov x0, -1", MASK64],
    ["mov w0, -1", M32],
    ["mov x0, 0x5555555555555555", 0x5555555555555555n],
    ["mov x0, 0xffff0000ffff", 0xffff0000ffffn],
    ["mov x0, 0xfffffffffffffffe", MASK64 - 1n],
    ["mov w0, 65536", 0x10000n],
    ["mov w0, 0xffff0000", 0xffff0000n],
    ["mov w0, 0x00ff00ff", 0x00ff00ffn],
    ["mov x0, 0xffffffff", M32],
    ["mov x0, 0xffffffff00000000", 0xffffffff00000000n],
    ["mov x0, 'a'", 97n],
    ["mov x0, 1 << 4 | 1", 17n],
    ["mov x0, 1 | 2 + 4", 7n],
    ["MOV X0, #5", 5n],
  ])("%s", (line, want) => {
    expect(x(fn(`  ${line}`), 0)).toBe(want);
  });

  it("movz, movn and movk", () => {
    expect(x(fn("  movz x0, 0xabcd, lsl 32"), 0)).toBe(0xabcd00000000n);
    expect(x(fn("  movn x0, 0xabcd, lsl 16"), 0)).toBe(MASK64 ^ 0xabcd0000n);
    expect(x(fn("  movn w0, 0"), 0)).toBe(M32);
    const r = fn(
      "  movz x0, 0xdef0\n  movk x0, 0x9abc, lsl 16\n  movk x0, 0x5678, lsl 32\n  movk x0, 0x1234, lsl 48",
    );
    expect(x(r, 0)).toBe(0x123456789abcdef0n);
    // movk keeps the other bits.
    expect(x(fn("  movk x0, 0xffff, lsl 16", [0x1111111111111111n]), 0)).toBe(0x11111111ffff1111n);
    // A w movk writes a w register, so the top half goes.
    expect(x(fn("  movk w0, 0xffff, lsl 16", [0x1111111111111111n]), 0)).toBe(0xffff1111n);
  });

  it("moves between registers and with sp", () => {
    expect(x(fn("  mov x0, x1", [0, 77]), 0)).toBe(77n);
    expect(x(fn("  mov x0, sp"), 0)).toBe(BigInt(STACK_TOP));
    const r = fn("  mov x1, sp\n  sub x2, x1, 32\n  mov sp, x2\n  mov x0, sp\n  mov sp, x1");
    expect(x(r, 0)).toBe(BigInt(STACK_TOP - 32));
    expect(r.final.sp).toBe(BigInt(STACK_TOP));
    expect(x(fn("  mov x0, xzr", [5]), 0)).toBe(0n);
    expect(x(fn("  mov x29, x0\n  mov x0, x29", [9]), 0)).toBe(9n);
  });

  it("writing a w register clears the top 32 bits", () => {
    const top = 0xffffffffffffffffn;
    expect(x(fn("  mov w0, w0", [top]), 0)).toBe(M32);
    expect(x(fn("  add w0, w0, 1", [top]), 0)).toBe(0n);
    expect(x(fn("  mov w1, 7", [0, top]), 1)).toBe(7n);
    expect(x(fn("  ldrb w1, [x0]", [BigInt(STACK_TOP - 8), top]), 1)).toBe(0n);
    expect(x(fn("  csel w1, w0, w2, eq", [top, top, top]), 1)).toBe(M32);
  });

  it("the zero register reads as 0 and discards a write", () => {
    const r = fn(
      "  mov xzr, x0\n  mov x4, 5\n  add x1, xzr, x4\n  orr x2, xzr, xzr\n  mov w3, wzr",
      [9],
    );
    expect(x(r, 1)).toBe(5n);
    expect(x(r, 2)).toBe(0n);
    expect(r.steps[0]?.writes).toEqual([]);
  });

  it("w arguments clear the top half; x arguments keep it", () => {
    const r = fn("", [[0xffffffffffffffffn, 32], 0xffffffffffffffffn]);
    expect(x(r, 0)).toBe(M32);
    expect(x(r, 1)).toBe(MASK64);
  });
});

describe("add and subtract", () => {
  it.each([
    ["add x0, x1, x2", [3, 4], 7n],
    ["sub x0, x1, x2", [3, 4], MASK64],
    ["add w0, w1, w2", [0xffffffff, 1], 0n],
    ["sub w0, w1, w2", [0, 1], M32],
    ["add x0, x1, 4095", [1], 4096n],
    ["add x0, x1, 4096", [1], 4097n],
    ["add x0, x1, 0xfff000", [0], 0xfff000n],
    ["sub x0, x1, 5, lsl 12", [0x10000], 0xb000n],
    ["add w0, w1, -1", [10], 9n],
    ["sub w0, w1, -1", [10], 11n],
    ["add x0, x1, -4096", [0x2000], 0x1000n],
    ["add x0, x1, x2, lsl 3", [1, 2], 17n],
    ["add x0, x1, x2, lsr 1", [1, 8], 5n],
    ["add x0, x1, x2, asr 1", [1, MASK64 - 7n], MASK64 - 2n],
    ["add w0, w1, w2, asr 1", [1, 0x80000000], 0xc0000001n],
    ["neg x0, x1", [5], MASK64 - 4n],
    ["neg w0, w1", [5], 0xfffffffbn],
    ["neg x0, x1, lsl 1", [5], MASK64 - 9n],
  ] as [string, Arg[], bigint][])("%s", (line, args, want) => {
    // The arguments are x1 and on; x0 is the destination.
    expect(x(fn(`  ${line}`, [0, ...args]), 0)).toBe(want);
  });

  it("extended registers", () => {
    const e = (line: string, a: Arg, b: Arg): bigint => x(fn(`  ${line}`, [0, a, b]), 0);
    expect(e("add x0, x1, w2, sxtw", 100, 0xffffffff)).toBe(99n);
    expect(e("add x0, x1, w2, uxtw", 100, 0xffffffff)).toBe(100n + M32);
    expect(e("add x0, x1, w2, sxtw 2", 100, 0xfffffffe)).toBe(92n);
    expect(e("add x0, x1, w2, uxtb", 100, 0x1ff)).toBe(355n);
    expect(e("add x0, x1, w2, sxtb", 100, 0x1ff)).toBe(99n);
    expect(e("add x0, x1, w2, sxth 1", 100, 0x8000)).toBe(BigInt.asUintN(64, 100n - 0x10000n));
    expect(e("add x0, x1, x2, sxtx 4", 0, MASK64)).toBe(MASK64 - 15n);
    expect(e("add x0, x1, x2, uxtx", 1, 2)).toBe(3n);
    expect(e("add w0, w1, w2, sxtb 1", 1, 0x80)).toBe(0xffffff01n);
    expect(e("sub w0, w1, w2, uxth", 0, 0x1ffff)).toBe(0xffff0001n);
    // The extended value is cut to the width of the operation before it is added.
    expect(e("add w0, w1, w2, uxtx", 1, 0x100000001n)).toBe(2n);
  });

  it("sp is a destination or a source", () => {
    const r = fn(
      "  mov x9, sp\n  sub sp, sp, 48\n  add x0, sp, 16\n  add sp, sp, x1, lsl 3\n  add sp, sp, w2, uxtw\n  mov x3, sp\n  mov sp, x9",
      [0, 2, 16],
    );
    expect(x(r, 0)).toBe(BigInt(STACK_TOP - 32));
    expect(x(r, 3)).toBe(BigInt(STACK_TOP - 48 + 16 + 16));
    expect(r.final.sp).toBe(BigInt(STACK_TOP));
    expect(x(fn("  add x0, sp, x1", [0, 8]), 0)).toBe(BigInt(STACK_TOP + 8));
    expect(x(fn("  add x0, sp, w1", [0, 0xffffffff]), 0)).toBe(BigInt(STACK_TOP) + M32);
    expect(fn("  cmp sp, 0").final.flags.c).toBe(true);
  });

  it("an add that writes sp does not touch the flags", () => {
    const r = fn("  sub sp, sp, 16\n  add sp, sp, 16", [], { flags: flagsOf("1010") });
    expect(flagBits(r.final.flags)).toBe("1010");
  });
});

describe("the flags of an addition", () => {
  // [a, b, width, "nzcv"]
  it.each([
    [1n, 1n, 64, "0000"],
    [0n, 0n, 64, "0100"],
    [MASK64, 1n, 64, "0110"],
    [0x7fffffffffffffffn, 1n, 64, "1001"],
    [0x8000000000000000n, 0x8000000000000000n, 64, "0111"],
    [0x8000000000000000n, MASK64, 64, "0011"],
    [MASK64, MASK64, 64, "1010"],
    [0x7fffffffn, 1n, 32, "1001"],
    [0xffffffffn, 1n, 32, "0110"],
    [0x80000000n, 0x80000000n, 32, "0111"],
    // The top bit of a w operation is bit 31, whatever is above it.
    [0xffffffffn, 0xffffffffn, 64, "0000"],
    [0x1ffffffffn, 1n, 32, "0110"],
  ] as [bigint, bigint, 32 | 64, string][])("adds %x + %x at %i bits", (a, b, w, want) => {
    const r = fn(`  adds ${w === 64 ? "x2, x0, x1" : "w2, w0, w1"}`, [a, b]);
    expect(flagBits(r.final.flags)).toBe(want);
    const cmn = fn(`  cmn ${w === 64 ? "x0, x1" : "w0, w1"}`, [a, b]);
    expect(flagBits(cmn.final.flags)).toBe(want);
    expect(x(cmn, 2)).toBe(0n);
  });
});

describe("the flags of a subtraction", () => {
  // C is 1 when there was no borrow.
  it.each([
    [5n, 3n, 64, "0010"],
    [3n, 5n, 64, "1000"],
    [5n, 5n, 64, "0110"],
    [0n, 0n, 64, "0110"],
    [0x8000000000000000n, 1n, 64, "0011"],
    [0n, 0x8000000000000000n, 64, "1001"],
    [0x7fffffffffffffffn, MASK64, 64, "1001"],
    [MASK64, 1n, 64, "1010"],
    [0x80000000n, 1n, 32, "0011"],
    [0n, 0x80000000n, 32, "1001"],
    [1n, 2n, 32, "1000"],
    [0x100000000n, 0n, 32, "0110"],
  ] as [bigint, bigint, 32 | 64, string][])("cmp %x, %x at %i bits", (a, b, w, want) => {
    expect(flagBits(fn(`  cmp ${w === 64 ? "x0, x1" : "w0, w1"}`, [a, b]).final.flags)).toBe(want);
    expect(
      flagBits(fn(`  subs ${w === 64 ? "x2, x0, x1" : "w2, w0, w1"}`, [a, b]).final.flags),
    ).toBe(want);
  });

  it("negs is a subtraction from zero", () => {
    expect(flagBits(fn("  negs x1, x0", [0]).final.flags)).toBe("0110");
    expect(flagBits(fn("  negs x1, x0", [1]).final.flags)).toBe("1000");
    expect(flagBits(fn("  negs x1, x0", [0x8000000000000000n]).final.flags)).toBe("1001");
    expect(flagBits(fn("  negs w1, w0", [0x80000000]).final.flags)).toBe("1001");
    expect(x(fn("  negs w1, w0", [1]), 1)).toBe(M32);
  });

  it("an immediate that is negative swaps add and subtract", () => {
    expect(flagBits(fn("  cmp w0, -5", [0xfffffffb]).final.flags)).toBe(
      flagBits(fn("  cmn w0, 5", [0xfffffffb]).final.flags),
    );
    expect(flagBits(fn("  adds w1, w0, -1", [1]).final.flags)).toBe("0110");
  });
});

describe("only some instructions change the flags", () => {
  const preset = "1010";
  it.each([
    "add x2, x0, x1",
    "sub x2, x0, x1",
    "and x2, x0, x1",
    "orr x2, x0, 0xff",
    "eor x2, x0, x1",
    "bic x2, x0, x1",
    "orn x2, x0, x1",
    "eon x2, x0, x1",
    "mvn x2, x1",
    "neg x2, x1",
    "mov x2, x1",
    "movz x2, 1",
    "lsl x2, x0, 3",
    "lsr x2, x0, x1",
    "asr w2, w0, w1",
    "ror x2, x0, 5",
    "ubfx x2, x0, 4, 8",
    "sxtw x2, w0",
    "csel x2, x0, x1, eq",
    "cset w2, lt",
    "mul x2, x0, x1",
    "madd x2, x0, x1, x0",
    "smulh x2, x0, x1",
    "sdiv x2, x0, x1",
    "udiv w2, w0, w1",
    "adrp x2, f",
    "adr x2, f",
    "nop",
  ])("%s", (line) => {
    const r = fn(`  ${line}`, [7, 3], { flags: flagsOf(preset) });
    expect(flagBits(r.final.flags)).toBe(preset);
  });
});

describe("the carry into every bit", () => {
  it("records an addition", () => {
    const r = fn("  add x2, x0, x1", [0xf, 1]);
    const add = r.steps[0]?.addition;
    expect(add).toMatchObject({
      width: 64,
      a: 0xfn,
      b: 1n,
      carryIn: 0,
      carryOut: 0,
      result: 0x10n,
    });
    // 1111 + 0001: carries into bits 1, 2, 3 and 4.
    expect(add?.carries).toBe(0b11110n);
    expect(add?.subtraction).toBe(false);
  });

  it("records a subtraction as a + NOT b + 1", () => {
    const r = fn("  sub w2, w0, w1", [5, 3]);
    const add = r.steps[0]?.addition;
    expect(add).toMatchObject({
      width: 32,
      a: 5n,
      b: 0xfffffffcn,
      carryIn: 1,
      carryOut: 1,
      result: 2n,
      subtraction: true,
    });
    // The carry into bit 0 is the 1 that was added.
    expect(add && add.carries & 1n).toBe(1n);
  });

  it("the carry into the top bit and out of it decide V", () => {
    const r = fn("  adds x2, x0, x1", [0x7fffffffffffffffn, 1n]);
    const add = r.steps[0]?.addition;
    expect(((add?.carries ?? 0n) >> 63n) & 1n).toBe(1n);
    expect(add?.carryOut).toBe(0);
    expect(r.final.flags.v).toBe(true);
  });

  it("a w addition has 32 bits and ignores the top half", () => {
    const r = fn("  add w2, w0, w1", [0xffffffffn, 0xffffffffn]);
    const add = r.steps[0]?.addition;
    expect(add?.width).toBe(32);
    expect(add?.carryOut).toBe(1);
    expect(add?.result).toBe(0xfffffffen);
    expect((add?.carries ?? 0n) >> 32n).toBe(0n);
  });

  it("records the shifted or extended second number as it was added", () => {
    const r = fn("  add x2, x0, w1, sxtw 1", [1, 0xffffffff]);
    expect(r.steps[0]?.addition?.b).toBe(MASK64 - 1n);
  });

  it("other instructions record none", () => {
    expect(fn("  and x2, x0, x1", [1, 1]).steps[0]?.addition).toBeNull();
    expect(fn("  mul x2, x0, x1", [1, 1]).steps[0]?.addition).toBeNull();
  });
});

describe("logical instructions", () => {
  it.each([
    ["and x0, x1, 0xff", [0x1234], 0x34n],
    ["and w0, w1, 0xff00ff00", [0xffffffff], 0xff00ff00n],
    ["orr x0, x1, 0x8000000000000000", [1], 0x8000000000000001n],
    ["eor x0, x1, -2", [0xff], MASK64 - 0xfen],
    ["bic x0, x1, 0xff", [0x1234], 0x1200n],
    ["bic w0, w1, 255", [0xffffffff], 0xffffff00n],
    ["and x0, x1, x2", [0xf0f0, 0xff00], 0xf000n],
    ["orr x0, x1, x2, lsl 4", [1, 1], 17n],
    ["eor x0, x1, x2, lsr 4", [0xff, 0xf0], 0xf0n],
    ["and x0, x1, x2, ror 8", [MASK64, 0xff], 0xff00000000000000n],
    ["and w0, w1, w2, ror 8", [M32, 0xff], 0xff000000n],
    ["bic x0, x1, x2", [0xff, 0x0f], 0xf0n],
    ["orn x0, x1, x2", [0, 0xff], MASK64 - 0xffn],
    ["eon x0, x1, x2", [0xff, 0xff], MASK64],
    ["mvn x0, x1", [0], MASK64],
    ["mvn w0, w1", [0], M32],
    ["mvn x0, x1, lsl 4", [1], MASK64 - 0x10n],
  ] as [string, Arg[], bigint][])("%s", (line, args, want) => {
    expect(x(fn(`  ${line}`, [0, ...args]), 0)).toBe(want);
  });

  it("the flags of ands, bics and tst: N and Z from the result, C and V cleared", () => {
    expect(flagBits(fn("  ands x2, x0, x1", [0x8000000000000000n, MASK64]).final.flags)).toBe(
      "1000",
    );
    expect(flagBits(fn("  ands x2, x0, x1", [1, 2]).final.flags)).toBe("0100");
    expect(flagBits(fn("  tst x0, x1", [3, 1]).final.flags)).toBe("0000");
    expect(flagBits(fn("  tst w0, w1", [0x100000000n, M32]).final.flags)).toBe("0100");
    expect(flagBits(fn("  bics x2, x0, x1", [0xff, 0xff]).final.flags)).toBe("0100");
    expect(flagBits(fn("  bics w2, w0, w1", [0x80000000, 0]).final.flags)).toBe("1000");
    // C and V that were set are cleared.
    expect(flagBits(fn("  tst x0, x1", [1, 1], { flags: flagsOf("0011") }).final.flags)).toBe(
      "0000",
    );
    expect(flagBits(fn("  ands x2, x0, 1", [1], { flags: flagsOf("1111") }).final.flags)).toBe(
      "0000",
    );
  });

  it("and can write sp; ands cannot", () => {
    const r = fn(
      "  mov x9, sp\n  and sp, x0, 0xfffffffffffffff0\n  mov x1, sp\n  mov sp, x9",
      [0x430123],
    );
    expect(x(r, 1)).toBe(0x430120n);
  });
});
