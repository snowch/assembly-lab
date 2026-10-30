// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { splitLesson, sectionOf } from "./pacing";
import { pacing5To9 as C } from "./pacing-5-9.copy";
import { countingUp } from "./counting-up";
import { countingDown } from "./counting-down";
import { memoryAndAddresses } from "./memory-and-addresses";
import { loadingWidths } from "./loading-widths";
import { arrayAddresses } from "./array-addresses";
import { zeroTerminatedStrings } from "./zero-terminated-strings";
import { productsAndWidths } from "./products-and-widths";
import { divisionAndRemainders } from "./division-and-remainders";
import { callsAndReturns } from "./calls-and-returns";
import { recursiveCalls } from "./recursive-calls";
import { PROSE as UP } from "./counting-up.prose";
import { PROSE as MEMORY } from "./memory-and-addresses.prose";
import { PROSE as LOAD } from "./loading-widths.prose";
import { PROSE as ARRAY } from "./array-addresses.prose";
import { PROSE as PRODUCT } from "./products-and-widths.prose";
import { PROSE as CALL } from "./calls-and-returns.prose";
import { PROSE as RECURSION } from "./recursive-calls.prose";

type Section = LessonInput["sections"][number];
const s = sectionOf;
const copy = <K extends keyof typeof C>(id: K) => ({ ...C[id], objectives: [...C[id].objectives] });
const paragraphs = (prose: string, start: number, end?: number) =>
  prose.split("\n\n").slice(start, end).join("\n\n");
const question = (title: string, prose: string): Section => ({
  kind: "question",
  title,
  prose,
  interactives: [],
});
const reflection = (source: LessonInput, prose: string): Section => ({
  ...s(source, "reflection"),
  prose,
  interactives: [],
});
// A moved investigation starts directly unless its own prediction is on this page.
// Removing an earlier page's gate never exposes an answer to a prediction on this page.
const ungated = (section: Section): Section => ({
  ...section,
  interactives: (section.interactives ?? []).map((figure) => {
    const { after: _after, ...props } = figure.props ?? {};
    return { ...figure, props };
  }),
});

const upParts = splitLesson(countingUp, [
  {
    id: "counting-up",
    ...copy("counting-up"),
    sections: [
      s(countingUp, "question"),
      s(countingUp, "motivation"),
      s(countingUp, "prediction"),
      s(countingUp, "investigation"),
      s(countingUp, "challenge"),
      reflection(countingUp, UP.reflection),
    ],
  },
  {
    id: "writing-an-upward-loop",
    ...copy("writing-an-upward-loop"),
    sections: [
      {
        ...question(C["writing-an-upward-loop"].title, C["writing-an-upward-loop"].intro),
        details: s(countingUp, "question").details,
      },
      s(countingUp, "construction"),
      s(countingUp, "failureExperiment"),
      s(countingUp, "explanation"),
      s(countingUp, "generalisation"),
    ],
  },
]);
const downParts = splitLesson(countingDown, [
  {
    id: "counting-down",
    ...copy("counting-down"),
    sections: [
      s(countingDown, "question"),
      s(countingDown, "motivation"),
      s(countingDown, "prediction"),
      s(countingDown, "investigation"),
      s(countingDown, "construction"),
    ],
  },
  {
    id: "testing-before-and-after",
    ...copy("testing-before-and-after"),
    sections: [
      question(C["testing-before-and-after"].title, C["testing-before-and-after"].intro),
      {
        ...s(countingDown, "failureExperiment"),
        kind: "prediction",
        interactives: s(countingDown, "failureExperiment").interactives?.filter(
          (figure) => figure.id !== "dim-do-runs",
        ),
      },
      s(countingDown, "explanation"),
      {
        ...s(countingDown, "generalisation"),
        interactives: s(countingDown, "generalisation").interactives?.filter(
          (figure) => figure.id !== "dim-down-wrong-runs",
        ),
      },
    ],
  },
  {
    id: "stopping-when-work-ends",
    ...copy("stopping-when-work-ends"),
    sections: [
      question(C["stopping-when-work-ends"].title, C["stopping-when-work-ends"].intro),
      s(countingDown, "challenge"),
    ],
  },
]);

