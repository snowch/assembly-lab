// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";

import { addingAndTheFlags } from "./adding-and-the-flags";
import { PROSE as ADD } from "./adding-and-the-flags.prose";
import { branches } from "./branches";
import { SERVICE } from "./branches.listings";
import { compareAndChoose } from "./compare-and-choose";
import { constantsAndWidths } from "./constants-and-widths";
import { masks } from "./masks";
import { PROSE as MASK } from "./masks.prose";
import { onePatternThreeReadings } from "./one-pattern-three-readings";
import { PROSE as READ } from "./one-pattern-three-readings.prose";
import { COPY } from "./pacing-1-4.copy";
import { sectionOf, splitLesson } from "./pacing";
import { shifts } from "./shifts";
import { PROSE as SHIFT } from "./shifts.prose";
import { subtractingAndTheTickCounter } from "./subtracting-and-the-tick-counter";
import { PROSE as SUB } from "./subtracting-and-the-tick-counter.prose";

type Section = LessonInput["sections"][number];
type Figure = NonNullable<Section["interactives"]>[number];
type Challenge = NonNullable<LessonInput["challenges"]>[number];
const section = sectionOf;
function figure(source: LessonInput, id: string): Figure {
  const found = source.sections
    .flatMap((part) => part.interactives ?? [])
    .find((part) => part.id === id);
  if (!found) throw new Error(`${source.id}: missing ${id}`);
  return found;
}
const readingsQuestion = section(onePatternThreeReadings, "question");
const readingsFigure = figure(onePatternThreeReadings, "run-fuel-used");
const hexReader = figure(onePatternThreeReadings, "read-register");

const readings = splitLesson(onePatternThreeReadings, [
  {
    id: "one-pattern-three-readings",
    title: COPY.hexadecimal.title,
    objectives: [...COPY.hexadecimal.objectives],
    introduces: ["hexadecimal"],
    sections: [
      {
        kind: "question",
        title: COPY.hexadecimal.title,
        prose: [COPY.hexadecimal.intro, ...READ.investigation.split("\n\n").slice(0, 2)].join(
          "\n\n",
        ),
        interactives: [],
      },
      {
        kind: "investigation",
        title: section(onePatternThreeReadings, "investigation").title,
        prose: [READ.investigation.split("\n\n").at(-2), COPY.hexadecimal.activity].join("\n\n"),
        interactives: [
          {
            ...hexReader,
            caption: COPY.hexadecimal.caption,
            props: { ...hexReader.props, topBit: false, hexOnly: true },
          },
        ],
      },
    ],
  },
  {
    id: "same-bits-two-readings",
    title: COPY.readings.title,
    objectives: [...COPY.readings.objectives],
    introduces: ["unsigned reading", "signed reading", "top bit", "two’s complement"],
    sections: [
      { kind: "question", title: COPY.readings.title, prose: READ.motivation, interactives: [] },
      { ...section(onePatternThreeReadings, "investigation"), prose: COPY.readings.investigation },
      section(onePatternThreeReadings, "construction"),
      section(onePatternThreeReadings, "challenge"),
      section(onePatternThreeReadings, "reflection"),
    ],
  },
  {
    id: "arithmetic-on-register-bits",
    title: COPY.arithmeticBits.title,
    objectives: [...COPY.arithmeticBits.objectives],
    introduces: [],
    sections: [
      { ...readingsQuestion, interactives: [{ ...readingsFigure, after: undefined }] },
      section(onePatternThreeReadings, "prediction"),
      section(onePatternThreeReadings, "failureExperiment"),
      section(onePatternThreeReadings, "explanation"),
    ],
  },
]);

