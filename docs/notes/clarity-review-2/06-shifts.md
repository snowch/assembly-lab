# Second clarity review: Shifts, and the type that picks one

Reviewed 18 October 2026 against the [review brief](brief.md), `CLAUDE.md` and both passes in `docs/style.md`. Review only. I formed the findings from the lesson and browser before consulting [the first reader report](../english-review/06-shifts.md) and [the earlier ranked findings](../english-review/README.md).

Result: one previously retained medium issue remains; two additional occurrences extend an existing medium issue; one new low issue concerns a figure reference. No new prerequisite gap beyond the retained C-rule issue.

## Retained issue M7: two C rules need a plain explanation

- **Severity:** medium; unchanged from the first review.
- **Location:** `content/lessons/shifts.prose.ts:19`, the closed “What C says” note.
- **Quotation:** “For a negative `int`, the C standard leaves the result of `>>` to the implementation. GCC defines it as an arithmetic shift. For a signed `int`, C leaves some left shifts undefined, a negative value among them. GCC defines them, but this lesson's examples stay within what C defines.”
- **Learner effect:** “the implementation” does not identify an actor for a beginner. Repeated “defines” makes a compiler-specified choice sound like the same kind of rule as an operation for which C supplies no guarantee. “A negative value among them” also attaches a value to a list of operations. The reader cannot reliably tell which warning applies to choosing a compiler and which applies to choosing an input.
- **Direction:** Identify the compiler's role and briefly distinguish these two C guarantees in ordinary language. Attach the negative-input qualification to the operation it affects. Preserve the distinction between C and GCC.
- **Prior-knowledge check:** The prerequisites cover small C functions, `int`/`unsigned`, conditionals, loops, arrays and arithmetic. The earlier lessons explain GCC and its optimisation setting, but do not define these categories of C behaviour. This is M7, not an additional issue.

## Existing issue M6: two more correct-rule hints appear under “Common mistake”

- **Severity:** medium, extending the existing heading/content mismatch; do not count a new issue.
- **Locations:** `content/lessons/shifts.prose.ts:46` (`compareHints[1]`) and `content/lessons/shifts.prose.ts:83` (`pickHints[1]`). Both are rendered under “COMMON MISTAKE”.
- **Quotations:** “`asr` rounds down; C's `/` rounds towards zero; `lsr` fills with zeros, so a negative value becomes a large positive one.” And: “A left shift is the same for both types.”
- **Learner effect:** These are correct rules. The heading can make the learner read the second statement as the mistaken belief they should avoid, directly reversing its purpose. The first similarly supplies the distinction without identifying the error being corrected.
- **Direction:** Make each affected rung identify a mistaken expectation and its correction, or use an appropriate supported heading. Keep the useful rules. Include these occurrences in M6's cross-lesson hint review rather than assigning new identifiers.
- **Browser evidence:** Both ladders were opened to all five hints in all four configurations. `/tmp/clarity2-06-1280-dark-challenge.png` and each matching `*-revealed.txt` record the heading/content pairing.

## New issue 06-N1: “the figure” promises a marking the current figure does not show

- **Severity:** low.
- **Location:** `content/lessons/shifts.prose.ts:30`, explanation revealed after the first prediction.
- **Exact quotation:** “The figure marks the filled top bit in each case.”
- **Learner effect:** The enclosing prediction figure shows one instruction's before/after rows, with changed low bits outlined. It does not mark the filled top bit, and does not draw the other right shift discussed in the paragraph. The learner searches the current figure for two marked cases and can mistake the changed-bit outline for the promised fill marker. The next section has a separate selectable shift figure that does mark filled positions, but this sentence does not identify that destination or the required control change.
- **Direction:** Make the reference accurately describe the figure at this point, or identify the separate investigation figure and how to use it for the comparison. A wording correction can resolve the mismatch without adding another visualisation.
- **Evidence:** `/tmp/clarity2-06-1280-light-prediction.png` shows the complete prediction card; `/tmp/clarity2-06-375-dark-figure.png` shows the sentence and next section boundary. `packages/views/src/interactives/ProbePrediction.tsx` renders `marks={{ changed: differing(...) }}` for the result row. `ShiftFigure.tsx` separately renders `marks={{ fill: ... }}`. The first review does not retain or reject this finding.

## Prior knowledge and clean results

The earlier lessons already supply the terms needed for the main explanation:

- Module 0 identifies GCC as a C compiler and explains `-O1` in its compiler note. It defines operands in its investigation.
- “One pattern, three readings” defines hexadecimal, the top bit, and the signed and unsigned readings. Its explicit explanation that a figure's decimal value is one reading of the bits also supports understanding the unsigned decimal values shown in this lesson's prediction figure.
- “Constants and widths” teaches `movk`, the upper and lower halves and `lsl 16`.
- “Adding and the flags” explains QEMU as a program that imitates Arm processors in its model note.
- “Masks and fields” defines a word, introduces the shift symbols and shows moving a field with `lsl`.

This lesson explains the shift rules, discarded bits, repeated halving, integer division's rounding, and how a shifted operand can be formed without changing its source register. The discussion of adjusting before division covers both odd and even negative values. Those explanations provide the causal steps needed for the exercises. There is no reason to add a new finding merely because the topic is technical.

The earlier rejected suggestion concerning “No result is shown until the word can be read” remains rejected here. Entering invalid text displays “Type a whole number, or a hexadecimal number starting with 0x” immediately before it. That sentence identifies what to change.

## Coverage and evidence

Read all learner text in `shifts.prose.ts`, `shifts.labels.ts` and the lesson structure in `shifts.ts`: objectives, all ten sections, both closed notes, both predictions and explanations, both tasks, field/test/group labels, all ten hints, operation-specific failure feedback, reflection and model note. Read the shared prediction, shift and stepper strings and the actual challenge validation/verdict text shown by the browser. No exercise solution is reproduced in this report.

Used the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/shifts`, with Chromium at **1280 × 900 and 375 × 900, in light and dark colour schemes**. In each configuration:

1. Read the initial page and opened all closed notes.
2. Submitted a deliberately wrong choice for each prediction, exposing both explanations and unlocking both dependent figures.
3. Submitted each challenge empty, then submitted deliberately wrong values, exposing validation and failure feedback; opened all five hints in each ladder.
4. Selected each of `lsl`, `lsr` and `asr` in the shift figure, changed the distance to two places, entered invalid text, then restored a valid negative input.
5. Stepped the negative division call through its return, used Back and Reset, selected the positive call, and stepped its first instruction to expose operand details.
6. Inspected screenshots and full-page text. All four page widths matched the viewport width; light/dark screenshots confirmed the respective presentation.

This was not an exhaustive input test. Passing submissions and every possible shift distance were not exercised. No build or app edit was made.

Temporary evidence outside the repository: `/tmp/clarity2-06.cjs`, `/tmp/clarity2-06-extra.cjs`, and `/tmp/clarity2-06-{1280,375}-{light,dark}-{initial,revealed,invalid,stepped}.txt`; screenshots with the same viewport/theme prefixes and suffixes `figure`, `challenge`, `shift` and `prediction`.
