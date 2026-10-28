// Copyright © 2026 Christopher Snow

// Lesson: Masks and fields (module 3, lesson 1 of 2). The learner meets the warning word, predicts
// why GCC clears a bit with `and w0, w0, -5`, runs the recorded functions on words of their own,
// writes `set_gear` with `and`, `lsl` and `orr`, predicts what it returns without the clearing
// step, and works out three results by hand.
//
// The structure is here; the words are in masks.prose.ts and masks.labels.ts (kept from
// docs/notes/module-3/prose.md), and the compiler listings are in logic-shifts-masks.listings.ts.
// The plan for the module is docs/notes/module-3-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import { LABELS } from "./masks.labels";
import { PROSE } from "./masks.prose";
import { REGISTER_OR } from "./prerequisite-bridges";
import {
  CLEAR_DOOR,
  GEAR_OF,
  SET_GEAR,
  SET_GEAR_REFERENCE_TEXT,
  SET_GEAR_START_TEXT,
  SET_GEAR_WITHOUT_CLEAR,
  TOGGLE_LIGHTS,
  TRACE_THREE,
  WARN_FUEL,
} from "./logic-shifts-masks.listings";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/grader.ts). */
const RUN_REGISTERS = "run-registers";
const HEX_REGISTERS_AT_RETURN = "hex-registers-at-return";

/** The instructions this lesson is the first to use (the module plan). `tst` and `ands` wait for Module 4. */
export const MASKS_INSTRUCTIONS = [
  "and",
  "orr",
  "eor",
  "bic",
  "mvn",
  "ubfx",
  "bfi",
  "lsl",
] as const;

/** The call the failure experiment runs. */
const SET_GEAR_CALL = { entry: "set_gear", args: [0x35, 5] } as const;

