// Copyright © 2026 Christopher Snow

// The first lesson of Module 1: the paragraphs, hints and tasks, kept word for word from
// docs/notes/module-1/prose.md (the part headed "Lesson 1"). one-pattern-three-readings.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "In Module 0, `fuel_used` was first written the wrong way round, as `return at_end - at_start;`. The figure runs it again, with `fuel_used(50, 38)`. The C says the answer is 38 minus 50, and its type is `int`. So the answer should be −12.\n\n" +
    "After `sub w0, w1, w0`, `w0` holds 32 bits. Read as a number, they give 4294967284.",

  motivation:
    "Every value in a register is only bits. A number is a way of reading them.\n\n" +
    "A program that reads the bits one way, when the C meant the other, gets the wrong answer without any error. This module is about the readings. Later modules show the instructions that choose one.",

  prediction: "The figure can add 12 to `w0`, with `add w0, w0, 12`.",
  predictionQuestion: "**After adding 12, what does `w0` hold?**",
  predictionExplain:
    "`w0` holds 0. 4294967284 plus 12 is 4294967296, which needs 33 bits: a 1 followed by 32 zeros. `w0` has 32 bits, so the 33rd bit is dropped and only the 32 zeros are kept. Adding 12 to the pattern gives 0, so the pattern behaves exactly as −12 would.",

  investigation:
    "Thirty-two ones and zeros are hard to read. A shorter way to write them is **hexadecimal**. Each group of four bits becomes one digit: 0 to 9, then `a` to `f` for ten to fifteen. A `0x` in front marks a number as hexadecimal.\n\n" +
    "The pattern in `w0` is `1111 1111 1111 1111 1111 1111 1111 0100`, written `0xfffffff4`. The **unsigned reading** adds up the worth of every bit that is 1. Each bit is worth twice the bit to its right, so the worths run 1, 2, 4, 8 and so on, up to 2147483648 for the leftmost bit. That leftmost bit is the **top bit**. For this pattern the unsigned reading gives 4294967284.\n\n" +
    "The **signed reading** counts the top bit as minus 2147483648 instead, and every other bit the same. For this pattern it gives −12. Both −12 and 4294967284 are right. They are two readings of the same 32 bits. The figure lets you set any bit, and shows all three readings, each with the sum that gives it.",

  construction: "Set the bits yourself, in the figure, and read all three readings as you go.",
  makeTask:
    "Set `w0`'s bits so that its signed reading is −1, then give the unsigned reading of the same bits.",
  makeHints: [
    "In the signed reading the top bit is worth minus 2147483648, and the other bits add to it.",
    "−1 is not the pattern for 1 with the top bit set.",
    "The pattern for −12 is `0xfffffff4`; adding 12 to it gives 0.",
    "The pattern for −1 is the one that gives 0 when 1 is added to it.",
    "Set all 32 bits: `0xffffffff`. Its unsigned reading is 4294967295.",
  ] as const,

  failureExperiment:
    "The figure shows two functions side by side: `fuel_used_wrong`, with `int`, and `fuel_used_wrong_u`, the same C with `unsigned`.",
  failureQuestion: "**What does GCC do differently for the `unsigned` version?**",
  failureExplain:
    "Both listings are `sub w0, w1, w0` then `ret`. The figure compares them line by line. The type changes how a program reads the result, not the subtraction.",

  explanation:
    "A register has no type. It holds bits, and nothing else.\n\n" +
    "The two readings differ only in the top bit's worth: plus 2147483648 unsigned, minus 2147483648 signed. When the top bit is 0, the two readings agree.\n\n" +
    "A subtraction or an addition gives the same bits, whichever reading the program uses later. So one `sub` serves both `int` and `unsigned`.",

  generalisation:
    "Every 32-bit pattern has an unsigned reading from 0 to 4294967295, and a signed reading from −2147483648 to 2147483647.\n\n" +
    "Some instructions depend on the reading. One kind chooses what runs next after a comparison. Another kind widens a value to more bits. The comparison itself does not depend on the reading: the instruction that follows it chooses the reading. Later modules meet these instructions, and they are where a C type finally shows in the instructions.",

  challenge: "Use what you have learned to read three new patterns.",
  readTask: "Give both readings of three patterns: `0x0000002a`, `0x80000000` and `0xffffff38`.",
  readHints: [
    "The unsigned reading counts the top bit as plus 2147483648. The signed reading counts it as minus 2147483648.",
    "The two readings differ only when the top bit is 1.",
    "`0xfffffff4` reads as 4294967284 unsigned and −12 signed.",
    "`0x0000002a` has its top bit 0, so both readings are 42.",
    "The answers, unsigned first in each pair: 42 and 42; 2147483648 and −2147483648; 4294967096 and −200.",
  ] as const,

  reflection:
    "- Which reading gave −12, and which bit made the difference?\n" +
    "- Why did adding 12 give 0?\n" +
    "- Where in a program does the type `int` or `unsigned` exist, if not in the instructions?",

  modelVsReality:
    "A real processor's registers hold bits with no type, as the simulator's do. Nothing in this lesson is simplified.",
} as const;
