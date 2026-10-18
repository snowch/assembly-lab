# Clarity review 2: Adding, and the four flags

<!-- Copyright © 2026 Christopher Snow -->

Reviewed 18 October 2026 against `CLAUDE.md`, `docs/style.md` and this review's
[brief](brief.md). Independent learner review of this lesson only. No course
content changed. I formed the finding below before reading the first review.

## Finding: the collective use of “set” conflicts with the taught bit meaning

- **ID:** C2-03-1; duplicate of retained **L2** in the [first review](../english-review/README.md).
- **Severity:** Low. The surrounding explanation makes the intended behaviour recoverable, but this sentence uses a key term inconsistently.
- **Location:** `content/lessons/adding-and-the-flags.prose.ts:70`, the revealed explanation in “Running add instead of adds”.
- **Exact quotation:** “Had `add` set the flags”.
- **Learner impact:** The earlier lesson explicitly teaches “to set a bit is to make it 1” (`one-pattern-three-readings.prose.ts:31`). This lesson then defines a flag as a single bit (`adding-and-the-flags.prose.ts:14`). Here “set the flags” instead means calculate and write all four values, including zero values. A reader applying the taught definition must reinterpret the verb to understand the following sentence. The neighbouring “cleared them” retains its taught meaning, making the shift particularly avoidable.
- **Direction:** Use the lesson's established language for writing or updating the four flag values. Reserve setting an individual flag for making its bit 1.
- **Status:** Still present in the current source and all four rendered configurations. This is an outstanding earlier issue, not a new finding.

## Earlier findings reconciled

The [earlier lesson report](../english-review/03-adding-and-the-flags.md) also
questioned “the signed result does not fit”. The first review's sceptics rejected
that finding. I agree with that decision: the motivation explicitly says, “If the
sum of the two numbers is outside the signed or unsigned range, those bits cannot
represent that sum under that reading.” The prediction explanation then distinguishes
the two readings and the intended arithmetic sum before the figure's shorter
caption appears. The caption does not introduce an invalid-bit-pattern claim. Do
not reopen that rejected issue merely to polish a shorter phrase.

No additional substantive clarity issue found after reading the full lesson and
its rendered interactive states. The explanation gives the carry mechanism in
concrete columns and then connects C and V to the two readings. Its short control
labels are understandable beside the figure.

## Prerequisite and terminology check

Assumed only the front-page prerequisites and the three previous lessons: basic
C functions, arguments and return values; binary/decimal conversion; registers;
`add`, `sub`, `ret`, and operand order; GCC and `-O1`; hexadecimal; bit positions;
signed and unsigned readings and ranges; set/clear; and `w`/`x` widths. These are
provided before this lesson.

Flag, adder, carry and signed overflow are explained here. The optional GCC note
identifies the builtin as a GCC function, explains the function label and states
what the unfamiliar pair of instructions returns, while explicitly deferring
those instructions' detailed operation. A reader does not need their syntax to
do this lesson's work. No further unexplained prerequisite found. The finding
above is a conflicting use of taught vocabulary, not absent prerequisite knowledge.

## Coverage and browser evidence

Read all lesson prose, objectives, headings, labels, captions, prediction options
and explanations, both challenge tasks, ten hints, the follow-up note, both
expandable lesson notes, reflection and model-versus-reality note. Read applicable
shared strings in `strings.ts` and `strings.arith.ts` and the mounted grader paths
in `grader-arith.ts`.

Browser: Chromium through Playwright at
`http://127.0.0.1:4253/assembly-lab/#/lesson/adding-and-the-flags`, with fresh contexts
at **1280 × 900** and **375 × 900**, each in **light and dark** themes. In each of the
four configurations:

- Opened both lesson details and read the shared simulator notes.
- Submitted an incorrect choice to each prediction and read the revealed explanations.
- Used the first adder's next-column, next-group-of-four and show-all controls.
- Submitted the flags challenge blank, then with incorrect choices, then completed it; read the wrong-flag rules and successful status.
- Opened the unlocked follow-up adder and displayed all columns.
- Stepped the failure experiment through every instruction.
- Submitted the numerical challenge blank, below the threshold, above the minimum and successfully; read its validation and failure messages.
- Opened all five hints in both challenges.

Read the rendered whole-page text and visually inspected the finding's explanation
capture in all four configurations. Document width equalled viewport width in all
four; wrapping did not create a further wording problem. This was a prose review,
not exhaustive functional or accessibility testing. Other arbitrary invalid input
branches, reset/persistence and all possible prediction choices were not exercised.

Temporary evidence outside the repository:

- `/tmp/clarity2-03.mjs`: browser interaction script.
- `/tmp/clarity2-03-browser.json`: viewport/theme/width and wrong-feedback observations.
- `/tmp/clarity2-03-{1280,375}-{light,dark}.txt`: whole rendered text after the interactions.
- `/tmp/clarity2-03-{1280,375}-{light,dark}.png`: the explanation containing the finding.

No challenge answers are included in this report. No build, app edit or commit was
performed.
