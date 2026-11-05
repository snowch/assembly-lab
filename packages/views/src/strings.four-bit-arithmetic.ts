// Copyright © 2026 Christopher Snow

// Draft and canonical record: docs/notes/four-bit-arithmetic/.
export const FOUR_BIT_STRINGS = {
  bit: (index: number) => `Bit ${index}`,
  unrevealed: "Not revealed",
  columnsLabel: "Four-bit addition columns",
  carryRow: "Incoming carry",
  firstRow: "First input",
  carryNotes: "Carry notes (optional, not graded)",
  carryNote: (bit: number) => `Carry note for bit ${bit} (optional, not graded)`,
  plusSign: "+",
  secondRow: "Second input",
  resultRow: "Result",
  extraRow: "Extra carry",
  nextColumn: "Next column",
  reset: "Reset",
  start: "No columns revealed. Start at the right.",
  starting: "Starting inputs",
  inputA: "A",
  inputB: "B",
  carryIn: "Carry in",
  carry: "Carry",
  kept: "Kept",
  carryOut: "Carry out",
  next: "Next",
  revealed: "Revealed",
  widthSum: "Full binary sum with the extra carry outside four retained places",
  progress: (done: number, count: number) => `${done} of ${count} revealed`,
  current: (bit: number, revealed: boolean) =>
    revealed ? `Just revealed · bit ${bit}` : `Next to reveal · bit ${bit}`,
  columnLabel: (bit: number, revealed: boolean, next: boolean) =>
    `Bit ${bit}${revealed ? ", just revealed" : ""}${next ? ", next to reveal" : ""}`,
  cell: (label: string, value: string | number, destination?: string) =>
    `${label}: ${value === "?" ? "not revealed" : value}${destination === "carry" ? ", received carry" : destination === "kept" ? ", kept in this column" : ""}`,
  finalCarry: (carry: number) => `Final carry out ${carry}. No next column.`,
  binaryEquation: (
    work: { a: number; b: number; carryIn: number; total: number; carryOut: number; kept: number },
    revealed: boolean,
  ) =>
    revealed
      ? `Binary column sum: ${work.a} plus ${work.b} plus incoming carry ${work.carryIn} equals ${work.total.toString(2).padStart(2, "0")} in binary. Carry ${work.carryOut}; kept bit ${work.kept}.`
      : `Next column inputs: ${work.a} plus ${work.b} plus incoming carry ${work.carryIn}. Both outputs are not revealed.`,
  column: (work: { bit: number; kept: number; carryOut: number }) =>
    `Bit ${work.bit}: keep ${work.kept} in this column; carry ${work.carryOut} goes into bit ${work.bit + 1}.`,
  complete: (pattern: string, carry: number) =>
    `All columns revealed: result ${pattern}. Final carry out ${carry}; there is no next column.`,
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
