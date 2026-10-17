// Copyright © 2026 Christopher Snow

// What a figure may ask about a challenge on the same page: whether the learner has run it, what
// they saved, and whether the saved work passes now. Nothing is read as a mark: a pass is the
// grader's verdict on the saved work, worked out afresh each time.

import type { StoredLesson } from "@platform/lesson-runtime";
import type { Challenge, Lesson } from "@platform/lesson-schema";

import { grade } from "./grader";

export const challengeOf = (lesson: Lesson, id: string): Challenge | undefined =>
  lesson.challenges?.find((c) => c.id === id);

/** Whether the learner's saved work for a challenge passes its tests now. */
export function passedChallenge(lesson: Lesson, stored: StoredLesson, id: string): boolean {
  const challenge = challengeOf(lesson, id);
  const saved = stored.challenges[id];
  if (!challenge || !saved) return false;
  try {
    return grade(challenge, saved.artifact).passed;
  } catch {
    return false;
  }
}

/**
 * The learner's saved text for a written challenge once they have run it at least once (their
 * work is saved and was graded), or null before that or when there is no text.
 */
export function ranText(stored: StoredLesson, id: string): string | null {
  const saved = stored.challenges[id];
  if (!saved || saved.attempts < 1) return null;
  const text = saved.artifact.text;
  return text !== undefined && text.trim() !== "" ? text : null;
}

/** The calls a written challenge tests: each case's label and its arguments, `w0`, `w1` and on. */
export function callsOf(
  challenge: Challenge | undefined,
): readonly { readonly label: string; readonly args: readonly number[] }[] {
  if (!challenge || challenge.tests.kind !== "answers") return [];
  return challenge.tests.cases.map((c) => {
    const args: number[] = [];
    for (let n = 0; n < 8; n++) {
      const v = c.given[`w${n}`];
      if (v === undefined) break;
      args.push(Number(v));
    }
    return { label: c.label, args };
  });
}
