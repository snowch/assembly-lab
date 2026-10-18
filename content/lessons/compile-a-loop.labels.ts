// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-10/prose.md.
export const LABELS = {
  title: "Compile a loop and follow its branches",
  objectives: [
    "identify a loop’s condition, body and update in generated assembly;",
    "check how a boundary edit changes the number of iterations;",
    "write a C loop whose repeated operations stay within their rules.",
  ],
  titles: {
    question: "Which branch repeats the C loop?",
    motivation: "Place the condition around the body",
    prediction: "Add the rate for each interval",
    investigation: "Step from the body back to the condition",
    construction: "Write repeated addition in assembly",
    failureExperiment: "Include one counter value too many",
    explanation: "Read the boundary with the counter’s range",
    generalisation: "Check the empty case and each operation",
    challenge: "Write repeated shifts in C",
    reflection: "What you now know",
  },
  captions: {
    listing: "accumulated_charge and the course compiler’s generated loop.",
    predict: "Predict the total before running the loop.",
    playground: "Edit the loop and follow its generated branches.",
    write: "Write a repeated-addition loop directly in assembly.",
    predictFailure: "Predict the total after changing < to <=.",
    failure: "Compile and inspect the loop with the changed boundary.",
    final: "Write and test a C loop that shifts one place at a time.",
  },
  options: {
    prediction: [
      {
        value: "16",
        label: "16",
      },
      {
        value: "12",
        label: "12",
      },
      {
        value: "4",
        label: "4",
      },
    ],
    failure: [
      {
        value: "16",
        label: "16",
      },
      {
        value: "12",
        label: "12",
      },
      {
        value: "0",
        label: "0",
      },
    ],
  },
  challenges: {
    write: {
      title: "Write accumulated_charge in assembly",
      tests: [
        "Perform no additions for zero count",
        "Add the rate once",
        "Add the example rate three times",
        "Wrap the unsigned total",
        "Repeat a zero rate",
      ],
    },
    final: {
      title: "Write course_while in C",
      tests: [
        "Shift 128 three times",
        "Preserve the value for zero count",
        "Keep zero while counting down",
        "Handle 32 separate shifts",
        "Shift an input with its top bit set",
      ],
    },
  },
} as const;
