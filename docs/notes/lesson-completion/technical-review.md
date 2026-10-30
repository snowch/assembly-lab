# Independent technical review: lesson completion

Separate technical reviewer; no implementation edits. Reviewed `brief.md`, `copy.md`,
`CLAUDE.md`, `docs/style.md`, the changed course shell, completion store and update-storage
adapter. Model and effort were inherited from the managing session.

## Findings

No open technical defect in the completion state or persistence paths reviewed below.
The initial focused review missed the footer note's excessive line-box width; the CI finding
and its correction are recorded in the follow-up below.
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

## Follow-up: footer-note measure

**Accepted, medium: the footer note exceeded the existing prose measure.** The managing
session's full CI run reported 107 browser failures with the shared note estimated at
132 characters. The earlier focused review checked overflow and readability but did not run
the existing `designProblems` measure guard. A passing focused run did not establish this rule.

The smallest correction adds `max-width: 65ch` to `.lesson-completion-note`. Source inspection
confirmed that the change affects only paragraph width; storage, copy, status semantics,
keyboard behaviour and update safety are unchanged. The added healthy/failed-save assertions
call the existing `designProblems` helper without changing its 85-character threshold.

Independent Chromium recheck against build
`b44e489acad43ded99c7ba07947641b8f123cc91e615cd2454ecf795be0ef14b`:

- At 375 pixels, the note measured 343 pixels wide at 15-pixel text, or 45.73 estimated
  characters. At 1280, it measured 455 pixels, or 60.67 estimated characters. Both light and
  dark produced the same measures; actual `html[data-theme]` was checked.
- `designProblems` returned no problems in all 20 sampled states: initial, marked, last lesson,
  unsaved mark and unsaved undo at both widths and themes. Saved notes remained one line;
  failure notes wrapped to two lines without clipping. Screenshots were inspected.
- Keyboard mark/undo kept focus, durable undo still stored `false`, and isolated failed saves
  retained the mark and truthful warning. Undoing a genuinely unsaved mark kept the warning on
  both lesson and plan. The first/last footer boundaries still worked.

The first follow-up probe exited 1 because its fixture expected an unsaved warning after
undo returned to an already durable `false`. The saving note was correct. A fresh failure
context retained the intended unsaved precondition; the corrected probe exited 0. This does
not change the first probe's failure or the managing session's original CI result.

Evidence: `/tmp/completion-technical-measure/results.json` and adjacent screenshots. These are
focused measurements and browser probes; full educational-suite reruns remain the managing
session's responsibility. The measure finding is closed; no new technical finding remains.
