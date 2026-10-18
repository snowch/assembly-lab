// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-9/prose.md.
export const LABELS = {
  title: "Recursive calls and separate frames",
  objectives: [
    "follow saved values across recursive calls;",
    "explain how a base case and a changing argument stop recursion;",
    "complete a recursive function while preserving its caller’s state.",
  ],
  titles: {
    question: "What does each recursive call keep?",
    motivation: "Save the current brightness",
    prediction: "Add the fading brightness levels",
    investigation: "Follow the frames down and back",
    construction: "Repair the base-case branch",
    failureExperiment: "A recursive call that makes no progress",
    explanation: "Finish the pending work as calls return",
    generalisation: "Define the smaller problem",
    challenge: "Count the nonzero brightness levels",
    reflection: "What you now know",
  },
  captions: {
    listing: "fade_sum in C and recorded GCC assembly.",
    predict: "Predict the sum returned by fade_sum(7).",
    step: "Follow each recursive call and return.",
    investigate: "Inspect the stack when the recursive calls are all active.",
    write: "Repair the branch that selects the recursive path.",
    predictFailure: "Predict whether an unchanged argument reaches a return.",
    stepFailure: "Inspect repeated arguments and growing stack space.",
    final: "Count the current brightness level after the recursive call returns.",
  },
  options: {
    prediction: [
      {
        value: "0x00000007",
        label: "0x00000007",
      },
      {
        value: "0x0000000b",
        label: "0x0000000b",
      },
      {
        value: "0x00000003",
        label: "0x00000003",
      },
    ],
    failure: [
      {
        value: "limit",
        label: "The recording reaches its instruction limit.",
      },
      {
        value: "returned",
        label: "The function returns.",
      },
    ],
  },
  challenges: {
    write: {
      title: "Repair fade_sum",
      tests: [
        "Return from the zero base case",
        "Sum one nonzero level",
        "Sum the levels starting at seven",
        "Sum a longer sequence of levels",
        "Wrap a sum from the maximum unsigned brightness",
      ],
    },
    final: {
      title: "Complete lit_count",
      tests: [
        "Count no levels for zero",
        "Count one nonzero level",
        "Count the levels starting at seven",
        "Count the levels starting at 128",
        "Count every possible unsigned bit position",
      ],
    },
  },
} as const;
