# Independent technical review: course pacing

Separate technical/sceptical reviewer; no implementation edits. Reviewed the implementation
brief, consolidated pacing review and rechecks, repository guidance, split helper, published
catalogue, new copy, instruction introductions and affected tests. Model/effort inherited from
the managing session. Saved-work migration is explicitly waived by the user.

## First integrated pass

This pass covers the first 63-page catalogue and build
`04a5ac1490ed5fe216ece2518831fad4db87958c0590eb68ae1e339f60d62c35` on port 4415.
Further accepted splits were still being implemented during this pass. Final verification is
recorded below; these earlier counts and probe outcomes remain unchanged.

- The 34 source authoring records remain distinct from the published pages. Runtime navigation,
  plan, grading and page checks use `LESSONS`; original prose/facts tests may use `SOURCE_LESSONS`
  to check unchanged recorded source groupings. No whole legacy page is republished.
- The retention test compares each original answer-grader/input/field/expected-value obligation
  against its published descendants. All original challenge kinds are `answers`, so this covers
  the complete current set. A32 and mask field splits retain their original queries, cases and
  model-derived answers; per-page reference grading also passes.
- An independent source-loaded audit found 86 gate/challenge references. Each resolves locally
  and follows its target; none points forward or to another page. Moved standalone investigations
  remove the old page's gate only when that page has no corresponding prediction. Required
  prediction/run pairs and challenge-derived solutions retain their local gates.
- The apparent lost figures were traced: the subtract-product bridge moves to division, the Pi
  boot-path diagram moves to the build page, two duplicate countdown run views are trimmed, and
  the redundant A32 marker reference is removed beside division while its full constant pair
  remains on the constant page. Original compiled/model records are unchanged.
- Module 1's rewritten unit tests remove many old-page assertions, but key gate, learner-solution,
  answer-withholding, reload/regrading and reset assertions remain in educational tests on the
  new routes. This was checked separately from the source-provenance tests.
- `npm test -- content/lessons/pacing.test.ts content/lessons/introduced.test.ts
  content/lessons/pacing-5-9.prose.test.ts content/lessons/pacing-10-a.test.tsx` passed **37 tests
  in 4 files**, exit 0, before the later accepted splits. This is not the full-suite result.

## Findings and follow-up

1. **Low, corrected and independently verified.** The preparation checkpoint requested
   “board and EEPROM details” before the EEPROM definition, which had moved to the following
   build page. The preparation introduction now restores the short existing definition. Check
   that it precedes the metadata commands in the final build. The final browser pass confirms
   this order in both widths and themes.
2. **Integration follow-up, resolved.** Later accepted arithmetic/branch splits
   require corresponding `TAUGHT` entries and gate changes. The intermediate snapshot still
   taught negation and register/bit branches on their former first pages. The final catalogue
   assigns these instructions to their actual teaching pages; the instruction tests pass.
3. **Transition follow-up, resolved.** The inherited native investigation says “The next lesson selects
   the other [CHALLENGE] block”. Update that join for the added layout/runtime/debugger pages.
   The final copy instead links to the named repair page. Each new debugger unit keeps its
   fresh setup, artifact state and terminal shutdown complete, verified in source and browser.

Native/Pi source review found the first build, boot, card/terminal/capture and broken/restored
sequences intact in the initial split. QEMU addresses remain example-specific; ELF/raw-image
differences, processor-entry requirements and pending physical verification remain stated.
No new native execution or hardware success is established by this review.

## Initial browser evidence

Chromium sampled 19 pages at 375 × 812 and 1280 × 800 in actual light/dark themes, **76 page
visits**. The sample spans hexadecimal/readings, constant construction, fields, loop testing,
register extension, product halves, call preservation, changed C, checked addition, native
loading, Pi build/capture/restore and all four A32 units.

- 72 page-state probes completed successfully. The new hexadecimal-only reader edits one shared
  pattern without exposing the later numeric-reading view. Constant construction's own-solution
  view remains locked until the local work passes, survives reload and locks again after reset.
- Sampled prediction gates open from their local commitment. Changed C compiles and steps.
  Standalone high halves and native diagrams need no previous-page storage. Each A32 unit's
  local fields pass their recorded checks and regrade after reload.
- All completed initial/used `designProblems` samples returned no problems. No page errors were
  observed. Screenshots from both widths and themes were inspected.
