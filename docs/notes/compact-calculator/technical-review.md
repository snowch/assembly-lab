# Independent technical review: compact production calculator

15 November 2026. Independent reviewer did not author or edit this implementation. Read actual source and the built initial UI before the implementation brief or author rationale. Followed CLAUDE.md, docs/authoring.md, docs/style.md and the local learning-design skill. This is the technical pass; the separate learner review remains distinct. Only this review note was written in the repository.

**Decision: the checked arithmetic, state transitions and migration are sound. The accepted local-definition regression is corrected and independently verified. No open arithmetic/state blocker was found.** This is not a full-suite, novice-learning or assistive-technology validation claim.

## Scope and source checks

Read CalculatorWorkspace, CalculatorInspection, calculator-workspace helpers/codec, new calculatorArithmeticFlags model/export/tests, compact strings/canonical copy, CSS, adapted component/browser tests and the existing simulator arithmetic. The global scratch tool still does not accept lesson answers or processor state. No lesson content, grading data or platform implementation changed in the inspected diff.

The plain decimal entry route works without opening flags or bit inspection. The relevant observable task is to enter intended operands, calculate, compare the exact result with the retained word and change its reading. Earlier lessons supply hexadecimal, signed patterns and flag mechanisms, but the global tool is available before them; local definitions therefore still matter. The compact result before inspection reduces the amount a learner must remember while scrolling. This is a design judgement rather than evidence about a beginner’s learning.

### Arithmetic and flags

The existing prefix parser and BigInt compute/retention rules are reused. Width remains explicit. Prefixes are nonnegative raw patterns, while unprefixed decimal entry follows the selected reading’s bounds. Entry rejects oversized significant patterns without truncating or resizing. Explicit width changes resize valid A/B and preserve invalid drafts unchanged. Short patterns and widening receive upper zeros, including with Signed selected.

The new flags helper first validates patterns through calculatorCompute. N comes from the retained top bit, Z from the retained word, Add C from unsigned carry, Subtract C from unsigned A≥B (no borrow), and V from the exact signed sum/difference’s bounds. The UI qualifies these as scratch arithmetic with no instruction execution. Flags are independent of the decimal reading, and shifts show neither Add carries nor arithmetic flags.

Read the simulator’s execAddSub/addWithCarry path: subtraction complements B and supplies carry-in one, while the resulting carry out is C. Its carry-into/out-of-top-bit rule agrees with the range rule used here. The existing Arm-source basis remains the one recorded in docs/sources.md and the retained ADDS/SUBS instruction evidence; no new hardware run was performed. The new model tests compare nine boundary values pairwise for both 32/64 widths and Add/Subtract against the actual simulator, rather than merely restating this helper’s result.

Independent fast source probe checked 768 cases against separate bit formulas for overflow/carry: all 4-bit pairs for Add/Subtract, plus 32/64-bit boundaries. All matched. This is targeted mathematical evidence, not an exhaustive 64-bit or fresh native test.

### Results, freshness and reading changes

workspaceSettings preserves a completed result only when its current validated source patterns, width, reading and operation match the previous trace. It recomputes the exact value under the new reading and preserves the retained pattern. An uncalculated draft does not gain a result from changing Reading. Mismatched or malformed sources do not retain a trace. Width, operand, operation, reuse, bit edits and applied half edits invalidate old result/flags/carries.

The range formatter compares a model-produced exact integer with the appropriate width/reading bounds; it does not generate an answer. Shift full results explicitly use unsigned pattern arithmetic and unsigned bounds, even when the retained decimal reading is Signed. Reuse loads the retained pattern, not an unrepresentable exact integer.

### Handoff and isolation

The existing header scope/key is retained. Source review and targeted probes confirmed legacy selected-hex drafts retain their meaning (including old hexadecimal `0b10`), old empty-entry snapshots recover their formerly loaded A, new live empty fields stay empty, and stale source traces are rejected. Output metadata is regenerated from validated inputs rather than trusted. Old edit/carry/half-open work migrates to open inspection; explicit new collapsed/show-flags choices are preserved.

Five real browser handoff fixtures exercised these old/new entry cases through the actual session-storage handoff, including rejecting changed pending A and overriding deliberately wrong output metadata. Each handoff was consumed. Separate source probes cover explicit new collapsed inspection/show-flags values and old edit/carry migration.

The existing lesson prediction’s stored state remained exactly identical before and after scratch arithmetic and editing in four contexts. Closing/reopening preserves current scratch work, and a separate actual route change to the neighbouring lesson preserves A and the open help state. This verifies in-tab behaviour; ordinary reload persistence is not promised or claimed.

## Accepted finding and independent correction

**Medium, missing local prerequisite definitions.** The initial compact implementation removed “Unsigned: zero or positive”, “Signed: the highest bit has negative weight” and the hexadecimal digit/four-bits definition. The new help explained changing a reading without defining it. The global tool is available before those course lessons, so “under that reading” alone leaves an unsupported assumption. Direction: restore the concise existing definitions locally without restoring the long introduction before entry.

