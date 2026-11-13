# Independent learner and UX review

Reviewed 13 November 2026 by the independent learner-review agent (same inherited model as managing session; no product or test authorship). Review target: the immutable candidate served at `http://localhost:4511/assembly-lab/#/lesson/adding-and-the-flags`, from `/workspace/scratch/flags-compact-result-candidate1`. Footer identifies commit `7b847a9`; the reviewed uncommitted change is contained in that candidate snapshot. The rendered title is “Addition and its flags”.

Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, `docs/visual-language.md`, `docs/authoring.md` review guidance and this change's fact brief. Read the whole rendered lesson and all fourteen preceding published lessons, from One addition through Writing w and x registers. Read the course's “Before you start” requirements and expanded prerequisite copy. The browser text captures are in the scratch evidence directory below. Source lesson groupings were not mistaken for the shorter published lessons.

## Findings

No finding introduced by the compact-result change was identified in the reviewed states. This is an independent reader's report, not the author's completion verdict or a substitute for technical review.

**L1. Low severity, baseline: unexplained abbreviation.** Section 03 says, “The CPU performs one addition.” Earlier lessons and the front-page prerequisite panel use “processor”; none of the rendered prerequisite text introduces CPU. The abbreviation adds an unnecessary term to the first definition of signed versus unsigned overflow. Direction: use the existing term, or explain the abbreviation locally. The same sentence occurs in `HEAD:packages/views/src/flags-lesson/strings.ts`, so this is a pre-existing issue, outside the section 06 change. It does not obstruct interpreting the compact result.

No other untaught assumption was found in the changed section. The evidence for the terms checked is recorded below rather than relying on the reviewer's technical knowledge.

## Learning sequence and density

The lesson defines the four flags near their first use. Sections 01–03 show stored patterns and two readings, then give a complete small signed-overflow example and an unsigned carry example. Section 04 compares cases in both readings. Its optional circuit defines FA, XOR and NOR locally. Section 05 supplies a fresh small addition for flag and program-intent practice. These stages precede the 32-bit range prediction.

The first 32-bit task combines familiar operands and readings with the newly defined range checks. A smaller complete candidate already exists here: the four-bit examples and fresh practice. An extra worked 32-bit example before the prediction would add repetition and risk answering it prematurely. The visible bridge, “The sign bit is now bit 31, not bit 3”, identifies what changes at the larger width.

After checking, the result appears once in hexadecimal under “Result written to w0”. The two decimal readings sit together, with “Matches the exact sum” and “Differs from the exact sum”. The closing statement, “The exact signed sum exceeds the signed range. The stored negative reading is valid”, distinguishes the failed range check from the valid stored representation. This makes the comparison readable without opening another control. The two obsolete section 06 disclosures are absent in the browser.

The checked feedback does not reveal any section 07 case's answer. “Next: predict flags yourself” goes directly to the visible practice heading, with that heading approximately 96 px below the viewport top after scrolling settles at both phone and desktop sizes. The earlier optional circuit and the three practice cases remain discoverable. The practice follow-up remains visibly named while locked.

## Assumptions checked against prerequisites

| Assumption | Earlier or local preparation inspected |
| --- | --- |
| Ordered assembly operands; repeated `w0` is one register | M0 One addition explains destination first; Adding a constant and Subtraction and reuse explain reading before writing the same register. |
| Register width and `w` names | M0 One addition introduces matching `w`/`x` names; immediately preceding Writing w and x registers says `w` selects the lower 32 bits. |
| Hexadecimal and `0x` | M1 Reading hexadecimal explains four-bit groups, `a`–`f`, and the prefix. |
| Signed versus unsigned; negative highest weight | M1 Signed and unsigned readings explains both rules, unchanged bits and the highest position's negative weight; it explicitly bridges bit 3 to bit 31. |
| Clear/set bits and sign-bit significance | Reading hexadecimal defines clear/set. Signed and unsigned readings explains that both readings agree when the highest bit is clear. Section 02 here relates the top bit to N. |
| Carry, retained width and carry beyond the width | Arithmetic with four bits defines the incoming carry, column addition and retaining the low four places; it distinguishes ordinary `add` from flag-setting `adds`. |
| Exact sum versus stored reading; meaning of C and V | Sections 03–04 define range checks and demonstrate each reading locally; section 05 practises the distinction before the transfer. |
| Flag, set/clear flags, N/Z/C/V and `adds` | Defined in this lesson's introduction and sections 02–03, before the prediction. |
| FA, XOR, NOR | Expanded and explained inside the earlier optional circuit. These terms are unnecessary for section 06. |
| CPU | Untaught abbreviation found; baseline L1 above. |

