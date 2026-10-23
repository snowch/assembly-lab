# Module 0 independent learner/checker review

23 October 2026. Review-only session; no application edits or build. Read the repository instructions, style checklist, front-page prerequisites, all lesson sections, primitive component/strings, recorded programs and challenge definitions before reviewing the implementation rationale. No previous lessons exist. The learner knows the front page's small C functions and basic arithmetic/binary conversion, and has no assembly experience.

## Verdict and findings

No open severe, medium or low learner finding in the checked production build. No obvious regression observed in the new activity, the full-function synthesis, prediction gates or existing challenges.

The original first-prediction sequencing problem is resolved. “For `add` and `sub`, the first operand names the register written. The second and third supply the input values” appears before practice. The worked addition is followed by a different destination, read-before-write, subtraction and a two-instruction state sequence. “The instruction reads the old values before writing” appears beside its first prediction. Function arguments/result convention, the colon label and `ret` are introduced before the C prediction. The complete-function walkthrough retains its prediction gate and no longer adds duplicate operand diagrams or intermediate prediction controls.

Rejected source-review candidate: the earlier component cleared the submitted value while saying “Compare your prediction with the result.” The production view now displays “Your prediction: …”, including after a fresh reload. Verified with a deliberately incorrect submission in all four contexts. No further fix suggested.

The single-operation panels distinguish “Before the instruction” from the computed Read/Write result; read-before-write names the old value explicitly. The sequence instead labels the updated registers “Registers now” and distinguishes “Just ran” from “Runs next”. The second instruction reads the state left by the first. “Start again” returns to the initial worked operation without a stale result. In the synthesis, the current instruction/status and the outlined written register supply enough information to apply the practised rule without another operand lecture.

## Browser evidence

Final production endpoint: `http://127.0.0.1:4322/assembly-lab/#/lesson/meet-the-machine`. Four independent fresh Chromium contexts: 375×900 and 1280×900, each with system light and dark preferences. Actual body backgrounds were `rgb(243, 246, 245)` and `rgb(16, 22, 21)`, respectively. Screenshots inspected in both themes and at both widths. No page overflow or page errors in the main four-context run. On phone, the full C/instruction pair remains a contained horizontal scroller; scrolling it exposes the instructions without scrolling the page sideways.

Each main context checked initial hidden results; worked addition; new-destination prediction with disabled empty submit; deliberately wrong prediction; matching reuse/subtraction predictions; two-instruction initial, intermediate and completed states; reset; reload on an uncommitted prediction stage, after an incorrect committed prediction, and midway through the sequence; C prediction gate and incorrect commitment; all four synthesis steps; completed state; and synthesis Reset. The recorded input/result values, preserved unwritten registers and sequence marker agreed with the source model expectations. The synthesis had no `.al-flow`, `.al-operands` or `.al-expect` panels.

Each context also submitted wrong work to both existing challenges, checked rejection, then submitted valid work and checked completion and reload persistence. The construction used the tap editor at phone width and typing at desktop width. No challenge hints or answers were opened. This review records no challenge solution.

An extra four-context run checked the missing-return prediction gate, absence of its deletion switch before commitment, the altered run through completion, Reset, optional register bits and contained listing scrolling. All passed. The first extra script exited 1 after its phone checks because its desktop assertion ran before awaiting lesson readiness; it did not wait for the ten lesson sections as the main script does. Adding that readiness condition and rerunning passed all four contexts. No application change or assertion weakening was used.

Artifacts: `/tmp/course-load-check/check00.cjs`, `check00-extra.cjs`, `00-results.json`, and `00-{375,1280}-{light,dark}-*.png`. The main script exited 0. This is focused independent browser verification; it does not claim a full-suite run or independent GNU/QEMU verification.

## Assumed knowledge and limits

The page assumes the front panel's C functions, arguments, variables, return and arithmetic; these are within the stated entry knowledge. Register/instruction/operand syntax, read-before-write, sequential state, function label, argument/result placement, `ret`, program counter, memory and the challenge's number-operand notation are explained before their required use. GCC and optimisation settings are explained locally; optional compiler-command details are not prerequisites for the activity. No newly unexplained prerequisite identified.

All ten lesson sections, both challenge definitions and local compiler notes were read. No external compiler call, local compiler-command execution, full-suite test, or real-tool differential run was performed by this checker. Results are a review of the rendered mechanism and task sequencing, not a measured beginner study.
