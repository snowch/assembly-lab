# Shared register row correction

Copyright © 2026 Christopher Snow

## Reproduction and brief

The timing paragraph and register cards shared a wrapping flex container. The paragraph's
global max-width (576px in the reproduced build) capped its intended 100% flex basis, leaving
room for a card beside it. At 768px, w0 appeared on the right of the label and w1 on the next
line. At 960–1280px, both cards appeared beside the label. At 375px they appeared correctly.
The previous tests checked the bank's order before the listings, not card alignment within it;
the previous visual review also missed the wider-screen alignment problem.

Give the register bank explicit stacked rows, and give w0/w1 a dedicated wrapping card row.
Keep x30 below the cards, within the same shared group. No learner-facing wording or model
behaviour changes. The existing addition activity already uses a dedicated card row; the
remaining full-width flex-basis rule is for the separate figure-note layout.

Baseline measurements waited for document.fonts.ready and covered widths 375, 640, 768, 960,
1024 and 1280. Independent review should verify these widths in actual light/dark, including
initial, stepped, returned, Back, reset and reload states. Check visual screenshots as well as
geometry: cards side by side below the timing label, w0 aligned to the group's left edge,
x30 below them, unchanged register/write/address state, and no page overflow. Review the
regression assertions against the intended visible behaviour.

## Independent review

Reviewed independently in separate learner and technical passes by GPT-6.1 Sol
(`gpt-6.1-sol`), High effort. The reviewer did not edit product code or tests.
Read AGENTS.md, CLAUDE.md, the written brief, the actual diff, the relevant authoring,
style and visual-language rules, the lesson and earlier fundamentals, the recorded
function and the return-trace facts tests.

**Learner pass.** The final built figure keeps the timing label above the two cards,
with both cards at the shared group's left side and x30 below them. Inspected final
initial and stepped register-bank screenshots at 375, 640, 768, 960, 1024 and 1280px
in both rendered themes, including full-figure initial/stepped screenshots for the
previously failing 768px case. Also inspected full figures at phone and desktop
widths. The shared registers remain distinguishable from caller/function listings;
Written remains visible without moving the other card's top. No new terminology,
assumed knowledge, prose, prediction answer or prerequisite bridge is introduced
by this layout-only change. Existing fundamentals define registers, operand roles,
caller, argument and the result in w0 before this activity. No outstanding learner
finding in the changed layout.

**Technical pass.** Ran an independent headless Chromium script against the final
production preview on port 4401 after its final rebuild was confirmed. Each of the
12 width/theme combinations checked ten states: initial, after bl, after the
function addition, returned, returned after reload, completed caller addition,
Back to returned, reset, called again and Back before the call. All 120 checks
passed. Waited for document.fonts.ready and checked its loaded status, the actual
html data-theme and computed light/dark body backgrounds. In every state w0 starts
exactly at the bank's left edge, the card tops match exactly, the cards are side
by side below the timing label, x30 is below both card bottoms, and the complete
bank precedes the caller and function. The measured label/card and card/x30 gaps
are 12px; maximum card-top difference and page overflow are both 0px. No figure
overflow, console errors or page errors were observed.

Checked register values and write marks against the existing trace facts; checked
the next/just-ran instruction marks, corresponding C highlights, current-operation
text, caller addresses and saved x30 address. Reload preserves the returned state
and highlights, Back restores the preceding state, reset removes the saved-address
display, and the completed activity disables further stepping. The added wrapper
does not change the trace, saved-position calculation or register rendering inputs.
The earlier addition figure already has a dedicated card row; no shared register
primitive or unrelated layout rule was changed.

**Review observation, resolved.** An interim build vertically centred the untouched
card against a taller Written card. At 375px their tops differed by 8.796875px.
This was a low-severity alignment inconsistency during stepping. The final row uses
align-items: flex-start, independently verified in all 120 states. No rejected or
unresolved finding remains on the final diff.

Read the final regression assertions: they add direct same-row, left-edge,
below-label and below-both-cards checks, sweep the six relevant widths across the
existing projects, and exercise the unequal-height Written states after both
additions. All pre-existing register, address, ordering, Back/reset/reload and
legacy-progress assertions remain. No tolerance was relaxed and no existing check
was replaced. The final browser run above is separate from the managing session's
focused suite and full CI evidence below.

Evidence: /tmp/register-row-independent-review/review.mjs, results.json and final
initial/stepped figure and bank PNGs, plus six width contact sheets. Limits: this
review used Chromium viewport sizes, not physical devices, Firefox or WebKit;
other lessons were read in source only. It did not rerun the complete educational
suite or GNU/QEMU differential tests and does not claim deployment verification.

## Validation

The strengthened existing browser test failed against the previous built layout as intended:
w0 began at x=757 instead of the register group's x=169 at 1280px. This is a regression
reproduction (one failed test, exit 1), not a passing validation run.

Strict TypeScript passed. The first corrected production build passed (9.77 seconds), and
all 6 existing lesson browser tests passed (26.4 seconds). A final refinement top-aligns
the card row when a Written label makes one card taller; the regression also checks those
stepped states and both card bottoms above x30. The final build passed (10.08 seconds) and
all 6 browser tests passed again (28.2 seconds). Formatting and whitespace checks passed.
The independent final review is recorded above. Full CI and deployment evidence will be
recorded in the PR.
