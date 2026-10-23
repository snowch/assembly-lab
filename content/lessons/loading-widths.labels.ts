// Copyright © 2026 Christopher Snow

// Module 6, lesson 2. Kept word for word in docs/notes/module-6/prose.md.
export const LABELS = {
  title: "Loading different widths",
  objectives: [
    "explain how a load fills the bits beyond the stored value;",
    "choose signed and unsigned loads for different field widths;",
    "read a sensor record while preserving its address.",
  ],
  titles: {
    question: "How does a small value fill a wider register?",
    motivation: "Fill with zeros or copies of the sign bit",
    prediction: "Load a signed gradient byte",
    investigation: "Compare the width and the extension",
    construction: "Add a correction to a signed gradient",
    failureExperiment: "Using an unsigned load for a signed reading",
    explanation: "Extend bits already in a register",
    generalisation: "Choose the width needed by the next operation",
    challenge: "Read the sensor record",
    reflection: "What you now know",
  },
  comparisonCases: {
    unsignedByte: "ldrb w0: unsigned byte",
    signedByte: "ldrsb w0: signed byte",
    unsignedHalf: "ldrh w0: unsigned halfword",
    signedHalf: "ldrsh w0: signed halfword",
    signedWord: "ldrsw x0: signed word",
    signedWideByte: "ldrsb x0: signed byte",
  },
  captions: {
    comparison: "Compare load widths and extension from the same source bytes.",
    listing: "read_fuel returns an unsigned byte as an unsigned 32-bit value.",
    predict: "Predict the result of a signed byte load into w0.",
    step: "Read the gradient byte and follow the added bits in w0 and x0.",
    unsignedByte: "Read the same byte with zero extension.",
    unsignedHalf: "Read two bytes with zero extension into w0.",
    signedHalf: "Read two bytes with sign extension into w0.",
    signedWord: "Read four bytes with sign extension into x0.",
    signedWideByte: "Read one byte with sign extension into x0.",
    write: "Load a signed gradient, add a correction and return the result.",
    predictFailure: "Predict the correction result after changing ldrsb to ldrb.",
    failureWide: "Follow the unsigned byte load and the addition.",
    extension: "Sign-extend the low byte already held in w0.",
    compilerUnsigned: "GCC uses and to keep the low byte for an unsigned char cast.",
    extensionUnsigned: "Zero-extend the low byte already held in w0.",
    extensionWord: "Sign-extend a 32-bit value into x0.",
    extendedAdd: "Sign-extend w1 before adding it to x0.",
    final: "Read four sensor fields with the required widths and interpretations.",
  },
  options: {
    prediction: [
      { value: "0x000000f9", label: "0x000000f9" },
      { value: "0x0000fff9", label: "0x0000fff9" },
      { value: "0xfffffff9", label: "0xfffffff9" },
      { value: "0x00000007", label: "0x00000007" },
    ],
    failure: [
      { value: "0x00000003", label: "0x00000003" },
      { value: "0x00000103", label: "0x00000103" },
      { value: "0x000000f9", label: "0x000000f9" },
      { value: "0xfffffff9", label: "0xfffffff9" },
    ],
  },
  challenges: {
    write: {
      title: "Write adjust_gradient",
      tests: [
        "Gradient −7, correction 10",
        "Gradient zero, correction zero",
        "Gradient 127, correction 1",
        "Gradient −128, correction zero",
        "Gradient −1, correction 1",
        "Gradient −128, correction 128",
        "Gradient 127, correction −128",
      ],
    },
    final: {
      title: "Write read_sensors",
      tests: [
        "Read a record with a negative gradient",
        "Read a record with all fields zero",
        "Read each field at its maximum value",
        "Read fields whose highest stored bit is set",
        "Keep each field separate from its neighbours",
      ],
    },
  },
} as const;
