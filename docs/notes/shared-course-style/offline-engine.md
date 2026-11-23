# Shared course style: offline engine

Copyright © 2026 Christopher Snow.

## Contract

A normal online navigation opens the current published HTML. It does not switch the
saved release, reload another tab or download the course. The complete older saved
release remains the fallback when navigation fails, times out or returns an error.
The navigation deadline covers the response body as well as its headers.

A running document, the published release, the worker runtime and the saved offline
release have distinct identities. The existing `course-build-id` meta tag supplies
the immutable document identity. `savedVersion` is the selected release ID only
when its complete cache verifies and offline consent exists; `savedCurrent` compares
that ID with the running document. Neither field asserts that the document is the
latest published version. Published metadata checks retain their separate
network-only, no-store, freshness and stale-response safeguards.

The learner explicitly saves or updates an offline copy. The Update offline copy
UI action grants offline consent, including on the first save. Preparation verifies
the complete replacement before offering Restart. It leaves the current saved
selector and all open documents unchanged. Worker-level temporary preparation
without consent remains supported, but the explicit offline-update action does not
use it. Cancellation keeps verified partial entries, reports cancellation separately
from download failure and leaves an older complete copy usable.

## Immutable assets and retention

The build emits one canonical asset inventory and a second, immutable tree at
`releases/<buildId>/`. Only the canonical inventory contributes to the displayed
download bytes. HTML entry script/styles and emitted CSS references to assets and
public fonts use that immutable tree. Release input excludes previously emitted
release trees and maps, so subsequent packaging cannot recursively include them.

Downloads first request the immutable path. A canonical compatibility fallback is
accepted only if its byte length and SHA-256 match the selected manifest. Asset
fetches for a known saved release apply the same verification, including on cache
hits. Corrupt entry HTML is refused even when the selected cache is incomplete.
Readiness always verifies actual cached bodies; it never silently repairs them.

A navigation records the resulting client's document release. Later requests from
an old tab use its release cache, including public font/native URLs which originally
used root paths. A client without saved metadata still requests known runtime,
font, native and example paths under its document's immutable release URL. It does
not silently use a newer root file. Legacy content-hashed runtime URLs can find
their original responses in retained caches. Unknown modern-client requests use
the network, avoiding an old public response when client-mode storage failed.

Activation retains release caches. Explicit scoped removal deletes downloaded app
copies and the client's cache metadata, preserving the atomic selected-release
identity and all local/session/IndexedDB user data and sibling app caches. Retaining
release caches favours correctness for existing tabs; accumulated versions consume
storage until scoped removal or browser eviction. Quota failures keep the previous
complete copy and report failure.

The published artifact contains the current immutable tree. This patch does not
change the deployment pipeline to retain every historical tree on the server.
A complete saved/staged release remains available from its retained browser cache
after the server removes that tree. An unsaved old online document keeps its
already-loaded JavaScript in memory, but an unvisited native download or a later
font load can fail if its old server tree is gone. Such a request must fail instead
of receiving different release bytes. Saving a complete copy is the guarantee for
all course assets without the server. Browser eviction and explicit removal still
remove that guarantee. There is no WASM/native browser runner in Arm Assembly Lab;
the assembler, simulator and small compiler run in JavaScript.

## Restart transaction

The PREPARE/VERIFY/COMMIT/CANCEL protocol, durable-work checks, composition veto and
per-tab theme handoff remain in place. The hook additionally refuses preparation
while that tab owns a file transfer or release-preparation operation. The worker
rejects a competing download/restart within its own runtime.

The atomic selected-release write records the participating client IDs. Reload
navigation recognises that transaction and serves the exact complete prepared
release before trying the network. Thus Restart to B cannot accidentally open C
if publication advances after B is prepared. The ticket is tied to the replaced
client ID: a new unrelated online visit still opens C. Waiting-runtime handoff
still claims clients before sending their commit/reload notifications. Preparation
alone, including after all tabs close, never changes the offline selector.

Legacy saved caches remain the offline fallback while the first online visit can
escape an old cached UI. Failed/unsafe legacy migration cannot delete that fallback.
Unknown old clients still block coordinated restart rather than being forced to
reload. Removal retains the release selector even when the active worker runtime
and selected document release differ.

## Verification record

Commands are run in `/workspace/assembly-lab` with Node 24.22.1. Dependencies were
installed with `npm ci`; Playwright Chromium 1194 is available. No commit, push,
merge or deployment was performed by this work session.

- Initial focused unit command (`plugin.test.ts` and `latest-commit.test.tsx`):
  exit 1, 43 passed and 8 failed. The fixture did not serve immutable URLs and still
  expected cache-first navigation and activation cleanup. Its failure/corruption
  injections also affected only the first of the now-valid immutable/root attempts.
  The fixture now models both paths; failure assertions still force both paths to
  fail, and cache/navigation expectations reflect the intended contract.
- Focused reruns passed 51, then 55, then 58, then 59 tests as additional regressions
  were added. Latest focused command passed **60/60**. Coverage includes current
  online HTML with older offline fallback; pinning HTML and CSS fonts; exact B
  restart after C publication; old-tab runtime retention; corrupted HTML/runtime;
  competing operations; cancellation/resume/progress; quota failure; staged-pointer
  recovery; legacy upgrade and theme/work coordination.
- Initial production builds passed. Vite emitted only existing Zod annotation and
  large-bundle warnings. Immutable copies increased artifact output, not displayed
  course download bytes.
- The first protocol-driven real-browser engine command ran desktop only: **2/2
  passed**. It exercised online B beside saved A, a fresh offline A tab and a real
  simulator action; two-tab B preparation without reload; exact B restart after C
  publication; preserved distinct themes/routes; a new online C tab and fresh
  offline B tab. These tests do not depend on App status wording.
- First complete lifecycle desktop command: exit **1**, **21 passed, 4 failed**
  (3.5 minutes). The failures were a hidden-modal assertion after the revised
  helper closed it, an incorrect `page` variable in the header assertion, the old
  assumption that an already-loaded B must have a disabled Save button, and the
  old assumption that removing saved A from an already-loaded B still required
  preparing/restarting B. Corrections retain the work, offline and reload checks.
  They do not convert failures into skips. This result remains a failed run.
- Type checking passed before the final cancellation/pinning changes; a final
  typecheck and final desktop/phone lifecycle rerun are pending below.

Final integration and independent technical/learner review results must be appended
here before the branch is considered verified. The parent session owns the combined
full-suite report and independent-review record. Ordinary `docs/offline.md` still
contains the previous automatic-save contract and needs synchronising separately.
