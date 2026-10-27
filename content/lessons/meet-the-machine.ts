// Copyright © 2026 Christopher Snow

// Lesson: Putting it together (module 0, after the four Fundamentals lessons). The learner steps a compiled
// function one instruction at a time, fixes a subtraction whose operands are the wrong way round,
// watches a run go past a deleted `ret`, and traces a five-instruction function.
//
// The structure is here; the words are in meet-the-machine.prose.ts and .labels.ts (kept from
// docs/notes/module-0/prose.md), and the compiler listings are in meet-the-machine.listings.ts.
// The plan for the lesson is docs/notes/module-0-plan.md.

import { TEXT_BASE, assemble, run } from "@al/machine";
import type { LessonInput } from "@platform/lesson-schema";

import { SYNTHESIS_COPY } from "./fundamentals.prose";
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

/**
 * What the mistaken `fuel_used` (`sub w0, w1, w0`) leaves in `w0` for a call: the reversed
 * subtraction, `at_end` minus `at_start`, as the model computes it. A failed test whose result is
 * this number gets the sentence about the order of the operands.
 */
function reversedResult(atStart: number, atEnd: number): number {
  const { program } = assemble(FUEL_USED_MISTAKEN_TEXT);
  if (program === null) throw new Error("The mistaken fuel_used does not assemble.");
  const result = run(program, {
    entry: TEXT_BASE,
    args: [atStart, atEnd].map((value) => ({ value: BigInt(value), width: 32 as const })),
  });
  return Number(BigInt.asIntN(32, result.final.x[0] ?? 0n));
}

/** A call of `fuel_used`, with the sentence for its reversed result. */
function fuelCase(atStart: number, atEnd: number, expected: number) {
  return {
    label: `fuel_used(${atStart}, ${atEnd})`,
    given: {
      w0: atStart,
      w1: atEnd,
      "misconception.value": reversedResult(atStart, atEnd),
      "misconception.feedback": PROSE.fixReversedFeedback,
    },
    expect: { w0: expected },
  };
}

/** A prediction's option with the sentence for choosing it wrongly, if the lesson has one. */
function withFeedback(
  option: { readonly value: string; readonly label: string },
  feedback: Readonly<Record<string, string>>,
) {
  const own = feedback[option.value];
  return own === undefined ? { ...option } : { ...option, feedback: own };
}

const KM_ARGS = { w0: 30000, w1: 28750, w2: 140, w3: 390 } as const;

export const meetTheMachine: LessonInput = {
  id: "meet-the-machine",
  title: SYNTHESIS_COPY.title,
  module: 0,
  order: 6,
  objectives: [...LABELS.objectives],
  introduces: [],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
    },
    {
      kind: "motivation",
      title: LABELS.titles.motivation,
      prose: PROSE.motivation,
    },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.prediction,
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
            showCompilerLines: true,
            notes: [PROSE.compilerNote, PROSE.lineNote],
            // Reuse the introductory operand rules in one complete function.
            flow: false,
            decimal: true,
            // This synthesis walkthrough adds no repeated per-instruction quiz.
            expect: false,
            compact: false,
            endNote: PROSE.investigationEnd,
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
          role: "exercise",
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
          role: "prediction",
          caption: LABELS.captions.predictNoRet,
          props: {
            intro: PROSE.failureInvitation,
            question: PROSE.failureQuestion,
            options: LABELS.options.noRet.map((o) => withFeedback(o, PROSE.failureFeedback)),
            explain: PROSE.failureExplain,
            commitLabel: LABELS.commit.noRet,
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
            flow: true,
            decimal: true,
            grouped: true,
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
          role: "exercise",
          caption: LABELS.captions.trace,
          props: { challengeId: "trace-the-call" },
        },
      ],
    },
    {
      kind: "reflection",
      title: LABELS.titles.reflection,
      prose: PROSE.reflection,
    },
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
      // The keys the editor offers: this challenge writes `w` registers and commas, and needs no
      // constant, so the symbol bar has two keys and the tap mode no number pad. (Typing `x` is
      // still accepted.)
      initial: {
        text: FUEL_USED_MISTAKEN_TEXT,
        data: {
          editor: { symbols: [",", "w"], registers: ["w0", "w1", "w2", "w3"], numberPad: false },
        },
      },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        cases: [fuelCase(50, 38, 12), fuelCase(45, 45, 0), fuelCase(60, 5, 55)],
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
  originalityNote: SYNTHESIS_COPY.originalityNote,
};
