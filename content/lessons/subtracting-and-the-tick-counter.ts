// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 2: Subtracting, and the tick counter. The trip computer's millisecond counter
// wraps from its largest value to 0. The learner predicts what `elapsed(now, then)` returns across
// the wrap, sees the counter on a ring and C after `subs`, writes `elapsed` and passes tests that
// cross the wrap, and sees the one value whose negative is itself.
//
// The structure is here; the words are in subtracting-and-the-tick-counter.prose.ts and .labels.ts
// (kept from docs/notes/module-2/prose.md), and the programs are in
// subtracting-and-the-tick-counter.listings.ts. The plan for the module is
// docs/notes/module-2-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import { LABELS } from "./subtracting-and-the-tick-counter.labels";
import {
  ELAPSED,
  ELAPSED_FIXED_TEXT,
  ELAPSED_STARTING_TEXT,
  ELAPSED_SUBS,
  NEGATE_FLAGS,
} from "./subtracting-and-the-tick-counter.listings";
import { PROSE } from "./subtracting-and-the-tick-counter.prose";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/grader.ts and grader-arith.ts). */
const RUN_REGISTERS = "run-registers";
const OUTCOMES_AT_RETURN = "outcomes-at-return";

/** The call the prediction and the ring run: the counter wraps between the two readings. */
const WRAPPED_CALL = { entry: "elapsed", args: [1000, 4294966296] } as const;

/** The same two readings through `subs`: the adder draws it, and C is 0 (a borrow). */
const BORROW_CALL = { entry: "elapsed_subs", args: [1000, 4294966296] } as const;

/** A subtraction that does not wrap, through `subs`: C is 1 (no borrow). No challenge calls it. */
const NO_BORROW_CALL = { entry: "elapsed_subs", args: [9000, 2500] } as const;

/** One of the construction challenge's four calls, drawn once the challenge is passed: it borrows. */
const OWN_CALL = { entry: "elapsed_subs", args: [250, 4294967046] } as const;

