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
import { FlagsRow, type FlagsExplained } from "../FlagsRow";
import { stopSentence } from "../messages";
import { PanelSchema, StepPanel } from "../panels";
import { DecimalRegister, ListingView, RegisterRow, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { ARITH_STRINGS as A } from "../strings.arith";
import { BRANCH_STRINGS as B } from "../strings.branch";
import { MODULE0_STRINGS as M0 } from "../strings.module0";
import { shown } from "../readings";
import { MODULE1_STRINGS as M1 } from "../strings.module1";
import { traceOf, viewAt, wValue, wValueAsInt, type StepView, type Trace } from "../trace";
import { CallSchema, DeleteSchema, RecordedSchema, withProps } from "./props";
import { OperandDiagram } from "./OperandRoles";

const Props = z.object({
  program: RecordedSchema,
  /** Stage a first subtraction with argument names and two readings of its result. */
  subtractionReadings: z
    .object({ argumentNames: z.array(z.string()), register: z.number().int().min(0).max(30) })
    .optional(),
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
  /**
   * Write "changed" beside each register and under each flag the last instruction changed, and say
   * after an `add` or `sub` that it left the flags alone. The outline stays as it is.
   */
  showChanges: z.boolean().default(false),
  /** Say under each flag what it records. */
  explainFlags: z.boolean().default(false),
  /**
   * Before each step, ask which register the next instruction will write. The learner picks from
   * the drawn registers; the step then says whether the pick was right before it shows the run.
   */
  expect: z.boolean().default(false),
  /** A worked first step, later register checks, and optional detailed explanation. */
  compact: z.boolean().default(false),
});

/**
 * What the status line says: what ran, what runs next, how the run ended. A sentence about what the
 * instruction that ran did or did not do (`afterRan`) comes straight after the one that names it.
 */
function statusOf(trace: Trace, view: StepView, branchStatus: boolean, afterRan?: string | null) {
  const at = (i: number | null) => (i === null ? undefined : trace.lines[i]);
  const ran = at(view.ran);
  const next = at(view.next);
  if (view.k === 0) return S.stepper.start;
  const branch = branchStatus ? branchStatusAt(trace, view) : null;
  if (branch !== null) {
    const stopped = view.stop === null ? null : stopSentence(view.stop);
    return stopped === null ? branch : stopped;
  }
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
  const [bitsShown, setBitsShown] = useState(false);
  // The register the learner picked for the instruction about to run, and the verdict on the
  // pick once that instruction has run: the register it actually wrote.
  const [picked, setPicked] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<{ right: boolean; register: number } | null>(null);
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
  if (data.subtractionReadings) {
    const first = flowAt(trace, 1);
    if (
      first?.kind !== "arith" ||
      first.operation !== "sub" ||
      first.destination.name !== `w${data.subtractionReadings.register}` ||
      trace.result.steps.length !== 2 ||
      flowAt(trace, 2)?.kind !== "ret"
    )
      throw new Error(
        "subtractionReadings requires one 32-bit subtraction followed by ret, reading its destination.",
      );
  }
  const view = viewAt(trace, k);
  const atEnd = view.k >= view.total;
  const flow = flowAt(trace, view.k);
  // With `expect`, the learner answers for the instruction they are about to run: they pick the
  // register it will write, and the step that follows says whether the pick was right before it
  // shows what the instruction did. A pick or a verdict belongs to one instruction only: any
  // movement clears both.
  const nextWritten = (() => {
    if (view.next === null) return null;
    const reg = trace.result.steps[view.k]?.writes.find((w) => w.reg !== "sp")?.reg;
    return typeof reg === "number" ? reg : null;
  })();
  const ask = data.expect && (!data.compact || (view.k > 0 && nextWritten !== null));
  const step = (to: number) => {
    // The verdict names the pick against the register the instruction being run writes.
    if (picked !== null && view.next !== null && nextWritten !== null && to === view.k + 1)
      setVerdict({ right: picked === nextWritten, register: nextWritten });
    else setVerdict(null);
    setPicked(null);
    setK(to);
  };
  const controls = (
    <div className="al-controls" role="group" aria-label={S.stepper.controls}>
      <button
        type="button"
        className="button secondary"
        disabled={view.k === 0}
        onClick={() => step(Math.max(0, view.k - 1))}
      >
        {S.stepper.back}
      </button>
      <button
        type="button"
        className="button primary"
        disabled={atEnd}
        onClick={() => step(view.k + 1)}
      >
        {S.stepper.next}
      </button>
      <button
        type="button"
        className="button secondary"
        disabled={view.k === 0}
        onClick={() => step(0)}
      >
        {S.stepper.reset}
      </button>
    </div>
  );
  const question = ask && view.next !== null && (
    <div className="al-expect" role="group" aria-label={S.stepper.expectGroup}>
      <p className="al-expect-ask">
        {withCode(
          S.stepper.expectAsk(
            trace.lines[view.next]!.kind === "instruction" ? trace.lines[view.next]!.text : "",
          ),
        )}
      </p>
      <div className="al-expect-picks" role="group" aria-label={S.stepper.expectChoices}>
        {data.registers.map((n) => (
          <button
            type="button"
            className="button secondary al-expect-pick"
            key={n}
            data-picked={picked === n}
            aria-pressed={picked === n}
            onClick={() => setPicked(n)}
          >
            {`w${n}`}
          </button>
        ))}
      </div>
    </div>
  );
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
        ran={view.ran}
        grouped={data.grouped}
        stopAfter={data.grouped && view.stop?.kind === "returned" ? view.ran : null}
        crossedAfter={data.grouped ? crossedFrom(trace, view.k) : null}
      />
      {!data.compact && controls}
      {!data.compact && question}
      <p className="al-status" role="status">
        {withCode(
          data.compact
            ? [
                verdict !== null
                  ? verdict.right
                    ? S.stepper.compactRight
                    : S.stepper.compactWrong
                  : null,
                flow?.kind === "arith"
                  ? S.stepper.result(
                      flow.destination.name,
                      flow.sources[0].value,
                      flow.operation === "add" ? "+" : "−",
                      flow.sources[1].value,
                      flow.destination.after,
                    )
                  : flow?.kind === "ret"
                    ? S.stepper.ended
                    : S.stepper.start,
              ]
                .filter((part) => part !== null)
                .join(" ")
            : [
                data.expect && verdict !== null
                  ? verdict.right
                    ? S.stepper.expectRight(`w${verdict.register}`)
                    : S.stepper.expectWrong(`w${verdict.register}`)
                  : null,
                statusOf(
                  trace,
                  view,
                  data.branchStatus,
                  data.showChanges ? leftFlagsAlone(trace, view.k) : null,
                ),
              ]
                .filter((part) => part !== null)
                .join(" "),
        )}
      </p>
      {data.endNote !== undefined && atEnd && (
        <p className="al-endnote">{withCode(data.endNote)}</p>
      )}
      {data.count && (
        <p className="al-count" data-count={view.k}>
          {B.stepper.count(view.k)}
        </p>
      )}
      {data.subtractionReadings && (
        <div className="al-reading-stage" role="group" aria-label={M1.opener.stage}>
          <p className="al-reading-phase">{view.k === 0 ? M1.opener.before : M1.opener.after}</p>
          {view.k === 0 && (
            <p className="al-reading-inputs">
              {data.subtractionReadings.argumentNames.map((name, n) => (
                <span key={n}>
                  <code>{name}</code> → <code>w{n}</code> = {wValue(view.state, n)}
                </span>
              ))}
            </p>
          )}
          {(() => {
            // The first instruction's sources come from its actual before-state, including
            // while that state is still on screen. Never substitute the post-step destination.
            const calculation = flowAt(trace, 1);
            return calculation?.kind === "arith" ? (
              <p className="al-reading-operation">
                {view.k === 0 ? M1.opener.willRead : M1.opener.read}{" "}
                {calculation.sources.map((source, i) => (
                  <span key={i}>
                    {i > 0 && " − "}
                    <code>{source.name}</code> ({source.value})
                  </span>
                ))}{" "}
                → {view.k === 0 ? M1.opener.willWrite : M1.opener.wrote}{" "}
                <code>{calculation.destination.name}</code>
              </p>
            ) : null;
          })()}
          <p>{M1.opener.unsignedDisplay}</p>
        </div>
      )}
      {data.flow && !data.compact && <FlowPanel trace={trace} k={view.k} shown={data.registers} />}
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
              {...(data.showChanges
                ? { tag: view.written.has(n) ? A.stepper.registerChanged : "" }
                : {})}
            />
          ),
        )}
      </div>
      {data.subtractionReadings && view.k > 0 && (
        <div className="al-dual-reading" role="group" aria-label={M1.opener.readings}>
          <p>{withCode(M1.opener.samePattern(`w${data.subtractionReadings.register}`))}</p>
          <dl>
            <div>
              <dt>{M1.opener.signed}</dt>
              <dd data-reading="signed">
                {shown(wValueAsInt(view.state, data.subtractionReadings.register))}
              </dd>
            </div>
            <div>
              <dt>{M1.opener.unsigned}</dt>
              <dd data-reading="unsigned">
                {wValue(view.state, data.subtractionReadings.register)}
              </dd>
            </div>
          </dl>
          <p>{M1.opener.sameBits}</p>
        </div>
      )}
      {data.flags && (
        <FlagsRow
          flags={view.state.flags}
          before={view.k > 0 ? viewAt(trace, view.k - 1).state.flags : null}
          {...(data.explainFlags ? { explain: flagsKind(trace, view.k) } : {})}
          tagChanged={data.showChanges}
        />
      )}
      {data.compact && data.flow && view.k === 1 && flow?.kind === "arith" && (
        <div className="al-first-step">
          <p>{withCode(M0.flow.operandRule)}</p>
          <OperandDiagram
            data={{
              name: flow.operation,
              operands: [flow.destination.name, ...flow.sources.map((source) => source.name)],
              operation:
                flow.operation === "add" ? M0.flow.addOperation : M0.flow.subtractOperation,
            }}
          />
        </div>
      )}
      {data.compact && data.flow && view.k > 0 && (
        <details className="al-step-explanation" key={view.k}>
          <summary>{S.stepper.explain}</summary>
          <FlowPanel trace={trace} k={view.k} shown={data.registers} />
        </details>
      )}
      {data.compact && question}
      {data.compact && !ask && view.next !== null && (
        <p className="al-up-next">{withCode(S.stepper.upNext(trace.lines[view.next]!.text))}</p>
      )}
      {data.compact && controls}
      {data.panel && <StepPanel panel={data.panel} trace={trace} k={view.k} />}
    </div>
  );
});
