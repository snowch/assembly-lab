# Reading explanations in sequence: draft

Drafted from [the checked brief](brief.md), `CLAUDE.md` and `docs/style.md`. The strings below are proposed learner copy. Placement notes are for implementation only.

## Lesson introduction

Replace `COPY.readings.intro`:

> The **unsigned reading** adds the positive amounts represented by the bits. The simulator shows register numbers in unsigned decimal. Use the figure to follow how the bits contribute to that number.

## Before the figure

Replace `COPY.readings.investigation` with these paragraphs. Keep them outside the view-dependent explanation:

> Each bit has a **weight**. Bit 0, on the right, has weight 1. Each position to the left doubles the weight. The leftmost bit, bit 31, is the **top bit**. Its unsigned weight is +2,147,483,648.
>
> A bit with value 1 contributes its weight. A bit with value 0 contributes zero. Add those contributions to get the unsigned reading.
>
> The figure starts with a separate example: `0xffffffff`, with all 32 bits set.

## Unsigned view

Show only while Unsigned is selected, beside the figure. Do not repeat the introduction or weights paragraphs:

> Change a bit and follow its contribution to the unsigned total. Then select Signed.

## Signed view

Show only while Signed is selected, beside the figure:

> The **signed reading** gives the top bit weight −2,147,483,648. Every other weight stays positive. Add the contributions using these weights to get the signed reading.
>
> This representation is called **two’s complement**. The top bit contributes a negative amount; it is not a separate minus sign. C’s `int` uses this signed reading here.
>
> Selecting a reading leaves the bits unchanged. Change a bit and follow the signed total. Then select Compare.
>
> For a smaller worked example, see [Appendix B: Two’s complement](#/lesson/twos-complement).

## Compare view

Show only while Compare is selected, beside the figure:

> Both columns read the same bits. The top bit’s weight is +2,147,483,648 in Unsigned and −2,147,483,648 in Signed. All the other weights agree.
>
> Change the top bit and compare its contribution to each total. When the top bit is 0, it contributes zero to both totals, so the readings agree.
>
> For a smaller worked example, see [Appendix B: Two’s complement](#/lesson/twos-complement).

## Shared bit instruction

Keep `READER_STRINGS.instruction`:

> Press a bit to change its value. A 1 contributes its weight; a 0 contributes zero.

All three view buttons remain visible and usable. The view changes only the explanation, the displayed weights, the totals and the full calculation. It never requires an activity before switching.
