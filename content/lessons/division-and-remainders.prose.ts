// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-8/prose.md.
export const PROSE = {
  question:
    "The trip computer divides a total by a count to calculate an average. Integer division can leave part of the total unused. **How do you obtain both the whole answer and what remains?**\n\nThe number being divided is the **dividend**. The number you divide it by is the **divisor**. The whole-number answer is the **quotient**; the amount left after subtracting the quotient times the divisor is the **remainder**. In C, `/` produces the quotient and `%` produces the remainder.",
  questionNoteSummary: "Defined C division",
  questionNote:
    "These listings use GCC 16.1 with `-O1` for little-endian AArch64 Linux. C draft N3096 defines integer division by discarding the fractional part, which rounds towards zero.\n\nThe divisor must be nonzero, and the quotient must be representable in its result type. Otherwise both `/` and `%` have undefined behaviour. The assembly experiments later on this page show what A64 instructions do in those cases; they do not give the C expressions defined results.",
  motivation:
    "`sdiv w0, w0, w1` divides the signed value in `w0` by the signed value in `w1`. `udiv` interprets both inputs as unsigned. Both instructions write the quotient and leave the flags unchanged.\n\nFor a negative signed result, rounding towards zero discards the fraction without making the integer more negative. The remainder can therefore be negative. When C division is defined, the relation is `dividend = quotient * divisor + remainder`.",
  prediction:
    "The signed dividend is −17 and the divisor is 5. The function uses `sdiv` and returns the quotient in `w0`.",
  predictionQuestion: "**Which hexadecimal quotient does it return?**",
  predictionExplain:
    "It returns `0xfffffffd`, which represents −3 as a signed 32-bit value. Dividing −17 by 5 gives −3 with a fraction left over; discarding that fraction rounds towards zero.\n\nThe remainder is −2, because `−17 = (−3 × 5) + (−2)`.",
  investigation:
    "The recorded remainder function first uses `sdiv` to put the quotient in `w2`. It then uses `msub w0, w2, w1, w0` to subtract `quotient × divisor` from the original dividend.\n\nFollow the registers and the division diagram. For the negative example, the drawing shows the size of the dividend, ignoring its sign. It divides that size into whole groups and a remaining part. The values below show the signed quotient and remainder.\n\nA remainder from defined signed C division is zero or has the same sign as the dividend. Changing the divisor's sign changes the quotient's sign, but does not change that rule for the remainder.",
  construction:
    "Compute a signed remainder from the quotient and the original inputs. Preserve the dividend until the subtraction uses it.",
  writeTask:
    "Write `remainder_signed`. `w0` holds a signed dividend and `w1` a signed divisor. Return the signed remainder in `w0`.\n\nThe divisor is nonzero. The tests exclude the unrepresentable quotient from dividing the minimum signed value by −1.",
  writeHints: [
    "Calculate the signed quotient first.",
    "Overwriting the dividend with the quotient loses an input needed for the final subtraction.",
    "For 17 divided by 5, the quotient is 3. Subtract `3 × 5` from 17 to get the remainder, 2.",
    "Subtract the quotient times the divisor from the dividend. `msub` can do both operations.",
    "Write `sdiv w2, w0, w1`, then `msub w0, w2, w1, w0`, then `ret`.",
  ],
  failureExperiment:
    "The changed remainder function uses `udiv` instead of `sdiv`. The input bits still represent −17 in `w0` and 5 in `w1` when read as signed values. The multiply-and-subtract is unchanged.",
  failureQuestion: "**What result does the changed function return in `w0`?**",
  failureExplain:
    "It returns `0x00000004`, or 4. `udiv` interprets the dividend bits as the unsigned value 4294967279. The unsigned quotient is 858993455, leaving a remainder of 4.\n\nThe later subtraction cannot correct the choice made at the division. The same bits need `sdiv` for the intended signed calculation.",
  explanation:
    "A64 gives its division instructions results even in cases where C division is undefined. With a zero divisor, `sdiv` and `udiv` write a zero quotient. For the minimum signed value divided by −1, `sdiv` returns that minimum value's bit pattern. These instructions do not signal those cases through the condition flags.\n\nInspect the two assembly-only experiments. Their hardware results are observable, but a C compiler is not required to preserve the behaviour of an undefined C expression. Check a divisor or an overflow case before performing the C operation.",
  generalisation:
    "GCC can also replace division by a constant with other arithmetic. For unsigned division by ten, this recorded GCC version uses multiplication by `0xcccccccd` and a right shift by 35. It uses the full widened product, so the relevant higher bits survive. The example returns the same quotient as division; the instruction sequence is this compiler's choice, not a timing claim.",
  challengeIntro:
    "An average can overflow before its division, even if the final quotient fits. Choose a wide enough product first, then divide. A wide result type alone does not widen an earlier narrow multiplication.\n\nThe final calculation uses fuel in millilitres and distance in metres. Multiplying the fuel by 100 before dividing by distance gives whole millilitres per 100 metres. Both inputs are unsigned 32-bit values, and their scaled product fits in 64 bits.\n\nThe exercise defines a zero-distance result as zero. That is a rule of this function. A branch can handle that case before division. In assembly, a correctly widened `udiv` also produces the required zero directly.\n\nThe input contract guarantees only the distance in the low 32 bits, `w1`. It makes no promise about the incoming upper half of `x1`. Naming `w1` as the input does not mean an instruction has written it. Before dividing with `x` registers, clear that upper half: a write to `w1`, even one that copies `w1` to itself, does this.",
  finalTask:
    "Write `consumption`. `w0` holds unsigned fuel in millilitres and `w1` holds unsigned distance in metres. Return whole millilitres per 100 metres in `x0`: `fuel * 100 / distance`, rounded down. Preserve the full product before dividing.\n\nIf the distance is zero, return zero. The tests include fuel values whose product with 100 does not fit in 32 bits.",
  finalHints: [
    "Handle zero distance before the calculation.",
    "Multiplying in a 32-bit destination loses any higher product bits before division.",
    "With fuel 1 and distance 3, first calculate `1 × 100`. Whole-number division by 3 gives 33. Multiplication must come before division.",
    "Divide the 64-bit product by the zero-extended distance using `udiv` with `x` registers.",
    "One complete approach is: `cbz w1, zero`; `mov w2, #100`; `umull x0, w0, w2`; `mov w1, w1`; `udiv x0, x0, x1`; `ret`. Under `zero:`, write `mov x0, #0` and `ret`.",
  ],
  reflection:
    "- Signed integer division rounds towards zero.\n- Compute a remainder as dividend minus quotient times divisor.\n- Choose `sdiv` or `udiv` from the inputs' interpretation.\n- A64 division results do not define otherwise undefined C expressions.\n- Widen a product before dividing when its higher bits are needed.\n\nWhy can an average be wrong even when its final value would fit in the return register?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "An intermediate multiplication can discard bits before the division runs. Dividing the truncated product gives a different quotient. Preserve the full intermediate product before dividing it.",
  modelVsReality:
    "The division and product diagrams use simulator results. Exceptional division examples are assembly-only experiments checked against A64 behaviour. They do not model a C compiler's freedom when a source expression has undefined behaviour.\n\nThe recorded division-by-ten sequence is tied to one GCC version and optimisation setting. The course does not model the time instructions take or claim that one sequence is faster.",
  originalityNote: {
    textbookExample: "Quotient and remainder from positive small integers.",
    howThisDiffers:
      "A negative adjustment exposes rounding towards zero and the sign of the remainder. A fuel-per-distance calculation then requires a wide intermediate product and an explicit rule for zero distance.",
  },
} as const;
