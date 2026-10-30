// Copyright © 2026 Christopher Snow

// Separate draft from docs/notes/returning-to-caller/brief.md and the checked model facts.
// Canonical copy: docs/notes/returning-to-caller/prose.md.
export const RETURNING_PROSE = {
  sections: {
    motivation:
      "In the previous lesson, `increment_int` left its result in `w0`. The caller and `increment_int` use the same registers, so the caller can read that value when the function returns. Follow the call below to see where execution goes and how the caller uses the result.",
    investigation:
      "An instruction’s address identifies its place in memory. A **branch** changes where execution continues. On AArch64, `bl` means branch with link: `bl increment_int` starts executing `increment_int` and saves the address of the instruction after `bl` in `x30`. That saved address is the **return address**. Register `x30` is also called the **link register**.\n\nPlain `ret` continues execution at the address held in `x30`. These are AArch64 instruction rules, whether the instructions came from C or were written in assembly. Here, the instruction after `bl` is the caller’s addition.\n\nThe figure starts just before `bl`, with the argument already in `w0`. It stops after the caller’s addition. Press Run the instruction to follow the call, the function’s addition, its return and the caller’s addition. The marker ▸ names the instruction that runs next; the highlight marks the instruction that just ran. On a narrow screen, scroll sideways within the function listing to see the C and instructions.\n\nThe caller’s assembly was written by hand. GCC generated `increment_int`’s instructions from the C shown beside them.",
    explanation:
      "In our example, `ret` left `w0` and `w1` unchanged. Execution continued in the caller, whose addition read `w0` and wrote `w1`. Both pieces of code used the same register values.\n\nThe caller can use the other general-purpose registers too. It looks in `w0` for this `int` result because caller and function follow an agreed set of rules, a **calling convention**. `ret` does not select the result register.\n\nThe rules also say which register values a function must preserve.\n\nThis example stops after the caller’s addition. [Saving a return address](#/lesson/calls-and-returns) shows **how** a function keeps its return address when it calls another function.",
    challenge:
      "Trace the same instructions with a fresh argument. Keep track of where execution goes and what stays in the registers.",
  },
  references: {
    summary: "Check Arm’s references",
    prose:
      "- [BL: branch with link](https://support.arm.com/documentation/ddi0602/2025-12/Base-Instructions/BL--Branch-with-Link-) describes how the call saves the return address in `x30`.\n- [RET: return from subroutine](https://support.arm.com/documentation/ddi0602/2025-12/Base-Instructions/RET--Return-from-subroutine-) describes the instruction. Its optional register operand defaults to `x30`.\n- [Arm’s procedure call standard](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst) describes argument registers, result registers and the values a function must preserve.",
  },
  challenge: {
    task: "Start a fresh call, `increment_int(4)`, with:\n\n- `w0` holding 4.\n- `w1` holding 0.\n\nThe caller runs `bl increment_int`. The function runs `add w0, w0, 1`, then `ret`. The caller continues with `add w1, w0, w0`.\n\nWhat does `w0` hold immediately after `ret`, and what does the caller’s addition write to `w1`?",
    hints: [
      "Follow the function’s addition, its return, then the caller’s addition.",
      "Returning changes where execution continues. It does not remove the value from `w0`.",
      "In the worked call, the function left 8 in `w0`. The caller then read that value twice and wrote 16 to `w1`.",
      "First add one to the fresh argument. Keep that result in `w0` through the return, then add it to itself for `w1`.",
      "Immediately after `ret`, `w0` holds 5. The caller’s addition writes 10 to `w1`.",
    ],
  },
  modelVsReality: "",
  originalityNote: {
    textbookExample:
      "A return is often introduced with a complete calling sequence and instructions that save the caller’s state.",
    howThisDiffers:
      "A call to the familiar one-addition function shows where its return address comes from. One shared register display separates preparing a result, returning and using the result without introducing nested calls.",
  },
} as const;
