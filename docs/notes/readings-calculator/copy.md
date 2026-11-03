# Inline calculator copy draft

Drafted separately from the implementation after reading `CLAUDE.md`, `docs/style.md`,
`packages/views/src/strings.reading-sequence.ts` and the lesson's labels.

## Checked brief

- The learner chooses the bits and the weights to combine.
- The calculator evaluates only the arithmetic the learner types. It does not read the bit pattern,
  convert hexadecimal or put its result in an answer field.
- It accepts decimal whole numbers, optional correctly grouped commas, signed operands,
  `+`, `-`, `*`, `/` and parentheses.
- Division must be exact. Invalid or incomplete expressions and division by zero produce an
  error, never a rounded result. The implementation uses arbitrary-precision integers and limits
  input to 200 characters to bound parsing and arithmetic work.
- The learner has already met signed and unsigned positional weights and decimal answer fields.
- The 32-bit reading task already permits a calculator. The closing construction exercise asks
  the learner to build a pattern and supply its unsigned reading.

## Proposed strings

| Use | Copy |
| --- | --- |
| Optional disclosure | Calculator |
| Input label | Calculation |
| Help | Type your own calculation using the weights you chose. |
| Format help | Use decimal whole numbers, `+`, `-`, `*`, `/` and parentheses. Commas between groups of three digits are accepted. Division must give a whole number. |
| Submit button | Calculate |
| Result label | Result |
| Empty input | Enter a calculation. |
| Invalid or incomplete expression | Check the numbers, signs and parentheses in your calculation. |
| Division by zero | You cannot divide by zero. |
| Nonintegral division | This division does not give a whole number. |
| Supported-range or resource limit | This calculation is too large. |

Render operators as code or literal characters, without displaying Markdown markup. Leave the input
empty initially and omit a numerical example or placeholder. Show the computed value after the
result label; do not describe it as the exercise's answer. Clear an old result when its calculation
changes so it cannot appear to belong to new input.

If distinct validation feedback is cheap to support, use this more specific message for malformed
comma groups: “Put commas between groups of three digits.” Otherwise the invalid-expression
message covers that case.

## Scope recommendation

Include the same closed disclosure beside the 32-bit reading task and beside the unsigned answer
in “Make −3”. Both ask learners to apply the weight rule at register width; long arithmetic should
not obscure that rule. Keep the small-pattern practice unchanged, where adding a few displayed
weights is part of learning the rule. Do not expand this change to the separate “Two readings each”
exercise without checking its current role in the lesson.

The disclosure keeps optional help local. One input and one result preserve the learner's choice
of calculation and require them to transfer the result themselves. The format help states the
restrictions before use, so a fractional division is not mistaken for truncating machine division.
The error messages name recoverable problems without teaching a new term such as “parser” or
“safe integer”. No string reveals a challenge's bit pattern, arithmetic expression or answer.

Both closing style passes completed on the proposed strings. Independent review remains for the
integrated lesson and its rendered controls.