const constants = splitLesson(constantsAndWidths, [
  {
    id: "constants-and-widths",
    title: COPY.loadConstant.title,
    objectives: [...COPY.loadConstant.objectives],
    introduces: [],
    sections: [
      section(constantsAndWidths, "question"),
      section(constantsAndWidths, "motivation"),
      section(constantsAndWidths, "prediction"),
      section(constantsAndWidths, "investigation"),
    ],
  },
  {
    id: "building-constants",
    title: COPY.buildConstant.title,
    objectives: [...COPY.buildConstant.objectives],
    introduces: ["remainder"],
    sections: [section(constantsAndWidths, "construction")],
  },
  {
    id: "register-widths",
    title: COPY.registerWidths.title,
    objectives: [...COPY.registerWidths.objectives],
    introduces: [],
    sections: [
      section(constantsAndWidths, "failureExperiment"),
      section(constantsAndWidths, "explanation"),
      section(constantsAndWidths, "generalisation"),
      section(constantsAndWidths, "challenge"),
      {
        ...section(constantsAndWidths, "reflection"),
        prose: section(constantsAndWidths, "reflection").prose.split("\n").slice(2).join("\n"),
      },
    ],
  },
]);

const addition = splitLesson(addingAndTheFlags, [
  {
    id: addingAndTheFlags.id,
    title: COPY.addition.title,
    objectives: [...COPY.addition.objectives],
    sections: [
      section(addingAndTheFlags, "motivation"),
      section(addingAndTheFlags, "prediction"),
      {
        ...section(addingAndTheFlags, "investigation"),
        prose: [section(addingAndTheFlags, "investigation").prose, COPY.addition.explanation].join(
          "\n\n",
        ),
      },
      section(addingAndTheFlags, "construction"),
    ],
  },
  {
    id: "flags-and-overflow",
    title: COPY.staleFlags.title,
    objectives: [...COPY.staleFlags.objectives],
    introduces: [],
    sections: [
      {
        kind: "question",
        title: COPY.staleFlags.title,
        prose: COPY.staleFlags.intro,
        interactives: [],
      },
      section(addingAndTheFlags, "failureExperiment"),
      { ...section(addingAndTheFlags, "explanation"), prose: ADD.generalisation },
      section(addingAndTheFlags, "challenge"),
      section(addingAndTheFlags, "reflection"),
    ],
  },
]);

const counterInvestigation = section(subtractingAndTheTickCounter, "investigation");
const counterConstruction = section(subtractingAndTheTickCounter, "construction");
const counterNegation = section(subtractingAndTheTickCounter, "failureExperiment");
const counterReflection = section(subtractingAndTheTickCounter, "reflection");
const ownSubtraction = figure(subtractingAndTheTickCounter, "subtract-own");
const subtraction = splitLesson(subtractingAndTheTickCounter, [
  {
    id: subtractingAndTheTickCounter.id,
    title: COPY.subtraction.title,
    objectives: [...COPY.subtraction.objectives],
    sections: [
      section(subtractingAndTheTickCounter, "motivation"),
      section(subtractingAndTheTickCounter, "prediction"),
      {
        ...counterInvestigation,
        interactives: [figure(subtractingAndTheTickCounter, "counter-ring")],
      },
      {
        ...counterConstruction,
        interactives: [figure(subtractingAndTheTickCounter, "write-elapsed")],
      },
      {
        ...counterReflection,
        prose: COPY.subtraction.reflection,
        details: { ...counterReflection.details!, prose: COPY.subtraction.reflectionAnswer },
      },
    ],
  },
  {
    id: "subtraction-flags-and-negation",
    title: COPY.subtractionArithmetic.title,
    objectives: [...COPY.subtractionArithmetic.objectives],
    introduces: [],
    sections: [
      {
        kind: "investigation",
        title: COPY.subtraction.drilldownTitle,
        prose: SUB.subtractionInvestigation,
        interactives: [
          ...(counterInvestigation.interactives ?? [])
            .filter((part) => part.kind === "adder")
            .map((part) => ({
              ...part,
              lead: undefined,
              props: { ...part.props, after: undefined },
            })),
          {
            ...ownSubtraction,
            caption: COPY.subtractionArithmetic.exampleCaption,
            props: { ...ownSubtraction.props, afterChallenge: undefined },
          },
        ],
      },
      counterNegation,
      {
        kind: "explanation",
        title: section(subtractingAndTheTickCounter, "explanation").title,
        prose: COPY.subtraction.explanation,
        interactives: [],
      },
      section(subtractingAndTheTickCounter, "generalisation"),
      section(subtractingAndTheTickCounter, "challenge"),
      counterReflection,
    ],
  },
]);

