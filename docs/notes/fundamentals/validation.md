# Validation record

Copyright © 2026 Christopher Snow

## Scope and decisions

Four new separately linked lessons precede the existing trip lesson. Both reuse and subtraction
examples are visible on their page; no Run action reveals another curriculum item. The old trip
URL and challenge IDs are retained. Its prerequisite links support existing bookmarks. Old
pager position is not copied into the new independent lesson stores; existing trip exercise work
keeps its keys. Platform packages were not changed.

The later-course audit examined all 25 subsequent lessons. It found no second equivalent hidden
sequential activity pager. Its representative four-context browser checks and remaining
source-only coverage are recorded in `later-activity-audit.md`; this is not a claim that every
later lesson has undergone a new full novice pacing review.

Independent learner reviews cover each of the five affected lessons. Accepted findings were:

- Scope the first addition's explanation to that instruction, not every instruction.
- Remove a misleading figure direction from the sequence explanation.
- Make the four “Smaller example” hints concrete, using checked worked cases.
- Frame the tiny function's below-figure ready-to-return question retrospectively.
- Teach horizontal navigation beside the trip listing on narrow screens; the same paired
  listing gesture is used later in the course.

Technical review confirms those source corrections and their canonical prose. Readers also
noted minor repetition under the fixed ten-section schema. Those suggestions do not establish a
missing mechanism. The duplicate function completion statement was removed; its live returned status already
says what happened. The arithmetic stop note remains because those figures show only a prefix.

## Commands before final browser verification

- Production build passed. An additional production build incorporated the first copy fixes.
- Typecheck, repository copyright check, platform-copy check, `git diff --check`, and full
  Prettier check passed.
- Independent exact GNU/QEMU corpus runs: primitives **7 calls / 23 instruction states**, tiny
  function **5 calls / 15 states**, **zero differences**. An initial substring-like `--only`
  command matched zero programs; it was corrected and supplies no evidence.
- Initial integration unit command: **138 passed / 1 failed**, due to reserved vocabulary in
  ordinary uses of “carry”. Copy was revised; term-gate reruns pass.
- Full unit run: **2844 passed / 1 failed**, across 144 files. The failure was canonical prose
  changing while that worker held the earlier imported hint copy. It is retained as an original
  failed command, not reported as a full-suite pass.
- Stable-copy focused rerun of Fundamentals, synthesis canonical copy, instruction introductions
  and plan: **40 passed**, four files. Independent technical focused runs and their original
  canonical-edit failures are recorded separately in `technical-review.md`.

Final production browser results and CI state are added after completion. Each reader report
separates actual browser states from source checks and lists the prerequisites it assumed.

## Initial focused browser command

`AL_PORT=4331 npx playwright test fundamentals.spec.ts meet-the-machine.spec.ts` completed
with **exit 1: 136 passed, 2 skipped, 2 failed** (140 cases, 8.0 minutes). The existing two
project-specific skips remain explicit. The 104 synthesis cases produced 102 passes / 2 skips;
the 36 new Fundamentals cases produced 34 passes / 2 failures.

- The subtraction desktop-light test received a base-page HTTP 404 while the managing session
  replaced dist during the run. That overlapping rebuild was an orchestration mistake, not a
  successful check. Its trace was captured in local test-results; the later full run replaces
  that directory, so the original trace is not retained as a repository artifact.
- The desktop-dark tiny-function pane-navigation test measured a 23px window scroll shift.
  Focus stayed local. A fresh direct reproduction measured unchanged window position, unchanged
  44px button height and unchanged 179.45px listing height; the same strict test passed in the
  other three contexts. The strict assertion was retained for the full final-build run.

These original results are not replaced by a later rerun. No tolerance was increased.

## First full check

