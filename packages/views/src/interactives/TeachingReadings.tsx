// Copyright © 2026 Christopher Snow

import { useMemo, type ReactNode } from "react";
import { Prose } from "@platform/lesson-runtime";

import { BitToggles } from "../BitToggles";
import {
  bitWeightsOfPattern,
  NO_BITS,
  patternOf,
  readingsOfPattern,
  shown,
  type Readings,
  type TopBitTable,
} from "../readings";
import { VIEW_STRINGS as S } from "../strings";
import { MODULE1_STRINGS as M1 } from "../strings.module1";
import { READER_STRINGS as R } from "../strings.reader";
import { useHandoffState } from "../update-handoff";

type ReadingView = "unsigned" | "signed" | "compare";
type Choice = keyof typeof R.prediction.choices;
type Prediction = "pending" | Choice | null;
const views = ["unsigned", "signed", "compare"] as const;
const choices = ["unsigned", "signed", "both"] as const;
const topOnly = patternOf(1n << 31n);
const afterChange = topOnly.slice(0, 31) + "1";
const decimal = (value: number): string => shown(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const part = (value: number): string => (value > 0 ? `+${decimal(value)}` : decimal(value));

/** Teaching is opt-in: the scratch reader and hexadecimal activity keep their existing controls. */
export function TeachingReadings({
  register,
  first,
  bits,
  onBits,
  readings,
  table,
  calculation,
}: {
  register: string;
  first: string;
  bits: string;
  onBits: (bits: string) => void;
  readings: Readings;
  table: TopBitTable;
  calculation: (readings: readonly ("unsigned" | "signed")[]) => ReactNode;
}) {
  const [view, setView] = useHandoffState<ReadingView>("RegisterReader.reading", "unsigned");
  const [selected, setSelected] = useHandoffState("RegisterReader.selectedBit", 0);
  const [prediction, setPrediction] = useHandoffState<Prediction>(
    "RegisterReader.prediction",
    null,
  );
  const weights = useMemo(
    () => ({
      unsigned: bitWeightsOfPattern(bits, "unsigned"),
      signed: bitWeightsOfPattern(bits, "signed"),
    }),
    [bits],
  );
  const predictionModel = useMemo(() => {
    const before = readingsOfPattern(topOnly);
    const after = readingsOfPattern(afterChange);
    const unsignedChanges = before.unsigned !== after.unsigned;
    const signedChanges = before.signed !== after.signed;
    return {
      before,
      after,
      correct: {
        unsigned: unsignedChanges && !signedChanges,
        signed: signedChanges && !unsignedChanges,
        both: unsignedChanges && signedChanges,
      },
    };
  }, []);
  const visible = view === "compare" ? (["unsigned", "signed"] as const) : [view];
  const pending = prediction === "pending";
  const active = prediction !== null;
  const displayedBits = active ? (pending ? topOnly : afterChange) : bits;
  const selectedWeight = weights.unsigned[31 - selected]!;
  const changeBits = (next: string) => {
    setPrediction(null);
    onBits(next);
  };
  const startPrediction = () => {
    onBits(topOnly);
    setSelected(31);
    setPrediction("pending");
  };
  return (
    <div
      className="al-figure al-reader al-teaching-reader"
      data-figure="register-reader"
      data-register={register}
      data-view={view}
      data-prediction={prediction ?? undefined}
    >
      <div className="al-reading-views" role="group" aria-label={R.viewsLabel}>
        {views.map((name) => (
          <button
            type="button"
            key={name}
            className="button secondary"
            aria-pressed={view === name}
            onClick={() => {
              setPrediction(null);
              setView(name);
            }}
          >
            {R.views[name]}
          </button>
        ))}
      </div>
      {!active && <Prose markdown={R.guidance[view]} className="al-reader-guidance" />}
      {!active && view !== "unsigned" && (
        <a className="al-reader-appendix" href="#/lesson/twos-complement">
          {R.appendix}
        </a>
      )}
      {active && (
        <section className="al-reader-prediction" aria-label={R.prediction.title}>
          <p className="al-prediction-question">{R.prediction.prompt}</p>
          <p className="al-prediction-phase">
            {pending ? R.prediction.starting : R.prediction.after}
          </p>
        </section>
      )}
      <fieldset
        className="al-reader-bit-editor"
        disabled={active}
        aria-label={S.toggles.group(register)}
        onClickCapture={(event) => {
          const control = (event.target as HTMLElement).closest<HTMLElement>("[data-bit]");
          if (control) setSelected(Number(control.dataset.bit));
        }}
        onFocusCapture={(event) => {
          const control = (event.target as HTMLElement).closest<HTMLElement>("[data-bit]");
          if (control) setSelected(Number(control.dataset.bit));
        }}
      >
        <BitToggles
          bits={displayedBits}
          onChange={changeBits}
          label={S.toggles.group(register)}
          topBit
        />
      </fieldset>
      {pending && (
        <div className="al-reader-prediction">
          <p>{R.prediction.pending}</p>
          <div className="al-prediction-choices" role="group" aria-label={R.prediction.title}>
            {choices.map((choice) => (
              <button
                type="button"
                className="button secondary"
                key={choice}
                onClick={() => {
                  onBits(afterChange);
                  setSelected(0);
                  setPrediction(choice);
                }}
              >
                {R.prediction.choices[choice]}
              </button>
            ))}
          </div>
        </div>
      )}
      {active && !pending && (
        <div className="al-reader-prediction">
          <p role="status" className="al-prediction-feedback">
            <strong>
              {predictionModel.correct[prediction] ? R.prediction.correct : R.prediction.incorrect}
            </strong>{" "}
            {R.prediction.feedback}
          </p>
          <table className="al-top-table al-prediction-results" aria-label={R.prediction.table}>
            <thead>
              <tr>
                <td />
                {["unsigned", "signed"].map((reading) => (
                  <th scope="col" key={reading}>
                    {R.views[reading as "unsigned" | "signed"]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["before", "after"] as const).map((phase) => (
                <tr key={phase} data-phase={phase}>
                  <th scope="row">{R.prediction[phase]}</th>
                  {(["unsigned", "signed"] as const).map((reading) => (
                    <td key={reading} data-cell={reading}>
                      {decimal(predictionModel[phase][reading])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setPrediction(null);
              setView("compare");
            }}
          >
            {R.prediction.explore}
          </button>
        </div>
      )}
      {active && (
        <button type="button" className="button secondary" onClick={() => setPrediction(null)}>
          {R.prediction.cancel}
        </button>
      )}
      <div className="al-reader-actions">
        {!active && (
          <>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                changeBits(patternOf(1));
                setSelected(0);
              }}
            >
              {R.presetBit0}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                changeBits(topOnly);
                setSelected(31);
              }}
            >
              {R.presetTop}
            </button>
            <button type="button" className="button secondary" onClick={() => changeBits(NO_BITS)}>
              {M1.reader.clearBits}
            </button>
          </>
        )}
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            changeBits(first);
            setView("unsigned");
            setSelected(0);
          }}
        >
          {R.reset}
        </button>
      </div>
      {!active && (
        <>
          <div className="al-selected-bit" data-selected-bit={selected}>
            <p className="al-selected-bit-title">
              {R.selectedBit(selected)}{" "}
              <span>
                {R.value}: {selectedWeight.value}
              </span>
            </p>
            <table className="al-top-table" aria-label={R.selectedBit(selected)}>
              <thead>
                <tr>
                  <td />
                  {visible.map((reading) => (
                    <th scope="col" key={reading}>
                      {R.views[reading]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["weight", "contribution"] as const).map((metric) => (
                  <tr key={metric} data-metric={metric}>
                    <th scope="row">{R[metric]}</th>
                    {visible.map((reading) => (
                      <td key={reading} data-cell={reading}>
                        {part(weights[reading][31 - selected]![metric])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="al-selected-bit-note">{selectedWeight.value === 1 ? R.set : R.clear}</p>
            {view === "unsigned" && selected === 31 && (
              <Prose markdown={R.unsignedTop} className="al-reader-next-reading" />
            )}
          </div>
          <table className="al-top-table al-reader-totals" aria-label={M1.reader.table}>
            <thead>
              <tr>
                <td />
                {visible.map((reading) => (
                  <th scope="col" key={reading}>
                    {R.views[reading]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr data-row="top">
                <th scope="row">{R.top}</th>
                {visible.map((reading) => (
                  <td data-cell={reading} key={reading}>
                    {part(table.top[reading])}
                  </td>
                ))}
              </tr>
              <tr data-row="other">
                <th scope="row">{R.other}</th>
                {visible.map((reading) => (
                  <td data-cell={reading} key={reading}>
                    {part(table.other)}
                  </td>
                ))}
              </tr>
              <tr data-row="result" className="al-top-result">
                <th scope="row">{R.total}</th>
                {visible.map((reading) => (
                  <td data-reading={reading} key={reading}>
                    <span className="al-reading-value">{decimal(readings[reading])}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          {calculation(visible)}
          <p className="al-reader-reset-guidance">{R.resetGuidance}</p>
        </>
      )}
      {!active && <Prose markdown={R.predictGuidance} className="al-reader-prediction-guidance" />}
      <button
        type="button"
        className="button secondary al-prediction-entry"
        onClick={startPrediction}
      >
        {R.predictEntry}
      </button>
    </div>
  );
}
