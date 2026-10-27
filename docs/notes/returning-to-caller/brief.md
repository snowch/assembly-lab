# Returning to the caller: drafting brief

Copyright © 2026 Christopher Snow

## Learning objective and prerequisites

After the visible caller resumes, the learner can distinguish where execution goes from where
an integer result is held. They can trace the caller reading that result from the shared register.
This lesson follows One addition, Adding a constant and A tiny function. The learner has met
registers, their x/w views, operands, constants, a caller, arguments, compiler listings and the
basic purpose of ret. They have not studied nested calls, saving registers or the stack.

## Checked model facts supplied to the separate drafter

The facts pass supplied `RETURNING_PROGRAM`, a course-written caller around the recorded
increment_int body, and the view bounds `RETURNING_START_STEP = 2` and
`RETURNING_END_STEP = 5`. Setup has already entered increment_int when the activity begins.
The visible instructions are increment_int's addition and ret, followed by the caller's
`add w1, w0, w0`. All states are from one simulator trace. The caller addition is course-written
assembly; only increment_int is paired with its original recorded C.

At the visible start w0 is 7 and w1 is 0. The addition leaves w0 holding 8; ret preserves the
register values and selects the caller continuation; the caller addition writes 16 to w1 and
keeps 8 in w0. For the fresh exercise input 4, the corresponding states hold 5 and 10. The facts
pass records the simulator tests, GNU/QEMU comparison and source references separately in
facts.md. Technical source wording and links are checked there before review.

## Drafting constraints

Follow docs/style.md, docs/authoring.md and docs/visual-language.md. Use four short sections:
motivation, investigation, explanation and challenge. Essential guidance is visible; Arm's
instruction and calling-convention references are optional supporting detail. Introduce an instruction’s address as its place in memory, then introduce the
return address beside the visible x30 target. The lesson’s declared vocabulary includes address,
return address and calling convention. Do not introduce stack or nested-call mechanics.
The figure carries the execution path and shared register values, so prose need not repeat its
worked numeric answers. A fresh exercise checks the state after ret and after the caller's next
addition without exposing either answer in the initial view.

A tiny function retains the one- and two-argument figures. Its copy and exercise focus on argument
locations and the result register. Returning and the caller's continuation are developed here.

## Accepted review corrections

The narrow-screen listing needs its own local sideways-scroll cue. The x30 target label names
the caller’s addition, which remains the target address after that instruction has run. It must
not call that fixed target the next instruction in every state. The declared vocabulary now
includes address, matching its existing local definition.
