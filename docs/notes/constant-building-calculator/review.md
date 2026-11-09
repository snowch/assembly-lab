# Constant-building calculator: decision and verification

## Learning/design decisions

The user explicitly chose Calculator only and identified the missing reason for the upper-half multiplier. A separate High-effort learning review found the same causal gap and confirmed that the default exact-division calculator cannot implement the old divide-and-discard-decimals direction unchanged. Keep the earlier bit reader and this page's two-half model figure; no bit picker is added here.

Reuse the existing blank optional calculator beside the assembly editor, before Text/Tap. A challenge opts in through initial.data.calculator.division. The component receives a handoff identifier and the division mode, never the challenge's target, answer, program or a callback into exercise work. The input starts empty; typing an expression is the learner's choice. Calculator use cannot construct assembly, pass the grader or open the saved-solution figure. Long arithmetic is support for this lesson's construction goal, not a separate assessment.

The opt-in mode keeps the whole-number part of each division using BigInt division towards zero. For the explicitly positive-number procedure, this gives the upper-half count. The learner multiplies and subtracts to find the remainder. Default exact division, its error messages and the earlier calculators' handoff keys remain unchanged. There is no new operator or mode selector.

## Separate drafting and editing

GPT-6.1 Sol Medium separately drafted the prose and local calculator helper/format against the checked facts. The managing-session edit replaced an assumed exponent notation with the explicit statement that doubling 1 sixteen times gives bit 16's weight. The visible route now connects the first upper-half position to 65536 before using the multiplier in the existing small example. The procedure describes the whole-number result actually shown, and both canonical text directions are synchronised.

The mandatory route still teaches half selection, the multiplier, the existing 2/3 worked decomposition, and how to find the two halves before the independent assembly task. The optional calculator provides arithmetic, not missing instruction semantics. Both sentence and whole-idea closing passes were applied; code widths, input scope, result timing and the solution gate remain explicit.

## Managing-session checks

- Eight focused unit files: 135 tests passed, including exact/whole arithmetic, signs, per-operation truncation, validation, code/submission isolation, constants facts, canonical prose and pacing.
- A later strict TypeScript command failed on a new test selector: Testing Library's ByRoleOptions has no exact property. Removed that unsupported test-only option; strict TypeScript then passed, and the affected four calculator UI tests passed. This does not reinterpret the original failed command as a pass.
- Production builds passed. Final runtime source was built as index-AXVd-DhF.js for review; the subsequent fix changes only that test selector.
- Fourteen built-browser cases passed across desktop and phone: the new calculator in actual light/dark, existing exact-division sibling calculators in both themes, and all broad constants-page layout cases. Covered blank/closed and entered calculations, remainder steps, zero division, powers, native keyboard disclosure, at least 44px control, Text/Tap, unchanged editor/grade/hints/gate, valid saved-code restoration and no page errors/overflow.
- Source formatting and whitespace checks pass before committing. Full CI, independent final reviews, merge and public deployment outcomes are recorded in the pull request.

## Independent review scope

Separate GPT-6.1 Sol High learner/UX and Extra High technical reviewers did not draft or edit the material. Both final reviews reported no corrective findings. The technical source probes independently check all 32 bit weights, eight unsigned-32 decomposition boundaries through the simulator, baseline exact expressions and whole-division sign/chaining/power/error cases. Reviewers inspect the final built page at phone/desktop in actual light/dark and the existing exact-division siblings; the pull request records their final coverage and findings.

No observed novice session, screen-reader user study or physical-device execution is claimed. Expert reviews and automated browser checks are evidence of the inspected behaviour, not proof of learning effectiveness.

The final learner review inspected 1440 by 1000 and 390 by 844 in actual light/dark themes, arithmetic/error and stale-result states, Enter/Space/Tab and focus, Text/Tap, unchanged grading/hints/gate/editor, Clear work and valid saved-code restore. It found the calculator discoverable after the formula and before code entry; the brief prompt between them did not obscure the tool. Its exact sibling check was desktop-only. Target measurements in a dedicated render-waiting pass were 45.890625 pixels for the native summary and 44 pixels for input/Calculate. It observed no overflow. The manager qualified an overbroad wording in the review: signed arithmetic is already earlier in Module 1; this change adds no new teaching of that topic.

The final technical review inspected 1280 by 900 and 375 by 812 in both actual themes, including both exact-division calculator siblings, local sign/truncation/errors, target sizes, bottom-edge touch, native keyboard disclosure, scratch/editor/grade/hint/gate independence and valid restored code. Its independent probes passed all 32 bit weights, eight model boundary reconstructions, 1425 baseline/exact expressions, 465 whole-division cases and twelve errors in both modes. Five focused files passed 108 tests before the new regressions were complete; a two-file final rerun passed 53 overlapping calculator tests. These are not summed as unique-test totals. No source or model assertion failed in those probes. Comprehensive hot-update handoff, forged completion, all hint levels, physical devices and assistive technology were outside that review's scope.

## Assembly-number formatting finding

A managing-session check found that the original calculator's grouped output, for example a comma within a decimal number, cannot be copied as one assembly operand. The assembler treats the comma as an operand separator and rejects the line. Use plain ungrouped decimal output in this exercise's whole-division mode, keeping the existing grouped output for exact-reading calculators. No instruction or answer transfer is added. A UI/assembler regression and the new browser case cover manually copying a computed upper-half example into a mov operand. This correction follows the first otherwise-clear reviews; targeted independent confirmation and the final updated CI run are recorded in the pull request.

The independent technical reviewer confirmed the P2 in the original rendered workflow with a synthetic number unrelated to the exercise target. The corrected build index-DLir9JJi.js then passed both reviewers' four-context targeted checks: grouped calculator input yields a plain whole-mode result, manually using that result as an operand assembles, and no transfer or gate change occurs without manual editing. Independent passed assembly survives recalculation/reload. Both exact-reading siblings retain grouped output and their fractional-division error. The managing-session final rerun passed strict TypeScript, 54 overlapping calculator unit/UI cases and eight desktop/phone calculator browser cases; the technical UI follow-up passed five overlapping cases. No new learner copy was needed. The original reviews' omitted copy-format workflow is acknowledged rather than treated as an original pass.
