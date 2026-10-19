// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 4: Branches, and the run that skips. `describe` is the first listing whose run
// does not go straight down. The learner predicts how many instructions it runs for 15, steps
// through it with a sentence after each branch, follows each branch with an arrow to its label for
// four gradients (taken, not taken and not reached told apart, the path listed), writes
// `fuel_warning` with `cbz` and a conditional branch, predicts what `bge` for `bgt` does and sees
// the two conditions read off the same flags, and counts the runs of `describe` for three gradients.
//
// The structure is here; the words are in branches.prose.ts and .labels.ts (kept from
// docs/notes/module-4/prose.md), and the programs are in branches.listings.ts. The plan for the
// module is docs/notes/module-4-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import {
  DESCRIBE,
  DESCRIBE_BGE,
  FUEL_WARNING_STARTING_TEXT,
  FUEL_WARNING_TEXT,
  TOLD_GRADIENTS,
} from "./branches.listings";
import { COUNT_GROUPS, LABELS } from "./branches.labels";
import { PROSE } from "./branches.prose";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/grader.ts and grader-branch.ts). */
const RUN_REGISTERS = "run-registers";
const BRANCH_OUTCOMES = "branch-outcomes";

/** The run the prediction and the stepper start from: `describe(15)`. */
const FIFTEEN = { entry: "describe", args: [15] } as const;

/**
 * The editor's keys for `fuel_warning`: the characters a label and a number need, the two registers,
 * and the names of the labels the tap mode offers (each is a line that defines it, and a name a
 * branch can go to).
 */
const FUEL_WARNING_EDITOR = {
  symbols: [",", "#", ".", ":", "w"],
  registers: ["w0", "w1"],
  labels: [".Llow", ".Lok", ".Ldone", ".Lempty"],
} as const;

/** The five calls of `fuel_warning` (litres, reserve, result): one equal, one with the top bit set. */
const FUEL_WARNING_CASES = [
  { litres: 0, reserve: 10, result: 2 },
  { litres: 9, reserve: 10, result: 1 },
  { litres: 10, reserve: 10, result: 0 },
  { litres: 200, reserve: 10, result: 0 },
  { litres: 0x80000000, reserve: 10, result: 0 },
] as const;

/** The three gradients of the last challenge, as the `int` patterns `w0` takes. */
const GRADIENTS = {
  "11": 11,
  "-10": 0xfffffff6,
  "-11": 0xfffffff5,
} as const;

