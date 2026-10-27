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

## Follow-up: make the call visible

The user could not see where x30 acquired the return address, and asked whether the rule
was C-specific or an example choice. Show the existing model's BL as a fourth visible
instruction, starting at trace step 1 rather than 2; retain the whole native-tested wrapper.
Arm Instruction Set Reference Guide 100076_0100_00_en D2.35 (BL) specifies that BL writes
PC+4 into X30 and branches to its label; D2.130 (RET) specifies default X30. These are
AArch64 instruction semantics regardless of source language. The W0 integer result location
is the calling convention. Before BL the existing X30 value is not the return address for
this call: label that state without presenting the harness's sentinel as a meaningful address.
After BL derive the caller-addition target from the actual trace. Show both caller instructions
in order, with the same next/ran markings used for the function. Keep the shared W0/W1 bank,
X30 target and operation cue beside the controls. Reset must return to before BL; saved old
positions must not silently acquire a different meaning. Preserve original exercise semantics.

Draft from these checked facts: connect the opening to the previous lesson's W0 result;
define BL and the link register beside the figure; distinguish AArch64 instruction behaviour
from the convention; update scope, captions and step messages for four visible instructions.
Do not introduce stack mechanics here. Declare BL and link register as taught here and keep
the later calls lesson's stack/preservation development. Add the BL primary-reference link.
