// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { DATA_BASE, RETURN_ADDRESS, STACK_BASE, STACK_TOP, TEXT_BASE } from "./layout.ts";
import { run, stateAfter } from "./run.ts";
import { message } from "./strings.ts";
import { MASK64, build, exec, flagBits, flagsOf, x, type Arg } from "./testing.ts";

const BYTES = Array.from({ length: 32 }, (_, i) => (i * 17 + 0x81) & 0xff);

/** A function `f` with x1 pointing at 32 bytes of data, and the data. */
function withBuf(body: string, args: Arg[] = [], extra = "") {
  const src = `f:\n  adrp x1, buf\n  add x1, x1, :lo12:buf\n${body}\n  ret\n  .data\nbuf:\n  .byte ${BYTES.join(", ")}\n${extra}`;
  return exec(src, args);
}

const le = (bytes: number[]): bigint => bytes.reduceRight((acc, b) => (acc << 8n) | BigInt(b), 0n);

describe("loads", () => {
  it("every size, little-endian, zero-extended", () => {
    const r = withBuf(
      "  ldr x2, [x1]\n  ldr w3, [x1, 8]\n  ldrb w4, [x1, 3]\n  ldrh w5, [x1, 6]\n  ldr x6, [x1, 16]",
    );
    expect(x(r, 2)).toBe(le(BYTES.slice(0, 8)));
    expect(x(r, 3)).toBe(le(BYTES.slice(8, 12)));
    expect(x(r, 4)).toBe(BigInt(BYTES[3] as number));
    expect(x(r, 5)).toBe(le(BYTES.slice(6, 8)));
    expect(x(r, 6)).toBe(le(BYTES.slice(16, 24)));
  });

  it("a load into a w register clears the top half", () => {
    const r = withBuf(
      "  mov x2, -1\n  ldr w2, [x1]\n  mov x3, -1\n  ldrb w3, [x1]\n  mov x4, -1\n  ldrh w4, [x1]",
    );
    expect(x(r, 2)).toBe(le(BYTES.slice(0, 4)));
    expect(x(r, 3)).toBe(BigInt(BYTES[0] as number));
    expect(x(r, 4)).toBe(le(BYTES.slice(0, 2)));
  });

  it("sign-extends ldrsb, ldrsh and ldrsw", () => {
    // BYTES[0] is 0x81, BYTES[1] is 0x92: both negative as bytes.
    const r = withBuf(
      "  ldrsb w2, [x1]\n  ldrsb x3, [x1]\n  ldrsh w4, [x1]\n  ldrsh x5, [x1]\n  ldrsw x6, [x1]\n  ldrsb x7, [x1, 4]",
    );
    expect(x(r, 2)).toBe(0xffffff81n);
    expect(x(r, 3)).toBe(MASK64 - 0x7en);
    expect(x(r, 4)).toBe(BigInt.asUintN(32, BigInt.asIntN(16, le(BYTES.slice(0, 2)))));
    expect(x(r, 5)).toBe(BigInt.asUintN(64, BigInt.asIntN(16, le(BYTES.slice(0, 2)))));
    expect(x(r, 6)).toBe(BigInt.asUintN(64, BigInt.asIntN(32, le(BYTES.slice(0, 4)))));
    expect(x(r, 7)).toBe(
      BYTES[4]! < 0x80 ? BigInt(BYTES[4]!) : BigInt.asUintN(64, BigInt(BYTES[4]! - 256)),
    );
  });

  it("unaligned addresses work, and so does the unscaled offset", () => {
    const r = withBuf(
      "  ldr x2, [x1, 1]\n  ldr w3, [x1, 3]\n  ldur x4, [x1, 5]\n  ldrh w5, [x1, 7]",
    );
    expect(x(r, 2)).toBe(le(BYTES.slice(1, 9)));
    expect(x(r, 3)).toBe(le(BYTES.slice(3, 7)));
    expect(x(r, 4)).toBe(le(BYTES.slice(5, 13)));
    expect(x(r, 5)).toBe(le(BYTES.slice(7, 9)));
  });

  it("a load into the zero register still reads", () => {
    const r = withBuf("  ldr xzr, [x1]");
    expect(r.steps[2]?.loads).toEqual([{ address: DATA_BASE, size: 8 }]);
  });
});

