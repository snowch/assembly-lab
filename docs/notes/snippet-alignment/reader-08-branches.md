# Independent learner review: lesson 08, branches

Copyright © 2026 Christopher Snow

Reviewed the immutable production preview at
`http://127.0.0.1:4264/assembly-lab/#/lesson/branches` against `CLAUDE.md`,
`docs/style.md` and this directory's `brief.md`. This reader reviewed this one
lesson, assuming only “Before you start” and lessons 00–07. No application or test
files changed. No build or test suite run.

## Finding

### SA08-1 — medium: the expanded stepper separates its controls from the active pair

Page quote, first stepper caption:

> describe(15), one instruction at a time, with a count of the instructions that have run.

Control and status quotes:

> Next

> Ran `cmp w0, 10`. Next: `bgt .L9`.

After committing the prediction through its normal radio and check controls, the
first press of **Next** leaves both the executed instruction and its highlighted
C operation outside the viewport above the controls. At 375 × 900, with the
button at viewport y=428, the executed `cmp` is at y=−721, the next `bgt` at
−689, and its paired C line at −793. At 1280 × 900 the executed instruction is
still above the viewport, at y=−212. These are measured browser coordinates,
rounded to whole pixels, after the ordinary button click.

The status sentence and changed flags remain visible. They identify the machine
step, but the learner cannot see the C/instruction relation that the new figure
is intended to demonstrate while pressing the control. To compare the early
steps with C, the learner repeatedly scrolls up to the pair and back down to
**Next**. The phone layout makes the separation particularly large. The complete
source is collapsible, but the controls remain below the expanded paired rows.

Direction: keep stepping controls and the current C/instruction pair available
together, for example through a compact current-step view or controls that remain
available while inspecting the listing. Preserve the full source, instruction
order and paired rows. This finding concerns interaction layout, not the
correctness of the mapping or execution trace.

Evidence: `/tmp/snippet-reader08-375-viewport-after-next.png` and
`/tmp/snippet-reader08-1280-viewport-after-next.png`; reproduction driver
`/tmp/snippet-reader08-viewport.cjs`. The expanded figures in both themes show the
same structural separation. The viewport measurements above were taken in light
theme.

## What worked

The new explanation is concrete:

> It links `cmn` to `if (gradient < -10)` and `mov w0, -2` to `return -2;`.

The displayed pairings agree. The three-source-line association for `csel` shows
the comparison and both possible result statements together. The complete C
source remains separate and open initially; the repeated excerpts are explained:

> The instructions stay in their original order. A C line appears again when later instructions also relate to it.

The compiler-reference disclosure is closed initially and explicitly distinguishes
its original records from the teaching associations. Opening it shows the retained
references `3, 3, 7, 7, 7, 8, 4, 4`; labels retain their positions. The return row
says “Returns to the code that called this function.” Its association with the
three return statements does not claim that all three paths executed.

Both steppers follow actual branch destinations, skipping the untaken instruction
group and returning to the shared return label. Source highlights follow the
executed instruction's teaching associations, rather than the next instruction's
marker or the raw GCC line. The changed branch in the failure experiment remains
explicit in its caption. The separate branch-path figure retains arrows, visited
labels, skipped-instruction shading and its execution-order strip.

At both tested widths, the C/instruction pairs fit their containers. The desktop
rows align, phone pairs remain together, and captions and return explanations
wrap without overlap. Document scroll width equals viewport width in all four
configurations. No browser page error was observed during the interactions.

## Assumed knowledge and prior findings

No new unexplained prerequisite found in the changed prose or figures.

- “Before you start” explicitly requires `int`, `unsigned`, `return`, `if` and
  `else`; the source here uses those features.
- Lesson 00 defines GCC and listings. Its compiler note says `-O1` “asks GCC to
  make the code shorter and faster”. Its source-matching note explains that GCC
  references “do not always identify the statement an instruction carries out”.
  Thus the new compiler-reference prose is supported before this lesson.
- Lesson 00 explains that `ret` returns control and leaves the result already in
  `w0`; the return-row note relies on that explanation.
- Constants and widths explains the GNU assembler and says “Writing `#` before
  a number is optional.” These are not new prerequisite gaps here.
- Compare and choose explains `cmp`, `cmn`, `csel`, flags and conditions. Its
  investigation states that a condition is a “yes-or-no question about the
  flags”. The new mapping prose can use those names.
- This lesson introduces labels and branches before the prediction, explains
  `wzr` in the opening section, and explains `void` in its optional excerpt note.

The existing low-severity undefined “block” feedback finding, L9, is recorded in
`docs/notes/clarity-review-2/08-branches.md`. That unchanged feedback is outside
the snippet change; it is not counted as a new finding or claimed as freshly
reproduced here. No challenge answers are included in this review.

