# Independent learner review: optional flag logic

Reviewer: separate learner/UX agent; no product edits. Reviewed 13 November 2026.
Status: candidate 5 independently verified. No open learner/UX findings in the reviewed scope. Earlier candidate findings and limits are retained below.

## Build and evidence

Real Chromium (`/usr/bin/chromium`, Playwright) against the immutable built site at
`http://localhost:4500/assembly-lab/#/lesson/adding-and-the-flags`.
The page's `course-build-id` was
`e284b14850c6dd769e54eb544b5351c8c96806a1afa52ff307ec6fbc0dde26ad`.
The checkout's base commit was `200b01cee8c4b53fbb7a453e71e33ce8f5f6d1ee`;
the build includes uncommitted candidate work. Source read after the candidate was
built is supporting evidence, not proof of that immutable build's contents.

Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, `docs/visual-language.md`,
`docs/notes/flags-logic/brief.md`, the complete rendered lesson, the optional
renderer/copy/controller, and the earlier four-bit arithmetic prerequisite prose.

Browser checks covered 320, 375, 834 and 1280 CSS pixels, each in actual light
and dark themes. Body backgrounds were respectively `rgb(247, 250, 248)` and
`rgb(16, 27, 26)`. Screenshots also show the lesson's corresponding white and dark
surfaces. All eight combinations had page scroll width equal to viewport width.
Evidence and scripts are under `/workspace/scratch/flags-logic-learner/`:
`review.mjs`, `results.json`, `followup.mjs`, `followup.json`, the eight width/theme
screenshots, and four focused comparison screenshots. They are local review
artifacts outside the repository.

## Findings

### L1 — moderate: the explanation of why XOR works is separated from the mechanism

Page quote: “Why does XOR detect signed overflow?” and “Both overflow cases have
unequal top carries.”

The explanation is sound and includes both non-negative and negative inputs.
However, it follows the entire N/Z/C/V rule list instead of sitting beside the
XOR/top-bit mechanism the user asked to understand. At 1280 pixels the diagram
ends near viewport y597, while the rule list runs to y773 and the explanation
starts below it. At 320 pixels the 237-pixel-high diagram ends near y720, followed
by a 585-pixel rule list before the explanation. These positions are from the
same open-state screenshot/DOM measurement. At tablet width the figure is larger
but the complete rule list still separates the explanation from it.

Direction: place the sign/carry intuition with the relevant visual or V rule,
so the learner can connect each overflow case to the two top carry paths without
retaining the diagram through the intervening rules. Preserve its optional scope
and both positive and negative cases.

### L2 — moderate: 320-pixel scaling makes the circuit labels too small to trace comfortably

Page quote: “FA means full adder” and the diagram's `FA`, `XOR`, `NOR` and carry digits.

At 320 pixels the whole circuit is scaled to 244 by 237 CSS pixels. The main
labels are effectively 12.2 pixels and cell digits 14.2 pixels, measured from the
SVG scale and computed font. Thin zero-signal wires and the crowded C/carry-out
labels are especially difficult to distinguish. At 375 pixels the labels grow
to about 15 pixels; tablet and desktop are substantially easier to follow. Both
actual themes show the same geometric problem. There is no page overflow.

Direction: preserve readable circuit labels at the narrowest supported width,
using an appropriately contained diagram or a layout adjustment. Keep all four
columns and connected carry paths understandable; avoiding page overflow alone
does not establish diagram readability.

### L3 — low: C label crowds the outgoing carry digit

Page quote: `C=1` next to the carry-out digit `1` in the initial comparison.

The focused desktop and tablet screenshots show the C label and carry-out digit
close enough to read as a duplicated label. The C=0 case has the same crowding.
Direction: give the C output its own clear tap and label location. The managing
agent reports that a correction is already in source; that correction was not
present in candidate 1 and remains unverified here.

## Teaching sequence and prerequisites

The complete lesson first distinguishes bit patterns from signed/unsigned
readings, teaches N/Z from retained bits, then C/V from whether the exact sum
fits. The four comparison examples precede the optional circuit. This sequence
gives the circuit a purpose before introducing gate notation. Closing the
optional disclosure leaves all knowledge required for the next practice visible.

The new optional terms are defined locally: “FA means full adder” is before the
figure; NOR and XOR each have their output condition beside their flag rule.
“Exclusive OR” and “NOT OR” need no prior OR knowledge to use those explicit
conditions. A/B/R are mapped immediately above the figure. The figure is visibly
read-only, with no editable-bit affordance. The simplification is local: four
bits, the actual instruction's 32 result bits, and no claim to a processor's
physical layout or carry implementation.