The managing session reused the existing canonical unsignedHelp, signedHelp and hexHelp strings in Entry & width help. Read the actual correction and independently confirmed all three definitions in the built, opened help at 375 and 1280 pixels in light/dark on final checked asset `index-DOm1WZdt.js`. Screenshots were inspected. The primary decimal route remains compact; a user choosing the advanced reading/notation has a named local help entry. Closed.

The separate learner reviewer’s native-checkbox appearance correction was also inspected: the control has native appearance, retains its associated label/checked state and toggles with keyboard Space. A final 375px built check produced the correct four arithmetic values. No mathematical logic changed for these corrections.

## Built interaction checks

Independent functional matrix: 375×667 light, 375×500 dark, 1280×900 light and dark on `index-BQKm2lQQ.js`:

- Initial output absent; changing reading alone does not manufacture a calculation. A completed signed overflow case reprojects to the unsigned reading without Calculate; retained pattern and flags remain consistent.
- Maximum 32-bit pattern plus one gives distinct signed/unsigned exact results with the same retained zero/carry values. Add’s carry derivation remains valid across a reading change.
- Unsigned subtraction below zero and signed subtraction overflow produce correct exact/retained values and NZCV. Subtract hides the Add carry control.
- Too-wide A at 32 bits retains the text, clears stale output, focuses A and shows the complete error below the sticky heading, including the constrained 500px viewport. Selecting 64 makes it valid and provides accurate valid-pattern/previously-invalid feedback.
- 64-bit unsigned maximum plus one displays the precise integer beyond Number precision. Retained reuse, signed −1 zero-filled widening, narrowing, malformed binary recovery and Enter from B behave correctly.
- Shift retains signed −2 for the tested all-ones pattern shifted once, while labelling the unbounded result unsigned. Invalid shift count focuses the count input and hides stale output.
- Roving bit keys and Space change A, invalidate result/flags and update the preview. Invalid half replacement focuses its field; a valid applied half changes A correctly. Close returns focus to Calculator; reopen preserves A and inspection state.
- No page errors or horizontal document overflow. Lesson localStorage state is unchanged.

Final affected-state recheck on `index-DOm1WZdt.js`: definitions, native checkbox keyboard toggle, route work, inspection and edit columns at 375/1280 light/dark. A/B/result column x differences measured zero pixels while editing; Low bits and close/reopen preserve horizontal position after the visibility observer aligns the reopened dialog. The later build changes definitions/native styling and JSX key placement, not arithmetic/state logic; earlier functional evidence remains applicable.

## Test-change sceptic pass

The adapted tests preserve meaningful obligations:

- The inspection helper opens the newly optional disclosure rather than bypassing a prediction, grade or result gate. Carry/value/unknown, scrolling, alignment and close/reopen assertions remain.
- The old “reading change removes all flags” expectation is intentionally replaced with correct signed readout and stable C/V assertions, matching the authorised result reprojection. Width changes still require unknown output.
- Removed Calculate/Edit tab checks are replaced by one Calculate action and native inspection/reset checks. Bit/half editing remains exercised. Prefix, migration, width rejection, exact arithmetic and lesson isolation checks remain.
- Geometry assertions now distinguish approved parallel desktop operands from stacked phone operands, while retaining equal widths, preview placement and operation ordering. The new browser check adds numerical hover-contrast and sticky-header error bounds.
- New state tests reject manufactured/stale/re-sized results and check migration. The independent probes also challenged wrong stored output fields rather than accepting supplied metadata.

The browser-discovery problem reported by the managing session occurred before cases ran. Moving `key` before the spread on the span avoids the loader’s createElement-import path; the spread contains only data attributes, so this preserves the element’s actual key/data semantics without changing a test expectation or adding a resolver/dependency workaround.

Rejected concerns: zero-filled widening of a signed pattern is not signed numeric conversion; a negative exact unsigned difference is legitimate mathematical feedback; V remains a signed-range condition even in Unsigned mode; and a reading-only reprojection is not instruction execution. No proposal here adds automatic width, sign extension, stale flags or a CPU pipeline.

## Evidence and limits

Artifacts are outside the repository in `/workspace/output/compact-calculator-technical/`: initial source-first page read, `browser.json` and screenshots; `model.json`; five-fixture `handoff.json`; `definitions.json` and screenshots; and `final-checkbox.json`. The compact strings’ canonical TypeScript block was independently compared to source and matches exactly.

Two reviewer harness attempts are retained separately: an unscoped role=status query matched implicit output statuses as well as the feedback paragraph, and an immediate scroll assertion ran before the reopened dialog’s visibility observer. Scoping feedback and polling actual restored position corrected those assertions; neither demonstrates a product defect.

