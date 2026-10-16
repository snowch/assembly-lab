// Copyright © 2026 Christopher Snow

// The forms of every instruction in the subset: which operands each takes, which it refuses, and
// what each one does once its aliases are resolved. The rules follow GNU as 2.42; where this file
// says "GNU as" it was checked by assembling the line (scripts/real-tools/lines).

import { AsmFail, evaluate, type SymbolLookup } from "./expr.ts";
import {
  immediatePattern,
  invertCond,
  isBitmaskImmediate,
  isExtendKind,
  isShiftKind,
  maskOf,
  parseCond,
  parseRegName,
  sameCase,
  type RegName,
} from "./regs.ts";
import type { MessageKey } from "./strings.ts";
import type {
  Addressing,
  Cond,
  ExtendKind,
  Op,
  ParsedOperand,
  ShiftKind,
  Source2,
  Width,
} from "./types.ts";

/** One operand as written: its text and the 1-based column where it starts. */
export interface RawOp {
  text: string;
  col: number;
}

export interface FormContext {
  /** The mnemonic, lower case. */
  mnemonic: string;
  /** The address of the instruction (the value of `.`). */
  address: number;
  lookup: SymbolLookup;
  ops: RawOp[];
  /** Column of the mnemonic. */
  col: number;
  /** The instruction as written. */
  text: string;
}

export interface FormResult {
  op: Op;
  operands: ParsedOperand[];
}

const fail = (key: MessageKey, params: Record<string, string | number>, col: number): never => {
  throw new AsmFail(key, params, col);
};

/** Mnemonics of the subset, with the shape of their operands. */
const CONDITIONAL_BRANCH = /^b\.?(eq|ne|cs|hs|cc|lo|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)$/;

export function isConditionalBranch(mnemonic: string): boolean {
  if (mnemonic === "bal") return false;
  return CONDITIONAL_BRANCH.test(mnemonic);
}

/**
 * What an operand starting with `:` is. `:lo12:` is handled where it is allowed; every other
 * relocation GNU as knows is real and not in the machine.
 */
function relocKey(text: string): MessageKey {
  return /^:(got|got_lo12|got_page|pg_hi21|lo12|abs_g\d\w*|tprel\w*|dtprel\w*|tlsgd\w*|tlsdesc\w*|gottprel\w*|gotpage_lo15):/i.test(
    text,
  ) && !/^:lo12:/i.test(text)
    ? "notInMachine"
    : "reloc.notHere";
}

/** Floating-point, vector and scalable registers: real, but not in the machine. */
const OTHER_REGISTER = /^[bhsdqvzp]([0-9]|[12][0-9]|3[01])(\.\w+)?(\[\d+\])?$/i;

type Handler = (r: Reader) => Op;

class Reader {
  i = 0;
  readonly parsed: ParsedOperand[] = [];
  readonly c: FormContext;
  constructor(c: FormContext) {
    this.c = c;
  }

  more(): boolean {
    return this.i < this.c.ops.length;
  }
  peek(offset = 0): RawOp | undefined {
    return this.c.ops[this.i + offset];
  }
  /** The next operand; fails when there is none. */
  raw(): RawOp {
    const op = this.c.ops[this.i++];
    if (op === undefined) {
      const last = this.c.ops[this.c.ops.length - 1];
      const col = last ? last.col + last.text.length : this.c.col + this.c.mnemonic.length;
      return fail("operands.few", { text: this.c.text }, col);
    }
    return op;
  }
  /** Fails when operands are left over. */
  end(): void {
    const op = this.c.ops[this.i];
    if (op !== undefined) fail("operands.many", { text: this.c.text }, op.col);
  }

  /** Read the next operand as a register of any kind. */
  anyReg(): { tok: RegName; op: RawOp } {
    const op = this.raw();
    const tok = parseRegName(op.text);
    if (tok === null) {
      if (OTHER_REGISTER.test(op.text.trim())) {
        return fail("notInMachine", { text: this.c.text }, op.col);
      }
      return fail("operand.register", { text: op.text }, op.col);
    }
    return { tok, op };
  }

  note(op: RawOp, tok: RegName): void {
    this.parsed.push({
      kind: "reg",
      text: op.text,
      n: tok.n,
      width: tok.width,
      role: tok.role,
    });
  }

  /** Read a register that may be the zero register but not `sp`. */
  regZr(): RegName {
    const { tok, op } = this.anyReg();
    if (tok.role === "sp") return fail("operand.noSp", { text: op.text }, op.col);
    this.note(op, tok);
    return tok;
  }

  /** Read a 64-bit register that may be the zero register but not `sp`. */
  regX(): RegName {
    const tok = this.regZr();
    if (tok.width !== 64) return fail("operand.width", { text: this.c.text }, this.lastCol());
    return tok;
  }

  lastCol(): number {
    const op = this.c.ops[this.i - 1];
    return op ? op.col : this.c.col;
  }

  /** The text of an operand without a leading `#`. */
  static bare(op: RawOp): { text: string; col: number } {
    const t = op.text;
    const lead = t.length - t.trimStart().length;
    let s = t.slice(lead);
    let col = op.col + lead;
    if (s.startsWith("#")) {
      s = s.slice(1);
      const lead2 = s.length - s.trimStart().length;
      col += 1 + lead2;
      s = s.slice(lead2);
    }
    return { text: s, col };
  }

  /** Evaluate an operand as a plain number. */
  number(op: RawOp): bigint {
    const { text, col } = Reader.bare(op);
    if (/^:/.test(text)) return fail(relocKey(text), { text: this.c.text }, op.col);
    const v = evaluate(text, col, this.c.lookup, BigInt(this.c.address));
    if (v.usesSymbol) return fail("symbol.notNumber", { text: op.text }, op.col);
    return v.value;
  }

  /** Read an immediate and remember it. */
  imm(): { value: bigint; op: RawOp } {
    const op = this.raw();
    if (parseRegName(op.text) !== null) return fail("operand.immediate", { text: op.text }, op.col);
    const value = this.number(op);
    this.parsed.push({ kind: "imm", text: op.text, value });
    return { value, op };
  }

