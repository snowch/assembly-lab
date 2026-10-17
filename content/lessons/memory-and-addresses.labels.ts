// Copyright © 2026 Christopher Snow

// Module 6, lesson 1. Kept word for word in docs/notes/module-6/prose.md.
export const LABELS = {
  title: "Memory and addresses",
  objectives: [
    "distinguish an address from the value stored there;",
    "follow bytes between memory and a register in little-endian order;",
    "load and store values without changing neighbouring bytes.",
  ],
  titles: {
    question: "Where does a load find its bytes?",
    motivation: "Addresses, brackets and byte order",
    prediction: "Read four bytes as one value",
    investigation: "Move bits between memory and registers",
    construction: "Save the distance reading",
    failureExperiment: "A store that writes too many bytes",
    explanation: "Choose how many bytes to write",
    generalisation: "Keep track of the value and its address",
    challenge: "Copy a distance reading",
    reflection: "What you now know",
  },
  captions: {
    listing: "read_distance in C and the instructions GCC made from it.",
    predict: "Predict the value loaded from four consecutive bytes.",
    step: "Follow the bytes from memory into w0.",
    investigation: "Step through save_distance and inspect the bytes it writes.",
    write: "Write and test a four-byte store.",
    predictFailure: "Predict which bytes the store will change.",
    failureWide: "A four-byte store from w1.",
    failureByte: "A one-byte store from w1.",
    failureHalf: "A two-byte store from w1.",
    wideLoad: "Load eight bytes into the full x0 register.",
    wideStore: "Store eight bytes from the full x1 register.",
    final: "Load a distance, store a copy and return its value.",
  },
  options: {
    prediction: [
      { value: "0x78563412", label: "0x78563412" },
      { value: "0x12345678", label: "0x12345678" },
      { value: "0x00000078", label: "0x00000078" },
      { value: "0x00410000", label: "0x00410000" },
    ],
    failure: [
      { value: "78 56 34 12", label: "78 56 34 12" },
      { value: "78 bb cc dd", label: "78 bb cc dd" },
      { value: "78 56 cc dd", label: "78 56 cc dd" },
      { value: "aa bb cc dd", label: "aa bb cc dd" },
    ],
  },
  challenges: {
    write: {
      title: "Write save_distance",
      tests: [
        "Store zero; preserve the following bytes",
        "Store one; preserve the following bytes",
        "Store 0x12345678; preserve the following bytes",
        "Store 0xffffffff; preserve the following bytes",
        "Store 0x80000000; preserve the following bytes",
      ],
    },
    final: {
      title: "Write copy_distance",
      tests: [
        "Copy 0x12345678 and preserve the source",
        "Copy zero and preserve the source",
        "Copy 0xffffffff and preserve the source",
        "Copy 0x80000000 and preserve the source",
        "Copy 0x89abcdef and preserve the source",
      ],
    },
  },
} as const;
