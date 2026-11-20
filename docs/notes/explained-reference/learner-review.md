# Independent learner and UX review

Copyright © 2026 Christopher Snow

## Scope and learner preparation

The reviewer did not draft or implement the reference changes. Read the checked brief, repository review rules, authoring/style guidance and the front-page prerequisites. The learner can read small C functions with int/unsigned, conditions, loops, arrays and returns; do basic arithmetic; and read small binary values. Earlier lessons before the tick-counter activity introduce operand order, register widths, hexadecimal, two's complement, arithmetic and flags. Memory and branch reference entries are optional broader lookups, not extra prerequisites for the current exercise.

Reviewed the built local site using Chromium at 375×900 with touch/mobile settings and 1280×900, in actual light and dark themes. Root data-theme was checked in all four cases. The same independent script exercised the invalid ADD immediate, generic register lookup, STRB, ADR, B.EQ, LSL and default RET, plus optional complete programs.

## Findings

1. **Medium: the relevant error rule is still below the initial viewport.** Opening “Syntax for add” selects the immediate form first, but the actual encoding limit remains below the fold after a large context stack. At 375×900, `.reference-essential-rules` begins at y=891.5 and is 387.5px high; at 1280×900 it begins at y=891.3 and is 229.1px high. The bullet “Use a number from 0 to 4095, or a multiple of 4096 up to 16773120” is the third bullet, below even that start. The initial phone screenshot shows search, scope, the capacity explanation, prepared-state note and two syntax boxes; it does not show the rule which fixes the reported operand. Direction: surface the failing operand's actual rule at opening, or scroll within the panel while keeping keyboard focus and the lesson page stable. Verify the specific limit bullet's rendered visibility rather than only the UL's top edge. Reported promptly to parent; accepted and independently verified below.

2. **Medium: the complete program's highlighted instruction consumes its following newline visually.** In the complete STRB, ADR and B.EQ program listings, the label after the marked instruction appears at the far right of the same visual row rather than on its own line. The mark is an inline block containing the newline, so the following span continues outside that block. The text source retains the newline, but the visible assembly listing presents the line boundary incorrectly. Direction: keep one instruction/label per line while highlighting; verify the following line's vertical position, not merely that one mark exists. Reported promptly to parent; accepted and independently verified below.

3. **Medium: the complete program renders below the course's minimum readable text size.** On the phone, the listing's pre element is12px but its nested code element applies the global0.86em scale again. Actual computed code and mark text is10.32px. The repository requires visible text of at least11px; screenshots also show this optional listing is unusually small. Direction: remove the double scaling or otherwise ensure the actual rendered code size meets the limit, then inspect the opened full program on a phone. Reported promptly to parent; accepted and independently verified below.

## Successful first-pass observations

- In all four size/theme combinations, error help opened the exact ADD immediate form first and retained the typed source unchanged. Search received focus. Closing the phone modal or desktop panel returned focus to the exact syntax button.
- The immediate example distinguishes prepared values from the one instruction's result. The default register example shows w8 being overwritten while w9 and w10 retain their values. This directly demonstrates destination versus inputs instead of relying on a bare snippet.
- Opening “More worked examples” exposed the accepted #4096 case, while the visible common-mistake section explained rejected #4097 and the large unsigned value. Each case is described as independent.
- Advanced form and additional-rule disclosures were optional. The basic route did not require reading stack-pointer or extension variants.
- The All browser instructions scope retained the current exercise context and marked unavailable instructions. `b.eq` resolved to `b.cond`.
- STRB showed a 309 register input, unchanged input/base registers and one-byte memory contents becoming53. “Contents at .Lvalue (1 byte)” distinguishes stored data from a label address. ADR separately showed “Address of .Lvalue” and the destination address, with an explicit statement that no memory load occurs.
- Conditional branch rows retained the prepared flags and showed the resulting PC/target plus “Branch taken”. LSL separated the source value from its shifted destination; RET showed its destination PC. These broad lookups assume the related lessons' concepts or use their local rule explanations; they do not supply a solution to the elapsed exercise.
- The optional full program gives setup, target/data label definitions and finishing code. Its visible note states that the editor stays unchanged. This is useful context without putting helper code in the main example, subject to the line-layout finding above.
- Escape returned focus to the header Reference button. Reload preserved the edited exercise text. No JavaScript page errors, page horizontal overflow or dialog horizontal overflow occurred in the first pass.

## Evidence and limitations

