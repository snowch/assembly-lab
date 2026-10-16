// Copyright © 2026 Christopher Snow

// Predict, commit, see, for a question about the answer of an addition or subtraction: which
// readings of the answer are right, which flags a run leaves, what a register holds when it ends.
// As with the other predictions, nothing is worked out before the learner commits, and the right
// option is what the run gave, never the lesson's words. The figure shows the program and the
// registers it starts with, which the lesson's text has already told the learner.

import { useMemo } from "react";
import { z } from "zod";

import { Prose, useSlot } from "@platform/lesson-runtime";
import { PredictionChallenge } from "@platform/primitives";

import { additionSteps, flagDigits, hex32 } from "../arith";
import { cLinesOf, parseListing } from "../listing";
import { ListingView, RegisterRow, withCode } from "../parts";
import { ARITH_STRINGS as A } from "../strings.arith";
import { VIEW_STRINGS as S } from "../strings";
import { traceOf, wValue } from "../trace";
import { CallSchema, RecordedSchema, withProps } from "./props";

const Measure = z.discriminatedUnion("kind", [
  /**
   * Which readings of the first addition's answer are right. The right option's value is `both`,
   * `unsigned`, `signed` or `neither`.
   */
  z.object({ kind: z.literal("readings") }),
  /**
   * What the four flags are when the run ends. The right option's value is `none` (all four 0),
   * `v` (V set, C clear), `c` (C set, V clear), `other`, or `error` when the run does not return.
   */
  z.object({ kind: z.literal("flags") }),
  /**
   * What a register holds when the run ends, as a decimal number or as hexadecimal (`0x` and eight
   * digits); the right option's value is that text, or `error` when the run does not return. With
   * `flags`, the result also says the four flags.
   */
  z.object({
    kind: z.literal("register"),
    register: z.number().int().min(0).max(30),
    as: z.enum(["decimal", "hex"]).default("decimal"),
    flags: z.boolean().default(false),
  }),
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
  /** The registers to show with the values the call gives them, before the run. */
  inputs: z.array(z.number().int().min(0).max(30)).default([]),
});

interface Stored {
  readonly choice: string;
}

export const RunPrediction = withProps(Props, function RunPrediction({ data, interactive, store }) {
  const [stored, setStored] = useSlot<Stored>(store, interactive.id);
  const lines = useMemo(() => parseListing(data.program.listing), [data.program.listing]);
  const outcome = useMemo(() => {
    if (!stored) return undefined;
    const trace = traceOf(data.program, data.call);
    const m = data.measure;
    if (m.kind === "readings") {
      const record = additionSteps(trace)[0]?.addition;
      if (!record || record.width !== 32 || record.subtraction)
        return { value: "error", said: S.prediction.endedWithError };
      const signed = (v: bigint) => BigInt.asIntN(32, v);
      const unsignedRight = record.a + record.b + BigInt(record.carryIn) === record.result;
      const signedRight =
        signed(record.a) + signed(record.b) + BigInt(record.carryIn) === signed(record.result);
      return {
        value:
          unsignedRight && signedRight
            ? "both"
            : unsignedRight
              ? "unsigned"
              : signedRight
                ? "signed"
                : "neither",
        said: A.prediction.readings(unsignedRight, signedRight),
      };
    }
    const returned = trace.result.stop.kind === "returned";
    const [n, z, c, v] = flagDigits(trace.result.final.flags);
    if (m.kind === "flags") {
      const value = !returned
        ? "error"
        : n + z + c + v === 0
          ? "none"
          : v === 1 && c === 0
            ? "v"
            : c === 1 && v === 0
              ? "c"
              : "other";
      return {
        value,
        said: returned ? A.prediction.flagsAt(n, z, c, v) : S.prediction.endedWithError,
      };
    }
    if (!returned) return { value: "error", said: S.prediction.endedWithError };
    const held = wValue(trace.result.final, m.register);
    const name = `w${m.register}`;
    const shown = m.as === "hex" ? hex32(held) : String(held);
    const said =
      m.as === "hex" ? A.prediction.endedWithHex(name, shown) : S.prediction.endedWith(name, held);
    return { value: shown, said: m.flags ? `${said} ${A.prediction.andFlags(n, z, c, v)}` : said };
  }, [stored, data.measure, data.program, data.call]);
  const labelOf = (value: string) => data.options.find((o) => o.value === value)?.label ?? value;
  return (
    <div
      className="al-figure al-prediction"
      data-figure="run-prediction"
      data-committed={stored !== undefined}
    >
      <ListingView cLines={cLinesOf(data.program.c)} lines={lines} />
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
      <Prose markdown={data.question} />
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
          <p role="status" className={outcome.value === stored.choice ? "al-match" : "al-nomatch"}>
            <span className="al-chose">
              {withCode(S.prediction.youChose(labelOf(stored.choice)))}
            </span>{" "}
            {withCode(outcome.said)}{" "}
            {outcome.value === stored.choice ? S.prediction.match : S.prediction.noMatch}
          </p>
          {data.explain && <Prose markdown={data.explain} />}
        </div>
      )}
    </div>
  );
});
