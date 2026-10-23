# Independent learner review: A tiny function

Copyright © 2026 Christopher Snow

Reviewed only `tiny-function`, assuming the front page's C prerequisites and the preceding
“One addition” lesson. The reviewer did not author its copy, component or exercises and read
the rendered lesson before the implementation brief. Review used the inherited model and effort.

## Browser evidence

Preview: `http://127.0.0.1:4322/assembly-lab/#/lesson/tiny-function`, 23 October 2026.
Chromium, separate clean contexts at 375 × 900 and 1280 × 900, each in light and dark.
The actual `html[data-theme]` matched the requested theme in all four contexts.

In each context checked initial argument/caller state, first instruction, reload with that
step restored, return instruction, and local Start again. The caller remains waiting after
arithmetic and resumes only after return; the register retains its prepared result. Reset
returns to the incoming argument. Both instructions have the checked C line association and
the complete four-line C remains alongside the instructions.

On the phone, Show instructions scrolls the contained listing (271 pixels in these checks),
keeps focus on the same toggle and exposes both instructions and their source tags. Show C
is the visible reverse action. Desktop already fits both panes. No page-level horizontal
overflow in any context.

The fresh practice field rejects a wrong value without revealing the answer. A separate
phone check submitted the reference result, restored it on reload and checked the explicit
Clear work / Discard work flow and hint ladder. Practice results are intentionally omitted
from this review.

Screenshots and scripts: `/tmp/reader-tiny-function/`. Directly viewed phone light initial,
phone dark instruction pane, desktop light after arithmetic, desktop dark after return and
phone light wrong-answer screenshots. Additional four-context state screenshots were
captured; they were not each individually viewed.

The first script stopped because its assertion looked up “Show instructions” after that
button had correctly become “Show C”. Corrected script completed all four contexts. This
was a reviewer locator error, not an application failure. A first practice reset attempt also
used an exact button name that omitted its challenge-specific accessible suffix; a corrected
locator exercised the confirmation successfully. All five hints were directly viewed.

## Learner assessment

The first mechanism is defined before use: caller, argument and listing are explained in
“A function and its listing”; the new literal operand is explained in “Preparing the result”.
The complete two-instruction example demonstrates the distinction between a prepared result
and a returned call. The new-argument practice asks the learner to apply those same mechanics,
without introducing another instruction, another register or another arithmetic operation.

A smaller candidate would be the addition alone, which the previous lesson already provides.
It could not demonstrate the missing distinction between producing a value and returning.
This function is an appropriate small complete bridge before the trip calculation.

Required knowledge assumed but not taught: none identified beyond the stated C prerequisites.
GCC is identified as a compiler that translates the shown C; the optimisation setting appears
in the model note with a local explanation. The label ending in a colon is explained locally.
The model note explicitly says the simulator supplies the call and omits its instructions.

## Findings for sceptic review

- **Low, sequencing of directions.** “After the addition, the result is ready, but the function
  has not returned. Before running `ret`, compare the caller's waiting state with `w0`.” This
  Failure experiment appears below a figure whose Investigation already instructs the learner
  to run both instructions. A learner who follows that order reaches the direction after the
  moment it describes. Consider a retrospective question or an explicit revisit/reset direction.
  The figure's own live status already supplies the necessary before-return guidance, so this
  does not block the activity.
- **Low, repeated completion.** The returned figure says both “ret returned to the caller. It
  left w0 unchanged.” and “The function has returned to its caller.” The second statement adds
  little. It is a small possible reduction in an otherwise focused figure, not a correctness
  defect.

No blocking missing mechanism, hidden activity or answer leak was identified. These are reader
findings, not self-certified implementation acceptance; technical/sceptic review should decide
whether the small editorial reductions are justified.
