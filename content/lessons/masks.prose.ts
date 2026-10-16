// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 3, Masks and fields: the paragraphs, hints, tasks and notes of the lesson, as
// drafted by Haiku from checked facts and kept word for word from docs/notes/module-3/prose.md
// (the part under "# Lesson 1"). masks.prose.test.ts holds every string here to that file, so a
// change of wording is made there first.

export const PROSE = {
  question:
    "The trip computer keeps its warnings in one `unsigned`, the warning word. Each of its low bits says one thing. Bit 0 means fuel is low. Bit 1 means service is due. Bit 2 means a door is open. Bit 3 means the lights are on.\n\n" +
    "Bits 4 to 6 hold the gear, a number from 0 to 7.\n\n" +
    "How does a program change one bit, or the gear, without disturbing the rest?",

  motivation:
    "`add` and `sub` change a whole number at once, and a carry can reach any bit. Changing one warning must leave every other warning as it was. The instructions in this lesson work on each bit separately. Bit 5 of the answer depends only on bit 5 of the two values.",

  prediction: "GCC turns `return w & ~DOOR_OPEN;`, which clears bit 2, into `and w0, w0, -5`.",
  predictionQuestion: "**Why is the constant −5?**",
  predictionExplain:
    "`0xfffffffb` has every bit set except bit 2, and its signed reading is −5. GCC prints the constant by its signed reading. The `and` instruction keeps a bit only where both values have 1. So every bit survives except bit 2.",

  investigation:
    "Each of these works on one bit at a time. The answer's bit is 1 only where both values have 1. This is AND, written `and`. The answer's bit is 1 where either value has 1. This is OR, written `orr`. The answer's bit is 1 where exactly one value has 1. This is exclusive OR, written `eor`. Turning every bit over is NOT: each 1 becomes 0, and each 0 becomes 1.\n\n" +
    "A value chosen to pick out bits is called a **mask**. In `orr w0, w0, 1`, the mask 1 sets bit 0. In `and w0, w0, -5`, the mask clears bit 2. In `eor w0, w0, 8`, the mask flips bit 3.\n\n" +
    "A run of bits that together hold one number is called a **field**, such as the gear in bits 4 to 6. The instruction `lsl` moves bits up. `lsl w1, w1, 4` moves every bit of `w1` up four places.\n\n" +
    "GCC reads the gear with `ubfx x0, x0, 4, 3`. This takes 3 bits, starting at bit 4, and puts them at the bottom. It writes the gear with `bfi w0, w1, 4, 3`. This puts the low 3 bits of `w1` into bits 4 to 6 of `w0`, and leaves the rest of `w0` alone. Two examples: `clear_door(0xf)` gives `0xb`, which is 11, and `gear_of(0x35)` gives 3.",

  construction:
    "Writing a field changes only its own bits and leaves the rest as they were. The challenge below writes a new gear into a word.",
  setGearTask:
    "Write `set_gear(w, g)`, which puts the low 3 bits of `g` into bits 4 to 6 of `w` and returns the word. Use only `and`, `lsl`, `orr` and `ret`. Four calls test it. In one of them, `g` is larger than 7, and only its low 3 bits may land.\n\n" +
    "`w` arrives in `w0` and `g` in `w1`.",
  setGearHints: [
    "Clear the field in the word, move the new gear into place, then join the two.",
    "Without clearing bits 4 to 6 first, OR keeps the old gear's 1s.",
    "`lsl w1, w1, 4` moves bits 0 to 2 of `w1` up to bits 4 to 6.",
    "`and w1, w1, 7` keeps only the low 3 bits of `g`. `and w0, w0, -113` clears bits 4 to 6 of `w`, because −113 is `0xffffff8f`.",
    "`and w1, w1, 7`, `lsl w1, w1, 4`, `and w0, w0, -113`, `orr w0, w0, w1`, `ret`.",
  ] as const,

  failureExperiment:
    "The figure runs `set_gear` without the step that clears the field: `and w1, w1, 7`, `lsl w1, w1, 4`, `orr w0, w0, w1`, `ret`, on `set_gear(0x35, 5)`.",
  failureQuestion: "**What does it return?**",
  failureExplain:
    "It returns `0x75`. The old gear, 3, left bits 4 and 5 set. OR cannot clear them, so they stay set beside the new gear's bits 4 and 6. Clearing the field first gives the right answer, `0x55`.",

  explanation:
    "AND clears a bit where the mask has a 0. OR sets a bit where the mask has a 1. Exclusive OR flips a bit where the mask has a 1.\n\n" +
    "Each bit of the answer depends only on the same bit of the two values. No carry runs from one bit into the next, so nothing else changes.",

  generalisation:
    "Status words, packed dates and colours keep several small numbers in one word in the same way.\n\n" +
    "GCC writes the gear in one instruction, `bfi`, where your version took four instructions before `ret`. The result is the same: `set_gear(0x35, 5)` returns `0x55` both ways.",

  challenge: "This challenge uses the operations and the gear on one word.",
  traceTask:
    "For the warning word `0x2a`, give three results as hexadecimal: the word after `orr w0, w0, 1`; the word after `and w0, w0, -9`; and the gear from `ubfx x0, x0, 4, 3` of the original word.",
  traceHints: [
    "OR sets the mask's bits; AND with −9 clears bit 3; `ubfx` takes bits 4 to 6.",
    "Each result starts from `0x2a`, not from the one before.",
    "`0x2a` is `0010 1010`: bits 1, 3 and 5 are set.",
    "−9 is `0xfffffff7`, every bit except bit 3.",
    "`0x2b`; `0x22`; `0x2`.",
  ] as const,

  reflection:
    "- Why does GCC print the mask for clearing bit 2 as −5?\n" +
    "- Why must the field be cleared before the new gear is joined in?\n" +
    "- What does exclusive OR do that AND and OR cannot?",

  modelVsReality:
    "`ubfx` and `bfi` are two names the assembler gives to more general instructions. The course uses the two names GCC prints.",
} as const;
