// Copyright © 2026 Christopher Snow

// What the three-stage panel (compare, condition, select) and the panel of two conditions read out
// of a run. Everything here comes from the steps the model recorded: the flags before and after the
// compare, the registers it wrote (none), the values in the registers before `csel` ran, and whether
// the condition holds, which the model's own `cset` says for the flags `csel` read. Nothing is worked
// out in the figure.

import { assemble, run, stateAfter, type Flags, type Instruction, type Step } from "@al/machine";

import { CONDITION_ROWS, type ConditionRow } from "./strings.branch";
import type { Trace } from "./trace";

const FLAG_ORDER = ["N", "Z", "C", "V"] as const;
export type FlagName = (typeof FLAG_ORDER)[number];

/** The other spellings of two conditions, which the assembler accepts. */
const ALIASES: Readonly<Record<string, string>> = { hs: "cs", lo: "cc" };

/** The value of one flag, 0 or 1. */
export function flagValue(flags: Flags, name: FlagName): 0 | 1 {
  const on = name === "N" ? flags.n : name === "Z" ? flags.z : name === "C" ? flags.c : flags.v;
  return on ? 1 : 0;
}

/** The flags a rule reads, as the rule's words name them ("Z is 0 and N equals V": N, Z, V). */
export function flagsReadBy(rule: string): FlagName[] {
  return FLAG_ORDER.filter((f) => new RegExp(`\\b${f}\\b`).test(rule));
}

/**
 * Which of `conditions` hold for `flags`, by running a `cset` for each on the model with the flags
 * as given. `cset` does not change the flags, so each reads the same four.
 */
export function conditionsHold(
  flags: Flags,
  conditions: readonly string[],
): Record<string, boolean> {
  const text = ["f:", ...conditions.map((c, i) => `cset w${i}, ${c}`), "ret", ""].join("\n");
  const { program, errors } = assemble(text);
  if (program === null) throw new Error(`the conditions do not assemble: ${errors[0]?.key ?? ""}`);
  const result = run(program, { entry: "f", flags });
  const holds: Record<string, boolean> = {};
  conditions.forEach((c, i) => {
    holds[c] = (result.final.x[i] ?? 0n) === 1n;
  });
  return holds;
}

/** One condition read off some flags: its words, the flags it read and whether it holds. */
export interface ConditionRead {
  readonly name: string;
  readonly row: ConditionRow | undefined;
  /** The flags the condition's rule reads, with their values, in the order N, Z, C, V. */
  readonly read: readonly { readonly flag: FlagName; readonly value: 0 | 1 }[];
  readonly holds: boolean;
}

/** The row of the course's list for a condition name (`hs` and `lo` are `cs` and `cc`). */
export function rowOf(name: string): ConditionRow | undefined {
  const wanted = ALIASES[name] ?? name;
  return CONDITION_ROWS.find((r) => r.name === wanted);
}

/** `N = 1, V = 1`: the flags a rule read, with their values. */
export function readText(read: ConditionRead["read"]): string {
  return read.map((r) => `${r.flag} = ${r.value}`).join(", ");
}

/** A condition read off `flags`, given the model's answer for whether it holds. */
export function conditionRead(name: string, flags: Flags, holds: boolean): ConditionRead {
  const row = rowOf(name);
  return {
    name,
    row,
    read: row
      ? flagsReadBy(row.reads).map((flag) => ({ flag, value: flagValue(flags, flag) }))
      : [],
    holds,
  };
}

/** Reads each condition off `flags`: whether it holds is the model's own answer. */
export function readConditions(flags: Flags, conditions: readonly string[]): ConditionRead[] {
  const holds = conditionsHold(flags, conditions);
  return conditions.map((name) => conditionRead(name, flags, holds[name] === true));
}

// ---------------------------------------------------------------------------------------------
// The run's compare, condition and select

/** The instructions that set the flags a condition goes on to read. */
const SETTERS = new Set(["cmp", "cmn", "subs", "adds", "negs", "tst", "ands"]);

