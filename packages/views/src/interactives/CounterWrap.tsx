// Copyright © 2026 Christopher Snow

import { z } from "zod";
import { useSlot } from "@platform/lesson-runtime";
import { counterWrap, COUNTER_WRAP_RANGE, COUNTER_WRAP_TICKS } from "../counter-wrap";
import { COUNTER_WRAP_STRINGS as S } from "../strings.counter-wrap";
import { VIEW_STRINGS } from "../strings";
import { withCode } from "../parts";
import { withProps } from "./props";

const Props = z.object({ after: z.string().optional() });

export const CounterWrap = withProps(Props, function CounterWrap({ data, store, interactive }) {
  const [prediction] = useSlot<unknown>(store, data.after ?? "");
  const [saved, save] = useSlot<number>(store, `${interactive.id}:ticks`);
  const ticks =
    typeof saved === "number" &&
    Number.isInteger(saved) &&
    saved >= 0 &&
    saved <= COUNTER_WRAP_TICKS
      ? saved
      : 0;
  const model = counterWrap(ticks);
  if (data.after !== undefined && prediction === undefined)
    return (
      <p role="note" className="al-locked">
        {VIEW_STRINGS.stepper.locked}
      </p>
    );
  const sum = model.addition;
  const complete = ticks === COUNTER_WRAP_TICKS;
  return (
    <div className="al-figure al-counter-wrap" data-figure="counter-wrap" data-ticks={ticks}>
      <h3>{S.title}</h3>
      <p>{S.modelNote(4, 32)}</p>
      <p>{S.instruction}</p>
      <div className="al-counter-wrap-readings">
        <div>
          <span>{S.counterLabel}</span>
          <code data-reading="pattern">{model.value.pattern}</code>
          <strong data-reading="decimal">{model.value.unsigned}</strong>
        </div>
        <div>
          <span>{S.ticksLabel}</span>
          <strong data-reading="ticks">{ticks}</strong>
        </div>
      </div>
      <p className="al-counter-wrap-trail">
        <span>{S.startingLabel}: </span>
        {model.readings.map((reading, index) => (
          <span key={index}>
            {index > 0 && <span aria-hidden="true"> → </span>}
            <code>{reading.unsigned}</code>
          </span>
        ))}
      </p>
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
      <div className="al-counter-wrap-addition">
        {sum ? (
          <>
            <h4>{S.additionLabel}</h4>
            <p className="al-counter-wrap-full">
              <span>{S.fullSumLabel}: </span>
              <code>
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
            <p>{S.carryExplanation}</p>
            {sum.carryOut === 1 && (
              <p>
                {S.wrapExplanation(
                  sum.fullSum,
                  sum.fullPattern,
                  sum.result.pattern,
                  sum.result.unsigned,
                )}
              </p>
            )}
          </>
        ) : (
          <p>{S.initialNote}</p>
        )}
      </div>
      {complete && (
        <div className="al-counter-wrap-elapsed">
          <h4>{S.elapsedTitle}</h4>
          <p>
            {S.elapsedExplanation(model.start, model.value.unsigned, 4, model.elapsed.unsigned)}
          </p>
          <p>
            {S.elapsedAssumption(COUNTER_WRAP_RANGE)} {S.turnLimit}
          </p>
          <p>{S.limitNote(COUNTER_WRAP_TICKS)}</p>
        </div>
      )}
      <p className="al-counter-wrap-note">{withCode(S.architectureNote)}</p>
      <span role="status" className="visually-hidden">
        {sum
          ? S.stepStatus(ticks, model.value.unsigned, sum.fullSum, sum.carryOut)
          : S.initialStatus(model.value.unsigned)}
      </span>
    </div>
  );
});
