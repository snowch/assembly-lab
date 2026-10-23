// Copyright © 2026 Christopher Snow

// The words of the figures Module 2 adds (the adder, the counter's ring, the flags row, the
// prediction about a run, and the graders that read flags). They are in a file of their own so that
// this module and the one built beside it do not both edit strings.ts. Each string is marked DRAFT
// until it has been through the prose process (Haiku drafts, the facts are checked); a test counts
// the marks, so a new one is a decision somebody sees. A `code` span is written between backticks.

export const ARITH_STRINGS = {
  flags: {
    group: "The four flags",
    /** A flag a figure has not worked out yet. */
    pending: "Not worked out yet",
    changed: "Changed by the last instruction",
    /** What a screen reader hears for one flag. */
    one: (name: string, value: number) => `Flag ${name} is ${value}`,
    /** The word under a flag the last instruction changed, as well as its outline. */
    changedTag: "changed", // DRAFT
    /** A few words under each flag, for a figure that asks for them. */
    explain: {
      n: "top bit", // DRAFT
      z: "result is zero", // DRAFT
      /** C after an addition. */
      cOut: "carry out", // DRAFT
      /** C after a subtraction: 1 is no borrow, 0 is a borrow. */
      cNoBorrow: "no borrow", // DRAFT
      cBorrow: "borrow", // DRAFT
      v: "signed overflow", // DRAFT
    },
  },

  adder: {
    controls: "Step through the addition",
    enlargeGroup: "Enlarge the selected group",
    groupBits: (high: number, low: number) => `Bits ${high} to ${low}`,
    next: "Next column",
    back: "Back",
    reset: "Reset",
    all: "Show all", // DRAFT
    /** Moves to the end of the group of four columns the next column is in. */
    nextGroup: "Next group of four", // DRAFT
    /** Said after a group move: the columns it worked, counted as bits from the right, from 0. */
    groupWorked: (from: number, to: number) =>
      from === to ? `Column ${from} worked.` : `Columns ${from} to ${to} worked.`, // DRAFT
    start: "Press Next column to add the rightmost column first.",
    /** The column just added, counted as a bit: 0 is the rightmost, 31 the top bit. */
    column: (n: number, a: number, b: number, carryIn: number, bit: number, carryOut: number) =>
      `Column ${n}: the bits are ${a} and ${b}, and the carry into this column is ${carryIn}. The answer bit is ${bit}, and the carry out is ${carryOut}.`,
    done: "All 32 columns are added.",
    /** Said after `done`: column 31 is the top bit, and what V compares there. */
    topBit:
      "This is the top bit. V is 1 when the carry into the top bit differs from the carry out of it.",
    /** Under the carry row: what the two thick underlines mark. */
    topKey:
      "The two thick underlines mark the carry out of the top bit, on the left, and the carry into the top bit, next to it.",
    /** In place of an adder that waits for a challenge to be passed. */
    lockedUntilPassed: "Pass the challenge above first. The figure opens once you have passed it.",
    carryRow: "Carry into each column",
    answerRow: "Answer",
    /** The second number of a subtraction, as the adder takes it. */
    turnedOver: (name: string) => `${name} with each bit changed`,
    carryIntoTop: "Carry into the top bit",
    carryOutOfTop: "Carry out of the top bit",
    noAddition: "The run has no addition for this figure to draw.",
    rows: "The addition, column by column",
    /** The label over a column that holds the top bit or the lowest bit. */
    bitLabel: (n: number) => `bit ${n}`, // DRAFT
    /** The current column worked as a small calculation, beside the grid. */
    calc: {
      group: "The column just worked", // DRAFT
      heading: (n: number) => `Column ${n}`, // DRAFT
      none: "No column worked yet", // DRAFT
      carryIn: "Carry in", // DRAFT
      bitOf: (name: string) => `Bit of ${name}`, // DRAFT
      bitOfChanged: (name: string) => `Bit of ${name}, changed`, // DRAFT
      total: "Total", // DRAFT
      kept: "Result bit kept", // DRAFT
      carryOut: "Carry out", // DRAFT
    },
    /** The panel by the flags, once the top bit is worked: the two carries, then C and V. */
    final: {
      group: "The carries at bit 31, and C and V", // DRAFT
      carryInto: (n: number) => `Carry into bit 31: ${n}`, // DRAFT
      carryOutOf: (n: number) => `Carry out of bit 31: ${n}`, // DRAFT
      c: (c: number) =>
        c === 0
          ? "C = 0: no carry left bit 31, so the unsigned result fits"
          : "C = 1: a carry left bit 31, so the unsigned result does not fit", // DRAFT
      /** C after a subtraction. */
      cSub: (c: number) => (c === 0 ? "C = 0: a borrow was needed" : "C = 1: no borrow"), // DRAFT
      v: (v: number, into: number, out: number) =>
        v === 0
          ? `V = 0: the carries match (${into} in, ${out} out), so the signed result fits`
          : `V = 1: the carries differ (${into} in, ${out} out), so the signed result does not fit`, // DRAFT
    },
    /** The final state of a subtraction, shown when the figure opens. */
    summary: {
      group: "The result and C", // DRAFT
      result: (hex: string, decimal: number) => `Result: ${hex}, which is ${decimal}`, // DRAFT
    },
  },

  /** The stepper, for a lesson that asks it to mark what changed. */
  stepper: {
    /** The word beside a register the last instruction wrote. */
    registerChanged: "written", // DRAFT
    /** The status after an `add` or `sub` that left the flags alone. */
    notUpdated: (register: string, mnemonic: string) =>
      `\`${register}\` was written. N, Z, C and V were not updated by \`${mnemonic}\`.`,
  },

  prediction: {
    registers: "Registers before the run",
    /** The simulator's result for a question about which readings of an answer are right. */
    readings: (unsigned: boolean, signed: boolean) =>
      `The simulator ran the addition. Read as unsigned, the answer is ${unsigned ? "right" : "wrong"}. Read as signed, the answer is ${signed ? "right" : "wrong"}.`,
    /** The simulator's result for a question about the flags at the end of a run. */
    flagsAt: (n: number, z: number, c: number, v: number) =>
      `The simulator ran the program. When it ended, N was ${n}, Z was ${z}, C was ${c} and V was ${v}.`,
    /** A register's value in hexadecimal, for a question about a pattern. */
    endedWithHex: (register: string, hex: string) =>
      `The simulator ran the program. \`${register}\` held \`${hex}\` when the run ended.`,
    /** Added after a register's value when the figure also reports the flags. */
    andFlags: (n: number, z: number, c: number, v: number) =>
      `N was ${n}, Z was ${z}, C was ${c} and V was ${v}.`,
  },

  ring: {
    figure: "The counter as a ring",
    then: "then",
    now: "now",
    elapsed: "elapsed",
    wrap: "wrap",
    /** The flag after `subs` for the same two readings. */
    carryAfter: "C after `subs`",
    borrowed: "a borrow was needed",
    notBorrowed: "no borrow was needed",
    values: "The values and the distance",
    /** The wrap, as the counter passes it: from its largest value to 0. */
    wrapSpan: (largest: number, first: number) => `${largest} to ${first}`, // DRAFT
    /** The two stretches of the strip and their total: a number, then "ticks", then these. */
    ticks: "ticks", // DRAFT
    beforeWrap: "before the wrap", // DRAFT
    afterWrap: "after the wrap", // DRAFT
    inAll: "in all", // DRAFT
    /** The direction the counter counts, on the strip. */
    direction: "counting forward", // DRAFT
  },

  grader: {
    /** A flag that is 0 for the number the learner gave. */
    flagClear: (flag: string) => `${flag} is 0 for the number you gave.`,
    notSmallest: "A smaller number also makes V 1.",
    /** The sentence for a wrong flag when the case gives none of its own. It names no flag. */
    flagWrong: "At least one flag you gave is wrong.",
    /** The same for a wrong register value. It names no value. */
    valueWrong: "That answer is not right.",
    /** In place of the list of fields, when every unanswered field is a choice. */
    chooseFirst: "Choose 0 or 1 for every flag first.",
    /** What is said for a wrong flag, when a case asks for it (`given.feedback` is "rule"). */
    flagRuleLine: (flag: string, rule: string) => `${flag}: ${rule}`, // DRAFT
    flagRule: {
      n: "N is the top bit of the 32-bit result.", // DRAFT
      z: "Z is 1 only when all 32 result bits are 0.", // DRAFT
      c: "C is the carry out of the top bit. Check whether a carry leaves bit 31.", // DRAFT
      v: "Compare the carry into the top bit with the carry out of it.", // DRAFT
    },
  },
} as const;
