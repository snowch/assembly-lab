# App status release and worker contract

## Published metadata

`apps/course/offline/plugin.ts` publishes same-origin `release.json` beside `index.html` and
`sw.js`, beneath the configured base path. The sibling issues request this same public model;
this repository uses schema version 1:

- `schemaVersion`: `1`.
- `buildId`: a deterministic SHA-256 hex identity of worker behaviour, source identity and the
  asset manifest before the HTML identity placeholder is expanded.
- `commit`: the embedded source commit, or `null` for a source archive.
- `committedAt`: the embedded source commit date as ISO UTC, or `null`.
- `assets`: sorted `{ path, bytes, integrity }` entries for all app assets, including the complete
  lesson bundle, local tools, fonts, icons, manifest and native example downloads. `integrity`
  is a `sha256-` base64 SRI digest.
- `totalBytes`: the exact sum of those asset body sizes, before transfer compression. No guessed
  compression ratio, network headers or browser storage overhead is included.
- `worker`: the separate `{ path: "sw.js", bytes, integrity }` descriptor. The browser installs
  this worker separately from the explicit offline asset download.

Source maps and the two generated metadata/worker files are excluded from `assets`. The worker
is excluded to avoid a hash cycle; its template participates in the build identity and its final
body has a separate digest. `release.json` is excluded to avoid a self-reference.

The HTML carries `<meta name="course-build-id" content="…">`. The plugin first hashes the HTML
with `__COURSE_BUILD_ID__` in this slot, chooses the build ID, expands the slot and hashes the
final HTML bytes for the download manifest. Thus the running identity is loaded with the document,
while the published manifest still verifies the exact HTML actually downloaded. An unchanged source
commit with different built assets has a different build ID. The source commit alone does not
prove all deployed bytes match.

The service worker treats every query variant of this app's `release.json` as network-only with
`cache: "no-store"`. Published metadata never comes from its offline caches. During deployment,
a worker/content mismatch or a mutable asset from another build fails integrity verification and
leaves the previous release cache intact.

## Worker RPC

Requests use `postMessage` with a `MessageChannel` reply port. The app receives progress messages
until the terminal reply. Cancellation may omit the port.

- `OFFLINE_STATUS`: never downloads or repairs. Reports `{ready, prepared, partial, consent,
  version, completedBytes, totalBytes, pendingVersion, pendingPrepared}`. `version` is the worker's embedded build ID. `prepared`
  means every expected body and size passed SHA-256 verification; `ready` additionally requires
  explicit offline consent. A storage failure reports `ready:false` and an error.
- `DOWNLOAD_OFFLINE {id,release?}`: records explicit offline consent, reuses verified existing bodies,
  then downloads missing/corrupt bodies with SRI and `cache:"no-store"`. A supplied manifest can adopt an already-loaded newer release only when the selected older release has no complete copy; an existing complete copy requires the restart protocol.
- `OFFLINE_REPAIR`: explicit compatibility alias for a consented download.
- `PREPARE_RELEASE {id,release,persistent}`: stages the supplied release through the chosen target runtime while retaining the active app pointer. `persistent:true` carries forward
  the existing saved app's offline consent; `false` prepares a temporary update without granting
  offline consent. A previously granted scoped consent is retained. The supplied published manifest is validated again inside the worker. The active worker stages it without installing a replacement worker.
- Download progress is `{progress:true,completedBytes,totalBytes}`. Completed bytes count verified
  cached or successfully stored whole bodies, so progress may advance one asset at a time. It is
  neither a timer nor a claim about wire bytes already received within an unfinished asset.
- Download success returns `{ok:true,ready:true,…status}`; terminal `ready` in this reply means
  prepared for the requested operation. A later `OFFLINE_STATUS` still distinguishes persistent
  offline availability from a temporary online update.
- `CANCEL_DOWNLOAD {id}`: aborts only the matching request from its owning app client. Verified
  partial bodies remain for resume. Stale IDs and unrelated clients cannot cancel a download.
- `REMOVE_OFFLINE`: cancels an in-flight download, waits for its completion and deletes only
  `assembly-lab-offline:<encoded exact scope>:` caches and scoped settings except the selected-release manifest.
  It never clears local/session storage or IndexedDB. It rejects a concurrent activation.
  The small no-auto-download worker can remain registered for online use.
- Downloads/removal are accepted only from app clients inside the exact worker scope. Scoped
  removal does not touch sibling courses hosted on the same origin.

One download operates per worker. A competing request returns `busy`. A cancelled, failed or
quota-limited replacement retains verified partial entries and never deletes the old release.
Every readiness check verifies bodies rather than trusting registration, success flags or HTTP
status alone. Browser eviction therefore removes the availability claim at the next check.

