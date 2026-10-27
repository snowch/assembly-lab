// Copyright © 2026 Christopher Snow

// Separate draft from docs/notes/returning-to-caller/brief.md and the checked model facts.
// Canonical copy: docs/notes/returning-to-caller/prose.md.
export const RETURNING_PROSE = {
  sections: {
    motivation:
      "The caller and `increment_int` use the same registers. A function does not get a separate set. When `increment_int` writes its result into `w0`, that value is available to the caller too.\n\n`ret` tells the processor where to continue. The caller can then run its next instruction using the result already in `w0`.",
    investigation:
      "An instruction’s address identifies its place in memory. The **return address** is the address where the caller should continue. Here, `x30` holds that address. Plain `ret` uses it to choose the next instruction.\n\nThe figure starts after the call has entered `increment_int(7)`. Press Run the instruction for each step. Watch the marker ▸ return to the caller, then run the caller’s addition. The marker names the instruction that runs next; the highlighted instruction is the one that just ran. On a narrow screen, scroll sideways within the function listing to see the C and instructions.",
    explanation:
      "`ret` left `w0` and `w1` unchanged. Execution continued in the caller, whose addition read `w0` and wrote `w1`. Both pieces of code used the same register values.\n\nThe caller can use the other general-purpose registers too. It looks in `w0` for this `int` result because caller and function follow an agreed set of rules, a **calling convention**. `ret` does not select the result register.\n\nThe rules also say which register values a function must preserve. The [later calls lesson](#/lesson/calls-and-returns) develops those rules.",
    challenge:
      "Trace the same instructions with a fresh argument. Keep track of where execution goes and what stays in the registers.",
  },
  references: {
    summary: "Check Arm’s references",
    prose:
      "- [RET: return from subroutine](https://support.arm.com/documentation/ddi0602/2025-12/Base-Instructions/RET--Return-from-subroutine-) describes the instruction. Its optional register operand defaults to `x30`.\n- [Arm’s procedure call standard](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst) describes argument registers, result registers and the values a function must preserve.",
  },
  challenge: {
    task: "Start a fresh call, `increment_int(4)`, with `w0` holding 4 and `w1` holding 0. The function runs `add w0, w0, 1`, then `ret`. The caller continues with `add w1, w0, w0`. What does `w0` hold immediately after `ret`, and what does the caller’s addition write to `w1`?",
    hints: [
      "Follow the function’s addition, its return, then the caller’s addition.",
      "Returning changes where execution continues. It does not remove the value from `w0`.",
      "In the worked call, the function left 8 in `w0`. The caller then read that value twice and wrote 16 to `w1`.",
      "First add one to the fresh argument. Keep that result in `w0` through the return, then add it to itself for `w1`.",
      "Immediately after `ret`, `w0` holds 5. The caller’s addition writes 10 to `w1`.",
    ],
  },
  modelVsReality:
    "The model has already run the call setup when the figure opens. The activity stops after the caller’s shown addition; it omits the setup and the caller’s remaining instructions. The caller instruction was written for this course. The paired increment_int listing is the recorded GCC output from A tiny function.",
  originalityNote: {
    textbookExample:
      "A return is often introduced with a complete calling sequence and instructions that save the caller’s state.",
    howThisDiffers:
      "The activity begins inside a familiar one-addition function. One shared register display and a visible caller continuation separate preparing a result, returning and using the result without introducing nested calls.",
  },
} as const;
