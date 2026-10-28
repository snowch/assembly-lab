// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { traceOf, viewAt, wValue } from "@al/views";
import { INCREMENT_INT } from "./meet-the-machine.listings";
import {
  RETURNING_PROGRAM,
  RETURNING_CALL,
  RETURNING_START_STEP,
  RETURNING_END_STEP,
  RETURNING_CALLER_LABEL,
} from "./returning-to-caller.example";
import { RETURNING_PROSE as P } from "./returning-to-caller.prose";
import { RETURNING_LABELS as L } from "./returning-to-caller.labels";

const exerciseCall = { entry: "caller", args: [4, 0] };
const exerciseTrace = traceOf(RETURNING_PROGRAM, exerciseCall);
const returnState = viewAt(exerciseTrace, RETURNING_END_STEP - 1).state;
const callerState = viewAt(exerciseTrace, RETURNING_END_STEP).state;

export const returningToCaller: LessonInput = {
  id: "returning-to-caller",
  title: L.title,
  module: 0,
  order: 3,
  objectives: [...L.objectives],
  sectionLayout: "selected",
  showTimeModelNotes: false,
  introduces: ["address", "branch", "return address", "link register", "calling convention"],
  sections: [
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: [P.sections.motivation, P.sections.investigation].join("\n\n"),
      interactives: [
        {
          id: "follow-return",
          kind: "returning-to-caller",
          timeModel: "steps",
          caption: L.captions.figure,
          props: {
            program: RETURNING_PROGRAM,
            call: RETURNING_CALL,
            functionProgram: INCREMENT_INT,
            startStep: RETURNING_START_STEP,
            endStep: RETURNING_END_STEP,
            callerLabel: RETURNING_CALLER_LABEL,
            functionLabel: "increment_int",
          },
        },
      ],
    },
    {
      kind: "explanation",
      title: L.titles.explanation,
      prose: P.sections.explanation,
      details: P.references,
    },
    {
      kind: "challenge",
      title: L.titles.challenge,
      prose: P.sections.challenge,
      interactives: [
        {
          id: "practice",
          kind: "challenge",
          timeModel: "steps",
          role: "exercise",
          caption: L.captions.challenge,
          props: { challengeId: "trace-return-and-use" },
        },
      ],
    },
  ],
  challenges: [
    {
      id: "trace-return-and-use",
      title: L.challenge.title,
      task: P.challenge.task,
      gradedDirection: "answer",
      fields: [
        { id: "w0", label: L.challenge.fields.w0, kind: "number" },
        { id: "w1", label: L.challenge.fields.w1, kind: "number" },
      ],
      initial: { data: { model: RETURNING_PROGRAM } },
      tests: {
        kind: "answers",
        grader: "registers-at-return",
        cases: [
          {
            label: L.challenge.title,
            given: { entry: "caller", w0: 4, w1: 0 },
            // The wrapper preserves these two values after the visible caller addition.
            // The facts test separately pins both moments named by the question.
            expect: { w0: "w0", w1: "w1" },
          },
        ],
      },
      hints: [...P.challenge.hints],
      reference: {
        answers: { w0: String(wValue(returnState, 0)), w1: String(wValue(callerState, 1)) },
      },
    },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
