# Module 8: Multiply and divide (lesson text)

Drafted in a separate Codex session from the checked facts, compiler records and simulator results. Sources are recorded in the module brief and listings. Independent review and validation are recorded separately.

This file contains learner-facing prose, hints and labels word for word. Passage headings are editorial markers.

# Lesson 1: Products and their widths

## 0. Objectives

- explain which product bits an instruction keeps;
- choose signed or unsigned widening multiplication;
- preserve a full product before using it in a calculation.

## 1. Where do the extra product bits go?

The trip computer converts sensor pulses into a distance by multiplying by a scale. **Where do the extra bits go when the product is wider than the destination register?**

The result of a multiplication is its **product**. Two 32-bit inputs can need more than 32 bits for their product. Choosing a destination width determines how much of that result survives.

*Closed note: The compiler and integer widths*

These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. Here, `int` and `unsigned` are 32 bits; `long` and `unsigned long` are 64 bits.

Unsigned C multiplication wraps to the result type's range. A signed multiplication whose result cannot be represented has undefined behaviour. C places no requirements on what the program does in that case. The hardware's low-bit result does not make that C operation defined.

*End of closed note.*

## 2. The destination limits the result

`mul w0, w0, w1` multiplies the inputs in `w0` and `w1`, then keeps the low 32 bits in `w0`. Any higher product bits are discarded. Writing `w0` also clears the upper half of `x0`.

The low product bits are the same whether you interpret the inputs as signed or unsigned. There is one `mul` for both. With `x` registers, `mul` keeps the low 64 bits instead. The destination width still limits the result.

## 3. Multiply across the 32-bit boundary

`scale_pulses` receives 2147483648 pulses and a scale of 2. Its multiplication writes `w0`.

**What hexadecimal result does `w0` hold?**

*After committing the prediction:*

It holds `0x00000000`. The full product is 4294967296, which needs a bit above the low 32. Those low 32 bits are all zero, so the 32-bit result wraps to zero.

## 4. Multiply, then add to a total

Step through the multiplication and inspect the destination bits. A wider mathematical product does not make the instruction widen its destination.

A common calculation multiplies a new reading and adds it to a running total. `madd w0, w0, w1, w2` performs both operations: multiply the values in its second and third operands, then add the fourth. It keeps the low 32 bits of that result.

GCC uses `madd` for `scaled_total`. Follow the inputs 7, 6 and 10 through the example: the scale applies to the pulses, and the existing total is added afterwards. `mul` and `madd` leave the condition flags unchanged.

## 5. Write a scaled addition

Add a scaled pulse reading to an unsigned running total. The result follows the same 32-bit wrapping rule as earlier unsigned additions.

### Write scaled_total

Write `scaled_total`. `w0` holds an unsigned pulse count, `w1` its unsigned scale, and `w2` the existing unsigned total. Return `total + pulses * scale` in `w0`, keeping the low 32 bits.

*Hints, in order:*

- Multiply the pulse count by its scale, then add the existing total.
- The total is in `w2`; it is not a third factor in the multiplication.
- With pulse count 0, scale 3 and existing total 7, the product is zero. The result must still include the total, so it is 7.
- The operands of `madd` are destination, first factor, second factor and value to add.
- Write `madd w0, w0, w1, w2`, then `ret`.

## 6. Widening after the bits are lost

The changed program is meant to return a 64-bit product, but it still executes `mul w0, w0, w1`. Its inputs are 4294967295 and 2. We inspect the full `x0` register afterwards.

**What value does this program return in `x0`?**

*After committing the prediction:*

It returns `0x00000000fffffffe`, or 4294967294. The multiplication kept only the low 32 product bits. Its write to `w0` cleared the upper half of `x0`.

The full unsigned product is 8589934590. Reading the narrow result through `x0` cannot restore the discarded bits.

## 7. Preserve the full product

`umull x0, w0, w1` multiplies two unsigned 32-bit values and writes their full 64-bit product. `smull` does the same for signed 32-bit values. The input interpretation matters because the result now includes the higher bits.

The C expression `(unsigned long)pulses * scale` converts an operand before multiplying. On this target, that makes the multiplication 64-bit unsigned. GCC uses `umull` for the recorded function. Converting the result of an already completed 32-bit multiplication would be too late.

