# Validation and integration

30 October 2026. Implemented from the accepted brief and separate copy draft. Manual reading marks
use `assembly-lab:v1:manual-completion:<lessonId>` with explicit `true`/`false`, independently of
lesson challenge and interactive blobs. The existing tracked storage adapter protects update
restarts. Only explicit manual changes set marks; no grading, reading or navigation auto-marks.

## Accepted corrections

- The first focused unit run passed 15/16 tests and exposed a missing space between Continue
  learning and its destination in the accessible name. Added the separator; final focused reruns
  passed 16/16 across three files.
- Learner review found the footer button near Previous rather than beside Next. Grouped completion
  and Next together. Independent final measurements found a 12px gap on desktop and aligned,
  stacked controls on phones. See learner-review.md.
- Root identified the existing `assembly-lab:v1:` learner-key invariant. Moved the new per-lesson
  key inside that namespace before release and extended the existing shell check to mark a lesson.
  No migration is needed because the earlier key was never released.

## Checks

- Full local unit run before the final grouping/namespace adjustments: 161 files, 2,969 tests
  passed, 312.50 seconds. Focused post-adjustment runs: 16 tests passed, independently repeated
  by the technical reviewer.
- Initial completion + shell browser run: 55 passed, 1 expected desktop-only layout skip,
  4.6 minutes. Final rerun on the reviewed build: 55 passed, the same 1 skip, 1.6 minutes.
  This covers marks, undo, first unfinished, all 34 current lessons, single/multiple modules,
  refresh, actual tab sync/clear, malformed/unknown marks, failed storage, keyboard focus and
  exercise independence, as well as existing shell/navigation checks.
- First extended explicit-update run: desktop failed because the replacement-release meta tag
  was absent; its snapshot showed the older release. Phone passed. This failure remains recorded;
  it is not relabelled as a pass or attributed to a proven cause.
- Final update fixture also undoes a mark from another tab before restarting, exercising accepted
  external completion changes and the update guard. Both desktop and phone passed (27.8s/39.0s;
  2.0 minutes for the command). While offline, the new release activated in both tabs with the
  complete/incomplete marks, exercise work, route and individual themes preserved. No offline
  protocol source was changed to obtain the passing rerun.
- Final production build, typecheck, formatting, copyright, platform-copy and diff checks passed.
  Existing dependency annotation and bundle-size build warnings remain.
- Independent learner and technical reviews checked the final build at 375/1280 pixels in actual
  light/dark themes, including real reading-only Pi lessons, first/middle/last footers, storage
  failures and all-complete. Their evidence and limits are recorded separately.

The source was frozen during the final browser/reviewer passes. Same-lesson cross-tab conflicts
use current durable storage on explicit external events; the technical review records the
memory-only conflict limitation. Normal subscription/route changes preserve unsaved choices.

Full GitHub CI and deployment evidence will be recorded in the pull request after commit.

## CI reading-measure correction

The first push and PR Check runs (41066351213 and 41066404807) both failed. Each passed
2,969 unit tests, then reported 107 browser failures, 1,166 passes and 21 skips. All 107
failures reported the new completion saving note as a 132-character-wide line: its desktop
paragraph box was unconstrained. The other two CI jobs passed in both runs.

Constrained `.lesson-completion-note` to `65ch`, matching its smaller font, and added the
existing `designProblems` assertions to the completion checks for saved and failed-save
states. No design threshold was weakened. The rebuilt site passed 26 completion/module-1
browser tests and 12 synthesis/reading-measure tests. Formatting and diff checks passed.
Independent learner and technical follow-up reviews confirmed the final build at 375/1280
in actual light/dark themes, including the longer failure notice. Both are ready; their
notes retain measured evidence and the technical review's failed probe separately.

The original full CI failures remain failures. Fresh full CI results will be recorded in
the PR after this correction is pushed.
