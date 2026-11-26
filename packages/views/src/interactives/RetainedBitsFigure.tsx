// Copyright © 2026 Christopher Snow

import { useId, useMemo } from "react";
import { useSlot, type InteractiveProps } from "@platform/lesson-runtime";
import {
  retainedBits,
  storageInput,
  RETAINED_BITS_DEFAULT as D,
  RETAINED_BITS_INPUT_MAX,
  type RetainedWidth,
} from "../retained-bits";
import { RETAINED_BITS_STRINGS as S } from "../strings.retained-bits";
import { FOUR_BIT_STRINGS } from "../strings.four-bit-arithmetic";

interface Draft {
  input: string;
  width: RetainedWidth;
  prediction: string;
}
type Stored = Partial<Draft> & { attempted?: boolean; last?: Draft; reset?: boolean };

export function RetainedBitsFigure({
  store,
  interactive,
}: Pick<InteractiveProps, "store" | "interactive">) {
  const [raw, set] = useSlot<unknown>(store, interactive.id);
  const saved = raw && typeof raw === "object" ? (raw as Stored) : {};
  const input = typeof saved.input === "string" ? saved.input : String(D.value);
  const width: RetainedWidth = saved.width === 8 ? 8 : 4;
  const prediction = typeof saved.prediction === "string" ? saved.prediction : "";
  const value = storageInput(input);
  const view = useMemo(() => retainedBits(value ?? 0, width), [value, width]);
  const known =
    value !== null &&
    saved.last?.input === input &&
    saved.last.width === width &&
    saved.last.prediction === prediction;
  const invalid = saved.attempted === true && value === null;
  const predictionText = prediction.trim();
  const predictionNumber = /^\d+$/.test(predictionText) ? BigInt(predictionText) : null;
  const predictionInvalid = known && predictionText !== "" && predictionNumber === null;
  const id = useId();
  const values: Record<string, string | number> = {
    minimumInput: 0,
    maximumInput: RETAINED_BITS_INPUT_MAX,
    width,
    keptMaximum: view.maximum,
    fullValue: view.input,
    removedValue: view.removed,
    keptValue: view.kept,
    groups: view.removedGroups,
    groupSize: view.range,
    prediction: predictionText,
    defaultInput: D.value,
    smallWidth: 4,
    largeWidth: 8,
    realWidth: 32,
  };
  const text = (template: string, extra: Record<string, string | number> = {}) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) =>
      String(extra[key] ?? values[key] ?? `{${key}}`),
    );
  const change = (patch: Partial<Draft>) => set({ input, width, prediction, ...patch });
  const places = (items: typeof view.keptPlaces) => (
    <div className="al-retained-places">
      {items.map((place) => (
        <span
          className="al-retained-place"
          key={place.bit}
          role="img"
          aria-label={text(S.placeLabel, {
            weight: place.weight,
            bit: known ? place.value : FOUR_BIT_STRINGS.unrevealed,
          })}
        >
          <span className="al-retained-weight" aria-hidden="true">
            {place.weight}
          </span>
          <code data-storage-bit={place.bit} aria-hidden="true">
            {known ? place.value : "?"}
          </code>
        </span>
      ))}
    </div>
  );
  return (
    <form
      className="al-figure al-retained-bits"
      data-mode="storage"
      data-width={width}
      data-revealed={known}
      onSubmit={(event) => {
        event.preventDefault();
        set({
          input,
          width,
          prediction,
          attempted: true,
          ...(value === null ? {} : { last: { input, width, prediction } }),
        });
      }}
    >
      <p>{text(S.modelNote)}</p>
      <div className="al-retained-inputs">
        <div>
          <label htmlFor={`${id}-input`}>{S.inputLabel}</label>
          <input
            id={`${id}-input`}
            value={input}
            inputMode="numeric"
            aria-describedby={`${id}-help${invalid ? ` ${id}-error` : ""}`}
            aria-invalid={invalid}
            onChange={(event) => change({ input: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor={`${id}-width`}>{S.widthLabel}</label>
          <select
            id={`${id}-width`}
            value={width}
            onChange={(event) => change({ width: event.target.value === "8" ? 8 : 4 })}
          >
            {[4, 8].map((choice) => (
              <option key={choice} value={choice}>
                {text(S.widthOption, { width: choice })}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p id={`${id}-help`} className="muted">
        {text(S.inputHelp)} {text(S.widthHelp)}
      </p>
      <label htmlFor={`${id}-prediction`}>{S.predictionLabel}</label>
      <input
        id={`${id}-prediction`}
        value={prediction}
        placeholder={S.predictionPlaceholder}
        inputMode="numeric"
        aria-invalid={predictionInvalid}
        aria-describedby={predictionInvalid ? `${id}-prediction-error` : undefined}
        onChange={(event) => change({ prediction: event.target.value })}
      />
      {invalid && (
        <p id={`${id}-error`} className="al-error" role="alert">
          {text(S.inputError)}
        </p>
      )}
      <p className="al-retained-full">
        <span>{S.fullInputLabel}</span>
        <code
          data-storage-full
          role="img"
          aria-label={`${S.fullInputLabel}: ${value === null ? "?" : view.fullPattern.split("").join(" ")}`}
        >
          {value === null ? "—" : view.fullPattern}
        </code>
      </p>
      <div className="al-retained-weight-label">{S.placeValues}</div>
      <div className="al-retained-groups">
        <div className="al-retained-removed">
          <h4>{S.discardedLabel}</h4>
          {view.removedPlaces.length ? (
            places(view.removedPlaces)
          ) : (
            <span className="al-retained-empty">{known ? S.none : "?"}</span>
          )}
          <span className="al-retained-value-label">{S.removedValueLabel}</span>
          <strong data-storage-removed>{known ? view.removed : "—"}</strong>
        </div>
        <div className="al-retained-kept">
          <h4>{S.keptLabel}</h4>
          {places(view.keptPlaces)}
          <span className="al-retained-value-label">{S.keptValueLabel}</span>
          <strong data-storage-value>{known ? view.kept : "—"}</strong>
        </div>
      </div>
      <div className="al-controls">
        <button type="submit" className="button primary">
          {S.keep}
        </button>
        <button type="button" className="button secondary" onClick={() => set({ reset: true })}>
          {S.reset}
        </button>
      </div>
      <div className="al-retained-outcome" role="status" aria-live="polite" aria-atomic="true">
        {known ? (
          <>
            {view.fits ? (
              <p>{S.noDiscardedBits}</p>
            ) : (
              <>
                <p>
                  <code>{text(S.groupsEquation)}</code>
                </p>
                <p>{text(S.groupsExplanation)}</p>
              </>
            )}
            {predictionInvalid ? (
              <p id={`${id}-prediction-error`}>{S.predictionError}</p>
            ) : (
              predictionNumber !== null && (
                <p>
                  {text(
                    predictionNumber === BigInt(view.kept)
                      ? S.predictionMatches
                      : S.predictionDiffers,
                  )}
                </p>
              )
            )}
          </>
        ) : (
          !invalid && <p>{text(saved.reset ? S.resetStatus : S.pending)}</p>
        )}
      </div>
    </form>
  );
}
