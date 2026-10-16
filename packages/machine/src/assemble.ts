// Copyright © 2026 Christopher Snow

// The assembler: GNU as's syntax for the subset in docs/machine.md, laid out at the course's fixed
// addresses. Two passes: the first reads lines and measures them, the second resolves symbols,
// checks every instruction's operands and fills the bytes.

import { AsmFail, evaluate } from "./expr.ts";
import { buildInstruction, gateName, isKnownMnemonic, splitOperands, type RawOp } from "./forms.ts";
import { DATA_BASE, STACK_BASE, TEXT_BASE } from "./layout.ts";
import type { MessageKey } from "./strings.ts";
import type {
  AsmError,
  AssembleOptions,
  AssembleResult,
  Instruction,
  Params,
  Program,
  ProgramSymbol,
  Section,
  SectionKind,
} from "./types.ts";

// ---------------------------------------------------------------------------------------------
// Lexing

interface Statement {
  text: string;
  /** 1-based column of the first character of `text`. */
  col: number;
  line: number;
}

/** Blank out comments, keeping every other character in its column. */
function stripComments(lines: string[]): string[] {
  const out: string[] = [];
  let inBlock = false;
  for (const line of lines) {
    let res = "";
    let inString = false;
    let i = 0;
    while (i < line.length) {
      const c = line[i] as string;
      if (inBlock) {
        if (c === "*" && line[i + 1] === "/") {
          inBlock = false;
          res += "  ";
          i += 2;
        } else {
          res += " ";
          i++;
        }
        continue;
      }
      if (inString) {
        res += c;
        if (c === "\\" && i + 1 < line.length) {
          res += line[i + 1] as string;
          i += 2;
          continue;
        }
        if (c === '"') inString = false;
        i++;
        continue;
      }
      if (c === '"') {
        inString = true;
        res += c;
        i++;
        continue;
      }
      if (c === "/" && line[i + 1] === "/") {
        res += " ".repeat(line.length - i);
        break;
      }
      if (c === "/" && line[i + 1] === "*") {
        inBlock = true;
        res += "  ";
        i += 2;
        continue;
      }
      res += c;
      i++;
    }
    // A `#` that starts a line (after blanks) makes the whole line a comment.
    out.push(/^\s*#/.test(res) ? " ".repeat(res.length) : res);
  }
  return out;
}

/** Split a line at `;` outside strings. */
function statements(clean: string, line: number): Statement[] {
  const out: Statement[] = [];
  let inString = false;
  let start = 0;
  for (let i = 0; i <= clean.length; i++) {
    const c = clean[i];
    if (i < clean.length) {
      if (inString) {
        if (c === "\\") i++;
        else if (c === '"') inString = false;
        continue;
      }
      if (c === '"') {
        inString = true;
        continue;
      }
    }
    if (i === clean.length || c === ";") {
      out.push({ text: clean.slice(start, i), col: start + 1, line });
      start = i + 1;
    }
  }
  return out;
}

const LABEL = /^\s*([A-Za-z_.$][A-Za-z0-9_.$]*)\s*:/;

// ---------------------------------------------------------------------------------------------
// Items

type Item =
  | { k: "label"; name: string; line: number; col: number; offset: number }
  | {
      k: "insn";
      line: number;
      col: number;
      offset: number;
      mnemonic: string;
      text: string;
      ops: RawOp[];
      /** Zero bytes before the instruction, to put it on a 4-byte boundary. */
      lead: number;
    }
  | {
      k: "data";
      line: number;
      col: number;
      offset: number;
      unit: 1 | 2 | 4 | 8;
      values: RawOp[];
    }
  | { k: "bytes"; line: number; col: number; offset: number; bytes: number[] }
  | { k: "pad"; line: number; col: number; offset: number; size: number; fill: number | null };

interface SectionDraft {
  name: string;
  kind: SectionKind;
  items: Item[];
  size: number;
  align: number;
  base: number;
}

const kindOf = (name: string): SectionKind | "ignored" | null => {
  const n = name.replace(/^"|"$/g, "");
  if (n === ".text" || n.startsWith(".text.")) return "text";
  if (n === ".data" || n.startsWith(".data.")) return "data";
  if (n === ".rodata" || n.startsWith(".rodata.")) return "rodata";
  if (n === ".bss" || n.startsWith(".bss.")) return "bss";
  if (n.startsWith(".note")) return "ignored";
  return null;
};

const IGNORED_DIRECTIVES = new Set([
  ".arch",
  ".file",
  ".ident",
  ".type",
  ".size",
  ".global",
  ".globl",
]);

function parseString(text: string, col: number): number[] {
  const t = text.trim();
  if (!t.startsWith('"') || !t.endsWith('"') || t.length < 2) {
    throw new AsmFail("directive.string", { text: t }, col);
  }
  const body = t.slice(1, -1);
  const out: number[] = [];
  for (let i = 0; i < body.length; i++) {
    const c = body[i] as string;
    if (c !== "\\") {
      out.push(...new TextEncoder().encode(c));
      continue;
    }
    i++;
    const e = body[i];
    if (e === undefined) throw new AsmFail("directive.string", { text: t }, col);
    const simple: Record<string, number> = { n: 10, t: 9, r: 13, b: 8, f: 12, '"': 34, "\\": 92 };
    if (simple[e] !== undefined) out.push(simple[e] as number);
    else if (/[0-7]/.test(e)) {
      let digits = e;
      while (digits.length < 3 && /[0-7]/.test(body[i + 1] ?? "")) digits += body[++i];
      out.push(parseInt(digits, 8) & 0xff);
    } else if (e === "x") {
      let digits = "";
      while (digits.length < 2 && /[0-9a-fA-F]/.test(body[i + 1] ?? "")) digits += body[++i];
      if (digits === "") throw new AsmFail("directive.string", { text: t }, col);
      out.push(parseInt(digits, 16));
    } else {
      out.push(...new TextEncoder().encode(e));
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// The assembler

export function assemble(source: string, options: AssembleOptions = {}): AssembleResult {
  const lines = source.split(/\r?\n/);
  const clean = stripComments(lines);
  const errors: AsmError[] = [];
  const err = (line: number, column: number, key: MessageKey, params: Params = {}): void => {
    errors.push({ line, column, key, params });
  };
  const failAt = (line: number, e: unknown, fallbackCol: number): void => {
    if (e instanceof AsmFail) err(line, e.column ?? fallbackCol, e.key, e.params);
    else throw e;
  };

  const sections: SectionDraft[] = [];
  let current: SectionDraft | null = null;
  /** Section that swallows everything (`.note.GNU-stack`). */
  let ignoring = false;
  const byName = new Map<string, SectionDraft>();
  const section = (name: string, kind: SectionKind): SectionDraft => {
    let s = byName.get(name);
    if (!s) {
      s = { name, kind, items: [], size: 0, align: kind === "text" ? 4 : 1, base: 0 };
      byName.set(name, s);
      sections.push(s);
    }
    return s;
  };
  current = section(".text", "text");

  /** Symbols seen so far, as offsets inside their sections (pass 1), later as addresses. */
  const defined = new Map<string, { sec: SectionDraft; offset: number; line: number }>();
  let usePassOne = true;
  const lookup = (name: string): bigint | undefined => {
    const d = defined.get(name);
    if (!d) return undefined;
    return usePassOne ? BigInt(d.offset) : BigInt(d.sec.base + d.offset);
  };

  const push = (item: Item): void => {
    const sec = current as SectionDraft;
    sec.items.push(item);
  };

  const advance = (n: number): void => {
    (current as SectionDraft).size += n;
  };

  const alignTo = (sec: SectionDraft, a: number): number => {
    if (a > sec.align) sec.align = a;
    const rem = sec.size % a;
    return rem === 0 ? 0 : a - rem;
  };

  // ------------------------------------------------------------------ pass 1
  for (let li = 0; li < lines.length; li++) {
    const lineNo = li + 1;
    for (const st of statements(clean[li] as string, lineNo)) {
      let text = st.text;
      let col = st.col;
      // Labels.
      for (;;) {
        const m = LABEL.exec(text);
        if (!m) break;
        const name = m[1] as string;
        const sec = current as SectionDraft;
        if (defined.has(name)) {
          err(lineNo, col + text.indexOf(name), "label.duplicate", { name });
        } else if (!ignoring) {
          defined.set(name, { sec, offset: sec.size, line: lineNo });
          push({ k: "label", name, line: lineNo, col, offset: sec.size });
        }
        const used = m[0].length;
        text = text.slice(used);
        col += used;
      }
      const trimmed = text.trim();
      if (trimmed === "") continue;
      col += text.length - text.trimStart().length;
      const sec = current as SectionDraft;

      if (trimmed.startsWith(".")) {
        const m = /^(\.[A-Za-z0-9_]+)\s*(.*)$/s.exec(trimmed);
        if (!m) {
          err(lineNo, col, "notInMachine", { text: trimmed });
          continue;
        }
        const name = (m[1] as string).toLowerCase();
        const rest = m[2] as string;
        const restCol = col + trimmed.length - rest.length;
        try {
          directive(name, rest, restCol, trimmed, col, lineNo);
        } catch (e) {
          failAt(lineNo, e, col);
        }
        continue;
      }

      // An instruction.
      const m = /^([^\s]+)\s*(.*)$/s.exec(trimmed);
      const mnemonic = (m ? (m[1] as string) : trimmed).toLowerCase();
      const rest = m ? (m[2] as string).trim() : "";
      if (ignoring) continue;
      if (sec.kind !== "text") {
        err(lineNo, col, "instruction.outsideText", { text: trimmed });
        continue;
      }
      if (!/^[a-z][a-z0-9]*(\.[a-z0-9]+)?$/.test(mnemonic)) {
        err(lineNo, col, "notInMachine", { text: trimmed });
        continue;
      }
      let ops: RawOp[] = [];
      if (rest !== "") {
        const restCol = col + trimmed.length - rest.length;
        ops = splitOperands(rest, restCol);
      }
      const lead = alignTo(sec, 4);
      advance(lead);
      push({
        k: "insn",
        line: lineNo,
        col,
        offset: sec.size,
        mnemonic,
        text: trimmed,
        ops,
        lead,
      });
      advance(4);
    }
  }

  function directive(
    name: string,
    rest: string,
    restCol: number,
    whole: string,
    col: number,
    lineNo: number,
  ): void {
    const sec = current as SectionDraft;
    const startsWith = (p: string): boolean => name.startsWith(p);
    if (name === ".text" || name === ".data" || name === ".bss") {
      current = section(name, name.slice(1) as SectionKind);
      ignoring = false;
      return;
    }
    if (name === ".section") {
      const parts = splitOperands(rest, restCol);
      const first = parts[0];
      if (first === undefined || first.text === "") {
        throw new AsmFail("directive.operands", { text: whole }, col);
      }
      const nm = first.text.replace(/^"|"$/g, "");
      const kind = kindOf(nm);
      if (kind === null) throw new AsmFail("notInMachine", { text: whole }, col);
      if (kind === "ignored") {
        ignoring = true;
        return;
      }
      ignoring = false;
      current = section(nm, kind);
      return;
    }
    if (ignoring) return;
    if (IGNORED_DIRECTIVES.has(name) || startsWith(".cfi_")) {
      if (name === ".global" || name === ".globl") {
        const names = splitOperands(rest, restCol);
        if (rest.trim() === "" || names.some((n) => !/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(n.text))) {
          throw new AsmFail("directive.operands", { text: whole }, col);
        }
      }
      if (name === ".arch") {
        if (rest.trim() === "") throw new AsmFail("directive.operands", { text: whole }, col);
        if (!/^armv\d+(\.\d+)?-[ar](\+\w+)*$/i.test(rest.trim())) {
          throw new AsmFail("notInMachine", { text: whole }, col);
        }
      }
      if (name === ".type" || name === ".size") {
        if (splitOperands(rest, restCol).length < 2) {
          throw new AsmFail("directive.operands", { text: whole }, col);
        }
      }
      return;
    }
    const units: Record<string, 1 | 2 | 4 | 8> = {
      ".byte": 1,
      ".hword": 2,
      ".2byte": 2,
      ".word": 4,
      ".4byte": 4,
      ".quad": 8,
      ".8byte": 8,
    };
    const unit = units[name];
    if (unit !== undefined) {
      const values = splitOperands(rest, restCol);
      if (rest.trim() === "" || values.some((v) => v.text === "")) {
        throw new AsmFail("directive.operands", { text: whole }, col);
      }
      push({ k: "data", line: lineNo, col, offset: sec.size, unit, values });
      advance(unit * values.length);
      return;
    }
    if (name === ".ascii" || name === ".asciz" || name === ".string") {
      const parts = splitOperands(rest, restCol);
      if (rest.trim() === "" || parts.some((p) => p.text === "")) {
        throw new AsmFail("directive.operands", { text: whole }, col);
      }
      const bytes: number[] = [];
      for (const p of parts) {
        bytes.push(...parseString(p.text, p.col));
        if (name !== ".ascii") bytes.push(0);
      }
      push({ k: "bytes", line: lineNo, col, offset: sec.size, bytes });
      advance(bytes.length);
      return;
    }
    if (name === ".zero" || name === ".skip") {
      const parts = splitOperands(rest, restCol);
      if (rest.trim() === "" || parts.length > (name === ".zero" ? 1 : 2)) {
        throw new AsmFail("directive.operands", { text: whole }, col);
      }
      const n = constant(parts[0] as RawOp, whole);
      if (n < 0n) throw new AsmFail("directive.negative", { text: whole }, (parts[0] as RawOp).col);
      let fill = 0;
      if (parts[1] !== undefined) fill = Number(constant(parts[1], whole) & 0xffn);
      push({ k: "pad", line: lineNo, col, offset: sec.size, size: Number(n), fill });
      advance(Number(n));
      return;
    }
    if (name === ".align" || name === ".p2align" || name === ".balign") {
      const parts = splitOperands(rest, restCol);
      if (rest.trim() === "" || parts.length > 3) {
        throw new AsmFail("directive.operands", { text: whole }, col);
      }
      const arg = constant(parts[0] as RawOp, whole);
      let a: bigint;
      if (name === ".balign") {
        a = arg;
        if (a < 0n || (a & (a - 1n)) !== 0n) {
          throw new AsmFail("directive.alignment", { text: whole }, (parts[0] as RawOp).col);
        }
        if (a === 0n) a = 1n;
      } else {
        if (arg < 0n) {
          throw new AsmFail("directive.alignment", { text: whole }, (parts[0] as RawOp).col);
        }
        if (arg > 16n) throw new AsmFail("notInMachine", { text: whole }, col);
        a = 1n << arg;
      }
      let fill: number | null = null;
      if (parts[1] !== undefined && parts[1].text !== "") {
        fill = Number(constant(parts[1], whole) & 0xffn);
      }
      let max: bigint | null = null;
      if (parts[2] !== undefined && parts[2].text !== "") max = constant(parts[2], whole);
      // The sections live in 64 KiB of address space, so a bigger alignment cannot be kept.
      if (a > 65536n) throw new AsmFail("notInMachine", { text: whole }, col);
      const align = Number(a);
      let pad = alignTo(sec, align);
      if (max !== null && BigInt(pad) > max) pad = 0;
      if (pad > 0) {
        push({ k: "pad", line: lineNo, col, offset: sec.size, size: pad, fill });
        advance(pad);
      }
      return;
    }
    throw new AsmFail("notInMachine", { text: whole }, col);
  }

  function constant(op: RawOp, whole: string): bigint {
    const dot = BigInt((current as SectionDraft).size);
    const v = evaluate(op.text.replace(/^#/, ""), op.col, lookup, dot);
    // GNU as will not size or align by an address.
    if (v.usesSymbol) throw new AsmFail("symbol.notNumber", { text: op.text }, op.col);
    void whole;
    return v.value;
  }

  // ------------------------------------------------------------------ layout
  const order: SectionKind[] = ["text", "data", "rodata", "bss"];
  const regionStart: Record<SectionKind, number> = {
    text: TEXT_BASE,
    data: DATA_BASE,
    rodata: 0,
    bss: 0,
  };
  let cursor = DATA_BASE;
  let textEnd = TEXT_BASE;
  for (const kind of order) {
    const inKind = sections.filter((s) => s.kind === kind);
    if (inKind.length === 0) continue;
    const maxAlign = Math.max(...inKind.map((s) => s.align));
    let at: number;
    if (kind === "text") {
      at = TEXT_BASE;
    } else {
      at = Math.ceil(cursor / maxAlign) * maxAlign;
    }
    regionStart[kind] = at;
    for (const s of inKind) {
      at = Math.ceil(at / s.align) * s.align;
      s.base = at;
      at += s.size;
    }
    if (kind === "text") textEnd = at;
    else cursor = at;
  }
  if (textEnd > DATA_BASE) err(1, 1, "program.textTooBig", { limit: DATA_BASE - TEXT_BASE });
  if (cursor > STACK_BASE) err(1, 1, "program.dataTooBig", { limit: STACK_BASE - DATA_BASE });

  // ------------------------------------------------------------------ pass 2
  usePassOne = false;
  const instructions: Instruction[] = [];
  const outSections: Section[] = [];
  const symbols: Record<string, ProgramSymbol> = {};
  for (const [name, d] of defined) {
    symbols[name] = { name, address: d.sec.base + d.offset, section: d.sec.kind };
  }

  for (const s of sections) {
    const bytes = new Uint8Array(s.size);
    for (const item of s.items) {
      const at = s.base + item.offset;
      try {
        switch (item.k) {
          case "label":
            break;
          case "pad": {
            const isText = s.kind === "text";
            if (item.fill === null && isText && item.offset % 4 === 0 && item.size % 4 === 0) {
              for (let o = 0; o < item.size; o += 4) {
                instructions.push(nopAt(s.base + item.offset + o, item.line));
              }
            } else if (item.fill !== null) {
              bytes.fill(item.fill, item.offset, item.offset + item.size);
            }
            break;
          }
          case "bytes":
            bytes.set(item.bytes, item.offset);
            break;
          case "data": {
            let o = item.offset;
            for (const v of item.values) {
              const e = evaluate(
                v.text.replace(/^#/, ""),
                v.col,
                lookup,
                BigInt(at + (o - item.offset)),
              );
              // GNU as cannot put an address in one byte.
              if (item.unit === 1 && e.usesSymbol) {
                throw new AsmFail("symbol.notNumber", { text: v.text }, v.col);
              }
              if (s.kind === "bss" && BigInt.asUintN(item.unit * 8, e.value) !== 0n) {
                throw new AsmFail("section.bssNonZero", { text: v.text }, v.col);
              }
              let bits = BigInt.asUintN(item.unit * 8, e.value);
              for (let i = 0; i < item.unit; i++) {
                bytes[o + i] = Number(bits & 0xffn);
                bits >>= 8n;
              }
              o += item.unit;
            }
            break;
          }
          case "insn": {
            const address = at;
            if (options.allowed && isKnownMnemonic(item.mnemonic)) {
              if (!options.allowed.has(gateName(item.mnemonic))) {
                throw new AsmFail(
                  "gate.notYet",
                  { name: item.mnemonic, text: item.text },
                  item.col,
                );
              }
            }
            const built = buildInstruction({
              mnemonic: item.mnemonic,
              address,
              lookup,
              ops: item.ops,
              col: item.col,
              text: item.text,
            });
            instructions.push({
              address,
              line: item.line,
              text: item.text,
              mnemonic: item.mnemonic,
              operands: built.operands,
              op: built.op,
            });
            break;
          }
        }
      } catch (e) {
        failAt(item.line, e, item.col);
      }
    }
    outSections.push({ name: s.name, kind: s.kind, base: s.base, size: s.size, bytes });
  }

  errors.sort((a, b) => a.line - b.line || a.column - b.column);
  if (errors.length > 0) return { program: null, errors };
  instructions.sort((a, b) => a.address - b.address);
  const program: Program = {
    instructions,
    sections: outSections,
    symbols,
    textEnd,
    source: lines,
  };
  return { program, errors };
}

function nopAt(address: number, line: number): Instruction {
  return {
    address,
    line,
    text: "nop",
    mnemonic: "nop",
    operands: [],
    op: { k: "nop" },
  };
}
