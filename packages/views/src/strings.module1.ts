// Copyright © 2026 Christopher Snow

// The words Module 1's code fixes add to the figures (the 16-bit halves of a register, the top-bit
// table of the register to read, the hexadecimal entry for a field of bits, the `x3` figure's
// labels). They are in a file of their own so that the modules built beside this one do not all edit
// strings.ts. Each string is marked DRAFT until it has been through the prose process (Haiku drafts,
// the facts are checked); a test counts the marks, so a new one is a decision somebody sees.

export const MODULE1_STRINGS = {
  register: {
    // DRAFT
    upperHalf: "Upper half",
    // DRAFT
    lowerHalf: "Lower half",
  },

  // The register to read, drawn with the top bit's table (`topBit` on the figure).
  reader: {
    /** The label of the hexadecimal line: the bits written shorter, which is not a reading. */
    // DRAFT
    pattern: "Pattern",
    /** What a screen reader hears for the table of the two readings. */
    // DRAFT
    table: "The two readings of the pattern",
    // DRAFT
    topBitRow: "Top bit (bit 31)",
    // DRAFT
    otherRow: "Other 31 bits",
    // DRAFT
    resultRow: "Result",
    /** The summary of the closed part that holds the sum of every bit. */
    // DRAFT
    showCalculation: "Show calculation",
    /** The button that sets all 32 bits to 0. */
    // DRAFT
    clearBits: "Clear bits",
  },

  toggles: {
    /** The text beside bit 31, as well as its shape. */
    // DRAFT
    topBit: "top bit",
  },

  // The hexadecimal entry beside a field of 32 bits (a challenge's `initial.data.hexEntry`).
  hexEntry: {
    // DRAFT
    label: "The same bits in hexadecimal",
    // DRAFT
    invalid: "That is not one to eight hexadecimal digits, so no bit has changed.",
  },

  // A `w` register drawn as two halves of 16 bits (the wide stepper's `w16` mode).
  halves: {
    /** The name of the figure for a screen reader. */
    // DRAFT
    group: (name: string) => `${name} as two halves of 16 bits`,
    /** The half that the last instruction put a value in. */
    // DRAFT
    new: "new",
    /** The half that the last instruction left as it was. */
    // DRAFT
    kept: "kept",
    /** The whole 32-bit value, in hexadecimal. */
    // DRAFT
    whole: "Whole register",
    /** When the learner's own solution cannot be assembled. */
    // DRAFT
    unreadable: "Your saved solution cannot be run. Fix it in the editor above.",
  },

  // `x3` drawn as one box of 64 bits (the wide stepper's `x64-named` mode).
  wide: {
    // DRAFT
    heading: (name: string) => `${name}: 64 bits`,
    // DRAFT
    lower: "Lower 32 bits",
    /** The upper 32 bits after a write to the `w` name, which cleared them. */
    // DRAFT
    cleared: "cleared",
    /** A half the last instruction wrote. */
    // DRAFT
    written: "written",
    // DRAFT
    clearedNote: (x: string, w: string) =>
      `Writing \`${w}\` cleared the upper 32 bits of \`${x}\`.`,
  },
} as const;
