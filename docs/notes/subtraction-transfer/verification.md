# Verification record

Copyright © 2026 Christopher Snow

The separate drafts and independent learner/technical records are in this directory. They document accepted findings and final built-page checks. Agent reviews and functional checks are not a novice learning study; no novice participant was available.

Completed focused checks:

- 49 content/model/reference tests in five files passed. The two new guide tests also passed, including original starter rejection, reversed operands, an incorrect W-width implementation, input preservation and the correct wide function.
- Strict TypeScript and formatting passed after the test-kind guard correction.
- Eight Arm browser cases passed at desktop/phone in both themes, covering the new worked pane before the original prediction/ring, the original gate, the new appendix, wrong-width rejection and correct saved function results.
- All 43 RISC-V unit/integration tests passed, including the exact new caller, a fresh adjustment and a wide-input edit in real xv6 execution. Four focused RISC-V browser cases passed with real original/caller/edited executions, project creation, reference visibility and original-draft preservation.
- The permanent Arm native transfer corpus passed eight calls and 29 per-instruction states with zero GNU/QEMU/model differences. The extended four-bit corpus passed 14 calls and 42 states. Independent verification also ran the exact RISC-V caller and edits under both QEMU-user and xv6.
- Independent built-page reviews cover the three changed pages on desktop/phone and actual light/dark themes, keyboard controls, saved work, source widths, primary references and absence of page errors/overflow. Each record distinguishes the checks actually performed from source-only review.

Initial failures and corrections:

- The first two new guide-test runs each had one passed and one failed test because the test used the wrong verdict property (`pass` instead of `passed`). Corrected assertions passed on the next run. These were test-harness defects, not changed function semantics.
- The first strict TypeScript run found a missing union-kind guard in the test before reading `cases`; a guard was added. The rerun is recorded separately from that failed command.
- Visual review found the new stylesheet imported after regular CSS rules. The import moved to the import block; the final desktop/phone/theme matrix verifies the intended computed styles and screenshots.
- Independent review setup/harness failures and their corrected reruns are recorded in the individual review files. They are not counted as product failures or erased by a later pass.

Full check/CI, merge and public-page verification are separate stages. Their final results are recorded on the pull requests. No deployment is claimed by these focused checks alone.

The first complete Arm check stopped at five unit/integration failures (3,561 passed, five failed). Adding optional E required a real course-plan icon and prerequisite-audit entry, an unsigned-feedback classification for the new function, and updates to two assertions that previously made optional D the end of the whole course. The corrections retain D's own last lesson and require E immediately afterwards. All 85 tests in those five affected files passed on their focused rerun. The first complete command remains a failed run; the full rerun is separate.

The full rerun passed all 209 unit/integration files (3,566 tests), strict TypeScript, formatting, copyright/platform checks and the production build. Its complete browser stage runs separately from the already passed focused checks. Independent technical source review also confirmed the five integration corrections preserve the earlier assertions; final front-page rendering is checked in that review record.

Both complete CI runs on b9390a4 passed all 3,566 unit tests and native checks, then reported 1,512 browser passes, 20 deliberate skips and two failures. Both failures were the same desktop/phone navigation test's stale exact-course-tail assertion: it still treated optional D as the end. The correction retains all seven earlier tail IDs and all module-order entries, then appends E; the real footer traversal and previous/next assertions remain intact. A fresh independent reviewer verified the source correction and both actual navigation cases passed (two cases, 13 seconds). No application code changed.

The duplicate old local full browser run was interrupted after the complete CI result established this same assertion failure; it is not reported as a full local pass. The first whole-shell focused run was interrupted by an execution-environment restart after 12 cases, including both corrected navigation cases; it had no final result. A new whole-shell run and complete check are recorded separately below/on the PR.

The fresh whole-shell run before rebuilding reported 39 passes, one deliberate skip and four footer-version failures: the pages still carried the old adccdc8 build identity while the test correctly expected b9390a4. No assertion was relaxed. Rebuilding with the current source identity precedes the separate whole-shell rerun. The complete check rerun has passed all 3,566 unit tests, types, formatting and build, and its browser stage is separate from these focused results.

After rebuilding, the complete shell file passed 43 cases with one intentional phone skip (39.7 seconds), including both navigation traversals and all footer/version assertions. The duplicate local full browser stage is stopped before committing the test-only change, so it is not counted as a complete pass; fresh-head full CI supplies the final complete browser result.
