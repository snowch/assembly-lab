// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-11/prose.md.
export const LABELS = {
  title: "C overflow and machine results",
  objectives: [
    "distinguish a defined instruction result from undefined C behaviour;",
    "explain why a compiler can remove a signed-overflow test;",
    "check a signed bound before performing arithmetic.",
  ],
  titles: {
    question: "Why did the compiler remove the addition?",
    motivation: "C does not promise signed wrapping",
    prediction: "Add at the signed limit in A64",
    investigation: "Compare two compiler contracts",
    construction: "Test the limit first",
    failureExperiment: "Require signed wrapping with a compiler option",
    explanation: "Check the operands before adding",
    generalisation: "Stop at the maximum",
    challenge: "Write a safe increment",
    reflection: "What you now know",
  },
  captions: {
    listing: "can_increment in C and GCC’s ordinary recorded output.",
    predict: "Predict the bits from a direct A64 addition.",
    step: "Inspect the A64 result and all four flags.",
    compare: "Compare the recorded ordinary and -fwrapv compilations.",
    write: "Test the original input against the signed limit.",
    predictFailure: "Predict the result required when signed wrapping is enabled.",
    stepFailure: "Follow the comparison emitted with -fwrapv.",
    extra: "Inspect safe_increment with the conditional kept as a branch.",
    final: "Guard the increment at the signed upper limit.",
  },
  options: {
    prediction: [
      {
        value: "0x7fffffff",
        label: "0x7fffffff",
      },
      {
        value: "0x80000000",
        label: "0x80000000",
      },
      {
        value: "0x00000000",
        label: "0x00000000",
      },
    ],
    failure: [
      {
        value: "0",
        label: "0",
      },
      {
        value: "1",
        label: "1",
      },
    ],
  },
  challenges: {
    write: {
      title: "Write increment_limit",
      tests: [
        "Test zero",
        "Test one",
        "Test the value below the maximum",
        "Test the maximum signed value",
        "Test the minimum signed value",
        "Test minus one",
      ],
    },
    final: {
      title: "Write safe_increment",
      tests: [
        "Increment zero",
        "Increment one",
        "Reach the maximum",
        "Keep the maximum unchanged",
        "Increment the minimum",
        "Increment minus one",
      ],
    },
  },
  sides: ["Ordinary GCC settings", "With GCC -fwrapv"],
} as const;
