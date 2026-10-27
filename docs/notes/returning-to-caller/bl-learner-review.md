# Visible call: independent learner review

Copyright © 2026 Christopher Snow

Reviewed 27 October 2026 by a separate learner-review agent, using the parent model and effort.
The reviewer did not draft or edit the lesson or figure. Read AGENTS.md, CLAUDE.md, the
style checklist and prerequisite lesson copy before reviewing the built page. The follow-up
authoring brief was not used to form this assessment.

## Verdict

Approved. No blocking learner finding in the reviewed build. The introductory connection to
A tiny function now has a concrete referent: “increment_int left its result in w0”. The new
BL explanation answers where the return address comes from before the learner runs the call.
The figure demonstrates that explanation by marking X30 as written and identifying its target
as the caller’s addition. RET changes the next instruction while the shared result stays put.

## Prerequisites and bridge

The page assumes registers and their W/X names, input/destination operands, register and
constant addition, C functions and arguments, the caller, the integer result in W0 and the
basic purpose of RET. These are taught in One addition, Adding a constant and A tiny function.
Address, return address and link register are defined before the figure. Calling convention is
explained locally when the result-register choice is distinguished from RET’s action.
No unexplained required term survived this pass. Stack machinery is outside the shown slice
and is not required to trace it; the model-scope note states that preparation and the caller’s
remaining instructions are omitted.

The mechanism is defined before use, demonstrated through four visible instructions, and
practised with a fresh argument at two explicitly named moments. A smaller example that starts
inside the function would omit the step that supplies X30. The added BL step is the necessary
bridge; no separate lesson or additional operation is needed before this exercise.

## Browser evidence

Reviewed the production build served at http://localhost:4399/assembly-lab/, built in 16.96s.
Actual rendered light and dark themes were checked at 1280×812 and 375×812. Phone contexts used
isMobile and hasTouch, with actual taps on the instruction control. No page errors or horizontal
page overflow were observed. Inspected screenshots of the entire figure, control area and
challenge in both sizes/themes.

- Course-plan entry opens the lesson directly.
- Initial state shows BL as next, starting W0/W1 and X30 not yet set for this call.
- Each of BL, function addition, RET and caller addition has the expected next/ran marking.
- X30 is marked Written only after BL. Its target remains the caller’s addition after RET.
- The shared W0/W1 display, X30 target and operation cue stay in the viewport during control
  taps. Both themes retain visible borders, write highlighting and instruction markers.
- Back, reload/restored progress and Start again return to consistent instruction states.
- The fresh exercise rejects an incorrect submission, accepts the correct trace, regrades the
  restored answers after reload and clears them through Discard work in every context.
- The complete C remains beside the instruction listing; the page provides a local sideways
  scroll cue for phones. The caller’s course-written assembly is separately labelled.

Walkthrough script/log: /tmp/bl-learner.mjs and /tmp/bl-learner.log.
Exercise script/log: /tmp/bl-learner-exercise.mjs and /tmp/bl-learner-exercise.log.
Screenshots: /tmp/bl-figure-*, /tmp/bl-375-*, /tmp/bl-1280-*.
These are focused browser observations, not a claim that the full suite was run by this reviewer.

## Rejected concerns

- A novice might read X30’s pre-call label as an uninitialised register. The label says “Not yet
  set for this call”, rather than zero or empty, and the preceding prose says BL saves this
  call’s return address. No unsupported numeric value or empty-register claim is presented.
- The phone initially shows the C half of the paired listing. The directions explicitly say
  to scroll sideways, matching the established listing interaction. The current instruction is
  also repeated beside the controls, so operating the figure does not require seeing both panes
  at once.
- The caller’s later instructions are not shown. The visible final state says the activity stops
  after the caller instruction and the scope note explains the omission. This does not imply
  that executing the shown addition ends the whole program.

## Harness failures retained

The first exercise harness assumed the verdict text was “Some tests failed.”; the actual shared
component reports a count. It failed its selector after submitting the wrong answer. The second
attempt used an exact “Clear work” accessible name, but the button includes the challenge title
in its aria-label. It timed out after wrong/correct/restored checks. Correcting the harness to
use the actual count messages and the labelled reset/Discard work interaction produced all four
passing contexts. No product edit or tolerance change was made. Original logs remain at
/tmp/bl-learner-exercise-first.log and /tmp/bl-learner-exercise-second.log.

Both style closing passes were applied: sentence clarity and whether the explanation arrives
through the actual example. Source-reading covered the full lesson and prerequisite copy;
independent architectural verification belongs to the technical review.

Phone touch-scroll verification also passed in both themes: a CDP touch swipe within the
paired listing moved it 271px horizontally while the page stayed within its viewport. Logs and
screenshots: /tmp/bl-learner-scroll.log and /tmp/bl-swiped-*.png.

## Final-build vocabulary correction

The course-wide check subsequently caught a gap this first learner pass missed: the BL reference
link named “branch with link” before branch was locally defined. Accepted as a medium clarity
finding: the link name is learner-facing text even though the reference is optional. The local
correction now says “A branch changes where execution continues” and expands BL before its
concrete call example. This supersedes the initial statement that no unexplained term survived.

Independently checked the corrected paragraph in the final 12.93s build, at the same preview
address, in all four actual phone/desktop light/dark contexts. The branch definition precedes
the mnemonic expansion, return-address definition and link-register name; the order reads as
one mechanism. Screenshot inspection found no text clipping or page overflow. The previous
figure/exercise checks remain applicable because this correction changes only the paragraph
and its vocabulary declaration. Final learner verdict remains approved.

Evidence: /tmp/bl-learner-final-copy.mjs, /tmp/bl-learner-final-copy.log and
/tmp/bl-final-copy-*.png. This was a focused final-copy recheck, not a rerun of the full suite.
