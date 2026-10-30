# Decimal registers before the trip listing

Copyright © 2026 Christopher Snow

## Brief

The user approved removing Show the bits and its explanatory sentence from the
trip activity, then asked to put registers above code like the preceding pages.
Apply both to the two steppers in Putting it together: trip trace and missing-ret
experiment. These teach arithmetic, writes and control flow; decimal values are
sufficient. Keep binary displays in the later bit-reading lessons.

Add opt-ins to the shared stepper with unchanged defaults for other lessons.
A decimal-only activity must ignore any previous bitsShown selection. Render the
same model-derived register bank before the listing without duplicating it. Keep
writes, listings/highlights, controls, flow explanation and gates unchanged.
Delete the existing sentence in source/canonical prose; no new learner prose.

## Independent review

Independent reviewer: GPT-6.1 Sol (`gpt-6.1-sol`), High effort, in separate learner
and technical passes. Read the brief, actual source/test diff, canonical prose,
trace facts, prerequisites and applicable repository/style/visual rules. The
reviewer edited no product or tests. No draft was needed for the approved deletion.

**Learner pass.** Inspected final trip and missing-ret screenshots at 375/1280px
in actual light/dark, including initial, stepped/returned and crossing states.
The same four decimal cards now appear once above each listing, so the inputs and
current values are visible before reading the code. Written marks remain clear.
No bit-display control remains in either activity. The missing-ret prediction
still gates its run; its deletion control, execution path and flow explanation
retain their existing meanings. Required operand/return preparation remains in
the earlier lessons; this changes presentation without adding knowledge or prose.
No finding.

**Technical pass.** An independent Chromium script passed four configurations on
the final 9.32s build at port 4401, with loaded fonts, checked html theme and
computed backgrounds. Its 96 recorded state/layout cases, plus gate/keyboard checks,
cover trip initial/each arithmetic
instruction/RET/Back/reset/reload; missing-ret locked/unlocked, original return,
deleted return, crossing, terminal return, Back/reset/reload; and two later-default
representatives. In all decimal states there is exactly one bank with four cards,
above the listing, without bit cells or Show/Hide controls. Checked values and
write marks, matched C/instruction highlights, completion and unchanged reload
behaviour. The committed prediction survives reload while local inspection resets;
the gate hides bank/listing/controls before commitment. Keyboard deletion works.
C and assembly stay paired, with real contained sideways scrolling checked on the
phone. No page overflow, console error or page error occurred.

On Same bits, two readings, the unchanged default still renders two 32-bit rows
after the listing and retains them while stepping. On Counting up, the default
decimal view still offers Show/Hide the bits and reveals/hides 96 cells. Source
review confirms allowBits defaults true, registersFirst defaults false and only
the two approved trip steppers opt out/in. The extracted display is inserted in
one conditional location; model inputs, trace logic and gates are unchanged.

The new regression first selects bits and verifies 128 cells, then rerenders the
same component/id/store with decimal-only/registers-first props. It verifies no
toggle/cells, bank order and correct values before/after stepping; it meaningfully
checks that the earlier selection cannot override the opt-out. Existing default
toggle tests remain. Related browser updates retain all seven widths and 200%
scaling, and the offline-restart test retains multi-tab position/status, unfinished
answer/prediction and gate checks while expecting the approved decimal view.
The removed bit-cell assertions concern these deliberately decimal activities;
generic default-bit/handoff coverage remains. Canonical/source sentence deletion
matches. No unresolved or rejected finding.

Evidence: /tmp/trip-decimal-independent-review/review.mjs, results.json and final
trip/missing-ret/later-bits PNGs. Limits: Chromium viewport review, not physical
devices or other engines. Seven-width/scaling and offline-restart coverage above
was source-reviewed and its focused results are recorded separately below; the
reviewer did not rerun full CI, GNU/QEMU or deployment checks.

## Validation

Final production build (9.32s), types and 77 focused unit tests passed, including
switching from a selected binary view to the decimal-only configuration. Existing
generic stepper bit-toggle tests retain unchanged-default coverage. Focused trip
browser run: 22 tests passed (37.8s). Related register-summary and offline restart
browser run: 6 tests passed (30.0s), preserving seven-width wrapping, 200% scaling,
multi-tab step/status/prediction/unfinished-answer and gate checks. These now expect
the trip activity's intentionally decimal view. No instruction/model changes.
The five existing generic update-handoff unit tests also passed (3.96s), including
retaining a bit-view choice when the feature is enabled. Final types and formatting
passed. Full CI and deployment results will be recorded in the PR.