export const branches: LessonInput = {
  id: "branches",
  title: "Branches, and the run that skips",
  module: 4,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: ["branch", "taken", "wzr"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "describe-listing",
          kind: "listing",
          role: "diagram",
          timeModel: STEPS,
          caption: LABELS.captions.listing,
          props: { program: DESCRIBE },
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
          id: "predict-describe-count",
          kind: "count-prediction",
          role: "prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictCount,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.count,
            explain: PROSE.predictionExplain,
            program: DESCRIBE,
            call: FIFTEEN,
            inputs: [0],
          },
        },
        {
          id: "step-describe",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepCount,
          props: {
            program: DESCRIBE,
            call: FIFTEEN,
            registers: [0],
            flags: true,
            count: true,
            branchStatus: true,
            after: "predict-describe-count",
          },
        },
      ],
    },
    {
      kind: "investigation",
      title: LABELS.titles.investigation,
      prose: PROSE.investigation,
      details: { summary: PROSE.investigationNoteSummary, prose: PROSE.investigationNote },
      interactives: [
        {
          id: "describe-arrows",
          kind: "branch-listing",
          role: "experiment",
          timeModel: STEPS,
          caption: LABELS.captions.arrows,
          props: {
            program: DESCRIBE,
            entry: "describe",
            argument: "gradient",
            start: 15,
            presets: [...TOLD_GRADIENTS],
            // The last challenge asks for the runs of three other gradients, so the figure runs
            // only these four and never shows what the challenge asks for.
            choices: "presets",
            after: "predict-describe-count",
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
          id: "write-fuel-warning",
          kind: "challenge",
          role: "exercise",
          timeModel: STEPS,
          caption: LABELS.captions.fuelWarning,
          props: { challengeId: "write-fuel-warning" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-describe-bge",
          kind: "run-prediction",
          role: "prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictBge,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.bge,
            explain: PROSE.failureExplain,
            program: DESCRIBE_BGE,
            call: { entry: "describe", args: [10] },
            measure: { kind: "register", register: 0, as: "decimal" },
            inputs: [0],
          },
        },
        {
          id: "step-describe-bge",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepBge,
          props: {
            program: DESCRIBE_BGE,
            call: { entry: "describe", args: [10] },
            registers: [0],
            flags: true,
            count: true,
            branchStatus: true,
            // The flags the compare leaves, read by `gt` (GCC's) and by `ge` (this run's).
            panel: { kind: "two-conditions", conditions: ["gt", "ge"] },
            after: "predict-describe-bge",
          },
        },
      ],
    },
    {
      kind: "explanation",
      title: LABELS.titles.explanation,
      prose: PROSE.explanation,
      details: { summary: PROSE.explanationNoteSummary, prose: PROSE.explanationNote },
    },
    { kind: "generalisation", title: LABELS.titles.generalisation, prose: PROSE.generalisation },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "count-describe-runs",
          kind: "challenge",
          role: "exercise",
          timeModel: STEPS,
          caption: LABELS.captions.counts,
          props: { challengeId: "count-describe-runs" },
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
      id: "write-fuel-warning",
      title: LABELS.challenges.fuelWarning.title,
      task: PROSE.fuelWarningTask,
      gradedDirection: "write",
      // The registers the tap editor offers, and the instructions the lesson's assembler allows.
      palette: ["w0", "w1"],
      allowedConstructs: ["cmp", "b.cond", "cbz", "b", "mov", "ret"],
      initial: {
        text: FUEL_WARNING_STARTING_TEXT,
        data: {
          editor: FUEL_WARNING_EDITOR,
          // What the grader says for a failed call, chosen by what the run shows.
          feedback: { rule: "fuel-warning", sentences: { ...PROSE.fuelWarningFeedback } },
        },
      },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        cases: FUEL_WARNING_CASES.map((c, i) => ({
          label: LABELS.challenges.fuelWarning.tests[i] as string,
          given: { w0: c.litres, w1: c.reserve, reading: "unsigned" },
          expect: { w0: c.result },
        })),
      },
      hints: [...PROSE.fuelWarningHints],
      reference: { text: FUEL_WARNING_TEXT },
    },
    {
      id: "count-describe-runs",
      title: LABELS.challenges.counts.title,
      task: PROSE.countsTask,
      gradedDirection: "answer",
      fields: (
        [
          ["result11", "11"],
          ["steps11", "11"],
          ["resultM10", "-10"],
          ["stepsM10", "-10"],
          ["resultM11", "-11"],
          ["stepsM11", "-11"],
        ] as const
      ).map(([id]) => ({
        id,
        label: LABELS.challenges.counts.fields[id],
        kind: "number" as const,
      })),
      // The listing the editor shows above the fields. The expected values are what the run gives
      // and how many steps it takes, never numbers in this file.
      // The six boxes are drawn in three groups, one for each gradient, each box labelled as its
      // field is.
      initial: {
        data: {
          program: DESCRIBE,
          editor: {
            groups: COUNT_GROUPS.map((label, n) => ({
              label,
              fields: (
                [
                  ["result11", "steps11"],
                  ["resultM10", "stepsM10"],
                  ["resultM11", "stepsM11"],
                ] as const
              )[n]!.map((id) => ({ id, label: LABELS.challenges.counts.fields[id] })),
            })),
          },
        },
      },
      tests: {
        kind: "answers",
        grader: BRANCH_OUTCOMES,
        cases: (
          [
            ["result11", "11", "w0"],
            ["steps11", "11", "steps"],
            ["resultM10", "-10", "w0"],
            ["stepsM10", "-10", "steps"],
            ["resultM11", "-11", "w0"],
            ["stepsM11", "-11", "steps"],
          ] as const
        ).map(([id, gradient, what]) => ({
          label: LABELS.challenges.counts.fields[id].replaceAll("`", ""),
          // A wrong count is told where to look; a wrong result keeps the grader's own sentence.
          given: {
            entry: "describe",
            w0: GRADIENTS[gradient],
            ...(what === "steps" ? { [`feedback.${id}`]: PROSE.countsFeedback } : {}),
          },
          expect: { [id]: what },
        })),
      },
      hints: [...PROSE.countsHints],
      reference: {
        answers: {
          result11: "2",
          steps11: "5",
          resultM10: "0",
          stepsM10: "6",
          resultM11: "-2",
          stepsM11: "6",
        },
      },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      "The obvious example for branches is an if and else drawn as a flowchart, then a loop, with the smaller of two numbers or a grade from a score as the program.",
    howThisDiffers:
      "This lesson takes one compiled function, the trip computer's `describe`, whose run skips instructions, and draws the path it takes as an arrow from each branch to its label, taken or not taken for a gradient the learner chooses and greyed where the run did not go. The learner counts the instructions that run rather than tracing a flowchart, writes `fuel_warning` with the test for an empty tank before the test against the reserve, and sees one unsigned condition succeed where a signed one fails. GCC's own choice between a branch and `cset` or `csel` is shown for three of its functions and not explained.",
  },
};