  /**
   * Read an address: an expression with a label or `.` in it is an address; a plain number is how
   * far to go from this instruction, as GNU as reads `b 8`. `adrp` takes no `#`.
   */
  address(allowHash = true): { value: bigint; op: RawOp } {
    const op = this.raw();
    if (parseRegName(op.text) !== null) return fail("operand.label", { text: op.text }, op.col);
    if (!allowHash && op.text.trim().startsWith("#")) {
      return fail("operand.label", { text: op.text }, op.col);
    }
    const { text, col } = Reader.bare(op);
    if (/^:/.test(text)) return fail(relocKey(text), { text: this.c.text }, op.col);
    const v = evaluate(text, col, this.c.lookup, BigInt(this.c.address));
    const value = v.usesSymbol ? v.value : BigInt.asIntN(64, v.value + BigInt(this.c.address));
    this.parsed.push({ kind: "label", text: op.text, address: Number(BigInt.asUintN(53, value)) });
    return { value, op };
  }

  cond(): { cond: Cond; op: RawOp } {
    const op = this.raw();
    const name = op.text.trim();
    const cond = parseCond(name);
    if (cond === null) {
      if (name.toLowerCase() === "nv" && sameCase(name)) {
        return fail("notInMachine", { text: this.c.text }, op.col);
      }
      return fail("operand.condition", { text: op.text }, op.col);
    }
    this.parsed.push({ kind: "cond", text: op.text, cond });
    return { cond, op };
  }
}

// ---------------------------------------------------------------------------------------------
// Shift and extend operands

interface ShiftOperand {
  name: ShiftKind | ExtendKind;
  /** The amount, or `null` when none was written. */
  amount: bigint | null;
  op: RawOp;
}

/** Whether an operand has the shape of a shift or extend, without reading it. */
function shiftWord(op: RawOp | undefined): string | null {
  if (op === undefined) return null;
  const m = /^\s*([a-z]+)/i.exec(op.text);
  if (!m || !sameCase(m[1] as string)) return null;
  const name = (m[1] as string).toLowerCase();
  return isShiftKind(name) || isExtendKind(name) ? name : null;
}

function readShift(r: Reader): ShiftOperand {
  const op = r.raw();
  const m = /^\s*([a-z]+)\s*(.*)$/is.exec(op.text);
  const name = shiftWord(op);
  if (!m || name === null) {
    return fail("operand.shift", { text: op.text }, op.col);
  }
  const rest = (m[2] as string).trim();
  let amount: bigint | null = null;
  if (rest !== "") {
    amount = r.number({ text: rest, col: op.col + op.text.length - rest.length });
  }
  const kind = name as ShiftKind | ExtendKind;
  r.parsed.push({
    kind: "shift",
    text: op.text,
    shift: kind,
    amount: amount === null ? null : Number(amount),
  });
  return { name: kind, amount, op };
}

function amountIn(s: ShiftOperand, min: number, max: number): number {
  if (s.amount === null) return fail("shift.amountMissing", { text: s.op.text }, s.op.col);
  if (s.amount < BigInt(min) || s.amount > BigInt(max)) {
    return fail("shift.range", { text: s.op.text, min, max }, s.op.col);
  }
  return Number(s.amount);
}

// ---------------------------------------------------------------------------------------------
// Shared pieces

function same(a: RegName, b: RegName, r: Reader): void {
  if (a.width !== b.width) fail("operand.width", { text: r.c.text }, r.c.col);
}

function checkFits(value: bigint, min: bigint, max: bigint, op: RawOp): void {
  if (value < min || value > max) {
    fail("immediate.range", { text: op.text, min: Number(min), max: Number(max) }, op.col);
  }
}

/** The second source of an add, subtract or logical instruction, shifted by a register. */
function shiftedSource(
  r: Reader,
  rm: RegName,
  w: Width,
  allowRor: boolean,
  hasShift: boolean,
): Source2 {
  if (hasShift) {
    const s = readShift(r);
    if (isExtendKind(s.name)) return fail("shift.notAllowed", { text: s.op.text }, s.op.col);
    if (s.name === "ror" && !allowRor) {
      return fail("shift.notAllowed", { text: s.op.text }, s.op.col);
    }
    const amount = amountIn(s, 0, w - 1);
    return { t: "shifted", rm: rm.n, shift: s.name as ShiftKind, amount };
  }
  return { t: "shifted", rm: rm.n, shift: "lsl", amount: 0 };
}

// ---------------------------------------------------------------------------------------------
// Move

/**
 * `mov` with a number is whichever of `movz`, `movn` or `orr` (a bit pattern) can hold it, tried in
 * that order. `sp` can only be the destination of `orr`; the zero register cannot be.
 */
function immediateMove(value: bigint, rd: RegName, op: RawOp, text: string): Op {
  const w = rd.width;
  const pat = immediatePattern(value, w);
  if (pat === null) return fail("immediate.move", { text }, op.col);
  const all = maskOf(w);
  const chunks = w / 16;
  const chunkOf = (v: bigint): { shift: number; imm: bigint } | null => {
    if (v === 0n) return { shift: 0, imm: 0n };
    for (let i = 0; i < chunks; i++) {
      const sh = BigInt(16 * i);
      if ((v & ~(0xffffn << sh) & all) === 0n) return { shift: 16 * i, imm: (v >> sh) & 0xffffn };
    }
    return null;
  };
  if (rd.role !== "sp") {
    const z = chunkOf(pat);
    if (z) return { k: "movz", w, rd: rd.n, imm: z.imm, shift: z.shift };
    const n = chunkOf(~pat & all);
    if (n) return { k: "movn", w, rd: rd.n, imm: n.imm, shift: n.shift };
  }
  if (rd.role !== "zero" && isBitmaskImmediate(pat, w)) {
    return {
      k: "logic",
      op: "orr",
      invert: false,
      setFlags: false,
      w,
      rd: rd.n,
      rdSp: rd.role === "sp",
      rn: 31,
      src: { t: "imm", v: pat },
    };
  }
  return fail("immediate.move", { text }, op.col);
}

