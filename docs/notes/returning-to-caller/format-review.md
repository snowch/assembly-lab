# Return figure formatting correction

Copyright © 2026 Christopher Snow

## Brief

Screenshot 4335 shows the registers/caller indented relative to the title, function
listing and controls. After RET, the return-address arrowhead intersects the caller
row's dotted next-instruction edge. The previous review checked clearance from text
boxes but omitted execution border strokes, so it missed this visual collision.

Keep the same trace, words, saved progress, x30 card and numeric-address destination.
Align all sections on the figure's content edge. Route the connector through the
existing figure padding, keeping it inside the card. Place dotted next and solid
just-executed edges beside instruction text, with existing triangle/status meanings
preserved. Remove compounded title/status paragraph margins inside the grid.

No learner text changes. The component is unique to Returning to the caller; shared
listing code and sibling figures remain unchanged. Read the existing canonical prose,
recorded trace facts and visual-language conventions when reviewing. Check both the
line and arrowhead against visible execution borders, not only text rectangles.

## Independent review

Reviewed independently in separate learner and technical passes by GPT-6.1 Sol
(`gpt-6.1-sol`), High effort. The reviewer did not edit product code or tests.
Read the repository instructions, this brief, the actual diff, canonical prose,
recorded trace facts and applicable authoring/style/visual-language conventions.

**Learner pass.** Viewed final called/returned connector screenshots at all six
widths in both themes, and initial/function-ADD/caller-ADD card screenshots at all
twelve configurations. Also inspected complete phone, tablet and desktop figures,
including returned and completed states. The title, bank, Caller, function listing,
current-operation text and controls now share the same content edge. The compact
title/status spacing reads clearly. Return address remains a labelled dashed route
to the numeric address; the next-instruction triangle and dotted edge sit beside
the instruction, with no arrowhead/edge collision after RET. Just-executed marks
remain solid with the executed-row fill. Cards, unset text, labels and lines remain
legible. Existing definitions before the figure and earlier fundamentals provide
the required knowledge; no new words, prerequisite bridge or answer disclosure is
introduced. No outstanding learner finding.

**Accepted finding, medium severity, resolved.** The first formatting build used
`H -16`, assuming 24px padding. At 375px the actual figure starts at x=16 and its
content at x=29, with 12px padding. The route centre was x=13, outside the figure;
the screenshot visibly cropped the vertical route. Reported this before approval.
The final correction measures half the actual frame-to-content inset. Independently
verified the rebuilt route and its full stroke inside the figure at every tested
width/state. The first image is /tmp/return-format-first-phone.png. No rejected or
unresolved finding remains on the final build.

**Technical pass.** Tested the final 10.58s build on preview port 4401 after the
gutter correction. At 375, 640, 768, 960, 1024 and 1280px in actual light and dark,
an independent Chromium script passed 228 checks: nineteen per configuration,
covering initial/reloaded initial, BL, seven visible-BL resize checks through all
six widths and back, function ADD, RET, reloaded returned state, caller ADD, Back,
reset, BL again, Back before the call and legacy saved-progress restoration.
Waited for document.fonts.ready and loaded status; checked actual html theme and
distinct computed backgrounds. Maximum section-start and three-card-top differences
were 0px. Direct title/status paragraph margins were 0px. No page/figure overflow,
console errors or page errors occurred.

Unlike the previous review, this pass sampled both the connector line and arrowhead
at intervals of at most 1px, included their full 2px stroke width in figure bounds,
and checked both against visible execution-border rectangles. No line/arrowhead
intersection with those borders was found. The nearest connector stroke remains
5.5px inside the figure's left edge. All row-edge execution borders are transparent;
the active dotted/solid borders are in the instruction column. Also checked both
paths against caller text boxes and connector-label clearance. The endpoint remains
4px before the numeric address and vertically centred on it, with measured error
0px. The route disappears before BL/reset and stays attached through all connected
states and resizes.

Verified model-derived register values, write marks, saved/caller addresses,
next/just-ran instructions, matching C highlights, current-operation text, completion,
Back/reset/reload and migration. Twelve additional browser checks restored BL and
passed actual accessible-name and complete accessible-description assertions for
x30 and its destination. At 375/640px in both themes, scrolled the paired function
listing to its instructions and back: C/instructions remain side by side inside
the listing, and the page does not overflow. Source review confirms the shared
listing renderer, other figures, words, trace and saved-position rules are unchanged.

Read the final regression additions: aligned starts, transparent row-edge borders,
dotted/solid instruction edges after the address, and connector routing inside the
frame while resizing. These preserve existing semantic, address, card-order,
restoration and reset assertions. The earlier narrow-layout failure remains a
failed run; the separate final six-test result is recorded below. No tolerance was
relaxed to hide it.

Evidence: /tmp/return-format-independent-review/review.mjs, results.json, final
figure/bank PNGs and contact sheets, plus four scrolled-listing screenshots. Limits:
headless Chromium viewport review, not physical devices, Firefox/WebKit or a
screen-reader session. Other lessons/model facts were source-reviewed. The reviewer
did not rerun the full educational or GNU/QEMU suites or verify deployment. The
final focused results below were received before completing this note.

**Final wording addendum.** Independently reviewed the later user-approved prefix
“In our example, ” in learner and technical passes, using the same reviewer/model
and effort. It scopes the observation to the worked call without introducing new
knowledge; the existing RET trace assertion confirms the unchanged register values.
The source and canonical prose match. After the final 12.18s rebuild, checked the
complete rendered paragraph and inline code at 375/1280px in actual light/dark,
with fonts loaded; inspected all four screenshots. The exact prefix is visible,
the paragraph reads clearly and there is no page overflow. No finding. This was a
text-only follow-up; the figure implementation from the review above is unchanged.
Screenshots: /tmp/return-format-independent-review/scope-{light,dark}-{375,1280}.png.

## Validation

The first focused browser run reproduced connector clipping on narrow viewports:
2 failures, 1 passed, 1 interrupted and 2 not run when stopped to correct the gutter.
The fixed pixel inset assumed desktop padding; the correction measures the actual
frame-to-content inset. The final separate run passed all 6 browser tests in 52.7s,
including resized, stepped, restored and reset states. Production build (10.58s),
strict TypeScript and changed-file formatting passed. CI and deployment evidence
will be recorded in the PR. The model is unchanged.

The later user-approved prefix “In our example,” scopes the existing observation.
The corresponding canonical/facts tests passed (9 tests), formatting passed and
the final production build passed in 12.18s.
