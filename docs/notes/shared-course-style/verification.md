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

The exact local pipeline subsequently passed TypeScript, all **224 unit/integration
files (4,040 tests)** and the production build. It then started the complete
**1,560-case desktop/phone browser suite**; completion is tracked in the PR checks
and final handoff rather than inferred from the focused results below.

The initial pushed CI run at `481864e` failed TypeScript because the already-tested
`offline.ts` integration changes had been omitted from that intermediate commit.
They were included in `9919d61`; the local complete type/unit/build stages above
run with that integration present. That original CI command remains a failed run.
Obsolete runs were cancelled after newer commits superseded them.

The previously failing cancellation scenario was rerun alone with a unique trace
output directory: **1/1 passed** (`/tmp/arm-cancel-isolated.log`). It cancelled a
real transfer, reopened the prior complete course offline, resumed preparation
and restarted to the intended replacement. Final independent disposition checks
also passed **1/1** on the reviewed build; their exact identity and screenshots
are recorded by the independent reviewer.

A final publication-helper reread found that pre-immutable tabs still request
original content-addressed `assets/` URLs. Keeping only the immutable copies was
insufficient. Publication now preserves those original verified URLs too, and
refuses an existing same-URL/different-byte collision rather than overwriting the
current asset. The retention filesystem suite passed **7/7**, including legacy
original URLs and refusal to overwrite current bytes
(`/tmp/arm-retention-final.log`). This adapter-only change does not change the
reviewed lesson/runtime layout. The final head's complete CI run, including this
additional regression, is available under
[PR 171 checks](https://github.com/snowch/assembly-lab/pull/171/checks).

## Supported parallel complete run

Recent successful main CI runs took approximately 39–48 minutes (for example
`45076545575`, 47m44s). The serial local run above was deliberately stopped after
**114 passed browser cases**, with no assertion failure, while still early in its
1,560-case inventory. It remains an interrupted full run, not a full success.

At the coordinating session's request, Playwright now uses its supported two-worker
setting. Browser contexts isolate their storage/workers; release fixtures bind
independent ephemeral origins and keep releases in per-test memory. Tests do not
modify shared source/build assets. Per-file order, complete desktop/phone
inventory, assertions, timeouts and zero retries remain unchanged. The exact
`npm run check` script is unchanged and restarted as
`/tmp/arm-check-parallel-final.log`. The same configuration applies locally and in
CI; final results remain associated with their actual commands and head commits.
