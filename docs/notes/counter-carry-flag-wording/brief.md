# Name the carry flag C in both counter panes

Copyright © 2026 Christopher Snow

User approved the two labels “Carry flag C after adds” and “Carry flag C after subs” and explicit wording that flag-setting instructions update C. “Set C” can mean making it 1, so use updates rather than that ambiguous shorthand. Only Arm Lab is in scope. Preserve the previously selected subtraction boundary sentence and its C=0/C=1 bullets.

Outcome: identify the displayed quantity as the carry flag C and tell whether adds/subs updates it or plain add/sub preserves it. Learner knows small binary place values, ordinary C, the earlier addition-flag and subtraction material. No new controls, arithmetic, state format, defaults, examples, prediction gates or source code behaviour are needed. Existing optional decrement remains optional and independently stored.

Checked facts: the four-bit model’s carryOut is one at 15+1 and zero for other increment inputs. Its decrement-one C is zero at 0−1 and one for other inputs. Current counter model and fresh prior GNU/QEMU checks establish this. At actual32/64-bit instruction widths, adds updates C from carry out; subs updates C as no-borrow. Plain add/sub preserve flags. The hypothetical four-bit flag rule is not a real four-bit Arm operation: real32/64-bit adds of15+1 has C0, while the model4-bit operation wraps and shows C1. Keep this width qualification explicit before or beside use. No mathematical behaviour changes.

Draft supporting intros, directions, feedback, architecture notes and accessible status from these facts; keep the user-approved labels and meaning. Both pane intros should name the flag-setting instruction and carry flag C. Explain that C can be updated to either0 or1; preserve plain-instruction qualification. Keep prose concise and preserve source/learner work. No new addition-rule disclosure is needed; its feedback and note can state C=1 for carry/C=0 otherwise.

The longer labels must wrap within a bounded field, with the C value and stored bits aligned and visible together at320px. Controls stay below results; optional explanation/bullets remain below controls as previously reviewed. Check actual phone/desktop light/dark, label rendering, C0/C1/wrap/Reset/reload, status provenance, no horizontal overflow or moving controls. Existing model/component and elapsed-flow tests plus required fullCI are sufficient; add no arithmetic tests for unchanged arithmetic. Independent learner and technical reviews are required. Passing tests/reviews do not prove novice understanding.
