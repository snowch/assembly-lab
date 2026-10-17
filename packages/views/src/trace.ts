// Copyright © 2026 Christopher Snow

// A recorded program, run: the glue between a lesson's listing and the machine. Everything a figure
// shows about a run comes from here, which gets it from `run()` and `stateAfter()` and computes
// nothing of its own.

import {
  assemble,
  run,
  stateAfter,
  type MachineState,
  type Program,
  type RunResult,
  type StopReason,
} from "@al/machine";

import {
  assemblyOf,
  deleteLine,
  parseListing,
  type DeleteSpec,
  type ListingLine,
  type RecordedProgram,
} from "./listing";
import { sentence } from "./messages";
import { machineArgs, withMemory, type TraceArgument } from "./call";

/** The call a figure runs: a label in the listing and the values of `w0`, `w1` and on. */
export interface TraceCall {
  readonly entry: string;
  readonly args: readonly number[];
  /** Stop recording after this many instructions, even if the function has not returned. */
  readonly maxSteps?: number;
  readonly memory?: readonly number[];
}

/** A call whose arguments may explicitly name their register widths. */
export interface MemoryTraceCall extends Omit<TraceCall, "args"> {
  readonly args: readonly TraceArgument[];
}

export interface Trace {
  readonly lines: readonly ListingLine[];
  readonly program: Program;
  readonly result: RunResult;
  /** The index into `lines` of the instruction at an address. */
  readonly lineAt: ReadonlyMap<number, number>;
}

/** Assemble a recorded program (with a line taken out, if asked) and run one call on it. */
export function traceOf(
  recorded: Pick<RecordedProgram, "listing">,
  call: TraceCall | MemoryTraceCall,
  without?: DeleteSpec,
): Trace {
  const parsed = parseListing(recorded.listing);
  const lines = without ? deleteLine(parsed, without) : parsed;
  const { program, errors } = assemble(withMemory(assemblyOf(lines), call.memory));
  if (program === null) {
    const first = errors[0];
    throw new Error(
      first
        ? `The listing does not assemble: line ${first.line}, ${sentence(first.key, first.params)}`
        : "The listing does not assemble.",
    );
  }
  const result = run(program, {
    entry: call.entry,
    args: machineArgs(call.args),
    ...(call.maxSteps === undefined ? {} : { maxSteps: call.maxSteps }),
  });
  const lineAt = new Map<number, number>();
  for (const ins of program.instructions) lineAt.set(ins.address, ins.line - 1);
  return { lines, program, result, lineAt };
}

/** Bytes after the first `k` instructions, reconstructed by undoing later stores. */
export function memoryAt(
  trace: Trace,
  k: number,
  address: number,
  length: number,
): number[] | undefined {
  if (!Number.isInteger(k) || k < 0 || k > trace.result.steps.length)
    throw new Error("The memory step must be within the recorded trace.");
  if (!Number.isSafeInteger(address) || address < 0 || !Number.isSafeInteger(length) || length < 0)
    throw new Error("A memory range needs a non-negative integer address and length.");
  const final = trace.result.read(address, length);
  if (final === undefined) return undefined;
  const bytes = [...final];
  for (let i = trace.result.steps.length - 1; i >= k; i--) {
    const stores = trace.result.steps[i]?.stores ?? [];
    for (let s = stores.length - 1; s >= 0; s--) {
      const store = stores[s]!;
      store.before.forEach((byte, offset) => {
        const at = store.address + offset - address;
        if (at >= 0 && at < length) bytes[at] = byte;
      });
    }
  }
  return bytes;
}

/** What a figure shows once `k` instructions have run. */
export interface StepView {
  /** Instructions run so far, 0 to `total`. */
  readonly k: number;
  readonly total: number;
  readonly state: MachineState;
  /** The index into `lines` of the instruction that runs next; null once the run has ended. */
  readonly next: number | null;
  /** The index into `lines` of the instruction that ran last; null before the first. */
  readonly ran: number | null;
  /** The C line GCC recorded for the instruction that ran last. */
  readonly litC: number | null;
  /** The numbers of the registers (`w0` is 0) that the last instruction wrote. */
  readonly written: ReadonlySet<number>;
  /** How the run ended, once every instruction has run. */
  readonly stop: StopReason | null;
}

export function viewAt(trace: Trace, k: number): StepView {
  const { steps, stop } = trace.result;
  const at = Math.max(0, Math.min(k, steps.length));
  const state = stateAfter(trace.result, at - 1);
  const last = at > 0 ? steps[at - 1] : undefined;
  const ran = last ? (trace.lineAt.get(last.address) ?? null) : null;
  const written = new Set<number>();
  for (const w of last?.writes ?? []) if (w.reg !== "sp") written.add(w.reg);
  const ranLine = ran === null ? undefined : trace.lines[ran];
  return {
    k: at,
    total: steps.length,
    state,
    // After the run's last instruction the pc is where the run ended, which is no instruction.
    next: trace.lineAt.get(state.pc) ?? null,
    ran,
    litC: ranLine?.kind === "instruction" ? ranLine.cLine : null,
    written,
    stop: at === steps.length ? stop : null,
  };
}

/** What `wN` holds: the low 32 bits of `xN`, as a plain (non-negative) number. */
export function wValue(state: MachineState, n: number): number {
  return Number(BigInt.asUintN(32, state.x[n] ?? 0n));
}

/** The same 32 bits read as a whole number that may be negative (what a C `int` function returns). */
export function wValueAsInt(state: MachineState, n: number): number {
  return Number(BigInt.asIntN(32, state.x[n] ?? 0n));
}

/** The 32 bits of a value, most significant first. */
export function bitsOf(value: number): string {
  return (value >>> 0).toString(2).padStart(32, "0");
}
