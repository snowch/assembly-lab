# Independent browser-batch coverage review

Copyright © 2026 Christopher Snow

This reviewer did not author the implementation, its tests, or the batch runner. This is a
verification-engineering review, separate from the recorded lesson readers and technical review.
It does not repeat their learner or instruction-set assessments.

## Why the execution is separate

The managing session reports that the first full check was terminated after a reproduced test
preparation failure. A second full check passed its earlier stages, including 144 unit files /
2845 tests and the build, but an environment restart stopped its browser process after case 303.
The partial log `/tmp/fundamentals-check-final.log` does not contain a completed browser summary
or an “All checks passed” line. It must not be described as a passing monolithic `npm run check`.
Earlier failed and focused commands remain separate in `validation.md`.

The continuation runs the entire browser inventory again, divided into resumable batches. It
therefore repeats some already-executed cases rather than inferring unexecuted results from the
partial run. Aggregate browser results, if complete, are a distinct result from that interrupted
full command.

## Runner and isolation inspection

Inspected `/tmp/fundamentals-batches/run.py`, `playwright.config.ts`, the test-file inventory,
and the offline lifecycle test's deployment helper.

- All **26** `tests/educational/*.spec.ts` files occur exactly once across groups a–g. No file is
  missing, extra or duplicated. Each group is selected separately for `desktop` and `phone`.
- The existing project settings remain unchanged: 1280 × 800 desktop, 375 × 812 touch/mobile
  phone, Chromium, one worker per command, zero retries and the normal test timeout.
- Each command receives its own `AL_PORT`; the configured preview requires that port to be
  unused and does not reuse an existing server. The two project runners therefore use separate
  origins and browser contexts. A close-and-bind ephemeral-port race would fail visibly through
  strict-port startup, rather than silently test another server.
- Each batch has separate JSON, log, command, status and Playwright artifact paths. One command
  cannot delete another batch's retained artifacts. Only an explicit exit-zero status allows a
  completed batch to be skipped on resumption. A nonzero result stops that project runner.
- The offline lifecycle helper reads the production files and serves modified releases from
  its own in-memory HTTP server; it does not rewrite the shared dist tree.

No coverage or isolation blocker was found in this inspection. Running the two isolated project
commands concurrently differs from the single command's scheduling; report it as batch
execution, not an unchanged monolithic command result.

## Unchanged inputs

Recorded SHA256 hashes of the browser test/helper files, Playwright configuration and application
entry assets in `/tmp/fundamentals-batches/reviewer-manifest.json` for comparison after completion.
At inspection the production JavaScript is `index-C1z34Iul.js`, SHA256
`e4ea64a5a618507eab76a314bf09fbafa874fd69d36c6221d2b5c446fcd55ea0`; CSS is
`index-DRyjSuVo.css`, SHA256
`492d3af5e3631d3f75e990cfd7a357a8b5454c77117b7f95bc291a9011145e18`.

These names agree with the prior build-continuity record. The manifest was taken during the
first batches; it does not retrospectively prove that no file changed before that observation.
The managing session's freeze record supplies that earlier continuity. Any later application or
test edit invalidates the affected batch results and requires an appropriate rerun.

## Completion and limits

At the initial review, batch execution was pending and no aggregate verdict was claimed.
The completed verification below compares the JSON test IDs with the collected whole-suite
inventory, checks outcomes and every exit status, and rechecks the unchanged-input manifest.

This reviewer has not launched browsers, rebuilt the application or edited application/test
content. Whole-suite `--list` collection is metadata inspection, not a browser test execution.

## Incremental completed-batch check

Independently read the completed `desktop-a` and `phone-a` JSON reports and their exit-zero
status files. Each contains **97** unique expected-inventory IDs: **96 expected passes / 1
skip / 0 unexpected / 0 flaky**, with no reporter errors. Combined, they contain **194** distinct
IDs and no duplicates or IDs outside the collected inventory. All **36** Fundamentals cases
across both projects passed.

