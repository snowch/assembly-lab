// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./floating-point-conversions.labels";
import { PROSE as P } from "./floating-point-conversions.prose";

export const floatingPointConversions: LessonInput = {
  id: "floating-point-conversions",
  title: L.title,
  module: 17,
  order: 3,
  sectionLayout: "selected",
  showTimeModelNotes: false,
  objectives: [...L.objectives],
  introduces: [],
  sections: [
    { kind: "question", title: L.titles.question, prose: P.question, interactives: [] },
    {
      kind: "investigation",
      title: L.titles.experiment,
      prose: P.experiment,
      interactives: [
        {
          id: "floating-point-conversions-explorer",
          kind: "floating-point",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.explorer,
          props: { mode: "conversions" },
          after: P.after,
        },
      ],
    },
    {
      kind: "challenge",
      title: L.titles.exercise,
      prose: P.exercise,
      interactives: [
        {
          id: "floating-point-conversions-check",
          kind: "floating-point-check",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.check,
          props: { task: "conversion" },
        },
      ],
    },
  ],
  challenges: [],
  modelVsReality: "",
  originalityNote: L.originality,
};
