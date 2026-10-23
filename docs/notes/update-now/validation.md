# Update now validation

Copyright © 2026 Christopher Snow

The user requested explicit activation of a downloaded update. The implementation keeps
the automatic waiting fallback, and adds scoped, identified preparation and verification
messages before activation. Each participant pauses interaction before acknowledging;
all participants then recheck durable exercise edits. Per-tab session handoff preserves
theme choices without making one tab overwrite another's choice during preparation.

Separate drafting supplied the update notice, action, progress and recovery wording.
Independent learner and technical review records are in this directory. Accepted findings
were the need for a second durability check after all tabs pause, recovery when a waiting
worker becomes redundant, theme preservation when normal persistence fails, and actionable
backup/reopen guidance when saving cannot be confirmed. Their final verification is
recorded in the independent reviews. No platform sources were changed.

## Check history

- The initial focused worker/storage run had 15 passes and one failure: an assertion used
  `expect.any(Array)` against an array created in a separate VM realm. The corrected test
  still checks the exact message and now checks `Array.isArray` for its transferred ports.
  This was a test-harness failure; it was not recorded as a passing run.
- Subsequent focused unit runs passed 16, 18 and 19 cases as the safety tests grew. The final
  focused set passed all 25 worker, storage and theme cases. Tests cover cross-tab overwrite
  between acknowledgements, cancellation identities and late responses, missing cache,
  storage failure, Strict Mode theme handoff and cancelled handoff cleanup.
- An intermediate type check failed while the revised protocol was being integrated:
  a test mock's Promise return type, a nullable request ID and the not-yet-added replacement
  update label needed correction. The final type check passed, exit 0.
- The first full `npm run check` passed formatting, copyright, platform integrity and types.
  It was deliberately stopped during unit tests to address the accepted overwrite race,
  exit 130. No completed unit or browser summary was produced by that run.
- The original six new browser cases passed, then the two-phase version passed all six
  again. The final focused run passed all eight cases, exit 0, including superseded updates,
  input-method composition, failed theme persistence and distinct tab themes.
- Production builds passed. Independent browser review exercised both widths and themes,
  real worker installation and activation, keyboard and touch operation, inert controls
  and the Chrome accessibility tree. Its frozen build copies avoid asset replacement
  during full-check rebuilds.
- The final complete `npm run check` passed, exit 0: formatting, copyright, platform
  integrity, types, all 141 unit files / 2799 tests, production build, and 1075 browser
  tests with 23 skipped. The browser stage took 41.7 minutes and ended with
  `All checks passed.` Application sources were committed at `8e6adfc`; subsequent
  changes only record documentation and independent reviews. At this local check,
  GitHub CI had not yet run on the new branch.

The first rollout cannot retroactively add a button to already cached JavaScript. Those
older tabs still need a one-time close and reopen after backing up any unsaved work.
