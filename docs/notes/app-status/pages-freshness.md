# GitHub Pages release-check follow-up

Live verification of merge `895d006` found a hosting behaviour that the private server did not reproduce. GitHub Pages' CDN returned the same cached `release.json` for distinct UUID query strings despite `cache: no-store` and request `Cache-Control: no-cache`. Browser responses had positive `Age`; the app correctly displayed the failed-check state rather than claiming currency, but routine checks could not succeed reliably.

Stronger cache directives, `Pragma` and conditional requests did not fix the observed CDN behaviour. Removing the positive-Age rejection would permit the stale snapshot to claim currency and was rejected. An independent browser probe also rejected encoding the project-directory name: those aliases returned 404, even though filename aliases returned the correct file. A Python HTTP probe alone did not establish browser behaviour.

The correction keeps the canonical request first. Only an otherwise successful response with positive `Age` gets one retry, at the same origin and exact project directory, with randomly percent-escaped unreserved filename characters and redundant path separators. GitHub Pages resolves that path to the same file while using a separate CDN key. The combined alias space reduces collisions between visitors. Existing escapes remain intact. No new endpoint or asset download is introduced.

Both requests share the original five-second abort deadline and generation guard. The alias must also have no positive `Age`, valid metadata and a matching deployed contract; otherwise the existing error/retry UI remains. The worker recognises equivalent decoded metadata paths and always sends them to the network, even if a cache happens to contain that URL. A host that rejects or normalises these aliases may still report a failed check; the fallback never weakens the freshness test.

The regression server models canonical CDN metadata retaining the old manifest after a deployment while aliases return the newly deployed one. It also models every alias remaining cached, which must fail closed. Unit checks cover URI/resource equivalence, the unchanged project directory, stale metadata rejection, bounded retries, the shared deadline and late-response suppression. Worker checks seed stale alias metadata and prove that it is bypassed. Browser checks cover desktop and phone with real production assets.

Focused unit verification: 2 files / 51 tests passed. Final committed-build browser, full CI and live deployment results are recorded in the follow-up PR without altering the tested HEAD.

Independent Chrome/GitHub Pages verification passed 16 fresh aliases: every response was 200 with `Age: 0`, the expected deployed commit/build and a CDN miss. Reusing three aliases with new query strings returned positive Age, confirming why the fallback guard remains necessary.

The first new browser command was stopped with exit 130 after one failed desktop case and one not run. Its final recovery action incorrectly looked for Check for updates after the deliberately induced error; the correct UI offers Retry. The test now presses Retry, retaining every stale/current/error assertion. An overlapping rerun exited 1 before executing tests because its old port was still occupied. After disposing of that run, the corrected separate-port command passed both desktop and phone cases: 2 passed (8.9 seconds), `/tmp/status-pages-cdn-precommit-corrected.log`. These harness failures are not presented as product passes.

## Offline saving remains independent

The same live failure exposed an unnecessary first-save dependency: the UI required published metadata even when the owned worker already held the validated inventory for the loaded app. The independent technical reviewer confirmed this gap and identified the necessary selection guard. Runtime identity alone is insufficient: after removing a deferred update, selected metadata can still be A while both worker runtime and an online-refreshed document are B. An unspecified download target would then save A.

The UI now permits download without published metadata only when both the worker's selected release and runtime match the loaded build, with known inventory and the existing cold-runtime guard. The download action rechecks both identities through the worker immediately before transfer. A supplied current-document manifest still supports adopting B when selected A is incomplete. No learner-facing strings changed.

Two real browser scenarios check first save with every metadata response cached, followed by a physically disconnected fresh launch; and selected A/runtime B/document B after removal, where an unavailable manifest keeps Download disabled until Retry obtains B's manifest, then saves and reopens B offline.

The earlier committed `2f84dd0` local full command passed 146 unit files / 2,875 tests and built successfully. It was stopped before these edits: exit 130, 396 browser cases passed, 12 skipped, 1 interrupted, 759 not run; no failed cases. This is not a full local pass. Final-source browser and CI results are recorded in the follow-up PR.

## Full-CI timing corrections

The `cf249e3` push check failed with 3 browser failures, 1,146 passes and 23 intentional skips (21.4 minutes); all 2,875 unit tests passed. Two failures waited for Retry after an in-flight automatic check had already changed the same action's label back to Check for updates. The shared test helper now accepts either exact label for that same handler. The third test deleted prepared bytes, then waited to click Restart after a concurrent inventory refresh had already withdrawn it. The test now accepts either an actual restart refusal with the incomplete-download alert, or withdrawal of both Restart and the ready state before the click. Both branches still assert the old build, unlocked app and successful repair followed by restart. Only a click TimeoutError is handled; other errors remain failures.

An independent production-browser rerun passed all 6 affected desktop/phone cases (36.5 seconds). The author's first three-repeat command was disrupted by an erroneous dependency refresh in the root checkout: exit 1, 6 passed / 4 worker failures / 8 not run, with MODULE_NOT_FOUND while node_modules was being replaced. Dependencies were restored and the corrected isolated three-repeat command passed all 18 cases (2.0 minutes), `/tmp/status-ci-races-root-restored.log`. This infrastructure failure is not a product pass.

The duplicate local `cf249e3` full browser run was stopped before editing the tests: exit 130, 764 passed / 18 skipped / 1 interrupted / 389 not run (23.2 minutes), no failed cases. Final-head full results are recorded in the PR.
