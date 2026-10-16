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
    // When the instruction that runs next is under another label than the one that just ran.
    upNextIn: (text: string, label: string) => `Next: \`${text}\`, in \`${label}\`.`,
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

  // Module 1's figures (drafted by Haiku and checked, 16 October 2026).
  toggles: {
    /** The name of one bit's button, for a screen reader: its number, 31 for the top bit. */
    bit: (n: number) => `Bit ${n}`,
    /** The name of the hexadecimal digit written under four bits. */
    digit: (digit: string) => `Hexadecimal digit ${digit}`,
    /** The name of a row of bits that the learner sets. */
    group: (register: string) => `Bits of ${register}`,
  },

  reader: {
    hex: "Hexadecimal",
    unsigned: "Unsigned reading",
    signed: "Signed reading",
    readings: "Readings of the bits",
  },

  compare: {
    cPane: (name: string) => `The C for ${name}`,
    table: "The two listings, line by line",
    same: "Same",
    differs: "Different",
    allSame: (n: number) => `All ${n} instructions are the same.`,
    notAllSame: "The instructions are not all the same.",
    /** The simulator's result for a question about two listings. */
    resultSame: "Both listings give the same instructions.",
    resultDiffer: "The two listings do not give the same instructions.",
  },

  fits: {
    /** The result for a question about which constants one `mov` can hold. */
    one: (accepted: string, refused: number) =>
      `\`mov w0, ${accepted}\` is one instruction. The other numbers give an error: ${refused} of them.`,
    none: "Every one of these gives an error.",
    several: (accepted: string) => `More than one of these is a single instruction: ${accepted}.`,
  },

  tester: {
    input: "The number after mov w0",
    empty: "Type a number to see whether one `mov` can hold it.",
    notNumber: "Type a whole number, in decimal or in hexadecimal with `0x` in front.",
    fits: (text: string) =>
      `\`mov w0, ${text}\` is one instruction. After it, \`w0\` holds these bits:`,
  },

  wide: {
    upper: "Upper 32 bits",
    lower: (name: string) => `${name}, the lower 32 bits`,
    /** The result for a question about a register that is 64 bits wide. */
    endedWith: (register: string, hex: string) =>
      `The simulator ran the program. \`${register}\` held \`${hex}\` when the run ended.`,
  },

  // The sentence under a wrong answer in the readings challenges. None of them says the right
  // value.
  readings: {
    bitsRead: (value: string) =>
      `Your bits have a signed reading of ${value}, and that is not the number asked for.`,
    notThis: "That is not what these bits give when read this way.",
    registerWrong: (name: string) =>
      `${name} does not hold that number once all the instructions have run.`,
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
    // `fields` is the fields' names as a list ("a", "a and b", "a, b and c"), `count` how many.
    unanswered: (fields: string, count: number) =>
      count === 1
        ? `Nothing is graded until ${fields} has a whole number.`
        : `Nothing is graded until each of ${fields} has a whole number.`,
    /** Between the last two names in a list. */
    and: "and",
    // DRAFT: says "in decimal", because `0x5` is a whole number and is refused.
    notWhole: (field: string) =>
      `The answer for ${field} must be a whole number written in decimal.`,
    noProgram: "This challenge has no program to run.",
  },
} as const;

/** Text with `code` in backticks, as plain text: a verdict heading and a select show no Markdown. */
export const plain = (text: string): string => text.replace(/`([^`]*)`/g, "$1");

/**
 * Text with `code` in backticks, as the code inside curly quotes: a verdict's detail is printed as
 * plain text by the platform, which cannot render markup there, so the quotes set the code apart.
 */
export const quoted = (text: string): string => text.replace(/`([^`]*)`/g, "“$1”");
