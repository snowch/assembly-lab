// Copyright © 2026 Christopher Snow

// Which instructions the course has introduced by each lesson, worked out from the lessons' own
// data and handed to the written challenges, so that the assembler can tell an instruction the
// learner has not met (`gate.notYet`) from one the learner has met and this challenge does not allow
// (`gate.notAllowedHere`). An instruction counts as introduced by a lesson when any challenge of
// that lesson, or of an earlier one, allows it: there is no list of instructions kept by hand.

import type { LessonInput } from "@platform/lesson-schema";

/** The instructions introduced by `lessons[0..index]`: every one a challenge of those lessons allows. */
export function introducedBy(lessons: readonly LessonInput[], index: number): string[] {
  const names = new Set<string>();
  for (const lesson of lessons.slice(0, index + 1))
    for (const challenge of lesson.challenges ?? [])
      for (const name of challenge.allowedConstructs ?? []) names.add(name);
  return [...names];
}

/**
 * The lesson with each written challenge's `initial.data.introduced` set to the instructions
 * introduced by that lesson and the ones before it. Used as a `map` callback over the course's
 * lessons in order.
 */
export function withIntroduced(
  lesson: LessonInput,
  index: number,
  lessons: readonly LessonInput[],
): LessonInput {
  const introduced = introducedBy(lessons, index);
  return {
    ...lesson,
    challenges: (lesson.challenges ?? []).map((challenge) =>
      challenge.gradedDirection === "write"
        ? {
            ...challenge,
            initial: {
              ...challenge.initial,
              data: { ...challenge.initial?.data, introduced },
            },
          }
        : challenge,
    ),
  };
}
