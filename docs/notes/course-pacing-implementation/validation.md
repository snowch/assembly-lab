# Integration validation

The user authorised the complete pacing plan and explicitly waived saved-work migration.
Source lessons remain as authoring/record provenance only. The published catalogue contains the
short units, with individual routes, challenges, local prediction gates and completion controls.
No platform package is edited. Original machine/compiler records remain unchanged.

## Original failures and corrections

- First catalogue probes and build failed while the separately drafted `arithmeticBits` key was
  not yet present. A later integration probe failed while the new native trace captions were
  still being drafted. These were incomplete-integration failures; neither was a passing build.
  The missing draft fields were supplied, canonical records synchronised and the next build ran.
- First catalogue/introduction checks loaded successfully with 18 passes and 4 failures. Two
  assertions still expected instructions/challenges on their old pages; two named-before-taught
  exceptions still targeted the original pages. Updated those assertions to the actual teaching
  pages, retaining the distinction between not-yet-taught and not-allowed-in-this-exercise.
- Subsequent integration check passed 26 of 28 tests; both failures were the native-only ADR
  exception following the loading/runtime split. Moved the exception to runtime-startup.
- First full local unit command: 159 files passed, 7 failed; 2,943 tests passed and 33 failed
  (353.70 seconds). Failures included old branch and fields-owner assumptions, a transient
  draft/canonical mismatch and a completion test assuming the course still had a single-lesson
  module. Authors' focused corrections and original failures are recorded in their group notes.
- Second full local unit command encountered the old expectation that negation was already taught
  on the counter page. Negation now belongs to the following arithmetic page. The test was changed
  to assert this actual teaching boundary; its focused 24-test rerun passed. Full command result:
  166 files passed, 1 failed; 3,090 tests passed and 1 failed (362.37 seconds). The original
  failure remains a failure; a fresh full rerun follows the focused correction.

## Independent review corrections

The first integrated build had 63 pages. Review found further multiple-goal pages in flags,
subtraction, shifts, branches, memory transfers, recursion and native layout/debugging. Those
were split at complete activities or practical checkpoints. No trace or terminal command group
was cut in half. The final candidate has 73 pages.

- A subtraction summary preceded its moved negation prediction; moved the experiment before the
  summary and supplied a counter-only closing check on the preceding page.
- Defined EEPROM locally before the preparation metadata action.
- Fixed stale next/previous-page references, named the native CHALLENGE activity explicitly,
  and made the working native build's origin and fresh GDB/QEMU setup explicit on each page.
- Corrected a fixed-input SERVICE caption that incorrectly suggested an input selector.

## Built candidates and checks

- Build 1 failed during draft integration, as recorded above.
- First successful integrated build: 42.40 seconds. Its inventory is inventory-initial.json,
  explicitly initial/gated visible text, not reading time. It is not evidence for later edits.
- Expanded candidate build: 25.81 seconds. Source frozen for independent final browser checks.
- First M1–4 critical browser sample on the earlier build: 57 passed, 5 expected skips.
- First M10–A browser run on the earlier build: 128 passed, 2 expected skips (12.1 minutes).
  Subsequent source changes require their own final browser results; the earlier results are
  retained separately rather than relabelled as final.
- Author focused source/component/canonical/model results and independent review probe limits
  are in 1-4.md, 5-9.md, 10-a.md, shared-tests.md and the two review notes.

## Final integration checks

The third full local unit command passed: **167 files and 3,091 tests**, exit 0
(277.36 seconds). The later semantic-link and local-paragraph corrections passed a focused
four-file rerun: **51 tests**, exit 0 (27.84 seconds). Final formatting, typechecking, copyright,
platform-copy and whitespace checks passed. Native GNU/QEMU tools are unavailable locally;
their existing CI jobs must pass before merge. No physical Pi result is claimed.

The first two-worker full browser attempt stopped after 709 reported cases: 686 passed,
9 failed and 14 skipped. Its process was no longer running after session resumption and no
final Playwright summary or exit code was available. It is incomplete evidence, not a pass.
Failures were the stale Module 0 width link, two subtraction-view owner routes, the moved cap
editor's offline routes, and a plan test still assuming constants occupied the second lesson.
The real link was corrected in source/canonical prose; tests now visit the actual published
owners and retain their state, numerical, layout, offline and lifecycle assertions.

Build 4 completed in **10.76 seconds**. It adds only the corrected Module 0 width link and the
accepted changed-C trim: comparison principle and teaching-subset qualification remain, while
the repeated service-administration paragraph is omitted. The optional compiler panel's own
pre-request disclosure, attribution, policy link, caching and failure behaviour remain.
The changed-C/GCC browser sample passed **10 tests**, exit 0 (46.4 seconds).
The focused corrected-route/offline sample passed **20 tests**, exit 0 (2.2 minutes), including
the width link, both subtraction views, offline compilation/grading, restart guards, interrupted
downloads, deferred offline-copy removal and the plan's new constant-page entry.

