# Arithmetic with four bits: learning-design brief

## Outcome and placement

Before Arithmetic on register bits, the learner can construct a fixed-width subtraction by
inverting the second input, adding one, adding that pattern to the first input and retaining
the available bits. They explain what happens to an extra leftmost carry. Carry flags,
signed overflow flags, actual hardware implementation and C overflow rules remain later topics.

This is a named Module 1 lesson, after Signed and unsigned readings and before Arithmetic on
register bits. It uses four-bit mathematical examples, explicitly not four-bit Arm registers.
Required content is visible in order, not hidden in tabs, presets or the optional appendix.

## Preparation and observations

Read the Fundamentals operand lessons, published pacing-1-4 sequence, readings lesson, optional
two's-complement appendix and Module 2 subtraction prose. Browser-inspected the existing fuel
lesson at 375px: the first figure starts before subtraction, then displays the result bits; it
never derives them. Its next prediction asks about adding 12. Earlier readings work practises
interpretation, not arithmetic columns. The existing appendix defines negation but is optional.
The user identified the missing preparation; no beginner study has been conducted.

Prerequisites: binary positional weights (front-page requirement and Reading the bits), signed
and unsigned interpretation (previous lesson), and addition/subtraction operands (Fundamentals).
No knowledge of binary carrying or inversion is assumed. Define these before use. Four-bit
weights are 8,4,2,1 unsigned and -8,4,2,1 signed; range -8..7. Signed examples chosen here fit.

## Checked facts and route

Source: machine/run.ts addWithCarry and arithmetic execution, views/arith.ts columnWork,
views/complement.ts and its exhaustive existing tests. Node executed the actual machine on
4 November 2026 for the following rows; the miniature keeps its low four bits.

| Calculation | Full unsigned addition where applicable | Low four bits | Signed four-bit reading |
| --- | --- | --- | --- |
| 3 + 1 | 4 | 0100 | 4 |
| 15 + 1 | 16 (10000) | 0000 | 0 |
| 0 - 5 | 32-bit SUB result 4294967291 | 1011 | -5 |
| 3 + 11 | 14 | 1110 | -2 |
| 3 - 5 | 32-bit SUB result 4294967294 | 1110 | -2 |
| 6 + 13 | 19 (10011) | 0011 | 3 |
| 6 - 3 | 3 | 0011 | 3 |

1. Addition: each column adds the two input bits and incoming carry; write the low bit and pass
   the other bit left. Define 1+1 = binary10, and 1+1+1 = binary11. Work 0011 + 0001 with a
   four-column figure. Controls reveal calculations, not separate processor instructions.
2. Width: a compact complete figure for 1111 + 0001 = 10000 marks the extra leftmost 1 as
   outside four places. Retain 0000. This example uses unsigned inputs/readings.
3. Negation and subtraction: demonstrate 0101 (5) -> 1010 (invert) -> 1011 (+1, signed -5).
   Explain why: original plus inverted is 1111; adding one makes 10000 whose low four bits are
   zero. Thus the new pattern acts as the opposite when that signed value fits. Then show
   0011 + 1011 = 1110, read as -8+4+2 = -2. All essential stages visible. No C or assembly listing
   for this mathematical miniature, no invented compiler claims.
4. Fresh application 6 - 3, starting 0110 and 0011. Ask for the opposite pattern of the second
   input and retained result; ask what to do with an extra carry. Blank independent exercise,
   model-graded reference, specific feedback, five graduated hints. No worked answer elsewhere.
5. Bridge in the existing next lesson: same rule with 32 places; SUB does this bit calculation
   as one instruction. Keep detailed carry/borrow flags in Module 2; add only a short local
   acknowledgement there rather than remove useful 32-bit examples.

## Misconceptions and evidence

Hypotheses: inversion alone is negation; the top bit is a separate sign; an extra carry enlarges
the register; subtraction creates different bits depending on signed interpretation. Worked
negation shows the added one. Fresh exercise distinguishes inversion-only from inversion-plus-one
and asks for the width rule explicitly. Later fuel comparison retains the interpretation check.

Success evidence is a correct fresh transformation and retained pattern plus a correct reason
for discarding the carry, not completion clicks. Agent/browser review establishes correctness and
usability, not learning effectiveness. A future novice test should record first attempt, reasoning
and any help separately, then ask for another unseen subtraction without coaching.

## Implementation and review plan

Reuse machine addition records and columnWork, fourBitReadings/fourBitNegation, existing challenge
form and theme tokens. Three small computed figures replace mental bookkeeping: four aligned
columns with carries, width boundary, and inversion-to-addition flow. No free-form sandbox needed.
Separate drafting agent produces learner prose and figure labels; implementation and copy receive
independent learner and technical reviews. Verify new lesson discovery/navigation, columns and
Reset, blank/wrong/correct exercise, persistence, no answer leakage, phone/desktop and both actual
themes. Automated checks include all 256 pairs for addition/subtraction against model state and
independent modulo arithmetic, plus column recurrences. No platform/ edits.
