// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { COMPLEMENT_PROSE as P } from "./twos-complement.prose";

export const twosComplement: LessonInput = {
  id: "twos-complement",
  title: P.title,
  module: 15,
  order: 0,
  sectionLayout: "selected",
  showTimeModelNotes: false,
  objectives: [...P.objectives],
  introduces: [],
  sections: [
    {
      kind: "investigation",
      title: P.reading.title,
      prose: P.reading.before,
      interactives: [
        {
          id: "four-bit-readings",
          kind: "complement-explorer",
          timeModel: "none",
          role: "experiment",
          caption: P.reading.caption,
          props: { mode: "readings" },
          after: P.reading.after,
        },
      ],
    },
    {
      kind: "explanation",
      title: P.negation.title,
      prose: P.negation.before,
      interactives: [
        {
          id: "four-bit-negation",
          kind: "complement-explorer",
          timeModel: "none",
          role: "experiment",
          caption: P.negation.caption,
          props: { mode: "negation" },
          after: P.negation.after,
        },
      ],
    },
    { kind: "generalisation", title: P.bridge.title, prose: P.bridge.prose, interactives: [] },
  ],
  challenges: [],
  modelVsReality: "",
  originalityNote: {
    textbookExample: "A table of signed bit patterns followed by a memorised inversion rule.",
    howThisDiffers:
      "Uses one editable four-bit pattern to compare positional contributions, then a separate calculation from the same starting pattern. The small example supports the course's existing 32-bit register reading without introducing another processor width.",
  },
};
