# Separate forward wrap and optional subtraction

Copyright © 2026 Christopher Snow

Independent drafting agent bidirectional_counter_copy supplied the main intro/instruction, optional subtraction introduction, and direction-specific architecture notes from brief.md and docs/style.md. Managing session edits retained “program later” (the miniature precedes several activities), the existing unsigned definition, and the explicit four-bit optional limit. Canonical strings are in packages/views/src/strings.counter-wrap.ts and RISC-V content/guides/counter-wrap.json. No arithmetic or challenge answer changed.

Required path: count forward from a fresh zero; carry at the wrap; then the independent subtraction/elapsed worked example. Optional path: open the subtraction pane and decrement its own zero to see borrow. The ALU and decrement terms are introduced only there. Architecture notes stay local to the operation, so the required pane contains no borrow label or no-borrow flag explanation.

The learner can skip this optional pane and attempt every required elapsed-time exercise. Starting values, saved values and Reset are distinguished. The main pane keeps existing valid saved histories, including the last stored value from old decrement actions, without treating that old borrow as carry. The last operation marker is unknown until the next forward action in that case. The optional pane has independent storage and starts at zero. Both loop indefinitely.

Functional checks and reviews are recorded separately. There is no human novice study; browser checks cannot establish learning effectiveness.
