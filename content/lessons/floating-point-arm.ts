// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./floating-point-arm.labels";
import { PROSE as P } from "./floating-point-arm.prose";

export const floatingPointArm: LessonInput = {
  id: "floating-point-arm",
  title: L.title,
  module: 17,
  order: 2,
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
          id: "floating-point-arm-explorer",
          kind: "floating-point",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.explorer,
          props: { mode: "arm" },
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
          id: "floating-point-arm-check",
          kind: "floating-point-check",
          role: "experiment",
          timeModel: "none",
          caption: L.captions.check,
          props: { task: "arithmetic" },
        },
      ],
    },
  ],
  challenges: [],
  modelVsReality: "",
  originalityNote: L.originality,
};
