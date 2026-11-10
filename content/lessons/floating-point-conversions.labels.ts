// Copyright © 2026 Christopher Snow

export const LABELS = {
  title: "Converting values and copying bits",
  line: "Distinguish a numeric conversion, a wider representation and a copy of unchanged bits.",
  objectives: [
    "Explain why a finite, in-range C floating-to-integer cast discards the fractional part.",
    "Distinguish widening an already rounded value from restoring the original decimal.",
    "Distinguish an fmov bit copy from a numeric conversion.",
  ],
  titles: {
    question: "A cast requests a numeric value",
    experiment: "Conversion instructions and a bit copy",
    exercise: "Choose the operation by its meaning",
  },
  captions: {
    explorer:
      "Recorded GCC and QEMU cases for numeric conversion, widening and a representation copy.",
    check: "A fresh conversion question, independent of the recorded cases.",
  },
  originality: {
    textbookExample:
      "A cast table that lists mnemonics without separating numeric values from representations.",
    howThisDiffers:
      "Uses recorded vehicle-distance functions to compare truncation, rounded integer conversion, widening and a memcpy representation copy. A fresh negative distance checks the truncation rule.",
  },
} as const;
