// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { assemble } from "./assemble.ts";
import { DATA_BASE, STACK_BASE, TEXT_BASE } from "./layout.ts";
import { message, strings, type MessageKey } from "./strings.ts";
import { build } from "./testing.ts";

/** The first error of a source: its key, line and column. */
function firstError(source: string, allowed?: Set<string>, introduced?: Set<string>) {
  const { errors, program } = assemble(source, allowed ? { allowed, introduced } : {});
  expect(program, `expected an error in: ${source}`).toBeNull();
  const e = errors[0];
  if (!e) throw new Error("no error");
  return e;
}

describe("a program", () => {
  it("has an address, a line, a text and parsed operands for each instruction", () => {
    const p = build(
      "// a comment\nf:\n  add x0, x1, #5   // five\n\n  ldr w2, [sp, 8]\n  b.ne f\n  ret",
    );
    expect(p.instructions.map((i) => [i.address, i.line, i.text])).toEqual([
      [TEXT_BASE, 3, "add x0, x1, #5"],
      [TEXT_BASE + 4, 5, "ldr w2, [sp, 8]"],
      [TEXT_BASE + 8, 6, "b.ne f"],
      [TEXT_BASE + 12, 7, "ret"],
    ]);
    const add = p.instructions[0];
    expect(add?.mnemonic).toBe("add");
    expect(add?.operands).toEqual([
      { kind: "reg", text: "x0", n: 0, width: 64, role: "general" },
      { kind: "reg", text: "x1", n: 1, width: 64, role: "general" },
      { kind: "imm", text: "#5", value: 5n },
    ]);
    expect(p.instructions[1]?.operands[1]).toMatchObject({
      kind: "mem",
      base: 31,
      mode: "offset",
      offset: 8n,
    });
    expect(p.instructions[2]?.operands).toEqual([{ kind: "label", text: "f", address: TEXT_BASE }]);
    expect(p.symbols.f).toEqual({ name: "f", address: TEXT_BASE, section: "text" });
    expect(p.source[2]).toBe("  add x0, x1, #5   // five");
  });

  it("parses conditions, shifts and registers by name", () => {
    const p = build("f:\n  csel w0, w1, wzr, ge\n  add x0, sp, w1, sxtw 2\n  mov x0, lr");
    expect(p.instructions[0]?.operands.map((o) => o.kind)).toEqual(["reg", "reg", "reg", "cond"]);
    expect(p.instructions[0]?.operands[2]).toMatchObject({ n: 31, role: "zero", width: 32 });
    expect(p.instructions[1]?.operands[3]).toEqual({
      kind: "shift",
      text: "sxtw 2",
      shift: "sxtw",
      amount: 2,
    });
    expect(p.instructions[2]?.operands[1]).toMatchObject({ n: 30 });
  });

  it("is laid out at the fixed addresses", () => {
    const p = build(
      `f:\n  ret\n  .data\nd1: .quad 1\n  .section .rodata\nr1: .byte 2\n  .bss\nb1: .zero 8\nd2: .word 0`,
    );
    expect(p.symbols.f?.address).toBe(TEXT_BASE);
    expect(p.symbols.d1?.address).toBe(DATA_BASE);
    expect(p.symbols.r1?.address).toBe(DATA_BASE + 8);
    expect(p.symbols.b1?.address).toBe(DATA_BASE + 9);
    expect(p.symbols.d2?.address).toBe(DATA_BASE + 17);
    expect(p.symbols.d1?.section).toBe("data");
    expect(p.symbols.r1?.section).toBe("rodata");
    expect(p.symbols.b1?.section).toBe("bss");
    expect(p.textEnd).toBe(TEXT_BASE + 4);
    expect(STACK_BASE).toBe(0x420000);
  });

  it("puts the data before the read-only data before the zero-filled data, whatever the source order", () => {
    const p = build(
      `.bss\nz: .zero 4\n.section .rodata\nr: .byte 1\n.data\nd: .byte 2\nf:\n.text\n  ret`,
    );
    expect(p.symbols.d?.address).toBeLessThan(p.symbols.r?.address ?? 0);
    expect(p.symbols.r?.address).toBeLessThan(p.symbols.z?.address ?? 0);
  });

  it("aligns each section to the largest alignment inside it", () => {
    const p = build(`.data\nd: .byte 1\n.section .rodata\n.balign 16\nr: .byte 2`);
    expect(p.symbols.d?.address).toBe(DATA_BASE);
    expect(p.symbols.r?.address).toBe(DATA_BASE + 16);
  });

  it("fills the bytes of every data directive, little-endian", () => {
    const p = build(
      `.data\n.byte 1, -1, 'A'\n.hword 0x1234\n.2byte -2\n.word 0xdeadbeef\n.4byte 7\n.quad 0x0102030405060708\n.8byte -1\n.ascii "a\\n\\t\\"\\\\\\101"\n.asciz "z"\n.string "p", "q"\n.zero 3\n.skip 2, 0xee`,
    );
    const data = p.sections.find((s) => s.kind === "data");
    expect([...(data?.bytes ?? [])]).toEqual([
      1, 255, 65, 0x34, 0x12, 0xfe, 0xff, 0xef, 0xbe, 0xad, 0xde, 7, 0, 0, 0, 8, 7, 6, 5, 4, 3, 2,
      1, 255, 255, 255, 255, 255, 255, 255, 255, 97, 10, 9, 34, 92, 65, 122, 0, 112, 0, 113, 0, 0,
      0, 0, 0xee, 0xee,
    ]);
  });

  it("puts the address of a label in a data word", () => {
    const p = build(`f:\n  ret\n.data\nx: .quad f\n.word x\n.hword f+2`);
    const data = p.sections.find((s) => s.kind === "data");
    const view = new DataView((data?.bytes ?? new Uint8Array(16)).buffer);
    expect(view.getBigUint64(0, true)).toBe(BigInt(TEXT_BASE));
    expect(view.getUint32(8, true)).toBe(DATA_BASE);
    expect(view.getUint16(12, true)).toBe((TEXT_BASE + 2) & 0xffff);
  });

  it("pads text with nops and data with zeros", () => {
    const p = build(
      `f:\n  ret\n  .align 4\ng:\n  ret\n  .data\n  .byte 1\n  .balign 8\nh: .byte 2\n  .p2align 2, 0xaa\ni: .byte 3`,
    );
    expect(p.symbols.g?.address).toBe(TEXT_BASE + 16);
    // The three padding words are instructions, so a run can fall through them.
    expect(p.instructions.map((i) => i.text)).toEqual(["ret", "nop", "nop", "nop", "ret"]);
    expect(p.symbols.h?.address).toBe(DATA_BASE + 8);
    expect(p.symbols.i?.address).toBe(DATA_BASE + 12);
    const data = p.sections.find((s) => s.kind === "data");
    expect(data?.bytes[1]).toBe(0);
    expect(data?.bytes[9]).toBe(0xaa);
  });

  it("accepts and ignores what GCC prints that the course does not use", () => {
    const p = build(
      `\t.arch armv8-a\n\t.file "t.c"\n\t.text\n\t.align 2\n\t.p2align 3\n\t.global f\n\t.type f, %function\nf:\n\t.cfi_startproc\n\tret\n\t.cfi_endproc\n\t.size f, .-f\n\t.ident "GCC: (GNU) 16.1.0"\n\t.section\t.note.GNU-stack,"",@progbits`,
    );
    expect(p.instructions).toHaveLength(1);
  });

  it("a section such as .rodata.str1.8 is read-only data", () => {
    const p = build(
      `f:\n  ret\n  .section .rodata.str1.8,"aMS",@progbits,1\n.LC0:\n  .string "hi"`,
    );
    expect(p.symbols[".LC0"]?.section).toBe("rodata");
  });

  it("separates statements with a semicolon, and takes a label before an instruction", () => {
    const p = build("f: nop ; nop\n g: h: ret");
    expect(p.instructions.map((i) => [i.line, i.text])).toEqual([
      [1, "nop"],
      [1, "nop"],
      [2, "ret"],
    ]);
    expect(p.symbols.g?.address).toBe(p.symbols.h?.address);
  });

  it("ignores comments of every kind, and a line that starts with #", () => {
    const p = build("# a\nf: /* b\n c */ nop // d\n  # e\n  ret /* f */");
    expect(p.instructions.map((i) => i.line)).toEqual([3, 5]);
  });

  it("is case-insensitive in mnemonics and in register, shift and condition names", () => {
    const p = build("F:\n  ADD X0, X1, W2, SXTW 1\n  Cset W3, EQ\n  B.Eq F\n  BEQ F");
    expect(p.instructions).toHaveLength(4);
    expect(p.symbols.F).toBeDefined();
    expect(p.symbols.f).toBeUndefined();
  });

  it("evaluates expressions with GNU as's precedence", () => {
    const p = build(
      "f:\n  mov x0, 1|2+4\n  mov x1, 2+3*4\n  mov x2, (2+3)*4\n  mov x3, -(1<<3)\n  mov x4, ~0\n  mov x5, 07+0b11+0x10",
    );
    expect(p.instructions.map((i) => i.operands[1])).toMatchObject([
      { value: 7n },
      { value: 14n },
      { value: 20n },
      { value: -8n },
      { value: -1n },
      { value: 26n },
    ]);
  });

  it("evaluates the comparisons, the logical operators and the character constants of GNU as", () => {
    const p = build(
      "f:\n  mov x0, 2==2\n  mov x1, 1<5\n  mov x2, 5<1\n  mov x3, !0\n  mov x4, !5\n  mov x5, 1&&2\n  mov x6, 0||0\n  mov x7, 5!3\n  mov x8, -100/7\n  mov x9, '\\n'\n  mov x10, 1l\n  mov x11, 1<>2",
    );
    expect(p.instructions.map((i) => (i.operands[1] as { value: bigint }).value)).toEqual([
      -1n,
      -1n,
      0n,
      1n,
      0n,
      1n,
      0n,
      -3n,
      -14n,
      10n,
      1n,
      -1n,
    ]);
  });

  it("reads a plain number in a branch as the distance from the instruction, as GNU as does", () => {
    const p = build("f:\n  nop\n  b 8\n  b -4\n  b .+4\n  b f+8");
    const t = p.instructions.slice(1).map((i) => i.operands[0]);
    expect(t).toMatchObject([
      { address: TEXT_BASE + 4 + 8 },
      { address: TEXT_BASE + 8 - 4 },
      { address: TEXT_BASE + 12 + 4 },
      { address: TEXT_BASE + 8 },
    ]);
  });
});