Compare the signed and unsigned examples. The 32-bit pattern with every bit set represents −1 when signed, and 4294967295 when unsigned. Multiplying each interpretation by 2 needs different 64-bit results.

`msub` combines multiplication and subtraction. `msub w0, w1, w2, w0` subtracts the product of `w1` and `w2` from the old value in `w0`. The fourth operand supplies the value being reduced. Like the other multiplication instructions here, it leaves the flags unchanged.

## 8. Read both halves of a product

A product of two 64-bit inputs can need 128 bits. Split that product into a **low half**, bits 0 to 63, and a **high half**, bits 64 to 127. `mul` supplies the low half. `umulh` supplies the high half for unsigned inputs; `smulh` supplies it for signed inputs.

The diagram uses the same input bits for both interpretations. Follow how the low half stays the same while the high half changes. The high half comes from the full multiplication; it is not found by sign-extending the low half.

Choose the multiplication from both the input interpretation and the result width you need. A wide destination helps only if the instruction computes the needed bits.

## 9. Return a wide product

### Write wide_product

Write `wide_product`. `w0` and `w1` hold unsigned 32-bit values. Return their full unsigned product in `x0`. The tests include products that do not fit in 32 bits.

*Hints, in order:*

- The answer needs up to 64 bits, even though each input has 32 bits.
- A multiplication that writes `w0` would discard the higher product bits.
- The small inputs 7 and 6 give 42. Both narrow and widening multiplication keep that result; larger products need the 64-bit destination.
- The destination must be `x0`; the input operands remain `w0` and `w1`.
- Write `umull x0, w0, w1`, then `ret`.

## 10. What you now know

- `mul` keeps the low product bits selected by its register width.
- `madd` adds a fourth operand to a product; `msub` subtracts the product from that operand.
- `umull` and `smull` preserve the full product of two 32-bit inputs.
- `umulh` and `smulh` supply the high half of a 64-by-64-bit multiplication.

Why must a C cast appear before a multiplication when its purpose is to preserve a wider result?

*Closed note: Answer*

The operand types determine the width used for the multiplication. A conversion afterwards can widen only the result that remains; it cannot reconstruct bits already discarded.

*End of closed note.*

## Model and reality

The diagrams combine register values produced by the simulator. The product-halves example is course-written assembly, while the C listings identify recorded GCC output. These views show completed instruction results and do not compare execution speed.

The instruction results are not a substitute for C's rules about signed overflow.

## Figure captions and labels

scale_pulses in C and the instructions GCC made from it.

Predict the low 32 bits of the product.

Follow the product written to w0.

Inspect the multiply-and-add in scaled_total.

Write a scaled addition with unsigned wrapping.

Predict the full x0 register after a multiplication through w0.

Inspect the narrow result before interpreting x0.

Multiply unsigned 32-bit inputs into a 64-bit result.

Multiply signed 32-bit inputs into a 64-bit result.

Subtract a product from the fourth operand.

Step through the instructions that write the product halves.

Inspect the recorded multiplication used for division by ten.

Preserve the full unsigned product.

0x00000000

0xffffffff

0x80000000

0x00000001fffffffe

0x00000000fffffffe

0xfffffffffffffffe

Scale 7 pulses by 6 and add 10

Add a product that wraps

Add a zero product

Multiply across the 32-bit boundary

Wrap when adding the existing total

Keep a product above the 32-bit range

Multiply two maximum unsigned inputs

Keep the bit above the low 32

Multiply by zero

Keep a product that fits in 32 bits

## Originality record

Multiplying small constants that fit in every destination width.

A pulse reading crosses the 32-bit boundary before becoming part of a trip total. The same input pattern is then multiplied under two interpretations, with computed high and low halves shown together.


## LABELS.captions.completedHalves

Compare the completed high and low halves for the same input bits.

# Lesson 2: Division and remainders

## 0. Objectives

- distinguish signed and unsigned quotients;
- derive a remainder from the quotient and inputs;
- calculate an average without losing intermediate product bits.

## 1. What remains after division?

The trip computer divides a total by a count to calculate an average. Integer division can leave part of the total unused. **How do you obtain both the whole answer and what remains?**

The number being divided is the **dividend**. The number you divide it by is the **divisor**. The whole-number answer is the **quotient**; the amount left after subtracting the quotient times the divisor is the **remainder**. In C, `/` produces the quotient and `%` produces the remainder.

