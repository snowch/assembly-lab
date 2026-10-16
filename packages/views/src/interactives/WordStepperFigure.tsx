// Copyright © 2026 Christopher Snow

// A program run one instruction at a time, as the stepper does, with every register drawn as a row
// of bits and its value written in hexadecimal and in one decimal reading. For programs whose point
// is in the bits: a field cleared or not, a shift, a rounding. Every value comes from `run()` and
// `stateAfter()` through trace.ts. A program that no compiler made from any C is drawn with its
// instructions alone (`showC` false).

import { useMemo, useState } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { BitRow, Ruler, hex, signedOf, unsignedOf } from "../bits";
import { cLinesOf } from "../listing";
import { stopSentence } from "../messages";
import { ListingView, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue, type StepView, type Trace } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: CallSchema,
  /** The registers to draw: 0 is `w0`. */
  registers: z.array(z.number().int().min(0).max(30)).min(1),
  /** Which decimal reading follows the hexadecimal one. */
  reading: z.enum(["unsigned", "signed"]).default("unsigned"),
  /** Whether the C is drawn beside the instructions. */
  showC: z.boolean().default(true),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

/** What the status line says: what ran, what runs next, how the run ended. */
function statusOf(trace: Trace, view: StepView) {
  const at = (i: number | null) => (i === null ? undefined : trace.lines[i]);
  const ran = at(view.ran);
  const next = at(view.next);
  if (view.k === 0) return S.stepper.start;
  const parts: string[] = [];
  if (ran) parts.push(S.stepper.ran(ran.text));
  if (view.stop !== null) parts.push(stopSentence(view.stop) ?? S.stepper.ended);
  else if (next) parts.push(S.stepper.upNext(next.text));
  return parts.join(" ");
}

export const WordStepperFigure = withProps(Props, function WordStepperFigure({ data, store }) {
  const [k, setK] = useState(0);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const trace = useMemo(() => traceOf(data.program, data.call), [data.program, data.call]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const view = viewAt(trace, k);
  const atEnd = view.k >= view.total;
  const text = (v: number) =>
    `${hex(v)} (${data.reading === "signed" ? signedOf(v) : unsignedOf(v)})`;
  return (
    <div className="al-figure al-stepper" data-figure="word-stepper" data-k={view.k}>
      <ListingView
        cLines={cLinesOf(data.program.c)}
        lines={trace.lines}
        next={view.next}
        litC={view.litC}
        ran={view.ran}
        showC={data.showC}
      />
      <div className="al-controls" role="group" aria-label={S.stepper.controls}>
        <button
          type="button"
          className="button secondary"
          disabled={view.k === 0}
          onClick={() => setK(Math.max(0, view.k - 1))}
        >
          {S.stepper.back}
        </button>
        <button
          type="button"
          className="button primary"
          disabled={atEnd}
          onClick={() => setK(view.k + 1)}
        >
          {S.stepper.next}
        </button>
        <button
          type="button"
          className="button secondary"
          disabled={view.k === 0}
          onClick={() => setK(0)}
        >
          {S.stepper.reset}
        </button>
      </div>
      <p className="al-status" role="status">
        {withCode(statusOf(trace, view))}
      </p>
      <div className="al-bitrows" role="group" aria-label={S.stepper.registers}>
        <Ruler />
        {data.registers.map((n) => {
          const value = wValue(view.state, n);
          return (
            <BitRow
              key={n}
              row={`w${n}`}
              name={`w${n}`}
              value={value}
              text={text(value)}
              written={view.written.has(n)}
            />
          );
        })}
      </div>
    </div>
  );
});