- Four native-page probes stopped because a strict locator matched two correct recording
  disclaimers, one in prose and one beside the figure. Scope that assertion and rerun; this is
  not evidence that the disclaimer is missing. The earlier first probe also stopped on an exact
  “Clear work” name while the button's accessible name includes its challenge title. The corrected
  reset selector follows the repository helper. These failed probes retain their original exits.

Evidence: `/tmp/course-pacing-source-audit.json`, `/tmp/course-pacing-technical/` and the
published-page educational specifications. Full-suite, native-tool and final-build results must
be recorded separately. Physical Pi boot and a screen-reader session remain untested.

## Final expanded catalogue and build

Build `5209ab6cbd2f2ca267b5d6bd254e024d78cb3abb078553ab2328389be8ca840f` publishes
**73 pages from 34 unchanged source records**. The final source-loaded audit found **84**
gate/challenge references, all local and after their targets; no invalid internal lesson link
or term-gate problem. Contiguous ordering, original test obligations and instruction teaching
order passed an independent focused rerun: `pacing.test.ts` plus `introduced.test.ts`, **11 tests
in 2 files**, exit 0. No platform diff was present.

Negation is taught on the subtraction/negation page; zero and register/bit branches on their
respective follow-ons; narrow stores on transfer widths. The native-only `adr` exception belongs
to runtime startup. A source/canonical test's original record is not substituted for the actual
published page in these checks.

The final Chromium pass made **52 successful page visits**: 13 expanded pages at 375 × 812 and
1280 × 800 in actual light/dark. The sample covers flags/overflow, subtraction/negation,
shift/division, both branch follow-ons, transfer widths, recursive progress, executable loading,
runtime startup, all three debugger units and Pi preparation. Initial and used `designProblems`
checks were empty throughout; no page errors occurred. Final screenshots were inspected.

- Local predictions were committed and their dependent views opened on the same page. The
  transfer-width and recursion-progress gates need no earlier page's stored choice. Standalone
  arithmetic examples remain distinct from the later predictions they must not answer.
- Loading retains the example-specific-address qualification. Runtime views explicitly identify
  their GNU/QEMU/GDB recordings. The corrected recording assertion is scoped to the appropriate
  notice rather than assuming that the page has only one correct disclaimer.
- Each debugger unit visibly contains its fresh paused-QEMU command, GDB executable and remote
  connection command, plus detach/quit and QEMU shutdown instructions. The stepping unit retains
  the function breakpoint and inputs before prediction; repair rebuilds the changed image before
  connecting. Original/modified recorded comparisons share their local divergence gate.
- Pi preparation defines EEPROM before its metadata commands. Build/staging, card/terminal/first
  capture and deliberate failure/restoration remain separate complete workflows. Hardware status,
  firmware handoff, entry conditions, board-specific addresses and serial limitations retain
  their qualifications. No browser trace is presented as a live native or physical-board run.

Final audit evidence: `/tmp/course-pacing-final-audit.json` and
`/tmp/course-pacing-technical/results-final.json`, `summary-final.json` and screenshots.
This remains a technical source audit plus representative browser checks, not a complete manual
walkthrough of every activity or a full-suite result. GNU/QEMU execution, physical Pi tests,
offline/update integration and assistive-technology sessions were not independently rerun here.
The managing session owns the full-suite record and its original failures/reruns.

## Build 4 follow-up: semantic cross-reference and local trim

**Accepted, medium: a valid route led to the wrong follow-up activity.** The full browser run
found that Module 0's register-view note still linked to “Constants and widths”, now the first
constant-loading unit. The width experiment had moved to `register-widths`. The initial route
audit checked destination existence and missed this semantic mismatch.

The source correction reuses the approved “Writing w and x registers” title and targets
`#/lesson/register-widths`. The canonical fundamentals prose record matches. Removing the
obsolete `constant` term exemption is appropriate because that later term no longer occurs in
the link. The first source check also found a stale fundamentals unit assertion still expecting
that constant term; the managing session was notified to preserve its meaningful checks under
the corrected link.

The accepted low-severity Module 10 trim removes only the repeated service-administration
paragraph on the changed-C page. The compiler-comparison principle and teaching-subset
qualification remain. Source inspection confirms that the optional panel still contains its
pre-request privacy disclosure, Compiler Explorer attribution/policy link, explicit request
button, source/settings cache feedback and failure/offline messages. The compiler playground
and prediction gate are unchanged.

