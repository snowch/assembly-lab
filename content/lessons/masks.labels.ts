// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 3: its titles, objectives, captions, option labels and field labels. Those that
// docs/notes/module-3/prose.md gives are kept word for word (a title that holds code has its
// backticks taken out, because the page draws a title as plain text; an option has the list mark's
// closing ; or . taken off). Everything the prose file does not give is in `drafts`, marked DRAFT:
// the captions of figures it gives none for, and the words inside the warning word figure. The
// prose test lists them, so a new one is a decision somebody sees.

export const LABELS = {
  objectives: [
    "set, clear and flip one bit of a word with OR, AND and exclusive OR;",
    "read a field out of a word, and write one in;",
    "build `set_gear` from `and`, `lsl` and `orr`.",
  ],
  titles: {
    question: "How do you change one warning?",
    motivation: "Why one bit at a time",
    prediction: "The constant that clears bit 2",
    investigation: "Four operations, masks and fields",
    construction: "Writing a field",
    failureExperiment: "Leaving out the clear",
    explanation: "What each operation does",
    generalisation: "Fields in real code",
    challenge: "Three results from one word",
    reflection: "Looking back",
  },
  captions: {
    warningWord: "The warning word's 32 bits. The table beside it gives each bit's meaning.",
    maskBits: "A word and a mask, combined bit by bit.",
  },
  options: {
    // A choice's value is the model's name for it (probe.ts); its label is the file's words.
    minusFive: [
      { value: "counted-backwards", label: "−5 is bit 2 counted backwards" },
      { value: "cleared:2", label: "−5 is `0xfffffffb`, every bit set except bit 2" },
      { value: "subtracts", label: "the compiler subtracts 5 from the word" },
      { value: "listing-error", label: "−5 is an error in the listing" },
    ],
    noClear: [
      { value: "53", label: "`0x35`" },
      { value: "85", label: "`0x55`" },
      { value: "117", label: "`0x75`" },
      { value: "error", label: "the run stops with an error" },
    ],
  },
  challenges: {
    setGear: { title: "Write set_gear" },
    three: {
      title: "Trace three results",
      fields: {
        afterOrr: "after `orr`",
        afterAnd: "after `and`",
        gear: "the gear",
      },
      // Plain text, for the name of each test in a verdict.
      tests: {
        afterOrr: "after orr",
        afterAnd: "after and",
        gear: "the gear",
      },
    },
  },
  /** The words the prose file does not give, through the prose process (17 October 2026). */
  drafts: {
    captions: {
      predictMinusFive: "A prediction about the constant in the listing.",
      setGear: "The assembly editor, with a single ret to start from.",
      predictNoClear: "A prediction about what set_gear returns without the clearing step.",
      stepNoClear:
        "set_gear(0x35, 5) without the clearing step, one instruction at a time. A register with an outline has just changed.",
      traceThree: "Work out three results for the warning word 0x2a, then give them.",
    },
    /** What the warning word's bits mean: the figure's key. */
    keyEntries: [
      { from: 0, to: 0, label: "fuel low" },
      { from: 1, to: 1, label: "service due" },
      { from: 2, to: 2, label: "door open" },
      { from: 3, to: 3, label: "lights on" },
      { from: 4, to: 6, label: "gear" },
    ],
  },
} as const;
