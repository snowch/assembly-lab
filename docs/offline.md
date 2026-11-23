# Offline operation and updates

Copyright © 2026 Christopher Snow.

The Arm adapter follows the [shared offline/update design](https://github.com/snowch/cuda-cpp-lab/blob/main/docs/offline-update-design.md). It preserves this course's existing artifact, simulation-view and theme handoff rather than replacing its storage schema.

## What the learner sees

Opening or reloading the course online loads current published HTML. Moving among lessons in an already open tab changes its hash route and keeps that tab's coherent loaded release. Small metadata checks run on startup, focus/reconnect and periodically while visible; they do not save the course.

App status provides one Course status section. An online-only reader with a newer published version can choose **Reload latest course**. It saves and checks this tab's work and view before reloading this window only. Unfinished composition, running work, an active download or failed/conflicting saving keeps the current window open with an explanation. This action does not download a complete offline copy or reload other windows.

**Save offline copy** explicitly downloads the complete course. **Update offline copy** explicitly downloads and verifies a replacement, then offers **Restart to update**. An explicit offline update also grants offline consent when no earlier copy existed. Only a complete, currently verified saved inventory can be described as downloaded and ready to use offline. A current online document and an older usable offline copy are reported separately.

Lessons, recorded listings, exercise grading, local assembler/simulator/compiler, fonts, icons and bundled example downloads are included. External documentation and optional Compare with GCC need internet access. Native example execution still requires separately installed tools or the specified hardware; its downloadable source is not a browser-native process.

## Build and immutable identities

`apps/course/offline/plugin.ts` generates SHA-256 integrity metadata after Vite emits the app. `release.json` describes actual canonical files, their byte counts and the worker. Source maps, the worker and previously emitted release trees are excluded from the course inventory. The build ID covers the normalized entry HTML, asset hashes, source version and worker template; the final HTML is then hashed with that ID embedded.

The build also emits exact immutable copies at `releases/<buildId>/`. Entry script/styles and emitted CSS font/asset URLs use that tree. Immutable duplicates do not inflate the displayed complete-course download size. A first visit installs only the small worker, not the full course. There is no external runtime, font host or third-party cache dependency.

A document, published release, worker runtime and selected saved offline release are distinct identities. `course-build-id` records the loaded document. `savedVersion` identifies a selected, complete verified saved copy; `savedCurrent` compares it with the loaded document. Published metadata supplies freshness separately. Metadata checks bypass the saved course and reject stale or malformed responses.

At publication, `apps/course/offline/retain.ts` retains two preceding verified release trees. It checks original byte counts and hashes, including compatibility with the deployment before immutable paths existed. A failed retention blocks publication rather than silently deleting older tabs' dependencies. This is bounded retention, not a promise to preserve every historical unsaved tab indefinitely.

## Download, navigation and recovery

An explicit download resumes already verified files, including identical files in earlier caches. Download responses must match the selected release's exact byte count and SHA-256. Immutable paths are preferred; a canonical compatibility response is accepted only if its bytes verify. Cancellation retains completed files, reports cancellation separately from failure and leaves an older complete copy usable. A failed transfer never promotes an incomplete release.

Normal online navigation is network-first, with a bounded deadline that covers headers and body. Failed or offline navigation falls back to a complete saved release. The worker records the resulting document's identity so later runtime/font/native requests use that document's release rather than mixing versions. Cached bodies are verified, including entry HTML; corrupt bytes are not silently served or described as ready. Readiness inspection does not start a repair download.

Preparing an update leaves current documents and the selected saved release unchanged. After a verified update, Restart opens the exact prepared release even if another version is published in the meantime. A restart ticket applies only to the participating clients; an unrelated new online visit can still open the newest publication. Closing the app after preparation alone does not secretly promote the staged copy.

## Saved work and coordinated restart

The existing PREPARE_UPDATE → VERIFY_UPDATE → COMMIT_UPDATE / CANCEL_UPDATE protocol remains. Every open in-scope window pauses controls, checks edited artifacts against durable storage and prepares its own theme and simulation-view handoff. The second verification catches an overwrite while a slower tab was still editing. Composition, running operations, active file transfers, unresponsive tabs and memory-only/conflicting edits veto restart.

Activation verifies the complete replacement and participants before it commits. Per-request IDs isolate cancellation and supersession. Unsafe saving or a missing update leaves the current release open; an older client without the handler blocks forced reload. A current-window online reload uses the same local save/view/theme guards but does not broadcast, activate an update or alter another window.

Remove offline copy deletes this app's scoped downloaded files and consent, including partial/staged copies. It preserves all learner local/session/IndexedDB data and sibling app caches/registrations. Browsers can evict files or clear site data; readiness is checked from actual bodies, not a remembered percentage. Offline availability is not a permanent backup.

## Verification

`npm run check` runs formatting, copyright/platform integrity, types, unit tests, production build and educational browser tests. Focused engine tests cover first visit without automatic downloads; online B with saved offline A; fresh offline tabs and actual simulator work; corruption; cancel/resume/quota failure; exact B restart after C publishes; current-window online reload without full saving; two-tab work/theme/view preservation; composition/busy/saving vetoes; legacy migration; removal; and retained release integrity.

UI checks cover a persistent modal, focus/Escape/backdrop, one primary action, phone/desktop themes, readable status and header, and Calculator/Reference work under the top modal. Full-suite results, focused reruns, interrupted runs and independent review findings are recorded separately in [shared-course-style notes](notes/shared-course-style/). These are functional checks, not evidence of learning effectiveness.
