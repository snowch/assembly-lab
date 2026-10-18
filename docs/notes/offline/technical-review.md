# Independent technical review: offline support

Copyright © 2026 Christopher Snow.

Reviewed on 18 October 2026, independently of implementation. Inputs: the offline
brief, worker/build plugin and their unit tests, registration/readiness hook, app
footer and strings, CSS, both offline browser specifications, README offline
instructions and `docs/offline.md`. Existing unrelated course prose edits were
excluded. The footer wording agrees with the separate draft in `words.md`.

## Finding

**Medium: a ready update is hidden when the current release loses its cache.**
At the time of initial review, `apps/course/src/offline.ts` set `updateWaiting` to
`ready && registration?.waiting != null`. This ties the installed update notice to
the completeness of the old release. If the old cache is incomplete and cannot be
repaired, the new release can still be complete and waiting to activate. The footer
then removes the instruction to close every app tab, leaving only “Reopen it with
an internet connection to try again.” Reopening one tab while another keeps the
old worker alive cannot activate the complete update.

Reproduced in a real Chromium browser against the production build: install the
original release; install an update; keep the page open; disconnect; delete only
the original release cache; dispatch the connection change. The registration's
`waiting` worker remained present, but the footer displayed only the unavailable
message. Direction: report a waiting update independently of old-release readiness;
retain the unavailable status for the old release. Add a browser regression check
for this combination. The implementation now reports waiting status independently of active-release
readiness. The built-page recheck below confirms the correction.

## Independent checks

An independent temporary HTTP server served the actual production build. Its
controlled deployment changes were exercised with Chromium by
`/tmp/offline-independent.mjs`. No rebuild of the shared `dist` directory occurred.

- Corrupting an icon response while returning HTTP 200 rejected the first install;
  the page reported unavailable and no release cache survived.
- Restoring correct bytes and reloading recovered to the ready state.
- An update containing an HTTP 200 response with incorrect bytes became redundant;
  the previous release stayed ready. This directly exercises browser integrity
  enforcement, in addition to the committed suite's HTTP 503 download failure.
- A subsequent complete update waited and displayed its footer notice.
- An offline reload while that update waited was served by the worker and kept the
  original release. It did not force activation.
- The cache-loss/waiting-update combination reproduced the finding above.

Code review found no additional defect in the manifest coverage, integrity values,
atomic installation, scope-specific cleanup, GET/request allowlist, navigation
mapping, local storage preservation or production registration boundary. The worker
uses the platform's normal waiting lifecycle without `skipWaiting`; activation
cleans only older caches bearing the exact encoded registration scope. Source maps,
the worker itself, external requests and arbitrary paths are not precached.

The browser tests use separate deployment origins for lifecycle cases and disable
HTTP caching for the whole-course offline navigation check. Those tests check real
service-worker responses, not a synthetic offline mock. The unit tests use mocked
storage and therefore cannot independently prove browser integrity enforcement;
the independent checks above cover that gap. No claim of Safari or Firefox runtime
validation is made.

The technical documentation accurately describes release identity, integrity,
waiting updates, eviction limitations and development-origin isolation. The README
explains the required first online visit and the network-only features plainly.
The brief's limits are supported by the implementation, subject to the recovery
notice correction above.

## Correction check and verdict

The corrected production output was copied to the immutable directory
`/tmp/offline-review-fixed`. An independent rerun with
`/tmp/offline-independent-fixed.mjs` repeated all the above checks successfully.
After deleting only the active release cache while offline, the footer displayed
both the unavailable state and “An update is ready. Close every Assembly Lab tab
or window, then reopen the course to use the update.” The waiting registration
remained present. The medium finding is resolved in the actual built page.

README offline instructions, `docs/offline.md`, the checked-facts brief and separate
footer draft received independent review. No unresolved technical blocker remains
in the reviewed implementation or documentation. Final project-wide test results
are the managing session's separate responsibility; this verdict does not claim
an unrun full suite or browsers beyond Chromium.

## Final browser-test review

Independently read the final versions of both offline browser specifications. The
corrections in `offline.spec.ts` match actual UI behaviour: the theme control has a
containing label, the C challenge uses answer-based cases, the compiler's result
appears after its final simulated instruction, and the explicit GCC comparison
reports the existing `C.playground.failed` message after a network failure. The
local error assertion is made before that deliberately failing network request.
The test still checks failed and successful grading, saved work and theme on reload,
local compilation and stepping, and the inability to call the optional service
offline. These changes fix selectors and timing without weakening the offline
behaviour being verified.

The lifecycle specification now has durable cases for both HTTP 503 and HTTP 200
with incorrect bytes. It clears the request log before the attempted update, checks
that the failed asset was requested, rejects the update, preserves the original
cache and reloads the original app offline. Its new cache-loss case deletes only
the old cache while a complete update waits, checks both footer states, closes the
old client and then opens the new release offline. That covers the reviewed recovery
finding, including actual activation after the recovery instruction is followed.

No additional issue found in these final test changes. Observed the managing
session's logs: all 12 lifecycle cases passed; the two corrected compilation cases
passed on desktop and phone, while the earlier run had already passed the other six
offline cases. These are targeted results, not a claim that the full project suite
was rerun. The managing session also reports a root-base build and browser-restart
offline check; those checks were not independently repeated in this review.
