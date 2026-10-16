// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 2: the titles, objectives, captions, option labels and field labels.
// docs/notes/module-2/prose.md gives the objectives, the ten titles, the options, the caption of the
// ring and the challenge titles, kept word for word (a title or caption that holds code has its
// backticks taken out, because the page draws those as plain text). A label the file does not give
// is marked DRAFT; module-2.prose.test.ts counts the marks.

export const LABELS = {
  objectives: [
    "Explain why `elapsed(now, then)` is right when the counter has wrapped.",
    "Say what C records after `subs`.",
    "Write `elapsed` and pass tests across the wrap.",
  ],
  titles: {
    question: "Is the answer still right after a wrap?",
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
    ring: "The counter as a ring: then, now, and the distance between them.",
    predictElapsed: "A prediction about what elapsed returns across the wrap.", // DRAFT
    predictNegs: "A prediction about what w0 holds after negs.", // DRAFT
    stepNegs:
      "negs w0, w0 on 0x80000000, with the flags under the register. A register or flag with an outline has just changed.", // DRAFT
    elapsed: "The assembly editor, starting from a function that returns now unchanged.", // DRAFT
    step: "Give the result and C for one step past the top.", // DRAFT
  },
  options: {
    elapsed: [
      { value: "2000", label: "2000" },
      { value: "-4294965296", label: "−4294965296" },
      { value: "4294965296", label: "4294965296" },
      { value: "0", label: "0" },
    ],
    negs: [
      { value: "0x80000000", label: "`0x80000000`, unchanged" },
      { value: "0x7fffffff", label: "`0x7fffffff`" },
      { value: "0x00000000", label: "0" },
      { value: "error", label: "The run stops with an error" },
    ],
  },
  challenges: {
    elapsed: { title: "Write elapsed" },
    step: {
      title: "One step past the top",
      fields: {
        result: "`elapsed(0, 4294967295)`, in decimal", // DRAFT
        c: "C after `subs`, 0 or 1", // DRAFT
      },
      // Plain text, for the name of each test in a verdict.
      tests: {
        result: "The result of elapsed(0, 4294967295)", // DRAFT
        c: "C after subs", // DRAFT
      },
    },
  },
} as const;
