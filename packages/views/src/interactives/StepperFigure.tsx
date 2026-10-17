// Copyright © 2026 Christopher Snow

// A recorded program, run one instruction at a time. The listing shows a marker at the instruction
// that runs next (the program counter, drawn as the marker only), the C line GCC recorded for the
// instruction that just ran is lit, and each register is drawn as 32 bits and a number. Every value
// comes from `run()` and `stateAfter()` through trace.ts. An option takes one named line out of the
// listing and runs it again, for the failure experiment.
//
// Module 0 turns on four more things, each an optional prop that is off elsewhere: `flow` (a panel
// under the controls that says what the last instruction read and wrote), `decimal` (registers as
// large decimal numbers, with a switch that opens their 32 bits), `grouped` (the listing as one box
// for each function, marking where the run stops and where it crosses into the next function) and
// `endNote` (a sentence that appears only once the run has ended).

import { useId, useMemo, useState } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { branchStatusAt, jumpedAt } from "../branchPath";
import { crossedFrom, flowAt } from "../flow";
import { cLinesOf, labelOf } from "../listing";
import { FlagsRow } from "../FlagsRow";
import { stopSentence } from "../messages";
import { PanelSchema, StepPanel } from "../panels";
import { DecimalRegister, ListingView, RegisterRow, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { BRANCH_STRINGS as B } from "../strings.branch";
import { MODULE0_STRINGS as M0 } from "../strings.module0";
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
   * After each step, say what the instruction read and wrote: the sources with the values they
   * held, the operation, the destination with its old and new value, and which registers changed.
   */
  flow: z.boolean().default(false),
  /** Draw each register as a large decimal number; a switch opens the 32 bits. */
  decimal: z.boolean().default(false),
  /** Draw the listing as one box for each function, with the run's stopping point and crossings marked. */
  grouped: z.boolean().default(false),
  /** Markdown-free text shown under the figure's status once the run has ended. */
  endNote: z.string().optional(),
  /** After a step that ran a branch, say whether it was taken and what runs next (Module 4). */
  branchStatus: z.boolean().default(false),
  /** A panel under the flags: a compare and `csel` in three stages, or two conditions (Module 4). */
  panel: PanelSchema.optional(),
});

