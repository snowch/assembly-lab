// Copyright © 2026 Christopher Snow

// Serializable calls shared by memory figures and the written-program grader. Wide values remain
// strings until conversion to bigint; a JavaScript number must already be an exact integer.
import { z } from "zod";
import { DATA_BASE, assemble, type CallArgument } from "@al/machine";

const IntegerSchema = z.union([
  z.number().int().refine(Number.isSafeInteger),
  z.string().regex(/^(?:-?\d+|0x[0-9a-f]+)$/i),
]);
export const MemorySchema = z.array(z.number().int().min(0).max(255)).min(1).max(4096);
export const ArgumentSchema = z.union([
  z.number().int().refine(Number.isSafeInteger),
  z.object({ value: IntegerSchema, width: z.union([z.literal(32), z.literal(64)]) }),
]);
export type TraceArgument = z.infer<typeof ArgumentSchema>;

export function machineArgs(args: readonly TraceArgument[]): CallArgument[] {
  if (args.length > 8) throw new Error("A call has at most eight arguments.");
  return args.map((arg) => {
    const parsed = ArgumentSchema.parse(arg);
    return typeof parsed === "number"
      ? { value: BigInt(parsed), width: 32 }
      : { value: BigInt(parsed.value), width: parsed.width };
  });
}

/** Fixture bytes are separate from the program shown in an editor or listing. */
export function withMemory(source: string, memory?: readonly number[]): string {
  if (memory === undefined) return source;
  const bytes = MemorySchema.parse(memory);
  // An existing data directive could move the fixture away from its promised address. Lessons
  // and learner submissions using this helper must have code only; symbols/directives needed
  // by a compiler listing such as `.text` and `.align` remain valid.
  if (hasMemoryDirective(source))
    throw new Error(`A separate memory fixture must begin at ${DATA_BASE}.`);
  return `${source}\n.data\n.byte ${bytes.join(",")}\n`;
}

export function hasMemoryDirective(source: string): boolean {
  // Ask the same parser that will run the submission. Directives may be upper case, follow a
  // label, or follow a semicolon; a line-oriented regular expression misses those forms.
  return assemble(source).program?.sections.some((section) => section.kind !== "text") ?? false;
}

/** The challenge schema stores each input as a scalar, so bytes use a comma-separated string. */
export function memoryBytes(value: string | number): number[] {
  if (typeof value !== "string") throw new Error("Memory bytes must be a comma-separated string.");
  const parts = value.split(",").map((part) => part.trim());
  if (parts.some((part) => !/^(?:\d+|0x[0-9a-f]+)$/i.test(part)))
    throw new Error("Memory bytes must be decimal or hexadecimal integers.");
  return MemorySchema.parse(parts.map(Number));
}

/** `wN` and `xN` name the same argument; accepting both would hide a lesson-data error. */
export function argumentsGiven(given: Readonly<Record<string, string | number>>): TraceArgument[] {
  const args: TraceArgument[] = [];
  for (const name of Object.keys(given)) {
    const register = /^[wx](\d+)$/.exec(name);
    if (register !== null && Number(register[1]) > 7)
      throw new Error("Call inputs may name only registers zero to seven.");
  }
  let gap = false;
  for (let n = 0; n < 8; n++) {
    const w = given[`w${n}`];
    const x = given[`x${n}`];
    if (w !== undefined && x !== undefined) throw new Error(`Both w${n} and x${n} were supplied.`);
    if (w === undefined && x === undefined) {
      gap = true;
      continue;
    }
    if (gap) throw new Error("Call arguments must be consecutive from register zero.");
    args.push({ value: IntegerSchema.parse(x ?? w), width: x === undefined ? 32 : 64 });
  }
  return args;
}
