// Copyright © 2026 Christopher Snow

import { assemble, run, type RunResult } from "@al/machine";

// The course-written prefix is already in the GNU/QEMU primitive_add corpus.
// ret completes the execution harness; the figure inspects only its first ADD.
export const ADD_ARCHITECTURE_ASSEMBLY = "primitive_add:\nadd w2, w0, w1\nret";
const assembled = assemble(ADD_ARCHITECTURE_ASSEMBLY);
if (!assembled.program) throw new Error("The ADD architecture example did not assemble.");
const program = assembled.program;

export const UINT32_MAX = 0xffffffff;
export function parseWordInput(text: string): number | null {
  const raw = text.trim();
  if (!/^(?:\d+|0x[\da-f]+)$/i.test(raw)) return null;
  try {
    const value = BigInt(raw);
    return value >= 0n && value <= BigInt(UINT32_MAX) ? Number(value) : null;
  } catch {
    return null;
  }
}

export function addArchitectureTrace(a: number, b: number): RunResult {
  for (const value of [a, b])
    if (!Number.isInteger(value) || value < 0 || value > UINT32_MAX)
      throw new RangeError("The ADD inputs must be unsigned 32-bit integers.");
  return run(program, {
    entry: "primitive_add",
    args: [a, b, 0].map((value) => ({ value: BigInt(value), width: 32 as const })),
  });
}

export function architectureText(template: string, values: Record<string, unknown> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
