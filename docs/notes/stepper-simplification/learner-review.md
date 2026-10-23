# First stepper: independent learner review

Copyright © 2026 Christopher Snow

Reviewed the written brief, revised investigation text and actual built Meet the machine
lesson as a learner who has completed its preceding sections. Used a separate preview on
port 4187; confirmed its bundle was the final `index-DUFVRPuI.js` build before opening it.
No app source was edited. This review covers the requested first stepper, not a broad
course or full-suite audit.

Fresh Chromium contexts covered 375 × 900 and 1280 × 900, light and dark. Confirmed actual
rendered `data-theme` attributes. The four-context probe and screenshots are in
`/tmp/stepper-learner-results.json` and `/tmp/stepper-<width>-<theme>-<state>.png`.

## States reviewed

- Before the preceding prediction is committed, the first stepper stays locked. After
  commitment, its initial state shows the four register choices and starting register
  values, with no operand diagram or Explain this step disclosure. The investigation
  defines operands without supplying the destination convention before this check.
  The text correctly frames the first question as recall of the earlier prediction.
- Both an incorrect first choice and a correct first choice produce brief feedback
  followed by the computed arithmetic result. Choices disappear after execution. The
  destination card is marked Written; the untouched register cards remain neutral.
- The default first-step and later-step views contain one result line and the register
  cards, with the detailed reads/writes closed. The later result uses the preceding
  computed value. Old choices and the first step's verdict do not remain on later steps.
- Explain this step opens with Enter and keeps keyboard focus on its summary. The summary
  measures 44 px high in all layouts. Only the executed first step's explanation contains
  the operand diagram. Its sources, operation and write agree with the accompanying
  computed explanation. The detail remains optional rather than adding a second open
  panel to the ordinary step.
- Moving Next, Back or Reset closes the explanation. Back from the second step to the first
  does not preserve an old verdict or leave details open. Back to zero and Reset both
  remove the disclosure and diagram and restore the initial four-choice question.
- At the final return, Next is disabled, the status says “The function returned”, and the
  local end note explains return to the caller. No register is marked Written by `ret`.
  Its optional explanation says that `ret` does no arithmetic; it does not fabricate a
  calculation or show the prior arithmetic as if it were the return's effect.
- Show the bits and Hide the bits still switch the same register group between bit and
  decimal views after resetting. The paired C/instruction listing remains present, with
  the executed operation and next instruction distinguished as before.

All of these interaction checks passed in each of the four viewport/theme combinations.
Scroll/client widths stayed 375/375 or 1280/1280 throughout initial, first, later, expanded,
back, reset and return states. No page errors were observed.

## Actual image inspection and understanding

Visually inspected phone-light initial, first, later and expanded-first screenshots;
phone-dark first and return screenshots; desktop-light first; and desktop-dark expanded
first. This was image inspection, not merely screenshot generation.

The default view is materially simpler than the earlier always-open flow explanation:
one short result tells what just happened, the Written card identifies its destination,
and the optional disclosure holds the source values and operand diagram. The user can
follow the arithmetic without choosing a destination on every step or reading two open
explanations of each write. The optional view still supplies the mechanism when wanted.

Controls and text remain legible in both themes. The Written marker remains explicit text rather than depending only on colour. The first instruction's result
is not exposed by a diagram before it executes. The earlier prediction deliberately
teaches the intermediate register; the new question is a guided check rather than a
claim of an unseen discovery.

No missing prerequisite or confusing new term was found that blocks the intended activity.
The extra operand diagram is now inside the first explanation, rather than preceding and
answering that activity. There is no accepted or rejected learner finding to resolve.
No remaining learner or visual blocker was found.

The default behaviour of other steppers and the separate missing-ret experiment were read
in source only by this reviewer; their broader automated verification belongs to the
managing session. This review does not claim a full-suite result or physical-device test.

A separate dark-phone spotcheck scrolled the listing sideways to the instructions pane.
The executed addition and distinct next-instruction arrow remain readable, with no page
horizontal overflow. The three navigation controls measure 66 × 44, 64 × 44 and 70 × 44 px.
The actual screenshot `/tmp/stepper-375-dark-first-assembly.png` was visually inspected.
