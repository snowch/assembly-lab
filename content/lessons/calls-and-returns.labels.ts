// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-9/prose.md.
export const LABELS = {
  title: "Calls, returns and the stack",
  objectives: [
    "follow a helper call through the link register;",
    "save and restore a function’s stack frame;",
    "preserve values according to the calling convention.",
  ],
  titles: {
    question: "How does a function find its way back?",
    motivation: "Save the return address before a call",
    prediction: "Call the distance helper",
    investigation: "Inspect the saved values on the stack",
    construction: "Call a helper and resume",
    failureExperiment: "Returning through an overwritten link",
    explanation: "Share responsibility across the call",
    generalisation: "Protect what the caller still needs",
    challenge: "Keep the reserve across a call",
    reflection: "What you now know",
  },
  captions: {
    listing: "trip_report and its helper in C and recorded GCC assembly.",
    predict: "Predict the report returned after the helper call.",
    step: "Follow the call, the saved registers and the return.",
    investigate: "Inspect the active stack space as the report runs.",
    write: "Write a call that returns to its original caller.",
    predictFailure: "Predict whether the report returns before the recording limit.",
    stepFailure:
      "After committing, step through the changed function and inspect its return addresses.",
    final: "Keep the original reserve while the helper changes w1.",
  },
  options: {
    prediction: [
      {
        value: "0x00000040",
        label: "0x00000040",
      },
      {
        value: "0x00000049",
        label: "0x00000049",
      },
      {
        value: "0x00000089",
        label: "0x00000089",
      },
    ],
    failure: [
      {
        value: "limit",
        label: "The recording reaches its instruction limit.",
      },
      {
        value: "returned",
        label: "The report returns to its original caller.",
      },
    ],
  },
  challenges: {
    write: {
      title: "Complete report_once",
      tests: [
        "Call with zero distance",
        "Call with distance one",
        "Call with odd distance seven",
        "Call with distance 128",
        "Call with the maximum unsigned distance",
      ],
    },
    final: {
      title: "Preserve the reserve",
      tests: [
        "Keep a reserve with zero distance",
        "Handle zero reserve",
        "Keep the reserve for an odd distance",
        "Keep both inputs across the helper call",
        "Wrap the unsigned result and restore saved registers",
      ],
    },
  },
} as const;
