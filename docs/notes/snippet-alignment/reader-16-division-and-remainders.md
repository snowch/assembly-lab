# Reader 16: Division and remainders

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 against `CLAUDE.md`, `docs/style.md` and the
[alignment brief](brief.md). Learner position: Before you start and lessons
00–15 only. No course code, tests or challenge solutions changed.

## Result

No new alignment finding. The C operations and instruction groups explain the
one-to-many relation clearly, including the optimized division-by-ten example.
The focused 4265 check supports the shared R08 fix for this lesson; it does not
claim to settle R08 for other lessons.

- “return total % count;” appears once beside the complete `sdiv`, `msub`, `ret`
  group. The surrounding prose explains the quotient and multiply/subtract
  stages. Stepping each instruction highlights C line 3, rather than moving the
  teaching highlight to the closing brace.
- “return pulses / 10;” accompanies all five recorded instructions. The preceding
  explanation says GCC replaces division by ten with a multiplication and shift,
  so the initial constant-building instructions do not imply extra C statements.
  The highlight stays on the same expression throughout the run.
- “Returns to the code that called this function.” distinguishes `ret`'s role
  within the return-expression group. Function declarations, braces, labels and
  original instruction order remain available.
- “Compiler's C line references” opens details which explicitly say the records
  may point to a brace. Quotient records retain 4/4, remainder records retain
  3/4/4, and division-by-ten records retain 3/3/3/4/4. Normal highlighting uses
  line 3 in each case. This distinction is understandable without assuming that
  compiler debug references are the semantic explanation.
- The changed remainder and exceptional-division experiments remain
  assembly-only. They acquire no invented C rows or C highlights.

## Existing findings, not new issues

**R08 — medium, shared tall-stepper issue.** The direction already under repair
is to keep the active pair near the controls with bounded scrolling. On 4265,
“Follow GCC’s recorded division-by-ten sequence.” now shows its active C line,
active instruction, and Next together after each of all five steps, at both
widths and in both themes. The 375 px listing has a 495 px viewport over 605 px
of content. The function header is accessible at its top; its closing brace and
compiler details are accessible by scrolling down. Desktop content fits without
internal scrolling. The page position stays stable through the run, apart from
one pixel of layout rounding in one phone configuration. This is evidence for
R08's fix, not a new finding or a claim about longer examples elsewhere.

**M5 — medium, prior clarity review.** The unchanged sentence “For a 64-bit
division, also ensure the divisor is a 64-bit unsigned value: writing `w1` clears
the upper half of `x1`.” retains the previously reported distinction between
specified narrow incoming values and an executed narrow write. Direction remains
to explain the incoming guarantee. This is recorded in
[the prior reader report](../clarity-review-2/16-division-and-remainders.md), not
created by the new alignment. The present focused review did not rerun final
challenge tests.

The prior report's **M6** hint-heading occurrence is also separate. Hints were
not reopened in this review; it is not counted as new evidence.

## Assumptions and surrounding prose

Before you start supplies simple `int`/`unsigned` functions and `return`.
Module 0 explains GCC, listings, `-O1`, and the distinction between the semantic
operation and compiler line references. Constants and widths explains `movk`
and its half-word shift; Shifts explains `lsr`; Products and widths explains
`umull` and `msub`. Division vocabulary and `/`/`%` meanings are defined in this
lesson. The new labels “C operations”, “C line” and the compiler-details
explanation introduce no further unexplained prerequisite. No new assumed
knowledge finding survived those checks. M5 remains the existing exception.

The full C functions appear directly in these monotonic examples; a separate
“Complete C source” disclosure is unnecessary here. On the phone the wrapped
function signature stays with its braces and label, and the operation is followed
by its full instruction group. No orphaned pair or horizontal overflow was seen.

## Actual browser coverage and evidence

Used installed Playwright/Chromium with real screenshots at 1280 × 900 and
375 × 900, light and dark.

On immutable `http://127.0.0.1:4264/assembly-lab/#/lesson/division-and-remainders`:

- Confirmed eight locked dependent figures before submitting either prediction.
- Chose and submitted the first displayed option for each prediction through the
  visible controls. No storage seed or hidden state modification bypassed gates.
- Stepped all seven steppers to return in every configuration, recording executed
  instruction and C-highlight states; reset each and stepped again for screenshots.
- Opened compiler-reference details, read complete rendered lesson text, and
  inspected quotient, remainder, optimized-division and assembly-only images.
- Document width equalled viewport width in all four configurations. No listing
  overflow or browser page error was recorded.

On immutable `http://127.0.0.1:4265/assembly-lab/#/lesson/division-and-remainders`:

- Repeated legitimate first-prediction submission and every step of the
  division-by-ten example in all four configurations.
- Inspected actual viewport screenshots after the first and final steps, measured
  active C/instruction/control positions, and checked source access at the top.
- On both phone themes, scrolled to the closing brace, opened compiler details,
  and scrolled to their contents. These remain accessible inside the bounded area.

The 4265 follow-up covers the bounded-stepper change; the full lesson interaction
and no-error/no-overflow measurements belong to 4264. No rebuild or full suite was
run. Challenge answers are intentionally absent from this report.

Temporary evidence:

- `/tmp/snippet-reader16.mjs`; `/tmp/snippet-reader16-{1280,375}-{light,dark}.{txt,json}`.
- `/tmp/snippet-reader16-{1280,375}-{light,dark}-{initial,step-signed-remainder,step-divide-ten,step-division-zero,ten-details}.png`.
- `/tmp/snippet-reader16-4265.mjs`; `/tmp/snippet-reader16-4265-{1280,375}-{light,dark}.json`.
- `/tmp/snippet-reader16-4265-{1280,375}-{light,dark}-{next1,next5,source}.png`.
- `/tmp/snippet-reader16-bottom.mjs`; `/tmp/snippet-reader16-4265-375-{light,dark}-bottom.png`.