describe("addressing modes", () => {
  it("pre-index adds first and writes the base back", () => {
    const r = withBuf("  ldr x2, [x1, 8]!\n  mov x3, x1");
    expect(x(r, 2)).toBe(le(BYTES.slice(8, 16)));
    expect(x(r, 3)).toBe(BigInt(DATA_BASE + 8));
  });

  it("post-index uses the base and then adds", () => {
    const r = withBuf("  ldr x2, [x1], 8\n  mov x3, x1\n  ldrb w4, [x1], -1\n  mov x5, x1");
    expect(x(r, 2)).toBe(le(BYTES.slice(0, 8)));
    expect(x(r, 3)).toBe(BigInt(DATA_BASE + 8));
    expect(x(r, 4)).toBe(BigInt(BYTES[8] as number));
    expect(x(r, 5)).toBe(BigInt(DATA_BASE + 7));
  });

  it("a writeback is a second register write in the trace", () => {
    const r = withBuf("  ldr x2, [x1, 8]!");
    const step = r.steps[2] as (typeof r.steps)[number];
    expect(step.writes.map((w) => w.reg)).toEqual([2, 1]);
    expect(step.writes[1]).toEqual({
      reg: 1,
      before: BigInt(DATA_BASE),
      after: BigInt(DATA_BASE + 8),
    });
  });

  it("a register offset, with lsl, uxtw and sxtw", () => {
    const r = withBuf(
      "  mov x2, 3\n  ldrb w3, [x1, x2]\n  ldrh w4, [x1, x2, lsl 1]\n  ldr w5, [x1, x2, lsl 2]\n  mov w6, 5\n  ldrb w7, [x1, w6, uxtw]\n  mov w8, -2\n  add x9, x1, 16\n  ldrb w10, [x9, w8, sxtw]\n  mov x13, -2\n  ldrb w11, [x9, x13, sxtx]\n  ldr w12, [x9, w8, sxtw 2]",
    );
    expect(x(r, 3)).toBe(BigInt(BYTES[3] as number));
    expect(x(r, 4)).toBe(le(BYTES.slice(6, 8)));
    expect(x(r, 5)).toBe(le(BYTES.slice(12, 16)));
    expect(x(r, 7)).toBe(BigInt(BYTES[5] as number));
    // w8 is 0xfffffffe: sign-extended it is -2; as an unsigned 64-bit value it is not.
    expect(x(r, 10)).toBe(BigInt(BYTES[14] as number));
    expect(x(r, 11)).toBe(BigInt(BYTES[14] as number));
    expect(x(r, 12)).toBe(le(BYTES.slice(8, 12)));
  });

  it("uxtw does not sign-extend", () => {
    const r = withBuf("  mov w2, -1\n  add x3, x1, 0\n  ldrb w4, [x3, w2, uxtw]");
    expect(r.stop.kind).toBe("fault");
  });

  it("negative and large unscaled offsets", () => {
    const r = withBuf(
      "  add x2, x1, 16\n  ldur x3, [x2, -8]\n  ldur w4, [x2, 12]\n  ldr x5, [x2, -16]",
    );
    expect(x(r, 3)).toBe(le(BYTES.slice(8, 16)));
    expect(x(r, 4)).toBe(le(BYTES.slice(28, 32)));
    expect(x(r, 5)).toBe(le(BYTES.slice(0, 8)));
  });
});

