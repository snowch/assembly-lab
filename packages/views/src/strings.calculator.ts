// Copyright © 2026 Christopher Snow

// Separate copy drafts: docs/notes/readings-calculator/{copy,powers-copy}.md.
export const CALCULATOR = {
  title: "Calculator",
  calculation: "Calculation",
  help: "Type your own calculation using the weights you chose.",
  format:
    "Use decimal whole numbers, `+`, `-`, `*`, `/`, `^` and parentheses. Write powers as `2^8`, with a non-negative whole number after `^`. Commas between groups of three digits are accepted. Division must give a whole number.",
  // Separately drafted for constant building; the original exact-division help remains above.
  halvesHelp: "Use the steps above to find the two halves.",
  halvesFormat:
    "Use decimal whole numbers, `+`, `-`, `*`, `/`, `^` and parentheses. Write powers as `2^8`, with a non-negative whole number after `^`. Commas between groups of three digits are accepted. Division discards any fractional part, keeping the whole-number part towards zero.",
  calculate: "Calculate",
  result: "Result",
  errors: {
    empty: "Enter a calculation.",
    invalid: "Check the numbers, signs and parentheses in your calculation.",
    zeroDivision: "You cannot divide by zero.",
    fraction: "This division does not give a whole number.",
    negativePower: "Use a non-negative whole number after ^.",
    large: "This calculation is too large.",
  },
} as const;
