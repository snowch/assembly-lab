// Copyright © 2026 Christopher Snow

// Interactive props arrive from lesson data as a plain record. Each figure declares a zod schema for
// its props; a lesson whose props do not fit gets a sentence on the page, where the figure would
// be, saying what is wrong, instead of a broken view. The props are parsed once per lesson record,
// not once per render, so a figure that built a run from them keeps its place.

import { useMemo, type ComponentType } from "react";
import { z, type ZodType } from "zod";

import type { InteractiveProps } from "@platform/lesson-runtime";
import { ArgumentSchema, MemorySchema } from "../call";

/** A program as a lesson records it: its C and the compiler's listing. */
export const RecordedSchema = z.object({
  c: z.string(),
  listing: z.string(),
  sourceLines: z
    .array(z.array(z.number().int().min(1)).readonly())
    .readonly()
    .optional(),
});

/** A call: a label in the listing, and the values of `w0`, `w1` and on. */
export const CallSchema = z.object({
  entry: z.string(),
  args: z.array(z.number().int()),
  /** Bounded traces for loops. Calls that omit it retain the machine's default. */
  maxSteps: z.number().int().min(1).max(1000).optional(),
});

/** Exact-width arguments and private fixture bytes for memory lessons. */
export const MemoryCallSchema = CallSchema.extend({
  args: z.array(ArgumentSchema).max(8),
  memory: MemorySchema.optional(),
});

/** One line of a listing that a figure can take out. */
export const DeleteSchema = z.object({ label: z.string(), text: z.string() });

/**
 * The keys a written challenge's editor offers, in the challenge's `initial.data.editor`. Every
 * field is optional and a challenge without it gets today's editor: the symbol bar's characters
 * (`symbols`), the registers the tap mode offers (`registers`, else the challenge's palette), and
 * whether the tap mode offers a number pad (`numberPad`, true unless it says false).
 */
export const EditorKeysSchema = z.object({
  symbols: z.array(z.string().min(1)).optional(),
  registers: z.array(z.string().min(1)).optional(),
  numberPad: z.boolean().optional(),
  /** The names of the labels the tap mode offers, as a branch writes them (`.Llow`). */
  labels: z.array(z.string().min(1)).optional(),
  /** The conditions the tap mode offers for `csel` and for `b.cond`, else the lessons' ten. */
  conditions: z.array(z.string().min(1)).optional(),
  /** Address operands taught by this challenge; the tap editor offers only these choices. */
  addresses: z.array(z.string().min(1)).optional(),
  /** Optional final operand on `add`/`sub`, such as `sxtw`. */
  extensions: z.array(z.string().min(1)).optional(),
});
export type EditorKeys = z.infer<typeof EditorKeysSchema>;

/**
 * The instructions the course has introduced by a written challenge's lesson, in the challenge's
 * `initial.data.introduced` (the content package works it out from the lessons' own data). A
 * challenge without it gets no such list, and every instruction its gate leaves out is "not met
 * yet".
 */
export const IntroducedSchema = z.array(z.string().min(1));

/** The set the challenge's `initial.data.introduced` names, or undefined if it names none. */
export function introducedOf(challenge: {
  initial: { data?: Record<string, unknown> | undefined };
}): ReadonlySet<string> | undefined {
  const parsed = IntroducedSchema.safeParse(challenge.initial.data?.["introduced"]);
  return parsed.success ? new Set(parsed.data) : undefined;
}

/** A labelled bit or field of a word, lowest bit first (the same bit twice for a single bit). */
export const KeyEntrySchema = z.object({
  from: z.number().int().min(0).max(31),
  to: z.number().int().min(0).max(31),
  label: z.string(),
});

export function withProps<T>(
  schema: ZodType<T>,
  Inner: ComponentType<InteractiveProps & { data: T }>,
): ComponentType<InteractiveProps> {
  return function Parsed(props: InteractiveProps) {
    const raw = props.interactive.props;
    const parsed = useMemo(() => schema.safeParse(raw), [raw]);
    if (!parsed.success) {
      const lines = parsed.error.issues.map(
        (i) => `${i.path.join(".") || "(props)"}: ${i.message}`,
      );
      return (
        <p role="note" className="interactive-problem">
          {`${props.interactive.kind} (${props.interactive.id}): ${lines.join("; ")}`}
        </p>
      );
    }
    return <Inner {...props} data={parsed.data} />;
  };
}
