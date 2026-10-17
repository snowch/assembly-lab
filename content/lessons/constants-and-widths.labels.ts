// Copyright © 2026 Christopher Snow

// The second lesson of Module 1: its titles, objectives, captions, option labels and field labels.
// Those that docs/notes/module-1/prose.md gives are kept word for word (a section title that holds
// code has its backticks taken out, because the page draws a section's title as plain text). A
// caption the prose file does not give is marked DRAFT, and so is any other label it does not
// give; constants-and-widths.prose.test.ts lists them.

export const LABELS = {
  objectives: [
    "say which numbers one `mov` can put in a register, and build the rest with `movk`;",
    "explain why `-1` and `4294967295` give the same instruction;",
    "use the `x` and `w` names of one register, and say what writing the `w` name does to the rest.",
  ],
  titles: {
    question: "Why can one instruction not hold 1000000?",
    motivation: "Numbers inside instructions",
    prediction: "Which numbers fit?",
    investigation: "Trying a number",
    construction: "Building 1000000",
    failureExperiment: "Two names, one register",
    explanation: "Constants in halves",
    generalisation: "Constants and C types",
    challenge: "Four instructions",
    reflection: "What you now know",
  },
  captions: {
    listing: "service_interval in C and the instructions GCC produces for it.",
    tester: "Type a number; the figure shows whether one mov can hold it, and what w0 then holds.",
    halves: "x3 drawn as two halves of 32 bits, with w3 its lower half.",
    // The prose file gives no caption for these three figures: each is marked DRAFT until it has
    // been through the prose process.
    // DRAFT
    serviceHalves: "w0 after mov w0, 30000, in two halves of 16 bits.",
    // DRAFT
    workedHalves:
      "w0 in two halves of 16 bits, through mov w0, 3 and movk w0, 2, lsl 16. A half is new or kept after each step.",
    // DRAFT
    solutionHalves:
      "Your solution to Build 1000000, one instruction at a time, with w0 in two halves of 16 bits.",
    // The prose file gives no caption for these four figures; Haiku drafted them (16 October 2026).
    predictFits:
      "Use the rule about set bits in one half to choose a number that must fit in one mov.",
    build:
      "The assembly editor starts with text the assembler refuses: one mov with a number it cannot hold. Write instructions that put that number in w0.",
    predictWidth: "A prediction about what all 64 bits of x3 hold after mov w3, -1.",
    predictTwo:
      "Work out by hand what x1 and w2 hold after the short listing, then type a number for each.",
  },
  options: {
    fits: [
      { value: "65536", label: "65536" },
      { value: "70000", label: "70000" },
      { value: "100000", label: "100000" },
      { value: "1000000", label: "1000000" },
    ],
    width: [
      { value: "all-set", label: "All 64 bits set, as before." },
      { value: "low-set", label: "The lower 32 bits set and the upper 32 cleared." },
      { value: "unknown", label: "The lower 32 bits set and the upper 32 unknown." },
      { value: "error", label: "The run stops with an error." },
    ],
  },
  challenges: {
    build: { title: "Build 1000000" },
    predict: {
      title: "Predict two registers",
      fields: {
        x1: "`x1` at the end",
        w2: "`w2` at the end",
      },
    },
  },
} as const;