describe("stores", () => {
  it("every size, and what changed is in the trace", () => {
    const r = withBuf(
      "  movz x2, 0x1122, lsl 48\n  movk x2, 0x3344, lsl 32\n  movk x2, 0x5566, lsl 16\n  movk x2, 0x7788\n  str x2, [x1]\n  str w2, [x1, 8]\n  strh w2, [x1, 12]\n  strb w2, [x1, 14]\n  str xzr, [x1, 16]",
    );
    expect(r.stop.kind).toBe("returned");
    const mem = r.read(DATA_BASE, 24) as Uint8Array;
    expect([...mem.slice(0, 8)]).toEqual([0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11]);
    expect([...mem.slice(8, 12)]).toEqual([0x88, 0x77, 0x66, 0x55]);
    expect([...mem.slice(12, 14)]).toEqual([0x88, 0x77]);
    expect(mem[14]).toBe(0x88);
    expect([...mem.slice(16, 24)]).toEqual(new Array(8).fill(0));
    const store = r.steps.find((s) => s.text === "strb w2, [x1, 14]");
    expect(store?.stores).toEqual([
      { address: DATA_BASE + 14, before: [BYTES[14]], after: [0x88] },
    ]);
    const first = r.steps.find((s) => s.text === "str x2, [x1]");
    expect(first?.stores[0]?.before).toEqual(BYTES.slice(0, 8));
    expect(first?.stores[0]?.after).toEqual([0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11]);
  });

  it("a store changes no register unless it writes back", () => {
    const r = withBuf("  str x1, [x1]");
    expect(r.steps[2]?.writes).toEqual([]);
    const w = withBuf("  str x1, [x1, 8]!");
    expect(w.steps[2]?.writes.map((a) => a.reg)).toEqual([1]);
  });

  it("a store to the stack", () => {
    const r = exec("f:\n  str x0, [sp, -16]!\n  ldr x1, [sp]\n  add sp, sp, 16\n  ret", [0x1234]);
    expect(x(r, 1)).toBe(0x1234n);
    expect(r.final.sp).toBe(BigInt(STACK_TOP));
    expect(r.steps[0]?.stores[0]?.address).toBe(STACK_TOP - 16);
  });

  it("the final memory can be read back", () => {
    const r = withBuf("  mov x2, 0x41\n  strb w2, [x1, 31]");
    expect(r.read(DATA_BASE + 31, 1)).toEqual(new Uint8Array([0x41]));
    expect(r.read(0, 4)).toBeUndefined();
  });
});

describe("pairs", () => {
  it("ldp and stp, in every mode", () => {
    const r = withBuf(
      "  ldp x2, x3, [x1]\n  ldp w4, w5, [x1, 8]\n  ldp x6, x7, [x1, 16]!\n  mov x8, x1\n  ldp x9, x10, [x1], -16\n  mov x11, x1\n  stp x2, x3, [x1, 8]\n  stp w4, w5, [x1, 24]!\n  mov x12, x1",
    );
    expect(x(r, 2)).toBe(le(BYTES.slice(0, 8)));
    expect(x(r, 3)).toBe(le(BYTES.slice(8, 16)));
    expect(x(r, 4)).toBe(le(BYTES.slice(8, 12)));
    expect(x(r, 5)).toBe(le(BYTES.slice(12, 16)));
    expect(x(r, 6)).toBe(le(BYTES.slice(16, 24)));
    expect(x(r, 7)).toBe(le(BYTES.slice(24, 32)));
    expect(x(r, 8)).toBe(BigInt(DATA_BASE + 16));
    expect(x(r, 9)).toBe(le(BYTES.slice(16, 24)));
    expect(x(r, 11)).toBe(BigInt(DATA_BASE));
    expect(x(r, 12)).toBe(BigInt(DATA_BASE + 24));
  });

  it("a pair store with the zero register", () => {
    const r = withBuf("  stp xzr, xzr, [x1]");
    expect([...(r.read(DATA_BASE, 16) as Uint8Array)]).toEqual(new Array(16).fill(0));
    expect(r.steps[2]?.stores).toHaveLength(2);
  });

  it("the frame of a function: stp x29, x30 and ldp", () => {
    const r = exec(
      "f:\n  stp x29, x30, [sp, -16]!\n  mov x29, sp\n  bl g\n  ldp x29, x30, [sp], 16\n  ret\ng:\n  mov x0, 7\n  ret",
    );
    expect(x(r, 0)).toBe(7n);
    expect(r.stop.kind).toBe("returned");
    expect(r.final.sp).toBe(BigInt(STACK_TOP));
    expect(r.final.x[30]).toBe(BigInt(RETURN_ADDRESS));
  });
});