const mov: Handler = (r) => {
  const { tok: rd, op: rdOp } = r.anyReg();
  const srcOp = r.peek();
  if (srcOp === undefined) return fail("operands.few", { text: r.c.text }, r.c.col + 3);
  const rm = parseRegName(srcOp.text);
  if (rm !== null) {
    r.raw();
    // `mov x0, x1, lsl 2` is real, and not in the machine.
    if (r.more()) return fail("notInMachine", { text: r.c.text }, r.c.col);
    r.note(rdOp, rd);
    r.note(srcOp, rm);
    same(rd, rm, r);
    if (rd.role === "sp" || rm.role === "sp") {
      if (rd.role === "zero" || rm.role === "zero") {
        return fail(
          "operand.noZr",
          { text: rd.role === "zero" ? rdOp.text : srcOp.text },
          srcOp.col,
        );
      }
      return {
        k: "addsub",
        sub: false,
        setFlags: false,
        w: rd.width,
        rd: rd.n,
        rdSp: true,
        rn: rm.n,
        rnSp: true,
        src: { t: "imm", v: 0n },
      };
    }
    return {
      k: "logic",
      op: "orr",
      invert: false,
      setFlags: false,
      w: rd.width,
      rd: rd.n,
      rdSp: false,
      rn: 31,
      src: { t: "shifted", rm: rm.n, shift: "lsl", amount: 0 },
    };
  }
  r.note(rdOp, rd);
  const { value, op } = r.imm();
  r.end();
  return immediateMove(value, rd, op, r.c.text);
};

function wide(kind: "movz" | "movn" | "movk"): Handler {
  return (r) => {
    const rd = r.regZr();
    const { value, op } = r.imm();
    checkFits(value, 0n, 0xffffn, op);
    let shift = 0;
    if (r.more()) {
      const s = readShift(r);
      if (s.name !== "lsl") return fail("shift.onlyLsl", { text: s.op.text }, s.op.col);
      const amount = amountIn(s, 0, rd.width - 1);
      if (amount % 16 !== 0) return fail("shift.multiple16", { text: s.op.text }, s.op.col);
      if (amount > rd.width - 16) {
        return fail("shift.range", { text: s.op.text, min: 0, max: rd.width - 16 }, s.op.col);
      }
      shift = amount;
    }
    r.end();
    return { k: kind, w: rd.width, rd: rd.n, imm: value, shift };
  };
}

// ---------------------------------------------------------------------------------------------
// Add and subtract

function addsubHandler(sub: boolean, setFlags: boolean, alias: "none" | "cmp" | "neg"): Handler {
  return (r) => {
    const rdPair = alias === "cmp" ? null : r.anyReg();
    const rnPair = alias === "neg" ? null : r.anyReg();
    const third = r.raw();
    const rd: RegName =
      rdPair?.tok ??
      ({ n: 31, width: (rnPair as { tok: RegName }).tok.width, role: "zero" } as const);
    const rn: RegName = rnPair?.tok ?? ({ n: 31, width: rd.width, role: "zero" } as const);
    const w = rd.width;
    if (rd.width !== rn.width) return fail("operand.width", { text: r.c.text }, r.c.col);

    const noteRegs = (): void => {
      if (rdPair) r.note(rdPair.op, rd);
      if (rnPair) r.note(rnPair.op, rn);
    };
    const rm = parseRegName(third.text);

    // Forms with an immediate second source (not for `neg`).
    if (rm === null) {
      if (alias === "neg") return fail("operand.register", { text: third.text }, third.col);
      // Destination takes `sp` unless the flags are set; the first source never takes the zero register.
      if (setFlags ? rd.role === "sp" : rd.role === "zero") {
        const at = rdPair ? rdPair.op : third;
        return fail(setFlags ? "operand.noSp" : "operand.noZr", { text: at.text }, at.col);
      }
      if (rn.role === "zero" && rnPair) {
        return fail("operand.noZr", { text: rnPair.op.text }, rnPair.op.col);
      }
      noteRegs();
      const bare = Reader.bare(third);
      let value: bigint;
      let lo12 = false;
      if (bare.text.startsWith(":")) {
        const m = /^:lo12:(.*)$/is.exec(bare.text);
        if (!m) return fail(relocKey(bare.text), { text: r.c.text }, third.col);
        if (sub || setFlags) return fail("reloc.notHere", { text: third.text }, third.col);
        const e = evaluate((m[1] as string).trim(), bare.col + 6, r.c.lookup, BigInt(r.c.address));
        value = e.value & 0xfffn;
        lo12 = true;
      } else {
        value = r.number(third);
      }
      r.parsed.push({ kind: "imm", text: third.text, value });
      let explicit: number | null = null;
      if (r.more()) {
        const s = readShift(r);
        if (s.name !== "lsl") return fail("shift.onlyLsl", { text: s.op.text }, s.op.col);
        // GNU as takes `:lo12:` with a shift too; it means a relocation the machine does not have.
        if (lo12) return fail("notInMachine", { text: r.c.text }, s.op.col);
        const a = amountIn(s, 0, 63);
        if (a !== 0 && a !== 12) return fail("shift.zeroOr12", { text: s.op.text }, s.op.col);
        explicit = a;
      }
      r.end();
      let finalSub = sub;
      let mag = value;
      if (value < 0n) {
        finalSub = !sub;
        mag = -value;
      }
      let shifted: bigint;
      if (explicit !== null) {
        if (mag > 4095n) return fail("immediate.addsub", { text: third.text }, third.col);
        shifted = mag << BigInt(explicit);
      } else if (mag <= 4095n) {
        shifted = mag;
      } else if (mag % 4096n === 0n && mag >> 12n <= 4095n) {
        shifted = mag;
      } else {
        return fail("immediate.addsub", { text: third.text }, third.col);
      }
      return {
        k: "addsub",
        sub: finalSub,
        setFlags,
        w,
        rd: rd.n,
        rdSp: rd.role === "sp",
        rn: rn.n,
        rnSp: rn.role === "sp",
        src: { t: "imm", v: shifted },
      };
    }

    // Register second source. `sp` as the second source is never allowed.
    if (rm.role === "sp") return fail("operand.noSp", { text: third.text }, third.col);
    const spInvolved = rd.role === "sp" || rn.role === "sp";
    const next = r.peek();
    const nextWord = shiftWord(next);
    const nextIsExtend = nextWord !== null && isExtendKind(nextWord);
    const extended = spInvolved || nextIsExtend || rm.width !== w;
    if (!extended) {
      if (alias === "neg" && rd.role === "sp") {
        return fail("operand.noSp", { text: r.c.text }, r.c.col);
      }
      noteRegs();
      r.note(third, rm);
      const hasShift = r.more();
      const src = shiftedSource(r, rm, w, false, hasShift);
      r.end();
      return {
        k: "addsub",
        sub,
        setFlags,
        w,
        rd: rd.n,
        rdSp: false,
        rn: rn.n,
        rnSp: false,
        src,
      };
    }
    // Extended register.
    if (alias === "neg") {
      if (next === undefined) return fail("operand.width", { text: r.c.text }, r.c.col);
      return fail("shift.notAllowed", { text: next.text }, next.col);
    }
    if (setFlags ? rd.role === "sp" : rd.role === "zero") {
      const at = rdPair ? rdPair.op : third;
      return fail(setFlags ? "operand.noSp" : "operand.noZr", { text: at.text }, at.col);
    }
    if (rn.role === "zero" && rnPair) {
      return fail("operand.noZr", { text: rnPair.op.text }, rnPair.op.col);
    }
    if (w === 32 && rm.width !== 32) return fail("operand.width", { text: r.c.text }, r.c.col);
    noteRegs();
    r.note(third, rm);
    // With `sp` in the instruction the extend may be left out, or written `lsl`: it is then
    // `uxtx` for an x register and `uxtw` for a w register.
    let extend: ExtendKind = rm.width === 64 ? "uxtx" : "uxtw";
    let amount = 0;
    if (r.more()) {
      const s = readShift(r);
      if (isExtendKind(s.name)) {
        extend = s.name;
        amount = s.amount === null ? 0 : amountIn(s, 0, 4);
      } else if (s.name === "lsl" && spInvolved) {
        amount = amountIn(s, 0, 4);
      } else {
        return fail("shift.extendExpected", { text: s.op.text }, s.op.col);
      }
    } else if (!spInvolved && rm.width !== w) {
      return fail("operand.extendMissing", { text: third.text }, third.col);
    }
    r.end();
    return {
      k: "addsub",
      sub,
      setFlags,
      w,
      rd: rd.n,
      rdSp: rd.role === "sp",
      rn: rn.n,
      rnSp: rn.role === "sp",
      src: { t: "extended", rm: rm.n, extend, amount },
    };
  };
}

