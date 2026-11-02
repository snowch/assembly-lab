# Bit weight readings draft

Separately drafted from the managing session’s checked-fact brief. This draft follows
`CLAUDE.md` and `docs/style.md`; it is proposed learner copy, not a record of completed
browser or independent review. Representation source: C23 draft N3096 §6.2.6.2;
computed values must remain pinned to the readings model.

## Main introduction

The **unsigned reading** adds the positive amounts represented by the bits. The **signed reading** allows negative numbers and is the reading C’s `int` uses here. The simulator shows register numbers in unsigned decimal.

Changing the reading does not change the bits.

## Shared SIGNED_WEIGHTS

Each bit has a **weight**. In the unsigned reading, bit 0, on the right, has weight 1. Each position to the left doubles the weight. The leftmost bit, bit 31, is the **top bit**. Its unsigned weight is +2147483648.

A bit with value 1 contributes its weight. A bit with value 0 contributes zero. Add those contributions to get the unsigned reading.

The signed reading changes only the top bit’s weight to −2147483648. Every other weight stays positive. Add the contributions using these weights to get the signed reading.

This signed representation is called **two’s complement**. The top bit contributes a negative amount; it is not a separate minus sign. When that bit is 0, the two readings agree.

For a smaller worked example, see [Appendix B: Two’s complement](#/lesson/twos-complement).

## Figure setup and caption

The figure starts with a separate example: `0xffffffff`, with all 32 bits set. Start with Unsigned, then select Signed to see the top weight change. Select Compare to see both readings together.

Caption: A separate 32-bit example, initially all ones. Each 1 contributes its weight; each 0 contributes zero.

Preserve the existing first two hexadecimal paragraphs, the compact-hexadecimal paragraph,
and the final two paragraphs defining set/clear and inviting edits. Replace only the old
reader setup paragraph. There is no earlier-program preset in this figure.

## Fresh construction challenge

Section title: Bits that read as −3

Challenge title: Make −3

Task: Set `w0`’s bits so that its signed reading is −3, then give the unsigned reading of the same bits.

Keep the existing construction introduction and scratch-register instructions.

Hints, revealed in this order:

1. Add the contributions of the set bits. Only the top bit has a negative weight in the signed reading.
2. Setting the top bit does not turn the other bits into a negative number. Their weights stay positive.
3. The all-ones example reads as −1 signed. Clearing a lower bit removes its positive contribution.
4. To go from −1 to −3, remove a contribution of 2. Find the bit with weight 2.
5. Set every bit except bit 1: `0xfffffffd`. Its unsigned reading is 4294967293.

Solved explanation, behind the existing gate:

`0xfffffffd` has every bit set except bit 1. The top bit contributes −2147483648; the other set bits add to 2147483645. Their sum is −3. The unsigned reading is 4294967293.

Implementation facts: the target bits are `11111111111111111111111111111101`;
the initial all-ones worked example is independent of the earlier `w0` run. It has
unsigned reading 4294967295 and signed reading −1. Its lower 31 weights sum to
2147483647.

## Figure strings

| Purpose | Copy |
| --- | --- |
| View group accessible name | Reading |
| Views | Unsigned; Signed; Compare |
| Rows | Bit; Value; Weight |
| Compare weight rows | Unsigned weight; Signed weight |
| Instruction | Press a bit to change its value. A 1 contributes its weight; a 0 contributes zero. |
| Main reset | Reset to all ones |
| Scroll cue | Scroll to see the bit weights |
| Omitted span accessible text | Bits 29 to 4 omitted |
| Compact diagram accessible name | Selected bit positions and their weights |
| Compact diagram caption, if needed | Selected bit positions, with each value above its weight. |

All three view controls remain visible. Unsigned is selected initially. The main reset
restores all ones and Unsigned. Display indices 31, 30, …, 3, 2, 1, 0; align index,
value and weight in separate cells. Use commas in displayed weights. Keep the
existing top-bit and lower-bits arithmetic, with no separate omitted-bit subtotal.
