// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 2: the paragraphs, hints, tasks and notes, revised in a separate drafting pass
// from checked facts and kept word for word from docs/notes/module-2/prose.md (the part under "# Lesson 1").
// module-2.prose.test.ts holds every string here to that file, so a change of wording is
// made there first.

export const PROSE = {
  question:
    "In Module 1, the same 32 bits could represent different signed and unsigned numbers. The processor adds these bits without knowing which reading the program uses. The sum may not fit that reading's range. How can the processor tell us when that happens?",

  motivation:
    "Every addition in this lesson uses 32-bit register names such as `w0`, so it keeps 32 result bits. If the sum of the two numbers is outside the signed or unsigned range, those bits cannot represent that sum under that reading.\n\n" +
    "A **flag** is a single bit stored by the processor, separate from the result in a register. Its value is either 0 or 1. Arm conventionally lists the four flags in **NZCV** order:\n\n" +
    "- N means **Negative**, for the signed reading.\n- Z means **Zero**, for both signed and unsigned readings.\n- C means **Carry**, for checking whether an addition’s sum fits the unsigned range.\n- V means **Overflow**, for signed arithmetic. Remember the **v** in “overflow”.\n\n" +
    "With the same 32-bit inputs, these two instructions write the same result bits:\n\n- `add` writes the result and leaves the flags at their previous values.\n- `adds` writes the result and updates all four flags to record facts about the addition.\n\nThe final `s` in `adds` means **setting flags**: calculating a new 0 or 1 value for each flag.\n\n" +
    "Neither instruction stops the program or reports an error when the sum does not fit. After `adds`, the program can read a flag to check whether the sum fits.",

  prediction:
    "For 32-bit additions, `add` and `adds` add bit patterns without choosing a signed or unsigned reading. The reading depends on how the program uses the bits.\n\nThe figure adds the inputs `0x7fffffff` and `0x00000001` with `adds w0, w0, w1`.",

  predictionQuestion:
    "Read both inputs as unsigned numbers and work out their sum. Then read both inputs as signed numbers and work out their sum.\n\nThe 32-bit ranges are:\n\n- Unsigned: 0 to 4294967295.\n- Signed: −2147483648 to 2147483647.\n\n**For which input readings does the exact sum fit in the corresponding 32-bit range?**",

  predictionExplain:
    "The exact sum is 2147483648. The 32-bit result is `0x80000000`: 2147483648 unsigned, or −2147483648 signed. Both are valid readings of those bits. Only the unsigned reading represents the exact sum. The sum is outside the signed 32-bit range, whose largest value is 2147483647 (Module 1).",

  investigation:
    "The part of the processor that adds is the **adder**. The figure uses the carrying rule you practised in [Arithmetic with four bits](#/lesson/four-bit-arithmetic), now across 32 columns. Each column keeps its result bit and passes its carry to the next column on the left. The figure explains the arithmetic, not a processor’s circuit.",

  investigationControls:
    "Press **Next column** to reveal one column, starting at bit 0 on the right. **Next group of four** reveals through the end of that group. **Show all** reveals the complete addition, and **Reset** hides the calculation again. These controls reveal parts of one addition; they do not execute more instructions.",
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

  construction: "Now predict the four flags for three fresh 32-bit additions.",

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
    "The figure runs `sum_flags` with:\n\n- `w0` = `0x7fffffff`.\n- `w1` = 1.\n- `w2` = `0xffffffff`.\n\n" +
    "It runs these instructions in order:\n\n1. `adds w3, w2, w2` adds `0xffffffff` to itself.\n2. `add w0, w0, w1` adds `0x7fffffff` and 1.\n\nAfter each step, the figure marks the registers that were written and the flags whose values changed.",
  failureQuestion: "**After `add`, what do the flags show?**",
  failureExplain:
    "N and C are still 1, as `adds` left them. `add` wrote `0x80000000` to `w0` and left the flags alone.\n\n" +
    "Had `add` calculated new flag values, they would be N 1, Z 0, C 0 and V 1. That is what `adds` gives for `0x7fffffff` plus 1 in [the earlier addition](#/lesson/adding-and-the-flags). Had `add` cleared them, all four would be 0.\n\n" +
    "Of `add`, `adds` and `sub`, only `adds` writes the flags.",

  explanation:
    "After this 32-bit `adds`, use the result bits and the two carry marks at bit 31 to find the four flags:\n\n- N is the top bit of the result, bit 31.\n- Z is 1 if all 32 result bits are 0; otherwise it is 0.\n- C is the carry out of bit 31. It is 1 if a carry leaves that column; otherwise it is 0.\n- V is 1 if the carry into bit 31 differs from the carry out; it is 0 if they match.\n\nThe adder produces the same 32 result bits for both readings. C tells you whether the exact sum of the unsigned inputs exceeds the unsigned 32-bit range. V reports signed **overflow**: the exact sum of the signed inputs is outside the signed 32-bit range. A value of 1 means the sum does not fit that range; 0 means it fits.\n\nC and V are separate tests. Either can be 1 without the other.\n\nFor optional hardware background, explore [Bit Lab’s four-bit arithmetic and logic circuit](https://snowch.github.io/bit-lab/#/lesson/alu). It is a teaching model, not an Arm processor’s circuit.",

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

  modelVsReality: "",
} as const;
