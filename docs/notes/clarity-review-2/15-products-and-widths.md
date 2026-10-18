<!-- Copyright © 2026 Christopher Snow -->

# Second clarity review: Products and their widths

Scope: lesson 15, `products-and-widths`, at baseline `5cb518c` with the approved
Module 0 simulator sentence in the preview. Review only; no learner text changed.
Read the lesson before consulting its [earlier review](../english-review/15-products-and-widths.md).

## Findings and reconciliation

No distinct new clarity issue found. Two earlier low-severity findings remain:

1. **L14, low: the hint leaves its instruction unnamed.**
   [products-and-widths.prose.ts](../../../content/lessons/products-and-widths.prose.ts),
   line 27: **“Its operands are destination, first factor, second factor and value to add.”**
   The preceding hints describe a calculation and a numerical example, without naming
   an instruction. The exercise permits both separate operations and a combined
   operation. A learner asking for help must infer what “Its” refers to before using
   the operand order. Earlier investigation prose does explain the instruction, so
   this is a local referent problem. Direction: identify the instruction described
   by this hint.

2. **L15, low: the test label confuses input width with product width.**
   [products-and-widths.labels.ts](../../../content/lessons/products-and-widths.labels.ts),
   line 86: **“Multiply inputs that also fit in 32 bits”**.
   All inputs in the five `wideCases` are unsigned 32-bit values, as the task says.
   This label does not explain what distinguishes its small-product case. That can
   obscure the lesson's central distinction between the width of the inputs and
   the width needed for their product. Direction: describe the distinguishing
   product width rather than a property shared by all inputs.

These are existing findings, not additions to the course-wide issue count. Neither
blocks the main explanation. No earlier rejected finding for this lesson needs
reopening.

## Understanding and assumed knowledge

The main progression is clear: a narrow multiplication discards high bits; reading
that result through a wider register cannot recover them; widening multiplication
preserves them; the full result depends on the signed or unsigned interpretation.
The before/after conversion distinction is explained beside the relevant C example.
The product-halves diagram visibly supports the explanation in both themes and at
both widths.

No additional untaught prerequisite survived checking:

- The front-page prerequisites cover basic arithmetic and small C functions.
- `meet-the-machine.prose.ts:16` explains GCC and `-O1`; line 55 defines operands.
- `one-pattern-three-readings` teaches hexadecimal, signed readings and unsigned
  readings. `constants-and-widths.prose.ts:72` introduces `long`; that lesson also
  establishes the `w` and `x` views and clearing the upper bits on a `w` write.
- `memory-and-addresses.prose.ts:11,16` explains the compilation target, type sizes
  and little-endian order.
- `loading-widths.prose.ts:14,47` explains sign extension and C casts. This lesson
  explains the particular effect of converting an operand before multiplication.
- The local compiler note explains undefined behaviour. The local question defines
  “product”; generalisation defines the high and low halves. Each new multiplication
  instruction is described where it appears.

The second hints do identify misconceptions about multiplication or discarded
bits. The third hints supply actual smaller numerical examples. I found no
additional occurrence of the misleading hint-category issue M6 here.

## Coverage and evidence

Read the whole `.prose.ts`, `.labels.ts` and lesson configuration, including the
objectives, captions, both prediction explanations, all ten hints, test labels,
compiler note, reflection answer and model-versus-reality note. Read the displayed
functions in `products.listings.ts`, the product diagram strings and the relevant
shared stepper, prediction, editor and grading text. Applied both style passes:
sentence clarity and whether the mechanism is explained and demonstrated.

Inspected the immutable preview at
`http://127.0.0.1:4253/assembly-lab/#/lesson/products-and-widths` with Chromium at
**1280 × 900 and 375 × 900**, each in **light and dark**. In every configuration:

- Opened the details panels and read the initial chapter.
- Checked every option in each of the two predictions and read their feedback.
- Ran both exercises with their starting code and read the resulting test cards.
- Revealed all five hints in each exercise.
- Advanced all seven steppers through their returns and inspected the product-halves
  diagram after unlocking it.
- Inspected screenshots of the chapter, exercises and diagram across the four
  configurations.

This pass did not enter passing exercise solutions or explore arbitrary invalid
assembly. It does not claim exhaustive runtime-diagnostic coverage.

Temporary evidence: `/tmp/clarity2-15.mjs`, rendered text in
`/tmp/clarity2-15-{width}-{theme}.txt`, and screenshots with the same prefix and
suffixes `initial`, `write-scaled-total`, `write-wide-product`, `halves` and `diagram`.
Those local interaction artifacts contain revealed exercise hints; this report
does not reproduce challenge answers.