## Actual browser coverage

Used installed Playwright with Chromium at 1280 × 900 and 375 × 900, each in light
and dark themes, with a fresh page/storage state for each configuration.

- Read the initial page and the complete opening C/instruction figure.
- Confirmed both steppers and the branch-path figure were locked initially.
- Opened the compiler-reference disclosure and checked the retained references.
- Committed both predictions through ordinary controls; no storage seeding.
- Advanced each stepper to its disabled final Next control and recorded each
  executed instruction, next marker and complete-source highlight.
- Inspected the branch-path figure and selected all four offered gradients.
- Inspected screenshots of the paired figures in all four configurations,
  including step highlights and the changed-branch figure, plus representative
  branch-path screenshots at both widths/themes.
- Checked horizontal overflow after those interactions and made additional
  viewport captures after the first step at both widths.

This is a focused snippet review. It did not submit the construction/counting
challenges, exhaust their feedback, test every browser, or rerun earlier lessons
in the browser. Prerequisite checks used their prose and the baseline review.

Evidence files:

- Driver: `/tmp/snippet-reader08-check.cjs`.
- Interaction records: `/tmp/snippet-reader08-check.json`.
- Rendered text: `/tmp/snippet-reader08-{1280,375}-{light,dark}.txt`.
- Screenshots: `/tmp/snippet-reader08-{1280,375}-{light,dark}-{listing,compiler,step-describe,step-describe-bge,arrows}.png`.
- Viewport reproduction and screenshots listed under SA08-1 above.

## Focused checker follow-up: scrolling fix, preview 4265

Checked `http://127.0.0.1:4265/assembly-lab/#/lesson/branches` at the same four
width/theme configurations. **SA08-1 is resolved for the tested interaction.**
After the first ordinary Next click, the phone's current C line is at y=268 and
the executed instruction at y=340; Next is at y=428. At desktop width both C and
instruction are at y=340, with Next at y=428. The pair and controls are now
visible together. The bounded listing scrolls internally when the run reaches a
different instruction group.

Advanced through the whole first stepper, then used Back and Reset. Back restores
the return as the next instruction; Reset restores the initial instruction. The
page's scroll position remains constant through all five Next clicks in each
configuration. Focus stays on Next while it is enabled; on the final click the
button becomes disabled and the browser releases focus to the body. The listing
does not take focus.

At the phone's final shared-return step, all three associated return statements
and the `ret` instruction remain readable with the controls. The first source
line's box begins about 10 pixels above the viewport, so its upper padding and
the group's heading are outside this particular click-centred viewport. This is
a small viewport clipping limitation, not the original repeated-scroll failure;
the source text is readable and remains accessible by scrolling. Desktop shows
the entire return group together.

Opened the original-reference disclosure through its summary and used the mouse
wheel over the listing to bring its actual rows into view. Its eight references
remain intact. Navigated back to the complete-source disclosure and closed and
reopened it normally; the full source is still accessible. Document width still
matches viewport width in all four configurations.

Evidence: `/tmp/snippet-reader08-recheck.cjs`,
`/tmp/snippet-reader08-recheck.json`, `/tmp/snippet-reader08-access.cjs`, and
`/tmp/snippet-reader08-access.json`. Viewport screenshots are
`/tmp/snippet-reader08-recheck-{1280,375}-{light,dark}-{first,return,raw,full}.png`.
Screenshots were captured after ordinary button/disclosure clicks and mouse-wheel
scrolling, without evaluation-based scrolling or forced reveal. Theme setup used
local storage; prediction gates were opened through their visible controls.
This check is limited to the scrolling fix; it does not approve forthcoming
wording changes or repeat the whole original review.

## Final geometry check: preview 4267

Checked the original first-step case and the shared-return case at
`http://127.0.0.1:4267/assembly-lab/#/lesson/branches`, at 375 × 900 and
1280 × 900 in both themes. **SA08-1 remains resolved. The small phone clipping
limitation recorded for 4265 is also resolved in this check.**

After ordinary Next clicks, the first active pair and controls remain visible.
At the final phone return, the current group's three C lines begin at y=33, 65
and 97, and `ret` begins at y=169; Next remains at y=428. The current group heading
is visible as well. The desktop current return group is wholly visible. Other
copies of those source statements can remain outside the viewport without hiding
the current instruction's associated group. The page scroll position stayed
constant between Next clicks in all four configurations.

This was only a geometry follow-up. Full-source and compiler-reference access
were already checked on 4265 and were not retested here. No forced scrolling,
application edits, test edits or full suite runs were used. Evidence:
`/tmp/snippet-reader08-final4267.cjs`, `/tmp/snippet-reader08-final4267.json`, and
`/tmp/snippet-reader08-final4267-{1280,375}-{light,dark}-{first,return}.png`.
