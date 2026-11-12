// Copyright © 2026 Christopher Snow

// Drafted separately from checked four-bit model facts.
// Canonical record: docs/notes/module-2/prose.md, "Four-bit flag primer strings".
const numberText = (value: number) => String(value).replace("-", "−");

export const FLAG_PRIMER_STRINGS = {
  headingNZ: "N and Z read the result",
  headingCV: "C and V check the two ranges",
  miniature: "Four-bit teaching calculation",
  exampleCaption: "Four worked four-bit additions show what N, Z, C and V record.",
  practiceCaption: "Predict N, Z, C and V for a fresh four-bit addition.",
  retainedReadings: (unsigned: number, signed: number) =>
    `Retained result: ${numberText(unsigned)} unsigned; ${numberText(signed)} signed.`,
  carryOut: (value: number) => `Carry out past bit 3: ${value}`,
  nTitle: "N: the top result bit",
  zTitle: "Z: an all-zero result",
  cTitle: "C: the unsigned sum is too large",
  vTitle: "V: the signed sum is outside the range",
  nRule:
    "N copies the top result bit. A 1 means the retained result has a negative signed reading. N alone does not tell you whether the signed sum fits.",
  zRule: "Z is 1 when every result bit is 0. If any result bit is 1, Z is 0.",
  cRule:
    "C is the carry out of the top bit. For addition, C is 1 when the exact unsigned sum is too large for the available bits.",
  vRule:
    "V is 1 when the exact signed sum is outside the signed range. The retained bits then represent a different signed number.",
  result: "Result bits",
  first: "First input",
  second: "Second input",
  positions: "Bit positions",
  unsigned: "Unsigned reading",
  signed: "Signed reading",
  rangeUnsigned: "the unsigned range, 0 to 15.",
  rangeSigned: "the signed range, −8 to 7.",
  fits: "Fits",
  doesNotFit: "Outside",
  exactSum: "Exact sum",
  retained: "Retained result",
  allFlags: "All four flags",
  independent:
    "Each calculation gives all four flag values. The title names the flag to inspect first. C and V check separate readings: either, both or neither can be 1.",
  practiceTitle: "Read four flags for a fresh addition",
  practiceIntro:
    "The four-bit addition below has its result bits supplied. Choose 0 or 1 for each flag, then press Check flags.",
  check: "Check flags",
  reset: "Clear",
  incomplete: "Choose 0 or 1 for all four flags before checking.",
  correct: "All four flags are correct.",
  incorrect: "Some flags need another look. Compare your choices with the explanation.",
  practiceFeedback: [
    "N is 0 because the top result bit is 0.",
    "Z is 0 because the result is not all zero.",
    "C is 1: the exact unsigned sum is 8 + 9 = 17, outside 0 to 15.",
    "V is 1: the signed inputs are −8 and −7. Their exact sum is −15, outside −8 to 7.",
  ],
  practiceTakeaway:
    "The retained result is 0001, which reads as 1 under either reading. Both C and V are 1 even though N is 0.",
  flagLabel: (name: string) => `Flag ${name}`,
  sum: (a: number, b: number, total: number) =>
    `${numberText(a)} + ${b < 0 ? `(${numberText(b)})` : numberText(b)} = ${numberText(total)}`,
} as const;
