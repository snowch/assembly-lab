# Memory lesson: fresh recovered-build review

Independent learner/interface review, 12 November 2026. Reviewed the recovered build at
`http://localhost:4440/?style=new#/lesson/memory-and-addresses`, whose footer identifies
commit `bd57219`. This is fresh browser evidence, not a continuation of the lost-workspace
review. I did not author or change the implementation, teaching prose or model.

## Result

No blocking or minor learner/interface finding identified in this lesson. The five rendered
sections, prediction, load/store investigations and store exercise remain available in both
appearances. Navigation does not mark the lesson complete.

The explanation gives the mechanism before the learner uses it: “Each byte has a numbered
location called its address”; “The brackets mean access memory at that address”; and the
lowest-address byte supplies the lowest bits. “Register bits: low → high, left to right”
then makes the byte diagram's order explicit. The store diagram distinguishes the written
bytes from the following bytes, and associates the register bytes with their addresses and
bit ranges. No challenge answer is reproduced here.

## Browser coverage

Headless Chromium/Playwright, independent storage contexts at 375, 834 and 1280 CSS pixels,
1000-pixel viewport height, actual light and dark rendered themes, Current and New. Reduced
motion was enabled and service workers were blocked for these checks. There were no page
errors in the six-context state run.

- Compared matching initial and interactive states in Current/New. The same lesson and editor
  DOM nodes remain mounted. All rendered `.lesson .prose` text remains identical across each
  appearance switch, including unlocked explanation and revealed hints.
- Before commitment, both investigation figures stay gated in either appearance. Selecting an
  option without checking it does not unlock them. Checking an incorrect prediction opens both,
  preserves the chosen option and gives feedback; changing appearance does not recommit or reset it.
- Stepped both load and store. The C statement and executed instruction are highlighted together.
  “Before the first instruction”, “After” the transfer, “Written”, current/next instruction text,
  memory access legends, register byte addresses and bit ranges remain readable in both themes.
  The load marks four read bytes; the store marks four written bytes and four unaccessed bytes.
  Appearance switches preserve the step, register output and access markings.
- All three paired listings keep the complete numbered C beside the instruction pane. Their
  pane tops align; the instruction pane stays to the right. On phones the listing viewport is
  302–317px with a 588px internal track. At 834px New, the stepper viewport is 531px with that
  same contained 588px track. Horizontal scrolling exposes the instruction pane while the page
  stays within the viewport. At 1280px both panes fit in either appearance. Measured visible
  memory address/range labels are at least 11px and have no internal text overflow.
- A failing draft, its failed grading, and two ordered hint rungs survive Current/New switches
  and reload. An ungraded edited draft also survives switching and reload. A passing submission
  keeps its completion result through both styles and reload; editing clears its verdict before
  testing again. The next hint remains the third rung, rather than resetting or skipping ahead.
- Reload restores the checked prediction, revealed hints and saved exercise work, with the
  exercise regraded. Both memory steppers return to the initial step on reload. This matches
  their existing local step state; appearance switches themselves preserve the step.
- Back and Reset restore the initial labels and remove the transfer detail. At return the
  figure says “Final values”, disables Next and removes the previous instruction's memory-access
  marking. Keyboard execution keeps focus on Next and does not move the page.
- Tested all five generated outline links by keyboard in every viewport/theme. The mobile
  disclosure closes after selection. Every link preserves `#/lesson/memory-and-addresses`,
  focuses the corresponding heading and leaves it below the sticky header. Heading tops measured
  155.5–156.5px; header bottoms were 122px on phones and 128px at the wider sizes. A separate
  settled-scroll check confirmed the investigation's active outline item tracks its section.
- No page horizontal overflow in initial, committed, stepped, failed, passing, reset or restored
  states in either appearance. Initial, load and store screenshots were captured for all twelve
  appearance/viewport/theme combinations; selected phone, tablet and desktop screenshots were
  inspected visually, including both themes and both appearances.

## Accepted-fix verification

Freshly checked the three historical shared-shell corrections described in `recovery.md`;
the old verification was not used as evidence for this build:

- The 60px preview toolbar occupies layout space. In New, the app header starts below it and
  the initial lesson heading starts below the header. Focused/scrolled Next controls in both
  investigations and Run tests remain exposed and operable in both styles at all six contexts.
  Screenshots show the memory legends, byte addresses and transfer labels remain usable below
  the sticky shell.
- The opened Style preview help panel stays inside every viewport, including 375px.
- The focused skip link is the topmost hit target at its centre and keyboard activation focuses
  `#main`, at every viewport/theme.

These accepted corrections pass for this lesson. No further correction was requested.

## Prior knowledge and limits

The learner needs the earlier register-width views, hexadecimal notation, numbered C listings,
parameters, return values and ordinary stepping/exercise controls. This page introduces address,
byte, pointer/dereference notation, const, brackets, little-endian order, load/store direction and
void before requiring them. I found no additional unexplained prerequisite in the rendered lesson.
The optional compiler disclosure names the target and C sizes; earlier Module 0 compiler material
was consulted in source for its recorded GCC/`-O1` context, rather than replayed in this review.

Read-only source checks covered the memory lesson data/labels, prediction commitment, stepper
and challenge restoration mechanisms, paired-listing CSS and preview outline logic. The preview
diff has no changes under `content`, `packages` or `platform`. This supports, but does not replace,
the managing review's model and full-suite checks. I did not run QEMU, the standard repository
suite, offline reload, other lessons, screen-reader software, browser zoom or non-Chromium engines.

Ad hoc browser scripts and 36 screenshots are in `/tmp/memory-fresh-review/`, with measured
results in `results.json` and `shell-results.json`; these temporary artifacts are not committed.
The final six-context state run and six-context shell checks passed. Six preliminary ad hoc
runs exited 1 because of harness assumptions: counting nested commitment markers, naming the
unaccessed-byte attribute incorrectly, comparing unlocked text with an initial-state snapshot,
querying hidden mobile links by accessible role, expecting a stepped position after reload, and
expecting an “After ret” label where the page correctly says “Final values”. Those original exits
remain failures of those commands; corrected focused runs establish the results above.