Build 3 results above remain valid evidence for their stated snapshot. Build 4 must independently
verify the corrected Module 0 destination/width activity and the trimmed changed-C page before
the final review is closed. No new prose was drafted by this reviewer.

Status: narrow Build 4 source changes reviewed; focused built recheck pending.

### Build 4 independent built verification complete

An independent final recheck used build
`000284159c080b033d13d862c833bcea7bbd0aea74f5ecf7c4a68295760f9474`
on a separate preview at port 4436. Chromium passed all four combinations of
375 × 812 and 1280 × 800 in actual light and dark themes: the two changed pages
plus the linked width activity, **12 route visits and 8 reloads**, exit 0.
The build ID was checked against the rendered metadata. Computed page colours differed
between light and dark. All **24 initial/used/reset design checks** returned no problems;
there were no page errors. Screenshots of the corrected source link and changed-C
stepped/disclosure states were inspected at both widths and in both themes.

- Module 0's link is correct before and after running its instruction. Following it reaches
  “Writing w and x registers” and the “Two names, one register” activity. The width view
  remains locked until its local prediction is committed, steps through the width change,
  and resets. Module 0's separate practice rejects a submitted wrong answer, accepts its
  existing reference, regrades after reload and clears completion on reset.
- The changed-C page retains the comparison principle and the teaching-subset qualification;
  only the repeated middle service-administration paragraph is absent. Its local prediction
  still gates the compiler. An edited source persists across reload, compiles, runs and steps
  with matching instruction/C highlights and visible next-operation source context. Restoring
  the original source works.
- The optional GCC panel visibly retains the pre-request disclosure, Compiler Explorer
  attribution, privacy-policy link and source-preserving comparison link. No request occurs
  from editing or opening it. Fully intercepted local response stubs verify the explicit
  request button, successful-response cache and failed-request message; local compilation
  still runs after failure. No request was sent to Compiler Explorer or another external
  service. Real API availability was not tested.

The changed `offline.spec.ts`, `offline-lifecycle.spec.ts` and `shell.spec.ts` were independently
reviewed in source. The saved-work/lifecycle probes now visit `cap-charge-in-c`, which owns
`write-cap-charge`. The offline test separately opens `from-c-to-instructions` for the compiler
investigation and retains its wrong/reference/reload grading, prediction commitment,
compilation, stepping and offline-failure assertions. Lifecycle preservation and refusal
assertions are unchanged. Shell checks use the named constant-loading route, pin the new
Module 3 order and still walk the native/Pi/A32 footer sequence through its last page and back.
No weakened meaningful assertion was found. These offline/update/shell suites were not
independently executed in this narrow recheck; the managing session records their actual runs.

The first custom probe exited 1 after four incorrect expectations that blank answer fields
would create `.verdict-failure`. The corrected probe submits wrong answers before testing
failure/completion. A second probe reached the changed-C stepped state but timed out on an
incorrectly nested optional-panel locator; it was interrupted, ending with exit 1. These are
probe failures, preserved in `results-initial-probe.json`, `summary-initial-probe.json` and
`results-panel-selector-probe.json`, not product findings or successful suite results. The final
corrected run is recorded separately in `/tmp/course-pacing-technical/build4/results.json`,
`summary.json` and screenshots; its script is `recheck-build4.mjs` in the parent directory.

**Final technical status:** the narrow Build 4 changes are independently verified, with no
remaining finding for this scope. The earlier full source audit and representative Build 3
browser evidence retain their stated scope. This adds no full-suite, real-service, native-tool,
physical-board or assistive-technology result. No product or test files were edited and no
build was run by this final reviewer.

### Additional semantic cross-reference audit

A fresh source-loaded recursive scan of every string field in the **73 published `LESSONS`**
found **3 explicit `#/lesson/` link occurrences, 3 distinct source/destination pairs**, and no
URL anchor suffixes. Each destination was read for the activity promised by its source:

- `one-addition` → `register-widths`: the named “Two names, one register” section, prediction
  and width experiment are present, as confirmed in the Build 4 browser pass above.
