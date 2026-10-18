# Module 8 listings and sources

The accepted compiler listings are in `compiler/`, with the submitted C, exact request and raw
JSON response. Each request used Compiler Explorer `carm64g1610` (GCC 16.1.0 for AArch64 Linux),
`-O1`, with directives and comments filtered. Source-line tags in `products.listings.ts` remove
only the submitted copyright line; a tag on a closing brace is GCC's attribution, not a claim
that the return expression occupies that line. `products.facts.test.ts` compares every C string,
assembly line and tag with the raw response.

Accepted examples: `scale_pulses`, `scaled_total`, `wide_unsigned`, `wide_signed`,
`quotient_unsigned`, `quotient_signed`, `remainder_signed` and `groups_of_ten`.

The trial `consumption` source compiled successfully, but GCC emitted `ubfiz` and `uxtw`, which
are outside this lesson's instruction ration. Its source and raw response are retained as
engineering evidence. It is not displayed as a compiler listing. The consumption challenge,
product-halves combination, multiply-subtract demonstration and deliberately broken variants
are explicitly course-authored assembly, identified by an empty C field.

## Instruction evidence

All 14 displayed programs have matching files in `scripts/real-tools/corpus/module8-*`.
The GNU assembler and QEMU check compared 57 calls and 232 instruction states with zero
register, flag or program-counter differences. This covers signed and unsigned high products,
32-bit wrap, full-width products, signed rounding, divisor zero, minimum signed value divided
by minus one, the compiler's constant-division sequence and the consumption boundary inputs.

`products.facts.test.ts` pins the displayed answers and all source mappings. It also checks that
these arithmetic programs do not change NZCV. The diagram helpers read the simulator's result
registers; they do not calculate a replacement multiplication or quotient. BigInt values stay
exact through the diagrams and the existing 64-bit written-program grader.

## C evidence

Read C23 draft N3096 from the existing checked copy at `/tmp/module6-evidence/n3096.txt`:

- 6.2.5 paragraph 11: unsigned arithmetic is reduced modulo one more than its maximum value.
- 6.5 paragraph 5: an expression result outside the range of its type has undefined behaviour,
  unless an operation's specific rule states otherwise.
- 6.5.5 paragraph 4: usual arithmetic conversions before multiplication and division.
- 6.5.5 paragraph 6: a zero divisor makes both `/` and `%` undefined.
- 6.5.5 paragraph 7: integer quotient discards any fractional part; where the quotient is
  representable, `(a/b)*b + a%b == a`; an unrepresentable quotient makes both operations undefined.

The lesson's A64 exceptional-division experiments have no corresponding C panel. Their
machine result is not presented as permission to evaluate an undefined C expression.

The unsigned division-by-ten compiler example uses the exact 64-bit product with `0xcccccccd`,
followed by a shift of 35. Tests include zero, values either side of a multiple of ten, the
high-bit boundary and UINT_MAX. The page makes no timing claim and does not teach the derivation
of a reciprocal constant.

## Originality and reuse

The running pulse, distance and fuel examples extend this course's trip computer. The wide
product is motivated by lost pulse-distance bits, and the signed remainder by a negative
adjustment. No external tutorial example or lesson structure is reproduced.

Reused: listing, exact-register memory stepper and prediction, existing BigInt grader and
phone editor. New: a paired 128-bit product diagram, divided into computed high/low halves,
and a bounded signed quotient/remainder grouping diagram. The diagrams remain locked until
an earlier prediction is committed.
