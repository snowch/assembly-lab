// Copyright © 2026 Christopher Snow

// A run of a program that has no function name: a few instructions written for a lesson, which the
// run starts at the first of. The result is the same `Trace` that trace.ts makes for a recorded
// function, so the same views draw it. A program that has no `ret` ends the run after its last
// instruction, with the stop that says no instruction is there; the registers at that point are
// what the program left.

import { TEXT_BASE, assemble, run, type AssembleOptions } from "@al/machine";

import { assemblyOf, parseListing, type ListingLine } from "./listing";
import { sentence } from "./messages";
import type { Trace } from "./trace";

/**
 * Assemble a listing and run it from its first instruction, with the registers at 0 or, if `args`
 * is given, with `w0`, `w1` and on holding those values (the way a call puts its arguments).
 */
export function traceText(
  listing: string,
  args: readonly number[] = [],
  allowed?: ReadonlySet<string>,
  sourceLines?: readonly (readonly number[])[],
): Trace {
  const lines = parseListing(listing, sourceLines);
  const { program, errors } = assemble(assemblyOf(lines), allowed ? { allowed } : undefined);
  if (program === null) {
    const first = errors[0];
    throw new Error(
      first
        ? `The listing does not assemble: line ${first.line}, ${sentence(first.key, first.params)}`
        : "The listing does not assemble.",
    );
  }
  const result = run(program, {
    entry: TEXT_BASE,
    args: args.map((value) => ({ value: BigInt(value), width: 32 })),
  });
  const lineAt = new Map<number, number>();
  for (const ins of program.instructions) lineAt.set(ins.address, ins.line - 1);
  return { lines, program, result, lineAt };
}

/**
 * Assemble text a learner wrote, with the gate its challenge gives the assembler, and run it from
 * its first instruction as the grader does. The lines of the trace are the assembled instructions,
 * as the learner wrote them, with no C beside them. Null when the text does not assemble.
 */
export function traceAssembly(text: string, options?: AssembleOptions): Trace | null {
  const { program } = assemble(text, options);
  if (program === null) return null;
  const lines: ListingLine[] = program.instructions.map((ins) => ({
    kind: "instruction",
    text: ins.text.replace(/\s+/g, " "),
    cLine: null,
  }));
  const lineAt = new Map(program.instructions.map((ins, i) => [ins.address, i] as const));
  return { lines, program, result: run(program, { entry: TEXT_BASE }), lineAt };
}