## Activation and migration

Worker installation downloads no course assets. Activation deletes older app caches only when
its own complete release has been verified. A new worker that the browser naturally activates
without preparation leaves older caches in place. Its legacy fallback selects one older saved
shell and its supporting assets, rather than mixing a partial replacement into that shell.
A legacy cache has no retained full manifest: the new worker does not invent a verified
availability claim for it. The old active worker's real readiness reply can still recognise the
existing save; explicit preparation/repair migrates it to the new verified protocol. The old UI's explicit `ACTIVATE_UPDATE` action on a waiting new worker is bridged: it prepares the embedded release, runs the existing handshake and uses `skipWaiting` so the old UI's `controllerchange` path can load the new interface.

The existing `ACTIVATE_UPDATE` / `PREPARE_UPDATE` / `VERIFY_UPDATE` / `CANCEL_UPDATE` /
`CANCEL_ACTIVATION` handshake is retained. Restart requires the full release already prepared,
every app tab's saved-state acknowledgement, a second acknowledgement after all tabs pause,
a still-complete cache and no newly opened tab. A missing body, unsaved work, composition guard,
late cancellation or failed acknowledgement prevents activation. Other courses are not participants.
The page-side guard remains responsible for checking saved work and composition before replying.

Content releases use a persisted scoped **active release pointer**, independent of whichever worker
runtime the browser has installed. The chosen runtime downloads a target manifest into its own
immutable cache and records a pending manifest. Only the small worker runtime may be installed during preparation; the app pointer does not change. Closing every window after Later therefore retains the old selected release.
A browser-installed newer runtime re-reads the persisted active pointer on activation, including
when it had initialized earlier while waiting.

After both acknowledgement rounds and the final completeness check, restart reserves the commit
and atomically replaces that pointer. Prepared clients receive `COMMIT_UPDATE` with the exact
attempt ID, then reload their preserved route. A failed pointer write cancels the attempt and
retains the previous pointer/copy. An already-active runtime does not need `skipWaiting`. A waiting target runtime uses it after the
pointer commit, and sends the commit message only after activation claims the clients. A complete previous cache is retained
after a content commit for recovery and is cleaned by a later worker activation or scoped removal.

Temporary prepared update caches are retained through the restart so the new document and assets
can load coherently. They do not acquire offline consent or an `Available offline` claim. A later
complete release or explicit scoped removal removes them. No user answers, notes, edits or theme
are stored in these release caches.

## Worker/model verification

An intermediate `npx vitest run apps/course/offline/plugin.test.ts` run passed 27 tests, including all preserved
cross-tab activation/cancellation cases, exact release/body hashing, no installation download,
metadata bypass, real verified byte counts, cancellation/resume, corruption, quota failure,
temporary preparation, eviction repair, legacy fallback and scoped removal/re-download.
The first rewritten run had two failures: an ignored cancellation with no ports needed optional
port access, and the mock CacheStorage needed to recreate a deleted cache correctly. After those
corrections the 22-test rerun passed; three further cancellation/progress/legacy tests passed in
the 25-test run. Browser evidence and full-suite results are recorded separately.

The active-pointer refactor first ran 24 tests with three failures caused by the test helper retrying a failed save while staging it; the helper now preserves the original failure. The corrected 24-test run passed. Three additional tests cover deferred updates across worker activation/reopen, adoption of an already-loaded published release for a fresh offline save, and the legacy waiting-worker action, bringing that focused run to 27 passes. A real-browser run found that Cache.put consumes the response body during reuse; the worker now stores a clone and the test cache mock consumes bodies too.

## Final runtime and legacy migration refinements

The selected app release and the worker runtime have separate identities. `OFFLINE_STATUS`
reports `version` for the selected app manifest and `runtimeVersion` for the worker's embedded
build. Explicit update preparation may install the target's small worker script and validates its
runtime identity before staging assets. A waiting newer runtime reads the same selected pointer:
its natural activation after every window closes still serves the older selected app. This is
protocol version 1; worker runtimes retain compatibility with existing manifests and tab messages.

When Restart is handled by a waiting runtime, it commits the selected pointer, calls `skipWaiting`
and waits until its activation event has claimed the clients before sending `COMMIT_UPDATE`.
When the correct runtime is already active, it sends `COMMIT_UPDATE` after the atomic pointer
write. The old UI ignores that new message and keeps its existing controller-change reload;
the new UI reloads only a prepared attempt with a matching commit message.

