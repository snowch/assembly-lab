# Validation

31 October 2026. Root implementation plus separate draft (GPT-6.1 sol Medium),
learner review (High), and technical review (Extra High), following the repository
authoring guidance. Independent reviews and exact canonical copy are alongside
this file. No platform files, dependencies or saved-work format changed.

Implementation scope:

- Main Module 1 explanation makes positive unsigned weights explicit, separates
  weights from set/clear contributions, and links a directly accessible optional
  Appendix B. Existing exercise and prediction gates are retained.
- Two model-backed four-bit explorations show readings and fixed-width negation.
  Four-bit examples are explicitly not an Arm processor width. Every pattern is
  checked against positional arithmetic and the actual simulator's NEG result.
- Top-bit marker is anchored inside its bit button, rather than attached to the
  end of its label. Shared main/scratch/appendix uses are covered. Geometry tests
  measure the actual CSS triangle tip against the button centre (under 0.5 px).
- Plan, published/source lesson registries, term/instruction gate metadata,
  canonical source/paced/appendix words and links are updated together.

Original commands and subsequent corrections:

- New model tests passed: 1 file, 3 tests, covering all 16 patterns and limits.
- First focused group: 113 passed, 2 failed, 9 files. Both failures were in the
  new test harness: modelProblems received a lesson instead of a lesson array,
  and a jsdom URL was used for a filesystem read. Corrected the API call and moved
  the canonical-file assertion into its own Node-environment prose test.
- Corrected local rerun: 2 files, 4 tests passed, 4.89 seconds.
- First new browser run: 4 failed. A selector matched both the scratch disclosure
  and its nested calculation summary. Scoped it to the actual scratch disclosure;
  no product assertion or timeout was relaxed. Corrected run: 4 passed, 13.4 seconds.
- Full focused content/model/parity/plan rerun: 10 files, 115 tests passed,
  8.63 seconds, after the final caption source edit.
- TypeScript passed; full-repository formatting and git diff --check passed.
- Initial build passed in 9.29 seconds; final rebuilt caption passed in
  20.87 seconds. Existing Rollup annotation/bundle-size warnings remain.
- First complete unit run: exit 1, 3098 passed and 3 failed across 170 files
  (143.01 seconds). Two assertions still assumed Appendix A ended the entire
  course; they now retain A's full sequence and additionally check B's position.
  The third check correctly caught a missing front-page mark for new Appendix B;
  the course's existing module-mark registry now includes B. Corrected focused
  and post-commit full results are recorded separately in the PR.
  Root corrected focused run passed all 20 tests in those 3 files, 5.89 seconds;
  the technical reviewer separately confirmed both the stronger ordering
  assertions and the matching B icon, then reran the same focused checks.
  Final build including the plan mark passed in 8.22 seconds.

Built-browser verification:

- Root: actual phone/desktop light/dark themes; direct plan/M1/return links,
  both figures' independent state, keyboard toggle/reset, zero/limit feedback,
  existing answer gate, main/scratch/appendix pointer alignment and design checks.
- Independent reviews: 320/375/600/1280 px in both rendered themes, screenshots,
  all 16 rendered patterns, exact pointer centring and 44 px toggle heights.
  A fresh complete course download also reopened the previously unvisited
  appendix offline and remained interactive. Final shortened caption was
  rechecked after the final build by both reviewers.
- The reviewer records an inherited narrow scratch-table decimal wrapping
  limitation separately; this change does not modify those table rules.

Full unit-suite result, post-commit npm run check, remote CI, merge and live
deployment verification are recorded in the PR. Commit before starting the
post-commit full build/browser run, and do not change HEAD during that run:
the footer tests correctly require built and current source revisions to match.
Preserve the unrelated pre-existing untracked Pi source brief.