export const masks: LessonInput = {
  id: "masks",
  title: "Masks and fields",
  module: 3,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: ["mask", "field"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      interactives: [
        {
          after: PROSE.motivation,
          id: "warning-word",
          kind: "warning-word",
          timeModel: STEPS,
          role: "diagram",
          caption: LABELS.captions.warningWord,
          props: {
            program: GEAR_OF,
            call: { entry: "gear_of", args: [0x35] },
            entries: LABELS.drafts.keyEntries,
          },
        },
      ],
    },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.prediction,
      details: { summary: PROSE.predictionNote.summary, prose: PROSE.predictionNote.prose },
      interactives: [
        {
          id: "predict-minus-five",
          kind: "probe-prediction",
          timeModel: STEPS,
          role: "prediction",
          caption: LABELS.drafts.captions.predictMinusFive,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.minusFive,
            explain: PROSE.predictionExplain,
            program: CLEAR_DOOR,
            call: { entry: "clear_door", args: [0xffffffff] },
            measure: { kind: "cleared-bits" },
            // After the commit the figure shows the mask and the low eight bits of this run.
            maskView: { word: 0xffffffff },
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
          id: "mask-bits",
          kind: "bit-ops",
          timeModel: STEPS,
          role: "experiment",
          caption: LABELS.captions.maskBits,
          props: {
            functions: [
              { entry: "warn_fuel", program: WARN_FUEL, returns: "word" },
              { entry: "clear_door", program: CLEAR_DOOR, returns: "word" },
              { entry: "toggle_lights", program: TOGGLE_LIGHTS, returns: "word" },
            ],
            start: "clear_door",
            word: 0xf,
            entries: LABELS.drafts.keyEntries,
            after: "predict-minus-five",
          },
        },
        {
          id: "register-source-or",
          kind: "bit-ops",
          timeModel: STEPS,
          role: "experiment",
          caption: LABELS.captions.registerOr,
          props: {
            title: PROSE.registerOr.title,
            intro: PROSE.registerOr.prose,
            functions: [
              { entry: "join_warnings", program: REGISTER_OR, returns: "word", second: true },
            ],
            word: 5,
            secondValue: 8,
            entries: LABELS.drafts.keyEntries,
          },
        },
        {
          id: "read-gear",
          kind: "field-reading",
          timeModel: STEPS,
          role: "diagram",
          caption: LABELS.drafts.captions.readGear,
          props: {
            program: GEAR_OF,
            call: { entry: "gear_of", args: [0x35] },
            intro: PROSE.fieldReading,
            after: "predict-minus-five",
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
          id: "plan-field-write",
          kind: "probe-prediction",
          timeModel: STEPS,
          role: "prediction",
          caption: LABELS.captions.fieldPlan,
          props: {
            question: PROSE.fieldPlanQuestion,
            options: LABELS.options.fieldPlan,
            explain: PROSE.fieldPlanExplain,
            program: SET_GEAR,
            call: { entry: "set_gear", args: [0x35, 2] },
            measure: { kind: "register-hex", register: 0 },
          },
        },
        {
          id: "write-set-gear-here",
          kind: "challenge",
          timeModel: STEPS,
          role: "exercise",
          caption: LABELS.drafts.captions.setGear,
          props: { challengeId: "write-set-gear" },
        },
        {
          id: "step-solution",
          kind: "solution-stepper",
          timeModel: STEPS,
          caption: LABELS.drafts.captions.stepSolution,
          props: {
            // Shut until the challenge has been run; then the learner's own instructions, stepped.
            afterRun: "write-set-gear",
            intro: PROSE.afterRun,
            field: { from: 4, to: 6 },
          },
        },
        {
          id: "compare-bfi",
          kind: "bfi-compare",
          timeModel: STEPS,
          role: "diagram",
          caption: LABELS.drafts.captions.compareBfi,
          props: {
            // Shut until the challenge passes; then the learner's code beside GCC's `bfi`.
            afterChallenge: "write-set-gear",
            note: PROSE.afterPass,
            gcc: SET_GEAR,
            call: SET_GEAR_CALL,
            field: { from: 4, to: 6 },
          },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-no-clear",
          kind: "probe-prediction",
          timeModel: STEPS,
          role: "prediction",
          caption: LABELS.drafts.captions.predictNoClear,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.noClear,
            explain: PROSE.failureExplain,
            program: SET_GEAR_WITHOUT_CLEAR,
            call: SET_GEAR_CALL,
            measure: { kind: "register-hex", register: 0 },
          },
        },
        {
          id: "step-no-clear",
          kind: "word-stepper",
          timeModel: STEPS,
          caption: LABELS.drafts.captions.stepNoClear,
          props: {
            program: SET_GEAR_WITHOUT_CLEAR,
            call: SET_GEAR_CALL,
            registers: [0, 1],
            reading: "unsigned",
            showC: false,
            after: "predict-no-clear",
          },
        },
        {
          id: "compare-no-clear",
          kind: "clear-compare",
          timeModel: STEPS,
          role: "diagram",
          caption: LABELS.drafts.captions.compareClear,
          props: {
            without: SET_GEAR_WITHOUT_CLEAR,
            gcc: SET_GEAR,
            call: SET_GEAR_CALL,
            field: { from: 4, to: 6 },
            after: "predict-no-clear",
          },
        },
      ],
    },
    {
      kind: "explanation",
      title: LABELS.titles.explanation,
      prose: [PROSE.explanation, PROSE.generalisation].join("\n\n"),
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: PROSE.challenge,
      interactives: [
        {
          id: "trace-three-here",
          kind: "challenge",
          timeModel: STEPS,
          role: "exercise",
          caption: LABELS.drafts.captions.traceThree,
          props: { challengeId: "trace-three-results" },
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
      id: "write-set-gear",
      title: LABELS.challenges.setGear.title,
      task: PROSE.setGearTask,
      gradedDirection: "write",
      // The registers the tap editor offers, and the instructions the task allows.
      palette: ["w0", "w1", "w2", "w3"],
      allowedConstructs: ["and", "orr", "lsl", "ret"],
      initial: { text: SET_GEAR_START_TEXT },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        // What each call must give is what GCC's `bfi` gives (the facts test runs both).
        cases: [
          {
            label: "set_gear(0x35, 5)",
            given: { w0: 0x35, w1: 5, reading: "unsigned" },
            expect: { w0: 0x55 },
          },
          {
            label: "set_gear(0, 7)",
            given: { w0: 0, w1: 7, reading: "unsigned" },
            expect: { w0: 0x70 },
          },
          {
            label: "set_gear(0xffffffff, 0)",
            given: { w0: 0xffffffff, w1: 0, reading: "unsigned" },
            expect: { w0: 0xffffff8f },
          },
          {
            label: "set_gear(0x1234, 13)",
            given: { w0: 0x1234, w1: 13, reading: "unsigned" },
            expect: { w0: 0x1254 },
          },
        ],
      },
      hints: [...PROSE.setGearHints],
      reference: { text: SET_GEAR_REFERENCE_TEXT },
    },
    {
      id: "trace-three-results",
      title: LABELS.challenges.three.title,
      task: PROSE.traceTask,
      gradedDirection: "answer",
      fields: [
        { id: "after_orr", label: LABELS.challenges.three.fields.afterOrr, kind: "text" },
        { id: "after_and", label: LABELS.challenges.three.fields.afterAnd, kind: "text" },
        { id: "the_gear", label: LABELS.challenges.three.fields.gear, kind: "text" },
      ],
      // The program the grader runs: one function for each instruction the task names. The
      // learner is not shown it; the expected values are what the run leaves in w0.
      initial: { data: { model: TRACE_THREE } },
      tests: {
        kind: "answers",
        grader: HEX_REGISTERS_AT_RETURN,
        cases: [
          {
            label: LABELS.challenges.three.tests.afterOrr,
            given: {
              entry: "after_orr",
              w0: 0x2a,
              "feedback.after_orr": PROSE.traceFeedback.after_orr,
            },
            expect: { after_orr: "w0" },
          },
          {
            label: LABELS.challenges.three.tests.afterAnd,
            given: {
              entry: "after_and",
              w0: 0x2a,
              "feedback.after_and": PROSE.traceFeedback.after_and,
              // An `and` answer that is what the same `and` gives on the `orr` result is the
              // chained mistake. The grader runs `after_orr` on w0, then this function on that
              // result, to find it.
              "chained.after_and": "after_orr",
              "feedback.chained.after_and": PROSE.traceFeedback.chained,
            },
            expect: { after_and: "w0" },
          },
          {
            label: LABELS.challenges.three.tests.gear,
            given: {
              entry: "the_gear",
              w0: 0x2a,
              "feedback.the_gear": PROSE.traceFeedback.the_gear,
            },
            expect: { the_gear: "w0" },
          },
        ],
      },
      hints: [...PROSE.traceHints],
      reference: { answers: { after_orr: "0x2b", after_and: "0x22", the_gear: "0x2" } },
    },
  ],
  sectionLayout: "selected",
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      "The obvious examples are Unix file permissions, or a hardware status register copied from a datasheet.",
    howThisDiffers:
      "This lesson uses the trip computer's own warning word, makes you build `set_gear` by hand with `and`, `lsl` and `orr` before it shows GCC's single `bfi`, and asks why GCC prints the mask that clears bit 2 as −5. Its failure experiment (leaving out the clear) and its three results to trace are its own.",
  },
};