/** The value of a `w` register as a plain, non-negative number. */
const word = (x: bigint): number => Number(BigInt.asUintN(32, x));

/** A value as the text writes a pattern: small numbers in decimal, large ones in hexadecimal. */
export function patternText(value: number): string {
  return value < 1 << 20 ? String(value) : `0x${value.toString(16).padStart(8, "0")}`;
}

export interface CompareStage {
  /** The index into the run's steps of the compare. */
  readonly step: number;
  readonly instruction: string;
  /** `minus` for a compare that subtracts, `plus` for one that adds. */
  readonly sign: "minus" | "plus";
  /** The two operands as the instruction names them, with the name the call gives each, if any. */
  readonly first: string;
  readonly second: string;
  /** The values the call gave `w0`, `w1` and on, with the name each is given. */
  readonly inputs: readonly {
    readonly register: string;
    readonly name: string;
    readonly value: number;
  }[];
  readonly flagsBefore: Flags;
  readonly flagsAfter: Flags;
  /** The registers the compare wrote: none. */
  readonly wrote: readonly string[];
}

export interface ConditionStage {
  readonly step: number;
  readonly instruction: string;
  readonly condition: ConditionRead;
  /** The same flags read by other conditions the figure sets beside it. */
  readonly also: readonly ConditionRead[];
}

export interface SelectStage {
  readonly step: number;
  readonly instruction: string;
  readonly destination: string;
  readonly whenYes: { readonly register: string; readonly value: number };
  readonly whenNo: { readonly register: string; readonly value: number };
  /** Which source the model's answer to the condition chose. */
  readonly chosen: "yes" | "no";
  /** What the destination holds after the `csel`, from the step's own write (or its old value). */
  readonly after: number;
  /** The destination is also a source. */
  readonly destinationIsSource: boolean;
}

export interface SelectModel {
  readonly compare: CompareStage | null;
  readonly condition: ConditionStage | null;
  readonly select: SelectStage | null;
}

function instructionAt(trace: Trace, step: Step): Instruction | undefined {
  return trace.program.instructions.find((i) => i.address === step.address);
}

const words = (text: string): string => text.replace(/\s+/g, " ").trim();

/** The registers the call gave values, with the names the figure calls them by. */
function inputsOf(trace: Trace, names: readonly string[]): CompareStage["inputs"] {
  return names.map((name, n) => ({
    register: `w${n}`,
    name,
    value: word(trace.result.initial.x[n] ?? 0n),
  }));
}

/**
 * The first `csel` of the run, the compare before it that set the flags it read, and what each
 * stage came to. `names` are the names the C gives the arguments, for `w0`, `w1` and on (`a`, `b`);
 * `also` are other conditions to read off the same flags. A stage the run has no instruction for
 * is null.
 */
