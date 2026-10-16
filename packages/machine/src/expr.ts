// Copyright © 2026 Christopher Snow

// Expressions in operands and directives, with GNU as's operators and its precedence: `*` `/` `%`
// `<<` `>>` bind tightest, then `|` `&` `^`, then `+` `-` (so `1|2+4` is 7, as GNU as reads it).
// Arithmetic wraps at 64 bits. A symbol's value is its address; `.` is the address of the
// instruction or directive being read.

import type { MessageKey } from "./strings.ts";

/** A failure with a message key; the caller adds the line and column. */
export class AsmFail extends Error {
  readonly key: MessageKey;
  readonly params: Record<string, string | number>;
  readonly column: number | undefined;
  constructor(key: MessageKey, params: Record<string, string | number> = {}, column?: number) {
    super(key);
    this.key = key;
    this.params = params;
    this.column = column;
  }
}

export interface ExprValue {
  /** The value, as a signed 64-bit integer (wrapped). */
  value: bigint;
  /** True when a symbol or `.` took part: the value is an address, not a plain number. */
  usesSymbol: boolean;
  /** Set for `:lo12:` and friends: the relocation operator the expression began with. */
  lo12?: boolean;
}

export type SymbolLookup = (name: string) => bigint | undefined;

type Token =
  | { t: "num"; v: bigint; at: number }
  | { t: "sym"; name: string; at: number }
  | { t: "op"; op: string; at: number };

const SYMBOL_START = /[A-Za-z_.$]/;
const SYMBOL_PART = /[A-Za-z0-9_.$]/;

function tokenise(text: string, base: number): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const fail = (at: number): never => {
    throw new AsmFail("syntax.expression", { text: text.trim() }, base + at);
  };
  // An expression this long is not one a learner wrote, and the parser recurses.
  if (text.length > 1000) return fail(0);
  while (i < text.length) {
    const c = text[i] as string;
    if (c === " " || c === "\t") {
      i++;
      continue;
    }
    if (/[0-9]/.test(c)) {
      const m = /^(0[xX][0-9a-fA-F]+|0[bB][01]+|[0-9]+)/.exec(text.slice(i));
      const lit = m ? (m[0] as string) : "";
      let v: bigint;
      if (/^0[xX]/.test(lit)) v = BigInt(lit);
      else if (/^0[bB]/.test(lit)) v = BigInt(lit);
      else if (lit.length > 1 && lit.startsWith("0")) {
        if (/[89]/.test(lit)) return fail(i);
        v = BigInt("0o" + lit.slice(1));
      } else v = BigInt(lit);
      if (v >= 1n << 64n) throw new AsmFail("syntax.tooBig", { text: text.trim() }, base + i);
      // A number glued to letters (`08`, `0x`, `12ab`) is not a number.
      let end = i + lit.length;
      // GNU as takes `1l` and `1L`.
      if ((text[end] === "l" || text[end] === "L") && !SYMBOL_PART.test(text[end + 1] ?? " "))
        end++;
      const after = text[end];
      if (after !== undefined && SYMBOL_PART.test(after)) return fail(i);
      tokens.push({ t: "num", v, at: i });
      i = end;
      continue;
    }
    if (c === "'") {
      // A character constant: 'a or 'a'. A backslash makes \n, \t, \r, \b and \f their control
      // characters and any other character itself.
      let ch = text[i + 1];
      if (ch === undefined) return fail(i);
      let used = 2;
      if (ch === "\\") {
        const e = text[i + 2];
        if (e === undefined) return fail(i);
        const escapes: Record<string, string> = { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f" };
        ch = escapes[e] ?? e;
        used = 3;
      }
      tokens.push({ t: "num", v: BigInt(ch.charCodeAt(0)), at: i });
      i += used;
      if (text[i] === "'") i++;
      continue;
    }
    if (SYMBOL_START.test(c)) {
      let j = i + 1;
      while (j < text.length && SYMBOL_PART.test(text[j] as string)) j++;
      tokens.push({ t: "sym", name: text.slice(i, j), at: i });
      i = j;
      continue;
    }
    const two = text.slice(i, i + 2);
    if (["<<", ">>", "==", "!=", "<>", "<=", ">=", "&&", "||"].includes(two)) {
      tokens.push({ t: "op", op: two, at: i });
      i += 2;
      continue;
    }
    if ("+-*/%|&^~()<>!".includes(c)) {
      tokens.push({ t: "op", op: c, at: i });
      i++;
      continue;
    }
    return fail(i);
  }
  return tokens;
}

