# Module 2 plan: Adding, subtracting and the flags

Written before the module is built. It assumes the plan's recommendations, and may change once
Modules 0 and 1 have been reviewed.

## What the module does

Two lessons.

1. **`adding-and-the-flags`.** An addition column by column, with the carry into each column
   drawn; `add` against `adds`, which also sets four flags; what each flag records: N the
   result's top bit, Z a result of 0, C the carry out of the top bit, V the carry into the top bit
   differing from the carry out. One adder serves both readings: C judges the unsigned answer, V
   the signed one.
2. **`subtracting-and-the-tick-counter`.** The trip computer's millisecond counter is 32 bits and
   wraps to 0. `elapsed(now, then)` is one `sub`, and it is right across the wrap. `subs` is
   `a + NOT b + 1`, so its C means no borrow. The capstone writes `elapsed` and passes tests that
   cross the wrap.

## The programs, and where they come from

GCC listings in `docs/notes/module-2/listings.md` (ARM64 GCC 16.1.0, `-O1`):

| Function | Listing | Used for |
| --- | --- | --- |
| `elapsed` | `sub w0, w0, w1` / `ret` | lesson 2: one instruction, right across the wrap |
| `tick_wrapped` | `cmp w0, w1` / `cset w0, cc` / `ret` | lesson 2, a closed note: the compiler reading C (the full `cset` is Module 4's) |
| `sum_carried` | `add w1, w0, w1` / `cmp w1, w0` / `cset w0, cc` / `ret` | lesson 1, a closed note: for `a + b < a` GCC adds, then compares the sum with `a`, rather than reading the add's own carry |
| `add_overflows` | `cmn w0, w1` / `cset w0, vs` / `ret` | lesson 1: `__builtin_add_overflow` reads V |
| `sub_overflows` | `subs w0, w0, w1` / `cset w0, vs` / `ret` | lesson 2 |
| `negate` | `neg w0, w0` / `ret` | lesson 2, the one value whose negative is itself |

## Facts the lessons rest on (each from the simulator, pinned by a facts test)

- `adds` of `0x7fffffff` and 1: result `0x80000000`; N 1, Z 0, C 0, V 1. Unsigned, 2147483647 + 1
  = 2147483648, right; signed, 2147483647 + 1 reads as −2147483648, wrong; the flags say so.
- `adds` of `0xffffffff` and 1: result 0; N 0, Z 1, C 1, V 0. Unsigned, the answer 4294967296
  does not fit; signed, −1 + 1 = 0, right.
- The carries of each are drawn from the trace's `addition` record, never computed in the figure.
- 2^32 milliseconds is 49.71 days (4294967296 ÷ 86400000), so the counter wraps about every 50
  days.
- `elapsed(1000, 4294966296)` is 2000: the counter wrapped between the two readings. `subs` of
  the same gives C 0 (a borrow).
- `neg` of `0x80000000` gives `0x80000000`; with `negs`, V is 1.

## Terms

Lesson 1: *carry*, *flag*, the names N, Z, C and V, *overflow* (for the signed reading's wrong
answer). Lesson 2: *borrow*, *wrap*. Not yet: *condition*, *compare* as an instruction (Module 4).

Instructions: lesson 1 adds `adds`; lesson 2 adds `subs`, `neg`, `negs`. (`cmp`, `cmn` and `cset`
appear only in recorded listings in closed notes, read, not written.)

## Figures

- **The adder, column by column**: two registers, the carry into every column above them, the
  result below, the four flags beside; stepped a column at a time. From the trace's `addition`
  record.
- **Predict the flags**: the reader sets four flags before the run, then the run answers.
- **The counter's wheel**: the 32-bit counter's values on a ring, `then` and `now` marked either
  side of the wrap, and the elapsed distance between them; values from the simulator.
- The stepper and the editor, as in Module 0.

## Challenges

1. Lesson 1, answers: predict N, Z, C and V for three additions.
2. Lesson 2, write: `elapsed(now, then)` passing four calls, two of them across the wrap; gate
   `add`, `sub`, `adds`, `subs`, `neg`, `ret`. The tempting wrong answer, which tests whether
   `now < then` and adds 2^32, cannot be written with the gate's instructions; the hints lead to
   the single `sub`.

## Originality

The obvious example is an 8-bit addition table with overflow cases, or a car odometer rolling
over. This module uses a 32-bit millisecond counter and the elapsed-time question a trip computer
really asks, and checks its claims about what compilers do against GCC's own listings
(`sum_carried` compares instead of reading C, which is the opposite of what a textbook expects).

## The model against reality

The simulator computes the flags as the architecture defines them; a real processor's adder is
not a ripple of columns. The column drawing shows the arithmetic, not the circuit; digital-design
builds the circuit.
