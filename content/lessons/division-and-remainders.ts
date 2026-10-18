// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./division-and-remainders.labels";
import { PROSE as P } from "./division-and-remainders.prose";
import * as R from "./products.listings";
const steps = "steps";
const figure = (id: string, kind: string, caption: string, props: Record<string, unknown>) => ({
  id,
  kind,
  timeModel: kind === "listing" ? "none" : steps,
  caption,
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

const gate = "predict-signed-quotient";
const failureGate = "predict-unsigned-remainder";
const cases = [
  [-17, 5],
  [17, 5],
  [17, -5],
  [-17, -5],
  [0, 5],
  [2147483647, 7],
  [-2147483648, 7],
] as const;
const consumptionCases = [
  [600, 1000],
  [4294967295, 100],
  [4294967295, 1],
  [0, 1],
  [600, 0],
  [1, 3],
  [4294967295, 4294967295],
] as const;
export const divisionAndRemainders: LessonInput = {
  id: "division-and-remainders",
  title: L.title,
  module: 8,
  order: 1,
  objectives: [...L.objectives],
  introduces: ["dividend", "divisor", "quotient"],
  sections: [
    {
      kind: "question",
      title: L.titles.question,
      prose: P.question,
      details: { summary: P.questionNoteSummary, prose: P.questionNote },
      interactives: [listing("signed-division-listing", L.captions.listing, R.QUOTIENT_SIGNED)],
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
          R.QUOTIENT_SIGNED,
          "quotient_signed",
          [-17, 5],
          "w0",
          P.predictionQuestion,
          L.options.prediction,
          P.predictionExplain,
        ),
        step(
          "step-signed-quotient",
          L.captions.step,
          R.QUOTIENT_SIGNED,
          "quotient_signed",
          [-17, 5],
          ["w0", "w1"],
          gate,
        ),
      ],
    },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        step(
          "step-signed-remainder",
          L.captions.investigation,
          R.REMAINDER_SIGNED,
          "remainder_signed",
          [-17, 5],
          ["w0", "w1", "w2"],
          gate,
        ),
        figure("division-parts-diagram", "division-parts", L.captions.divisionParts, {
          program: R.REMAINDER_SIGNED,
          call: call("remainder_signed", [-17, 5]),
          after: gate,
        }),
        step(
          "step-unsigned-quotient",
          L.captions.quotientUnsigned,
          R.QUOTIENT_UNSIGNED,
          "quotient_unsigned",
          [17, 5],
          ["w0", "w1"],
          gate,
        ),
      ],
    },
    {
      kind: "construction",
      title: L.titles.construction,
      prose: P.construction,
      interactives: [challengeFigure("write-remainder", L.captions.write)],
    },
    {
      kind: "failureExperiment",
      title: L.titles.failureExperiment,
      prose: P.failureExperiment,
      interactives: [
        prediction(
          failureGate,
          L.captions.predictFailure,
          R.WRONG_REMAINDER,
          "wrong_remainder",
          [-17, 5],
          "w0",
          P.failureQuestion,
          L.options.failure,
          P.failureExplain,
        ),
        step(
          "step-unsigned-remainder",
          L.captions.failureStep,
          R.WRONG_REMAINDER,
          "wrong_remainder",
          [-17, 5],
          ["w0", "w1", "w2"],
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
          "step-division-zero",
          L.captions.edgesZero,
          R.DIVIDE_EDGES,
          "divide_edges",
          [17, 0],
          ["w0", "w1", "w2", "w3"],
          gate,
        ),
        step(
          "step-division-overflow",
          L.captions.edgesOverflow,
          R.DIVIDE_EDGES,
          "divide_edges",
          [-2147483648, -1],
          ["w0", "w1", "w2", "w3"],
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
          "step-divide-ten",
          L.captions.constant,
          R.GROUPS_OF_TEN,
          "groups_of_ten",
          [12345],
          ["w0", "w1", "x0"],
          gate,
        ),
      ],
    },
    {
      kind: "challenge",
      title: L.titles.challenge,
      prose: "",
      interactives: [challengeFigure("write-consumption", L.captions.final)],
    },
    {
      kind: "reflection",
      title: L.titles.reflection,
      prose: P.reflection,
      details: { summary: P.reflectionNoteSummary, prose: P.reflectionNote },
    },
  ],
  challenges: [
    {
      id: "write-remainder",
      title: L.challenges.write.title,
      task: P.writeTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "w2", "w3"],
      allowedConstructs: ["sdiv", "udiv", "msub", "mul", "sub", "ret"],
      initial: {
        text: "sdiv w0, w0, w1\nret",
        data: { editor: { registers: ["w0", "w1", "w2", "w3"], symbols: [",", "w"] } },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: cases.map(([w0, w1], i) => ({
          label: L.challenges.write.tests[i]!,
          given: { w0, w1 },
          expect: { w0: Number(BigInt(w0) % BigInt(w1)) },
        })),
      },
      hints: [...P.writeHints],
      reference: { text: R.REMAINDER_TEXT },
    },
    {
      id: "write-consumption",
      title: L.challenges.final.title,
      task: P.finalTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "w2", "x0", "x1", "x2"],
      allowedConstructs: ["cbz", "mov", "mul", "umull", "udiv", "ret"],
      initial: {
        text: "ret",
        data: {
          editor: {
            registers: ["w0", "w1", "w2", "x0", "x1", "x2"],
            symbols: [",", "#", ":", "w", "x"],
            labels: ["zero"],
          },
        },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: consumptionCases.map(([w0, w1], i) => {
          const given: Record<string, string | number> = { w0, reading: "unsigned" };
          // Only the low 32 bits of the second argument are specified by this function.
          given[i === 0 ? "x1" : "w1"] = i === 0 ? String((1n << 32n) + BigInt(w1)) : w1;
          return {
            label: L.challenges.final.tests[i]!,
            given,
            expect: { x0: w1 === 0 ? "0" : String((BigInt(w0) * 100n) / BigInt(w1)) },
          };
        }),
      },
      hints: [...P.finalHints],
      reference: { text: R.CONSUMPTION_TEXT },
    },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
