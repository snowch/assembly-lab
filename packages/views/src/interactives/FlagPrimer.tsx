// Copyright © 2026 Christopher Snow
import { useState } from "react";
import { z } from "zod";
import { useSlot, type LessonStore } from "@platform/lesson-runtime";
import { FlagsRow } from "../FlagsRow";
import {
  FLAG_PRIMER_INPUTS as INPUTS,
  PRIMER_FLAGS,
  fourBitFlags,
  primerAttempt,
  primerCorrect,
  primerReady,
  type PrimerFlag,
} from "../flag-primer";
import { FLAG_PRIMER_STRINGS as S } from "../strings.flag-primer";
import { withProps } from "./props";

const Props = z.object({ stage: z.enum(["examples", "practice"]) });
type Model = ReturnType<typeof fourBitFlags>;
function Bits({ model }: { model: Model }) {
  return (
    <div className="al-primer-bits" role="table" aria-label={S.positions}>
      <div role="row">
        <span role="columnheader">{S.positions}</span>
        {[3, 2, 1, 0].map((bit) => (
          <span role="columnheader" key={bit}>
            {bit}
          </span>
        ))}
      </div>
      {[
        [S.first, model.addition.a.pattern],
        [S.second, model.addition.b.pattern],
        [S.retained, model.addition.result.pattern],
      ].map(([label, pattern], row) => (
        <div role="row" data-result={row === 2} key={label}>
          <span role="rowheader">
            {row === 1 ? "+ " : ""}
            {label}
          </span>
          {pattern!.split("").map((digit, i) => (
            <span role="cell" key={i} className="al-primer-bit" data-on={digit === "1"}>
              {digit}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
function Readings({ model }: { model: Model }) {
  const a = model.addition;
  return (
    <div className="al-primer-readings">
      <p>
        <strong>{S.unsigned}</strong> <code>{S.sum(a.a.unsigned, a.b.unsigned, a.fullSum)}</code>
        <br />
        {a.fullSum <= 15 ? S.fits : S.doesNotFit} {S.rangeUnsigned}
      </p>
      <p>
        <strong>{S.signed}</strong> <code>{S.sum(a.a.signed, a.b.signed, model.signedSum)}</code>
        <br />
        {!model.flags.v ? S.fits : S.doesNotFit} {S.rangeSigned}
      </p>
    </div>
  );
}
function Example({ focus }: { focus: PrimerFlag }) {
  const model = fourBitFlags(INPUTS[focus][0], INPUTS[focus][1]);
  return (
    <article className="al-primer-example" data-focus={focus}>
      <h4>{S[`${focus}Title`]}</h4>
      <p>{S[`${focus}Rule`]}</p>
      <Bits model={model} />
      {(focus === "c" || focus === "v") && <Readings model={model} />}
      <p>{S.retainedReadings(model.addition.result.unsigned, model.addition.result.signed)}</p>
      {(focus === "c" || focus === "v") && <p>{S.carryOut(model.addition.carryOut)}</p>}
      <FlagsRow flags={model.flags} />
    </article>
  );
}
function Practice({ store }: { store: LessonStore }) {
  const [raw, set] = useSlot<unknown>(store, "four-bit-flag-practice");
  const attempt = primerAttempt(raw);
  const [invalid, setInvalid] = useState(false);
  const model = fourBitFlags(...INPUTS.practice);
  const shown = attempt.submitted && primerReady(attempt);
  return (
    <div data-flag-practice>
      <h3>{S.practiceTitle}</h3>
      <p>{S.practiceIntro}</p>
      <Bits model={model} />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!primerReady(attempt)) {
            setInvalid(true);
            return;
          }
          set({ ...attempt, submitted: true });
          setInvalid(false);
        }}
        onReset={(event) => {
          event.preventDefault();
          set(undefined);
          setInvalid(false);
        }}
      >
        <div className="al-primer-choices">
          {PRIMER_FLAGS.map((flag) => (
            <fieldset key={flag}>
              <legend>{S.flagLabel(flag.toUpperCase())}</legend>
              {(["0", "1"] as const).map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name={`primer-${flag}`}
                    value={value}
                    checked={attempt.choices[flag] === value}
                    onChange={() => {
                      set({ choices: { ...attempt.choices, [flag]: value }, submitted: false });
                      setInvalid(false);
                    }}
                  />
                  {value}
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className="al-controls">
          <button className="button primary" type="submit">
            {S.check}
          </button>
          <button className="button secondary" type="reset">
            {S.reset}
          </button>
        </div>
      </form>
      <div role="status" aria-live="polite">
        {invalid && <p>{S.incomplete}</p>}
        {shown && (
          <div data-primer-feedback data-correct={primerCorrect(attempt)}>
            <p>
              <strong>{primerCorrect(attempt) ? S.correct : S.incorrect}</strong>
            </p>
            <FlagsRow flags={model.flags} />
            <Readings model={model} />
            <ul>
              {S.practiceFeedback.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p>{S.practiceTakeaway}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export const FlagPrimer = withProps(Props, function FlagPrimer({ data, store }) {
  return (
    <div className="al-figure al-flag-primer" data-stage={data.stage}>
      {data.stage === "practice" ? (
        <Practice store={store} />
      ) : (
        <>
          <p className="al-primer-note">{S.miniature}</p>
          <h3>{S.headingNZ}</h3>
          <div className="al-primer-pair">
            <Example focus="n" />
            <Example focus="z" />
          </div>
          <h3>{S.headingCV}</h3>
          <div className="al-primer-pair">
            <Example focus="c" />
            <Example focus="v" />
          </div>
          <p>{S.independent}</p>
        </>
      )}
    </div>
  );
});
