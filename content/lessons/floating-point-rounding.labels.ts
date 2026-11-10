// Copyright © 2026 Christopher Snow

export const LABELS = {
  title: "Rounding and precision",
  line: "Compare an entered decimal with its stored value and explain the gaps between nearby values.",
  objectives: [
    "Distinguish an exact entered decimal from the binary value stored for it.",
    "Use binary32 spacing and the last retained binary bit to decide a nearest-even tie.",
  ],
  titles: {
    question: "A pump reading in finite bits",
    experiment: "Rounding to a nearby value",
    exercise: "Choose the next rounded value",
  },
  captions: {
    explorer:
      "A local calculation of the stored value and its next smaller and next larger representable values.",
    check: "A fresh rounding question, independent of the explorer.",
  },
  originality: {
    textbookExample:
      "Adding two familiar decimal tenths and treating the printed result as the stored value.",
    howThisDiffers:
      "Uses a pump reading of 12.35, separates exact decimal input from binary storage, and connects increasing distance totals to spacing and a fresh nearest-even tie.",
  },
} as const;
