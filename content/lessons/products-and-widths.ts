// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./products-and-widths.labels";
import { PROSE as P } from "./products-and-widths.prose";
import * as R from "./products.listings";
const steps = "steps";
const figure = (id: string, kind: string, caption: string, props: Record<string, unknown>) => ({
  id,
  kind,
  timeModel: kind === "listing" ? "none" : steps,
  caption,
  ...(kind.endsWith("-prediction")
    ? { role: "prediction" as const }
    : kind === "challenge"
      ? { role: "exercise" as const }
      : ["listing", "product-halves", "division-parts"].includes(kind)
        ? { role: "diagram" as const }
        : {}),
  props,
});
const call = (entry: string, args: readonly unknown[]) => ({ entry, args });
const listing = (id: string, caption: string, program: { c: string; listing: string }) =>
  figure(id, "listing", caption, { program });
const step = (
  id: string,
  caption: string,
  program: { c: string; listing: string },
  entry: string,
  args: readonly unknown[],
  registers: string[],
  after: string,
) => figure(id, "memory-stepper", caption, { program, call: call(entry, args), registers, after });
const prediction = (
  id: string,
  caption: string,
  program: { c: string; listing: string },
  entry: string,
  args: readonly unknown[],
  register: string,
  question: string,
  options: readonly { value: string; label: string }[],
  explain: string,
) =>
  figure(id, "memory-prediction", caption, {
    program,
    call: call(entry, args),
    measure: { kind: "register-at-end", register },
    question,
    options,
    explain,
  });
const challengeFigure = (id: string, caption: string) =>
  figure(id, "challenge", caption, { challengeId: id });

const gate = "predict-low-product";
const failureGate = "predict-late-widening";
const wide = (value: string) => ({ value, width: 64 });
const cases = [
  [7, 6, 10],
  [4294967295, 2, 5],
  [0, 3, 7],
  [2147483648, 2, 0],
  [1, 1, 4294967295],
] as const;
const wideCases = [
  [4294967295, 2],
  [4294967295, 4294967295],
  [2147483648, 2],
  [0, 4294967295],
  [7, 6],
] as const;
export const productsAndWidths: LessonInput = {
  id: "products-and-widths",
  title: L.title,
  module: 8,
  order: 0,
  objectives: [...L.objectives],
  introduces: ["product", "high half"],
  sections: [
    {
      kind: "question",
      title: L.titles.question,
      prose: P.question,
      details: { summary: P.questionNoteSummary, prose: P.questionNote },
      interactives: [listing("scale-pulses-listing", L.captions.listing, R.SCALE_PULSES)],
    },
    { kind: "motivation", title: L.titles.motivation, prose: P.motivation },
    {
      kind: "prediction",
      title: L.titles.prediction,
      prose: P.prediction,
      interactives: [
        prediction(
          gate,
          L.captions.predict,
          R.SCALE_PULSES,
          "scale_pulses",
          [2147483648, 2],
          "w0",
          P.predictionQuestion,
          L.options.prediction,
          P.predictionExplain,
        ),
        step(
          "step-low-product",
          L.captions.step,
          R.SCALE_PULSES,
          "scale_pulses",
          [2147483648, 2],
          ["w0", "w1", "x0"],
          gate,
        ),
      ],
    },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        listing("scaled-total-listing", L.captions.investigation, R.SCALED_TOTAL),
        step(
          "step-scaled-total",
          L.captions.investigation,
          R.SCALED_TOTAL,
          "scaled_total",
          [7, 6, 10],
          ["w0", "w1", "w2"],
          gate,
        ),
      ],
    },
    {
      kind: "construction",
      title: L.titles.construction,
      prose: P.construction,
      interactives: [challengeFigure("write-scaled-total", L.captions.write)],
    },
    {
      kind: "failureExperiment",
      title: L.titles.failureExperiment,
      prose: P.failureExperiment,
      interactives: [
        prediction(
          failureGate,
          L.captions.predictFailure,
          R.WIDE_TOO_LATE,
          "wide_too_late",
          [4294967295, 2],
          "x0",
          P.failureQuestion,
          L.options.failure,
          P.failureExplain,
        ),
        step(
          "step-late-widening",
          L.captions.failureStep,
          R.WIDE_TOO_LATE,
          "wide_too_late",
          [4294967295, 2],
          ["w0", "x0", "w1"],
          failureGate,
        ),
      ],
    },
    {
      kind: "explanation",
      title: L.titles.explanation,
      prose: P.explanation,
      interactives: [
        step(
          "step-wide-unsigned",
          L.captions.wideUnsigned,
          R.WIDE_UNSIGNED,
          "wide_unsigned",
          [4294967295, 2],
          ["w0", "w1", "x0"],
          failureGate,
        ),
        step(
          "step-wide-signed",
          L.captions.wideSigned,
          R.WIDE_SIGNED,
          "wide_signed",
          [-1, 2],
          ["w0", "w1", "x0"],
          failureGate,
        ),
        step(
          "step-subtract-product",
          L.captions.msub,
          R.SUBTRACT_PRODUCT,
          "subtract_product",
          [100, 7, 6],
          ["w0", "w1", "w2"],
          gate,
        ),
      ],
    },
    {
      kind: "generalisation",
      title: L.titles.generalisation,
      prose: P.generalisation,
      interactives: [
        step(
          "step-product-halves",
          L.captions.halves,
          R.PRODUCT_HALVES,
          "product_halves",
          [wide("18446744073709551615"), wide("2")],
          ["x0", "x1", "x2", "x3", "x4"],
          failureGate,
        ),
        figure("product-halves-diagram", "product-halves", L.captions.completedHalves, {
          program: R.PRODUCT_HALVES,
          call: call("product_halves", [wide("18446744073709551615"), wide("2")]),
          after: failureGate,
        }),
      ],
    },
    {
      kind: "challenge",
      title: L.titles.challenge,
      prose: "",
      interactives: [challengeFigure("write-wide-product", L.captions.final)],
    },
    {
      kind: "reflection",
      title: L.titles.reflection,
      prose: P.reflection,
    },
  ],
  challenges: [
    {
      id: "write-scaled-total",
      title: L.challenges.write.title,
      task: P.writeTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "w2", "w3"],
      allowedConstructs: ["mul", "madd", "add", "ret"],
      initial: {
        text: "ret",
        data: { editor: { registers: ["w0", "w1", "w2", "w3"], symbols: [",", "#", "w"] } },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: cases.map(([w0, w1, w2], i) => ({
          label: L.challenges.write.tests[i]!,
          given: { w0, w1, w2, reading: "unsigned" },
          expect: { w0: Number(BigInt.asUintN(32, BigInt(w0) * BigInt(w1) + BigInt(w2))) },
        })),
      },
      hints: [...P.writeHints],
      reference: { text: R.SCALED_TOTAL_TEXT },
    },
    {
      id: "write-wide-product",
      title: L.challenges.final.title,
      task: P.finalTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "x0"],
      allowedConstructs: ["mul", "umull", "smull", "ret"],
      initial: {
        text: "mul w0, w0, w1\nret",
        data: { editor: { registers: ["w0", "w1", "x0"], symbols: [",", "w", "x"] } },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: wideCases.map(([w0, w1], i) => ({
          label: L.challenges.final.tests[i]!,
          given: { w0, w1, reading: "unsigned" },
          expect: { x0: String(BigInt(w0) * BigInt(w1)) },
        })),
      },
      hints: [...P.finalHints],
      reference: { text: R.WIDE_PRODUCT_TEXT },
    },
  ],
  sectionLayout: "selected",
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
