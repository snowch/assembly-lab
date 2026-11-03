# Readings calculator and exploration order

The calculator supplies optional exact whole-number arithmetic beside the two register-width
tasks. It starts empty, reads no bit pattern and writes no answer. Decimal input, grouped commas,
signed operands, the four basic arithmetic operators and parentheses are accepted. Fractional
division is rejected explicitly. A 200-character input bound limits parsing and BigInt work.

The optional four-bit exploration now immediately follows four-bit practice in the same section.
Its attempted-practice gate and independent state are unchanged. The lesson ends with the
negative-number construction; the Appendix B link remains visible beneath it.

## Separate passes

- Copy: GPT-6.1 Sol, Medium, separate drafting agent; `copy.md` records the checked brief and copy.
- Reordering: GPT-6.1 Sol, High, separate implementation agent; reviewed with the combined change.
- Independent learner/UX and technical review: GPT-6.1 Sol, High; `review.md` records findings and
  final rendered verification.

## Focused checks

- Reordering: 4 Vitest files, 39 tests passed; formatting and diff checks passed.
- Initial calculator run: 23 tests passed and 2 new tests failed because the test harness used an
  unavailable `fireEvent.toggle` helper and omitted a required test-fixture grader. Correcting
  the harness gave 3 files / 25 passing tests, including the existing reading-sequence component.
- Production build passed. The first combined browser run had 19 passes and 1 failure: phone
  light timed out finding Theme before any calculator interaction while the build was replaced
  to fix the review's dark-input finding. Rebuilding during an active browser run was a process
  error. The failed command's exit status remains 1.
- On the stable corrected build, the calculator suite passed all 4 desktop/phone and light/dark
  cases, including both inputs' computed text contrast, Enter behavior, answer isolation and
  absence of page overflow. The reviewer separately verified the reordered route and gate.

- The first full check stopped at TypeScript (exit 2): two Testing Library selectors used the
  Playwright-only `exact` option, and the new browser test omitted the design helper's phone flag.
  The test calls were corrected; the phone flag also enables the existing touch-target checks.

Final full local checks, GitHub CI and deployment are recorded after completion.

The second full check passed formatting, copyright, platform integrity and TypeScript, then
reported 3,138 passing tests and one stale assertion in the two’s-complement appendix test.
That assertion still expected the appendix link in the removed closing section's prose. It now
checks the final challenge, its final figure and that figure's exact Appendix B link. This
matches the already-verified rendered placement. The original run exited 1.

The third `npm run check` passed all static stages, all 176 unit/integration files (3,139 tests)
and the production build. Its browser run was stopped after two 60-second timeouts in unchanged
Module 10 and Module 12 tests. The recorded result is **256 passed, 2 failed, 1 interrupted,
4 skipped and 1,173 not run**, exit 130. It is not a passing full local run. Independent trace
analysis is in `review.md`; the delays' root cause remains unproven.

An unchanged focused rerun of both timed-out desktop tests passed (24.2s and 8.2s). No application
code, assertions or timeout limits were changed for that rerun. The complete GitHub CI run is
required before merge; its result does not replace the original local result above.

After correcting the browser test's phone flag, its final phone-only run passed both light and
dark cases, including the existing touch-target checks. Source and formatting checks are clean.
