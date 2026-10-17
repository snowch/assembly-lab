// Copyright © 2026 Christopher Snow

import { useCallback } from "react";
import { z } from "zod";

import { hexAddress, hexByte, memoryRegister } from "../memoryFigure";
import { stopSentence } from "../messages";
import { MEMORY_STRINGS as M } from "../strings.memory";
import { traceOf } from "../trace";
import { PredictionBox, type Outcome } from "./PredictionBox";
import { MemoryCallSchema, RecordedSchema, withProps } from "./props";

const Props = z.object({
  program: RecordedSchema,
  call: MemoryCallSchema,
  question: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  explain: z.string().default(""),
  measure: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("memory-at-end"),
      address: z
        .number()
        .int()
        .nonnegative()
        .max(Number.MAX_SAFE_INTEGER - 32),
      length: z.number().int().min(1).max(32),
    }),
    z.object({
      kind: z.literal("register-at-end"),
      register: z.string().regex(/^[wx](?:[0-9]|[12][0-9]|30)$/),
    }),
  ]),
});

export const MemoryPrediction = withProps(
  Props,
  function MemoryPrediction({ data, interactive, store }) {
    const measure = useCallback((): Outcome => {
      const trace = traceOf(data.program, data.call);
      if (trace.result.stop.kind !== "returned")
        return { value: "error", said: stopSentence(trace.result.stop) ?? "" };
      if (data.measure.kind === "register-at-end") {
        const value = memoryRegister(trace, trace.result.steps.length, data.measure.register);
        return { value, said: M.registerOutcome(data.measure.register, value) };
      }
      const bytes = trace.result.read(data.measure.address, data.measure.length);
      if (bytes === undefined) throw new Error("Prediction memory range is not mapped.");
      const value = [...bytes].map(hexByte).join(" ");
      return { value, said: M.memoryOutcome(hexAddress(data.measure.address), value) };
    }, [data.program, data.call, data.measure]);
    return (
      <PredictionBox
        id={interactive.id}
        store={store}
        question={data.question}
        options={data.options}
        explain={data.explain}
        measure={measure}
        kind="memory-prediction"
      />
    );
  },
);
