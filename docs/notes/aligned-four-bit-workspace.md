# Aligned four-bit working area

User-approved goal: support mental column addition in the fresh subtraction exercise. The supplied first pattern now sits above the learner's opposite pattern and result. These remain the original two answer fields, with their IDs and accessible names retained; no second copy or computed answer is supplied.

The editor is selected only through the exercise's explicit initial editor configuration. Its supplied pattern is the existing model's public input. Unconfigured answer editors, the arithmetic model, grader, test cases and hint/solution gates are unchanged. Carry notes are explicitly optional and ungraded, stored in artifact data rather than answers, and cleared/restored by the existing challenge store. Whitespace is formatting only; partial, malformed and five-bit answers remain editable and grader-rejected.

A separate agent implemented the editor, labels and scoped styles. Independent learner/technical review inspected 320/375/1280 pixel views in both themes and measured actual DOM glyph centres. All answer-row and note-column centres agreed exactly. Real clipboard paste, visible keyboard focus, wrong/blank/success states, restoration, completion and Clear work were checked without exposing a fresh exercise answer in the UI. Evidence: `/tmp/four-bit-workspace-review/review.md`. No screen-reader application, physical touch-device session or novice study is claimed.

Focused unit checks: 19 tests across the new editor, four-bit lesson and existing grouped-answer files passed. The first full check stopped at a TypeScript optional-fixture access in the new test; schema parsing now receives the optional fixture value safely. The corrected full check passed types and continued into the repository tests.

The first four browser cases failed because the new measurement helper passed an unsupported computed font shorthand to Canvas, causing it to measure a fallback font. Using explicit font properties corrected the helper; independent DOM Range measurements confirmed that product alignment was already correct. The final four educational cases passed, including actual alignment, ignored scratch notes, five-bit rejection, spaced paste, persistence and clearing. Earlier failures remain distinct from the passing rerun.

Formatting, diff checks and production build passed. Full CI runs against the final PR commit; its outcome is separate from focused verification. The previous method panel remains part of this PR. Unrelated untracked Pi material is untouched.