describe("what GNU as takes", () => {
  it.each([
    "add x0, x1, 4095",
    "add x0, x1, 0xfff000",
    "add w0, w1, -1",
    "add x0, sp, w1",
    "add sp, sp, x1, lsl 3",
    "cmp w0, -5",
    "mov w0, 0xffff0000",
    "mov x0, 0xffff0000ffff",
    "mov sp, 0xff",
    "and w0, w1, 255",
    "and sp, x1, 255",
    "ands xzr, x1, 255",
    "bic w0, w1, 255",
    "ldr w0, [x1, 3]",
    "ldr x0, [x1, 256]",
    "ldr x0, [x1, x2, lsl 3]",
    "ldr w0, [x1, w2, sxtw 2]",
    "ldr x0, [x1, #8]!",
    "ldr x0, [x1], #-8",
    "ldp x29, x30, [sp, -16]!",
    "ldrsw x0, [x1, w2, sxtw 2]",
    "tbz x0, 63, f",
    "tbz w0, 31, f",
    "cset w0, hs",
    "csel x0, x1, x2, al",
    "ubfx w0, w1, 31, 1",
    "adrp x0, f",
    "add x0, x0, :lo12:f",
    "ldr x0, [x0, :lo12:f]",
    "ret x1",
    "blr xzr",
    "uxtb x0, w1",
    "lsl x0, x1, 63",
    "ror w0, w1, 31",
  ])("accepts %s", (line) => {
    const { errors } = assemble(`f:\n  ${line}\n  .data\n  .balign 8\n  .quad 0`);
    expect(errors).toEqual([]);
  });

  it.each([
    ["mov w0, 0x12345", "immediate.move"],
    ["mov x0, 0x123456789", "immediate.move"],
    ["add w0, w1, 4097", "immediate.addsub"],
    ["add w0, w1, 0x1000000", "immediate.addsub"],
    ["and w0, w1, 257", "immediate.bitmask"],
    ["and w0, w1, 0", "immediate.bitmask"],
    ["and w0, w1, -1", "immediate.bitmask"],
    ["lsl w0, w1, 32", "immediate.range"],
    ["ubfx w0, w1, 31, 2", "immediate.range"],
    ["add x0, x1, x2, lsl 64", "shift.range"],
    ["add w0, w1, w2, lsl 32", "shift.range"],
    ["add x0, x1, x2, ror 3", "shift.notAllowed"],
    ["add x0, x1, w2", "operand.extendMissing"],
    ["add w0, w1, x2", "operand.width"],
    ["add x0, xzr, 5", "operand.noZr"],
    ["cmp xzr, 5", "operand.noZr"],
    ["cmp x0, sp", "operand.noSp"],
    ["and x0, sp, x1", "operand.noSp"],
    ["adds sp, sp, 5", "operand.noSp"],
    ["ldr x0, [x1, 257]", "mem.offset"],
    ["ldr x0, [x1, 32768]", "mem.offset"],
    ["ldr x0, [x1, x2, lsl 2]", "mem.shiftAmount"],
    ["ldr x0, [x1, w2]", "mem.indexWidth"],
    ["ldr x0, [w1]", "mem.base"],
    ["ldr x0, [xzr]", "mem.base"],
    ["ldp x0, x1, [sp, 4]", "mem.multiple"],
    ["ldp x0, x1, [sp, 512]", "immediate.range"],
    ["ldr x0, [x1, 256]!", "mem.offsetUnscaled"],
    ["ldrb x0, [x1]", "operand.width"],
    ["ldrsw w0, [x1]", "operand.width"],
    ["tbz w0, 32, f", "immediate.range"],
    ["cset x0, al", "operand.conditionAl"],
    ["csel x0, x1, x2, zz", "operand.condition"],
    ["csel x0, x1, x2, Ne", "operand.condition"],
    ["mov x0, Sp", "symbol.undefined"],
    ["b .+2", "branch.align"],
    ["b .+0x8000000", "branch.range"],
    ["b.eq .+0x100000", "branch.range"],
    ["tbz x0, 1, .+0x8000", "branch.range"],
    ["adr x0, .+0x100000", "branch.range"],
    ["adrp x0, #f", "operand.label"],
    ["cmp x0", "operands.few"],
    ["ret x30, x1", "operands.many"],
  ])("rejects %s with %s", (line, key) => {
    const e = firstError(`f:\n  ${line}\n  ret`);
    expect(e.key).toBe(key);
    expect(e.line).toBe(2);
  });

  it("says the machine does not have what GNU as has and the subset leaves out", () => {
    for (const line of [
      "adc x0, x1, x2",
      "clz x0, x1",
      "fadd d0, d1, d2",
      "ldr x0, =5",
      "ldr x0, f",
      "ldr q0, [x1]",
      "csel x0, x1, x2, nv",
      "b.nv f",
      "mov x0, x1, lsl 2",
      "add x0, x0, :got_lo12:f",
      "add x0, x0, :lo12:f, lsl 12",
      "svc 0",
      "ldp q0, q1, [sp]",
      "mov v0.b[0], w1",
      "cinv x0, x1, eq",
      "ldurb w0, [x1, 1]",
      "ubfm x0, x1, 3, 4",
    ]) {
      expect(firstError(`f:\n  ${line}`).key, line).toBe("notInMachine");
    }
    expect(firstError("f:\n  .macro m").key).toBe("notInMachine");
    expect(firstError(".rodata").key).toBe("notInMachine");
    expect(firstError(".align 17").key).toBe("notInMachine");
  });
});

