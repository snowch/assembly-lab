// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { LABELS as L } from "./c-integer-types.labels";
import { PROSE as P } from "./c-integer-types.prose";
import { INT_MINUS_ONE, LONG_MINUS_ONE, UNSIGNED_ALL_ONES } from "./module-1.listings";

/** Optional compiler reference after the register-width lesson; no new instructions or gates. */
export const cIntegerTypes: LessonInput = {
  id: "c-integer-types",
  title: L.title,
  module: 16,
  order: 0,
  sectionLayout: "selected",
  showTimeModelNotes: false,
  objectives: [...L.objectives],
  introduces: [],
  sections: [
    {
      kind: "question",
      title: L.titles.width,
      prose: [P.setup, P.width].join("\n\n"),
      interactives: [
        {
          id: "long-return",
          kind: "listing",
          timeModel: "none",
          caption: L.captions.long,
          props: { program: LONG_MINUS_ONE },
          after: P.longAfter,
        },
      ],
    },
    {
      kind: "explanation",
      title: L.titles.readings,
      prose: P.readings,
      interactives: [
        {
          id: "int-return",
          kind: "listing",
          timeModel: "none",
          caption: L.captions.int,
          props: { program: INT_MINUS_ONE },
          after: P.intAfter,
        },
        {
          id: "unsigned-return",
          kind: "listing",
          timeModel: "none",
          caption: L.captions.unsigned,
          props: { program: UNSIGNED_ALL_ONES },
          after: [P.unsignedAfter, P.takeaway].join("\n\n"),
        },
      ],
    },
  ],
  challenges: [],
  modelVsReality: "",
  originalityNote: {
    textbookExample: "A general table of C type sizes detached from the compiler's instructions.",
    howThisDiffers:
      "Keeps the course's three recorded constant-return functions together as an optional reference. The complete C and instructions expose the selected target's width choices and two readings of the same 32-bit result.",
  },
};
