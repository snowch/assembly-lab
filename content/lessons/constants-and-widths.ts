// Copyright © 2026 Christopher Snow

// Lesson: Constants and widths (module 1, the second of its two lessons). The learner finds out
// which numbers one `mov` can put in a register, builds 1000000 with `mov` and `movk`, sees that
// `-1` and `4294967295` are the same instruction, and finds that writing a `w` name clears the
// upper half of the `x` register.
//
// The structure is here; the words are in constants-and-widths.prose.ts and .labels.ts (kept from
// docs/notes/module-1/prose.md), and the compiler listings are in module-1.listings.ts. The plan
// for the lesson is docs/notes/module-1-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import { LABELS } from "./constants-and-widths.labels";
import { PROSE } from "./constants-and-widths.prose";
import { SHIFTED_IMMEDIATE_ADD } from "./operand-additions";
import {
  FOUR_INSTRUCTIONS,
  MOVK_EXAMPLE,
  ODOMETER_LIMIT_START_TEXT,
  ODOMETER_LIMIT_TEXT,
  SERVICE_INTERVAL,
  WIDTHS,
} from "./module-1.listings";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/grader.ts, readingGraders.ts). */
const RUN_REGISTERS = "run-registers";
const REGISTERS_AFTER = "registers-after";

/** A label as plain text: a verdict shows no code marks. */
const plain = (text: string) => text.replaceAll("`", "");

