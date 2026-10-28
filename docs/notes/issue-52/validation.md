# Issue 52 validation

Copyright © 2026 Christopher Snow

## Scope and review

All 34 lessons were audited, including shared renderer inputs. The course supplies no generic
step note and no repeated model-versus-reality footer. Relevant limits now accompany activities;
the distinct calculation-column explanation remains. Simulator behaviour, exercise programs and
platform files are unchanged. Existing selected-section schema supports lessons with local
qualifications without requiring a footer.

Per-lesson decisions and independent reviews are recorded in this directory. Browser reviews
use the production build, 375-pixel touch and 1280-pixel desktop, with actual light/dark themes.
They distinguish source reading, page checks, interaction checks and physical-hardware limits.

## Existing CI failure

Main commit `84bd405` failed Check run `40586574932`: 157 unit-test files passed, one failed;
2,945 tests passed and one failed. The failing canonical-prose assertion was in
`returning-to-caller.prose.test.ts`. The documentation-only commit had added the caller's own
return-address qualification without updating the rendered source, and changed its challenge
instruction away from the checked program. This change restores the qualification to the
lesson and matches the canonical challenge to the existing checked instructions. It preserves
the bidirectional prose assertions. Native-lessons and real-tools jobs had already passed.

## Local attempts

- Initial full `npm run check` was interrupted (exit 130) during test collection after the
  schema rejected empty footer notes under the default full-section layout. This was not a
  passing full run. The correction selects the existing supported layout; platform/schema
  guards were not changed.
- Initial bundle compilation passed, but was not used for reviewer sign-off because of that
  schema issue. The rebuilt production bundle after the correction passed and was served to
  reviewers at port 4399.
- Focused three-file run: 17 passed, one failed because the canonical Fundamentals record
  retained the removed “Track the old value” label. A second run had the same counts and
  exposed the stale “Continue or return” label. Removed obsolete labels and synchronised the
  retained title; no prose test was weakened. The subsequent Fundamentals run passed all
  13 tests. The returning-to-caller and shared-string tests passed in both three-file runs.
- The course-wide browser regression passed all four cases (1.9 minutes): every lesson at
  phone/desktop widths in both themes, plus retained calculation guidance.
- Final full check passed formatting, copyright, platform integrity, strict types, all 158
  unit/integration files (2,946 tests; 225.73 seconds), and the production build. The full
  1,250-case browser phase is running. Its final result and exact-head CI are recorded in
  the pull request before merging.

No physical Raspberry Pi test is claimed. This editorial change preserves the course's warning
that assembly/layout checks do not establish firmware handoff, UART operation or board boot.
