<!-- Copyright © 2026 Christopher Snow -->

# English review: Calls, returns and the stack

Review only; no course content changed. Scope: Module 9, lesson 1, `calls-and-returns`, using the front-page prerequisites and preceding lessons only. Read `CLAUDE.md` and both passes of `docs/style.md`.

## Findings

### 1. Medium: “consecutive addresses” obscures the spacing between saved registers

- Location: `content/lessons/calls-and-returns.prose.ts:18`, investigation.
- Exact quote: “then stores the pair of 64-bit registers at consecutive addresses.”
- Effect: The learner has explicitly been taught that consecutive addresses identify consecutive bytes. This sentence naturally suggests that the two register values start one byte apart. It does not distinguish adjacent eight-byte regions from adjacent byte addresses, making the new pair-store instruction harder to follow.
- Previous-definition check: `memory-and-addresses.prose.ts:7` says “Each byte has a numbered location called its **address**. Consecutive addresses identify consecutive bytes.” Its investigation (`:24`) says “The address identifies the first byte”; its explanation (`:48`) introduces eight-byte transfers with `x` registers. The browser's saved-register diagram shows separate eight-byte groups, so the sentence requires the learner to reconcile two different meanings of “consecutive”.
- Direction: Distinguish the consecutive byte regions from the starting addresses of the two saved register values. Make the transfer width explicit in that relationship. No new instruction or exercise solution is needed.

### 2. Low: a hint assumes a size for a stack “slot”

- Location: `content/lessons/calls-and-returns.prose.ts:45`, final exercise, hint 4.
- Exact quote: “Reserve 32 bytes. Use the first pair of slots for `x29` and `x30`, and another slot for `x19`.”
- Effect: “Slot” has not been introduced as a unit of stack space. A learner who opens this hint to work out the layout must supply its size and its relationship to the byte-addressed stack. “First” also assumes an ordering within the reserved space. These are the details the hint is meant to help the learner establish.
- Previous-definition check: Earlier lessons teach bytes, transfer widths and offsets; none defines stack slots. The investigation and browser diagram identify saved registers and individual byte addresses, without introducing a slot unit. The complete-solution hint is later and cannot supply prior knowledge for this hint.
- Direction: Explain the unit and ordering used by “slots”, or connect the guidance directly to the existing byte/offset vocabulary. Keep the hint's current level of assistance.

## Coverage and prerequisites

Read the lesson's complete prose, labels and lesson wiring, and its displayed C/assembly listings and starter code. Coverage includes objectives, all ten sections, both collapsed notes, both prediction questions/options/explanations, both exercise tasks, every hint (five per exercise, including complete-solution hints), test names, failure feedback, reflection/answer, simulator note and model-versus-reality note. Also read shared stack, prediction, editor, stepper and grading strings used here, and the relevant run-registers feedback path. No challenge answer is reproduced in this review.

Prior-knowledge checks used the front page's “Before you start” panel (`apps/course/src/strings.ts`) and preceding lesson prose in course order through `division-and-remainders`. In particular:

- Module 0 defines GCC, listings, operands, arguments, the program counter and returning a result.
- Module 1 defines hexadecimal, `x`/`w` views, upper-bit clearing and optional `#` spelling.
- Module 6 defines byte addresses, load/store widths and little-endian order.
- Module 7's `array-addresses` defines pre-index and post-index addressing (`array-addresses.prose.ts:18`), so the lesson's Module 7 reference is supported.
- Earlier arithmetic and shift lessons support unsigned wrapping and halving by logical right shift.
- This lesson explains caller/callee, link register, stack, stack pointer, frame, frame pointer, alignment, calling convention, inlining and leaf function. Its reference to “live values” follows “values needed afterwards” immediately, so it is understandable in context and is not retained as an unexplained-jargon finding.

The unestablished knowledge retained above is the stack-slot unit. There is no requirement to know later recursion or compiler lessons.

## Browser evidence

Reviewed the existing built route `http://localhost:4220/assembly-lab/#/lesson/calls-and-returns` with headless Chromium at 1280 × 900 and 375 × 900, in explicit light and dark themes. Expanded both lesson details and read the rendered text. Four full-page screenshots and body-text captures are retained outside the repository at `/tmp/english17-{1280,375}-{light,dark}.{png,txt}`. All four screenshots were visually inspected; the wording findings occur at both widths and in both themes.

Additional phone/dark interaction evidence is in `/tmp/english17-states.txt`: checked both predictions with deliberately incorrect choices, opened all ten hints, unlocked the stack figures and ran both starter programs to read feedback. The first starter reports its instruction limit; the second reports register comparisons. The unlocked investigation diagram shows saved values grouped into eight bytes, supporting finding 1. Shared strings/source cover the alternative prediction-match and grading states. Temporary Playwright scripts are `/tmp/english17.cjs` and `/tmp/english17states.cjs`. No rebuild or full test suite was run.