describe("faults", () => {
  const fault = (src: string, args: Arg[] = []) => {
    const r = exec(src, args);
    expect(r.stop.kind).toBe("fault");
    return r.stop.kind === "fault" ? r.stop : (null as never);
  };

  it("an address outside every region", () => {
    const s = fault("f:\n  ldr x1, [x0]\n  ret", [0]);
    expect(s.key).toBe("fault.address");
    expect(s.params).toMatchObject({ address: "0x0", line: 2, text: "ldr x1, [x0]" });
    expect(fault("f:\n  str x1, [x0]\n  ret", [0x500000]).key).toBe("fault.address");
    expect(fault("f:\n  ldrb w1, [x0]\n  ret", [STACK_TOP]).key).toBe("fault.address");
    expect(fault("f:\n  ldrb w1, [x0]\n  ret", [STACK_BASE - 1]).key).toBe("fault.address");
  });

  it("the edges of the stack", () => {
    expect(exec("f:\n  ldrb w1, [x0]\n  ret", [STACK_BASE]).stop.kind).toBe("returned");
    expect(exec("f:\n  ldrb w1, [x0]\n  ret", [STACK_TOP - 1]).stop.kind).toBe("returned");
    expect(exec("f:\n  ldr x1, [x0]\n  ret", [STACK_TOP - 8]).stop.kind).toBe("returned");
    // A read that starts inside and ends outside is outside.
    expect(fault("f:\n  ldr x1, [x0]\n  ret", [STACK_TOP - 4]).key).toBe("fault.address");
    expect(fault("f:\n  ldr x1, [x0]\n  ret", [STACK_BASE - 4]).key).toBe("fault.address");
  });

  it("no change is made by the instruction that faulted", () => {
    const r = exec("f:\n  mov x1, 5\n  str x1, [x0, 8]!\n  ret", [0]);
    expect(r.stop.kind).toBe("fault");
    expect(r.steps).toHaveLength(1);
    expect(r.final.x[0]).toBe(0n);
  });

  it("a store into the instructions", () => {
    const s = fault("f:\n  adr x1, f\n  str x0, [x1]\n  ret", [1]);
    expect(s.key).toBe("fault.storeText");
    expect(s.params.address).toBe("0x" + TEXT_BASE.toString(16));
  });

  it("a store into read-only data", () => {
    const s = fault(
      "f:\n  adrp x1, ro\n  add x1, x1, :lo12:ro\n  strb w0, [x1]\n  ret\n  .section .rodata\nro:\n  .byte 1",
    );
    expect(s.key).toBe("fault.storeRodata");
    const ok = exec(
      "f:\n  adrp x1, ro\n  ldrb w0, [x1, :lo12:ro]\n  ret\n  .section .rodata\nro:\n  .byte 9",
    );
    expect(x(ok, 0)).toBe(9n);
  });

  it("a read of an instruction", () => {
    expect(fault("f:\n  adr x1, f\n  ldr w0, [x1]\n  ret").key).toBe("fault.readInstruction");
    // Data inside the text section can be read.
    const ok = exec("f:\n  adr x1, k\n  ldr w0, [x1]\n  ret\nk:\n  .word 0xcafe");
    expect(x(ok, 0)).toBe(0xcafen);
  });

  it("a branch to an address that is not an instruction", () => {
    const s = fault("f:\n  mov x1, 0x500000\n  br x1");
    expect(s.key).toBe("fault.notInstruction");
    expect(s.params).toMatchObject({ address: "0x500000", line: 3 });
    expect(fault("f:\n  adr x1, f\n  add x1, x1, 2\n  br x1").key).toBe("fault.notInstruction");
    // Running off the end of the text is its own message: see the next test.
    // A ret to a garbage link register.
    expect(fault("f:\n  mov x30, 0\n  ret").key).toBe("fault.notInstruction");
    // A branch into data inside text.
    expect(fault("f:\n  b k\nk:\n  .word 1").key).toBe("fault.notInstruction");
  });

  it("a run that falls off the end of the instructions names the last instruction, not an address", () => {
    const s = fault("f:\n  nop\n  add w0, w0, w1");
    expect(s.key).toBe("fault.ranOffEnd");
    expect(s.params).toEqual({ line: 3, text: "add w0, w0, w1" });
    expect(message(s.key, s.params)).toBe(
      "The run reached the end of the instructions without a `ret`. The last instruction it ran was line 3, `add w0, w0, w1`.",
    );
    expect(message(s.key, s.params)).not.toMatch(/0x/);
    // A branch, or a return, to a bad place keeps the address.
    expect(fault("f:\n  b k\nk:\n  .word 1").key).toBe("fault.notInstruction");
    expect(fault("f:\n  mov x30, 0\n  ret").key).toBe("fault.notInstruction");
    // Falling into data is falling off the end of the instructions.
    expect(fault("f:\n  nop\nk:\n  .word 1").key).toBe("fault.ranOffEnd");
  });

  it("a call that starts where there is no instruction", () => {
    const p = build("f:\n  ret");
    const r = run(p, { entry: 0x500000 });
    expect(r.stop).toMatchObject({ kind: "fault", key: "fault.entry" });
  });

  it("the step limit", () => {
    const r = exec("f:\n  b f", [], {});
    expect(r.stop).toEqual({ kind: "limit", steps: 10000 });
    expect(r.steps).toHaveLength(10000);
    const small = exec("f:\nloop:\n  add x0, x0, 1\n  b loop", [], { maxSteps: 7 });
    expect(small.stop).toEqual({ kind: "limit", steps: 7 });
    expect(x(small, 0)).toBe(4n);
    // A run that returns in exactly the limit is a return, not a stop.
    expect(exec("f:\n  nop\n  nop\n  ret", [], { maxSteps: 3 }).stop.kind).toBe("returned");
    expect(exec("f:\n  nop\n  nop\n  ret", [], { maxSteps: 2 }).stop.kind).toBe("limit");
  });
});

