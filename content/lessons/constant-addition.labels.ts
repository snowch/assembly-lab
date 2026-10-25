// Copyright © 2026 Christopher Snow

// Separate draft from docs/notes/constant-addition/brief.md.
// Canonical copy: docs/notes/fundamentals/prose.md.
export const CONSTANT_ADDITION_LABELS = {
  title: "Adding a constant",
  objectives: [
    "Identify a constant supplied by an instruction.",
    "Trace an addition that reads and writes the same register.",
  ],
  titles: {
    motivation: "A number in the instruction",
    investigation: "Read and replace w0",
    challenge: "Use a different constant",
  },
  captions: {
    firstFigure: "An addition with a register input and a constant.",
    figure: "A separate addition that reads and writes w0.",
    challenge: "A fresh constant and destination to trace.",
  },
  challenge: {
    title: "Follow the constant",
    fields: {
      w1: "`w1` after the instruction",
      w0: "`w0` after the instruction",
    },
    tests: {
      w1: "w1 after the instruction",
      w0: "w0 after the instruction",
    },
  },
} as const;
