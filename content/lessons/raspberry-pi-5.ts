// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { PI_PREP_LABELS as L } from "./raspberry-pi-5.labels";
import { PI_PREP_PROSE as P } from "./raspberry-pi-5.prose";

export const raspberryPi5: LessonInput = {
  id: "raspberry-pi-5",
  title: L.title,
  module: 13,
  order: 0,
  objectives: [...L.objectives],
  sectionLayout: "selected",
  showTimeModelNotes: false,
  introduces: [],
  sections: [
    { kind: "question", title: L.titles.question, prose: P.question },
    { kind: "motivation", title: L.titles.motivation, prose: P.motivation },
    {
      kind: "investigation",
      title: L.titles.investigation,
      prose: P.investigation,
      interactives: [
        {
          id: "pi5-serial-connection",
          kind: "board-schematic",
          role: "diagram",
          timeModel: "none",
          caption: L.captions.serial,
          props: L.serialDiagram,
        },
      ],
    },
    {
      kind: "explanation",
      title: L.titles.explanation,
      prose: P.explanation,
      interactives: [
        {
          id: "pi5-boot-path",
          kind: "board-schematic",
          role: "diagram",
          timeModel: "none",
          caption: L.captions.boot,
          props: L.bootDiagram,
        },
      ],
    },
    { kind: "reflection", title: L.titles.reflection, prose: P.reflection },
  ],
  modelVsReality: P.modelVsReality,
  originalityNote: P.originalityNote,
};
