// Copyright © 2026 Christopher Snow

import { useHandoffState } from "../update-handoff";

// A few instructions run one at a time on a register that is drawn in halves. Every value is what
// `run()` and `stateAfter()` give, through trace.ts. The registers start at 0, as the machine's do.
// A figure that names a prediction stays shut until it is checked.
//
// Three modes, chosen by the `mode` prop:
//   "x64" (the default): an `x` register at its full 64 bits, as two halves of 32, the upper half
//     and the lower half, which is the register's `w` name.
//   "x64-named": the same register as one box named by its `x` name, whose lower half carries the
//     `w` name inside it. After a step, each half says in words whether the step wrote it, and a
//     write to the `w` name says it cleared the upper half.
//   "w16": a `w` register at 32 bits, as two halves of 16, each as four hexadecimal digits over its
//     16 bits, with the boundary between them, and after a step each half tagged new or kept. The
//     program may be a recorded one, or the learner's own saved work for a challenge (`fromChallenge`),
//     which is then assembled with that challenge's gate and run; the figure stays shut until the
//     saved work passes the challenge's tests, graded afresh.

import { useMemo } from "react";
import { z } from "zod";

import { useSlot, useStored } from "@platform/lesson-runtime";

import { cLinesOf } from "../listing";
import { stopSentence } from "../messages";
import { halves16, wide64, type HalfTag, type WideTag } from "../halves";
import { ListingView, withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { ARITH_STRINGS as A } from "../strings.arith";
import { MODULE1_STRINGS as M1 } from "../strings.module1";
import { viewAt, wValue, type StepView, type Trace } from "../trace";
import { traceAssembly, traceText } from "../traceText";
import { passedChallenge, savedWork } from "./gate";
import { RecordedSchema, introducedOf, withProps } from "./props";

const Props = z
  .object({
    /** The instructions to run; the C may be empty, and the run starts at the first instruction. */
    program: RecordedSchema.optional(),
    /** The register to draw: 3 is `x3`, whose lower half is `w3`; in "w16" mode 0 is `w0`. */
    register: z.number().int().min(0).max(30),
    /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
    after: z.string().optional(),
    mode: z.enum(["x64", "x64-named", "w16"]).default("x64"),
    /**
     * "w16" only: the id of a written challenge in this lesson. The program is the learner's saved
     * text for it, and the figure stays shut until that text passes the challenge's tests.
     */
    fromChallenge: z.string().optional(),
  })
  .refine((d) => d.program !== undefined || (d.mode === "w16" && d.fromChallenge !== undefined), {
    message: "needs a program, or a challenge to take the learner's program from",
  });
type Data = z.infer<typeof Props>;

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
function Half({
  name,
  which,
  bits,
  alias,
  tag,
}: {
  name: string;
  which: "upper" | "lower";
  bits: string;
  /** The other name of this half, drawn inside the box with it. */
  alias?: string | undefined;
  /** What the last instruction did to this half, in words. */
  tag?: WideTag | null | undefined;
}) {
  const groups = [0, 8, 16, 24].map((from) => bits.slice(from, from + 8));
  return (
    <div className="al-half" data-half={which} data-tag={tag ?? undefined}>
      <span className="al-half-name">
        {name}
        {alias !== undefined && (
          <span className="al-half-alias" data-alias={alias}>
            {alias}
          </span>
        )}
        {tag !== undefined && (
          <span className="al-half-tag" data-tag={tag ?? "none"}>
            {tag === null ? " " : M1.wide[tag]}
          </span>
        )}
      </span>
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

/** One half of a `w` register: four hexadecimal digits, each over its four bits. */
function Half16({
  name,
  which,
  bits,
  digits,
  tag,
}: {
  name: string;
  which: "upper" | "lower";
  bits: string;
  digits: string;
  tag: HalfTag | null;
}) {
  return (
    <div
      className="al-h16"
      role="group"
      aria-label={`${name} ${digits}${tag === null ? "" : `, ${M1.halves[tag]}`}`}
      data-half={which}
      data-tag={tag ?? "none"}
    >
      <span className="al-h16-head">
        <span className="al-half-name">{name}</span>
        <span className="al-h16-tag" data-tag={tag ?? "none"}>
          {tag === null ? " " : M1.halves[tag]}
        </span>
      </span>
      <span className="al-h16-groups" aria-hidden="true">
        {[0, 1, 2, 3].map((g) => (
          <span className="al-h16-group" key={g}>
            <code className="al-h16-digit">{digits[g]}</code>
            <span className="al-h16-bits">
              {[...bits.slice(g * 4, g * 4 + 4)].map((bit, i) => (
                <span className="al-bit" data-on={bit === "1"} key={i}>
                  {bit}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}

function Stepping({ data, trace }: { data: Data; trace: Trace }) {
  const [k, setK] = useHandoffState("WideStepper.k", 0);
  const view = viewAt(trace, k);
  const atEnd = view.k >= view.total;
  const n = data.register;
  const showC = data.program !== undefined;
  const controls = (
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
  const listing = (
    <ListingView
      cLines={showC ? cLinesOf(data.program?.c ?? "") : []}
      lines={trace.lines}
      next={view.next}
      ran={view.ran}
    />
  );
  const status = (
    <p className="al-status" role="status">
      {withCode(statusOf(trace, view))}
    </p>
  );

  if (data.mode === "w16") {
    const h = halves16(trace, view.k, n);
    const name = `w${n}`;
    return (
      <div
        className="al-figure al-stepper"
        data-figure="wide-stepper"
        data-mode="w16"
        data-k={view.k}
      >
        {listing}
        {controls}
        {status}
        <div
          className="al-wide al-wide16"
          role="group"
          aria-label={M1.halves.group(name)}
          data-register={name}
          data-changed={view.written.has(n)}
        >
          <span className="al-reg-name">{name}</span>
          <code className="al-reg-hex" title={M1.halves.whole}>
            0x<span className="al-reg-hex-half">{h.upper}</span>
            <span className="al-reg-hex-gap" />
            <span className="al-reg-hex-half">{h.lower}</span>
          </code>
          <span
            className="al-reg-value"
            title={view.written.has(n) ? S.register.changed : undefined}
          >
            {wValue(view.state, n)}
          </span>
          <div className="al-h16-pair">
            <Half16
              name={M1.register.upperHalf}
              which="upper"
              bits={h.bits.slice(0, 16)}
              digits={h.upper}
              tag={h.tag?.upper ?? null}
            />
            <Half16
              name={M1.register.lowerHalf}
              which="lower"
              bits={h.bits.slice(16)}
              digits={h.lower}
              tag={h.tag?.lower ?? null}
            />
          </div>
        </div>
      </div>
    );
  }

  const x = BigInt.asUintN(64, view.state.x[n] ?? 0n);
  const name = `x${n}`;
  const bits = x.toString(2).padStart(64, "0");
  if (data.mode === "x64-named") {
    const w = wide64(trace, view.k, n);
    return (
      <div
        className="al-figure al-stepper"
        data-figure="wide-stepper"
        data-mode="x64-named"
        data-k={view.k}
      >
        {listing}
        {controls}
        {status}
        <div
          className="al-wide al-wide-named"
          role="group"
          aria-label={S.register.group(name)}
          data-register={name}
          data-changed={view.written.has(n)}
        >
          <span className="al-reg-name">{M1.wide.heading(name)}</span>
          <code
            className="al-reg-value"
            title={view.written.has(n) ? S.register.changed : undefined}
          >
            0x{x.toString(16).padStart(16, "0")}
          </code>
          <Half
            name={S.wide.upper}
            which="upper"
            bits={bits.slice(0, 32)}
            tag={w.tag?.upper ?? null}
          />
          <Half
            name={M1.wide.lower}
            which="lower"
            bits={bits.slice(32)}
            alias={`w${n}`}
            tag={w.tag?.lower ?? null}
          />
          <p className="al-wide-note">
            {w.clearedByW ? withCode(M1.wide.clearedNote(name, `w${n}`)) : ""}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="al-figure al-stepper" data-figure="wide-stepper" data-k={view.k}>
      {listing}
      {controls}
      {status}
      <div
        className="al-wide"
        role="group"
        aria-label={S.register.group(name)}
        data-register={name}
        data-changed={view.written.has(n)}
      >
        <span className="al-reg-name">{name}</span>
        <code className="al-reg-value" title={view.written.has(n) ? S.register.changed : undefined}>
          0x{x.toString(16).padStart(16, "0")}
        </code>
        <Half name={S.wide.upper} which="upper" bits={bits.slice(0, 32)} />
        <Half name={S.wide.lower(`w${n}`)} which="lower" bits={bits.slice(32)} />
      </div>
    </div>
  );
}

export const WideStepper = withProps(Props, function WideStepper({ data, store, lesson }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const stored = useStored(store);
  const work =
    data.fromChallenge === undefined ? undefined : savedWork(lesson, stored, data.fromChallenge);
  const open =
    data.fromChallenge === undefined || passedChallenge(lesson, stored, data.fromChallenge);
  const text = work?.artifact.text ?? work?.challenge.initial.text ?? "";
  const gate = work?.challenge;
  const trace = useMemo(() => {
    if (data.fromChallenge === undefined)
      return data.program
        ? traceText(data.program.listing, undefined, undefined, data.program.sourceLines)
        : null;
    if (!open || gate === undefined) return null;
    return traceAssembly(text, {
      allowed: new Set(gate.allowedConstructs),
      introduced: introducedOf(gate),
    });
  }, [data.program, data.fromChallenge, open, text, gate]);
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  if (!open) {
    return (
      <p role="note" className="al-locked">
        {A.adder.lockedUntilPassed}
      </p>
    );
  }
  if (trace === null) {
    return (
      <p role="note" className="al-nomatch">
        {M1.halves.unreadable}
      </p>
    );
  }
  // The learner's text keys the figure, so a different solution starts again from the first step.
  return (
    <Stepping
      key={data.fromChallenge === undefined ? "recorded" : text}
      data={data}
      trace={trace}
    />
  );
});
