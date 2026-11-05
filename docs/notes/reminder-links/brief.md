# Explanation and prerequisite reminders

Copyright © 2026 Christopher Snow

## Learning objective and evidence

The learner should connect the identical bits returned by the two C functions to their different typed values. The existing comparison displays the answers but does not work through that connection. Earlier signed/unsigned readings teaches bit weights and the 32-bit bridge; four-bit arithmetic teaches the subtraction method. This is a transfer gap, not a need to repeat the subtraction walkthrough.

The recorded GCC 16.1.0 functions and model return the same 32-bit pattern for the page's calls. The lower 31 positions contribute positively in both readings; position 31 contributes negatively in the signed reading and positively in the unsigned reading. Use computed contributions beside the returned values. Keep that explanation hidden until the calls execute, reset it with those results, and recompute restored results from the model. No C type label is stored in the register. Both parameter and result types differ in this example; the result type alone does not generally determine the expression's arithmetic. Unsigned arithmetic wraps as C23 N3096 §6.2.5p11 defines. Signed arithmetic outside range remains subject to §6.5p5; this example's negative signed result is in range.

## Course-wide audit

Inspect every published lesson, not just source authoring groups. For each, record existing adequate links, useful added reminders, or a reason no change helps. Add a short local statement of the relevant rule and an earlier lesson link where the reader must retrieve prior knowledge. Do not add a link panel to every page or use a link to replace essential missing guidance. Check targets against the published route order and the concept actually taught there. Appendix references may point outside the linear route when clearly supplementary.

Review the full prerequisite-to-application path. Potential misconceptions are hypotheses: a C type lives in a register, a change of reading executes an operation, or a reminder link is required to access essential instructions. Browser checks cover representative changed pages and the worked result in light/dark at phone/desktop widths. Source-level coverage must enumerate every published lesson. Agent review is not a novice learning study.

## Sources and process

Read the repository learning-design skill, CLAUDE.md, docs/authoring.md, docs/style.md and visual-language rules. Compiler records and independent C checks are in docs/notes/module-1/c-types-subtraction. Separate drafting agents own the copy and implementation; independent review checks the final built result. Preserve the unrelated untracked Pi sources brief.
