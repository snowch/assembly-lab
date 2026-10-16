// Copyright © 2026 Christopher Snow

// The machine's shared types: what the assembler produces and what the simulator records.

import type { MessageKey } from "./strings.ts";

export type Width = 32 | 64;

/** Message parameters: values that fill the `{name}` slots in a sentence. */
export type Params = Record<string, string | number>;

export type ShiftKind = "lsl" | "lsr" | "asr" | "ror";
export type ExtendKind = "uxtb" | "uxth" | "uxtw" | "uxtx" | "sxtb" | "sxth" | "sxtw" | "sxtx";
export type Cond =
  | "eq"
  | "ne"
  | "cs"
  | "cc"
  | "mi"
  | "pl"
  | "vs"
  | "vc"
  | "hi"
  | "ls"
  | "ge"
  | "lt"
  | "gt"
  | "le"
  | "al";

export interface Flags {
  n: boolean;
  z: boolean;
  c: boolean;
  v: boolean;
}

/** An error from the assembler: where it is, which sentence, and what fills the sentence. */
export interface AsmError {
  /** 1-based source line. */
  line: number;
  /** 1-based column of the part of the line at fault. */
  column: number;
  key: MessageKey;
  params: Params;
}

/** An operand as written, parsed into what it names. For figures and for the trace. */
export type ParsedOperand =
  | {
      kind: "reg";
      text: string;
      /** Register number 0 to 30; 31 for `sp`, `wsp`, `xzr` and `wzr`. */
      n: number;
      width: Width;
      role: "general" | "zero" | "sp";
    }
  | { kind: "imm"; text: string; value: bigint }
  | { kind: "shift"; text: string; shift: ShiftKind | ExtendKind; amount: number | null }
  | { kind: "cond"; text: string; cond: Cond }
  | {
      kind: "mem";
      text: string;
      /** Base register number; 31 is `sp`. */
      base: number;
      mode: "offset" | "pre" | "post" | "register";
      /** The immediate offset, for every mode but `register`. */
      offset: bigint | null;
      /** The offset register, for the `register` mode. */
      index: number | null;
    }
  | { kind: "label"; text: string; address: number };

/** How a load or store forms its address. `base` 31 is `sp`. */
export type Addressing =
  | { kind: "imm"; base: number; offset: bigint; writeback: "none" | "pre" | "post" }
  | {
      kind: "reg";
      base: number;
      index: number;
      /** The index register is read as 32 bits (`uxtw`, `sxtw`) or as 64 (`lsl`, `sxtx`). */
      extend: "lsl" | "uxtw" | "sxtw" | "sxtx";
      shift: number;
    };

export type Source2 =
  | { t: "imm"; v: bigint }
  | { t: "shifted"; rm: number; shift: ShiftKind; amount: number }
  | { t: "extended"; rm: number; extend: ExtendKind; amount: number };

/**
 * What an instruction does, after its aliases are resolved. `mov`, `cmp`, `lsl` and the rest have
 * been rewritten as the instruction they are an alias of; the written text is kept beside it.
 * A register number 31 means `sp` where the field says `Sp`, and the zero register otherwise.
 */
export type Op =
  | {
      k: "addsub";
      sub: boolean;
      setFlags: boolean;
      w: Width;
      rd: number;
      rdSp: boolean;
      rn: number;
      rnSp: boolean;
      src: Source2;
    }
  | {
      k: "logic";
      op: "and" | "orr" | "eor";
      invert: boolean;
      setFlags: boolean;
      w: Width;
      rd: number;
      rdSp: boolean;
      rn: number;
      src: Source2;
    }
  | { k: "movz" | "movn" | "movk"; w: Width; rd: number; imm: bigint; shift: number }
  | {
      k: "bitfield";
      kind: "ubfm" | "sbfm" | "bfm";
      w: Width;
      rd: number;
      rn: number;
      immr: number;
      imms: number;
    }
  | { k: "extr"; w: Width; rd: number; rn: number; rm: number; lsb: number }
  | { k: "shiftv"; kind: ShiftKind; w: Width; rd: number; rn: number; rm: number }
  | {
      k: "csel";
      kind: "csel" | "csinc" | "csinv" | "csneg";
      w: Width;
      rd: number;
      rn: number;
      rm: number;
      cond: Cond;
    }
  | { k: "madd"; sub: boolean; w: Width; rd: number; rn: number; rm: number; ra: number }
  | { k: "maddl"; signed: boolean; sub: boolean; rd: number; rn: number; rm: number; ra: number }
  | { k: "mulh"; signed: boolean; rd: number; rn: number; rm: number }
  | { k: "div"; signed: boolean; w: Width; rd: number; rn: number; rm: number }
  | {
      k: "ldst";
      load: boolean;
      /** Bytes moved: 1, 2, 4 or 8. */
      size: 1 | 2 | 4 | 8;
      /** A load that sign-extends (`ldrsb`, `ldrsh`, `ldrsw`). */
      signed: boolean;
      /** The width of the register that is loaded into or stored from. */
      w: Width;
      rt: number;
      addr: Addressing;
    }
  | {
      k: "ldstp";
      load: boolean;
      size: 4 | 8;
      w: Width;
      rt: number;
      rt2: number;
      base: number;
      offset: bigint;
      writeback: "none" | "pre" | "post";
    }
  | { k: "adr"; page: boolean; rd: number; target: bigint }
  | { k: "b"; link: boolean; target: bigint }
  | { k: "bcond"; cond: Cond; target: bigint }
  | { k: "cbz"; nonZero: boolean; w: Width; rt: number; target: bigint }
  | { k: "tbz"; nonZero: boolean; rt: number; bit: number; target: bigint }
  | { k: "br"; link: boolean; rn: number }
  | { k: "ret"; rn: number }
  | { k: "nop" };

