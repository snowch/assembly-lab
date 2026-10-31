// Copyright © 2026 Christopher Snow

// Separately drafted in docs/notes/twos-complement-appendix/draft.md.
// Canonical strings: docs/notes/twos-complement-appendix/prose.md.
export const SIGNED_WEIGHTS =
  "In the **unsigned reading**, each bit has a positive weight. Starting at the right, the weights are 1, 2, 4, 8 and so on. Each weight is twice the one to its right. The leftmost bit, bit 31, is the **top bit**. Its unsigned weight is 2147483648.\n\n" +
  "A set bit, 1, contributes its weight to the total. A clear bit, 0, contributes zero.\n\n" +
  "The **signed reading** changes only the top bit's weight, from +2147483648 to −2147483648. Every other bit keeps its positive weight. Add the contributions using these weights to get the signed reading.\n\n" +
  "This signed representation is called **two’s complement**. The top bit contributes a negative amount; it is not a separate minus sign for the other bits. When the top bit is clear, it contributes zero in both readings, so the readings agree.\n\n" +
  "For a smaller worked example, see [Appendix B: Two’s complement](#/lesson/twos-complement).";

export const COMPLEMENT_PROSE = {
  title: "Two’s complement",
  line: "Explore signed bit weights and fixed-width negation using four-bit patterns.",
  objectives: [
    "Read one bit pattern using unsigned and two’s complement weights.",
    "Explain why inverting the bits and adding one gives the opposite signed value when it fits.",
    "Recognise the limits imposed by a fixed number of bits.",
  ],
  reading: {
    title: "One pattern, two readings",
    before:
      "Two’s complement gives the top bit a negative weight. All the other weights stay positive. This lets the same bits represent either an unsigned number or a signed number.\n\n" +
      "The figures use four-bit patterns so you can see every contribution. These are small examples, not Arm register widths. A pattern's **width** is the number of bits it contains. Here the width stays at four bits.\n\n" +
      "Starting at the right, each unsigned weight doubles: 1, 2, 4, 8. The signed weights follow the same rule except that the top weight is −8. A set bit contributes its weight; a clear bit contributes zero.\n\n" +
      "The figure starts with `1010`. Its unsigned reading is `8 + 2 = 10`. Its signed reading is `−8 + 2 = −6`. The bits have not changed; only the top weight has changed.\n\n" +
      "Press any bit to set or clear it. Compare its contributions and the two sums. Press Reset to 1010 to restore the starting pattern.",
    caption: "Both sums use the same four bits. A clear bit contributes zero in either reading.",
    after:
      "Four bits give 16 patterns. The unsigned readings run from 0 to 15. The signed readings run from −8 to 7.\n\n" +
      "There is one pattern for zero, `0000`. The signed range contains one more negative value than positive value: zero occupies one of the patterns whose top bit is clear.",
  },
  negation: {
    title: "Invert the bits and add one",
    before:
      "Inverting every bit and adding one gives the opposite signed value when that value fits at the original width. **Invert** means change each 0 to 1 and each 1 to 0. Keep the result at the original width: here, keep only the low four bits, the four bits on the right.\n\n" +
      "This separate figure starts again with `1010`, whose signed reading is −6. Inverting gives `0101`. Adding one gives `0110`, whose signed reading is 6.\n\n" +
      "Change the original pattern to explore another value. Each calculation starts from those original bits. The figure computes the inversion, the addition and the low four bits together; it does not execute Arm instructions. Press Reset to 1010 to restore the starting pattern.",
    caption:
      "Invert the original bits, add one, then keep the low four bits. Compare the original and resulting signed readings.",
    after:
      "Inverting each bit exchanges its contribution with the part missing from `1111`. If the original pattern has unsigned value `x`, the inverted pattern has value `15 − x`. Adding one gives `15 − x + 1 = 16 − x`.\n\n" +
      "Keeping only four bits makes values separated by 16 use the same pattern. So `16 − x` has the same low four bits as `0 − x`. The resulting signed reading is the opposite of the original signed reading when that value fits in the signed range.\n\n" +
      "Try zero and the smallest signed value using the buttons beside the original pattern. The feedback explains the result for each.",
  },
  bridge: {
    title: "Back to 32 bits",
    prose:
      "The 32-bit register figure uses the same rule over more positions. Repeated doubling gives bit 31 the unsigned weight +2147483648. Its two’s complement weight is −2147483648. Every lower weight stays positive.\n\n" +
      "A 32-bit unsigned reading runs from 0 to 4294967295. A 32-bit signed reading runs from −2147483648 to 2147483647. The width changes the weights and limits; the way you add the contributions stays the same.\n\n" +
      "[Return to Module 1: Signed and unsigned readings](#/lesson/same-bits-two-readings) to use the 32-bit figure.\n\n" +
      "[Module 2: Subtraction flags and negation](#/lesson/subtraction-flags-and-negation) connects negation to instructions and examines what happens at the signed limit.\n\n" +
      "Representation reference: [C23 draft N3096, section 6.2.6.2](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf).",
  },
} as const;
