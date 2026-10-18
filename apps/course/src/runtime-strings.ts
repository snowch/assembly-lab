// Copyright © 2026 Christopher Snow

// The platform's words for a lesson page, with the course's own where the platform's do not fit:
// the name of the one model the figures run, and the heading over its note.

import { VIEW_STRINGS } from "@al/views";
import { DEFAULT_STRINGS, type Strings } from "@platform/lesson-runtime";

export const RUNTIME_STRINGS: Strings = {
  ...DEFAULT_STRINGS,
  lesson: {
    ...DEFAULT_STRINGS.lesson,
    modelNote: VIEW_STRINGS.modelHeading,
    timeModel: { ...DEFAULT_STRINGS.lesson.timeModel, steps: VIEW_STRINGS.modelBadge },
    role: { ...DEFAULT_STRINGS.lesson.role, ...VIEW_STRINGS.figureRoles },
  },
};