const RANK: Record<string, number> = {
  "*": 8,
  "/": 8,
  "%": 8,
  "<<": 8,
  ">>": 8,
  "|": 7,
  "&": 7,
  "^": 7,
  "!": 7,
  "+": 6,
  "-": 6,
  "==": 5,
  "!=": 5,
  "<>": 5,
  "<": 5,
  ">": 5,
  "<=": 5,
  ">=": 5,
  "&&": 4,
  "||": 3,
};

/** GNU as: a comparison that holds is -1, and one that does not is 0. */
const truth = (b: boolean): bigint => (b ? -1n : 0n);

const wrap = (v: bigint): bigint => BigInt.asIntN(64, v);

/**
 * Evaluate an expression. `base` is the column of the text's first character. `dot` is the value
 * of `.`. A symbol that `lookup` does not know fails with `symbol.undefined`.
 */
export function evaluate(text: string, base: number, lookup: SymbolLookup, dot: bigint): ExprValue {
  const tokens = tokenise(text, base);
  if (tokens.length === 0) throw new AsmFail("syntax.expression", { text: text.trim() }, base);
  let pos = 0;
  let usesSymbol = false;
  const bad = (at?: number): never => {
    throw new AsmFail("syntax.expression", { text: text.trim() }, base + (at ?? 0));
  };

  const primary = (): bigint => {
    const tok = tokens[pos++];
    if (tok === undefined) return bad(text.length);
    if (tok.t === "num") return wrap(tok.v);
    if (tok.t === "sym") {
      usesSymbol = true;
      if (tok.name === ".") return dot;
      const v = lookup(tok.name);
      if (v === undefined) {
        throw new AsmFail("symbol.undefined", { name: tok.name }, base + tok.at);
      }
      return v;
    }
    if (tok.op === "(") {
      const v = binary(0);
      const close = tokens[pos++];
      if (close === undefined || close.t !== "op" || close.op !== ")") return bad(tok.at);
      return v;
    }
    if (tok.op === "-") return wrap(-unary());
    if (tok.op === "+") return unary();
    if (tok.op === "~") return wrap(~unary());
    if (tok.op === "!") return unary() === 0n ? 1n : 0n;
    return bad(tok.at);
  };
  const unary = (): bigint => primary();

  const binary = (minRank: number): bigint => {
    let left = unary();
    for (;;) {
      const tok = tokens[pos];
      if (tok === undefined || tok.t !== "op") break;
      const rank = RANK[tok.op];
      if (rank === undefined || rank < minRank) break;
      pos++;
      const right = binary(rank + 1);
      switch (tok.op) {
        case "*":
          left = wrap(left * right);
          break;
        case "/":
        case "%":
          if (right === 0n) throw new AsmFail("syntax.divideByZero", {}, base + tok.at);
          left = tok.op === "/" ? left / right : left % right;
          break;
        case "<<":
          left = wrap(left << (right & 63n));
          break;
        case ">>":
          left = left >> (right & 63n);
          break;
        case "|":
          left = left | right;
          break;
        case "&":
          left = left & right;
          break;
        case "^":
          left = left ^ right;
          break;
        case "+":
          left = wrap(left + right);
          break;
        case "-":
          left = wrap(left - right);
          break;
        case "!":
          left = left | wrap(~right);
          break;
        case "==":
          left = truth(left === right);
          break;
        case "!=":
        case "<>":
          left = truth(left !== right);
          break;
        case "<":
          left = truth(left < right);
          break;
        case ">":
          left = truth(left > right);
          break;
        case "<=":
          left = truth(left <= right);
          break;
        case ">=":
          left = truth(left >= right);
          break;
        case "&&":
          left = left !== 0n && right !== 0n ? 1n : 0n;
          break;
        case "||":
          left = left !== 0n || right !== 0n ? 1n : 0n;
          break;
      }
    }
    return left;
  };

  const value = binary(0);
  if (pos < tokens.length) bad((tokens[pos] as Token).at);
  return { value, usesSymbol };
}
