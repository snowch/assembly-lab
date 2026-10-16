// Copyright © 2026 Christopher Snow

// What functions return for a call, each worked out by running the function on the model: the call
// as it would be written (`steeper_s(0xffffffff, 1)`) and the value in `w0`, read as the function's
// own type reads it. Shared by the figure that opens Lesson 1 and the prediction after it, which both
// say what the two functions return for the same two patterns.

import { useMemo } from "react";
import { z } from "zod";

import { BRANCH_STRINGS as B } from "../strings.branch";
import { withCode } from "../parts";
import { traceOf, wValue, wValueAsInt } from "../trace";
import { CallSchema, RecordedSchema } from "./props";

export const RunSchema = z.object({
  /** The function that is run: its listing, whether or not the figure shows it. */
  program: RecordedSchema,
  call: CallSchema,
  /** How the function's own type reads what it returns. */
  reading: z.enum(["signed", "unsigned"]),
});
export type RunSpec = z.infer<typeof RunSchema>;

/** An argument as the text writes a pattern: small numbers in decimal, large ones in hexadecimal. */
export function argumentText(value: number): string {
  const pattern = Number(BigInt.asUintN(32, BigInt(value)));
  return pattern < 1 << 20 ? String(pattern) : `0x${pattern.toString(16).padStart(8, "0")}`;
}

/** The call as written, and what the function returns for it. */
export function runOf(spec: RunSpec): { call: string; value: number } {
  const trace = traceOf(spec.program, spec.call);
  const state = trace.result.final;
  return {
    call: `${spec.call.entry}(${spec.call.args.map(argumentText).join(", ")})`,
    value: spec.reading === "signed" ? wValueAsInt(state, 0) : wValue(state, 0),
  };
}

export function RunsList({ runs }: { runs: readonly RunSpec[] }) {
  const results = useMemo(() => runs.map(runOf), [runs]);
  return (
    <ul className="al-runs" aria-label={B.runs.group}>
      {results.map((r, i) => (
        <li key={i} className="al-run" data-entry={runs[i]?.call.entry}>
          {withCode(B.runs.returns(r.call, String(r.value)))}
        </li>
      ))}
    </ul>
  );
}
