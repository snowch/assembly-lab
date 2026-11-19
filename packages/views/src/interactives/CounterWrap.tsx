// Copyright © 2026 Christopher Snow

import { useSlot } from "@platform/lesson-runtime";
import { z } from "zod";
import { counterWrap, COUNTER_WRAP_RANGE, COUNTER_WRAP_TICKS } from "../counter-wrap";
import { withCode } from "../parts";
import { COUNTER_WRAP_STRINGS as S } from "../strings.counter-wrap";
import { withProps } from "./props";

export const CounterWrap = withProps(z.object({}), function CounterWrap({ store, interactive }) {
  const [saved, save] = useSlot<number>(store, `${interactive.id}:ticks`);
  // Retain saved tick counts when the starting value changes. Rendering must
  // not write this slot or change the learner's other work.
  const ticks =
    typeof saved === "number" && Number.isInteger(saved) && saved >= 0 && saved < COUNTER_WRAP_RANGE
      ? Math.min(saved, COUNTER_WRAP_TICKS)
      : 0;
  const model = counterWrap(ticks);
  const sum = model.addition;
  const complete = ticks === COUNTER_WRAP_TICKS;
  return (
    <div className="al-figure al-counter-wrap" data-figure="counter-wrap" data-ticks={ticks}>
      <p>{withCode(S.intro(4, 32))}</p>
      <p>{S.instruction}</p>
      <div className="al-controls">
        <button
          type="button"
          className="button primary"
          aria-disabled={complete}
          onClick={() => {
            if (!complete) save(ticks + 1);
          }}
        >
          {S.advance}
        </button>
        <button type="button" className="button secondary" onClick={() => save(0)}>
          {S.reset}
        </button>
      </div>
      {sum ? (
        <div className="al-counter-wrap-addition">
          <p className="al-counter-wrap-full">
            <code data-reading="sum">
              {sum.a.unsigned} + {sum.b.unsigned} = {sum.fullSum}
            </code>
          </p>
          <div className="al-counter-wrap-split">
            <code>
              {sum.a.pattern} + {sum.b.pattern} =
            </code>
            <div>
              <span>{S.carryLabel}</span>
              <code data-reading="carry" className="al-counter-wrap-carry">
                {sum.carryOut}
              </code>
            </div>
            <div>
              <span>{S.retainedLabel}</span>
              <code data-reading="stored" className="al-counter-wrap-stored">
                {sum.result.pattern}
              </code>
            </div>
          </div>
          <p>{sum.carryOut === 1 ? S.wrapped(4) : S.noCarry(4)}</p>
        </div>
      ) : (
        <p className="al-counter-wrap-initial">
          {S.initialLabel}: <code data-reading="stored">{model.value.pattern}</code>{" "}
          <span>({model.value.unsigned})</span>. {S.initialNote}
        </p>
      )}
      <p className="al-counter-wrap-trail" aria-label={S.trailLabel}>
        {model.readings.map((reading, index) => (
          <span key={index}>
            {index > 0 && <span aria-hidden="true"> → </span>}
            <code>{reading.unsigned}</code>
          </span>
        ))}
      </p>
      {complete && <p>{withCode(S.next(model.start, model.value.unsigned))}</p>}
      <p>{withCode(S.architectureNote)}</p>
      <span role="status" className="visually-hidden">
        {sum
          ? S.stepStatus(ticks, model.value.unsigned, sum.carryOut)
          : S.initialStatus(model.value.unsigned)}
      </span>
    </div>
  );
});
