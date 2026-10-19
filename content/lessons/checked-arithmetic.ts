// Copyright © 2026 Christopher Snow
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./checked-arithmetic.labels";
import { PROSE } from "./checked-arithmetic.prose";
import {
  NARROW_FUEL,
  NARROW_GRADIENT,
  PROMOTED_GRADIENT,
  MIXED_LIMIT,
  CHECKED_TRIP_WRONG,
  CHECKED_TRIP_TEXT,
  FUEL_FITS_TEXT,
  STARTING_TEXT,
  CHECKED_RESULT_ADDRESS,
} from "./c-boundaries.listings";
const FUEL = [0, 127, 128, 255, 256, 257, 0x80000000, 0xffffffff];
const PAIRS = [
  [1, 2],
  [2147483647, 1],
  [-2147483648, -1],
  [-1, 1],
  [0, 0],
  [2147483647, 0],
  [-2147483648, 0],
] as const;
const BYTES = [0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44];
const FAILURE_CALL = {
  entry: "checked_trip_wrong",
  args: [2147483647, 1, { value: CHECKED_RESULT_ADDRESS, width: 64 }],
  memory: BYTES,
};
const bytesOf = (n: number) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, n >>> 24];
const EDITOR = {
  registers: ["w0", "w1", "x2"],
  addresses: ["[x2]"],
  conditions: ["vs", "vc", "cs", "cc", "ls", "hi"],
  symbols: [",", "#", "[", "]"],
};
export const checkedArithmetic: LessonInput = {
  id: "checked-arithmetic",
  title: LABELS.title,
  module: 11,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: ["integer promotion", "sanitizer"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "narrowing-listings",
          kind: "listing-pair",
          role: "diagram",
          timeModel: "none",
          caption: LABELS.captions.listing,
          props: {
            sides: [
              { title: LABELS.sides[0], program: NARROW_FUEL },
              { title: LABELS.sides[1], program: NARROW_GRADIENT },
            ],
          },
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
          id: "predict-narrow-gradient",
          kind: "run-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predict,
          props: {
            program: NARROW_GRADIENT,
            call: { entry: "narrow_gradient", args: [200] },
            question: PROSE.predictionQuestion,
            explain: PROSE.predictionExplain,
            options: LABELS.options.prediction,
            inputs: [0],
            measure: { kind: "register", register: 0, as: "hex" },
          },
        },
        {
          id: "step-narrow-gradient",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.step,
          props: {
            program: NARROW_GRADIENT,
            call: { entry: "narrow_gradient", args: [200] },
            registers: [0],
            after: "predict-narrow-gradient",
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
          id: "step-promoted-gradient",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.promoted,
          props: {
            program: PROMOTED_GRADIENT,
            call: { entry: "promoted_gradient", args: [127] },
            registers: [0],
            after: "predict-narrow-gradient",
          },
        },
        {
          id: "step-mixed-limit",
          kind: "stepper",
          timeModel: "steps",
          caption: LABELS.captions.mixed,
          props: {
            program: MIXED_LIMIT,
            call: { entry: "mixed_limit", args: [-1, 1] },
            registers: [0, 1],
            flags: true,
            after: "predict-narrow-gradient",
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
          id: "write-fuel-fits",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.write,
          props: { challengeId: "write-fuel-fits" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-wrong-overflow",
          kind: "memory-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predictFailure,
          props: {
            program: CHECKED_TRIP_WRONG,
            call: FAILURE_CALL,
            question: PROSE.failureQuestion,
            explain: PROSE.failureExplain,
            options: LABELS.options.failure,
            measure: { kind: "register-at-end", register: "w0" },
          },
        },
        {
          id: "step-wrong-overflow",
          kind: "memory-stepper",
          timeModel: "steps",
          caption: LABELS.captions.stepFailure,
          props: {
            program: CHECKED_TRIP_WRONG,
            call: FAILURE_CALL,
            registers: ["w0", "w1", "x2"],
            memory: { address: CHECKED_RESULT_ADDRESS, length: 8 },
            flags: true,
            after: "predict-wrong-overflow",
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
    },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "write-checked-trip",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.final,
          props: { challengeId: "write-checked-trip" },
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
      id: "write-fuel-fits",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: ["w0"],
      allowedConstructs: ["cmp", "cset", "ret"],
      initial: { text: STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: FUEL.map((value, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: { w0: value, reading: "unsigned" },
          expect: { w0: value <= 255 ? 1 : 0 },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: FUEL_FITS_TEXT },
    },
    {
      id: "write-checked-trip",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: ["w0", "w1", "x2"],
      allowedConstructs: ["adds", "str", "cset", "ret"],
      initial: { text: STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: PAIRS.map(([a, b], i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: { w0: a, w1: b, x2: CHECKED_RESULT_ADDRESS, memory: BYTES.join(",") },
          expect: {
            w0: a + b > 2147483647 || a + b < -2147483648 ? 1 : 0,
            memory: [...bytesOf(a + b), ...BYTES.slice(4)].join(","),
          },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: CHECKED_TRIP_TEXT },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
