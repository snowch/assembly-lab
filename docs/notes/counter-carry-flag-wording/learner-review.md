# Independent learner and browser review

Copyright © 2026 Christopher Snow

This Arm-only review judged the built lesson from its visible copy and stated prerequisites: simple C, small binary place values, and the earlier addition-flag and subtraction material. The reviewer did not write the implementation or use the author's rationale as evidence. No implementation files were edited and no RISC-V or whole-suite verification was performed.

## Browser evidence

Reviewed widths 320, 375 and 1440 pixels in actual light and dark themes: six contexts. Rendered body backgrounds were `rgb(247, 250, 248)` in light and `rgb(16, 27, 26)` in dark; foreground colours were checked too. Raw results, screenshots and the review harness are outside the repository at `/workspace/work/counter-carry-flag-wording-review/learner/`.

In every context:

- Both labels rendered as **Carry flag C after adds/subs**, with instruction names formatted as code. Long labels wrapped inside their fields without overflow. The C value and stored bits began at the same vertical position.
- The main counter started at zero with a dash. Ordinary addition showed C zero, the four-bit wrap showed C one, and the next addition showed C zero again. Reset restored zero and the dash.
- The optional counter started independently at zero with a dash. The first decrement showed `1111`, fifteen unsigned and C zero; the next showed `1110`, fourteen unsigned and C one. A complete downward turn reached zero with C one, and the next decrement wrapped again with C zero.
- Visible feedback and accessible status named the carry flag C and the operation that produced it. Reset and initial statuses did not attribute a flag to an operation that had not occurred.
- Results remained above controls. Buttons were 44px tall; each button's document position moved zero pixels across the inspected initial, ordinary, boundary and full-turn states. No horizontal page overflow or page error occurred.
- Enter operated +1 and the optional disclosure; Enter and Space operated −1. Focus remained on the activated control.
- Reload restored both independently saved histories and their displayed C values. Resetting the optional pane left the main counter unchanged.

Additional 375px light/dark checks confirmed that counter actions and Reset preserved editable source and a committed prediction. Reload restored that source, prediction and both counter histories. Results are recorded in `preservation.json`; no learner solution or selected answer is reproduced here.

## Wording and learning route

The labels now identify the displayed quantity as the carry flag C. The ordinary and boundary feedback explicitly says the model updates C to zero or one, avoiding an implication that writing a flag always makes it one. The local notes distinguish these updates from plain `add` and `sub`, which preserve C.

The four-bit qualification appears before the fields: each introduction describes how its instruction **would** update C **at that width**. The visible architecture notes identify real Arm arithmetic widths as 32 or 64 bits. This makes the four-bit wrap a teaching-width result rather than a claim about actual 32-bit `adds` of fifteen and one.

The optional decrement remains optional and independent. Its introduction defines decrement and distinguishes subtracting from undoing or reversing time. The user-selected boundary sentence and the two C-zero/C-one bullets remain intact. They connect borrow to an unsigned subtraction going below zero without claiming a physical hidden loan. The retained `1111` reading is explicitly fifteen unsigned, so the mathematical difference and its retained unsigned reading are distinguished.

## Findings and limits

No open learner or browser finding remains in the checked build. The longer labels fit at 320px, the quantities align, and neither the controls nor the reading route changed during the checked operations.

This review verifies visible content, keyboard behaviour, geometry, accessible status consistency and saved-work preservation. It adds no new arithmetic or native-instruction comparison; those checks belong to the parent's separate verification. It is not a novice learning study or a screen-reader user study, and passing checks does not establish understanding.
