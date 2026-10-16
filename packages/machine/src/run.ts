// Copyright © 2026 Christopher Snow

// The simulator: runs one call of a program and records every step. Each instruction does what
// docs/machine.md says, and the differential test (scripts/real-tools) holds it to QEMU.

import { maskOf } from "./regs.ts";
import { DEFAULT_STEP_LIMIT, RETURN_ADDRESS, STACK_BASE, STACK_TOP } from "./layout.ts";
import type { MessageKey } from "./strings.ts";
import type {
  Addition,
  Addressing,
  Call,
  Cond,
  ExtendKind,
  Flags,
  Instruction,
  MachineState,
  Op,
  Params,
  Program,
  RegisterWrite,
  RunResult,
  ShiftKind,
  Source2,
  Step,
  StopReason,
  StoreRecord,
  Width,
} from "./types.ts";

const M64 = maskOf(64);

const sx = (v: bigint, bits: number): bigint => BigInt.asIntN(bits, v);
const hex = (v: bigint | number): string => "0x" + BigInt(v).toString(16);

interface Region {
  base: number;
  bytes: Uint8Array;
  kind: "text" | "data" | "rodata" | "bss" | "stack";
}

/** Raised inside a step when it cannot finish. */
class Fault extends Error {
  readonly key: MessageKey;
  readonly params: Params;
  readonly address: number;
  constructor(key: MessageKey, params: Params, address: number) {
    super(key);
    this.key = key;
    this.params = params;
    this.address = address;
  }
}

function buildRegions(program: Program): Region[] {
  const regions: Region[] = [];
  const nonText = program.sections.filter((s) => s.kind !== "text" && s.size > 0);
  nonText.sort((a, b) => a.base - b.base);
  nonText.forEach((s, i) => {
    // A section's region runs to the start of the next, so the alignment padding is readable and
    // writable the way it is in a real run.
    const next = nonText[i + 1];
    const end = next && next.kind !== "bss" ? next.base : s.base + s.size;
    const bytes = new Uint8Array(end - s.base);
    bytes.set(s.bytes, 0);
    regions.push({ base: s.base, bytes, kind: s.kind });
  });
  for (const s of program.sections) {
    if (s.kind === "text" && s.size > 0) {
      regions.push({ base: s.base, bytes: s.bytes.slice(), kind: "text" });
    }
  }
  regions.push({
    base: STACK_BASE,
    bytes: new Uint8Array(STACK_TOP - STACK_BASE),
    kind: "stack",
  });
  return regions;
}

class Machine {
  x: bigint[] = Array.from({ length: 31 }, () => 0n);
  sp = BigInt(STACK_TOP);
  flags: Flags = { n: false, z: false, c: false, v: false };
  pc = 0;
  readonly regions: Region[];
  readonly instrAt = new Map<number, Instruction>();

  // Per-step records.
  writes: RegisterWrite[] = [];
  stores: StoreRecord[] = [];
  loads: { address: number; size: number }[] = [];
  addition: Addition | null = null;
  spMisaligned = false;
  branch: { taken: boolean; target: number } | null = null;
  nextPc = 0;
  current: Instruction | null = null;

  readonly program: Program;
  constructor(program: Program) {
    this.program = program;
    this.regions = buildRegions(program);
    for (const ins of program.instructions) this.instrAt.set(ins.address, ins);
  }

  // ---- registers

  /** Read `xn`/`wn`; register 31 is the zero register. */
  zr(n: number, w: Width): bigint {
    if (n === 31) return 0n;
    return (this.x[n] as bigint) & maskOf(w);
  }
  /** Read `xn`/`wn`; register 31 is `sp`. */
  sp_(n: number, w: Width): bigint {
    if (n === 31) return this.sp & maskOf(w);
    return (this.x[n] as bigint) & maskOf(w);
  }
  setZr(n: number, value: bigint, w: Width): void {
    if (n === 31) return;
    this.write(n, value & maskOf(w));
  }
  setSp(n: number, value: bigint, w: Width): void {
    this.write(n === 31 ? "sp" : n, value & maskOf(w));
  }
  private write(reg: number | "sp", after: bigint): void {
    const before = reg === "sp" ? this.sp : (this.x[reg] as bigint);
    this.writes.push({ reg, before, after });
    if (reg === "sp") this.sp = after;
    else this.x[reg] = after;
  }

  // ---- memory

  private find(address: bigint, size: number): Region | null {
    if (address < 0n || address > 0xffffffffffffn) return null;
    const a = Number(address);
    for (const r of this.regions) {
      if (a >= r.base && a + size <= r.base + r.bytes.length) return r;
    }
    return null;
  }

