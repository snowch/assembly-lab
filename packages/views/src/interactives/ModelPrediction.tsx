// Copyright © 2026 Christopher Snow

// Predictions whose answer the model gives in a way TracePrediction does not draw: which of some
// constants one `mov` can hold (the assembler is asked), and what a 64-bit register holds when a
// run ends (the run is made and the whole register read). Nothing is asked of the model before the
// commit, and the right option is never read from the lesson's words.

import { useCallback } from "react";
import { z } from "zod";

import { assemble } from "@al/machine";

import { stopSentence } from "../messages";
import { traceText } from "../traceText";
import { VIEW_STRINGS as S } from "../strings";
import { PredictionBox, type Outcome } from "./PredictionBox";
import { traceOf, viewAt, wValue } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Measure = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("register-at-step"),
    program: RecordedSchema,
    call: CallSchema,
    step: z.number().int().min(0),
    register: z.number().int().min(0).max(30),
  }),
  z.object({
    kind: z.literal("first-divergence"),
    program: RecordedSchema,
    other: RecordedSchema,
    call: CallSchema,
    register: z.number().int().min(0).max(30),
  }),
  /** The right option is the only one whose value `mov w0, <value>` assembles to one instruction. */
  z.object({ kind: z.literal("constant-fits") }),
  /**
   * What the whole register holds when the program's run ends. The right option's value is
   * `all-set` (all 64 bits are 1), `low-set` (the lower 32 are 1 and the upper 32 are 0), `error`
   * (the run did not return), or the register's value in hexadecimal otherwise.
   */
  z.object({
    kind: z.literal("register-at-end"),
    program: RecordedSchema,
    register: z.number().int().min(0).max(30),
  }),
]);

const Props = z.object({
  /** Markdown: the question. */
  question: z.string(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).min(2),
  /** Markdown, shown once the prediction is checked. */
  explain: z.string().default(""),
  measure: Measure,
});

type Measured = z.infer<typeof Measure>;
type Option = { value: string; label: string };

/** The 64 bits of a register, as sixteen hexadecimal digits. */
const hex64 = (x: bigint) => `0x${BigInt.asUintN(64, x).toString(16).padStart(16, "0")}`;

function measureConstants(options: readonly Option[]): Outcome {
  const accepted = options.filter((o) => assemble(`mov w0, ${o.value}\nret\n`).program !== null);
  const [only] = accepted;
  if (accepted.length === 1 && only) {
    return { value: only.value, said: S.fits.one(only.value, options.length - 1) };
  }
  if (accepted.length === 0) return { value: "none", said: S.fits.none };
  return { value: "several", said: S.fits.several(accepted.map((o) => o.value).join(", ")) };
}

function measureRegister(m: Extract<Measured, { kind: "register-at-end" }>): Outcome {
  const trace = traceText(m.program.listing);
  if (trace.result.stop.kind !== "returned")
    return { value: "error", said: stopSentence(trace.result.stop) ?? "" };
  const x = trace.result.final.x[m.register] ?? 0n;
  const name = `x${m.register}`;
  const said = S.wide.endedWith(name, hex64(x));
  if (x === BigInt.asUintN(64, -1n)) return { value: "all-set", said };
  if (x === 0xffffffffn) return { value: "low-set", said };
  return { value: hex64(x), said };
}

export const ModelPrediction = withProps(
  Props,
  function ModelPrediction({ data, interactive, store }) {
    const measure = useCallback(() => {
      const m = data.measure;
      if (m.kind === "constant-fits") return measureConstants(data.options);
      if (m.kind === "register-at-end") return measureRegister(m);
      const trace = traceOf(m.program, m.call);
      if (m.kind === "register-at-step") {
        const value = wValue(viewAt(trace, m.step).state, m.register);
        return {
          value: String(value),
          said:
            data.options.find((option) => option.value === String(value))?.label ?? String(value),
        };
      }
      const other = traceOf(m.other, m.call);
      const first = trace.result.steps.findIndex(
        (_, index) =>
          wValue(viewAt(trace, index + 1).state, m.register) !==
          wValue(viewAt(other, index + 1).state, m.register),
      );
      const value = String(first + 1);
      return { value, said: data.options.find((option) => option.value === value)?.label ?? value };
    }, [data.measure, data.options]);
    return (
      <PredictionBox
        id={interactive.id}
        store={store}
        question={data.question}
        options={data.options}
        explain={data.explain}
        measure={measure}
        kind="model-prediction"
      />
    );
  },
);
