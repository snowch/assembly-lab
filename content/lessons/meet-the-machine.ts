// Copyright © 2026 Christopher Snow

// Lesson: Meet the machine (module 0, the only lesson of the module). The learner steps a compiled
// function one instruction at a time, fixes a subtraction whose operands are the wrong way round,
// watches a run go past a deleted `ret`, and traces a five-instruction function.
//
// The structure is here; the words are in meet-the-machine.prose.ts and .labels.ts (kept from
// docs/notes/module-0/prose.md), and the compiler listings are in meet-the-machine.listings.ts.
// The plan for the lesson is docs/notes/module-0-plan.md.

import { TEXT_BASE, assemble, run } from "@al/machine";
import type { LessonInput } from "@platform/lesson-schema";

import { LABELS } from "./meet-the-machine.labels";
import {
  FUEL_USED_FIXED_TEXT,
  FUEL_USED_MISTAKEN_TEXT,
  KM_TO_SERVICE,
  TRIP_DISTANCE,
  TRIP_DISTANCE_AND_FUEL_USED,
} from "./meet-the-machine.listings";
import { PROSE } from "./meet-the-machine.prose";
import { PRIMITIVE_PROGRAMS, primitiveProgram } from "./meet-the-machine.primitives";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The call every figure of the lesson runs. */
const TRIP_CALL = { entry: "trip_distance", args: [120, 85, 42, 15] } as const;

/** The graders the book supplies (packages/views/src/grader.ts). */
const RUN_REGISTERS = "run-registers";
const REGISTERS_AT_RETURN = "registers-at-return";

/**
 * What the mistaken `fuel_used` (`sub w0, w1, w0`) leaves in `w0` for a call: the reversed
 * subtraction, `at_end` minus `at_start`, as the model computes it. A failed test whose result is
 * this number gets the sentence about the order of the operands.
 */
function reversedResult(atStart: number, atEnd: number): number {
  const { program } = assemble(FUEL_USED_MISTAKEN_TEXT);
  if (program === null) throw new Error("The mistaken fuel_used does not assemble.");
  const result = run(program, {
    entry: TEXT_BASE,
    args: [atStart, atEnd].map((value) => ({ value: BigInt(value), width: 32 as const })),
  });
  return Number(BigInt.asIntN(32, result.final.x[0] ?? 0n));
}

/** A call of `fuel_used`, with the sentence for its reversed result. */
function fuelCase(atStart: number, atEnd: number, expected: number) {
  return {
    label: `fuel_used(${atStart}, ${atEnd})`,
    given: {
      w0: atStart,
      w1: atEnd,
      "misconception.value": reversedResult(atStart, atEnd),
      "misconception.feedback": PROSE.fixReversedFeedback,
    },
    expect: { w0: expected },
  };
}

/** A prediction's option with the sentence for choosing it wrongly, if the lesson has one. */
function withFeedback(
  option: { readonly value: string; readonly label: string },
  feedback: Readonly<Record<string, string>>,
) {
  const own = feedback[option.value];
  return own === undefined ? { ...option } : { ...option, feedback: own };
}

const KM_ARGS = { w0: 30000, w1: 28750, w2: 140, w3: 390 } as const;