describe("the instruction gate", () => {
  const allowed = new Set(["add", "ret", "b.cond"]);
  it("names the instruction that is not allowed", () => {
    const e = firstError("f:\n  add x0, x0, 1\n  sub x0, x0, 1\n  ret", allowed);
    expect(e).toMatchObject({ key: "gate.notYet", line: 3 });
    expect(e.params).toMatchObject({ name: "sub", text: "sub x0, x0, 1" });
    expect(message(e.key, e.params)).toContain("sub");
  });

  it("allows every condition under b.cond, both spellings", () => {
    expect(assemble("f:\n  b.eq f\n  bne f\n  b.lt f\n  ret", { allowed }).errors).toEqual([]);
    expect(firstError("f:\n  b f", allowed).key).toBe("gate.notYet");
  });

  it("is by the name written, so an alias is its own entry", () => {
    expect(firstError("f:\n  mov x0, 1", allowed).key).toBe("gate.notYet");
    expect(firstError("f:\n  adds x0, x0, 1", allowed).params.name).toBe("adds");
    expect(assemble("f:\n  mov x0, 1", { allowed: new Set(["mov"]) }).errors).toEqual([]);
  });

  it("reports every instruction that is out, and an instruction the machine lacks is not the gate's", () => {
    const { errors } = assemble("f:\n  sub x0, x0, 1\n  eor x0, x0, 1\n  fadd d0, d1, d2", {
      allowed,
    });
    expect(errors.map((e) => e.key)).toEqual(["gate.notYet", "gate.notYet", "notInMachine"]);
  });

  describe("an instruction the course has introduced but this program may not use", () => {
    const allowed = new Set(["mov", "movk", "ret"]);
    const introduced = new Set(["add", "sub", "ret", "mov", "movk"]);

    it("is gate.notAllowedHere, and the sentence lists what is allowed", () => {
      const e = firstError("f:\n  mov w0, 1\n  add w0, w0, 15\n  ret", allowed, introduced);
      expect(e).toMatchObject({ key: "gate.notAllowedHere", line: 3 });
      expect(e.params).toMatchObject({ name: "add", text: "add w0, w0, 15" });
      expect(message(e.key, e.params)).toBe("This challenge allows only `mov`, `movk` and `ret`.");
    });

    it("is gate.notYet for an instruction no lesson has introduced", () => {
      const e = firstError("f:\n  b f", allowed, introduced);
      expect(e.key).toBe("gate.notYet");
      expect(firstError("f:\n  adds w0, w0, 1", allowed, introduced).key).toBe("gate.notYet");
    });

    it("names the conditional branches as b with a condition, such as b.cc, and never as b.cond", () => {
      const withBranches = new Set(["cmp", "b.cond", "cbz", "b", "mov", "ret"]);
      const e = firstError("f:\n  add w0, w0, 1", withBranches, new Set([...withBranches, "add"]));
      expect(e.key).toBe("gate.notAllowedHere");
      const said = message(e.key, e.params);
      expect(said).toBe(
        "This challenge allows only `cmp`, `b` with a condition, such as `b.cc`, `cbz`, `b`, `mov` and `ret`.",
      );
      expect(said).not.toContain("b.cond");
      // A list of one is the item alone.
      const only = new Set(["b.cond"]);
      const alone = firstError("f:\n  add w0, w0, 1", only, new Set(["b.cond", "add"]));
      expect(message(alone.key, alone.params)).toBe(
        "This challenge allows only `b` with a condition, such as `b.cc`.",
      );
    });

    it("is told apart for each instruction of one program", () => {
      const { errors } = assemble("f:\n  add w0, w0, 1\n  b f\n  sub w0, w0, 1\n  ret", {
        allowed,
        introduced,
      });
      expect(errors.map((e) => e.key)).toEqual([
        "gate.notAllowedHere",
        "gate.notYet",
        "gate.notAllowedHere",
      ]);
    });

    it("names one, two or three instructions as a list", () => {
      const only = (names: string[]) =>
        message(
          "gate.notAllowedHere",
          firstError("f:\n  sub w0, w0, 1", new Set(names), new Set([...names, "sub"])).params,
        );
      expect(only(["ret"])).toBe("This challenge allows only `ret`.");
      expect(only(["mov", "ret"])).toBe("This challenge allows only `mov` and `ret`.");
    });

    it("keeps gate.notYet for everything when no list of introduced instructions is given", () => {
      expect(firstError("f:\n  add w0, w0, 1", allowed).key).toBe("gate.notYet");
    });

    it("lets an allowed instruction through whether or not it is on the list", () => {
      expect(assemble("f:\n  mov w0, 1\n  ret", { allowed, introduced: new Set() }).errors).toEqual(
        [],
      );
    });
  });

  it("without a gate, everything in the subset is allowed", () => {
    expect(assemble("f:\n  sub x0, x0, 1").errors).toEqual([]);
  });
});

