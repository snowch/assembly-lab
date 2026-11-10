// Copyright © 2026 Christopher Snow

import { PROGRAMMER_CALCULATOR as PC } from "@al/views";
import type { LessonInput } from "@platform/lesson-schema";
import { fourBitSubtraction } from "@al/views";
import { FOUR_BIT_PROSE as P } from "./four-bit-arithmetic.prose";

const practice = fourBitSubtraction(6, 3);
const fields = ["negated", "result", "carry"] as const;
export const fourBitArithmetic: LessonInput = {
  id: "four-bit-arithmetic",
  title: P.title,
  module: 1,
  order: 2,
  sectionLayout: "selected",
  showTimeModelNotes: false,
  objectives: [...P.objectives],
  introduces: ["carry", "invert", "flag"],
  sections: [
    {
      kind: "motivation",
      title: P.addition.title,
      prose: P.addition.before,
      interactives: [
        {
          id: "four-bit-addition",
          kind: "four-bit-arithmetic",
          timeModel: "steps",
          role: "experiment",
          caption: P.addition.caption,
          props: { mode: "addition" },
          after: P.addition.after,
        },
      ],
    },
    {
      kind: "investigation",
      title: P.width.title,
      prose: P.width.before,
      interactives: [
        {
          id: "four-bit-width",
          kind: "four-bit-arithmetic",
          timeModel: "none",
          role: "diagram",
          caption: P.width.caption,
          props: { mode: "width" },
          after: P.width.after,
        },
        {
          id: "four-bit-calculator",
          kind: "programmer-calculator",
          timeModel: "none",
          role: "experiment",
          caption: PC.help,
          props: { preset: "arithmetic" },
        },
      ],
    },
    {
      kind: "explanation",
      title: P.subtraction.title,
      prose: P.subtraction.before,
      interactives: [
        {
          id: "four-bit-subtraction",
          kind: "four-bit-arithmetic",
          timeModel: "none",
          role: "diagram",
          caption: P.subtraction.caption,
          props: { mode: "subtraction" },
          after: P.subtraction.after,
        },
        {
          id: "four-bit-practice",
          kind: "challenge",
          timeModel: "none",
          role: "exercise",
          caption: P.practice.caption,
          props: { challengeId: "subtract-four-bits" },
        },
        {
          id: "four-bit-solved",
          kind: "challenge-note",
          timeModel: "none",
          caption: P.practice.title,
          props: { afterChallenge: "subtract-four-bits", text: P.practice.solved },
          after: P.bridge,
        },
      ],
    },
  ],
  challenges: [
    {
      id: "subtract-four-bits",
      title: P.practice.title,
      task: P.practice.task,
      gradedDirection: "answer",
      fields: [
        { id: "negated", label: P.practice.fields.negated, kind: "text" },
        { id: "result", label: P.practice.fields.result, kind: "text" },
        {
          id: "carry",
          label: P.practice.fields.carry,
          kind: "choice",
          options: [...P.practice.options],
        },
      ],
      initial: {
        answers: {},
        data: { editor: { kind: "four-bit-subtraction", first: practice.a.pattern } },
      },
      tests: {
        kind: "answers",
        grader: "four-bit-subtraction",
        cases: fields.map((field) => ({
          label: P.practice.fields[field],
          given: { a: 6, b: 3, [`feedback.${field}`]: P.practice.feedback[field] },
          expect: { [field]: field },
        })),
      },
      hints: [...P.practice.hints],
      reference: {
        answers: {
          negated: practice.negation.after.pattern,
          result: practice.result.pattern,
          carry: "discard",
        },
      },
    },
  ],
  modelVsReality: "",
  originalityNote: P.originalityNote,
};
