// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { STACK_TOP } from "@al/machine";
import { LABELS } from "./recursive-calls.labels";
import { PROSE } from "./recursive-calls.prose";
import {
  FADE_SUM,
  WRONG_FADE,
  FADE_TEXT,
  FADE_STARTING_TEXT,
  COUNT_TEXT,
  COUNT_STARTING_TEXT,
} from "./calls.listings";

const ALLOWED = [
  "mov",
  "add",
  "sub",
  "lsr",
  "cbz",
  "cbnz",
  "b",
  "bl",
  "ret",
  "stp",
  "ldp",
  "str",
  "ldr",
];
const EDITOR = {
  addresses: [
    "[sp, #-16]!",
    "[sp, #-32]!",
    "[sp, #16]",
    "[sp], #16",
    "[sp], #32",
    "[sp, -32]!",
    "[sp, 16]",
    "[sp], 32",
  ],
  symbols: [",", "#", ".", ":", "[", "]", "!"],
  registers: ["w0", "w1", "w19", "x19", "x29", "x30", "sp"],
  labels: ["fade_sum", "lit_count", ".L2", ".L4", ".Ldone"],
};
const WRITE_CASES = [
  [0, 0],
  [1, 1],
  [7, 11],
  [128, 255],
  [0xffffffff, 4294967262],
];
const FINAL_CASES = [
  [0, 0],
  [1, 1],
  [7, 3],
  [128, 8],
  [0xffffffff, 32],
];
const PRESERVED = "0x123456789abcdef0";
const SAVED_FP = "0x1122334455667788";
const CALL = { entry: "fade_sum", args: [7] };
const WRONG_CALL = { entry: "fade_sum", args: [7], maxSteps: 32 };
const registers = ["w0", "x19", "x29", "x30"];

export const recursiveCalls: LessonInput = {
  id: "recursive-calls",
  title: LABELS.title,
  module: 9,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: ["recursion", "base case"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
      interactives: [
        {
          id: "recursive-calls-listing",
          kind: "listing",
          role: "diagram",
          timeModel: "none",
          caption: LABELS.captions.listing,
          props: { program: FADE_SUM },
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
          id: "predict-recursive-calls",
          kind: "memory-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predict,
          props: {
            program: FADE_SUM,
            call: CALL,
            question: PROSE.predictionQuestion,
            options: LABELS.options.prediction,
            explain: PROSE.predictionExplain,
            measure: { kind: "register-at-end", register: "w0" },
          },
        },
        {
          id: "step-recursive-calls",
          kind: "stack-stepper",
          timeModel: "steps",
          caption: LABELS.captions.step,
          props: { program: FADE_SUM, call: CALL, registers, after: "predict-recursive-calls" },
        },
      ],
    },
    {
      kind: "investigation",
      title: LABELS.titles.investigation,
      prose: PROSE.investigation,
      interactives: [
        {
          id: "inspect-recursive-calls-stack",
          kind: "stack-stepper",
          timeModel: "steps",
          caption: LABELS.captions.investigate,
          props: {
            program: FADE_SUM,
            call: CALL,
            registers,
            initialStep: 22,
            after: "predict-recursive-calls",
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
          id: "write-fade-sum",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.write,
          props: { challengeId: "write-fade-sum" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-recursive-calls-failure",
          kind: "loop-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predictFailure,
          props: {
            program: WRONG_FADE,
            call: WRONG_CALL,
            question: PROSE.failureQuestion,
            options: LABELS.options.failure,
            explain: PROSE.failureExplain,
            measure: "stop",
            inputs: [0],
          },
        },
        {
          id: "step-recursive-calls-failure",
          kind: "stack-stepper",
          timeModel: "steps",
          caption: LABELS.captions.stepFailure,
          props: {
            program: WRONG_FADE,
            call: WRONG_CALL,
            registers,
            after: "predict-recursive-calls-failure",
          },
        },
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    { kind: "generalisation", title: LABELS.titles.generalisation, prose: PROSE.generalisation },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: "",
      interactives: [
        {
          id: "write-lit-count",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.final,
          props: { challengeId: "write-lit-count" },
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
      id: "write-fade-sum",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: [...EDITOR.registers],
      allowedConstructs: ALLOWED,
      initial: { text: FADE_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: WRITE_CASES.map((c, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: {
            ...(c[0] === 0 ? {} : { requiredCall: "fade_sum" }),
            w0: c[0]!,
            "seed.x19": PRESERVED,
            "seed.x29": SAVED_FP,
            reading: "unsigned",
          },
          expect: { w0: c[1]!, x19: PRESERVED, x29: SAVED_FP, sp: STACK_TOP },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: FADE_TEXT },
    },
    {
      id: "write-lit-count",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: [...EDITOR.registers],
      allowedConstructs: ALLOWED,
      initial: { text: COUNT_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: FINAL_CASES.map((c, i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: {
            ...(c[0] === 0 ? {} : { requiredCall: "lit_count" }),
            w0: c[0]!,
            "seed.x19": PRESERVED,
            "seed.x29": SAVED_FP,
            reading: "unsigned",
          },
          expect: { w0: c[1]!, x19: PRESERVED, x29: SAVED_FP, sp: STACK_TOP },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: COUNT_TEXT },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
