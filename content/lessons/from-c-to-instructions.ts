// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./from-c-to-instructions.labels";
import { PROSE as P } from "./from-c-to-instructions.prose";
import * as C from "./c-compiler.listings";
const prediction = (
  id: string,
  program: { c: string; listing: string },
  entry: string,
  args: number[],
  failure = false,
) => ({
  id,
  kind: "trace-prediction",
  role: "prediction",
  timeModel: "steps",
  caption: failure ? L.captions.predictFailure : L.captions.predict,
  props: {
    program,
    call: { entry, args },
    question: failure ? P.failureQuestion : P.predictionQuestion,
    options: failure ? L.options.failure : L.options.prediction,
    explain: failure ? P.failureExplain : P.predictionExplain,
    measure: { kind: "register-at-end", register: 0 },
  },
});
const playground = (
  id: string,
  source: string,
  args: number[],
  after: string,
  failure = false,
) => ({
  id,
  kind: "compiler-playground",
  timeModel: "steps",
  caption: failure ? L.captions.failure : L.captions.playground,
  props: { source, args, after, names: NAMES, signature: SIGNATURE },
});
const mount = (id: string, caption: string) => ({
  id,
  kind: "challenge",
  role: "exercise",
  timeModel: "steps",
  caption,
  props: { challengeId: id },
});
const assemblyEditor = {
  registers: ["w0", "w1", "w2", "w3"],
  labels: ["loop", "done"],
  symbols: [",", "#", ":", "."],
};
const NAMES = ["distance", "rate", "charge", "total"],
  SIGNATURE = "unsigned trip_charge(unsigned distance, unsigned rate)";
const assemblyCases = [
    [6, 4, 31],
    [0, 9, 7],
    [1, 1, 8],
    [4294967295, 1, 6],
    [65536, 65536, 7],
  ],
  cCases = [
    [6, 4, 20, 20],
    [6, 4, 30, 24],
    [0, 99, 10, 0],
    [4294967295, 2, 100, 100],
    [2147483648, 2, 100, 0],
  ];
const tests = (rows: number[][], labels: readonly string[]) =>
  rows.map((row, i) => ({
    label: labels[i]!,
    given: {
      ...Object.fromEntries(row.slice(0, -1).map((v, j) => [`w${j}`, v])),
      reading: "unsigned",
    },
    expect: { w0: row.at(-1)! },
  }));
export const fromCToInstructions: LessonInput = {
  id: "from-c-to-instructions",
  title: L.title,
  module: 10,
  order: 0,
  objectives: [...L.objectives],
  introduces: [],
  sections: [
    {
      kind: "question",
      title: L.titles.question,
      prose: P.question,
      details: { summary: P.questionNoteSummary, prose: P.questionNote },
      interactives: [
        {
          id: "from-c-to-instructions-listing",
          kind: "listing",
          role: "diagram",
          timeModel: "none",
          caption: L.captions.listing,
          props: { program: C.TRIP },
        },
      ],
    },
    { kind: "motivation", title: L.titles.motivation, prose: P.motivation },
    {
      kind: "prediction",
      title: L.titles.prediction,
      prose: P.prediction,
      interactives: [prediction("predict-from-c-to-instructions", C.TRIP, "trip_charge", [6, 4])],
    },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        playground(
          "play-from-c-to-instructions",
          C.TRIP_SOURCE,
          [6, 4],
          "predict-from-c-to-instructions",
        ),
      ],
    },
    {
      kind: "construction",
      title: L.titles.construction,
      prose: P.construction,
      interactives: [mount("write-trip-charge", L.captions.write)],
    },
    {
      kind: "failureExperiment",
      title: L.titles.failureExperiment,
      prose: P.failureExperiment,
      interactives: [
        prediction(
          "predict-from-c-to-instructions-wrong",
          C.WRONG_TRIP,
          "trip_charge",
          [6, 4],
          true,
        ),
        playground(
          "play-from-c-to-instructions-wrong",
          C.WRONG_TRIP_SOURCE,
          [6, 4],
          "predict-from-c-to-instructions-wrong",
          true,
        ),
      ],
    },
    { kind: "explanation", title: L.titles.explanation, prose: P.explanation },
    { kind: "generalisation", title: L.titles.generalisation, prose: P.generalisation },
    {
      kind: "challenge",
      title: L.titles.challenge,
      prose: "",
      interactives: [mount("write-cap-charge", L.captions.final)],
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
      id: "write-trip-charge",
      title: L.challenges.write.title,
      task: P.writeTask,
      gradedDirection: "write",
      palette: assemblyEditor.registers,
      allowedConstructs: ["mov", "mul", "add", "sub", "subs", "cbz", "b", "b.cond", "ret"],
      initial: { text: "ret", data: { editor: assemblyEditor } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: tests(assemblyCases, L.challenges.write.tests),
      },
      hints: [...P.writeHints],
      reference: { text: C.TRIP_ASSEMBLY },
    },
    {
      id: "write-cap-charge",
      title: L.challenges.final.title,
      task: P.finalTask,
      gradedDirection: "write",
      palette: [],
      allowedConstructs: ["unsigned", "return", "if", "while", "for"],
      initial: {
        text: C.CAP_START,
        data: {
          cEditor: {
            signature: "unsigned cap_charge(unsigned distance, unsigned rate, unsigned limit)",
            names: ["distance", "rate", "limit", "charge"],
          },
        },
      },
      tests: { kind: "answers", grader: "run-c", cases: tests(cCases, L.challenges.final.tests) },
      hints: [...P.finalHints],
      reference: { text: C.CAP_SOURCE },
    },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
