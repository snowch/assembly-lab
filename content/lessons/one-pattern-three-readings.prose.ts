// Copyright © 2026 Christopher Snow

// The first lesson of Module 1: the paragraphs, hints and tasks, kept word for word from
// docs/notes/module-1/prose.md (the part headed "Lesson 1"). one-pattern-three-readings.prose.test.ts
// holds every string here to that file, so a change of wording is made there first.

export const PROSE = {
  question:
    "Fuel used is the amount at the start minus the amount at the end. The function `fuel_used_wrong` reverses that subtraction. Run `fuel_used_wrong(50, 38)`.\n\n" +
    "The figure starts before the subtraction. Press Next to see which values it reads and what it writes.",

  motivation:
    "The **signed reading** allows negative numbers and is the reading C's `int` uses here. The **unsigned reading** counts every bit as a positive amount. The simulator shows register numbers in unsigned decimal.\n\n" +
    "Nothing in the register changes when we change how we read its bits.",

  prediction:
    "Start with the bits the subtraction left in `w0`: −12 signed, or 4294967284 unsigned.\n\n" +
    "`add w0, w0, 12` acts on those bits and writes a new result. Predict that result before running the added instruction.",
  predictionQuestion: "**After adding 12, what does `w0` hold?**",
  predictionExplain:
    "`w0` holds 0. 4294967284 plus 12 is 4294967296, which needs 33 bits: a 1 followed by 32 zeros. `w0` has 32 bits, so the 33rd bit is dropped and only the 32 zeros are kept. Adding 12 to the pattern gives 0, so the pattern behaves exactly as −12 would.",

  investigation:
    "Thirty-two ones and zeros are hard to read, so they are written in **hexadecimal**. Each group of four bits becomes one digit: 0 to 9, then `a` to `f` for ten to fifteen. `1111` is fifteen, so it is `f`; `0100` is four, so it is `4`. The eight bits `1111 0100` are written `f4`.\n\n" +
    "A `0x` in front marks a number as hexadecimal. The pattern in `w0` is eight groups of four, `1111 1111 1111 1111 1111 1111 1111 0100`, written `0xfffffff4`.\n\n" +
    "Hexadecimal is a compact way to write a bit pattern. It does not tell you whether to read that pattern as signed or unsigned. The figure below shows each digit under its four bits.\n\n" +
    "Each bit is worth twice the bit to its right: 1, 2, 4, 8 and so on. The leftmost bit, bit 31, is the **top bit**. It is worth 2147483648.\n\n" +
    "The **unsigned reading** adds the values of the bits that are 1. The **signed reading** does the same, except the top bit counts as minus 2147483648.\n\n" +
    "The other 31 bits count the same in both readings. So when the top bit is 0, the two readings agree.\n\n" +
    "The figure starts with `0xfffffff4`, the pattern `sub` left in `w0`. It shows the top bit's value and the other 31 bits' total in each reading. The full sum of every bit is under \"Show calculation\".\n\n" +
    "A bit that is 1 is **set**, and a bit that is 0 is **clear**: to set a bit is to make it 1, and to clear it is to make it 0.\n\n" +
    'Set or clear any bit, or press "Clear bits" to start from zero.',

  construction:
    "You can press bits one at a time, or type a pattern in hexadecimal and the bits follow it.\n\nUse the optional scratch register beside this exercise to try a pattern and inspect its readings. It starts with all bits clear. Changes there do not fill in your answers below.",

  constructionSolved:
    "With all 32 bits set, the signed reading is −1 and the unsigned reading is 4294967295.",
  makeTask:
    "Set `w0`'s bits so that its signed reading is −1, then give the unsigned reading of the same bits.",
  makeHints: [
    "In the signed reading the top bit is worth minus 2147483648, and the other bits add to it.",
    "−1 is not the pattern for 1 with the top bit set.",
    "In `0xfffffff4`, the top bit's negative value and the other bits' positive values add to −12.",
    "The pattern for −1 is the one that gives 0 when 1 is added to it.",
    "Set all 32 bits: `0xffffffff`. Its unsigned reading is 4294967295.",
  ] as const,

  failureExperiment:
    "The figure shows `fuel_used_wrong`, with `int`, beside `fuel_used_wrong_u`, the same C with `unsigned`.",
  failureDetailsSummary: "Which compiler?",
  failureDetails: "Both listings are from GCC 16.1 with the setting `-O1`, as in Module 0.",
  failureQuestion: "**What does GCC do differently for the `unsigned` version?**",
  failureExplain:
    "Both listings are `sub w0, w1, w0` then `ret`. GCC used the same `sub` instruction for both functions. The subtraction produces the same 32-bit pattern. Signed and unsigned values differ in how that pattern is read. Other operations, such as division and comparisons, can require different instructions.",

  explanation:
    "A register has no type.\n\n" +
    "An addition or a subtraction gives the same bits, whichever reading the program uses later. That is why one `sub` serves both `int` and `unsigned` here.\n\n" +
    "Both −12 and 4294967284 are readings of the same 32 bits. The C type says which reading the program means: `fuel_used_wrong` returns an `int`, so it means −12.",

  generalisation:
    "Every 32-bit pattern has an unsigned reading from 0 to 4294967295, and a signed reading from −2147483648 to 2147483647.\n\n" +
    "Some instructions depend on whether the bits are read as signed or unsigned. Later modules show how to choose between them.",

  challenge: "Use what you have learned to read three new patterns.",
  readTask: "Give both readings of three patterns: `0x0000002a`, `0x80000000` and `0xffffff38`.",
  readHints: [
    "The unsigned reading counts the top bit as plus 2147483648. The signed reading counts it as minus 2147483648.",
    "Do not expect two different numbers from every pattern. When the top bit is 0, the two readings agree.",
    "`0xfffffff4` reads as 4294967284 unsigned and −12 signed.",
    "`0x0000002a` has its top bit 0, so both readings are 42.",
    "The answers, unsigned first in each pair: 42 and 42; 2147483648 and −2147483648; 4294967096 and −200.",
  ] as const,

  reflection:
    "- Hexadecimal is a compact way to write bits: four bits per digit.\n" +
    "- One 32-bit pattern has an unsigned reading and a signed reading.\n" +
    "- The top bit is worth plus 2147483648 in one reading and minus 2147483648 in the other.\n" +
    "- A register does not store a C type.\n\n" +
    "**What are the unsigned and signed readings of `0x80000001`?**",
  reflectionDetailsSummary: "Answer",
  reflectionDetails:
    "Unsigned 2147483649: the top bit, 2147483648, plus 1. Signed −2147483647: minus 2147483648, plus 1.",

  modelVsReality: "",
} as const;