The initial migration from the pre-issue automatic caching worker needs an explicit exception.
That old interface can install this worker and close every window without using its waiting-worker
Update action. On its next fresh navigation, the old cached interface would otherwise have no
waiting update control and would remain trapped indefinitely. A scoped one-time legacy bootstrap
marker allows a fresh **online** navigation to load the newly published interface. A failed/offline
navigation retains the old cached shell. Network-loaded and legacy-cache-loaded clients have
separate scoped persisted cache modes, so stable paths such as native downloads and icons do not
silently come from the other release after the worker restarts. This exception applies only when
there was no selected pointer and an older cached shell existed; the new protocol's Later action
never uses it.

A legacy preparation that is blocked by unsaved work keeps that marker, the older cache and its
offline fallback. Having downloaded the new bodies before that failed handshake does not promote
them or delete the older cache. Readiness remains unverified during legacy bootstrap. A successful
explicit save of the currently loaded new interface, or a successful restart, finishes migration.
No source-only inspection can establish this behaviour; real legacy-browser fixtures are tracked
in the separate browser evidence.

The final focused worker run passes **32 tests**. Added cases verify an atomic pointer write
failure retains the old release and permits retry; cancellation after commit reservation cannot
unlock clients early; legacy online bootstrap and offline assets remain distinct across runtime
restart; a waiting runtime sends the commit message only after claim; and an unsaved legacy update
retains both offline fallback and the later online migration path. One initial new unit test failed
because the mock server did not map the app's root navigation to index.html; after correcting that
server routing, the 30-test run passed before the two final refinements brought it to 32 passes.

The final review also removed two activation races. Commit reservation now precedes every final
asynchronous write, so late cancellation cannot unlock clients while the pointer is being stored.
The selected pointer and `migrationComplete` flag share one atomic record; a failed write cannot
turn off the legacy migration escape while leaving the old selection behind. Commit attempt IDs
and participant client IDs are persisted with that record so a newly activated worker can send
its post-claim message even if its JavaScript realm restarted between events. Clients still
accept only the exact attempt they prepared.

If a waiting runtime's `skipWaiting` rejects after the pointer was stored, the worker restores the
prior pointer and migration state before cancelling/unlocking the attempt. Its old complete cache
is retained, and the pending target remains available for retry. If storage also prevents that
rollback, the worker reports a changed-update failure rather than claiming rollback succeeded.
The last two focused tests cover a legacy atomic commit failure preserving the migration escape,
and a waiting-runtime activation failure preserving version A/readiness before a successful retry
to B. The focused worker suite now passes **34 tests**.

New UI activation requests also send `replaceRuntime`, based on the actual target worker. This
avoids treating an active-runtime request as a handoff merely because another worker is waiting.
Old UI requests omit the field and retain their existing waiting-worker behaviour. The additional
focused test verifies an explicitly active request commits immediately without calling
`skipWaiting` even while the registration has a waiting worker. The worker suite passes **35 tests**.

A real legacy-browser diagnostic initially appeared to show a failed migration reopening the new
interface while offline. The instrumented run recorded both 34-entry release caches retained,
`__legacy_bootstrap__` still true, and no migration-complete bit in the active pointer after the
failed attempt and after natural activation. Its server also received a fresh app navigation
after Playwright's context offline switch. That run therefore does not establish actual network
disconnection for worker fetches. It is retained as a failed verification attempt; the browser
review reruns with the server physically refusing connections, and records its result separately.
No worker source change was made on the strength of that ambiguous result.


## Remove after a deferred update

A composed real-browser check found that A saved → B prepared → Later → close all → runtime B
active while A remains selected → Remove → prepare B again lost the Restart offer. Removal had
reset the selector to runtime B's embedded release, so the pending B manifest looked consumed
although the open document still ran A. That original browser verification is retained as a
failure; this was a product defect rather than a stale expectation.

Removal now first atomically preserves the selected release's manifest only, stripped of old
commit/client IDs, then clears other scoped settings (offline consent, pending release, migration
and client cache modes) and all app asset caches. The manifest is small app metadata, not a saved
copy of the app or user work. A worker restart still knows A is selected, so B can be prepared
and restarted explicitly. A fresh network-loaded B document can instead save B once A has no
complete offline copy. A failure to preserve the manifest occurs before any asset deletion and
returns removal failure, leaving the existing save usable.

The focused worker suite passes **37 tests**, including the full deferred/remove/prepare/restart
sequence across a runtime restart, and a failed metadata-preservation write retaining the old
complete save. No public copy changed for this fix. The earlier 35-test pass remains a separate
result; real-browser re-verification follows the rebuilt worker.
