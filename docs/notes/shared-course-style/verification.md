# Shared style verification

Copyright © 2026 Christopher Snow.

The first focused UI command exited 1: 12 passed, 1 failed. It preserved the old 70 px single-row header expectation. The new shared header deliberately keeps App status text visible and wraps the retained tools on narrow screens. Measured on build `7f6c8f688d0c4c62f7fcddb72455f05b2e9054e63a69f50fc1a8d0fb877aa1d5`: 129.55 px at 320, 375, 414 and 430 px; 92 px at 768 and 834 px; 92.5 px at 1280 px. Theme remains exactly 44×44 px, retained controls remain within the viewport, and no width scrolls sideways. The updated bounds are 132 px narrow / 96 px wide and keep the control/overflow assertions.

Independent browser review identified inherited white homepage title text after the hero moved to the page surface (approximately 1.06:1 in light theme), and underlying desktop Calculator/Reference Escape handlers prevented/dismissed the top App status modal. Source fixes bind intro text to page foregrounds and make the tool handlers defer to the active modal/already handled key. A dedicated browser regression checks actual heading contrast and tool values/lookups across App status Escape. Final independent verification is recorded separately.

A first broad source command was interrupted after formatting/type stages and after Vitest started; its log does not establish a full unit result. The first combined browser lifecycle run had a shared Playwright output-directory ENOENT from a concurrent focused command and a cancellation case requiring isolated rerun. Those original runs remain interrupted/failed, separate from final checks. Subsequent suites use unique output paths.

Final command results and publication evidence are appended below. Functional checks do not establish learning effectiveness.

## Final integration handoff

The bounded duplicate unit run was stopped deliberately when the exact `npm run
check` pipeline began; neither interrupted unit command is a passing full-suite
result. The final pipeline log is `/tmp/arm-check-final.log`. Browser suites use a
unique output directory when run separately, avoiding the earlier shared trace
output collision.

Independent review is recorded in `independent-review.md`. The final integration
accepts all three low-severity findings: the Course lessons control remains in the
combined location row while only its outline expands below; the duplicated
hash-navigation explanation was removed; the engine note now describes verified
server retention and links the current optional-save contract. Selecting the
already-current lesson also closes the outline without remounting its simulator.
A browser regression checks row stability, preserved simulation, current-link
closure and Escape focus return.

Local formatting, copyright and platform-copy integrity stages of the final exact
pipeline passed. Type checking and subsequent stages are still running; this is a
progress record, not a full-suite success.
