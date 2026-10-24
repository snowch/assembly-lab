// Copyright © 2026 Christopher Snow

// The question, the options, the button that commits and the result, shared by Module 1's
// predictions. It is TracePrediction's page for a prediction whose answer is something other than
// a w register at the end of a run: the learner commits first, the model is asked only after the
// commit, and the right option is whatever the model gave.

import { useMemo } from "react";

import { Prose, useSlot } from "@platform/lesson-runtime";
import type { LessonStore } from "@platform/lesson-runtime";
import { PredictionChoice as PredictionChallenge } from "../PredictionChoice";

import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";

export interface Option {
  readonly value: string;
  readonly label: string;
}

/** What the model gave: the option's value that is right, and the sentence that says what it did. */
export interface Outcome {
  readonly value: string;
  readonly said: string;
}

interface Stored {
  readonly choice: string;
}

export function PredictionBox({
  id,
  store,
  question,
  options,
  explain,
  measure,
  kind,
}: {
  /** The interactive's id: the key the commitment is kept under, and the radio group's name. */
  id: string;
  store: LessonStore;
  /** Markdown: the question. */
  question: string;
  options: readonly Option[];
  /** Markdown, shown once the prediction is checked. */
  explain: string;
  /** Asked once, after the commit. */
  measure: () => Outcome;
  kind: string;
}) {
  const [stored, setStored] = useSlot<Stored>(store, id);
  const outcome = useMemo(() => (stored ? measure() : undefined), [stored, measure]);
  const labelOf = (value: string) => options.find((o) => o.value === value)?.label ?? value;
  return (
    <div
      className="al-figure al-prediction"
      data-figure={kind}
      data-committed={stored !== undefined}
    >
      <Prose markdown={question} />
      <PredictionChallenge
        name={`${id}-choice`}
        options={[...options]}
        committed={stored?.choice}
        onCommit={(choice) => setStored({ choice })}
        legend={S.prediction.legend}
        commitLabel={S.prediction.commit}
        renderLabel={withCode}
      />
      {stored && outcome && (
        <div className="al-outcome">
          <p role="status" className={outcome.value === stored.choice ? "al-match" : "al-nomatch"}>
            <span className="al-chose">
              {withCode(S.prediction.youChose(labelOf(stored.choice)))}
            </span>{" "}
            {withCode(outcome.said)}{" "}
            {outcome.value === stored.choice ? S.prediction.match : S.prediction.noMatch}
          </p>
          {explain && <Prose markdown={explain} />}
        </div>
      )}
    </div>
  );
}
