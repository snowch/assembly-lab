# Final built-page fix check: Modules 10–11 and optional A

Checked independently on 18 October 2026. This checker did not draft the lessons or
implement the fixes. Read `CLAUDE.md`, `docs/style.md` and the five independent
reader reviews. Tested the immutable production build at
`http://localhost:4205/assembly-lab/`; did not rebuild or edit production source.

## Verdict

The requested fixes work in the built pages at 1280 × 800 and 375 × 812, each in
light and dark themes. No JavaScript page exceptions occurred. The tested phone
pages fit their viewport. Focused screenshots were inspected visually as well as
checked through the DOM. One additional static-figure badge inconsistency
was found and then independently confirmed fixed in the final 4207 snapshot.

## Confirmed fixes

- **C statement editing:** selecting the existing declaration loads its statement
  type, target, operands and multiplication operator. Changing the operation shows
  the exact replacement before the explicitly labelled replacement action. Applying
  it changes only that source line. A compound expression that these controls
  cannot represent gives the explanation, disables replacement until a new type is
  chosen, and survives switching back to text unchanged.
- **Machine budget:** the original loop with count 800 reports “The simulator
  stopped at its instruction limit of 10000. The function has not returned.” It no
  longer implies a returned-value disagreement or points to an absent trace.
- **Phone stepping:** immediately after the backward branch, the next instruction,
  destination label and associated C `for` line appear directly above Back/Next/
  Reset. At phone width the complete context occupies y=236–367 and Next starts
  at y=380; both remain visible together. Screenshots confirm readable wrapping in
  both themes.
- **C exercise failure:** the unchanged dimming exercise displays its inputs,
  actual result and expected result in the failure card. The specific failed case
  can now be followed numerically.
- **Safe increment disclosure:** the recorded solution is closed initially, opens
  only after a passing submitted implementation, and closes after the persisted
  source is changed to a failing program while retaining the old verdict. This
  checks actual saved work rather than trusting a saved success flag.
- **Comparison highlighting:** both unchanged `ret` rows in the ordinary/`-fwrapv`
  comparison have `data-differs="false"`; neither has the difference highlight or
  misleading accessible annotation. Changed instructions remain highlighted.
- **Optional A timing labels:** all three static listing pairs, the syntax
  experiment and the record-only conditional exercise have no simulator-step
  badge. The runnable A64 figure still has its stepping badge.
- **Prose:** the built page says Module 1 for `movk`; explains the shorter `mov`
  spelling without unexplained alias/encoding jargon; states that the fixed input
  count equals the maximum in the non-terminating-loop case; explains digit-to-
  integer conversion before the parser arithmetic problem; introduces `printf`
  and its format string; and defines execution state and the practical meaning
  of `-march=armv7-a` in the optional lesson.
- **Evidence links:** all four diagnostics links render with descriptive text and
  target the exact existing nonempty repository files for `format_trip.c`,
  `format_trip.response.json`, `sanitize_trip.c` and `sanitize_trip.response.json`.
  They use GitHub's `main` URLs. Remote availability depends on publishing this
  commit; this pre-push check does not claim those unpublished URLs already resolve.

## Additional finding resolved

The first check found that the ordinary/`-fwrapv` static pair still displayed
“STEPPED”. The managing session corrected the time-model metadata for the new
static listings. Rechecked the final immutable build at
`http://localhost:4207/assembly-lab/` in all four viewport/theme combinations:
the Module 11 static listings and pairs, including the gated solution, now have
no stepping badge; optional A's static figures remain correct. Actual simulator
stepper figures retain the badge. No production source was changed by this
checker. The final comparison screenshots show both this correction and the
unchanged return rows without difference highlights.

## Evidence and limits

The executable browser check, extracted page text, result log and focused
screenshots are under `/tmp/final-page-10-a/`. `check.mjs` completed all four browser
modes; `results.json` contains the failure-card evidence, budget diagnostic,
context/control bounds, return annotations, links and page errors. `prose.mjs`
extracts the corrected rendered prose. `badges.mjs`, `final-badges.json` and
`*-final-comparison.png` record the final 4207 recheck. No open blocker remains
in this checker’s scope.

This is a focused independent check of accepted fixes, not a replacement for the
five full reader reviews, compiler audit, whole-course CI suite or GNU/QEMU run.

## Phone prose-link follow-up

The full suite subsequently exposed diagnostic links with targets below its
40-pixel phone minimum. Independently checked the managing session's CSS fix in
snapshot `http://localhost:4208/assembly-lab/`. The media query is restricted to
widths at or below 600 pixels and makes prose links inline flex items with a
44-pixel minimum height.

Ran the repository's complete `designProblems` function against both
`checked-arithmetic` and `from-c-to-instructions`, with all details open and the
compiler playgrounds unlocked, in all four viewport/theme combinations. All
eight checks returned no problems. The four diagnostic links measure exactly
44 pixels tall on the phone. They remain inline at desktop width. Screenshots
show readable prose, distinct underlined links, no overlaps or horizontal
scrolling, and unchanged desktop flow. The optional Compiler Explorer privacy
and same-source links remain readable and pass the phone target-size check.
No page exceptions occurred.

Evidence: `/tmp/final-page-10-a/prose-links.mjs`, `prose-links.json`, and the eight
`*-links.png` screenshots. This follow-up introduced no source changes.
