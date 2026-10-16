// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 3: its titles, objectives, captions, option labels and field labels. Those that
// docs/notes/module-3/prose.md gives are kept word for word (a title that holds code has its
// backticks taken out; an option has no list mark). Everything the prose file does not give is in
// `drafts`, marked DRAFT: the captions of figures it gives none for, and the type names over the
// two listings. The prose test lists them, so a new one is a decision somebody sees.

export const LABELS = {
  objectives: [
    "shift a word left or right, and say what fills the gap;",
    "explain why GCC uses `asr` for `int` and `lsr` for `unsigned`;",
    "say why dividing a negative `int` by 2 is not the same as shifting it.",
  ],
  titles: {
    question: "Why does the C type change the instruction?",
    motivation: "Why moving bits matters",
    prediction: "What fills the top bit",
    investigation: "Left and right shifts",
    construction: "Division and shifting",
    failureExperiment: "How GCC divides by 2",
    explanation: "Why the type picks the shift",
    generalisation: "Shifts inside other instructions",
    challenge: "Which instruction for which type",
    reflection: "Looking back",
  },
  captions: {
    shiftWord:
      "One word, shifted by the instruction you choose; the bits that fall off, and what fills the gap.",
  },
  options: {
    // A choice's value is the model's name for it (probe.ts); its label is the file's words.
    fill: [
      { value: "copy", label: "A copy of the old top bit, which is 1" },
      { value: "zero", label: "A 0" },
      { value: "fell-off", label: "The bit that fell off the bottom" },
      { value: "shorter", label: "Nothing: the word gets shorter" },
    ],
    firstAdd: [
      { value: "sign", label: "1 when `g` is negative, 0 otherwise" },
      { value: "one", label: "always 1" },
      { value: "thirty-one", label: "31" },
      { value: "half", label: "half of `g`" },
    ],
  },
  challenges: {
    compare: {
      title: "Compare shifts with division",
      fields: {
        asr21: "`asr` of 21 by 2",
        lsr21: "`lsr` of 21 by 2",
        div21: "`21 / 4`",
        asrNeg: "`asr` of −21 by 2",
        lsrNeg: "`lsr` of −21 by 2 (−21 taken as unsigned)",
        divNeg: "`-21 / 4`",
      },
      // Plain text, for the name of each test in a verdict.
      tests: {
        asr21: "asr of 21 by 2",
        lsr21: "lsr of 21 by 2",
        div21: "21 / 4",
        asrNeg: "asr of −21 by 2",
        lsrNeg: "lsr of −21 by 2 (−21 taken as unsigned)",
        divNeg: "-21 / 4",
      },
    },
    pick: {
      title: "Pick the instruction",
      fields: {
        shrInt: "`int x >> 3`",
        shrUnsigned: "`unsigned x >> 3`",
        shl: "`x << 3`",
      },
      tests: {
        shrInt: "int x >> 3",
        shrUnsigned: "unsigned x >> 3",
        shl: "x << 3",
      },
    },
  },
  /** The words the prose file does not give. Each is marked DRAFT and listed in the build report. */
  drafts: {
    captions: {
      // DRAFT
      compareHalves:
        "The C and the instructions GCC made for halve_gradient and halve_count. An instruction that differs from the other listing is marked.",
      // DRAFT
      predictFill: "A prediction about what fills the top bit of -7 when it moves one place right.",
      // DRAFT
      compareShifts: "Work out six results for 21 and -21, then give them.",
      // DRAFT
      predictFirstAdd: "A prediction about the first instruction GCC uses for g / 2.",
      // DRAFT
      stepDiv2: "div2(-7), one instruction at a time. A register with an outline has just changed.",
      // DRAFT
      pickInstruction: "Say which instruction GCC uses for each shift, then give your answers.",
    },
    /** The C type over each of the two listings. */
    types: {
      // DRAFT
      int: "int",
      // DRAFT
      unsigned: "unsigned",
    },
  },
} as const;