// ---------------------------------------------------------------------------------------------
// Logical

type LogicName = "and" | "orr" | "eor";

function logicHandler(
  name: LogicName,
  invert: boolean,
  setFlags: boolean,
  alias: "none" | "tst" | "mvn",
  immAllowed: boolean,
  bicImm: boolean,
): Handler {
  return (r) => {
    const rdPair = alias === "tst" ? null : r.anyReg();
    const rnPair = alias === "mvn" ? null : r.anyReg();
    const third = r.raw();
    const rd: RegName =
      rdPair?.tok ??
      ({ n: 31, width: (rnPair as { tok: RegName }).tok.width, role: "zero" } as const);
    const rn: RegName = rnPair?.tok ?? ({ n: 31, width: rd.width, role: "zero" } as const);
    const w = rd.width;
    if (rd.width !== rn.width) return fail("operand.width", { text: r.c.text }, r.c.col);
    const rm = parseRegName(third.text);
    if (rm === null) {
      if (!immAllowed || alias === "mvn") {
        return fail("operand.register", { text: third.text }, third.col);
      }
      if (setFlags ? rd.role === "sp" : rd.role === "zero") {
        const at = rdPair ? rdPair.op : third;
        return fail(setFlags ? "operand.noSp" : "operand.noZr", { text: at.text }, at.col);
      }
      if (rn.role === "sp") {
        return fail(
          "operand.noSp",
          { text: (rnPair as { op: RawOp }).op.text },
          (rnPair as { op: RawOp }).op.col,
        );
      }
      if (rdPair) r.note(rdPair.op, rd);
      if (rnPair) r.note(rnPair.op, rn);
      const value = r.number(third);
      r.parsed.push({ kind: "imm", text: third.text, value });
      r.end();
      const refused = (): never =>
        fail(
          bicImm ? "immediate.bitmaskBic" : "immediate.bitmask",
          { text: third.text, bits: w, repeats: w === 32 ? "2, 4, 8 or 16" : "2, 4, 8, 16 or 32" },
          third.col,
        );
      const pat = immediatePattern(value, w);
      if (pat === null) return refused();
      const used = bicImm ? ~pat & maskOf(w) : pat;
      if (!isBitmaskImmediate(used, w)) return refused();
      return {
        k: "logic",
        op: name,
        invert: false,
        setFlags,
        w,
        rd: rd.n,
        rdSp: rd.role === "sp",
        rn: rn.n,
        src: { t: "imm", v: used },
      };
    }
    for (const t of [rd, rn, rm]) {
      if (t.role === "sp") {
        const at = t === rd ? rdPair?.op : t === rn ? rnPair?.op : third;
        return fail("operand.noSp", { text: (at ?? third).text }, (at ?? third).col);
      }
    }
    if (rm.width !== w) return fail("operand.width", { text: r.c.text }, r.c.col);
    if (rdPair) r.note(rdPair.op, rd);
    if (rnPair) r.note(rnPair.op, rn);
    r.note(third, rm);
    const src = shiftedSource(r, rm, w, true, r.more());
    r.end();
    return {
      k: "logic",
      op: name,
      invert,
      setFlags,
      w,
      rd: rd.n,
      rdSp: false,
      rn: rn.n,
      src,
    };
  };
}

// ---------------------------------------------------------------------------------------------
// Shifts and bit fields

function bitfield(
  kind: "ubfm" | "sbfm" | "bfm",
  w: Width,
  rd: number,
  rn: number,
  immr: number,
  imms: number,
): Op {
  return { k: "bitfield", kind, w, rd, rn, immr, imms };
}

