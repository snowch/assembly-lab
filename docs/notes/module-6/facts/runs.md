# Module 6 checked facts

Copyright © 2026 Christopher Snow

## Sources and boundaries

The compiler records in `../compiler/` are actual Compiler Explorer requests to
`https://godbolt.org/api/compiler/carm64g1610/compile`, using GCC 16.1.0 with `-O1`.
`../listings.md` preserves the displayed C and mapped instruction listings.
`content/lessons/memory.facts.test.ts` checks those records and the values below.

The [AAPCS64 release 2025Q4](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst),
“Fundamental Data Types”, “Byte order”, “Arm C and C++ Language Mappings” and
“Types Varying by Data Model” provide the byte sizes and C mappings. In the LP64
model used here, char is one 8-bit byte, short two bytes, int four bytes, and long
and pointers eight bytes. The ABI supports little-endian and big-endian memory;
the course and its AArch64 Linux compiler/QEMU target use little-endian memory.
A load/store size follows the instruction and destination/source width. The base
address stays in a 64-bit x register even when the data is one byte.

[C23 draft N3096](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf),
dated 1 April 2023, was fetched on 17 October 2026. SHA-256:
`a1262b7d5d2ab0e496e94cb0fe6fab7ec511f29e6aeee669b2d1b16020f30fe4`.
The relevant clauses are:

- 6.3.1.3 paragraph 1: a conversion that can represent the original integer value
  leaves the value unchanged. This covers the signed and unsigned narrow loads'
  conversions to int or long on this target.
- 6.3.1.3 paragraph 2: narrowing to an unsigned type repeatedly adds or subtracts
  one more than that type's maximum until the value is in range. Unsigned-byte
  and halfword stores discard the higher bits on this target.
- 6.3.1.3 paragraph 3, printed page 46 (PDF page 62): converting an out-of-range
  integer to a signed type gives an implementation-defined result or raises an
  implementation-defined signal. The `signed_byte` cast shown is this GCC
  implementation's behaviour; the course does not call it a portable C guarantee.
- 6.5.3.2 paragraph 4: unary `*` designates the object addressed by a pointer;
  using an invalid pointer value is undefined. The memory fixtures provide valid
  mapped bytes for the assembly model. They are not claims that arbitrary C
  byte arrays can be accessed through any cast pointer regardless of type,
  alignment or lifetime.

The final record layout is course-authored and explicitly assigns byte offsets.
It is not presented as the output of a C struct declaration. The displayed GCC
functions take a pointer to an existing object of the declared type. Fixture
`.data` directives belong to the execution harness and are not compiler output.

## Values checked by the model

The fixture address is `0x410000`, the model's `DATA_BASE` and the address used by
the differential test linker. Four bytes `78 56 34 12` load as `0x12345678`.
Loading into `w0` overwrites the low half of `x0` and clears its high half; `x0`
and `w0` are views of one register, not two storage locations. The pointer is
therefore replaced when the compiler chooses `ldr w0, [x0]`.

Storing `0x12345678` into the four-byte fixture `aa bb cc dd` gives:

| Instruction | Bytes afterwards |
| --- | --- |
| `strb w1, [x0]` | `78 bb cc dd` |
| `strh w1, [x0]` | `78 56 cc dd` |
| `str w1, [x0]` | `78 56 34 12` |

The register value and pointer do not change during these stores. Eight bytes
`78 56 34 12 ef cd ab 90` load as `0x90abcdef12345678` with `ldr x0, [x0]`;
`str x1, [x0]` stores all eight bytes in the same order.

For the fixture `f9 ff ff ff aa bb cc dd`:

| Load | Result bits | Signed value at destination width |
| --- | --- | --- |
| `ldrb w0, [x0]` | `0x000000f9` | 249 |
| `ldrsb w0, [x0]` | `0xfffffff9` | -7 |
| `ldrsb x0, [x0]` | `0xfffffffffffffff9` | -7 |
| `ldrh w0, [x0]` | `0x0000fff9` | 65529 |
| `ldrsh w0, [x0]` | `0xfffffff9` | -7 |
| `ldrsw x0, [x0]` | `0xfffffffffffffff9` | -7 |

A negative signed byte loaded into `w0` sign-extends only to 32 bits. The write to
`w0` still clears bits 63–32 of `x0`. Loading directly into `x0` sign-extends to
64 bits instead. The tests cover both sides of each signed boundary and zero.

The standalone `sxtb w0, w0` and `uxtb w0, w0` interpret the low byte `f9` as
-7 and 249 respectively. GCC emits `and w0, w0, 255` for the unsigned C cast;
the equivalent `uxtb` example is explicitly course-authored. `sxtw x0, w0`
turns `0xfffffff9` into the 64-bit representation of -7. With total 100 and
adjustment bits `0xfffffff9`, `add x0, x0, w1, sxtw` yields 93. The second
operand register stays unchanged.

The failure example reads signed byte `f9` and applies correction 10. The correct
load gives -7 and returns 3. The deliberately wrong unsigned-byte load instead
reads 249 and returns 259. A second checked case uses correction 100 and returns
93 with the signed load, or 349 with the unsigned load. Its bytes are unchanged; the changed instruction caused the changed result.

## Independent execution

On 17 October 2026, GNU as 2.44 and QEMU 10.0.13 compared the initial Module 6
corpus: 24 programs, 182 calls, 555 instruction states, zero differences.
The corpus includes every compiled function, the explicit UXTB example, wrong
store and wrong-load examples, four challenge solutions and their shared empty
starting point. Final memory is compared for every program that accesses a
fixture. This is a direct check of instruction behaviour; it does not establish
C pointer validity or make implementation-specific casts portable.