Script and screenshots: `/tmp/explained-learner/review.mjs`, `review.log`, `review.json`, and size/theme screenshots in the same directory. First-pass checks completed in all four combinations. The assertions established the observed functionality; they did not assert that the specific error-limit bullet was initially visible. That visual gap was found by inspecting the screenshots and measured positions.

No complete browser suite, screen-reader session, Safari/Firefox test, physical mobile-device test or human novice study was performed by this reviewer. This is a learner-perspective and interaction review, not evidence of learning effectiveness. Native/parser correctness belongs to the independent technical and executable checks.

## Independent correction checks

The rebuilt layout with build ID `7db432bd50b78713ea893309c4181ad07442f7bacadd3ce220aa95823876be12` (working-tree build with commit metadata `f940b1c`) passed the full learner workflow at375×900 and1280×900 in actual light/dark.

- Finding1 corrected: the actual immediate-limit bullet is first and fully within the viewport. Its box is y489.1, height132.0 on the phone and y540.0, height79.2 on desktop. The capacity explanation is also visible at the landing point. Search remains focused and visible in the sticky tools. The underlying lesson scroll position does not change.
- Findings2 and3 corrected: opened full programs use12px actual rendered code, short local labels matching the focused instruction, and one marked instruction. A DOM Range on the following non-whitespace text confirms the next label is on a lower visual line. Inspected corrected phone/light immediate and desktop/dark STRB screenshots.
- The same latest pass repeated source preservation, reload, exact close/Escape focus return, all/allowed lookups, memorycontents versus address, branch outcome, shifts and return. No JavaScript errors or page/dialog overflow occurred.

These successful reruns do not replace the original findings or initial failed review commands.

## Additional error-scope finding

4. **Medium: the targeted jump hides an unavailable instruction's actual rejection reason.** In the current elapsed exercise, enter `mov w8, #3`, then choose “Syntax for mov”. The assembler's rejection is `gate.notAllowedHere`, not an immediate-encoding failure. The drawer selects the MOV immediate form and scrolls past “Not allowed in this exercise.” The warning's y127.5–153.9 box sits behind the sticky tools' y0–158.2 box. The initial screenshot shows only “Help for the assembler error” and MOV encoding rules, although the written number itself is valid. Direction: retain the unavailable-in-exercise reason at the targeted error landing, such as inside its visible error context. The full form reference remains useful as optional information. Reported to parent; accepted and independently verified in the final-build pass below. Screenshot: `/tmp/explained-learner/final-notallowed-phone.png`.

## Failed review attempts kept separate

- First correction recheck timed out waiting for the drawer to scroll. Parent independently found the same request-animation-frame timing issue and corrected the effect's lookup dependency. This was a product failure; the later pass above verifies its correction.
- The next recheck passed scroll/focus/visibility but its line-layout assertion assumed the corrected renderer still used span elements. The fix correctly emits raw text and React fragments, so the assertion had no following element. Updated the review to use a DOM Range on the following non-whitespace text node. This was a review-script assumption, not another product fault.
- An extra unavailable-instruction review attempt overlapped the final rebuild and timed out waiting for the editor. The fresh post-build attempt succeeded and established finding4. The rebuild overlap is not reported as a production failure.

## Final gate-warning correction and final-build rerun

Finding4 is corrected and independently verified on build ID `071aff9459adc55e1306241a9779d1f57ce00b9332ce2fa182dfc674049606c5`. The gate-error lookup lands on the instruction entry rather than jumping past its unavailable-in-exercise warning. At375×900, the warning is y251.5, below the sticky tools' bottom at158.2; at1280×900 it is y330.1, below the tools' bottom at237.2. Its full height remains within the viewport in both actual themes. Inspected the corrected phone/light screenshot. Search keeps focus, the lesson does not scroll, Escape returns to Syntax for mov and the typed source remains unchanged.

Reran the complete reference learner workflow against this same final build at375/1280 in actual light/dark. All four passes succeeded. The actual ADD encoding-limit bullet remains fully visible (phone y489.1, height132.0; desktop y540.0, height79.2). The capacity explanation stays with it. Complete programs still render at12px, retain one marked instruction and put the following label on its own lower line. Source/reload preservation, scope filtering, memory contents/address distinction, branch outcomes, shifts, RET, keyboard focus and page/dialog containment remain correct.

Final evidence: `/tmp/explained-learner/gate-review.log`, `gate-review.json`, `final-all-review.log`, updated `final-review.json`, and final screenshots. No unresolved blocking learner/UX finding remains from this review. This review still makes no claim of novice learning effectiveness or complete accessibility testing.
