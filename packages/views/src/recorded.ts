// Copyright © 2026 Christopher Snow

// Read a compiler record without pretending to execute its architecture.
import { z } from "zod";
import { assemble } from "@al/machine";
import { RecordedSchema, CallSchema } from "./interactives/props";
import { parseListing } from "./listing";
import { traceOf, wValue } from "./trace";

export const RecordedQuerySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("token"),
    program: RecordedSchema,
    instruction: z.number().int().min(0),
    part: z.enum(["mnemonic", "first-operand"]),
  }),
  z.object({
    kind: z.literal("a64-acceptance"),
    program: RecordedSchema,
    instruction: z.number().int().min(0),
  }),
  z.object({ kind: z.literal("a64-result"), program: RecordedSchema, call: CallSchema }),
]);
export type RecordedQuery = z.infer<typeof RecordedQuerySchema>;
export function recordedInstruction(program: { listing: string }, index: number): string {
  const lines = parseListing(program.listing).filter((line) => line.kind === "instruction");
  const line = lines[index];
  if (!line) throw new Error("Recorded instruction index is outside the listing");
  return line.text;
}
export function recordedAnswer(query: RecordedQuery): string {
  if (query.kind === "a64-result") {
    const trace = traceOf(query.program, query.call);
    if (trace.result.stop.kind !== "returned") throw new Error("Recorded A64 query did not return");
    return String(wValue(trace.result.final, 0));
  }
  const text = recordedInstruction(query.program, query.instruction);
  if (query.kind === "a64-acceptance")
    return assemble(`${text}\nret`).program ? "accepted" : "rejected";
  const [mnemonic, ...operands] = text.split(/\s+/);
  if (!mnemonic) throw new Error("Recorded instruction has no mnemonic");
  if (query.part === "mnemonic") return mnemonic;
  const first = operands.join(" ").split(",")[0]?.trim();
  if (!first) throw new Error("Recorded instruction has no operand");
  return first;
}
