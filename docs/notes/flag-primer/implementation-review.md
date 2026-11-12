# Four-bit flags integration: decisions and verification

The approved design was integrated into M2, L1 before the existing 32-bit prediction. It uses four compact worked additions, one supplied-result formative check and an explicit width bridge. All essential examples are visible; the independent 32-bit challenge remains. The later flag-persistence and subtraction lessons retain their scope.

Production prose was drafted separately by `flag_primer_draft` (`gpt-6.1-sol`, Medium). Independent learner/UX review used `gpt-6.1-sol`, High; technical review used `gpt-6.1-sol`, Extra High. Both reviewers inspected the built lesson without authoring it. See the adjacent reports and the learning brief. This is browser inspection and agent review, not a novice study.

## Accepted corrections

- Native form reset could restore the initial checked states after React had cleared saved selections. Preventing the native reset makes Clear use the controlled state alone. The focused browser regression and independent final reviewers verified correct answers, reload, Clear, empty radio selections and empty feedback.
- Joined range labels repeated “range”. The separate drafting pass produced complete joined sentences. Final browser review verified them.
- Feedback was a dense paragraph. It now has four short NZCV bullets followed by one retained-result takeaway. Final browser review verified it.
- Technical review found a future regression gap between fixed practice prose and model inputs. A facts test now pins the named input pair, signed inputs, exact sums and retained readings, in addition to exhaustive flags checks.
- The existing prose numerical-provenance map omitted the new four-bit bounds. It now names their origins and checks the signed/unsigned readings against the representation model.

No learner/UX correction remained in the final independent review. Rejected suspicions and their evidence remain in that report.

## Commands and outcomes before the final full check

- First focused build/unit attempt failed because the two new interactive records omitted required `timeModel`; corrected to `none`.
- First type check found union-tuple spread typing errors; corrected with explicit tuple indexes.
- Initial prose test required the new canonical captions in the lesson record; corrected without weakening existing assertions.
- First browser run used a stale prediction-option locator and was stopped. Second run exposed the reset defect; inspected the failure traces during the task. The final focused run passed all four viewport/theme cases.
- An exploratory full Vitest invocation was interrupted to avoid competing with browser review. It is not a full-suite pass.
- Independent technical focused run initially passed 78 tests and failed the numerical-provenance test above. After correction, the root focused run passed all 81 tests in four files.
- Final focused Playwright run: 4 passed, covering desktop/phone and actual saved light/dark themes, worked values, incomplete/wrong/correct mini answers, restoration, Clear, 44px targets, no document overflow, and both independent Arm gates.
- Type check and production build passed. GNU/QEMU targeted corpus check and official-source evidence are recorded in the technical review.

The first committed-head `npm run check` passed formatting, copyright, platform integrity and type checks, then failed one unit assertion: 3458 passed and one failed. The originality-note test expected the exact phrase “32 bits”; the separately drafted note uses “32-bit”. Its width assertion now accepts either spelling while preserving the textbook-example check. No product code changed for this correction.

The final committed-head `npm run check`, required pull-request CI, merge-tree comparison, Pages deployment and public revision checks follow this record. Their exact revision and outcomes belong in the pull request, so this file does not claim they have already passed.
