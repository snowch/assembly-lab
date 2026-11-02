// Copyright © 2026 Christopher Snow

// Drafted separately from checked register-reading facts; see the lesson review notes.
export const READER_STRINGS = {
  viewsLabel: "Reading",
  views: { unsigned: "Unsigned", signed: "Signed", compare: "Compare" },
  bit: "Bit",
  value: "Value",
  weight: "Weight",
  unsignedWeight: "Unsigned weight",
  signedWeight: "Signed weight",
  instruction: "Press a bit to change its value. A 1 contributes its weight; a 0 contributes zero.",
  reset: "Reset to all ones",
  resetExample: "Reset example",
  scrollCue: "Scroll to see the bit weights",
  omittedBits: "Bits 29 to 4 omitted",
  diagramLabel: "Selected bit positions and their weights",
  caption: "Selected bit positions, with each value above its weight.",
} as const;
