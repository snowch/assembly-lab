// Copyright © 2026 Christopher Snow

// Count down with subs, contrast the missing first test with an always-true test, then bound
// useful work by stopping once the brightness is zero. All runs are measured by the model.
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./counting-down.labels";
import { PROSE } from "./counting-down.prose";
import {
  DIM_DOWN,
  DIM_DO,
  DIM_DOWN_WRONG,
  DIM_WRONG_GCC,
  DIM_DOWN_STARTING_TEXT,
  DIM_DOWN_TEXT,
  DIM_UNTIL_DARK_STARTING_TEXT,
  DIM_UNTIL_DARK_TEXT,
} from "./loops.listings";

const STEPS = "steps";
const CALL = { entry: "dim_down", args: [128, 3] } as const;
const DO_ZERO = { entry: "dim_do", args: [128, 0], maxSteps: 20 } as const;
const WRITE_CASES = [
  { args: [128, 0], result: 128 },
  { args: [128, 1], result: 64 },
  { args: [128, 3], result: 16 },
  { args: [0, 3], result: 0 },
  { args: [0xffffffff, 31], result: 1 },
  { args: [0xffffffff, 32], result: 0 },
] as const;
const FINAL_CASES = [
  { args: [128, 0], result: 128 },
  { args: [128, 3], result: 16 },
  { args: [0, 0xffffffff], result: 0 },
  { args: [1, 0xffffffff], result: 0 },
  { args: [0xffffffff, 0xffffffff], result: 0 },
  { args: [0xffffffff, 31], result: 1 },
] as const;
const EDITOR = {
  symbols: [",", "#", ".", ":", "w"],
  registers: ["w0", "w1"],
  labels: ["again", "done"],
} as const;
const ALLOWED = ["cbz", "cbnz", "subs", "b.cond", "b", "lsr", "ret"];

export const countingDown: LessonInput = {
  id: "counting-down",
  title: LABELS.title,
  module: 5,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: [],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "dim-down-listing",
          kind: "listing",
          timeModel: STEPS,
          caption: LABELS.captions.listing,
          props: { program: DIM_DOWN },
        },
      ],
    },
    { kind: "motivation", title: LABELS.titles.motivation, prose: PROSE.motivation },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.prediction,
      interactives: [
        {
          id: "predict-dim-down-body",
          kind: "loop-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predict,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.prediction,
            explain: PROSE.predictionExplain,
            program: DIM_DOWN,
            call: CALL,
            inputs: [0, 1],
            measure: "body-visits",
            bodyLabel: ".L3",
          },
        },
        {
          id: "step-dim-down",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.step,
          props: {
            program: DIM_DOWN,
            call: CALL,
            registers: [0, 1],
            flags: true,
            count: true,
            branchStatus: true,
            after: "predict-dim-down-body",
          },
        },
      ],
    },
    {
      kind: "investigation",
      title: LABELS.titles.investigation,
      prose: PROSE.investigation,
      interactives: [
        {
          id: "dim-down-runs",
          kind: "loop-runs",
          timeModel: STEPS,
          caption: LABELS.captions.runs,
          props: {
            program: DIM_DOWN,
            bodyLabel: ".L3",
            after: "predict-dim-down-body",
            runs: LABELS.runs.map((label, i) => ({
              label,
              call: {
                entry: "dim_down",
                args: [
                  [128, 0],
                  [128, 1],
                  [128, 3],
                ][i],
              },
            })),
          },
        },
      ],
    },
    {
      kind: "construction",
      title: LABELS.titles.construction,
      prose: PROSE.construction,
      interactives: [
        {
          id: "write-dim-down",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.write,
          props: { challengeId: "write-dim-down" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-dim-do-zero",
          kind: "loop-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictFailure,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.failure,
            explain: PROSE.failureExplain,
            program: DIM_DO,
            call: DO_ZERO,
            inputs: [0, 1],
            measure: "stop",
          },
        },
        {
          id: "step-dim-do-zero",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepDoZero,
          props: {
            program: DIM_DO,
            call: DO_ZERO,
            registers: [0, 1],
            flags: true,
            count: true,
            branchStatus: true,
            after: "predict-dim-do-zero",
          },
        },
        {
          id: "dim-do-runs",
          kind: "loop-runs",
          timeModel: STEPS,
          caption: LABELS.captions.failureRuns,
          props: {
            program: DIM_DO,
            bodyLabel: ".L2",
            after: "predict-dim-do-zero",
            runs: [{ label: LABELS.doRun, call: DO_ZERO }],
          },
        },
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    {
      kind: "generalisation",
      title: LABELS.titles.generalisation,
      prose: PROSE.generalisation + "\n\n" + PROSE.wrongComparison,
      details: { summary: PROSE.generalisationNoteSummary, prose: PROSE.generalisationNote },
      interactives: [
        {
          id: "dim-wrong-listing",
          kind: "listing",
          timeModel: STEPS,
          caption: LABELS.captions.wrongCompiler,
          props: { program: DIM_WRONG_GCC },
        },
        {
          id: "step-dim-down-wrong",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepWrong,
          props: {
            program: DIM_DOWN_WRONG,
            call: { entry: "dim_down_wrong", args: [128, 3], maxSteps: 20 },
            registers: [0, 1],
            flags: true,
            count: true,
            branchStatus: true,
            after: "predict-dim-do-zero",
          },
        },
        {
          id: "dim-down-wrong-runs",
          kind: "loop-runs",
          timeModel: STEPS,
          caption: LABELS.captions.wrong,
          props: {
            program: DIM_DOWN_WRONG,
            bodyLabel: ".Lloop",
            after: "predict-dim-do-zero",
            runs: [
              {
                label: LABELS.wrongRun,
                call: { entry: "dim_down_wrong", args: [128, 3], maxSteps: 20 },
              },
            ],
          },
        },
      ],
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "write-dim-until-dark",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.final,
          props: { challengeId: "write-dim-until-dark" },
        },
      ],
    },
    {
      kind: "reflection",
      title: LABELS.titles.reflection,
      prose: PROSE.reflection,
      details: { summary: PROSE.reflectionNoteSummary, prose: PROSE.reflectionNote },
    },
  ],
  challenges: [
    {
      id: "write-dim-down",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: ["w0", "w1"],
      allowedConstructs: [...ALLOWED],
      initial: { text: DIM_DOWN_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: WRITE_CASES.map((c, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: { w0: c.args[0], w1: c.args[1], reading: "unsigned" },
          expect: { w0: c.result },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: DIM_DOWN_TEXT },
    },
    {
      id: "write-dim-until-dark",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: ["w0", "w1"],
      allowedConstructs: [...ALLOWED],
      initial: { text: DIM_UNTIL_DARK_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: FINAL_CASES.map((c, i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: { w0: c.args[0], w1: c.args[1], reading: "unsigned" },
          expect: { w0: c.result },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: DIM_UNTIL_DARK_TEXT },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
