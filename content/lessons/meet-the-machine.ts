// Copyright © 2026 Christopher Snow

// Lesson: Meet the machine (module 0, the only lesson of the module). The learner steps a compiled
// function one instruction at a time, fixes a subtraction whose operands are the wrong way round,
// watches a run go past a deleted `ret`, and traces a five-instruction function.
//
// The structure is here; the words are in meet-the-machine.prose.ts and .labels.ts (kept from
// docs/notes/module-0/prose.md), and the compiler listings are in meet-the-machine.listings.ts.
// The plan for the lesson is docs/notes/module-0-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import { LABELS } from "./meet-the-machine.labels";
import {
  FUEL_USED_FIXED_TEXT,
  FUEL_USED_MISTAKEN_TEXT,
  KM_TO_SERVICE,
  TRIP_DISTANCE,
  TRIP_DISTANCE_AND_FUEL_USED,
} from "./meet-the-machine.listings";
import { PROSE } from "./meet-the-machine.prose";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The call every figure of the lesson runs. */
const TRIP_CALL = { entry: "trip_distance", args: [120, 85, 42, 15] } as const;

/** The graders the book supplies (packages/views/src/grader.ts). */
const RUN_REGISTERS = "run-registers";
const REGISTERS_AT_RETURN = "registers-at-return";

const KM_ARGS = { w0: 30000, w1: 28750, w2: 140, w3: 390 } as const;

export const meetTheMachine: LessonInput = {
  id: "meet-the-machine",
  title: "Meet the machine",
  module: 0,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: [
    "instruction",
    "register",
    "listing",
    "assembly language",
    "operand",
    "program counter",
  ],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: {
        summary: PROSE.questionDetailsSummary,
        prose: PROSE.questionDetails,
      },
      interactives: [
        {
          id: "trip-listing",
          kind: "listing",
          timeModel: "none",
          caption: LABELS.captions.listing,
          props: { program: TRIP_DISTANCE },
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
          id: "predict-total",
          kind: "trace-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictTotal,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.total,
            explain: PROSE.predictionExplain,
            program: TRIP_DISTANCE,
            call: TRIP_CALL,
            measure: { kind: "first-write" },
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
          id: "step-trip",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepper,
          props: {
            program: TRIP_DISTANCE,
            call: TRIP_CALL,
            registers: [0, 1, 2, 3],
            after: "predict-total",
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
          id: "fix-the-subtraction",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.fix,
          props: { challengeId: "fix-fuel-used" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-no-ret",
          kind: "trace-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictNoRet,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.noRet,
            explain: PROSE.failureExplain,
            program: TRIP_DISTANCE_AND_FUEL_USED,
            call: TRIP_CALL,
            measure: {
              kind: "register-at-end",
              register: 0,
              without: { label: "trip_distance", text: "ret" },
            },
          },
        },
        {
          id: "step-no-ret",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.noRet,
          props: {
            program: TRIP_DISTANCE_AND_FUEL_USED,
            call: TRIP_CALL,
            registers: [0, 1, 2, 3],
            removable: { label: "trip_distance", text: "ret" },
            after: "predict-no-ret",
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
          id: "trace-km",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.trace,
          props: { challengeId: "trace-the-call" },
        },
      ],
    },
    { kind: "reflection", title: LABELS.titles.reflection, prose: PROSE.reflection },
  ],
  challenges: [
    {
      id: "fix-fuel-used",
      title: LABELS.challenges.fix.title,
      task: PROSE.fixTask,
      gradedDirection: "write",
      // The registers the tap editor offers, and the instructions the lesson's assembler allows.
      palette: ["w0", "w1", "w2", "w3"],
      allowedConstructs: ["add", "sub", "ret"],
      initial: { text: FUEL_USED_MISTAKEN_TEXT },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        cases: [
          { label: "fuel_used(50, 38)", given: { w0: 50, w1: 38 }, expect: { w0: 12 } },
          { label: "fuel_used(45, 45)", given: { w0: 45, w1: 45 }, expect: { w0: 0 } },
          { label: "fuel_used(60, 5)", given: { w0: 60, w1: 5 }, expect: { w0: 55 } },
        ],
      },
      hints: [...PROSE.fixHints],
      reference: { text: FUEL_USED_FIXED_TEXT },
    },
    {
      id: "trace-the-call",
      title: LABELS.challenges.trace.title,
      task: PROSE.traceTask,
      gradedDirection: "answer",
      fields: [
        { id: "w0", label: LABELS.challenges.trace.fields.w0, kind: "number" },
        { id: "w1", label: LABELS.challenges.trace.fields.w1, kind: "number" },
      ],
      // The program the editor shows and the grader runs. The expected values are what the run
      // leaves in the registers each case names, never numbers in this file.
      initial: { data: { program: KM_TO_SERVICE } },
      tests: {
        kind: "answers",
        grader: REGISTERS_AT_RETURN,
        cases: [
          {
            label: LABELS.challenges.trace.tests.w0,
            given: { entry: "km_to_service", ...KM_ARGS, "feedback.w0": PROSE.traceFeedbackW0 },
            expect: { w0: "w0" },
          },
          {
            label: LABELS.challenges.trace.tests.w1,
            given: { entry: "km_to_service", ...KM_ARGS, "feedback.w1": PROSE.traceFeedbackW1 },
            expect: { w1: "w1" },
          },
        ],
      },
      hints: [...PROSE.traceHints],
      reference: { answers: { w0: "670", w1: "28750" } },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      'The obvious first program in an assembly textbook or tutorial is "hello, world" through a system call, or adding two numbers held in registers set by `mov`.',
    howThisDiffers:
      "This lesson starts from C a reader might write, a three-statement function, uses the compiler's own listing rather than hand-written assembly, and finds out what an instruction is by stepping it. Its failure experiment (running past a deleted `ret` into the next function) and its operand-order fix are its own. The trip computer is the course's running situation; its quantities differ from digital-design's.",
  },
};
