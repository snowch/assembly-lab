// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-7/prose.md.
export const LABELS = {
  title: "Array addresses and moving pointers",
  objectives: [
    "translate an array index into a byte address;",
    "distinguish offset, pre-index and post-index loads;",
    "walk a trip log without reading beyond its entries.",
  ],
  titles: {
    question: "How does a load choose an array element?",
    motivation: "Scale the index by the element size",
    prediction: "Read the third journey",
    investigation: "Compare three ways to address memory",
    construction: "Write an indexed load",
    failureExperiment: "An index used as a byte offset",
    explanation: "Move through the array",
    generalisation: "Choose the stopping point",
    challenge: "Add the trip distances",
    reflection: "What you now know",
  },
  captions: {
    listing: "read_trip in C and the instructions GCC made from it.",
    predict: "Predict which array element the scaled load reads.",
    step: "Follow the selected bytes into w0.",
    offset: "Use an offset without changing x0.",
    preIndex: "Update x0 before the load.",
    postIndex: "Load from x0, then update it.",
    write: "Write and test an indexed load.",
    predictFailure: "Predict the value loaded without the index scale.",
    failureStep: "Inspect the bytes read by the unscaled load.",
    sum: "Follow the compiled sum_trips through the trip log.",
    final: "Write a loop that adds the requested entries.",
  },
  options: {
    prediction: [
      {
        value: "0x00000019",
        label: "0x00000019",
      },
      {
        value: "0x00000007",
        label: "0x00000007",
      },
      {
        value: "0x00000028",
        label: "0x00000028",
      },
    ],
    failure: [
      {
        value: "0x00190000",
        label: "0x00190000",
      },
      {
        value: "0x00000007",
        label: "0x00000007",
      },
      {
        value: "0x00000019",
        label: "0x00000019",
      },
    ],
  },
  challenges: {
    write: {
      title: "Write read_trip",
      tests: [
        "Read index zero",
        "Read index two",
        "Read index three",
        "Read an element with every bit set",
        "Read a zero element",
      ],
    },
    final: {
      title: "Write sum_trips",
      tests: [
        "Add no entries",
        "Add the first entry",
        "Add the first three entries",
        "Add all four entries",
        "Add values whose sum wraps",
      ],
    },
  },
} as const;
