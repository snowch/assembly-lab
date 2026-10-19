// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./zero-terminated-strings.labels";
import { PROSE as P } from "./zero-terminated-strings.prose";
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
    memory: { address: A.LOG_ADDRESS, length: bytes.length },
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

const lengthCases = [
  { bytes: [...A.LABEL_BYTES], capacity: 8, expected: 5 },
  { bytes: [0, 88], capacity: 2, expected: 0 },
  { bytes: [65], capacity: 0, expected: 0 },
  { bytes: [65, 66, 67], capacity: 3, expected: 3 },
  { bytes: [65, 0, 66, 67], capacity: 4, expected: 1 },
];
const markerCases = [
  { bytes: [...A.LABEL_BYTES], marker: 45, expected: 2 },
  { bytes: [0, 45], marker: 45, expected: 0 },
  { bytes: [65, 0, 45], marker: 45, expected: 0 },
  { bytes: [45, 45, 45, 0], marker: 45, expected: 3 },
  { bytes: [48, 45, 48, 0], marker: 48, expected: 2 },
];
export const zeroTerminatedStrings: LessonInput = {
  id: "zero-terminated-strings",
  title: L.title,
  module: 7,
  order: 1,
  objectives: [...L.objectives],
  introduces: ["string", "terminator"],
  sections: [
    {
      kind: "question",
      title: L.titles.question,
      prose: P.question,
      details: { summary: P.questionNoteSummary, prose: P.questionNote },
      interactives: [
        {
          id: "label-length-listing",
          kind: "listing",
          role: "diagram",
          timeModel: "none",
          caption: L.captions.listing,
          props: { program: A.LABEL_LENGTH },
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
          "predict-label-length",
          A.LABEL_LENGTH,
          "label_length",
          [pointer, { value: 8, width: 64 }],
          A.LABEL_BYTES,
          false,
          "x0",
        ),
        step(
          "step-label-length",
          A.LABEL_LENGTH,
          "label_length",
          [pointer, { value: 8, width: 64 }],
          A.LABEL_BYTES,
          ["x0", "x1", "x3", "w2"],
          L.captions.step,
          "predict-label-length",
        ),
      ],
    },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        step(
          "step-walk-label",
          A.WALK_LABEL,
          "walk_label",
          [pointer],
          A.LABEL_BYTES,
          ["x2", "w0", "w3"],
          L.captions.walk,
          "predict-label-length",
        ),
        step(
          "step-empty-label",
          A.WALK_LABEL,
          "walk_label",
          [pointer],
          [0, 88],
          ["x2", "w0", "w3"],
          L.captions.empty,
          "predict-label-length",
        ),
      ],
    },
    {
      kind: "construction",
      title: L.titles.construction,
      prose: P.construction,
      interactives: [mount("write-label-length", L.captions.write)],
    },
    {
      kind: "failureExperiment",
      title: L.titles.failureExperiment,
      prose: P.failureExperiment,
      interactives: [
        prediction(
          "predict-wrong-terminator",
          A.WRONG_TERMINATOR,
          "wrong_terminator",
          [pointer],
          A.LABEL_BYTES,
          true,
        ),
        step(
          "step-wrong-terminator",
          A.WRONG_TERMINATOR,
          "wrong_terminator",
          [pointer],
          A.LABEL_BYTES,
          ["x2", "w0", "w3"],
          L.captions.failureStep,
          "predict-wrong-terminator",
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
          "step-bounded-label",
          A.LABEL_LENGTH,
          "label_length",
          [pointer, { value: 3, width: 64 }],
          [65, 66, 67],
          ["x0", "x1", "x3", "w2"],
          L.captions.bounded,
          "predict-label-length",
        ),
      ],
    },
    {
      kind: "challenge",
      title: L.titles.challenge,
      prose: "",
      interactives: [mount("write-count-marker", L.captions.final)],
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
      id: "write-label-length",
      title: L.challenges.write.title,
      task: P.writeTask,
      gradedDirection: "write",
      palette: editor.registers,
      allowedConstructs: ["mov", "cbz", "ldrb", "add", "cmp", "b.cond", "b", "ret"],
      initial: { text: "ret", data: { editor } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: lengthCases.map(({ bytes, capacity, expected }, i) => ({
          label: L.challenges.write.tests[i]!,
          given: { x0: A.LOG_ADDRESS, x1: capacity, reading: "unsigned", memory: bytes.join(",") },
          expect: { x0: expected, memory: bytes.join(",") },
        })),
      },
      hints: [...P.writeHints],
      reference: { text: A.LENGTH_TEXT },
    },
    {
      id: "write-count-marker",
      title: L.challenges.final.title,
      task: P.finalTask,
      gradedDirection: "write",
      palette: editor.registers,
      allowedConstructs: ["mov", "ldrb", "cbz", "cmp", "b.cond", "add", "b", "ret"],
      initial: { text: "ret", data: { editor } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: markerCases.map(({ bytes, marker, expected }, i) => ({
          label: L.challenges.final.tests[i]!,
          given: { x0: A.LOG_ADDRESS, w1: marker, reading: "unsigned", memory: bytes.join(",") },
          expect: { w0: expected, memory: bytes.join(",") },
        })),
      },
      hints: [...P.finalHints],
      reference: { text: A.COUNT_MARKER_TEXT },
    },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
