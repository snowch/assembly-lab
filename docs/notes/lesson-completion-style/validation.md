# Validation

The button now uses the course's accent colour for the mark action, a decorative empty circle,
and a checked circle with a softer background after marking. Its height follows the adjacent
navigation card; the forward group wraps when necessary. Approved action labels, storage,
exercise grading and navigation targets are unchanged.

- Production build passed (16.34 seconds), with existing bundle-size warnings.
- Typecheck, formatting, copyright, platform-copy and diff checks passed.
- Existing completion and shell browser checks: 55 passed, 1 expected skip (2.0 minutes).
- Root inspected the rendered tiny-function navigation screenshot at 1280 pixels. An earlier
  disposable screenshot probe used the nonexistent `a-tiny-function` route and timed out without
  finding navigation; the corrected `tiny-function` probe succeeded. This was a probe setup error.
- Independent review evidence is recorded in learner-review.md and technical-review.md.

No new prose or storage behaviour was introduced. Full CI and deployment results will be
recorded in the pull request after commit.

Learner review found that the longer undo label could move Next onto another row at 481 pixels.
Reserved a 15rem width for the control at wider viewports, retaining full width on phones, so
both states use the same space. Rebuilt successfully (17.73 seconds); formatting and diff checks
passed. Final browser and independent rechecks below supersede only the affected layout checks,
not the original results.

Final completion browser rerun: 14 passed (53.0 seconds), including both themes, keyboard focus,
mark/undo, first unfinished, reload, tab sync, all-complete and failed storage. The unchanged
persistence logic is covered by these existing tests; no new storage tests were added for styling.

Both final independent reviews are ready. They confirmed stable mark/undo geometry at five
widths in both themes, decorative icon semantics, keyboard access and contrast. Technical
review also passed six existing component tests. Its unrelated 481px source-link touch-size
reports and preliminary probe exits remain recorded separately. Root inspected final phone
dark focus and desktop light navigation captures. No open styling finding remains.
