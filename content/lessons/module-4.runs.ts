// Copyright © 2026 Christopher Snow

// What Module 4's facts tests share: run a call on assembly text and read back the answer, the four
// flags and the number of instructions run; read the recorded listings file; and find a function in
// the differential test's corpus. Nothing here is shown to a learner.

import { readFileSync } from "node:fs";

import { assemble, run, type Flags, type RunResult } from "@al/machine";
import { assemblyOf, parseListing } from "@al/views";

export interface Outcome {
  readonly result: RunResult;
  /** What `w0` holds at the end, as an unsigned number. */
  readonly w0: number;
  /** What `w0` holds at the end, read as a signed number. */
  readonly int: number;
  readonly flags: Flags;
  /** How many instructions ran, `ret` included. */
  readonly steps: number;
}

/** Assemble `text` and run `entry` with `args` in `w0`, `w1` and on, the flags as given (clear by default). */
export function callText(
  text: string,
  entry: string,
  args: readonly number[],
  flags?: Flags,
  options: { readonly allowed?: ReadonlySet<string> } = {},
): Outcome {
  const assembled = assemble(text, options);
  if (assembled.program === null)
    throw new Error(`does not assemble: ${JSON.stringify(assembled.errors)}`);
  const result = run(assembled.program, {
    entry,
    args: args.map((value) => ({ value: BigInt(value), width: 32 as const })),
    ...(flags ? { flags } : {}),
  });
  if (result.stop.kind !== "returned")
    throw new Error(`the run did not return: ${result.stop.kind}`);
  const x0 = result.final.x[0] ?? 0n;
  return {
    result,
    w0: Number(BigInt.asUintN(32, x0)),
    int: Number(BigInt.asIntN(32, x0)),
    flags: result.final.flags,
    steps: result.steps.length,
  };
}

/** The flags as the string the differential test's corpus uses: N, Z, C, V, each 0 or 1. */
export const nzcv = (f: Flags): string => `${+f.n}${+f.z}${+f.c}${+f.v}`;

/** A listing as the assembler reads it. */
export const assembly = (listing: string): string => assemblyOf(parseListing(listing));

/** Every flag set: for checking that an instruction leaves the flags as it found them. */
export const ALL_SET: Flags = { n: true, z: true, c: true, v: true };

/** docs/notes/module-4/listings.md, the compiler listings Module 4 records. */
export const recorded = readFileSync(
  new URL("../../docs/notes/module-4/listings.md", import.meta.url),
  "utf8",
);

/** The text of a corpus program (the file's comments removed), as the assembler reads it. */
export function corpusText(name: string): string {
  return assemblyOf(
    parseListing(
      readFileSync(new URL(`../../scripts/real-tools/corpus/${name}.s`, import.meta.url), "utf8")
        .split("\n")
        .filter((l) => !l.startsWith("//"))
        .join("\n"),
    ),
  );
}

/** The lines of the function `label` in some assembly text: its instructions, up to the next function's label. */
export function functionIn(text: string, label: string): string[] {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  const start = lines.findIndex((l) => l.trim() === `${label}:`);
  if (start < 0) throw new Error(`no function ${label}`);
  const out: string[] = [];
  for (const l of lines.slice(start + 1)) {
    // A function ends at the next label that is not a local one (`.L7:` belongs to its function).
    if (/^[A-Za-z_][\w$]*:$/.test(l.trim())) break;
    out.push(l.trim());
  }
  return out;
}
