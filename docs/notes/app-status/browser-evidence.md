# App status browser checks

The acceptance tests use actual production assets, the build's `renderRelease` generator,
real Cache Storage and browser service workers. Private HTTP origins serve coherent release
variants. A variant changes both HTML and a downloadable native example; its build ID,
worker, asset hashes and release metadata are regenerated together. Download progress and
activation are never simulated. Server-side delays and failed responses exercise failure paths.

The earlier offline tests assumed installation automatically downloaded all app files and that
a waiting worker activated after the final tab closed. Issue #35 replaces those behaviours with
explicit download consent and explicit restart. The updated tests retain fresh offline launch,
all-lesson availability, browser compilation and grading, saved exercise edits, achievements,
theme, route restoration, multi-tab participation, composition guards, unresponsive-tab refusal,
cache integrity failure and sibling-app isolation. Native example downloads are additionally
fetched and checked against their measured hashes after disconnection.

## Initial integration run

Command:

```sh
AL_PORT=4353 npx playwright test tests/educational/offline.spec.ts tests/educational/offline-lifecycle.spec.ts --project=desktop
```

Result: exit 1, 12 passed, 6 failed (3.1 minutes). Log:
`/tmp/status-browser-first.log`. This was an initial integration build, before the active-worker
staging correction; it is not the final build or a passing full-suite result.

Failure analysis:

- Three saved-copy update cases failed during preparation. Reusing a cached Response passed its
  body to `cache.put`, then attempted to clone the consumed body. The worker correction clones
  before storing, and its unit mock was changed to consume the body as real Cache Storage does.
- Two cross-tab cases looked for an alert through the role API while the second tab's App status
  disclosure was closed. The tests now open that actual panel before checking its error. They
  retain all assertions that restart was refused, the tab unlocked and the edit survived.
- The metadata/network test assumed `response.fromServiceWorker()` must be false for a request
  that a worker forwards directly to the network. That is not what the API reports. The test now
  checks that the server received the request and that the newly published release body was
  returned, with no metadata saved into app caches. Out-of-scope requests and non-GET requests
  still assert that they bypass the worker.

The old direct waiting-worker replacement test is replaced by explicit deferred-staging and
activation-recovery checks. The implementation now stages through the active worker rather
than installing a waiting worker; browser-driven waiting-worker replacement is no longer the
update mechanism. Cross-tab cancellation/refusal remains covered. Closing every app window
after Later must keep the old running release when reopened, until Restart is selected.

Final candidate results are recorded below, separately from the earlier integration failures.

## Second integration run

Command:

```sh
AL_PORT=4353 npx playwright test tests/educational/offline.spec.ts tests/educational/offline-lifecycle.spec.ts
```

Result: stopped at the managing session's request (exit 130) after 27 passed, 5 failed,
1 interrupted and 11 not run (4.9 minutes). Log: `/tmp/status-browser-second.log`.
This incomplete run is not counted as a passing full run.

The first build's response-body reuse and closed-disclosure assertions were corrected.
Actual update/restart, multi-tab saved work, composition guards, failed/corrupt download
recovery, real storage-quota exhaustion/recovery, cancellation/resume/removal, fresh offline
launch of every lesson and native download, local compilation, unsupported browser behaviour,
keyboard access, themes and the busy compiler guard passed in the completed checks.

Remaining failures identified two product recovery issues (prepared-file eviction left a stale
ready state, and saving a freshly refreshed online-only release failed) and two test assumptions.
The test expected old release caches to be deleted immediately, although the active-pointer
protocol intentionally retains a complete previous copy for recovery. It now verifies the new
release identity/cache and any retained prior copy; scoped removal separately checks that all
app asset entries are removed. Reading a forwarded service-worker response body through
Playwright's `response.json()` hung, so the test reads that actual response body inside the page's
`fetch` call while retaining the network and freshness assertions. The phone repetition of the
old cache-cleanup assertion is included in the five failures.

## Third integration run interrupted before completion

The same two-file, both-project command started against candidate build
`72a79b3e0dbf60a3b0467d3cd71d97a1cd8586a7783a0281c74620dd89f891cf`.
The managing session requested a stop after an independent review identified a late-cancellation
race and the worker required another change. Exit 130: 2 passed, 1 interrupted, 45 not run
(19.4 seconds), no failed cases. `/tmp/status-browser-final.log` contains this interrupted run.
A concurrently started real legacy-build script was also interrupted before a complete result;
its context-closed exception follows that interruption and is not counted as product evidence.

## Candidate five integration run

Build `6f7f767345c8b88433c4749d1e088d1da88c0acdc03fb0fa30f397413a0039e5`.
The two-file command was stopped for the next reviewed build: exit 130, 28 passed,
1 failed, 1 interrupted, 18 not run (4.8 minutes). Log:
`/tmp/status-browser-candidate-five.log`. The failure exposed a real state-label bug:
a complete temporary update cache without offline consent was labelled incomplete and offered
Resume download. The correction keeps offline consent independent and offers Download for
offline use after an online-only update. The same run passed the desktop simulator/bit-view and
uncommitted-radio handoff test, plus its ordinary-refresh reset checks.

The standalone legacy script initially used an over-exact Theme label selector and failed
before testing migration; it now uses the established Theme label matching. The next script
passed the first two migration scenarios but failed its offline-fallback expectation. Actual
page text and a screenshot showed the new UI, while the private server log still received
service-worker network requests after Playwright's page-level offline emulation. This was an
offline harness limitation, not an established product failure.

