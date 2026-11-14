// Copyright © 2026 Christopher Snow

import {
  calculatorCompute,
  calculatorParse,
  type CalculatorFormat,
  type CalculatorOperation,
  type CalculatorReading,
} from "@al/machine";

export type WorkspaceWidth = 32 | 64;
export type WorkspaceField = "entry" | "operand" | "half" | "shift";
export type WorkspaceError = "empty" | "decimal" | "hex" | "range" | "half" | "shift";
export type WorkspaceTrace = {
  a: string;
  b: string;
  pattern: string;
  full: string;
  width: WorkspaceWidth;
  reading: CalculatorReading;
  operation: CalculatorOperation;
};
export type Workspace = {
  view: "calculate" | "edit";
  width: WorkspaceWidth;
  reading: CalculatorReading;
  pattern: string;
  entry: string;
  format: CalculatorFormat;
  operand: string;
  operandFormat: CalculatorFormat;
  operation: CalculatorOperation;
  shift: string;
  half: "upper" | "lower";
  halfValue: string;
  halfOpen: boolean;
  selected: number;
  scrollLeft: number;
  full: string | null;
  trace: WorkspaceTrace | null;
  message: string;
  error: { field: WorkspaceField; code: WorkspaceError } | null;
};

export function initialWorkspace(): Workspace {
  return {
    view: "calculate",
    width: 32,
    reading: "unsigned",
    pattern: "0",
    entry: "",
    format: "decimal",
    operand: "1",
    operandFormat: "decimal",
    operation: "add",
    shift: "1",
    half: "upper",
    halfValue: "0",
    halfOpen: false,
    selected: 0,
    scrollLeft: -1,
    full: null,
    trace: null,
    message: "",
    error: null,
  };
}

export function workspaceOperand(work: Workspace) {
  if (work.operation === "shift-left") {
    const amount = calculatorParse(work.shift, "decimal", 32, "unsigned");
    if (!amount.ok || BigInt(amount.pattern) >= BigInt(work.width))
      return { ok: false as const, field: "shift" as const, code: "shift" as const };
    return { ok: true as const, pattern: amount.pattern };
  }
  const operand = calculatorParse(work.operand, work.operandFormat, work.width, work.reading);
  return operand.ok
    ? operand
    : { ok: false as const, field: "operand" as const, code: operand.error };
}

export function workspaceCalculation(work: Workspace) {
  const operand = workspaceOperand(work);
  if (!operand.ok) return operand;
  const result = calculatorCompute(
    work.pattern,
    work.operation,
    operand.pattern,
    work.width,
    work.reading,
  );
  return {
    ok: true as const,
    trace: {
      a: work.pattern,
      b: operand.pattern,
      pattern: result.pattern,
      full: result.full,
      width: work.width,
      reading: work.reading,
      operation: work.operation,
    },
  };
}

/** Preserve the old header tool's exact patterns and pending fields across a coordinated update. */
export function restoreWorkspace(raw: unknown): Workspace {
  const work = initialWorkspace();
  if (!raw || typeof raw !== "object") return work;
  const value = raw as Record<string, unknown>;
  if (value.width === 64) work.width = 64;
  if (value.reading === "signed") work.reading = "signed";
  if (value.format === "hex") work.format = "hex";
  if (value.operandFormat === "hex") work.operandFormat = "hex";
  if (value.view === "edit") work.view = "edit";
  if (value.operation === "subtract" || value.operation === "shift-left")
    work.operation = value.operation;
  if (typeof value.pattern === "string") {
    const parsed = calculatorParse(value.pattern, "decimal", work.width, "unsigned");
    if (parsed.ok) work.pattern = parsed.pattern;
  }
  for (const field of ["entry", "operand", "shift", "halfValue", "message"] as const)
    if (typeof value[field] === "string") work[field] = value[field];
  if (value.half === "lower") work.half = "lower";
  work.halfOpen = value.halfOpen === true;
  if (typeof value.selected === "number" && Number.isInteger(value.selected))
    work.selected = Math.max(0, Math.min(work.width - 1, value.selected));
  if (typeof value.scrollLeft === "number" && Number.isFinite(value.scrollLeft))
    work.scrollLeft = Math.max(-1, value.scrollLeft);
  if (typeof value.full === "string" && /^-?\d{1,64}$/.test(value.full)) work.full = value.full;
  if (value.trace && typeof value.trace === "object") {
    const trace = value.trace as Record<string, unknown>;
    const calculated = workspaceCalculation(work);
    if (
      calculated.ok &&
      trace.a === calculated.trace.a &&
      trace.b === calculated.trace.b &&
      trace.width === work.width &&
      trace.reading === work.reading &&
      trace.operation === work.operation
    ) {
      work.trace = calculated.trace;
      work.full = calculated.trace.full;
    }
  }
  if (value.error && typeof value.error === "object") {
    const error = value.error as Record<string, unknown>;
    const fields: WorkspaceField[] = ["entry", "operand", "half", "shift"];
    const codes: WorkspaceError[] = ["empty", "decimal", "hex", "range", "half", "shift"];
    if (fields.some((f) => f === error.field) && codes.some((c) => c === error.code))
      work.error = { field: error.field as WorkspaceField, code: error.code as WorkspaceError };
  }
  return work;
}

export const workspaceCodec = {
  encode: (work: Workspace) => work,
  decode: restoreWorkspace,
};
