# Flags layout technical review

Independent sceptic and checker review, 13 November 2026. Reviewed the written brief,
`AGENTS.md`, `CLAUDE.md`, `docs/visual-language.md` and `docs/style.md`. The reviewer did
not write the product changes. No product files were changed during this review.

**Final verdict: candidate 2 accepted.** The initial candidate 1 acceptance was
incomplete: an intermediate-width font case was missed. The correction and final
built verification are recorded in the addendum below. The original observations
remain historical evidence for candidate 1.

## Accepted findings and independent verification

1. **Instruction and starting-input label touched.** The baseline has a measured 0px
   gap after the section 06 instruction. The candidate has 20px at every tested width,
   theme and font. The instruction remains visually prominent, and the starting-input
   label clearly belongs to the following input equation.
2. **The range cards use the viewport poorly when the sidebar narrows the content.**
   At 834px, the actual range container is 518.97px wide. The baseline splits this into
   two 254.98px cards and breaks the signed range awkwardly. The candidate uses one
   column there. At 1280px the container is 678px wide and retains two 334.5px cards.
   At 320px and 375px it uses one 244px or 299px column respectively. Every endpoint
   stays in a single unbroken number, including its sign and comma groups. At the
   narrowest width, a line break between endpoints remains readable. No clipping,
   page-level horizontal overflow or font-size reduction was observed.
3. **The shared instruction style also affected the gated follow-up.** The baseline's
   `code.instruction` is inline and overlaps the following paragraph's vertical box
   by 17px at 834px. The candidate is block-level with a 20px clear gap after it and
   16px before it. This holds across the candidate width/theme/font matrix. The
   follow-up remains absent before the practice gate and disappears when a checked
   practice answer is changed.

## Rejected findings and scope decisions

- **Change the sidebar because 05 is active while 06 is visible:** rejected. In both
  baseline and candidate, the visible shared outline highlights 05 while section 06
  starts at approximately 200px or 121px from the viewport top, then highlights 06
  when it reaches approximately 119px or 80px. This matches the shared 120px active
  section threshold. Merely seeing the next heading below the threshold does not
  establish a navigation fault. The retained flags-specific controller has a separate
  160px threshold, but it is not the visible shared outline tested here.
- **The repair must resize a live four-bit `range-pair`:** rejected as stated. Source
  inspection finds one call to `ranges()`, with width 32. The helper accepts width 4,
  but no current rendered call uses it. The actual four-bit sibling is the signed
  range diagram in section 03; it was exercised separately and remains readable.
- **Shrink range text or hide overflowing content:** unnecessary. The candidate keeps
  the existing 15px computed range value size and resolves the space constraint with
  card layout and endpoint grouping.

## Browser evidence

Used installed Playwright and headless Chromium against the built route
`http://localhost:4491/assembly-lab/#/lesson/adding-and-the-flags`, compared with the
baseline at port 4490. Tests used 1000px viewport height.

- Candidate matrix: 320, 375, 834 and 1280px, explicit light and dark, and default,
  Arial and DejaVu Sans font requests. Each combination checked initial, selected,
  committed, restored, reset, follow-up revealed, follow-up restored and follow-up
  invalidated states. That is 192 candidate state observations plus eight baseline
  initial observations. No browser page errors occurred.
- Theme verification checked `html[data-theme]` and the rendered lesson background,
  and screenshots were inspected in both themes. Chrome platform-font inspection
  identifies Noto Sans for the default, Liberation Sans for the Arial request on this
  Linux installation, and DejaVu Sans for that explicit request. This is not a claim
  to have tested proprietary Arial font files.
- All candidate combinations checked complete endpoint boxes, single-line endpoint
  wrappers, instruction spacing and no page overflow. The static four-bit signed
  range diagram's labels stayed inside its range box in another 24 browser cases.
  Screenshots inspected included tablet baseline/candidate, phone and desktop in
  both themes, and the 320px DejaVu Sans case, including the four-bit diagram.
- The prediction gate stayed closed after selection, opened after submission,
  persisted after reload and closed after reset. Arithmetic-column stepping and its
  reset were exercised before reload. Practice completion revealed the follow-up;
  reload retained it and editing an answer closed it.
- In both themes at 834px, baseline and candidate produced identical normalised
  initial page text and follow-up text. Eight corresponding stored-state snapshots
  across commit, step, reset and practice completion were equal after removing
  timestamp fields. The comparison did not print challenge answers into this report.

