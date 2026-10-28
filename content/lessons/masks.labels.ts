// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 3: its titles, objectives, captions, option labels and field labels. Those that
// docs/notes/module-3/prose.md gives are kept word for word (a title that holds code has its
// backticks taken out, because the page draws a title as plain text; an option has the list mark's
// closing ; or . taken off). Everything the prose file does not give is in `drafts`, marked DRAFT:
// the captions of figures it gives none for, and the words inside the warning word figure. The
// prose test lists them, so a new one is a decision somebody sees. Those added on 17 October 2026
// for the figures' rework (a changed title and the captions of four new figures) are marked as
// drafts until they have been through the prose process; the prose test counts the marks.

export const LABELS = {
  objectives: [
    "set, clear and flip one bit of a word with OR, AND and exclusive OR;",
    "read a field out of a word, and write one in;",
    "build `set_gear` from `and`, `lsl` and `orr`.",
  ],
  titles: {
    question: "How do you change one warning?",
    prediction: "The constant that clears bit 2",
    investigation: "Masks, fields and the three rules", // DRAFT: the old title counted four operations
    construction: "Writing a field",
    failureExperiment: "Leaving out the clear",
    explanation: "What each operation does",
    challenge: "Three results from one word",
    reflection: "What you now know",
  },
  captions: {
    warningWord: "The warning word's 32 bits. The table beside it gives each bit's meaning.",
    maskBits: "A word and a mask, combined bit by bit.",
    registerOr: "OR of two register values; w0 is written and w1 is kept.",
    fieldPlan: "Replace an in-range gear before writing the general function.",
  },
  options: {
    // A choice's value is the model's name for it (probe.ts); its label is the file's words.
    minusFive: [
      { value: "counted-backwards", label: "−5 is bit 2 counted backwards" },
      { value: "cleared:2", label: "−5 is `0xfffffffb`, every bit set except bit 2" },
      { value: "subtracts", label: "the compiler subtracts 5 from the word" },
      { value: "listing-error", label: "−5 is an error in the instruction" },
    ],
    fieldPlan: [
      { value: "37", label: "`0x25`" },
      { value: "53", label: "`0x35`" },
      { value: "32", label: "`0x20`" },
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
      predictMinusFive: "A prediction about the constant in and w0, w0, -5.",
      setGear: "The assembly editor, with a single ret to start from.",
      predictNoClear: "A prediction about what set_gear returns without the clearing step.",
      readGear: "The gear of 0x35: the bits gear_of takes, and the number they make.", // DRAFT
      stepSolution: "Your set_gear, one instruction at a time, on the call you choose.", // DRAFT
      compareBfi: "Your set_gear and GCC's set_gear, run on the same call.", // DRAFT
      compareClear: "The old word, the new gear and the two results, bit by bit.", // DRAFT
      stepNoClear:
        "set_gear(0x35, 5) without the clearing step, one instruction at a time. A register with an outline was written by the last instruction.",
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
