// Copyright © 2026 Christopher Snow

// Predict, commit, see, for a question about how many instructions a run takes. The figure shows the
// listing and the registers the call starts with, which the lesson's text has told the learner. The
// run is made after the commit, never before, and the right option is the number of steps the model
// recorded, never a number in the lesson's words.

import { useCallback } from "react";
import { z } from "zod";

import { RegisterRow, ListingView } from "../parts";
import { cLinesOf, programLines } from "../listing";
import { ARITH_STRINGS as A } from "../strings.arith";
import { BRANCH_STRINGS as B } from "../strings.branch";
import { traceOf } from "../trace";
import { PredictionBox, type Outcome } from "./PredictionBox";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  /** Markdown: the question. */
  question: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  /** Markdown, shown once the prediction is checked. */
  explain: z.string().default(""),
  program: RecordedSchema,
  call: CallSchema,
  /** The registers to show with the values the call gives them, before the run. */
  inputs: z.array(z.number().int().min(0).max(30)).default([]),
});

export const CountPrediction = withProps(
  Props,
  function CountPrediction({ data, interactive, store }) {
    const measure = useCallback((): Outcome => {
      const trace = traceOf(data.program, data.call);
      const n = trace.result.steps.length;
      return { value: String(n), said: B.count.ran(n) };
    }, [data.program, data.call]);
    return (
      <div className="al-figure" data-figure="count-prediction">
        <ListingView cLines={cLinesOf(data.program.c)} lines={programLines(data.program)} />
        {data.inputs.length > 0 && (
          <div className="al-registers" role="group" aria-label={A.prediction.registers}>
            {data.inputs.map((n) => (
              <RegisterRow
                key={n}
                name={`w${n}`}
                value={Number(BigInt.asUintN(32, BigInt(data.call.args[n] ?? 0)))}
                changed={false}
              />
            ))}
          </div>
        )}
        <PredictionBox
          id={interactive.id}
          store={store}
          question={data.question}
          options={data.options}
          explain={data.explain}
          measure={measure}
          kind="count-prediction"
        />
      </div>
    );
  },
);