  private fault(key: MessageKey, address: bigint, extra: Params = {}): never {
    const ins = this.current as Instruction;
    throw new Fault(
      key,
      { address: hex(BigInt.asUintN(64, address)), line: ins.line, text: ins.text, ...extra },
      Number(BigInt.asUintN(53, address)),
    );
  }

  load(address: bigint, size: number): bigint {
    const r = this.find(address, size);
    if (r === null) return this.fault("fault.address", address, { size });
    const a = Number(address);
    if (r.kind === "text") {
      for (let i = Math.floor(a / 4) * 4; i < a + size; i += 4) {
        if (this.instrAt.has(i)) return this.fault("fault.readInstruction", address);
      }
    }
    let v = 0n;
    for (let i = size - 1; i >= 0; i--) v = (v << 8n) | BigInt(r.bytes[a - r.base + i] as number);
    this.loads.push({ address: a, size });
    return v;
  }

  store(address: bigint, size: number, value: bigint): void {
    const r = this.find(address, size);
    if (r === null) return this.fault("fault.address", address, { size });
    if (r.kind === "text") return this.fault("fault.storeText", address);
    if (r.kind === "rodata") return this.fault("fault.storeRodata", address);
    const a = Number(address);
    const before: number[] = [];
    const after: number[] = [];
    let v = value;
    for (let i = 0; i < size; i++) {
      const at = a - r.base + i;
      before.push(r.bytes[at] as number);
      const b = Number(v & 0xffn);
      after.push(b);
      r.bytes[at] = b;
      v >>= 8n;
    }
    this.stores.push({ address: a, before, after });
  }

  read(address: number, length: number): Uint8Array | undefined {
    const r = this.find(BigInt(address), length);
    if (r === null) return undefined;
    return r.bytes.slice(address - r.base, address - r.base + length);
  }

  // ---- flags and conditions

  holds(cond: Cond): boolean {
    const { n, z, c, v } = this.flags;
    switch (cond) {
      case "eq":
        return z;
      case "ne":
        return !z;
      case "cs":
        return c;
      case "cc":
        return !c;
      case "mi":
        return n;
      case "pl":
        return !n;
      case "vs":
        return v;
      case "vc":
        return !v;
      case "hi":
        return c && !z;
      case "ls":
        return !(c && !z);
      case "ge":
        return n === v;
      case "lt":
        return n !== v;
      case "gt":
        return !z && n === v;
      case "le":
        return z || n !== v;
      case "al":
        return true;
    }
  }

  private addWithCarry(
    a: bigint,
    b: bigint,
    cin: 0 | 1,
    w: Width,
    sub: boolean,
    setFlags: boolean,
  ): bigint {
    const mask = maskOf(w);
    const sum = a + b + BigInt(cin);
    const result = sum & mask;
    const carries = (a ^ b ^ sum) & mask;
    const carryOut = Number((sum >> BigInt(w)) & 1n) as 0 | 1;
    this.addition = { width: w, a, b, carryIn: cin, carries, carryOut, result, subtraction: sub };
    if (setFlags) {
      const intoTop = Number((carries >> BigInt(w - 1)) & 1n);
      this.flags = {
        n: ((result >> BigInt(w - 1)) & 1n) === 1n,
        z: result === 0n,
        c: carryOut === 1,
        v: intoTop !== carryOut,
      };
    }
    return result;
  }

  // ---- operand helpers

  private shifted(value: bigint, kind: ShiftKind, amount: number, w: Width): bigint {
    const mask = maskOf(w);
    const s = BigInt(amount);
    switch (kind) {
      case "lsl":
        return (value << s) & mask;
      case "lsr":
        return value >> s;
      case "asr":
        return BigInt.asUintN(w, BigInt.asIntN(w, value) >> s);
      case "ror":
        return amount === 0 ? value : ((value >> s) | (value << (BigInt(w) - s))) & mask;
    }
  }

  private extended(value: bigint, ext: ExtendKind, amount: number, w: Width): bigint {
    const bits = ext.endsWith("b") ? 8 : ext.endsWith("h") ? 16 : ext.endsWith("w") ? 32 : 64;
    const low = value & maskOf(bits);
    const e = ext.startsWith("s") ? BigInt.asUintN(64, sx(low, bits)) : low;
    return (e << BigInt(amount)) & maskOf(w);
  }

  private source2(src: Source2, w: Width): bigint {
    switch (src.t) {
      case "imm":
        return src.v & maskOf(w);
      case "shifted":
        return this.shifted(this.zr(src.rm, w), src.shift, src.amount, w);
      case "extended":
        return this.extended(this.zr(src.rm, w === 32 ? 32 : 64), src.extend, src.amount, w);
    }
  }

