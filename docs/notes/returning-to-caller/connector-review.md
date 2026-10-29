# Link register and return-address connector

Copyright © 2026 Christopher Snow

## Brief and facts

The user approved putting x30 beside w0/w1 as a third register card labelled Link register,
replacing the wide link-register bar with a connector to the caller's numeric instruction
address. Label the connector Return address. Show it only after BL sets x30 to that address,
and retain it through RET. Before BL, retain Not yet set for this call. These labels were
supplied and approved; no new explanatory prose is needed.

The existing model supplies both x30 and the caller continuation address. BL saves the
following instruction's address; RET preserves that register and resumes at that address.
Existing facts tests check these rules. Do not change the program, progression or saved-state
migration. The connector must end at the address, not an operand, and must remain distinct
from the triangular Runs next marker. Its route must avoid prose and instruction text.

Use a reserved gutter and a measured SVG connector within the caller/registry diagram.
The actual DOM geometry must drive endpoints after resize, fonts load and state changes.
Keep a labelled textual destination available to assistive technology. Use theme tokens and
no decorative animation. The shared register row remains a separate layout container.

Independent learner and technical reviews must check the final built initial, BL, ADD, RET,
caller ADD, Back, reset and reload states at 375, 640, 768, 960, 1024 and 1280px in actual
light/dark, waiting for fonts. Check card layout, endpoint geometry, route/label clearance,
readability, no overflow, unchanged values/write highlights and distinct next-instruction
semantics. Inspect screenshots as well as automated geometry checks.

## Independent review

Reviewed independently in separate learner and technical passes by GPT-6.1 Sol
(`gpt-6.1-sol`), High effort. The reviewer did not write or edit product code or
tests. Read AGENTS.md, CLAUDE.md, this brief, the actual diff, the relevant
authoring/style/visual-language rules, the lesson, its prerequisites, the recorded
function and existing return-trace facts.

**Learner pass.** Inspected the final built page in both actual themes at 375,
640, 768, 960, 1024 and 1280px. Viewed called and returned connector screenshots at
all twelve configurations, and initial/function-addition/completed register-card
screenshots at all twelve. Also inspected full phone and tablet figures. x30 is
recognisably a third register card, with its Link register label and saved number.
The labelled dashed Return address route arrives before the numeric caller address;
the separate triangular Runs next marker remains after that address, beside the
instruction. Their different positions, line treatments and labels keep the two
meanings clear even after RET makes the caller addition run next. The gutter avoids
the caller prose and operands. Text and connector lines remain readable in both
themes, including the phone heading and unset-card text wrapping. No unexplained
new prerequisite or missing bridge was found: this lesson defines address, return
address and link register before the figure; earlier fundamentals teach registers,
caller, argument and the integer result in w0. No learner finding accepted or
rejected; no outstanding issue in the changed figure.

**Technical pass.** Ran an independent headless Chromium script against the frozen
production build served on port 4401. Each of the twelve configurations checked
nineteen states/resize cases: initial, initial after reload, BL, seven visible-BL
resize checks through all six requested widths and back to the starting width,
function ADD, RET, returned after reload, caller ADD, Back, reset, BL again, Back
before the call and legacy saved-progress restoration to the returned state. All
228 checks passed. Waited for document.fonts.ready, confirmed loaded fonts, checked
the actual html theme and distinct computed light/dark body backgrounds.

All three card tops align exactly, w0 begins at the shared bank's left edge and
the bank remains above the caller and function. In all 180 connected checks the
route starts at x30's bottom centre and ends 4px left of the caller's numeric
address, vertically centred on it. Measured start/end error was 0px. Sampled the
whole SVG route at intervals of at most 1px and checked its clearance from caller
headings, prose, column headings, address cells, instruction text and status/marker
text. Checked the label against the same text boxes and the card/caller boundary;
its minimum clearance from the bank and caller was 10.90625px on each side. No
text collision, page/figure overflow, console error or page error was observed.
The connector is absent in all 48 before-call/reset checks.

Verified unchanged w0/w1 values and write marks, x30 writes only after BL, the
saved-address value, caller instruction addresses, next/just-ran marks, matching C
highlights, current-operation text and completion behaviour. Reload preserves the
returned values and highlights; Back/reset restore the expected preceding state;
legacy progress restores the same machine state with a correctly measured route.
The connector persists through RET and the caller addition without becoming a
next-instruction marker. Its SVG is hidden from assistive technology and the x30
card's described-by target resolves to Return address, the actual saved numeric
address and Caller’s addition. Source review confirms the register/role naming,
theme tokens, lack of animation, observer cleanup, font/resize measurement and
unchanged trace/progression/migration logic.

Read the changed browser assertions independently. The former below-cards x30
assertion is correctly replaced by same-row third-card ordering for the requested
design. The old destination text inside the wide bar is replaced by a complete
accessible-description check containing the saved address and destination; its
anchored pattern permits only whitespace before the colon where the hidden span
starts. New
SVG endpoint assertions use actual card/address geometry, exercise visible resize
and stepped/restored states, and check connector absence before BL/reset. The
1px tolerance is bounded; this review measured 0px error. Existing value, write,
instruction, address, Back/reset/reload and legacy-progress checks remain. The
canonical string record is synchronised with the approved Return address label.

Evidence: /tmp/return-address-independent-review/review.mjs, results.json, sixty
full-figure PNGs and sixty bank PNGs for initial/BL/ADD/RET/caller ADD, plus six
connector and six register-state contact sheets. Limits: Chromium viewport review,
not physical devices, Firefox or WebKit; accessible DOM relationships were checked,
not a screen-reader session. Other lessons and model facts were read in source.
This independent run is separate from the managing session's focused tests/full CI;
the reviewer did not rerun the full educational or GNU/QEMU suites and did not
verify deployment.

## Validation

Local validation: strict TypeScript, production build, formatting and the focused
canonical/facts tests passed (2 files, 9 tests). The first browser run failed four
of six tests because accessible-description normalisation inserted a space before
the hidden colon. The assertion now permits that whitespace while requiring the
complete saved address and destination. The separate final focused browser run
passed all 6 tests in 32.7 seconds. Product code did not change between these runs.
Full CI and deployment results will be recorded in the PR.
