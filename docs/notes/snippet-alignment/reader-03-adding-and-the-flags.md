# Snippet reader: Adding, and the four flags

<!-- Copyright © 2026 Christopher Snow -->

Independent learner review of lesson 03 only, 18 October 2026. Read `CLAUDE.md`,
`docs/style.md` and this change's brief. Assumed the front-page “Before you start”
and lessons 00–02, without later lessons. Inspected the immutable built preview at
`http://127.0.0.1:4263/assembly-lab/#/lesson/adding-and-the-flags`.

## Result

No new alignment or rendering regression found. This lesson's displayed listings
are assembly-only: the prediction's `plus`, the failure experiment's `sum_flags`,
and the optional “How GCC checks for overflow” code block. Its exported
`ADD_OVERFLOWS` record has C and reviewed metadata, but this page uses the prose
code block rather than mounting that C/assembly record. Consequently there are
no displayed paired C rows, complete-source disclosures or raw-source-reference
disclosures to assess here. Their absence is appropriate; no C associations were
invented for the authored assembly.

The `sum_flags` instruction order, next-instruction arrow and register/flag change
outlines remained clear. The caption, “A register or flag with an outline has just
changed”, matches the figure. Both themes keep instruction text and highlights
legible. At phone width the accompanying “Ran … Next …” status wraps, while the
assembly itself stays readable and on one line. The optional GCC code block fits
at both widths.

## Existing clarity finding, not a regression

- **Severity:** Low; duplicate of C2-03-1 / retained L2 in the earlier clarity review.
- **Quote:** “Had `add` set the flags”.
- **Impact:** Lesson 01 explicitly says, “to set a bit is to make it 1”. The quoted
  sentence instead uses “set” collectively for writing the flags, including zero
  values. The surrounding explanation makes the intent recoverable.
- **Direction:** Keep the previously recommended distinction between writing the
  flag values and setting an individual flag to one. This existing prose issue
  does not block the snippet-alignment change.

Checked `docs/notes/clarity-review-2/03-adding-and-the-flags.md`; do not count this
as a new finding. No further unclear assumption introduced by the changed shared
listing code was found.

## Prerequisites and understanding

The page assumes register names and operand order, function labels and `ret`,
signed and unsigned readings, hexadecimal, bit positions and the `w` width.
These are explained in lessons 00–02. Module 0 also explains GCC and `-O1`.
This lesson defines flag, adder, carry and overflow when they become necessary.
Its optional GCC note identifies the builtin and gives the unfamiliar instruction
pair's purpose; detailed instruction behaviour is explicitly deferred and is not
needed for the exercises. No new unexplained prerequisite found.

The lesson's mechanism remains understandable: the column drawing explains carry,
and the prose connects the final carries to the two range checks. The assembly
stepper demonstrates that an instruction can change its result without updating
the flags. These claims are visible in the figures rather than only asserted.

## Browser checks and limits

Fresh Chromium contexts at 1280 × 900 and 375 × 900, each with light and dark
themes. In all four configurations:

- Confirmed both dependent figures were locked before prediction commitment.
- Submitted a deliberately incorrect choice through each prediction's normal UI,
  then inspected the revealed explanation and unlocked figures.
- Stepped `sum_flags` through its three instructions; inspected the next arrow,
  changed register/flag outlines and returned status.
- Opened the GCC note and displayed all columns in the first adder.
- Read the rendered page text and visually inspected stepper screenshots.
- Confirmed document width equalled viewport width and no page errors occurred.

No challenge completion was needed for the changed listing paths. Challenge
answers, all possible answer-validation branches, persistence and unrelated
challenge-unlocked adder states were not retested in this scoped review. This
report contains no challenge answers. No app or test files were edited.

Temporary evidence:

- `/tmp/snippet-reader03.mjs` and `/tmp/snippet-reader03.json`
- `/tmp/snippet-reader03-{1280,375}-{light,dark}-step.png`
- `/tmp/snippet-reader03-{1280,375}-{light,dark}-gcc.png`
- `/tmp/snippet-reader03-{1280,375}-{light,dark}.txt`
