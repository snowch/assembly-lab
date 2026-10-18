# Offline footer: independent learner review

Reviewed 18 October 2026. This reviewer did not draft the text or implementation.
Scope: the new shared footer, README's “Offline use” section and the separate
wording draft. No lesson prose review is implied.

## Result

Pass: no blocking or non-blocking English or layout findings in this scope.
Both closing passes in `docs/style.md` were applied.

- “Saving the course for offline use. Keep this page open and stay connected until
  it is ready.” says what is happening and what the learner must do.
- “Ready to use offline in this browser.” makes the browser-specific scope clear.
  The following sentences name the two internet-dependent activities and explain
  that the saved course can be removed. Read together, these do not promise that
  every link works offline or that the course is saved permanently.
- “The course could not be saved for offline use. Reopen it with an internet
  connection to try again.” states the failure and a concrete next action.
- “This browser cannot save the course for offline use. You can use it while
  connected to the internet.” distinguishes a browser limitation from readiness.
- “An update is ready. Close every Assembly Lab tab or window, then reopen the
  course to use the update.” gives an action that includes an installed app window.
- The README tells a new user to open the course online and wait for the exact
  visible ready message before relying on it offline. Its restrictions agree with
  the footer.

## Assumed knowledge

Ordinary browser use: tabs, windows, internet connections and clearing a site's
browser data. No knowledge of service workers, caches, installation events or
builds is needed. “Compare with GCC” is a quoted control label; understanding
what GCC stands for is unnecessary to understand the restriction.

## Browser coverage

Inspected the built production app through an isolated HTTP server at
`http://localhost:4246/assembly-lab/`. The reviewed build was copied unchanged to
`/tmp/offline-reader-preview` before the managing session rebuilt its dist.

At **1280 × 900** and **375 × 900**, with both **light and dark** colour schemes:

- Loaded the real app, waited for its real ready state, disabled the browser
  context's network and successfully reloaded. Reviewed the resulting ready
  footer in all four configurations.
- Rendered preparing, unavailable, unsupported and update-waiting states through
  controlled browser API substitutions. These inspect the actual built UI and
  its text; they are not a verification of the worker's failure/update lifecycle.
- Captured all 20 configurations and checked their text, status and dimensions.
  No page horizontal overflow occurred. Visually inspected screenshots covering
  both widths and both themes, including the longest update-waiting footer.
- The status uses a polite live region. Text remains in the normal document flow
  and introduces no new controls or focus requirements. Paragraphs are 15px with
  23.25px line height; the text is readable in both themes. This was a DOM and
  visual review, not a test with a screen reader.

Also opened the Module 0 lesson at phone width in both themes and inspected the
same ready footer and paragraph styling there. The course's existing lesson
content was not re-reviewed.

Temporary evidence: `/tmp/offline-reader.mjs`,
`/tmp/offline-reader-results.json`, `/tmp/offline-reader-*.png`.

The subsequent change that preserves an update notice when the current saved
release becomes unavailable does not change the reviewed wording or styling.
Its newly reachable state combination needs the implementation's lifecycle check;
that check is outside this reader review.