  private effective(addr: Addressing, size: number): { address: bigint; base: bigint } {
    const base = this.sp_(addr.base, 64);
    if (addr.kind === "reg") {
      let idx: bigint;
      if (addr.extend === "uxtw") idx = this.zr(addr.index, 32);
      else if (addr.extend === "sxtw") idx = BigInt.asUintN(64, sx(this.zr(addr.index, 32), 32));
      else idx = this.zr(addr.index, 64);
      void size;
      return { address: (base + (idx << BigInt(addr.shift))) & M64, base };
    }
    const off = BigInt.asUintN(64, addr.offset);
    if (addr.writeback === "post") return { address: base, base };
    return { address: (base + off) & M64, base };
  }

  private checkSp(n: number): void {
    if (n === 31 && (this.sp & 0xfn) !== 0n) this.spMisaligned = true;
  }

  // ---- one instruction

  exec(ins: Instruction): void {
    this.current = ins;
    this.writes = [];
    this.stores = [];
    this.loads = [];
    this.addition = null;
    this.spMisaligned = false;
    this.branch = null;
    this.nextPc = ins.address + 4;
    const op = ins.op;
    switch (op.k) {
      case "addsub":
        return this.execAddSub(op);
      case "logic":
        return this.execLogic(op);
      case "movz":
        return this.setZr(op.rd, op.imm << BigInt(op.shift), op.w);
      case "movn":
        return this.setZr(op.rd, ~(op.imm << BigInt(op.shift)), op.w);
      case "movk": {
        const old = this.zr(op.rd, op.w);
        const sh = BigInt(op.shift);
        return this.setZr(op.rd, (old & ~(0xffffn << sh)) | (op.imm << sh), op.w);
      }
      case "bitfield":
        return this.execBitfield(op);
      case "extr": {
        const w = BigInt(op.w);
        const joined = (this.zr(op.rn, op.w) << w) | this.zr(op.rm, op.w);
        return this.setZr(op.rd, joined >> BigInt(op.lsb), op.w);
      }
      case "shiftv": {
        const amount = Number(this.zr(op.rm, op.w) % BigInt(op.w));
        return this.setZr(op.rd, this.shifted(this.zr(op.rn, op.w), op.kind, amount, op.w), op.w);
      }
      case "csel": {
        const rn = this.zr(op.rn, op.w);
        const rm = this.zr(op.rm, op.w);
        let v = rn;
        if (!this.holds(op.cond)) {
          if (op.kind === "csel") v = rm;
          else if (op.kind === "csinc") v = rm + 1n;
          else if (op.kind === "csinv") v = ~rm;
          else v = -rm;
        }
        return this.setZr(op.rd, v, op.w);
      }
      case "madd": {
        const prod = this.zr(op.rn, op.w) * this.zr(op.rm, op.w);
        const ra = this.zr(op.ra, op.w);
        return this.setZr(op.rd, op.sub ? ra - prod : ra + prod, op.w);
      }
      case "maddl": {
        const a = this.zr(op.rn, 32);
        const b = this.zr(op.rm, 32);
        const prod = op.signed ? sx(a, 32) * sx(b, 32) : a * b;
        const ra = this.zr(op.ra, 64);
        return this.setZr(op.rd, op.sub ? ra - prod : ra + prod, 64);
      }
      case "mulh": {
        const a = this.zr(op.rn, 64);
        const b = this.zr(op.rm, 64);
        const prod = op.signed ? sx(a, 64) * sx(b, 64) : a * b;
        return this.setZr(op.rd, prod >> 64n, 64);
      }
      case "div": {
        const a = this.zr(op.rn, op.w);
        const b = this.zr(op.rm, op.w);
        let q = 0n;
        if (b !== 0n) {
          q = op.signed ? sx(a, op.w) / sx(b, op.w) : a / b;
        }
        return this.setZr(op.rd, q, op.w);
      }
      case "ldst":
        return this.execLdst(op);
      case "ldstp":
        return this.execLdstp(op);
      case "adr": {
        const v = op.page ? op.target & ~0xfffn : op.target;
        return this.setZr(op.rd, v, 64);
      }
      case "b": {
        this.takeBranch(op.target);
        if (op.link) {
          this.checkSpForCall();
          this.setZr(30, BigInt(ins.address + 4), 64);
        }
        return;
      }
      case "bcond":
        return this.condBranch(this.holds(op.cond), op.target);
      case "cbz": {
        const zero = this.zr(op.rt, op.w) === 0n;
        return this.condBranch(op.nonZero ? !zero : zero, op.target);
      }
      case "tbz": {
        const bit = (this.zr(op.rt, 64) >> BigInt(op.bit)) & 1n;
        return this.condBranch(op.nonZero ? bit === 1n : bit === 0n, op.target);
      }
      case "br": {
        const target = this.zr(op.rn, 64);
        this.takeBranch(target);
        if (op.link) {
          this.checkSpForCall();
          this.setZr(30, BigInt(ins.address + 4), 64);
        }
        return;
      }
      case "ret":
        return this.takeBranch(this.zr(op.rn, 64));
      case "nop":
        return;
    }
  }

