// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./array-addresses.labels";
import { PROSE as P } from "./array-addresses.prose";
import * as A from "./arrays.listings";
const pointer = { value: A.LOG_ADDRESS, width: 64 } as const;
const editor = {
  labels: ["loop", "next", "done"],
  symbols: [",", "#", "[", "]", "!", ":", "w", "x"],
  registers: ["x0", "x1", "x2", "x3", "w0", "w1", "w2", "w3"],
  addresses: ["[x0, x1, lsl #2]", "[x2]", "[x2], #4", "[x3, x0]", "[x2], #1"],
};
const prediction = (
  id: string,
  program: { c: string; listing: string },
  entry: string,
  args: readonly unknown[],
  memory: readonly number[],
  failure = false,
  register = "w0",
) => ({
  id,
  kind: "memory-prediction",
  role: "prediction",
  timeModel: "steps",
  caption: failure ? L.captions.predictFailure : L.captions.predict,
  props: {
    program,
    call: { entry, args, memory },
    question: failure ? P.failureQuestion : P.predictionQuestion,
    options: failure ? L.options.failure : L.options.prediction,
    explain: failure ? P.failureExplain : P.predictionExplain,
    measure: { kind: "register-at-end", register },
  },
});
const step = (
  id: string,
  program: { c: string; listing: string },
  entry: string,
  args: readonly unknown[],
  bytes: readonly number[],
  registers: string[],
  caption: string,
  after: string,
) => ({
  id,
  kind: "memory-stepper",
  timeModel: "steps",
  caption,
  props: {
    program,
    call: { entry, args, memory: bytes },
    registers,
    memory: { address: A.LOG_ADDRESS, length: bytes.length, elementBytes: 4 },
    after,
  },
});
const mount = (id: string, caption: string) => ({
  id,
  kind: "challenge",
  role: "exercise",
  timeModel: "steps",
  caption,
  props: { challengeId: id },
});

const readCases = [
  { values: [12, 25, 7, 40], index: 0 },
  { values: [12, 25, 7, 40], index: 2 },
  { values: [12, 25, 7, 40], index: 3 },
  { values: [0, 0xffffffff, 0x80000000], index: 1 },
  { values: [0, 0, 0], index: 2 },
];
const sumCases = [
  { values: [12, 25, 7, 40], count: 0 },
  { values: [12, 25, 7, 40], count: 1 },
  { values: [12, 25, 7, 40], count: 3 },
  { values: [12, 25, 7, 40], count: 4 },
  { values: [0xffffffff, 2], count: 2 },
];
export const arrayAddresses: LessonInput = {
  id: "array-addresses",
  title: L.title,
  module: 7,
  order: 0,
  objectives: [...L.objectives],
  introduces: ["array", "element", "index", "pre-index", "post-index"],
  sections: [
    {
      kind: "question",
      title: L.titles.question,
      prose: P.question,
      details: { summary: P.questionNoteSummary, prose: P.questionNote },
      interactives: [
        {
          id: "read-trip-listing",
          kind: "listing",
          role: "diagram",
          timeModel: "none",
          caption: L.captions.listing,
          props: { program: A.READ_TRIP },
        },
      ],
    },
    { kind: "motivation", title: L.titles.motivation, prose: P.motivation },
    {
      kind: "prediction",
      title: L.titles.prediction,
      prose: P.prediction,
      interactives: [
        prediction(
          "predict-read-trip",
          A.READ_TRIP,
          "read_trip",
          [pointer, { value: 2, width: 64 }],
          A.TRIP_BYTES,
        ),
        step(
          "step-read-trip",
          A.READ_TRIP,
          "read_trip",
          [pointer, { value: 2, width: 64 }],
          A.TRIP_BYTES,
          ["x0", "x1", "w0"],
          L.captions.step,
          "predict-read-trip",
        ),
      ],
    },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        step(
          "step-array-offset",
          A.OFFSET,
          "offset",
          [pointer],
          A.TRIP_BYTES,
          ["x0", "w2"],
          L.captions.offset,
          "predict-read-trip",
        ),
        step(
          "step-array-pre-index",
          A.PRE_INDEX,
          "pre_index",
          [pointer],
          A.TRIP_BYTES,
          ["x0", "w2"],
          L.captions.preIndex,
          "predict-read-trip",
        ),
        step(
          "step-array-post-index",
          A.POST_INDEX,
          "post_index",
          [pointer],
          A.TRIP_BYTES,
          ["x0", "w2"],
          L.captions.postIndex,
          "predict-read-trip",
        ),
      ],
    },
    {
      kind: "construction",
      title: L.titles.construction,
      prose: P.construction,
      interactives: [mount("write-read-trip", L.captions.write)],
    },
    {
      kind: "failureExperiment",
      title: L.titles.failureExperiment,
      prose: P.failureExperiment,
      interactives: [
        prediction(
          "predict-wrong-scale",
          A.WRONG_SCALE,
          "wrong_scale",
          [pointer, { value: 2, width: 64 }],
          A.TRIP_BYTES,
          true,
        ),
        step(
          "step-wrong-scale",
          A.WRONG_SCALE,
          "wrong_scale",
          [pointer, { value: 2, width: 64 }],
          A.TRIP_BYTES,
          ["x0", "x1", "w0"],
          L.captions.failureStep,
          "predict-wrong-scale",
        ),
      ],
    },
    { kind: "explanation", title: L.titles.explanation, prose: P.explanation },
    {
      kind: "generalisation",
      title: L.titles.generalisation,
      prose: P.generalisation,
      interactives: [
        step(
          "step-sum-trips",
          A.SUM_TRIPS,
          "sum_trips",
          [pointer, 3],
          A.TRIP_BYTES,
          ["x2", "x3", "w0", "w1"],
          L.captions.sum,
          "predict-read-trip",
        ),
      ],
    },
    {
      kind: "challenge",
      title: L.titles.challenge,
      prose: "",
      interactives: [mount("write-sum-trips", L.captions.final)],
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
      id: "write-read-trip",
      title: L.challenges.write.title,
      task: P.writeTask,
      gradedDirection: "write",
      palette: editor.registers,
      allowedConstructs: ["ldr", "ret"],
      initial: { text: "ret", data: { editor } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: readCases.map(({ values, index }, i) => ({
          label: L.challenges.write.tests[i]!,
          given: {
            x0: A.LOG_ADDRESS,
            x1: index,
            reading: "unsigned",
            memory: A.tripBytes(values).join(","),
          },
          expect: { w0: values[index]!, memory: A.tripBytes(values).join(",") },
        })),
      },
      hints: [...P.writeHints],
      reference: { text: A.READ_TRIP_TEXT },
    },
    {
      id: "write-sum-trips",
      title: L.challenges.final.title,
      task: P.finalTask,
      gradedDirection: "write",
      palette: editor.registers,
      allowedConstructs: ["mov", "cbz", "ldr", "add", "subs", "b.cond", "b", "cmp", "ret"],
      initial: { text: "ret", data: { editor } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: sumCases.map(({ values, count }, i) => ({
          label: L.challenges.final.tests[i]!,
          given: {
            x0: A.LOG_ADDRESS,
            w1: count,
            reading: "unsigned",
            memory: A.tripBytes(values).join(","),
          },
          expect: {
            w0: values.slice(0, count).reduce((a, b) => (a + b) >>> 0, 0),
            memory: A.tripBytes(values).join(","),
          },
        })),
      },
      hints: [...P.finalHints],
      reference: { text: A.SUM_TRIPS_TEXT },
    },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
