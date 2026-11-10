# Floating-point bits: independent learner review

Reviewed 10 November 2026. Reviewer: independent Codex agent, inherited model and effort;
no implementation edits. This is an agent review, not observation of a novice learner.

## Scope and evidence

Browser review was restricted to
`http://localhost:4258/assembly-lab/#/lesson/floating-point-bits`, using real Chromium
through Node and `@playwright/test`. The built page identified commit `fc7b2a8`.
Checked 375 × 812 and 1280 × 800, each with Light and Dark selected. Verified the actual
`html[data-theme]` and body backgrounds: light `rgb(243, 246, 245)` and dark
`rgb(16, 22, 21)`. Inspected initial desktop and binary64 phone/desktop screenshots.

Read-only sources: `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the
local learning-design skill, the lesson's prose/labels/structure, the floating-point
interactive and copy/CSS, the front-page prerequisites, and earlier lesson material
named below. No author brief or review rationale was used to justify the judgement.
Prerequisite lessons were checked in source, not visited in the browser.

The opening prerequisite links visibly name M1, L7, Writing w and x registers, and
M1, L2, Signed and unsigned readings. Source routing confirms their destinations
`register-widths` and `same-bits-two-readings` exist in `pacing-1-4.ts`.

## Findings for sceptic review

### B1 — Medium: the fresh task does not exercise the main field-reading objective

Browser quotes:

> Decode a normal binary32 value and distinguish the reserved exponent states.

> Use the field rules on a new distance.

The only fresh question asks the learner to write a binary fraction from a decimal
distance. It checks the fractional-place preparation. It does not ask for a sign,
stored exponent, bias adjustment, implied leading digit, decoded value from fields,
or a reserved-state distinction. Changing explorer bits supplies the result
immediately, so it is supported exploration rather than an independent application
of those rules.

Effect: a learner can pass the only checked question while still treating the sign
as a two's-complement weight, forgetting the exponent bias, or applying the normal
formula to an all-zero/all-one exponent. These are hypotheses about mistakes, not
observed novice responses.

Direction: retain the short fraction task, then provide a fresh, bounded application
of normal fields and the reserved-state rule, or narrow the stated outcome. An
explanation or comparison should distinguish a correct rule from a plausible wrong
one. Keep its inputs independent from the explorer. No worked assessment answer is
included here.

### B2 — Low: negative powers are assumed at their first use

Browser quote:

> binary32 uses the fixed scale 2⁻¹²⁶.

The page explains fractional places by repeated halving, but does not connect a
negative exponent to that operation. It then uses negative powers for the
subnormal scale and for normal values below one entered in the explorer. The
front-page prerequisites require basic arithmetic and reading small binary numbers,
not negative exponent notation. A source search found earlier powers and calculator
instructions for non-negative powers, but no earlier explanation of negative powers.

Effect: the learner can memorise the displayed special-case scale without knowing
what it does to a magnitude. The repeated-halving preparation is available; the
notation bridge is missing.

Direction: connect one small negative power explicitly to the halving places before
the large negative exponent appears. This need not become a separate activity.

### B3 — Low: retry feedback calls the revealed answer a calculation

Browser quote after a wrong submission:

> Compare your answer with the calculation below, then revise your answer.

Below it, the page lists the relevant positional weights and reveals the expected
binary string. It does not show the string's included weights or a calculation
connecting it to the requested distance.

Effect: the direction promises a worked calculation that is absent, and revision
can become copying the revealed string rather than diagnosing the wrong place.

Direction: either describe the feedback that is actually present, or show the
submitted/expected decomposition after checking. Preserve feedback clearing when
the learner edits. The assessment answer is deliberately omitted from this review.

## Prior knowledge and the teaching route

Supported prior knowledge:

- Binary digits and small unsigned place values: required in the front-page
  prerequisites and practised in the earlier signed/unsigned reading sequence.
- Stored bits versus interpretation, and the top bit's two's-complement weight:
  explicitly defined and practised in M1, L2. The new page clearly says its sign
  encoding differs from two's complement.
- Register widths and hexadecimal patterns: earlier Module 1 material; source
  checked. No new assembly syntax, compiler flag or external tool is required here.
- Positive powers and the caret notation for powers: prior calculator guidance
  explicitly gives `2^8`. The lesson's formula uses this notation, while the
  computed explorer uses superscripts. This difference alone is not a finding.

Additional assumed knowledge not found in that preparation: the meaning of negative
exponents (B2). IEEE 754, exponent, bias, implied leading digit, subnormal, infinity
and NaN receive explanations locally; they are not unexplained prerequisite jargon.

Mechanism coverage:

| Mechanism | Defined | Demonstrated | Practised independently |
| --- | --- | --- | --- |
| Fractional place values | Repeated halving and inclusion of each set place | Small fractions and the initial distance | Fresh fraction-writing question |
| Normalisation | Move the binary point and compensate with scale | Same initial distance in normalised binary form | No fresh normalisation task |
| Normal field decoding | Field sizes, implied 1, bias and formula | Initial fields, decimal result and computed exponent/bias/scale calculation | No; direct manipulation shows its own answer |
| Floating-point sign | Applies to the whole magnitude; differs from two's complement | Named sign-bit action visibly negates the current value | No fresh sign-reading question |
| Reserved exponent states | Zero/subnormal and infinity/NaN rules | Current-state explanation when the reviewer creates those states | No named required state example and no fresh classification task |

The essential route works with “Exact stored value” left closed. It includes the
fraction explanation, normalisation, normal formula, current calculation and all
reserved-state definitions. The exact decimal expansion is optional, appropriately.
However, the essential route defines special states without making the learner
encounter an example of each. This contributes to B1 rather than a separate finding.

A smaller complete first candidate is a distance with only one fractional place
and no binary-point movement. The chosen initial example remains small: it has
few set bits, a terminating fraction and a short positive scale, and it shows why
normalisation matters. The preparation-to-normal-form bridge is visible. Replacing
it or inserting another complete worked example is unnecessary on current evidence.
The missing bridge is from seeing that worked normal value to applying its field
rules independently.

## Density, controls and state: browser observations

The three sections form a readable outline. The normal-value paragraph carries
implied leading 1, bias, a symbolic formula and the integer meaning of the fraction
field together. The nearby computed fields and exponent table keep those facts
available; there is no extra navigation burden. It is denser than the opening
fraction explanation, but I did not find sufficient evidence to require another
section or control. Binary64 adds many bits, but is a named comparison rather than
a new mandatory arithmetic exercise.

All four viewport/theme combinations passed these focused browser checks:

- Initial value and fields appear without opening optional details.
- Applying a decimal with Enter updates the current result. Changing a fraction
  bit updates the value, and changing the sign bit negates the whole magnitude.
- Invalid decimal input gives an associated alert and `aria-invalid`. Applying a
  valid input removes both. After an invalid entry, clicking a bit retains the
  alert because the entry itself remains invalid; the decoded result still updates.
  I do not call that a fault without a clearer requirement about pending entry state.
- Zero, negative zero, both infinities, NaN and a small subnormal display the
  appropriate named kind. Zero/infinity/NaN remove the normal calculation; the
  subnormal calculation uses leading 0. These are observed UI results, not an
  independent numeric-model proof.
- Selecting binary64 produces 64 editable bits. Reset example restores binary32,
  the initial decimal entry and Normal classification.
- Blank submission asks for an answer; an incorrect submission supplies retry
  feedback; a correct submission reports a match. Enter submits. Editing clears
  stale feedback.
- Explorer edits and Reset example preserve the fresh task's prompt and entered
  answer. There is no accidental sharing of example inputs.
- Bit buttons expose bit index, field and value in their accessible names and
  expose pressed state. Inputs/selects have labels. Keyboard Tab reaches Check
  answer, whose actual focus outline is a visible solid 3px outline.
- All measured explorer inputs/selects/buttons are at least 40px high. Phone bit
  button targets are about 36.8px wide × 40px high, separated by the grid gap;
  desktop targets are about 55.9px wide × 40px high. No explorer text measured below
  11px. This meets the repository's stated phone control-height rule.
- The phone grid uses eight bits per row; desktop uses sixteen. Field strings
  wrap inside their cards, including binary64's fraction. Page scroll width equals
  viewport width (375 or 1280); the explorer and its cards have no measured overflow.
  Sign/exponent border styles remain visible in both themes, although they are
  subtle and their meaning relies partly on the adjacent field cards.
- No browser page errors and no rendered figure-error state occurred.

## Limits and decision

Keep the binary-fraction opening, the initial normal example, the live calculation,
the explicit local-calculation note, and the independent answer state. Address B1
before treating completion as evidence of the stated field-reading outcome; B2 and
B3 are small clarity repairs for the sceptic to assess.

Not checked: screen-reader output, touch accuracy with a person, browser zoom,
update/restoration lifecycle, reload persistence, complete cross-browser behaviour,
or full-suite results. No tests were added and no project suite was run for this
read-only review. Numeric-model/source correctness belongs to the separate technical
review. Findings remain proposals until sceptic disposition; any implemented fixes
need an independent check in the final built site.

## Independent verification after correction

Checked the final corrected build after `/tmp/fp-build4.log` reported a successful
build (`built in 10.21s`). The source/runtime edits were made by the managing agent,
not this reviewer. The original findings and observations above remain a record of
the initial page; the disposition below supersedes their open status.

| Item | Disposition | Browser verification |
| --- | --- | --- |
| B1, fresh field application | Accepted and fixed | Initial fresh activity now visibly contains the original fraction question, a normal-field numeric decode, and a reserved-state classification. All are discoverable before submission, with separate labelled controls. |
| B2, negative-power bridge | Accepted and fixed | The opening visibly explains that a negative power reverses doubling, gives two small reciprocal examples, and states that each further step halves the value. It precedes the subnormal scale. |
| B3, feedback wording | Accepted and fixed | Wrong submission now says “Compare your answer with the explanation and computed result below, then revise your answer.” The result and explanation are present. |
| Invalid-entry alert during bit editing | Rejected as a fault | The pending decimal entry remains invalid while the separately edited bits decode successfully; its alert describes that entry. No correctness blocker was established. |
| Smaller initial normal example | No change required | The existing opening and initial example provide the normalisation bridge. The new independent tasks close the assessment gap without adding another worked example. |

Repeated the real Chromium checks at 375 × 812 and 1280 × 800 in each actual rendered
theme, verifying `data-theme` and the computed background again. On all four runs:

- The new initial activity has two empty text inputs and one unselected kind
  selector, with no answer output. Blank submission and both partial-answer states
  ask for completion and reveal no computed answer.
- A complete wrong submission produces retry feedback. Each of the three answers
  was then made wrong individually while the others were correct: all three wrong
  cases produced retry, and all three corrected cases produced the match feedback.
  Editing each control cleared stale feedback. Enter submission from the first
  input still works. No challenge answer is recorded here.
- Applying/Enter, sign and fraction bit edits, invalid input followed by recovery,
  zero, negative zero, both infinities, NaN, subnormal, binary64 and Reset example
  retained the observed behaviour above. The special-state calculation boundary
  remains correct: zero/infinity/NaN have no normal calculation; subnormal uses 0
  for the leading digit.
- Explorer editing and reset preserve all three independent task answers and
  prompts. Binary64 exposes 64 bits; reset restores binary32 and the initial input.
- Phone and desktop page scroll width still equals viewport width. No explorer or
  field-card overflow, no text below 11px in the explorer, no browser page error,
  and no rendered figure-error state occurred.
- All measured explorer controls remain at least 40px high. The new task inputs,
  selector and action measure 45–45.9px high, and fit the phone width. A screenshot
  inspection of the blank activity confirms readable question/control spacing at
  both widths in dark theme.
- The dark Apply value action now computes foreground `rgb(232, 238, 237)` on
  background `rgb(23, 30, 29)`, with a visible border. Light computes foreground
  `rgb(16, 26, 24)` on white. The focus outline remains solid 3px. This reviewer
  checked the bits-page action styles; sibling-module actions belong to their
  respective reviewers.

The existing Exact stored value disclosure stayed closed throughout. All three
accepted fixes are independently verified in the built page. No remaining blocking
learner finding was found in this lesson. Screen-reader testing, novice observation,
cross-browser checks and full-suite results remain outside this focused review.
