// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-8/prose.md.
export const PROSE = {
  question:
    "The trip computer converts sensor pulses into a distance by multiplying by a scale. **Where do the extra bits go when the product is wider than the destination register?**\n\nThe result of a multiplication is its **product**. Two 32-bit inputs can need more than 32 bits for their product. Choosing a destination width determines how much of that result survives.",
  questionNoteSummary: "The compiler and integer widths",
  questionNote:
    "These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. Here, `int` and `unsigned` are 32 bits; `long` and `unsigned long` are 64 bits.\n\nUnsigned C multiplication wraps to the result type's range. A signed multiplication whose result cannot be represented has undefined behaviour. C places no requirements on what the program does in that case. The hardware's low-bit result does not make that C operation defined.",
  motivation:
    "`mul w0, w0, w1` multiplies the inputs in `w0` and `w1`, then keeps the low 32 bits in `w0`. Any higher product bits are discarded. Writing `w0` also clears the upper half of `x0`.\n\nThe low product bits are the same whether you interpret the inputs as signed or unsigned. There is one `mul` for both. With `x` registers, `mul` keeps the low 64 bits instead. The destination width still limits the result.",
  prediction:
    "`scale_pulses` receives 2147483648 pulses and a scale of 2. Its multiplication writes `w0`.",
  predictionQuestion: "**What hexadecimal result does `w0` hold?**",
  predictionExplain:
    "It holds `0x00000000`. The full product is 4294967296, which needs a bit above the low 32. Those low 32 bits are all zero, so the 32-bit result wraps to zero.",
  investigation:
    "Step through the multiplication and inspect the destination bits. A wider mathematical product does not make the instruction widen its destination.\n\nA common calculation multiplies a new reading and adds it to a running total. `madd w0, w0, w1, w2` performs both operations: multiply the values in its second and third operands, then add the fourth. It keeps the low 32 bits of that result.\n\nGCC uses `madd` for `scaled_total`. Follow the inputs 7, 6 and 10 through the example: the scale applies to the pulses, and the existing total is added afterwards. `mul` and `madd` leave the condition flags unchanged.",
  construction:
    "Add a scaled pulse reading to an unsigned running total. The result follows the same 32-bit wrapping rule as earlier unsigned additions.",
  writeTask:
    "Write `scaled_total`. `w0` holds an unsigned pulse count, `w1` its unsigned scale, and `w2` the existing unsigned total. Return `total + pulses * scale` in `w0`, keeping the low 32 bits.",
  writeHints: [
    "Multiply the pulse count by its scale, then add the existing total.",
    "The total is in `w2`; it is not a third factor in the multiplication.",
    "With pulse count 0, scale 3 and existing total 7, the product is zero. The result must still include the total, so it is 7.",
    "Its operands are destination, first factor, second factor and value to add.",
    "Write `madd w0, w0, w1, w2`, then `ret`.",
  ],
  failureExperiment:
    "The changed program is meant to return a 64-bit product, but it still executes `mul w0, w0, w1`. Its inputs are 4294967295 and 2. We inspect the full `x0` register afterwards.",
  failureQuestion: "**What value does this program return in `x0`?**",
  failureExplain:
    "It returns `0x00000000fffffffe`, or 4294967294. The multiplication kept only the low 32 product bits. Its write to `w0` cleared the upper half of `x0`.\n\nThe full unsigned product is 8589934590. Reading the narrow result through `x0` cannot restore the discarded bits.",
  explanation:
    "`umull x0, w0, w1` multiplies two unsigned 32-bit values and writes their full 64-bit product. `smull` does the same for signed 32-bit values. The input interpretation matters because the result now includes the higher bits.\n\nThe C expression `(unsigned long)pulses * scale` converts an operand before multiplying. On this target, that makes the multiplication 64-bit unsigned. GCC uses `umull` for the recorded function. Converting the result of an already completed 32-bit multiplication would be too late.\n\nCompare the signed and unsigned examples. The 32-bit pattern with every bit set represents −1 when signed, and 4294967295 when unsigned. Multiplying each interpretation by 2 needs different 64-bit results.\n\n`msub` combines multiplication and subtraction. `msub w0, w1, w2, w0` subtracts the product of `w1` and `w2` from the old value in `w0`. The fourth operand supplies the value being reduced. Like the other multiplication instructions here, it leaves the flags unchanged.",
  generalisation:
    "A product of two 64-bit inputs can need 128 bits. Split that product into a **low half**, bits 0 to 63, and a **high half**, bits 64 to 127. `mul` supplies the low half. `umulh` supplies the high half for unsigned inputs; `smulh` supplies it for signed inputs.\n\nThe diagram uses the same input bits for both interpretations. Follow how the low half stays the same while the high half changes. The high half comes from the full multiplication; it is not found by sign-extending the low half.\n\nChoose the multiplication from both the input interpretation and the result width you need. A wide destination helps only if the instruction computes the needed bits.",
  finalTask:
    "Write `wide_product`. `w0` and `w1` hold unsigned 32-bit values. Return their full unsigned product in `x0`. The tests include products that do not fit in 32 bits.",
  finalHints: [
    "The answer needs up to 64 bits, even though each input has 32 bits.",
    "A multiplication that writes `w0` would discard the higher product bits.",
    "The small inputs 7 and 6 give 42. Both narrow and widening multiplication keep that result; larger products need the 64-bit destination.",
    "The destination must be `x0`; the input operands remain `w0` and `w1`.",
    "Write `umull x0, w0, w1`, then `ret`.",
  ],
  reflection:
    "- `mul` keeps the low product bits selected by its register width.\n- `madd` adds a fourth operand to a product; `msub` subtracts the product from that operand.\n- `umull` and `smull` preserve the full product of two 32-bit inputs.\n- `umulh` and `smulh` supply the high half of a 64-by-64-bit multiplication.\n\nWhy must a C cast appear before a multiplication when its purpose is to preserve a wider result?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "The operand types determine the width used for the multiplication. A conversion afterwards can widen only the result that remains; it cannot reconstruct bits already discarded.",
  modelVsReality:
    "The diagrams combine register values produced by the simulator. The product-halves example is course-written assembly, while the C listings identify recorded GCC output. These views show completed instruction results and do not compare execution speed.\n\nThe instruction results are not a substitute for C's rules about signed overflow.",
  originalityNote: {
    textbookExample: "Multiplying small constants that fit in every destination width.",
    howThisDiffers:
      "A pulse reading crosses the 32-bit boundary before becoming part of a trip total. The same input pattern is then multiplied under two interpretations, with computed high and low halves shown together.",
  },
} as const;