  private checkSpForCall(): void {
    if ((this.sp & 0xfn) !== 0n) this.spMisaligned = true;
  }

  private takeBranch(target: bigint): void {
    this.branch = { taken: true, target: Number(BigInt.asUintN(53, target)) };
    this.nextPc = this.branch.target;
    this.nextFull = target;
  }
  nextFull: bigint | null = null;

  private condBranch(taken: boolean, target: bigint): void {
    if (taken) this.takeBranch(target);
    else this.branch = { taken: false, target: Number(BigInt.asUintN(53, target)) };
  }

  private execAddSub(op: Extract<Op, { k: "addsub" }>): void {
    const { w } = op;
    const a = op.rnSp ? this.sp_(op.rn, w) : this.zr(op.rn, w);
    let b = this.source2(op.src, w);
    if (op.sub) b = ~b & maskOf(w);
    const result = this.addWithCarry(a, b, op.sub ? 1 : 0, w, op.sub, op.setFlags);
    if (op.setFlags || !op.rdSp) this.setZr(op.rd, result, w);
    else this.setSp(op.rd, result, w);
  }

  private execLogic(op: Extract<Op, { k: "logic" }>): void {
    const { w } = op;
    const a = this.zr(op.rn, w);
    let b = this.source2(op.src, w);
    if (op.invert) b = ~b & maskOf(w);
    const r = op.op === "and" ? a & b : op.op === "orr" ? a | b : a ^ b;
    if (op.setFlags) {
      this.flags = { n: ((r >> BigInt(w - 1)) & 1n) === 1n, z: r === 0n, c: false, v: false };
      this.setZr(op.rd, r, w);
    } else if (op.rdSp) this.setSp(op.rd, r, w);
    else this.setZr(op.rd, r, w);
  }

  private execBitfield(op: Extract<Op, { k: "bitfield" }>): void {
    const { w, immr, imms } = op;
    const src = this.zr(op.rn, w);
    const mask = maskOf(w);
    let result: bigint;
    // `lsb` and `len` describe the bits the field occupies in the destination.
    if (imms >= immr) {
      const len = imms - immr + 1;
      const field = (src >> BigInt(immr)) & maskOf(len);
      if (op.kind === "ubfm") result = field;
      else if (op.kind === "sbfm") result = BigInt.asUintN(w, sx(field, len));
      else {
        const old = this.zr(op.rd, w);
        result = (old & ~maskOf(len) & mask) | field;
      }
    } else {
      const len = imms + 1;
      const lsb = w - immr;
      const field = src & maskOf(len);
      const placed = (field << BigInt(lsb)) & mask;
      if (op.kind === "ubfm") result = placed;
      else if (op.kind === "sbfm") {
        result = BigInt.asUintN(w, sx(placed, lsb + len));
      } else {
        const old = this.zr(op.rd, w);
        result = (old & ~(maskOf(len) << BigInt(lsb)) & mask) | placed;
      }
    }
    this.setZr(op.rd, result, w);
  }

  private execLdst(op: Extract<Op, { k: "ldst" }>): void {
    const { address, base } = this.effective(op.addr, op.size);
    if (op.addr.base === 31) this.checkSp(31);
    if (op.load) {
      let v = this.load(address, op.size);
      if (op.signed) v = BigInt.asUintN(op.w, sx(v, op.size * 8));
      this.setZr(op.rt, v, op.w);
    } else {
      this.store(address, op.size, this.zr(op.rt, op.w));
    }
    this.writeBack(op.addr, address, base);
  }

  private writeBack(addr: Addressing, address: bigint, base: bigint): void {
    if (addr.kind !== "imm" || addr.writeback === "none") return;
    const next =
      addr.writeback === "pre" ? address : (base + BigInt.asUintN(64, addr.offset)) & M64;
    this.setSp(addr.base, next, 64);
  }

