# Independent verification: hexadecimal feedback space

Accepted. The shared feedback area's reserved height now follows its actual line height. No existing test threshold or assertion changes, and no learner text or arithmetic changes.

Reviewed the source diff in `packages/views/src/module1.css`: only `min-height: 3.2em` → `2lh` and desktop `1.6em` → `1lh`. The inherited course line height is 1.65. An `lh` unit is appropriate here because the area reserves one or two lines of the same element's feedback text, rather than a fixed multiple of font size that can disagree with its line spacing. Chromium reports support for these units.

The immutable candidate output was `/workspace/scratch/course-style-feedback-candidate`, served independently on port 4468. Its build ID is `3537f63a06d2c0c44903ce0b9493609fc331f0174bdc15525fb669a27b6f8c84`; `release.json` SHA-256 is `d4bba1c48fd374ea3c516d31f24d6c6b0d8f483fc54432d9047e3dc8ded86404`. The footer metadata still identifies parent commit `041831d7d5d1cf15300db577a8ecd0fb78355020`, because the two-line CSS correction had not yet been committed when this candidate was built. That distinction is preserved rather than calling it a final committed-source build.

Ran the existing affected test without edits:

`npx playwright test -c /tmp/feedback-review.config.ts tests/educational/one-pattern-three-readings.spec.ts --grep 'changes no bit for text'`

Exit 0: **2 passed**, desktop and phone, no skips or retries. Log: `/tmp/feedback-review-focused.log`. The external config retains the repository projects, worker count, timeout and test source, and only selects an isolated production outDir/server/result path.

Independently drove eight states: 375px and 1280px × actual light and dark themes × the M1 L2 challenge and its M1 L1 hexadecimal reader sibling. Each state checks the empty-message area, all three invalid strings (`xyz`, `fffffffff`, `0xg1`) and valid recovery (`10`). Invalid text displays the feedback and `aria-invalid`, and leaves the selected bits unchanged. Valid text clears both and synchronises the bits. Exact following-row offset, container height and following-row width/height stay equal to their baseline throughout. No page overflows horizontally. Actual backgrounds are `rgb(247, 250, 248)` and `rgb(16, 27, 26)`.

| Width | Feedback line height | Reserved feedback height | M1 L2 actions' relative Y | M1 L1 next row's relative Y |
| --- | --- | --- | --- | --- |
| 375px | 24.75px | 49.5px (two lines) | 696.59375px | 498.25px |
| 1280px | 24.75px | 24.75px (one line) | 537.453125px | 308px |

Both themes produce the same geometry. Matrix output: `/tmp/feedback-review-matrix.json`. Visually inspected captured challenge states at both widths in both themes: the feedback is legible, wraps to two lines on phone, stays clear of the next field, and retains a visible input focus ring. Images: `/tmp/feedback-review-{375,1280}-{light,dark}.png`.

Source sibling check: `HexEntry` is used by `AnswerEditor` for explicitly opted-in answer fields and by `RegisterReader` in its `hexOnly` branch. Published uses are the M1 L2 challenge and the M1 L1 reader, both included above. Unit tests also instantiate the component; this review did not rerun the full unit suite. No new assumption or term is introduced by this CSS-only correction.

No remaining finding in this scope. This is focused Chromium evidence, not a full-suite verdict or a claim about untested browsers. The earlier broad run's failure remains a failure of its original candidate. The final committed-source required check and CI remain the parent's responsibility. Reviewer changed neither product nor tests, and did not touch the ongoing full-suite worktree or its build.