function shiftHandler(kind: ShiftKind): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    same(rd, rn, r);
    const w = rd.width;
    const third = r.raw();
    const rm = parseRegName(third.text);
    if (rm !== null) {
      if (rm.role === "sp") return fail("operand.noSp", { text: third.text }, third.col);
      r.note(third, rm);
      r.end();
      same(rd, rm, r);
      return { k: "shiftv", kind, w, rd: rd.n, rn: rn.n, rm: rm.n };
    }
    const value = r.number(third);
    r.parsed.push({ kind: "imm", text: third.text, value });
    r.end();
    checkFits(value, 0n, BigInt(w - 1), third);
    const s = Number(value);
    switch (kind) {
      case "lsl":
        return bitfield("ubfm", w, rd.n, rn.n, (w - s) % w, w - 1 - s);
      case "lsr":
        return bitfield("ubfm", w, rd.n, rn.n, s, w - 1);
      case "asr":
        return bitfield("sbfm", w, rd.n, rn.n, s, w - 1);
      case "ror":
        return { k: "extr", w, rd: rd.n, rn: rn.n, rm: rn.n, lsb: s };
    }
  };
}

function fieldHandler(name: "ubfx" | "sbfx" | "ubfiz" | "sbfiz" | "bfi" | "bfxil"): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    same(rd, rn, r);
    const w = rd.width;
    const lsb = r.imm();
    checkFits(lsb.value, 0n, BigInt(w - 1), lsb.op);
    const width = r.imm();
    checkFits(width.value, 1n, BigInt(w) - lsb.value, width.op);
    r.end();
    const l = Number(lsb.value);
    const n = Number(width.value);
    const insert = name === "ubfiz" || name === "sbfiz" || name === "bfi";
    const kind = name.startsWith("ub") ? "ubfm" : name.startsWith("sb") ? "sbfm" : "bfm";
    return insert
      ? bitfield(kind, w, rd.n, rn.n, (w - l) % w, n - 1)
      : bitfield(kind, w, rd.n, rn.n, l, l + n - 1);
  };
}

function extendHandler(name: "uxtb" | "uxth" | "sxtb" | "sxth" | "sxtw"): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    if (rn.width !== 32 || (name === "sxtw" && rd.width !== 64)) {
      return fail("operand.width", { text: r.c.text }, r.c.col);
    }
    r.end();
    const top = name.endsWith("b") ? 7 : name.endsWith("h") ? 15 : 31;
    // `uxtb x0, w1` is accepted and means `uxtb w0, w1`, which also clears the top half.
    const w: Width = name.startsWith("u") ? 32 : rd.width;
    return bitfield(name.startsWith("u") ? "ubfm" : "sbfm", w, rd.n, rn.n, 0, top);
  };
}

// ---------------------------------------------------------------------------------------------
// Conditional select, multiply, divide

function selHandler(kind: "csel" | "csinc" | "csinv" | "csneg"): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    const rm = r.regZr();
    same(rd, rn, r);
    same(rd, rm, r);
    const { cond } = r.cond();
    r.end();
    return { k: "csel", kind, w: rd.width, rd: rd.n, rn: rn.n, rm: rm.n, cond };
  };
}

function setHandler(kind: "csinc" | "csinv"): Handler {
  return (r) => {
    const rd = r.regZr();
    const { cond, op } = r.cond();
    r.end();
    if (cond === "al") return fail("operand.conditionAl", { text: op.text }, op.col);
    return {
      k: "csel",
      kind,
      w: rd.width,
      rd: rd.n,
      rn: 31,
      rm: 31,
      cond: invertCond(cond),
    };
  };
}

function incHandler(kind: "csinc" | "csneg"): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    same(rd, rn, r);
    const { cond, op } = r.cond();
    r.end();
    if (cond === "al") return fail("operand.conditionAl", { text: op.text }, op.col);
    return {
      k: "csel",
      kind,
      w: rd.width,
      rd: rd.n,
      rn: rn.n,
      rm: rn.n,
      cond: invertCond(cond),
    };
  };
}

function maddHandler(sub: boolean, alias: boolean): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    const rm = r.regZr();
    same(rd, rn, r);
    same(rd, rm, r);
    let ra = 31;
    if (!alias) {
      const t = r.regZr();
      same(rd, t, r);
      ra = t.n;
    }
    r.end();
    return { k: "madd", sub, w: rd.width, rd: rd.n, rn: rn.n, rm: rm.n, ra };
  };
}

function longMulHandler(signed: boolean, sub: boolean, alias: boolean): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    const rm = r.regZr();
    if (rd.width !== 64 || rn.width !== 32 || rm.width !== 32) {
      return fail("operand.width", { text: r.c.text }, r.c.col);
    }
    let ra = 31;
    if (!alias) {
      const t = r.regZr();
      if (t.width !== 64) return fail("operand.width", { text: r.c.text }, r.c.col);
      ra = t.n;
    }
    r.end();
    return { k: "maddl", signed, sub, rd: rd.n, rn: rn.n, rm: rm.n, ra };
  };
}

function mulhHandler(signed: boolean): Handler {
  return (r) => {
    const rd = r.regX();
    const rn = r.regX();
    const rm = r.regX();
    r.end();
    return { k: "mulh", signed, rd: rd.n, rn: rn.n, rm: rm.n };
  };
}

function divHandler(signed: boolean): Handler {
  return (r) => {
    const rd = r.regZr();
    const rn = r.regZr();
    const rm = r.regZr();
    same(rd, rn, r);
    same(rd, rm, r);
    r.end();
    return { k: "div", signed, w: rd.width, rd: rd.n, rn: rn.n, rm: rm.n };
  };
}

// ---------------------------------------------------------------------------------------------
// Memory

interface MemOperand {
  base: RegName;
  /** `null` for a register offset. */
  offset: bigint | null;
  /** True when the offset came from `:lo12:`. */
  lo12: boolean;
  /** True when an offset was written (`[x1, 0]` counts; `[x1]` does not). */
  hasOffset: boolean;
  index: {
    tok: RegName;
    extend: "lsl" | "uxtw" | "sxtw" | "sxtx" | null;
    amount: bigint | null;
    shiftOp: RawOp | null;
  } | null;
  writeback: boolean;
  raw: RawOp;
}

/** Split `text` at top-level commas, keeping each part's column. */
export function splitOperands(text: string, col: number): RawOp[] {
  const out: RawOp[] = [];
  let depth = 0;
  let quote = false;
  let start = 0;
  for (let i = 0; i <= text.length; i++) {
    const c = text[i];
    if (c === '"' && text[i - 1] !== "\\") quote = !quote;
    if (!quote) {
      if (c === "[" || c === "(") depth++;
      if (c === "]" || c === ")") depth--;
    }
    if (i === text.length || (c === "," && depth === 0 && !quote)) {
      const piece = text.slice(start, i);
      const lead = piece.length - piece.trimStart().length;
      out.push({ text: piece.trim(), col: col + start + lead });
      start = i + 1;
    }
  }
  return out;
}