export const constantsAndWidths: LessonInput = {
  id: "constants-and-widths",
  title: "Constants and widths",
  module: 1,
  order: 1,
  objectives: [...LABELS.objectives],
  introduces: ["w register", "x register", "remainder"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      details: { summary: PROSE.questionDetailsSummary, prose: PROSE.questionDetails },
      interactives: [
        {
          // Only `service_interval`: `odometer_limit`'s two instructions are the first challenge's
          // answer, and the learner has not built them yet.
          id: "service-interval",
          kind: "listing",
          timeModel: "none",
          caption: LABELS.captions.listing,
          props: { program: SERVICE_INTERVAL },
        },
      ],
    },
    {
      kind: "motivation",
      title: LABELS.titles.motivation,
      prose: PROSE.motivation,
      interactives: [
        {
          // `mov w0, 30000` from the recorded listing, with `w0` in two halves of 16 bits: 0000
          // over 7530.
          id: "service-halves",
          kind: "wide-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.serviceHalves,
          props: { program: SERVICE_INTERVAL, register: 0, mode: "w16" },
        },
      ],
    },
    {
      kind: "prediction",
      title: LABELS.titles.prediction,
      prose: PROSE.prediction,
      interactives: [
        {
          id: "predict-fits",
          kind: "model-prediction",
          timeModel: STEPS,
          role: "prediction",
          caption: LABELS.captions.predictFits,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.fits,
            explain: PROSE.predictionExplain,
            measure: { kind: "constant-fits" },
          },
        },
      ],
    },
    {
      kind: "investigation",
      title: LABELS.titles.investigation,
      prose: PROSE.investigation,
      details: {
        summary: PROSE.investigationDetailsSummary,
        prose: PROSE.investigationDetails,
      },
      interactives: [
        {
          id: "try-a-number",
          kind: "constant-tester",
          timeModel: STEPS,
          role: "experiment",
          caption: LABELS.captions.tester,
          props: { after: "predict-fits" },
        },
      ],
    },
    {
      kind: "construction",
      title: LABELS.titles.construction,
      prose: PROSE.construction,
      interactives: [
        {
          // The worked example of `movk`, hand-written (it is in the differential test's corpus):
          // 3 in the lower half, then 2 in the upper half, which is new while the lower is kept.
          id: "movk-halves",
          kind: "wide-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.workedHalves,
          props: { program: MOVK_EXAMPLE, register: 0, mode: "w16" },
        },
        {
          id: "build-1000000",
          kind: "challenge",
          timeModel: STEPS,
          role: "exercise",
          caption: LABELS.captions.build,
          props: { challengeId: "build-1000000" },
        },
        {
          // A few words that appear once Build 1000000 has passed. Its caption is the challenge's
          // title.
          id: "build-1000000-solved",
          kind: "challenge-note",
          timeModel: "none",
          caption: LABELS.challenges.build.title,
          props: { afterChallenge: "build-1000000", text: PROSE.constructionSolved },
        },
        {
          // The learner's own saved solution, assembled and traced, a step at a time. Nothing of
          // it shows until the saved work passes the challenge's tests.
          id: "solution-halves",
          kind: "wide-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.solutionHalves,
          props: { register: 0, mode: "w16", fromChallenge: "build-1000000" },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      interactives: [
        {
          id: "predict-width",
          kind: "model-prediction",
          timeModel: STEPS,
          role: "prediction",
          caption: LABELS.captions.predictWidth,
          props: {
            question: PROSE.failureQuestion,
            options: LABELS.options.width,
            explain: PROSE.failureExplain,
            measure: { kind: "register-at-end", program: WIDTHS, register: 3 },
          },
        },
        {
          id: "x3-halves",
          kind: "wide-stepper",
          timeModel: STEPS,
          caption: LABELS.captions.halves,
          props: { program: WIDTHS, register: 3, mode: "x64-named", after: "predict-width" },
        },
      ],
    },
    {
      kind: "explanation",
      title: LABELS.titles.explanation,
      prose: "",
      interactives: [
        {
          id: "add-shifted-immediate",
          kind: "primitive-operation",
          timeModel: STEPS,
          caption: LABELS.captions.immediateAdd,
          props: {
            stage: {
              ...PROSE.immediateAdd,
              program: SHIFTED_IMMEDIATE_ADD,
              call: { entry: "add_scaled_constant", args: [7, 0, 0] },
              registers: [0, 2],
            },
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
          id: "predict-two-registers",
          kind: "challenge",
          timeModel: STEPS,
          role: "exercise",
          caption: LABELS.captions.predictTwo,
          props: { challengeId: "predict-two-registers" },
        },
      ],
    },
    {
      kind: "reflection",
      title: LABELS.titles.reflection,
      prose: PROSE.reflection,
      details: { summary: PROSE.reflectionDetailsSummary, prose: PROSE.reflectionDetails },
    },
  ],
  challenges: [
    {
      id: "build-1000000",
      title: LABELS.challenges.build.title,
      task: PROSE.buildTask,
      gradedDirection: "write",
      // The registers the tap editor offers, and the instructions the lesson's assembler allows.
      palette: ["w0"],
      allowedConstructs: ["mov", "movk", "ret"],
      // The keys the editor offers: this challenge writes `w0` and commas, and
      // needs a number pad (the tap mode builds `mov` and `movk` from numbers).
      initial: {
        text: ODOMETER_LIMIT_START_TEXT,
        data: { editor: { symbols: [",", "w"], registers: ["w0"], numberPad: true } },
      },
      tests: {
        kind: "answers",
        grader: RUN_REGISTERS,
        cases: [{ label: "odometer_limit()", given: {}, expect: { w0: 1000000 } }],
      },
      hints: [...PROSE.buildHints],
      reference: { text: ODOMETER_LIMIT_TEXT },
    },
    {
      id: "predict-two-registers",
      title: LABELS.challenges.predict.title,
      task: PROSE.predictTask,
      gradedDirection: "answer",
      fields: [
        { id: "x1", label: LABELS.challenges.predict.fields.x1, kind: "number" },
        { id: "w2", label: LABELS.challenges.predict.fields.w2, kind: "number" },
      ],
      // The program the editor shows and the grader runs. The expected values are what the run
      // leaves in the registers each case names, never numbers in this file.
      initial: { data: { program: FOUR_INSTRUCTIONS } },
      tests: {
        kind: "answers",
        grader: REGISTERS_AFTER,
        cases: [
          {
            label: plain(LABELS.challenges.predict.fields.x1),
            given: {},
            expect: { x1: "x1" },
          },
          {
            label: plain(LABELS.challenges.predict.fields.w2),
            given: {},
            expect: { w2: "w2" },
          },
        ],
      },
      hints: [...PROSE.predictHints],
      reference: { answers: { x1: "5", w2: "1000000" } },
    },
  ],
  sectionLayout: "selected",
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      "The obvious way to teach constants is the encoding of an immediate: how many bits an instruction has for its number.",
    howThisDiffers:
      "This lesson works from the assembler's own refusal of `mov w0, 1000000`, and builds the number from two instructions. It never shows an instruction's bits, so which constants fit is taken from GNU as. The two names of one register are shown on a 64-bit register drawn as two halves, run through `mov x3, -1` and then `mov w3, -1`.",
  },
};