The explanation explicitly connects same-sign inputs and a changed retained
sign to an out-of-range signed sum. Its two cases explain the unequal carries,
rather than only restating the XOR rule. Opposite-sign inputs and matching
carries are also covered. The reasoning can be followed with the full-adder
definition already on the page. No new unexplained prerequisite was established
in this addition. This does not certify every prerequisite in the whole course.

Assumed prior knowledge checked:

- Binary bit positions, signed top-bit weight and signed/unsigned ranges: earlier
  four-bit arithmetic source states unsigned weights and signed weights and
  teaches the signed range. This page also restates its four-bit ranges.
- Adding the two bits and carry: earlier arithmetic prose defines a carry as a
  bit passed left, teaches the incoming-carry calculation and retained bit, and
  distinguishes revealing a column from instruction execution.
- `w0`, `add`, `adds` and 32-bit width: earlier instruction/register lessons are
  assumed by the lesson order; this page restates `adds` and its width before use.
- N/Z/C/V and set/clear: this page defines them before the disclosure.
- Logic-gate names: not assumed; the disclosure supplies the new definitions.

## Interaction, continuity and answer gates

Observed in the browser in all eight width/theme combinations:

- Fresh disclosure closed; Enter opens it and Space operates it after reload.
  The focused summary has a visible 3-pixel accent outline.
- Selecting each of the four examples while open leaves the disclosure open,
  updates A/B/R and the flags together, and keeps focus on the activated example.
- Keyboard Enter switches all examples while closed and leaves it closed.
- Reload restores the last comparison selection and its corresponding diagram,
  with the disclosure closed. Opening after reload shows that restored model.
- The four focused diagrams match their corresponding visible comparison inputs,
  retained results and flags. Carry propagation, result branches into the NOR
  gate, N's top-result-bit tap and the two top-carry XOR paths are visually
  traceable, subject to the narrow-screen and C-label findings above.
- Merely opening/switching the disclosure checks no practice answers, changes no
  hidden answer panels and opens no gated 32-bit result/follow-up. The next
  practice remains unanswered. The report deliberately contains no challenge
  answers.

Source-only continuity evidence: `renderComparison` passes the same selected
comparison model to `flagsLogicMarkup`; the renderer reads its columns and
flags. It contains no separate grading, editable arithmetic state or challenge
reveal action. Exhaustive arithmetic verification belongs to the technical
review, not this UX observation.

## Rejected or unestablished concerns

- “Optional content is needed to answer the next activity”: rejected. The closed
  lesson already teaches the relevant N/Z/C/V rules and signed/unsigned choice.
- “NAND is the intended V gate”: rejected. The page explicitly defines differing
  versus matching inputs for XOR and visibly labels the gate XOR.
- “New independent experiment or unexpected execution”: rejected. Only the
  existing comparison buttons change the read-only figure, and the local
  limitation calls it a simplified model of the addition above.
- “The selected example resets or the disclosure closes on each switch”:
  rejected by all four switches in each width/theme combination.
- “Dark preference produced a light page”: rejected by computed backgrounds and
  screenshots of the actual rendered dark surfaces.
- “Horizontal page scrolling on phones”: rejected by measured scroll widths.
- “The XOR inputs are definitely disconnected”: not established as a learner
  blocker. The two paths end at SVG y254 near the gate's double curved entrance;
  source geometry merits technical inspection, but normal-size screenshots
  largely read as a connected XOR symbol. Do not call exact endpoint contact
  verified from this learner pass.

## Limits and required follow-up

No screen-reader session, touch-device hardware, forced-colour mode, full earlier
course playthrough, exhaustive arithmetic check, or full repository suite was
performed by this reviewer. SVG title/description and native details were read
in DOM/source; that is not an assistive-technology certification. Reviewing the
whole lesson text and unopened gates is not completing its challenges.

Recheck accepted findings in the next immutable/final build, then repeat the
affected width/theme and continuity checks. Later source changes invalidate
corresponding candidate 1 observations. No final approval is given here.

## Candidate 3 verification

Rechecked immutable `http://localhost:4502/assembly-lab/` build
`ba1cf69e73c28c9d019c9a72cd2ef5f0650e488d8de24b24e8d68f13ad4cb27d`.
The first connection attempt returned `ERR_CONNECTION_REFUSED` before the server
was launched. The later browser run passed after the managing agent confirmed
readiness; the initial attempt is not a page defect or a passing run.

