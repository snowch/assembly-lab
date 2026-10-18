# Independent review of source associations and rendering

Reviewed 18 October 2026 against `brief.md` and `CLAUDE.md`. The reviewer did not
write the metadata plumbing or renderer. This is a source and rendered-component
review; the production-browser reader reports cover dimensions, themes and actual
visual alignment.

## Finding and correction

- **Medium, accessibility:** `ListingCompare` introduced a
  `.al-source-connections` disclosure, but its summary did not receive the minimum
  height and keyboard-focus treatment added for the other new disclosures. Added
  it to the existing 44-pixel and focus-visible selectors in `views.css`. No
  learner wording changed. The managing session must independently check this
  small reviewer-authored correction in the browser.

- **Medium, source grouping, found by a browser reader:** deleting the first
  function's return leaves an unmapped gap in the displayed C. The inline layout
  attaches that gap to the next label, putting the first function's return and
  closing brace inside the second function's box. The initial technical review
  missed this source-context defect even though instruction identity and order
  remained correct. The managing session is correcting it; the follow-up below
  records independent verification.

## Checks

- `parseListing` attaches source associations per instruction, excluding labels.
  `programLines` carries both the original compiler reference and the teaching
  association. Neither instruction text nor assembly order is replaced by the
  new metadata. A positional map with the wrong length throws rather than shifting
  associations silently.
- `traceOf` parses metadata before deleting an instruction, so its neighbours keep
  their own associations. Assembly and machine execution still use the instruction
  text. The existing raw `viewAt().litC` result remains separate from the renderer's
  teaching highlight.
- `RecordedSchema` preserves readonly associations through figure parsing.
  Reviewed all `ListingView` call sites: recorded C-backed programs reach it through
  `programLines`, `traceOf`, or the metadata-aware `traceText` path. Editable assembly
  and deliberately assembly-only views retain their existing paths.
- `recordedC` derives associations from the local compiler's actual `lineMap` on
  each compilation. It does not reuse a recorded map after an edit. The optional
  remote compiler response remains raw output.
- `sourceLayout` preserves original indexes and label boundaries. It combines only
  adjacent instructions with identical associations. Simple ordered spans retain
  the complete C once, including signature and braces. Reordered, repeated,
  nonconsecutive or unmapped operations use excerpts and retain the complete C in
  an initially open disclosure. No runtime guess converts a brace reference into
  an operation.
- The aligned renderer highlights the C lines associated with the instruction that
  ran, including multi-line associations. It preserves the next-instruction marker,
  function groups, stop/crossing markers, and return-control notes. The raw compiler
  references appear in a separate initially closed disclosure with distinct DOM
  classes, so they do not double instruction rows in selectors.
- `ListingPairFigure` preserves its original positional/LCS comparison policy and
  passes differences by original listing index. Difference text remains available
  to assistive technology. `ListingCompare` keeps both assembly and the added
  source-connections disclosure behind the committed prediction. Merely selecting
  an option does not reveal them.
- Paired row cells share one grid row, so wrapping cannot advance only one column.
  The container query uses the listing's width, including narrow comparison sides.
  Source and instruction cells have group labels; phone labels identify each
  excerpt. Disclosure keyboard focus and target sizing are specified in CSS.
- The content coverage test checks all 74 distinct used C-backed programs for a
  complete, sorted, in-range association map and unchanged parsed compiler records.
  Mapping semantics themselves are independently covered by `mapping-review.md`.
  `platform/` is not changed by this work.

## Verification

Added `packages/views/src/source-renderer.test.tsx` with independent rendered checks
for schema transport, semantic versus raw highlighting, full source and assembly
order in complex layouts, multi-line highlights, accessible difference text,
explicitly hidden C, and the comparison prediction gate.

Ran the new renderer tests, source-layout tests, source-links tests and content
coverage tests: **90 tests passed in four files**. Log:
`/tmp/snippet-independent-technical-tests.log`.

Strict TypeScript, scoped Prettier and `git diff --check` passed. Browser readers and the full course
suite remain the separate production verification; this report does not claim
that a jsdom render establishes physical alignment, touch size or theme contrast.

Also reviewed the managing session's assertion changes in `module3.test.tsx`,
`branches.paths.facts.test.ts`, and the educational tests for
`meet-the-machine`, `shifts`, `constants-and-widths`, `module-4` and `module-10`.
They scope primary listing nodes separately from hidden compiler details, retain
original raw-tag checks, and test the new semantic highlight. The local compiler
checks correctly allow a source line to appear in both complete source and an
excerpt, then require that it is lit in the actual instruction's paired row.
The introductory browser test now measures each source/instruction pair's position.
No protection was removed merely to accommodate the new structure. Updated one
stale test comment that still called the displayed highlight a GCC reference.


## Follow-up: source boundaries after deletion

Independently reviewed the managing session's correction: multiple assembly labels
now select excerpts with separate complete source. The renderer does not guess
which function owns unlinked C lines, and no instruction order or association is
changed. This conservative fallback also applies to multiple labels in one
function; retaining full source makes that acceptable.

Added a rendered regression using the actual `TRIP_DISTANCE_AND_FUEL_USED` after
removing its first `ret`. It verifies that C lines 6 and 7 do not appear in the
`fuel_used` box, full C remains available, all surviving instructions retain their
order, and the crossing and next-instruction markers remain. The four-file suite
passed again: 90 tests. The source-grouping finding is corrected in source and
rendered-component checks; the original browser reader must verify the new build.

Also reviewed the new source-association rule in `docs/authoring.md`: it matches the
implemented schema, deletion ordering and separate coverage/semantic-review roles.
The final shifts test selector now requires an actual C line before checking the
C cell's visibility, avoiding an intentionally empty label cell on phones.

