// Copyright © 2026 Christopher Snow

// Each introductory mechanism is a separate, directly linked lesson. Figures have one fixed
// program each; navigation belongs to the course plan and ordinary next-lesson links.
import { SECTION_KINDS, type LessonInput, type SectionKind } from "@platform/lesson-schema";
import { traceOf, viewAt, wValue } from "@al/views";
import { FUNDAMENTALS_PROSE as P } from "./fundamentals.prose";
import { FUNDAMENTALS_LABELS as L } from "./fundamentals.labels";
import { PRIMITIVE_PROGRAMS, primitiveProgram } from "./meet-the-machine.primitives";

import { returningToCaller } from "./returning-to-caller";

type Key = keyof typeof P;
const CONFIG = [
  {
    key: "addition",
    sectionKinds: SECTION_KINDS.filter((kind) => kind !== "reflection"),
    id: "one-addition",
    worked: 0,
    test: 2,
    args: [14, 0, 5],
    fields: [1, 0],
    introduces: ["instruction", "register", "assembly language", "operand", "memory", "AArch64"],
  },
  {
    key: "constant",
    id: "adding-a-constant",
    sectionKinds: ["motivation", "investigation", "challenge"],
    worked: 7,
    test: 8,
    args: [10, 0],
    fields: [1, 0],
    introduces: ["constant", "immediate"],
  },
  {
    key: "function",
    id: "tiny-function",
    sectionKinds: ["motivation", "investigation", "construction", "challenge"],
    worked: 1,
    test: 9,
    args: [6, 4],
    fields: [0, 1],
    introduces: ["listing", "caller", "argument"],
  },
  {
    key: "subtraction",
    id: "subtraction-and-reuse",
    worked: 4,
    test: 4,
    args: [18, 5],
    fields: [1, 0],
    introduces: [],
  },
  {
    key: "sequence",
    id: "instructions-in-sequence",
    worked: 5,
    test: 5,
    args: [10, 4, 0],
    fields: [2, 1],
    introduces: ["program counter"],
  },
] as const;
const CHALLENGE_IDS = [
  "trace-addition",
  "trace-constant",
  "trace-two-arguments",
  "trace-subtraction",
  "trace-sequence",
] as const;
const FIGURE_IDS = [
  "worked-addition",
  "worked-constant-reuse",
  "worked-function",
  "worked-subtraction",
  "worked-sequence",
] as const;

function figure(
  index: number,
  id: string,
  copy: { title: string; prose: string },
  caption: string,
) {
  const item = PRIMITIVE_PROGRAMS[index]!;
  return {
    id,
    kind: "primitive-operation",
    timeModel: "steps",
    caption,
    props: {
      stage: {
        ...copy,
        kind: item.kind,
        program: primitiveProgram(item),
        call: { entry: item.entry, args: [...item.args] },
        registers: [...item.registers],
        steps: item.instructions.length,
        predict: false,
        showCompilerLines: item.entry === "increment_int",
      },
    },
  };
}

const primitiveLessons: LessonInput[] = CONFIG.map((config, order) => {
  const key: Key = config.key;
  const prose = P[key];
  const labels = L[key];
  const sectionProse: Partial<Record<SectionKind, string>> = prose.sections;
  const sectionTitles: Partial<Record<SectionKind, string>> = labels.titles;
  const item = PRIMITIVE_PROGRAMS[config.test]!;
  const program = primitiveProgram(item);
  const challengeId = CHALLENGE_IDS[order]!;
  const trace = traceOf(program, { entry: item.entry, args: [...config.args] });
  const result = viewAt(trace, item.instructions.length).state;
  const reference = Object.fromEntries(
    config.fields.map((n) => [`w${n}`, String(wValue(result, n))]),
  );
  const given = Object.fromEntries(config.args.map((value, n) => [`w${n}`, value]));
  return {
    id: config.id,
    title: labels.title,
    module: 0,
    order,
    objectives: [...labels.objectives],
    sectionLayout: "sectionKinds" in config ? "selected" : "full",
    showTimeModelNotes: !("sectionKinds" in config),
    introduces: [...config.introduces],
    termExemptions:
      key === "addition"
        ? [
            {
              term: "constant",
              reason:
                "Only the linked title Constants and widths names the later lesson; constants are not taught here.",
            },
            {
              term: "shift",
              reason:
                "Only the official ADD reference URL contains shifted; the visible lesson does not introduce shifting.",
            },
          ]
        : [],
    sections: ("sectionKinds" in config ? config.sectionKinds : SECTION_KINDS).map((kind) => ({
      kind,
      title: sectionTitles[kind]!,
      prose: sectionProse[kind]!,
      ...(kind === "motivation" && key === "addition"
        ? {
            details: P.addition.references,
            interactives: [
              {
                id: "register-views",
                kind: "register-views",
                timeModel: "none",
                caption: P.addition.registerViews.caption,
                after: P.addition.registerViews.after,
                props: { register: 0 },
              },
            ],
          }
        : {}),
      ...(kind === "motivation" && key === "constant"
        ? {
            interactives: [
              figure(6, "worked-constant", P.constant.firstFigure, L.constant.captions.firstFigure),
            ],
          }
        : {}),
      ...(kind === "investigation"
        ? {
            interactives: [
              figure(
                config.worked,
                FIGURE_IDS[order]!,
                key === "subtraction" ? P.subtraction.secondFigure : prose.figure,
                key === "subtraction"
                  ? L.subtraction.captions.secondFigure
                  : labels.captions.figure,
              ),
            ],
          }
        : {}),
      ...(kind === "prediction" && key === "subtraction"
        ? {
            interactives: [
              figure(3, "worked-reuse", P.subtraction.figure, L.subtraction.captions.figure),
            ],
          }
        : {}),
      ...(kind === "construction" && key === "function"
        ? {
            interactives: [
              figure(
                9,
                "worked-two-argument-function",
                P.function.twoArgumentFigure,
                L.function.captions.twoArgumentFigure,
              ),
            ],
          }
        : {}),
      ...(kind === "challenge"
        ? {
            interactives: [
              {
                id: "practice",
                kind: "challenge",
                timeModel: "steps",
                role: "exercise" as const,
                caption: labels.captions.challenge,
                props: { challengeId },
              },
            ],
          }
        : {}),
    })),
    challenges: [
      {
        id: challengeId,
        title: labels.challenge.title,
        task: prose.challenge.task,
        gradedDirection: "answer",
        fields: config.fields.map((n) => ({
          id: `w${n}`,
          label: (labels.challenge.fields as Readonly<Record<string, string>>)[`w${n}`]!,
          kind: "number" as const,
        })),
        // Arithmetic snippets stop before this execution wrapper's ret. It writes no registers,
        // so the existing return-state grader checks exactly the displayed arithmetic result.
        initial: { data: { model: program } },
        tests: {
          kind: "answers",
          grader: "registers-at-return",
          cases: [
            {
              label: labels.challenge.title,
              given: { entry: item.entry, ...given },
              expect: Object.fromEntries(config.fields.map((n) => [`w${n}`, `w${n}`])),
            },
          ],
        },
        hints: [...prose.challenge.hints],
        reference: { answers: reference },
      },
    ],
    modelVsReality: prose.modelVsReality,
    originalityNote: prose.originalityNote,
  };
});

export const fundamentalsLessons: LessonInput[] = [
  ...primitiveLessons.slice(0, 3),
  returningToCaller,
  ...primitiveLessons.slice(3),
].map((lesson, order) => ({ ...lesson, order }));
