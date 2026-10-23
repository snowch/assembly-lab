# Independent final verification

Copyright © 2026 Christopher Snow

2026-10-23. Checker did not author implementation or validation record. This record distinguishes
source/report checking from final production browser checking.

## Source and engineering-record check

Read `validation.md`, the final Fundamentals row in `docs/plan.md`, all four new lessons' prose,
the synthesis navigation copy, the technical review, later-activity audit and reader findings.

No source/report inconsistency or unjustified curriculum claim confirmed. The plan lists the
five visible lessons and their small-to-complete-function progression. Validation preserves the
original failed commands, does not call the full unit run a pass, and scopes later-course review
to this hidden-activity question rather than universal novice pacing. Command totals are reports
of the executing agents; this checker has not independently rerun those commands.

Accepted corrections are present in source: “This addition” scopes the destination explanation;
the tiny function's ready-to-return discussion is retrospective; sequence explanation removes
“below”; all four third hints use concrete worked inputs/results; synthesis navigation direction
is appended before the paired listing. Canonical-copy integration is reported by focused checks
in the independent technical record, rather than inferred from a drafted export alone.

The four third hints match the already-worked cases: 12 + 7 writes 19; increment(7) writes 8
before return; 20 − 6 writes 14 after reading the old destination; the 8/3 sequence writes 11 then
8. They do not reproduce the complete fresh-input task. Addition's worked and fresh sum both
happen to be 19: the existing technical review explicitly records this caveat, and the fresh
challenge also changes the destination and checks an unchanged input. This is not a new claim
that the numeric sum is novel or that the hint alone demonstrates learner transfer.

## Final production browser check

Final production preview verified after the managing agent's final-build-ready notification,
at `http://127.0.0.1:4322/assembly-lab/`. No app changes or rebuild by this checker.
Fresh browser contexts covered all five affected routes at **375 × 900 and 1280 × 900**, each
with Light and Dark explicitly selected through Theme and confirmed in `html[data-theme]`.

- First addition renders the scoped “This addition reads its inputs and writes its destination.”
- Tiny function renders retrospective “Look back at the state after the addition”. Ran both
  instructions using the actual buttons. The returned state contains one live function status:
  “ret returned to the caller. It left w0 unchanged.” No duplicate “The function has returned to
  its caller.” or arithmetic stopped note remains.
- Opened the first three hints through the normal Show hint button in each new lesson. All four
  concrete worked cases render beneath SMALLER EXAMPLE in every size/theme context. No challenge
  answers entered or stored state injected. The subtraction and sequence cases show the old
  destination/intermediate-value mechanisms described in the accepted fix.
- Synthesis cue is visible immediately before its paired listing in every context. Desktop shows
  numbered C and instructions together; phone starts with C and the cue explains local navigation.
  A real Chromium touch-event drag across the listing exposed the instruction pane in both phone
  themes: local `scrollLeft` **0 → 271** on a **317 px** viewport / **588 px** content. Document
  `scrollX` stayed **0** and document width stayed **375 px**. This demonstrates local gesture
  operation, rather than only setting scroll position programmatically.

Screenshots captured under `/tmp/final-fundamentals/`; directly inspected returned phone state,
phone sequence hint, phone tiny hint, desktop subtraction/addition hints, cue in phone dark and
desktop light, and swiped phone dark instruction pane. Browser logs are
`/tmp/final-fundamentals.log` and `/tmp/final-targeted.log`; transient local artifacts are not
committed repository evidence. The first attempted synthetic scroll gesture produced no movement;
a follow-up explicit touchStart/touchMove/touchEnd drag produced the measured successful movement.
The failed attempt is not represented as passing gesture evidence.

No new defect found in these accepted corrections. This is a focused final verification, not a
repeat of the complete course review, full browser suite or remote CI. The managing agent's
full-check/CI outcomes remain separate from this checker's browser evidence.

## Subsequent full-run scroll failure: independent causality check

The managing agent subsequently reported a full educational run stopped after 194 cases
(exit 143), with a desktop-dark tiny-function no-vertical-scroll failure. This is **not** a
full-suite pass; earlier manual checks above remain their own narrower evidence. Final suite
status is pending isolation and rerun.

Independently read source and `/tmp/fundamentals-scroll-failure/full-check-trace.zip`.
The pane handler changes only the listing's `scrollLeft` and selected-pane React state. More
decisively, trace `before@call@4339` records document scroll **1507**, offline status
`unavailable`, and button “Show C”. Playwright then reports element instability and performs its
own scroll-into-view. The **input@call@4339 snapshot**, before “performing click action”, already
records scroll **1106** and offline status `ready`, while the button is still **“Show C”**. After
the click the label becomes “Show instructions” and scroll remains **1106**. Therefore this
observed vertical change precedes the pane handler; it is not evidence that the handler scrolled
the document. `document.fonts.ready` had already been awaited, so fonts alone do not settle the
separate offline-status transition.

Recommended test correction: isolate the component assertion from background app startup by
waiting for its known offline-ready prerequisite as well as fonts before positioning the
control and recording scroll. Preserve the strict equality assertion and ordinary click/focus
checks. Do not fix this by tolerating arbitrary scroll movement or forcing a handler click.
The trace establishes temporal separation; a deterministic rerun must establish whether that
prerequisite adequately isolates the observed race. No application edits or rerun by this checker.

### Isolation correction reviewed

Reviewed the final test diff independently. It adds only a `.offline-status` `data-offline=ready`
expectation with a 30-second deadline immediately after opening the tiny lesson, before pane
positioning/baseline measurement. The original ordinary pointer action, focus assertion and
exact window-scroll equality remain unchanged. This matches the trace's demonstrated pre-handler
startup transition; no application workaround or weakened tolerance was introduced.

The browser-test agent reports the isolated test repeated three times per phone/desktop and
light/dark context: **exit 0, 12 passed, no skips**, including restoration/reset, in 1.2 minutes.
This checker reviewed the diff and causal evidence, but did not execute that rerun. The focused
isolation issue is resolved on that evidence; restarted complete-check status remains separate
and is not inferred from these twelve passes.

### Build continuity

Managing agent reports the restarted check again passed **144 unit files / 2845 tests** and
production build (8.59 seconds). Its application bundle remains `index-C1z34Iul.js`, with CSS
`index-DRyjSuVo`, identical to the final manually checked application build and first full run.
Only test startup preparation changed; no manual application recheck is required by that test-only
correction. The duplicated focused-rerun paragraph was removed from `validation.md`. Source and
engineering-record checks are complete; the broader 1138-case browser run is still separate and
ongoing, not reported here as passed.
