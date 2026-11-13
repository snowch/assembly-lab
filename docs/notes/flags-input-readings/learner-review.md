# Independent learner and UX review

Reviewed the immutable candidate1 build at `http://localhost:4510/assembly-lab/#/lesson/adding-and-the-flags` in real headless Chromium. The reviewer did not draft or implement the selector. Read the whole rendered lesson and the earlier signed/unsigned and hexadecimal material in `one-pattern-three-readings.prose.ts`; applied the learner and figure rules in `CLAUDE.md`, `docs/style.md` and `docs/visual-language.md`.

## Findings

No blocking or non-blocking finding in the changed input display and its joins to the surrounding prediction.

- “Display inputs as” places the three options under the starting-input expression. The three labels identify notation and reading without suggesting a different instruction or calculation.
- “The input bits stay the same; only their displayed reading changes.” explains why the active button changes the notation without changing the work.
- “Both starting inputs have clear sign bits, so their signed and unsigned decimal readings match.” is visible in either decimal view. This accounts for the two decimal views displaying the same supplied values without revealing the prediction answer. The note is absent in Hex.
- The instruction remains visually prominent, both decimal range cards remain visible and the prediction question is unchanged. The selector does not expose the result or flags before checking.
- Native pressed buttons have an accessible fieldset legend, visible selected treatment and focus. Enter and Space select the focused button. The two longer labels wrap within their own buttons at phone widths; Hex remains centred at the same height. The controls remain readable and do not dominate the instruction.

## Assumed knowledge

The change assumes hexadecimal notation, signed/unsigned readings, the sign bit and set/clear terminology. The earlier signed/unsigned lesson explicitly introduces hexadecimal and positive/negative contributions of the top bit, and defines a clear bit as zero. This lesson identifies the sign bit before section06 and defines set/clear in its opening reminder. No new unexplained term or syntax was introduced by the selector. Existing assembly and flag terms are taught in the lesson and prerequisites; this change adds no further assumptions.

## Browser checks

Actual light and dark body backgrounds were verified at 320, 375, 834 and 1280px. All three formats were exercised at every width and theme: 24 display states. The page did not overflow horizontally; every button was at least 44px high; text remained inside its button; no result inspection was mounted before checking. Viewed the captured phone-light and desktop-dark screenshots directly. Separate system-light and system-dark checks at 320px used DejaVu Sans for the selector labels and passed the same containment and target-size checks.

For each explicit theme, exercised draft selection, a checked prediction, open result inspection, the signed result view, all result bits and two revealed columns. Switching input views preserved the draft, feedback, existing inspection markup and stored work exactly. Reload returned to Hex while restoring the checked work and open inspection. Clear prediction removed the checked inspection and retained the chosen input format. No page errors occurred. The review script and raw geometry/state results are in `/workspace/scratch/input-reading-learner-review.mjs`, `/workspace/scratch/input-reading-learner-results.json` and `/workspace/scratch/input-reading-learner-extra.json`.

The first extra script run timed out because it selected a nonexistent option value `system`; the control uses a different underlying value. Selecting the visible label `System` corrected this test-driver mistake, and the rerun passed both emulated system preferences. The original script exit was 1; it was not a product failure.

This is an independent focused browser review, not a full-suite or public-deployment result. Screen reader speech and mobile hardware were not tested. No product edits were made by the reviewer.
