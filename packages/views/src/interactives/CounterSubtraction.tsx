// Copyright © 2026 Christopher Snow

import { z } from "zod";
import { counterWrap, COUNTER_WRAP_TICKS } from "../counter-wrap";
import { fourBitSubtraction } from "../four-bit-arithmetic";
import { withCode } from "../parts";
import { COUNTER_SUBTRACTION_STRINGS as S } from "../strings.counter-subtraction";
import { withProps } from "./props";

/** A small worked counter, using the existing arithmetic models for every shown value. */
export function counterSubtractionWork() {
  const counter = counterWrap(COUNTER_WRAP_TICKS);
  const subtraction = fourBitSubtraction(counter.value.unsigned, counter.start);
  return {
    width: subtraction.a.pattern.length,
    subtraction,
    timeline: counter.readings.map((reading) => reading.unsigned),
  };
}

export const CounterSubtraction = withProps(z.object({}), function CounterSubtraction() {
  const { width, subtraction: work, timeline } = counterSubtractionWork();
  return (
    <div className="al-figure al-counter-subtraction" data-width={width}>
      <p>{withCode(S.intro(width, work.a.unsigned, work.b.unsigned))}</p>
      <dl className="al-counter-subtraction-inputs">
        <div>
          <dt>{S.labels.later}</dt>
          <dd>
            <code>{work.a.pattern}</code>
          </dd>
        </div>
        <div>
          <dt>{S.labels.earlier}</dt>
          <dd>
            <code>{work.b.pattern}</code>
          </dd>
        </div>
      </dl>
      <p>{S.rule(width)}</p>
      <ol className="al-counter-subtraction-steps">
        <li>
          <span>{S.labels.invert}</span>
          <code data-stage="invert">
            {work.b.pattern} → {work.negation.inverted.pattern}
          </code>
        </li>
        <li>
          <span>{S.labels.addOne}</span>
          <code data-stage="add-one">
            {work.negation.inverted.pattern} + 1 = {work.negation.after.pattern}
          </code>
        </li>
        <li>
          <span>{S.labels.addLater}</span>
          <code data-stage="add-later">
            {work.a.pattern} + {work.negation.after.pattern} = {work.result.pattern}
          </code>
        </li>
      </ol>
      <p className="al-counter-subtraction-result">
        {S.labels.result}: <code data-reading="result">{work.result.pattern}</code>
      </p>
      <p>{S.summary(work.result.unsigned)}</p>
      <p className="al-counter-subtraction-timeline" aria-label={S.labels.timeline}>
        {timeline.map((value, index) => (
          <span key={index}>
            {index > 0 && <span aria-hidden="true"> → </span>}
            <code>{value}</code>
          </span>
        ))}
      </p>
      <p>{S.bound(2 ** width)}</p>
      <p>{withCode(S.instruction)}</p>
      <p className="al-counter-subtraction-bridge">{S.bridge(width, 32)}</p>
    </div>
  );
});
