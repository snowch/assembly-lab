# Verification

The change restructures existing learner-facing facts and procedures into lists in four
published pages: Arithmetic with four bits, Loading a constant, Building a constant and
Two’s complement. Numbers, grading, figures and prediction gates are unchanged. The source
and canonical prose copies remain synchronised.

Independent learner and technical reviews inspected all four routes at 375/1280 pixels in
both rendered themes. They checked list markers and wrapping plus the relevant initial,
stepped, reset and gated states. One technical finding was accepted: both subtraction inputs
are now named before the numbered procedure refers to their roles. Both final reviews have
no outstanding findings. See their reports for evidence and limitations.

Local results:

- Focused content/prose/facts checks: 7 files, 80 tests passed.
- After identifying both subtraction inputs, the four-bit content check passed again.
- Independent technical focused checks: 7 files, 80 tests passed (a different selection).
- Production build and formatting passed. `git diff --check` passed.
- `VITEST_MAX_WORKERS=2 npm run check` passed formatting, copyright, platform integrity,
  TypeScript, all 179 unit/integration files (3,171 tests), and its production build.
- That command was deliberately interrupted during the redundant full local browser stage
  so the complete course-wide browser run could run once in CI. Exit status 130: 17 passed,
  1 interrupted, 1,422 not run. This is not a passing full local check. No test assertion or
  timeout was changed; the full CI result is required before merge and recorded in the PR.

The final reviewed prose was committed before the full local command, so its built revision
and expected revision were stable throughout. Subsequent commits contain these review and
verification notes only. The full CI build checks the final commit.
