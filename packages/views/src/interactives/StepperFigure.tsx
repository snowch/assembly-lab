// Copyright © 2026 Christopher Snow

// A recorded program, run one instruction at a time. The listing shows a marker at the instruction
// that runs next (the program counter, drawn as the marker only), the C line GCC recorded for the
// instruction that just ran is lit, and each register is drawn as 32 bits and a number. Every value
// comes from `run()` and `stateAfter()` through trace.ts. An option takes one named line out of the
// listing and runs it again, for the failure experiment.

import { useMemo, useState } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { cLinesOf, labelOf } from "../listing";
import { FlagsRow, type FlagsExplained } from "../FlagsRow";
import { stopSentence } from "../messages";
import { ListingView, RegisterRow, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { ARITH_STRINGS as A } from "../strings.arith";
import { BRANCH_STRINGS as B } from "../strings.branch";
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
  /** Draw the four flags under the registers, the one the last instruction changed outlined. */
  flags: z.boolean().default(false),
  /** Say how many instructions have run so far. */
  count: z.boolean().default(false),
  /**
   * Write "changed" beside each register and under each flag the last instruction changed, and say
   * after an `add` or `sub` that it left the flags alone. The outline stays as it is.
   */
  showChanges: z.boolean().default(false),
  /** Say under each flag what it records. */
  explainFlags: z.boolean().default(false),
});

/**
 * What the status line says: what ran, what runs next, how the run ended. A sentence about what the
 * instruction that ran did or did not do (`afterRan`) comes straight after the one that names it.
 */
function statusOf(trace: Trace, view: StepView, afterRan?: string | null) {
  const at = (i: number | null) => (i === null ? undefined : trace.lines[i]);
  const ran = at(view.ran);
  const next = at(view.next);
  if (view.k === 0) return S.stepper.start;
  const parts: string[] = [];
  if (ran) parts.push(S.stepper.ran(ran.text));
  if (afterRan) parts.push(afterRan);
  if (view.stop !== null) parts.push(stopSentence(view.stop) ?? S.stepper.ended);
  else if (next) {
    // Say which function the run has crossed into, only when the label changes.
    const into = labelOf(trace.lines, view.next as number);
    const from = view.ran === null ? null : labelOf(trace.lines, view.ran);
    parts.push(
      into !== null && from !== null && into !== from
        ? S.stepper.upNextIn(next.text, into)
        : S.stepper.upNext(next.text),
    );
  }
  return parts.join(" ");
}

/**
 * What the instruction that just ran did not do: an `add` or a `sub` writes a register and leaves
 * the flags alone. It is read from the instruction's kind, never from the flags before and after,
 * so an `adds` that happens to leave the flags as they were is not described this way.
 */
function leftFlagsAlone(trace: Trace, k: number): string | null {
  const step = k > 0 ? trace.result.steps[k - 1] : undefined;
  const ins = step && trace.program.instructions.find((i) => i.address === step.address);
  if (!step || !ins || ins.op.k !== "addsub" || ins.op.setFlags) return null;
  const written = step.writes.find((w) => w.reg !== "sp");
  if (!written || written.reg === "sp") return null;
  return A.stepper.notUpdated(`${ins.op.w === 32 ? "w" : "x"}${written.reg}`, ins.mnemonic);
}

/** What the flags now showing record: an addition's carry out, or a subtraction's borrow. */
function flagsKind(trace: Trace, k: number): FlagsExplained {
  for (let i = k - 1; i >= 0; i--) {
    const step = trace.result.steps[i];
    const ins = step && trace.program.instructions.find((n) => n.address === step.address);
    if (ins && ins.op.k === "addsub" && ins.op.setFlags)
      return ins.op.sub ? "subtraction" : "addition";
  }
  return "addition";
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
        {withCode(statusOf(trace, view, data.showChanges ? leftFlagsAlone(trace, view.k) : null))}
      </p>
      {data.count && (
        <p className="al-count" data-count={view.k}>
          {B.stepper.count(view.k)}
        </p>
      )}
      <div className="al-registers" role="group" aria-label={S.stepper.registers}>
        {data.registers.map((n) => (
          <RegisterRow
            key={n}
            name={`w${n}`}
            value={wValue(view.state, n)}
            changed={view.written.has(n)}
            {...(data.showChanges
              ? { tag: view.written.has(n) ? A.stepper.registerChanged : "" }
              : {})}
          />
        ))}
      </div>
      {data.flags && (
        <FlagsRow
          flags={view.state.flags}
          before={view.k > 0 ? viewAt(trace, view.k - 1).state.flags : null}
          {...(data.explainFlags ? { explain: flagsKind(trace, view.k) } : {})}
          tagChanged={data.showChanges}
        />
      )}
    </div>
  );
});
