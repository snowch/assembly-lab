// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 2: the paragraphs, hints, tasks and notes, revised in a separate drafting pass
// from checked facts and kept word for word from docs/notes/module-2/prose.md (the part under "# Lesson 1").
// module-2.prose.test.ts holds every string here to that file, so a change of wording is
// made there first.

export const PROSE = {
  question:
    "In Module 1, the same 32 bits could represent different signed and unsigned numbers. The processor adds these bits without knowing which reading the program uses. The sum may not fit that reading's range. How can the processor tell us when that happens?",

  motivation:
    "Every addition in this lesson uses a `w` name, so it keeps 32 result bits. If the sum of the two numbers is outside the signed or unsigned range, those bits cannot represent that sum under that reading.\n\n" +
    "`add` writes the result and leaves the flags unchanged. `adds` writes the same result and also records four facts about the addition. Each fact is stored in a **flag**: a single bit that is either 0 or 1. The four flags are named N, Z, C and V.\n\n" +
    "Neither instruction stops the program or reports an error when the sum does not fit. To detect this, the program must read a flag.",

  prediction:
    "The figure adds 2147483647 and 1 with `adds w0, w0, w1`, which is `0x7fffffff` plus `0x00000001` in hexadecimal.",
  predictionQuestion: "**Which readings of the answer are right?**",
  predictionExplain:
    "The answer is `0x80000000`. Unsigned, it reads 2147483648, which is right. Signed, it reads −2147483648, which is wrong. 2147483647 plus 1 should be 2147483648. The signed reading cannot hold that number. The largest signed reading is 2147483647 (Module 1).",

  investigation:
    "The part of the processor that adds is the **adder**. The figure works the addition column by column, from the right, as on paper. A column adds its two bits and the 1 carried in from the right, if there is one. The total is 0, 1, 2 or 3.\n\n" +
    "The column keeps the total's lowest bit as its result bit. It passes the total's other bit, the **carry**, to the next column on the left.\n\n" +
    "You can step through the figure one column at a time, jump over a group of columns, or show them all.\n\n" +
    "After `adds`, four flags record facts about the answer:\n\n" +
    "- N is the top bit of the result.\n" +
    "- Z is 1 when all 32 result bits are 0.\n" +
    "- C is the carry out of bit 31, for an addition.\n" +
    "- V is 1 when the carry into bit 31 differs from the carry out of it.\n\n" +
    "The figure's last column, bit 31, shows the carry into bit 31 and the carry out of it. Those two carries give C and V.",
  investigationDetailsSummary: "How GCC checks for overflow",
  investigationDetails:
    "`__builtin_add_overflow` is a function built into GCC. It adds two numbers and reports whether the result did not fit. For two `int`s, GCC 16.1 with `-O1`, as in Module 0, compiles a call to it into this:\n\n" +
    "```\n" +
    "add_overflows:\n" +
    "        cmn     w0, w1\n" +
    "        cset    w0, vs\n" +
    "        ret\n" +
    "```\n\n" +
    "The first line, `add_overflows:`, is the function's name and a colon. The two instructions before `ret` return 1 exactly when V is set. A later module explains them.",

  construction:
    "Earlier, you predicted one addition. Now you predict three.\n\nFor these 32-bit additions:\n\n- N is the result's top bit.\n- Z is 1 when the result bits are all zero.\n- C is the carry out of bit 31.\n- V is 1 when the carry into bit 31 differs from the carry out.",

  flagsTask:
    "Give N, Z, C and V for each of three additions with `adds`. Each addition has its own group of four boxes, N, Z, C and V. Each box takes 0 or 1.\n\n" +
    "The three additions are:\n\n" +
    "- `0xffffffff` plus 1\n" +
    "- 5 plus 3\n" +
    "- `0x80000000` plus `0x80000000`\n\n" +
    "Check your answers. A wrong flag is named, and the answers you got right stay.",
  flagsHints: [
    "C is the carry out of the top bit. V is 1 when the carry into the top bit and the carry out of it differ.",
    "Do not give C and V the same value automatically. One addition here sets both, and one sets only C.",
    "5 plus 3 is 8. No carry reaches the top bit, so N, Z, C and V are all 0.",
    "`0xffffffff` plus 1 is 0 with a carry out of the top bit, so Z is 1 and C is 1.",
    "`0xffffffff` plus 1 gives N 0, Z 1, C 1 and V 0. 5 plus 3 has all four at 0. `0x80000000` plus `0x80000000` gives N 0, Z 1, C 1 and V 1.",
  ] as const,

  /** Shown with the figure that opens when the flags challenge is passed. */
  flagsAfter:
    "C and V are separate tests, one for each reading, so either can be 1 without the other. `0xffffffff` plus 1 carries into bit 31 and out of it, so C is 1 and V is 0; `0x7fffffff` plus 1 carries into bit 31 but not out, so C is 0 and V is 1. `0x80000000` plus `0x80000000` makes C and V both 1.",

  failureExperiment:
    "The figure runs `sum_flags` with `w0` = `0x7fffffff`, `w1` = 1 and `w2` = `0xffffffff`.\n\n" +
    "It runs `adds w3, w2, w2` first, which adds `0xffffffff` to itself. Then it runs `add w0, w0, w1`, which adds `0x7fffffff` and 1. After each step, the figure marks the registers that were written and the flags whose values changed.",
  failureQuestion: "**After `add`, what do the flags show?**",
  failureExplain:
    "N and C are still 1, as `adds` left them. `add` wrote `0x80000000` to `w0` and left the flags alone.\n\n" +
    "Had `add` calculated new flag values, they would be N 1, Z 0, C 0 and V 1. That is what `adds` gives for `0x7fffffff` plus 1 earlier in this lesson. Had `add` cleared them, all four would be 0.\n\n" +
    "Of `add`, `adds` and `sub`, only `adds` writes the flags.",

  explanation:
    "The adder produces the same 32 result bits for both readings. N records the top bit, and Z records whether all the result bits are zero.\n\n" +
    "C records the carry out of bit 31. After an addition, C is 1 when the sum of the unsigned numbers is too large for 32 bits.\n\n" +
    "V reports signed **overflow**: the sum of the signed numbers is outside the signed range. V is 1 when the carry into bit 31 differs from the carry out of it.\n\n" +
    "C and V are separate tests.",

  generalisation:
    "Every `adds` writes all four flags. The flags keep their values until another instruction writes them. `add` and `sub` do not write the flags.\n\n" +
    "To check whether an addition fits, a program reads C for unsigned numbers or V for signed numbers. Later modules show instructions that read the flags.",

  challenge: "This challenge uses V to detect a sum outside the signed range.",
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
    "- `adds` adds two numbers and writes N, Z, C and V.\n" +
    "- N and Z describe the result.\n" +
    "- C is the carry out of bit 31 for an addition.\n" +
    "- V reports signed overflow.\n" +
    "- `add` does not write the flags.\n" +
    "- The flags keep their values until an instruction writes them.\n\n" +
    "**Question:** `adds` adds `0xc0000000` and `0xc0000000`. Which of C and V is 1?",
  reflectionAnswerSummary: "Answer",
  reflectionAnswer:
    "The result is `0x80000000`. A carry goes into bit 31 and a carry comes out, so C is 1 and V is 0. The unsigned result does not fit, but the signed one does: −1073741824 plus −1073741824 is −2147483648.",

  modelVsReality:
    "The architecture is Arm's published definition of what each instruction does. The simulator works out the flags as the architecture defines them. The course checks its simulator against QEMU, a widely used program that imitates Arm processors. A real processor need not add column by column. The drawing shows the arithmetic, not the circuit. The digital-design course builds the circuit.",
} as const;
