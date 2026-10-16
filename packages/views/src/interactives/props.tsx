// Copyright © 2026 Christopher Snow

// Interactive props arrive from lesson data as a plain record. Each figure declares a zod schema for
// its props; a lesson whose props do not fit gets a sentence on the page, where the figure would
// be, saying what is wrong, instead of a broken view. The props are parsed once per lesson record,
// not once per render, so a figure that built a run from them keeps its place.

import { useMemo, type ComponentType } from "react";
import { z, type ZodType } from "zod";

import type { InteractiveProps } from "@platform/lesson-runtime";

/** A program as a lesson records it: its C and the compiler's listing. */
export const RecordedSchema = z.object({ c: z.string(), listing: z.string() });

/** A call: a label in the listing, and the values of `w0`, `w1` and on. */
export const CallSchema = z.object({ entry: z.string(), args: z.array(z.number().int()) });

/** One line of a listing that a figure can take out. */
export const DeleteSchema = z.object({ label: z.string(), text: z.string() });

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
