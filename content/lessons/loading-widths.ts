// Copyright © 2026 Christopher Snow

// The same stored bytes are loaded at different widths and with different extension rules.
// The final exercise uses an explicitly specified record, independent of C structure layout.
import type { LessonInput } from "@platform/lesson-schema";
import { LABELS } from "./loading-widths.labels";
import { PROSE } from "./loading-widths.prose";
import {
  READ_FUEL,
  READ_GRADIENT,
  READ_PULSE,
  READ_OFFSET,
  READ_OFFSET_LONG,
  READ_GRADIENT_LONG,
  SIGNED_BYTE,
  UNSIGNED_BYTE,
  UNSIGNED_BYTE_EXPLICIT,
  SIGNED_LONG,
  ADD_ADJUSTMENT,
  ADJUST_GRADIENT_WRONG,
  SENSOR_ADDRESS,
  ADJUST_GRADIENT_TEXT,
  ADJUST_GRADIENT_STARTING_TEXT,
  READ_SENSORS_TEXT,
  READ_SENSORS_STARTING_TEXT,
} from "./memory.listings";

const STEPS = "steps";
const POINTER = { value: SENSOR_ADDRESS, width: 64 } as const;
const BYTES = [0xf9, 0xff, 0xff, 0xff, 0xaa, 0xbb, 0xcc, 0xdd];
const memory = { address: SENSOR_ADDRESS, length: 8 };
const ADJUST_CASES = [
  { byte: 0xf9, correction: 10, result: 3 },
  { byte: 0, correction: 0, result: 0 },
  { byte: 0x7f, correction: 1, result: 128 },
  { byte: 0x80, correction: 0, result: -128 },
  { byte: 0xff, correction: 1, result: 0 },
  { byte: 0x80, correction: 128, result: 0 },
  { byte: 0x7f, correction: -128, result: -1 },
];
const SENSOR_CASES = [
  { bytes: [0x78, 0x56, 0x34, 0x12, 0xf9, 100, 0x34, 0x12], values: [0x12345678, -7, 100, 4660] },
  { bytes: [0, 0, 0, 0, 0, 0, 0, 0], values: [0, 0, 0, 0] },
  { bytes: [255, 255, 255, 255, 127, 255, 255, 255], values: [0xffffffff, 127, 255, 65535] },
  { bytes: [0, 0, 0, 128, 128, 0, 0, 128], values: [0x80000000, -128, 0, 32768] },
  { bytes: [255, 0, 0, 0, 255, 1, 1, 0], values: [255, -1, 1, 1] },
];
const EDITOR = {
  symbols: [",", "#", "[", "]", "w", "x"],
  registers: ["x0", "x4", "w0", "w1", "w2", "w3"],
  addresses: [
    "[x0]",
    "[x0, #4]",
    "[x0, #5]",
    "[x0, #6]",
    "[x4]",
    "[x4, #4]",
    "[x4, #5]",
    "[x4, #6]",
  ],
};