export function selectModel(
  trace: Trace,
  names: readonly string[],
  also: readonly string[] = [],
): SelectModel {
  const steps = trace.result.steps;
  const selectAt = steps.findIndex((s) => instructionAt(trace, s)?.mnemonic === "csel");
  if (selectAt < 0) return { compare: null, condition: null, select: null };
  let compareAt = -1;
  for (let i = selectAt - 1; i >= 0; i--) {
    const ins = instructionAt(trace, steps[i] as Step);
    if (ins && SETTERS.has(ins.mnemonic)) {
      compareAt = i;
      break;
    }
  }
  const compareStep = compareAt >= 0 ? (steps[compareAt] as Step) : undefined;
  const compareIns = compareStep ? instructionAt(trace, compareStep) : undefined;
  /** The name the call gives the argument in a register (`w1` is `b`), else the operand as written. */
  const nameOf = (operand: string): string => {
    const m = /^w(\d+)$/i.exec(operand);
    return (m ? names[Number(m[1])] : undefined) ?? operand;
  };
  const compare: CompareStage | null =
    compareStep && compareIns
      ? {
          step: compareAt,
          instruction: words(compareStep.text),
          sign: compareIns.mnemonic === "cmn" || compareIns.mnemonic === "adds" ? "plus" : "minus",
          first: nameOf(compareIns.operands[0]?.text ?? ""),
          second: nameOf(compareIns.operands[1]?.text ?? ""),
          inputs: inputsOf(trace, names),
          flagsBefore: compareStep.flagsBefore,
          flagsAfter: compareStep.flagsAfter,
          wrote: compareStep.writes.flatMap((w) => (w.reg === "sp" ? ["sp"] : [`w${w.reg}`])),
        }
      : null;

  const selectStep = steps[selectAt] as Step;
  const ins = instructionAt(trace, selectStep) as Instruction;
  const cond = ins.operands.find((o) => o.kind === "cond");
  if (cond === undefined || ins.op.k !== "csel") return { compare, condition: null, select: null };
  const flags = selectStep.flagsBefore;
  const [read, ...extra] = readConditions(flags, [cond.text.toLowerCase(), ...also]);
  const condition: ConditionStage = {
    step: selectAt,
    instruction: words(selectStep.text),
    condition: read as ConditionRead,
    also: extra,
  };

  // The registers before `csel` ran: the sources are read in that state, not after the write.
  const before = stateAfter(trace.result, selectAt - 1);
  const source = (i: number) => {
    const operand = ins.operands[i];
    if (operand?.kind !== "reg") return { register: operand?.text ?? "", value: 0 };
    return {
      register: operand.text,
      value: operand.role === "zero" ? 0 : word(before.x[operand.n] ?? 0n),
    };
  };
  const destination = ins.operands[0];
  const whenYes = source(1);
  const whenNo = source(2);
  const write = selectStep.writes.find(
    (w) => destination?.kind === "reg" && w.reg === destination.n,
  );
  const old =
    destination?.kind === "reg" && destination.role !== "zero"
      ? word(before.x[destination.n] ?? 0n)
      : 0;
  const select: SelectStage = {
    step: selectAt,
    instruction: words(selectStep.text),
    destination: destination?.text ?? "",
    whenYes,
    whenNo,
    chosen: read?.holds ? "yes" : "no",
    after: write ? word(write.after) : old,
    destinationIsSource:
      destination?.kind === "reg" &&
      [1, 2].some((i) => {
        const o = ins.operands[i];
        return o?.kind === "reg" && o.role !== "zero" && o.n === destination.n;
      }),
  };
  return { compare, condition, select };
}

// ---------------------------------------------------------------------------------------------
// Two conditions read off one compare

export interface TwoConditions {
  /** The index into the run's steps of the compare that set the flags. */
  readonly step: number;
  readonly instruction: string;
  readonly flagsBefore: Flags;
  readonly flagsAfter: Flags;
  readonly conditions: readonly ConditionRead[];
  /** The condition the run's own conditional branch names, if the run reached one. */
  readonly used: { readonly condition: string; readonly instruction: string } | null;
}

/**
 * The first compare of the run, and each of `conditions` read off the flags it left. The branch the
 * run reaches next that names a condition is noted, so the figure can say which one the program uses.
 */
export function twoConditions(trace: Trace, conditions: readonly string[]): TwoConditions | null {
  const steps = trace.result.steps;
  const at = steps.findIndex((s) => SETTERS.has(instructionAt(trace, s)?.mnemonic ?? ""));
  if (at < 0) return null;
  const compare = steps[at] as Step;
  // The first conditional branch the run ran after the compare names the condition the program uses.
  let used: TwoConditions["used"] = null;
  for (const step of steps.slice(at + 1)) {
    const ins = instructionAt(trace, step);
    if (ins?.op.k === "bcond") {
      used = { condition: ins.op.cond, instruction: words(step.text) };
      break;
    }
  }
  return {
    step: at,
    instruction: words(compare.text),
    flagsBefore: compare.flagsBefore,
    flagsAfter: compare.flagsAfter,
    conditions: readConditions(compare.flagsAfter, conditions),
    used,
  };
}
