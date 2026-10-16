// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { DATA_BASE, RETURN_ADDRESS, TEXT_BASE } from "./layout.ts";
import { message } from "./strings.ts";
import { exec, fn, x, type Arg } from "./testing.ts";

describe("branches", () => {
  it("b jumps, bl links, ret returns", () => {
    const r = exec(
      "f:\n  mov x9, x30\n  bl g\n  add x0, x0, 1\n  mov x30, x9\n  ret\ng:\n  mov x0, 41\n  ret",
    );
    expect(x(r, 0)).toBe(42n);
    expect(r.stop.kind).toBe("returned");
    const jump = exec("f:\n  b skip\n  mov x0, 1\nskip:\n  add x0, x0, 2\n  ret");
    expect(x(jump, 0)).toBe(2n);
  });

  it("bl writes the address of the next instruction to x30", () => {
    const r = exec("f:\n  mov x9, x30\n  bl g\n  mov x30, x9\n  ret\ng:\n  mov x0, x30\n  ret");
    expect(x(r, 0)).toBe(BigInt(TEXT_BASE + 8));
  });

  it("br and blr go to a register; ret can use another register", () => {
    const r = exec("f:\n  adr x1, g\n  br x1\n  mov x0, 1\ng:\n  mov x0, 2\n  ret");
    expect(x(r, 0)).toBe(2n);
    const c = exec(
      "f:\n  mov x9, x30\n  adr x1, g\n  blr x1\n  mov x30, x9\n  ret\ng:\n  mov x0, x30\n  ret",
    );
    expect(x(c, 0)).toBe(BigInt(TEXT_BASE + 12));
    const other = exec("f:\n  mov x1, x30\n  mov x30, 0\n  ret x1");
    expect(other.stop.kind).toBe("returned");
    const blrLink = exec(
      "f:\n  mov x9, x30\n  adr x30, g\n  blr x30\n  mov x30, x9\n  ret\ng:\n  mov x0, x30\n  ret",
    );
    expect(x(blrLink, 0)).toBe(BigInt(TEXT_BASE + 12));
  });

  it("a return ends the run when it reaches the return address, and a b to it does too", () => {
    const r = exec("f:\n  mov x0, 5\n  mov x1, 0x440000\n  br x1");
    expect(r.stop.kind).toBe("returned");
    expect(r.final.pc).toBe(RETURN_ADDRESS);
  });

  it("conditional branches follow the flags", () => {
    const src = "f:\n  cmp x0, x1\n  b.lt less\n  mov x2, 0\n  ret\nless:\n  mov x2, 1\n  ret";
    expect(x(exec(src, [1, 2]), 2)).toBe(1n);
    expect(x(exec(src, [2, 1]), 2)).toBe(0n);
    expect(x(exec(src, [-1, 1]), 2)).toBe(1n);
    // The GCC spelling.
    expect(x(exec(src.replace("b.lt", "blt"), [-1, 1]), 2)).toBe(1n);
    // The same bits, read as unsigned.
    expect(x(exec(src.replace("b.lt", "b.lo"), [-1, 1]), 2)).toBe(0n);
    expect(x(exec(src.replace("b.lt", "blo"), [1, 2]), 2)).toBe(1n);
  });

  it("cbz and cbnz test the register at its width", () => {
    const z = "f:\n  cbz x0, zero\n  mov x1, 1\n  ret\nzero:\n  mov x1, 0\n  ret";
    expect(x(exec(z, [0]), 1)).toBe(0n);
    expect(x(exec(z, [1]), 1)).toBe(1n);
    // The low half is zero but the whole register is not.
    expect(x(exec(z, [0x100000000n]), 1)).toBe(1n);
    expect(x(exec(z.replace("cbz x0", "cbz w0"), [0x100000000n]), 1)).toBe(0n);
    expect(x(exec(z.replace("cbz", "cbnz"), [3]), 1)).toBe(0n);
    expect(x(exec(z.replace("cbz x0", "cbz xzr"), [3]), 1)).toBe(0n);
  });

  it("tbz and tbnz test one bit", () => {
    const t = (bit: number, value: Arg, op = "tbz"): bigint =>
      x(
        exec(`f:\n  ${op} x0, ${bit}, hit\n  mov x1, 1\n  ret\nhit:\n  mov x1, 2\n  ret`, [value]),
        1,
      );
    expect(t(0, 1)).toBe(1n);
    expect(t(0, 2)).toBe(2n);
    expect(t(63, 0x8000000000000000n)).toBe(1n);
    expect(t(32, 0x100000000n)).toBe(1n);
    expect(t(32, 0xffffffffn)).toBe(2n);
    expect(t(5, 0x20, "tbnz")).toBe(2n);
    expect(t(5, 0, "tbnz")).toBe(1n);
    expect(
      x(
        exec("f:\n  tbnz w0, 31, hit\n  mov x1, 1\n  ret\nhit:\n  mov x1, 2\n  ret", [0x80000000]),
        1,
      ),
    ).toBe(2n);
  });

  it("a loop", () => {
    const r = exec(
      "f:\n  mov x1, 0\nloop:\n  add x1, x1, x0\n  subs x0, x0, 1\n  b.ne loop\n  mov x0, x1\n  ret",
      [10],
    );
    expect(x(r, 0)).toBe(55n);
    expect(r.steps).toHaveLength(1 + 3 * 10 + 2);
  });

  it("conditional branches do not change the flags or any register", () => {
    const r = exec("f:\n  cmp x0, x0\n  b.eq next\nnext:\n  ret", [3]);
    expect(r.steps[1]?.writes).toEqual([]);
    expect(r.steps[1]?.flagsAfter).toEqual(r.steps[1]?.flagsBefore);
  });
});

