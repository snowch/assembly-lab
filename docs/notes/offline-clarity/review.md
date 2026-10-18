# Independent offline clarity review

Verdict: **pass**. No correction is required for this change.

The reviewer did not draft the strings or implement the layout. The review started
from `CLAUDE.md`, `docs/style.md`, [the checked brief](brief.md), the actual diff,
and the production page. It covered `App.tsx`, `strings.ts`, `styles/app.css`,
the added browser assertions, `docs/offline.md`, and the brief and drafting record.
The worker and hook were read to verify the explanation against their behaviour.

## Learner reading

The status now appears immediately below the header on the front page and lesson
pages. “Ready to use offline in this browser.” gives an explicit completion
signal without requiring a visit to the footer. “How offline use works” opens
the explanation of when the download starts, what it includes, and how to tell
when it has finished.

The sentence “When you first open the course online, your browser automatically
downloads the whole course” identifies both the trigger and the scope.
“You do not need to open each lesson” resolves a likely uncertainty about
unvisited lessons. The next paragraph quotes the exact readiness message and
explains that the learner can then return without an internet connection.
The external-link and GCC exception and the browser-storage limitation remain
nearby. No knowledge of service workers, caches or installation is assumed.

Both style passes were applied: the sentences are direct, and the explanation
gives the trigger, completion signal and consequence in a usable order.

## Actual browser checks

The production preview was `http://127.0.0.1:4262/assembly-lab/`. The front page
and **Meet the machine** were inspected at 1280 × 900 and 375 × 900, in both
light and dark themes. This was a review of the shared status area, not a new
review of the lesson body.

- The current status was visible at the top without scrolling in all eight
  route/viewport/theme combinations.
- The explanation started closed. Keyboard Enter opened it and Space closed
  it; phone taps opened it. The native disclosure marker and keyboard focus
  outline were visible.
- The summary target was 44 pixels high, text was 15 pixels, and neither
  configuration had horizontal page overflow with the explanation open.
- The real worker reached `ready` after a first visit. A temporary server held
  back the worker script so that `preparing` could be read and opened on a
  phone-sized page. Releasing that response produced the real transition to
  `ready`.
- Removing the saved files while offline produced `unavailable` in all four
  viewport/theme combinations. The instruction to reopen online stayed
  visible, and the explanation remained usable.
- A browser context with service-worker support disabled showed `unsupported`.
  It had no disclosure telling the learner to wait for a ready message that
  could never arrive.
- A temporary server served a changed worker script to produce a real waiting
  worker. The update instruction appeared beside the ready message on a
  phone-sized page. This check verified display of the waiting state; it did
  not independently repeat a two-release asset migration.

Temporary evidence is in `/tmp/offline-clarity-review-output.json`,
`/tmp/offline-clarity-update-review-output.txt` and screenshots matching
`/tmp/offline-clarity-*.png`. These local files are not repository artifacts.

## Technical and sceptical checks

`useOffline` registers on app mount rather than on a lesson visit. The worker
downloads its complete release during installation. Its response to the
readiness request checks every required cached response. The visible promise
therefore refers to the whole release in the current browser. The change moves
and explains that existing signal; it does not weaken the readiness check or
alter the download mechanism.

Potential objections were checked against the page and implementation:

- **Does “Preparing” claim a fresh download on every visit?** No. It describes
  the state while either first-time saving or checking a saved copy completes.
  The explanation specifically locates the automatic download on the first
  online visit. The wording makes no claim to measure download progress.
- **Does the closed disclosure hide completion?** No. The actual state remains
  outside it. The trigger and scope are one clearly labelled disclosure away.
- **Does failure leave the learner waiting indefinitely?** The failure message
  explicitly says to reopen with an internet connection. The unsupported state
  omits the wait-for-ready explanation entirely.
- **Does ready promise permanent availability?** The explanation confines it to
  this browser and says that clearing data or browser storage removal can remove
  the saved course. The separate network-dependent features remain identified.

These objections do not survive as findings. No new unexplained technical term
was found in the changed learner text. The documentation and test additions
accurately describe the new location and preserve the offline behaviour checks.

The managing session's scoped verification log was inspected:
`/tmp/offline-clarity-browser.log` records **61 passed and one expected
desktop-only check skipped on the phone project** across the offline,
offline-lifecycle and shell suites. That includes the stronger deployment and
cache-recovery checks beyond this independent page inspection.
