# Independent learner and UX review

Reviewer: separate learner-review agent/session, 13 November 2026. No product or test edits. Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, `docs/visual-language.md`, `docs/authoring.md` and this change's checked brief. Reviewed the rendered lesson as a learner with the front page's prerequisites and earlier lessons, without using the managing session's claims as a verdict.

## Verdict and findings

No open introduced learner or layout blocker found in the final candidate. The additional cases form a usable, bounded practice sequence. Input-only labels do not disclose the predicted flags. The reading cards distinguish the exact arithmetic from the stored reading, with complete values and legible signs. The carry disclosure has a visible boundary, useful separation and a usable target.

1. **Low, inherited wording debt, open:** section 03 says, “The CPU performs one addition.” Earlier lessons teach **processor**, but do not define **CPU**. The front page assumes a little C, binary place values and basic arithmetic, not this abbreviation. `rg` over `content`, `packages/views/src` and `apps/course/src` finds no earlier definition of CPU or “central processing”. For comparison, `content/lessons/fundamentals.prose.ts` teaches “An instruction tells the processor to perform an operation.” Direction: use the taught term, or introduce the abbreviation before use. This is outside the added practice/layout change; it is not evidence of a new regression. Sent to the technical/sceptic reviewer, who independently accepted the finding.
2. **Low, inherited interaction defect, fixed and independently verified:** after completing the practice, open “Optional: inspect the carries” and navigate to another completed case. Candidate 1 closes and replaces the disclosure even though the follow-up remains available. The learner loses their inspection state while comparing completed cases. Direction: retain the follow-up DOM while its completion gate is unchanged; remove it when an edit or reset revokes completion. Independently reproduced candidate 1, then verified candidate 2 preserves the same open node through case buttons, Previous and Next; preserves a focused summary through a programmatic case activation; and correctly hides it on invalidating edit or Clear practice answers. Rechecking and recompleting all six make the follow-up available again. Evidence: `candidate-4512-carry-navigation.json`, `candidate-4513-carry-navigation.json` and `final-checks.json` in the scratch directory below. The managing session first identified this defect; this review supplies separate before/after evidence.

No other untaught assumption found in the changed labels, feedback, equations or carry disclosure. The optional circuit defines FA, XOR and NOR locally and explicitly distinguishes its four-bit teaching model from an Arm physical circuit.

## Learning sequence and prerequisites

Read the complete seven-section built lesson, including all four comparison examples and the optional circuit, not only section 07. Read the rendered earlier pages **Reading hexadecimal**, **Signed and unsigned readings**, **Arithmetic with four bits**, and **Writing w and x registers**. Also checked the front page's “Before you start” text and earlier instruction definitions in source.

The relevant preparation is present before composition:

- Hexadecimal and the `0x` prefix are introduced in Reading hexadecimal.
- Signed and unsigned readings first define positional weights, demonstrate the same four-bit pattern under both readings, and require fresh four-bit and 32-bit readings. The bridge explicitly says that the highest position changes to bit 31 while the weight rule stays the same.
- Arithmetic with four bits defines carry, works complete columns and shows retaining four result bits when an extra carry appears. It also explicitly distinguishes `adds` recording carry from `add` leaving flags unchanged.
- This lesson defines flags, demonstrates N/Z and C/V on small patterns, contrasts both range checks, asks a fresh small practice question, then supplies the 32-bit ranges before the real prediction and six cases. Section 06 remains compact: input display, ranges, prediction and local result feedback, without an extra explorer.

A smaller two-bit example could demonstrate the same rules, but would introduce another width after the learner has already practised four-bit arithmetic. The existing complete four-bit worked examples are an appropriate bridge; another miniature is unnecessary for attempting these six cases. This is a review judgement, not evidence from observing a beginner.

## Browser evidence

Native Playwright/Chromium loaded through `createRequire` using this repository's package. Immutable builds:

- Candidate 1: `http://localhost:4512/assembly-lab/#/lesson/adding-and-the-flags`, `/workspace/scratch/flags-practice-candidate1`, build ID `a1c4dec803363b88295e75db5e52f194fdb750f7584fc2109f8acb117abd93a3`.
- Final candidate 2: same route on port 4513, `/workspace/scratch/flags-practice-candidate2`, build ID `b65e912173e0a26c68543860c58d512a15dca010e8c25a9183e7f8592c5eeaff`.

