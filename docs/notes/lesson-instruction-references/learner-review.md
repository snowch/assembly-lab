# Lesson instruction references: independent learner review

Reviewed 14 November 2026 by a separate Codex session that did not author the implementation or copy. The review read the actual source and diff, exercised the built pages, inspected screenshots and recorded its initial assessment before opening `brief.md`. The independent learner findings were sent to the managing session before the brief was read. This review follows `CLAUDE.md` and `docs/authoring.md`; it is not the separate technical source review.

## Finding L1: phone reference links are smaller than the course target

**Severity: medium. Accepted, corrected and independently verified on the final build.**

The generated reference-list links in `LessonSourceReferences.tsx` are plain anchors. Their stylesheet only changes underline offset. On the 375-pixel phone, the visible links `ADD (immediate)` and `ADDS (register inputs)` each have a measured target height of **22 pixels**. The same measurement recurs across all six instruction entries on `masks`, both entries on `memory-and-addresses`, all three extension aliases, and multiple native, A32 and floating-point entries.

This gives a touch learner a substantially smaller target than the References disclosure itself, and misses `CLAUDE.md`'s requirement that every phone control be at least 40 pixels tall. The issue belongs to the shared generated list rather than one lesson. The two moved authored prose lists already receive the shared prose-link treatment and did not show this failure.

Suggested direction: give the generated reference links the course's mobile link-target treatment, preserving multi-line labels and a contained page width. Recheck short and long entries across the shared component's core, native, A32 and floating-point uses. Do not loosen the control-size check to accommodate the current dimensions.

Evidence: `/workspace/output/instruction-reference-learner/results.json`, the `layout.links` measurements for width 375 in both themes, and `references-*-375-*.png`. Reported to the managing session before the author brief was opened.

The managing session added the generated-list class `lesson-source-links` and scoped the flex layout, padding and 44-pixel minimum target to `.lesson-source-links > li > a`. The two authored prose lists retain inline anchors. An intermediate broad selector was narrowed before this final check so it cannot split their explanatory sentences into block rows.

Independent checker result: the final preview served JavaScript asset **`index-CUJTDxZg.js`**. All generated reference links measured at least **44 pixels** high at both 320 and 375 pixels in both themes across the ten reviewed routes. Short core entries and long native/A32/floating-point labels stayed within the page. Both authored lists retained `inline` or `inline-flex` anchors and their original explanatory flow at phone and desktop widths. Screenshots were inspected for the opening/returning lists and the generated masks/native lists in light and dark themes. References still opened with Enter, closed with Space and started collapsed; no console/page error or page overflow occurred. The chevron is now an empty-content CSS border shape, while the summary text remains exactly `References`. **L1 is closed.**

## Learner assessment of the remaining change

The opening lesson's explanation now moves directly from registers, instructions and memory to the diagram of the two register names. There is no manuals box between them. The first `add` in the explanatory prose is visibly linked; the later instruction listing and the learner's answer fields retain their usual roles. The complete opening page was inspected at phone, tablet and desktop widths, including light and dark appearances.

The References row appears after lesson content and before both completion and previous/next navigation. Its position makes the optional sources available at the point where a learner finishes the activity. It is initially collapsed, named `References`, and has a visible disclosure chevron. The prominent heading and focus ring distinguish it from the completion control. No source list was open in a fresh lesson state.

Native `details`/`summary` keyboard behaviour worked: Enter opened the list, Space closed it, focus stayed on the summary when toggled, and Tab from the open summary reached the first source link. The opening summary measured at least 64 pixels high. The component remains collapsed after navigating to another lesson or reloading. A theme change preserves its current open state.

The moved opening references retain their explanations of what the instruction and architecture manuals cover, including the existing account/sign-in guidance. The returning-to-caller references retain the distinction between the call/return instruction rules and the procedure call standard. The old in-lesson reference boxes are absent from those two teaching flows.

For generated lists, `Instructions` and `Other primary sources` distinguish instruction entries from wider manuals and tool documentation. The core register-input label avoids requiring the introductory learner to know the manual's shifted-register terminology. `ADD (immediate)` is understood by the end of Adding a constant because the lesson defines immediate beside the activity. Alias names match the instructions being discussed, rather than exposing a different mnemonic as if the learner had already studied it.

Long labels wrapped inside the available width on phone, tablet and desktop in both themes. Examples inspected include the architecture manual, the procedure call standards, A32 MOV/MOVS entries, the PL011 manual and the C floating-point conversion clauses. No page-level horizontal overflow or console/page error was observed in the 60 route/viewport/theme combinations.

The custom flags introduction links its explanatory `adds` occurrence without turning its command comparison into links. The linked word remains inside the sentence defining what the extra `s` means. A saved miniature choice survived theme changes, route navigation and reload. The Arm result remained gated before its separate prediction was committed.

On the ordinary opening lesson, entering a provisional answer and stepping the example remained independent of opening References. Toggling the disclosure did not submit the answer or mark the challenge complete. Switching theme preserved both the entered answer and current stepped state. Saved answers restored after route navigation and reload while References returned to its collapsed state.

## Prerequisites and preparation

This assessment assumes only the front-page prerequisites and lessons earlier than the page under review. The first lesson defines registers, instructions and operands in its teaching text. The next lesson defines constant and immediate. Returning to the caller supplies the branch/link-register explanation and distinguishes the calling convention from `ret`. The flags lesson defines a flag and the `adds` spelling before using them in its activities. The masks, load and extension pages retain their earlier teaching and controls.

The native, A32 and floating-point catalogues contain exact bibliographic/form labels such as `DAIFSet`, `Run-time ABI`, `A32 MOV, MOVS`, and `scalar`. Some of these titles can exceed a reader's current vocabulary. They remain optional source names, not instructions or prerequisites for solving the current exercise. This review did not find a required rule that now exists only behind References. A beginner need not interpret every official manual title to continue the lesson.

