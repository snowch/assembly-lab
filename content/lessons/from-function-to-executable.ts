// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./from-function-to-executable.labels";
import { PROSE } from "./from-function-to-executable.prose";
import {
  NATIVE_TRIP,
  NATIVE_CALL,
  BROKEN_TRIP,
  BROKEN_TEXT,
  TRIP_TEXT,
  NATIVE_CASES,
} from "./native.listings";
import EVIDENCE from "./module-12.evidence.json" with { type: "json" };
import { LABELS as NATIVE_LABELS } from "./debug-native-instructions.labels";
import { LABELS as DIAGRAM_LABELS } from "./native-diagrams.labels";
export const fromFunctionToExecutable: LessonInput = {
  id: "from-function-to-executable",
  title: LABELS.title,
  module: 12,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: [],
  sections: [
    {
      kind: "motivation",
      title: LABELS.titles.motivation,
      prose: [PROSE.question, PROSE.motivation + "\n\n" + PROSE.setup].join("\n\n"),
      interactives: [
        {
          id: "native-build-pipeline",
          kind: "native-tools",
          role: "diagram",
          timeModel: "none",
          caption: LABELS.captions.pipeline,
          props: {
            stages: NATIVE_LABELS.native.pipeline,
            environment: EVIDENCE.environment,
            versions: EVIDENCE.versions,
            referenceSummary: NATIVE_LABELS.native.referenceRun,
          },
        },
      ],
    },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.prediction,
      interactives: [
        {
          id: "predict-native-result",
          kind: "run-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predict,
          props: {
            program: NATIVE_TRIP,
            call: NATIVE_CALL,
            inputs: [0, 1, 2, 3],
            question: PROSE.predictionQuestion,
            explain: PROSE.predictionExplain,
            options: LABELS.options.prediction,
            measure: { kind: "register", register: 0 },
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
          id: "native-elf-memory",
          kind: "native-tools",
          role: "diagram",
          timeModel: "none",
          caption: DIAGRAM_LABELS.memory.title,
          props: {
            stages: [],
            diagram: { kind: "memory", evidence: EVIDENCE.boot, labels: DIAGRAM_LABELS },
            after: "predict-native-result",
          },
        },
        {
          id: "native-model-trip",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.step,
          props: {
            program: NATIVE_TRIP,
            call: NATIVE_CALL,
            registers: [0, 1, 2, 3],
            decimal: true,
            after: "predict-native-result",
          },
        },
      ],
    },
    {
      kind: "construction",
      title: LABELS.titles.construction,
      prose: "",
      interactives: [
        {
          id: "native-run-output",
          kind: "native-tools",
          timeModel: "none",
          caption: LABELS.titles.construction,
          props: { stages: [], prose: PROSE.construction, after: "predict-native-result" },
        },
      ],
      details: { summary: PROSE.troubleshootingNoteSummary, prose: PROSE.troubleshootingNote },
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-native-bug",
          kind: "run-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predictFailure,
          props: {
            program: BROKEN_TRIP,
            call: NATIVE_CALL,
            inputs: [0, 1, 2, 3],
            question: PROSE.failureQuestion,
            explain: PROSE.failureExplain,
            options: LABELS.options.failure,
            measure: { kind: "register", register: 0 },
          },
        },
        {
          id: "native-model-bug",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.stepFailure,
          props: {
            program: BROKEN_TRIP,
            call: NATIVE_CALL,
            registers: [0, 1, 2, 3],
            decimal: true,
            after: "predict-native-bug",
          },
        },
      ],
    },
    {
      kind: "explanation",
      title: LABELS.titles.explanation,
      prose: PROSE.explanation,
      details: { summary: PROSE.deviceNoteSummary, prose: PROSE.deviceNote },
      interactives: [
        {
          id: "native-boot-startup",
          kind: "native-tools",
          role: "diagram",
          timeModel: "steps",
          caption: NATIVE_LABELS.native.boot.title,
          props: {
            stages: [],
            boot: EVIDENCE.boot,
            bootLabels: { ...NATIVE_LABELS.native.boot, stackTop: DIAGRAM_LABELS.memory.stackTop },
            after: "predict-native-result",
          },
        },
      ],
    },
    {
      kind: "generalisation",
      title: LABELS.titles.generalisation,
      prose: PROSE.generalisation,
      interactives: [
        {
          id: "native-boot-path",
          kind: "native-tools",
          role: "diagram",
          timeModel: "none",
          caption: DIAGRAM_LABELS.flow.title,
          props: {
            stages: [],
            diagram: { kind: "flow", evidence: EVIDENCE.boot, labels: DIAGRAM_LABELS },
            after: "predict-native-result",
          },
        },
      ],
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "repair-native-trip",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.final,
          props: { challengeId: "repair-native-trip" },
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
      id: "repair-native-trip",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "w2", "w3"],
      allowedConstructs: ["add", "sub", "ret"],
      initial: {
        text: BROKEN_TEXT,
        data: { editor: { registers: ["w0", "w1", "w2", "w3"], symbols: [",", "#"] } },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: NATIVE_CASES.map(([a, b, c, d], i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: { w0: a, w1: b, w2: c, w3: d },
          expect: { w0: a + b + c - d },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: TRIP_TEXT },
    },
  ],
  sectionLayout: "selected",
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
