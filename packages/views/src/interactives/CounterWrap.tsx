// Copyright © 2026 Christopher Snow

import { useSlot } from "@platform/lesson-runtime";
import { z } from "zod";
import {
  counterExplorerView,
  moveCounterExplorer,
  restoreCounterExplorer,
  COUNTER_WRAP_RANGE,
  COUNTER_EXPLORER_START,
  type CounterExplorerState,
} from "../counter-wrap";
import { withCode } from "../parts";
import { COUNTER_WRAP_STRINGS as S } from "../strings.counter-wrap";
import { withProps } from "./props";

function CounterExperiment({
  state,
  direction,
  save,
}: {
  state: CounterExplorerState;
  direction: -1 | 1;
  save: (state: CounterExplorerState) => void;
}) {
  const model = counterExplorerView(state);
  // An old saved subtraction is still a valid stored reading. Never relabel its
  // borrow as addition carry (or the reverse) in a direction-specific pane.
  const change = model.change?.direction === direction ? model.change : null;
  const backward = direction === -1;
  const reading = (name: string) => (backward ? `borrow-${name}` : name);
  const markerLabel = backward ? S.borrowLabel : S.carryLabel;
  const feedback = !change
    ? backward
      ? S.borrowInitialNote
      : S.initialNote
    : change.wrapped
      ? backward
        ? S.backwardWrapped(4, COUNTER_WRAP_RANGE)
        : S.forwardWrapped(4)
      : backward
        ? S.backwardNormal
        : S.forwardNormal;
  return (
    <div className="al-figure al-counter-wrap" data-counter-pane={backward ? "borrow" : "forward"}>
      <p>{withCode(backward ? S.borrowIntro(4) : S.intro(4, 32))}</p>
      <p>{withCode(backward ? S.borrowInstruction : S.instruction)}</p>
      <div className="al-counter-wrap-split">
        <div className="al-counter-wrap-marker">
          <span data-reading={reading("marker-label")}>{markerLabel}</span>
          <code data-reading={reading("carry")} className="al-counter-wrap-carry">
            {change?.marker ?? S.pendingCarry}
          </code>
        </div>
        <div>
          <span>{S.retainedLabel}</span>
          <code data-reading={reading("stored")} className="al-counter-wrap-stored">
            {model.value.pattern}
          </code>
          <span className="al-counter-wrap-decimal">
            <span className="visually-hidden">{S.decimalLabel}: </span>
            <span data-reading={reading("decimal")}>{model.value.unsigned}</span>
          </span>
        </div>
      </div>
      <p className="al-counter-wrap-trail" aria-label={S.trailLabel}>
        {model.readings.map((value, index) => (
          <span key={index}>
            {index > 0 && <span aria-hidden="true"> → </span>}
            <code>{value}</code>
          </span>
        ))}
      </p>
      <p className="al-counter-wrap-feedback" data-reading={reading("explanation")}>
        {withCode(feedback)}
      </p>
      <div className="al-controls">
        <button
          type="button"
          className="button primary"
          aria-label={backward ? S.previousLabel : S.advanceLabel}
          onClick={() => save(moveCounterExplorer(state, direction))}
        >
          {backward ? S.previous : S.advance}
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => save({ readings: [COUNTER_EXPLORER_START] })}
        >
          {S.reset}
        </button>
      </div>
      <p>{withCode(backward ? S.borrowArchitectureNote : S.architectureNote)}</p>
      <span role="status" className="visually-hidden">
        {change
          ? S.stepStatus(change.direction, model.value.unsigned, change.marker)
          : S.initialStatus(model.value.unsigned)}
      </span>
    </div>
  );
}

export const CounterWrap = withProps(z.object({}), function CounterWrap({ store, interactive }) {
  const [saved, save] = useSlot<unknown>(store, `${interactive.id}:state-v2`);
  const [legacy] = useSlot<unknown>(store, `${interactive.id}:ticks`);
  const [borrow, saveBorrow] = useSlot<unknown>(store, `${interactive.id}:borrow-state-v1`);
  return (
    <div className="al-counter-wrap-panes" data-figure="counter-wrap">
      <CounterExperiment state={restoreCounterExplorer(saved, legacy)} direction={1} save={save} />
      <details className="al-counter-borrow">
        <summary>{S.borrowTitle}</summary>
        <CounterExperiment
          state={restoreCounterExplorer(borrow)}
          direction={-1}
          save={saveBorrow}
        />
      </details>
    </div>
  );
});
