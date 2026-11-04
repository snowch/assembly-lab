// Copyright © 2026 Christopher Snow

// Draft and canonical record: docs/notes/four-bit-arithmetic/.
export const FOUR_BIT_STRINGS = {
  bit: (index: number) => `Bit ${index}`,
  unrevealed: "Not revealed",
  columnsLabel: "Four-bit addition columns",
  carryRow: "Incoming carry",
  firstRow: "First input",
  secondRow: "Second input",
  resultRow: "Result",
  extraRow: "Extra carry",
  nextColumn: "Next column",
  reset: "Reset",
  start: "No columns revealed. Start at the right.",
  column: (work: {
    bit: number;
    a: number;
    b: number;
    carryIn: number;
    total: number;
    kept: number;
    carryOut: number;
  }) =>
    `Bit ${work.bit}: ${work.a} + ${work.b} + incoming carry ${work.carryIn} = ${work.total} in decimal. Kept ${work.kept}; carried ${work.carryOut} left.`,
  done: "All four columns are revealed.",
  retained: "Low four bits",
  outside: "Outside four places",
  unsigned: "Unsigned reading",
  signed: "Signed reading",
  original: "Original bits",
  inverted: "Inverted bits",
  plusOne: "Add one",
  opposite: "Opposite pattern",
  addOpposite: "Add the opposite",
  negationLabel: "Construct the opposite of the second input",
  additionLabel: "Add the opposite to the first input",
  summary: (result: { pattern: string; unsigned: number; signed: number }) =>
    `${result.pattern}: ${result.unsigned} unsigned, ${result.signed} signed.`,
  wrapSummary: (fullPattern: string, pattern: string) =>
    `The full sum is ${fullPattern}. Keep ${pattern} within four places.`,
  widthsNote: "These four places show the calculation; they are not an Arm register.",
} as const;
