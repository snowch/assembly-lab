# Independent technical review: App status

Reviewer: status_security_review, separate from implementation/drafting.
Initial pass: 2026-10-24. This record is provisional until final built checks.

## Evidence read

Read issue #35 directly through GitHub, AGENTS.md/CLAUDE.md, the checked-fact brief, build/plugin,
worker, latest-commit hook, offline hook, shell, status UI, updateStorage and representative figure
persistence. Findings are judged against the issue, not the author's rationale.

## Initial accepted findings

1. **Blocker: Later did not prevent an automatic app-release change.** Real Chromium proof
   `/tmp/status-review-later.mjs` built two coherent production-output variants through
   `renderRelease`. A was explicitly saved, B published, Update pressed, Later pressed, the only
   app tab closed and a fresh one opened. The new page loaded B without Restart to update.
   Worker lifecycle naturally activates a waiting prepared worker when its old clients close.
   Omitting `skipWaiting` does not prevent this. The issue explicitly says activation/reload only
   on explicit restart. A persisted selected app release, independent of worker runtime, or
   staging through the active worker before installing the replacement can enforce the contract.
2. **Blocker: an online-only refresh could strand offline download.** Real Chromium proof
   `/tmp/status-review-mismatch.mjs`: open A without offline consent, publish B and refresh. The
   loaded document's build ID was B, but controller OFFLINE_STATUS reported A. Version said Up to
   date; Download for offline use failed integrity against A's old index manifest, then offered
   Resume download with no Update action. This needs current-document/controller alignment or
   manifest-based staging rather than relying solely on a worker's embedded release.
3. **Major: transient simulator state and an unsubmitted typed prediction were not preserved or
   treated as unsafe.** `StepperFigure`, `StackStepper` and `MemoryStepper` keep step position in
   local React state; `CompilerPlayground` keeps compiled result/step in local state;
   `PrimitiveOperation` keeps a typed pending prediction in local state. `updateStorage.saved`
   only checks persistent artifact writes. Issue #35 explicitly includes simulator/editor state.
4. **Major: offline readiness did not recheck on window focus.** Source listener set initially
   included visibilitychange/reconnect but no focus. A focused window can return without a
   visibility transition, after cache eviction.
5. **Major: storage inspection failure was represented as idle.** A worker `{error:'storage'}`
   response initially became Not saved for offline use. Unsupported/unavailable storage needs an
   explanatory state and recovery; it is not evidence of an empty but writable store.
6. **Major: failed removal was silent.** Initial AppStatus catch closed confirmation without a
   failure/retry message. It must not imply a completed removal.
7. **Recovery concern to verify:** activation timeout sends cancellation and waits for confirmed
   cancellation or worker redundancy; an unresponsive installed worker may leave the shell inert.
   A safe recovery cannot simply unlock while a worker could still commit. Test the failure path.

The proofs used production assets and generated metadata/workers, with only HTML marker variants;
no scripted status responses or artificial progress were used. The two build IDs in these first
proofs were A `7def99415f17377183eaa9e3767b3f34d6feca4a2a77fbde4207f8c848188331` and B
`2e402491315aedbe8df49d65d3f2af233661a2e0f25299197b8bae0ab4f2b999`.

## Status after the initial pass

Final verification was pending at the initial pass. The final results and disposition are below.

## Further implementation review findings

- Legacy production UI cannot issue PREPARE_RELEASE. A real old-build fixture is required to
  verify both its explicit Update now bridge and natural activation after old tabs close.
  A one-time legacy online bootstrap must retain the old offline shell/assets and must not be
  mistaken for the new protocol's explicitly deferred selected release.
- Legacy preparation must not clear bootstrap selection before the saved-work handshake succeeds.
  Failing/unsaved old-client migration must retain its prior complete offline copy and an online
  escape into the new interface.
- The final activation reservation must precede every awaited persistent write. Cancellation
  accepted during an asynchronous bootstrap write previously could unlock tabs and still commit.
- Bootstrap completion and app selection must be one atomic pointer record. A failed pointer
  write must not separately clear legacy migration state.
