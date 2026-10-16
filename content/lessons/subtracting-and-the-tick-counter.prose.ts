// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 2: the paragraphs, hints, tasks and notes, as drafted by Haiku from checked
// facts and kept word for word from docs/notes/module-2/prose.md (the part under "# Lesson 2").
// module-2.prose.test.ts holds every string here to that file, so a change
// of wording is made there first.

export const PROSE = {
  question:
    "The trip computer counts milliseconds in a 32-bit `unsigned` counter. Each count is one millisecond, called a **tick**. It reaches 4294967295, then goes back to 0. Going back to 0 is called a **wrap**.\n\n" +
    "4294967296 milliseconds is about 49.71 days. So a car that is never switched off wraps its counter every 50 days or so.\n\n" +
    "`elapsed(now, then)` returns `now - then`. GCC makes it two instructions, one subtraction and a `ret`.\n\n" +
    "Suppose the counter wraps between `then` and `now`.",

  motivation:
    "A program that measures time with a counter like this one runs for weeks before the wrap. So a mistake here shows up rarely, and late. The answer depends on how the processor subtracts.",

  prediction:
    "`then` is 4294966296, the count just before the wrap; `now` is 1000, the count just after it.",
  predictionQuestion: "**What does `elapsed(1000, 4294966296)` return?**",
  predictionExplain:
    "The answer is 2000. Counting on from 4294966296, 1000 steps reach the wrap, and 1000 more reach 1000. The subtraction needs a borrow, because 1000 is less than 4294966296 under the unsigned reading, so C is 0 after `subs`. The 32 bits that remain are still the right distance, 2000.",

  investigation:
    "The figure draws the counter's values on a ring. Two counter values close together sit at almost one spot on a ring of 4294967296 values, so a strip under the ring enlarges the stretch around the wrap.\n\n" +
    "The processor subtracts by adding. `a - b` is worked out as `a` plus `b` with each of its bits changed to the other value (each 1 becomes 0, each 0 becomes 1), plus 1. It uses the same adder as in lesson 1. With `subs`, the flags come from that addition.\n\nA subtraction needs a **borrow** when `a` is less than `b` under the unsigned reading. C is 1 when no borrow was needed, and 0 when one was.\n\n" +
    "After you answer the prediction above, two more figures open. Each works a `subs` column by column, with each bit of the second number changed: one across the wrap, and one that does not wrap.",

  construction: "Earlier, GCC wrote `elapsed` for you. Here you write it yourself.",
  elapsedTask:
    "Write `elapsed(now, then)`, which returns the milliseconds from `then` to `now`. Four calls test it, two across the wrap.\n\n" +
    "You may use `add`, `sub`, `adds`, `subs` and `ret`.",
  elapsedHints: [
    "A 32-bit subtraction keeps the low 32 bits of the true answer. Those 32 bits are the distance round the ring.",
    "No test for the wrap is needed.",
    "`elapsed(5000, 1000)` is 4000. `sub` takes 1000 from 5000.",
    "`now` arrives in `w0` and `then` in `w1`.",
    "The whole answer is `sub w0, w0, w1`, then `ret`.",
  ] as const,

  failureExperiment:
    "`neg w0, w0` turns a value into its negative, as 0 minus the value. The figure runs `negs w0, w0` on `0x80000000`, which reads as −2147483648 signed.",
  failureQuestion: "**What does `w0` hold afterwards?**",
  failureExplain:
    "`w0` still holds `0x80000000`, unchanged, and V is 1. The signed answer, 2147483648, does not fit, so the same pattern comes back.",

  explanation:
    "Subtraction is addition with each bit of the second value changed to the other, and 1 added. N, Z and V mean what they meant in lesson 1. C is still the carry out of the top bit, but after a subtraction a 1 means no borrow was needed.\n\n" +
    "The 32 bits of the answer are the true answer with every bit above the lowest 32 dropped. Dropping those bits is why a wrapped counter still gives the right distance.",

  generalisation:
    "Any counter that wraps gives the right distance by plain subtraction, as long as less than one full turn passed.\n\n" +
    "GCC's `sub_overflows`, from `__builtin_sub_overflow`, runs `subs w0, w0, w1` and then an instruction a later module explains. That instruction reads V after the subtraction, as `add_overflows` did after an addition.",

  challenge: "This challenge looks at the step where the counter goes from its largest value to 0.",
  stepTask:
    "Give `elapsed(0, 4294967295)`, and the C flag that `subs` would set for the same call.\n\n" +
    "Enter the result in decimal, and C as 0 or 1.",
  stepHints: [
    "Subtracting keeps the low 32 bits. C is 1 only if no borrow was needed.",
    "0 is smaller than 4294967295 under the unsigned reading.",
    "`elapsed(1000, 4294966296)` is 2000, with C 0.",
    "One step after 4294967295, the counter reads 0.",
    "The whole answer is 1, and C is 0.",
  ] as const,

  reflection:
    "- Why does `elapsed` need no special case for the wrap?\n" +
    "- What does C mean after `subs`, and how does that differ from after `adds`?\n" +
    "- Why does negating `0x80000000` give `0x80000000`?",

  modelVsReality:
    "As in lesson 1, the flags follow the architecture's definition, checked against QEMU. The drawing shows the arithmetic, not the circuit.",
} as const;
