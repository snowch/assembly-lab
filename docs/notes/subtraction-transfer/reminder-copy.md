# Counter subtraction reminder: separate copy draft

Copyright © 2026 Christopher Snow

## Scope and evidence

Drafted from `brief.md`, the local learning-design skill, the style checklist and the source of `fourBitSubtraction` and `fourBitNegation`. Earlier Arithmetic with four bits defines and practises the rule; this reminder applies it to readings of a counter before the original elapsed-time prediction and ring. No novice formative session was conducted. Copy/source review and model checks do not establish learning effectiveness.

The parent owns the component and lesson placement. This draft owns only its learner strings and this canonical record. The inherited available capable model was used for the separate drafting pass, following the authoring guide's allowance for model availability.

## Checked facts

- The existing subtraction view obtains the low four result bits from a real 32-bit `sub` run. Its `negation` field obtains the inverted and add-one patterns from the existing representation model; its `addition` field adds the later reading to that retained negation.
- For the requested later/earlier readings, the displayed patterns are the supplied model's `a.pattern`, `b.pattern`, `negation.inverted.pattern`, `negation.after.pattern` and `result.pattern`. The component must read those fields. It must not render handwritten numerical results in place of them.
- The new four-bit pair is a separate worked example. It does not give the original 32-bit prediction's result. The width bridge must remain visible before that prediction.
- A normal forward interval shorter than a full turn is necessary to interpret the retained difference as elapsed ticks. The full-turn number belongs to the counter model.
- The rows explain a mathematical calculation of the retained result; they are not a request to write three separate instructions or a claim about the processor's internal sequence.

## Canonical strings

The exact runtime strings are in `packages/views/src/strings.counter-subtraction.ts` under `COUNTER_SUBTRACTION_STRINGS`.

### Title and caption

**Subtracting with addition**

A worked subtraction using a small counter.

### Introduction

Use the same {width}-bit counter. Its earlier reading is `{then}` and its later reading is `{now}`. Calculate later minus earlier.

### Rule

Invert the earlier reading: change every 0 to 1 and every 1 to 0. Add one, then add the later reading. Keep only the low {width} result bits.

### Labels

- Later reading (now)
- Earlier reading (then)
- Invert the earlier reading
- Add one
- Add the later reading
- Result bits kept
- Counter readings in counting order

### Result interpretation

The retained result is {ticks} ticks. It matches the forward path through zero.

This is the elapsed time only when the counter advances normally and fewer than {range} ticks, one full turn, pass between readings.

### Instruction and width bridge

These rows explain the arithmetic. In your code, one `sub` instruction calculates the result bits.

The next example uses a {registerWidth}-bit counter. Apply the same rule to all {registerWidth} bits of each reading, keeping {registerWidth} result bits instead of {smallWidth}.

## Reading decisions

The labels identify the operand by its role as the earlier reading, not just by a letter. The order remains later minus earlier across the wrap. The rule defines inversion immediately. The timeline provides a second way to see the same result, and its label specifies counting order. The bound follows that interpretation rather than preceding the small mechanism with a long qualification. The final bridge explicitly changes width before the real case and does not imply a four-bit Arm register.

No buttons, flags, carry assessment or extra exercise are proposed here. The original prediction supplies a fresh application after the reminder. The original graded function still checks normal and wrapped cases.

## Verification boundary

Read the existing all-pairs four-bit model tests, which cover the requested pair as part of their full input space. The parent should pin the new displayed example and generated timeline explicitly, verify the original prediction remains unrevealed, and run the built pane at phone/desktop widths and both themes with independent learner and technical reviewers.

The focused command `npx vitest run packages/views/src/four-bit-arithmetic.test.ts` passed nine tests across the matching two model/view files, including the existing all-pairs arithmetic checks. There were no failures or skips. Prettier reported the owned TypeScript file unchanged; the owned-file whitespace check passed. These checks do not replace final built-page reviews.

## First-use definitions after learner review

Accepted the independent finding that the new question pane precedes the original motivation, so its counter and tick terms need definitions before their first use. The introduction now defines the counter as a stored count, a tick as adding one, and the selected counter’s continuation at zero after its largest value. No model-value parameter or API changed. The parent/reviewer owns rebuilt-page verification of this wording and its position. This correction is an authoring review result, not evidence from a novice study.

## Counter-wrap preparation restored

The separate preceding counter-wrap pane now defines the counter and tick, and demonstrates continuation through zero before this subtraction. The introduction above keeps the same explicit readings and calculation without repeating those definitions. The restored pane and joining copy are recorded in `../restore-counter-wrap/copy.md`. The four-bit subtraction, interval bound, single-instruction note and 32-bit bridge remain unchanged.
