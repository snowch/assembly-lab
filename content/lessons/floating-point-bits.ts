// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./floating-point-bits.labels";
import { PROSE as P } from "./floating-point-bits.prose";

export const floatingPointBits: LessonInput = {
  id: "floating-point-bits",
  title: L.title,
  module: 17,
  order: 0,
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
          id: "floating-point-bits-explorer",
          kind: "floating-point",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.explorer,
          props: { mode: "bits" },
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
          id: "floating-point-bits-check",
          kind: "floating-point-check",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.check,
          props: { task: "fields" },
        },
      ],
    },
  ],
  challenges: [],
  modelVsReality: "",
  originalityNote: L.originality,
};
