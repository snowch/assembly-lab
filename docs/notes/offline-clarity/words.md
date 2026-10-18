# Offline wording draft

A separate drafting pass read [the brief](brief.md), `CLAUDE.md` and
`docs/style.md`, then checked `apps/course/src/offline.ts` and
`apps/course/offline/worker.js`.

## Checked facts

- Opening the production app registers its worker automatically. Installation
  saves the complete release, including lessons the learner has not opened.
- The initial state also covers checking a previously saved course. It does not
  reliably distinguish a new download from that check.
- Readiness follows a check of all required saved files. It applies to the
  current browser, and allows a later visit without an internet connection.
- Existing messages explain failed saving, unsupported browsers, waiting updates,
  external features that need the internet, and loss of saved browser data.

## Draft decisions

`STRINGS.offline.preparing` now says “Preparing” rather than “Saving”, so a
returning learner is not told that all files are being downloaded again.
It retains the instruction to keep the page open and stay connected.

New keys:

- `detailsLabel`: “How offline use works”.
- `downloadExplanation`: names the automatic first download and whole-course
  scope, then says that visiting every lesson is unnecessary.
- `readinessExplanation`: quotes the exact completion message and says what the
  learner can do once it appears.

The current status stays visible above the disclosure. The explanation refers to
that status as “the message above”. It does not introduce a download button,
percentage or timing estimate. The existing readiness, failure, update,
limitations and storage messages are unchanged.

Both closing style passes were applied to this short passage. It gives the
trigger, completion signal and consequence in that order, using ordinary words.
Independent review must check the wording in the built page and the supported
states; this draft is not its own approval.
