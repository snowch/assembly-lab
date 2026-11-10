// Copyright © 2026 Christopher Snow

// Separate draft and canonical copy: docs/notes/register-prediction-tools/.
export const PREDICTION_TOOLS = {
  // Link copy: docs/notes/programmer-calculator-link/copy.md.
  programmerCalculator: {
    label: "Open programmer calculator",
    newTab: "Opens in a new tab",
    help: "Inspect your own values as bits, hexadecimal or decimal. The calculator does not run the instructions.",
    href: "https://snowch.github.io/programmer-calculator/",
  },
  summary: "Working notes",
  label: "Your working notes",
  help: "Your notes stay in this browser when you return to this exercise. They are not graded.",
  clear: "Clear notes",
  storageFailure:
    "Your notes could not be saved in this browser. Your current text is still here. Copy it before leaving or reloading the page.",
  invalidNumber: (field: string) =>
    `The answer for ${field} must be a whole number written in decimal or hexadecimal beginning with 0x.`,
} as const;