The skips are the existing input-mode counterpart checks: phone-only tapping is skipped on
desktop, and desktop-only typing is skipped on phone. They are explicit skips, not passes.
The recorded test/helper/config/application-asset manifest is unchanged at this check.

Only completed reports with matching exit-zero status count towards coverage. An earlier runner
attempt that produced no completed report supplies no test-result evidence. Other batches remain
pending; these two reports do not establish a full browser-suite pass.

## Authoring workflow guard review

Independently reviewed the new discoverability paragraph in `docs/authoring.md` and the separate
passes paragraph in `implementation-brief.md`. The latter agrees with the recorded separate
copy, implementation, integration, technical, learner and final-checking passes, using inherited
settings without an explicit model override.

The discoverability guard addresses the observed defect and expressly preserves ordinary
stepping, named comparisons, optional details and prediction/solution gates. It does not require
an opcode per lesson or splitting every comparison into separate course-plan entries.

One low-severity precision recommendation was sent to the managing session: “a way to reach it
before the learner completes another activity” could imply bypassing valid prerequisite gates.
Prefer a discoverable name and entry/route before earlier completion, while allowing a legitimate
gate to control execution. The later explicit gate exception already narrows the intended rule;
this is a wording clarification, not an application or coverage blocker.


## Final completed verification

Independently read all fourteen completed JSON reports and their matching status files. Every
status is **0**; every report has **zero reporter errors**, **zero unexpected failures** and
**zero flaky results**. The result records themselves contain **1115 `passed` outcomes** and
**23 `skipped` outcomes**; none is an expected failure being counted as a pass.

| Batch | Desktop passed / skipped | Phone passed / skipped |
| --- | --- | --- |
| a | 96 / 1 | 96 / 1 |
| b | 86 / 2 | 86 / 2 |
| c | 28 / 2 | 30 / 0 |
| d | 122 / 5 | 123 / 4 |
| e | 65 / 3 | 68 / 0 |
| f | 36 / 2 | 38 / 0 |
| g | 121 / 0 | 120 / 1 |
| Total | **554 / 15** | **561 / 8** |

Together the reports contain **1138 IDs, all unique**. Their ID set exactly equals the whole-suite
metadata inventory: **no missing, extra or duplicate ID**. Each project covers **569** cases.
Metadata-only collection reports were excluded from the execution aggregate. The temporary
machine-readable independent comparison is `/tmp/fundamentals-batches/reviewer-final-results.json`.

The **23 skips** are explicit project-specific alternatives: desktop skips phone-only tapping,
touch-editor and narrow-screen checks; phone skips desktop typing and one desk-only cover-layout
check. Each skipped case has a matching file/line/column/title case that **passed in the other
project**. None is a newly hidden failure or a test without an exercised project counterpart.
The 23 skipped outcomes remain skips in the totals rather than being added to the pass count.

Recomputed every entry in the reviewer manifest after all batches completed. Browser tests,
helpers, Playwright configuration and the application entry assets are **unchanged**. The final
JavaScript and CSS hashes equal those recorded above. The new engineering-only authoring and
review-note changes do not change those tested inputs.

Reviewed the final `validation.md` outcome paragraphs: they correctly distinguish **1115 browser
passes / 23 explicit skips in complete batches** from interrupted monolithic commands. The
reported **2845 unit tests** and earlier-stage/build successes are separately scoped. This review
does not convert either interrupted `npm run check` invocation into an exit-zero full command.
CI's monolithic check remains a separate outcome to report when available.

The authoring guard now says “a discoverable entry” and expressly states that a valid prerequisite
gate can control execution. This resolves the low-severity wording concern above while retaining
the requirement to announce required activities and list distinct lessons in the plan. No further
overrestrictive claim was found. The separate-passes paragraph remains consistent with the
recorded authoring/review process.

**Final verdict:** complete browser-inventory coverage verified, with **1115 passes, 23 explicit
skips, zero failures/flaky outcomes**, unchanged tested inputs and no coverage blocker. This is
an aggregate browser-batch verdict; application semantics and learner understanding are covered
by the separate technical and built-page reader records.
