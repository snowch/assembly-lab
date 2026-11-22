// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import type { LessonPart } from "./pacing";
import { subtractingAndTheTickCounter } from "./subtracting-and-the-tick-counter";
import { NEGATE_FLAGS } from "./subtracting-and-the-tick-counter.listings";
import { NEGATION_INPUTS, SUBTRACT_FLAGS } from "./subtraction-flags-and-negation.listings";
import { SUBTRACTION_FOCUS_COPY as C } from "./subtraction-flags-and-negation.copy";

type Challenge = NonNullable<LessonInput["challenges"]>[number];
const cases = [
  { id: "zero", input: NEGATION_INPUTS[0], group: C.zeroGroup },
  { id: "near", input: NEGATION_INPUTS[1], group: C.nearGroup },
];
const outputs = [
  { id: "result", label: C.resultField, target: "w0" },
  { id: "c", label: C.cField, target: "c" },
  { id: "v", label: C.vField, target: "v" },
];

/** New identity: historical elapsed answers remain stored but cannot complete this exercise. */
export const NEGATION_CHALLENGE: Challenge = {
  id: "negation-flags",
  title: C.exerciseTitle,
  task: C.exerciseTask,
  gradedDirection: "answer",
  fields: cases.flatMap((example) =>
    outputs.map((output) => ({
      id: `${example.id}-${output.id}`,
      label: `${example.group}: ${output.label}`,
      ...(output.id === "result"
        ? { kind: "number" as const, min: 0 }
        : {
            kind: "choice" as const,
            options: [
              { value: "0", label: "0" },
              { value: "1", label: "1" },
            ],
          }),
    })),
  ),
  initial: {
    data: {
      program: NEGATE_FLAGS,
      editor: {
        groups: cases.map((example) => ({
          label: example.group,
          fields: outputs.map((output) => ({
            id: `${example.id}-${output.id}`,
            label: output.label,
          })),
        })),
      },
    },
  },
  tests: {
    kind: "answers",
    grader: "outcomes-at-return",
    cases: cases.flatMap((example) =>
      outputs.map((output) => ({
        label: `${example.group}: ${output.label}`,
        given: {
          entry: "negate_flags",
          w0: example.input,
          [`feedback.${example.id}-${output.id}`]: C.feedback[output.id as "result" | "c" | "v"],
        },
        expect: { [`${example.id}-${output.id}`]: output.target },
      })),
    ),
  },
  hints: [...C.hints],
  reference: {
    answers: {
      "zero-result": "0",
      "zero-c": "1",
      "zero-v": "0",
      "near-result": "2147483647",
      "near-c": "0",
      "near-v": "0",
    },
  },
};

const minimum = subtractingAndTheTickCounter.sections.find(
  (section) => section.kind === "failureExperiment",
)!;

export const SUBTRACTION_FLAGS_PART: LessonPart = {
  id: "subtraction-flags-and-negation",
  title: C.title,
  objectives: [...C.objectives],
  introduces: ["borrow"],
  originalityNote: {
    textbookExample: C.originality.textbookExample,
    howThisDiffers: C.originality.howThisDiffers,
  },
  sections: [
    { kind: "question", title: C.recapTitle, prose: C.recap },
    {
      kind: "investigation",
      title: C.carryTitle,
      prose: C.carry,
      interactives: [
        {
          id: "carry-means-no-borrow",
          kind: "adder",
          timeModel: "steps",
          role: "calculation",
          caption: C.carryCaption,
          props: {
            program: SUBTRACT_FLAGS,
            call: { entry: "subtract_flags", args: [8, 3] },
            detail: true,
            summary: true,
            opensAtEnd: true,
            guidance: C.carryGuidance,
          },
        },
      ],
    },
    {
      kind: "construction",
      title: C.negationTitle,
      prose: C.negation,
      interactives: [
        {
          id: "negate-an-ordinary-value",
          kind: "stepper",
          timeModel: "steps",
          role: "experiment",
          caption: C.negationCaption,
          props: {
            program: NEGATE_FLAGS,
            call: { entry: "negate_flags", args: [5] },
            registers: [0],
            flags: true,
          },
        },
      ],
    },
    { ...minimum, prose: C.minimum },
    {
      kind: "challenge",
      title: C.exerciseTitle,
      prose: C.exerciseIntro,
      interactives: [
        {
          id: "negation-flags",
          kind: "challenge",
          timeModel: "steps",
          role: "exercise",
          caption: C.exerciseCaption,
          props: { challengeId: NEGATION_CHALLENGE.id },
        },
      ],
    },
    {
      kind: "reflection",
      title: C.reflectionTitle,
      prose: C.reflection,
      details: { summary: C.reflectionSummary, prose: C.reflectionAnswer },
    },
  ],
};
