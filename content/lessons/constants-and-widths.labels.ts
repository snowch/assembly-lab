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
    reflection: "Looking back",
  },
  captions: {
    listing: "The two functions and GCC's listings for them.",
    tester: "Type a number; the figure shows whether one mov can hold it, and what w0 then holds.",
    halves: "x3 drawn as two halves of 32 bits, with w3 its lower half.",
    // The prose file gives no caption for these four figures; they are DRAFT.
    // DRAFT
    predictFits: "A prediction about which number one mov can put in w0.",
    // DRAFT
    build: "The assembly editor, with the text that does not assemble.",
    // DRAFT
    predictWidth: "A prediction about what x3 holds after mov w3, -1.",
    // DRAFT
    predictTwo: "Work out two registers by hand, then give a number for each.",
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