- A waiting-runtime skipWaiting rejection after pointer commit needs restoration of the previous
  pointer before failure is reported. The worker's regression case checks old version/readiness,
  retained pending release and successful retry.
- Runtime and selected-content versions must be checked separately. A naturally installed newer
  runtime can still serve an explicitly selected older release. Conversely an online-only refresh
  can load current HTML with an older runtime; it must expose an actionable explicit update.
- The initial noscript-only status control did not cover JavaScript-enabled pre-hydration. The
  static header must also be in root's initial markup, without duplicating it when scripts are off.
- A complete temporary update cache without offline consent was initially labelled incomplete
  because its partial-byte flag was true. After an online-only update it must remain Not saved for
  offline use, with Download for offline use; it must not claim missing files or permanent consent.

## Independent browser scripts and intermediate outcomes

`/tmp/status-tech-final-browser.mjs` is independent of the main browser-test author's fixtures.
It reads completed Vite production files, regenerates coherent release manifests/workers for
three HTML-marker variants, and drives actual Chromium service workers. These are production
output variants, not a claim of three separate Vite build invocations.

- First run timed out at an incorrect numeric-input selector. The live Fundamentals figures use
  predict:false; the optional numeric-prediction case is exercised by component tests. This was
  a reviewer harness error, not a product failure.
- Second run did not wait correctly for a same-build-ID reload after an online-only refresh.
  Meta B was already present before Restart, so it inspected the old locked document. The
  harness now waits for both window load events around Restart.
- Third run passed running/runtime mismatch recovery, unsubmitted exercise text, uncommitted
  radio selection (without revealing its outcome), simulator step/bit disclosure and per-tab
  theme restoration. It then exposed the complete-temporary-cache offline-label defect above:
  the expected Download action was Resume download. No final pass is asserted for this run.

A further scoped-storage audit found that `getRegistration(base)` may return an ancestor-scope
registration, such as an unrelated `/` worker on a shared origin. Reuse must require exact scope
identity; RPC and legacy unregister must target only that owned registration/controller. An
ancestor worker must remain installed after Assembly Lab's offline removal. This is a scope
correctness issue, independent of the cache-prefix checks.


## Final independent verification and disposition

The final coherent candidate was build
`b8cfaed0e1761e1e03248127eead65a3dfeaef9e5fad8f1dd7cdc1c2e1cbaa1b`.
No source was edited by this reviewer. The parent implemented the app-side corrections; a separate
worker author implemented the worker corrections; a separate state-handoff author implemented
transient-state preservation. The final source was reviewed after those corrections.

`node /tmp/status-tech-final-browser.mjs > /tmp/status-tech-final-browser-six.log 2>&1`
exited 0. Actual Chromium contexts at 375px/dark and 1280px/light each passed:

- Fresh opening and checking did not request native example assets or opt into offline saving.
- An online-only A-to-B refresh accurately identified an older worker runtime. Explicit Update
  and Restart recovered it rather than stranding Download against the old manifest.
- A typed exercise answer, a selected but uncommitted radio prediction, simulator step position,
  bit disclosure and theme survived the two-tab restart. The radio's outcome remained hidden;
  restoration did not commit or grade it.
- A complete temporary prepared copy remained Not saved for offline use. Only the explicit
  Download action granted offline readiness, reusing verified bytes.
- After preparing C and selecting Later, closing every app window and reopening still loaded B.
  Restart to update then loaded C. For the fresh launch and restart, the private HTTP server
  physically destroyed connections as well as the browser context being set offline, so a worker
  could not obtain an unnoticed network response.
- No page errors or page-width overflow occurred.

The generated production-output variants had IDs
`df15a673d6f772b80b7ce0eb85f5f1de34f65b8000f8f6d5db47582e6f77df68`,
`757c250f47e03440763a466e9c267bf617bf1acbe72d3e63a90952b0d9e20eb8` and
`7a71d5c2032fa0a31f972206431c43b7ffe72daee58e2a9b182d77ec76e0e5ff`.
These variants changed only a harmless HTML marker and regenerated exact manifests/workers;
they are not described as three separate Vite invocations. Actual separately built baseline and
new-source release evidence is recorded by the browser test author/parent.

