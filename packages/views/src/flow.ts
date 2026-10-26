// Copyright © 2026 Christopher Snow

// What an instruction read and wrote, worked out from the trace: the sources with the values they
// held before it ran, the destination with its old and new value, which registers changed and
// which were only read. Nothing here is typed in; every value is a register's contents in the
// state before or after the step, rebuilt by `stateAfter` from the simulator's trace. Only
// `add`, `sub` and `ret` are described. The introductory stepper retains its plain-operand
// scope; the single-operation figures opt into input modifiers for the later ADD examples.
// Any other instruction gives null.

import { stateAfter, type MachineState } from "@al/machine";

import { labelOf } from "./listing";
import { wValue, type Trace } from "./trace";

/** One thing an instruction read: a register and the value it held, or a number in the text. */
export interface FlowSource {
  /** `w1`, or `#50` for a number written in the instruction. */
  readonly name: string;
  /** The decimal value. */
  readonly value: string;
  readonly isRegister: boolean;
  /** Optional operand formation: keep the original input distinct from its effective value. */
  readonly transform?: { readonly input: string; readonly text: string };
}

export interface ArithFlow {
  readonly kind: "arith";
  /** The instruction as written. */
  readonly text: string;
  readonly operation: "add" | "sub";
  /** The second and third operands, in the order they are written. */
  readonly sources: readonly [FlowSource, FlowSource];
  readonly destination: {
    readonly name: string;
    readonly before: string;
    readonly after: string;
  };
  /** The registers the instruction wrote. */
  readonly changed: readonly string[];
  /** The registers it read and did not write. */
  readonly unchanged: readonly string[];
  /** The label the next instruction is under, when that is not the function that just ran. */
  readonly continuesInto: string | null;
}

export interface ReturnFlow {
  readonly kind: "ret";
  readonly text: string;
}

export type Flow = ArithFlow | ReturnFlow;

/** `wN`'s decimal value, or `xN`'s for a 64-bit instruction. */
function valueOf(state: MachineState, n: number, width: 32 | 64): string {
  return width === 32 ? String(wValue(state, n)) : BigInt.asUintN(64, state.x[n] ?? 0n).toString();
}

/** What the `k`-th instruction of the run (the last one that has run, once `k` have) did; null before the first. */
export function flowAt(
  trace: Trace,
  k: number,
  options?: { shiftedOperands?: boolean },
): Flow | null {
  const step = k >= 1 ? trace.result.steps[k - 1] : undefined;
  if (!step) return null;
  const instruction = trace.program.instructions.find((i) => i.address === step.address);
  if (!instruction) return null;
  const op = instruction.op;
  if (op.k === "ret") return { kind: "ret", text: instruction.text };
  if (op.k !== "addsub") return null;
  const before = stateAfter(trace.result, k - 2);
  const after = stateAfter(trace.result, k - 1);
  const width = op.w;
  const prefix = width === 32 ? "w" : "x";
  const register = (n: number): FlowSource => ({
    name: `${prefix}${n}`,
    value: valueOf(before, n, width),
    isRegister: true,
  });
  // The stack pointer and the zero register are not described here.
  if (op.rd === 31 || op.rn === 31) return null;
  let second: FlowSource;
  if (op.src.t === "imm") {
    second = { name: `#${op.src.v}`, value: String(op.src.v), isRegister: false };
    const modifier = instruction.operands.at(-1)?.text ?? "";
    const shift = /^lsl\s+#?(12)$/i.exec(modifier);
    if (options?.shiftedOperands && shift && op.src.v >= 0n) {
      const input = String(op.src.v >> BigInt(shift[1]!));
      second = { ...second, name: `#${input}`, transform: { input, text: modifier } };
    }
  } else if (op.src.t === "shifted" && op.src.amount === 0 && op.src.rm !== 31) {
    second = register(op.src.rm);
  } else if (options?.shiftedOperands && op.src.t === "shifted" && op.src.rm !== 31) {
    const input = register(op.src.rm);
    // Derive the effective second operand from the executed arithmetic, at its actual width.
    // Keep the original register value alongside it; forming an operand never writes that register.
    const a = BigInt(valueOf(before, op.rn, width));
    const result = BigInt(valueOf(after, op.rd, width));
    const effective = BigInt.asUintN(width, op.sub ? a - result : result - a);
    second = {
      ...input,
      value: String(effective),
      transform: { input: input.value, text: instruction.operands.at(-1)!.text },
    };
  } else {
    return null;
  }
  const first = register(op.rn);
  const written = new Set<string>();
  for (const w of step.writes) if (w.reg !== "sp") written.add(`${prefix}${w.reg}`);
  const read = [first, second].filter((s) => s.isRegister).map((s) => s.name);
  const unchanged = [...new Set(read)].filter((name) => !written.has(name));
  const ranAt = trace.lineAt.get(step.address);
  const nextAt = trace.lineAt.get(after.pc);
  const from = ranAt === undefined ? null : labelOf(trace.lines, ranAt);
  const into = nextAt === undefined ? null : labelOf(trace.lines, nextAt);
  return {
    kind: "arith",
    text: instruction.text,
    operation: op.sub ? "sub" : "add",
    sources: [first, second],
    destination: {
      name: `${prefix}${op.rd}`,
      before: valueOf(before, op.rd, width),
      after: valueOf(after, op.rd, width),
    },
    changed: [...written],
    unchanged,
    continuesInto: into !== null && from !== null && into !== from ? into : null,
  };
}

/**
 * The index into the listing's lines of the instruction the run left a function from, when one of
 * the first `k` instructions was followed by an instruction under another label; null while the
 * run has stayed in one function. A `ret` leaves no next instruction, so it never counts.
 */
export function crossedFrom(trace: Trace, k: number): number | null {
  const steps = trace.result.steps;
  for (let s = 0; s < Math.min(k, steps.length); s++) {
    const step = steps[s];
    if (!step) continue;
    const from = trace.lineAt.get(step.address);
    const to = trace.lineAt.get(step.nextPc);
    if (from === undefined || to === undefined) continue;
    const a = labelOf(trace.lines, from);
    const b = labelOf(trace.lines, to);
    if (a !== null && b !== null && a !== b) return from;
  }
  return null;
}
