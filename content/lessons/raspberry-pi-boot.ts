// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { PI_BOOT_LABELS as L } from "./raspberry-pi-boot.labels";
import { PI_BOOT_PROSE as P } from "./raspberry-pi-boot.prose";

export const raspberryPiBoot: LessonInput = {
  id: "raspberry-pi-boot",
  title: L.title,
  module: 13,
  order: 1,
  objectives: [...L.objectives],
  sectionLayout: "selected",
  showTimeModelNotes: false,
  introduces: [],
  sections: [
    { kind: "question", title: L.titles.question, prose: P.question },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        {
          id: "pi5-build-path",
          kind: "board-schematic",
          role: "diagram",
          timeModel: "none",
          caption: L.buildDiagram.title,
          props: L.buildDiagram,
        },
      ],
    },
    { kind: "construction", title: L.titles.construction, prose: P.construction },
    { kind: "failureExperiment", title: L.titles.failureExperiment, prose: P.failureExperiment },
    { kind: "explanation", title: L.titles.explanation, prose: P.explanation },
    { kind: "reflection", title: L.titles.reflection, prose: P.reflection },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
