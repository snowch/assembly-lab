// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 4: Compare, and the condition that carries the type. The learner is shown that
// GCC makes `steeper_s` and `steeper_u` from the same instructions but for one item of `csel`,
// predicts the change, sees both listings with the differing item marked, builds `less_fuel` from
// `cmp` and `csel`, predicts what `steeper_u` returns with `ge`, sets two values and sees which of
// the conditions hold after one compare, and reads four conditions off a compare.
//
// The structure is here; the words are in compare-and-choose.prose.ts and .labels.ts (kept from
// docs/notes/module-4/prose.md), and the programs are in compare-and-choose.listings.ts. The plan
// for the module is docs/notes/module-4-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import {
  ARGS,
  HOLDS_PROGRAM,
  LESS_FUEL_STARTING_TEXT,
  LESS_FUEL_TEXT,
  SMALLEST_AND_ONE,
  STEEPER_BOTH,
  STEEPER_S,
  STEEPER_U,
  STEEPER_U_GE,
} from "./compare-and-choose.listings";
import { LABELS } from "./compare-and-choose.labels";
import { PROSE } from "./compare-and-choose.prose";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/grader.ts and grader-branch.ts). */
const RUN_REGISTERS = "run-registers";
const BRANCH_OUTCOMES = "branch-outcomes";

/**
 * The editor's keys for `less_fuel`: it writes `w` registers and commas, and the gate allows no
 * constant, so the symbol bar has two keys (no `#`) and the tap mode no number pad. (Typing `x` is
 * still accepted.)
 */
const LESS_FUEL_EDITOR = {
  symbols: [",", "w"],
  registers: ["w0", "w1"],
  numberPad: false,
} as const;

/** The calls the figures run: both functions on the same two patterns. */
const RUNS = [
  { program: STEEPER_S, call: { entry: "steeper_s", args: [...ARGS] }, reading: "signed" },
  { program: STEEPER_U, call: { entry: "steeper_u", args: [...ARGS] }, reading: "unsigned" },
] as const;

/** The patterns of the last challenge: `w0` holds `0xfffffffb`, which is −5 signed, and `w1` holds 2. */
const HOLDS_GIVEN = { w0: 0xfffffffb, w1: 2 } as const;

/** The five calls of `less_fuel`: the third is equal values and the last two have the top bit set. */
const LESS_FUEL_CASES = [
  { given: { w0: 3, w1: 7 }, expect: { w0: 3 } },
  { given: { w0: 7, w1: 3 }, expect: { w0: 3 } },
  { given: { w0: 5, w1: 5 }, expect: { w0: 5 } },
  { given: { w0: 0x80000000, w1: 1 }, expect: { w0: 1 } },
  { given: { w0: 1, w1: 0x80000000 }, expect: { w0: 1 } },
] as const;

