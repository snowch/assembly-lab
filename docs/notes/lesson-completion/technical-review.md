# Independent technical review: lesson completion

Separate technical reviewer; no implementation edits. Reviewed `brief.md`, `copy.md`,
`CLAUDE.md`, `docs/style.md`, the changed course shell, completion store and update-storage
adapter. Model and effort were inherited from the managing session.

## Findings

No technical defect found in the completion state or persistence paths reviewed below.
The learner review's accepted footer-grouping correction passed the final-build recheck.

## Source and focused checks

- Only explicit `set` calls persist a mark. Known lesson IDs use separate
  `assembly-lab:v1:manual-completion:<id>` keys; only the exact value `true` counts. Unknown IDs,
  other versions and malformed values cannot contribute to progress. Added lessons start
  unfinished. Navigation and Continue share module/order sorting.
- Manual marks never write the runtime's exercise blob, set a challenge result or invoke a
  grader. A lesson's runtime reset and later stale-blob writes leave the independent mark intact.
  `git diff --name-only -- platform` was empty.
- The live completion store accepts external values only for its known manual-mark keys. It
  rereads current durable storage rather than replaying queued event values. Removing a mark,
  clearing storage and cross-tab undo reconcile the plan and footer. Accepted marks release
  their own update guard; an external exercise conflict remains guarded.
- An independent source-loaded jsdom probe checked first-subscription and resubscription read
  gaps, a failed choice retained across resubscription, successful retry, queued stale events,
  ignored session-storage events and an exercise conflict remaining guarded. All passed.
- `npm test -- apps/course/src/lesson-completion.test.ts
  apps/course/src/lesson-completion.test.tsx apps/course/src/update-storage.test.ts` passed:
  **3 files, 16 tests**, exit 0, both before and after the final layout/namespace changes.
  This is a focused run, not the full unit suite.

## Browser evidence

Chromium drove the production build on port 4411 at 375 × 812 and 1280 × 800 in both light and
dark. Final build ID: `256cd49349891295dfb3ab3d0765701819f51ba89eb1573fe6bce20a04abd37c`.
Actual `html[data-theme]` and computed body colours confirmed the themes: light background
`rgb(243, 246, 245)`; dark background `rgb(16, 22, 21)`. Disposable evidence is in
`/tmp/completion-technical-final/`; the earlier candidate's evidence is in
`/tmp/completion-technical/`.

- In all four combinations: keyboard mark kept focus; tick links included “Marked complete”
  in their accessible names; Continue selected the next unfinished lesson; reload preserved
  marks. Real second-tab mark, undo and clear updated the first tab. All 34 links remained
  available in the all-marked state. External malformed records did not count; unknown records
  also passed the initial browser pass and final focused tests.
- Final first, middle, both reading-only Pi lessons and last (`same-c-on-a32`) footer checks
  passed in all four combinations. The completion button measured 186 × 44 pixels. Mark and
  Next now have a 12-pixel gap, horizontally at 1280 and vertically at 375. Final footer
  screenshots and earlier unchanged cover/tick screenshots were inspected. No horizontal page
  overflow or page error occurred in these runs.
- In all four combinations, injected quota failure kept the visit's mark and replaced the
  saving claim with the failure note. Undoing the only mark kept that warning on both footer
  and plan. A separate final-build retry restored the saving note and survived reload.
- Additional isolated checks: failed undo remained visibly incomplete while an older saved
  `true` remained on disk; reload correctly restored that older mark. Completely blocked
  reads/writes kept the page usable, showed the warning and lost the memory-only mark on reload.
- A passing browser challenge did not mark its lesson. Mark/undo preserved the exact saved
  exercise JSON, and its passing result remained after reload.

## Limits

Full unit/educational-suite, offline-cache and coordinated service-worker restart results belong
to the managing session's integration record. This review did not rerun those suites or use a
physical touchscreen or screen reader. New-lesson handling and update-guard release were checked
in source and focused probes; the deployed lesson inventory was not changed for this review.

For a same-lesson conflict, an explicit cross-tab storage event deliberately adopts the current
durable value, including over a memory-only local choice. The managing session accepted this
policy for reading marks. Ordinary route/subscription changes retain memory-only choices.

Status: final source and built-site technical review ready. No open technical finding.
