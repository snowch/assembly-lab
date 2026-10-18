// Copyright © 2026 Christopher Snow

// Commit before observing a run. A budget stop is a limit, never evidence that a loop is infinite.
import { useCallback } from "react";
import { z } from "zod";
import { cLinesOf, programLines } from "../listing";
import { loopSummary } from "../loop";
import { ListingView, RegisterRow } from "../parts";
import { ARITH_STRINGS as A } from "../strings.arith";
import { LOOP_STRINGS as L } from "../strings.loop";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, wValue } from "../trace";
import { PredictionBox, type Outcome } from "./PredictionBox";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Props = z
  .object({
    question: z.string(),
    options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
    explain: z.string().default(""),
    program: RecordedSchema,
    call: CallSchema,
    measure: z.enum(["body-visits", "stop"]),
    bodyLabel: z.string().optional(),
    inputs: z.array(z.number().int().min(0).max(30)).default([]),
  })
  .refine((p) => p.measure !== "body-visits" || p.bodyLabel !== undefined);

export const LoopPrediction = withProps(
  Props,
  function LoopPrediction({ data, interactive, store }) {
    const measure = useCallback((): Outcome => {
      const trace = traceOf(data.program, { ...data.call, maxSteps: data.call.maxSteps ?? 256 });
      if (trace.result.stop.kind === "limit")
        return { value: "limit", said: L.limited(trace.result.steps.length) };
      if (trace.result.stop.kind !== "returned")
        return { value: "error", said: S.prediction.endedWithError };
      if (data.measure === "stop")
        return { value: "returned", said: L.returned(wValue(trace.result.final, 0)) };
      const count = loopSummary(trace, data.bodyLabel!).visits.length;
      return { value: String(count), said: L.iterations(count) };
    }, [data.program, data.call, data.measure, data.bodyLabel]);
    return (
      <div className="al-figure" data-figure="loop-prediction">
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
          kind="loop-prediction"
        />
      </div>
    );
  },
);
