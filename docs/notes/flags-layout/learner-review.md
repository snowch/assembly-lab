# Independent learner and built-site check

Reviewed 13 November 2026 by a separate reviewer who did not write the repair. The checked-fact brief was `/workspace/scratch/flags-layout-brief.md`. Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md` and `docs/visual-language.md` before reviewing. No product code was edited by this reviewer.

Verdict: the candidate resolves the reported instruction/input spacing and range-card layout faults. No blocking learner finding remains within this repair's scope. No new learner wording is needed.

## Browser evidence

Used repository-installed Playwright with real headless Chromium. Compared the preserved baseline at `http://localhost:4490/assembly-lab/#/lesson/adding-and-the-flags` with the immutable candidate at port 4491. Every initial-layout comparison used 320, 375, 834 and 1280 CSS pixels, in light and dark. Confirmed the actual `html[data-theme]` value, and inspected the themed page surfaces.

Own captures and machine-readable measurements are in `/workspace/scratch/flags-learner-review/`. `browser.mjs`, `extra.mjs` and `fourbit.mjs` reproduce this review; their JSON outputs distinguish measurements from judgement. Initial captures have the pattern `4491-WIDTH-THEME-arm.png`; baseline captures use 4490. These are review evidence, not published course assets.

| Accepted fault | Severity and quoted page context | Independent verification of correction |
| --- | --- | --- |
| Instruction and input caption touch | Minor layout fault: `adds w0, w0, w1` is immediately followed by “Starting inputs”. The caption's grouping is unclear when it touches the instruction's dark panel. | Baseline gap is 0px at all eight width/theme combinations. Candidate gap is 20px in all eight. The input caption now belongs visibly with the input equation beneath it. Keep this block spacing. |
| Narrow signed range card breaks the range awkwardly | Moderate readability fault: “Signed range” presents long decimal bounds inside half of the available tablet card. On the baseline 834px screen the interval splits over two lines, while the unsigned interval fits beside it. | Candidate range cards stack at 320/375/834px and remain paired at 1280px. At 834px both intervals fit on one line. At 320px the signed interval wraps between complete bounds, so neither sign nor digits break. Each bound has one browser text rectangle. Card scroll width equals its client width; the page has no horizontal overflow at the checked widths. Keep content-width-based stacking and unbroken bounds. |
| Inline sibling instruction needs the same block treatment | Minor layout risk: the gated follow-up repeats the instruction after “Inspect the first case with its inputs reversed”. | Opened the follow-up by completing the real practice through its UI at all eight width/theme combinations. The instruction is a block, its next paragraph begins 20px below it, and its scroll/client widths agree. No overlap or clipped instruction was observed. Keep the shared instruction treatment. The original sibling's inline behaviour was checked in source; baseline follow-up geometry was not separately measured. |

At every candidate width/theme combination, selected a prediction, checked it, then cleared it. Selection alone kept the result inspection absent. Checking opened it, including after an incorrect prediction. Clearing removed the inspection and selected answer. The instruction, input caption and range cards stayed readable through these states. Separate screenshots record initial, selected, committed and reset states. Completing the three practice cases opened the follow-up only after completion; its instruction spacing then passed the same checks.

Repeated range containment and complete-bound measurements with Arial and DejaVu Sans at all four widths in both themes, with no page or range-card overflow. These were runtime font overrides for the review, not product changes.

Checked the actual four-bit siblings in section 03, including the always-visible unsigned/signed range summaries, the C panel, and the V panel's labelled range. Both panel modes were captured at all eight width/theme combinations. Their labels remain readable and page width remains contained. The renderer accepts a width argument, but the current lesson has only a `ranges(32)` call site; this review does not claim to have rendered a nonexistent `ranges(4)` route.

## Rejected findings