  private execLdstp(op: Extract<Op, { k: "ldstp" }>): void {
    const base = this.sp_(op.base, 64);
    const off = BigInt.asUintN(64, op.offset);
    const address = op.writeback === "post" ? base : (base + off) & M64;
    if (op.base === 31) this.checkSp(31);
    const size = BigInt(op.size);
    if (op.load) {
      const a = this.load(address, op.size);
      const b = this.load((address + size) & M64, op.size);
      this.setZr(op.rt, a, op.w);
      this.setZr(op.rt2, b, op.w);
    } else {
      const a = this.zr(op.rt, op.w);
      const b = this.zr(op.rt2, op.w);
      this.store(address, op.size, a);
      this.store((address + size) & M64, op.size, b);
    }
    if (op.writeback !== "none") {
      const next = op.writeback === "pre" ? address : (base + off) & M64;
      this.setSp(op.base, next, 64);
    }
  }
}

function snapshot(m: Machine): MachineState {
  return { x: [...m.x], sp: m.sp, flags: { ...m.flags }, pc: m.pc };
}

/** Run one call of a program. */
export function run(program: Program, call: Call): RunResult {
  const m = new Machine(program);
  const returnAddress = call.returnAddress ?? RETURN_ADDRESS;
  const limit = call.maxSteps ?? DEFAULT_STEP_LIMIT;

  let entry: number;
  if (typeof call.entry === "string") {
    const sym = program.symbols[call.entry];
    if (sym === undefined) throw new Error(`The program has no label ${call.entry}.`);
    entry = sym.address;
  } else entry = call.entry;

  (call.args ?? []).slice(0, 8).forEach((arg, i) => {
    m.x[i] = BigInt.asUintN(arg.width, arg.value);
  });
  m.x[30] = BigInt(returnAddress);
  if (call.flags) m.flags = { ...call.flags };
  m.pc = entry;
  const initial = snapshot(m);

  const steps: Step[] = [];
  let stop: StopReason | null = null;

  while (stop === null) {
    if (m.pc === returnAddress) {
      stop = { kind: "returned" };
      break;
    }
    if (steps.length >= limit) {
      stop = { kind: "limit", steps: steps.length };
      break;
    }
    const ins = m.instrAt.get(m.pc);
    if (ins === undefined) {
      const from = steps[steps.length - 1];
      // Past the last instruction after an ordinary one (no branch, so the run fell through):
      // the mistake is a missing `ret`, not an address. Say so, with no address.
      if (from && from.branch === null && m.pc === from.address + 4) {
        stop = {
          kind: "fault",
          key: "fault.ranOffEnd",
          params: { line: from.line, text: from.text },
          address: m.pc,
          line: from.line,
        };
        break;
      }
      stop = {
        kind: "fault",
        key: from ? "fault.notInstruction" : "fault.entry",
        params: {
          address: hex(m.pc),
          line: from ? from.line : 0,
          text: from ? from.text : "",
        },
        address: m.pc,
        line: from ? from.line : 0,
      };
      break;
    }
    const flagsBefore = { ...m.flags };
    m.nextFull = null;
    try {
      m.exec(ins);
    } catch (e) {
      if (e instanceof Fault) {
        stop = { kind: "fault", key: e.key, params: e.params, address: e.address, line: ins.line };
        break;
      }
      throw e;
    }
    steps.push({
      index: steps.length,
      address: ins.address,
      line: ins.line,
      text: ins.text,
      writes: m.writes,
      flagsBefore,
      flagsAfter: { ...m.flags },
      stores: m.stores,
      loads: m.loads,
      branch: m.branch,
      addition: m.addition,
      spMisaligned: m.spMisaligned,
      nextPc: m.nextPc,
    });
    // A target above 2^53 cannot be an instruction; keep it from aliasing one.
    m.pc = m.nextFull !== null && m.nextFull > 0xffffffffffffn ? -1 : m.nextPc;
  }

  const final = snapshot(m);
  return {
    steps,
    initial,
    final,
    stop,
    read: (address, length) => m.read(address, length),
  };
}

/** The state after step `index` (or the initial state for -1), rebuilt from the trace. */
export function stateAfter(result: RunResult, index: number): MachineState {
  const state: MachineState = {
    x: [...result.initial.x],
    sp: result.initial.sp,
    flags: { ...result.initial.flags },
    pc: result.initial.pc,
  };
  for (let i = 0; i <= index && i < result.steps.length; i++) {
    const s = result.steps[i] as Step;
    for (const w of s.writes) {
      if (w.reg === "sp") state.sp = w.after;
      else state.x[w.reg] = w.after;
    }
    state.flags = { ...s.flagsAfter };
    state.pc = s.nextPc;
  }
  return state;
}
