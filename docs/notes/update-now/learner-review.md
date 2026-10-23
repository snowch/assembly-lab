# Explicit update: independent learner and browser review

Copyright © 2026 Christopher Snow

Reviewer: independent learner/browser agent, same inherited model as the managing session.
Review date: 2026-10-23. Scope: the learner-facing **Update now** interaction and its
readiness, preparation, failure and retry states. Read the written contract in `brief.md`,
repository review instructions and style guide before inspecting the built app.

## Method and limits

Used the actual production build with real Chromium service workers, not mocked update
labels. Read the built assets and worker template into a private in-memory deployment
server before the managing session's concurrent checks could replace files. Published a
new HTML release marker and regenerated the integrity manifest with `renderWorker`.
Each width/theme combination used its own HTTP origin and fresh browser context.

Reviewed 375 × 900 and 1280 × 900, light and dark, confirming each actual rendered theme.
Each context had two real app tabs with unsubmitted exercise edits. A third in-scope,
nonresponsive document modelled an older client. Changed Storage.setItem in one app tab
only to produce an actual memory-only edit; restoring it and editing again produced a
real durable save. Every update installed completely and waited before the action appeared.

This reviewer ran no broad suite and made no implementation edits. Screenshots and
structured measurements are in `/tmp/update-now-*`; the managing session owns source,
concurrency and full-suite verification. The screenshots are inspection evidence, not
an assertion that live physical devices or every browser were tested.

## Accepted finding

**Medium: the unsaved-work message does not explain recovery.** The initial rendered alert
says “Some exercise edits are not saved. Copy your work before trying again.” Copying work
elsewhere does not make the app's durable-storage readiness check pass. Retrying while
storage still fails remains blocked, so the named action alone cannot achieve the
advertised recovery. A learner has no stated next step after making the backup.

Direction: explain the recovery after copying the work, such as safely closing affected
app tabs/windows and reopening, or restoring durable storage and saving again. Do not
imply that copying alone satisfies the storage check or permit an unacknowledged reload.
The managing session accepted this finding and requested a separate wording pass.
The accepted correction is verified in the final build below.

## Initial built-page results

The following passed independently in all four width/theme combinations:

- The notice appears for an actual fully downloaded, waiting release. It explains the
  all-tab reload before the action. The button is 102 × 44 px, has a visible 3 px focus
  outline, and activates with Enter. Actual themes match the requested preferences.
- A storage-failing tab causes refusal and alerts in both app tabs. The original release,
  unsubmitted text and answer remain in place. The main area unlocks after cancellation.
- A nonresponding in-scope document keeps preparation open for the real worker's five-second
  readiness deadline. The preparation message is outside the inert main area and has
  `role=status`; it reads “Preparing the update. Checking saved exercise edits in every
  open tab.” Its rendered font is 18 px. The old tab then causes an explicit error and
  the app unlocks, with no activation or loss of work.
- The nonresponding-tab alert says “Another Assembly Lab tab did not respond. Copy your
  work from the other tabs, close them, then try again.” That instruction provides a
  concrete recovery. After closing that tab, the downloaded update succeeds offline.
- Both app tabs reload exactly once. Their lesson URLs, actual theme and unsubmitted
  exercise values survive. The update action disappears after activation. The browser
  remains offline. An unrelated named cache remains present.
- No page-level horizontal overflow: scroll/client widths are 375/375 and 1280/1280 in
  their respective viewports. No page errors were observed.

The reviewer visually inspected phone-dark waiting notice with focus, phone-light unsaved
alert, desktop-light nonresponsive-tab alert and phone-dark preparation-message images.
The text is readable, the button has a usable touch area, and the error appears with its
retry action. The course's general “Ready to use offline” label remains distinct from
the separate statement that some current edits are not durably saved.

A Playwright role-query count during inert preparation still included the inert button;
that helper count is not used as proof of the browser's accessibility tree. Actual main
inert state and the status's placement outside it were checked. A direct accessibility
and focus-lock verification can be added in the final build pass.

## Final verification

Re-ran the complete focused real-worker review against an immutable snapshot of the
stable final candidate, after the accepted wording and protocol corrections. All four
width/theme combinations passed again. Structured results are in
`/tmp/update-now-final-learner-results.json`; screenshots use
`/tmp/update-now-final-<width>-<theme>-<state>.png`.

The rendered recovery alert now says:

> Some changes could not be saved. Copy your exercise work somewhere safe. Close every
> Assembly Lab tab and app window, then reopen Assembly Lab to use the update.

This provides a concrete recovery after making the backup, without implying that copying
alone satisfies the save check. The waiting notice now explicitly says that all open
Assembly Lab tabs **and app windows** reload. The reviewer visually inspected the final
phone-light unsaved and waiting notices, phone-dark waiting notice, desktop-dark
nonresponsive-tab notice, and phone/desktop preparation messages. The text remains readable
and scoped to this app. The medium finding is corrected; no rejected finding remains.

The final direct Chrome accessibility-tree check resolves the earlier helper ambiguity.
During preparation, the actual tree exposes zero Update now buttons and zero main
landmarks while exposing the preparation message. Attempting to focus an editor inside
the inert main area does not move focus into it. The status remains outside inert content,
rendered at the viewport top (y = 0), with 18 px text; it occupies approximately 80 px high
on the phone and 52 px on desktop. The button remains 102 × 44 px with a visible 3 px
focus outline. Enter activation works. The final phone retry used a real touch tap.

The unsaved and nonresponding-tab paths still refuse activation and unlock the app without
losing current edits. After closing the nonresponding document, the downloaded update
activates while the browser is offline. Both app tabs reload exactly once. In this final
pass the second tab deliberately used the opposite theme from the initiating tab; both
actual per-tab themes survive, as do their lesson URLs and unsubmitted exercise values.
The unrelated cache remains present. The action disappears after successful activation.

Scroll/client widths remain 375/375 and 1280/1280 in both corresponding themes. No page
errors were observed. No full-suite result is claimed by this focused review. The final
protocol's additional concurrency, composition and cache-availability edge cases belong
to the managing session's source and targeted automated checks; this browser review
independently verifies the rendered states and real installation/waiting/activation
behaviour described above.

No remaining learner or visual blocker was found.
