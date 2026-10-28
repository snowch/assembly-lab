// Copyright © 2026 Christopher Snow

// The platform's words for a lesson page, with the course's own where the platform's do not fit:
// the labels for execution and for distinct figure interactions.

import { VIEW_STRINGS } from "@al/views";
import { DEFAULT_STRINGS, type Strings } from "@platform/lesson-runtime";

export const RUNTIME_STRINGS: Strings = {
  ...DEFAULT_STRINGS,
  lesson: {
    ...DEFAULT_STRINGS.lesson,
    timeModel: { ...DEFAULT_STRINGS.lesson.timeModel, steps: VIEW_STRINGS.modelBadge },
    role: { ...DEFAULT_STRINGS.lesson.role, ...VIEW_STRINGS.figureRoles },
  },
};
