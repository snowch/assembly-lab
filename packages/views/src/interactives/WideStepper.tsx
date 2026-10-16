// Copyright © 2026 Christopher Snow

// A few instructions run one at a time on a register that is drawn at its full 64 bits, as two
// halves of 32: the upper half, and the lower half, which is the register's `w` name. Every value is
// what `run()` and `stateAfter()` give, through trace.ts. The registers start at 0, as the machine's
// do. A figure that names a prediction stays shut until it is checked.

import { useMemo, useState } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { cLinesOf } from "../listing";
import { stopSentence } from "../messages";
import { ListingView, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { viewAt, type StepView, type Trace } from "../trace";
import { traceText } from "../traceText";
import { RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** The instructions to run; the C may be empty, and the run starts at the first instruction. */
  program: RecordedSchema,
  /** The register to draw: 3 is `x3`, whose lower half is `w3`. */
  register: z.number().int().min(0).max(30),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
});

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

/** A half of a register: 32 cells in four groups of eight, as every register is drawn. */
function Half({ name, which, bits }: { name: string; which: "upper" | "lower"; bits: string }) {
  const groups = [0, 8, 16, 24].map((from) => bits.slice(from, from + 8));
  return (
    <div className="al-half" data-half={which}>
      <span className="al-half-name">{name}</span>
      <span className="al-bits" aria-hidden="true">
        {groups.map((group, g) => (
          <span className="al-bit-group" key={g}>
            {[...group].map((bit, i) => (
              <span className="al-bit" data-on={bit === "1"} key={i}>
                {bit}
              </span>
            ))}
          </span>
        ))}
      </span>
    </div>
  );
}

export const WideStepper = withProps(Props, function WideStepper({ data, store }) {
  const [k, setK] = useState(0);
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const trace = useMemo(() => traceText(data.program.listing), [data.program.listing]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const view = viewAt(trace, k);
  const atEnd = view.k >= view.total;
  const x = BigInt.asUintN(64, view.state.x[data.register] ?? 0n);
  const name = `x${data.register}`;
  const bits = x.toString(2).padStart(64, "0");
  return (
    <div className="al-figure al-stepper" data-figure="wide-stepper" data-k={view.k}>
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
      <div
        className="al-wide"
        role="group"
        aria-label={S.register.group(name)}
        data-register={name}
        data-changed={view.written.has(data.register)}
      >
        <span className="al-reg-name">{name}</span>
        <code
          className="al-reg-value"
          title={view.written.has(data.register) ? S.register.changed : undefined}
        >
          0x{x.toString(16).padStart(16, "0")}
        </code>
        <Half name={S.wide.upper} which="upper" bits={bits.slice(0, 32)} />
        <Half name={S.wide.lower(`w${data.register}`)} which="lower" bits={bits.slice(32)} />
      </div>
    </div>
  );
});
