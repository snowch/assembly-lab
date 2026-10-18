<!-- Copyright © 2026 Christopher Snow -->

# Reader 00: Meet the machine

Independent learner review of the immutable production preview at
`http://127.0.0.1:4263/assembly-lab/#/lesson/meet-the-machine` on 18 October 2026.
Read CLAUDE.md, docs/style.md, the alignment brief, the front-page prerequisites,
the actual page and its surrounding prose. Consulted the previous clarity report
only to distinguish duplicates. This reviewer authored no application change.

## Finding: medium, source crosses a function boundary too early

**Location:** “Removing ret”, the two-function stepper after selecting “Delete the
ret line”.

**Exact page text:** “The run crosses from trip_distance into fuel_used.” The next
outlined function group starts with C line 6, `return total;`, then line 7, `}`,
then the declaration of `fuel_used` at line 9. That block is paired with the
assembly label `fuel_used:`.

**Learner effect:** The new visual grouping puts the end of `trip_distance` inside
`fuel_used`'s box, below the connector saying execution has crossed functions.
The central purpose of this experiment is to distinguish those functions and
explain why removing the return lets execution cross the boundary. The displayed
source grouping now obscures that distinction. The C line numbers and instruction
order remain intact, so this is a presentation error, not an execution error.

**Smallest direction:** Keep trailing source lines belonging to the first function
before its group boundary, even when their corresponding instruction is deleted.
Alternatively, show the complete C separately from these transformed grouped
excerpts so that the grouping cannot assign those lines to the second function.
Do not infer function membership merely from the next instruction that has a
source association.

**Evidence:** `/tmp/snippet00-noret-1280-light.png` and
`/tmp/snippet00-noret-375-dark.png`; the same state was captured in the other two
viewport/theme combinations. No challenge solution is needed to reproduce it:
check any prediction option, select the delete switch and inspect the source
around the group boundary.

## Alignment checks that pass

- The introductory example includes all seven C lines in their original order.
  The signature wraps without breaking the relationship between subsequent C
  statements and instructions.
- The arithmetic and return appear on the matching desktop rows. At 375 pixels,
  each C statement stays directly above its matching instruction. Both themes are
  legible.
- The original references are hidden initially. Opening “Compiler's C line
  references” shows the unchanged `3, 4, 7, 7` tags and explains why compiler
  references can point to a brace.
- After three legitimate Next presses, the subtraction highlights C line 5,
  together with its assembly instruction. The next-instruction arrow remains
  distinct. The raw record still contains line 7.
- Both steppers remain gated until the preceding prediction is checked. The
  removal switch works and stepping follows the remaining instructions.
- “Returns to the code that called this function.” explains return control without
  introducing a return-register concept before the register section. The source
  note separately states that `ret` does not calculate or move the result.
- No page overflow or page errors occurred in the four configurations.

## Prior findings and prerequisite assumptions

The previous caption issue **L3** is resolved: “The highlighted C statement and
instruction show what just ran; the arrow marks the next instruction.” This
identifies the indicators without a light-theme-only colour name.

Previous clarity issues **L1** (prediction timing), shared **L4** (flags in the
simulator note) and **M6** (a correct principle under the common-mistake hint
heading) remain baseline findings in
`../clarity-review-2/00-meet-the-machine.md`; this review does not duplicate them
as new alignment regressions.

Assumed knowledge: small C functions, integer arguments, declarations, assignment,
return, arithmetic, decimal and binary notation. Those are covered by the front
page's prerequisites/readiness example. This lesson introduces GCC as a compiler,
assembly instructions and listings, colon-terminated function names, registers,
operands, the program counter and memory. The optional compiler note explains its
command flags and continuation backslashes. The new source-link labels require
no assembly knowledge beyond the surrounding explanation. No additional new
prerequisite gap was found in the alignment text.

## Actual browser coverage

Chromium through the installed Playwright, 1280×900 and 375×900, light and dark.
Read all ten sections and initial visible captions. Captured introductory listing,
opened raw compiler detail, committed a choice through each real prediction gate,
stepped the main example three instructions, enabled deletion in the experiment
and stepped four instructions. Visually inspected desktop light and dark listings,
phone light listing/raw detail, desktop dark and phone dark highlighted stepper,
and desktop light/phone dark deletion experiment. This was an alignment review,
not an exhaustive challenge-input or editor-mode test.

Script: `/tmp/snippet-reader00.cjs`. Structured layout/highlight/overflow results:
`/tmp/snippet00-review.json`. Rendered initial text:
`/tmp/snippet00-{1280,375}-{light,dark}.txt`. Screenshots:
`/tmp/snippet00-{listing,raw,step,noret}-{1280,375}-{light,dark}.png`.

## Independent checker followup: resolved

Rechecked the final immutable build at
`http://127.0.0.1:4264/assembly-lab/#/lesson/meet-the-machine` in Chromium at
1280×900 and 375×900, light and dark. Repeated the real prediction interactions,
deleted the return and stepped through the crossing in all four configurations.
Visually inspected all four final deletion-experiment screenshots.

The medium finding is **resolved**. “Complete C source” is open by default and
retains all twelve lines, including the first function's return and closing
brace. Below it, the separate instruction groups contain only their associated
source excerpts. The first function's trailing source no longer appears in the
second function's group. The crossing arrow sits between the `trip_distance:` and
`fuel_used:` instruction groups. After the first instruction in the second group
runs, source line 11 is highlighted both in the complete C and in its paired
excerpt, preserving its identity after deletion. The next-instruction arrow is
on the remaining return. The complete source remains visibly available on phone
and desktop in both themes.

The initial simple listing still pairs the subtraction with source line 5 and
keeps the raw `3, 4, 7, 7` references in optional detail. No page overflow or page
errors occurred. No new issue was found in this focused followup.

Final script: `/tmp/snippet-reader00-final.cjs`; measurements:
`/tmp/snippet00-final-review.json`; final screenshots:
`/tmp/snippet00-final-noret-{1280,375}-{light,dark}.png` (plus initial listing,
raw-detail and ordinary-stepper screenshots with the same prefix).
