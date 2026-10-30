// Copyright © 2026 Christopher Snow

// Lesson: Putting it together (module 0, after the introductory Fundamentals lessons). The learner steps a compiled
// function one instruction at a time, watches a run go past a deleted `ret`, and traces a five-instruction function.
//
// The structure is here; the words are in meet-the-machine.prose.ts and .labels.ts (kept from
// docs/notes/module-0/prose.md), and the compiler listings are in meet-the-machine.listings.ts.
// The plan for the lesson is docs/notes/module-0-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import { SYNTHESIS_COPY } from "./fundamentals.prose";
import { LABELS } from "./meet-the-machine.labels";
import {
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
const REGISTERS_AT_RETURN = "registers-at-return";

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
      kind: "investigation",
      title: LABELS.titles.investigation,
      prose: [PROSE.prediction, PROSE.investigation].join("\n\n"),
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
            // Reuse the introductory operand rules in one complete function.
            flow: false,
            decimal: true,
            allowBits: false,
            registersFirst: true,
            // This synthesis walkthrough adds no repeated per-instruction quiz.
            expect: false,
            compact: false,
            endNote: PROSE.investigationEnd,
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
            allowBits: false,
            registersFirst: true,
            grouped: true,
          },
        },
      ],
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: PROSE.challenge,
      interactives: [
        {
          after: PROSE.reflection,
          id: "trace-km",
          kind: "challenge",
          timeModel: STEPS,
          role: "exercise",
          caption: LABELS.captions.trace,
          props: { challengeId: "trace-the-call" },
        },
      ],
    },
  ],
  challenges: [
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
  sectionLayout: "selected",
  modelVsReality: PROSE.modelVsReality,
  originalityNote: SYNTHESIS_COPY.originalityNote,
};
