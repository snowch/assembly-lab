// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./debug-native-instructions.labels";
import { LABELS as DIAGRAM_LABELS } from "./native-diagrams.labels";
import { PROSE } from "./debug-native-instructions.prose";
import {
  NATIVE_TRIP,
  NATIVE_CALL,
  BROKEN_TRIP,
  TRIP_TEXT,
  TWICE_TEXT,
  NATIVE_CASES,
} from "./native.listings";
import EVIDENCE from "./module-12.evidence.json" with { type: "json" };
export const debugNativeInstructions: LessonInput = {
  id: "debug-native-instructions",
  title: LABELS.title,
  module: 12,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: [],
  sections: [
    { kind: "question", title: LABELS.titles.question, prose: PROSE.question },
    {
      kind: "motivation",
      title: LABELS.titles.motivation,
      prose: PROSE.motivation + "\n\n" + PROSE.connection,
      interactives: [
        {
          id: "native-debug-startup",
          kind: "native-tools",
          role: "diagram",
          timeModel: "steps",
          caption: LABELS.native.boot.title,
          props: {
            stages: [],
            boot: EVIDENCE.boot,
            bootLabels: { ...LABELS.native.boot, stackTop: DIAGRAM_LABELS.memory.stackTop },
          },
        },
      ],
    },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.functionInputs + "\n\n" + PROSE.prediction,
      interactives: [
        {
          id: "predict-native-step",
          kind: "model-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predict,
          props: {
            question: PROSE.predictionQuestion,
            explain: PROSE.predictionExplain,
            options: LABELS.options.prediction,
            measure: {
              kind: "register-at-step",
              program: NATIVE_TRIP,
              call: NATIVE_CALL,
              step: 1,
              register: 0,
            },
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
          id: "native-gdb-stops",
          kind: "native-tools",
          timeModel: "steps",
          caption: LABELS.captions.trace,
          props: {
            stages: [],
            program: NATIVE_TRIP,
            call: NATIVE_CALL,
            recorded: EVIDENCE.good.registers,
            pcOffsets: EVIDENCE.good.pcOffsets,
            labels: LABELS.native,
            after: "predict-native-step",
          },
        },
      ],
    },
    { kind: "construction", title: LABELS.titles.construction, prose: PROSE.construction },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-native-divergence",
          kind: "model-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predictFailure,
          props: {
            question: PROSE.failureQuestion,
            explain: PROSE.failureExplain,
            options: LABELS.options.failure,
            measure: {
              kind: "first-divergence",
              program: NATIVE_TRIP,
              other: BROKEN_TRIP,
              call: NATIVE_CALL,
              register: 0,
            },
          },
        },
        {
          id: "native-gdb-bug",
          kind: "native-tools",
          timeModel: "steps",
          caption: LABELS.captions.stepFailure,
          props: {
            stages: [],
            program: BROKEN_TRIP,
            call: NATIVE_CALL,
            recorded: EVIDENCE.broken.registers,
            pcOffsets: EVIDENCE.broken.pcOffsets,
            labels: LABELS.native,
            after: "predict-native-divergence",
          },
        },
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    {
      kind: "generalisation",
      title: LABELS.titles.generalisation,
      prose: PROSE.generalisation,
      details: { summary: PROSE.bareMetalNoteSummary, prose: PROSE.bareMetalNote },
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "native-double-correction",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.final,
          props: { challengeId: "native-double-correction" },
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
      id: "native-double-correction",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "w2", "w3"],
      allowedConstructs: ["add", "sub", "ret"],
      initial: {
        text: TRIP_TEXT,
        data: { editor: { registers: ["w0", "w1", "w2", "w3"], symbols: [",", "#"] } },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: NATIVE_CASES.map(([a, b, c, d], i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: { w0: a, w1: b, w2: c, w3: d },
          expect: { w0: a + b + c - 2 * d },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: TWICE_TEXT },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
