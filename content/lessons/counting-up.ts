// Copyright © 2026 Christopher Snow

// The lesson's structure and executable cases. Prose is drafted separately; every figure runs
// a recorded program, and the final answer challenge derives its results from that program.
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./counting-up.labels";
import { PROSE } from "./counting-up.prose";
import { DIM_UP, DIM_UP_BEQ, DIM_UP_STARTING_TEXT, DIM_UP_TEXT } from "./loops.listings";

const STEPS = "steps";
const CALL = { entry: "dim_up", args: [128, 2, 5] } as const;
const WRITE_CASES = [
  { args: [128, 2, 5], result: 16 },
  { args: [128, 5, 5], result: 128 },
  { args: [128, 5, 2], result: 128 },
  { args: [128, 0, 1], result: 64 },
  { args: [0xffffffff, 0, 31], result: 1 },
  { args: [128, 0xfffffffc, 0xffffffff], result: 16 },
  { args: [128, 0x7ffffffe, 0x80000001], result: 16 },
] as const;
const FIELDS = [
  ["resultZero", 7, "w0"],
  ["stepsZero", 7, "steps"],
  ["resultOne", 8, "w0"],
  ["stepsOne", 8, "steps"],
  ["resultTwo", 9, "w0"],
  ["stepsTwo", 9, "steps"],
] as const;

export const countingUp: LessonInput = {
  id: "counting-up",
  title: LABELS.title,
  module: 5,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: ["loop", "iteration"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "dim-up-listing",
          kind: "listing",
          timeModel: STEPS,
          caption: LABELS.captions.listing,
          props: { program: DIM_UP },
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
          id: "predict-dim-up-count",
          kind: "count-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predict,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.prediction,
            explain: PROSE.predictionExplain,
            program: DIM_UP,
            call: CALL,
            inputs: [0, 1, 2],
          },
        },
        {
          id: "step-dim-up",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.step,
          props: {
            program: DIM_UP,
            call: CALL,
            registers: [0, 1, 2],
            flags: true,
            count: true,
            branchStatus: true,
            after: "predict-dim-up-count",
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
          id: "dim-up-runs",
          kind: "loop-runs",
          timeModel: STEPS,
          caption: LABELS.captions.runs,
          props: {
            program: DIM_UP,
            bodyLabel: ".L3",
            after: "predict-dim-up-count",
            runs: LABELS.runs.map((label, i) => ({
              label,
              call: {
                entry: "dim_up",
                args: [
                  [128, 2, 5],
                  [128, 5, 5],
                  [128, 5, 2],
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
          id: "write-dim-up",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.write,
          props: { challengeId: "write-dim-up" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-dim-up-beq",
          kind: "run-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictFailure,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.failure,
            explain: PROSE.failureExplain,
            program: DIM_UP_BEQ,
            call: CALL,
            inputs: [0, 1, 2],
            measure: { kind: "register", register: 0, as: "decimal" },
          },
        },
        {
          id: "dim-up-beq-runs",
          kind: "loop-runs",
          timeModel: STEPS,
          caption: LABELS.captions.failureRuns,
          props: {
            program: DIM_UP_BEQ,
            bodyLabel: ".L3",
            after: "predict-dim-up-beq",
            runs: [{ label: LABELS.runs[0], call: CALL }],
          },
        },
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    { kind: "generalisation", title: LABELS.titles.generalisation, prose: PROSE.generalisation },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "count-dim-up-runs",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.final,
          props: { challengeId: "count-dim-up-runs" },
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
      id: "write-dim-up",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "w2"],
      allowedConstructs: ["cmp", "b.cond", "b", "lsr", "add", "ret"],
      initial: {
        text: DIM_UP_STARTING_TEXT,
        data: {
          editor: {
            symbols: [",", "#", ".", ":", "w"],
            registers: ["w0", "w1", "w2"],
            labels: ["again", "done"],
          },
        },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: WRITE_CASES.map((c, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: { w0: c.args[0], w1: c.args[1], w2: c.args[2], reading: "unsigned" },
          expect: { w0: c.result },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: DIM_UP_TEXT },
    },
    {
      id: "count-dim-up-runs",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "answer",
      fields: FIELDS.map(([id]) => ({
        id,
        label: LABELS.challenges.final.fields[id],
        kind: "number" as const,
      })),
      initial: {
        data: {
          program: DIM_UP,
          editor: {
            groups: LABELS.challenges.final.groups.map((label, i) => ({
              label,
              fields: FIELDS.slice(i * 2, i * 2 + 2).map(([id]) => ({
                id,
                label: LABELS.challenges.final.fields[id],
              })),
            })),
          },
        },
      },
      tests: {
        kind: "answers",
        grader: "branch-outcomes",
        cases: FIELDS.map(([id, end, what]) => ({
          label: LABELS.challenges.final.fields[id].replaceAll("`", ""),
          given: {
            entry: "dim_up",
            w0: 128,
            w1: 7,
            w2: end,
            ...(what === "steps" ? { [`feedback.${id}`]: PROSE.finalFeedback } : {}),
          },
          expect: { [id]: what },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: {
        answers: {
          resultZero: "128",
          stepsZero: "3",
          resultOne: "64",
          stepsOne: "7",
          resultTwo: "32",
          stepsTwo: "11",
        },
      },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
