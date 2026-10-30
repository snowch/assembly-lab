# Course pacing review

## Conclusion

Module 0 has seven short, independently navigable lessons. Most later modules still have two
large pages. The main issue is concentration of learning goals per page, not total module size.
An initial rendered-text inventory gives about 3,000 displayed words for Module 0 and 2,900 for
Module 1. Those counts include code, figure labels and controls, exclude closed details and gated
content, and are not reading-time estimates or quality scores.

Use one primary learning goal, a worked activity and an application as the default page shape.
Keep connected traces and capstones together. Do not impose a word limit or force every later
module to have as many pages as Module 0.

## Module decisions

| Module | Recommended treatment |
| --- | --- |
| 1: Registers and readings | First priority. Separate hexadecimal, signed/unsigned readings, loading constants, constructing constants and register widths into focused lessons; preserve their prerequisite order. |
| 2: Arithmetic and flags | Keep addition together. In subtraction, keep the counter investigation together, move negation later and identify the adder derivation as a drill-down. |
| 3: Logic, shifts and masks | Split single-bit masks from field extraction/replacement. Keep the shift investigation together, with local sequencing improvements. |
| 4: Compare and branch | Separate the core signed/unsigned comparison from the later condition-family and Boolean-result expansion. Keep the branch trace coherent. |
| 5: Loops | Revised after user feedback: replace the two long pages with short lessons on following a loop, writing an upward loop, counting down with flags, testing before/after the body, and stopping when useful work ends. Keep each worked trace intact within its lesson; trim duplicated failure views. |
| 6: Loads, stores and widths | Keep memory/address basics together. Move register-only extension and cast expansion closer to a separate conversion goal; retain the load-width comparison, correction exercise and mixed-record task. |
| 7: Arrays and strings | Split selecting an indexed element from walking an array with a moving pointer. Keep zero-terminated strings as one investigation. |
| 8: Multiply and divide | Keep basic product/division investigations together. Reposition high-half multiplication and division-by-constant extensions so they do not interrupt core practice. |
| 9: Calls and stack | Separate saving the return address and frame mechanics from preserving values across a helper call. Retain the recursive-frame investigation. |
| 10: C to assembly | Revised: divide each current page into reading/editing generated code, equivalent assembly, and focused C construction. Start with six compact units; give a boundary experiment its own unit if it still crowds the loop application. Keep each complete trace intact. |
| 11: C and machine rules | Trim conversion recap already covered in Module 6. Separate promotions/mixed comparisons from checked arithmetic and its stored-result/overflow-report contract. |
| 12: Native ARM64 | Get the first build/boot result sooner; defer detailed linker/directive/build-selection explanation until needed. A later layout/startup checkpoint may help, but preserve connected failure/repair and debugger workflows. |
| 13: Pi 5 | Revised: four practical stopping points: prepare/connect, build/stage image, card/terminal/first boot, then break/restore/diagnose. Move the source comparison to extraction; keep each command sequence complete. |
| A: A32 comparison | Revised: four short units on register/return conventions, conditional limit/syntax, constants, and division helpers. Keep paired listings and complete A64 traces local to each activity; redistribute the final exercise fields. |

## Priority

1. Rework Module 1's page boundaries to remove the immediate jump after Fundamentals.
2. Split the clearly independent goals and create shorter completion units in Modules 3, 4, 5, 7, 9, 10, 11, 13 and A.
3. Reorder or trim Modules 2, 6, 8 and 12; make the Module 13 task-placement correction during its restructuring.

A split must retain instruction/term prerequisites, useful figures, exercise contracts and
navigation, and should remove duplicated introductions rather than multiplying headings.
This review does not authorise removing technical qualifications that affect the learner's result.

## Evidence and limits

Independent reviews cover Modules 2–13 and optional A, reading every assigned page's prose and
activity structure, checking prerequisites and examining the built site at 375/1280 in actual
light/dark themes. Their reports distinguish states exercised and source-only details. Root
reviewed Module 1 source and collected initial rendered inventory across all 34 lessons.
No learner prose, lesson structure or exercises were changed. No native or physical-board
execution was performed for this pacing review. Detailed findings and limitations are in the
four module-group reports beside this file; inventory methodology is in inventory.json.

## Revision after user feedback

The initial recommendation to retain Module 5 was too conservative for the requested pace.
Its two initial pages show 1,510 and 1,588 words (including code, labels and controls), versus
261–647 per Module 0 page. A coherent trace can remain intact on a short page; coherence does
not require all loop applications and failure experiments to share the same completion unit.
The original independent report remains unchanged as review evidence; the Module 5 row above
is the revised managing recommendation. These are proposed boundaries, not implemented lessons.

The user also requested a recheck of Modules 10, 13 and A. Their original retain decisions
overweighted conceptual coherence relative to short, independently completable pages. The
revised rows supersede those decisions. Initial displayed counts are 1,164/1,147 for Module 10,
815/1,256 for Module 13, and 1,678 for A, using the same inventory method. Independent recheck
addenda record boundaries and cautions. Module 10's six-unit starting recommendation combines
reading and source editing in compact investigations; the independent reviewer prefers up to
eight units if failure experiments still dominate the resulting pages. Verify actual rebuilt
page density before fixing that count. No course lesson has been changed by this review.