const trace = masks.challenges!.find((part) => part.id === "trace-three-results")!;
if (trace.tests.kind !== "answers") throw new Error("mask trace must use answer tests");
const maskTrace: Challenge = {
  ...trace,
  title: COPY.masks.traceTitle,
  task: COPY.masks.traceTask,
  hints: [...COPY.masks.traceHints],
  fields: trace.fields!.filter((part) => part.id !== "the_gear"),
  tests: {
    ...trace.tests,
    cases: trace.tests.cases.filter((part) => !("the_gear" in part.expect)),
  },
  reference: {
    answers: {
      after_orr: trace.reference!.answers!["after_orr"]!,
      after_and: trace.reference!.answers!["after_and"]!,
    },
  },
};
const fieldTrace: Challenge = {
  ...trace,
  id: "trace-gear-field",
  title: COPY.fields.traceTitle,
  task: COPY.fields.traceTask,
  hints: [...COPY.fields.traceHints],
  fields: trace.fields!.filter((part) => part.id === "the_gear"),
  tests: { ...trace.tests, cases: trace.tests.cases.filter((part) => "the_gear" in part.expect) },
  reference: { answers: { the_gear: trace.reference!.answers!["the_gear"]! } },
};
const maskSource = {
  ...masks,
  challenges: [...masks.challenges!.filter((part) => part.id !== trace.id), maskTrace, fieldTrace],
};
const maskInvestigation = section(masks, "investigation");
const fieldReader = figure(masks, "read-gear");
const traceFigure = figure(masks, "trace-three-here");
const bitMasks = splitLesson(maskSource, [
  {
    id: "masks",
    title: COPY.masks.title,
    objectives: [...COPY.masks.objectives],
    introduces: ["mask"],
    sections: [
      section(masks, "question"),
      {
        ...section(masks, "prediction"),
        prose: section(masks, "prediction").prose.replace(" `<<` moves bits towards the top.", ""),
      },
      {
        ...maskInvestigation,
        title: COPY.masks.investigationTitle,
        prose: [maskInvestigation.prose, MASK.explanation].join("\n\n"),
        interactives: (maskInvestigation.interactives ?? []).filter(
          (part) => part.id !== "read-gear",
        ),
      },
      {
        ...section(masks, "challenge"),
        prose: "",
        interactives: [{ ...traceFigure, caption: COPY.masks.traceTitle }],
      },
    ],
  },
  {
    id: "reading-and-writing-fields",
    title: COPY.fields.title,
    objectives: [...COPY.fields.objectives],
    introduces: ["field"],
    sections: [
      {
        kind: "investigation",
        title: COPY.fields.readTitle,
        prose: COPY.fields.intro,
        interactives: [{ ...fieldReader, props: { ...fieldReader.props, after: undefined } }],
      },
      section(masks, "construction"),
      section(masks, "failureExperiment"),
      {
        kind: "generalisation",
        title: section(masks, "explanation").title,
        prose: MASK.generalisation,
        interactives: [],
      },
      {
        ...section(masks, "challenge"),
        prose: "",
        interactives: [
          {
            ...traceFigure,
            caption: COPY.fields.traceTitle,
            props: { challengeId: fieldTrace.id },
          },
        ],
      },
      section(masks, "reflection"),
    ],
  },
]);

// Keep basic shift choice separate from signed division's rounding correction.
const shiftInvestigation = section(shifts, "investigation");
const shiftFailure = section(shifts, "failureExperiment");
const pacedShifts = splitLesson(shifts, [
  {
    id: shifts.id,
    title: COPY.shifts.title,
    objectives: [...COPY.shifts.objectives],
    sections: [
      section(shifts, "question"),
      section(shifts, "prediction"),
      {
        ...shiftInvestigation,
        interactives: (shiftInvestigation.interactives ?? []).filter(
          (part) => part.id !== "add-shifted-register",
        ),
      },
      section(shifts, "explanation"),
      section(shifts, "challenge"),
    ],
  },
  {
    id: "shifts-and-signed-division",
    title: COPY.shiftDivision.title,
    objectives: [...COPY.shiftDivision.objectives],
    introduces: [],
    sections: [
      section(shifts, "construction"),
      {
        ...shiftFailure,
        interactives: [
          figure(shifts, "add-shifted-register"),
          ...(shiftFailure.interactives ?? []),
        ],
      },
      {
        ...section(shifts, "generalisation"),
        prose: SHIFT.generalisation.split("\n\n").slice(1).join("\n\n"),
      },
      section(shifts, "reflection"),
    ],
  },
]);

