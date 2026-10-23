# Tiny first function: independent technical review

Copyright © 2026 Christopher Snow

Reviewer: a separate Codex agent using the inherited model and effort, with no implementation or learner-copy edits. The review used the lesson's stated prerequisites, repository instructions, actual source/request/response records, simulator implementation, figure code, tests and canonical prose. It does not supply an independent browser or novice-learning verdict.

## Checked semantics and records

An independent Python assertion pass verified that `increment/increment_int.c` equals the source in `request.json`; the request records `-g -O1 -fno-verbose-asm`; and the successful, non-truncated AArch64 response emits exactly the function label, `add w0, w0, 1` and `ret`. Both original source references name raw line 5, the closing brace. Removing the copyright line makes that displayed line 4. The checked teaching association `[3]` for each instruction names the return statement: its expression requires the addition and its control transfer requires the return. No instruction was reordered or changed to arrange this association.

The simulator trace supplies the incoming argument, current register, write mark and final result. The activity's `returned` stop, rather than a timer or copied result, changes the caller from waiting to resumed. The addition writes `w0`; `ret` writes no ordinary register. Its result remains in `w0`. The caller box is an abstraction of the model's supplied call, not a claim that an additional caller program or `bl` instruction executes in the figure. The component introduces no numeric program counter, link-register or stack display.

The compiler-produced unprefixed literal `1` is retained and explained before use. The front page already requires reading C functions with `int` arguments and `return`, so another C syntax lesson is not required. All five differential inputs lie within the C-defined increment range; the displayed call uses the first of them. The original operation-only activities retain their arithmetic prefixes and trace wrappers. The new function activity executes both shown instructions.

The component keeps one current register view for the function and omits the separate arithmetic-result card. Before `ret`, the caller remains waiting, including after reload at the prepared-result state. Its resumed/result text appears only after return. All instruction highlights and C associations use the shared listing renderer. Current-state write marking follows `view.written`, so the return does not mark `w0` written.

## Findings, decisions and corrections

- **Accepted test issue:** the raw increment corpus preserved compiler whitespace, whereas the initial corpus-containment assertion normalised only the displayed program. The correction normalises both through the same listing parser. It still requires the complete label/instruction sequence and the actual displayed call; the original five arithmetic snippets and their calls remain checked. No instruction or value assertion was dropped.
- **Accepted term-gate issue:** the first integrated focused run failed because `caller` was still introduced in Module 9. The new function prose explicitly defines it. Moving `caller` and `argument` introduction metadata into Module 0, removing the later `caller` introduction and updating the fixed term-list expectation/module plan follows the actual teaching order. This is not an exemption from the term gate.
- **Closed policy question:** the first C-backed function now opts into the shared, initially closed original compiler-reference details. The later trip listing retains its details because its local note explicitly discusses the mismatch between GCC's references and the checked teaching links, which the repository permits. There is no need for another open brace-reference explanation in the new activity.
- **Minor item for learner review:** the function uses the next-instruction marker before the later sequence/investigation prose explains that icon. Its current status already names `add` or `ret`, so this is not an execution blocker. The earlier one-operation activity also had that marker. Check whether a local explanation is useful in the actual page rather than declaring a new structural failure from source alone.
- **Rejected additional machinery:** adding a `bl`/`x30`/stack demonstration is unnecessary for this bounded activity. The model already supplies a valid call; the visible distinction is result preparation versus returning. The more detailed mechanism remains later course work.

## Persistence and test integrity

New saved work records the program entry as a stable identity. Legacy numeric positions are interpreted against the original operation-only sequence, then located in the expanded sequence. This retains the meaning of destination, reuse, subtraction and sequence work after insertion. The unit tests explicitly retain an old destination prediction, and the existing sequence test still uses its legacy numeric position. The function's fresh-store paused-state restoration and Start again behaviour are checked separately.

Read the updated educational helper and its call sites. It retains exact C lines, instruction order, checked tags, initial/after-add/after-return values, caller waiting/result gates, absence of a return write and reload state. The previous later prediction/result assertions and whole-function synthesis checks remain. The new stage is traversed in both existing theme paths; no layout threshold or timeout was loosened.

## Verification and limits

Executed by this reviewer: the independent source/request/response assertions described above. Read rather than rerun: the implementation session's seven passing primitive unit tests, the managing session's new-corpus differential log (one program, five calls, 15 instruction states, zero differences), and the first integrated focused log (143 passed, one term-gate failure). That failed integrated command remains failed. Read the subsequent seven-file rerun log separately: **162 tests passed (9.66 seconds)**, including both Module 9 test files. Its term metadata and fixed expectation now reflect the local definitions; the term gate remains enabled.