/** What the status line says: what ran, what runs next, how the run ended. */
function statusOf(trace: Trace, view: StepView, branchStatus: boolean) {
  const at = (i: number | null) => (i === null ? undefined : trace.lines[i]);
  const ran = at(view.ran);
  const next = at(view.next);
  if (view.k === 0) return S.stepper.start;
  const branch = branchStatus ? branchStatusAt(trace, view) : null;
  if (branch !== null) return branch;
  const parts: string[] = [];
  if (ran) parts.push(S.stepper.ran(ran.text));
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
 * What the last instruction read and wrote, in words and numbers. Nothing before the first step.
 * "Unchanged" lists every register the figure draws that the instruction did not write, so it
 * agrees with the registers below it, not only the ones the instruction read.
 */
function FlowPanel({ trace, k, shown }: { trace: Trace; k: number; shown: readonly number[] }) {
  const flow = flowAt(trace, k);
  const kept =
    flow?.kind === "arith"
      ? shown
          .map((n) => `${flow.destination.name.charAt(0)}${n}`)
          .filter((name) => !flow.changed.includes(name))
      : [];
  const F = M0.flow;
  return (
    <div
      className="al-flow"
      role="group"
      aria-label={F.label}
      aria-live="polite"
      aria-atomic="true"
      data-flow={flow?.kind ?? "none"}
    >
      {flow?.kind === "arith" && (
        <>
          <p className="al-flow-head">{withCode(F.head(flow.text))}</p>
          <p className="al-flow-equation">
            <span className="al-flow-role">{F.reads}</span>{" "}
            {flow.sources.map((source, i) => (
              <span key={i}>
                {i > 0 && (
                  <span className="al-flow-op">
                    {" "}
                    {flow.operation === "add" ? F.plus : F.minus}{" "}
                  </span>
                )}
                <span className="al-flow-source" data-role="source">
                  {source.isRegister ? F.read(source.name, source.value) : source.name}
                </span>
              </span>
            ))}{" "}
            <span className="al-flow-nowrap">
              <span className="al-flow-op">{F.gives}</span>{" "}
              <span className="al-flow-role">{F.writes}</span>
            </span>{" "}
            <span className="al-flow-destination" data-role="destination">
              {F.wrote(flow.destination.name, flow.destination.after)}
            </span>{" "}
            <span className="al-flow-was">
              ({F.was(flow.destination.name, flow.destination.before)})
            </span>
          </p>
          <p className="al-flow-order">{flow.operation === "add" ? F.adds : F.subtracts}</p>
          <p className="al-flow-sets">
            <span data-set="changed">{F.changed(flow.changed.join(", ") || F.none)}</span>{" "}
            <span data-set="unchanged">{F.unchanged(kept.join(", ") || F.none)}</span>
          </p>
          {flow.continuesInto !== null && (
            <p className="al-flow-continues">{withCode(F.continues(flow.continuesInto))}</p>
          )}
        </>
      )}
      {flow?.kind === "ret" && (
        <>
          <p className="al-flow-head">{withCode(F.head(flow.text))}</p>
          <p className="al-flow-return">{withCode(F.ret)}</p>
        </>
      )}
    </div>
  );
}

export const StepperFigure = withProps(Props, function StepperFigure({ data, store }) {
  const [removed, setRemoved] = useState(false);
  const [k, setK] = useState(0);
  const [bitsShown, setBitsShown] = useState(false);
  const bitsId = useId();
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
  const decimalOnly = data.decimal && !bitsShown;
  return (
    <div
      className="al-figure al-stepper"
      data-figure="stepper"
      data-k={view.k}
      data-jump={data.branchStatus && jumpedAt(trace, view) ? "true" : undefined}
    >
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
        grouped={data.grouped}
        stopAfter={data.grouped && view.stop?.kind === "returned" ? view.ran : null}
        crossedAfter={data.grouped ? crossedFrom(trace, view.k) : null}
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
        {withCode(statusOf(trace, view, data.branchStatus))}
      </p>
      {data.endNote !== undefined && atEnd && (
        <p className="al-endnote">{withCode(data.endNote)}</p>
      )}
      {data.count && (
        <p className="al-count" data-count={view.k}>
          {B.stepper.count(view.k)}
        </p>
      )}
      {data.flow && <FlowPanel trace={trace} k={view.k} shown={data.registers} />}
      {data.decimal && (
        <div className="al-registers-head">
          <span className="al-registers-title">{S.stepper.registers}</span>
          <button
            type="button"
            className="button secondary"
            aria-expanded={bitsShown}
            aria-controls={bitsId}
            onClick={() => setBitsShown(!bitsShown)}
          >
            {bitsShown ? M0.registers.hideBits : M0.registers.showBits}
          </button>
        </div>
      )}
      <div
        id={data.decimal ? bitsId : undefined}
        className="al-registers"
        role="group"
        aria-label={S.stepper.registers}
        data-view={data.decimal ? (decimalOnly ? "decimal" : "bits") : undefined}
      >
        {data.registers.map((n) =>
          decimalOnly ? (
            <DecimalRegister
              key={n}
              name={`w${n}`}
              value={wValue(view.state, n)}
              changed={view.written.has(n)}
            />
          ) : (
            <RegisterRow
              key={n}
              name={`w${n}`}
              value={wValue(view.state, n)}
              changed={view.written.has(n)}
            />
          ),
        )}
      </div>
      {data.flags && (
        <FlagsRow
          flags={view.state.flags}
          before={view.k > 0 ? viewAt(trace, view.k - 1).state.flags : null}
        />
      )}
      {data.panel && <StepPanel panel={data.panel} trace={trace} k={view.k} />}
    </div>
  );
});
