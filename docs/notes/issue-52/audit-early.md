# Issue 52: early lesson drafting audit

Copyright © 2026 Christopher Snow

## Scope and evidence

This is the separate drafting pass for Fundamentals and Modules 1–4. It uses the existing lesson prose, labels, selected-section configuration and canonical prose records as its checked factual input. No simulator programs, register calculations, exercises, expected answers or external-source settings were changed. CLAUDE.md, the issue brief, authoring, style and visual-language guidance informed the pass. Browser learner and technical review are separate gates; this record does not claim they have passed.

All previous `modelVsReality` footer strings in this scope are now empty. Empty canonical footer headings were removed. The implementation pass must allow that omission without leaving headings or bypassing validation. Necessary qualifications are retained locally as listed below.

| Lesson | Decision and location |
| --- | --- |
| One addition | Existing browser-simulator definition and Run instruction retained beside the first activity. One optional note, “What the simulator shows”, explains completed instruction effects versus real overlap and elapsed time. This is the one introductory explanation, replacing repeated later hardware footers. Existing first-use register/operand teaching is unchanged. |
| Adding a constant | No generic footer remained. Constant range, operand rules and manual links are unchanged. Removed an empty footer property heading from the canonical record. |
| A tiny function | Compiler version, target and `-O1` explanation moved from the footer to the first listing introduction. Prepared-call scope (the simulator supplies the call and omits call-making instructions) moved before the first activity. Per-instruction guidance remains. |
| Returning to the caller | Prepared argument and stopping before remaining caller instructions are stated beside the activity. Authored caller versus recorded GCC function provenance moved there from the footer. The existing canonical qualification that this partial caller would need to preserve its own return address was restored in source; see failed attempt below. |
| Subtraction and reuse | Removed the generic “Track the old value” reflection heading and sentence, using a nine-section layout. Read-before-write remains taught in the explanation/visual and subtraction rules. Separate input sets are already explicit before the second activity, so the footer repeating them was removed. |
| Instructions in sequence | Removed “Follow the state” and its generic question. Removed the redundant “Continue or return” section; the important stop-after-subtraction qualification now precedes the activity. Program-counter marker and one-instruction-at-a-time instructions remain. Eight-section layout. |
| Putting it together | Removed generic hardware-overlap footer. Concrete reflection about complete-function results and removed-return behaviour remains. Existing simulator, argument, result and stepping explanations needed for this activity remain. |
| Same bits, two readings | Removed footer repeating 32/64-bit register views and absence of C types. Those facts already appear in first-addition register teaching and this lesson’s interpretation activity. Numerical and interpretation claims unchanged. |
| Constants and widths | Removed footer repeating assembler acceptance/rejection. The instruction constraint activity already states its GNU assembler agreement; its explicit model boundaries and instruction restrictions remain. No encoding lecture added. |
| Adding and the flags | Moved arithmetic-versus-circuit qualification directly into the column addition introduction. Removed generic architecture/QEMU verification footer. The distinct arithmetic-column interaction guidance is retained by the implementation pass. |
| Subtracting and the tick counter | Removed footer repeating the previous lesson’s architecture/QEMU and arithmetic-versus-circuit explanation. Subtraction, flags and counter limitations remain in the lesson itself. Reader review caught wording that attributed the column calculation to processor circuitry; the introduction now describes subtraction as an equivalent addition calculation, and the figure explains results and flags rather than hardware steps. |
| Masks | Moved the existing `ubfx`/`bfi` naming qualification beside the post-exercise GCC comparison where those forms matter. Removed generic execution/QEMU boilerplate. Held-back feedback and exercises unchanged. |
| Shifts | Moved constant-form alias naming qualification into the shift investigation, next to the instructions it explains. Removed generic QEMU footer. C-standard and compiler-specific qualifications remain unchanged. |
| Compare and choose | Explained `cmp` as `subs` with the result discarded where `cmp` is introduced; the existing optional `cmn` note similarly names `adds`. Removed generic stepping/QEMU footer. All sixteen condition cases remain intact. |
| Branches | Moved program-path-versus-timing qualification beside the path and instruction-count activity. Removed generic execution-overlap footer. Narrowed the old “every listing so far ran … in order” claim to earlier arithmetic calculations, because the newly preceding visible `bl` lesson makes the old claim false. |

Canonical prose for each changed lesson is synchronised with the retained rendered wording. No generic end reminder was substituted for the removed sections.

## Focused checks and failed attempts

- Formatting of the changed TypeScript source passed with Prettier.
- First targeted prose-test attempt: seven suites were blocked because the current lesson schema still required a nonempty footer for full layouts. The implementation owner was notified; this is an integration constraint, not a reason to restore boilerplate. No validation bypass was added by the drafting pass.
- The separate returning-to-caller prose test exposed existing drift at base commit `84bd405`: that commit added a partial-caller/return-address qualification only to the canonical record. The drafted source was brought into agreement with that existing checked record, preserving the important limit rather than deleting it. The isolated rerun then exposed a second pre-existing canonical typo: the challenge named `add w1, w1, w0` although the source, model and worked result use `add w1, w0, w0`. Corrected the canonical instruction to match the unchanged exercise. Final checks follow these corrections.
- Isolated returning-to-caller canonical rerun passed (1 test) after both drift corrections.
- Full tests, build, browser review and CI are deliberately delegated to the implementation/review passes to avoid duplicate runs during concurrent edits.
