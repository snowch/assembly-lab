// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-11/prose.md.
export const LABELS = {
  title: "Conversions and checked arithmetic",
  objectives: [
    "separate narrowing, promotion and arithmetic rules;",
    "check whether an input fits before converting it;",
    "store an addition result and report signed overflow.",
  ],
  titles: {
    question: "Which check preserves the intended value?",
    motivation: "A conversion is not a range check",
    prediction: "Narrow a signed gradient",
    investigation: "Follow the conversions before arithmetic",
    construction: "Check whether fuel fits in a byte",
    failureExperiment: "Using carry to report signed overflow",
    explanation: "Return a checked-add result and its status",
    generalisation: "Choose checks for the required property",
    challenge: "Write a checked trip adjustment",
    reflection: "What you now know",
  },
  captions: {
    listing: "Compare the recorded signed-byte and unsigned-byte conversions.",
    predict: "Predict the returned bits after narrowing the gradient.",
    step: "Follow byte selection and sign extension.",
    compare: "Compare the two narrowing conversions.",
    write: "Check an unsigned value before narrowing it.",
    predictFailure: "Predict the overflow report from the wrong flag.",
    stepFailure: "Inspect the stored sum, unchanged neighbouring bytes and returned flag.",
    extra: "Inspect the recorded checked-add function.",
    promoted: "Follow the promoted signed-byte input through an int addition.",
    mixed: "Follow the comparison after conversion to unsigned.",
    final: "Store the sum bits and return the signed-overflow report.",
  },
  options: {
    prediction: [
      {
        value: "0x000000c8",
        label: "0x000000c8",
      },
      {
        value: "0xffffffc8",
        label: "0xffffffc8",
      },
      {
        value: "0xffffff38",
        label: "0xffffff38",
      },
    ],
    failure: [
      {
        value: "0x00000000",
        label: "0",
      },
      {
        value: "0x00000001",
        label: "1",
      },
    ],
  },
  challenges: {
    write: {
      title: "Write fuel_fits",
      tests: [
        "Accept zero",
        "Accept 127",
        "Accept 128",
        "Accept the maximum unsigned byte",
        "Reject 256",
        "Reject 257",
        "Reject an input with the top bit set",
        "Reject the maximum unsigned input",
      ],
    },
    final: {
      title: "Write checked_trip",
      tests: [
        "Add two positive values that fit",
        "Report overflow above the signed maximum",
        "Report overflow below the signed minimum",
        "Add values that cancel",
        "Add two zeros",
        "Keep the signed maximum",
        "Keep the signed minimum",
      ],
    },
  },
  sides: ["Convert to unsigned char", "Convert to signed char"],
} as const;
