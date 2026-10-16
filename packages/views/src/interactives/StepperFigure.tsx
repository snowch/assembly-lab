// Copyright © 2026 Christopher Snow

// A recorded program, run one instruction at a time. The listing shows a marker at the instruction
// that runs next (the program counter, drawn as the marker only), the C line GCC recorded for the
// instruction that just ran is lit, and each register is drawn as 32 bits and a number. Every value
// comes from `run()` and `stateAfter()` through trace.ts. An option takes one named line out of the
// listing and runs it again, for the failure experiment.

import { useMemo, useState } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { cLinesOf } from "../listing";
import { stopSentence } from "../messages";
import { ListingView, RegisterRow, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue, type StepView, type Trace } from "../trace";
import { CallSchema, DeleteSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: CallSchema,
  /** The registers to draw: 0 is `w0`. */
  registers: z.array(z.number().int().min(0).max(30)).min(1),
  /** A line the learner may take out; the run starts again without it. */
  removable: DeleteSchema.optional(),
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

export const StepperFigure = withProps(Props, function StepperFigure({ data, store }) {
  const [removed, setRemoved] = useState(false);
  const [k, setK] = useState(0);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const trace = useMemo(
    () => traceOf(data.program, data.call, removed ? data.removable : undefined),
    [data.program, data.call, data.removable, removed],
  );
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const view = viewAt(trace, k);
  const atEnd = view.k >= view.total;
  return (
    <div className="al-figure al-stepper" data-figure="stepper" data-k={view.k}>
      {data.removable && (
        <label className="al-switch">
          <input
            type="checkbox"
            checked={removed}
            onChange={(e) => {
              setRemoved(e.target.checked);
              setK(0);
            }}
          />
          <span>{withCode(S.stepper.deleteLine(data.removable.text))}</span>
        </label>
      )}
      <ListingView
        cLines={cLinesOf(data.program.c)}
        lines={trace.lines}
        next={view.next}
        litC={view.litC}
        ran={view.ran}
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
      <div className="al-registers" role="group" aria-label={S.stepper.registers}>
        {data.registers.map((n) => (
          <RegisterRow
            key={n}
            name={`w${n}`}
            value={wValue(view.state, n)}
            changed={view.written.has(n)}
          />
        ))}
      </div>
    </div>
  );
});
