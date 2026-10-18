// Copyright © 2026 Christopher Snow
import type { StopReason } from "@al/machine";
import { compileC, interpretC, type CompiledC, type Diagnostic } from "@al/compiler";
import { traceOf, type Trace } from "./trace";
import type { RecordedProgram } from "./listing";
export function recordedC(source: string, compiled: CompiledC): RecordedProgram {
  const mapped = new Map(compiled.lineMap.map((m) => [m.assemblyLine, m.cLine]));
  const sourceLines: number[][] = [];
  return {
    c: source,
    listing: compiled.listing
      .split("\n")
      .map((line, index) => {
        const c = mapped.get(index + 1);
        if (line.trim() !== "" && !line.trim().endsWith(":"))
          sourceLines.push(c === undefined ? [] : [c]);
        return c === undefined || line.trim().endsWith(":") ? line : `${line} C${c}`;
      })
      .join("\n"),
    sourceLines,
  };
}
export type CRun =
  | { ok: true; compiled: CompiledC; program: RecordedProgram; trace: Trace; value: number }
  | { ok: false; diagnostics: Diagnostic[]; stage: "compile" | "evaluate" }
  | { ok: false; diagnostics: []; stage: "machine"; stop: StopReason };
/** Undefined C is rejected before the emitted instructions are passed to the machine. */
export function runC(source: string, args: readonly number[]): CRun {
  const compiled = compileC(source);
  if (!compiled.ok) return { ok: false, diagnostics: compiled.errors, stage: "compile" };
  const evaluated = interpretC(compiled, args);
  if (!evaluated.ok) return { ok: false, diagnostics: [evaluated.error], stage: "evaluate" };
  const program = recordedC(source, compiled);
  const trace = traceOf(program, { entry: compiled.name, args, maxSteps: 10000 });
  if (
    trace.result.stop.kind !== "returned" ||
    Number(BigInt.asUintN(32, trace.result.final.x[0]!)) !== evaluated.value
  )
    return { ok: false, diagnostics: [], stage: "machine", stop: trace.result.stop };
  return { ok: true, compiled, program, trace, value: evaluated.value };
}