describe("the stack pointer mark", () => {
  const marks = (src: string, args: Arg[] = []) => exec(src, args).steps.map((s) => s.spMisaligned);

  it("is set at a memory access through sp when sp is not a multiple of 16", () => {
    expect(marks("f:\n  sub sp, sp, 8\n  str x0, [sp]\n  add sp, sp, 8\n  ret")).toEqual([
      false,
      true,
      false,
      false,
    ]);
    expect(marks("f:\n  sub sp, sp, 8\n  ldr x1, [sp, -8]\n  add sp, sp, 8\n  ret")[1]).toBe(true);
    expect(marks("f:\n  sub sp, sp, 16\n  ldp x1, x2, [sp]\n  add sp, sp, 16\n  ret")[1]).toBe(
      false,
    );
  });

  it("is set at a call", () => {
    const r = marks(
      "f:\n  sub sp, sp, 8\n  mov x9, x30\n  bl g\n  mov x30, x9\n  add sp, sp, 8\n  ret\ng:\n  ret",
    );
    expect(r).toEqual([false, false, true, false, false, false, false]);
    const blr = marks(
      "f:\n  sub sp, sp, 8\n  mov x9, x30\n  adr x10, g\n  blr x10\n  mov x30, x9\n  add sp, sp, 8\n  ret\ng:\n  ret",
    );
    expect(blr[3]).toBe(true);
  });

  it("is not set for an address in another register, or when sp is aligned", () => {
    const r = marks("f:\n  sub sp, sp, 8\n  mov x1, sp\n  ldr x2, [x1]\n  add sp, sp, 8\n  ret");
    expect(r.some(Boolean)).toBe(false);
    expect(
      marks(
        "f:\n  sub sp, sp, 32\n  str x0, [sp]\n  bl.skip\n".replace("  bl.skip\n", "") +
          "  add sp, sp, 32\n  ret",
      ).some(Boolean),
    ).toBe(false);
  });

  it("does not stop the run", () => {
    const r = exec(
      "f:\n  sub sp, sp, 8\n  str x0, [sp]\n  ldr x1, [sp]\n  add sp, sp, 8\n  ret",
      [5],
    );
    expect(r.stop.kind).toBe("returned");
    expect(x(r, 1)).toBe(5n);
  });
});

