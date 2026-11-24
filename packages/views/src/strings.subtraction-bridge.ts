// Copyright © 2026 Christopher Snow

// Separate draft: docs/notes/subtraction-carry-diagram/copy.md.
export const SUBTRACTION_BRIDGE_STRINGS = {
  title: "See the width boundary",
  scope: "Four-bit view of the same {a} minus {b} calculation. The Arm instruction uses 32 bits.",
  inversionTitle: "The original and inverted input",
  originalB: "Original b",
  invertedB: "Inverted b",
  allOnes: "All ones",
  inversionWhy:
    "Each original bit and its inverted bit add to 1. Together they make {maximum}, the largest four-bit value. So inverting b gives {maximum} − b.",
  additionTitle: "Add the first input and carry in",
  inputA: "First input a",
  carryIn: "Carry in",
  fullSum: "Full sum",
  carryOut: "Carry out of four bits",
  storedBits: "Four bits kept",
  unsigned: "Unsigned reading",
  bits: "Bits",
  decimal: "Unsigned decimal",
  sumWhy:
    "The carry in adds 1 to {maximum} − {b}. Because {maximum} + 1 is {range}, the full sum is {a} + {range} − {b}.",
  carryPlace: "Place value: {range}",
  storedReading: "Unsigned reading: {result}",
  fullSumReading: "Full sum: {sum} = {carryValue} from carry + {result} kept",
  wideTitle: "Return to the original example at 32 bits",
  wideWhy:
    "The original calculation is {a} − {b}. At 32 bits, all ones is {wideMaximum}. Adding the carry in of 1 gives {wideRange}, the value of the first place beyond 32 bits. The full sum is {a} + {wideRange} − {b}; keep only the low 32 bits.",
  rule: "`subs` sets the carry flag C from the real 32-bit carry out. If `a` is at least `b`, the sum reaches that extra place: C = 1, no unsigned borrow. Otherwise C = 0: borrow needed.",
} as const;
