// Copyright © 2026 Christopher Snow

// Whether the learner's saved work for a challenge passes its tests now, for a figure that stays
// shut until a challenge is passed. The work is graded afresh each time; no mark is ever read.

import type { StoredLesson } from "@platform/lesson-runtime";
import type { Lesson } from "@platform/lesson-schema";

import { grade } from "../grader";

/** The saved work for a challenge of the lesson, or undefined if there is none or no such challenge. */
export function savedWork(lesson: Lesson, stored: StoredLesson, id: string) {
  const challenge = lesson.challenges?.find((c) => c.id === id);
  const saved = stored.challenges[id];
  return challenge && saved ? { challenge, artifact: saved.artifact } : undefined;
}

/** Whether the learner's saved work for a challenge passes its tests now. */
export function passedChallenge(lesson: Lesson, stored: StoredLesson, id: string): boolean {
  const work = savedWork(lesson, stored, id);
  if (!work) return false;
  try {
    return grade(work.challenge, work.artifact).passed;
  } catch {
    return false;
  }
}
