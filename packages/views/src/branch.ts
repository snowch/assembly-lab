// Copyright © 2026 Christopher Snow

// What Module 4's figures read out of the model: which conditions hold after a `cmp` (the model
// runs a `cset` for each, so the figure holds no table of the conditions), how two listings differ
// (the model assembles both and the instructions are compared), and where each branch of a run goes
// and whether it was taken (from the program the model assembled and the steps it recorded). Nothing
// here works out an answer the model has not.

import { assemble, run, type Flags, type Instruction } from "@al/machine";

import { assemblyOf, parseListing, type RecordedProgram } from "./listing";
import type { Trace } from "./trace";

// ---------------------------------------------------------------------------------------------
// A value the learner types

export type Typed =
  | { readonly kind: "empty" }
  | { readonly kind: "not-a-number" }
  | { readonly kind: "out-of-range" }
  | { readonly kind: "ok"; readonly pattern: number };

/** What a typed number is: decimal or hexadecimal, as a 32-bit pattern (a negative number is its pattern). */
export function parseTyped(text: string): Typed {
  const typed = text.trim();
  if (typed === "") return { kind: "empty" };
  const m = /^([+-]?)(0x[0-9a-f]+|\d+)$/i.exec(typed);
  if (!m) return { kind: "not-a-number" };
  const magnitude = BigInt(m[2] as string);
  const value = m[1] === "-" ? -magnitude : magnitude;
  if (value < -(2n ** 31n) || value > 2n ** 32n - 1n) return { kind: "out-of-range" };
  return { kind: "ok", pattern: Number(BigInt.asUintN(32, value)) };
}

/** A whole number from -2147483648 to 2147483647 typed in decimal: its 32-bit pattern, or null. */
export function parseInt32(text: string): number | null {
  const typed = text.trim();
  if (!/^[+-]?\d+$/.test(typed)) return null;
  const value = BigInt(typed);
  if (value < -(2n ** 31n) || value > 2n ** 31n - 1n) return null;
  return Number(BigInt.asUintN(32, value));
}

// ---------------------------------------------------------------------------------------------
// Every condition after one compare

export interface CompareResult {
  /** The four flags `cmp w0, w1` leaves. */
  readonly flags: Flags;
  /** Whether each condition asked about holds, as the model's `cset` gives it. */
  readonly holds: Readonly<Record<string, boolean>>;
}

/**
 * Runs `cmp w0, w1` on the two patterns and then one `cset` for each condition, into `w2` and on.
 * The `cset` instructions leave the flags as `cmp` set them, so the flags are the run's last.
 */
export function compareResult(a: number, b: number, conditions: readonly string[]): CompareResult {
  const text = [
    "f:",
    "cmp w0, w1",
    ...conditions.map((cond, i) => `cset w${2 + i}, ${cond}`),
    "ret",
    "",
  ].join("\n");
  const { program, errors } = assemble(text);
  if (program === null) throw new Error(`the compare does not assemble: ${errors[0]?.key ?? ""}`);
  const result = run(program, {
    entry: "f",
    args: [
      { value: BigInt(a), width: 32 },
      { value: BigInt(b), width: 32 },
    ],
  });
  const holds: Record<string, boolean> = {};
  conditions.forEach((cond, i) => {
    holds[cond] = (result.final.x[2 + i] ?? 0n) === 1n;
  });
  return { flags: result.final.flags, holds };
}

// ---------------------------------------------------------------------------------------------
// How two listings differ

/** An instruction as the items a learner sees: its name, then each operand as written. */
export function itemsOf(ins: Instruction): string[] {
  return [ins.mnemonic, ...ins.operands.map((o) => o.text)];
}

/** What an instruction does, as a string: two instructions with the same string do the same. */
const doing = (i: Instruction): string =>
  JSON.stringify(i.op, (_key, v) => (typeof v === "bigint" ? `${v}n` : v));

function instructionsOf(recorded: Pick<RecordedProgram, "listing">): Instruction[] {
  const { program, errors } = assemble(assemblyOf(parseListing(recorded.listing)));
  if (program === null) throw new Error(`the listing does not assemble: ${errors[0]?.key ?? ""}`);
  return program.instructions;
}

export interface DiffRow {
  readonly left: readonly string[];
  readonly right: readonly string[];
  /** Which items (0 is the instruction's name) differ; the same items in both. */
  readonly differing: ReadonlySet<number>;
}

/** The two listings paired instruction by instruction, with the items that differ in each pair. */
export function diffRows(
  left: Pick<RecordedProgram, "listing">,
  right: Pick<RecordedProgram, "listing">,
): DiffRow[] {
  const a = instructionsOf(left);
  const b = instructionsOf(right);
  return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => {
    const x = a[i];
    const y = b[i];
    const l = x ? itemsOf(x) : [];
    const r = y ? itemsOf(y) : [];
    const differing = new Set<number>();
    if (x === undefined || y === undefined || doing(x) !== doing(y)) {
      const n = Math.max(l.length, r.length);
      for (let k = 0; k < n; k++) if (l[k] !== r[k]) differing.add(k);
      // The instructions do different things but are written alike (never for the course's
      // listings): mark the instruction's name.
      if (differing.size === 0) differing.add(0);
    }
    return { left: l, right: r, differing };
  });
}