export interface Instruction {
  /** Address of the instruction in the program. */
  address: number;
  /** 1-based source line. */
  line: number;
  /** The instruction as written: mnemonic and operands, without comment or label. */
  text: string;
  /** The mnemonic as written, in lower case. */
  mnemonic: string;
  operands: ParsedOperand[];
  op: Op;
}

export type SectionKind = "text" | "data" | "rodata" | "bss";

export interface Section {
  /** The section's name as the source gives it: `.text`, `.data`, `.rodata`, `.bss`, ... */
  name: string;
  kind: SectionKind;
  base: number;
  size: number;
  /** The section's bytes. In a text section the instruction slots are zero. */
  bytes: Uint8Array;
}

export interface ProgramSymbol {
  name: string;
  address: number;
  section: SectionKind;
}

export interface Program {
  instructions: Instruction[];
  sections: Section[];
  symbols: Record<string, ProgramSymbol>;
  /** First address after the last text byte. */
  textEnd: number;
  /** The text of each source line, for figures that show source beside the trace. */
  source: string[];
}

export interface AssembleOptions {
  /**
   * The mnemonics the program may use (lower case). Any other instruction is an error that names
   * it. Conditional branches are listed as `b.cond`; every other instruction under the name it is
   * written with, so `cmp` and `subs` are separate entries.
   */
  allowed?: ReadonlySet<string>;
}

export interface AssembleResult {
  /** Present when there are no errors. */
  program: Program | null;
  /** Sorted by line, then column. Empty when the program assembled. */
  errors: AsmError[];
}

export interface CallArgument {
  value: bigint;
  /** 32 writes `w`n, which clears the top half; 64 writes `x`n. */
  width: Width;
}

export interface Call {
  /** A label in the program, or an address. */
  entry: string | number;
  args?: CallArgument[];
  /** Stop with the step limit after this many instructions. Default 10 000. */
  maxSteps?: number;
  /** Where `ret` finishes the run. Default `RETURN_ADDRESS`. */
  returnAddress?: number;
  /** The flags when the call starts. Default all clear. */
  flags?: Flags;
}

export interface RegisterWrite {
  /** 0 to 30 for `x0` to `x30`; "sp" for the stack pointer. */
  reg: number | "sp";
  before: bigint;
  after: bigint;
}

export interface StoreRecord {
  address: number;
  before: number[];
  after: number[];
}

export interface Addition {
  /** 32 or 64: which bit is the top bit. */
  width: Width;
  /** The two numbers added. For a subtraction the second is already inverted. */
  a: bigint;
  b: bigint;
  /** 1 for a subtraction (`a + NOT b + 1`); 0 for an addition. */
  carryIn: 0 | 1;
  /** Bit i is the carry into bit i of the sum. Bit 0 is `carryIn`. */
  carries: bigint;
  /** The carry out of the top bit. */
  carryOut: 0 | 1;
  /** The sum, `width` bits wide. */
  result: bigint;
  subtraction: boolean;
}

export interface Step {
  index: number;
  address: number;
  line: number;
  text: string;
  /** Registers the instruction wrote, in order, with the whole register before and after. */
  writes: RegisterWrite[];
  flagsBefore: Flags;
  flagsAfter: Flags;
  stores: StoreRecord[];
  /** Addresses and sizes of the bytes loaded. */
  loads: { address: number; size: number }[];
  /** For a branch: whether it was taken, and where to. `null` for every other instruction. */
  branch: { taken: boolean; target: number } | null;
  /** For an addition or subtraction: the carry into every bit. */
  addition: Addition | null;
  /** True when `sp` was not a multiple of 16 at a memory access through `sp` or at a call. */
  spMisaligned: boolean;
  /** The pc after this step. */
  nextPc: number;
}

export interface MachineState {
  /** x0 to x30. */
  x: bigint[];
  sp: bigint;
  flags: Flags;
  pc: number;
}

export type StopReason =
  | { kind: "returned" }
  | { kind: "limit"; steps: number }
  | {
      kind: "fault";
      key: MessageKey;
      params: Params;
      /** The address that caused the fault. */
      address: number;
      /** The source line of the instruction at fault, or the one that branched there. */
      line: number;
    };

export interface RunResult {
  steps: Step[];
  initial: MachineState;
  final: MachineState;
  stop: StopReason;
  /** Reads bytes from the final memory; `undefined` when the range is not in a region. */
  read(address: number, length: number): Uint8Array | undefined;
}