- **Change global sidebar selection because 05 is highlighted while 06 is visible:** rejected. At 834px in both themes, deliberately placing section 06 at 200px or 121px from the viewport top leaves 05 selected. Moving its top to 119px or 80px selects 06. Clicking 06 in the outline selects it and focuses its heading. This agrees with the visible shared outline's 120px reading threshold. A neighbouring section can be visible before it becomes current; this screenshot alone does not establish a usability fault. No global navigation change is recommended.
- **Shrink the range numbers or hide their overflow:** rejected. Candidate geometry contains the existing numbers at the tested widths and fallback fonts. The 320px interval's two complete bounds remain understandable on separate lines.
- **Add a new explanation of hexadecimal, signed readings or operand order:** rejected for this repair. The earlier teaching quoted below supplies these prerequisites, and the repair introduces no new concept.

## Assumed knowledge checked against earlier teaching

Prerequisites were read in source, not replayed in a browser. Relevant earlier explanations are:

- `fundamentals.prose.ts`, addition: “The register that receives the result is the destination, named first in this instruction.” Subtraction/reuse: “The instruction reads its old value before writing the result there.” These support the repeated `w0` in the affected instruction.
- `fundamentals.prose.ts`, function: “GCC, a compiler, translated the C below into an assembly listing” and “`-O1`, an optimisation setting that asks it to make code shorter and faster.” Neither name needs a new definition here.
- `one-pattern-three-readings.prose.ts`, investigation: “A `0x` in front marks a number as hexadecimal” and “Each group of four bits becomes one digit”. Its generalisation explicitly gives both 32-bit ranges.
- `four-bit-arithmetic.prose.ts`, addition: “A carry is a bit passed left from the previous column”, followed by the column procedure and four-bit signed range. This supports the lesson's smaller demonstrations.
- `constants-and-widths.prose.ts`, failure experiment: “The `w` names in the earlier arithmetic examples selected 32 bits.” This supports the transition to a real instruction.

The present lesson defines a flag and its set/clear values before section 06; its earlier C/V summaries explain which reading each flag checks. No unexplained assumed knowledge was found in the changed presentation. This is a focused prerequisite check, not a certification of every term in the whole course.

## Scope and limits

This review judges the supplied candidate build. The browser interactions and measurements above were performed independently; source reading established the narrow markup/CSS scope and prerequisite teaching. The source diff changes block spacing, range-grid sizing and endpoint wrappers, with no new prose or numerical formula. Model arithmetic accuracy is for the separate technical review.

This reviewer did not run the repository full suite or independently rerun the parent's focused suite. Those results belong in `validation.md` and the implementation PR. No Firefox/WebKit, physical-device, screen-reader, zoom or browser-session restore certification is implied. Some element screenshots include the sticky shell header crossing the captured element after Playwright scrolls it into view; viewport captures and geometry, rather than that capture artefact, were used to assess the spacing.

## Final revision verification

A later parent breakpoint sweep found that the first candidate paired the range cards too early for DejaVu Sans around 880–950px. The original four-width review above remains historical evidence, not evidence that every intermediate width passed. The parent raised the minimum range-column width from 17rem to 20rem; no wording, arithmetic, instruction spacing or gate code changed in that revision.

Independently checked the new immutable build at `http://localhost:4492/assembly-lab/#/lesson/adding-and-the-flags` using real Chromium at 320, 375, 834, 920 and 1280px, in both actual light and dark themes. Captured new viewport screenshots and measurements with `final-revision.mjs`, saved beside the earlier evidence as `final-WIDTH-THEME-FONT.png` and `final-revision.json`.

All ten default-font cases retain the 20px instruction/input-caption gap. Range cards stack at 320/375/834/920px and pair at 1280px. Each bound still has one text rectangle, each card's scroll/client widths agree, and there is no page-level horizontal overflow. At 920px, independently viewed the complete prediction card with DejaVu Sans in both themes: the two cards stack, each interval fits legibly on one line, and neither interval approaches or crosses the card edge. DejaVu cards measure 600px wide at this viewport; their client and scroll widths are both 598px.

The final layout revision passes this focused learner/checker recheck. The interaction checks earlier in this report apply to the prior immutable build; their code and affected spacing did not change in this final threshold refinement. This reviewer did not repeat the entire interaction sequence for a grid-threshold-only revision or claim a full breakpoint sweep. The separate technical review covers additional breakpoint geometry.
