# Independent learner review: production carry and architecture integration

Reviewed 2026-11-06, after the approved standalone mockups were implemented. The
reviewer authored neither product code nor learner copy. This is an expert
walkthrough using the learning-design skill, not evidence from novice participants.
See brief.md for the review questions and technical-review.md for model evidence.

## Verdict

Both integrations are ready from this learner review. The accepted selected-button
dark-hover defect is fixed and independently rechecked on the rebuilt Assembly
assets. No open instructional blocker remains.

## What the actual course now teaches

Assembly Lab M1 L3 first demonstrates 3 + 3 with four places. The second column
now necessarily contains both operand ones and incoming carry one, so the original
question is addressed on the named worked route, rather than depending on a reader
inventing a special input. The two outputs are separate: 1 stays in the column,
1 continues left. Existing width, subtraction and 6 − 3 practice remain in order.
The final architecture section is a generalisation after that practice: it connects
one actual 32-bit ADD, its two register reads, and destination write. Its enlarged
four positions explicitly belong to the same 32-bit sum; bit 3's carry goes to bit
4. This is a different learning purpose from another four-bit arithmetic exercise.

Bit Lab L3 supplies the hardware abstraction that Assembly deliberately omits:
three full-adder inputs, two outputs, the word's linked columns, and a gate
construction with locally defined XOR, AND and OR. The 3 + 3 default makes the
three-one case immediately visible after Reveal. In L7 the same detail is reused
only for ADD and SUB beneath the existing ALU, rather than replacing the other
operations or presenting another whole ALU. The existing 7 + 1 overflow case
remains a named investigation preset. Both courses qualify the diagrams as
functional explanations, without making a physical timing/layout claim.

Required mechanism is visible in the ordinary revealed route. The gate picture's
five equations remain visible as a textual alternative. Definitions and the wire
junction/crossing convention are local. The specific cross-course link supports
additional depth without making Bit Lab an undeclared Assembly prerequisite.

## Initial finding and accepted correction

**Definition before use, moderate, Bit Lab L3.** In the first implementation's
source order, the five XOR/AND/OR proof rows came before the paragraph defining
those operators, especially misleading in the phone's stacked layout. Earlier
L1/L2 do not establish these operators. The engineer moved the existing guide
before the working/proof grid and removed its later duplicate. On the corrected
actual build, independent browser checks confirmed definition-before-proof DOM
order at 375/700/1280 light and 375/1280 dark. Screenshots confirm the definitions
are readable before the first formulas on phones. This finding is closed.

**Selected-column label, moderate, Assembly.** Hovering the selected bit button
in dark mode replaced the accent background with the page's near-black hover
background while retaining near-black accent text. The label became unreadable.
The parent accepted a scoped selected-hover correction. The original observed
colors and screenshot are in technical-review.md. Final independent rebuilt checks at 375/700/1280 in both themes confirm a readable
selected label in idle and hover states. This finding is closed.

## Consumption and limits

The built pages keep input, execution and register moment distinct; Back and Reset
have explicit meanings. All four inspectable columns fit on a phone. Architecture
panels stack before their diagrams or labels become cramped. The actual 32-bit
result is present alongside the cropped detail, avoiding a false four-bit boundary.

The larger ALU lesson necessarily remains longer than L3, but the new focused detail
has a coherent job beneath the existing result/flags, and the required gate
explanation is not hidden in an optional accordion. No new lesson or gate truth-table
exercise is needed for this change.

The existing subtraction practice provides fresh application of the arithmetic
method, but it is not a diagnostic assessment of all three-input full-adder cases.
Revealing a worked example is not evidence of learning. The offered controls and
independent all-eight-case checks establish accurate exploration, not demonstrated
novice mastery. No new quiz is required to implement the approved scope; a future
learning study could test whether the three-one distinction transfers unprompted.