The builds carry the base commit `ff9c3f5cd080d614dfe143b74ee9421351c5bdcf` in release metadata; the build IDs distinguish the uncommitted candidate contents. Candidate 2's relevant runtime change is retention of follow-up DOM while the gate remains unchanged; no copy, styles or arithmetic models changed between these candidates.

Candidate 1 main run: **419 assertions passed**. Additional state/accessibility/prerequisite run: **21 assertions passed**. Candidate 2 before/after and final spot run: **40 assertions passed**.

Browser checks covered:

- Fresh blank practice, six numbered buttons, locked follow-up, hidden prediction/practice answers, and incomplete submissions.
- All six cases submitted wrong and then correct, with independently calculated BigInt expectations. Wrong feedback names the incorrect flag, hides result readings and disables Next. Correct checking preserves work and unlocks the follow-up only after all six cases.
- Completed reload; invalidating edit and reload; corrected recheck; clear and reload. Previously checked first-three answers survive restoration, while the three new cases start blank and cannot inherit completion. Checked both old three-entry presentation state plus canonical answers and canonical-only old saves without a presentation slot. Presentation-only forged checked states cannot establish grades or open the follow-up.
- All five hints in order, with the final hint covering all six additions. No answer-valued text is introduced in unchecked case labels.
- Actual explicit light and dark at **320, 375, 834, 920 and 1280 CSS pixels**. Read computed background colours and theme state, rather than relying on the selected preference alone. System mode also renders both light and dark according to emulated colour preference.
- Every `readings()` location: small-practice feedback, each checked practice case, follow-up; also the earlier C/V comparison sibling under every example. All complete values fit. The worst large negative values retain the minus sign and parentheses. Equation type remains 16px. No document-level horizontal overflow was measured.
- Container-width behaviour: the follow-up and earlier comparison stack at 834; at 920 their 600px containers permit two approximately 293.5px columns, while the narrower practice feedback still stacks. At 1280, the practice feedback has two approximately 314.5px columns. This follows available card width rather than assuming desktop viewport width guarantees room.
- Six case buttons fit in two rows on narrow screens and one row when their card has room. All-wrong “Needs another check” statuses fit at 320/375 with no clipped labels. Tab/Enter reaches and selects numbered case buttons. Pressed state and progress labels are exposed in the DOM.
- Carry summary has at least 48px height (66px when its narrow label wraps), a 24px separation from the preceding cards, visible border, keyboard Enter/Space toggling, and actual Playwright touchscreen taps opening/closing it at 375.
- Blocked webfont requests in a separate browser context and repeated worst-number/follow-up geometry and screenshots at all five widths in both themes. The authored lesson already uses system UI fonts; this exercises missing downloaded fonts, not every operating system's font metrics.
- Candidate 2 repeated worst-number/follow-up screenshots and geometry at every requested width and both themes, plus open/focused disclosure retention, false-gate hide, reset, all-six recompletion and reload. All passed.

Scratch evidence: `/workspace/scratch/flags-practice-learner/`. Reproducible browser scripts are `review.cjs`, `continuation.cjs` and `carry-final.cjs`; measured rectangles, assertion logs, saved-state fixtures, prerequisite text captures and screenshots sit beside them. `final-*-case3.png` and `final-*-carry-open.png` show the final build. Some tall element screenshots include the fixed application header partway through the captured element; that capture artefact is not a panel overlap in normal scrolling.

## History and limits

The first main browser invocation exited 1 at a reviewer assertion expecting System mode to put `light` or `dark` in `data-theme`. The application correctly removes that attribute for System mode and uses media-query styles. Preserved its completed assertion log as `historical-first-run-checks.json`; corrected the assertion to inspect the rendered lesson background, then reran the full script to exit 0. This was a reviewer-script fault, not a product defect. The first HTTP readiness probe of port 4513 ran before its server was available and failed to connect; subsequent final browser checks reached that immutable build.

The complete six-case/migration matrix, miniature/comparison/fallback-font matrix and hints were exercised on candidate 1; candidate 2 received focused changed-behaviour checks and the complete requested width/theme geometry spots. Source confirmed the small runtime boundary. This reviewer did not run the repository's full unit/educational/native suite or CI, and does not claim their status. Arithmetic expectations were independently calculated in the browser harness; GNU/QEMU architecture verification belongs to the separate technical review.

This was desktop Chromium with viewport, colour-scheme and touch emulation. No physical phone, screen-reader speech output, alternate browser engine or beginner usability observation was tested. Screenshot review, DOM names and measured rectangles support this judgement; they do not prove learning outcomes.
