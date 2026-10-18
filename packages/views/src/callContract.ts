// Copyright © 2026 Christopher Snow

import type { Program, RunResult } from "@al/machine";

/** A present but unreachable BL is not evidence that an exercise used its required call. */
export function executedCall(program: Program, result: RunResult, name: string): boolean {
  const target = program.symbols[name];
  if (target?.section !== "text") return false;
  const calls = new Set(
    program.instructions.filter((i) => i.mnemonic === "bl").map((i) => i.address),
  );
  return result.steps.some(
    (step) =>
      calls.has(step.address) && step.branch?.taken && step.branch.target === target.address,
  );
}