const memoryParts = splitLesson(memoryAndAddresses, [
  {
    id: "memory-and-addresses",
    ...copy("memory-and-addresses"),
    introduces: ["address", "byte", "little-endian", "low half"],
    sections: [
      s(memoryAndAddresses, "question"),
      s(memoryAndAddresses, "motivation"),
      s(memoryAndAddresses, "prediction"),
      s(memoryAndAddresses, "investigation"),
      s(memoryAndAddresses, "construction"),
    ],
  },
  {
    id: "transfer-widths",
    ...copy("transfer-widths"),
    introduces: ["halfword"],
    sections: [
      {
        ...question(
          C["transfer-widths"].title,
          C["transfer-widths"].intro + "\n\n" + paragraphs(MEMORY.prediction, 1),
        ),
        details: s(memoryAndAddresses, "question").details,
      },
      {
        ...s(memoryAndAddresses, "motivation"),
        prose: paragraphs(MEMORY.motivation, 2),
      },
      { ...s(memoryAndAddresses, "failureExperiment"), kind: "prediction" },
      s(memoryAndAddresses, "explanation"),
      {
        ...s(memoryAndAddresses, "generalisation"),
        interactives: s(memoryAndAddresses, "generalisation").interactives?.map((figure) => ({
          ...figure,
          props: { ...figure.props, after: "predict-wide-fuel-store" },
        })),
      },
      s(memoryAndAddresses, "challenge"),
    ],
  },
]);

const loadParts = splitLesson(loadingWidths, [
  {
    id: "loading-widths",
    ...copy("loading-widths"),
    sections: [
      s(loadingWidths, "question"),
      s(loadingWidths, "motivation"),
      s(loadingWidths, "prediction"),
      s(loadingWidths, "investigation"),
      s(loadingWidths, "construction"),
      s(loadingWidths, "failureExperiment"),
      {
        ...s(loadingWidths, "generalisation"),
        prose: paragraphs(LOAD.generalisation, 2),
        interactives: [],
      },
      s(loadingWidths, "challenge"),
      s(loadingWidths, "reflection"),
    ],
  },
  {
    id: "extending-register-values",
    ...copy("extending-register-values"),
    introduces: ["cast"],
    sections: [
      {
        ...ungated(s(loadingWidths, "explanation")),
        kind: "question",
        prose: paragraphs(LOAD.questionNote, 0, 1) + "\n\n" + LOAD.explanation,
      },
      {
        ...ungated(s(loadingWidths, "generalisation")),
        kind: "investigation",
        prose: paragraphs(LOAD.generalisation, 0, 2),
      },
      reflection(loadingWidths, C["extending-register-values"].activity),
    ],
  },
]);

const arrayParts = splitLesson(arrayAddresses, [
  {
    id: "array-addresses",
    ...copy("array-addresses"),
    introduces: ["array", "element", "index"],
    sections: [
      s(arrayAddresses, "question"),
      s(arrayAddresses, "motivation"),
      s(arrayAddresses, "prediction"),
      s(arrayAddresses, "construction"),
      s(arrayAddresses, "failureExperiment"),
      reflection(arrayAddresses, ARRAY.reflection.split("\n").slice(0, 3).join("\n")),
    ],
  },
  {
    id: "traversing-arrays",
    ...copy("traversing-arrays"),
    introduces: ["pre-index", "post-index"],
    sections: [
      {
        ...question(C["traversing-arrays"].title, C["traversing-arrays"].intro),
        details: s(arrayAddresses, "question").details,
      },
      ungated(s(arrayAddresses, "investigation")),
      s(arrayAddresses, "explanation"),
      ungated(s(arrayAddresses, "generalisation")),
      s(arrayAddresses, "challenge"),
    ],
  },
]);

