# Companion scenarios checked against real 32-bit C

The companion is the author's *Where C meets the wheel*,
https://raw.githubusercontent.com/snowch/programmer-calculator/main/docs/c-meets-the-wheel.html,
retrieved 17 October 2026. Its illustrative eight-bit register machine is not this course's A64
machine. The course does not reproduce its prose or sequence. This crosswalk accounts for the
plan's ten topics and records where a mechanical translation would be wrong.

| Companion topic | Actual C rule on the selected target | Course coverage and evidence |
| --- | --- | --- |
| Unsigned countdown | Every unsigned value compares >= 0. An array access after wrap may already be undefined because the index is outside the object; the C abstract machine does not promise endless valid accesses. | Module 5's counted dimming examples and finite do-loop versus always-true test. Module 7's array bounds. N3096 6.2.5, 6.8.5, 6.5.6. |
| Largest signed value plus one | `INT_MAX + 1` in int arithmetic is undefined. But a signed char containing127 promotes to int before `+1`, so that expression produces128 without overflow. Converting back to signed char is a separate conversion. | Module 11 `MACHINE_INCREMENT`, `CAN_INCREMENT`, `PROMOTED_GRADIENT`. N3096 6.5p5, 6.3.1.1, 6.3.1.3. |
| Out-of-range signed narrowing | The named N3096 draft permits an implementation-defined result or signal. GCC documents modulo conversion with no signal. `narrow_gradient(200)` gives -56 on recorded GCC. Unsigned narrowing to eight bits reduces modulo256. | Modules 6 and11; `NARROW_GRADIENT`, `NARROW_FUEL`. N3096 6.3.1.3; GCC16.1 `implement-c.texi` integer conversions. |
| Negating the minimum | `-INT_MIN` cannot be represented as int, so ordinary signed C negation is undefined; A64 `neg w0,w0` produces the same sign-bit pattern. A signed char containing-128 first promotes to int, so its negation is the perfectly representable int128; storing that into signed char invokes conversion. | Module2 negation, Module11 bounds explanation and `NEGATE_GRADIENT` evidence. N3096 6.3.1.1 and6.5p5. |
| Parsing a minimum signed value | The positive magnitude2147483648 does not fit selected-target int. A parser that accumulates it in int overflows before the final negation. A wider accumulator or checked negative accumulation can handle the boundary; either approach must also reject values beyond its own bounds. | Module11 precondition note. Module8 wider arithmetic. No fabricated parser listing or claim that this course implements a complete parser. |
| Detecting subtraction wrap | For unsigned32 operands, `now - then > now` detects the subtraction's borrow/wrap. GCC's recorded output compares the original operands and sets `hi`; it need not materialise the subtraction. | Module2 tick counter and Module11 `UNSIGNED_SUB_WRAP` record/facts/corpus; N3096 6.2.5p11. |
| `%d` and `%u` | Formatting functions require matching argument types after default argument promotions. Changing a format string is not a defined reinterpretation mechanism. A signed char-2 promotes to int-2; `%u` does not thereby yield254. Convert intentionally to unsigned char then unsigned if the desired value is the low byte254. | Module11 formatting explanation; recorded `-Wformat-signedness` diagnostic, N3096 7.23.6.1p9 and6.5.2.2p6. The simulator does not implement printf. |
| Minimum signed value divided by -1 | `INT_MIN / -1` is undefined because the quotient is unrepresentable; A64 returns the minimum pattern. With signed char-128 and-1, integer promotion instead makes the int quotient128 representable; conversion back to char is separate. | Module8 signed division and Module11 type-boundary synthesis. N3096 6.5.5p6–7,6.3.1.1. |
| Optimised-away overflow check | For every input where signed `distance + 1` is defined, it exceeds distance. Recorded GCC folds `can_increment` to1. `-fwrapv` changes the contract for this addition and GCC emits a compare with INT_MAX instead. | Module11 first lesson, normal and wrap records, model traces and QEMU. N3096 6.5p5; GCC16.1 `-fwrapv`. |
| Unsigned addition and detecting wrap | For unsigned32, `distance + leg < distance` detects wrap. With unsigned char operands, arithmetic promotes to int first; narrowing back to a byte is the wrap step, not an eight-bit arithmetic instruction. | Module2 Cflag and Module11 `UNSIGNED_SUM_OVERFLOW`, `CHECKED_TRIP`; N3096 6.2.5p11,6.3.1.1,7.20.1. |

## Diagnostics and deliberate arithmetic contracts

`-fsanitize=undefined` instruments supported undefined operations, including signed overflow,
but only executed paths can trigger its run-time reports. GCC does not include ordinary defined
unsigned wrap in that category. GCC16.1's documented default is to recover from many UBSan errors;
`-fno-sanitize-recover=undefined` requests a nonzero termination after the first detected error.
Do not repeat the companion's unqualified assertion that default UBSan aborts, or suggest that
GCC supports Clang's `-fsanitize=unsigned-integer-overflow` option.

`ckd_add`, `ckd_sub` and `ckd_mul` in C23's `<stdckdint.h>` perform the mathematical operation with
an unlimited signed range, then convert to the destination type. They return false exactly when
the mathematical result fits that destination; on true they store its value wrapped to the
destination width. The course uses actual GCC16.1 C23 `ckd_add`, not an unlabelled substitute
compiler builtin. Source: N3096 7.20.1p2–5.

GCC's `-fwrapv` applies to signed addition, subtraction and multiplication. It does not make zero
division, invalid pointers, format mismatches or every other undefined operation valid.

## Validation

`c-boundaries.facts.test.ts` pins the shown values and source maps. The Module11 QEMU corpus
compared 20 programs,156 calls and630 instruction states without a difference. The two raw
external-library records (printf and UBSan) are compiler/diagnostic evidence only, never shown as
complete runnable listings. The ordinary safe-increment record containing untaught `cinc` is
retained for provenance but not displayed; its explicitly branch-preserving variant is displayed
and is in the corpus.
