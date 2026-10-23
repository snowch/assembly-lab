# Learner review: One addition

Copyright © 2026 Christopher Snow

Independent reader: `reader_addition`, 23 October 2026. Reviewed the built `one-addition`
page before consulting implementation rationale. Prerequisites were the front page's little C,
basic arithmetic and binary conversion; no later lesson was treated as prior knowledge.

## Verdict and findings

No blocking learner finding confirmed. The page defines a register, instruction and operands
before asking the learner to identify the destination. “The first operand names the register
written” supplies the rule needed to run the isolated example. The first run then distinguishes
labelled starting values from its read/write result. The fresh exercise changes the destination
and inputs, so it checks use of the rule without repeating the worked answer.

The smallest complete candidate for this objective is one addition with visible starting
registers. That is what the figure presents. A whole C function would add call/return machinery
before it helps this objective. The bridge to practice is explicit: “The first operand can name
a different destination.” The challenge names its before/after moment and asks about both the
written destination and an input preserved by the instruction.

Non-blocking editorial observation: the operand rule recurs under “Reading add”, “Identify the
destination” and “Inputs and result”. Each passage is short and the latter two connect it to
reading/preservation, but future compression could reduce this repetition if the fixed section
schema changes. No change requested under the present ten-section requirement.

Assumed but untaught knowledge: none required to complete this activity. The width sentence
selects 32 bits and points ahead for the rest of a register; the front page already requires
binary/decimal conversion. The marker is visible, but no question or control requires its
meaning on this page. The simulator is defined beside the Run control. The exercise does not
require a compiler, function-calling conventions or hidden instructions.

## Browser evidence

Actual Chromium at 375 × 900 and 1280 × 900, each in light and dark. Verified the rendered
`html[data-theme]` for each case and measured no page-level horizontal overflow. In all four
contexts, ran the example, reloaded to confirm its stepped state was restored, and used Start
again to restore the initial state. Directly viewed full-page initial screenshots for all four
contexts plus phone light/dark stepped figure screenshots. Inputs, instruction and result remain
readable; the result diagram uses a visible vertical arrow and distinct read/write labels.

Artifacts: `/tmp/addition-{375,1280}-{light,dark}-initial.png`, matching `-ran.png` figure captures
and `.txt` rendered page records. Browser driver: `/tmp/review-addition.mjs`.

Separately exercised the phone challenge with incorrect and reference submissions, reload and
Clear work using `/tmp/addition-challenge.mjs`. The first Clear work attempt used an exact button name and timed out because the saved
challenge adds context to its accessible name. The corrected prefix selector and explicit
Discard work confirmation completed the reset. This was a driver error, not a page failure.
Answer values are deliberately not copied into this review. The normal next-lesson link names A tiny function and is visible at the foot.

No source-only claim is presented as a browser check. This was a learner review of one page,
not an independent Arm semantics or whole-course audit. Later lesson content was not reviewed.
