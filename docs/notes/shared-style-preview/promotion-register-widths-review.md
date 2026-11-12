# Production promotion: independent register-widths learner review

Reviewed 12 November 2026, finishing at 23:07 UTC. I reviewed only **Writing w and x
registers**, with the learner's earlier lessons complete and no later lesson knowledge.
I did not implement the promotion or change code/tests during this review.

## Candidate and verdict

Actual built candidate: `http://localhost:4462/assembly-lab/#/lesson/register-widths`.
Its `course-build-id` was
`a35d10f08ff1a276938aba9c3901249bcb16f8a0b80c10f2546c73a05b64a32a`
in all six browser contexts. The footer and status menu identify prior commit `26a742d`;
that commit alone does **not** identify the reviewed uncommitted production candidate.

**No blocking, major or minor finding in the checked states.** No content rewrite or
challenge solution is supplied here. This verdict is for the candidate above, not a claim
that a later build or the whole course has passed independent learner review.

## Browser checks

Fresh headless Chromium contexts drove the real built site through installed Playwright,
using the normal `/assembly-lab/` base path. The complete activity/navigation sequence passed
at **375, 834 and 1280 px, each in light and dark**. The actual theme attribute matched the
requested light/dark choice. Separate 375 px checks with System selected and emulated light
and dark preferences produced the corresponding light/dark backgrounds.

- **Default appearance and layout:** the approved shared appearance renders without a preview
  toolbar or its former top gap. The compact header starts at the viewport top. The generated
  outline has the four real lesson sections. Phone uses “On this page”; tablet and desktop
  use the sidebar. All six checked states had document scroll width equal to viewport width,
  with no inspected lesson element extending past the viewport. No `pageerror` occurred.
- **Focus, hash and active section:** keyboard activation of “Skip to content” focused `#main`;
  the focused skip link was visible and hit-testable above the header. Each of the four outline
  links was focused and activated with Enter in every context. Every target received heading
  focus and the URL retained `#/lesson/register-widths`. Target heading tops measured
  approximately 95.6–96.5 px; the header bottom was 62 px on phone and 68 px on tablet/desktop.
  Phone disclosure closed after each selection. At the actual document bottom, both outline
  copies marked “What you now know” current. Scrolling back to the top restored “Two names,
  one register” as current. These checks used reduced motion.
- **Prediction and 64-bit figure:** the stepper was absent before checking the prediction and
  opened after a checked prediction. I advanced it twice, went Back, and used Reset in all six
  contexts. The before/after label, current/next instruction and upper/lower-half labels remain
  readable. “x3: 64 bits”, “Upper 32 bits”, “Lower 32 bits”, “w3”, “cleared” and “written” fit on
  phone and retain distinct roles in both themes. The complete hexadecimal display and both
  bit groups remain contained. A separate reload check confirmed transient stepping returns
  to the initial step while the checked prediction remains available.
- **Logger diagram:** “Run the instruction” shows the computed destination, keeps the input
  register distinguished from the result, and exposes “Start again”. The layout and labels
  were inspected at phone/tablet/desktop in both themes. A separate phone check used “Start
  again” and restored “Before the instruction”.
- **Exercise, edits and hints:** deliberately wrong values produced two field-specific failure
  messages and “Tests passed: 0 of 2.” Editing the answers cleared the prior verdict to
  “No tests run yet”; pressing “Run tests” then accepted valid work. The first three hints were
  revealed in order in every width/theme context, and a separate phone run opened all five
  in sequence. Hints were not exposed before their controls were activated.
- **Calculator and notes:** I opened the programmer calculator, applied independent scratch
  work, narrowed it to 32 bits, and inspected the result, width/reading controls, input guidance
  and bit layout. The calculator explicitly distinguishes its scratch operations from running
  instructions and register writes. Working notes accepted a canary note. After grading and
  ordinary reload, the two saved answer fields and completed verdict returned, and reopening
  Working notes restored the canary in every context. The independent calculator closed and
  reset on reload, consistent with baseline behaviour. Reset calculator was also exercised.
- **Clear work:** “Clear work” followed by “Discard work” restored empty exercise fields in all
  six contexts. Reopening the remounted Working notes panel retained the independent note.
- **App status popup:** keyboard activation of the compact status summary opened a readable
  panel with 16 px text. At 375 px its bounds were x=16–359 and y=61–761 in a 1000 px viewport;
  larger-width panels also remained inside the viewport. On a shorter 800 px phone viewport,
  mouse-wheel scrolling within the panel reached its final paragraph in both System themes.
  The summary dismisses the panel. Version/build identification and offline explanations
  remained legible; no content was horizontally clipped.

I visually inspected screenshots of the shell, popup, register figure, logger diagram and
open exercise/calculator/notes across phone, tablet and desktop, in light and dark. The lesson's
listings are assembly-only, so this review makes no claim about paired C/assembly listings
on other pages. The displayed instructions stay contained and readable here.

## Prior knowledge and source-only reading

I read `CLAUDE.md`, `promotion-brief.md`, “Before you start”, the published lesson composition,
and relevant earlier-lesson source material. The learner already has binary place values,
basic arithmetic and small C functions from the entry requirements. Earlier lessons supply
register destinations, instruction order, `ret`, hexadecimal, signed/unsigned readings,
`mov`, `movk`, the two 16-bit halves and `lsl 16`. The preceding material explicitly explains
that `#` before an immediate is optional. The current page defines **byte** and **address**
before using them, and explains the logger's shift locally. I found no untaught prerequisite
needed to complete this page. No later lesson was used to justify that conclusion.

## Evidence and limits

Temporary drivers and screenshots are `/tmp/promotion-reg*.cjs` and `/tmp/promotion-reg/`.
Two initial exploratory runs failed because the driver matched the Clear work button's
visible text instead of its longer accessible name, then expected a textarea before reopening
Working notes after the editor remounted. These were harness mistakes; the corrected six-context
run completed successfully. They are not recorded as passing original runs or product faults.

This is a focused learner/interface review, not a full-suite result, ISA/model audit,
screen-reader session, real-device touch test or review of other lessons. Service workers
were blocked to isolate the page checks; offline download/update installation and public
hosting were not tested by this reviewer. A later build that changes the reviewed surfaces
needs the affected checks repeated.
