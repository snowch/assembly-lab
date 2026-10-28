# Registers before the call listing

Copyright © 2026 Christopher Snow

## Brief

The user approved putting the shared register state before the caller and function
instructions, matching the earlier addition examples. Show one shared display containing
w0, w1 and x30. Its timing label is “Before the call” initially and “Registers now” after
stepping. Keep the current instruction, feedback and controls below the listings.

These two labels were supplied and approved in the conversation. No new draft is needed.
Use the existing model state and write highlights; do not add a second register bank,
change the program, or change saved progress. Back/reset to the initial position must
restore the initial label, while reloaded progress uses the label for its saved position.

Read the actual change with CLAUDE.md, docs/style.md and the preceding Fundamentals
lessons. Independent learner and technical passes must check the built page at phone
and desktop widths in actual light/dark themes, including initial, stepped, returned,
Back, reset and restored states. Check DOM and visual order, x30 address matching,
write highlights, contained listing scrolling and page overflow.

The old browser assertion requiring registers to remain in the viewport after pressing
the controls tests the previous layout. Replace it with the requested ordering assertion;
retain the register-value, instruction, address, state, restoration and design checks.

## Independent review

Reviewed on 28 October 2026 by a separate agent who did not write the change.
Model and effort: GPT-6.1 Sol, High. The same reviewer completed distinct learner
and technical passes. The technical pass retains High rather than the Extra High
suggestion in `docs/authoring.md`. Only this section was edited by the reviewer.

### Learner pass

No findings. Read the complete lesson, its changed figure, `docs/style.md` and the
preceding Fundamentals material. The approved labels “Before the call” and
“Registers now” identify the timing of the single shared state. They introduce no
new technical term. The heading “Registers shared by caller and function” applies
to w0, w1 and x30 together, before either listing. The caller and function remain
visually separate beneath that state, with the current instruction, feedback and
controls below them. Both closing style passes found no issue in the two labels
or their connection to the existing explanation.

Assumed knowledge added by the change: none. Registers and instructions are taught
in One addition. A tiny function teaches the caller, arguments, listings and `ret`.
The current lesson explains the return address and x30 before the figure. Its
existing small call remains the worked demonstration before the fresh-input
exercise; this layout change does not require a new preparatory activity.

Inspected the final built initial figures at desktop 1280 × 800 and phone
375 × 812 in actual light and dark themes. Inspected post-BL and post-RET figures
across those width/theme combinations, plus the horizontally scrolled phone
function listing in both themes. The group, timing label, both ordinary register
values and x30 target are readable. One shared display precedes Caller, then
increment_int; controls remain below the listings. No duplicate bank or page
overflow was observed.

### Technical pass

No findings. Compared the source diff with the previous component. The change
moves the existing w0/w1 summaries and x30 target into one group before the two
listing sections. It does not change trace generation, view position, address
mapping, written-register checks, saved-position migration or save format. The
timing label uses that same position: zero selects “Before the call”, including
Back/reset, and every stepped position selects “Registers now”. Both strings match
their canonical record. The program and compiler listing are unchanged.

Independently ran the actual assembler and simulator against the caller example
and its arguments, then compared rendered state with that model in the browser.
Checked one shared group, exactly one w0 and w1 summary, and exactly one x30 target
inside that group. In every checked state, verified both DOM order and measured
vertical order: register group, Caller, increment_int, current instruction,
feedback and controls.

Browser checks used the final 8.62-second production build at
`http://localhost:4401/assembly-lab/#/lesson/returning-to-caller` in fresh Chromium
contexts for all four width/theme combinations. Each context covered initial,
BL, function addition, RET, caller addition, reload at every forward position,
Back through every position, reload before BL, Start again after BL, and reload
after reset. Values and write markers matched the model throughout. The caller
addresses remain 4194308 and 4194312; numeric x30 is absent before BL and equals
4194312 after BL through RET and the caller addition. Only BL marks x30 Written;
the function and caller additions mark w0 and w1 respectively. RET marks neither.
The next-instruction marker and displayed moment remain consistent after reload.

Also restored the legacy slot `{ step: 2 }` in every context. It restores the
same post-RET state at visible position 3 with “Registers now”. Back reaches the
preceding state and saves `{ step: 2, startStep: 1 }`, confirming the existing
migration still operates with the moved display.

Verified actual `html[data-theme]` values and body backgrounds: light
`rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. Document width stays at 1280 or
375 pixels as appropriate. Caller rows, shared state, x30 target and controls
remain contained. The phone function pair scrolls inside its 317-pixel viewport
over 588 pixels of content; the complete C and instructions remain paired. No
console or page error occurred.

Reviewed the browser assertion change: removing the requirement that the register
bank remain in the viewport after clicking lower controls is appropriate for the
requested order. Its replacement checks bank-before-caller-before-function geometry
initially and after RET. Existing value, instruction, address, restoration, design
and error checks remain, with new timing-label and single-group assertions. No
test was weakened to excuse a model or state failure.

No accepted or rejected findings, and no correction required. Product and test
files were read only. The reviewer ran a focused browser/model harness, not the
repository test suite; suite results remain in Validation. Challenge submissions,
hint states, external reference fetching and a broad course regression review were
outside this layout review.

## Validation

- Existing canonical-prose and model-fact suites: 2 files, 9 tests passed (0.87 seconds).
- Strict TypeScript, formatting and whitespace checks passed.
- Production build passed (8.62 seconds), with the existing bundle-size advisory.
- Existing lesson browser suite: all 6 tests passed (20.2 seconds), covering phone/desktop,
  both themes, new ordering/timing labels and retained value/address/restoration checks.
- Final CI and deployment results will be recorded in the pull request.