The full command passed formatting, copyright, platform integrity, typecheck, **144 unit files /
2845 tests**, and production build. Its browser stage reproduced the desktop-dark pane-navigation
failure: the second button click (“Show C”) measured window position **1507 → 1106**. The strict
assertion was retained. The run was deliberately terminated after case 194 to investigate rather
than spend the remaining full run on a known failure; command exit **143**, not a full check pass.
The new trace was copied before another run could replace test-results:
`/tmp/fundamentals-scroll-failure/full-check-trace.zip`. It is a local diagnostic, not a committed
repository artifact. This failure and the final correction remain separate from earlier results.

The independent checker inspected before/input/after snapshots in that trace. The **input**
snapshot already had window position 1106 while the control still read “Show C”; the pane handler
had not run. The surrounding offline notice had changed from unavailable to ready. The test now
awaits that actual ready state before scrolling to the control and capturing the baseline, as
the dedicated offline tests already do. Normal pointer actions, focus assertions and exact
window-position equality remain unchanged. No application code or scroll tolerance was changed
for this diagnostic correction.

## Pane-navigation diagnostic details

The first full check's trace was also preserved locally as
`/tmp/fundamentals-full-scroll-failure.zip`. Its `before@call@4339` snapshot records window
scroll 1507 and `data-offline="unavailable"`; `input@call@4339` already records scroll 1106
and `data-offline="ready"`. The click log records an unstable element and Playwright's own
scroll into view. This independently confirms the pre-handler timing described above.

A diagnostic script in `/tmp/diagnose-pane.mjs` instrumented scroll, focus and layout-shift
events for twelve fresh desktop-dark contexts. All twenty-four pane clicks retained exact
window position; this slower diagnostic gave the notice time to settle and did not reproduce
the race. The test's new readiness precondition uses the same 30-second deadline as the
existing offline tests. The original failed commands and later focused results remain separate.

Focused final-build rerun:
`AL_PORT=4333 npx playwright test fundamentals.spec.ts --grep 'tiny function distinguishes' --repeat-each=3`
completed with **exit 0: 12 passed, no skips** (1.2 minutes). Each phone/desktop and actual
light/dark combination passed three times with the strict scroll, focus, paired-pane,
restore and reset assertions. One phone-dark case took 18.9 seconds; the actual readiness
condition, rather than a fixed delay, remained the precondition. The complete repository check
is restarted separately from these focused results.

## Environment interruption and resumable browser coverage

The corrected full command again passed **144 unit files / 2845 tests** and production build.
The application bundle was unchanged (`index-C1z34Iul.js`). The browser log reached case 303
without a failing case before the execution environment restarted; the process was no longer
running afterwards. This interrupted command has no successful full-check exit status and is
not reported as a full-suite pass.

To complete browser coverage durably, the unchanged production build is tested in disjoint file
batches for both configured projects. The temporary runner is
`/tmp/fundamentals-batches/run.py`; each batch has its own fresh port, artifacts directory, JSON
report, log and exit-status file. Each of the 26 browser test files is assigned exactly once
per project. Desktop and phone runners may execute concurrently; each retains Playwright's
single worker. A completed successful batch can be retained across an environment interruption.
The batches rerun the complete browser inventory rather than infer passing test IDs from the
partial log. Aggregate results are recorded separately from both interrupted full commands.

The first detached batch launch ended without JSON reports or status files and supplies no
completed-case evidence. The same runner was restarted in tracked execution sessions; only
completed JSON reports with successful exit-status files count towards the aggregate below.

## Final local results

All fourteen tracked browser batches completed with **exit 0**. Together they cover the full
**1138-case** inventory: **1115 passed, 23 explicit skips, zero unexpected failures and zero
flaky results**. The batches use every test file exactly once for each configured project;
the independent ID-level coverage and unchanged-input check is in `batch-verification.md`.
The earlier interrupted commands and their original outcomes remain recorded above.

The last full command passed **2845 unit tests**, formatting, copyright, platform integrity,
typecheck and production build before its environment interruption. Supported snippets also
passed GNU/QEMU comparison (**12 calls / 38 instruction states, zero differences**). Each of the
five affected lessons passed independent learner and final built-page review at phone/desktop
widths in actual light/dark themes. No application or browser-test inputs changed during the
successful batch run. CI on the pull request will independently run the monolithic check.
