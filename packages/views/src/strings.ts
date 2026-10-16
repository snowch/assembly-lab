// Copyright © 2026 Christopher Snow

// Every word the figures, the editor and the grader put in front of a learner, except the words of
// the lessons themselves (their prose, labels and hints are in content/lessons) and the machine's
// own sentences (packages/machine/src/strings.ts, read through messages.ts). Each is a DRAFT until
// the prose process has been through it. A `code` span is written between backticks.

export const VIEW_STRINGS = {
  /** The note under the badge of every figure that runs the simulator (the book's `steps` model). */
  modelNote:
    "Each step runs one instruction on the course's simulator. The instruction reads registers, writes registers, and the simulator moves on to the next instruction. Nothing else happens between steps.", // DRAFT
  /** The badge on a figure that runs the simulator, and the heading over its note. */
  modelBadge: "Stepped", // DRAFT
  modelHeading: "How the simulator steps", // DRAFT

  register: {
    /** What a screen reader hears for a register: its name and its value as a number. */
    group: (name: string) => `Register ${name}`, // DRAFT
    changed: "Changed by the last instruction", // DRAFT
  },

  listing: {
    cHeading: "C", // DRAFT
    instructionsHeading: "Instructions", // DRAFT
    cLineHeading: "C line", // DRAFT
    /** The C line number beside an instruction, for a screen reader. */
    recordedAgainst: (n: number) => `Recorded against C line ${n}`, // DRAFT
    next: "Runs next", // DRAFT
    cPane: "The C", // DRAFT
    instructionsPane: "The instructions", // DRAFT
  },

  stepper: {
    next: "Next", // DRAFT
    back: "Back", // DRAFT
    reset: "Reset", // DRAFT
    registers: "Registers", // DRAFT
    controls: "Step through the run", // DRAFT
    start: "Press Next to run the first instruction.", // DRAFT
    ran: (text: string) => `Ran \`${text}\`.`, // DRAFT
    upNext: (text: string) => `Next: \`${text}\`.`, // DRAFT
    ended: "The function returned.", // DRAFT
    /** The switch that takes one line out of the listing and runs it again. */
    deleteLine: (text: string) => `Delete the \`${text}\` line`, // DRAFT
    /** In place of a stepper that waits for a prediction. */
    locked: "Check your prediction above first. The figure opens when you have.", // DRAFT
  },

  prediction: {
    commit: "Check my prediction", // DRAFT
    legend: "Your prediction", // DRAFT
    youChose: (choice: string) => `You chose: ${choice}`, // DRAFT
    match: "That matches your prediction.", // DRAFT
    noMatch: "That does not match your prediction.", // DRAFT
    /** The simulator's result for a question about the first instruction's register. */
    firstWrote: (register: string) =>
      `The simulator ran the first instruction. It wrote \`${register}\`.`, // DRAFT
    firstWroteNothing: "The simulator ran the first instruction. It wrote no register.", // DRAFT
    /** The simulator's result for a question about a register at the end of a run. */
    endedWith: (register: string, value: number) =>
      `The simulator ran it. \`${register}\` held ${value} when the run ended.`, // DRAFT
    endedWithError: "The simulator ran it. The run stopped with an error.", // DRAFT
  },

  editor: {
    mode: "Edit as", // DRAFT
    text: "Text", // DRAFT
    tap: "Tap", // DRAFT
    textLabel: "Your instructions", // DRAFT
    symbols: "Characters for assembly", // DRAFT
    insert: (char: string) => `Insert ${char}`, // DRAFT
    problems: "Problems in your instructions", // DRAFT
    lineProblem: (n: number, sentence: string) => `Line ${n}: ${sentence}`, // DRAFT
    emptyLine: "(empty line)", // DRAFT
    lines: "Your instructions, one to a line", // DRAFT
    noLines: "There are no instructions yet.", // DRAFT
    addFirst: "Add a line", // DRAFT
    addBelow: "Add a line below", // DRAFT
    remove: "Delete this line", // DRAFT
    up: "Move up", // DRAFT
    down: "Move down", // DRAFT
    done: "Done", // DRAFT
    editing: (n: number) => `Editing line ${n}`, // DRAFT
    instruction: "Instruction", // DRAFT
    operand: (n: number) => `Operand ${n}`, // DRAFT
    number: "A number", // DRAFT
    numberPad: "Number pad", // DRAFT
    numberShown: (n: string) => `Number: ${n === "" ? "none yet" : n}`, // DRAFT
    deleteDigit: "Delete last digit", // DRAFT
    clearNumber: "Clear number", // DRAFT
    notEditable:
      "This line is not an instruction the chips can build. Pick an instruction to replace it.", // DRAFT
  },

  grader: {
    nothingWritten: "Write at least one instruction first.", // DRAFT
    unanswered: (fields: string) => `Give a whole number for ${fields} first.`, // DRAFT
    notWhole: (field: string) => `The answer for ${field} must be a whole number.`, // DRAFT
    noProgram: "This challenge has no program to run.", // DRAFT
  },
} as const;

/** Text with `code` in backticks, as plain text: a verdict heading and a select show no Markdown. */
export const plain = (text: string): string => text.replace(/`([^`]*)`/g, "$1");
