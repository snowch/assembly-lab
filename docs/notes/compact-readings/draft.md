# Compact readings draft

Drafted from [the checked brief](brief.md), `packages/views/src/readings.ts`, the current teaching reader and the shared unsigned-weight explanation. Learner-facing text follows `docs/style.md` and `docs/visual-language.md`. Headings below identify string groups for the author; they are not extra headings for the lesson.

## Before the figure

Each bit has a **weight**. Bit 0, on the right, has weight 1. Each position to the left doubles the weight. The leftmost bit, bit 31, is the **top bit**.

A set bit contributes its weight. A clear bit contributes zero. Add the contributions to get the unsigned reading.

The figure starts with only bit 0 set. Press a bit to set or clear it and inspect its weight.

Caption: “A separate 32-bit example, initially with only bit 0 set.”

## Reading controls and guidance

Group label: “Reading”

Controls: “Unsigned”, “Signed”, “Compare”

Unsigned:

> All weights are positive. Choose **Bit 31 only** to inspect the top bit on its own.

Signed:

> The signed reading gives bit 31 a negative weight. Every other weight stays positive. This representation is called **two’s complement**. Changing the reading keeps the same bits.

Compare:

> Both readings use the same bits. Only the top bit’s weight differs. A clear top bit contributes zero in both readings.

Appendix link, beside Signed and Compare only: “Explore two’s complement with four bits”

Link destination: `#/lesson/twos-complement` (confirmed from the appendix lesson ID).

## Pattern controls

- “Bit 0 only”
- “Bit 31 only”
- “Clear bits”
- “Reset”

Compact control guidance: “Reset restores Unsigned with only bit 0 set.”

Author notes: both named presets must set exactly the named bit and clear every other bit. **Bit 31 only** opens Unsigned, so the learner first sees its positive weight. Clear bits preserves the current reading. Reset restores the starting reading, pattern and selected bit. Reading controls alone never alter the bits. These are freely available controls, not steps to complete.

## Selected-bit display

Title template: “Bit {bit}”

Labels in a single reading:

- “Value”
- “Weight”
- “Contribution”

Labels in Compare:

- “Value”
- “Unsigned weight”
- “Unsigned contribution”
- “Signed weight”
- “Signed contribution”

Selected-bit explanation, derived from the current bit:

- Set: “This bit is set, so it contributes its weight.”
- Clear: “This bit is clear, so it contributes zero. Its weight stays the same.”

Accessible bit-control name template: “Bit {bit}, {set or clear}. Press to {clear or set}.”

Author notes: show the selected bit number and its current value visibly. Compute both weight and contribution from `bitWeightsOfPattern`; do not use the contribution as the weight. Changing the reading updates this display without toggling the bit. Keep all 32 bit numbers visible in the compact grid.

## Main calculation

Reading labels: “Unsigned”, “Signed”

Calculation labels:

- “Top bit contributes”
- “Other bits contribute”
- “Total”

Render each reading as top-bit contribution + other-bit contribution = total. Unsigned and Signed each show one calculation; Compare shows both. Use grouped decimal values from the model. Keep the selected-bit display separate from this whole-pattern calculation.

Optional disclosure: “Full sum”

The disclosure follows the current reading. Compare shows both labelled sums.

## Focused prediction

Visible entry control: “Predict a bit change”

Question title: “Setting bit 0”

Starting-state label: “Starting bits”

Prompt:

> Start with only bit 31 set. Bit 0 is clear. If you set bit 0 and leave every other bit unchanged, which reading changes?

Choices:

- “Only the unsigned reading”
- “Only the signed reading”
- “Both readings”

Before-answer status: “Choose an answer to see the result.”

Cancellation control: “Return to exploring”

Author notes: entering this named prediction sets its own fixed starting pattern; it does not inherit arbitrary explorer bits. Keep the starting bit grid visible and labelled. Hold its bits fixed while the choice is pending. Hide the after-pattern calculations, after-pattern selected-bit contribution and all feedback until a choice. Do not offer an answer-revealing hint. Keep this entry visible from the start; it is not unlocked by prior actions. Teach the general weight rule beforehand, but do not show this specific after-state in an adjoining explorer.

After a correct choice:

> Correct. Both readings change. Setting bit 0 adds its weight to each total. The top bit stays set, so its contribution stays the same.

After either incorrect choice:

> Both readings change. Bit 0 has the same positive weight in both readings. Setting it adds that weight to each total. The negative weight belongs only to bit 31 in the signed reading.

Result labels: “Before”, “After setting bit 0”, “Unsigned”, “Signed”

Return control: “Explore the result”

Author notes: derive the answer, before/after totals and each choice’s correctness from the model. Show the model’s before and after calculations only after commitment. **Explore the result** leaves the prediction with the computed after-pattern and Compare selected. Reset returns to the unsigned bit-0-only starting example. Preserve or reset pending/revealed state coherently during update handoff.

## Editorial checks

Sentence pass: short direct sentences, learner addressed as “you”, no em dashes, no added jargon, no duplicated large decimal values in prose.

Idea pass: the first explanation uses unsigned weights only. The visible bit grid supplies the example. Signed introduces the negative top weight locally; Compare explains the two readings locally. Weight and contribution remain distinct for clear bits. The prediction identifies its fixed input and change without displaying its answer before commitment.

## Related lesson wording

Replacement third hint for **Make −3**:

> A pattern with all 32 bits set reads as −1 signed. Clearing a lower bit subtracts its weight from that reading.

This states the checked all-ones fact without referring to the figure’s starting example.

Retain the local C connection by adding this sentence to Signed guidance:

> Here, C’s `int` uses this signed reading.

## Guidance after selecting the top bit

Keep the initial Unsigned guidance unchanged. When bit 31 is selected in Unsigned, add:

> Choose **Signed** to read these same bits another way.

Show this direction whether the learner selected bit 31 with its bit control or used **Bit 31 only**. It changes neither the pattern nor the reading and does not introduce the signed mechanism early.

At the end of Signed guidance, add:

> Choose **Compare** to see both readings together.

## Prediction entry guidance

Place the always-visible prediction entry below the explorer. Beside it, add:

> Explore **Signed** and **Compare** before trying this prediction.

Keep the entry available from the start. This guidance suggests an order without requiring completion or displaying the prediction’s answer.