*Closed note: Defined C division*

These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. C draft N3096 defines integer division by discarding the fractional part, which rounds towards zero.

The divisor must be nonzero, and the quotient must be representable in its result type. Otherwise both `/` and `%` have undefined behaviour. The assembly experiments later on this page show what A64 instructions do in those cases; they do not give the C expressions defined results.

*End of closed note.*

## 2. Choose the interpretation before dividing

`sdiv w0, w0, w1` divides the signed value in `w0` by the signed value in `w1`. `udiv` interprets both inputs as unsigned. Both instructions write the quotient and leave the flags unchanged.

For a negative signed result, rounding towards zero discards the fraction without making the integer more negative. The remainder can therefore be negative. When C division is defined, the relation is `dividend = quotient * divisor + remainder`.

## 3. Divide a negative total

The signed dividend is −17 and the divisor is 5. The function uses `sdiv` and returns the quotient in `w0`.

**Which hexadecimal quotient does it return?**

*After committing the prediction:*

It returns `0xfffffffd`, which represents −3 as a signed 32-bit value. Dividing −17 by 5 gives −3 with a fraction left over; discarding that fraction rounds towards zero.

The remainder is −2, because `−17 = (−3 × 5) + (−2)`.

## 4. Recover the remainder

The recorded remainder function first uses `sdiv` to put the quotient in `w2`. It then uses `msub w0, w2, w1, w0` to subtract `quotient × divisor` from the original dividend.

Follow the registers and the division diagram. For the negative example, the drawing shows the size of the dividend, ignoring its sign. It divides that size into whole groups and a remaining part. The values below show the signed quotient and remainder.

A remainder from defined signed C division is zero or has the same sign as the dividend. Changing the divisor's sign changes the quotient's sign, but does not change that rule for the remainder.

## 5. Write a signed remainder

Compute a signed remainder from the quotient and the original inputs. Preserve the dividend until the subtraction uses it.

### Write remainder_signed

Write `remainder_signed`. `w0` holds a signed dividend and `w1` a signed divisor. Return the signed remainder in `w0`.

The divisor is nonzero. The tests exclude the unrepresentable quotient from dividing the minimum signed value by −1.

*Hints, in order:*

- Calculate the signed quotient first.
- Overwriting the dividend with the quotient loses an input needed for the final subtraction.
- For 17 divided by 5, the quotient is 3. Subtract `3 × 5` from 17 to get the remainder, 2.
- Subtract the quotient times the divisor from the dividend. `msub` can do both operations.
- Write `sdiv w2, w0, w1`, then `msub w0, w2, w1, w0`, then `ret`.

## 6. Using unsigned division for signed inputs

The changed remainder function uses `udiv` instead of `sdiv`. The input bits still represent −17 in `w0` and 5 in `w1` when read as signed values. The multiply-and-subtract is unchanged.

**What result does the changed function return in `w0`?**

*After committing the prediction:*

It returns `0x00000004`, or 4. `udiv` interprets the dividend bits as the unsigned value 4294967279. The unsigned quotient is 858993455, leaving a remainder of 4.

The later subtraction cannot correct the choice made at the division. The same bits need `sdiv` for the intended signed calculation.

## 7. Separate C rules from instruction results

A64 gives its division instructions results even in cases where C division is undefined. With a zero divisor, `sdiv` and `udiv` write a zero quotient. For the minimum signed value divided by −1, `sdiv` returns that minimum value's bit pattern. These instructions do not signal those cases through the condition flags.

Inspect the two assembly-only experiments. Their hardware results are observable, but a C compiler is not required to preserve the behaviour of an undefined C expression. Check a divisor or an overflow case before performing the C operation.

## 8. Division by a constant

GCC can also replace division by a constant with other arithmetic. For unsigned division by ten, this recorded GCC version uses multiplication by `0xcccccccd` and a right shift by 35. It uses the full widened product, so the relevant higher bits survive. The example returns the same quotient as division; the instruction sequence is this compiler's choice, not a timing claim.

## 9. Calculate fuel consumption

### Write consumption

An average can overflow before its division, even if the final quotient fits. Choose a wide enough product first, then divide. A wide result type alone does not widen an earlier narrow multiplication.

The final calculation uses fuel in millilitres and distance in metres. Multiplying the fuel by 100 before dividing by distance gives whole millilitres per 100 metres. Both inputs are unsigned 32-bit values, and their scaled product fits in 64 bits.

