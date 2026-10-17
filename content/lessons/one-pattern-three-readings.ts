// Copyright © 2026 Christopher Snow

// Lesson: Same bits, two readings (module 1, the first of its two lessons; its id is still
// one-pattern-three-readings, so its route and its stored work do not change). The learner opens
// the value Module 0's mistaken `fuel_used(50, 38)` left in `w0`: 32 bits, written shorter in
// hexadecimal, read as an unsigned number and as a signed one. The signed reading is derived on the
// machine (adding 12 gives 0), and the learner finds that GCC makes the same instruction from the
// `int` and the `unsigned` version of the function.
//
// The structure is here; the words are in one-pattern-three-readings.prose.ts and .labels.ts (kept
// from docs/notes/module-1/prose.md), and the compiler listings are in module-1.listings.ts. The
// plan for the lesson is docs/notes/module-1-plan.md.

import type { LessonInput } from "@platform/lesson-schema";

import { LABELS } from "./one-pattern-three-readings.labels";
import { PROSE } from "./one-pattern-three-readings.prose";
import {
  FUEL_CALL,
  FUEL_USED_WRONG,
  FUEL_USED_WRONG_PLUS_12,
  FUEL_USED_WRONG_U,
} from "./module-1.listings";

/** The model the lesson's figures run: one instruction to a step (the book's note names it). */
const STEPS = "steps";

/** The graders the book supplies (packages/views/src/readingGraders.ts). */
const BIT_READINGS = "bit-readings";
const PATTERN_READINGS = "pattern-readings";

/** The smallest `int`: a field that takes a negative number says so, and gets a full keyboard. */
const MOST_NEGATIVE = -2147483648;

/** A label as plain text: a verdict shows no code marks. */
const plain = (text: string) => text.replaceAll("`", "");

const MAKE = LABELS.challenges.make;
const READ = LABELS.challenges.read;

/** The patterns of the last challenge, in the order its fields ask for them. */
const PATTERNS = ["0x0000002a", "0x80000000", "0xffffff38"] as const;