export const loadingWidths: LessonInput = {
  id: "loading-widths",
  title: LABELS.title,
  module: 6,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: ["zero extension", "sign extension"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "read-fuel-listing",
          kind: "listing",
          role: "diagram",
          timeModel: STEPS,
          caption: LABELS.captions.listing,
          props: { program: READ_FUEL },
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
          id: "predict-signed-gradient",
          kind: "memory-prediction",
          role: "prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predict,
          props: {
            program: READ_GRADIENT,
            call: { entry: "read_gradient", args: [POINTER], memory: BYTES },
            question: PROSE.predictionQuestion,
            options: LABELS.options.prediction,
            explain: PROSE.predictionExplain,
            measure: { kind: "register-at-end", register: "w0" },
          },
        },
        {
          id: "step-signed-gradient",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.step,
          props: {
            program: READ_GRADIENT,
            call: { entry: "read_gradient", args: [POINTER], memory: BYTES },
            registers: ["x0", "w0"],
            memory,
            extension: true,
            after: "predict-signed-gradient",
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
          id: "step-unsigned-fuel",
          program: READ_FUEL,
          entry: "read_fuel",
          caption: LABELS.captions.unsignedByte,
          registers: ["x0", "w0"],
        },
        {
          id: "step-unsigned-pulse",
          program: READ_PULSE,
          entry: "read_pulse",
          caption: LABELS.captions.unsignedHalf,
          registers: ["x0", "w0"],
        },
        {
          id: "step-signed-offset",
          program: READ_OFFSET,
          entry: "read_offset",
          caption: LABELS.captions.signedHalf,
          registers: ["x0", "w0"],
        },
        {
          id: "step-signed-word",
          program: READ_OFFSET_LONG,
          entry: "read_offset_long",
          caption: LABELS.captions.signedWord,
          registers: ["x0"],
        },
        {
          id: "step-wide-gradient",
          program: READ_GRADIENT_LONG,
          entry: "read_gradient_long",
          caption: LABELS.captions.signedWideByte,
          registers: ["x0"],
        },
      ].map(({ id, program, entry, caption, registers }) => ({
        id,
        kind: "memory-stepper",
        timeModel: STEPS,
        caption,
        props: {
          program,
          call: { entry, args: [POINTER], memory: BYTES },
          registers,
          memory,
          extension: true,
          after: "predict-signed-gradient",
        },
      })),
    },
    {
      kind: "construction",
      title: LABELS.titles.construction,
      prose: PROSE.construction,
      interactives: [
        {
          id: "write-adjust-gradient",
          kind: "challenge",
          role: "exercise",
          timeModel: STEPS,
          caption: LABELS.captions.write,
          props: { challengeId: "write-adjust-gradient" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-unsigned-gradient",
          kind: "memory-prediction",
          role: "prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictFailure,
          props: {
            program: ADJUST_GRADIENT_WRONG,
            call: { entry: "adjust_gradient_wrong", args: [POINTER, 10], memory: BYTES },
            question: PROSE.failureQuestion,
            options: LABELS.options.failure,
            explain: PROSE.failureExplain,
            measure: { kind: "register-at-end", register: "w0" },
          },
        },
        {
          id: "step-unsigned-gradient",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.failureWide,
          props: {
            program: ADJUST_GRADIENT_WRONG,
            call: { entry: "adjust_gradient_wrong", args: [POINTER, 10], memory: BYTES },
            registers: ["x0", "w0", "w1", "w2"],
            memory,
            extension: true,
            after: "predict-unsigned-gradient",
          },
        },
      ],
    },
    {
      kind: "explanation",
      title: LABELS.titles.explanation,
      prose: PROSE.explanation,
      details: { summary: PROSE.explanationNoteSummary, prose: PROSE.explanationNote },
      interactives: [
        {
          id: "unsigned-byte-compiler-listing",
          kind: "listing",
          role: "diagram",
          timeModel: STEPS,
          caption: LABELS.captions.compilerUnsigned,
          props: { program: UNSIGNED_BYTE },
        },
        ...[
          {
            id: "step-sxtb",
            program: SIGNED_BYTE,
            entry: "signed_byte",
            caption: LABELS.captions.extension,
          },
          {
            id: "step-uxtb",
            program: UNSIGNED_BYTE_EXPLICIT,
            entry: "unsigned_byte_explicit",
            caption: LABELS.captions.extensionUnsigned,
          },
        ].map(({ id, program, entry, caption }) => ({
          id,
          kind: "memory-stepper",
          timeModel: STEPS,
          caption,
          props: {
            program,
            call: { entry, args: [0xf9] },
            registers: ["x0", "w0"],
            extension: true,
            after: "predict-signed-gradient",
          },
        })),
      ],
    },
    {
      kind: "generalisation",
      title: LABELS.titles.generalisation,
      prose: PROSE.generalisation,
      interactives: [
        {
          id: "step-sxtw",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.extensionWord,
          props: {
            program: SIGNED_LONG,
            call: { entry: "signed_long", args: [0xfffffff9] },
            registers: ["x0", "w0"],
            extension: true,
            after: "predict-signed-gradient",
          },
        },
        {
          id: "step-add-extended",
          kind: "memory-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.extendedAdd,
          props: {
            program: ADD_ADJUSTMENT,
            call: { entry: "add_adjustment", args: [{ value: 100, width: 64 }, -7] },
            registers: ["x0", "w1", "x1"],
            extension: true,
            after: "predict-signed-gradient",
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
          id: "write-read-sensors",
          kind: "challenge",
          role: "exercise",
          timeModel: STEPS,
          caption: LABELS.captions.final,
          props: { challengeId: "write-read-sensors" },
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
      id: "write-adjust-gradient",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: ["x0", "w0", "w1", "w2"],
      allowedConstructs: ["ldrsb", "ldrb", "add", "ret"],
      initial: { text: ADJUST_GRADIENT_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: ADJUST_CASES.map((c, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: {
            x0: SENSOR_ADDRESS,
            w1: c.correction,
            memory: [c.byte, ...BYTES.slice(1)].join(","),
          },
          expect: { w0: c.result, memory: [c.byte, ...BYTES.slice(1)].join(",") },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: ADJUST_GRADIENT_TEXT },
    },
    {
      id: "write-read-sensors",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: ["x0", "x4", "w0", "w1", "w2", "w3"],
      allowedConstructs: ["ldr", "ldrb", "ldrsb", "ldrh", "ldrsh", "mov", "ret"],
      initial: { text: READ_SENSORS_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: SENSOR_CASES.map((c, i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: {
            x0: SENSOR_ADDRESS,
            reading: "unsigned",
            "reading.w1": "signed",
            memory: c.bytes.join(","),
          },
          expect: {
            w0: c.values[0]!,
            w1: c.values[1]!,
            w2: c.values[2]!,
            w3: c.values[3]!,
            memory: c.bytes.join(","),
          },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: READ_SENSORS_TEXT },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
