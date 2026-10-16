// Copyright © 2026 Christopher Snow

// A run of a program that has no function name: a few instructions written for a lesson, which the
// run starts at the first of. The result is the same `Trace` that trace.ts makes for a recorded
// function, so the same views draw it. A program that has no `ret` ends the run after its last
// instruction, with the stop that says no instruction is there; the registers at that point are
// what the program left.

import { TEXT_BASE, assemble, run } from "@al/machine";

import { assemblyOf, parseListing } from "./listing";
import { sentence } from "./messages";
import type { Trace } from "./trace";

/** Assemble a listing and run it from its first instruction, with the registers at 0. */
export function traceText(listing: string): Trace {
  const lines = parseListing(listing);
  const { program, errors } = assemble(assemblyOf(lines));
  if (program === null) {
    const first = errors[0];
    throw new Error(
      first
        ? `The listing does not assemble: line ${first.line}, ${sentence(first.key, first.params)}`
        : "The listing does not assemble.",
    );
  }
  const result = run(program, { entry: TEXT_BASE });
  const lineAt = new Map<number, number>();
  for (const ins of program.instructions) lineAt.set(ins.address, ins.line - 1);
  return { lines, program, result, lineAt };
}
