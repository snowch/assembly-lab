# Module 1 plan: Registers and readings

Written before the module is built (`docs/plan.md`, "How each module is built"). It assumes the
plan's recommendations (A64, the trip computer). It may change once Module 0's review is in,
because Module 1 reuses Module 0's figures.

## What the module does

Two lessons.

1. **`one-pattern-three-readings`.** Module 0's mistaken `fuel_used(50, 38)` left a value in `w0`
   that its test reported as wrong. This lesson opens that value: 32 bits, written shorter in
   hexadecimal, read as an unsigned number and as a signed one. The signed reading is derived
   from the machine: adding 12 back to the pattern gives 0, so the pattern behaves as −12. Then
   the reader finds that GCC makes the same instruction from the `int` and the `unsigned` version
   of the function: the type is not in the machine.
2. **`constants-and-widths`.** How a value gets into a register: `mov` with a constant, which
   constants one instruction can hold, `movk` for the rest; `-1` and `4294967295` as the same
   instruction; the `w` and `x` names of one register, and the rule that writing `w0` clears the
   top half of `x0`.

## The programs, and where they come from

GCC listings recorded in `docs/notes/module-1/listings.md` (ARM64 GCC 16.1.0, `-O1`):

| Function | C | Listing |
| --- | --- | --- |
| `fuel_used_wrong` | `int`, `return at_end - at_start;` | `sub w0, w1, w0` / `ret` |
| `fuel_used_wrong_u` | the same with `unsigned` | `sub w0, w1, w0` / `ret`: identical |
| `service_interval` | `return 30000;` | `mov w0, 30000` / `ret` |
| `odometer_limit` | `return 1000000;` | `mov w0, 16960` / `movk w0, 0xf, lsl 16` / `ret` |
| `no_reading` | `int`, `return -1;` | `mov w0, -1` / `ret` |
| `all_ones` | `unsigned`, `return 4294967295u;` | `mov w0, -1` / `ret`: identical |
| `no_reading_long` | `long`, `return -1;` | `mov x0, -1` / `ret` |

`widen` and `widen_signed` (`uxtw x0, w0` and `sxtw x0, w0`) are recorded for Module 6 and not
used here.

## Facts the lessons rest on (produced by the simulator or GNU as, pinned by facts tests)

- `fuel_used_wrong(50, 38)` leaves `w0` holding the bits `1111 1111 1111 1111 1111 1111 1111 0100`,
  written `0xfffffff4`; read unsigned, 4294967284; read signed, −12. Adding 12 to it with
  `add w0, w0, 12` gives 0 [qemu].
- The signed reading counts the top bit as −2147483648 and the rest as usual; the unsigned
  reading counts it as +2147483648. Every other bit has the same worth in both.
- `fuel_used_wrong` and `fuel_used_wrong_u` are the same instructions; so are `no_reading` and
  `all_ones`.
- `mov w0, 30000`, `65535`, `65536` and `65537` are accepted by one instruction; `1000000` is not
  ("immediate cannot be moved by a single instruction") [gas]. 65537 is accepted because its bits
  are one pattern repeated (`0x00010001`); the lesson shows this in a closed note, not as a rule
  to learn.
- `mov w0, 16960` then `movk w0, 0xf, lsl 16` leaves 1000000: `movk` replaces one 16-bit part and
  keeps the rest.
- After `mov x3, -1` then `mov w3, -1`, `x3` holds `0x00000000ffffffff` [qemu].

## Terms (the term gate)

Lesson 1: *hexadecimal*, *unsigned reading*, *signed reading*, *top bit*. Lesson 2: *constant*
(as the instruction's own number), *`w` register* and *`x` register* as two names of one register.
Not yet: *flag*, *carry*, *overflow* (Module 2), *sign extension* (Module 6).

Instructions the lessons allow: lesson 1 `add`, `sub`, `ret`; lesson 2 adds `mov`, `movk`.

## Figures (reusing Module 0's register row and stepper)

- **A register to read**: one register's 32 bits, set by the reader one bit at a time, with its
  hexadecimal, unsigned and signed readings beside it, each with the sum that gives it (the top
  bit's worth shown as + or − 2147483648).
- **The stepper**, over `fuel_used_wrong(50, 38)` then an added `add w0, w0, 12`, drawing `w0` as
  bits with all three readings.
- **Two listings side by side**, the `int` and the `unsigned` function, compared line by line by
  the page, which marks them identical.
- **A constant tester**: the reader types a number; the page assembles `mov w0, <number>` with the
  course's assembler and shows the result or GNU as's message, and the register.
- **One register, two names**: `x3` as 64 bits in two halves, with `w3` its low half; steps
  `mov x3, -1` then `mov w3, -1`.

## Challenges

1. Lesson 1, answers: for three given patterns (in hexadecimal), the unsigned and the signed
   reading. One has its top bit clear, so both readings agree.
2. Lesson 2, write: put 1000000 in `w0` and return it, with `mov`, `movk` and `ret` only. The
   starting text `mov w0, 1000000` / `ret` fails to assemble, with the machine's message.

## Originality

The obvious way in is a table of two's complement values, or the "flip the bits and add one"
rule. This module starts from a wrong answer the reader has already seen in Module 0, derives the
signed reading by adding the missing amount back on the machine, and shows the type's absence by
two compiled listings that are identical. The constants lesson works from the assembler's own
refusal, not from the encoding.

## The model against reality

Encodings are not shown (`docs/machine.md`), so which constants fit is taken from GNU as's
behaviour, not explained from the instruction's bits; the closed note says so.
