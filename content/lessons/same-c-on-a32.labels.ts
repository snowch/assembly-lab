// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-a/prose.md.
export const LABELS = {
  title: "The same C on 32-bit Arm",
  objectives: [
    "read familiar computations in recorded A32 assembly;",
    "separate target-specific register and instruction rules;",
    "identify a library call when hardware division is not assumed.",
  ],
  titles: {
    question: "What changes on another Arm instruction set?",
    motivation: "Reuse the mechanism, check the syntax",
    prediction: "Limit the trip distance",
    investigation: "Compare conditional instructions",
    construction: "Read the A32 instruction names",
    failureExperiment: "Give an A32 line to the A64 assembler",
    explanation: "Recognise a different constant instruction",
    generalisation: "Notice when division becomes a call",
    challenge: "Read the records and run the A64 average",
    reflection: "What transfers to another target",
  },
  captions: {
    limitPair: "The same unsigned limit function in two recorded compilations.",
    predict: "Predict the result of the A64 limit function.",
    step: "Step through the A64 version; the A32 record remains static.",
    read: "Identify two instruction names in the A32 record.",
    syntax: "Test whether the course A64 assembler accepts the recorded A32 line.",
    markerPair: "Compare the instructions used for service marker 1001.",
    divisionPair: "Compare hardware division with the recorded library call.",
    final: "Read the target-specific names and calculate the A64 quotient.",
  },
  references: {
    read: "Recorded limit function for this exercise",
    marker: "Recorded service-marker function for this exercise",
    final: "Recorded average function for this exercise",
  },
  sides: {
    a32: "A32: GCC 15.2, baseline Armv7-A",
    a64: "A64: GCC 16.1",
  },
  options: {
    prediction: [
      {
        value: "80",
        label: "80",
      },
      {
        value: "50",
        label: "50",
      },
      {
        value: "0",
        label: "0",
      },
      {
        value: "130",
        label: "130",
      },
    ],
    syntax: [
      {
        value: "rejected",
        label: "The course A64 assembler rejects it.",
      },
      {
        value: "accepted",
        label: "The course A64 assembler accepts it.",
      },
    ],
  },
  challenges: {
    read: {
      title: "Read the A32 limit function",
      fields: {
        conditional: "Conditional-move mnemonic",
        return: "Return mnemonic",
      },
    },
    final: {
      title: "Compare constants and division",
      fields: {
        constant: "A32 marker-constant mnemonic",
        helper: "A32 division helper name",
        divide: "A64 unsigned-division mnemonic",
        result: "A64 average_trip(95, 4) result",
      },
    },
  },
} as const;
