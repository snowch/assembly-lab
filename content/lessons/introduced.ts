// Copyright © 2026 Christopher Snow

// Which instructions the course has introduced by each lesson, handed to the written challenges so
// that the assembler can tell an instruction the learner has not met (`gate.notYet`) from one the
// learner has met and this challenge does not allow (`gate.notAllowedHere`).
//
// An instruction is met once a lesson TEACHES it, not only once a challenge allows it: `tst`,
// `lsr` and `cbnz` are taught and never allowed by a challenge, and said "not met" for ever when
// the count came from the allow-lists. Each lesson's list is taken from its module's plan
// (docs/notes/module-N-plan.md, "Instructions") and checked against its prose by introduced.test.ts.
// Conditional branches are listed as `b.cond`, as the assembler's gate names them.

import type { LessonInput } from "@platform/lesson-schema";

/** The instructions each lesson teaches, by lesson id: what a lesson adds to the earlier ones. */
export const TAUGHT: Readonly<Record<string, readonly string[]>> = {
  "one-addition": ["add"],
  "tiny-function": ["ret"],
  "subtraction-and-reuse": ["sub"],
  "instructions-in-sequence": [],
  "meet-the-machine": [],
  "one-pattern-three-readings": [],
  "constants-and-widths": ["mov", "movk"],
  "adding-and-the-flags": ["adds"],
  "subtracting-and-the-tick-counter": ["subs", "neg", "negs"],
  masks: ["and", "orr", "eor", "bic", "mvn", "ubfx", "bfi", "lsl"],
  shifts: ["lsr", "asr"],
  "compare-and-choose": ["cmp", "cmn", "tst", "ands", "cset", "csel"],
  branches: ["b", "b.cond", "cbz", "cbnz", "tbz", "tbnz"],
  "counting-up": [],
  "counting-down": [],
  "memory-and-addresses": ["ldr", "str", "strb", "strh"],
  "loading-widths": ["ldrb", "ldrsb", "ldrh", "ldrsh", "ldrsw", "sxtb", "uxtb", "sxtw"],
  "array-addresses": [],
  "zero-terminated-strings": [],
  "products-and-widths": ["mul", "madd", "msub", "smull", "umull", "smulh", "umulh"],
  "division-and-remainders": ["sdiv", "udiv"],
  "calls-and-returns": ["bl", "stp", "ldp"],
  "recursive-calls": [],
  "from-c-to-instructions": ["movz"],
  "compile-a-loop": [],
  "c-and-overflow": [],
  "checked-arithmetic": [],
  "from-function-to-executable": [],
  "debug-native-instructions": [],
  "same-c-on-a32": [],
};

/**
 * The instructions introduced by `lessons[0..index]`: every one those lessons teach, and every one
 * a challenge of theirs allows (a test holds the second to the first).
 */
export function introducedBy(lessons: readonly LessonInput[], index: number): string[] {
  const names = new Set<string>();
  for (const lesson of lessons.slice(0, index + 1)) {
    for (const name of TAUGHT[lesson.id] ?? []) names.add(name);
    for (const challenge of lesson.challenges ?? [])
      if (challenge.tests.kind === "answers" && challenge.tests.grader === "run-registers")
        for (const name of challenge.allowedConstructs ?? []) names.add(name);
  }
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
      challenge.tests.kind === "answers" && challenge.tests.grader === "run-registers"
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
