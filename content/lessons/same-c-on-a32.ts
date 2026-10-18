// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./same-c-on-a32.labels";
import { PROSE } from "./same-c-on-a32.prose";
import {
  LIMIT_TRIP_A32,
  LIMIT_TRIP_A64,
  SERVICE_MARKER_A32,
  SERVICE_MARKER_A64,
  AVERAGE_TRIP_A32,
  AVERAGE_TRIP_A64,
} from "./a32.listings";

const pair = (a32: { c: string; listing: string }, a64: { c: string; listing: string }) => ({
  sides: [
    { title: LABELS.sides.a32, program: a32 },
    { title: LABELS.sides.a64, program: a64 },
  ],
});
const readQueries = {
  conditional: { kind: "token", program: LIMIT_TRIP_A32, instruction: 1, part: "mnemonic" },
  return: { kind: "token", program: LIMIT_TRIP_A32, instruction: 2, part: "mnemonic" },
};
const finalQueries = {
  constant: { kind: "token", program: SERVICE_MARKER_A32, instruction: 0, part: "mnemonic" },
  helper: { kind: "token", program: AVERAGE_TRIP_A32, instruction: 1, part: "first-operand" },
  divide: { kind: "token", program: AVERAGE_TRIP_A64, instruction: 0, part: "mnemonic" },
  result: {
    kind: "a64-result",
    program: AVERAGE_TRIP_A64,
    call: { entry: "average_trip", args: [95, 4] },
  },
};
export const sameCOnA32: LessonInput = {
  id: "same-c-on-a32",
  title: LABELS.title,
  module: 12,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: [],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.compilerNoteSummary, prose: PROSE.compilerNote },
      interactives: [
        {
          id: "a32-limit-pair",
          kind: "listing-pair",
          timeModel: "none",
          caption: LABELS.captions.limitPair,
          props: pair(LIMIT_TRIP_A32, LIMIT_TRIP_A64),
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
          id: "predict-a32-limit",
          kind: "run-prediction",
          timeModel: "steps",
          caption: LABELS.captions.predict,
          props: {
            program: LIMIT_TRIP_A64,
            call: { entry: "limit_trip", args: [80, 50] },
            inputs: [0, 1],
            question: PROSE.predictionQuestion,
            explain: PROSE.predictionExplain,
            options: LABELS.options.prediction,
            measure: { kind: "register", register: 0, as: "decimal" },
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
          id: "step-a64-limit",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.step,
          props: {
            program: LIMIT_TRIP_A64,
            call: { entry: "limit_trip", args: [80, 50] },
            registers: [0, 1],
            flags: true,
            after: "predict-a32-limit",
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
          id: "read-a32-conditional",
          kind: "challenge",
          timeModel: "none",
          caption: LABELS.captions.read,
          props: { challengeId: "read-a32-conditional" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-a32-syntax",
          kind: "recorded-prediction",
          timeModel: "none",
          caption: LABELS.captions.syntax,
          props: {
            query: { kind: "a64-acceptance", program: LIMIT_TRIP_A32, instruction: 1 },
            question: PROSE.failureQuestion,
            explain: PROSE.failureExplain,
            options: LABELS.options.syntax,
          },
        },
      ],
    },
    {
      kind: "explanation",
      title: LABELS.titles.explanation,
      prose: PROSE.explanation,
      interactives: [
        {
          id: "a32-marker-pair",
          kind: "listing-pair",
          timeModel: "none",
          caption: LABELS.captions.markerPair,
          props: pair(SERVICE_MARKER_A32, SERVICE_MARKER_A64),
        },
      ],
    },
    {
      kind: "generalisation",
      title: LABELS.titles.generalisation,
      prose: PROSE.generalisation,
      details: { summary: PROSE.divisionNoteSummary, prose: PROSE.divisionNote },
      interactives: [
        {
          id: "a32-divide-pair",
          kind: "listing-pair",
          timeModel: "none",
          caption: LABELS.captions.divisionPair,
          props: pair(AVERAGE_TRIP_A32, AVERAGE_TRIP_A64),
        },
      ],
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "step-a64-average",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.step,
          props: {
            program: AVERAGE_TRIP_A64,
            call: { entry: "average_trip", args: [95, 4] },
            registers: [0, 1],
          },
        },
        {
          id: "read-a32-target",
          kind: "challenge",
          timeModel: "steps",
          caption: LABELS.captions.final,
          props: { challengeId: "read-a32-target" },
        },
      ],
    },
    { kind: "reflection", title: LABELS.titles.reflection, prose: PROSE.reflection },
  ],
  challenges: [
    {
      id: "read-a32-conditional",
      title: LABELS.challenges.read.title,
      task: PROSE.readTask,
      gradedDirection: "answer",
      fields: (Object.keys(readQueries) as (keyof typeof readQueries)[]).map((id) => ({
        id,
        kind: "text",
        label: LABELS.challenges.read.fields[id],
      })),
      initial: { data: { queries: readQueries } },
      tests: {
        kind: "answers",
        grader: "recorded-tokens",
        cases: (Object.keys(readQueries) as (keyof typeof readQueries)[]).map((id) => ({
          label: LABELS.challenges.read.fields[id],
          given: { [`feedback.${id}`]: PROSE.readFeedback },
          expect: { [id]: id },
        })),
      },
      hints: [...PROSE.readHints],
      reference: { answers: { conditional: "movcs", return: "bx" } },
    },
    {
      id: "read-a32-target",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "answer",
      fields: (Object.keys(finalQueries) as (keyof typeof finalQueries)[]).map((id) => ({
        id,
        kind: id === "result" ? "number" : "text",
        label: LABELS.challenges.final.fields[id],
      })),
      initial: { data: { queries: finalQueries } },
      tests: {
        kind: "answers",
        grader: "recorded-tokens",
        cases: (Object.keys(finalQueries) as (keyof typeof finalQueries)[]).map((id) => ({
          label: LABELS.challenges.final.fields[id],
          given: { [`feedback.${id}`]: PROSE.finalFeedback },
          expect: { [id]: id },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: {
        answers: { constant: "movw", helper: "__aeabi_uidiv", divide: "udiv", result: "23" },
      },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