- `returning-to-caller` → `calls-and-returns`: the promise to show how a function keeps its
  return address is fully met by the destination's save/call/restore walkthrough, local
  construction and overwritten-link experiment.
- `loading-and-startup` → `diagnosing-native-failure`: the destination's
  `native-double-correction` task explicitly uses `verify-boot.s`, `.set CHALLENGE, 1` and
  `.include` to select the other caller block. The promised assembly-time selection is present.

**Accepted low follow-up: named link labels do not all match the current page titles.**
The return-address link still reads “Calls and returns”, while its destination is titled
“Saving a return address”. Its source is `content/lessons/returning-to-caller.prose.ts:12`,
with the canonical copy at `docs/notes/returning-to-caller/prose.md:29`.
The smallest correction reuses the approved destination title and preserves the route and
the explanatory sentence. There is no additional semantic misrouting in these three links.

The adjacent **Where next?** page, outside `LESSONS`, contains **3 more explicit lesson links**.
Its labels and destinations were also checked:

| Source label | Current destination title | Promise covered by the first unit |
| --- | --- | --- |
| Calls and returns | Saving a return address | Yes: the call and saved-return-address rules required by the starter. |
| Running ARM64 outside Assembly Lab | Building and booting an executable | Builds, links, boots and checks the image; debugger inspection follows in later Module 12 units. |
| Running on Raspberry Pi 5 | Preparing and connecting the Pi | Covers prerequisites and serial connection; image build and physical boot follow in later Pi units. |

These sources are `content/where-next.prose.ts:14` and `:46`; canonical occurrences are
`docs/notes/where-next/prose.md:29`, `:106` and `:107`. The managing session accepts only the
**2 “Calls and returns” occurrences**, across two source files and two canonical records,
for synchronisation to the approved “Saving a return address” title. That label-only follow-up
remains to be built and independently checked; this reviewer made no product edits.

**Rejected title-change candidates:** retain “Running ARM64 outside Assembly Lab” and
“Running on Raspberry Pi 5”. They were broad descriptions even before the split rather than
stale exact lesson titles. Their adjacent copy names the module, their routes correctly start
those modules' workflows, and the later units fulfil the broader debugger/physical-boot goals.
No route or claim change is required for these two labels.

Audit evidence: `/tmp/course-pacing-technical/semantic-links-build4.json` and
`semantic-links-build4.mjs`, exit 0. This addition checks source meaning and published
ownership; it does not add browser visits, external-service checks or full-suite results.
Generated previous/next navigation, prose without explicit lesson links and external URLs
are outside this narrow additional scan. Original unsplit authoring records were not used
as substitutes for the destination pages.

### Offline catalogue-test scaling review

Independent source/trace review supports the proposed **test-only partition into computed
batches of 20 published routes**, retaining the existing 120-second limit. The original
unpartitioned Build 4 desktop test timed out and remains a failed original run. Its trace is
`/tmp/root-pacing-build4-full/offline-the-whole-course-r-092f2-essons-never-visited-online-desktop/trace.zip`.
It contains **62 successful navigation calls: the initial front page and 61 distinct lessons**.
The last route, `loading-and-startup`, completed its service-worker, title and section-count
assertions. The overall timeout expired during the following `openStatus` summary click, about
152 ms after that call began. No navigation error or completed offline-readiness assertion
reported a product failure. Readiness for that last route and the remaining routes was not
established by this timed-out run.

Measured completed spans for routes 1–20, 21–40 and 41–60 were **30.928 s, 47.200 s and
34.418 s**, from each group's first navigation to the next group's first navigation. Initial
front-page/download setup before the first lesson took **5.662 s**. These observations explain
why a single catalogue loop no longer fits its budget under the expanded suite; they do not
guarantee a future run's duration.

Computed contiguous slices partition the current 73 pages as **20/20/20/13**, preserving every
route exactly once. Four tests per viewport replace one, adding six cases across the two
projects. Preservation requires each batch to keep its own fresh Playwright context and
deployment, download the complete release from the front page, disable the HTTP cache and
disconnect both the deployment and browser before its first lesson visit. Keep every existing
per-route service-worker/title/section/readiness/status assertion and repeat the complete
Where next? starter and downloadable-file byte/hash assertions in every batch. This retains
the never-visited-online condition and the complete asset checks, without relaxing timeouts
or assertions. `deployment()` provides isolated origins and refuses actual HTTP connections
after disconnection, so batching does not depend on a previous batch's browser or cache.

