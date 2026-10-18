// Copyright © 2026 Christopher Snow

// A 32-bit counter drawn as a ring, with two readings of it marked and the distance between them.
// The ring holds all 2^32 values, so two readings a few thousand apart sit on one spot of it; below
// the ring that spot is enlarged into a strip from `then` to `now`. The strip shows `then`, the wrap
// from the counter's largest value to 0, `now`, the ticks before the wrap, the ticks after it and
// their total, with the direction the counter counts. The distance and the flag come from the
// simulator (ring.ts): the recorded function's result, and C after `subs`. The two stretches are the
// distance split at the wrap, and a test holds their sum to the distance. Only the places on the
// drawing are worked out here.

import { useMemo } from "react";
import { z } from "zod";

import { useSlot } from "@platform/lesson-runtime";

import { cLinesOf, programLines } from "../listing";
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
const CY = 80;
const R = 54;
const LEFT = 20;
const RIGHT = 300;
const STRIP = 206;
/** The gap the wrap leaves in the strip. */
const GAP = 3;
/** How far a label over the wrap stays from either end, so it stays in the drawing. */
const LABEL_HALF = 72;
/** How far in from either end the wrap is kept, so the mark never lies on the tick of `then` or `now`. */
const EDGE = 8;
/** The brackets under the strip. */
const BELOW = STRIP + 66;

