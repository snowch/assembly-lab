// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 2: the titles, objectives, captions, option labels and field labels.
// docs/notes/module-2/prose.md gives the objectives, the ten titles, the options, the caption of the
// addition and the challenge titles, kept word for word (a title or caption that holds code has its
// backticks taken out, because the page draws those as plain text). A label the file does not give
// is marked DRAFT; module-2.prose.test.ts counts the marks.

export const LABELS = {
  objectives: [
    "Follow an addition column by column, with the carry into each column.",
    "Say what each of the four flags records after `adds`.",
    "Explain why one adder serves both readings, and which flag judges which.",
  ],
  titles: {
    question: "How can the processor say when an answer does not fit?",
    motivation: "Motivation",
    prediction: "Prediction",
    investigation: "Investigation",
    construction: "Construction",
    failureExperiment: "Failure experiment",
    explanation: "Explanation",
    generalisation: "Generalisation",
    challenge: "Challenge",
    reflection: "Reflection",
  },
  captions: {
    adder:
      "adds w0, w0, w1 column by column, with the carry into each column above it, and the four flags after it.",
    predictReadings: "A prediction about which readings of the answer are right.", // DRAFT
    predictAdd: "A prediction about what the flags show after add.", // DRAFT
    stepAdd:
      "The two additions one instruction at a time, with the flags under the registers. A register or flag with an outline has just changed.", // DRAFT
    flags: "Predict N, Z, C and V for three additions.", // DRAFT
    overflow: "Find the smallest number that makes V 1.", // DRAFT
  },
  options: {
    readings: [
      { value: "both", label: "Both" },
      { value: "unsigned", label: "Only the unsigned" },
      { value: "signed", label: "Only the signed" },
      { value: "neither", label: "Neither" },
    ],
    afterAdd: [
      { value: "v", label: "V is 1, as with `adds`" },
      { value: "none", label: "All four are still 0" },
      { value: "error", label: "The run stops with an error" },
      { value: "c", label: "C is 1" },
    ],
  },
  challenges: {
    flags: {
      title: "Predict the four flags",
      /** The three additions, as the prose names them. */
      additions: [
        { id: "first", text: "`0xffffffff` plus 1" },
        { id: "second", text: "5 plus 3" },
        { id: "third", text: "`0x80000000` plus `0x80000000`" },
      ],
      /** The label of one flag's field: its letter, then the addition. */
      field: (flag: string, addition: string) => `${flag} for ${addition}`, // DRAFT
    },
    overflow: {
      title: "Find the smallest overflow",
      field: "The number, in decimal", // DRAFT
      test: "The smallest number that makes V 1", // DRAFT
    },
  },
} as const;
