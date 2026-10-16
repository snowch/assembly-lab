// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 4: the titles, objectives, captions, option labels and field labels.
// docs/notes/module-4/prose.md gives the objectives, the ten titles, the options, the captions of the
// figures it names and the field labels, kept word for word (a title or caption that holds code has
// its backticks taken out, because the page draws those as plain text). A caption or label the file
// does not give is marked DRAFT; module-4.prose.test.ts lists the marks.

export const LABELS = {
  objectives: [
    "follow a run that skips instructions, and say how many ran;",
    "say what a branch, a label, taken and not taken mean;",
    "build `fuel_warning` from `cmp`, `cbz` and branches.",
  ],
  titles: {
    question: "Which instruction runs next?",
    motivation: "Why a function needs to skip instructions",
    prediction: "Predict how many instructions run",
    investigation: "How a branch chooses its path",
    construction: "Three outcomes from two tests",
    failureExperiment: "Changing bgt to bge",
    explanation: "Branches that test a register",
    generalisation: "When GCC uses a branch",
    challenge: "Count the runs of describe",
    reflection: "Looking back",
  },
  captions: {
    listing:
      "describe in C and the eight instructions GCC made from it. Each instruction sits beside the C line GCC recorded for it.",
    // DRAFT
    predictCount: "A prediction about how many instructions describe(15) runs.",
    // DRAFT
    stepCount:
      "describe(15), one instruction at a time, with the number that have run. A register or flag with an outline has just changed.",
    arrows:
      "describe with an arrow from each branch to its label, for the gradient you choose. The instructions that did not run are greyed.",
    // DRAFT
    fuelWarning: "The assembly editor, starting from a function that returns 0.",
    // DRAFT
    predictBge: "A prediction about what describe returns for 10 once bgt is changed to bge.",
    // DRAFT
    stepBge:
      "describe with bge on 10, one instruction at a time, with the flags and the number of instructions that have run. A register or flag with an outline has just changed.",
    // DRAFT
    counts: "describe, and six numbers to give for three gradients.",
  },
  options: {
    count: [
      { value: "5", label: "5" },
      { value: "8", label: "8" },
      { value: "6", label: "6" },
      { value: "3", label: "3" },
    ],
    bge: [
      { value: "0", label: "`0`" },
      { value: "2", label: "`2`" },
      // The model gives `w0` as an unsigned number: −2 is 4294967294.
      { value: "4294967294", label: "`-2`" },
      { value: "error", label: "the run stops with an error" },
    ],
  },
  challenges: {
    fuelWarning: {
      title: "Write fuel_warning",
      tests: [
        "fuel_warning(0, 10)",
        "fuel_warning(9, 10)",
        "fuel_warning(10, 10)",
        "fuel_warning(200, 10)",
        "fuel_warning(0x80000000, 10)",
      ],
    },
    counts: {
      title: "Count the runs of describe",
      fields: {
        result11: "`describe(11)` returns",
        steps11: "instructions run for `describe(11)`",
        resultM10: "`describe(-10)` returns",
        stepsM10: "instructions run for `describe(-10)`",
        resultM11: "`describe(-11)` returns",
        stepsM11: "instructions run for `describe(-11)`",
      },
    },
  },
} as const;
