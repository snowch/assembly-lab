// Copyright © 2026 Christopher Snow

// Memory figures run the recorded instructions against explicit byte fixtures. The written
// exercises compare the whole fixture, including bytes the learner must leave alone.
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./memory-and-addresses.labels";
import { PROSE } from "./memory-and-addresses.prose";
import {
  READ_DISTANCE,
  SAVE_DISTANCE,
  READ_LONG,
  SAVE_LONG,
  SAVE_FUEL,
  SAVE_PULSE,
  STORE_WIDE,
  SENSOR_ADDRESS,
  SAVE_DISTANCE_TEXT,
  SAVE_DISTANCE_STARTING_TEXT,
  COPY_DISTANCE_TEXT,
  COPY_DISTANCE_STARTING_TEXT,
} from "./memory.listings";

const STEPS = "steps";
const POINTER = { value: SENSOR_ADDRESS, width: 64 } as const;
const LOAD_BYTES = [0x78, 0x56, 0x34, 0x12];
const STORE_BYTES = [0xaa, 0xbb, 0xcc, 0xdd];
const WIDE_BYTES = [...LOAD_BYTES, 0xef, 0xcd, 0xab, 0x90];
const SAVE_CASES = [0, 1, 0x12345678, 0xffffffff, 0x80000000];
const COPY_CASES = [
  [...LOAD_BYTES, ...STORE_BYTES],
  [0, 0, 0, 0, 255, 255, 255, 255],
  [255, 255, 255, 255, 0, 0, 0, 0],
  [0, 0, 0, 128, ...STORE_BYTES],
  [0xef, 0xcd, 0xab, 0x89, ...STORE_BYTES],
];
const bytesOf = (value: number) => [
  value & 255,
  (value >>> 8) & 255,
  (value >>> 16) & 255,
  value >>> 24,
];
const valueOf = (bytes: number[]) =>
  bytes.slice(0, 4).reduce((value, byte, index) => value + byte * 2 ** (8 * index), 0);
const EDITOR = {
  symbols: [",", "#", "[", "]", "w", "x"],
  registers: ["x0", "x1", "w0", "w1", "w2"],
  addresses: ["[x0]", "[x1]"],
};
const memory = { address: SENSOR_ADDRESS, length: 4 };

export const memoryAndAddresses: LessonInput = {
  id: "memory-and-addresses",
  title: LABELS.title,
  module: 6,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: ["address", "byte", "little-endian", "halfword"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "read-distance-listing",
          kind: "listing",
          timeModel: STEPS,
          caption: LABELS.captions.listing,
          props: { program: READ_DISTANCE },
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
          id: "predict-read-distance",
          kind: "memory-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predict,
          props: {
            program: READ_DISTANCE,
            call: { entry: "read_distance", args: [POINTER], memory: LOAD_BYTES },
            question: PROSE.predictionQuestion,
            options: LABELS.options.prediction,
            explain: PROSE.predictionExplain,
            measure: { kind: "register-at-end", register: "w0" },
          },
        },
        {
          id: "step-read-distance",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.step,
          props: {
            program: READ_DISTANCE,
            call: { entry: "read_distance", args: [POINTER], memory: LOAD_BYTES },
            registers: ["x0", "w0"],
            memory,
            after: "predict-read-distance",
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
          id: "step-save-distance",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.investigation,
          props: {
            program: SAVE_DISTANCE,
            call: {
              entry: "save_distance",
              args: [POINTER, 0x12345678],
              memory: [...STORE_BYTES, 0x11, 0x22, 0x33, 0x44],
            },
            registers: ["x0", "w1"],
            memory: { ...memory, length: 8 },
            after: "predict-read-distance",
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
          id: "write-save-distance",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.write,
          props: { challengeId: "write-save-distance" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-wide-fuel-store",
          kind: "memory-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictFailure,
          props: {
            program: STORE_WIDE,
            call: { entry: "store_wide", args: [POINTER, 0x12345678], memory: STORE_BYTES },
            question: PROSE.failureQuestion,
            options: LABELS.options.failure,
            explain: PROSE.failureExplain,
            measure: { kind: "memory-at-end", ...memory },
          },
        },
        ...[
          {
            id: "step-wide-fuel-store",
            program: STORE_WIDE,
            entry: "store_wide",
            caption: LABELS.captions.failureWide,
          },
          {
            id: "step-byte-fuel-store",
            program: SAVE_FUEL,
            entry: "save_fuel",
            caption: LABELS.captions.failureByte,
          },
          {
            id: "step-half-pulse-store",
            program: SAVE_PULSE,
            entry: "save_pulse",
            caption: LABELS.captions.failureHalf,
          },
        ].map(({ id, program, entry, caption }) => ({
          id,
          kind: "memory-stepper",
          timeModel: STEPS,
          caption,
          props: {
            program,
            call: { entry, args: [POINTER, 0x12345678], memory: STORE_BYTES },
            registers: ["x0", "w1"],
            memory,
            after: "predict-wide-fuel-store",
          },
        })),
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    {
      kind: "generalisation",
      title: LABELS.titles.generalisation,
      prose: PROSE.generalisation,
      interactives: [
        {
          id: "step-read-long",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.wideLoad,
          props: {
            program: READ_LONG,
            call: { entry: "read_long", args: [POINTER], memory: WIDE_BYTES },
            registers: ["x0"],
            memory: { ...memory, length: 8 },
            after: "predict-read-distance",
          },
        },
        {
          id: "step-save-long",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.wideStore,
          props: {
            program: SAVE_LONG,
            call: {
              entry: "save_long",
              args: [POINTER, { value: "0x90abcdef12345678", width: 64 }],
              memory: Array<number>(8).fill(0),
            },
            registers: ["x0", "x1"],
            memory: { ...memory, length: 8 },
            after: "predict-read-distance",
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
          id: "write-copy-distance",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.final,
          props: { challengeId: "write-copy-distance" },
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
      id: "write-save-distance",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: ["x0", "w1"],
      allowedConstructs: ["str", "ret"],
      initial: { text: SAVE_DISTANCE_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: SAVE_CASES.map((value, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: {
            x0: SENSOR_ADDRESS,
            w1: value,
            reading: "unsigned",
            memory: [...STORE_BYTES, 0x11, 0x22, 0x33, 0x44].join(","),
          },
          expect: { memory: [...bytesOf(value), 0x11, 0x22, 0x33, 0x44].join(",") },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: SAVE_DISTANCE_TEXT },
    },
    {
      id: "write-copy-distance",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: ["x0", "x1", "w0", "w2"],
      allowedConstructs: ["ldr", "str", "mov", "ret"],
      initial: { text: COPY_DISTANCE_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: COPY_CASES.map((bytes, i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: {
            x0: SENSOR_ADDRESS,
            x1: SENSOR_ADDRESS + 4,
            reading: "unsigned",
            memory: bytes.join(","),
          },
          expect: {
            w0: valueOf(bytes),
            memory: [...bytes.slice(0, 4), ...bytes.slice(0, 4)].join(","),
          },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: COPY_DISTANCE_TEXT },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