Both independent final Build 4 rechecks are ready. Their appended records distinguish earlier
custom-probe locator failures from the successful final probes and identify browser states,
source-only checks and remaining native/hardware limits.

The complete Build 4 local browser command ran all **1,446 cases** with four workers:
**1,420 passed, 20 skipped and 6 failed**, exit 1 (36.6 minutes). Its failures are retained:

- The single offline whole-course test reached its unchanged 120-second deadline on both
  projects. Independent trace inspection found 61 successful lesson navigations on desktop,
  with no navigation error, before the status click exhausted the remaining budget. The
  catalogue has grown from 34 to 73 pages. The correction partitions every route into fresh
  20/20/20/13-page offline sessions, each still downloading the entire course and verifying
  Where next and every downloadable asset's bytes/integrity. The timeout is unchanged.
- The four Where next discoverability cases still opened recursive-calls to find the final
  Module 9 invitation. The final unit is now making-recursive-progress. The test now selects
  that final published unit; all invitation, download, keyboard, layout, reload and footer
  assertions remain. The app's module-boundary condition was already correct.

The semantic link audit also found two links still naming the first Module 9 unit by its old
title. Returning to the caller and Where next now use the approved “Saving a return address”
title and their canonical records match. Routes and promises are unchanged. Broader descriptive
native/Pi entry labels remain appropriate and are retained; see the independent technical note.

Build 5 and the focused final reruns below verify these small corrections. A passing focused
rerun does not change the complete Build 4 command's exit status. Final CI/native/deployment
evidence will be recorded on the pull request.

Build 5 completed in **20.95 seconds**. Final focused canonical/facts/retention verification
passed **19 tests in 5 files**, exit 0 (7.36 seconds). The corrected complete-offline batches
and Where next discovery checks passed **12 browser cases**, exit 0 (2.3 minutes), covering
all 73 routes on both projects. Final formatting, types, copyright, platform-copy and whitespace
checks passed. Both final independent reviewers are ready; their final Build 5 appendices
record the two label changes, route destinations, relevant activity states and source-only
test-boundary checks. No physical-board or local native-tool execution is claimed.

## First CI check and vocabulary-home correction

The first PR and push checks on `7c6c63c` passed GNU/QEMU differential and native/Pi source
jobs, but each full unit run failed before browser tests: **3,077 passed and 14 failed in
13 files**. All failures reported the same newly matching `x register` term in Module 0's
corrected width-lesson link. The earlier full local unit pass preceded that link correction;
its focused rerun did not include the global term-gate assertions. These CI failures remain
failures: runs 41110498340 and 41110444263.

Independent source review confirmed that the visible Module 0 caption and diagram already
define the full-width x name and lower-32-bit w name before the link. Their vocabulary homes
now match that actual introduction in one-addition, rather than the later width-writing unit.
Both original and published catalogues retain a single home; the later unit still teaches
writing the two widths. No term exemption, gate weakening, new learner wording or DOM change
was added. The regression assertion checks both catalogues' complete term gates and unique
homes, while existing machine-grounded width/diagram checks remain.

The first fresh full local unit command after the metadata correction passed **3,090 tests**
and failed **one** touch-editor test on its existing 20-second deadline (166 files passed,
one failed; 263.06 seconds, exit 1). A worker-termination warning was also emitted. Every global
term-gate assertion passed. No editor behaviour, test assertion or timeout was changed. A fresh
full run caps local workers at two and avoids concurrent CPU-heavy checks; its result is separate
from this failed command.

The two-worker full rerun also passed **3,090 tests** and failed **one**, this time a different,
unchanged 64-bit prediction UI test on its existing 30-second deadline (166 files passed,
one failed; 237.31 seconds, exit 1). The earlier touch-editor case passed in this run; all
vocabulary assertions passed again. Both results remain failures. No source or expectation
in either timed-out UI case was changed; targeted single-worker checks and the complete CI
suite provide the next verification, without another timeout or tolerance change.

The targeted single-worker command passed **70 tests in four files**, exit 0 (28.65 seconds),
including both previously timed-out UI cases, complete register-figure/editor suites and the
Fundamentals/constant catalogue checks. The full-run deadline failures above are not relabelled
as passes. The independent final metadata audit confirms both catalogues' vocabulary homes
and empty term gates; final remote CI remains the merge gate.

The initial full browser command used the default single worker, then was deliberately interrupted
(exit130) to restart the identical suite with two local workers. Its partial result was 40 passed, one failed update-dialog preparation (Restart to update
button not found), one interrupted typing test and 1,404 not run. The failure is retained
separately; no cause was established. The replacement changes concurrency only; no assertion, timeout or skip was
relaxed. CI retains its configured single-worker command.
