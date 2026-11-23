# Independent shared-style and offline review

Copyright © 2026 Christopher Snow.

Reviewer: a fresh review agent that did not author the implementation. Learner and technical passes were formed from the source, prerequisites, canonical guide and built pages before reading the author’s review notes. No implementation edits were made by this reviewer.

## Scope and identity

Reviewed `/workspace/assembly-lab`, branch `feat/shared-course-offline-style`. Read `AGENTS.md`, full `CLAUDE.md`, `docs/style.md`, the front-page prerequisites, the canonical `/workspace/cuda-python-lab/docs/course-design-guide.md` and its offline contract. Inspected the actual shell/navigation/status source, offline hook/worker/build plugin, retention script and deployment workflow. Afterwards read the shared-course notes to check previously accepted findings.

The completed production build in `/tmp/arm-build-reload.log` was **7f6c8f688d0c4c62f7fcddb72455f05b2e9054e63a69f50fc1a8d0fb877aa1d5**, with a declared complete-copy inventory of **2,717,964 bytes**. Browser work used `/usr/bin/chromium`, real production files, an isolated random-port HTTP server under `/assembly-lab/`, and fresh contexts. Controlled replacement releases were generated from these bytes, with a changed real downloadable file, for update journeys. Evidence and temporary scripts are in `/tmp/arm-independent-20261123/`.

## Learner pass

The learner knows small C functions with conditions, loops and arrays, basic arithmetic, and binary place values; no assembly, compiler tools or service-worker concepts are assumed. The new status wording does not require unexplained implementation terminology. “Up to date online” and “Not saved for offline use” appear together and communicate distinct facts. Explicit saving, whole-course updating, current-tab reload and all-tab restart have local explanations. External documentation, Compare with GCC and native tools are qualified locally in status details.

Read and inspected the home, first lesson, the middle lesson “Widening before multiplication”, and the course outline. Home and first-lesson screenshots cover light/dark at 1440px and 390px. Home also covers both sides of the 900/901px layout breakpoint, in both themes. Actual rendered `data-theme`, IBM Plex Sans, title foregrounds and zero page-level horizontal overflow were measured. The compact cover retains the live model and a visible start choice. No learning claim is inferred from passing assertions.

The first lesson retains its question, register definition, paired code/activity progression and prediction gate. The broader lesson sequence and models were not rewritten by this change. The course menu identifies the current page, groups actual lessons and shows the completion count; On this page remains independently available. Its link closes the section disclosure and follows the section without changing the hash route. Opening course navigation preserved a model already stepped once. Escape closed the course outline and returned focus to its summary.

Observed polish findings:

1. **Low, navigation layout.** The canonical guide says, “Opening Course lessons expands a full-width outline below the complete row”. In the reviewed build, opening it moves the **Course lessons** control to a new line below the progress/breadcrumb row. `course-open.png` shows this at desktop width; `.course-lesson-menu[open]` sets `flex-basis: 100%` and `order: 2`. Keep the complete control/progress/location row stable and expand only the outline beneath it. Navigation still works; this is a shared-design mismatch, not a saved-work failure.
2. **Low, repeated status explanation.** Version details render “Moving between lessons in this tab keeps the version already open.” twice. Confirmed in the real dialog and `status-desktop.png`. The parent removed the duplicate in source during review; this is source-verified, but the reviewed build still contains both copies. Verify the deduplication in the next final build.

No newly introduced prerequisite gap was found in the reviewed shell text. Later lessons’ specialist terminology was not re-audited as part of this shell change.

## Technical pass and real-browser evidence

The independent first browser journey passed (**1/1**, 52.9 seconds; command duration 59.9 seconds), recorded in `browser.log`:

- App status is an actual `dialog:modal`, with a dimmed backdrop, initial Close focus and Escape focus return. Desktop Calculator remains open beneath it after Escape; Reference stays open with its `add` lookup preserved. The modal does not dismiss either tool.
- An explicit Save offline copy downloaded and verified the complete inventory before reporting “Downloaded and ready to use offline”. Initial update checks had not performed a full download.
- After refusing the real server’s connections and setting browser offline, reload opened the saved course. Reference lookup worked, and an unvisited middle lesson opened through actual course-menu links.
- Publishing B exposed Update offline copy. Completing preparation left the existing document on A and offered Restart to update. Composition in that tab vetoed restart with the specific paused-work message. Ending composition and retrying reloaded two tabs to B, preserving their distinct lesson hashes.
- Scoped removal returned to Not saved for offline use and reported that work was kept. This journey checked the displayed removal state; the cross-app/local-storage preservation implementation was additionally inspected in source.
- The journey recorded no page errors.

A second independent browser journey checked **Reload latest course**. It stepped the first lesson’s real JavaScript operation, entered an unfinished prediction, opened course navigation without resetting the model, and used an On this page link. A busy marker vetoed reload. After clearing it, reload opened B in only that tab, preserved the stepped model, prediction, theme and route, and left the second tab on A. The request inventory contained no `native/Makefile` full-copy download. Both phone themes showed a contained native status modal with readable actions and Escape focus return. Its first command exited 1 at the final metadata-error assertion because the temporary harness had left version details closed; all preceding assertions completed. That original failure remains recorded in `extra.log`. A corrected focused rerun explicitly opens details and **passed 1/1** (42.2 seconds; command duration 49.2 seconds), recorded separately in `extra-rerun.log`. It verified the metadata-failure state and Retry action, with neither a false freshness claim nor an automatic full-course download. The initial failed command remains a failure.

Source inspection found the intended safety boundaries:

- Worker install does not save course assets. Readiness scans cached response bytes and SHA-256, rather than trusting a remembered flag. Transfers resume verified files, retain partial progress on cancel, preserve an older complete release, and perform a final complete scan before success.
- Ordinary top-level online navigation requests current HTML with a deadline covering its body. Hash navigation retains the loaded document. Immutable script, CSS, font and download paths keep a document’s release coherent; canonical repair fallbacks require matching original hashes when a saved manifest is known.
- Current-window reload checks composition, transfers/preparation, busy operations, durable artifact state, per-tab view handoff and theme saving. Failed readiness releases the lock and keeps the window open.
- Restart performs PREPARE then VERIFY for every in-scope tab, rechecks the complete target and participant set, and commits one selected-release pointer only after success. Exact prepared-release navigation is tied to participating client IDs. A third publication does not change the committed target. No automatic lesson execution is introduced.
- Removal deletes only this full app scope’s download caches/metadata, preserving learner storage and unrelated registrations/caches. Modern removal deliberately retains selected-release identity so the still-open document can continue to reason about its release.
- The release builder includes worker behavior in the build identity, excludes maps and prior release trees from the current inventory, and pins emitted entry/CSS assets. Publication retains two prior manifests and exact verified files, fails on unavailable/corrupt retention, and reports retained IDs in current metadata. This review inspected that implementation; it did not deploy to Pages or independently download the live history.
- Arm execution remains the bundled JavaScript model/compiler. There is no managed WASM runner, so omitting a Code runner control is appropriate.

## Prior accepted fixes and remaining verification

After forming the above findings, read `verification.md`. Its earlier accepted light-theme white-title and underlying-tool Escape defects are independently verified fixed in the reviewed build. The title is dark on the light page and light on the dark page; top-modal Escape preserves the existing tools.

`docs/offline.md` already describes explicit saving, current-window reload and two prior retained server releases correctly. The older engineering note `offline-engine.md` still says the publication pipeline does not retain historical server trees and says `docs/offline.md` needs migration. Those historical statements should be updated or clearly marked superseded to avoid contradicting the final implementation. This documentation issue was sent to the parent.

This is a functional and learner-readability review, not evidence of learning effectiveness. I did not rerun the full repository suite or independently exercise every failure branch: quota/storage exhaustion, unresponsive/legacy clients, conflicting edits, transfer cancellation/resume/repair, eviction, media ranges, physical mobile browsers, screen-reader output, all 81 lessons, or the public deployment’s actual retained history. Those need the parent’s separate focused/full-suite and publication records. Final source deduplication or subsequent layout changes need final-build confirmation; the identity above must not be presented as covering later bytes.