/** A small triangle pointing along the strip, at its right end `x`. */
const arrowHead = (x: number, y: number) => `${x},${y - 7} ${x + 10},${y} ${x},${y + 7}`;

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
  const { now, then, elapsed, c, borrowed, segments } = reading;
  // The spot on the ring that the strip enlarges: halfway from `then` to `now`.
  const middle = ((then + elapsed / 2) % COUNTER_VALUES) / COUNTER_VALUES;
  const [px, py] = onRing(CX, CY, R, middle);
  // Where the wrap falls on the strip: the part of the way from `then` to `now` it is reached.
  const wrapAt =
    segments !== null && elapsed > 0
      ? Math.min(
          RIGHT - EDGE,
          Math.max(LEFT + EDGE, LEFT + (RIGHT - LEFT) * (segments.before / elapsed)),
        )
      : null;
  const labelAt =
    wrapAt === null ? null : Math.min(RIGHT - LABEL_HALF, Math.max(LEFT + LABEL_HALF, wrapAt));
  const barEnd = wrapAt === null ? RIGHT : wrapAt - GAP;
  return (
    <div className="al-figure al-ring" data-figure="counter-ring">
      {data.listing && (
        <ListingView cLines={cLinesOf(data.program.c)} lines={programLines(data.program)} />
      )}
      <svg
        className="al-ring-svg"
        viewBox="0 0 320 424"
        role="img"
        aria-label={A.ring.figure}
        data-borrowed={borrowed}
      >
        <circle className="al-ring-circle" cx={CX} cy={CY} r={R} />
        <line className="al-ring-wrap" x1={CX} y1={CY - R - 8} x2={CX} y2={CY - R + 8} />
        <text className="al-ring-text" x={CX} y={CY - R - 14} textAnchor="middle">
          {A.ring.wrap}
        </text>
        {/* The counter goes round clockwise: an arrowhead on the ring, pointing down at its right. */}
        <polygon
          className="al-ring-arrow"
          data-mark="direction"
          points={`${CX + R - 7},${CY - 3} ${CX + R + 7},${CY - 3} ${CX + R},${CY + 11}`}
        />
        <line className="al-ring-lens" x1={px} y1={py} x2={LEFT} y2={STRIP - 11} />
        <line className="al-ring-lens" x1={px} y1={py} x2={RIGHT} y2={STRIP - 11} />
        <circle className="al-ring-spot" cx={px} cy={py} r={4} />
        <line className="al-ring-strip" x1={LEFT} y1={STRIP} x2={barEnd} y2={STRIP} />
        <polygon className="al-ring-arrow" points={arrowHead(barEnd - 9, STRIP)} />
        <line className="al-ring-tick" x1={LEFT} y1={STRIP - 11} x2={LEFT} y2={STRIP + 11} />
        {wrapAt !== null && labelAt !== null && (
          <g data-mark="wrap">
            <line
              className="al-ring-wrap"
              x1={wrapAt}
              y1={STRIP - 16}
              x2={wrapAt}
              y2={STRIP + 16}
            />
            <text className="al-ring-text" x={labelAt} y={STRIP - 40} textAnchor="middle">
              {A.ring.wrap}
            </text>
            <text className="al-ring-value" x={labelAt} y={STRIP - 22} textAnchor="middle">
              {A.ring.wrapSpan(COUNTER_VALUES - 1, 0)}
            </text>
            <line
              className="al-ring-strip"
              x1={wrapAt + GAP}
              y1={STRIP}
              x2={RIGHT}
              y2={STRIP}
              data-segment="after"
            />
            <polygon className="al-ring-arrow" points={arrowHead(RIGHT - 9, STRIP)} />
          </g>
        )}
        <line className="al-ring-tick" x1={RIGHT} y1={STRIP - 11} x2={RIGHT} y2={STRIP + 11} />
        <text className="al-ring-text" x={LEFT} y={STRIP + 32} textAnchor="start">
          {A.ring.then}
        </text>
        <text className="al-ring-value" x={LEFT} y={STRIP + 50} textAnchor="start">
          {then}
        </text>
        <text className="al-ring-text" x={RIGHT} y={STRIP + 32} textAnchor="end">
          {A.ring.now}
        </text>
        <text className="al-ring-value" x={RIGHT} y={STRIP + 50} textAnchor="end">
          {now}
        </text>
        {segments !== null && wrapAt !== null ? (
          <g data-mark="segments">
            <path
              className="al-ring-span"
              d={`M${LEFT} ${BELOW} v7 H${wrapAt - GAP} v-7`}
              fill="none"
            />
            <path
              className="al-ring-span"
              d={`M${wrapAt + GAP} ${BELOW} v7 H${RIGHT} v-7`}
              fill="none"
            />
            <text
              className="al-ring-value"
              data-segment="before"
              x={LEFT}
              y={BELOW + 28}
              textAnchor="start"
            >
              {segments.before}
            </text>
            <text className="al-ring-text" x={LEFT} y={BELOW + 46} textAnchor="start">
              {`${A.ring.ticks} ${A.ring.beforeWrap}`}
            </text>
            <text
              className="al-ring-value"
              data-segment="after"
              x={RIGHT}
              y={BELOW + 28}
              textAnchor="end"
            >
              {segments.after}
            </text>
            <text className="al-ring-text" x={RIGHT} y={BELOW + 46} textAnchor="end">
              {`${A.ring.ticks} ${A.ring.afterWrap}`}
            </text>
          </g>
        ) : null}
        <path
          className="al-ring-span"
          data-mark="total"
          d={`M${LEFT} ${BELOW + 62} v7 H${RIGHT} v-7`}
          fill="none"
        />
        <text
          className="al-ring-value"
          data-segment="total"
          x={CX}
          y={BELOW + 92}
          textAnchor="middle"
        >
          {`${elapsed} ${A.ring.ticks} ${A.ring.inAll}`}
        </text>
        <line
          className="al-ring-strip-arrow"
          x1={CX - 56}
          y1={BELOW + 108}
          x2={CX + 46}
          y2={BELOW + 108}
        />
        <polygon className="al-ring-arrow" points={arrowHead(CX + 46, BELOW + 108)} />
        <text className="al-ring-text" x={CX} y={BELOW + 132} textAnchor="middle">
          {A.ring.direction}
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
        {segments !== null && (
          <>
            <div data-row="before">
              <dt>{`${A.ring.ticks} ${A.ring.beforeWrap}`}</dt>
              <dd>{segments.before}</dd>
            </div>
            <div data-row="after">
              <dt>{`${A.ring.ticks} ${A.ring.afterWrap}`}</dt>
              <dd>{segments.after}</dd>
            </div>
          </>
        )}
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