export const compareAndChoose: LessonInput = {
  id: "compare-and-choose",
  title: "Compare, and the condition that carries the type",
  module: 4,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: ["condition"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      interactives: [
        {
          id: "steeper-runs",
          kind: "listing-runs",
          timeModel: STEPS,
          caption: LABELS.captions.runs,
          props: { program: STEEPER_BOTH, runs: RUNS },
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
          id: "predict-steeper-change",
          kind: "listing-change",
          timeModel: STEPS,
          caption: LABELS.captions.predictChange,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.change,
            explain: PROSE.predictionExplain,
            program: STEEPER_BOTH,
            changed: STEEPER_U,
            runs: RUNS,
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
          id: "compare-steeper",
          kind: "listing-diff",
          timeModel: STEPS,
          caption: LABELS.captions.diff,
          props: { left: STEEPER_S, right: STEEPER_U, after: "predict-steeper-change" },
        },
      ],
    },
    {
      kind: "construction",
      title: LABELS.titles.construction,
      prose: PROSE.construction,
      interactives: [
        {
          id: "write-less-fuel",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.lessFuel,
          props: { challengeId: "write-less-fuel" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-steeper-ge",
          kind: "run-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictGe,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.ge,
            explain: PROSE.failureExplain,
            program: STEEPER_U_GE,
            call: { entry: "steeper_u", args: [...SMALLEST_AND_ONE] },
            measure: { kind: "register", register: 0, as: "decimal" },
            inputs: [0, 1],
          },
        },
        {
          id: "step-steeper-ge",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepGe,
          props: {
            program: STEEPER_U_GE,
            call: { entry: "steeper_u", args: [...SMALLEST_AND_ONE] },
            registers: [0, 1],
            flags: true,
            after: "predict-steeper-ge",
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
          id: "every-condition",
          kind: "condition-table",
          timeModel: STEPS,
          caption: LABELS.captions.conditions,
          // The figure starts at 8 and 8. It never starts at the last challenge's pair, and the
          // buttons offer only pairs the part's sentences have used.
          props: {
            start: ["8", "8"],
            presets: [
              ["8", "8"],
              ["0x7fffffff", "0xffffffff"],
            ],
          },
        },
      ],
    },
    { kind: "generalisation", title: LABELS.titles.generalisation, prose: PROSE.generalisation },
    {
      kind: "challenge",
      title: LABELS.titles.challenge,
      prose: PROSE.challenge,
      interactives: [
        {
          id: "read-four-conditions",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.holds,
          props: { challengeId: "read-four-conditions" },
        },
      ],
    },
    { kind: "reflection", title: LABELS.titles.reflection, prose: PROSE.reflection },
  ],
  challenges: [
    {
      id: "write-less-fuel",
      title: LABELS.challenges.lessFuel.title,
      task: PROSE.lessFuelTask,
      gradedDirection: "write",
      // The registers the tap editor offers, and the instructions the lesson's assembler allows.
      palette: ["w0", "w1"],
      allowedConstructs: ["cmp", "csel", "ret"],
      initial: { text: LESS_FUEL_STARTING_TEXT, data: { editor: LESS_FUEL_EDITOR } },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        cases: LESS_FUEL_CASES.map((c, i) => ({
          label: LABELS.challenges.lessFuel.tests[i] as string,
          given: { ...c.given, reading: "unsigned" },
          expect: { ...c.expect },
        })),
      },
      hints: [...PROSE.lessFuelHints],
      reference: { text: LESS_FUEL_TEXT },
    },
    {
      id: "read-four-conditions",
      title: LABELS.challenges.holds.title,
      task: PROSE.holdsTask,
      gradedDirection: "answer",
      fields: (["ge", "cs", "lt", "cc"] as const).map((id) => ({
        id,
        label: LABELS.challenges.holds.fields[id],
        kind: "number" as const,
      })),
      // The compare the editor shows above the fields. The expected values are what the model gives
      // for each condition after it, never numbers in this file.
      initial: { data: { program: HOLDS_PROGRAM } },
      tests: {
        kind: "answers",
        grader: BRANCH_OUTCOMES,
        cases: (["ge", "cs", "lt", "cc"] as const).map((id) => ({
          label: LABELS.challenges.holds.tests[id],
          given: { ...HOLDS_GIVEN },
          expect: { [id]: `holds:${id}` },
        })),
      },
      hints: [...PROSE.holdsHints],
      reference: { answers: { ge: "0", cs: "1", lt: "1", cc: "0" } },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      "The obvious example for comparing and choosing is the larger of two numbers or an absolute value, drawn as a flowchart with a diamond for the test.",
    howThisDiffers:
      "This lesson uses the trip computer's gradients and fuel, and starts from two compiled functions that differ in one item: `steeper_s` and `steeper_u` have the same `cmp` and the same `csel`, and only the condition at the end of `csel` says whether the values are signed or unsigned. The learner predicts that change, writes the unsigned smaller-of-two with the right condition, runs the wrong condition, and sets two values to see which conditions hold after one compare. No flowchart is drawn.",
  },
};
