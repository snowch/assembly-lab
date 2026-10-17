// Copyright © 2026 Christopher Snow

// Predict, commit, see. The learner commits to what a run of the model will do; the model then runs
// it, and the page says what it did and whether the prediction matched. Nothing is shown before the
// commit, and the right option is never read from the lesson's words: it is what the run gave.

import { useMemo } from "react";
import { z } from "zod";

import { Prose, useSlot } from "@platform/lesson-runtime";
import { PredictionChallenge } from "@platform/primitives";

import { withCode } from "../parts";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, wValue } from "../trace";
import { CallSchema, DeleteSchema, RecordedSchema, withProps } from "./props";

const Measure = z.discriminatedUnion("kind", [
  /** Which register the first instruction writes. The right option's value is `w0`, `w1` and so on. */
  z.object({ kind: z.literal("first-write") }),
  /**
   * What a register holds when the run ends, with a line perhaps taken out first. The right
   * option's value is the number, or `error` when the run does not end by returning.
   */
  z.object({
    kind: z.literal("register-at-end"),
    register: z.number().int().min(0).max(30),
    without: DeleteSchema.optional(),
  }),
]);

const Props = z.object({
  /** Markdown: the question. */
  question: z.string(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        /** Shown, with the result, when this option is chosen and the model says it does not match. */
        feedback: z.string().optional(),
      }),
    )
    .min(2),
  /** Markdown, shown once the prediction is checked. */
  explain: z.string().default(""),
  program: RecordedSchema,
  call: CallSchema,
  measure: Measure,
});

interface Stored {
  readonly choice: string;
}

export const TracePrediction = withProps(
  Props,
  function TracePrediction({ data, interactive, store }) {
    const [stored, setStored] = useSlot<Stored>(store, interactive.id);
    // The run is made after the commit, not before: nothing is worked out for a learner who has not
    // yet answered.
    const outcome = useMemo(() => {
      if (!stored) return undefined;
      const m = data.measure;
      const trace = traceOf(
        data.program,
        data.call,
        m.kind === "register-at-end" ? m.without : undefined,
      );
      if (m.kind === "first-write") {
        const first = trace.result.steps[0]?.writes.find((w) => w.reg !== "sp");
        const register = first && first.reg !== "sp" ? `w${first.reg}` : "none";
        return {
          value: register,
          said:
            register === "none"
              ? S.prediction.firstWroteNothing
              : S.prediction.firstWrote(register),
        };
      }
      if (trace.result.stop.kind !== "returned")
        return { value: "error", said: S.prediction.endedWithError };
      const held = wValue(trace.result.final, m.register);
      return { value: String(held), said: S.prediction.endedWith(`w${m.register}`, held) };
    }, [stored, data.measure, data.program, data.call]);
    const labelOf = (value: string) => data.options.find((o) => o.value === value)?.label ?? value;
    const feedback =
      stored && outcome && outcome.value !== stored.choice
        ? data.options.find((o) => o.value === stored.choice)?.feedback
        : undefined;
    return (
      <div
        className="al-figure al-prediction"
        data-figure="trace-prediction"
        data-committed={stored !== undefined}
      >
        <Prose markdown={data.question} />
        <PredictionChallenge
          name={`${interactive.id}-choice`}
          options={data.options.map(({ value, label }) => ({ value, label }))}
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
            {feedback !== undefined && <p className="al-feedback">{withCode(feedback)}</p>}
            {data.explain && <Prose markdown={data.explain} />}
          </div>
        )}
      </div>
    );
  },
);