describe("the trace", () => {
  it("records addresses, lines, text, flags and the registers written", () => {
    const r = exec("f:\n  mov x1, 5\n  cmp x1, 5\n  cset w0, eq\n  ret", [], {});
    expect(r.steps.map((s) => [s.address, s.line, s.text])).toEqual([
      [TEXT_BASE, 2, "mov x1, 5"],
      [TEXT_BASE + 4, 3, "cmp x1, 5"],
      [TEXT_BASE + 8, 4, "cset w0, eq"],
      [TEXT_BASE + 12, 5, "ret"],
    ]);
    expect(r.steps[0]?.writes).toEqual([{ reg: 1, before: 0n, after: 5n }]);
    expect(flagBits(r.steps[1]?.flagsBefore ?? flagsOf("1111"))).toBe("0000");
    expect(flagBits(r.steps[1]?.flagsAfter ?? flagsOf("0000"))).toBe("0110");
    expect(r.steps[1]?.writes).toEqual([]);
    expect(r.steps[2]?.writes).toEqual([{ reg: 0, before: 0n, after: 1n }]);
    expect(r.steps.map((s) => s.index)).toEqual([0, 1, 2, 3]);
    expect(r.steps[3]?.nextPc).toBe(RETURN_ADDRESS);
  });

  it("records the branch taken, and where to", () => {
    const r = exec(
      "f:\n  mov x9, x30\n  cbz x0, skip\n  nop\nskip:\n  b.eq never\n  bl g\n  mov x30, x9\n  ret\ng:\n  ret\nnever:\n  ret",
      [0],
    );
    expect(r.steps[1]?.branch).toEqual({ taken: true, target: TEXT_BASE + 12 });
    expect(r.steps[2]?.branch).toEqual({ taken: false, target: TEXT_BASE + 32 });
    expect(r.steps[3]?.branch).toEqual({ taken: true, target: TEXT_BASE + 28 });
    expect(r.steps[3]?.writes).toEqual([
      { reg: 30, before: BigInt(RETURN_ADDRESS), after: BigInt(TEXT_BASE + 20) },
    ]);
    expect(r.steps[4]?.branch).toEqual({ taken: true, target: TEXT_BASE + 20 });
    expect(r.steps[6]?.branch).toEqual({ taken: true, target: RETURN_ADDRESS });
    expect(r.stop.kind).toBe("returned");
    expect(exec("f:\n  nop\n  ret").steps[0]?.branch).toBeNull();
  });

  it("stateAfter rebuilds the state at any step", () => {
    const p = build("f:\n  mov x1, 5\n  add x1, x1, 2\n  cmp x1, 7\n  ret");
    const r = run(p, { entry: "f" });
    expect(stateAfter(r, -1).x[1]).toBe(0n);
    expect(stateAfter(r, 0).x[1]).toBe(5n);
    expect(stateAfter(r, 1).x[1]).toBe(7n);
    expect(stateAfter(r, 2).flags.z).toBe(true);
    expect(stateAfter(r, 3).pc).toBe(RETURN_ADDRESS);
    expect(stateAfter(r, 3).x[1]).toBe(r.final.x[1]);
  });

  it("starts with sp at the top of the stack, x30 outside the program and the rest zero", () => {
    const r = exec("f:\n  ret", [7]);
    expect(r.initial.sp).toBe(BigInt(STACK_TOP));
    expect(r.initial.x[30]).toBe(BigInt(RETURN_ADDRESS));
    expect(r.initial.x[0]).toBe(7n);
    expect(r.initial.x.slice(1, 30).every((v) => v === 0n)).toBe(true);
    expect(r.initial.flags).toEqual({ n: false, z: false, c: false, v: false });
    expect(r.initial.pc).toBe(TEXT_BASE);
  });

  it("the call can name a label or an address, and set the flags and the return address", () => {
    const p = build("a:\n  ret\nb:\n  mov x0, 3\n  ret");
    expect(x(run(p, { entry: "b" }), 0)).toBe(3n);
    expect(x(run(p, { entry: TEXT_BASE + 4 }), 0)).toBe(3n);
    const r = run(p, { entry: "a", returnAddress: 0x460000 });
    expect(r.initial.x[30]).toBe(0x460000n);
    expect(run(p, { entry: "a", flags: flagsOf("1001") }).final.flags.n).toBe(true);
  });
});
