// Copyright © 2026 Christopher Snow

export const LABELS = {
  title: "Floating-point bits",
  line: "Read a binary fraction, then decode the sign, scale and fraction in its stored bits.",
  objectives: [
    "Write a small binary fraction as a sum of place values.",
    "Decode a normal binary32 value and distinguish the reserved exponent states.",
  ],
  titles: {
    question: "Fractions in binary",
    experiment: "Sign, exponent and fraction",
    exercise: "Read a fresh value",
  },
  captions: {
    explorer: "A local calculation of binary32 or binary64 bits. Each bit is editable.",
    check: "A fresh binary-fraction question, with feedback after you check your answer.",
  },
  originality: {
    textbookExample:
      "An isolated sign/exponent/fraction diagram followed by a familiar decimal fraction.",
    howThisDiffers:
      "Starts with a vehicle distance of 9.5 and builds the fractional place values before normalising it. The editable exact model connects every field to the decoded value; a separate fresh distance checks the mechanism.",
  },
} as const;
