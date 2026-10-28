# Section flow validation

Copyright © 2026 Christopher Snow

The audit covers all 34 lessons. Fifteen have content/outline changes, and the shared course
CSS removes the decorative teaching-stage labels on every lesson. The data now has 271 sections,
down from 301. All retained descriptive section headings are visible, including in Fundamentals;
the old CSS-only heading suppression is removed. No platform package was edited.

Independent comparison against 864a90d confirms the same 266 interactive payloads (apart from
outer explanatory lead/after prose), figure sequence, challenge definitions and prerequisites.
Canonical records and authoring guidance were updated. Independent learner and technical
reviews record source and built-browser coverage separately in this directory.

## Check history

- Type checking passed before the production build.
- Initial content suite: 48 files passed, 15 failed; 1,394 tests passed and 23 failed
  (115.41 seconds, exit 1). Failures were stale section counts/order expectations, the moved
  final takeaway location, and canonical records whose removed headings still existed as
  unused exported labels. No grading or simulator failure was reported.
- Removed nine unused title properties without changing rendered text. The five affected
  canonical suites passed all 66 tests. This focused rerun does not replace the original exit.
- Structural assertions now require the intended ordered subset, and facts tests locate their
  section by kind rather than an obsolete array index. The closing advice is required after the
  final challenge. The browser test requires One addition's three named sections; the shared
  guidance test requires all retained headings visible and generic stage labels hidden.
  Existing challenge, prediction, hint, state, no-answer-leak and grading assertions remain.
- Full content rerun: all 63 files and 1,417 tests passed (85.30 seconds, exit 0).
- Production build passed (42.21 seconds), with existing annotation/bundle advisories. This
  frozen rendered build is the reviewers' preview. Subsequent label cleanup removed dead
  properties only; other subsequent edits affected tests and engineering notes.

- The first static-check chain stopped at formatting in one edited browser test. Applying
  Prettier corrected it; the repeated formatting, copyright, platform integrity and strict
  type checks passed. No product or assertion change was needed.
- Full unit/integration run passed: all 158 files and 2,946 tests (187.05 seconds, exit 0).
- The focused four-file educational suite is running against the frozen build; its completed
  result will be recorded in the pull request, independently of the content and unit runs above.

Exact-head CI, merge and live deployment verification are pending. Their results will be recorded
in the pull request. A focused pass is not described as a full-suite pass.