export const onePatternThreeReadings: LessonInput = {
  id: "one-pattern-three-readings",
  title: "Same bits, two readings",
  module: 1,
  order: 0,
  objectives: [...LABELS.objectives],
  introduces: ["hexadecimal", "unsigned reading", "signed reading", "top bit"],
  sections: [
    {
      kind: "question",
      title: LABELS.titles.question,
      prose: PROSE.question,
      interactives: [
        {
          id: "run-fuel-used",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.fuelRun,
          props: { program: FUEL_USED_WRONG, call: FUEL_CALL, registers: [0, 1] },
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
          id: "predict-add-12",
          kind: "trace-prediction",
          timeModel: STEPS,
          caption: LABELS.captions.predictAdd12,
          props: {
            question: PROSE.predictionQuestion,
            options: LABELS.options.add12,
            explain: PROSE.predictionExplain,
            program: FUEL_USED_WRONG_PLUS_12,
            call: FUEL_CALL,
            measure: { kind: "register-at-end", register: 0 },
          },
        },
        {
          id: "step-add-12",
          kind: "stepper",
          timeModel: STEPS,
          caption: LABELS.captions.stepAdd12,
          props: {
            program: FUEL_USED_WRONG_PLUS_12,
            call: FUEL_CALL,
            registers: [0, 1],
            after: "predict-add-12",
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
          id: "read-register",
          kind: "register-reader",
          timeModel: STEPS,
          caption: LABELS.captions.reader,
          // The register starts as `fuel_used_wrong(50, 38)` leaves `w0`, from the model; the top
          // bit's table is drawn, and the sum of every bit is under "Show calculation".
          props: {
            register: "w0",
            start: { program: FUEL_USED_WRONG, call: FUEL_CALL },
            topBit: true,
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
          id: "make-minus-one",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.make,
          props: { challengeId: "make-minus-one" },
        },
        {
          // A few words that appear once Make −1 has passed. Its caption is the challenge's title.
          id: "make-minus-one-solved",
          kind: "challenge-note",
          timeModel: "none",
          caption: MAKE.title,
          props: { afterChallenge: "make-minus-one", text: PROSE.constructionSolved },
        },
      ],
    },
    {
      kind: "failureExperiment",
      title: LABELS.titles.failureExperiment,
      prose: PROSE.failureExperiment,
      details: { summary: PROSE.failureDetailsSummary, prose: PROSE.failureDetails },
      interactives: [
        {
          id: "compare-int-unsigned",
          kind: "listing-compare",
          timeModel: STEPS,
          caption: LABELS.captions.compare,
          props: {
            left: FUEL_USED_WRONG,
            right: FUEL_USED_WRONG_U,
            question: PROSE.failureQuestion,
            options: LABELS.options.compare,
            explain: PROSE.failureExplain,
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
          id: "two-readings-each",
          kind: "challenge",
          timeModel: STEPS,
          caption: LABELS.captions.read,
          props: { challengeId: "two-readings-each" },
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
      id: "make-minus-one",
      title: MAKE.title,
      task: PROSE.makeTask,
      gradedDirection: "answer",
      fields: [
        { id: "bits", label: MAKE.fields.bits, kind: "bits", width: 32, weights: "signed" },
        { id: "unsigned", label: MAKE.fields.unsigned, kind: "number" },
      ],
      // The field of bits also takes hexadecimal, typed. The stored answer is still the 32 bits.
      initial: { data: { hexEntry: ["bits"] } },
      // The first test reads the learner's bits as signed and wants −1; the second wants the
      // number to be what the learner's own bits give as unsigned. Both readings come from the model.
      tests: {
        kind: "answers",
        grader: BIT_READINGS,
        cases: [
          {
            label: plain(MAKE.fields.bits),
            given: { reading: "signed" },
            expect: { bits: -1 },
          },
          {
            label: plain(MAKE.fields.unsigned),
            given: { reading: "unsigned" },
            expect: { unsigned: "bits" },
          },
        ],
      },
      hints: [...PROSE.makeHints],
      reference: { answers: { bits: "1".repeat(32), unsigned: "4294967295" } },
    },
    {
      id: "two-readings-each",
      title: READ.title,
      task: PROSE.readTask,
      gradedDirection: "answer",
      fields: [
        { id: "u1", label: READ.fields.u1, kind: "number" },
        { id: "s1", label: READ.fields.s1, kind: "number", min: MOST_NEGATIVE },
        { id: "u2", label: READ.fields.u2, kind: "number" },
        { id: "s2", label: READ.fields.s2, kind: "number", min: MOST_NEGATIVE },
        { id: "u3", label: READ.fields.u3, kind: "number" },
        { id: "s3", label: READ.fields.s3, kind: "number", min: MOST_NEGATIVE },
      ],
      // Each pattern is put in `w0` on the model, and each answer is compared with the reading of
      // what `w0` then holds; the expected numbers are never in this file.
      tests: {
        kind: "answers",
        grader: PATTERN_READINGS,
        cases: (
          [
            ["u1", "unsigned", 0],
            ["s1", "signed", 0],
            ["u2", "unsigned", 1],
            ["s2", "signed", 1],
            ["u3", "unsigned", 2],
            ["s3", "signed", 2],
          ] as const
        ).map(([field, way, which]) => ({
          label: plain(READ.fields[field]),
          given: { pattern: PATTERNS[which] },
          expect: { [field]: way },
        })),
      },
      hints: [...PROSE.readHints],
      reference: {
        answers: {
          u1: "42",
          s1: "42",
          u2: "2147483648",
          s2: "-2147483648",
          u3: "4294967096",
          s3: "-200",
        },
      },
    },
  ],
  modelVsReality: PROSE.modelVsReality,
  originalityNote: {
    textbookExample:
      'The obvious way in is a table of two\'s complement values, or the "flip the bits and add one" rule.',
    howThisDiffers:
      "This lesson starts from a wrong answer the reader has already seen in Module 0, and derives the signed reading on the machine by adding the missing 12 back and getting 0. It shows that no type is in the machine with two compiled listings that are identical, the `int` function and the `unsigned` one.",
  },
};