L1 is corrected: at 1280 the diagram and V/WHY content are in adjacent columns.
At 320, 375 and 834 the V/WHY content begins 24 pixels below the diagram, followed
by the N/Z/C rules. Both sign-direction explanations remain present. L2 is
corrected: narrow circuits now have 360-pixel width with 18-pixel main labels,
in a bounded labelled scroll region. The page itself has no horizontal overflow.
The region has a visible focus outline in both actual themes and ArrowRight and
ArrowLeft scroll it in both directions. L3 is corrected: C has a separate upward
tap and its label no longer crowds the carry digit. The XOR entrance connection
is also visually continuous in this revision.

Fresh closed, Enter/Space, keyboard switching while closed, all four switches
while open, retained active-control focus, restored selection after reload and
closed disclosure after reload passed at all eight width/theme combinations.
Opening/switching still makes no answers checked and changes no hidden panels.
The body theme colours remain those recorded above. Artifact `final-results.json`
contains candidate 3 measurements; `final.mjs` is the interaction script.

### L4 — low: scroll cue appears at a width where no scroll is possible

Page quote: “Scroll sideways to see the full diagram.”

At 1280 pixels the region has both `clientWidth` and `scrollWidth` equal to 360,
yet the cue is displayed in both themes. There is no hidden circuit to reveal.
At 834 pixels the larger region correctly hides the cue. Direction: make the
cue conditional on actual overflow, including the exact minimum-width boundary.
This is the only newly established candidate 3 finding; final approval awaits
its correction and verification.

The `End`/`Home` keys in the first candidate 3 script exercised their browser page
scroll behaviour rather than horizontal-region navigation. Their screenshots
are not evidence of a horizontal endpoint. The separate `scroll.mjs` uses
repeated left/right arrow keys and captures the region at both horizontal ends;
this is the evidence for keyboard access to the complete circuit.


## Final candidate 5 verification and verdict

Final browser target: immutable `http://localhost:4504/assembly-lab/`, build ID
`6f38aed81e5863aa5699419d47b2e0d5fac2060650571ec49533e4fc1fc34d31`.
All eight width/theme combinations were checked again against this build, with
all eight layout screenshots visually inspected. All four comparison states
were switched and their diagram data checked in each combination; focused
1280-pixel screenshots of all four diagrams were also visually inspected.

- **L1 closed.** The mechanism and its explanation are adjacent on desktop;
  diagram → V/WHY → N/Z/C is the narrow layout. Both positive and negative
  intuitions remain visible, tied to the top-carry XOR equation.
- **L2 closed.** The diagram remains 360 pixels wide on phones, with 18-pixel main
  labels. The labelled scroll region is keyboard-focusable with a visible theme
  outline. Repeated ArrowRight reaches exactly 116 pixels at width 320 and
  61 pixels at width 375; repeated ArrowLeft returns to zero. Both ends were
  visually inspected. The rightmost A/B/R labels and bit 0 remain reachable;
  the left C/XOR/N paths remain reachable. Neither wider viewport needs scrolling.
  The page itself remains contained at every width.
- **L3 closed.** The final C label has a measured 9-pixel vertical gap from the
  carry digit at 320, 375 and 1280, and a 12-pixel gap at 834, for every comparison
  in both themes. Candidate 3's apparently separate tap was only a visual
  improvement: the managing agent subsequently found zero text-box clearance.
  The final measurements establish the further spacing correction.
- **L4 closed.** The cue appears at 320/375, where actual overflow exists, and is
  hidden at 834/1280, including the 360-pixel exact-width desktop boundary.

Default closed, Enter/Space toggling, closed/open switching, active button focus,
restored comparison selection after reload, and initially closed disclosure
after reload all pass again. There are no newly checked inputs or changed hidden
answer panels from opening/switching the optional view. Actual light/dark body
backgrounds and lesson surfaces match the intended themes. No new learner-facing
prerequisite or scope problem was found.

Final local artifacts: `candidate5.mjs`, `candidate5-results.json`,
`candidate5-scroll.mjs`, `candidate5-scroll-results.json`,
`candidate5-geometry.mjs`, `candidate5-geometry.json`, eight layout screenshots,
left/right figure screenshots and the four comparison screenshots, all in
`/workspace/scratch/flags-logic-learner/`. These focused browser review scripts
completed successfully. The scripts' End/Home measurements are retained but are
not used as evidence of horizontal navigation; the separate arrow-key checks
provide that evidence. The reviewer did not run or certify the repository's
full automated suite; its results belong in the managing verification record.

**Verdict:** learner/UX review passes for this final build and the stated scope.
This includes the requested explanation of why unequal carries detect signed
overflow. Technical/exhaustive verification and the earlier stated accessibility
and hardware limits remain separate. Later product changes require the affected
checks to be repeated.
