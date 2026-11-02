# Independent technical and sceptic review

2 November 2026. The reviewer did not draft or implement this change. Review scope:
`feat/bit-weight-readings`, its checked brief, the executable readings/model, the
rendered Module 1 activities, answer gates and sibling readers. Read `AGENTS.md`,
`CLAUDE.md`, `docs/style.md`, `docs/authoring.md` and `docs/sources.md` before review.

Verdict: no remaining blocking finding. Two medium findings were accepted, corrected
and independently verified in the final production build. No instruction-set or
representation error found.

## Accepted findings

1. **Medium: taught comma grouping is rejected in an answer.** The new figure shows
   `4,294,967,295`. In the built Make −3 activity, a correct exercise pattern and its
   correctly grouped unsigned total produce “Tests could not run” and “The answer
   for its unsigned reading must be a whole number written in decimal.” There is no
   instruction beside the field to omit commas. `wholeNumber` only accepts decimal
   digits. This conflicts with CLAUDE's rule to accept taught number notation or
   explain the required format beside the field. Smallest directions: accept valid
   three-digit comma groups, rejecting malformed groups; or add local input-format
   guidance. Correction: `wholeNumber` now accepts optional valid groups of three
   decimal digits while preserving exact BigInt parsing. Independent final-browser
   verification accepted the correctly grouped construction answer and rejected four
   malformed grouping forms in all eight width/theme configurations. The focused
   parser tests also cover signed values, both minus signs and 64-bit precision. Closed.

2. **Medium: Compare row labels become vertical text at 320 px.** In both themes,
   the contribution table gives nearly all its width to the two complete numbers.
   Its inherited `overflow-wrap: anywhere` breaks “Top bit (bit 31)”, “Other 31 bits”
   and “Result” to one character per line. The numeric values are whole, but the
   labels become difficult to read and the table is excessively tall. At 375 px the
   labels remain readable. Preserve readable word/row-label widths and let the
   existing table wrapper carry horizontal scrolling when required. Original evidence:
   `/tmp/bitweights-technical/320-dark-compare.png`. Correction: teaching-table row
   headers now retain a readable minimum width and stay whole; the table scrolls
   inside its wrapper. Independent final-browser verification found readable headers
   at 320 px in both themes, with all rightmost result cells reachable inside the
   scroller. The actual built wrapper has `role="region"`, a meaningful accessible
   name and `tabindex="0"`; a focused 320 px keyboard check confirmed ArrowRight
   moves it. No document overflow occurs. Closed.

## Rejected findings and sceptic decisions

- **Missing set/clear definitions:** rejected. The actual preceding Hexadecimal
  lesson's investigation says, “A bit that is 1 is set, and a bit that is 0 is clear:
  to set a bit is to make it 1, and to clear it is to make it 0.” Confirmed in Chromium
  on the built route, not merely in the unsplit source lesson. The paced lesson
  obtains this paragraph from `READ.investigation.split("\n\n").at(-2)`.
- **A cleared bit has zero weight:** rejected. The compact diagram continues to
  show the signed top weight after that bit is cleared. Its Value row and the
  contribution/result table change independently. The prose distinguishes weight
  from contribution before the figure.
- **The worked all-ones example gives away the exercise:** rejected. Its result is
  separate from the new construction target. Submitting the worked example fails
  the exercise, its failure feedback reports the submitted reading, and the worked
  construction explanation remains absent until the exercise passes. Only the
  final hint discloses the construction answer.
- **Named readings are hidden behind completion:** rejected. Unsigned, Signed and
  Compare are present together on first load. Switching preserves the bits.
- **The diagram must contain all 32 decimal weights:** rejected. The approved brief
  permits the selected-position strip. The full contribution calculation remains
  available, and omitted positions have an accessible label. No invented subtotal
  for the omitted interval is added.
- **The desktop scroll cue is an error:** rejected as a blocker. It is redundant
  when the strip fits, but does not obstruct the activity or alter its reading.
- **Both sums in Show calculation contradict the selected mode:** rejected. The
  optional calculation is explicitly a disclosure; the main strip and result table
  follow the selected view. Essential teaching does not depend on opening it.

The learner review was read after the independent first pass. Its three rejected
candidates were challenged against the actual prerequisite page, the live weight
mechanism and the width measurements. The rejections above agree with that review.
Its absence of findings did not establish the comma-input or 320 px states, which
this technical review tested independently.

## Model, sources and copy

- Checked the primary C23 draft N3096 PDF, section 6.2.6.2 paragraphs 1, 2 and 6.
  Unsigned positions have powers-of-two weights; corresponding lower signed value
  bits keep those values; the signed top bit has the negative weight. Paragraph 6
  names two's complement. These claims apply to the stated 32-bit reading. The page
  does not infer a universal C `int` width or claim signed C overflow wraps.
- `readingsOfPattern` assembles `mov`/`movk`/`ret`, executes the simulator, and reads
  its state. `topBitTable` derives its parts from simulated states. The new helper
  keeps every position, value, weight and contribution distinct. Its contributions
  sum to model readings over corner cases and fixed-seed patterns. The facts tests
  also check all 32 isolated positions, not only the visible strip positions.
