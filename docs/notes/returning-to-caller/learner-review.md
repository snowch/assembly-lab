# Returning to the caller: independent learner review

Copyright © 2026 Christopher Snow

## Scope and review baseline

This review is by a separate agent that did not draft the prose, implement the figure or
prepare its model program. It covers the changed **A tiny function** lesson and the new
**Returning to the caller** lesson. Source preparation is not a browser approval; final
built-page observations are recorded below when they have been made.

The assumed learner knows the course's “Before you start” panel: small C functions with
integer arguments and return, basic arithmetic and binary-to-decimal conversion. No assembly,
pointers, standard-library or compiler experience is assumed.

Earlier Fundamentals content defines registers and instructions, the ordered inputs and
destination of add, the relationship of x/w names, and a constant inside an addition. It
also practises writing an input register after reading its old value. A tiny function then
introduces the caller, arguments, GCC as a compiler, a listing and one- and two-argument
functions. Returning to the caller must explain the return address locally; neither the
program counter nor stack mechanics can be assumed from later lessons.

The review checks three distinct stages: a mechanism being defined, demonstrated and
practised. It also checks that each required lesson is discoverable from the plan before
running an activity. The smallest useful return example needs a visible instruction in the
caller that can run after ret; a waiting label alone cannot demonstrate the caller using the
shared result. Nested calls and register-saving machinery are not needed for that first task.

## Findings and final built-page checks

Pending final implementation and preview. No approval is claimed yet.

## Initial built observations (before corrections)

The first built pass used the preview at port 4399. At 375 and 1280 pixels, in actual light
and dark themes, the model-driven state sequence, Back, Start again and reload restoration
worked. These successes did not close layout review.

- **L1, high, accepted:** the phone figure's contents ran beyond the right edge. The x30
  target, caller explanation, status and last control were clipped. Both phone themes had
  document overflow; desktop did not. `/tmp/ret-learner-review.log` retains the first result.
  The managing implementation constrained the nested sections with `min-width: 0`. The
  corrected four-context run, `/tmp/ret-learner-review-corrected.log`, found no document
  overflow and visually readable wrapping in all affected rows.
- **L2, medium, proposed:** “Watch the marker ▸ return to the caller” depends on the instruction
  pane, but the phone's initial position shows only C. The preceding tiny-function lesson
  teaches sideways scrolling, so this is a local action cue rather than an untaught gesture.
  A short direction beside this new figure would make the core action discoverable.
- **L3, medium, proposed:** the shared register display was offscreen during ordinary phone
  stepping. At 375 × 812 with touch, after moving the paired listing sideways and tapping
  Run, its bounds were approximately −326 to −213 vertically while the controls were at
  383 to 479. The learner could read status but could not watch the register display while
  returning. `/tmp/ret-learner-phone.log` and `/tmp/ret-learner-phone812.png` retain the
  observation. Keep the single shared register display near the stepping controls.

The initial 900-pixel-high screenshot pass had scrolled the entire figure into view and did
not expose L3. It is not treated as evidence that all phone control placements were usable.

The corrected-page source/browser pass found no unexplained term blocker. The return address
is defined beside x30; the calling convention is defined where the result-register agreement
is discussed. “Registers” in the return explanation was narrowed to the displayed w0 and w1
following the independent technical review, avoiding an overbroad claim about all state.

## Final candidate verification

The final candidate was the production build recorded as 27.04 seconds in
`/tmp/ret-build-final.log`, served at `http://localhost:4399/assembly-lab/`.

**L2 is accepted and closed.** The investigation now explicitly tells the phone reader to
scroll sideways within the function listing. The paired source remains intact, and the actual
next instruction is also repeated near the controls. This makes the required operation visible
without requiring the whole listing to fit beside the controls.

**L3 is accepted and closed.** There is still one shared register display. It now sits after
the caller panel, directly above the return target, current instruction, status and controls.
At 375 × 812 with touch, in both actual light and dark themes, the bank was within the viewport
while tapping through add and ret: its top was approximately 1 pixel and its bottom approximately
115 pixels after the first tap, with controls at approximately 402–498 pixels. After ret the
bank remained visible. The source listing can be above the viewport, but the current instruction
and the register state needed for the next action remain beside the controls. Logs:
`/tmp/ret-learner-phone-final.log` and `/tmp/ret-learner-phone-dark-final.log`.

The final independent four-context pass at 375/1280 in actual light/dark themes verified:

- the new lesson is discoverable on the home plan before running either activity;
- A tiny function has the shortened four-section sequence, retains both complete worked
  functions, and leads directly to Returning to the caller;
- the new lesson leads back to A tiny function and onward to Subtraction and reuse;
- initial, arithmetic, returned and caller-continuation states; the instruction just run and
  the next instruction are distinguishable; Back, Start again and reload restore the right state;
- both existing tiny-function examples execute, restore after reload and reset;
- the local scroll guidance, source pairing, shared register display and reference disclosure;
- no page errors or document overflow in any of the four contexts.

`/tmp/ret-learner-review-final.log` and `/tmp/ret-learner-lessons-final.log` record these checks.
Screenshots of both changed lessons in all four contexts were inspected for clipping, overlap,
text readability, marker meaning and the relation between caller and shared registers.

Both fresh exercises were independently attempted at both widths and in both themes. Incorrect
answers were rejected, independently calculated answers were accepted, saved fields restored
after reload, and the normal two-step Clear work / Discard work interaction cleared them.
`/tmp/ret-learner-exercises-rerun.log` records the final pass without printing the answers.
The preceding `/tmp/ret-learner-exercises-final.log` attempt stopped on a reviewer-harness
locator error: it requested an exact “Clear work” accessible name, while the real button correctly
includes the challenge title. The harness was corrected to match that name and to use the
existing discard confirmation. No product correction was required for that failure.

## Learning judgement and limits

A tiny function now defines and demonstrates where arguments and a result are held, then
practises those locations using a fresh two-argument call. The next lesson explicitly defines
the return address and calling convention, demonstrates execution returning to a visible caller
instruction without moving the result, and practises the two separate moments with a fresh
argument. The caller continuation uses an addition already practised in earlier lessons.

A smaller example containing only ret and a waiting caller would omit the result's subsequent
use. The chosen extra caller addition supplies that missing bridge without requiring a new
arithmetic operation, nested calls or stack-saving details. The setup omitted from the figure is
stated, and the caller instruction is identified as course-written rather than GCC output.

No additional unexplained prerequisite was found in the final pages. The relevant x/w views
and operand notation are taught earlier; new return-address and calling-convention terms are
introduced locally. The later preservation lesson is an optional extension, not required to
complete either exercise. No rejected finding is being carried forward: L1–L3 were accepted,
fixed and independently rechecked.

**Approved as a learner review of these two changed lessons and this final built candidate.**
This is an independent expert reading and browser interaction review, not a measured novice
study. It does not claim physical-device execution, a full browser-suite run, or a public-site
post-deployment check.
