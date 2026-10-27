# Returning to the caller: independent technical review

Copyright © 2026 Christopher Snow

## Reviewer and scope

Independent technical pass by `/root/ret_technical`, separate from the example, prose and
figure authors. Sources and model were read independently before the built inspection.
This report distinguishes source checks, model tests and actual browser observations.

## Sources and model

Read Arm Instruction Set Reference Guide 100076_0100_00_en, D2.130 RET (D2-805), including
RET's optional 64-bit register operand, default X30 and branch-to-register behaviour. Read
AAPCS64 2025Q4 sections 6.1.1 and 6.9: the shared general-purpose registers, convention for
arguments/results and preservation obligations. The lesson's `int` result rule is a calling
convention, not an effect of RET. The direct modern Arm page is an application shell; its
successful response alone does not establish its semantic content.

The course machine's RET implementation calls `takeBranch` with the named 64-bit register;
it changes the next execution position and does not write a general-purpose register. The
course-written wrapper saves/restores X29/X30 in an aligned stack slot, so BL can set X30 to
the visible caller continuation while the outer return address survives. View bounds 2..5
correctly isolate the familiar function addition, its return and the caller's addition. All
three visible operations belong to one full trace. The original recorded function body and
source associations remain intact; the caller is explicitly course-written assembly.

An independent focused model run passed eight tests in one file (1.24 seconds), recorded in
`/tmp/ret-technical-facts.log`. The author's separate GNU/QEMU comparison reports four calls,
32 complete instruction states and zero differences; this review inspected the corpus source
and cases, without claiming that inspection as another native execution.

## Findings and disposition

- **T1, medium, accepted:** the initial explanation said “ret left the registers unchanged”.
  A processor's program counter also counts as a register later in the course. Scope this to
  the shown registers to avoid an overbroad architectural statement. The drafter changed it
  to name W0 and W1. Source correction confirmed; final built verification pending.
- **T2, high, accepted:** initial 375-pixel light build had document scrollWidth 632 against
  clientWidth 375. Figure children expanded to 603 pixels, from x=29 to x=632, including the
  paired listing and controls. This is real page overflow, not the intended contained listing
  scroll. Parent notified with measured evidence. `/tmp/ret-technical-overflow.png` records it.
- **R1, rejected:** “general-purpose” is not an unexplained new term here. One addition says
  “31 general-purpose integer registers, used for ordinary calculations” before this lesson.
  The first lesson also introduces the X/W views, so X30 is not an unexplained register width.

## Initial built checks

The first browser harness at 375 pixels in actual light theme verified initial, all three
stepped states, executed/next instruction markers, the lack of register writes at RET,
shared-register arithmetic, reload restoration, Back and Start again. It then failed on the
real overflow T2; this failed attempt is retained at `/tmp/ret-technical-initial.log` and is
not a four-context pass. Screenshot artifacts record every state. The remainder of the matrix
and final approval await the corrected final build.

## Corrected build and learner findings

The corrected 23.59-second build passed the four-context state check at 375/1280 in actual
light/dark themes: `/tmp/ret-technical-corrected.log`. T1 was visible with the narrower W0/W1
wording and T2 was fixed by containing nested grid items. The paired listing retained its own
horizontal scroll. No page overflow or script errors occurred. Both changed lessons loaded;
A tiny function had four sections and retained both complete function examples. New figure
screenshots in all four contexts were inspected, including the state immediately after RET.

- **T3, medium, accepted:** the fixed X30 target caption said “Caller’s next instruction” even
  after that instruction had executed. The return address remains the address of the caller's
  addition, while the execution position moves on. Naming the stable target avoids conflating
  the two. Drafter and parent notified; final built verification pending.
- **L2, upheld:** the learner's local horizontal-scroll cue finding is supported. At the default
  phone scroll position only the C pane is visible, while the local direction asks the learner
  to watch the instruction marker. A cue beside this figure is appropriate even though the
  preceding lesson taught the interaction.
- **L3, upheld:** the learner measured the shared-register display offscreen during ordinary
  taps at 375×812. My earlier whole-figure screenshots established readable content but did
  not establish simultaneous viewport visibility during tapping. Moving the single shared
  register display near the controls is the smallest correction; duplicating banks would weaken
  the lesson's central claim. A final touch-viewport check will verify the correction.
- **Term ownership:** “An instruction’s address identifies its place in memory” defines
  address locally before use, so the new lesson should introduce `address` in the term gate.
  The later memory lesson can develop that same concept. Other introduced terms have local
  definitions or explicit prerequisites; the general-purpose concern remains rejected as R1.

Independent challenge checks passed both changed lessons at all four width/theme combinations:
blank submissions failed, fresh correct submissions passed, and reload restored the two input
fields. `/tmp/ret-technical-exercises-corrected.log` records this matrix without publishing
challenge answers. The first exercise harness expected “1 of 1 tests pass”, while the product
correctly displayed “All 1 tests passed”. Correcting that harness expectation produced the pass;
the failed attempt remains in `/tmp/ret-technical-exercises.log` and required no product edit.

## Final candidate verification

The 27.04-second final candidate build passed the complete state matrix at 375/1280 in
actual light/dark themes. `/tmp/ret-technical-final.log` records initial, three steps,
correct ran/next markings, unchanged displayed registers and no write marks after RET,
caller arithmetic, reload restoration, Back, Start again, contained width and no page errors.
Both changed lessons were included; the shortened tiny lesson retains its four sections,
complete one/two-argument figures and navigation to the new lesson.

The phone contexts now used a 375×812 touch viewport. After ordinary Run taps at each
visible step, the single shared register display remained inside the viewport. Actual viewport
screenshots `/tmp/ret-technical-phone-viewport-{light,dark}-{1,2,3}.png` were captured before
any whole-figure screenshot could reposition the page. Visual inspection confirms the register
values, current instruction, return target and Run control can be followed together. This
closes L3 with evidence that the earlier whole-figure pass did not provide. T1, T2 and T3 are
also closed in the final build; the target caption now remains “Caller’s addition” throughout.

The engineering diff preserves stable lesson IDs, gives the changed tiny challenge a new ID,
inserts the new lesson in ordinary navigation and advances the synthesis order. It registers
the new figure and stylesheet without editing the copied platform. The validation document
retains the initial failed full suite separately from later results. A source-attribution
correction was accepted: docs/sources.md now distinguishes the checked Arm 100076 RET semantics
from modern DDI0602 page reachability, matching the facts record. The plan/source/validation
changes have no remaining technical blocker.

A final supplemental browser check confirmed the narrowed RET claim, local sideways-scroll
cue, stable return target, actual reachability of the instruction pane and the pinned RET/ABI
reference hrefs: `/tmp/ret-technical-copy-final-corrected.log`. Its first attempt changed the
listing's horizontal scroll while the entire figure was still below the viewport, then wrongly
asserted viewport visibility. Scrolling the figure vertically into view first corrected the
harness; no product edit was needed. The failed attempt remains in
`/tmp/ret-technical-copy-final.log`. L2 is closed in the built page.

**Approved for the changed lessons and model-derived activity.** No unresolved learner or
technical finding remains in this review. The review establishes these bounded browser/model
examples and source claims; it does not claim a new physical hardware execution or a live
browser caller outside the course simulator. Final full-suite/CI/deployment outcomes are the
managing session's separately recorded checks.
