# Independent learner review: Fundamentals through Module 4

Reviewer: `noise_early_reader`, 2026-10-28. Scope: issue 52. This reviewer did not draft the product changes or consult the author's audit rationale. Each lesson was read separately, allowing only the cover prerequisites and the lessons before it. No product files were edited.

## Prior knowledge and source review

The cover allows basic C arguments/returns, `if`/`else`, loops, array indexing, arithmetic, and binary/decimal conversion. It does not assume assembly, pointers, hexadecimal, compiler tools, or installation. The following records the assumptions checked for each lesson; no new unexplained assumption was found in the changed text unless identified below.

| Lesson | Knowledge available on entry; new terms checked locally | Local guidance preserved |
| --- | --- | --- |
| One addition | Cover only. Register, instruction, operand, destination, memory, and the relationship of `w`/`x` names are introduced here. | First use says what the browser simulator is and which button runs the instruction. Optional timing explanation is beside that first activity. |
| Adding a constant | Register inputs/destination and one-instruction execution. A literal input and immediate limits are explained here. | Each example's independent starting values remain explicit; no function machinery is assumed. |
| A tiny function | Addition and constants. Compiler/listing, caller, argument, and `-O1` are explained here. | Recorded compiler settings moved before the listing. The omitted call machinery is stated before running the function. |
| Returning to the caller | Argument/result convention and `ret` from the previous lesson. Address, branch, link register, return address, and calling convention are explained here. | Start before `bl`, prepared argument, end after caller addition, next/ran markers, horizontal scrolling, and provenance remain beside the figure. |
| Subtraction and reuse | Input/destination rule, addition, and independent examples. Subtraction order is explained here. | Read-before-write mechanics, separate examples, and meaningful practice remain. Removed reflection supplied no additional activity. |
| Instructions in sequence | Individual operations and a function's return. Program counter and next marker are explained here. | Intermediate values and execution order remain central; stopping after subtraction is beside the figure. No empty reflection/generalisation remains. |
| Putting it together | All Fundamentals mechanics. Earlier compiler and calling conventions are available. | Complete-function trace, source pairing, Back/Reset, bits display, and missing-return experiment retain their specific instructions. |
| Same bits, two readings | 32-bit register view, subtraction, and binary/decimal conversion. Signed/unsigned, hexadecimal, set/clear, and top bit are introduced here. | Next direction and independent scratch-register use remain. Removing the footer does not remove the earlier register-width explanation. |
| Constants and widths | Hexadecimal and `w`/`x` distinction. Constant-building instructions and immediate shift are taught here. | GNU assembler comparison, constrained constant rules, source-type scope, and upper/lower-register effects remain. |
| Adding and the flags | Fixed-width bit readings and addition. Flags, carry, overflow, and adder are explained here. | Arithmetic-not-circuit qualification is next to the adder; column reveal remains distinct from instruction stepping. |
| Subtracting and the tick counter | Flags and carry from the previous lesson. Tick, wrap, borrow, and four-bit demonstration are explained here. | Normal counter advance and less-than-one-turn limits remain before activities and in exercise guidance. See candidate finding below. |
| Masks | Bits, hex, and fixed-width registers. Mask/field and C bitwise operators are introduced here. | Own-code stepping instructions and fresh-input distinction remain. Bit-field aliases are discussed with the compiler comparison. |
| Shifts | Bit operations and constants. Logical/arithmetic shifts and rounding are explained here. | Direction/lost/filled-bit figure guidance, C qualifications, shifted-source semantics, and constant-shift alias scope remain. |
| Compare and choose | Signed/unsigned readings and flags. Compare and condition selection are explained here. | `cmp`/`cmn` result-discarding relationship now accompanies their definitions; source order and signed/unsigned rules remain. |
| Branches | Flags, conditions, and the earlier `bl` example. Conditional branch/taken/labels are explained here. | Path and counts explicitly do not show timing. The introduction no longer claims every earlier listing ran straight through to `ret`. |

## Finding and independent confirmation

- **Medium, resolved: Subtracting and the tick counter.** The page says “The processor subtracts by adding” and describes the figures as “the same steps for the real 32-bit `subs`”. Removal of the local circuit qualification can leave a learner treating the arithmetic derivation as a required hardware implementation. The preceding addition lesson does distinguish drawing from circuit, so this is a narrow wording issue, not a reason to restore the repeated footer. Direction: describe how the subtraction is calculated or demonstrated locally, rather than asserting one implementation. Accepted and corrected by the drafting/technical pass. The final built page now says “Subtraction can be worked out as addition” and “The figures below use this calculation to explain the result and flags of 32-bit `subs`”. Independently confirmed in the final browser build at both widths and actual themes. This preserves the arithmetic mechanism without reinstating the footer.

## Browser verification

Final built course: `http://localhost:4399/assembly-lab/`, after the managing agent confirmed production build success. All 15 lessons in the table were visited in Chromium at 375×812 with touch/mobile emulation and 1280×812 desktop, each in light and dark: **60 lesson/context visits passed**. Each visit verified the actual `html[data-theme]`, rather than merely requesting a preference.

- Every page was checked for its rendered title, lesson sections, removed footer blocks, removed generic reminder, absence of inert ordinary-step disclosures, and page-width overflow. No empty section remained; no JavaScript or console error occurred.
- First-use simulator directions remain visible. The optional “What the simulator shows” disclosure opened and explained completed effects and timing scope. The adder’s Calculation disclosure still opened and distinguished column reveal from instruction stepping.
- Initial states and lesson endings were captured for every page/context. Browser screenshots were inspected across the lesson set; source qualifications were checked against actual rendered text. The removed sections join cleanly to the next section/navigation.
- Primitive figures in the Fundamentals and shifted-add activity were stepped, reloaded to confirm restoration, then reset. Returning to the caller was run through all four instructions, reloaded at completion, and reset in each context. These checks cover changes to surrounding guidance and disclosure rendering; no instruction program was modified.
- Counter assumptions, local stop points, compiler provenance, C shift qualifications, and the branch path/timing limitation were retained. The subtraction calculation correction above is visible in this same build.

Evidence: `/tmp/issue52-early-review.mjs`, `/tmp/issue52-early-browser.log`, and `/tmp/issue52-early-review/results.json`, with investigation/end screenshots in that directory. The harness exited 0 on its first run; no browser retry masked a failure. Source discovery commands included harmless absent-path matches before the actual paths were located; these were not product/test failures. Production build failures and full-suite results belong to the managing agent's validation log and are not claimed by this review.

## Verdict and limits

**Pass for issue 52 in Fundamentals through Module 4.** No unresolved learner finding in this scope. The only raised finding was corrected and independently confirmed.

All lesson prose and changed placements were read; the review did not inspect the author's justification. Browser checks covered the rendering and interaction states affected by this change. Full exercise grading, all prediction outcomes, native/QEMU tooling, external reference availability, service-worker updates, and every later module were not rerun by this reviewer. The managing agent's full suite and separate later-module/technical reviews cover the remaining validation. No challenge answers are included in this report.
