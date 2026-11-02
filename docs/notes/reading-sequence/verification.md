# Verification

2 November 2026. The initial explanation in the previous change still combined unsigned and signed mechanisms. This correction stages the prose and expanded calculation with the selected view, keeping every view control discoverable.

- Separate Medium drafting and High content implementation; root UI integration. Independent High learner and Extra High technical reviews recorded beside this note.
- TypeScript passed. Teaching-reader and update-handoff focused run: 2 files, 10 tests passed.
- Content focused run initially had 45 passed and one canonical-record mismatch. After correcting the record, its focused rerun passed 2/2; removing the unused shared instruction string also passed the canonical 2/2 rerun.
- Build, formatting and diff whitespace checks passed.
- First browser selection: 8 passed and 4 failed. All four were the new test comparing rendered innerText (with a layout newline) against Playwright's textContent matcher. The stored bit pattern did not change. Capturing textContent consistently fixes the test without changing the page or assertion's requirement.
- Independent browser reviewers tested the actual rendered light/dark themes at phone and desktop widths, initial unsigned text, signed and comparison definitions, calculation opened before switching views, bit preservation, reset and prior reader isolation. See their reports for coverage and limits.

Final focused rerun, full local/CI outcomes and deployment proof are recorded in the pull request. Passing reruns do not alter original command exit statuses. HEAD remains fixed during full browser validation.

## Full-check findings on the first commit

- PR CI on `52a12eb`: 3,111 unit tests passed; browser run had 1,453 passed, 20 skipped and one failed keyboard/pointer grouping test. Focusing a bit scrolls the taller figure and can leave the prior pointer position hovering another group. The component intentionally highlights either focused or hovered groups. The test now parks the pointer outside the figure before its keyboard-only assertion, then separately tests hover. Exact group count, four-bit grouping, digit association, underline and outline assertions remain.
- Focused corrected keyboard/pointer test: six passed (three repetitions on each browser project), 29.0s. No product or timeout changes.
- Original local full command passed checks, types, all 3,111 unit tests and build, then timed out opening App status in offline batch 1. It was deliberately interrupted to isolate that failure: exit 130, 567 browser tests passed, 14 skipped, one failed, one interrupted, 891 not run. The same offline batch passed independently on the same build in 24.3s. The original failure remains recorded; this is not a local full-suite pass.