**Status:** proposed scaling correction independently reviewed as appropriate. No test edit or
test execution was performed by this reviewer; inspect the eventual implementation and record
its focused and final suite results separately. The measured original timeout is not converted
to a pass by this review or by a later rerun.

### Where next? discovery-test route ownership

Independent source and retained-trace review confirms another stale test route.
`tests/educational/where-next.spec.ts` visits `recursive-calls` before clicking
`.where-next-after-calls`. `App.tsx:99` intentionally renders that aside only on the last
Module 9 page (`lesson.module === 9 && next?.module !== 9`). The published course now places
`making-recursive-progress` after `recursive-calls`; the latter's “Following recursive calls”
snapshot correctly has no end-of-module aside.

Both original desktop light/dark traces in `/tmp/root-pacing-build4-full/where-next-*`
end at that aside-link click with the **60-second overall test timeout**. They retain their
failed outcomes. The proposed correction imports `LESSONS`, selects
`LESSONS.filter(lesson => lesson.module === 9).at(-1)` and visits that published page before
the existing aside-link assertion. `LESSONS` is in course order, so this follows the intended
final-Module-9 discovery boundary and still catches a missing aside or broken destination.
No product or timeout change is justified by these failures.

Keep the original front-page discovery, starter display/download and filename, external-link
attributes, keyboard scrolling, layout, theme/reload, aside-click, destination heading,
back-to-plan, footer discovery and error assertions. **Status:** test-only correction reviewed
and pending implementation; this reviewer made no test edit or browser rerun. Final focused
Where next? verification should cover phone/desktop in both themes after the two accepted
return-address link labels are updated, with original failures and focused results separate.

### Build 5 final label and test-correction verification

Final source review confirms exactly the two accepted “Calls and returns” labels now read
“Saving a return address”, with their existing routes and explanatory sentences preserved.
Both canonical prose records match. The broader native/Pi entry labels are unchanged, as
decided above.

The implemented offline test uses computed slices of 20, including the final remainder;
it retains the reviewed fresh deployment/context, whole-release download, disabled HTTP
cache, both network disconnections, 120-second timeout and every per-route assertion. Each
batch retains the Where next? starter and complete downloadable-file byte/hash checks.
The Where next? educational test now obtains the last published Module 9 lesson from
`LESSONS` and changes only the route used before its original aside-click assertion. All
previous discovery, download, keyboard, layout, theme/reload, footer and error checks remain.
No weakened meaningful assertion was found in these final test corrections. This is source
review of those tests; the managing session owns their focused executions and final CI record.

An independent Chromium check used final build
`d768e0069e274abd9ef383e5d9c2a5c56ca8482f7d7ac0ed09f9f36f6b43eb1f`
at port 4436. All four combinations of **375 × 812 and 1280 × 800, light and dark**, passed on
the first final probe, exit 0: **8 corrected-link flows, 24 route visits, 24 clean design checks**.
The rendered build metadata matched; computed colours and screenshots confirmed both themes.
There were no page/console errors and no external requests.

- Both source links show the approved current title and target `#/lesson/calls-and-returns`.
  Following each displays the matching “Saving a return address” heading and the local
  save/call/restore activity and construction. The destination walkthrough steps and resets.
- `recursive-calls` correctly has no end-of-Module-9 aside. `making-recursive-progress`
  displays it, and its link opens Where next? in the selected theme. The Where next? link's
  adjacent call-preservation requirement remains intact. The native/Pi descriptive entry
  labels and routes remain visible and unchanged.
- Screenshots of both corrected link contexts were inspected at both widths and in both themes.

Evidence: `/tmp/course-pacing-technical/build5/results.json`, `summary.json` and screenshots;
script `/tmp/course-pacing-technical/recheck-build5.mjs`. No product/test edits or build were
performed by this reviewer. This narrow passing check is separate from the original full
Build 4 failures, the managing session's focused offline/Where next? reruns and final CI.

**Final independent technical status:** the two label corrections and reviewed test
corrections are verified within the stated source/browser scope. No technical finding remains
open for these changes. Earlier source and browser evidence retains its stated scope; no
additional full-suite, external-service, native-tool, physical-board or assistive-technology
claim is made here.