The distinction between definition, demonstration and practice remains in the lesson body. The small complete examples and later composition tasks were neither removed nor replaced by a source link. An additional preparation bridge is therefore unnecessary for this presentation change. No new model activity is introduced by the reference panel.

The following possible findings were considered and rejected:

- **References needs its own course activity or outline stage.** It is an optional bibliography, not a required lesson or gated learning stage. The visible row before completion provides a local entry.
- **Official source titles introduce new task prerequisites.** The unfamiliar words occur in optional bibliographic labels. Required operand, range and flag explanations remain in the lesson body.
- **Custom flags markup might reset on theme change.** Actual selections and the unchanged closed Arm gate survived theme changes, navigation and reload in all six checked width/theme combinations.

## Browser evidence and limits

Preview: `http://localhost:4204/assembly-lab/`, built site on branch `feat/lesson-instruction-references`.

The independent matrix covered these ten routes at **375, 768 and 1280 pixels**, each in **light and dark** themes: `one-addition`, `adding-a-constant`, `returning-to-caller`, `adding-and-the-flags`, `masks`, `memory-and-addresses`, `extending-register-values`, `from-function-to-executable`, `same-c-on-a32` and `floating-point-conversions`.

- `inspect.cjs`: **60 combinations**, completed with exit 0. Checked actual rendered theme, collapsed initial state, placement before completion/navigation, Enter/Space operation, unchanged stored work after disclosure toggling, layout measurements and errors. The phone link-size issue was found in the recorded measurements; this result is not a claim that every layout criterion passed.
- `state.cjs`: **6 viewport/theme combinations**, completed with exit 0. Checked keyboard focus into sources, theme/open-state behaviour, preserved ordinary lesson work, route/reload reset, the custom flags introduction link, restored flags choices and the independent closed Arm-result gate.
- `final/check.cjs`: **44 final-build route/viewport/theme combinations**, completed with exit 0. Checked the scoped target-size correction at 320/375 pixels in light/dark across all ten routes, authored prose flow at those widths and at 1280 pixels, decorative chevron content, keyboard toggling and overflow/errors. Evidence is preserved separately under `final/` so the initial 22-pixel measurements remain available.
- Screenshots and text captures are in `/workspace/output/instruction-reference-learner/`, together with both scripts, logs and JSON records. The initial source/UI assessment was recorded in `pre-brief-assessment.txt` before reading the author brief.

This is Chromium keyboard, layout and interaction evidence. It is not an observed novice-learning result, a screen-reader/assistive-technology study, or a claim about all browser engines. Native disclosure markup supports expected semantics, but a real screen reader was not run. External documentation bodies, source correctness and destination availability belong to the separate technical review; this learner pass did not browse every external link. No full-suite result is claimed here, and no product or test file was edited by this reviewer.

## Follow-up: custom flags introduction target

Rechecked 15 November 2026 after the managing session's full run at HEAD `e152e6e` exposed the custom flags `adds` link's 20-pixel target. The earlier learner pass checked that link's appearance and state behaviour but did not measure its target. This is separate from L1's generated footer links.

**Finding L2, medium: accepted, corrected and independently verified.** The managing session added `.al-flags-lesson .instruction-reference-link` with `display: inline-flex`, centred contents, `min-height: 44px` and `vertical-align: middle` in `lesson-sources.css`. No learner copy or state implementation changed. This follow-up was commissioned with the failure and proposed correction already supplied; it is an independent checker pass, not a new blind review.

The actual preview at port 4204 served **`index-8yO3FBBb.js` and `index-B4vMGVkB.css`**. These fingerprints were read from the served page, rather than inferred from the earlier build. The compiled stylesheet contains the new scoped rule.

Independent results:

- The custom flags introduction link measured **44 pixels high** at **320, 375, 834 and 1280 pixels**, in **both light and dark themes**. It stayed `inline-flex` with middle vertical alignment and remained contained within its paragraph. Keyboard focus was visible.
- Normal and focused hero screenshots were inspected across all eight combinations. The linked `adds` remains within its explanatory sentence. The taller inline target increases that line's height; words remain in reading order without clipping, overlap or a separate block row. Both command-comparison instructions remain plain code. No hero or page overflow was observed.
- A saved miniature choice survived theme changes, navigation away/back and reload. Theme changes preserved the open References row; route changes/reload closed it. The independent Arm result gate remained closed throughout. No console/page error was recorded.
- Relevant siblings remain intact: generated footer links still measured at least 44 pixels, the ordinary first-lesson mnemonic link retained its existing mobile/desktop display behaviour, and the authored opening reference list retained inline or inline-flex prose links rather than block links.

`flags-followup/check.cjs` completed **8 viewport/theme combinations**, exit 0. The additional `flags-followup/layout.cjs` completed **8 normal hero layout checks**, exit 0, including page/hero width and paragraph-text bounds. Scripts, logs, measurements and screenshots are preserved in `/workspace/output/instruction-reference-learner/flags-followup/`. **L2 is closed; no further learner issue was found in this follow-up.**

For the distinct full-suite record, the managing session reported that its first fixed-HEAD run was deliberately stopped with **exit 130**, after **766 passed, 14 skipped, 3 failed, 1 interrupted and 732 not run**. One failure identified this target-size issue; the other two were reported as stale selectors for the moved manuals. Its artifacts were copied to `/workspace/output/instruction-references-initial-artifacts/`. Those counts are managing-session evidence, not a full-suite run performed by this reviewer. The passing focused checks above do not change that original exit status or establish a passing full suite.