/** How many items differ in all. */
export const differingItems = (rows: readonly DiffRow[]): number =>
  rows.reduce((n, r) => n + r.differing.size, 0);

export type Change =
  | { readonly value: "none" }
  | { readonly value: "several" }
  | {
      readonly value: string;
      readonly mnemonic: string;
      readonly how: "last" | "operands" | "instruction";
    };

/**
 * What changed from one listing to the other, in the model's own terms: no instruction, several, or
 * one instruction, named, whose name changed, or whose operands changed only in the last item, or
 * in more than that. The `value` of a change in one instruction is `mnemonic:how`.
 */
export function changeBetween(
  before: Pick<RecordedProgram, "listing">,
  after: Pick<RecordedProgram, "listing">,
): Change {
  const rows = diffRows(before, after);
  const changed = rows.filter((r) => r.differing.size > 0);
  if (changed.length === 0) return { value: "none" };
  if (changed.length > 1) return { value: "several" };
  const row = changed[0] as DiffRow;
  const mnemonic = row.left[0] ?? "";
  if (row.differing.has(0) || row.left.length !== row.right.length)
    return { value: `${mnemonic}:instruction`, mnemonic, how: "instruction" };
  const last = row.left.length - 1;
  const onlyLast = row.differing.size === 1 && row.differing.has(last);
  const how = onlyLast ? "last" : "operands";
  return { value: `${mnemonic}:${how}`, mnemonic, how };
}

// ---------------------------------------------------------------------------------------------
// The path a run takes through a listing

export type ArrowState = "taken" | "not-taken" | "not-run";

export interface BranchArrow {
  /** The index into the trace's lines of the branch instruction. */
  readonly from: number;
  /** The index into the trace's lines of the label the branch names. */
  readonly to: number;
  /** The label's name. */
  readonly label: string;
  readonly state: ArrowState;
  /** 0 is the lane nearest the listing; arrows whose spans overlap are in different lanes. */
  readonly lane: number;
}

/** The ways an instruction names a label to go to. `ret` and `bl` are not among them. */
function branchTarget(ins: Instruction): boolean {
  const op = ins.op;
  return (op.k === "b" && !op.link) || op.k === "bcond" || op.k === "cbz" || op.k === "tbz";
}

/** The arrows of a run: one from each branch instruction in the listing to the label it names. */
export function branchArrows(trace: Trace): BranchArrow[] {
  const arrows: Omit<BranchArrow, "lane">[] = [];
  for (const ins of trace.program.instructions) {
    if (!branchTarget(ins)) continue;
    const from = trace.lineAt.get(ins.address);
    const named = ins.operands.find((o) => o.kind === "label");
    if (from === undefined || named === undefined) continue;
    const to = trace.lines.findIndex((l) => l.kind === "label" && l.text === named.text);
    if (to < 0) continue;
    const steps = trace.result.steps.filter((s) => s.address === ins.address);
    const state: ArrowState =
      steps.length === 0
        ? "not-run"
        : steps.some((s) => s.branch?.taken === true)
          ? "taken"
          : "not-taken";
    arrows.push({ from, to, label: named.text, state });
  }
  return withLanes(arrows);
}

/** Gives each arrow the nearest lane in which no arrow already placed overlaps its span. */
function withLanes(arrows: readonly Omit<BranchArrow, "lane">[]): BranchArrow[] {
  const spans = arrows.map((a) => [Math.min(a.from, a.to), Math.max(a.from, a.to)] as const);
  const order = arrows
    .map((_, i) => i)
    .sort((x, y) => {
      const sx = spans[x] as readonly [number, number];
      const sy = spans[y] as readonly [number, number];
      return sx[1] - sx[0] - (sy[1] - sy[0]) || x - y;
    });
  const lanes: number[] = [];
  const placed: { lane: number; span: readonly [number, number] }[] = [];
  for (const i of order) {
    const span = spans[i] as readonly [number, number];
    let lane = 0;
    while (placed.some((p) => p.lane === lane && p.span[0] <= span[1] && span[0] <= p.span[1]))
      lane++;
    placed.push({ lane, span });
    lanes[i] = lane;
  }
  return arrows.map((a, i) => ({ ...a, lane: lanes[i] ?? 0 }));
}

/** The indexes into the trace's lines of the instructions the run ran. */
export function ranLines(trace: Trace): ReadonlySet<number> {
  const ran = new Set<number>();
  for (const s of trace.result.steps) {
    const at = trace.lineAt.get(s.address);
    if (at !== undefined) ran.add(at);
  }
  return ran;
}
