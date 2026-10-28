// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { STACK_TOP } from "@al/machine";
import { LABELS } from "./calls-and-returns.labels";
import { PROSE } from "./calls-and-returns.prose";
import { SMALL_CALL } from "./prerequisite-bridges";
import {
  REPORT,
  WRONG_LINK,
  CALL_TEXT,
  CALL_STARTING_TEXT,
  RESERVE_TEXT,
  RESERVE_STARTING_TEXT,
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
  labels: ["report_once", "trip_report", "half_distance"],
};
const WRITE_CASES = [
  [0, 1],
  [1, 1],
  [7, 4],
  [128, 65],
  [0xffffffff, 2147483648],
];
const FINAL_CASES = [
  [0, 9, 9],
  [1, 0, 0],
  [7, 2, 5],
  [128, 9, 73],
  [0xffffffff, 0xffffffff, 2147483646],
];
const PRESERVED = "0x123456789abcdef0";
const SAVED_FP = "0x1122334455667788";
const CALL = { entry: "trip_report", args: [128, 9] };
const WRONG_CALL = { entry: "report_once", args: [128], maxSteps: 20 };
const registers = ["w0", "w1", "x19", "x29", "x30"];

export const callsAndReturns: LessonInput = {
  id: "calls-and-returns",
  title: LABELS.title,
  module: 9,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: [
    "callee",
    "link register",
    "stack",
    "stack pointer",
    "stack frame",
    "frame pointer",
    "leaf function",
    "calling convention",
  ],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionNoteSummary, prose: PROSE.questionNote },
    },
    {
      kind: "motivation",
      title: LABELS.titles.motivation,
      prose: PROSE.motivation,
      interactives: [
        {
          id: "step-small-returning-call",
          kind: "stack-stepper",
          timeModel: "steps",
          caption: LABELS.captions.smallCall,
          props: {
            title: PROSE.smallCall.title,
            intro: PROSE.smallCall.prose,
            program: SMALL_CALL,
            call: { entry: "relay_distance", args: [128] },
            registers: ["w0", "x29", "x30"],
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
          id: "calls-and-returns-listing",
          kind: "listing",
          role: "diagram",
          timeModel: "none",
          caption: LABELS.captions.listing,
          props: { program: REPORT },
        },
        {
          id: "predict-calls-and-returns",
          kind: "memory-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predict,
          props: {
            program: REPORT,
            call: CALL,
            question: PROSE.predictionQuestion,
            options: LABELS.options.prediction,
            explain: PROSE.predictionExplain,
            measure: { kind: "register-at-end", register: "w0" },
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
          id: "step-calls-and-returns",
          kind: "stack-stepper",
          timeModel: "steps",
          caption: LABELS.captions.step,
          props: {
            program: REPORT,
            call: CALL,
            registers,
            after: "predict-calls-and-returns",
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
          id: "write-call-report",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.write,
          props: { challengeId: "write-call-report" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-calls-and-returns-failure",
          kind: "loop-prediction",
          role: "prediction",
          timeModel: "steps",
          caption: LABELS.captions.predictFailure,
          props: {
            program: WRONG_LINK,
            call: WRONG_CALL,
            question: PROSE.failureQuestion,
            options: LABELS.options.failure,
            explain: PROSE.failureExplain,
            measure: "stop",
            inputs: [0],
          },
        },
        {
          id: "step-calls-and-returns-failure",
          kind: "stack-stepper",
          timeModel: "steps",
          caption: LABELS.captions.stepFailure,
          props: {
            program: WRONG_LINK,
            call: WRONG_CALL,
            registers,
            after: "predict-calls-and-returns-failure",
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
          id: "write-preserve-reserve",
          kind: "challenge",
          role: "exercise",
          timeModel: "steps",
          caption: LABELS.captions.final,
          props: { challengeId: "write-preserve-reserve" },
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
      id: "write-call-report",
      title: LABELS.challenges.write.title,
      task: PROSE.writeTask,
      gradedDirection: "write",
      palette: [...EDITOR.registers],
      allowedConstructs: ALLOWED,
      initial: { text: CALL_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: WRITE_CASES.map((c, i) => ({
          label: LABELS.challenges.write.tests[i] as string,
          given: {
            requiredCall: "half_distance",
            w0: c[0]!,
            "seed.x19": PRESERVED,
            "seed.x29": SAVED_FP,
            reading: "unsigned",
          },
          expect: { w0: c[1]!, x19: PRESERVED, x29: SAVED_FP, sp: STACK_TOP },
        })),
      },
      hints: [...PROSE.writeHints],
      reference: { text: CALL_TEXT },
    },
    {
      id: "write-preserve-reserve",
      title: LABELS.challenges.final.title,
      task: PROSE.finalTask,
      gradedDirection: "write",
      palette: [...EDITOR.registers],
      allowedConstructs: ALLOWED,
      initial: { text: RESERVE_STARTING_TEXT, data: { editor: EDITOR } },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: FINAL_CASES.map((c, i) => ({
          label: LABELS.challenges.final.tests[i] as string,
          given: {
            requiredCall: "half_distance",

            w0: c[0]!,
            w1: c[1]!,
            "seed.x19": PRESERVED,
            "seed.x29": SAVED_FP,
            reading: "unsigned",
          },
          expect: { w0: c[2]!, x19: PRESERVED, x29: SAVED_FP, sp: STACK_TOP },
        })),
      },
      hints: [...PROSE.finalHints],
      reference: { text: RESERVE_TEXT },
    },
  ],
  sectionLayout: "selected",
  modelVsReality: PROSE.modelVsReality,
  originalityNote: PROSE.originalityNote,
};