The diagnostic rerun additionally destroyed real HTTP connections during disconnection.
It then passed the failed-legacy-restart → close all tabs → fresh offline old UI → reconnect
new UI scenario, retaining work, route and theme with no page errors. Log:
`/tmp/status-legacy-offline-gated.log`. All final private offline fixtures now physically refuse
HTTP connections as well as enabling browser offline emulation. The full-course and local
compiler fresh-launch checks use this fixture too. Earlier page-offline checks alone are not
claimed as proof that service-worker network access was unavailable.

## Candidate six complete focused run

Command:

```sh
AL_PORT=4353 npx playwright test tests/educational/offline.spec.ts tests/educational/offline-lifecycle.spec.ts tests/educational/app-status-entry.spec.ts
```

Build `b8cfaed0e1761e1e03248127eead65a3dfeaef9e5fad8f1dd7cdc1c2e1cbaa1b`.
Exit 1: **50 passed, 4 failed** (7.0 minutes), no skips. Log:
`/tmp/status-browser-candidate-six.log`.

- The same-loaded-HTML runtime update case waited for an unchanged identity rather than the
  actual document reload. A click reached the old, correctly locked document, followed by the
  newly closed disclosure. The test now waits for the restart's `domcontentloaded` event before
  opening the new panel. A focused desktop/phone rerun passed: 2 passed (18.3 seconds),
  `/tmp/status-runtime-restart-rerun.log`.
- That focused rerun mistakenly shared Playwright's default output directory with the still
  running complete command. It removed active trace files, causing the phone Later case to fail
  in `context.close` with `ENOENT` after its actual assertions had passed. Subsequent commands
  use separate output directories. An isolated phone reproduction passed all three repetitions
  (23.8 seconds), `/tmp/status-later-repro.log`.
- The two phone theme/layout cases found a real 25-pixel source-commit link in the open panel.
  The correction gives that control the required touch height. The meaningful design assertion
  remains unchanged.

The command's original exit status remains a failure. Neither focused rerun converts it into a
passing complete run; the corrected final build is checked below.

The separate actual legacy-build command, `node /tmp/status-legacy-browser.mjs`, passed all
three scenarios against candidate six, exit 0. `/tmp/status-legacy-candidate-six.log` records:
old Update now → new UI → fresh offline launch; natural activation after closing old tabs →
online new UI; and a refused old restart → all tabs closed → actual offline old-copy fallback →
reconnect to the new UI. All preserved code edits, theme and route without page errors. The
private HTTP server refused real network connections during each offline window.

## Reviewed candidate nine

Command:

```sh
AL_PORT=4353 npx playwright test tests/educational/offline.spec.ts tests/educational/offline-lifecycle.spec.ts tests/educational/app-status-entry.spec.ts --output=/tmp/status-candidate-nine-results
```

**Exit 0: 58 passed (4.9 minutes), no failures or skips.**
Log: `/tmp/status-browser-candidate-nine.log`.
Build: `f6055ae94a885f04bb7e575afa13c32b6d06865b9dd8364dbeaaf15234771c15`.
The generated manifest measures 2,392,883 bytes of app assets and a 26,603-byte worker.

Both desktop and touch-phone projects covered:

- the native App status disclosure before JavaScript and with JavaScript disabled;
- source identity, deployed-release checks and update badges without automatic course saving;
- real preparation, deferral, coordinated restart and safe refusal for unsaved work,
  input composition, processing and unresponsive windows;
- recovery after failed/corrupt downloads, real storage-quota exhaustion, cancellation,
  prepared-file eviction and removal after a deferred replacement runtime actually activates;
- restart handoff of simulation position, bit display and an uncommitted prediction, keeping
  its prediction gate locked, plus ordinary-refresh reset of transient state;
- first-save cancellation/resume, measured progress, scoped removal retaining user and sibling
  data, and retention of a broader sibling worker registration;
- fresh offline launch of every lesson, browser compilation/grading and hashes of all native
  example downloads while the real private HTTP server rejects connections;
- keyboard operation, actual light/dark themes, reduced motion and unchanged layout constraints.

The sequential actual legacy-build check also passed all three scenarios, exit 0:

```sh
node /tmp/status-legacy-browser.mjs
```

Log: `/tmp/status-legacy-candidate-nine.log`. The old build is the actual isolated production
build of `ffe0f81`, not a simulated old client. Its Update now bridge, natural online bootstrap
and failed-restart/offline fallback retained exercise edits, route and theme with no page errors.
Offline periods physically rejected HTTP connections as well as using browser emulation.

## Checks reserved for the committed build

Two small UI changes followed candidate nine: clearing a previous preparation's progress at
new preparation start, and keeping Update actionable when a newer published release supersedes
a deferred prepared one. Candidate nine's 58 passes are not claimed to exercise those edits.
The new supersession regression is included in the final full check and will also run on the
committed build in both browser projects. It preserves A after refusing stale B, then prepares
and restarts into C.

A separate `/tmp/status-two-builds-browser.mjs` check uses the saved candidate-nine output at
`/tmp/app-status-before-commit-dist` and the complete post-commit Vite build. It requires distinct
embedded source commits/build IDs, then checks detect → prepare → Later → explicit two-tab
restart → new running identity → fresh offline launch. No HTML or asset mutation creates these
two releases. Its final result, the focused supersession result and full-suite/CI results are
recorded in the delivery PR after that committed build; no passing result is invented here.
