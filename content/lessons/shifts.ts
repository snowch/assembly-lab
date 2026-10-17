// Copyright © 2026 Christopher Snow

// Lesson: Shifts, and the type that picks one (module 3, lesson 2 of 2). The learner sees GCC pick
// `asr` for an `int` and `lsr` for an `unsigned`, predicts what fills the top bit, shifts words of
// their own, compares shifts with C's division, predicts what GCC's first instruction for `g / 2`
// adds, and says which instruction GCC uses for each shift.
//
// The structure is here; the words are in shifts.prose.ts and shifts.labels.ts (kept from
// docs/notes/module-3/prose.md), and the compiler listings are in logic-shifts-masks.listings.ts.
// The plan for the module is docs/notes/module-3-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import {
  COMPARE_SHIFTS,
  DIV2,
  HALVE_COUNT,
  HALVE_GRADIENT,
  PICK_INSTRUCTION,
  SHIFT_AMOUNTS,
  SHIFT_OPS,
} from "./logic-shifts-masks.listings";
import { LABELS } from "./shifts.labels";
import { PROSE } from "./shifts.prose";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/grader.ts). */
const REGISTERS_AT_RETURN = "registers-at-return";
const INSTRUCTION_AT_ENTRY = "instruction-at-entry";

/** The instructions this lesson adds to the first lesson's (the module plan). */
export const SHIFTS_INSTRUCTIONS = ["lsr", "asr"] as const;

/** The smallest `int`: a field that takes a negative number says so, and gets a full keyboard. */
const MOST_NEGATIVE = -2147483648;