function parseMem(r: Reader, op: RawOp): MemOperand {
  const text = op.text;
  // `ldr x0, label` and `ldr x0, =value` are real, and not in the machine.
  if (!text.startsWith("[")) return fail("notInMachine", { text: r.c.text }, op.col);
  const close = text.indexOf("]");
  if (close < 0) return fail("mem.syntax", { text: op.text }, op.col);
  const tail = text.slice(close + 1).trim();
  if (tail !== "" && tail !== "!") return fail("mem.syntax", { text: op.text }, op.col);
  const inner = text.slice(1, close);
  const parts = splitOperands(inner, op.col + 1);
  const baseOp = parts[0] as RawOp;
  const base = parseRegName(baseOp.text);
  if (base === null || base.width !== 64 || base.role === "zero") {
    return fail("mem.base", { text: baseOp.text }, baseOp.col);
  }
  const writeback = tail === "!";
  const result: MemOperand = {
    base,
    offset: 0n,
    lo12: false,
    hasOffset: false,
    index: null,
    writeback,
    raw: op,
  };
  if (parts.length === 1) {
    if (writeback) return fail("mem.preNeedsOffset", { text: op.text }, op.col);
    return result;
  }
  if (parts.length > 3) return fail("mem.syntax", { text: op.text }, op.col);
  const second = parts[1] as RawOp;
  const reg = parseRegName(second.text);
  if (reg !== null) {
    if (writeback) return fail("mem.registerPre", { text: op.text }, op.col);
    if (reg.role === "sp") return fail("mem.index", { text: second.text }, second.col);
    const third = parts[2];
    let extend: "lsl" | "uxtw" | "sxtw" | "sxtx" | null = null;
    let amount: bigint | null = null;
    if (third !== undefined) {
      const m = /^\s*([a-z]+)\s*(.*)$/is.exec(third.text);
      const name = m && sameCase(m[1] as string) ? (m[1] as string).toLowerCase() : "";
      if (!m || name === "") return fail("mem.syntax", { text: op.text }, op.col);
      if (name === "lsl" || name === "uxtw" || name === "sxtw" || name === "sxtx") {
        extend = name;
      } else if (isShiftKind(name) || isExtendKind(name)) {
        return fail("mem.extend", { text: third.text }, third.col);
      } else {
        return fail("mem.syntax", { text: op.text }, op.col);
      }
      const rest = (m[2] as string).trim();
      if (rest === "") {
        if (name === "lsl") return fail("mem.shiftMissing", { text: third.text }, third.col);
      } else {
        amount = r.number({ text: rest, col: third.col + third.text.length - rest.length });
      }
    }
    result.offset = null;
    result.index = { tok: reg, extend, amount, shiftOp: third ?? null };
    return result;
  }
  if (parts.length === 3) return fail("mem.syntax", { text: op.text }, op.col);
  // An immediate offset, or `:lo12:`.
  const bare = Reader.bare(second);
  result.hasOffset = true;
  if (bare.text.startsWith(":")) {
    const m = /^:lo12:(.*)$/is.exec(bare.text);
    if (!m) return fail(relocKey(bare.text), { text: r.c.text }, second.col);
    if (writeback) return fail("reloc.notHere", { text: second.text }, second.col);
    const e = evaluate((m[1] as string).trim(), bare.col + 6, r.c.lookup, BigInt(r.c.address));
    result.offset = e.value & 0xfffn;
    result.lo12 = true;
    return result;
  }
  result.offset = r.number(second);
  return result;
}

interface LdstSpec {
  load: boolean;
  /** Fixed register width, or `null` when either is allowed. */
  width: Width | null;
  /** Fixed access size in bytes, or `null` to follow the register width. */
  size: 1 | 2 | 4 | 8 | null;
  signed: boolean;
  unscaled: boolean;
}

function memHandler(spec: LdstSpec): Handler {
  return (r) => {
    const rt = r.regZr();
    if (spec.width !== null && rt.width !== spec.width) {
      return fail("operand.width", { text: r.c.text }, r.c.col);
    }
    const memOp = r.raw();
    const mem = parseMem(r, memOp);
    const size: 1 | 2 | 4 | 8 = spec.size ?? (rt.width === 64 ? 8 : 4);
    const log = Math.log2(size);
    let addr: Addressing;
    let mode: "offset" | "pre" | "post" | "register" = "offset";
    let shownOffset: bigint | null = null;
    let shownIndex: number | null = null;

    if (mem.index !== null) {
      if (spec.unscaled) return fail("mem.unscaledForm", { text: memOp.text }, memOp.col);
      const ix = mem.index;
      const e = ix.extend;
      if (ix.tok.width === 64) {
        if (e === "uxtw" || e === "sxtw")
          return fail("mem.indexWidth", { text: memOp.text }, memOp.col);
      } else if (e !== "uxtw" && e !== "sxtw") {
        return fail("mem.indexWidth", { text: memOp.text }, memOp.col);
      }
      let amount = 0;
      if (ix.amount !== null) {
        if (ix.amount !== 0n && ix.amount !== BigInt(log)) {
          return fail("mem.shiftAmount", { text: memOp.text, size, log }, memOp.col);
        }
        amount = Number(ix.amount);
      }
      addr = {
        kind: "reg",
        base: mem.base.n,
        index: ix.tok.n,
        extend: e ?? "lsl",
        shift: amount,
      };
      mode = "register";
      shownIndex = ix.tok.n;
      r.parsed.push({
        kind: "mem",
        text: memOp.text,
        base: mem.base.n,
        mode,
        offset: null,
        index: shownIndex,
      });
      r.end();
      return { k: "ldst", load: spec.load, size, signed: spec.signed, w: rt.width, rt: rt.n, addr };
    }

    let offset = mem.offset as bigint;
    let writeback: "none" | "pre" | "post" = "none";
    let post: RawOp | null = null;
    if (r.more()) {
      // Post-index: `[xn], imm`.
      if (mem.hasOffset || mem.writeback) {
        return fail("mem.indexMix", { text: memOp.text }, memOp.col);
      }
      post = r.raw();
      if (parseRegName(post.text) !== null) {
        return fail("mem.postRegister", { text: post.text }, post.col);
      }
      offset = r.number(post);
      writeback = "post";
      mode = "post";
    } else if (mem.writeback) {
      writeback = "pre";
      mode = "pre";
    } else if (mem.hasOffset) {
      mode = "offset";
    }
    r.end();
    if (spec.unscaled && writeback !== "none") {
      return fail("mem.unscaledWriteback", { text: memOp.text }, memOp.col);
    }
    shownOffset = offset;
    const at = post ?? memOp;
    if (mem.lo12) {
      if (offset % BigInt(size) !== 0n) {
        return fail("mem.loMisaligned", { text: memOp.text, size }, memOp.col);
      }
      if (spec.unscaled) return fail("reloc.notHere", { text: memOp.text }, memOp.col);
    } else if (writeback !== "none" || spec.unscaled) {
      if (offset < -256n || offset > 255n) {
        return fail("mem.offsetUnscaled", { text: at.text }, at.col);
      }
    } else {
      const scaled = offset >= 0n && offset % BigInt(size) === 0n && offset / BigInt(size) <= 4095n;
      if (!scaled && (offset < -256n || offset > 255n)) {
        return fail("mem.offset", { text: at.text, size, max: 4095 * size }, at.col);
      }
    }
    addr = { kind: "imm", base: mem.base.n, offset, writeback };
    r.parsed.push({
      kind: "mem",
      text: memOp.text + (post ? ", " + post.text : ""),
      base: mem.base.n,
      mode,
      offset: shownOffset,
      index: null,
    });
    return { k: "ldst", load: spec.load, size, signed: spec.signed, w: rt.width, rt: rt.n, addr };
  };
}

