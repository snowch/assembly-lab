# Validation record

30 October 2026. The production implementation reviewed by the independent agents is unchanged
from the build used for the focused browser suite.

- Full local unit suite: `npm test`, 159 files and 2,955 tests passed, 236.53 seconds.
- Focused built-site suite: `AL_PORT=4412 npx playwright test register-state-labels.spec.ts
  returning-to-caller.spec.ts`, 56 passed, no skips, 4.7 minutes. Includes all eleven executing
  families at desktop/phone widths with light/dark themes, Next/Back/Reset, returned trip state,
  caller layout and older saved-position migration. It is not the full educational suite.
- `npm run typecheck`, `npm run format:check`, `npm run build`, copyright check, platform sync
  check and `git diff --check` passed. Build took 8.51 seconds. Existing dependency annotation
  warnings from Zod remain; they did not fail the build.
- Initial implementation-focused work exposed a button-name mismatch in a new test and typing
  errors in the new test setup. Both were corrected before the final checks. These initial failures
  remain distinct from the passing focused reruns recorded in coverage and technical review.
- Technical reviewer records its independent 36-test rerun and exploratory browser-harness
  failures separately in `technical-review.md`. Learner browser evidence and limits are in
  `learner-review.md`. These reviews are independent of implementation.

The existing long learner-written constant overflow is not caused by the new label: the learner
review measured the same page width with that label shortened or hidden. No broad listing/grid
layout changes were made in this task. Ordinary course examples passed the viewport checks.

GitHub CI and deployment results will be recorded in the pull request after this commit.
