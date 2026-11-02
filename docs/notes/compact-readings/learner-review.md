# Compact readings: independent learner review

Reviewed 2 November 2026 by a separate reviewer agent using the session's inherited model and effort, with no model override. The reviewer did not draft or edit the product and formed the assessment before reading author or implementation notes.

## Scope and preparation

Read `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and `docs/visual-language.md`. Read the front page's “Before you start” prerequisites and the earlier Fundamentals material, including constants, functions, returning to the caller, sequences and the synthesis activity. Read the preceding “Reading hexadecimal” material. Source reading supplied prerequisites; findings below are about the actual built page.

Reviewed `http://localhost:4185/assembly-lab/#/lesson/same-bits-two-readings` in Chromium through the repository's local Playwright module. The preview belongs to the managing session and was neither started nor stopped by this reviewer. No build, product edit or commit was made.

The first pass covered 320, 375, 390 and 1280 CSS-pixel widths in light and dark themes. Verified the rendered `data-theme` and body backgrounds: light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. Screenshots are under `/tmp/learner-compact-*`, including initial, comparison, pending and revealed states. They are review evidence and may contain revealed activity results; this note does not reproduce exercise answers.

## Findings from the first built preview

### M1: the route to the signed definition needs an onward instruction

**Severity: medium.** The default explanation says “All weights are positive. Choose Bit 31 only to inspect the top bit on its own.” The next main-page activity is “Bits that read as −3”. The essential definition, “The signed reading gives bit 31 a negative weight. Every other weight stays positive”, appears only after selecting Signed. There is no direction from the unsigned top-bit example into Signed and then Compare. In addition, the initial Unsigned view offers “Start prediction”, whose question already uses both readings.

The modes are visible and named, so this is not an undiscoverable activity. The problem is the missing teaching route: a learner following the explicit directions can arrive at a prediction or construction task before meeting the signed rule. Add brief onward guidance at the relevant stages and place prediction after that preparation. No forced unlock is needed.

The managing session accepted this finding. **Verified fixed in the final build:** the unsigned top-bit stage says “Choose Signed to read these same bits another way”; Signed says “Choose Compare to see both readings together”. The prediction entry now follows the inspector, totals and reset explanation, with “Explore Signed and Compare before trying this prediction.” All three modes remain visible and directly available. Checked in fresh browser contexts at all four widths and both themes.

### M2: the top-bit preset changes the reading unexpectedly

**Severity: medium.** After selecting Signed or Compare, pressing “Bit 31 only” returns the figure to Unsigned. The preset's label names a bit pattern, so this additional effect interrupts a learner trying the simplest top-bit example in the selected reading. In contrast, “Bit 0 only” and “Clear bits” preserve Signed; these were checked separately and are not findings.

Preserve the chosen reading when applying the bit preset. “Reset” can continue to restore Unsigned, as the visible reset explanation promises.

The managing session accepted this finding. **Verified fixed in the final build:** after choosing Compare, “Bit 31 only” keeps Compare selected and shows both readings. Checked at all four widths and both themes. Reset separately restores Unsigned, as promised.

## Learning sequence and cognitive load

The compact diagram makes every bit's number visible, including individual intervening numbers. Selecting one bit puts its weight and contribution in one inspector. This removes the need to scan a long list of per-bit rows. The total separates the top-bit contribution from the other bits, so the learner does not need to retain thirty-two individual contributions mentally. “Full sum” is available as optional detail.

Unsigned weights are defined before the figure. The initial single-set-bit example demonstrates a complete unsigned reading. The top-bit-only preset is a useful small bridge because it isolates the position whose signed weight differs. The Signed explanation defines the new rule and demonstrates it on the same visible bits; Compare then makes the change of interpretation visible without changing the pattern. The prediction practises a change to one lower bit, followed by construction and fresh-pattern reading exercises. M1 concerns the route through these stages, rather than a missing mechanism inside them.

A four-bit complete candidate would reduce the number of zero cells and the size of the arithmetic. It is unnecessary as a required bridge here: the one-bit and top-bit-only presets already isolate the two relevant mechanisms within the actual 32-bit register width. The visible optional four-bit link remains useful for learners who want a smaller experiment.

## Interaction checks

On the first preview, pending prediction showed its fixed starting bits and choices, with no inspector, totals, full sum or resulting readings. The bit buttons were actually disabled through their containing state. Choosing an answer revealed feedback and a before/after comparison. “Explore the result” returned to an editable result pattern. “Return to exploring”, Reset and switching the reading each exited prediction without leaving stale feedback or result panels. Starting prediction again cleared the previous choice and reveal. Reset restored Unsigned with only bit 0 set and the bit-0 inspector.

Cancelling a pending prediction returned to exploration of the prediction's starting pattern; it did not restore a separate pre-prediction custom pattern. The control promises “Return to exploring”, so this was recorded as observed behaviour rather than an unsupported restoration defect.

Buttons and choices were reachable by normal browser interaction at phone widths. The initial first-preview measurement found a one-pixel document-width difference at 320 in exploration; the managing session was already correcting the measured narrow-layout issue. **Verified resolved in the final build:** document scroll width equals viewport width at 320, 375, 390 and 1280 in exploration and revealed prediction, in both actual themes. Comparison row labels stack above the two reading cells on phones. The numeric cells render at 14px on phones and 15px on desktop. Visual inspection confirmed readable individual bit numbers, visible top-bit identification, complete numbers and labels, and reachable controls. Final screenshots are `/tmp/learner-compact-verified-*`.

## Assumed knowledge

No unexplained prerequisite beyond the stated preparation was identified. Binary place values and ordinary arithmetic are explicit entry prerequisites; register names, widths and simulator interaction come from Fundamentals; hexadecimal and setting or clearing bits come from the preceding lesson. The page defines weight and the top bit before use. Signed reading and two's complement are explained locally inside Signed, subject to M1's route concern.

## Final verification and limits

Both accepted findings are closed by independent built-page verification. The final browser pass repeated Signed and Compare, preserved-mode top-bit presets, pending prediction and revealed feedback at all four widths in both actual themes. It rechecked Reset at every width/theme and cancellation and a pending mode switch at 320 dark. Earlier checks also covered “Explore the result”, repeat prediction and the distinct behaviour of the other bit presets. No further learner finding remains open.

This is a learner review, not an Arm/C semantic audit or a full automated-suite result. No full suite was run by this reviewer. Prerequisites were read in source; the changed lesson and its interaction states were checked in the actual built site.
