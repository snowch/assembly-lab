// Copyright © 2026 Christopher Snow

// A 32-bit counter drawn as a ring, with two readings of it marked and the distance between them.
// The ring holds all 2^32 values, so two readings a few thousand apart sit on one spot of it; below
// the ring that spot is enlarged into a strip from `then` to `now`, with the wrap marked where the
// counter went from its largest value to 0. The distance and the flag come from the simulator
// (ring.ts): the recorded function's result, and C after `subs`. Only the places on the drawing are
// worked out here.

import { useMemo } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { cLinesOf, parseListing } from "../listing";
import { ListingView, withCode } from "../parts";
import { COUNTER_VALUES, onRing, ringReading } from "../ring";
import { ARITH_STRINGS as A } from "../strings.arith";
import { VIEW_STRINGS as S } from "../strings";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** The function that returns `now - then`, as GCC made it. */
  program: RecordedSchema,
  call: CallSchema,
  /** The same two readings through a function that does `subs` and returns. */
  borrowProgram: z.object({ listing: z.string() }),
  borrowEntry: z.string(),
  /** The id of a prediction in this lesson. The figure stays shut until it has been checked. */
  after: z.string().optional(),
  /** Show the recorded function above the ring. */
  listing: z.boolean().default(false),
});

const CX = 160;
const CY = 100;
const R = 70;
const LEFT = 20;
const RIGHT = 300;
const STRIP = 205;

export const CounterRing = withProps(Props, function CounterRing({ data, store }) {
  const [prediction] = useSlot<{ choice: string }>(store, data.after ?? "");
  const reading = useMemo(
    () => ringReading(data.program, data.borrowProgram, data.call, data.borrowEntry),
    [data.program, data.borrowProgram, data.call, data.borrowEntry],
  );
  if (data.after !== undefined && prediction === undefined) {
    return (
      <p role="note" className="al-locked">
        {S.stepper.locked}
      </p>
    );
  }
  const { now, then, elapsed, c, wrapped } = reading;
  // The spot on the ring that the strip enlarges: halfway from `then` to `now`.
  const middle = ((then + elapsed / 2) % COUNTER_VALUES) / COUNTER_VALUES;
  const [px, py] = onRing(CX, CY, R, middle);
  // Where the wrap falls on the strip: the part of the way from `then` to `now` it is reached.
  const wrapAt =
    wrapped && elapsed > 0 ? LEFT + (RIGHT - LEFT) * ((COUNTER_VALUES - then) / elapsed) : null;
  return (
    <div className="al-figure al-ring" data-figure="counter-ring">
      {data.listing && (
        <ListingView cLines={cLinesOf(data.program.c)} lines={parseListing(data.program.listing)} />
      )}
      <svg
        className="al-ring-svg"
        viewBox="0 0 320 285"
        role="img"
        aria-label={A.ring.figure}
        data-wrapped={wrapped}
      >
        <circle className="al-ring-circle" cx={CX} cy={CY} r={R} />
        <line className="al-ring-wrap" x1={CX} y1={CY - R - 8} x2={CX} y2={CY - R + 8} />
        <text className="al-ring-text" x={CX} y={CY - R - 14} textAnchor="middle">
          {A.ring.wrap}
        </text>
        <line className="al-ring-lens" x1={px} y1={py} x2={LEFT} y2={STRIP - 9} />
        <line className="al-ring-lens" x1={px} y1={py} x2={RIGHT} y2={STRIP - 9} />
        <circle className="al-ring-spot" cx={px} cy={py} r={4} />
        <line className="al-ring-strip" x1={LEFT} y1={STRIP} x2={RIGHT} y2={STRIP} />
        <line className="al-ring-tick" x1={LEFT} y1={STRIP - 9} x2={LEFT} y2={STRIP + 9} />
        <line className="al-ring-tick" x1={RIGHT} y1={STRIP - 9} x2={RIGHT} y2={STRIP + 9} />
        {wrapAt !== null && (
          <g data-mark="wrap">
            <line
              className="al-ring-wrap"
              x1={wrapAt}
              y1={STRIP - 12}
              x2={wrapAt}
              y2={STRIP + 12}
            />
            <text className="al-ring-text" x={wrapAt} y={STRIP - 18} textAnchor="middle">
              {A.ring.wrap}
            </text>
          </g>
        )}
        <text className="al-ring-text" x={LEFT} y={STRIP + 26} textAnchor="start">
          {A.ring.then}
        </text>
        <text className="al-ring-value" x={LEFT} y={STRIP + 42} textAnchor="start">
          {then}
        </text>
        <text className="al-ring-text" x={RIGHT} y={STRIP + 26} textAnchor="end">
          {A.ring.now}
        </text>
        <text className="al-ring-value" x={RIGHT} y={STRIP + 42} textAnchor="end">
          {now}
        </text>
        <path className="al-ring-span" d={`M${LEFT} ${STRIP + 52} v6 H${RIGHT} v-6`} fill="none" />
        <text className="al-ring-text" x={CX} y={STRIP + 76} textAnchor="middle">
          {`${A.ring.elapsed} ${elapsed}`}
        </text>
      </svg>
      <dl className="al-ring-values" aria-label={A.ring.values}>
        <div data-row="then">
          <dt>{A.ring.then}</dt>
          <dd>{then}</dd>
        </div>
        <div data-row="now">
          <dt>{A.ring.now}</dt>
          <dd>{now}</dd>
        </div>
        <div data-row="elapsed">
          <dt>{A.ring.elapsed}</dt>
          <dd>{elapsed}</dd>
        </div>
        <div data-row="c">
          <dt>{withCode(A.ring.carryAfter)}</dt>
          <dd>
            {c} ({c === 0 ? A.ring.borrowed : A.ring.notBorrowed})
          </dd>
        </div>
      </dl>
    </div>
  );
});
