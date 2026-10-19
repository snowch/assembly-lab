// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-8/prose.md.
export const LABELS = {
  title: "Division and remainders",
  objectives: [
    "distinguish signed and unsigned quotients;",
    "derive a remainder from the quotient and inputs;",
    "calculate an average without losing intermediate product bits.",
  ],
  titles: {
    question: "What remains after division?",
    motivation: "Choose the interpretation before dividing",
    prediction: "Divide a negative total",
    investigation: "Recover the remainder",
    construction: "Write a signed remainder",
    failureExperiment: "Using unsigned division for signed inputs",
    explanation: "Separate C rules from instruction results",
    generalisation: "Division by a constant",
    challenge: "Calculate fuel consumption",
    reflection: "What you now know",
  },
  captions: {
    listing: "quotient_signed in C and the instructions GCC made from it.",
    predict: "Predict a signed quotient from a negative dividend.",
    step: "Follow the signed division.",
    investigation: "Compute the remainder from the quotient and original dividend.",
    write: "Write and test a signed remainder function.",
    predictFailure: "Predict the result after choosing unsigned division.",
    failureStep: "Inspect the quotient and remainder produced by the changed instruction.",
    wideSigned: "Inspect a signed widening product.",
    wideUnsigned: "Inspect an unsigned widening product.",
    halves: "Compare the product halves.",
    msub: "Subtract quotient times divisor from the dividend.",
    constant: "Follow GCC’s recorded division-by-ten sequence.",
    edgesZero: "Run division by zero as an assembly experiment.",
    edgesOverflow: "Run the unrepresentable signed quotient as an assembly experiment.",
    quotientUnsigned: "Inspect division with unsigned inputs.",
    divisionParts: "See whole groups and the remainder, with their signed values.",
    final: "Calculate consumption with a full-width intermediate product.",
  },
  options: {
    prediction: [
      {
        value: "0xfffffffc",
        label: "0xfffffffc",
      },
      {
        value: "0xfffffffd",
        label: "0xfffffffd",
      },
      {
        value: "0x00000003",
        label: "0x00000003",
      },
    ],
    failure: [
      {
        value: "0x00000004",
        label: "0x00000004",
      },
      {
        value: "0xfffffffe",
        label: "0xfffffffe",
      },
      {
        value: "0x00000002",
        label: "0x00000002",
      },
    ],
  },
  challenges: {
    write: {
      title: "Write remainder_signed",
      tests: [
        "Divide a negative dividend by a positive divisor",
        "Divide positive inputs",
        "Divide by a negative divisor",
        "Divide two negative inputs",
        "Divide zero",
        "Divide the maximum signed value",
        "Divide the minimum signed value",
      ],
    },
    final: {
      title: "Write consumption",
      tests: [
        "Calculate from 600 millilitres over 1000 metres",
        "Preserve a product above 32 bits",
        "Return a result above 32 bits",
        "Handle zero fuel",
        "Handle zero distance",
        "Discard a fractional result",
        "Use maximum unsigned inputs",
      ],
    },
  },
} as const;
