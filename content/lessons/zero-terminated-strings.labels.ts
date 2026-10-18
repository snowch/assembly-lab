// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-7/prose.md.
export const LABELS = {
  title: "Strings and the zero byte",
  objectives: [
    "follow a byte scan to its terminator;",
    "bound a scan by the number of readable bytes;",
    "count matching bytes without counting beyond the string.",
  ],
  titles: {
    question: "Where does a label end?",
    motivation: "Read one byte and test it",
    prediction: "Find the first zero",
    investigation: "Follow the scan through memory",
    construction: "Write a bounded length function",
    failureExperiment: "Counting the terminator",
    explanation: "Count only the bytes that belong to the label",
    generalisation: "Use the right stopping rule",
    challenge: "Count a marker in the label",
    reflection: "What you now know",
  },
  captions: {
    listing: "label_length in C and the instructions GCC made from it.",
    predict: "Predict the length before the first zero byte.",
    step: "Follow the bounded scan through the label.",
    empty: "Inspect a scan whose first byte is zero.",
    write: "Write and test a bounded byte scan.",
    predictFailure: "Predict the result when the count increases before the zero test.",
    failureStep: "Follow the loop that counts the terminator.",
    bounded: "Inspect a bounded scan with no zero byte within its capacity.",
    walk: "Follow a pointer that advances one byte after each load.",
    final: "Count matching bytes before the first zero.",
  },
  options: {
    prediction: [
      {
        value: "0x0000000000000008",
        label: "0x0000000000000008",
      },
      {
        value: "0x0000000000000006",
        label: "0x0000000000000006",
      },
      {
        value: "0x0000000000000005",
        label: "0x0000000000000005",
      },
    ],
    failure: [
      {
        value: "0x00000006",
        label: "0x00000006",
      },
      {
        value: "0x00000005",
        label: "0x00000005",
      },
      {
        value: "0x00000008",
        label: "0x00000008",
      },
    ],
  },
  challenges: {
    write: {
      title: "Write label_length",
      tests: [
        "Scan A-B-C within its capacity",
        "Scan an empty label",
        "Read no bytes with zero capacity",
        "Reach the capacity without finding zero",
        "Stop at a zero before the capacity",
      ],
    },
    final: {
      title: "Write count_marker",
      tests: [
        "Count separators in A-B-C",
        "Count within an empty label",
        "Ignore a marker after the terminator",
        "Count repeated markers",
        "Count the ASCII character 0",
      ],
    },
  },
} as const;