const productExplanation = s(productsAndWidths, "explanation");
const subtractProduct = productExplanation.interactives?.find(
  (f) => f.id === "step-subtract-product",
);
if (!subtractProduct) throw new Error("Missing subtract-product bridge");
const productParts = splitLesson(productsAndWidths, [
  {
    id: "products-and-widths",
    ...copy("products-and-widths"),
    introduces: ["product"],
    sections: [
      s(productsAndWidths, "question"),
      s(productsAndWidths, "motivation"),
      s(productsAndWidths, "prediction"),
      s(productsAndWidths, "investigation"),
      s(productsAndWidths, "construction"),
    ],
  },
  {
    id: "widening-products",
    ...copy("widening-products"),
    sections: [
      {
        ...question(C["widening-products"].title, C["widening-products"].intro),
        details: s(productsAndWidths, "question").details,
      },
      { ...s(productsAndWidths, "failureExperiment"), kind: "prediction" },
      {
        ...productExplanation,
        kind: "investigation",
        prose: paragraphs(PRODUCT.explanation, 0, 3),
        interactives: productExplanation.interactives?.filter(
          (figure) => figure.id !== "step-subtract-product",
        ),
      },
      s(productsAndWidths, "challenge"),
    ],
  },
  {
    id: "reading-product-halves",
    ...copy("reading-product-halves"),
    introduces: ["high half"],
    sections: [
      { ...ungated(s(productsAndWidths, "generalisation")), kind: "question" },
      reflection(productsAndWidths, C["reading-product-halves"].activity),
    ],
  },
]);
const divisionInvestigation = s(divisionAndRemainders, "investigation");
const divisionParts = splitLesson(divisionAndRemainders, [
  {
    id: "division-and-remainders",
    ...copy("division-and-remainders"),
    sections: [
      s(divisionAndRemainders, "question"),
      s(divisionAndRemainders, "motivation"),
      s(divisionAndRemainders, "prediction"),
      {
        ...divisionInvestigation,
        prose: paragraphs(PRODUCT.explanation, 3) + "\n\n" + divisionInvestigation.prose,
        interactives: [
          {
            ...subtractProduct,
            props: { ...subtractProduct.props, after: "predict-signed-quotient" },
          },
          ...(divisionInvestigation.interactives ?? []),
        ],
      },
      s(divisionAndRemainders, "construction"),
      s(divisionAndRemainders, "failureExperiment"),
      s(divisionAndRemainders, "explanation"),
    ],
  },
  {
    id: "consumption-calculation",
    ...copy("consumption-calculation"),
    sections: [s(divisionAndRemainders, "challenge")],
  },
  {
    id: "dividing-by-a-constant",
    ...copy("dividing-by-a-constant"),
    sections: [
      {
        ...ungated(s(divisionAndRemainders, "generalisation")),
        kind: "question",
        details: s(productsAndWidths, "question").details,
      },
      reflection(divisionAndRemainders, C["dividing-by-a-constant"].activity),
    ],
  },
]);

const smallMotivation = s(callsAndReturns, "motivation");
const callParts = splitLesson(callsAndReturns, [
  {
    id: "calls-and-returns",
    ...copy("calls-and-returns"),
    introduces: [
      "callee",
      "link register",
      "stack",
      "stack pointer",
      "stack frame",
      "frame pointer",
      "calling convention",
    ],
    sections: [
      { ...smallMotivation, prose: C["calls-and-returns"].question + "\n\n" + CALL.motivation },
      s(callsAndReturns, "construction"),
      s(callsAndReturns, "failureExperiment"),
      { ...s(callsAndReturns, "explanation"), prose: paragraphs(CALL.explanation, 0, 1) },
    ],
  },
  {
    id: "preserving-values-across-calls",
    ...copy("preserving-values-across-calls"),
    introduces: ["leaf function"],
    sections: [
      question(
        C["preserving-values-across-calls"].title,
        C["preserving-values-across-calls"].intro,
      ),
      { ...smallMotivation, prose: paragraphs(CALL.explanation, 1), interactives: [] },
      s(callsAndReturns, "prediction"),
      s(callsAndReturns, "investigation"),
      s(callsAndReturns, "generalisation"),
      s(callsAndReturns, "challenge"),
    ],
  },
]);

const recursiveParts = splitLesson(recursiveCalls, [
  {
    id: "recursive-calls",
    ...copy("recursive-calls"),
    sections: [
      s(recursiveCalls, "question"),
      s(recursiveCalls, "motivation"),
      s(recursiveCalls, "prediction"),
      s(recursiveCalls, "investigation"),
      s(recursiveCalls, "construction"),
      { ...s(recursiveCalls, "explanation"), prose: paragraphs(RECURSION.explanation, 2) },
    ],
  },
  {
    id: "making-recursive-progress",
    ...copy("making-recursive-progress"),
    sections: [
      question(C["making-recursive-progress"].title, C["making-recursive-progress"].intro),
      { ...s(recursiveCalls, "failureExperiment"), kind: "prediction" },
      { ...s(recursiveCalls, "explanation"), prose: paragraphs(RECURSION.explanation, 0, 1) },
      s(recursiveCalls, "generalisation"),
      s(recursiveCalls, "challenge"),
    ],
  },
]);

/** Published units in course order. Original exports remain the checked source records. */
export const paced5To9: LessonInput[] = [
  ...upParts,
  ...downParts,
  ...memoryParts,
  ...loadParts,
  ...arrayParts,
  zeroTerminatedStrings,
  ...productParts,
  ...divisionParts,
  ...callParts,
  ...recursiveParts,
];
