# Module 3 plan: Logic, shifts and masks

Written before the module is built. It assumes the plan's recommendations, and may change once
the earlier modules have been reviewed.

## What the module does

Two lessons, on the trip computer's **warning word**: one `unsigned` whose bits each say one
thing (bit 0 fuel low, bit 1 service due, bit 2 a door open, bit 3 the lights on) and whose bits
4 to 6 hold the gear, a number from 0 to 7.

1. **`masks`.** Setting a bit (`orr`), clearing one (`and` with a mask that has every other bit
   set), flipping one (`eor`), and reading a field out (`ubfx`) or writing one in (`bfi`). The
   reader writes `set_gear` with `and`, `lsl` and `orr`, then sees GCC do it in one `bfi`.
2. **`shifts`.** `lsl`, `lsr` and `asr`: moving bits along, filling with zeros or with copies of
   the top bit. GCC picks `asr` for `int` and `lsr` for `unsigned`: the first place in the course
   where the C type changes the instruction. And `g / 2` is not `g >> 1` for a negative `int`.

## The programs (GCC listings in `docs/notes/module-3/listings.md`, ARM64 GCC 16.1.0, `-O1`)

| Function | Listing | Point |
| --- | --- | --- |
| `warn_fuel` | `orr w0, w0, 1` | set a bit |
| `clear_door` | `and w0, w0, -5` | clear a bit: the mask `0xfffffffb` printed as its signed reading, −5 (Module 1) |
| `toggle_lights` | `eor w0, w0, 8` | flip a bit |
| `service_due` | `ubfx x0, x0, 1, 1` | test a bit by taking a one-bit field; GCC names `x0` for a 32-bit `unsigned` (the field lies in the low half, so the result is the same) |
| `gear_of` | `ubfx x0, x0, 4, 3` | read a field |
| `set_gear` | `bfi w0, w1, 4, 3` | write a field in one instruction |
| `halve_gradient`, `halve_count` | `asr w0, w0, 1`; `lsr w0, w0, 1` | the type picks the shift |
| `div2` | `add w0, w0, w0, lsr 31` / `asr w0, w0, 1` | dividing a negative `int` by 2 rounds towards zero; a shift rounds down |
| `times8` | `lsl w0, w0, 3` | multiplying by a power of two |

## Facts (from the simulator; a facts test pins them)

- `clear_door(0xf)` is `0xb`, 11.
- `gear_of(0x35)` is 3; `set_gear(0x35, 5)` is `0x55`, 85, by GCC's `bfi` and by the reader's
  `and w1, w1, 7` / `lsl w1, w1, 4` / `and w0, w0, -113` / `orr w0, w0, w1` alike. −113 is
  `0xffffff8f`: every bit set except bits 4 to 6.
- `asr` of −7 by 1 is −4 (`0xfffffffc`); `lsr` of the same bits by 1 is 2147483644
  (`0x7ffffffc`); `div2(-7)` is −3 (`0xfffffffd`). C's `/` rounds towards zero; `asr` rounds down,
  so GCC adds 1 to a negative value first, which is what `add w0, w0, w0, lsr 31` does (the top bit,
  moved to the bottom).

## Terms

Lesson 1: *mask*, *field*, the logical operations named as AND, OR, exclusive OR and NOT.
Lesson 2: *shift*, *logical shift* and *arithmetic shift* (plain English first: filling with zeros,
or with copies of the top bit). Not yet: *sign extension* as a term (Module 6), *condition*
(Module 4).

Instructions: lesson 1 `and`, `orr`, `eor`, `bic`, `mvn`, `ubfx`, `bfi`, `lsl`; lesson 2 adds `lsr`,
`asr`. `tst` and `ands` wait for Module 4, where a branch reads their flags.

## Figures

- **The warning word**: the register's 32 bits with bits 0 to 6 labelled by their meaning, and a
  mask drawn under it; each logical instruction shown bit by bit (the operation per column). From
  the trace.
- **A shift**, drawn as bits moving along, the bits that fall off the end, and what fills the gap,
  for `lsl`, `lsr` and `asr`, chosen by the reader, on a value the reader sets.
- **Two listings compared** (from Module 1), for `halve_gradient` and `halve_count`.
- The stepper and the editor, as before.

## Challenges

1. Lesson 1, write: `set_gear(w, g)` without `bfi`, with `and`, `lsl` and `orr`; four calls, one
   with `g` larger than 7 (only its low three bits may land). Gate `and`, `orr`, `lsl`, `ret`.
2. Lesson 2, answers: for −20 and 20, the result of `asr` by 2, `lsr` by 2, and C's `/ 4`.

## Originality

The obvious examples are Unix file permissions or a hardware status register from a datasheet.
This module uses the trip computer's own warning word, makes the reader build `set_gear` by hand
before showing GCC's single `bfi`, and uses GCC's listings for `>>` and `/ 2` to show the C type
choosing the instruction for the first time.

## The model against reality

The simulator's shifts and fields follow the architecture's results, checked against QEMU; it
does not model a barrel shifter's timing. `ubfx` and `bfi` are aliases of more general
instructions (`ubfm`, `bfm`) that the course does not name.