## Follow-up: keep stepping controls beside long listings

Reviewed the bounded scrolling region in `parts.tsx` and `views.css`. Only aligned
listings with a current or next instruction become bounded keyboard regions.
Static listings retain their complete height. The effect selects the whole paired
row when it fits, otherwise the active instruction, and changes only the listing's
`scrollTop`. It does not call page scrolling or move focus. The region has an
accessible name, tab stop, focus-visible outline and a viewport-relative maximum
height. Instruction order, associations and prediction gates are unchanged.

Added two component regressions with explicit layout geometry, covering a fitting
pair and an oversized pair. They require the correct scrolling target, preserved
button focus, and no window-scroll call. Supplemental source suites: **92 tests
passed in four files**. The initial strict check caught missing explicit `this`
types in the test mocks; those annotations were corrected and the strict rerun is
recorded in `/tmp/snippet-scroll-technical-types.log`.

Independently checked the production build on port 4265 in Chromium, at 1280 and
375 pixels, light and dark. Across 28 measured steps of the counting-down loop,
the active instruction and every pair small enough to fit remained inside the
scrolling region; Next remained visible and retained focus. Keyboard Home scrolled
the region while the page stayed still, with a visible focus outline. No page
errors or horizontal overflow. Viewed desktop-light and phone-dark screenshots to
confirm the visible relation between instructions and controls. One first
phone-light Playwright click adjusted page position by 47 pixels; the remaining
27 clicks did not. This did not hide the active pair or controls. Evidence:
`/tmp/snippet-scroll-technical-browser.json` and
`/tmp/snippet-scroll-{1280,375}-{light,dark}.png`.

The introductory alignment assertion now reads both cell rectangles in one
synchronous browser evaluation. This correctly tests their relative geometry
without mixing measurements from before and after a page layout change, and
retains the alignment requirements.

## Final follow-up: several source statements for one instruction

Independently reviewed the separately drafted `multiSourceNote`, the conditional
rendering and the two renderer assertions. The wording is technically sound: it
covers both combined operations (`DIM_DOWN`'s decrement and condition) and
alternative paths (`LABEL_LENGTH`'s zero-capacity initialisation or exhausted
capacity result). It explicitly prevents interpreting every highlighted statement
as executed at that step. The sentences use the existing course terms and plain
English; no additional rewrite is needed.

The condition checks original instruction associations for more than one line,
not the source rows that the layout produces. Consequently signature/brace filler
and repeated single-line excerpts do not trigger the note. It works for both
inline and excerpt layouts and remains within the aligned-view branch. The root's
assertions verify absence for single-line associations and presence for a true
multi-line association. No instruction, highlight association, execution result or
prediction gate changes. The final production-page check belongs to reader 14.
The final seven rendered-component tests passed again; log:
`/tmp/snippet-multi-source-technical-tests.log`.

## Final geometry follow-up: a listing partly outside the browser viewport

A later browser check found a case the first scrolling review did not cover: the
listing's top could be above the browser viewport after Reset or a slider change.
An instruction inside the listing's own scroll bounds could therefore still be
outside the visible page. Independently reviewed the managing session's correction
in `parts.tsx`: scrolling now uses the intersection of the listing and browser
viewports, and selects the full pair only when it fits that visible height. A
wholly offscreen region is left untouched. It still changes only the region's
scroll position, without focusing anything or requesting page scrolling.

The arithmetic is correct for clipping at either end. The managing session inserted
four independently drafted regressions after the full unit run completed: a fitting
row clipped at the top, a row larger than the visible intersection, clipping at the
bottom, and a wholly offscreen region. Independently compared the applied test block
with `/tmp/snippet-visible-regression.txt` after formatting both with the repository's
Prettier configuration: they match exactly. No test logic changed during insertion.

Verified the recorded results: the full unit run passed **2,730 tests in 136 files**;
the four source suites, including the new regressions, then passed **96 tests in four
files**. The managing session confirmed exit zero for the final strict TypeScript
check; its log is empty. Logs: `/tmp/snippet-complete-unit.log`,
`/tmp/snippet-intersection-tests.log`, and `/tmp/snippet-intersection-types.log`.

Checked the original reader reports for branches, counting down and recursive
calls: their final port-4267 checks close the reported Reset/slider visibility
occurrences at both widths and in both themes. These browser checks supplement
the frozen port-4266 full browser suite, which was still running when this review
was updated. No application change was made during this final verification.

## Final browser assertion review: subpixel table position

Independently reviewed the single failure from the completed full browser run and
the managing session's test-only correction in
`tests/educational/one-pattern-three-readings.spec.ts`. The failure changed only
phone-table y from 559.140625 to 558.890625 CSS pixels: a quarter pixel. Its x,
width and height were identical. The test's purpose is to prevent opening the
calculation from moving or resizing the existing reading table.

The correction retains exact width and height checks, checks both boxes exist,
and allows strictly less than one CSS pixel of x or y movement. Keyboard opening,
calculation visibility, overflow and keyboard closing assertions remain intact.
This is an appropriately narrow rendering tolerance, not removal of the layout
check: a movement of one pixel or more still fails, and any resizing still fails.
The observed difference is consistent with subpixel scroll/layout rounding; the
failure alone does not establish its exact browser cause. No application code
changed for this result.

Verified logs: the full browser run had **1,020 passed, 23 skipped and this one
failure** (`/tmp/snippet-complete-browser.log`). The corrected test then passed at
both desktop and phone widths: **2 passed**
(`/tmp/snippet-rounding-retest.log`). This records a completed suite followed by
the targeted correction check, rather than claiming the entire suite was rerun.