function pairHandler(load: boolean): Handler {
  return (r) => {
    const rt = r.regZr();
    const rt2 = r.regZr();
    same(rt, rt2, r);
    const memOp = r.raw();
    const mem = parseMem(r, memOp);
    if (mem.index !== null) return fail("mem.pairForm", { text: memOp.text }, memOp.col);
    const size: 4 | 8 = rt.width === 64 ? 8 : 4;
    let offset = mem.offset as bigint;
    let writeback: "none" | "pre" | "post" = "none";
    let post: RawOp | null = null;
    if (r.more()) {
      if (mem.hasOffset || mem.writeback) {
        return fail("mem.indexMix", { text: memOp.text }, memOp.col);
      }
      post = r.raw();
      if (parseRegName(post.text) !== null) {
        return fail("mem.postRegister", { text: post.text }, post.col);
      }
      offset = r.number(post);
      writeback = "post";
    } else if (mem.writeback) {
      writeback = "pre";
    }
    r.end();
    const at = post ?? memOp;
    if (mem.lo12) return fail("reloc.notHere", { text: memOp.text }, memOp.col);
    if (offset % BigInt(size) !== 0n) {
      return fail("mem.multiple", { text: at.text, size }, at.col);
    }
    const lo = BigInt(-64 * size);
    const hi = BigInt(63 * size);
    if (offset < lo || offset > hi) {
      return fail("immediate.range", { text: at.text, min: Number(lo), max: Number(hi) }, at.col);
    }
    r.parsed.push({
      kind: "mem",
      text: memOp.text + (post ? ", " + post.text : ""),
      base: mem.base.n,
      mode: writeback === "pre" ? "pre" : writeback === "post" ? "post" : "offset",
      offset,
      index: null,
    });
    return {
      k: "ldstp",
      load,
      size,
      w: rt.width,
      rt: rt.n,
      rt2: rt2.n,
      base: mem.base.n,
      offset,
      writeback,
    };
  };
}

// ---------------------------------------------------------------------------------------------
// Addresses and branches

function adrHandler(page: boolean): Handler {
  return (r) => {
    const rd = r.regX();
    const { value, op } = r.address(!page);
    r.end();
    const target = BigInt.asUintN(64, value);
    if (!page) {
      const delta = BigInt.asIntN(64, target - BigInt(r.c.address));
      if (delta < -0x100000n || delta > 0xfffffn) {
        return fail("branch.range", { text: op.text }, op.col);
      }
    }
    return { k: "adr", page, rd: rd.n, target };
  };
}

function checkBranch(r: Reader, value: bigint, op: RawOp, lo: bigint, hi: bigint): bigint {
  const target = BigInt.asUintN(64, value);
  const delta = BigInt.asIntN(64, target - BigInt(r.c.address));
  if (delta % 4n !== 0n) return fail("branch.align", { text: op.text }, op.col);
  if (delta < lo || delta > hi) return fail("branch.range", { text: op.text }, op.col);
  return target;
}

const b: Handler = (r) => {
  const { value, op } = r.address();
  r.end();
  return { k: "b", link: false, target: checkBranch(r, value, op, -0x8000000n, 0x7fffffcn) };
};
const bl: Handler = (r) => {
  const { value, op } = r.address();
  r.end();
  return { k: "b", link: true, target: checkBranch(r, value, op, -0x8000000n, 0x7fffffcn) };
};

function condBranch(cond: Cond): Handler {
  return (r) => {
    const { value, op } = r.address();
    r.end();
    return { k: "bcond", cond, target: checkBranch(r, value, op, -0x100000n, 0xffffcn) };
  };
}

function cbzHandler(nonZero: boolean): Handler {
  return (r) => {
    const rt = r.regZr();
    const { value, op } = r.address();
    r.end();
    return {
      k: "cbz",
      nonZero,
      w: rt.width,
      rt: rt.n,
      target: checkBranch(r, value, op, -0x100000n, 0xffffcn),
    };
  };
}

function tbzHandler(nonZero: boolean): Handler {
  return (r) => {
    const rt = r.regZr();
    const bit = r.imm();
    // Bits 32 to 63 need an `x` register; GNU as takes `tbz x0, 5, ...` and `tbz w0, 5, ...` alike.
    checkFits(bit.value, 0n, rt.width === 64 ? 63n : 31n, bit.op);
    const { value, op } = r.address();
    r.end();
    return {
      k: "tbz",
      nonZero,
      rt: rt.n,
      bit: Number(bit.value),
      target: checkBranch(r, value, op, -0x8000n, 0x7ffcn),
    };
  };
}

