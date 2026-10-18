// Copyright © 2026 Christopher Snow

import { memoryAt, viewAt, type Trace } from "./trace";

export interface StackSlot {
  readonly address: number;
  readonly size: number;
  readonly register: string;
  readonly value: bigint;
}
export interface StackFrame {
  readonly base: number;
  readonly top: number;
  readonly name: string;
  readonly invocation: number;
  readonly bytes: readonly number[];
  readonly slots: readonly StackSlot[];
}

type StoredSlot = Omit<StackSlot, "value">;
type Allocation = {
  base: number;
  top: number;
  name: string;
  invocation: number;
  slots: StoredSlot[];
};

function functionName(trace: Trace, address: number): string {
  const line = trace.lineAt.get(address) ?? -1;
  for (let i = line; i >= 0; i--) {
    const candidate = trace.lines[i];
    if (candidate?.kind === "label" && !candidate.text.startsWith(".")) return candidate.text;
  }
  return "";
}

/** Active allocations and saved register slots, reconstructed from executed SP writes and stores.
 * A call ordinal identifies an invocation even when recursive calls share the same function name.
 * Slot addresses and sizes come from stores; no compiler-specific frame layout is assumed.
 */
export function stackFrames(trace: Trace, k: number): StackFrame[] {
  const end = Math.max(0, Math.min(k, trace.result.steps.length));
  const frames: Allocation[] = [];
  const instructions = new Map(
    trace.program.instructions.map((instruction) => [instruction.address, instruction]),
  );
  let ordinal = 1;
  const calls = [
    {
      invocation: ordinal,
      name: functionName(trace, trace.result.initial.pc),
      returnAddress: trace.result.initial.x[30],
    },
  ];
  for (const step of trace.result.steps.slice(0, end)) {
    const instruction = instructions.get(step.address);
    for (const write of step.writes) {
      if (write.reg !== "sp") continue;
      const before = Number(write.before),
        after = Number(write.after);
      if (after < before) {
        const call = calls[calls.length - 1]!;
        frames.push({
          base: after,
          top: before,
          name: call.name,
          invocation: call.invocation,
          slots: [],
        });
      } else if (after > before) {
        while (frames.length && frames[frames.length - 1]!.top <= after) frames.pop();
        const last = frames[frames.length - 1];
        if (last && last.base < after) {
          last.base = after;
          last.slots = last.slots.filter((slot) => slot.address >= after);
        }
      }
    }
    const op = instruction?.op;
    const registers =
      op?.k === "ldst" && !op.load ? [op.rt] : op?.k === "ldstp" && !op.load ? [op.rt, op.rt2] : [];
    for (const [index, store] of step.stores.entries()) {
      const register = registers[index];
      for (const frame of frames) {
        // An overwritten fragment no longer represents the previously saved whole register.
        frame.slots = frame.slots.filter(
          (slot) =>
            slot.address + slot.size <= store.address ||
            slot.address >= store.address + store.after.length,
        );
        if (
          register === undefined ||
          store.address < frame.base ||
          store.address + store.after.length > frame.top
        )
          continue;
        const width = op?.k === "ldst" || op?.k === "ldstp" ? op.w : 64;
        frame.slots.push({
          address: store.address,
          size: store.after.length,
          register: `${width === 32 ? "w" : "x"}${register === 31 ? "zr" : register}`,
        });
      }
    }
    if ((op?.k === "b" || op?.k === "br") && op.link && step.branch?.taken) {
      calls.push({
        invocation: ++ordinal,
        name: functionName(trace, step.branch.target),
        returnAddress: BigInt(step.address + 4),
      });
    } else if (
      op?.k === "ret" &&
      calls.length > 1 &&
      BigInt(step.nextPc) === calls[calls.length - 1]!.returnAddress
    ) {
      calls.pop();
    }
  }
  return frames.map((frame) => {
    const bytes = memoryAt(trace, end, frame.base, frame.top - frame.base) ?? [];
    return {
      ...frame,
      bytes,
      slots: frame.slots
        .sort((a, b) => a.address - b.address)
        .map((slot) => ({
          ...slot,
          value: bytes
            .slice(slot.address - frame.base, slot.address - frame.base + slot.size)
            .reduceRight((value, byte) => (value << 8n) | BigInt(byte), 0n),
        })),
    };
  });
}

/** The actual instruction at current x30, or null when its address is outside this listing. */
export function stackReturnTarget(
  trace: Trace,
  k: number,
): { address: bigint; instruction: string | null } {
  const address = viewAt(trace, k).state.x[30] ?? 0n;
  const line = trace.lineAt.get(Number(address));
  const instruction = line === undefined ? undefined : trace.lines[line];
  return { address, instruction: instruction?.kind === "instruction" ? instruction.text : null };
}

export function stackDepth(trace: Trace, k: number): number {
  return Number(trace.result.initial.sp - viewAt(trace, k).state.sp);
}
