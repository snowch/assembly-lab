# Six-case practice and follow-up layout verification

The canonical challenge now has six stable case IDs. The original three keep their inputs/order; the new three distinguish positive signed overflow without carry, a negative reading with no overflow, and zero without carry. Controller models and state case counts derive from the canonical grader instead of duplicate operand lists/count3. The reference, final answer hint, labels, generic task and paired prose record cover all six. New input calls are present in the GNU/QEMU corpus; architecture semantics are unchanged.

Old three-case saved answers retain their correct marks. Added cases restore blank, and canonical grading with all six cases determines completion even if old firstPassedAt metadata exists. Navigation, wrong-answer feedback, edit invalidation, clear, hint order and aggregate gating remain meaningful. The approved compact section06 result and earlier optional circuit are retained.

Reading cards use the available content width to pair or stack. Complete decimal operands and signed parentheses occupy their own lines; the exact total has a separate ruled line. All four reading-card consumers were inspected. The follow-up hex values wrap between complete groups. Its native carry disclosure now has a bounded border, comfortable target and24px separation. The follow-up is only rebuilt when its completion gate changes, retaining an open disclosure on unrelated completed-case navigation and hiding it on an invalidating edit.

## Focused outcomes

- Final focused unit/facts/state/content: six files,93 tests passed, no skips. Separate paired-prose checks:31 passed.
- Final candidate2 production build and strict types passed. Existing dependency annotation/bundle warnings remain.
- Final candidate2 flags browser suite:42 passed, no skips. Covers320/375/834/920/1280, actual light/dark, fallback font, complete values and number groups, six-case navigation/gates, saved/malformed/legacy progress, full completion, reset, compact result, earlier circuit and carry keyboard/state retention.
- Separate learner/UX and technical/sceptic review reports are in this directory. Final candidate2 node/open/focus and invalidation were independently checked. Manager viewed final375px-dark and1280px-light follow-up screenshots. No introduced open finding remains. The inherited CPU terminology observation is recorded as a separate, low-priority baseline follow-up.
- Local GNU/QEMU tools were unavailable to the technical reviewer (missing assembler); corpus inclusion and CI wiring were inspected. Exact-head real-tools CI must finish before merge; no local GNU/QEMU pass is claimed here.

## Historical results retained

An intermediate nonredirected typecheck exited2 with TS2554 because one old test still called blank() without the new count argument; the call was updated using the canonical count. The later typecheck logs are successful commands, not copies of that earlier failure. Two guarded editing scripts also stopped on stale text-match assumptions; the affected source sections were inspected and changed directly.

The first focused unit command exited1:88 passed,4 stale three-case/numeric-inventory expectations failed. Exact six-case labels/operands/groups and the model-backed new hex input were added to those assertions. The next command passed93; no retained rule was weakened. See unit1.log versus unit2.log in /workspace/scratch/flags-practice-*. Final-hint claims and differential-corpus inclusion gained explicit checks.

Candidate1 browser command exited1:38 passed,4 new disclosure-close tests failed. All numeric/geometry assertions had passed. The follow-up was recreated on each case selection, closing its disclosure; candidate2 fixes that state loss. The final42-case run passed, with stronger open-state and Next case transition checks. Reviewer-specific harness mistakes and corrected reruns remain recorded in their own reports.

Full npm run check, exact-head CI and merged public verification will be reported on the pull request after completion. These focused results do not stand for them.
