// Copyright © 2026 Christopher Snow

// The tap editor's model of a line: an instruction and its operands, built from chips and a number
// pad and written back as the line's text. The text is the only truth; this module reads a line out
// of it and puts a changed line back.

/** What an operand of an instruction may be, so the editor knows which chips to offer. */
export type Slot = "register" | "registerOrNumber" | "number" | "shift" | "condition" | "label";

/** The shifts the tap editor offers for a `shift` operand: `movk` puts a number in the upper half. */
export const SHIFTS: readonly string[] = ["lsl 16"];

/**
 * The operands of each instruction the editor can build, in order. An instruction not listed has no
 * chips for its operands; the line stays editable as text. A later module adds its instructions
 * here as its lessons introduce them.
 */
export const SLOTS: Readonly<Record<string, readonly Slot[]>> = {
  add: ["register", "register", "registerOrNumber"],
  sub: ["register", "register", "registerOrNumber"],
  adds: ["register", "register", "registerOrNumber"],
  subs: ["register", "register", "registerOrNumber"],
  neg: ["register", "register"],
  mov: ["register", "registerOrNumber"],
  movk: ["register", "number", "shift"],
  ret: [],
  // Module 4: a compare, the choice between two registers by a condition, and the branches that
  // name a label. A conditional branch carries its condition in its name (`b.cc`), so it is found
  // by `slotsOf`, not listed here.
  cmp: ["register", "registerOrNumber"],
  csel: ["register", "register", "register", "condition"],
  cset: ["register", "condition"],
  cbz: ["register", "label"],
  cbnz: ["register", "label"],
  b: ["label"],
};

/** The conditions the tap editor offers, in the order the lessons list them. */
export const CONDITIONS: readonly string[] = [
  "eq",
  "ne",
  "cs",
  "cc",
  "hi",
  "ls",
  "ge",
  "lt",
  "gt",
  "le",
];

/** The operands of an instruction the editor can build: a conditional branch (`b.cc`) takes a label. */
export function slotsOf(mnemonic: string): readonly Slot[] | undefined {
  if (Object.hasOwn(SLOTS, mnemonic)) return SLOTS[mnemonic];
  if (/^b\.[a-z]{2}$/.test(mnemonic)) return ["label"];
  return undefined;
}

/** A line that is a label (`.Llow:`) and nothing else: its name, as written; otherwise null. */
export function labelNameOf(text: string): string | null {
  const m = /^([A-Za-z_.][\w.$]*):$/.exec(text.trim());
  return m ? (m[1] as string) : null;
}

export interface Line {
  /** The instruction as written, lower case; empty for a blank line. */
  readonly mnemonic: string;
  /** The operands as written; one may be empty while a line is being built. */
  readonly operands: readonly string[];
}

/** Splits at commas outside square brackets: `x0, [x1, 8]` has two operands. */
export function splitOperands(rest: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < rest.length; i++) {
    const c = rest[i];
    if (c === "[") depth++;
    else if (c === "]") depth = Math.max(0, depth - 1);
    else if (c === "," && depth === 0) {
      out.push(rest.slice(start, i).trim());
      start = i + 1;
    }
  }
  const last = rest.slice(start).trim();
  if (out.length > 0 || last !== "") out.push(last);
  return out;
}

export function parseLine(text: string): Line {
  const trimmed = text.trim();
  // A label line is its own kind of line: its name keeps the case it was written in.
  if (labelNameOf(trimmed) !== null) return { mnemonic: trimmed, operands: [] };
  const space = trimmed.search(/\s/);
  if (space < 0) return { mnemonic: trimmed.toLowerCase(), operands: [] };
  return {
    mnemonic: trimmed.slice(0, space).toLowerCase(),
    operands: splitOperands(trimmed.slice(space + 1)),
  };
}

/** The line's text. Operands left empty at the end are dropped; one left empty before a later one stays as a gap. */
export function lineText(line: Line): string {
  const operands = [...line.operands];
  while (operands.length > 0 && operands[operands.length - 1] === "") operands.pop();
  return operands.length > 0 ? `${line.mnemonic} ${operands.join(", ")}` : line.mnemonic;
}

/** The same line with another instruction. Operands that still fit its form are kept. */
export function withInstruction(line: Line, mnemonic: string): Line {
  const slots = slotsOf(mnemonic) ?? [];
  return { mnemonic, operands: line.operands.slice(0, slots.length) };
}

/** The same line with operand `index` replaced. */
export function withOperand(line: Line, index: number, operand: string): Line {
  const operands = [...line.operands];
  while (operands.length <= index) operands.push("");
  operands[index] = operand;
  return { mnemonic: line.mnemonic, operands };
}

/** The digits of a constant operand (`#50` or `50`), or null when the operand is not a plain number. */
export function numberOf(operand: string): string | null {
  const m = /^#?(\d+)$/.exec(operand.trim());
  return m ? (m[1] as string) : null;
}

/** A program's text as the lines the tap editor lists. A final newline is not a line of its own. */
export function linesOf(text: string): string[] {
  if (text === "") return [];
  const parts = text.split("\n");
  if (parts.length > 1 && parts[parts.length - 1] === "") parts.pop();
  return parts;
}

/**
 * The lines as text. A blank last line is kept by a final newline, because a final newline is not
 * a line of its own when the text is read back: `["a", ""]` is `"a\n\n"`.
 */
export const textOf = (lines: readonly string[]): string =>
  lines.join("\n") + (lines[lines.length - 1] === "" ? "\n" : "");
