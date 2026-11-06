# Independent review of compact plan links

6 November 2026. Separate Codex reviewer using the session's inherited model and effort; no
model substitution. The reviewer did not draft or implement the change. Read `AGENTS.md`,
`CLAUDE.md`, `docs/authoring.md` and `docs/style.md`, then examined the diff and the published
lesson-order and reference code before checking the built page.

## Findings

No learner or technical findings. The module heading supplies the context for `L1: One
addition`; the shorter label remains clear beside its title and keeps the module heading
visible. The single-lesson Module B heading also retains that context. No new prerequisite or
unexplained technical term is introduced.

The two affected render branches use the same catalog ordinal and lesson title. The catalog
counts published lessons within each module after sorting; it does not use the source lesson's
possibly sparse `order` as the displayed number. Routes, ordering, completion membership and
the completion mark are unchanged. Optional modules retain A/B headings. Cover, lesson
position, navigation and prose references still use the full reference formatter. Reviewed the
focused regression expectations, including all-completed plan labels and optional modules.

## Fresh browser verification

Checked the production build served at `http://localhost:4395/assembly-lab/` in Chromium at
375 × 812 and 1280 × 800, each in light and dark. Confirmed the actual rendered theme and
no page horizontal overflow. In every configuration:

- Enumerated all 75 plan links across all 16 module headings. Each module's visible ordinals
  start at L1 and increase consecutively; labels omit the repeated module prefix. Recorded
  every title and href in the browser artifact.
- Clicked Module 0's first lesson, optional Module A's first lesson and single-lesson Module B.
  The destination's route, title and full module/lesson position agree with the plan label.
- Marked and unmarked `one-addition` and `twos-complement` through the actual lesson controls.
  Both list and single-lesson links retain the compact title and tick, survive reload, and
  remain clickable. Unmarking removes the tick. The cover advances to the full Module 0,
  lesson 2 reference after marking the first lesson.
- Followed Module 1 next/previous navigation and forward/backward prose references. These
  retain full module/lesson labels and navigate to their stated destinations. Confirmed the
  current register-widths reference is Module 1, lesson 7 against the published pacing data.
- Saw no uncaught browser errors. Inspected captured phone and desktop screenshots in both
  themes, including the marked first lesson and the optional A/B region; no clipping or
  confusing wrapping was visible.

Evidence is outside the checkout in `/workspace/scratch/compact-plan-links/`:
`independent-review.cjs`, `independent-review.json`, `independent-review.log` and
`review-*-plan.png` / `review-*-marked.png`. The final browser run exited 0. Earlier harness
attempts exited 1 because a count assertion did not wait for React navigation and because the
harness assumed an obsolete register-widths ordinal of 5; the harness was corrected, with no
product change. Those attempts are not counted as passing checks.

Source review establishes that every href is untouched. Browser route clicks sample the
relevant branches rather than opening all 75 lessons. This reviewer did not run broad tests,
rebuild, audit unchanged lesson activities or test other browsers. The managing session records
its own unit, build and regression-suite results separately.

## Follow-up review of sibling regression expectations

Reviewed the additional tests-only changes to `lesson-references.ts`, `fundamentals.spec.ts`,
`shell.spec.ts`, `four-bit-arithmetic.spec.ts` and `twos-complement.spec.ts`. The independent
`planLessonLabel` expectation derives the ordinal from published siblings sorted by `order`
and spells the compact format directly; it does not call the implementation's formatter.
The updated assertions select only module-scoped plan links. Existing full-reference helpers
and their prose/navigation assertions remain intact. No product code changed after the
browser verification above, so these source-only updates do not invalidate it.

The sibling search found two additional stale test locations: `module-2.spec.ts`'s return-to-plan
assertion and `module-4.spec.ts`'s two return-to-plan assertions still expected full labels.
Reported these to the managing session for the same narrow expectation correction. Their
route assertions and lesson checks must remain intact. The managing session records its
subsequent focused regression results; an earlier full-check attempt stopped before producing
a result and is not a passing full check.

Confirmed the final Module 2/4 diffs: only the helper imports and the three plan-label
expectations changed. Accepted the correction and closed both stale-expectation findings by
source inspection. No assertions were removed or weakened. Their browser reruns belong to the
managing session's validation record. No further review edits are pending.
