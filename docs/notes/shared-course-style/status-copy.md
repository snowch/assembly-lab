# Shared course status and course navigation: copy draft

This separate drafting pass covers `apps/course/src/strings.status.ts` and the
course-navigation labels in `apps/course/src/strings.layout.ts`. It follows
`CLAUDE.md` and both closing passes in `docs/style.md`. The parent session will
review and integrate the draft, then arrange independent verification. This note
records sources, wording and integration conditions; it is not a review verdict.

## Objective and prior knowledge

The learner should be able to tell whether the course is current online, whether
a complete copy is saved for offline use, and what their next action will do.
The learner knows browser tabs, internet connections and saved work. They do not
need service-worker, cache, manifest or WebAssembly terminology.

## Checked facts used for the draft

- `apps/course/src/latest-commit.ts` checks published release metadata on startup,
  focus, reconnect and visibility changes, and every visible connected minute.
  Checking fetches metadata, not the course download. The parser checks supplied
  asset sizes and integrity values; the total comes from the asset list.
- `apps/course/offline/worker.js`, `verified`, compares byte length and SHA-256.
  `inspect` checks every required file; `complete` requires all files to pass.
  Download progress counts verified file bytes, including files retained from an
  earlier attempt. Incomplete or cancelled replacement downloads retain an older
  complete copy.
- `apps/course/src/offline.ts` separates first save from preparing an update.
  A prepared update is followed by an explicit restart. Input composition and
  readiness checks in all participating tabs can block that restart.
- `docs/notes/app-status/brief.md` records saved-work, route and theme preservation,
  scoped download removal, integrity checks and the external-tool limitations.
  Its separate Version/Offline sections and older compulsory-download lifecycle
  descriptions do not govern the new shared layout.
- The parent session supplied the checked online-navigation facts: this course
  uses hash routes and one loaded JavaScript bundle. Moving between lessons in an
  open tab retains that release. Opening or reloading online fetches the current
  published HTML. A previously saved complete version remains the offline
  fallback until the learner chooses to update it. The worker has an explicit
  network mode and keeps a saved fallback for the older-client migration path.
- The parent session approved a safe online reload of this tab when a newer
  published version is known. This preserves the route, view, theme and saved
  work, and does not download the complete offline course or reload other tabs.
  Unfinished typing/composition, a running operation, or failed/conflicting
  saving must veto the reload. This is a separate action from optional offline
  save/update and the restart of all app windows after a complete update.
- `packages/machine/src/index.ts` exports the browser assembler and simulator;
  `packages/machine/src/assemble.ts` implements synchronous `assemble`.
  `packages/compiler/src/compiler.ts` implements synchronous `compileC`.
  The supplied implementation facts confirm there is no persistent WASM runner.
- The existing brief and `CLAUDE.md` distinguish local browser tools from external
  documentation, optional explicit Compare with GCC requests, and native tools
  installed outside the browser. Browser storage can be evicted.
- The parent implementation retains Calculator and Reference in the header and
  derives course module names, lesson names and completion counts from course
  data. Existing On this page labels remain for section navigation.

## Draft and integration conditions

`App status` names the header control and dialog. `Course status` names the single
main dialog section.
`Version and download details` names optional details. `Close` names the explicit
dialog close action. Existing status keys remain available for component and test
compatibility.

The principal state/action pairs are:

| Condition | Status | Primary action |
| --- | --- | --- |
| Current published version; no offline save | Up to date online; Not saved for offline use | Save offline copy |
| Complete, verified current copy | Up to date online; Downloaded and ready to use offline | None required |
| New published version; no offline save | New version available | Reload latest course |
| New published version; old saved copy retained | New version available | Update offline copy |
| Transfer underway | Updating offline copy or Saving for offline use | Cancel download |
| Complete update downloaded | Ready to restart | Restart to update |
| First save incomplete | Offline copy incomplete | Resume download |
| Freshness cannot be checked | Update status unknown while offline or Couldn’t check for updates | Retry when online, where useful |

Freshness and offline readiness are separate facts. Unknown freshness must not
turn a verified complete copy into an incomplete copy. An incomplete replacement
must not hide an older complete fallback. Use `olderOfflineExplanation` only
when an older saved version is known. Use `freshnessUnknown` alongside an actual
readiness statement, not instead of one. Do not pair `Up to date online` with an
`Update offline copy` action for the same version.

`Offline copy is older` is available as a short header state when an older saved
version is known. `Ready online` is available when online course access is known
but current published-version freshness has not been established. Neither phrase
asserts a complete offline download.

`automaticChecks` explains automatic lightweight checks without implying consent
to download. `updateExplanation` explains the complete download and explicit
restart. `restartExplanation` covers every app tab/window and preservation of
saved work, current page and theme. Specific restart errors explain unfinished
input, unsaved/conflicting work, unresponsive tabs and an incomplete update.

`onlineExplanation` identifies opening/reloading online as the point at which
the current published version is loaded. `hashNavigationExplanation` explains
that moving between lessons keeps the release already open. The implementation
term “hash” does not enter the learner-facing string.

`actions.reloadOnline` names the safe online action `Reload latest course`.
`reloadOnlineExplanation` limits that action to this tab and identifies retained
work, page, view and theme. The online explanation distinguishes this from saving
the complete offline course. `reloadErrors.offline` requires a connection;
`reloadErrors.unsaved` explains that this tab stayed open and directs the learner
to finish typing/running operations and resolve saving problems. The handler
must apply the supplied typing,
operation and saving vetoes before navigation; this copy does not establish them.
With no saved copy and a newer known release, reload is the primary action and
Save offline copy is secondary. With a saved copy, Update offline copy is primary;
online reload may be secondary.

`bytes` and `progress` format supplied byte values as decimal MB, rounded to at
most two decimal places. They do not supply a fixed size or simulated progress.
`exactBytes` remains available inside optional download details. Show progress
only when its measured total is known; unknown totals have no percentage.

`removeExplanation` says downloads are removed while drafts, answers, lesson
completion and preferences stay. Failure and cancellation copy says an existing
complete offline copy remains. `limits` and `storage` state the internet,
external-tool and browser-storage limits beside the offline information.

The navigation additions are `courseLessons`, `courseOverview`, `breadcrumb`,
`currentModule`, `currentLesson`, `completed(done, total)` and `sourceFooter`.
The row uses actual course titles and counts. `Breadcrumb` supplies an accessible
navigation label. `Source` labels the relocated repository link in the footer.
The existing section-navigation strings are unchanged. Escape/focus behaviour
belongs to the parent implementation and introduces no new wording.

## Handoff checks still needed

This pass read the existing dialog, release checking, download and integrity
source. It did not change lifecycle code or run the final dialog in a browser.
The parent session must review wording against the implemented state selection,
then verify the rendered dialog, navigation, actions and announcements in all
affected states at phone/desktop widths in both themes. Independent learner and
technical reviews remain part of that integration.
