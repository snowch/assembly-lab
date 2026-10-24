// Copyright © 2026 Christopher Snow

// The shared primitive keeps its draft choice private. This course-owned adapter uses the
// same public props and controls while handing that unsubmitted choice through a safe restart.
// Committing remains the only action that writes the lesson's prediction slot.
import type { PredictionChallengeProps } from "@platform/primitives";
import { useHandoffState } from "./update-handoff";

export function PredictionChoice({
  name,
  options,
  committed,
  onCommit,
  onAgain,
  legend,
  commitLabel,
  againLabel,
  verdict,
  renderLabel,
}: PredictionChallengeProps) {
  const [pick, setPick] = useHandoffState<string | null>(`PredictionChoice.${name}`, null);
  return (
    <>
      <fieldset className="prediction-options" data-committed={committed !== undefined}>
        <legend className="visually-hidden">{legend}</legend>
        {options.map((option) => (
          <label key={option.value} className="prediction-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={(pick ?? committed) === option.value}
              onChange={() => setPick(option.value)}
            />
            <span>{renderLabel ? renderLabel(option.label) : option.label}</span>
          </label>
        ))}
      </fieldset>
      {committed === undefined ? (
        <button
          type="button"
          className="button primary"
          disabled={pick === null}
          onClick={() => pick !== null && onCommit(pick)}
        >
          {commitLabel}
        </button>
      ) : (
        <>
          {verdict}
          <button
            type="button"
            className="button secondary"
            disabled={pick === null || pick === committed}
            onClick={() => pick !== null && onCommit(pick)}
          >
            {commitLabel}
          </button>
          {onAgain && (
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setPick(null);
                onAgain();
              }}
            >
              {againLabel}
            </button>
          )}
        </>
      )}
    </>
  );
}
