# Move-width clarification: draft and checks

## Draft and edit

The separate drafting pass used GPT-6.1 Sol at Medium effort. It read the existing context through GitHub and received the checked brief as text because its older execution context was unavailable. It proposed:

- `mov` to `w0` replaces all 32 bits, including both 16-bit halves.
- A second `mov` to `w0` replaces both 16-bit halves; `movk` replaces one half and keeps the other.

The accuracy edit split the hint at the semicolon into two sentences. Both canonical records were updated with the final wording. The existing construction paragraph already specifies the 32-bit width and needed no change.

## Independent learner review

GPT-6.1 Sol at High effort read the actual diff and built pages before the author's brief. No findings remained.

The reviewer inspected the production build at 1280 by 800 and 375 by 812 in both light and dark. It verified the actual theme through the document attribute, computed backgrounds and screenshots. The changed reminder and second hint were readable and caused no horizontal overflow.

It inspected the figure initially, after mov, after movk and after Reset in all four contexts. Both halves were marked new after mov; the selected half was new and the other kept after movk. Reset restored the initial view. Exactly two hint presses revealed Concept and Common mistake, with hint 3 still unopened and the solution figure gated.

The prerequisite page explicitly teaches the 32 bits and their two 16-bit halves. No new prerequisite gap was found. The following width lesson retains the separate explanation of w and x names.

## Independent technical review

GPT-6.1 Sol at Extra High effort assessed the diff before reading the author's brief. No findings remained.

It checked the model and independently retrieved Arm DDI0602 2025-12 MOVZ, MOVN, MOVK and shared aarch64.functions.registers documentation. MOVK replaces a selected 16-bit field within the operand width; the X setter zero-extends the written value to 64 bits. The revised sentences describe w0's selected 32 bits without implying preservation of x0's upper 32 bits.

Additional seeded model executions confirmed replacement by mov, preservation of the other 16-bit half by both movk forms, clearing of x0's upper bits and no write to a separately seeded x1. The reviewer's first model harness used the wrong Call.args shape and exited 1; its corrected harness succeeded. This was a reviewer-script failure, not a failed course test.

The reviewer independently checked the built page, normal hint controls and worked example at both widths and in both themes. It followed the prerequisite link and inspected the next width lesson at desktop size in the light theme. It found no page errors, overflow, hint-order or gate problem. Its four focused test files passed all 173 tests. Local GNU/QEMU tools were unavailable to the reviewer; their full CI job remains separate evidence.

## Managing-session verification

- Existing arithmetic, constants facts, constants prose and pacing prose checks: four files, 173 tests passed, exit 0.
- Production build: passed, exit 0.
- Existing worked-halves, locked-solution and restored-work browser cases: six passed across desktop and phone, exit 0.
- Formatting of the changed source files and git diff whitespace check: passed.

No new tests were added solely to repeat the revised wording. Full-suite CI, merge and deployment results are recorded in the pull request containing this change. These browser and model checks do not claim a novice learning study or a new hardware measurement.
