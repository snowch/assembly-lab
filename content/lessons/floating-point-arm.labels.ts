// Copyright © 2026 Christopher Snow

export const LABELS = {
  title: "Arm floating-point registers and arithmetic",
  line: "Connect recorded C arithmetic to the floating-point register bank and its instructions.",
  objectives: [
    "Distinguish the s/d views of a floating-point register from the w/x views of a general register.",
    "Read recorded fadd and fmul operands and explain which format they select.",
  ],
  titles: {
    question: "A separate register bank",
    experiment: "Recorded arithmetic",
    exercise: "Predict a fresh addition",
  },
  captions: {
    explorer: "Recorded GCC instructions and QEMU results for the selected arithmetic case.",
    check: "A fresh arithmetic-width question, with feedback after submission.",
  },
  originality: {
    textbookExample: "A broad SIMD register overview followed by unrelated arithmetic mnemonics.",
    howThisDiffers:
      "Keeps scalar floating-point arithmetic around route distance and fuel cost. Matched recorded C and assembly expose the selected widths without extending the browser CPU.",
  },
} as const;
