// Copyright © 2026 Christopher Snow

// Separate copy draft: docs/notes/readings-calculator/copy.md.
export const CALCULATOR = {
  title: "Calculator",
  calculation: "Calculation",
  help: "Type your own calculation using the weights you chose.",
  format:
    "Use decimal whole numbers, `+`, `-`, `*`, `/` and parentheses. Commas between groups of three digits are accepted. Division must give a whole number.",
  calculate: "Calculate",
  result: "Result",
  errors: {
    empty: "Enter a calculation.",
    invalid: "Check the numbers, signs and parentheses in your calculation.",
    zeroDivision: "You cannot divide by zero.",
    fraction: "This division does not give a whole number.",
    large: "This calculation is too large.",
  },
} as const;
