// Copyright © 2026 Christopher Snow

// What leaving out the clear does, bit by bit, once the learner has made the prediction about it.
// Four rows over one set of bit numbers: the old word, the new value moved into place, the word
// the OR leaves without the clear, and the word the recorded GCC function leaves with it. The old
// field bits that are still set in the OR's answer are marked, and so are the bits where the two
// answers differ. Every row is a value from a run of the model: the old word and the moved value
// from the run without the clear (the register the `orr` reads, just before it), the first answer
// from the end of that run, the second from the end of GCC's.

import { useMemo } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import {
  BitCells,
  CellLegend,
  bitOf,
  differing,
  hex,
  range,
  unsignedOf,
  type CellTag,
} from "../bits";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** The function without the instruction that clears the field. */
  without: RecordedSchema,
  /** The recorded compiler function that does it in full. */
  gcc: RecordedSchema,
  call: CallSchema,
  field: z.object({ from: z.number().int().min(0).max(31), to: z.number().int().min(0).max(31) }),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

const text = (v: number) => `${hex(v)} (${unsignedOf(v)})`;

export const ClearCompare = withProps(Props, function ClearCompare({ data, store }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const mine = useMemo(() => traceOf(data.without, data.call), [data.without, data.call]);
  const theirs = useMemo(() => traceOf(data.gcc, data.call), [data.gcc, data.call]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  // The `orr` is the step that joins the moved value to the word: its second source is the moved value.
  const orIndex = mine.result.steps.findIndex((s) => s.text.startsWith("orr"));
  const orr = mine.program.instructions.find(
    (i) => i.address === mine.result.steps[orIndex]?.address,
  );
  const joined = orr?.operands[2];
  if (orIndex < 0 || joined?.kind !== "reg") throw new Error(S.clearCompare.noOr);
  const old = wValue(viewAt(mine, 0).state, 0);
  const moved = wValue(viewAt(mine, orIndex).state, joined.n);
  const without = wValue(mine.result.final, 0);
  const full = wValue(theirs.result.final, 0);
  const field = range(data.field.from, data.field.to);
  const survive = new Set([...field].filter((n) => bitOf(old, n) === 1 && bitOf(without, n) === 1));
  const differ = differing(without, full);
  const keep = (set: ReadonlySet<number>, tag: CellTag) =>
    new Map<number, CellTag>([...set].map((n) => [n, tag]));
  const withoutTags = new Map<number, CellTag>([
    ...keep(survive, "survives"),
    ...keep(differ, "differs"),
  ]);
  return (
    <div className="al-figure al-compare" data-figure="clear-compare">
      <div className="al-cellrows">
        <BitCells
          row="old"
          name={S.clearCompare.old}
          value={old}
          text={text(old)}
          marks={{ field }}
          tags={keep(survive, "survives")}
          numbers
        />
        <BitCells
          row="moved"
          name={S.clearCompare.moved}
          value={moved}
          text={text(moved)}
          marks={{ field }}
        />
        <BitCells
          row="without"
          name={S.clearCompare.without}
          value={without}
          text={text(without)}
          marks={{ field, changed: differ }}
          tags={withoutTags}
        />
        <BitCells
          row="with"
          name={S.clearCompare.with}
          value={full}
          text={text(full)}
          marks={{ field }}
        />
      </div>
      <CellLegend tags={["survives", "differs"]} />
      <p className="al-status" role="status">
        {S.clearCompare.summary(hex(without), hex(full))}
      </p>
    </div>
  );
});
