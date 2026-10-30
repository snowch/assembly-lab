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
  "adding-a-constant": [],
  "tiny-function": ["ret"],
  "returning-to-caller": ["bl"],
  "subtraction-and-reuse": ["sub"],
  "instructions-in-sequence": [],
  "meet-the-machine": [],
  "one-pattern-three-readings": [],
  "same-bits-two-readings": [],
  "arithmetic-on-register-bits": [],
  "constants-and-widths": ["mov"],
  "building-constants": ["movk"],
  "register-widths": [],
  "adding-and-the-flags": ["adds"],
  "flags-and-overflow": [],
  "subtracting-and-the-tick-counter": ["subs"],
  "subtraction-flags-and-negation": ["neg", "negs"],
  masks: ["and", "orr", "eor"],
  "reading-and-writing-fields": ["ubfx", "bfi", "lsl"],
  shifts: ["lsr", "asr"],
  "shifts-and-signed-division": [],
  "compare-and-choose": ["cmp", "cmn", "csel"],
  "conditions-and-boolean-results": ["cset", "tst", "ands"],
  branches: ["b", "b.cond"],
  "zero-and-threshold-branches": ["cbz"],
  "register-and-bit-branches": ["cbnz", "tbz", "tbnz"],
  "counting-up": [],
  "writing-an-upward-loop": [],
  "counting-down": [],
  "testing-before-and-after": [],
  "stopping-when-work-ends": [],
  "memory-and-addresses": ["ldr", "str"],
  "transfer-widths": ["strb", "strh"],
  "loading-widths": ["ldrb", "ldrsb", "ldrh", "ldrsh", "ldrsw"],
  "extending-register-values": ["sxtb", "uxtb", "sxtw"],
  "array-addresses": [],
  "traversing-arrays": [],
  "zero-terminated-strings": [],
  "products-and-widths": ["mul", "madd"],
  "widening-products": ["smull", "umull"],
  "reading-product-halves": ["smulh", "umulh"],
  "division-and-remainders": ["msub", "sdiv", "udiv"],
  "consumption-calculation": [],
  "dividing-by-a-constant": [],
  "calls-and-returns": ["stp", "ldp"],
  "preserving-values-across-calls": [],
  "recursive-calls": [],
  "making-recursive-progress": [],
  "from-c-to-instructions": ["movz"],
  "equivalent-trip-charge": [],
  "change-c-calculation": [],
  "cap-charge-in-c": [],
  "compile-a-loop": [],
  "write-assembly-loop": [],
  "change-loop-boundary": [],
  "repeated-shifts-in-c": [],
  "c-and-overflow": [],
  "checked-arithmetic": [],
  "checked-addition": [],
  "from-function-to-executable": [],
  "loading-and-startup": [],
  "runtime-startup": [],
  "debug-native-instructions": [],
  "stepping-native-function": [],
  "diagnosing-native-failure": [],
  "raspberry-pi-5": [],
  "raspberry-pi-boot": [],
  "capture-pi-boot": [],
  "restore-pi-boot": [],
  "same-c-on-a32": [],
  "a32-conditions": [],
  "a32-constants": [],
  "a32-division-helper": [],
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