The original compiler records, source associations, model/return semantics, activity configuration, persistence mapping and updated test assertions have no further confirmed source-level blocker at this snapshot. The seven-file integrated rerun is documented above. Final built phone/desktop/light/dark checks belong to their actual execution records. No full-suite pass, physical execution, exhaustive malformed-storage coverage, screen-reader audit or measured novice outcome is claimed here.

## Sceptic pass on the independent learner finding

The independent learner reported a **medium discoverability fault at 375px**: the listing's visible width is 317px, its contained content is 588px, and the instruction pane starts beyond the visible right edge. I separately viewed the reader's `375-light-entry.png` screenshot and inspected the shared renderer CSS. The initial visible card shows only C, closed compiler references, a textual direction and the run button. The source's minimum 20rem C pane plus 16rem instruction pane explains that result.

**Upheld, narrowly.** The requirement to retain horizontally paired full C and assembly is not itself a defect, and the learner can swipe the container. The defect is that this first complete-function activity gives no local indication or control for discovering the hidden instruction rows/marker. Inline prose naming `add` and `ret` is useful guidance but does not make the current instruction/return marker visible. This does not contradict the earlier source-semantic verdict; it is a newly evidenced rendered issue.

The smallest accepted direction is a function-only contained-pane navigator that reveals the existing instruction or C pane. A single “Show instructions”/“Show C” toggle is reasonable if its named action always reveals that pane, keyboard/pointer focus stays stable, it has the existing touch target size, and stage restart/re-entry resets its target coherently. Keep the one shared listing, all numbered C, original compiler references and checked source associations. Shrinking or stacking the panes globally, duplicating the listing, or weakening a design threshold is unnecessary.

This finding remains open until the final built phone states are independently checked. The requested closure covers entry, after addition and after return in both actual themes, with containment/navigation, keyboard/touch behaviour and restart. This sceptic pass viewed a supplied screenshot and source; it did not launch another browser.

## Navigator correction: independent source check

Read the managing session's actual correction in `PrimitiveOperation.tsx`, `primitive.css`, the independently drafted navigation labels, the unit tests and the educational helper. The function-only wrapper owns one ref to its existing shared listing. Its button locates the named C or instruction pane and changes only that listing's `scrollLeft` plus presentation state; it does not execute an instruction, alter saved progress, change model values or resume the caller. The wrapper's bounded/minimum width rules retain page containment.

The toggle's label describes its next action. Reset and Next activity explicitly clear its presentation boolean; a fresh mount also starts with “Show instructions”. Re-entering the function therefore does not retain a stale target after restarting. Manual swiping can change the current view independently, but the button still performs the pane-reveal action named by its label. No global listing renderer or other lesson was changed for this correction.

The unit test now toggles both panes after the addition and retains the caller-waiting assertion before return. The educational helper adds actual named-pane visibility, stable focus on the same button and unchanged page scroll position, without removing the exact C/instruction/source-tag assertions or the argument/result/return checks. Read the subsequent focused log separately: **five files, 144 tests passed (7.29 seconds)**. This source check did not duplicate that test command or launch a browser.

The correction addresses the accepted direction without a new confirmed source defect. Final closure of the medium rendered finding still requires the independent reader's checks of the built correction; source approval is not a claim that the phone screenshots changed as intended.

## Final closure and validation-record audit

Read the final independent learner record and its four-context results file, the final affected browser log, and `increment-validation.md`. The reader verified the changed production assets `index-B7pdy9O1.js` and `index-DRyjSuVo.css` in fresh phone/desktop and actual light/dark contexts. The new control reveals the instruction pane with a contained phone offset of 271px, then reveals C at offset 0; keyboard, pointer/touch, focus, page position and restart/re-entry are checked. Exact code, tags, model values, return gating and write marks remain intact. The reader directly viewed representative final images in all four contexts and retains the original failing screenshots separately. **The upheld medium phone finding is closed by that independent rendered evidence.** This auditor did not repeat the browser run.

The earlier marker-explanation question is not a separate remaining blocker: the independent learner considered it and identified local operation status plus the existing accessible next/just-ran labels, with navigation discoverability as the actionable fault. That stronger fault is now fixed and verified. This does not claim that every learner will infer every mark or that the new activity fits one phone screen.

The validation document reports the command history fairly: the original 143-pass/one-failure term-gate command remains failed; the seven-file correction run passed 162; the post-navigation five-file run passed 144; the complete Module 0 browser file passed 104 with two intentional viewport-specific skips before navigation; and the final affected navigation rerun passed six in 37.4 seconds. It neither substitutes the six-case rerun for a new full-course suite nor conceals the independent reader's two initial harness-setup failures. GNU/QEMU results, local structural checks, independent browser scope and untested physical/novice outcomes remain distinguished.

Final technical/documentation verdict: no confirmed required correction remains within the changed activity and reviewed validation scope. This is readiness for the managing session's commit/PR and CI process, not a claim that an unobserved CI run has passed.