const compareExplanation = section(compareAndChoose, "explanation");
const booleanResults = section(compareAndChoose, "generalisation");
const downhillAt = booleanResults.prose.indexOf("`downhill` is");
const comparisons = splitLesson(compareAndChoose, [
  {
    id: "compare-and-choose",
    title: COPY.compare.title,
    objectives: [...COPY.compare.objectives],
    sections: [
      section(compareAndChoose, "question"),
      section(compareAndChoose, "motivation"),
      section(compareAndChoose, "prediction"),
      section(compareAndChoose, "investigation"),
      {
        ...section(compareAndChoose, "construction"),
        prose: [COPY.compare.coreConditions, section(compareAndChoose, "construction").prose].join(
          "\n\n",
        ),
      },
      section(compareAndChoose, "failureExperiment"),
      section(compareAndChoose, "challenge"),
    ],
  },
  {
    id: "conditions-and-boolean-results",
    title: COPY.conditions.title,
    objectives: [...COPY.conditions.objectives],
    introduces: [],
    sections: [
      {
        kind: "question",
        title: COPY.conditions.title,
        prose: COPY.conditions.intro,
        interactives: [],
      },
      { ...compareExplanation, kind: "investigation" },
      {
        ...booleanResults,
        prose: booleanResults.prose.slice(0, downhillAt).trim(),
        details: {
          summary: COPY.conditions.extensionsSummary,
          prose: [booleanResults.details!.prose, booleanResults.prose.slice(downhillAt)].join(
            "\n\n",
          ),
        },
      },
      section(compareAndChoose, "reflection"),
    ],
  },
]);

const branchWrite = branches.challenges!.find((part) => part.id === "write-fuel-warning")!;
const cbzDefinition = branchWrite.task
  .split("\n\n")
  .find((paragraph) => paragraph.startsWith("`cbz w0, label`"))!;
const branchSource = {
  ...branches,
  challenges: branches.challenges!.map((part) =>
    part.id === branchWrite.id
      ? { ...part, task: part.task.replace(`${cbzDefinition}\n\n`, "") }
      : part,
  ),
};
const pacedBranches = splitLesson(branchSource, [
  {
    id: branches.id,
    title: COPY.branches.title,
    objectives: [...COPY.branches.objectives],
    sections: [
      section(branches, "question"),
      section(branches, "motivation"),
      section(branches, "prediction"),
      section(branches, "investigation"),
      section(branches, "failureExperiment"),
      section(branches, "challenge"),
    ],
  },
  {
    id: "zero-and-threshold-branches",
    title: COPY.zeroAndThresholdBranch.title,
    objectives: [...COPY.zeroAndThresholdBranch.objectives],
    introduces: [],
    sections: [
      {
        ...section(branches, "construction"),
        prose: [section(branches, "construction").prose, cbzDefinition].join("\n\n"),
      },
    ],
  },
  {
    id: "register-and-bit-branches",
    title: COPY.registerBitBranches.title,
    objectives: [...COPY.registerBitBranches.objectives],
    introduces: [],
    sections: [
      {
        ...section(branches, "explanation"),
        prose: section(branches, "explanation").prose.replace(/```[\s\S]*?```\n\n/, ""),
        interactives: [
          {
            id: "follow-service-bit-test",
            kind: "stepper",
            timeModel: "steps",
            caption: COPY.registerBitBranches.caption,
            props: {
              program: SERVICE,
              call: { entry: "service", args: [0x2a] },
              registers: [0],
              count: true,
              branchStatus: true,
            },
          },
        ],
      },
      section(branches, "generalisation"),
      section(branches, "reflection"),
    ],
  },
]);

export const paced1To4: LessonInput[] = [
  ...readings,
  ...constants,
  ...addition,
  ...subtraction,
  ...bitMasks,
  ...pacedShifts,
  ...comparisons,
  ...pacedBranches,
];
