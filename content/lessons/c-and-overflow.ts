// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./c-and-overflow.labels";
import { PROSE } from "./c-and-overflow.prose";
import {
  CAN_INCREMENT,
  CAN_INCREMENT_WRAP,
  MACHINE_INCREMENT,
  SAFE_INCREMENT_BRANCH,
  INCREMENT_LIMIT_TEXT,
  SAFE_INCREMENT_TEXT,
  STARTING_TEXT,
} from "./c-boundaries.listings";
const VALUES = [0, 1, 2147483646, 2147483647, -2147483648, -1];
const EDITOR = {
  registers: ["w0", "w1"],
  labels: ["done"],
  conditions: ["eq", "ne"],
  symbols: [",", "#", ".", ":"],
};
export const cAndOverflow: LessonInput = {
  id: "c-and-overflow",
  title: LABELS.title,
  module: 11,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: ["saturation"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "c-increment-listing",
          kind: "listing",
          timeModel: "none",
          caption: LABELS.captions.listing,
          props: { program: CAN_INCREMENT },
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
          id: "predict-machine-increment",
          kind: "run-prediction",
          timeModel: "steps",
          caption: LABELS.captions.predict,
          props: {
            program: MACHINE_INCREMENT,
            call: { entry: "machine_increment", args: [2147483647] },
            question: PROSE.predictionQuestion,
            explain: PROSE.predictionExplain,
            options: LABELS.options.prediction,
            inputs: [0],
            measure: { kind: "register", register: 0, as: "hex", flags: true },
          },
        },
        {
          id: "step-machine-increment",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.step,
          props: {
            program: MACHINE_INCREMENT,
            call: { entry: "machine_increment", args: [2147483647] },
            registers: [0],
            flags: true,
            after: "predict-machine-increment",
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
          id: "compare-increment-options",
          kind: "listing-pair",
          timeModel: "none",
          caption: LABELS.captions.compare,
          props: {
            alignCommon: true,
            sides: [
              { title: LABELS.sides[0], program: CAN_INCREMENT },
              { title: LABELS.sides[1], program: CAN_INCREMENT_WRAP },
            ],
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
          id: "write-increment-limit",
          kind: "challenge",
          timeModel: "steps",
          caption: LABELS.captions.write,
          props: { challengeId: "write-increment-limit" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-wrap-increment",
          kind: "run-prediction",
          timeModel: "steps",
          caption: LABELS.captions.predictFailure,
          props: {
            program: CAN_INCREMENT_WRAP,
            call: { entry: "can_increment", args: [2147483647] },
            question: PROSE.failureQuestion,
            explain: PROSE.failureExplain,
            options: LABELS.options.failure,
            inputs: [0],
            measure: { kind: "register", register: 0 },
          },
        },
        {
          id: "step-wrap-increment",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.stepFailure,
          props: {
            program: CAN_INCREMENT_WRAP,
            call: { entry: "can_increment", args: [2147483647] },
            registers: [0, 1],
            flags: true,
            after: "predict-wrap-increment",
          },
        },
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    {
      kind: "generalisation",
      title: LABELS.titles.generalisation,
      prose: PROSE.generalisation,
      details: { summary: PROSE.generalisationNoteSummary, prose: PROSE.generalisationNote },
      interactives: [],
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "write-safe-increment",
          kind: "challenge",
          timeModel: "steps",
          caption: LABELS.captions.final,
          props: { challengeId: "write-safe-increment" },
        },
        {
          id: "safe-increment-listing",
          kind: "listing",
          timeModel: "none",
          caption: LABELS.captions.extra,
          props: { program: SAFE_INCREMENT_BRANCH, afterChallenge: "write-safe-increment" },
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
      id: "write-increment-limit",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: ["w0", "w1"],
      allowedConstructs: ["mov", "cmp", "cset", "ret"],
      initial: { text: STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: VALUES.map((value, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: { w0: value },
          expect: { w0: value === 2147483647 ? 1 : 0 },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: INCREMENT_LIMIT_TEXT },
    },
    {
      id: "write-safe-increment",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: ["w0", "w1"],
      allowedConstructs: ["mov", "cmp", "b.cond", "b", "add", "ret"],
      initial: { text: STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: VALUES.map((value, i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: { w0: value },
          expect: { w0: value === 2147483647 ? value : value + 1 },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: SAFE_INCREMENT_TEXT },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
