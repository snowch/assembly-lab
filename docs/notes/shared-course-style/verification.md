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

## Flags integration assertions under the shared layout

The first two-worker complete attempt passed all 4,041 unit tests/build stages,
then exposed six flags-route browser failures (151 passed browser entries before
it was deliberately stopped). It is an **interrupted, known-failing** complete
attempt, not a full success. Three obsolete assumptions caused the failures in
both themes: the helper clicked the hidden desktop sidebar, the header retained
an old 68/74px ceiling, and the range test demanded stacked cards for every
viewport below 1280px despite the wider reading area. Original traces were archived
at `/tmp/arm-flags-failure-f3qnbw5x` before rerunning tests.

An independent fresh-document 14-state matrix checked 320/375/834/920/1280px,
both themes and DejaVu fallback at 375/920px. All complete bounds were single-line
and contained; paired bounds shared baselines, cards remained separate/aligned,
and the page had no horizontal overflow. Measured header heights matched the
previously recorded 132/96px narrow/wide budget. The independent reviewer found
no CSS defect; exact measurements and screenshots are recorded in its note.

Corrections use the actual On this page disclosure at every width and preserve
current-section, route and close assertions. The final-current check addresses
that active nav. Header ceilings use the independently measured shared-header
budget. The range test preserves exact text, containment, single-line complete
bounds, paired baselines, 1280px pairing and submission/reset gates; it checks
actual stacked order or paired separation instead of an obsolete viewport rule.
These test-only corrections do not change the model or learner-facing layout.

The focused corrective rerun completed successfully: **16/16 passed**, covering
both projects, both themes, active outline use, header/skip-link behavior, complete
range geometry and the model's existing prediction/check/reset controls
(`/tmp/arm-flags-focused-final.log`). The exact complete pipeline is restarted as
`/tmp/arm-check-reviewed-final.log`; its result will be reported separately from
this focused success.


## Whole-suite assumption audit and final focused evidence

The environment interruption ended `/tmp/arm-check-reviewed-final.log` after its
complete **224 files / 4,041 unit tests**, build, and the first browser entries.
That local complete attempt is interrupted; no 1,560-case success is inferred.
The unchanged exact script in current-head CI supplies full-suite completion
proof separately from these interrupted local runs.

At the coordinator's request, all 62 browser specs and nine helpers were audited
for old sidebar selectors, header ceilings, viewport-only stacking rules, legacy
App status summaries, absolute card coordinates, footer counts, hidden back
controls and global lesson-link counts. Correct checks of component containment,
font fallback, complete values, focus, gating and learner state were retained.
The remaining fixture changes use the visible Course lessons → Course overview
path, actual modal/details, the six-link footer including Source, centred wide
intro/live figure framing, and actual lesson-content bounds. Optional Module A
still opens and checks status details, then checks Escape focus and figures.

The audit identified two product corrections. New menu links now reuse the
existing approved course-reference formatter, retaining the established M/L
numbering contract. On phones, an inherited Next link `grid-column: 2` created an
implicit second column despite the one-column footer rule, squeezing Previous to
46px. A narrowly scoped column reset fixes that real defect. Equal widths remain
required; narrow cards stack, wide cards retain equal row/height, and completion
must precede the first card. Independent built-page checks verify the correction,
including 343px phone cards with a 20px gap. See `independent-review.md` for the
exact build, screenshots, measured frames and separate command results.

The affected-suite command completed **exit 1: 109 passed, six failed, one
skipped** (`/tmp/arm-audited-focused-final.log`). Four failures required an obsolete
exact height match between separate completion/reset action groups; both controls
already met the required 44px minimum. The independent viewport/theme and
initial/marked matrix confirmed that no CSS change was appropriate. Two failures
were this managing session's test ordering: Escape hid the menu before a role
locator checked its return URL. Assertions now check both minimum targets and
check the URL before Escape, preserving label/style, card geometry and keyboard
navigation evidence. The corrective focused command then **passed 6/6**
(`/tmp/arm-audited-corrections-final.log`). This does not turn the original failed
command into a success.

Final local formatting, copyright, untouched-platform integrity and strict types
passed. The existing completion and course-reference unit files passed **12/12**
(`/tmp/arm-audit-focused-units.log`). The final exact current-head CI result is
reported in PR 171's checks and handoff; functional checks are not evidence of
learning effectiveness.
