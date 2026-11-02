// Copyright © 2026 Christopher Snow

// Drafted separately from checked facts; see docs/notes/compact-readings/draft.md.
// Canonical strings: docs/notes/compact-readings/prose.md.
export const READER_STRINGS = {
  viewsLabel: "Reading",
  views: { unsigned: "Unsigned", signed: "Signed", compare: "Compare" },
  guidance: {
    unsigned: "All weights are positive. Choose **Bit 31 only** to inspect the top bit on its own.",
    signed:
      "The signed reading gives bit 31 a negative weight. Every other weight stays positive. This representation is called **two’s complement**. Here, C’s `int` uses this signed reading. Changing the reading keeps the same bits. Choose **Compare** to see both readings together.",
    compare:
      "Both readings use the same bits. Only the top bit’s weight differs. A clear top bit contributes zero in both readings.",
  },
  unsignedTop: "Choose **Signed** to read these same bits another way.",
  appendix: "Explore two’s complement with four bits",
  bit: "Bit",
  value: "Value",
  weight: "Weight",
  contribution: "Contribution",
  selectedBit: (bit: number) => `Bit ${bit}`,
  set: "This bit is set, so it contributes its weight.",
  clear: "This bit is clear, so it contributes zero. Its weight stays the same.",
  presetBit0: "Bit 0 only",
  presetTop: "Bit 31 only",
  reset: "Reset",
  resetGuidance: "Reset restores Unsigned with only bit 0 set.",
  top: "Top bit contributes",
  other: "Other bits contribute",
  total: "Total",
  fullSum: "Full sum",
  predictEntry: "Start prediction",
  predictGuidance: "Explore **Signed** and **Compare** before trying this prediction.",
  prediction: {
    title: "Setting bit 0",
    starting: "Starting bits",
    prompt:
      "Start with only bit 31 set. Bit 0 is clear. If you set bit 0 and leave every other bit unchanged, which reading changes?",
    pending: "Choose an answer to see the result.",
    choices: {
      unsigned: "Only the unsigned reading",
      signed: "Only the signed reading",
      both: "Both readings",
    },
    correct: "Correct.",
    incorrect: "Not quite.",
    feedback:
      "Both readings change. Bit 0 has the same positive weight in both readings. Setting it adds that weight to each total. The top bit stays set, so its contribution stays the same.",
    before: "Before",
    after: "After setting bit 0",
    cancel: "Return to exploring",
    explore: "Explore the result",
    table: "Readings before and after setting bit 0",
  },
} as const;