function brHandler(link: boolean): Handler {
  return (r) => {
    const rn = r.regX();
    r.end();
    return { k: "br", link, rn: rn.n };
  };
}

const ret: Handler = (r) => {
  let n = 30;
  if (r.more()) n = r.regX().n;
  r.end();
  return { k: "ret", rn: n };
};

const nop: Handler = (r) => {
  r.end();
  return { k: "nop" };
};

// ---------------------------------------------------------------------------------------------
// The table

const ldst = (
  load: boolean,
  width: Width | null,
  size: 1 | 2 | 4 | 8 | null,
  signed = false,
  unscaled = false,
): Handler => memHandler({ load, width, size, signed, unscaled });

const HANDLERS: Record<string, Handler> = {
  mov,
  movz: wide("movz"),
  movn: wide("movn"),
  movk: wide("movk"),
  add: addsubHandler(false, false, "none"),
  adds: addsubHandler(false, true, "none"),
  sub: addsubHandler(true, false, "none"),
  subs: addsubHandler(true, true, "none"),
  cmp: addsubHandler(true, true, "cmp"),
  cmn: addsubHandler(false, true, "cmp"),
  neg: addsubHandler(true, false, "neg"),
  negs: addsubHandler(true, true, "neg"),
  and: logicHandler("and", false, false, "none", true, false),
  ands: logicHandler("and", false, true, "none", true, false),
  orr: logicHandler("orr", false, false, "none", true, false),
  eor: logicHandler("eor", false, false, "none", true, false),
  bic: logicHandler("and", true, false, "none", true, true),
  bics: logicHandler("and", true, true, "none", false, false),
  orn: logicHandler("orr", true, false, "none", false, false),
  eon: logicHandler("eor", true, false, "none", false, false),
  mvn: logicHandler("orr", true, false, "mvn", false, false),
  tst: logicHandler("and", false, true, "tst", true, false),
  lsl: shiftHandler("lsl"),
  lsr: shiftHandler("lsr"),
  asr: shiftHandler("asr"),
  ror: shiftHandler("ror"),
  ubfx: fieldHandler("ubfx"),
  sbfx: fieldHandler("sbfx"),
  ubfiz: fieldHandler("ubfiz"),
  sbfiz: fieldHandler("sbfiz"),
  bfi: fieldHandler("bfi"),
  bfxil: fieldHandler("bfxil"),
  uxtb: extendHandler("uxtb"),
  uxth: extendHandler("uxth"),
  sxtb: extendHandler("sxtb"),
  sxth: extendHandler("sxth"),
  sxtw: extendHandler("sxtw"),
  csel: selHandler("csel"),
  csinc: selHandler("csinc"),
  csinv: selHandler("csinv"),
  csneg: selHandler("csneg"),
  cset: setHandler("csinc"),
  csetm: setHandler("csinv"),
  cinc: incHandler("csinc"),
  cneg: incHandler("csneg"),
  mul: maddHandler(false, true),
  madd: maddHandler(false, false),
  msub: maddHandler(true, false),
  mneg: maddHandler(true, true),
  smull: longMulHandler(true, false, true),
  umull: longMulHandler(false, false, true),
  smaddl: longMulHandler(true, false, false),
  umaddl: longMulHandler(false, false, false),
  smulh: mulhHandler(true),
  umulh: mulhHandler(false),
  sdiv: divHandler(true),
  udiv: divHandler(false),
  ldr: ldst(true, null, null),
  str: ldst(false, null, null),
  ldrb: ldst(true, 32, 1),
  strb: ldst(false, 32, 1),
  ldrh: ldst(true, 32, 2),
  strh: ldst(false, 32, 2),
  ldrsb: ldst(true, null, 1, true),
  ldrsh: ldst(true, null, 2, true),
  ldrsw: ldst(true, 64, 4, true),
  ldur: ldst(true, null, null, false, true),
  stur: ldst(false, null, null, false, true),
  ldp: pairHandler(true),
  stp: pairHandler(false),
  adr: adrHandler(false),
  adrp: adrHandler(true),
  b,
  bl,
  blr: brHandler(true),
  br: brHandler(false),
  ret,
  cbz: cbzHandler(false),
  cbnz: cbzHandler(true),
  tbz: tbzHandler(false),
  tbnz: tbzHandler(true),
  nop,
};

/** True when the mnemonic is one the machine has. */
export function isKnownMnemonic(mnemonic: string): boolean {
  return Object.hasOwn(HANDLERS, mnemonic) || isConditionalBranch(mnemonic);
}

/** The mnemonics of the subset (conditional branches are `b.cond`). */
export function subsetMnemonics(): string[] {
  return [...Object.keys(HANDLERS), "b.cond"].sort();
}

/** The name the instruction gate uses for a mnemonic. */
export function gateName(mnemonic: string): string {
  return isConditionalBranch(mnemonic) ? "b.cond" : mnemonic;
}

/** Build the instruction. Throws `AsmFail` for the first thing wrong with it. */
export function buildInstruction(ctx: FormContext): FormResult {
  const r = new Reader(ctx);
  let handler = Object.hasOwn(HANDLERS, ctx.mnemonic) ? HANDLERS[ctx.mnemonic] : undefined;
  if (handler === undefined && isConditionalBranch(ctx.mnemonic)) {
    const name = ctx.mnemonic.replace(/^b\.?/, "");
    const cond = parseCond(name) as Cond;
    handler = condBranch(cond);
  }
  if (handler === undefined) return fail("notInMachine", { text: ctx.text }, ctx.col);
  // `sub w0 w0 w1`: an operand that is a register followed by more words is two operands with no
  // comma between them. No valid operand starts with a register and a space (a shift is its own
  // operand, after a comma, and a memory operand starts with a bracket).
  for (const o of ctx.ops) {
    const words = o.text.split(/\s+/);
    const first = words[0] ?? "";
    if (words.length > 1 && parseRegName(first) !== null) {
      return fail("syntax.missingComma", { text: o.text, after: first }, o.col);
    }
  }
  const op = handler(r);
  return { op, operands: r.parsed };
}