export const subtractingAndTheTickCounter: LessonInput = {
  id: "subtracting-and-the-tick-counter",
  title: "Subtracting, and the tick counter",
  module: 2,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: ["borrow", "wrap"],
  sections: [
    { kind: "question", title: LABELS.titles.question, prose: PROSE.question },
    { kind: "motivation", title: LABELS.titles.motivation, prose: PROSE.motivation },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.prediction,
      interactives: [
        {
          id: "predict-elapsed",
          kind: "run-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictElapsed,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.elapsed,
            explain: PROSE.predictionExplain,
            program: ELAPSED,
            call: WRAPPED_CALL,
            measure: { kind: "register", register: 0, as: "decimal" },
            inputs: [0, 1],
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
          id: "counter-ring",
          kind: "counter-ring",
          timeModel: STEPS,
          caption: LABELS.captions.ring,
          props: {
            program: ELAPSED,
            call: WRAPPED_CALL,
            borrowProgram: { listing: ELAPSED_SUBS.listing },
            borrowEntry: "elapsed_subs",
            after: "predict-elapsed",
          },
        },
        {
          id: "subtract-wrapped",
          kind: "adder",
          timeModel: STEPS,
          caption: LABELS.captions.subtractWrapped,
          props: {
            program: ELAPSED_SUBS,
            call: BORROW_CALL,
            after: "predict-elapsed",
            detail: true,
            summary: true,
            opensAtEnd: true,
          },
        },
        {
          id: "subtract-no-wrap",
          kind: "adder",
          timeModel: STEPS,
          caption: LABELS.captions.subtractNoWrap,
          props: {
            program: ELAPSED_SUBS,
            call: NO_BORROW_CALL,
            after: "predict-elapsed",
            detail: true,
            summary: true,
            opensAtEnd: true,
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
          id: "write-elapsed",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.elapsed,
          props: { challengeId: "write-elapsed" },
        },
        {
          id: "subtract-own",
          kind: "adder",
          timeModel: STEPS,
          caption: LABELS.captions.subtractOwn,
          props: {
            program: ELAPSED_SUBS,
            call: OWN_CALL,
            afterChallenge: "write-elapsed",
            detail: true,
            summary: true,
            opensAtEnd: true,
            note: PROSE.elapsedAfter,
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
          id: "predict-negs",
          kind: "run-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictNegs,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.negs,
            explain: PROSE.failureExplain,
            program: NEGATE_FLAGS,
            call: { entry: "negate_flags", args: [0x80000000] },
            measure: { kind: "register", register: 0, as: "hex", flags: true },
            inputs: [0],
          },
        },
        {
          id: "step-negs",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepNegs,
          props: {
            program: NEGATE_FLAGS,
            call: { entry: "negate_flags", args: [0x80000000] },
            registers: [0],
            flags: true,
            after: "predict-negs",
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
          id: "one-step-past",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.step,
          props: { challengeId: "one-step-past" },
        },
      ],
    },
    {
      kind: "reflection",
      title: LABELS.titles.reflection,
      prose: PROSE.reflection,
      details: { summary: PROSE.reflectionAnswerSummary, prose: PROSE.reflectionAnswer },
    },
  ],
  challenges: [
    {
      id: "write-elapsed",
      title: LABELS.challenges.elapsed.title,
      task: PROSE.elapsedTask,
      gradedDirection: "write",
      // The registers the tap editor offers, and the instructions the lesson's assembler allows.
      palette: ["w0", "w1"],
      allowedConstructs: ["add", "sub", "adds", "subs", "ret"],
      initial: { text: ELAPSED_STARTING_TEXT },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        // Two calls that do not wrap, then two that do. `now` is in `w0` and `then` in `w1`. The
        // challenge after this one asks about the step from 4294967295 to 0, so no call here does.
        cases: [
          {
            label: "elapsed(5000, 1000)",
            given: { w0: 5000, w1: 1000, reading: "unsigned" },
            expect: { w0: 4000 },
          },
          {
            label: "elapsed(86400000, 3600000)",
            given: { w0: 86400000, w1: 3600000, reading: "unsigned" },
            expect: { w0: 82800000 },
          },
          {
            label: "elapsed(250, 4294967046)",
            given: { w0: 250, w1: 4294967046, reading: "unsigned" },
            expect: { w0: 500 },
          },
          {
            label: "elapsed(30, 4294966296)",
            given: { w0: 30, w1: 4294966296, reading: "unsigned" },
            expect: { w0: 1030 },
          },
        ],
      },
      hints: [...PROSE.elapsedHints],
      reference: { text: ELAPSED_FIXED_TEXT },
    },
    {
      id: "one-step-past",
      title: LABELS.challenges.step.title,
      task: PROSE.stepTask,
      gradedDirection: "answer",
      fields: [
        { id: "result", label: LABELS.challenges.step.fields.result, kind: "number" },
        { id: "c", label: LABELS.challenges.step.fields.c, kind: "number" },
      ],
      // The program the editor shows and the grader runs. The expected values are what the run
      // leaves, never numbers in this file.
      initial: { data: { program: ELAPSED_SUBS } },
      tests: {
        kind: "answers",
        grader: OUTCOMES_AT_RETURN,
        cases: [
          {
            label: LABELS.challenges.step.tests.result,
            given: { entry: "elapsed_subs", w0: 0, w1: 4294967295 },
            expect: { result: "w0" },
          },
          {
            label: LABELS.challenges.step.tests.c,
            given: { entry: "elapsed_subs", w0: 0, w1: 4294967295 },
            expect: { c: "c" },
          },
        ],
      },
      hints: [...PROSE.stepHints],
      reference: { answers: { result: "1", c: "0" } },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      "The obvious example for subtraction and borrow is a four- or eight-bit subtraction table, or a car odometer that rolls over and a clock that goes from 23:59 to 00:00.",
    howThisDiffers:
      "This lesson uses the trip computer's 32-bit millisecond counter and the question a trip computer really asks, how long since a reading, which `elapsed(now, then)` answers with one `sub` that stays right across the wrap. The learner sees the counter on a ring and C after `subs`, then writes `elapsed` and passes tests that cross the wrap. The tempting answer, which tests whether the counter wrapped and adds 2^32, cannot be written with the instructions the challenge allows.",
  },
};
