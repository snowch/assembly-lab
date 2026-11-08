# Comparison wording: validation before full CI

Separate prose draft: GPT-6.1 Sol, Medium. Independent learner/UX review: GPT-6.1 Sol, High. Independent technical review: GPT-6.1 Sol, Extra High. Reports are adjacent. One stale canonical description of the controls was accepted, corrected and independently verified; no unresolved finding remains.

Managing-session checks before commit:

- Focused component/runtime tests: 5 files, 111 tests passed. The new integration tests exercise the actual register grader, the supported course runtime provider, successful and failed one-/three-case feedback, restored work and accessible failure-list labels. Instruction-count and argument-mapping fixtures cover the singular branches; the latter also covers two and four arguments.
- Production build and strict typecheck passed. An initial typecheck caught an unsupported `exact` option in the new Testing Library query; using an anchored name matcher corrected that test query. This was not a product change or a weakened assertion.
- Focused built comparison browser suite: 10 tests passed, desktop and phone. Prediction gates, independent results, shared bits and persisted results remain covered.
- Additional built-browser script passed at 375px and 1280px, each in light and dark themes. It checked actual rendered themes, initial/committed/run/reset/restored comparison states, the shared bit row and both typed readings, single-test failure/status/list name and successful feedback, page overflow and page errors. No overflow or page errors. Scratch evidence: `/workspace/scratch/comparison-wording-public-local.json`.
- Full formatting and whitespace checks passed; the pinned platform remains unchanged. The technical reviewer independently ran the platform integrity check and 167 focused component/facts/recording tests; the learner reviewer separately checked actual single- and two-test course challenges in all four browser combinations.

The full `npm run check` is run against the committed tree with HEAD kept stable through its build/browser stages. Its original outcome, any focused reruns, exact-head GitHub CI, merge SHA and public deployment checks are reported separately in the pull request once available. The precommit checks above do not claim a complete course-wide or public deployment pass.

No simulator execution, arithmetic rules, challenge grading or prediction/result gate changed. The course's existing string-provider API supplies count-neutral feedback without modifying the vendored platform. The unrelated untracked Module 12 Pi sources brief is excluded.