Reproducible local evidence is in `/workspace/scratch/flags-technical-review.mjs`,
`/workspace/scratch/flags-technical-extras.mjs` and
`/workspace/scratch/flags-technical/`. Both scripts exited 0. Their JSON records and
screenshots are review artifacts, outside the product source.

## Source-only checks and limits

The product diff contains instruction display/spacing, range grid/flex styling and
`bdi` wrappers around the existing computed bounds. The model-derived bounds and
formatting expressions are unchanged. Model arithmetic, state transitions, grading,
storage namespace and learner-facing strings are unchanged in source. No new term
or assumed prerequisite is introduced by this repair.

This review did not independently rerun the whole repository suite or QEMU checks.
The managing session's focused flags suite and strict TypeScript results are recorded
separately in [validation.md](validation.md). Browser coverage here is Chromium;
Safari, Firefox, screen-reader speech and proprietary Arial rendering were not tested.

## Correction and final built verification addendum

The managing session found a missed breakpoint case after the initial review:
candidate 1 paired the cards too early with DejaVu Sans at intermediate tablet
widths. The original endpoint-containment assertion allowed a line break between
the two complete bounds even when cards were paired. It therefore did not establish
that a paired range remained on one line. The initial review's broad acceptance
should not be read as having checked that condition.

Independently reproduced the defect against the preserved candidate 1 at port 4491:
at 920px, the container produced two 295.5px cards, and the signed interval occupied
two lines in both themes with DejaVu Sans. The final change raises the minimum
32-bit card width from 17rem to 20rem; no text, model or state code changed in this
second correction.

Checked the immutable candidate 2 build at
`http://localhost:4492/assembly-lab/#/lesson/adding-and-the-flags` with independent
Playwright scripts:

- 252 layout cases passed: 320/375/834/920/1280px, a 10px sweep from 780 through
  1280px, then every pixel around the observed one-column/two-column transition,
  with default and DejaVu Sans fonts in both actual rendered themes. The themes'
  background colours were asserted as well as their theme attributes.
- Every paired card kept both bounds on one line. Every endpoint stayed unbroken
  and contained. Instruction spacing remained 20px, range text remained 15px and
  page-level horizontal overflow remained zero. No browser page errors occurred.
- At 920px, the corrected range cards stack at the full 600px container width.
  At 968px they still stack in a 648px container. At 969px the container reaches
  649px and produces two 320px cards; both ranges fit on one line, including with
  DejaVu Sans. At 1280px, the two cards remain 334.5px wide.
- Inspected candidate 2 screenshots at 920px and 1280px in both themes with DejaVu
  Sans. The intermediate-width range is readable, and the desktop pairing remains
  balanced.
- Repeated 64 state observations on candidate 2 at 920px and 1280px, default and
  DejaVu Sans, in both themes: initial, selected, committed, restored, reset,
  follow-up revealed, follow-up restored and follow-up invalidated. The gate,
  arithmetic-column step/reset, restoration, instruction spacing and no-overflow
  assertions passed. These checks had no browser page errors.

Both final scripts exited 0. Evidence is retained separately from candidate 1 in
`/workspace/scratch/flags-technical-v2.mjs`,
`/workspace/scratch/flags-technical-v2/`,
`/workspace/scratch/flags-technical-v2-states.mjs` and
`/workspace/scratch/flags-technical-v2-states/`. The original results were not
overwritten. The final verdict is based on candidate 2 and its stronger assertion
that paired ranges occupy one line. The browser and full-suite limitations stated
above still apply.

## Final test-only refinement

Independently reviewed the final geometry-test adjustment: it explicitly applies
DejaVu Sans at 375px as well as 920px and permits stacked intervals to break between
complete bounds. The single-line whole-interval assertion now applies when the
cards' measured positions show they are paired. This reflects the reviewed
behaviour; the existing complete-endpoint, containment, expected-value, 920px
stacking, prediction gate/reset and no-page-overflow assertions remain intact.
The product build at port 4492 did not change.

Ran the exact revised `prediction input spacing` tests from
`tests/educational/flags-lesson.spec.ts` against that immutable build, using both
desktop and phone Playwright projects. All four tests passed, covering both actual
themes and each test's five widths (320/375/834/920/1280px), exit 0. Configuration,
log and any failure-artifact destination are retained under
`/workspace/scratch/flags-technical-final-test*`. This focused verification does
not replace or relabel the managing session's interrupted full-check run; its
interruption and subsequent full rerun are recorded separately.
