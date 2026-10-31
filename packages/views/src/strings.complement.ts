// Copyright © 2026 Christopher Snow

// Draft and canonical record: docs/notes/twos-complement-appendix/.
export const COMPLEMENT_STRINGS = {
  readingTitle: "Four bits, two readings",
  negationTitle: "Negating a four-bit pattern",
  group: "Four-bit pattern",
  bit: (index: number) => `Bit ${index}`,
  unsignedWeight: "Unsigned weight",
  signedWeight: "Signed weight",
  unsignedSum: "Unsigned sum",
  signedSum: "Signed sum",
  original: "Original bits",
  inverted: "Inverted bits",
  addOne: "Add one",
  fullSum: "Full sum",
  retained: "Low four bits",
  before: "Original signed reading",
  after: "Result signed reading",
  extra: "Beyond four bits",
  outOfRange: "Signed result out of range",
  zero: "Try zero",
  minimum: "Try −8",
  reset: "Reset to 1010",
  zeroFeedback:
    "Zero stays zero. Inverting gives 1111; adding one gives 10000. Keeping the low four bits gives 0000. There is no separate negative-zero pattern.",
  minimumFeedback:
    "The opposite of −8 is 8, which is outside the four-bit signed range, −8 to 7. Inverting and adding one leaves 1000, still read as −8. The required signed result does not fit.",
  fitsFeedback: "The opposite signed value fits in four bits.",
  extraFeedback:
    "The addition needs an extra left bit. The four-bit result keeps only the low four bits.",
} as const;
