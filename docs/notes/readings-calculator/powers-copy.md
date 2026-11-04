# Calculator powers copy draft

Separate drafting pass against `CLAUDE.md`, `docs/style.md`, the current calculator
strings and `copy.md` in this directory.

## Brief

- Keep the calculator as arithmetic the learner types, with no answer-field autofill.
- Add `^` for powers. The number after `^` must evaluate to a non-negative whole number.
- Retain decimal whole numbers, signed operands, the existing operators, parentheses,
  correctly grouped commas and exact division.
- Use `2^8` only as a notation example. Do not show its result or an exercise calculation.
- Give negative powers a dedicated error. Keep the existing message for excessive calculations.
- The implementation brief sets a 200-character input limit, a maximum exponent of 4096
  and a 16384-bit limit on intermediate magnitudes. Keep these implementation limits out
  of the short format help.

## Proposed complete strings

```ts
export const CALCULATOR = {
  title: "Calculator",
  calculation: "Calculation",
  help: "Type your own calculation using the weights you chose.",
  format:
    "Use decimal whole numbers, `+`, `-`, `*`, `/`, `^` and parentheses. Write powers as `2^8`, with a non-negative whole number after `^`. Commas between groups of three digits are accepted. Division must give a whole number.",
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
```

Render the format help's notation as code, without exposing Markdown backticks. Preserve the existing
empty initial input, manual result transfer and clearing of stale results.

Both closing style passes completed on the proposed strings. Independent review remains
for the implementation and rendered controls.
