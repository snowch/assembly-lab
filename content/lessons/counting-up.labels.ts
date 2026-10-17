// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 5. Kept word for word in docs/notes/module-5/prose.md.
export const LABELS = {
  title: "Counting up, and the branch backwards",
  objectives: [
    "follow a loop and distinguish iterations from instructions;",
    "explain why the first test can skip the loop body;",
    "write a counting loop that handles equal and descending endpoints.",
  ],
  titles: {
    question: "How do instructions repeat?",
    motivation: "The body, the test and the next tick",
    prediction: "Count the instructions in a loop",
    investigation: "Follow the branch backwards",
    construction: "Write the dimming loop",
    failureExperiment: "Changing bne to beq",
    explanation: "Why the last test asks about equality",
    generalisation: "Find what changes and what stops the loop",
    challenge: "Count three runs",
    reflection: "What you now know",
  },
  captions: {
    listing: "dim_up in C and the instructions GCC made from it.",
    predict: "Predict the number of instructions run by dim_up(128, 2, 5).",
    step: "Follow dim_up(128, 2, 5) one instruction at a time.",
    runs: "Choose endpoints and see how many dimming operations run and the brightness after each one.",
    write: "Write and test your counting loop.",
    predictFailure: "Predict the result after changing the backward bne to beq.",
    failureRuns:
      "See how many dimming operations the changed loop runs and the brightness after each one.",
    final: "Give a result and an instruction count for each call.",
  },
  runs: ["dim_up(128, 2, 5)", "dim_up(128, 5, 5)", "dim_up(128, 5, 2)"],
  options: {
    prediction: [
      { value: "15", label: "15" },
      { value: "7", label: "7" },
      { value: "12", label: "12" },
      { value: "3", label: "3" },
    ],
    failure: [
      { value: "16", label: "16" },
      { value: "64", label: "64" },
      { value: "128", label: "128" },
      { value: "0", label: "0" },
    ],
  },
  challenges: {
    write: {
      title: "Write dim_up",
      tests: [
        "dim_up(128, 2, 5)",
        "dim_up(128, 5, 5)",
        "dim_up(128, 5, 2)",
        "dim_up(128, 0, 1)",
        "dim_up(0xffffffff, 0, 31)",
        "dim_up(128, 0xfffffffc, 0xffffffff)",
        "dim_up(128, 2147483646, 2147483649)",
      ],
    },
    final: {
      title: "Count three runs of dim_up",
      groups: ["`dim_up(128, 7, 7)`", "`dim_up(128, 7, 8)`", "`dim_up(128, 7, 9)`"],
      fields: {
        resultZero: "`dim_up(128, 7, 7)` returns",
        stepsZero: "instructions run for `dim_up(128, 7, 7)`",
        resultOne: "`dim_up(128, 7, 8)` returns",
        stepsOne: "instructions run for `dim_up(128, 7, 8)`",
        resultTwo: "`dim_up(128, 7, 9)` returns",
        stepsTwo: "instructions run for `dim_up(128, 7, 9)`",
      },
    },
  },
} as const;
