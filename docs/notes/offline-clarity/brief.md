# Offline download clarity

The user cannot tell when the app is downloaded for offline use. Improve the
visible explanation and placement of the existing status, without changing the
download mechanism.

## Checked facts

- `useOffline` registers the production service worker when the app mounts on
  any route. With an internet connection, installation downloads the complete
  release automatically; no separate install action or visit to each lesson is
  required.
- The release contains every lesson and the local tools. `ready` is reported only
  after the controlling worker confirms every required cached response exists.
- Keep the page open and stay connected while the initial download completes.
- Offline use works in the browser that saved the course. External links and the
  optional GCC comparison still need the internet.
- The status can also report failure, unsupported saving, and a waiting update.
  Closing all course tabs/windows allows a downloaded update to take over.
- Clearing browser data or browser storage eviction can remove the saved files.
- Existing UI reports these facts at the bottom of every page, where a reader
  may never see it. Move the status near the top on all routes. Keep the current
  state visible and put the short explanatory details in an accessible disclosure.
- The hook's initial preparing state also covers checking an existing saved copy;
  do not imply every page visit must download all files again.

## Scope and process

Follow `docs/style.md`. A separate drafting pass supplies learner wording in
`apps/course/src/strings.ts`. Preserve useful existing failure/update/limitations
messages. Explain the automatic first download, whole-course scope, and readiness
signal in ordinary language. Do not introduce a percentage or claim to measure
progress; the existing state is the evidence available.

The managing session changes placement and presentation. Independent review must
check wording against the implementation and inspect the actual production page
at phone and desktop widths in both themes. Exercise preparing, ready and failure
states, plus the explanation disclosure. Run the existing offline/lifecycle and
shell checks appropriate to this shared UI change. Record any limits honestly.