The managing session reports its initial four focused unit files passed (35 tests), and browser discovery/runs resumed after the loader correction. This note does not claim that an initial discovery failure was a test pass or that a full suite has completed. Full fixed-HEAD checks and CI remain the managing session’s responsibility. No novice study, screen-reader/other assistive-technology session, real soft-keyboard or physical-device test, exhaustive operator-input test or new native execution was performed. A prepared beginner finding an error/result and explaining exact versus retained values remains the useful learning-evidence next step.

## Final focused fixture and half-heading recheck

The managing session’s first discovered focused browser run finished with 28 passes and four failures; the retained `/workspace/output/compact-calculator-browser-3.log` records all four compact-calculator cases failing. This is not a passing run. Their second viewport iteration expected fresh, closed inspection after visiting the same route, although the global calculator correctly preserves its open state across that navigation. The initial independent probes above used fresh contexts and separately checked persistence; they do not contradict that failure.

Read the actual fixture correction: after the same-route visit, each geometry case now reloads the document before setting the theme/opening Calculator. All fresh-state, numerical, flag, contrast, local-error, geometry and browser-error assertions remain. This is a valid way to establish a genuinely fresh geometry fixture; it does not replace the separate close/reopen, route and handoff preservation checks with a reset. No product-state change was required for this correction. The managing session reruns the affected four cases; no rerun result is presumed here.

Build 5’s only subsequent product delta names A explicitly in the half-editor disclosure. Independently verified `Edit a 16-bit half of A` in the actual inspector at 375px light and 1280px dark on asset `index-9xdr-AQh.js`; re-compared the complete compact-copy block with its canonical record and it matches exactly. Evidence: `final-half.json`. This improves the subject of the action without changing half arithmetic, state or the previously verified layout/flags. No open technical blocker remains.

## Recheck after the first fixed-HEAD full-check unit failures

The first full check on `2650318` failed in the unit stage: **3,550 tests passed and six failed**, all in `CalculatorCarries.test.tsx`; the browser stage never started. Independently read the initial `/workspace/output/compact-calculator-full-check.log` and the actual sibling test file. This full run is not a pass, and later focused passes do not change its result. A replacement fixed-HEAD full check is required.

Five failures stopped at visibility assertions because the legacy unit fixture never opened the newly optional inspection disclosure. The other expected no arithmetic flags after calculating Subtract, which conflicts with the approved optional Subtract NZCV summary. Those expectations require adaptation to the authorised interface; they do not justify changing arithmetic or weakening stale-result assertions.

**Accepted medium teaching regression, now closed:** independently confirmed that the optional carry body had dropped the local exact-signed-range definition and put the XOR definition after its first equation. The earlier technical pass missed this ordering gap. The old sibling assertions exposed a meaningful obligation once their fixture was corrected. The smallest product correction restores the existing `F.help`, `F.overflowHelp` and `F.xorHelp` strings before the C/V equations, inside the optional carry detail. It adds no new mathematical claims and leaves the main numeric answer first.

Read the complete test correction as a sceptic:

- Setup explicitly opens inspection before carry work. The initial unknown-state, real region/control relationship, carry recurrence/column values, ports, C/V values, both widths/readings and freshness assertions remain.
- The numeric pending message is now positively checked on the new result route rather than requiring absence of the identical old hint text.
- The local definitions must be visible and precede the V equation within `.workspace-carry-details`; the earlier global “before V label” position is unsuitable because the approved numeric result/flag summary now precedes inspection. The summary’s own V definition/label is separately asserted. This preserves the teaching requirement without moving derivation prose above the answer.
- Operation changes still require zero stale flags before Calculate. After Calculate, Subtract explicitly requires four flags, C=1/V=0 for its retained fixture and the no-borrow label; Shift still requires no flags. Add-only carry columns/controls remain exclusive to Add.
- Reset must close inspection before the test deliberately reopens it to inspect the reset preference. The handoff test opens the original inspection, then requires restored inspection to be **already open**, without reopening it to manufacture a passing visibility result. Port values, equations and consumed handoff storage remain checked.

An interim focused run had **204 passes and one failure** because the new Subtract assertion was accidentally placed before Calculate. The reviewer identified that placement against the actual diff; it was corrected while retaining the pre-submit freshness assertion. That failed run remains recorded in `compact-calculator-units-2.log`. The corrected focused run in `compact-calculator-units-3.log` passed **205 tests in ten files**. Independently ran the sibling alone after the correction: **six passed**, exit 0, 4.33 seconds.

Independent built correction check on `index-A0oym1V3.js` at 375px light and 1280px dark passed: exact signed-overflow and XOR definitions are visible before the V equation, sign-bit ports retain their computed values, the numeric result precedes inspection, and editing A clears old flags/equations and restores the unknown-carries prompt. Evidence is `carry-followup.cjs/json` outside the repository. The correction does not change the model or state logic, so the earlier arithmetic/migration evidence remains applicable. The managing session runs affected browser cases and the new full check separately; no replacement full-suite pass is claimed here. No open technical blocker remains.