describe("errors", () => {
  it("carry a line, a column, a key and parameters, sorted by place", () => {
    const { errors } = assemble("f:\n  nop\n  add x0, x1, 4097\n  mov w0, 0x12345\n  frob x0");
    expect(errors.map((e) => [e.line, e.key])).toEqual([
      [3, "immediate.addsub"],
      [4, "immediate.move"],
      [5, "notInMachine"],
    ]);
    expect(errors[0]).toMatchObject({ column: 15, params: { text: "4097" } });
    expect(errors[1]?.column).toBe(11);
    expect(errors[2]?.column).toBe(3);
  });

  it("columns are 1-based and count tabs as one", () => {
    expect(firstError("f:\n\tadd x0, x1, 4097").column).toBe(14);
    expect(firstError("a: add x0, x1, 4097").column).toBe(16);
    expect(firstError("f:\n  ldr x0, [x1, 257]").column).toBe(11);
  });

  it("an error in one line does not hide those after it", () => {
    const { errors } = assemble("f:\n  add x0\n  add x0, x1\n  ret");
    expect(errors).toHaveLength(2);
  });

  it("give a program of null when there is any", () => {
    expect(assemble("f:\n  add x0").program).toBeNull();
    expect(assemble("f:\n  ret").program).not.toBeNull();
  });

  it("every key has a sentence with no slot left empty", () => {
    const params = {
      text: "t",
      after: "a",
      name: "n",
      address: "0x1",
      line: 1,
      size: 8,
      max: 1,
      min: 0,
      log: 3,
      limit: 1,
      steps: 2,
      allowed: "`a`",
      bits: 32,
      repeats: "2, 4, 8 or 16",
    };
    for (const key of Object.keys(strings) as MessageKey[]) {
      expect(message(key, params), key).not.toMatch(/\{/);
    }
  });
});

describe("every message key an error can have", () => {
  // The source that makes the assembler say it.
  const examples: [MessageKey, string][] = [
    ["syntax.expression", "f:\n  mov x0, 1 +"],
    ["notInMachineWord", "f:\n  low"],
    ["syntax.commentTail", "f:\n  cmp w0, w1 # compare"],
    ["syntax.tooBig", "f:\n  mov x0, 0x10000000000000000"],
    ["syntax.divideByZero", "f:\n  mov x0, 1/0"],
    ["symbol.undefined", "f:\n  b nowhere"],
    ["symbol.notNumber", "f:\n  mov x0, f"],
    ["label.duplicate", "f:\nf:\n  ret"],
    ["notInMachine", "f:\n  fmov d0, d1"],
    ["instruction.outsideText", ".data\n  add x0, x0, x0"],
    ["program.textTooBig", ".text\n  .zero 70000"],
    ["program.dataTooBig", ".data\n  .zero 70000"],
    ["directive.operands", ".global"],
    ["directive.string", ".ascii abc"],
    ["directive.negative", ".data\n  .zero -1"],
    ["directive.alignment", ".data\n  .balign 3"],
    ["section.bssNonZero", ".bss\n  .word 1"],
    ["operands.few", "f:\n  add x0, x1"],
    ["operands.many", "f:\n  nop x0"],
    ["operand.register", "f:\n  add x0, 5, x2"],
    ["syntax.missingComma", "f:\n  sub w0 w0 w1"],
    ["operand.noSp", "f:\n  and x0, sp, x1"],
    ["operand.noZr", "f:\n  add xzr, xzr, 5"],
    ["operand.width", "f:\n  add w0, x1, x2"],
    ["operand.immediate", "f:\n  movz x0, x1"],
    ["operand.label", "f:\n  b x0"],
    ["operand.shift", "f:\n  add x0, x1, x2, foo"],
    ["operand.condition", "f:\n  cset x0, zz"],
    ["operand.conditionAl", "f:\n  cset x0, al"],
    ["operand.extendMissing", "f:\n  add x0, x1, w2"],
    ["reloc.notHere", "f:\n  sub x0, x0, :lo12:f"],
    ["shift.notAllowed", "f:\n  add x0, x1, x2, ror 3"],
    ["shift.amountMissing", "f:\n  add x0, x1, x2, lsl"],
    ["shift.range", "f:\n  add x0, x1, x2, lsl 64"],
    ["shift.onlyLsl", "f:\n  movz x0, 1, lsr 16"],
    ["shift.multiple16", "f:\n  movz x0, 1, lsl 8"],
    ["shift.zeroOr12", "f:\n  add x0, x1, 5, lsl 4"],
    ["shift.extendExpected", "f:\n  add sp, sp, x1, lsr 3"],
    ["immediate.range", "f:\n  lsl w0, w1, 32"],
    ["immediate.move", "f:\n  mov w0, 0x12345"],
    ["immediate.addsub", "f:\n  add w0, w1, 4097"],
    ["immediate.bitmask", "f:\n  and w0, w1, 257"],
    ["immediate.bitmaskBic", "f:\n  bic w0, w1, 0x70f0"],
    ["mem.syntax", "f:\n  ldr x0, [x1, 8"],
    ["mem.base", "f:\n  ldr x0, [w1]"],
    ["mem.preNeedsOffset", "f:\n  ldr x0, [x1]!"],
    ["mem.registerPre", "f:\n  ldr x0, [x1, x2]!"],
    ["mem.index", "f:\n  ldr x0, [x1, sp]"],
    ["mem.extend", "f:\n  ldr x0, [x1, x2, lsr 3]"],
    ["mem.shiftMissing", "f:\n  ldr x0, [x1, x2, lsl]"],
    ["mem.indexWidth", "f:\n  ldr x0, [x1, w2]"],
    ["mem.shiftAmount", "f:\n  ldr x0, [x1, x2, lsl 2]"],
    ["mem.unscaledForm", "f:\n  ldur x0, [x1, x2]"],
    ["mem.indexMix", "f:\n  ldr x0, [x1, 8], 8"],
    ["mem.postRegister", "f:\n  ldr x0, [x1], x2"],
    ["mem.unscaledWriteback", "f:\n  ldur x0, [x1, 8]!"],
    ["mem.loMisaligned", "f:\n  ldr x0, [x1, :lo12:odd]\n  .data\n  .byte 1\nodd: .byte 2"],
    ["mem.offsetUnscaled", "f:\n  ldr x0, [x1, 256]!"],
    ["mem.offset", "f:\n  ldr x0, [x1, 257]"],
    ["mem.pairForm", "f:\n  ldp x0, x1, [x2, x3]"],
    ["mem.multiple", "f:\n  ldp x0, x1, [sp, 4]"],
    ["branch.range", "f:\n  b .+0x8000000"],
    ["branch.align", "f:\n  b .+2"],
  ];

  it.each(examples)("%s", (key, source) => {
    const e = firstError(source);
    expect(e.key).toBe(key);
    expect(message(e.key, e.params)).not.toMatch(/\{/);
  });

  it("a missing comma names the operand it is in, and where the comma goes", () => {
    const e = firstError("f:\n  sub w0 w0 w1\n  ret");
    expect(e.key).toBe("syntax.missingComma");
    expect(e.params).toMatchObject({ text: "w0 w0 w1", after: "w0" });
    expect(e.line).toBe(2);
    expect(e.column).toBe(7);
    expect(message(e.key, e.params)).toBe(
      "`w0 w0 w1` needs a comma after `w0`. Operands are separated by commas.",
    );
    // The same mistake in a later operand, and with an immediate.
    expect(firstError("f:\n  sub w0, w0 w1").params).toMatchObject({ text: "w0 w1" });
    expect(firstError("f:\n  add w0, w0 #5").key).toBe("syntax.missingComma");
    // A shift or a memory operand is not one.
    expect(assemble("f:\n  add x0, x1, x2, lsl 2\n  ldr x0, [x1, 8]\n  ret").errors).toEqual([]);
  });

  it("gate.notYet", () => {
    expect(firstError("f:\n  nop", new Set()).key).toBe("gate.notYet");
  });

  it("gate.notAllowedHere", () => {
    expect(firstError("f:\n  nop", new Set(), new Set(["nop"])).key).toBe("gate.notAllowedHere");
  });

  it("every error key but the gate's has an example, and the others are the run's", () => {
    const covered = new Set<string>([
      ...examples.map(([k]) => k),
      "gate.notYet",
      "gate.notAllowedHere",
    ]);
    const run = [
      "fault.address",
      "fault.readInstruction",
      "fault.storeText",
      "fault.storeRodata",
      "fault.notInstruction",
      "fault.ranOffEnd",
      "fault.entry",
      "stop.returned",
      "stop.limit",
    ];
    for (const key of Object.keys(strings)) {
      expect(covered.has(key) || run.includes(key), key).toBe(true);
    }
  });
});
