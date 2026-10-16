// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 3, Shifts, and the type that picks one: the paragraphs, hints, tasks and notes
// of the lesson, as drafted by Haiku from checked facts and kept word for word from
// docs/notes/module-3/prose.md (the part under "# Lesson 2"). shifts.prose.test.ts holds every
// string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "GCC turns `g >> 1` into `asr w0, w0, 1` when `g` is an `int`. When `g` is an `unsigned`, it turns `g >> 1` into `lsr w0, w0, 1`. This is the first place in the course where the C type changes the instruction.\n\n" +
    "The question is what each instruction does differently.",

  motivation:
    "Moving every bit one place left doubles an `unsigned` value. Moving it one place right halves it, dropping any remainder. GCC turns `n * 8` into `lsl w0, w0, 3`.",

  prediction: "The figure takes −7, which is `0xfffffff9`, and moves its bits one place right.",
  predictionQuestion: "**What fills the top bit for an `int`?**",
  predictionExplain:
    "For an `int`, the top bit is filled with a copy of the old top bit. `asr w0, w0, 1` gives `0xfffffffc`, which is −4. `lsr w0, w0, 1` fills with 0 and gives `0x7ffffffc`, which is 2147483644.",

  investigation:
    "Moving every bit along by a number of places is called a **shift**. Bits that move past the end are lost. `lsl` moves bits left and fills the gap at the bottom with zeros.\n\n" +
    "A shift to the right that fills the top with zeros is a **logical shift**, written `lsr`. It halves the unsigned reading.\n\n" +
    "A shift to the right that fills the top with copies of the top bit is an **arithmetic shift**, written `asr`. It halves the signed reading, rounding down.",

  construction:
    "C's `/` divides, and a shift can seem to do the same job. This challenge compares them for a positive value and for a negative one.",
  compareTask:
    "Give `asr` by 2, `lsr` by 2, and C's `/ 4`, for 21 and for −21. Give each answer as a decimal number in its `int` reading, except where the field label says unsigned.",
  compareHints: [
    "For a positive value all three agree; for a negative value they do not.",
    "`asr` rounds down; C's `/` rounds towards zero; `lsr` fills with zeros, so a negative value becomes a large positive one.",
    "`asr` of −7 by 1 is −4; −7 / 2 in C is −3.",
    "21 gives 5 all three ways.",
    "5, 5, 5; −6, 1073741818, −5.",
  ] as const,

  failureExperiment:
    "C's `g / 2` for an `int` rounds towards zero: −7 / 2 is −3. GCC does not make it one `asr`. It makes `add w0, w0, w0, lsr 31`, then `asr w0, w0, 1`.",
  failureQuestion: "**What does the first instruction add?**",
  failureExplain:
    "The operand `w0, lsr 31` moves the top bit to the bottom. So it adds 1 when `g` is negative, and 0 otherwise. Adding 1 to a negative value before `asr` makes the shift round towards zero, as C requires. `div2(-7)` gives −3.",

  explanation:
    "The unsigned and signed readings differ in the top bit's worth, so halving them needs different fills: zeros for unsigned, copies of the top bit for signed.\n\n" +
    "So the C type decides which shift GCC uses. The add and subtract of earlier modules did not depend on the type. The right shift does.",

  generalisation:
    "A shift can also be part of another instruction's operand, as `w0, lsr 31` was inside the `add` above. Listings use this often to scale or move a value on the way in.",

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
    "- What fills the gap in `lsr`, and in `asr`?\n" +
    "- Why is `g / 2` not one `asr` for a negative `int`?\n" +
    "- Where else might the C type change which instruction GCC uses?",

  modelVsReality:
    "The simulator's shifts follow the architecture's results, checked against QEMU. `lsl`, `lsr` and `asr` with a constant are names for more general instructions. The course uses the names GCC prints.",
} as const;