`node /tmp/status-tech-entry-browser.mjs > /tmp/status-tech-entry-browser.log 2>&1`
exited 0 on the unmodified b8cfaed build. It independently checked:

- JavaScript disabled: exactly one native App status control, accurate embedded source identity,
  clear JavaScript requirement and no phone-width overflow.
- JavaScript held before execution: a usable native status control in the initial root markup,
  then exactly one React control after the real bundle was released.
- A pre-existing unrelated root-scope worker: Assembly Lab registered its own exact scope;
  saving and removing its offline copy retained the root worker, a sibling cache and sibling
  localStorage. App RPC/removal no longer targeted an ancestor-scope registration.

Independent source review confirmed the retained two-round saved-state handshake, composition
and busy-operation guards, per-tab handoff scopes/signatures, exact model value serialization,
private radio-choice adapter, cancellation reservation before persistent writes, atomic selected
pointer plus migration completion, waiting-runtime failure rollback and owned-scope checks.
The course-owned prediction adapter retains the primitive's public control behaviour without
editing vendored platform files. It preserves a draft choice without writing its committed slot.

The initial learner reviewer findings were also assessed: successful removal losing focus was a
valid accessibility defect and was corrected/independently rechecked by that reviewer. The
unconditional reconnect instruction after cancelling while online was a minor but valid clarity
defect; its corrected connection-neutral wording was independently checked. No challenge answer
is included in this review.

All initial concrete blockers above have corresponding source corrections and final built
verification. No outstanding technical blocker remains for this candidate. This verdict does not
claim that a source read or these focused scripts establish an entire CI/full-course pass.

### Limits and honest failure semantics

A legacy saved cache has no retained expected manifest in the old protocol. Its old shell and
assets remain usable as an offline fallback, but the new worker cannot honestly claim full
cryptographic completeness for that legacy inventory. The one-time online bootstrap exposes the
new interface; explicit preparation/save migrates it to a verified manifest. The separate real
legacy-browser run covers old Update now, natural activation, offline-first fallback and online
migration. Chrome context offline emulation alone was insufficient for a worker-originated fetch;
private-server connection refusal corrected the evidence method, not the product.

An arbitrary unresponsive worker cannot be safely treated as cancelled while it might still
commit. The retained activation timeout therefore waits for confirmed cancellation/redundancy;
real validation/storage/skipWaiting failures have explicit cancellation/retry tests. If activation
and rollback storage both fail, the worker reports uncertainty rather than claiming the old
pointer was restored; complete caches are retained. No unsafe automatic unlock guarantee is made.

### Independent focused unit checks

`npx vitest run apps/course/offline/plugin.test.ts apps/course/src/latest-commit.test.tsx packages/views/src/update-handoff.test.tsx > /tmp/status-tech-unit-final.log 2>&1`

Final frozen source: **3 files, 51 tests passed**, exit 0. This includes worker metadata/caching/
activation failure cases, deployed-release validation and scheduling, and per-tab simulator/
unsubmitted-choice handoff cases. An earlier independent intermediate run passed 45 tests before
the later worker and radio regression cases were added; it is not substituted for this final run.

## Follow-up: removal after a deferred runtime handover

The parent found and reproduced a composed lifecycle defect after the initial review: save A,
prepare B, choose Later, close every app window, wait until runtime B naturally becomes active,
reopen selected app A, then remove its offline copy. Removal reset the selection to runtime B's
embedded manifest, so a subsequent Update B could finish downloading without exposing Restart.
The earlier simple removal checks had not included that completed runtime handover.

The worker now atomically preserves only the selected release's manifest metadata before
removal. It strips old commit/client acknowledgements and clears consent, pending manifests,
client-mode records and every scoped app-asset cache. Keeping this identity record does not keep
a usable offline app or grant offline consent. Source review confirmed it writes the preserved
selector before destructive work and never resets the selected app to the runtime's embedded
manifest. Existing exact-scope and sibling-storage boundaries remain unchanged.

Independent verification of build
`e223df240e58747b16762a1d3e9d49bf2bb470f2e0cbdeeb55fef920d4d6efe0`:

`node /tmp/status-tech-remove-pending.mjs > /tmp/status-tech-remove-pending.log 2>&1`

