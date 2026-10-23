// Copyright © 2026 Christopher Snow

// The words Module 0's stepper adds to the figure: the panel that shows what the last instruction
// read and wrote, the decimal view of the registers and its switch, and the two marks on the
// experiment's listing (the stopping point and the run crossing into the next function). They are
// interface labels, in a file of their own so that the other modules' strings stay as they are.
// Each is marked DRAFT until it has been through the prose process (Haiku drafts, the facts are
// checked); a test counts the marks, so a new one is a decision somebody sees.

export const MODULE0_STRINGS = {
  flow: {
    // DRAFT
    addOperation: "Add",
    // DRAFT
    subtractOperation: "Subtract",
    // DRAFT
    label: "What the last instruction did",
    // DRAFT
    head: (text: string) => `What \`${text}\` did`,
    // DRAFT
    reads: "Reads",
    // DRAFT
    writes: "Writes",
    // DRAFT
    adds: "Adds the second operand and the third operand.",
    // DRAFT
    subtracts: "Subtracts the third operand from the second operand.",
    // DRAFT
    plus: "+",
    // DRAFT
    minus: "−",
    // DRAFT
    gives: "→",
    // DRAFT: a register read, with the value it held: `w0 (120)`.
    read: (name: string, value: string) => `${name} (${value})`,
    // DRAFT: the register written, with its new value: `w0 = 205`.
    wrote: (name: string, value: string) => `${name} = ${value}`,
    // DRAFT
    was: (name: string, value: string) => `${name} was ${value}`,
    // DRAFT: `list` is the registers written, joined with commas: `Written: w0`.
    changed: (list: string) => `Written: ${list}`,
    // DRAFT: `list` is the registers the figure draws that the instruction did not write: `Not written: w1, w2, w3`.
    unchanged: (list: string) => `Not written: ${list}`,
    // DRAFT
    none: "none",
    // DRAFT
    ret: "`ret` does no arithmetic. The function ends, and the code that called it carries on.",
    // DRAFT
    continues: (label: string) =>
      `The next instruction is in \`${label}\`. The run continues into it.`,
  },
  registers: {
    // DRAFT
    showBits: "Show the bits",
    // DRAFT
    hideBits: "Hide the bits",
    // DRAFT
    changed: "Written",
  },
  listing: {
    // DRAFT
    stop: "Stopping point: the run ends at this `ret`.",
    // DRAFT
    crossing: (from: string, into: string) => `The run crosses from \`${from}\` into \`${into}\`.`,
  },
  args: {
    // DRAFT
    map: "The C parameters and the registers they arrive in",
    // DRAFT: `count` is how many arguments the function takes.
    caption: (count: number) =>
      `Each \`int\` is 32 bits. The ${count} arguments are placed in registers in order.`,
    // DRAFT: `instruction` is the first instruction, already in backticks.
    says: (instruction: string) => `The first instruction is ${instruction}.`,
    // DRAFT
    question:
      "It adds two register values and stores the result. Where will the C variable `total` be kept?",
    // DRAFT
    before: "Before",
    // DRAFT
    after: "After",
    // DRAFT: `register` is the register the first instruction writes, such as `w0`.
    explain: (register: string) =>
      `The \`add\` instruction overwrites \`${register}\` with the sum. The C variable \`total\` does not need a separate register.`,
  },
} as const;
