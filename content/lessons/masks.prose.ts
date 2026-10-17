// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 3, Masks and fields: the paragraphs, hints, tasks and notes of the lesson, as
// drafted by Haiku from checked facts and kept word for word from docs/notes/module-3/prose.md
// (the part under "# Lesson 1"). masks.prose.test.ts holds every string here to that file, so a
// change of wording is made there first.
//
// The texts of 17 October 2026 (the figures' rework) were checked for facts. A closed note is a
// section's `details`. The text shown after the challenge has been run (`afterRun`) and the text
// shown after it passes (`afterPass`) are held back by the figures that show them, and the
// sentences under a wrong answer (`traceFeedback`) are the grader's.

export const PROSE = {
  question:
    "The trip computer keeps its warnings in one `unsigned` number. This course calls it the **warning word**. A 32-bit value like this is called a **word**.\n\n" +
    "Each of the lowest four bits is one warning. Bits are counted from the right, starting at 0, and bit n is worth 2 to the power n. Bit 0 means fuel is low. Bit 1 means service is due. Bit 2 means a door is open. Bit 3 means the lights are on.\n\n" +
    "Bits 4 to 6 hold the selected gear, a number from 0 to 7.\n\n" +
    "Each warning is on or off on its own. How can the program change one warning without changing the others?",

  motivation:
    "`add` and `sub` change a whole number. A carry can run from one bit into the next and reach any bit. So an `add` or a `sub` can change warnings it was not meant to touch.\n\n" +
    "`and`, `orr` and `eor` work on each bit separately. Bit 5 of the result depends only on bit 5 of the two inputs.",

  prediction:
    "In this C, `w` is the warning word. It is a C variable, not the register `w0`. `DOOR_OPEN` is a name for 4, the worth of bit 2.\n\n" +
    "In C, `&` takes the AND of each pair of bits. `~` turns every bit over: each 1 becomes 0, and each 0 becomes 1. So `return w & ~DOOR_OPEN;` clears bit 2. GCC compiled that line to `and w0, w0, -5`.\n\n" +
    "C has other bit operators too. `|` takes the OR of each pair of bits. `^` takes the exclusive OR of each pair. `<<` moves bits towards the top. `FUEL_LOW` is a name for 1, the worth of bit 0.",
  predictionNote: {
    summary: "Which compiler?",
    prose: "GCC 16.1 at `-O1` compiled this, as in Module 0.",
  },
  predictionQuestion: "**Why is the constant −5?**",
  predictionExplain:
    "`0xfffffffb` and −5 are the same 32-bit pattern. Read as a signed number, the pattern is −5, and GCC prints it that way. Every bit of the pattern is 1 except bit 2.\n\n" +
    "The processor does not subtract 5. `and` keeps the bits where the mask has a 1, and clears bit 2, where the mask has a 0. So only bit 2 changes. The figure shows the low eight bits of the word, the mask and the result, with bit 2 marked.",

  investigation:
    "A value chosen to pick out bits is a **mask**. Each of the three operations treats a mask bit in its own way.\n\n" +
    "- **AND** (`and`): a mask bit of 0 clears the bit, and a 1 keeps it. `and w0, w0, -5` clears bit 2.\n" +
    "- **OR** (`orr`): a mask bit of 1 sets the bit, and a 0 keeps it. `orr w0, w0, 1` sets bit 0.\n" +
    "- **Exclusive OR** (`eor`): a mask bit of 1 flips the bit, and a 0 keeps it. `eor w0, w0, 8` flips bit 3.\n\n" +
    "C uses `~` to turn every bit over. In `w & ~DOOR_OPEN`, GCC worked out `~DOOR_OPEN` itself, as the constant −5. So the listing needs no separate instruction that turns bits over.\n\n" +
    "The figure combines a word and a mask with the instruction you choose. It marks which bits changed.\n\n" +
    "A run of bits that together hold one number is called a **field**. The gear is a field, in bits 4 to 6.\n\n" +
    "`lsl` moves every bit towards the top by a number of places. `lsl w1, w1, 4` moves each bit of `w1` up four places. Zeros fill the four lowest bits. Bits moved past bit 31 are lost. So bits 0 to 2 move to bits 4 to 6. The `lsl 16` in `movk`, from Module 1, moved a number into the upper half the same way.\n\n" +
    "GCC reads the gear with `ubfx x0, x0, 4, 3`. This takes 3 bits, starting at bit 4, and moves them to the lowest three places. The result is their unsigned value.\n\n" +
    "`gear_of` is the function whose C returns the gear. GCC compiled it to that one instruction. For `0x35`, which is `0011 0101`, bits 6 to 4 are `011`. So `gear_of(0x35)` is 3.\n\n" +
    "The listing names `x0`, the 64-bit name of the register. The gear lies in its lower 32 bits, which `w0` names, so the result is the same.\n\n" +
    "`clear_door` is the function whose C is `return w & ~DOOR_OPEN;`. `clear_door(0xf)` gives `0xb`, which is 11.",

  construction:
    "Writing a field changes only its own bits and leaves the rest as they were. The challenge below writes a new gear into a word.",
  setGearTask:
    "Write `set_gear(w, g)`. It puts the low 3 bits of `g` into bits 4 to 6 of `w`, and returns the word. `w` arrives in `w0`, and `g` arrives in `w1`. Put the result in `w0`.\n\n" +
    "Use only `and`, `lsl`, `orr` and `ret`. Four calls test your code. In one of them, `g` is 13, which is larger than 7. Only its low 3 bits may land in the field. Every bit outside bits 4 to 6 must come out as it went in.",
  setGearHints: [
    "Clear the field in the word, move the new gear into place, then join the two.",
    "Bits outside 4 to 6 must come out as they went in, and bits 4 to 6 must hold the low 3 bits of `g`.",
    "`lsl w1, w1, 4` moves bits 0 to 2 of `w1` up to bits 4 to 6.",
    "`and w1, w1, 7` keeps only the low 3 bits of `g`. `and w0, w0, -113` clears bits 4 to 6 of `w`, because −113 is `0xffffff8f`.",
    "`and w1, w1, 7`, `lsl w1, w1, 4`, `and w0, w0, -113`, `orr w0, w0, w1`, `ret`.",
  ] as const,
  /** Above the figure that steps the learner's own instructions; shown once the challenge has been run. */
  afterRun:
    "Step through your own instructions below: the figure shows the word after each one, and which bits it cleared, moved or combined.",
  /** With the comparison with GCC's `bfi`; shown once the challenge passes. */
  afterPass:
    "Only the low 3 bits of `g` may land in the field. A value larger than 7 must not spill out of it. 13 is `1101` in its low four bits. Without keeping only the low 3 bits, its bit 3 would land in bit 7 of the word, outside the field.\n\n" +
    "GCC writes the field in one instruction, `bfi w0, w1, 4, 3`. `w0` holds the word, and `w1` holds the new gear. The 4 is the first bit of the field, and the 3 is its width. The instruction puts the low 3 bits of `w1` into bits 4 to 6 of `w0`, and keeps every other bit. Your code and GCC's both return `0x55` for `set_gear(0x35, 5)`.",

  failureExperiment:
    "The figure runs `set_gear` without the step that clears the field: `and w1, w1, 7`, `lsl w1, w1, 4`, `orr w0, w0, w1`, `ret`, on `set_gear(0x35, 5)`.",
  failureQuestion: "**What does it return?**",
  failureExplain:
    "The result is `0x75`. The old word `0x35` is `0011 0101`. The new gear, moved into place, is `0101 0000`. OR of the two gives `0111 0101`, which is `0x75`.\n\n" +
    "The old gear, 3, left bits 4 and 5 set, and they stay set. Clearing the field first gives `0101 0101`, which is `0x55`.\n\n" +
    "OR can set bits, but it cannot clear bits that were already 1. The old gear must be cleared before the new gear is inserted.",

  explanation:
    "No carry runs from one bit into the next. So, for `and`, `orr` and `eor`, each bit of the result depends only on the same bit of the two inputs. That is why a mask can change one warning and leave the rest.",

  generalisation:
    "Status words, packed dates and colours keep several small numbers in one word in the same way.\n\n" +
    "GCC writes the gear in one instruction, `bfi`, where the shortest version in the challenge above takes four instructions before `ret`. The result is the same: `set_gear(0x35, 5)` returns `0x55` both ways.",

  challenge: "This challenge uses the operations and the gear on one word.",
  traceTask:
    "The warning word is `0x2a`. Give three results, in hexadecimal:\n\n" +
    "- the word after `orr w0, w0, 1`;\n" +
    "- the word after `and w0, w0, -9`;\n" +
    "- the gear of the original word, from `ubfx x0, x0, 4, 3`.\n\n" +
    "Start with `0x2a` separately for each instruction. Do not use one instruction's result as the next instruction's input.",
  traceHints: [
    "OR sets the mask's bits; AND with −9 clears bit 3; `ubfx` takes bits 4 to 6.",
    "Each result starts from `0x2a`, not from the one before.",
    "`0x2a` is `0010 1010`: bits 1, 3 and 5 are set.",
    "−9 is `0xfffffff7`, every bit except bit 3.",
    "`0x2b`; `0x22`; `0x2`.",
  ] as const,
  /** What a wrong field is told, by field id; `chained` is for an `and` answer worked from the `orr` result. Never a value. */
  traceFeedback: {
    after_orr: "OR with 1 sets bit 0 and keeps every other bit.",
    after_and: "AND with −9, which is `0xfffffff7`, clears bit 3 and keeps every other bit.",
    the_gear: "The gear is bits 4 to 6, moved down to the lowest three places.",
    chained: "Each result starts from `0x2a`, not from the result before.",
  },

  reflection:
    "- AND with a mask clears the chosen bits.\n" +
    "- OR sets them.\n" +
    "- Exclusive OR flips them.\n" +
    "- A mask chooses which bits an operation changes.\n" +
    "- A field holds a small number across several bits.\n" +
    "- Writing a field means clearing it, moving the new value into place and combining, so the bits around it are kept.\n" +
    "- `ubfx` reads a field, and `bfi` writes one.\n\n" +
    "The warning word is `0x47`. What does `ubfx x0, x0, 4, 3` give, and what does `eor w0, w0, 4` give?",
  reflectionNote: {
    summary: "Answer",
    prose:
      "`0x47` is `0100 0111`. Bits 6 to 4 are `100`, so the gear is 4. `eor` with 4 flips bit 2 from 1 to 0, giving `0x43`.",
  },

  modelVsReality:
    "`ubfx` and `bfi` are Arm's names for two cases of more general instructions. The course uses the two names GCC prints.",
} as const;
