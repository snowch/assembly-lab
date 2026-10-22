// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-12/prose.md.
export const LABELS = {
  title: "From a function to an executable",
  objectives: [
    "assemble and link the familiar trip function;",
    "run an AArch64 Linux executable with QEMU;",
    "check its result and inspect its machine code.",
  ],
  titles: {
    question: "What surrounds the four instructions?",
    motivation: "Build a program around the function",
    prediction: "Predict the function result",
    investigation: "Create objects and link the executable",
    construction: "Run the trip program",
    failureExperiment: "Buildable code with a wrong calculation",
    explanation: "Test behaviour after rebuilding",
    generalisation: "Inspect the executable",
    challenge: "Repair the native trip function",
    reflection: "What you now know",
  },
  captions: {
    listing: "The familiar trip function, paired with its C calculation.",
    pipeline: "Follow the recorded build from source files to a running process.",
    predict: "Predict the result for the four labelled inputs.",
    step: "Follow the same function in the browser model.",
    predictFailure: "Predict the modified function before inspecting its output.",
    stepFailure: "Find the arithmetic effect of the changed instruction.",
    final: "Return the required result for each test case.",
  },
  options: {
    prediction: [
      {
        value: "232",
        label: "232",
      },
      {
        value: "247",
        label: "247",
      },
      {
        value: "262",
        label: "262",
      },
    ],
    failure: [
      {
        value: "232",
        label: "232",
      },
      {
        value: "247",
        label: "247",
      },
      {
        value: "262",
        label: "262",
      },
    ],
  },
  challenges: {
    final: {
      title: "Repair trip_distance",
      tests: [
        "Subtract the trip correction",
        "Use a different set of distances",
        "Handle zero distances and correction",
        "Subtract a correction from zero",
      ],
    },
  },
} as const;
