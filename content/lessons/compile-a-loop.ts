// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./compile-a-loop.labels";
import { PROSE as P } from "./compile-a-loop.prose";
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
  timeModel: "steps",
  caption,
  props: { challengeId: id },
});
const assemblyEditor = {
  registers: ["w0", "w1", "w2", "w3"],
  labels: ["loop", "done"],
  symbols: [",", "#", ":", "."],
};
const NAMES = ["count", "rate", "total", "i"],
  SIGNATURE = "unsigned accumulated_charge(unsigned count, unsigned rate)";
const assemblyCases = [
    [0, 7, 0],
    [1, 9, 9],
    [3, 4, 12],
    [5, 4294967295, 4294967291],
    [4, 0, 0],
  ],
  cCases = [
    [128, 3, 16],
    [128, 0, 128],
    [0, 5, 0],
    [4294967295, 32, 0],
    [2147483648, 1, 1073741824],
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
export const compileALoop: LessonInput = {
  id: "compile-a-loop",
  title: L.title,
  module: 10,
  order: 1,
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
          id: "compile-a-loop-listing",
          kind: "listing",
          timeModel: "none",
          caption: L.captions.listing,
          props: { program: C.ACCUMULATED },
        },
      ],
    },
    { kind: "motivation", title: L.titles.motivation, prose: P.motivation },
    {
      kind: "prediction",
      title: L.titles.prediction,
      prose: P.prediction,
      interactives: [
        prediction("predict-compile-a-loop", C.ACCUMULATED, "accumulated_charge", [3, 4]),
      ],
    },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        playground("play-compile-a-loop", C.ACCUMULATED_SOURCE, [3, 4], "predict-compile-a-loop"),
      ],
    },
    {
      kind: "construction",
      title: L.titles.construction,
      prose: P.construction,
      interactives: [mount("write-accumulated-charge", L.captions.write)],
    },
    {
      kind: "failureExperiment",
      title: L.titles.failureExperiment,
      prose: P.failureExperiment,
      interactives: [
        prediction(
          "predict-compile-a-loop-wrong",
          C.WRONG_ACCUMULATED,
          "accumulated_charge",
          [3, 4],
          true,
        ),
        playground(
          "play-compile-a-loop-wrong",
          C.WRONG_ACCUMULATED_SOURCE,
          [3, 4],
          "predict-compile-a-loop-wrong",
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
      interactives: [mount("write-c-dimming", L.captions.final)],
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
      id: "write-accumulated-charge",
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
      reference: { text: C.ACCUMULATED_ASSEMBLY },
    },
    {
      id: "write-c-dimming",
      title: L.challenges.final.title,
      task: P.finalTask,
      gradedDirection: "write",
      palette: [],
      allowedConstructs: ["unsigned", "return", "if", "while", "for"],
      initial: {
        text: C.DIM_START,
        data: {
          cEditor: {
            signature: "unsigned course_while(unsigned value, unsigned count)",
            names: ["value", "count", "total", "i"],
          },
        },
      },
      tests: { kind: "answers", grader: "run-c", cases: tests(cCases, L.challenges.final.tests) },
      hints: [...P.finalHints],
      reference: { text: C.DIM_SOURCE },
    },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
