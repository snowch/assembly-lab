# Returned-value layout: validation before full CI

Process: repository learning-design workflow; separate prose draft (GPT-6.1 Sol, Medium), independent learner/UX review (GPT-6.1 Sol, High) and independent technical review (GPT-6.1 Sol, Extra High). Adjacent reports distinguish browser checks, source/component checks and observed-learning evidence. No beginner study is claimed.

The mock's comparison table and stacked sums have different jobs: compare each bit-group contribution across the two readings, then align the additions vertically. All contributions, shared hex and totals derive from the computed returned word. An actual-equal-reading heading covers positive differences, clear top bits and equal C types. Presentation normalises zero so a clear signed highest bit displays 0 rather than JavaScript's negative zero. No simulator or C arithmetic rule changed.

Managing-session checks before commit:

- Initial focused run: 2 files, 12 tests passed and 2 failed. One failure exposed negative-zero formatting for the clear top bit; the other was an overpadded hexadecimal expectation rather than the existing formatter's output. The display was corrected, and the expectation uses the established formatter. Neither original failure is counted as a pass.
- Final focused run: 2 files, 15 tests passed, including the added equal-arguments/all-zero case. A separate exact-canonical prose run passed both tests.
- Independent technical review also caught an HTMLElement query typing error in a new assertion. The query was corrected; final strict typecheck passed. This was a test-type correction, not a relaxed behaviour assertion.
- Production build passed. Focused production-browser comparison suite passed all 10 tests on desktop and phone, preserving prediction/run/reset/restoration gates and checking both new sums.
- Independent learner review inspected actual 375px, 640px and 1280px layouts in light and dark, including keyboard reminder-link navigation. Independent technical review separately checked phone/desktop in both themes, named table/row/column semantics, hidden arithmetic term labels, containment and contrast. Managing session visually inspected tablet-light and phone-dark screenshots. Full browser states and limits are in those reports.
- Changed-source formatting and whitespace checks passed. Exact canonical copy matches the source. The obsolete top-bit-value/weight labels and table-only styles were removed with their table rows.

The committed tree will run the exact full `npm run check`, with HEAD kept stable during its build/browser stages. Full CI, any interrupted redundant local run, merge identity and public deployment verification will be reported separately in the pull request. The checks above do not claim a complete course-wide or public pass.

This follow-up is isolated from the comparison-wording PR102, whose checks run against its unchanged committed tree. No file in its worktree, the pinned platform or the unrelated Pi sources brief was changed by this follow-up.
