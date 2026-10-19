// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 2: the titles, objectives, captions, option labels and field labels.
// docs/notes/module-2/prose.md gives the objectives, the ten titles, the options, the caption of the
// ring and the challenge titles, kept word for word (a title or caption that holds code has its
// backticks taken out, because the page draws those as plain text). A label the file does not give
// is marked DRAFT; module-2.prose.test.ts counts the marks.

export const LABELS = {
  objectives: [
    "Explain why `elapsed(now, then)` works across a wrap when the counter advances normally and less than a full turn passes.",
    "Say what C records after `subs`.",
    "Write `elapsed` and pass tests across the wrap.",
  ],
  titles: {
    question: "Is the answer still right after a wrap?",
    motivation: "Why tests need to cross a wrap",
    prediction: "Elapsed across the wrap",
    investigation: "Subtraction as addition, and borrows",
    construction: "Writing elapsed yourself",
    failureExperiment: "Negating 0x80000000",
    explanation: "Why the low bits are enough",
    generalisation: "Other counters",
    challenge: "Stepping from the top to zero",
    reflection: "What you now know",
  },
  captions: {
    ring: "The counter as a ring: then, now, and the distance between them.",
    // Placeholders for the two subtractions the adder draws: the prose process replaces them.
    subtractWrapped:
      "subs w0, w0, w1 on 1000 and 4294966296, column by column, with each bit of the second number changed to the other value, and 1 carried in.",
    subtractNoWrap:
      "subs w0, w0, w1 on 9000 and 2500, column by column, with each bit of the second number changed to the other value, and 1 carried in.",
    // The figure that opens when `elapsed` is passed: a draft, as the two above it are.
    subtractOwn:
      "subs w0, w0, w1 on 250 and 4294967046, one of the four test calls, column by column, with each bit of the second number changed to the other value, and 1 carried in.", // DRAFT
    predictElapsed: "A prediction about what elapsed returns across the wrap.",
    predictNegs: "A prediction about what w0 holds after negs.",
    stepNegs:
      "negs w0, w0 on 0x80000000, with the flags under the register. An outlined register was written by the last instruction. An outlined flag changed value.",
    elapsed: "The assembly editor, starting from a function that returns now unchanged.",
    step: "Give the result and C for one step past the top.",
  },
  options: {
    elapsed: [
      { value: "-4294965296", label: "−4294965296" },
      { value: "4294965296", label: "4294965296" },
      { value: "2000", label: "2000" },
      { value: "0", label: "0" },
    ],
    negs: [
      { value: "0x7fffffff", label: "`0x7fffffff`" },
      { value: "0x80000000", label: "`0x80000000`, unchanged" },
      { value: "0x00000000", label: "0" },
      { value: "error", label: "The run stops with an error" },
    ],
  },
  challenges: {
    elapsed: { title: "Write elapsed" },
    step: {
      title: "One step past the top",
      fields: {
        result: "`elapsed(0, 4294967295)`, in decimal",
        c: "C after `subs`, 0 or 1",
      },
      // Plain text, for the name of each test in a verdict.
      tests: {
        result: "The result of elapsed(0, 4294967295)",
        c: "C after subs",
      },
    },
  },
} as const;