export const meetTheMachine: LessonInput = {
  id: "meet-the-machine",
  title: "Meet the machine",
  module: 0,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: [
    "instruction",
    "register",
    "listing",
    "assembly language",
    "operand",
    "program counter",
    "caller",
    "argument",
  ],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
    },
    {
      kind: "motivation",
      title: LABELS.titles.motivation,
      prose: PROSE.motivation,
      interactives: [
        {
          id: "first-operations",
          kind: "primitive-operation",
          timeModel: STEPS,
          caption: PROSE.primitiveCaption,
          props: {
            stages: PRIMITIVE_PROGRAMS.map((item, index) => ({
              ...PROSE.primitiveStages[index],
              kind: item.kind,
              showCompilerLines: item.kind === "function",
              program: primitiveProgram(item),
              call: { entry: item.entry, args: [...item.args] },
              registers: [...item.registers],
              steps: item.instructions.length,
              predict:
                item.kind === "operation" &&
                item.entry !== "primitive_add" &&
                item.instructions.length === 1,
            })),
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
          id: "trip-listing",
          kind: "listing",
          timeModel: "none",
          caption: LABELS.captions.listing,
          props: {
            program: TRIP_DISTANCE,
            showCompilerLines: true,
            notes: [PROSE.compilerNote, PROSE.lineNote],
          },
        },
        {
          id: "arg-registers",
          kind: "arg-registers",
          timeModel: "none",
          caption: LABELS.captions.argRegisters,
          props: {
            params: ["leg1", "leg2", "leg3", "detour"],
            program: TRIP_DISTANCE,
            call: TRIP_CALL,
            after: "predict-total",
            says: PROSE.argsSay,
            question: PROSE.argsQuestion,
            reveal: {
              register: 0,
              before: "leg1",
              after: "leg1 + leg2",
              explain: PROSE.argsExplain,
            },
          },
        },
        {
          id: "predict-total",
          kind: "trace-prediction",
          timeModel: STEPS,
          role: "prediction",
          caption: LABELS.captions.predictTotal,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.total.map((o) => withFeedback(o, PROSE.predictionFeedback)),
            explain: PROSE.predictionExplain,
            program: TRIP_DISTANCE,
            call: TRIP_CALL,
            measure: { kind: "first-write" },
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
          id: "step-trip",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepper,
          props: {
            program: TRIP_DISTANCE,
            call: TRIP_CALL,
            registers: [0, 1, 2, 3],
            after: "predict-total",
            // Module 0 shows what each step read and wrote, and each register as a decimal number.
            flow: false,
            decimal: true,
            // The first step teaches the operand rule; later arithmetic steps ask learners to apply it.
            expect: false,
            compact: false,
            endNote: PROSE.investigationEnd,
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
          id: "fix-the-subtraction",
          kind: "challenge",
          timeModel: STEPS,
          role: "exercise",
          caption: LABELS.captions.fix,
          props: { challengeId: "fix-fuel-used" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-no-ret",
          kind: "trace-prediction",
          timeModel: STEPS,
          role: "prediction",
          caption: LABELS.captions.predictNoRet,
          props: {
            intro: PROSE.failureInvitation,
            question: PROSE.failureQuestion,
            options: LABELS.options.noRet.map((o) => withFeedback(o, PROSE.failureFeedback)),
            explain: PROSE.failureExplain,
            commitLabel: LABELS.commit.noRet,
            program: TRIP_DISTANCE_AND_FUEL_USED,
            call: TRIP_CALL,
            measure: {
              kind: "register-at-end",
              register: 0,
              without: { label: "trip_distance", text: "ret" },
            },
          },
        },
        {
          id: "step-no-ret",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.noRet,
          props: {
            program: TRIP_DISTANCE_AND_FUEL_USED,
            call: TRIP_CALL,
            registers: [0, 1, 2, 3],
            removable: { label: "trip_distance", text: "ret" },
            after: "predict-no-ret",
            flow: true,
            decimal: true,
            grouped: true,
          },
        },
      ],
    },
    { kind: "explanation", title: LABELS.titles.explanation, prose: PROSE.explanation },
    { kind: "generalisation", title: LABELS.titles.generalisation, prose: PROSE.generalisation },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: PROSE.challenge,
      interactives: [
        {
          id: "trace-km",
          kind: "challenge",
          timeModel: STEPS,
          role: "exercise",
          caption: LABELS.captions.trace,
          props: { challengeId: "trace-the-call" },
        },
      ],
    },
    {
      kind: "reflection",
      title: LABELS.titles.reflection,
      prose: PROSE.reflection,
      // The answer to the closing question, shut until the learner opens it.
      details: { summary: LABELS.details.reflection, prose: PROSE.reflectionAnswer },
    },
  ],
  challenges: [
    {
      id: "fix-fuel-used",
      title: LABELS.challenges.fix.title,
      task: PROSE.fixTask,
      gradedDirection: "write",
      // The registers the tap editor offers, and the instructions the lesson's assembler allows.
      palette: ["w0", "w1", "w2", "w3"],
      allowedConstructs: ["add", "sub", "ret"],
      // The keys the editor offers: this challenge writes `w` registers and commas, and needs no
      // constant, so the symbol bar has two keys and the tap mode no number pad. (Typing `x` is
      // still accepted.)
      initial: {
        text: FUEL_USED_MISTAKEN_TEXT,
        data: {
          editor: { symbols: [",", "w"], registers: ["w0", "w1", "w2", "w3"], numberPad: false },
        },
      },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        cases: [fuelCase(50, 38, 12), fuelCase(45, 45, 0), fuelCase(60, 5, 55)],
      },
      hints: [...PROSE.fixHints],
      reference: { text: FUEL_USED_FIXED_TEXT },
    },
    {
      id: "trace-the-call",
      title: LABELS.challenges.trace.title,
      task: PROSE.traceTask,
      gradedDirection: "answer",
      fields: [
        { id: "w0", label: LABELS.challenges.trace.fields.w0, kind: "number" },
        { id: "w1", label: LABELS.challenges.trace.fields.w1, kind: "number" },
      ],
      // The program the editor shows and the grader runs. The expected values are what the run
      // leaves in the registers each case names, never numbers in this file.
      initial: { data: { program: KM_TO_SERVICE } },
      tests: {
        kind: "answers",
        grader: REGISTERS_AT_RETURN,
        cases: [
          {
            label: LABELS.challenges.trace.tests.w0,
            given: { entry: "km_to_service", ...KM_ARGS, "feedback.w0": PROSE.traceFeedbackW0 },
            expect: { w0: "w0" },
          },
          {
            label: LABELS.challenges.trace.tests.w1,
            given: { entry: "km_to_service", ...KM_ARGS, "feedback.w1": PROSE.traceFeedbackW1 },
            expect: { w1: "w1" },
          },
        ],
      },
      hints: [...PROSE.traceHints],
      reference: { answers: { w0: "670", w1: "28750" } },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      'The obvious first program in an assembly textbook or tutorial is "hello, world" through a system call, or adding two numbers held in registers set by `mov`.',
    howThisDiffers:
      "This lesson starts from C a reader might write, a three-statement function, uses the compiler's own listing rather than hand-written assembly, and finds out what an instruction is by stepping it. Its failure experiment (running past a deleted `ret` into the next function) and its operand-order fix are its own. The trip computer is the course's running situation; its quantities differ from digital-design's.",
  },
};
