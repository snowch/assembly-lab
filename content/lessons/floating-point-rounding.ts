// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./floating-point-rounding.labels";
import { PROSE as P } from "./floating-point-rounding.prose";

export const floatingPointRounding: LessonInput = {
  id: "floating-point-rounding",
  title: L.title,
  module: 17,
  order: 1,
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
          id: "floating-point-rounding-explorer",
          kind: "floating-point",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.explorer,
          props: { mode: "rounding" },
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
          id: "floating-point-rounding-check",
          kind: "floating-point-check",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.check,
          props: { task: "rounding" },
        },
      ],
    },
  ],
  challenges: [],
  modelVsReality: "",
  originalityNote: L.originality,
};
