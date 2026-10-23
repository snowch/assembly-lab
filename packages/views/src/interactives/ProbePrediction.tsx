// Copyright © 2026 Christopher Snow

// Predict, commit, see, for a question about what a function does to a word. The learner commits to
// a choice; the model then runs the function on the call and on a few more words, and the page
// says which choice fits what it did and whether the learner's matched. Nothing is run before the
// commit, and the matching choice is never read from the lesson's words (probe.ts).

import { useMemo } from "react";
import { z } from "zod";

import { Prose, useSlot } from "@platform/lesson-runtime";
import { PredictionChallenge } from "@platform/primitives";

import { BitRow, Ruler, differing, hex, unsignedOf } from "../bits";
import { withCode } from "../parts";
import { measure } from "../probe";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, viewAt, wValue } from "../trace";
import { MaskView } from "./MaskView";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Measure = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("cleared-bits") }),
  z.object({ kind: z.literal("register-hex"), register: z.number().int().min(0).max(30) }),
  z.object({ kind: z.literal("fill-rule") }),
  z.object({ kind: z.literal("first-add") }),
]);

const Props = z.object({
  /** Markdown: the question. */
  question: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  /** Markdown, shown once the prediction is checked. */
  explain: z.string().default(""),
  program: RecordedSchema,
  call: CallSchema,
  measure: Measure,
  /** Draw w0 as it is when the call starts, before the learner commits. */
  showStart: z.boolean().default(false),
  /**
   * After the commit, also draw the mask of the function's logic instruction and the low eight bits
   * of the word, the mask and the result, from a run of the function on this word.
   */
  maskView: z.object({ word: z.number().int() }).optional(),
});

interface Stored {
  readonly choice: string;
}

const text = (v: number) => `${hex(v)} (${unsignedOf(v)})`;

export const ProbePrediction = withProps(
  Props,
  function ProbePrediction({ data, interactive, store }) {
    const [stored, setStored] = useSlot<Stored>(store, interactive.id);
    // The run is made after the commit, not before.
    const outcome = useMemo(
      () => (stored ? measure(data.measure, data.program, data.call) : undefined),
      [stored, data.measure, data.program, data.call],
    );
    const start = useMemo(
      () =>
        data.showStart ? wValue(viewAt(traceOf(data.program, data.call), 0).state, 0) : undefined,
      [data.showStart, data.program, data.call],
    );
    const labelOf = (value: string) => data.options.find((o) => o.value === value)?.label ?? value;
    return (
      <div
        className="al-figure al-prediction"
        data-figure="probe-prediction"
        data-committed={stored !== undefined}
      >
        <Prose markdown={data.question} />
        {start !== undefined && stored === undefined && (
          <div className="al-bitrows">
            <Ruler />
            <BitRow row="start" name={S.bits.onEntry("w0")} value={start} text={text(start)} />
          </div>
        )}
        <PredictionChallenge
          name={`${interactive.id}-choice`}
          options={data.options}
          committed={stored?.choice}
          onCommit={(choice) => setStored({ choice })}
          legend={S.prediction.legend}
          commitLabel={S.prediction.commit}
          renderLabel={withCode}
        />
        {stored && outcome && (
          <div className="al-outcome">
            <p
              role="status"
              className={outcome.value === stored.choice ? "al-match" : "al-nomatch"}
            >
              <span className="al-chose">
                {withCode(S.prediction.youChose(labelOf(stored.choice)))}
              </span>{" "}
              {withCode(outcome.said)}{" "}
              {outcome.value === stored.choice ? S.prediction.match : S.prediction.noMatch}
            </p>
            {outcome.rows && data.maskView === undefined && (
              <div className="al-bitrows">
                <Ruler />
                <BitRow
                  row="ran-before"
                  name={S.bitOps.rowBefore("w0")}
                  value={outcome.rows.before}
                  text={text(outcome.rows.before)}
                />
                <BitRow
                  row="ran-after"
                  name={S.bitOps.rowAfter("w0")}
                  value={outcome.rows.after}
                  text={text(outcome.rows.after)}
                  marks={{ changed: differing(outcome.rows.before, outcome.rows.after) }}
                />
              </div>
            )}
            {data.maskView && (
              <MaskView
                program={data.program}
                entry={data.call.entry}
                word={unsignedOf(data.maskView.word)}
              />
            )}
            {data.explain && <Prose markdown={data.explain} />}
          </div>
        )}
      </div>
    );
  },
);
