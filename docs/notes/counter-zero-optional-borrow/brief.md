# Zero-start counter and optional borrow

Copyright © 2026 Christopher Snow

## Outcome and prerequisites

Required outcome: explain why an incrementing unsigned fixed-width counter returns to zero, then use modular subtraction to measure elapsed ticks. Borrow arithmetic is deferred to an optional independent experiment; it is not needed to implement elapsed with sub. The learner knows small binary place values and preceding addition/subtraction lessons. The elapsed lesson supplies the register-width bridge and its own independent worked readings.

## Checked facts and scope

The existing machine-backed fourBitAddition/fourBitSubtraction and RISC-V exact model retain values modulo 16. Incrementing 15 stores 0 with carry 1. Decrementing 0 stores 15 with external borrow 1. All 32 operation pairs passed the previous change’s GNU/QEMU/xv6 checks. This change reuses these models, without changing arithmetic. Arm instructions operate at 32 bits in this lesson; RISC-V at 64. Arm subs C is no-borrow; add/sub preserve flags. RISC-V has no carry flag. The elapsed-time counter advances; a register can be decremented by subtraction, but doing so is not reversing time or undoing execution.

## Route and hypotheses

Fresh and Reset forward counter start at 0, +1 cycles without limit. Show carry, stored bits and unsigned decimal beneath the bits, recent readings, then controls. Main instructions count to zero again. Keep optional borrowing in a separate collapsed pane with its own state, -1 and Reset. Starting at 0 makes the first decrement exhibit the boundary. No next lesson or gate requires opening it. Controls remain below the results. Existing valid histories and unrelated source/prediction state are preserved. Fixed elapsed and subtraction examples retain their supplied inputs. Restoration of an old downward operation must not relabel its marker as addition carry.

Hypotheses: teaching carry and borrow together overloads the route (user observed confusion); calling -1 a previous tick can suggest undo/time travel. Test route without opening optional details. Existing elapsed prediction and write-elapsed fresh cases remain the independent application. Browser and agent review do not establish learner understanding; no novice study is available.

## Evidence plan

Model/component checks: zero defaults/Reset, old-state restoration, direction filtering, independent pane state, all arithmetic boundaries and full cycles. Browser: original forward route, optional backward wrap, controls below results, no drift/overflow at 320px and phone/desktop light/dark, keyboard focus, reload and Reset preserve unrelated work. Review actual lesson with optional pane closed, then open. Record focused/full checks separately.
