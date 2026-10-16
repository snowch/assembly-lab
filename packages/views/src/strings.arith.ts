// Copyright © 2026 Christopher Snow

// The words of the figures Module 2 adds (the adder, the counter's ring, the flags row, the
// prediction about a run, and the graders that read flags). They are in a file of their own so that
// this module and the one built beside it do not both edit strings.ts. Each string is marked DRAFT
// until it has been through the prose process (Haiku drafts, the facts are checked); a test counts
// the marks, so a new one is a decision somebody sees. A `code` span is written between backticks.

export const ARITH_STRINGS = {
  flags: {
    group: "The four flags", // DRAFT
    /** A flag a figure has not worked out yet. */
    pending: "Not worked out yet", // DRAFT
    changed: "Changed by the last instruction", // DRAFT
    /** What a screen reader hears for one flag. */
    one: (name: string, value: number) => `Flag ${name} is ${value}`, // DRAFT
  },

  adder: {
    controls: "Step through the addition", // DRAFT
    next: "Next column", // DRAFT
    back: "Back", // DRAFT
    reset: "Reset", // DRAFT
    all: "All columns", // DRAFT
    start: "Press Next column to add the rightmost column first.", // DRAFT
    /** The column just added, counted from the right. */
    column: (n: number, a: number, b: number, carryIn: number, bit: number, carryOut: number) =>
      `Column ${n}: the bits are ${a} and ${b}, and the carry in is ${carryIn}. The answer bit is ${bit} and the carry out is ${carryOut}.`, // DRAFT
    done: "All 32 columns are added.", // DRAFT
    carryRow: "Carry into each column", // DRAFT
    answerRow: "Answer", // DRAFT
    /** The second number of a subtraction, as the adder takes it. */
    turnedOver: (name: string) => `${name} turned over`, // DRAFT
    carryIntoTop: "Carry into the top bit", // DRAFT
    carryOutOfTop: "Carry out of the top bit", // DRAFT
    noAddition: "The run has no addition for this figure to draw.", // DRAFT
    rows: "The addition, column by column", // DRAFT
  },

  prediction: {
    registers: "Registers before the run", // DRAFT
    /** The simulator's result for a question about which readings of an answer are right. */
    readings: (unsigned: boolean, signed: boolean) =>
      `The simulator ran the addition. Read as unsigned, the answer is ${unsigned ? "right" : "wrong"}. Read as signed, the answer is ${signed ? "right" : "wrong"}.`, // DRAFT
    /** The simulator's result for a question about the flags at the end of a run. */
    flagsAt: (n: number, z: number, c: number, v: number) =>
      `The simulator ran the program. When it ended, N was ${n}, Z was ${z}, C was ${c} and V was ${v}.`, // DRAFT
    /** A register's value in hexadecimal, for a question about a pattern. */
    endedWithHex: (register: string, hex: string) =>
      `The simulator ran the program. \`${register}\` held \`${hex}\` when the run ended.`, // DRAFT
    /** Added after a register's value when the figure also reports the flags. */
    andFlags: (n: number, z: number, c: number, v: number) =>
      `N was ${n}, Z was ${z}, C was ${c} and V was ${v}.`, // DRAFT
  },

  ring: {
    figure: "The counter as a ring", // DRAFT
    then: "then", // DRAFT
    now: "now", // DRAFT
    elapsed: "elapsed", // DRAFT
    wrap: "wrap", // DRAFT
    /** The flag after `subs` for the same two readings. */
    carryAfter: "C after `subs`", // DRAFT
    borrowed: "a borrow was needed", // DRAFT
    notBorrowed: "no borrow was needed", // DRAFT
    values: "The readings and the distance", // DRAFT
  },

  grader: {
    /** A flag that is 0 for the number the learner gave. */
    flagClear: (flag: string) => `${flag} is 0 for that number.`, // DRAFT
    notSmallest: "A smaller number also sets it.", // DRAFT
  },
} as const;
