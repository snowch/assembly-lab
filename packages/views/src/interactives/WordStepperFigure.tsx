// Copyright © 2026 Christopher Snow

// A program run one instruction at a time, as the stepper does, with every register drawn as a row
// of bits and its value written in hexadecimal and in one decimal reading. For programs whose point
// is in the bits: a field cleared or not, a shift, a rounding. Every value comes from `run()` and
// `stateAfter()` through trace.ts. A program that no compiler made from any C is drawn with its
// instructions alone (`showC` false).
//
// Optionally: a choice among several calls of the program (`calls`), and, after each step, the
// register's value before and after it and, for an instruction whose last operand is a shifted
// register (`add w0, w0, w0, lsr 31`), the value of that operand (`operand`). The operand's value
// is worked out from the state before the step, as the instruction forms it; the register it reads
// is not changed by forming it.

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
  /** Other calls of the same program the learner may choose (the first is the figure's own `call`). */
  calls: z
    .array(z.object({ label: z.string(), call: CallSchema }))
    .min(2)
    .optional(),
  /** The registers to draw: 0 is `w0`. */
  registers: z.array(z.number().int().min(0).max(30)).min(1),
  /** Which decimal reading follows the hexadecimal one. */
  reading: z.enum(["unsigned", "signed"]).default("unsigned"),
  /** Whether the C is drawn beside the instructions. */
  showC: z.boolean().default(true),
  /** Draw each step's register before and after, and the value of a shifted last operand. */
  operand: z.boolean().default(false),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

/** What the status line says: what ran, what runs next, how the run ended. */
export function statusOf(trace: Trace, view: StepView) {
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

/** Back, Next and Reset, for a stepper that keeps its place in `k`. */
export function StepControls({ view, setK }: { view: StepView; setK: (k: number) => void }) {
  const atEnd = view.k >= view.total;
  return (
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
  );
}

/** The operand of the instruction that ran as step `k`, when its last operand is a shifted register. */
export interface ShiftedOperand {
  /** The operand as written: `w0, lsr 31`. */
  readonly text: string;
  /** The register it reads. */
  readonly register: number;
  /** Its value, as a 32-bit pattern: the register's value before the step, shifted. */
  readonly value: number;
}

export function operandOf(trace: Trace, k: number): ShiftedOperand | null {
  const step = trace.result.steps[k - 1];
  if (!step) return null;
  const ins = trace.program.instructions.find((i) => i.address === step.address);
  if (!ins || (ins.op.k !== "addsub" && ins.op.k !== "logic")) return null;
  const src = ins.op.src;
  if (src.t !== "shifted" || src.amount <= 0 || ins.op.w !== 32) return null;
  const register = viewAt(trace, k - 1).state;
  const v = wValue(register, src.rm);
  const value =
    src.shift === "lsl"
      ? (v << src.amount) >>> 0
      : src.shift === "lsr"
        ? v >>> src.amount
        : src.shift === "asr"
          ? ((v | 0) >> src.amount) >>> 0
          : null;
  if (value === null) return null;
  const texts = ins.operands.slice(-2).map((o) => o.text);
  return { text: texts.join(", "), register: src.rm, value };
}

/** A register's value before and after step `k`, with a shifted operand's value between them. */
function StepFacts({
  trace,
  k,
  reading,
}: {
  trace: Trace;
  k: number;
  reading: "unsigned" | "signed";
}) {
  const step = trace.result.steps[k - 1];
  if (!step) return null;
  const text = (v: number) => `${hex(v)} (${reading === "signed" ? signedOf(v) : unsignedOf(v)})`;
  const before = viewAt(trace, k - 1).state;
  const after = viewAt(trace, k).state;
  const operand = operandOf(trace, k);
  const written = step.writes.flatMap((w) => (typeof w.reg === "number" ? [w.reg] : []));
  if (written.length === 0) return null;
  return (
    <table className="al-key al-facts" data-step={k}>
      <caption className="visually-hidden">{S.operand.facts}</caption>
      <tbody>
        {written.map((n) => {
          const b = wValue(before, n);
          const a = wValue(after, n);
          return [
            <tr key={`${n}-b`} data-fact="before" data-value={b}>
              <th scope="row">{S.bitOps.rowBefore(`w${n}`)}</th>
              <td>{text(b)}</td>
            </tr>,
            ...(operand !== null && operand.register === n
              ? [
                  <tr key={`${n}-o`} data-fact="operand" data-value={operand.value}>
                    <th scope="row">{withCode(S.operand.operand(operand.text))}</th>
                    <td>{text(operand.value)}</td>
                  </tr>,
                ]
              : []),
            <tr key={`${n}-a`} data-fact="after" data-value={a}>
              <th scope="row">{S.bitOps.rowAfter(`w${n}`)}</th>
              <td>{text(a)}</td>
            </tr>,
          ];
        })}
      </tbody>
    </table>
  );
}

export const WordStepperFigure = withProps(Props, function WordStepperFigure({ data, store }) {
  const [k, setK] = useState(0);
  const [which, setWhich] = useState(0);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const call = data.calls?.[which]?.call ?? data.call;
  const trace = useMemo(() => traceOf(data.program, call), [data.program, call]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const view = viewAt(trace, k);
  const text = (v: number) =>
    `${hex(v)} (${data.reading === "signed" ? signedOf(v) : unsignedOf(v)})`;
  return (
    <div
      className="al-figure al-stepper"
      data-figure="word-stepper"
      data-k={view.k}
      data-call={data.calls?.[which]?.label}
    >
      {data.calls && (
        <div className="asm-field" role="group" aria-label={S.calls.group}>
          <span className="asm-field-label">{S.calls.group}</span>
          <div className="asm-chips">
            {data.calls.map((c, i) => (
              <button
                key={c.label}
                type="button"
                className="chip"
                aria-pressed={i === which}
                onClick={() => {
                  setWhich(i);
                  setK(0);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <ListingView
        cLines={cLinesOf(data.program.c)}
        lines={trace.lines}
        next={view.next}
        litC={view.litC}
        ran={view.ran}
        showC={data.showC}
      />
      <StepControls view={view} setK={setK} />
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
      {data.operand && <StepFacts trace={trace} k={view.k} reading={data.reading} />}
    </div>
  );
});
