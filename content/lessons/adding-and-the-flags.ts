// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 2: Adding, and the four flags. The learner predicts which readings of an
// answer are right, watches an addition column by column with the carry into each column, predicts
// the four flags for three more additions, sees that `add` leaves the flags alone, and finds the
// smallest number that sets V.
//
// The structure is here; the words are in adding-and-the-flags.prose.ts and .labels.ts (kept from
// docs/notes/module-2/prose.md), and the programs are in adding-and-the-flags.listings.ts. The plan
// for the module is docs/notes/module-2-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import { LABELS } from "./adding-and-the-flags.labels";
import { PLUS, SUM_FLAGS } from "./adding-and-the-flags.listings";
import { PROSE } from "./adding-and-the-flags.prose";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/grader-arith.ts). */
const OUTCOMES_AT_RETURN = "outcomes-at-return";
const SMALLEST_SETTING_FLAG = "smallest-setting-flag";

/** The call every figure of the investigation runs: `0x7fffffff` plus 1. */
const PLUS_CALL = { entry: "plus", args: [0x7fffffff, 1] } as const;

/**
 * The call the figure after the flags challenge runs: 1 plus `0xffffffff`, which sets C and Z. It is
 * none of the challenge's three calls (its first is `0xffffffff` plus 1, the other way round).
 */
const CARRY_OUT_CALL = { entry: "plus", args: [1, 0xffffffff] } as const;

const FLAG_NAMES = ["N", "Z", "C", "V"] as const;

/** The additions the prediction challenge asks about, with the arguments each is run with. */
const ADDITIONS = [
  { ...LABELS.challenges.flags.additions[0], w0: 0xffffffff, w1: 1 },
  { ...LABELS.challenges.flags.additions[1], w0: 5, w1: 3 },
  { ...LABELS.challenges.flags.additions[2], w0: 0x80000000, w1: 0x80000000 },
] as const;

const ZERO_OR_ONE = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
];

export const addingAndTheFlags: LessonInput = {
  id: "adding-and-the-flags",
  title: "Adding, and the four flags",
  module: 2,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: ["carry", "flag", "overflow"],
  sections: [
    { kind: "question", title: LABELS.titles.question, prose: PROSE.question },
    { kind: "motivation", title: LABELS.titles.motivation, prose: PROSE.motivation },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.prediction,
      interactives: [
        {
          id: "predict-readings",
          kind: "run-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictReadings,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.readings,
            explain: PROSE.predictionExplain,
            program: PLUS,
            call: PLUS_CALL,
            measure: { kind: "readings" },
            inputs: [0, 1],
          },
        },
      ],
    },
    {
      kind: "investigation",
      title: LABELS.titles.investigation,
      prose: PROSE.investigation,
      details: {
        summary: PROSE.investigationDetailsSummary,
        prose: PROSE.investigationDetails,
      },
      interactives: [
        {
          id: "add-columns",
          kind: "adder",
          timeModel: STEPS,
          caption: LABELS.captions.adder,
          props: { program: PLUS, call: PLUS_CALL, after: "predict-readings" },
        },
      ],
    },
    {
      kind: "construction",
      title: LABELS.titles.construction,
      prose: PROSE.construction,
      interactives: [
        {
          id: "predict-the-flags",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.flags,
          props: { challengeId: "predict-flags" },
        },
        {
          id: "add-carry-out",
          kind: "adder",
          timeModel: STEPS,
          caption: LABELS.captions.adderCarryOut,
          props: { program: PLUS, call: CARRY_OUT_CALL, afterChallenge: "predict-flags" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-add-flags",
          kind: "run-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictAdd,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.afterAdd,
            explain: PROSE.failureExplain,
            program: SUM_FLAGS,
            call: { entry: "sum_flags", args: [0x7fffffff, 1] },
            measure: { kind: "flags" },
            inputs: [0, 1],
          },
        },
        {
          id: "step-add",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepAdd,
          props: {
            program: SUM_FLAGS,
            call: { entry: "sum_flags", args: [0x7fffffff, 1] },
            registers: [0, 1, 2],
            flags: true,
            after: "predict-add-flags",
          },
        },
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    { kind: "generalisation", title: LABELS.titles.generalisation, prose: PROSE.generalisation },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: PROSE.challenge,
      interactives: [
        {
          id: "smallest-overflow",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.overflow,
          props: { challengeId: "smallest-overflow" },
        },
      ],
    },
    { kind: "reflection", title: LABELS.titles.reflection, prose: PROSE.reflection },
  ],
  challenges: [
    {
      id: "predict-flags",
      title: LABELS.challenges.flags.title,
      task: PROSE.flagsTask,
      gradedDirection: "answer",
      // One field for each flag of each addition: a choice of 0 or 1, none chosen at first.
      fields: ADDITIONS.flatMap((a) =>
        FLAG_NAMES.map((flag) => ({
          id: `${a.id}-${flag.toLowerCase()}`,
          label: LABELS.challenges.flags.field(flag, a.text),
          kind: "choice" as const,
          options: ZERO_OR_ONE,
        })),
      ),
      // The program the editor shows and the grader runs. The expected flags are what the run
      // leaves, never values in this file.
      initial: { data: { program: PLUS } },
      tests: {
        kind: "answers",
        grader: OUTCOMES_AT_RETURN,
        cases: ADDITIONS.map((a) => ({
          label: a.text,
          given: { entry: "plus", w0: a.w0, w1: a.w1 },
          expect: Object.fromEntries(
            FLAG_NAMES.map((flag) => [`${a.id}-${flag.toLowerCase()}`, flag.toLowerCase()]),
          ),
        })),
      },
      hints: [...PROSE.flagsHints],
      reference: {
        answers: {
          "first-n": "0",
          "first-z": "1",
          "first-c": "1",
          "first-v": "0",
          "second-n": "0",
          "second-z": "0",
          "second-c": "0",
          "second-v": "0",
          "third-n": "0",
          "third-z": "1",
          "third-c": "1",
          "third-v": "1",
        },
      },
    },
    {
      id: "smallest-overflow",
      title: LABELS.challenges.overflow.title,
      task: PROSE.overflowTask,
      gradedDirection: "answer",
      fields: [{ id: "number", label: LABELS.challenges.overflow.field, kind: "number" }],
      initial: { data: { program: PLUS } },
      tests: {
        kind: "answers",
        grader: SMALLEST_SETTING_FLAG,
        cases: [
          {
            label: LABELS.challenges.overflow.test,
            given: { entry: "plus", w0: 0x7ffffffe, flag: "v" },
            expect: { number: "w1" },
          },
        ],
      },
      hints: [...PROSE.overflowHints],
      reference: { answers: { number: "2" } },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      "The obvious example for the flags is an 8-bit addition table that runs through every overflow case, or a car odometer rolling over from 999999 to 0.",
    howThisDiffers:
      "This lesson adds in 32 bits and draws the carry into every column from the simulator's own record, so the learner sees where C and V come from. Its prediction asks which readings of one answer are right, not for a table of cases. It checks GCC's `__builtin_add_overflow` listing, which reads V, and shows that `add` leaves the flags alone. The trip computer's counter, not an odometer, is the running situation that lesson 2 builds on.",
  },
};
