# Reading sequence implementation verification

3 November 2026. Implementation on `feat/readings-worked-sequence`.

## Scope

The published Signed and unsigned readings page now uses the approved small-pattern
worked sequence. Essential unsigned and signed explanations remain visible. Fresh practice
and transfer tasks retain their own inputs and feedback; exploration is optional. The
32-bit bridge explicitly chooses a new pattern at a new width. Make a negative number
remains as a distinct construction activity. The old active reading quiz and explorer
prediction are replaced, not added to the new assessments.

Numbers are derived from the existing model. Numeric answers are checked; written
explanations are explicitly self-reviewed against model feedback. Responses persist through
the lesson store, are revalidated on restore, and are independent between tasks.

## Checks and corrections

- Initial type checking found an unused import, which was removed. A later full check
  stopped at an implicit-any callback parameter in a new component test; the parameter
  now has its DOM element type.
- Initial full Vitest run: 173 files, 171 passed and 2 failed; 3,114 tests passed and
  10 failed, exit 1. Failures asserted the removed active quiz/teaching-reader design.
  Updated assertions check the replacement assessments and preserve unrelated coverage.
- Technical review's initial focused run: 59 passed, 3 failed, exit 1. Its corrected
  rerun: 9 files, 71 tests passed, exit 0. A final component/canonical-copy rerun:
  2 files, 5 tests passed, exit 0.
- Initial focused Playwright run: 80 cases, 77 passed and 3 failed, no skips, exit 1.
  All failures concerned the new saved-response note's desktop line measure.
- A second targeted browser run: 10 cases, 7 passed and 3 failed, exit 1. New populated
  field contrast checks passed. The note-width failures remained because a course-level
  paragraph selector overrode the component rule. The final selector targets the note
  paragraph inside the sequence, preserving the existing measure threshold.
- Independent learner review found pale text on a white field background in dark mode.
  Explicit theme-token foreground/background, border and focus styles correct it.
  Final populated field checks measured 14.42:1 dark and 17.75:1 light text contrast.
- Whitespace-only explanation validation now asks for completed explanations as well
  as valid decimal numbers. Canonical prose was regenerated after that edit.

See the independent [learner review](implementation-learner-review.md) and
[technical review](implementation-technical-review.md) for browser states, sources and
findings. Original failed runs remain failed; later passes do not rewrite their results.

## Limits

Agent and browser checks establish the recorded behaviour, layout and technical claims.
No novice formative session has occurred, so they do not establish learning effectiveness.
Screen-reader behaviour was not manually tested. Native/Pi CI checks do not establish
physical-board boot success.

## Final check progress

The corrected `npm run check` passed formatting, copyright, platform integrity and strict
TypeScript, then all 174 Vitest files / 3,118 tests (no skips) and the production build.
The full 1,432-case browser suite is recorded separately once complete.

The independent [test verification](implementation-test-verification.md) confirms the
final saved-note selector on the rebuilt page: 390px desktop and 262px at 320px, in both
themes and initial/submitted/restored states, without overflow or browser errors.

The first corrected full check was interrupted after two browser failures exposed an
additional stale cross-page assertion in `module1-opener.spec.ts`: it navigated from the
arithmetic lesson to the replaced reader's Full sum disclosure. Before interruption:
532 passed, 2 failed, 1 interrupted, 14 skipped, 883 did not run; exit 130 (21.1 minutes
in Playwright). The arithmetic and hexadecimal assertions were retained while the
cross-page portion was updated to verify the new visible worked examples and separate
practice. This partial run is not a full-suite pass.

## Completed full local run

The final complete `npm run check` invocation passed formatting, copyright, platform
integrity, strict TypeScript, all 174 unit files / 3,118 tests and the production build.
Playwright finished with 1,411 passed, 20 skipped and 1 failed (51.8 minutes), exit 1.
The skips are the existing project-specific desktop/phone cases.

The single failure was the unchanged phone offline-lifecycle test, “safe restart preserves
each tab's current simulation view and unfinished answer”. The first tab's updated-release
assertion expired after five seconds while the page was still preparing its restart.
The trace also showed broad delays before that operation. The exact unchanged test passed
once in isolation and then all three diagnostic repetitions (9.1, 8.1, 8.5 and 7.4 seconds).
No application code, assertion or timeout was changed to obtain those passes. The independent
technical review records the trace evidence and the limits of this timing diagnosis.

The replacement opener checks also passed their independent full-file rerun: 20 passed,
no failures or skips, exit 0. Both desktop and phone versions subsequently passed in the
completed full local run. Full GitHub CI must pass on the submitted commit before merge;
the focused successes do not relabel the local full-run failure as a pass.
