// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 3, Shifts, and the type that picks one: the paragraphs, hints, tasks and notes
// of the lesson, as drafted by Haiku from checked facts and kept word for word from
// docs/notes/module-3/prose.md (the part under "# Lesson 2"). shifts.prose.test.ts holds every
// string here to that file, so a change of wording is made there first.
//
// The texts of 17 October 2026 (the figures' rework) were checked for facts. A closed note is a
// section's `details`, and the sentences under a wrong answer (`compareFeedback`) are the grader's.

export const PROSE = {
  question:
    "C writes a shift right as `>>` and a shift left as `<<`. `g >> 1` shifts the bits of `g` one place right.\n\n" +
    "GCC turns `g >> 1` into `asr w0, w0, 1` when `g` is an `int`. When `g` is an `unsigned`, it turns the same expression into `lsr w0, w0, 1`. This is the first place in the course where the C type changes the instruction.\n\n" +
    "What does each instruction do differently?",
  questionNote: {
    summary: "What C says",
    prose:
      "For a negative `int`, the C standard leaves the result of `>>` to the implementation. GCC defines it as an arithmetic shift. For a signed `int`, C leaves some left shifts undefined, a negative value among them. GCC defines them, but this lesson's examples stay within what C defines. The compiler is GCC 16.1 with `-O1`, as in Module 0.",
  },

  motivation:
    "Moving every bit one place left doubles an `unsigned` value, as long as no 1 moves past the top. Moving every bit one place right halves it, and drops any remainder. GCC turns `n * 8` into `lsl w0, w0, 3`.",

  prediction: "The figure takes −7, which is `0xfffffff9`, and moves its bits one place right.",
  predictionQuestion: "**What fills the top bit for an `int`?**",
  predictionExplain:
    "The figure takes −7, which is `0xfffffff9`. For an `int`, the top bit is filled with a copy of the old top bit. The old top bit is 1, so `asr w0, w0, 1` fills the top with 1. The result is `0xfffffffc`, which is −4.\n\n" +
    "`lsr w0, w0, 1` fills the top with 0 instead. The result is `0x7ffffffc`, which is 2147483644. The figure marks the filled top bit in each case.",

  investigation:
    "Moving every bit along by a number of places is a **shift**. Bits that move past the end are lost.\n\n" +
    "- `lsl` moves bits left and fills the gap on the right with zeros.\n" +
    "- `lsr`, a **logical shift**, moves bits right and fills the gap on the left with zeros. It halves the unsigned reading.\n" +
    "- `asr`, an **arithmetic shift**, moves bits right and fills the gap on the left with copies of the old top bit. It halves the signed reading and rounds down, towards the more negative whole number.\n\n" +
    "The figure shifts a word by the instruction you choose. Arrows show the direction, the bits lost and the bits filled.",

  construction:
    "C's `/` divides, and a shift can seem to do the same job. This challenge compares them for a positive value and for a negative one.",
  compareTask:
    "Give the results of three operations for two inputs: `asr` by 2, `lsr` by 2, and C's `/ 4`. The inputs are 21 and −21. Give each answer as a decimal number in its signed reading. The answer boxes are grouped by input.\n\n" +
    "For two `int` values, C's `/` gives a whole number and rounds towards zero. For example, `7 / 2` is 3, and `-7 / 2` is −3.",
  compareHints: [
    "For a positive value all three agree; for a negative value they do not.",
    "`asr` rounds down; C's `/` rounds towards zero; `lsr` fills with zeros, so a negative value becomes a large positive one.",
    "`asr` of −7 by 1 is −4; −7 / 2 in C is −3.",
    "21 gives 5 all three ways.",
    "5, 5, 5; −6, 1073741818, −5.",
  ] as const,
  /** What a wrong answer is told, by the operation it is about. Never a value. */
  compareFeedback: {
    asr: "`asr` rounds down, towards the more negative whole number.",
    div: "C's `/` rounds towards zero.",
    lsr: "`lsr` reads the bits as unsigned and fills with zeros, so a negative value becomes a large positive one.",
  },

  failureExperiment:
    "C's `g / 2` for an `int` rounds towards zero. So −7 / 2 is −3. GCC does not make it one `asr`. It makes `add w0, w0, w0, lsr 31`, then `asr w0, w0, 1`.\n\n" +
    "In the `add`, the last operand is `w0, lsr 31`. That is the value of `w0`, shifted right by 31 places on the way in. Forming that operand does not change `w0`. The `add` then adds the operand to `w0`, and writes the sum to `w0`.",
  failureQuestion: "**What does the first instruction add?**",
  failureExplain:
    "`w0, lsr 31` moves the top bit of `g` to the bottom. So the `add` adds 1 when `g` is negative, and 0 otherwise.\n\n" +
    "For `div2(-7)`, the top bit of −7 is 1. The `add` writes −6 to `w0`, and `asr w0, w0, 1` then gives −3. For `div2(7)`, the `add` adds 0, so the result is 3.\n\n" +
    "Adding 1 to a negative odd value before `asr` makes the shift round towards zero, as C requires. The figure shows `w0` after each instruction.",

  explanation:
    "| C type | Right shift | Fills the top bit with |\n" +
    "| --- | --- | --- |\n" +
    "| `int` | `asr` | a copy of the old top bit |\n" +
    "| `unsigned` | `lsr` | zeros |\n\n" +
    "The two readings give the top bit different worths. So halving them needs different fills. The add and subtract of earlier modules did not depend on the type. The right shift does.",

  generalisation:
    "A shift can be part of another instruction's operand, as `w0, lsr 31` was in the `add`. The shift does not change the register it reads.\n\n" +
    "`movk w0, 0xf, lsl 16` is another case. The `lsl 16` moves the 16-bit number `0xf` into the upper half before `movk` puts it there.",

  challenge: "This challenge uses the type alone to pick the instruction.",
  pickTask:
    "Say which instruction GCC uses for each: `x >> 3` with `int x`; `x >> 3` with `unsigned x`; `x << 3` with either.",
  pickHints: [
    "On a right shift, the fill depends on the reading. A left shift fills with zeros either way.",
    "A left shift is the same for both types.",
    "`int g >> 1` became `asr w0, w0, 1`.",
    "`unsigned n >> 1` became `lsr w0, w0, 1`.",
    "`asr`; `lsr`; `lsl`.",
  ] as const,

  reflection:
    "- `lsl` moves bits left and fills with zeros.\n" +
    "- `lsr` moves bits right and fills with zeros.\n" +
    "- `asr` moves bits right and fills with copies of the top bit.\n" +
    "- The C type decides between `asr` and `lsr` for `>>`.\n" +
    "- For a negative value, `asr` rounds down, and C's `/` rounds towards zero.\n" +
    "- A shift inside another instruction's operand does not change the register it reads.\n\n" +
    "For `int g = -9`, what do `g / 2` and `asr` by 1 give?",
  reflectionNote: {
    summary: "Answer",
    prose:
      "`g / 2` is −4, rounding towards zero. `asr` by 1 gives −5, rounding down. GCC's extra `add` of 1 makes −8 first, and `asr` of −8 by 1 is −4.",
  },

  modelVsReality:
    "The simulator's shifts follow the architecture's results, checked against QEMU. `lsl`, `lsr` and `asr` with a constant are names for more general instructions. The course uses the names GCC prints.",
} as const;
