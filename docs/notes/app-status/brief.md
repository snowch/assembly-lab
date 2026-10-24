# App status: checked facts and implementation brief

Issue: snowch/assembly-lab#35. Base: ffe0f81. Scope is app shell/offline lifecycle, no lesson redesign.

## Checked facts

- The running commit/date are embedded by vite.config.ts. Existing GitHub main boolean is not evidence of a successful deployment.
- Current worker precaches every production file on install, with SHA-256 integrity, and checks only response presence later. This conflicts with explicit offline consent and eviction/corruption detection requirements.
- Existing worker activation uses PREPARE_UPDATE, VERIFY_UPDATE, CANCEL_UPDATE and skipWaiting after all app windows acknowledge; offline.ts locks interaction, guards input composition and uses updateStorage.saved plus theme session storage. Preserve these protections.
- browserStorage may fall back to memory. updateStorage.saved checks every edited artifact against localStorage. Restart must refuse if these values cannot be preserved.
- Offline features include all bundled lessons, browser assembler/simulator/compiler, fonts, icons and native example downloads. Compiler Explorer, external links and running native tools require network/external software and are excluded.
- All four linked issues specify identical public labels, separate Version/Offline access sections and deployed release comparison. Their repository-specific adapters differ. No shared mock values/timers will be used.
- Existing caches use assembly-lab-offline:<encoded absolute scope>:<release hash>. Scoped removal must preserve all local/session/IndexedDB user data and sibling app caches/registrations.

## Contract and states

Generated release.json schemaVersion 1: buildId SHA-256 (all app assets plus worker template), commit/null, committedAt/null, assets [{path,bytes,integrity}], totalBytes and worker {path,bytes,integrity}. Loaded HTML meta course-build-id is immutable running identity. Metadata checks use a unique same-origin URL, no-store, timeout, stale-response protection; the worker never serves release metadata from cache. Asset hashes validate coherent published bytes.

App status lives in the header on every route, compact running identity and update badge visible closed. Disclosure has Version and Offline access. Updates check network on open/reconnect/visible and about once per visible connected minute. Check does not download course. Update explicitly prepares release, then Restart to update/Later. Only Restart activates/reloads all cooperating tabs. Saved work/route/theme retained; unsafe/unresponsive tabs block.

Offline: explicit Download for offline use with measured app-asset total; real verified byte progress; cancellation retains verified partial entries for resume. Readiness checks integrity/completeness without repair downloads. Old complete caches survive failed replacement. Existing complete saves remain usable/recognised. Remove asks confirmation and only deletes scoped app copies; answers, edits, achievements/theme stay.

## Prose brief

Audience: course reader, no service-worker/cache terminology needed. Prior knowledge: browser tabs, internet connection, saved answers. Use docs/style.md British English and direct instructions. Required labels per issue. Explain restart affects all Assembly Lab windows and may be blocked for unsaved work or an operation. Describe complete older offline copy independently of uncheckable freshness. Include unsupported browser/JS-disabled guidance, unknown source identity, real computed byte size, cancellation/resume/removal confirmation, no invented progress. Separate standard labels from explanation. Draft in separate session; independent browser learner and technical reviews after implementation.

## Verification plan

Unit tests for release generation/validation/check scheduling and stale/aborted/error responses, actual worker built-browser multi-release lifecycle and safe activation. Browser fresh launch offline, failed/cancelled/evicted repair, scoped removal, multiple windows/unsaved/composition, phone/desktop both themes, keyboard, announcements/reduced motion. Exact full-suite and focused results recorded separately; initial failures retained. Capture before/after and measure generated release sizes.
