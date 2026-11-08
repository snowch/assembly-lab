# Building a constant: decisions and verification

## Learning-design decision

Keep the existing small worked example and fresh construction exercise. Rewrite the explanation around w0, show the model figure before the decimal procedure, and put essential method/syntax guidance in the existing challenge lead. No new controls, model states, programs, grading rules or hint answers were introduced.

The baseline learner review observed the first figure at document y approximately 1116 on desktop and 1547 on phone, after the mechanism, syntax forms, arithmetic method and # note. The final review measured approximately 773 and 1036 respectively. These are observations of those browser contexts, not layout tolerances or evidence that learning improved.

The accepted findings and rejected prerequisite claim are recorded in brief.md. One addition already defines and illustrates matching x/w names. The current phrase was an attention/clarity problem rather than a wholly missing definition. The following width lesson still develops the write effects.

## Separate drafting and edit

GPT-6.1 Sol at Medium effort drafted from the checked fact brief. The first draft repeated the upper-half effect across several blocks. A second pass combined its syntax explanation with the worked steps. A further pass made the calculator's remainder calculation explicit.

Accuracy/style edits replaced “that ending” with the literal lsl 16 reference and “the product” with “that amount”; product is introduced later in the course. The latter edit changed no calculation. Both canonical prose records were synchronised. The arithmetic method remains scoped to positive numbers fitting w0, and the lower-half movk form remains explicitly defined without claiming it is run by the worked figure.

## Independent learner review

GPT-6.1 Sol at High effort reviewed the baseline and prototype without authoring learner copy. It read the implemented diff and refreshed page before the updated brief. It reported no blocking or additional corrective findings on the final wording.

At 1280 by 900 and 390 by 844, in actual light and dark themes, it inspected the initial page, instruction steps and Reset. It verified that the arithmetic method and # convention are visible before the editor while the solution is locked. In all four combinations it checked hints 1–3, failure of a two-mov attempt, successful submission, the unlocked solution trace and reload restoration. It found no page overflow. Screenshots were visually inspected.

An exploratory browser script initially stopped because its success-state selector expected the failure-only verdict element. The corrected script completed all four contexts. This was a review-script issue; its first run was not reported as a pass.

## Independent technical review

GPT-6.1 Sol at Extra High effort assessed the diff before the brief, checked model/assembler handling and re-read the official Arm DDI0602 2025-12 MOVK/register-accessor responses from the prior review. It reported no blocking or minor correctness findings.

It independently reconstructed eight boundary/example values from 1 through 0xffffffff, checked both movk placements, optional # and preservation of a separately seeded x1. Its final-copy focused run passed four existing files and 173 tests. No model harness failed in this review.

Fresh production contexts at 1280 by 800 and 375 by 812 in both themes confirmed the final “Subtract that amount” copy, figure/method/syntax/exercise ordering, instruction steps, Reset, two normal hint presses and the closed solution after invalid submission. It found no page errors or overflow. Theme attributes, computed backgrounds and screenshots agreed.

An earlier browser harness exited 1 on a theme-selector timeout while a local build refresh was underway. The post-refresh fresh-context run passed all four combinations. The failed attempt remains distinct from that rerun. This reviewer did not run full CI, GNU/QEMU or restored-work cases.

## Managing-session checks

- Five focused constants/pacing prose, facts and lesson files: 75 tests passed before the final plain-word substitution.
- After that substitution, three canonical/vocabulary files: 12 tests passed. This overlaps the preceding run and is not an additional 12 distinct regression tests.
- Production builds before and after the substitution passed. Source formatting and git diff whitespace checks passed.
- Six existing desktop/phone worked-example, locked-solution and restored-work browser cases passed before the word substitution. The final changed method was then checked in both independent browser reviews.
- Additional model execution confirmed the existing shifted sequence and the unshifted lower-half form. No permanent test was added solely to repeat authored wording.

Full CI, merge and publication results are recorded in the pull request containing this change. No beginner participant was observed; independent construction and written/kept-half explanation remain a formative-testing question. Comprehensive keyboard and screen-reader behaviour and new hardware measurements are outside these checks.
