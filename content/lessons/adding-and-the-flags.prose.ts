// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 2: the paragraphs, hints, tasks and notes, as drafted by Haiku from checked
// facts and kept word for word from docs/notes/module-2/prose.md (the part under "# Lesson 1").
// module-2.prose.test.ts holds every string here to that file, so a change of wording is
// made there first.

export const PROSE = {
  question:
    "Module 1 showed that 4294967284 and −12 are one pattern. It also showed that GCC uses the same `sub` instruction for `int` and for `unsigned`.\n\n" +
    "So the processor adds without knowing which reading the program wants. It must still say when an answer does not fit, and it must do that for both readings at once.",

  motivation:
    "An addition in 32 bits can give an answer that does not fit. The bits that remain are then wrong for one reading or the other. A program that must not continue with a wrong answer needs to know it happened.\n\n" +
    "`add` keeps no record. `adds` does the same addition and also records four facts about the answer. Each fact sits in a **flag**. The four flags are named N, Z, C and V.",

  prediction:
    "The figure adds 2147483647 and 1 with `adds w0, w0, w1`, which is `0x7fffffff` plus `0x00000001` in hexadecimal.",
  predictionQuestion: "**Which readings of the answer are right?**",
  predictionExplain:
    "The answer is `0x80000000`. Unsigned, it reads 2147483648, which is right. Signed, it reads −2147483648, which is wrong. 2147483647 plus 1 should be 2147483648. The signed reading cannot hold that number.",

  investigation:
    "The part of the processor that adds two registers' bits is called the **adder**. The figure draws the addition column by column, from the right, as on paper. A column adds its two bits and any 1 arriving from the right. If that total is 2 or 3, a 1 goes on to the next column on the left. That 1 is the **carry**.\n\n" +
    "After `adds`, four flags record facts about the answer:\n\n" +
    "- N is the answer's top bit.\n" +
    "- Z is 1 when the answer is 0.\n" +
    "- C is the carry out of the top bit, the carry that would need a 33rd bit.\n" +
    "- V is 1 when the carry into the top bit differs from the carry out of it.\n\n" +
    "For `0x7fffffff` plus 1, a carry runs through every column into the top bit. None comes out of it. So N is 1, Z is 0, C is 0 and V is 1.",
  investigationDetailsSummary: "GCC's own overflow check",
  investigationDetails:
    "GCC uses V itself. `__builtin_add_overflow` is a function built into GCC. It adds two numbers and reports whether the answer overflowed. For a call to it on two `int`s, GCC 16.1 at `-O1` compiles to this:\n\n" +
    "```\n" +
    "add_overflows:\n" +
    "        cmn     w0, w1\n" +
    "        cset    w0, vs\n" +
    "        ret\n" +
    "```\n\n" +
    "The first line, `add_overflows:`, is the function's name followed by a colon, as in every listing so far. The two instructions before `ret` return 1 exactly when V is set. Both are instructions a later module explains.",

  construction: "Earlier, you predicted one addition. Now you predict three.",
  flagsTask:
    "Predict N, Z, C and V for three additions with `adds`, before running them.\n\n" +
    "The additions are:\n\n" +
    "- `0xffffffff` plus 1\n" +
    "- 5 plus 3\n" +
    "- `0x80000000` plus `0x80000000`\n\n" +
    "For each addition, give N, Z, C and V.",
  flagsHints: [
    "C is the carry out of the top bit. V is 1 when the carry into the top bit and the carry out of it differ.",
    "C and V are not the same thing. One addition here sets both, and one sets only C.",
    "5 plus 3 is 8. No carry reaches the top bit, so N, Z, C and V are all 0.",
    "`0xffffffff` plus 1 is 0 with a carry out of the top bit, so Z is 1 and C is 1.",
    "`0xffffffff` plus 1 gives N 0, Z 1, C 1 and V 0. 5 plus 3 has all four at 0. `0x80000000` plus `0x80000000` gives N 0, Z 1, C 1 and V 1.",
  ] as const,

  failureExperiment:
    "The figure runs `sum_flags(0x7fffffff, 1, 0xffffffff)`, with `w0` as `0x7fffffff`, `w1` as 1 and `w2` as `0xffffffff`. First it runs `adds w3, w2, w2`, which adds `0xffffffff` to itself and leaves N and C at 1. Then it runs `add w0, w0, w1` instead of `adds`, on `0x7fffffff` plus 1.",
  failureQuestion: "**After `add`, what do the flags show?**",
  failureExplain:
    "N and C are still 1, as `adds` left them. `add` gives the same answer as `adds` would, `0x80000000`, but records nothing. Had `add` recorded flags, they would be N 1, Z 0, C 0 and V 1, the same as `adds` gives for `0x7fffffff` plus 1 earlier in this lesson. Had it cleared them, all four would be 0. The three outcomes differ, so the run tells them apart. Of the instructions met so far, only those whose names end in `s` record the four facts.",

  explanation:
    "The adder adds bits. It gives one answer for both readings. N and Z describe that answer: its top bit, and whether it is 0.\n\n" +
    "C judges the unsigned reading. A carry out of the top bit means the unsigned answer did not fit.\n\n" +
    "V judges the signed reading. When the carry into the top bit and the carry out of it differ, the top bit came out wrong for the signed answer. That case is called **overflow**.",

  generalisation:
    "Every `adds` sets all four flags. The program reads the one that matches its reading.\n\n" +
    "The flags keep their values until another instruction records them. Later modules show the instructions that read the flags to choose what runs next.",

  challenge: "This challenge uses V, the flag that judges the signed reading.",
  overflowTask:
    "Give the smallest positive number that, added to `0x7ffffffe` with `adds`, makes V 1.\n\n" +
    "Enter the number in decimal.",
  overflowHints: [
    "V is 1 when the signed answer does not fit, so look for the first signed answer above 2147483647.",
    "The question is about V, not C. The unsigned answer fits for small numbers.",
    "`0x7fffffff` plus 1 makes V 1.",
    "`0x7ffffffe` is 2147483646.",
    "The answer is 2.",
  ] as const,

  reflection:
    "- Why can one addition be right and wrong at once?\n" +
    "- Which flag would a program using `unsigned` read, and which one using `int`?\n" +
    "- What does `add` do to the flags?",

  modelVsReality:
    "The architecture is Arm's published definition of what each instruction does. The simulator works out the flags as the architecture defines them. The course checks its simulator against QEMU, a widely used program that imitates Arm processors. A real processor need not add column by column. The drawing shows the arithmetic, not the circuit. The digital-design course builds the circuit.",
} as const;
