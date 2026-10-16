// Copyright © 2026 Christopher Snow

// The words of the figures Module 4 adds (what two functions return, the prediction about a changed
// listing, the two listings with the differing item marked, every condition for a compare, the
// instruction count, and the listing with an arrow from each branch to its label), and of the grader
// that reads them. They are in a file of their own so that this module and the ones built beside it do
// not edit the same strings file. Each string is marked DRAFT until it has been through the prose
// process; strings.branch.test.ts counts the marks and lists the strings, so a new one is a decision
// somebody sees. The names and flag rules of the conditions are the words of
// docs/notes/module-4/prose.md, part 7 of lesson 1, split into pieces, and are not marked: a test
// holds each piece to that file. A `code` span is written between backticks.

export const BRANCH_STRINGS = {
  stepper: {
    // DRAFT
    count: (k: number) => `Instructions run: ${k}`,
  },

  runs: {
    // DRAFT
    group: "What each function returns",
    // DRAFT
    returns: (call: string, value: string) => `\`${call}\` returns ${value}`,
  },

  change: {
    /** What the model found when it compared the changed listing with the one shown. */
    said: {
      // DRAFT
      last: (mnemonic: string) =>
        `The simulator compared the two listings. Only \`${mnemonic}\` differs, and only in its last item.`,
      // DRAFT
      operands: (mnemonic: string) =>
        `The simulator compared the two listings. Only \`${mnemonic}\` differs, in more than its last item.`,
      // DRAFT
      instruction: (mnemonic: string) =>
        `The simulator compared the two listings. Only one instruction differs, and \`${mnemonic}\` is not the same instruction in both.`,
      // DRAFT
      several: "The simulator compared the two listings. More than one instruction differs.",
      // DRAFT
      none: "The simulator compared the two listings. They are the same.",
    },
  },

  diff: {
    // DRAFT
    table: "The two listings, instruction by instruction, with each differing item marked",
    // DRAFT
    mark: "differs",
    // DRAFT
    summary: (items: number) => (items === 1 ? "One item differs." : `${items} items differ.`),
  },

  conditions: {
    // DRAFT
    group: "Two values and a compare",
    // DRAFT
    first: "First value, held in w0",
    // DRAFT
    second: "Second value, held in w1",
    // DRAFT
    outOfRange: "That number does not fit in 32 bits.",
    // DRAFT
    readings: (unsigned: number, signed: number) => `unsigned ${unsigned}, signed ${signed}`,
    // DRAFT
    presets: "Values used in the text",
    // DRAFT
    preset: (a: string, b: string) => `${a} and ${b}`,
    // DRAFT
    flagsHeading: "The flags after `cmp w0, w1`",
    // DRAFT
    list: "Each condition, what it reads, and whether it holds",
    // DRAFT
    yes: "yes",
    // DRAFT
    no: "no",
    /** The headings over the groups, as the lesson's list words them. */
    groups: {
      either: "Either reading",
      unsigned: "Unsigned",
      signed: "Signed",
      // DRAFT
      other: "Met in Module 2",
    },
  },

  count: {
    // DRAFT
    ran: (n: number) =>
      `The simulator ran the function. It ran ${n} instructions, \`ret\` included.`,
  },

  arrows: {
    // DRAFT
    chooser: (name: string) => `The ${name} you choose`,
    // DRAFT
    presets: "Values used in the text",
    // DRAFT
    notWhole: "Type a whole number from -2147483648 to 2147483647.",
    // DRAFT
    figure: "The listing, with an arrow from each branch to its label",
    // DRAFT
    taken: "taken",
    // DRAFT
    notTaken: "not taken",
    // DRAFT
    didNotRun: "Did not run",
    // DRAFT
    result: (call: string, value: number, n: number) =>
      `\`${call}\` returns ${value}, in ${n} instructions.`,
  },

  grader: {
    // DRAFT
    cannotRun: "The grader could not run this challenge.",
  },
} as const;

/**
 * The names and flag rules of the conditions the figure of every condition shows, in the order of
 * part 7 of lesson 1. `reads` is the rule exactly as that part writes it.
 */
export const CONDITION_ROWS = [
  { name: "eq", group: "either", means: "equal", reads: "Z is 1" },
  { name: "ne", group: "either", means: "not equal", reads: "Z is 0" },
  { name: "cs", group: "unsigned", means: "higher or same", reads: "C is 1" },
  { name: "cc", group: "unsigned", means: "lower", reads: "C is 0" },
  { name: "hi", group: "unsigned", means: "higher", reads: "C is 1 and Z is 0" },
  { name: "ls", group: "unsigned", means: "lower or same", reads: "C is 0 or Z is 1" },
  { name: "ge", group: "signed", means: "greater than or equal", reads: "N equals V" },
  { name: "lt", group: "signed", means: "less than", reads: "N differs from V" },
  { name: "gt", group: "signed", means: "greater than", reads: "Z is 0 and N equals V" },
  {
    name: "le",
    group: "signed",
    means: "less than or equal",
    reads: "Z is 1 or N differs from V",
  },
  // The lesson gives `vs` only its rule, met in Module 2. DRAFT: the name.
  { name: "vs", group: "other", means: "overflow", reads: "V is 1" },
] as const;

export type ConditionRow = (typeof CONDITION_ROWS)[number];
