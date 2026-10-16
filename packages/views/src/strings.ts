// Copyright © 2026 Christopher Snow

// Every word the figures, the editor and the grader put in front of a learner, except the words of
// the lessons themselves (their prose, labels and hints are in content/lessons) and the machine's
// own sentences (packages/machine/src/strings.ts, read through messages.ts). Each was redrafted by
// Haiku and checked for meaning (16 October 2026); a new one is marked DRAFT until it has been. A `code` span is written between backticks.

export const VIEW_STRINGS = {
  /** The note under the badge of every figure that runs the simulator (the book's `steps` model). */
  modelNote:
    "Each step runs one instruction on the course's simulator. The instruction reads registers and writes registers. Then the simulator moves on to the next instruction. Nothing else happens between steps.",
  /** The badge on a figure that runs the simulator, and the heading over its note. */
  modelBadge: "Stepped",
  modelHeading: "How the simulator steps",

  register: {
    /** What a screen reader hears for a register: its name and its value as a number. */
    group: (name: string) => `Register ${name}`,
    changed: "Changed by the last instruction",
  },

  listing: {
    cHeading: "C",
    instructionsHeading: "Instructions",
    cLineHeading: "C line",
    /** The C line number beside an instruction, for a screen reader. */
    recordedAgainst: (n: number) => `Recorded against C line ${n}`,
    next: "Runs next",
    cPane: "The C",
    instructionsPane: "The instructions",
  },

  stepper: {
    next: "Next",
    back: "Back",
    reset: "Reset",
    registers: "Registers",
    controls: "Step through the run",
    start: "Press Next to run the first instruction.",
    ran: (text: string) => `Ran \`${text}\`.`,
    upNext: (text: string) => `Next: \`${text}\`.`,
    ended: "The function returned.",
    /** The switch that takes one line out of the listing and runs it again. */
    deleteLine: (text: string) => `Delete the \`${text}\` line`,
    /** In place of a stepper that waits for a prediction. */
    locked: "Check your prediction above first. The figure opens once you have checked it.",
  },

  prediction: {
    commit: "Check your prediction",
    legend: "Your prediction",
    youChose: (choice: string) => `You chose: ${choice}`,
    match: "That matches your prediction.",
    noMatch: "That does not match your prediction.",
    /** The simulator's result for a question about the first instruction's register. */
    firstWrote: (register: string) =>
      `The simulator ran the first instruction. It wrote \`${register}\`.`,
    firstWroteNothing: "The simulator ran the first instruction. It wrote no register.",
    /** The simulator's result for a question about a register at the end of a run. */
    endedWith: (register: string, value: number) =>
      `The simulator ran the program. \`${register}\` held ${value} when the run ended.`,
    endedWithError: "The simulator ran the program. The run stopped with an error.",
  },

  editor: {
    mode: "Edit as",
    text: "Text",
    tap: "Tap",
    textLabel: "Your instructions",
    symbols: "Characters for assembly",
    insert: (char: string) => `Insert ${char}`,
    problems: "Problems in your instructions",
    lineProblem: (n: number, sentence: string) => `Line ${n}: ${sentence}`,
    emptyLine: "(empty line)",
    lines: "Your instructions, one per line",
    noLines: "There are no instructions yet.",
    addFirst: "Add a line",
    addBelow: "Add a line below",
    remove: "Delete this line",
    up: "Move up",
    down: "Move down",
    done: "Done",
    editing: (n: number) => `Editing line ${n}`,
    instruction: "Instruction",
    operand: (n: number) => `Operand ${n}`,
    number: "A number",
    numberPad: "Number pad",
    numberShown: (n: string) => `Number: ${n === "" ? "none yet" : n}`,
    deleteDigit: "Delete last digit",
    clearNumber: "Clear number",
    notEditable:
      "This line is not an instruction the chips can build. Pick an instruction to replace it.",
  },

  grader: {
    nothingWritten: "Write at least one instruction first.",
    unanswered: (fields: string) => `Give a whole number for ${fields} first.`,
    notWhole: (field: string) => `The answer for ${field} must be a whole number.`,
    noProgram: "This challenge has no program to run.",
  },

  // DRAFT: the words of Module 3's figures and graders, drafted with the figures and not yet
  // through the prose process. Every key below is listed in the build report.
  bits: {
    // DRAFT
    keyHeading: "What the bits mean",
    keyBits: "Bits",
    keyMeaning: "Meaning",
    keyValue: "Value",
    keyBefore: "Before",
    keyAfter: "After",
    bit: (n: number) => `Bit ${n}`,
    bitRange: (from: number, to: number) => `Bits ${from} to ${to}`,
    /** Bit numbers already joined into a phrase: `Bits 2 and 5`. */
    bitsList: (list: string) => `Bits ${list}`,
    /** The row for a register at the start of a call. */
    onEntry: (register: string) => `${register} on entry`,
    /** What a screen reader hears for a row of 32 bits: its name and its value. */
    rowGroup: (name: string, hex: string) => `${name}: ${hex}`,
    /** Joins a list of bit numbers: 2; 2 and 3; 0, 2 and 3. */
    and: "and",
  },

  bitOps: {
    // DRAFT
    functions: "Function",
    cLabel: "C",
    instructionLabel: "Instruction",
    rowMask: "Mask",
    rowBefore: (register: string) => `${register} before`,
    rowAfter: (register: string) => `${register} after`,
    inputLabel: (register: string) => `Value of ${register} on entry`,
    inputProblem: "Type a whole number, or hexadecimal starting 0x.",
    changed: (bits: string) => `Bits that changed: ${bits}.`,
    unchanged: "No bit changed.",
    result: (register: string, hex: string, decimal: string) =>
      `${register} holds ${hex}, which is ${decimal}.`,
    legend: "Outlined: bits that changed. Underlined: the field the instruction uses.",
  },

  shift: {
    // DRAFT
    instruction: "Instruction",
    by: "Shift by",
    inputLabel: "Value of w0 on entry",
    inputProblem: "Type a whole number, or hexadecimal starting 0x.",
    rowBefore: "Before",
    rowAfter: "After",
    fellOff: (bits: string) => `Fell off: ${bits}`,
    filledWith: (bits: string) => `Filled with: ${bits}`,
    result: (instruction: string, hex: string, unsigned: string, signed: string) =>
      `After \`${instruction}\`, w0 holds ${hex}: ${unsigned} as unsigned, ${signed} as signed.`,
    legend: "Struck through: bits that fall off. Dashed: bits the shift filled in.",
  },

  compare: {
    // DRAFT
    differs: "This instruction differs from the other listing",
  },

  probe: {
    // DRAFT
    clearedBits: (bits: string) =>
      `The simulator ran the function on a word with every bit set. ${bits} came out 0.`,
    noneCleared: "The simulator ran the function on a word with every bit set. No bit came out 0.",
    filled: (instruction: string, how: string) => `The simulator ran \`${instruction}\`. ${how}`,
    fillCopy: "The top bit was filled with a copy of the old top bit.",
    fillZero: "The top bit was filled with 0.",
    fillFell: "The top bit was filled with the bit that fell off the bottom.",
    fillOther: "The top bit was filled in a way none of the choices describe.",
    firstAdds: (instruction: string, negative: string, other: string) =>
      `The simulator ran \`${instruction}\` on negative and non-negative values. It added ${negative} to a negative value and ${other} to any other.`,
    firstAddsVaries: (instruction: string) =>
      `The simulator ran \`${instruction}\` on negative and non-negative values. The amount it added changed from value to value.`,
    endedWithHex: (register: string, hex: string) =>
      `The simulator ran the program. \`${register}\` held ${hex} when the run ended.`,
  },

  answers: {
    // DRAFT
    notHex: (field: string) =>
      `The answer for ${field} must be a hexadecimal number, such as 0x2f.`,
    unanswered: (fields: string) => `Give an answer for ${fields} first.`,
  },

  tap: {
    // DRAFT
    sign: "Change sign",
  },
} as const;

/** Text with `code` in backticks, as plain text: a verdict heading and a select show no Markdown. */
export const plain = (text: string): string => text.replace(/`([^`]*)`/g, "$1");
