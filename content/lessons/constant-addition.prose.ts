// Copyright © 2026 Christopher Snow

// Separate draft from docs/notes/constant-addition/brief.md.
// Canonical copy: docs/notes/fundamentals/prose.md.
export const CONSTANT_ADDITION_PROSE = {
  sections: {
    motivation:
      "The third operand of `add` can be a number written inside the instruction. That fixed number is a **constant**.\n\nIn `add w2, w0, 1`, the instruction reads `w0` and adds the constant 1. The first operand still names the destination, `w2`.",
    investigation:
      "The next example starts again with `w0` holding 7. In `add w0, w0, 1`, both appearances of `w0` name the same register. The instruction reads its old value before writing the result there.",
    challenge:
      "Use a different constant and destination. Work out the result without running the instruction.",
  },
  firstFigure: {
    title: "Add into w2",
    prose: "Run `add w2, w0, 1` with the starting values shown.",
  },
  figure: {
    title: "Add back into w0",
    prose: "Run `add w0, w0, 1`. This example starts afresh.",
  },
  challenge: {
    task: "Before `add w1, w0, 3` runs, `w0` holds 10 and `w1` holds 0. What do `w1` and `w0` hold after this instruction?",
    hints: [
      "A constant supplies its value directly; it does not name a register.",
      "The 3 is an input value, not a register number. The first operand still names the destination.",
      "In the worked example, `add w2, w0, 1` starts with 7 in `w0` and writes 8 to `w2`. The input `w0` keeps 7.",
      "Add the value in `w0` to 3. Write the result to `w1`; `w0` is not written.",
      "`w1` holds 13 and `w0` still holds 10.",
    ],
  },
  modelVsReality: "",
  originalityNote: {
    textbookExample:
      "A constant is often introduced while loading registers inside a complete program.",
    howThisDiffers:
      "This lesson introduces a number inside an addition before the first function. Two independent examples show a separate destination and reuse of the input register. The exercise changes the constant and destination.",
  },
} as const;
