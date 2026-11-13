# Header calculator technical and sceptic review

Independent reviewer; 13 November 2026. No product files edited and no build
performed. Reviewed the immutable final candidate at
`http://localhost:4517/assembly-lab/` in headless Chromium. Candidates at ports 4515 and 4516 were checked separately; the final results
below were repeated on port 4517 after the compact local guidance, persistence
placement, compact-brand and sticky-heading changes.

## Ranked findings and verification

No open technical blocker was found in the checked states.

1. **Medium, accepted and fixed: Close contrast and target height.** The learner
   review's quote **“Close”** identifies an essential action. Its original
   browser-default background did not follow the dark theme, and its reported
   32.39-pixel height violates the phone-control rule. The smallest correction
   is a themed button with a minimum target height, not a different dialog.
   Independently verified in the final build at both widths in both themes:
   height 44.39 pixels; foreground/background contrast 13.79:1 in light and
   13.56:1 in dark. Close is focused on opening, remains reachable after
   scrolling to the bottom, closes the panel, and returns focus to Calculator.
   The scrolled control's centre passes a browser hit test. Its top is 24.59
   pixels on the phone and 97 pixels on desktop.

2. **Medium, accepted and fixed: globally available reading labels need local
   definitions.** The learner review quotes **“Unsigned”**, **“Signed”** and
   **“Hexadecimal”**. The global tool is available before Module 1, so the
   progressive lesson sequence cannot supply its prerequisites. The smallest
   correction is brief visible definitions, keeping exercises in their lesson
   guides. The final tool describes unsigned zero/positive values, the signed
   highest-bit negative weight and hexadecimal digits/four-bit grouping beside
   the corresponding readouts. The signed note appears when Signed is selected.
   These statements agree with the exact model. The qualification before the
   width controls also says widening adds upper zeros without copying the
   highest bit, even with Signed selected. Independently verified both selected
   readings' notes and the hexadecimal guidance before value entry in all four
   width/theme combinations. This is sufficient local guidance for choosing a
   reversible mathematical reading without adding a tutorial. No task or answer-checking
   control appears in the tool.

3. **Low, accepted and fixed: compact branding used a zero font size.** This was
   raised by the managing session's design checks. Suppressing an actual text
   span and retaining an accessible link name is the smallest correction.
   Independently verified the final build: “Assembly Lab” names the brand link,
   its span is hidden at 375 pixels and visible at 1280 pixels, the parent font
   remains 16/17 pixels, and the logo link remains 44 pixels high. Header controls
   fit in one row at every measured width from 320 to 1280 pixels.

## Rejected issues and reasons

- **Signed widening should sign-extend.** Rejected. This is a mathematical
  bit-pattern tool, not an executed A64 instruction. The local qualification
  explicitly says widening zero-fills. Browser checks confirm that changing
  width preserves existing bits and supplies zero upper bits.
- **Half editing may crash on a 64-bit pattern.** Rejected. The tool mounts
  half controls only at 32 bits. At 64 bits those inputs are absent; the
  all-width shift section remains available. Browser checks exercised this
  transition with the highest bits set, then narrowed and widened again.
- **Closing or route navigation loses scratch work.** Rejected. The header
  workspace stays mounted outside the routed lesson tree. Close, Escape,
  reopening and a real lesson-route change preserve pattern, width and reading.
- **The tool can change a lesson's answers or calculator guide.** Rejected.
  The component accepts no grading callback or artifact; its handoff scope is
  distinct from lesson scopes. Browser checks retained a lesson guide's typed
  input and loaded working while using the global tool; localStorage stayed
  byte-for-byte unchanged throughout global calculations and navigation.
- **Reset on ordinary refresh contradicts the retention text.** Rejected. The
  text promises close and lesson-navigation retention. It does not promise
  ordinary refresh retention. Browser checks confirm that refresh resets work,
  while a matching coordinated-update envelope restores it once.
- **A global tool should retain lesson-preset selectors and external links.**
  Rejected. The tool has its own `data-tool` marker, no lesson `data-preset`,
  no tutorial and no links. Existing lesson calculators keep their presets and
  guides. This separation also prevents lesson-only selectors from matching
  two calculators after the shared header is added.

## Browser checks

The independent runner exercised 375 × 812 and 1280 × 800 in actual light and
actual dark themes, confirmed through `data-theme` and computed colours. All
four cases passed with no page errors. Screenshots of every initial final-build
combination were visually inspected. The retained scrolled screenshots cover
phone dark and desktop light; the computed geometry covers all four cases.

Checked initial unsigned zero and 32-bit state; decimal and hexadecimal entry;
upper/lower half replacement and out-of-range rejection; signed readings;
64-bit signed arithmetic; truncation on narrowing and zero-fill on widening;
left shifts at the width limit and rejection of a shift equal to the width;
bit-button keyboard activation and retained focus; reset; absence of tasks and
links; Close and Escape focus restoration; reopening and lesson navigation;
and isolation from a lesson guide's pending answer and working.

The native phone dialog traps Shift+Tab and locks background body scrolling.
The desktop panel permits focus in the header. Resizing an open panel in both
directions preserves its value, changes native modal mode, and releases body
scroll locking on desktop. The header fits at 320, 360, 400, 760, 761, 900 and
1280 pixels. At 375 pixels the dialog is exactly 375 × 812; at 1280 × 800 it is
600 × 710 at x 668, y 78. Neither document nor dialog scrolls horizontally.
All visible phone calculator controls measured at least 40 pixels high.

A separate browser check seeded an exact current-format update envelope with
only `header-calculator::ProgrammerCalculator.global.widths`. Reload restored
its 64-bit signed pattern, pending entry, format, operand, operation and shift.
The envelope was consumed once, the lesson calculator kept its own initial
state, localStorage did not change, and a second ordinary reload reset the tool.
A route-mismatched envelope was ignored. This checks the real built restoration
path; it is not a full service-worker replacement test.

## Source and focused test checks

Read the diff and the shared BigInt model, preset definitions, calculator view,
header lifecycle/CSS, route mounting, update-handoff registration and the app's
coordinated-update call path. The numerical model is unchanged. The reused
operations calculate exact retained bits rather than using JavaScript Number
for whole patterns. The global scope key cannot collide with the lesson or
challenge scope keys. The calculator stays mounted while closed, so pending
entries are included in the shared mounted-state snapshot. The dialog has its
own explicit `inert` flag during coordinated updates, including when native
modal behaviour takes it into the top layer.

Focused command, exit 0:

```text
npx vitest run packages/machine/src/programmer-calculator.test.ts packages/views/src/ProgrammerCalculator.test.tsx packages/views/src/update-handoff.test.tsx
Test Files 3 passed (3); Tests 73 passed (73)
```

The final ad hoc browser runners exited 0. Initial exploratory runner attempts
exited 1 because exact label queries did not include wrapped select option text;
those were harness selector errors, corrected with matching label queries.
They do not constitute product failures or alter any earlier suite result.

This reviewer did not run the full repository check, all five lesson variants in
all themes, full service-worker update replacement, QEMU, screen-reader speech,
soft keyboards, physical touch devices or browser engines other than Chromium.
The managing session records its full-suite and existing lesson-suite results
separately. Source review of the unaffected lesson guide/preset behaviour is not
represented here as a browser pass.

Retained evidence: `technical-browser-evidence.json`,
`technical-final-geometry.json`, and `technical-candidate4-*-scrolled.png`.
