# Independent final reader/checker — 14 Strings and the zero byte

Verdict: **pass for the accepted lesson-14 corrections and relevant shared changes**. No unresolved finding or clear introduced regression found within this review's coverage. No course files edited.

## Reading and prerequisites

Read the current lesson structure, prose, labels, all ten hints, prediction questions/explanations, tasks and model note before consulting the audit summary and implementation coverage plan. Read CLAUDE.md, the style checklist and authoring guide. Inspected the front-page prerequisites and relevant preceding memory, load-width and array passages. The reader assumes lessons 00–13, no later lessons.

No material untaught prerequisite identified. Pointers, byte addresses and load/store syntax are introduced in memory-and-addresses; byte loads and extension in loading-widths; scaling and post-index addressing in array-addresses. ASCII, string and terminator are explained here. The optional opening note explains capacity and C `break`; the required prose and tasks also explain the bounded scan's stopping rules. The distinction between a byte count and displayed-character count is explicit.

## Accepted correction checks

- Both memory predictions now visibly say **PREDICTION**, without the generic one-instruction-per-step disclosure. Real memory steppers retain **STEPPED** and actual Next controls. Both written tasks have exercise roles in the source. This cleanly separates predicting, executing and writing.
- The first prediction asks what the function **returns**, so its execution moment is unambiguous. The initial answer is hidden; its adjacent stepper has no Next control before checking. Checking an intentionally selected option unlocks the stepper and its first Next produces a genuine first instruction/status.
- The changed-loop prediction also has the Prediction badge and unlocks its associated stepper only after checking.
- Hint-heading roles are appropriate. In the bounded-scan ladder, the common-mistake rung explains the forbidden read at zero capacity; Smaller example supplies concrete bytes and a capacity. The marker-count ladder's second rung identifies counting past the terminator, and its third supplies a concrete short example. Remaining rungs progress from partial method to complete solution. No challenge solution is reproduced in this report.
- Initial, gated, after-check and first-step layouts remained legible on phone and desktop in both themes. Source/instruction pairing remains visible; no horizontal document overflow or browser page errors occurred.

## Actual browser coverage and evidence

Chromium against `http://localhost:4292/assembly-lab/#/lesson/zero-terminated-strings`, fresh contexts at 375×900 and 1280×900, each light/dark. Theme was set with raw `assembly-lab:v1:theme` and the resulting HTML data-theme was asserted. All four configurations exercised the opening prediction, inspected the locked stepper, checked a choice, stepped once, revealed the bounded-scan exercise's first three hints, ran its unchanged starter, checked the changed-loop prediction and stepped its newly unlocked figure once. Reviewed source for both full hint ladders and the remaining prose/interactives.

Artifacts in this directory: `reader14-browser.json`, `reader14-page.txt`, `reader14-{375,1280}-{light,dark}-{initial,step,hints}.png`; reproducible probe `check14.mjs`. The hints screenshots scroll to the exercise and include failure results; the text artifact records the three revealed hint headings and content. Personally inspected representative initial/after screenshots across all four configurations and the phone-dark exercise result.

Limits: did not execute every instruction to return, every input, all successful challenge solutions, persistence/reload states or all hint rungs in the browser. Complete hint content was source-reviewed. No automated suite/build or numerical hardware revalidation was run by this reader; root handles the full check separately.