describe("addresses", () => {
  it("adr gives the address of a label, adrp its page", () => {
    const r = exec(
      "f:\n  adr x0, f\n  adr x1, other\n  adrp x2, other\n  adrp x3, d\n  add x4, x3, :lo12:d\n  adr x5, .\n  ret\nother:\n  nop\n  .data\n  .balign 8\n  .zero 8\nd: .quad 1",
    );
    expect(x(r, 0)).toBe(BigInt(TEXT_BASE));
    expect(x(r, 1)).toBe(BigInt(TEXT_BASE + 28));
    expect(x(r, 2)).toBe(BigInt(TEXT_BASE));
    expect(x(r, 3)).toBe(BigInt(DATA_BASE));
    expect(x(r, 4)).toBe(BigInt(DATA_BASE + 8));
    expect(x(r, 5)).toBe(BigInt(TEXT_BASE + 20));
  });

  it("a plain number is how far from this instruction", () => {
    const r = exec("f:\n  adr x0, 8\n  adrp x1, 0x1000\n  adr x2, -4\n  ret");
    expect(x(r, 0)).toBe(BigInt(TEXT_BASE + 8));
    expect(x(r, 1)).toBe(BigInt((TEXT_BASE + 4 + 0x1000) & ~0xfff));
    expect(x(r, 2)).toBe(BigInt(TEXT_BASE + 8 - 4));
  });

  it("a global is reached by adrp and :lo12:, in an add and in a load", () => {
    const src =
      "f:\n  adrp x1, v\n  ldr x0, [x1, :lo12:v]\n  adrp x2, v\n  add x2, x2, :lo12:v\n  ldr x3, [x2]\n  ldrb w4, [x2, 1]\n  ret\n  .data\n  .balign 8\nv: .quad 0x1122334455667788";
    const r = exec(src);
    expect(x(r, 0)).toBe(0x1122334455667788n);
    expect(x(r, 3)).toBe(0x1122334455667788n);
    expect(x(r, 4)).toBe(0x77n);
    expect(r.stop.kind).toBe("returned");
  });

  it("stores through :lo12: change the data", () => {
    const r = exec(
      "f:\n  adrp x1, v\n  str w0, [x1, :lo12:v]\n  ret\n  .data\nv: .word 0",
      [0xabcd],
    );
    expect(r.read(DATA_BASE, 4)).toEqual(new Uint8Array([0xcd, 0xab, 0, 0]));
  });
});

describe("what the learner reads when a run stops", () => {
  it("each fault has a sentence that names the line and the address", () => {
    const load = exec("f:\n  nop\n  ldr x1, [x0]\n  ret", [0x1234]);
    if (load.stop.kind !== "fault") throw new Error("expected a fault");
    const s = message(load.stop.key, load.stop.params);
    expect(s).toContain("Line 3");
    expect(s).toContain("0x1234");
    expect(s).toContain("ldr x1, [x0]");
    const jump = exec("f:\n  mov x1, 0x500000\n  br x1");
    if (jump.stop.kind !== "fault") throw new Error("expected a fault");
    const t = message(jump.stop.key, jump.stop.params);
    expect(t).toContain("0x500000");
    expect(t).toContain("br x1");
    expect(message("stop.limit", { steps: 10000 })).toContain("10000");
    expect(message("stop.returned")).toMatch(/returned/);
  });

  it("an undefined label is not a run's fault but the assembler's", () => {
    expect(() => fn("  b nowhere")).toThrow();
  });
});