- The fresh teaching example executes the unchanged recorded subtraction with
  arguments `[1, 0]`. It yields all ones. The hexadecimal activity explicitly
  overrides that call with the original `FUEL_CALL`, retaining `0xfffffff4`.
  The arithmetic lesson also retains its original subtraction run.
- The construction grader, tests and reference now use the fresh target. It checks
  both the signed target and the unsigned reading of the learner's own bits.
  Initial work fails, the reference passes, and plausible wrong readings are
  rejected without reporting the correct answer.
- The shared weights explanation and revised exercise/caption text are reflected
  in the canonical Module 1, pacing and appendix prose records. No stale old
  exercise ids or titles remain in current content, views or educational tests.
- Assumed knowledge: basic binary place values, decimal notation, C `int` and
  `unsigned` from the course context, hexadecimal, and changing bit buttons. The
  preceding lesson defines set/clear. The changed page locally introduces weight,
  top bit, signed/unsigned reading and two's complement. No additional unexplained
  technical term was accepted as a finding.

## Browser evidence

Served the managing session's production build with a separate Vite preview on
port 4183. HEAD remained `71c1801ae7ae6c2b9882e024b8ff6e3eab23c35c` during the
first browser pass. Inspected real Chromium at 1280, 375, 320 and 600 px, with the
actual rendered `data-theme` checked as both light and dark.

The independent script exercised all three modes; initial all-ones and unsigned
state; bit edits; top-bit clearing; Clear bits; reset of both bits and view; ordinary
reload; scratch independence; the original hexadecimal reader and its input;
wrong-answer rejection; successful construction; saved completion after reload;
Clear work; and all five hint stages. At 1280 px/light it also exercised all 32
single-set-bit patterns and checked both displayed readings. The full calculation
contains all 32 set-bit terms plus its total, opens by keyboard, and keeps every
number whole. It has no clipped term or page-level horizontal overflow.

All eight width/theme combinations completed these checks without a page or console
error. Selected bit, value and weight cell centres align within one CSS pixel.
The top-bit marker's centre delta was zero. The weight strip scrolls inside its
wrapper on phones, with the visible cue. Screenshot inspection, rather than those
passing geometric assertions alone, found the 320 px row-label fault above.

Evidence and scripts: `/tmp/bitweights-technical/`,
`/tmp/bitweights-technical-browser.mjs`, `/tmp/bitweights-technical-browser.log`.
The original script first exited 1 because its exact “Clear work” selector did not
match the completed activity's button. This was a review-harness error, not a product
failure; its log remains `/tmp/bitweights-technical-browser.initial.log`. Changing
that selector to the existing course test's prefix match allowed the complete pass.

The existing `figureOverflow` test helper also treats intentionally scrolled weight
cells as page overflow. On the actual 375 px page, those cells extend to 493 px
inside their contained scroller while document overflow is zero. Its existing
listing exemption establishes the intended distinction. Preserve page/container
bounds checks while allowing the explicitly scrolling reader interiors. The final
helper makes that distinction and adds an explicit document-width check. Four focused
phone educational tests, including initial and used-state layout plus the full sum,
passed against the final build with the updated helper.

## Automated checks and limits

Independent focused Vitest command: readings, teaching reader, update handoff, lesson
facts and lesson rendering/grading. Result: **5 files, 69 tests passed**, exit 0.
After the accepted fixes, an expanded focused run including the three canonical
prose consistency files passed: **8 files, 79 tests**, exit 0. A separate focused
Playwright run on port 4187 passed **4 phone tests**, exit 0. These are focused runs,
not full-suite results.

The new Strict Mode one-shot handoff test restores changed bits and the signed view
together, and resets both afterwards. Handoff was checked in jsdom/source, not by
performing a browser service-worker version update. Ordinary browser reload and
saved challenge restoration were exercised separately.

No full suite or independent GNU/QEMU command was run by this reviewer. The managing
session records full-suite, differential and native-tool results separately. Browser
checks use Chromium touch emulation on phones; they are not physical-device or
assistive-technology testing. The managing session records original full-suite
failures and subsequent reruns separately in `verification.md`.

## Final-build independent verification

The final browser script completed all eight width/theme configurations, exit 0,
after both accepted corrections. It repeated the initial/view/edit/clear/reset,
sibling-reader, original-pattern, calculation, hint, rejection, completion and
restoration checks listed above. It additionally checked correctly grouped decimal
acceptance, malformed grouping rejection, whole row headers, actual focusable named
scroll regions, and access to the rightmost comparison result. No page or console
errors occurred and document horizontal overflow remained zero. At phone widths
the comparison table may require contained scrolling to view its second column;
this is now keyboard accessible as well as touch scrollable.

Final screenshots inspected include 320 px dark Compare, 375 px light Compare and
600 px dark Compare, alongside the first-pass desktop/phone light/dark images.
The compact bit-weight columns and the top-bit marker retain their alignment.
Final evidence: `/tmp/bitweights-technical-final/results.json`,
`/tmp/bitweights-technical-browser.final.mjs`,
`/tmp/bitweights-technical-browser.final.log` and screenshots under
`/tmp/bitweights-technical-final/`. HEAD stayed at the same base commit throughout
these checks; no source was edited by this reviewer.
