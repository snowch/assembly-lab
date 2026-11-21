# C first in the optional Arm subtraction counter

Copyright © 2026 Christopher Snow

## Outcome and learner context

User requested Arm Lab only: developers should inspect C directly, rather than mentally invert a Borrow needed indicator. They approved the specific result sentence and the two C-rule bullets below it. Preserve that selected copy. The required forward counter stays forward-only; the subtraction pane stays optional, independently stored, zero-starting and cyclic. No RISC-V changes.

Outcome: after a decrement, identify whether C is zero or one and explain its no-borrow meaning. Learner can read ordinary C and small binary values, and has met addition flags and subtraction. Necessary width qualification stays visible. Borrow is not a hidden physical source; it denotes unsigned subtraction below zero. The user observed this misconception directly after reading our old “borrow one group from the next position” feedback.

## Checked facts

Current fourBitSubtraction runs plain sub at machine width32, keeps four result bits and computes the low-column addition carry. For the supported decrement by one, carryOut=0 exactly at input0 and1 for inputs1..15. counterChange currently exposes its inverse as marker for subtraction. Use the existing arithmetic carry directly for the displayed four-bit model C; do not change persisted histories or invent actual CPU flag writes. Main add marker is unchanged. Arm subs updates C as no-borrow, while plain sub preserves CPU flags. Native32 cases passed prior GNU/QEMU verification; all16 decrement cases will be rechecked for this display mapping.

## Selected copy and route

User approved: “Subtracting one from zero goes below the unsigned range. Keeping only four result bits gives 1111 (15 unsigned).” Follow with “This four-bit model follows the Arm subs rule:” and bullets: C=0, Borrow needed, unsigned subtraction went below zero; C=1, No borrow needed, unsigned subtraction stayed at or above zero. Render width/pattern/reading from the model and format instruction/bit strings as code. Keep actual flag quantity labelled “C after subs”. Ordinary decrements must get their own accurate dynamic sentence, not the zero-boundary sentence. Fresh/Reset dash explicitly means no subtraction shown.

Keep explanation and bullets together. Put the optional controls directly below its results/trace, then the explanation and bullets. This keeps the numeric result visible while pressing −1 and avoids a large reserved feedback gap. Main forward layout is unchanged. Remove the physical loan sentence. State32/64-bit real width and plain sub preserved flags locally. The existing unrelated elapsed worked example and prediction/answer gates remain unchanged. The existing elapsed exercise is still the independent application; this patch is an optional explanation/display correction.

## Evidence plan

Extend existing exhaustive operation checks to cover carryOut/no-borrowC for all16 inputs. Component/browser: dash, 0−1C0/1111,15−1C1/1110, fullcycle, preserved saved history and separateReset, screen-reader status C consistent withvisible value; selected bullets below correct current-state sentence. Actual phone320/375 and desktop light/dark, controls stable, result/decimal above controls, keyboard, no horizontal page overflow. Independent learner and technical reviews required. Full final-head CI and published revision check before completion. Passing tests and agent reviews do not establish learner understanding; no human novice study is available.
