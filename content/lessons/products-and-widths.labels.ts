// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-8/prose.md.
export const LABELS = {
  title: "Products and their widths",
  objectives: [
    "explain which product bits an instruction keeps;",
    "choose signed or unsigned widening multiplication;",
    "preserve a full product before using it in a calculation.",
  ],
  titles: {
    question: "Where do the extra product bits go?",
    motivation: "The destination limits the result",
    prediction: "Multiply across the 32-bit boundary",
    investigation: "Multiply, then add to a total",
    construction: "Write a scaled addition",
    failureExperiment: "Widening after the bits are lost",
    explanation: "Preserve the full product",
    generalisation: "Read both halves of a product",
    challenge: "Return a wide product",
    reflection: "What you now know",
  },
  captions: {
    listing: "scale_pulses in C and the instructions GCC made from it.",
    predict: "Predict the low 32 bits of the product.",
    step: "Follow the product written to w0.",
    investigation: "Inspect the multiply-and-add in scaled_total.",
    write: "Write a scaled addition with unsigned wrapping.",
    predictFailure: "Predict the full x0 register after a multiplication through w0.",
    failureStep: "Inspect the narrow result before interpreting x0.",
    wideUnsigned: "Multiply unsigned 32-bit inputs into a 64-bit result.",
    wideSigned: "Multiply signed 32-bit inputs into a 64-bit result.",
    msub: "Subtract a product from the fourth operand.",
    halves: "Compare the high and low halves for the same input bits.",
    constant: "Inspect the recorded multiplication used for division by ten.",
    final: "Preserve the full unsigned product.",
  },
  options: {
    prediction: [
      {
        value: "0x00000000",
        label: "0x00000000",
      },
      {
        value: "0xffffffff",
        label: "0xffffffff",
      },
      {
        value: "0x80000000",
        label: "0x80000000",
      },
    ],
    failure: [
      {
        value: "0x00000001fffffffe",
        label: "0x00000001fffffffe",
      },
      {
        value: "0x00000000fffffffe",
        label: "0x00000000fffffffe",
      },
      {
        value: "0xfffffffffffffffe",
        label: "0xfffffffffffffffe",
      },
    ],
  },
  challenges: {
    write: {
      title: "Write scaled_total",
      tests: [
        "Scale 7 pulses by 6 and add 10",
        "Add a product that wraps",
        "Add a zero product",
        "Multiply across the 32-bit boundary",
        "Wrap when adding the existing total",
      ],
    },
    final: {
      title: "Write wide_product",
      tests: [
        "Keep a product above the 32-bit range",
        "Multiply two maximum unsigned inputs",
        "Keep the bit above the low 32",
        "Multiply by zero",
        "Multiply inputs that also fit in 32 bits",
      ],
    },
  },
} as const;