The exercise defines a zero-distance result as zero. That is a rule of this function. A branch can handle that case before division. In assembly, a correctly widened `udiv` also produces the required zero directly.

The input contract guarantees only the distance in the low 32 bits, `w1`. It makes no promise about the incoming upper half of `x1`. Naming `w1` as the input does not mean an instruction has written it. Before dividing with `x` registers, clear that upper half: a write to `w1`, even one that copies `w1` to itself, does this.

Write `consumption`. `w0` holds unsigned fuel in millilitres and `w1` holds unsigned distance in metres. Return whole millilitres per 100 metres in `x0`: `fuel * 100 / distance`, rounded down. Preserve the full product before dividing.

If the distance is zero, return zero. The tests include fuel values whose product with 100 does not fit in 32 bits.

*Hints, in order:*

- Handle zero distance before the calculation.
- Multiplying in a 32-bit destination loses any higher product bits before division.
- With fuel 1 and distance 3, first calculate `1 × 100`. Whole-number division by 3 gives 33. Multiplication must come before division.
- Divide the 64-bit product by the zero-extended distance using `udiv` with `x` registers.
- One complete approach is: `cbz w1, zero`; `mov w2, #100`; `umull x0, w0, w2`; `mov w1, w1`; `udiv x0, x0, x1`; `ret`. Under `zero:`, write `mov x0, #0` and `ret`.

## 10. What you now know

- Signed integer division rounds towards zero.
- Compute a remainder as dividend minus quotient times divisor.
- Choose `sdiv` or `udiv` from the inputs' interpretation.
- A64 division results do not define otherwise undefined C expressions.
- Widen a product before dividing when its higher bits are needed.

Why can an average be wrong even when its final value would fit in the return register?

*Closed note: Answer*

An intermediate multiplication can discard bits before the division runs. Dividing the truncated product gives a different quotient. Preserve the full intermediate product before dividing it.

*End of closed note.*

## Model and reality

The division and product diagrams use simulator results. Exceptional division examples are assembly-only experiments checked against A64 behaviour. They do not model a C compiler's freedom when a source expression has undefined behaviour.

The recorded division-by-ten sequence is tied to one GCC version and optimisation setting. The course does not model the time instructions take or claim that one sequence is faster.

## Figure captions and labels

quotient_signed in C and the instructions GCC made from it.

Predict a signed quotient from a negative dividend.

Follow the signed division.

Compute the remainder from the quotient and original dividend.

Write and test a signed remainder function.

Predict the result after choosing unsigned division.

Inspect the quotient and remainder produced by the changed instruction.

Inspect a signed widening product.

Inspect an unsigned widening product.

Compare the product halves.

Subtract quotient times divisor from the dividend.

Follow GCC’s recorded division-by-ten sequence.

Run division by zero as an assembly experiment.

Run the unrepresentable signed quotient as an assembly experiment.

Inspect division with unsigned inputs.

See whole groups and the remainder, with their signed values.

Calculate consumption with a full-width intermediate product.

0xfffffffc

0xfffffffd

0x00000003

0x00000004

0xfffffffe

0x00000002

Divide a negative dividend by a positive divisor

Divide positive inputs

Divide by a negative divisor

Divide two negative inputs

Divide zero

Divide the maximum signed value

Divide the minimum signed value

Calculate from 600 millilitres over 1000 metres

Preserve a product above 32 bits

Return a result above 32 bits

Handle zero fuel

Handle zero distance

Discard a fractional result

Use maximum unsigned inputs

## Originality record

Quotient and remainder from positive small integers.

A negative adjustment exposes rounding towards zero and the sign of the remainder. A fuel-per-distance calculation then requires a wide intermediate product and an explicit rule for zero distance.

# Figure interface

## unsignedProduct

Product with unsigned inputs

## signedProduct

Product with signed inputs

## highHalf

High half: bits 64 to 127

## lowHalf

Low half: bits 0 to 63

## inputs

Input bit patterns

## diagram

The two halves of each product

## divisionDiagram

The dividend divided into whole groups and a remainder

## dividend

Dividend

## quotient

Quotient

## remainder

Remainder

## groupedPart

Whole groups

## completed

Completed products. This diagram shows the end of the run; Next and Reset in the stepper above do not change it.