No compiler setting, new tool, C construct, or additional instruction is required to interpret the changed feedback. GCC and `-O1`, when checked as possible course assumptions, are explained in M0 A tiny function. The optional calculator and related-lesson links remain optional.

## Actual browser checks

Used installed Playwright Chromium loaded through `createRequire('/workspace/assembly-lab-mov-width/package.json')`. Fresh tests cleared local storage and explicitly reloaded; navigation to an identical hash was not treated as a fresh mount.

- Fresh section 06 has no choice selected, no feedback/result and no removed disclosures. Default inputs are hexadecimal. Empty submit asks for a prediction and reveals no result.
- Hex, unsigned decimal and signed decimal controls update the starting-input display and pressed state. Both decimal displays explain why the input readings match. Switching formats does not open a result gate. Reload restores default Hex.
- A wrong checked prediction and a correct checked prediction both show the compact comparison with distinct grading text. Wrong and correct committed states survive reload.
- Editing a checked choice immediately hides stale feedback. Reload preserves that edited draft without revealing stale results. Checking again reveals feedback for the newly submitted choice.
- Clear removes selection and feedback; reload preserves the cleared state.
- Injected realistic legacy presentation fields (`open`, `reading`, `bits`, `trace`, `done`) alongside a canonical checked prediction restore the compact comparison without either old panel. Legacy unchecked and edited states keep feedback closed. Presentation-only forged commitment does not reveal results. A canonical-only older prediction migrates successfully.
- Earlier optional circuit opens at phone and desktop widths in both themes, without widening the page. Its text distinguishes teaching logic from an Arm physical circuit.
- All three section 07 cases can be completed in sequence; the follow-up stays locked until all cases have checked correct answers. Completion survives reload. Editing invalidates the follow-up, and clearing practice locks it again. Empty practice submission gives guidance. No practice answer is included in this review.
- Keyboard arrows change section 06 radio selection; Tab reaches Check prediction; Enter submits; focus remains on Check prediction. The feedback container retains `role="status"` and `aria-live="polite"`. Labels and text communicate grade/readings independently of colour.
- Tested 320, 375, 834 and 1280 px wide viewports with 900 px height in explicit Light and Dark. Confirmed actual rendered `data-theme` and computed backgrounds, not just select values. Document scroll width equalled viewport width in all eight section 06 states. Numbers, minus signs, range labels and comparison text stayed readable; 320 px naturally wraps the signed range and result line. Controls remained inside their containers.
- Also checked System (`auto`) under emulated dark/light OS preferences: the computed backgrounds changed to the corresponding actual themes.
- Read the whole lesson in browser text and captured earlier sections at 375/1280 px in both themes. Inspected compact-result and practice screenshots at phone, intermediate and desktop sizes, including normal viewport captures of the feedback and transition. Full element screenshots can include the shared sticky header crossing the capture; normal viewport captures confirm it sits at the viewport top.

## Evidence, source-only checks and limitations

Scripts, JSON observations, text captures and screenshots are retained under `/workspace/scratch/flags-compact-result-learner/`:

- `review.mjs`, `results.json`: prediction states, input formats and eight width/theme combinations.
- `legacy-practice.mjs`, `legacy-practice-results.json`: persisted-state variants and practice completion/invalidation.
- `final-checks.mjs`, `final-results.json`: keyboard submission, settled transition position, retained circuit and System theme.
- `prerequisites.mjs`, `prerequisites.txt`, `initial.txt`: rendered reading context.
- `viewport-feedback-*`, `viewport-transition-*`, `arm-*`, `practice-*`, `earlier-*`: screenshots. Particularly useful: `viewport-feedback-375-dark.png`, `viewport-transition-1280-light.png`, `arm-320-dark.png`.

Source-only checks: prerequisite definitions, canonical-versus-presentation state handling, result rendering, and comparison with `HEAD` to classify L1 as baseline. Arithmetic architecture/source verification belongs to the separate technical review; this review inspected the displayed comparison for learner meaning, without independently rerunning GNU/QEMU.

An initial ad hoc practice script exited 1 because `.check()` targeted the intentionally visually hidden radio input and its visible label intercepted the click. Changed the scratch script to click the visible label and reran successfully. This was an automation-targeting failure, not evidence of a broken learner control. No product/test changes were made by this reviewer.

No full-suite or exact-head CI result is claimed here. No physical phone, screen reader announcement playback, browser other than Chromium, browser zoom/reflow, reduced-motion behaviour or public deployment was tested. The browser checks establish rendered labels/status semantics and keyboard interaction, not a complete accessibility audit. No beginner observation study was performed.
