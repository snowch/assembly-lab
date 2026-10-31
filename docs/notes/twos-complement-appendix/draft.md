# Learner-string draft

Draft from `brief.md`, against `docs/style.md`, `docs/authoring.md` and
`docs/visual-language.md`. Only quoted prose and the labelled strings below
are learner-facing. Parent session checks all numbers against the model before
implementation. Preserve existing prediction and Make −1 gates.

## Module 1: Reading the bits

Replace only the central unsigned/signed-weight explanation in
`READ.investigation` and `COPY.readings.investigation` with the following
block. Preserve `READ.investigation`'s hexadecimal introduction and final
two set/clear paragraphs: the pacing definitions reuse them structurally.
The live paced flow defines set and clear in its preceding hexadecimal lesson.
The central block also identifies their values for the original grouped source.

> In the **unsigned reading**, each bit has a positive weight. Starting at the right, the weights are 1, 2, 4, 8 and so on. Each weight is twice the one to its right. The leftmost bit, bit 31, is the **top bit**. Its unsigned weight is 2147483648.
>
> A set bit, 1, contributes its weight to the total. A clear bit, 0, contributes zero.
>
> The **signed reading** changes only the top bit's weight, from +2147483648 to −2147483648. Every other bit keeps its positive weight. Add the contributions using these weights to get the signed reading.
>
> This signed representation is called **two’s complement**. The top bit contributes a negative amount; it is not a separate minus sign for the other bits. When the top bit is clear, it contributes zero in both readings, so the readings agree.
>
> For a smaller worked example, see [Appendix B: Two’s complement](#/lesson/twos-complement).

Keep the local figure setup after that explanation and link. For the original
grouped source lesson, use:

> The figure starts with `0xfffffff4`, the pattern `sub` left in `w0`. It shows the top bit's contribution and the other 31 bits' total in each reading. Open “Show calculation” to see the full sums.

For the live standalone “Signed and unsigned readings” lesson, use:

> The figure starts with `0xfffffff4`, the initial pattern in `w0`. It shows the top bit's contribution and the other 31 bits' total in each reading. Open “Show calculation” to see the full sums.

Do not refer to a preceding subtraction in the standalone lesson. Keep the
original grouped source's final two set/clear paragraphs after its local
figure setup, without adding another four-bit activity.

Reader caption:

> One 32-bit pattern, read two ways. Only the top bit's weight differs.

## Appendix B metadata

- Lesson title: `Two’s complement`
- Module label: `B`
- Module title: `Two’s complement`
- Module description: `Optional: signed bit weights and fixed-width negation, using four-bit patterns.`
- Objectives:
  - `read one bit pattern using unsigned and two’s complement weights;`
  - `explain why inverting the bits and adding one gives the opposite signed value when it fits;`
  - `recognise the limits imposed by a fixed number of bits.`
- Originality note: `Uses one editable four-bit pattern to compare positional contributions, then a separate calculation from the same starting pattern. The small example supports the course's existing 32-bit register reading without introducing another processor width.`

## Appendix section 1: One pattern, two readings

> Two’s complement gives the top bit a negative weight. All the other weights stay positive. This lets the same bits represent either an unsigned number or a signed number.
>
> The figures use four-bit patterns so you can see every contribution. These are small examples, not Arm register widths. A pattern's **width** is the number of bits it contains. Here the width stays at four bits.
>
> Starting at the right, each unsigned weight doubles: 1, 2, 4, 8. The signed weights follow the same rule except that the top weight is −8. A set bit contributes its weight; a clear bit contributes zero.
>
> The figure starts with `1010`. Its unsigned reading is `8 + 2 = 10`. Its signed reading is `−8 + 2 = −6`. The bits have not changed; only the top weight has changed.
>
> Press any bit to set or clear it. Compare its contributions and the two sums. Press “Reset to 1010” to restore the starting pattern.

Figure title: `Four bits, two readings`

Caption:

> Both sums use the same four bits. A clear bit contributes zero in either reading.

After the figure:

> Four bits give 16 patterns. The unsigned readings run from 0 to 15. The signed readings run from −8 to 7.
>
> There is one pattern for zero, `0000`. The signed range contains one more negative value than positive value: zero occupies one of the patterns whose top bit is clear.

## Appendix section 2: Invert the bits and add one

> Inverting every bit and adding one gives the opposite signed value when that value fits at the original width. **Invert** means change each 0 to 1 and each 1 to 0. Keep the result at the original width: here, keep only the low four bits, the four bits on the right.
>
> This separate figure starts again with `1010`, whose signed reading is −6. Inverting gives `0101`. Adding one gives `0110`, whose signed reading is 6.
>
> Change the original pattern to explore another value. Each calculation starts from those original bits. The figure computes the inversion, the addition and the low four bits together; it does not execute Arm instructions. Press “Reset to 1010” to restore the starting pattern.

Figure title: `Negating a four-bit pattern`

Caption:

> Invert the original bits, add one, then keep the low four bits. Compare the original and resulting signed readings.

After the figure:

> Inverting each bit exchanges its contribution with the part missing from `1111`. If the original pattern has unsigned value `x`, the inverted pattern has value `15 − x`. Adding one gives `15 − x + 1 = 16 − x`.
>
> Keeping only four bits makes values separated by 16 use the same pattern. So `16 − x` has the same low four bits as `0 − x`. The resulting signed reading is the opposite of the original signed reading when that value fits in the signed range.
>
> Try zero and the smallest signed value using the buttons beside the original pattern. The feedback explains the result for each.

Conditional feedback, shown only for the selected original pattern:

- Original `0000`: `Zero stays zero. Inverting gives 1111; adding one gives 10000. Keeping the low four bits gives 0000. There is no separate negative-zero pattern.`
- Original `1000`: `The opposite of −8 is 8, which is outside the four-bit signed range, −8 to 7. Inverting and adding one leaves 1000, still read as −8. The required signed result does not fit.`
- Other originals: `The opposite signed value fits in four bits.`
- When addition has an extra left bit: `The addition needs an extra left bit. The four-bit result keeps only the low four bits.`

## Appendix section 3: Back to 32 bits

> The 32-bit register figure uses the same rule over more positions. Repeated doubling gives bit 31 the unsigned weight +2147483648. Its two’s complement weight is −2147483648. Every lower weight stays positive.
>
> A 32-bit unsigned reading runs from 0 to 4294967295. A 32-bit signed reading runs from −2147483648 to 2147483647. The width changes the weights and limits; the way you add the contributions stays the same.
>
> [Return to Module 1: Signed and unsigned readings](#/lesson/same-bits-two-readings) to use the 32-bit figure.
>
> [Module 2: Subtraction flags and negation](#/lesson/subtraction-flags-and-negation) connects negation to instructions and examines what happens at the signed limit.

## Figure strings

Use dynamic values from the model, including bit indices and all sums. The
following strings are labels rather than substitutes for the bit diagrams.

| Purpose | String |
| --- | --- |
| Pattern group | `Four-bit pattern` |
| Index row | `Bit index` |
| Bit accessible name | `Bit {index}, {set/clear}; press to {clear/set}` |
| Unsigned weight row | `Unsigned weight` |
| Signed weight row | `Signed weight` |
| Unsigned contribution row | `Unsigned contribution` |
| Signed contribution row | `Signed contribution` |
| Unsigned sum | `Unsigned sum` |
| Signed sum | `Signed sum` |
| Original pattern | `Original bits` |
| Inverted pattern | `Inverted bits` |
| Addition row | `Add one` |
| Full addition result | `Full sum` |
| Retained result | `Low four bits` |
| Original signed value | `Original signed reading` |
| Result signed value | `Result signed reading` |
| Extra-bit marker | `Beyond four bits` |
| Out-of-range status | `Signed result out of range` |
| Zero preset | `Try zero` |
| Minimum preset | `Try −8` |
| Reset | `Reset to 1010` |

Keep the two figures' original patterns independent. The second figure's
initial state must remain `1010` even after edits to the first. No separate
quiz, completion question or answer disclosure is proposed.
