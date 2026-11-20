// Copyright © 2026 Christopher Snow

import { useSlot } from "@platform/lesson-runtime";
import { z } from "zod";
import {
  counterExplorerView,
  moveCounterExplorer,
  restoreCounterExplorer,
  COUNTER_WRAP_RANGE,
  COUNTER_WRAP_START,
} from "../counter-wrap";
import { withCode } from "../parts";
import { COUNTER_WRAP_STRINGS as S } from "../strings.counter-wrap";
import { withProps } from "./props";

export const CounterWrap = withProps(z.object({}), function CounterWrap({ store, interactive }) {
  const [saved, save] = useSlot<unknown>(store, `${interactive.id}:state-v2`);
  const [legacy] = useSlot<unknown>(store, `${interactive.id}:ticks`);
  const state = restoreCounterExplorer(saved, legacy);
  const model = counterExplorerView(state);
  const change = model.change;
  const markerLabel = !change
    ? S.initialMarkerLabel
    : change.direction === 1
      ? S.carryLabel
      : S.borrowLabel;
  const feedback = !change
    ? S.initialNote
    : change.wrapped
      ? change.direction === 1
        ? S.forwardWrapped(4)
        : S.backwardWrapped(4, COUNTER_WRAP_RANGE)
      : change.direction === 1
        ? S.forwardNormal
        : S.backwardNormal;
  return (
    <div className="al-figure al-counter-wrap" data-figure="counter-wrap">
      <p>{withCode(S.intro(4, 32))}</p>
      <p>{withCode(S.instruction)}</p>
      <div className="al-counter-wrap-split">
        <div className="al-counter-wrap-marker">
          <span data-reading="marker-label">{markerLabel}</span>
          <code data-reading="carry" className="al-counter-wrap-carry">
            {change?.marker ?? S.pendingCarry}
          </code>
        </div>
        <div>
          <span>{S.retainedLabel}</span>
          <code data-reading="stored" className="al-counter-wrap-stored">
            {model.value.pattern}
          </code>
          <span className="al-counter-wrap-decimal">
            <span className="visually-hidden">{S.decimalLabel}: </span>
            <span data-reading="decimal">{model.value.unsigned}</span>
          </span>
        </div>
      </div>
      <p className="al-counter-wrap-trail" aria-label={S.trailLabel}>
        {model.readings.map((reading, index) => (
          <span key={index}>
            {index > 0 && <span aria-hidden="true"> → </span>}
            <code>{reading}</code>
          </span>
        ))}
      </p>
      <p className="al-counter-wrap-feedback" data-reading="explanation">
        {withCode(feedback)}
      </p>
      <div className="al-controls">
        <button
          type="button"
          className="button secondary"
          aria-label={S.previousLabel}
          onClick={() => save(moveCounterExplorer(state, -1))}
        >
          {S.previous}
        </button>
        <button
          type="button"
          className="button primary"
          aria-label={S.advanceLabel}
          onClick={() => save(moveCounterExplorer(state, 1))}
        >
          {S.advance}
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => save({ readings: [COUNTER_WRAP_START] })}
        >
          {S.reset}
        </button>
      </div>
      <p>{withCode(S.architectureNote)}</p>
      <span role="status" className="visually-hidden">
        {change
          ? S.stepStatus(change.direction, model.value.unsigned, change.marker)
          : S.initialStatus(model.value.unsigned)}
      </span>
    </div>
  );
});
