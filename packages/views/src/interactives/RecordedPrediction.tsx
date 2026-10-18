// Copyright © 2026 Christopher Snow

import { useCallback } from "react";
import { z } from "zod";
import { RecordedQuerySchema, recordedAnswer, recordedInstruction } from "../recorded";
import { RECORDED_STRINGS as S } from "../strings.recorded";
import { PredictionBox } from "./PredictionBox";
import { withProps } from "./props";

const Props = z.object({
  query: RecordedQuerySchema,
  question: z.string(),
  explain: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
});
export const RecordedPrediction = withProps(
  Props,
  function RecordedPrediction({ data, interactive, store }) {
    const measure = useCallback(() => {
      const value = recordedAnswer(data.query);
      return {
        value,
        said:
          data.query.kind === "a64-acceptance"
            ? value === "accepted"
              ? S.accepted
              : S.rejected
            : data.query.kind === "a64-result"
              ? S.result(value)
              : S.token(value),
      };
    }, [data.query]);
    return (
      <>
        {data.query.kind === "a64-acceptance" && (
          <pre>
            <code>{recordedInstruction(data.query.program, data.query.instruction)}</code>
          </pre>
        )}
        <PredictionBox
          id={interactive.id}
          store={store}
          question={data.question}
          options={data.options}
          explain={data.explain}
          measure={measure}
          kind="recorded-prediction"
        />
      </>
    );
  },
);
