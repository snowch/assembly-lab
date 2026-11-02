# Verification

2 November 2026. The initial explanation in the previous change still combined unsigned and signed mechanisms. This correction stages the prose and expanded calculation with the selected view, keeping every view control discoverable.

- Separate Medium drafting and High content implementation; root UI integration. Independent High learner and Extra High technical reviews recorded beside this note.
- TypeScript passed. Teaching-reader and update-handoff focused run: 2 files, 10 tests passed.
- Content focused run initially had 45 passed and one canonical-record mismatch. After correcting the record, its focused rerun passed 2/2; removing the unused shared instruction string also passed the canonical 2/2 rerun.
- Build, formatting and diff whitespace checks passed.
- First browser selection: 8 passed and 4 failed. All four were the new test comparing rendered innerText (with a layout newline) against Playwright's textContent matcher. The stored bit pattern did not change. Capturing textContent consistently fixes the test without changing the page or assertion's requirement.
- Independent browser reviewers tested the actual rendered light/dark themes at phone and desktop widths, initial unsigned text, signed and comparison definitions, calculation opened before switching views, bit preservation, reset and prior reader isolation. See their reports for coverage and limits.

Final focused rerun, full local/CI outcomes and deployment proof are recorded in the pull request. Passing reruns do not alter original command exit statuses. HEAD remains fixed during full browser validation.
