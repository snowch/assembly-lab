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
    // Says "in decimal", because `0x5` is a whole number and is refused.
    notWhole: (field: string) =>
      `The answer for ${field} must be a whole number written in decimal.`,
    noProgram: "This challenge has no program to run.",
    // The failure card's sentence for a wrong field that has no sentence of its own. It names
    // the field and never the value. Without it the card prints its labels with nothing under them.
    fieldNotRight: (field: string) => `Your answer for ‘${field}’ is not right.`,
  },

  // The words of Module 3's figures and graders, redrafted by Haiku and checked for meaning
  // (17 October 2026).
  bits: {
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
    onEntry: (register: string) => `${register} when the call starts`,
    /** What a screen reader hears for a row of 32 bits: its name and its value. */
    rowGroup: (name: string, hex: string) => `${name}: ${hex}`,
    /** Joins a list of bit numbers: 2; 2 and 3; 0, 2 and 3. */
    and: "and",
  },

  bitOps: {
    functions: "Function",
    cLabel: "C",
    instructionLabel: "Instruction",
    rowMask: "Mask",
    rowBefore: (register: string) => `${register} before`,
    rowAfter: (register: string) => `${register} after`,
    inputLabel: (register: string) => `Value of ${register} when the call starts`,
    inputProblem: "Type a whole number, or a hexadecimal number starting with 0x.",
    // `list` is the bit numbers joined into a phrase (`2`, `4 and 6`), `count` how many.
    changed: (list: string, count: number) =>
      count === 1 ? `Bit ${list} changed.` : `Bits ${list} changed.`,
    unchanged: "No bit changed.",
    result: (register: string, hex: string, decimal: string) =>
      `${register} holds ${hex}, which is ${decimal}.`,
    // Everything from here to the end of this object is Module 3's rework of 17 October 2026, and
    // is DRAFT until it has been through the prose process (a test counts the marks).
    legend:
      "Outlined and marked ▲: bits that changed. Underlined: the field the instruction uses. Dotted frame: the bit you picked.", // DRAFT
    /** The rule for the operation the function's instruction is, one line. */
    rule: {
      and: "AND: a mask bit of 0 clears the bit, and a 1 keeps it.", // DRAFT
      orr: "OR: a mask bit of 1 sets the bit, and a 0 keeps it.", // DRAFT
      eor: "Exclusive OR: a mask bit of 1 flips the bit, and a 0 keeps it.", // DRAFT
    },
    inputRange:
      "A word has 32 bits. Use a number from -2147483648 to 4294967295, or up to eight hexadecimal digits after 0x.", // DRAFT
    noResult: "No result is shown until the word can be read.", // DRAFT
    rowChanged: "Changed", // DRAFT
    changedGlyph: "▲", // DRAFT
    pickGroup: "Read one bit", // DRAFT
    higherBit: "Higher bit", // DRAFT
    lowerBit: "Lower bit", // DRAFT
    pickHint: "Press a bit, or use the buttons, to read its column.", // DRAFT
    column: (bit: number, input: number, mask: number, result: number) =>
      `Bit ${bit}: input ${input}, mask ${mask}, result ${result}.`, // DRAFT
    columnPlain: (bit: number, input: number, result: number) =>
      `Bit ${bit}: input ${input}, result ${result}.`, // DRAFT
  },

  shift: {
    instruction: "Instruction",
    by: "Shift by",
    inputLabel: "Value of w0 when the call starts",
    inputProblem: "Type a whole number, or a hexadecimal number starting with 0x.",
    rowBefore: "Before",
    rowAfter: "After",
    fellOff: (bits: string) => `Fell off: ${bits}`,
    filledWith: (bits: string) => `Filled with: ${bits}`,
    result: (instruction: string, hex: string, unsigned: string, signed: string) =>
      `After \`${instruction}\`, w0 holds ${hex}: ${unsigned} as unsigned, ${signed} as signed.`,
    // From here to the end of this object is the rework of 17 October 2026: DRAFT.
    legend:
      "Struck through and marked ×: bits that fall off. Dashed and marked +: bits the shift filled in.", // DRAFT
    arrowLeft: "←", // DRAFT
    arrowRight: "→", // DRAFT
    moves: (op: string, amount: number, left: boolean) =>
      `\`${op}\` moves every bit ${amount} ${amount === 1 ? "place" : "places"} ${left ? "left" : "right"}.`, // DRAFT
    /** What fills the gap, by instruction. */
    rule: {
      lsl: "The gap on the right is filled with zeros.", // DRAFT
      lsr: "The gap on the left is filled with zeros.", // DRAFT
      asr: "The gap on the left is filled with copies of the old top bit.", // DRAFT
    },
    rowLost: "Lost", // DRAFT
    rowFilled: "Filled", // DRAFT
    lostGlyph: "×", // DRAFT
    filledGlyph: "+", // DRAFT
    noResult: "No result is shown until the word can be read.", // DRAFT
  },

  pair: {
    differs: "This instruction differs from the other listing",
  },

  probe: {
    clearedBits: (bits: string) =>
      `The simulator ran the function on a word with every bit set. ${bits} came out 0.`,
    // The one bit that came out 0, when it was only one, so that a function that also clears
    // other bits is told apart.
    clearedOnly: (bit: number) =>
      `The simulator ran the function on a word with every bit set. Only bit ${bit} came out 0.`,
    noneCleared: "The simulator ran the function on a word with every bit set. No bit came out 0.",
    filled: (instruction: string, how: string) => `The simulator ran \`${instruction}\`. ${how}`,
    fillCopy: "The top bit was filled with a copy of the old top bit.",
    fillZero: "The top bit was filled with 0.",
    fillFell: "The top bit was filled with the bit that fell off the bottom.",
    fillOther: "The top bit was filled in a way none of the choices describe.",
    firstAdds: (instruction: string, negative: string, other: string) =>
      `The simulator ran \`${instruction}\` on negative and non-negative values. It added ${negative} to a negative value and ${other} to any other value.`,
    firstAddsVaries: (instruction: string) =>
      `The simulator ran \`${instruction}\` on negative and non-negative values. The amount it added varied from one value to the next.`,
    endedWithHex: (register: string, hex: string) =>
      `The simulator ran the program. \`${register}\` held ${hex} when the run ended.`,
  },

  // ---- Module 3's rework of 17 October 2026 (module3-block-start) -------------------------------
  // Every string from here to the end marker is DRAFT until it has been through the prose process.
  // A test counts the marks, so a new one is a decision somebody sees.

  /** The glyphs under a big cell, and the words each one stands for. */
  cells: {
    tag: {
      changed: "changed", // DRAFT
      cleared: "cleared", // DRAFT
      moved: "moved up", // DRAFT
      combined: "combined in", // DRAFT
      kept: "unchanged from the start of the call", // DRAFT
      survives: "still set from the old word", // DRAFT
      lost: "lost off the end", // DRAFT
      fill: "filled in", // DRAFT
      differs: "differs from the result with the clear", // DRAFT
    },
  },

  warning: {
    inUse: "The bits in use", // DRAFT
    unused: (from: number, to: number) => `Bits ${from} to ${to} are not used in this example.`, // DRAFT
    on: "on", // DRAFT
    off: "off", // DRAFT
  },

  maskView: {
    mask: (signed: string, hex: string) => `The mask is ${signed}, which is ${hex}.`, // DRAFT
    // `list` is the bit or bits framed (`Bit 2`), `count` how many.
    frame: (list: string, count: number) =>
      count === 1
        ? `Dotted frame: ${list}, the only bit where the mask has a 0.`
        : `Dotted frame: ${list}, the bits where the mask has a 0.`, // DRAFT
    all: "Show all 32 bits", // DRAFT
  },

  fieldReading: {
    noField: "This figure needs a function whose first instruction reads a field.", // DRAFT
    // `bits` is the selected bits as 0 and 1, highest first.
    selected: (from: number, to: number, bits: string) => `Bits ${to} to ${from} are ${bits}.`, // DRAFT
    gives: (call: string, value: string) => `\`${call}\` gives ${value}.`, // DRAFT
    legend: "Underlined: the bits the instruction takes.", // DRAFT
  },

  calls: {
    group: "Call", // DRAFT
  },

  solution: {
    locked: "Run your instructions above first. The figure opens once you have run them.", // DRAFT
    noRun: "Your instructions do not assemble yet, so there is nothing to step through.", // DRAFT
    all: "Show all 32 bits", // DRAFT
    marks: "Marks", // DRAFT
    returns: (register: string) => `${register} when it returns`, // DRAFT
  },

  bfi: {
    locked: "Pass the challenge above first. The figure opens once you have passed it.", // DRAFT
    yours: "Your code", // DRAFT
    gcc: "GCC's code", // DRAFT
    // `same` is whether the two answers are the same word.
    result: (call: string, yours: string, gcc: string, same: boolean) =>
      same
        ? `\`${call}\` gives ${yours} from your code and from GCC's.`
        : `\`${call}\` gives ${yours} from your code and ${gcc} from GCC's.`, // DRAFT
  },

  clearCompare: {
    noOr: "This figure needs a function that joins a value to the word with an `orr`.", // DRAFT
    old: "Old word", // DRAFT
    moved: "New gear, moved into place", // DRAFT
    without: "OR without the clear", // DRAFT
    with: "OR with the clear", // DRAFT
    summary: (without: string, full: string) =>
      `Without the clear the OR gives ${without}. With the clear, GCC's function gives ${full}.`, // DRAFT
  },

  operand: {
    facts: "The register before and after the instruction", // DRAFT
    operand: (text: string) => `Operand \`${text}\``, // DRAFT
  },
  // ---- end of Module 3's rework (module3-block-end) ---------------------------------------------

  answers: {
    notHex: (field: string) =>
      `The answer for ${field} must be a hexadecimal number, such as \`0x2f\`.`,
    unanswered: (fields: string) => `Give an answer for ${fields} first.`,
  },

  tap: {
    sign: "Change sign",
  },
} as const;

/** Text with `code` in backticks, as plain text: a verdict heading and a select show no Markdown. */
export const plain = (text: string): string => text.replace(/`([^`]*)`/g, "$1");

/**
 * Text with `code` in backticks, as the code inside curly quotes: a verdict's detail is printed as
 * plain text by the platform, which cannot render markup there, so the quotes set the code apart.
 */
export const quoted = (text: string): string => text.replace(/`([^`]*)`/g, "“$1”");
