# Redundant-prompt audit

Copyright © 2026 Christopher Snow

The drafting pass read all 34 lessons in course order, including each activity's task,
inputs, outcomes, hints and answer disclosures. It checked the section wiring to distinguish
prose-only template blocks from mounted prediction, construction and failure activities.
This is an editorial decision record, not an independent review or browser-verification verdict.

The authoring recommendation is GPT-6.1, Medium, for this drafting pass. The parent selected
a separate drafting agent; model controls were inherited from that session. The checked-fact
brief is [brief.md](brief.md). Both sentence and whole-explanation passes from
[the style guide](../../style.md) apply. No new program, result or exercise is introduced.

## Decisions across all lessons

“Remove closing repeat” means remove the question and its duplicate Answer disclosure,
while retaining the existing summary bullets and their heading. The managing session reports that independent learner and technical reviewers accepted
the later-course removals after checking their immediately preceding explanations.
Fresh-input questions and new transfer/evidence tasks remain.

| # | Lesson | Draft decision and activity evidence |
| --- | --- | --- |
| 1 | One addition | Remove prose-only construction/failure blocks and their headings. Operand explanation identifies the destination; the run shows the write; the fresh-input grader checks the result and the untouched input. Keep first-use teaching and the graded trace. |
| 2 | Adding a constant | Keep. Two complete separate operations introduce constant input and reuse; the challenge changes both constant and destination. No extra follow-up question. |
| 3 | A tiny function | Keep. Construction introduces a second argument through a separate complete call. Fresh-argument grading checks both result and preserved input. |
| 4 | Returning to the caller | Keep. First-use call/return explanation, executable caller path and fresh-argument trace establish where execution resumes. References are useful lookups. |
| 5 | Subtraction and reuse | Remove requested construction/failure questions and headings. Separate addition and subtraction runs show read-before-write; operand explanation and fresh-input challenge already check destination, input order and the old value. Swapping inputs has no separate activity or feedback. |
| 6 | Instructions in sequence | Remove prose-only post-run construction question and declarative failure filler, with both headings. Explanation teaches state carried forward; fresh-input grader checks both instructions and the untouched register. Also remove the prose-only pre-run prediction and heading: motivation already names `w2` and says the subtraction uses that result. The actual figure and graded trace remain. |
| 7 | Putting it together | Keep. Operand-order repair, return-deletion discovery prediction and new service-distance trace are distinct supported activities; error questions are specific feedback. |
| 8 | One pattern, three readings | Keep. Bit construction and fresh-pattern grading have outcomes; closing `0x80000001` is fresh practice with a worked answer. Compiler comparison has a committed prediction and explanation. |
| 9 | Constants and widths | Keep. Constant assembly, `movk` construction and w/x experiment have outcomes; closing write into `w5` applies the rule to a fresh value with an answer. |
| 10 | Adding and the flags | Keep. Flags prediction, three-addition exercise and unchanged-flags experiment differ. Closing `0xc0000000` pair supplies a new signed/unsigned carry case with an answer. |
| 11 | Subtracting and the tick counter | Keep. Counter-wrap construction, minimum-value negation experiment and single-wrap-step challenge differ; closing readings give a fresh elapsed-time/borrow calculation with an answer. |
| 12 | Masks and fields | Keep. Field-plan prediction supports the writing task; missing-clear experiment exposes a real failure. Closing `0x47` exercises extraction and bit flipping on a fresh pattern with an answer. |
| 13 | Shifts | Keep. Shift/division comparison, compiled correction prediction and instruction selection are supported. Closing −9 applies the rounding difference to a fresh input with an answer. |
| 14 | Compare and choose | Keep. Signed/unsigned comparison prediction, `less_fuel` writing, wrong-condition experiment and flags challenge differ. Closing 2 versus −2 transfers flags into two `csel` conditions with an answer. |
| 15 | Branches | Keep. Boundary-change experiment, three-way writing and path counts have outcomes. Closing `service(0x29)` applies the bit-test path to a new word with an answer. |
| 16 | Counting up | Remove closing repeat. Its answer restates the explanation's proof that the admitted tick starts below `end`, increments by one and cannot skip it. Keep fresh-input brightness/instruction-count challenge and changed-branch prediction. |
| 17 | Counting down | Remove closing repeat. Zero-count protection is already required in `dim_until_dark`, explained in its hint and final feedback. Keep `do`-loop prediction, wrong-comparison evidence and early-stop construction. |
| 18 | Memory and addresses | Remove closing repeat. Explanation explicitly contrasts the 64-bit address with the one-byte `strb` transfer. Keep load prediction, neighbour-overwrite experiment and new memory-copy challenge. |
| 19 | Loading widths | Remove closing repeat. Motivation separates w-write upper clearing from sign extension; investigation explicitly introduces full-width `ldrsb x0`. Keep load comparison, wrong-load prediction and multi-field record exercise. |
| 20 | Array addresses | Remove closing repeat. Explanation already states that an `unsigned *` advances by a four-byte element rather than one byte. Keep addressing-mode comparison, missing-scale prediction and empty/wrapping sum exercise. |
| 21 | Zero-terminated strings | Remove closing repeat. Motivation, construction and bounded-length task already require capacity even without a terminator. Keep off-by-one experiment and new marker-counting task. |
| 22 | Products and widths | Remove closing repeat. Explanation explicitly says converting a completed narrow multiplication is too late. Keep widening/high-half comparisons, narrow-product failure and full-product construction. |
| 23 | Division and remainders | Remove closing repeat. Challenge introduction already says an intermediate product can overflow even when the quotient fits; the exercise and hint enforce widening before division. Keep signed-remainder failure and defined-C qualifications. |
| 24 | Calls and returns | Remove closing repeat. Investigation explicitly requires all 64 saved bits even when the function uses w views; final challenge hint explains lost upper bits. Keep missing-link-save experiment and helper-clobbered reserve challenge. |
| 25 | Recursive calls | Remove closing repeat. Generalisation already says `lit_count` needs no original brightness after halving but must preserve its return address. Keep no-progress prediction, frame inspection and distinct recursive count task. |
| 26 | From C to instructions | Remove closing repeat. Explanation already states that different sequences implement the same defined C calculation; generalisation supplies comparison criteria. Keep editable compilation, changed-return prediction and C cap construction. |
| 27 | Compile a loop | Remove closing repeat. Generalisation and final task explicitly distinguish 32 valid one-place shifts from one invalid shift by 32. Keep loop-boundary prediction and C while-loop exercise. |
| 28 | C and overflow | Remove closing repeat. Motivation proves the ordinary compilation's true result; investigation and failure answer explain why `-fwrapv` preserves the boundary distinction. Keep limit-test and safe-increment exercises. |
| 29 | Checked arithmetic | Remove broad closing synthesis question and its first answer paragraph, which repeat conversions and source rules already taught. Retain unique formatting, warnings and sanitizer detail under “Formatting and run-time checks”. Keep conversion/overflow predictions and result-plus-report challenge. |
| 30 | From function to executable | Keep. Native build/boot instructions, browser arithmetic prediction and repair have real outcomes. Closing rebuild question applies the file dependency chain to a concrete edit and gives a usable answer. |
| 31 | Debug native instructions | Keep. GDB stops, divergent-run prediction and revised native contract are distinct tasks. Closing physical-board question transfers the boot path to changed entry/device conditions with an answer. |
| 32 | Raspberry Pi 5 | Keep. Source-file comparison identifies the board-specific wrapper before hardware work. It is a concrete reference/evidence task, not a repeated numerical prediction. |
| 33 | Boot and test the Pi | Keep. Working, broken and restored physical captures require actual evidence. Closing observation questions distinguish observed execution from a rejected arithmetic result; unobserved stages remain unverified. |
| 34 | The same C on A32 | Keep. Recorded-listing lookup and A64 execution separate target syntax, helper names and computed result. Final guidance adds no unsupported mental comparison. |

## Synchronisation and boundaries

Fundamentals selected layouts omit the removed blocks, so their headings do not render.
Matching unused prose and title keys are removed. Other summary sections remain nonempty.
The 13 duplicate Answer disclosures have no remaining section references; the
unique checked-arithmetic disclosure remains mounted. Canonical records mirror the edits
in Fundamentals and Modules 5–11 in both directions.

Programs, figure configurations, challenge tests, prediction gates and saved-work identifiers
are unchanged. Tests, runtime/platform changes, independent-review records and built-page
verification belong to the managing session. This drafting pass has not performed browser
checks and does not claim full-suite results. The unrelated Pi sources brief is untouched.
