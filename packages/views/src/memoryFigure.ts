// Copyright © 2026 Christopher Snow

// Memory transfers are read from the simulator's actual access and register records. The decoded
// instruction supplies only the kind of extension and the destination width, never the result.

import { viewAt, type Trace } from "./trace";

export type ByteRole =
  "loaded" | "copiedBits" | "source" | "zeroFill" | "signFill" | "clearedUpper";

export interface TransferByte {
  readonly index: number;
  readonly value: number;
  readonly bits: string;
  readonly role: ByteRole;
  readonly address: number | null;
}

export interface MemoryTransfer {
  readonly kind: "load" | "store" | "extend";
  readonly load: boolean;
  readonly instruction: string;
  readonly register: string;
  readonly physicalRegister: string;
  readonly address: number | null;
  readonly sourceRegister: string | null;
  readonly size: number;
  readonly bytes: readonly TransferByte[];
}

export const hexAddress = (value: number): string => `0x${value.toString(16)}`;
export const hexByte = (value: number): string => value.toString(16).padStart(2, "0");

/** A single-register load or store that just ran; null before a step or for other instructions. */
export function memoryTransferAt(trace: Trace, k: number): MemoryTransfer | null {
  const view = viewAt(trace, k);
  const step = view.k > 0 ? trace.result.steps[view.k - 1] : undefined;
  const instruction = step && trace.program.instructions.find((i) => i.address === step.address);
  if (!step || !instruction) return null;
  if (instruction.op.k === "bitfield" && /^(?:sxt[bhw]|uxt[bh])$/.test(instruction.mnemonic)) {
    const op = instruction.op;
    const x = op.rd === 31 ? 0n : BigInt.asUintN(64, view.state.x[op.rd] ?? 0n);
    const bytes: TransferByte[] = [];
    for (let index = 7; index >= 0; index--) {
      const value = Number((x >> BigInt(index * 8)) & 255n);
      bytes.push({
        index,
        value,
        bits: value.toString(2).padStart(8, "0"),
        address: null,
        role:
          index * 8 <= op.imms
            ? "copiedBits"
            : index >= op.w / 8
              ? "clearedUpper"
              : op.kind === "sbfm"
                ? "signFill"
                : "zeroFill",
      });
    }
    const suffix = op.rd === 31 ? "zr" : String(op.rd);
    return {
      kind: "extend",
      load: true,
      instruction: step.text,
      register: `${op.w === 32 ? "w" : "x"}${suffix}`,
      physicalRegister: `x${suffix}`,
      address: null,
      sourceRegister: `w${op.rn === 31 ? "zr" : op.rn}`,
      size: (op.imms + 1) / 8,
      bytes,
    };
  }
  if (instruction.op.k !== "ldst") return null;
  const op = instruction.op;
  const access = op.load ? step.loads[0] : step.stores[0];
  if (!access) return null;
  const state = op.load ? view.state : viewAt(trace, view.k - 1).state;
  const x = op.rt === 31 ? 0n : BigInt.asUintN(64, state.x[op.rt] ?? 0n);
  const width = op.load ? 64 : op.w;
  const bytes: TransferByte[] = [];
  for (let index = width / 8 - 1; index >= 0; index--) {
    const value = Number((x >> BigInt(index * 8)) & 255n);
    const moved = index < op.size;
    const role: ByteRole = !op.load
      ? "source"
      : moved
        ? "loaded"
        : index >= op.w / 8
          ? "clearedUpper"
          : op.signed
            ? "signFill"
            : "zeroFill";
    bytes.push({
      index,
      value,
      bits: value.toString(2).padStart(8, "0"),
      role,
      address: moved ? access.address + index : null,
    });
  }
  const suffix = op.rt === 31 ? "zr" : String(op.rt);
  return {
    kind: op.load ? "load" : "store",
    load: op.load,
    instruction: step.text,
    register: `${op.w === 32 ? "w" : "x"}${suffix}`,
    physicalRegister: `x${suffix}`,
    address: access.address,
    sourceRegister: null,
    size: op.size,
    bytes,
  };
}

/** Exact register display, without converting a 64-bit value through a JavaScript number. */
export function memoryRegister(trace: Trace, k: number, name: string): string {
  const width = name.startsWith("w") ? 32 : 64;
  const index = Number(name.slice(1));
  const value = BigInt.asUintN(width, viewAt(trace, k).state.x[index] ?? 0n);
  return `0x${value.toString(16).padStart(width / 4, "0")}`;
}