Exit 0 at 375px/dark and 1280px/light. Each context:

1. Saved A, prepared B, selected Later and closed every app window.
2. Used an out-of-scope observer to wait for natural activation and independently queried
   runtimeVersion B before reopening selected app A.
3. Removed the offline copy. There were zero scoped app-asset entries; the only scoped settings
   entry was the selected-release identity. A typed exercise answer, theme, sibling cache body
   and sibling localStorage survived.
4. Prepared B again, observed Update ready, explicitly restarted into B, and observed Not saved
   for offline use without an implicit new consent.
5. Explicitly downloaded, closed and freshly opened B with both browser offline mode and a
   private HTTP server destroying every connection. The HTML response came from the worker,
   the course was Available offline and the typed answer remained present.

No page errors occurred. The current worker template with its embedded manifest was also checked
byte-for-byte against this build's emitted sw.js before running the checker.

`npx vitest run apps/course/offline/plugin.test.ts > /tmp/status-tech-remove-unit.log 2>&1`

The independent focused follow-up run passed **1 file, 37 tests**, exit 0. The final count includes
the new composed removal regression; it supersedes the older worker-only test count for this
source. Broader earlier browser results remain recorded against their actual build IDs. This
correction and its affected removal/re-preparation/offline states are independently verified on
the newer build. No outstanding technical blocker remains.

## Follow-up: cancellation is offered only during a cancellable transfer

An early update phase waits for the browser's native worker registration update; that operation
has no abort API. Previously the UI offered Cancel download while no tracked asset job existed,
so clicking it could do nothing. The app now exposes cancellation only while transferFiles owns
a worker and request ID. Source review confirmed that the flag is set before awaiting the tracked
RPC and cleared in that same job's finally block. Direct offline saving starts its tracked job
synchronously when its saving state begins.

Independent narrow built check:

`node /tmp/status-tech-cancel-phases.mjs > /tmp/status-tech-cancel-phases-nine.log 2>&1`

Build `f6055ae94a885f04bb7e575afa13c32b6d06865b9dd8364dbeaaf15234771c15`, exit 0 at
375px/dark and 1280px/light. The private server held the actual new worker response: the update
phase was indeterminate and no unsupported Cancel control was offered. After releasing that
response, it held the actual changed HTML asset: verified-byte progress was measured and Cancel
was available. Cancelling retained the old complete offline app; preparing again and explicitly
restarting succeeded with no page errors.

The final source also clears the previous updateProgress at the start of a new preparation, so
an uncancellable repeat phase cannot display a previous job's counter. That one-line reset was
source-reviewed after the candidate-nine build. Its independent built repeat-phase check is
narrowly pending the parent's post-commit build; do not count the candidate-nine result as
verification of that later line. `/tmp/status-tech-cancel-repeat.mjs` is prepared for this check.

## Follow-up: a newer runtime must not trap an older prepared update

A concrete three-release recovery check against candidate nine found that the runtime-version
safety check correctly refused Restart B after runtime C superseded it, but following the error's
Check for updates instruction restored the old pending-B ready state and hid the Update action
for C. The user was offered the same refused Restart again.

`node /tmp/status-tech-newer-deferred.mts > /tmp/status-tech-newer-deferred.log 2>&1`

The real-worker result immediately after refusal was available/one Update action; after the
suggested check it was ready/zero Update actions/one Restart action. This was a recovery/UI-state
finding, not a request to relax worker-version coherence. A pending older prepared release must
not suppress preparation of a different freshly checked published release. Correction and final
built verification are pending; the parent has the exact reproduction.

The final source now offers Update when the published build differs from an older pending build,
as well as when no pending build exists. Independent source review approves this minimal recovery
correction: it does not relax runtime/version validation or mutate saved caches. Together with
the progress reset above, this leaves two narrow built checks pending the parent's post-commit
build. `/tmp/status-tech-supersession-final.mts` combines them: fully prepare B, install superseding
runtime C, refuse the stale B restart, follow Check for updates, hold C's real worker response and
verify an indeterminate uncancellable phase, then prepare and explicitly restart C. All earlier
results retain their actual build IDs; these later lines are not falsely counted as verified by
candidate nine.