export const shifts: LessonInput = {
  id: "shifts",
  title: "Shifts, and the type that picks one",
  module: 3,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: ["shift", "logical shift", "arithmetic shift"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNote.summary, prose: PROSE.questionNote.prose },
      interactives: [
        {
          id: "halve-compare",
          kind: "listing-pair",
          timeModel: "none",
          caption: LABELS.drafts.captions.compareHalves,
          props: {
            sides: [
              { title: LABELS.drafts.types.int, program: HALVE_GRADIENT },
              { title: LABELS.drafts.types.unsigned, program: HALVE_COUNT },
            ],
          },
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
          id: "predict-fill",
          kind: "probe-prediction",
          timeModel: STEPS,
          caption: LABELS.drafts.captions.predictFill,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.fill,
            explain: PROSE.predictionExplain,
            program: HALVE_GRADIENT,
            call: { entry: "halve_gradient", args: [-7] },
            measure: { kind: "fill-rule" },
            showStart: true,
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
          id: "shift-word",
          kind: "shift",
          timeModel: STEPS,
          caption: LABELS.captions.shiftWord,
          props: {
            ops: [...SHIFT_OPS],
            amounts: [...SHIFT_AMOUNTS],
            word: -7,
            after: "predict-fill",
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
          id: "compare-shifts-here",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.drafts.captions.compareShifts,
          props: { challengeId: "compare-shifts" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-first-add",
          kind: "probe-prediction",
          timeModel: STEPS,
          caption: LABELS.drafts.captions.predictFirstAdd,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.firstAdd,
            explain: PROSE.failureExplain,
            program: DIV2,
            call: { entry: "div2", args: [-7] },
            measure: { kind: "first-add" },
          },
        },
        {
          id: "step-div2",
          kind: "word-stepper",
          timeModel: STEPS,
          caption: LABELS.drafts.captions.stepDiv2,
          props: {
            program: DIV2,
            call: { entry: "div2", args: [-7] },
            // A second call, for a value whose top bit is 0: the operand is then 0.
            calls: [
              { label: "div2(-7)", call: { entry: "div2", args: [-7] } },
              { label: "div2(7)", call: { entry: "div2", args: [7] } },
            ],
            registers: [0],
            reading: "signed",
            showC: true,
            // For the instruction that has a shifted last operand: that operand's value.
            operand: true,
            after: "predict-first-add",
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
          id: "pick-instruction-here",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.drafts.captions.pickInstruction,
          props: { challengeId: "pick-instruction" },
        },
      ],
    },
    {
      kind: "reflection",
      title: LABELS.titles.reflection,
      prose: PROSE.reflection,
      details: { summary: PROSE.reflectionNote.summary, prose: PROSE.reflectionNote.prose },
    },
  ],
  challenges: [
    {
      id: "compare-shifts",
      title: LABELS.challenges.compare.title,
      task: PROSE.compareTask,
      gradedDirection: "answer",
      fields: [
        {
          id: "asr21",
          label: LABELS.challenges.compare.fields.asr21,
          kind: "number",
          min: MOST_NEGATIVE,
        },
        {
          id: "lsr21",
          label: LABELS.challenges.compare.fields.lsr21,
          kind: "number",
          min: MOST_NEGATIVE,
        },
        {
          id: "div21",
          label: LABELS.challenges.compare.fields.div21,
          kind: "number",
          min: MOST_NEGATIVE,
        },
        {
          id: "asr_neg",
          label: LABELS.challenges.compare.fields.asrNeg,
          kind: "number",
          min: MOST_NEGATIVE,
        },
        {
          id: "lsr_neg",
          label: LABELS.challenges.compare.fields.lsrNeg,
          kind: "number",
          min: MOST_NEGATIVE,
        },
        {
          id: "div_neg",
          label: LABELS.challenges.compare.fields.divNeg,
          kind: "number",
          min: MOST_NEGATIVE,
        },
      ],
      // The program the grader runs: `asr` by 2, `lsr` by 2 and C's `/ 4`, as a function each. The
      // learner is not shown it; the expected values are what the run leaves in w0.
      initial: { data: { model: COMPARE_SHIFTS } },
      tests: {
        kind: "answers",
        grader: REGISTERS_AT_RETURN,
        cases: [
          {
            label: LABELS.challenges.compare.tests.asr21,
            given: {
              entry: "asr_by_2",
              w0: 21,
              "feedback.asr21": PROSE.compareFeedback.asr,
            },
            expect: { asr21: "w0" },
          },
          {
            label: LABELS.challenges.compare.tests.lsr21,
            given: {
              entry: "lsr_by_2",
              w0: 21,
              "feedback.lsr21": PROSE.compareFeedback.lsr,
            },
            expect: { lsr21: "w0" },
          },
          {
            label: LABELS.challenges.compare.tests.div21,
            given: {
              entry: "div_by_4",
              w0: 21,
              "feedback.div21": PROSE.compareFeedback.div,
            },
            expect: { div21: "w0" },
          },
          {
            label: LABELS.challenges.compare.tests.asrNeg,
            given: {
              entry: "asr_by_2",
              w0: -21,
              "feedback.asr_neg": PROSE.compareFeedback.asr,
            },
            expect: { asr_neg: "w0" },
          },
          {
            label: LABELS.challenges.compare.tests.lsrNeg,
            given: {
              entry: "lsr_by_2",
              w0: -21,
              "feedback.lsr_neg": PROSE.compareFeedback.lsr,
            },
            expect: { lsr_neg: "w0" },
          },
          {
            label: LABELS.challenges.compare.tests.divNeg,
            given: {
              entry: "div_by_4",
              w0: -21,
              "feedback.div_neg": PROSE.compareFeedback.div,
            },
            expect: { div_neg: "w0" },
          },
        ],
      },
      hints: [...PROSE.compareHints],
      reference: {
        answers: {
          asr21: "5",
          lsr21: "5",
          div21: "5",
          asr_neg: "-6",
          lsr_neg: "1073741818",
          div_neg: "-5",
        },
      },
    },
    {
      id: "pick-instruction",
      title: LABELS.challenges.pick.title,
      task: PROSE.pickTask,
      gradedDirection: "answer",
      fields: [
        { id: "shr_int", label: LABELS.challenges.pick.fields.shrInt, kind: "text" },
        { id: "shr_unsigned", label: LABELS.challenges.pick.fields.shrUnsigned, kind: "text" },
        { id: "shl", label: LABELS.challenges.pick.fields.shl, kind: "text" },
      ],
      // GCC's four shifts by 3, recorded: the grader runs each from its label and compares the
      // answer with the instruction the run executes first. The learner is not shown them.
      initial: { data: { model: PICK_INSTRUCTION } },
      tests: {
        kind: "answers",
        grader: INSTRUCTION_AT_ENTRY,
        cases: [
          {
            label: LABELS.challenges.pick.tests.shrInt,
            given: { entry: "shr3_int", w0: 1 },
            expect: { shr_int: "instruction" },
          },
          {
            label: LABELS.challenges.pick.tests.shrUnsigned,
            given: { entry: "shr3_unsigned", w0: 1 },
            expect: { shr_unsigned: "instruction" },
          },
          {
            label: LABELS.challenges.pick.tests.shl,
            given: { entry: "shl3_int", w0: 1 },
            expect: { shl: "instruction" },
          },
        ],
      },
      hints: [...PROSE.pickHints],
      reference: { answers: { shr_int: "asr", shr_unsigned: "lsr", shl: "lsl" } },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      "The obvious examples are a table of left and right shifts followed by multiplying and dividing by powers of two.",
    howThisDiffers:
      "This lesson uses GCC's own listings for `>>` and `/ 2` to show the C type choosing the instruction for the first time, and shows why a shift is not a division for a negative `int`. Its challenges ask for the instruction GCC picks, not for a shift worked out by hand.",
  },
};
