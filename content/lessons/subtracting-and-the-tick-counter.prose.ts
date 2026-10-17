// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 2: the paragraphs, hints, tasks and notes, as drafted by Haiku from checked
// facts and kept word for word from docs/notes/module-2/prose.md (the part under "# Lesson 2").
// module-2.prose.test.ts holds every string here to that file, so a change
// of wording is made there first.

export const PROSE = {
  question:
    "The trip computer counts milliseconds using a 32-bit unsigned counter. After 4294967295, the next value is 0. This is called wrapping.\n\n" +
    "Each count is a **tick**. Going back to 0 is a **wrap**.\n\n" +
    "`elapsed(now, then)` returns `now - then`. GCC makes it one subtraction and a `ret`.\n\n" +
    "One full turn of the counter, 4294967296 ticks, is about 49.71 days.\n\n" +
    "How can you work out the elapsed time if the counter wraps between the two readings?",

  motivation:
    "A wrong `elapsed` gives a wrong answer only when a wrap falls between the two readings, so `now` is less than `then`. Whether that happens depends on the counter's value when the program starts. So a short test may never meet the case. A long run may meet it at any time.",

  prediction:
    "`then` is 4294966296, the count just before the wrap; `now` is 1000, the count just after it.",
  predictionQuestion: "**What does `elapsed(1000, 4294966296)` return?**",
  predictionExplain:
    "The answer is 2000. Counting forward from 4294966296, 1000 ticks reach the wrap to 0, and 1000 more reach 1000.",

  investigation:
    "After 4294967295 comes 0, so the counter's values form a ring. The figure draws them that way. The counter counts forward, clockwise.\n\n" +
    "Two readings close together sit at almost one spot on a ring of 4294967296 values. So the strip under the ring enlarges the stretch round the wrap. The strip shows `then`, the wrap from 4294967295 to 0, `now`, the ticks before the wrap, the ticks after it, and their total.\n\n" +
    "The processor subtracts by adding. To work out `a - b`, it changes every bit of `b`: each 1 becomes 0, and each 0 becomes 1. It adds the result to `a`, and adds 1 more as the carry into the first column.\n\n" +
    "The example uses four bits only, to show the method. The real instruction uses 32. 5 is `0101`. 3 is `0011`, and with every bit changed it is `1100`.\n\n" +
    "```\n" +
    "   0101     5\n" +
    "+  1100     3, every bit changed\n" +
    "+     1     carry in, into the first column\n" +
    "  -----\n" +
    "  10010     sum\n" +
    "   0010     kept: 2\n" +
    "  1         carry out of the top\n" +
    "```\n\n" +
    "The extra 1 completes the change. Changing every bit of `b` and adding 1 gives 2³² minus `b`, that is, 4294967296 minus `b`, in 32 bits.\n\n" +
    "The figures below show the same steps for the real 32-bit `subs`: the second operand, its bits changed, the carry in of 1, the result and the carry out.\n\n" +
    "A subtraction needs a **borrow** when `a` is less than `b` under the unsigned reading. After `adds`, C = 1 means a carry left the top bit. After `subs`, C = 1 means no borrow was needed, and C = 0 means one was.\n\n" +
    "The two agree: a carry leaves the top exactly when `a` is at least `b`.\n\n" +
    "The two figures below show the final states of two subtractions, each of which can be stepped column by column. One needs a borrow: 1000 minus 4294966296 leaves C 0. The other does not: 9000 minus 2500 leaves C 1 and the result 6500.",

  construction: "Earlier, GCC wrote `elapsed` for you. Here you write it yourself.",
  elapsedTask:
    "Write `elapsed(now, then)`. It returns the ticks from `then` to `now`. `now` arrives in `w0`, `then` arrives in `w1`, and the result goes back in `w0`.\n\n" +
    "It must work whether or not the counter wrapped between the two readings. Four calls test it, two of them across the wrap.\n\n" +
    "You may use `add`, `sub`, `adds`, `subs` and `ret`.",
  elapsedHints: [
    "The 32 bits of a 32-bit subtraction are `now - then` when `now` is at least `then`, and `now - then + 4294967296` when `now` is less than `then`. Either way they are the distance round the ring.",
    "No test for the wrap is needed.",
    "`elapsed(5000, 1000)` is 4000. `sub` takes 1000 from 5000.",
    "`now` arrives in `w0` and `then` in `w1`.",
    "The whole answer is `sub w0, w0, w1`, then `ret`.",
  ] as const,

  /** Shown with the figure that opens when `elapsed` is passed. */
  elapsedAfter:
    "A single 32-bit subtraction keeps the low 32 bits of `now - then`. When `now` is less than `then`, those bits are `now - then + 4294967296`: the distance forward round the wrap. The subtraction cannot tell a gap of 2000 ticks from a gap of 2000 ticks plus a full turn of 4294967296, because the readings alone do not show how many full turns passed.",

  failureExperiment:
    "`neg w0, w0` sets a value to its negative, which is 0 minus the value. `negs` does the same and also writes the four flags.\n\n" +
    "The figure runs `negs w0, w0` on `0x80000000`, the smallest signed 32-bit value, which is −2147483648.",
  failureQuestion: "**What does `w0` hold afterwards?**",
  failureExplain:
    "```\n" +
    "the input                         −2147483648\n" +
    "its negative                      +2147483648\n" +
    "the largest signed 32-bit value   +2147483647\n" +
    "```\n\n" +
    "The negative does not fit the signed range. So the 32 bits that come back are `0x80000000` again, unchanged, and `negs` sets V to 1.",

  explanation:
    "N, Z and V mean what they meant in lesson 1. C is still the carry out of the top bit. After a subtraction, C = 1 means no borrow was needed.\n\n" +
    "The adder adds `now` to `then` with every bit changed, plus 1. That sum is `now - then + 4294967296`.\n\n" +
    "If `now` is at least `then`, the sum is 4294967296 or more: a carry leaves the top, C is 1, and the 32 bits kept are `now - then`.\n\n" +
    "If `now` is less than `then`, no carry leaves the top, C is 0, and the 32 bits kept are `now - then + 4294967296`: the distance forward from `then`, round the wrap, to `now`.",

  generalisation:
    "Subtraction gives the elapsed ticks modulo 2³². Modulo 2³² means the remainder after dividing by 4294967296, so any whole number of full turns is lost. It gives the actual elapsed time when the counter advances normally and fewer than 2³² ticks have passed between readings.\n\n" +
    "After `subs`, C = 0 means a borrow. When the counter advances normally and fewer than 2³² ticks have passed, C = 0 also means the counter wrapped once between the readings. But C is one bit. It does not record how many wraps happened.\n\n" +
    "Any 32-bit counter subtracted in 32 bits behaves this way.",

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
    "- A subtraction is done as an addition of the second operand with every bit changed, plus 1.\n" +
    "- C = 1 after `subs` means no borrow.\n" +
    "- A 32-bit unsigned counter wraps from 4294967295 to 0.\n" +
    "- One 32-bit subtraction gives the elapsed ticks across a wrap.\n" +
    "- The readings alone cannot show how many full turns passed.\n" +
    "- `negs` can set V even when the 32 bits come back unchanged.\n\n" +
    "**Question:** `then` is 4294967000 and `now` is 296. What does `elapsed(now, then)` return, and what does `subs` set C to?",
  reflectionAnswerSummary: "Answer",
  reflectionAnswer:
    "592, and C is 0. 296 ticks reach the wrap, 296 more reach 296, and a borrow was needed.",

  modelVsReality:
    "As in lesson 1, the flags follow the architecture's definition, checked against QEMU. The drawing shows the arithmetic, not the circuit.",
} as const;
