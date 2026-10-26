// Copyright © 2026 Christopher Snow

// What the bit figures read from a function's first instruction, as the assembler parsed it:
// a literal mask, a register mask from the call's initial state, or a named bit field. Nothing
// here is typed by a lesson. Figures combine these with the model's input and result.

import type { Instruction, MachineState } from "@al/machine";

import { bitOf } from "./bits";
import type { Trace } from "./trace";
import { wValue } from "./trace";

/** What the first instruction of a function does to a word, as far as a figure draws it. */
export type Shape =
  | { kind: "logic"; op: "and" | "orr" | "eor"; mask: number }
  | { kind: "extract"; lsb: number; width: number }
  | { kind: "insert"; lsb: number; width: number }
  | { kind: "other" };

type Operands = Pick<Instruction, "mnemonic" | "operands">;

const imm = (operand: { kind: string; value?: bigint } | undefined): number | null =>
  operand?.kind === "imm" && operand.value !== undefined ? Number(operand.value) : null;

export function shapeOf(ins: Operands, before?: MachineState): Shape {
  const [, , third, fourth] = ins.operands;
  if (ins.mnemonic === "and" || ins.mnemonic === "orr" || ins.mnemonic === "eor") {
    const value =
      third?.kind === "imm" && third.value !== undefined
        ? third.value
        : before && third?.kind === "reg" && third.width === 32 && fourth === undefined
          ? BigInt(wValue(before, third.n))
          : null;
    return value === null
      ? { kind: "other" }
      : { kind: "logic", op: ins.mnemonic, mask: Number(BigInt.asUintN(32, value)) };
  }
  const lsb = imm(third);
  const width = imm(fourth);
  if (lsb !== null && width !== null && ins.mnemonic === "ubfx")
    return { kind: "extract", lsb, width };
  if (lsb !== null && width !== null && ins.mnemonic === "bfi")
    return { kind: "insert", lsb, width };
  return { kind: "other" };
}

/** The first instruction of the function at `entry`. */
export function firstInstruction(trace: Trace, entry: string): Instruction | undefined {
  const address = trace.program.symbols[entry]?.address;
  return trace.program.instructions.find((i) => i.address === address);
}

/** One bit's input, the mask's bit (if the instruction carries a mask) and the result's. */
export interface Column {
  readonly bit: number;
  readonly input: number;
  readonly mask: number | null;
  readonly result: number;
}

/** The column of bit `n`, from the word, the shape of the instruction and the word it left. */
export function columnOf(n: number, word: number, shape: Shape, result: number): Column {
  return {
    bit: n,
    input: bitOf(word, n),
    mask: shape.kind === "logic" ? bitOf(shape.mask, n) : null,
    result: bitOf(result, n),
  };
}

/** What `w0` holds when the run ends. */
export const resultOf = (trace: Trace): number => wValue(trace.result.final, 0);
