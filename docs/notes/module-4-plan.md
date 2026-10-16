# Module 4 plan: Compare and branch

Written before the module is built. It assumes the plan's recommendations, and may change once
the earlier modules have been reviewed.

## What the module does

Two lessons.

1. **`compare-and-choose`.** `cmp` is a `subs` that keeps only the flags. A condition reads the
   flags; the conditions come in signed and unsigned pairs. `cset` turns a condition into 0 or 1,
   and `csel` chooses one of two registers. GCC's signed and unsigned maximum use the same `cmp` and
   differ only in the condition, `ge` against `cs`: the type lives in the condition.
2. **`branches`.** A branch changes which instruction runs next: `b`, `b.cond` (and GCC's spelling
   `bgt`), `cbz`, `tbz`, and labels. `describe` is the first listing whose run does not go straight
   down: the reader follows it with arrows from each branch to its target.

## The programs (GCC listings in `docs/notes/module-4/listings.md`, ARM64 GCC 16.1.0, `-O1`)

| Function | Listing | Point |
| --- | --- | --- |
| `steeper_s`, `steeper_u` | `cmp w1, w0` / `csel w0, w1, w0, ge` or `cs` | the same compare; the condition carries the type |
| `fuel_low` | `cmp w0, w1` / `cset w0, cc` | an unsigned "less than" is C clear |
| `warning_light` | the same two instructions, from an `if` with two `return`s | GCC needs no branch for a simple `if` |
| `downhill` | `lsr w0, w0, 31` | `gradient < 0` is the top bit: no compare at all |
| `describe` | `cmp w0, 10` / `bgt .L9` / `cmn w0, #10` / `mov w0, -2` / `csel w0, w0, wzr, lt` / `.L7: ret` / `.L9: mov w0, 2` / `b .L7` | branches and labels; `cmn` for a negative constant; `wzr` as a 0 |
| `maybe_beep` | `cbz w0, .L17` / ... | `cbz`; the call that follows waits for Module 9 and is not shown |

## Facts (from the simulator; a facts test pins them)

- `steeper_s(-1, 1)` is 1; `steeper_u(0xffffffff, 1)` is 4294967295: the same 32 bits in, different
  answers out. Both give 7 for (3, 7).
- `fuel_low(5, 8)` is 1 and `fuel_low(8, 8)` is 0.
- `downhill(-3)` is 1 and `downhill(4)` is 0.
- `describe(15)` is 2 in five instructions, taking the branch; `describe(10)`, `describe(-10)` and
  `describe(0)` are 0 and `describe(-15)` is −2, each in six, not taking it.
- `cmp w0, 10` sets the flags of `w0 - 10`; `cmn w0, #10` sets those of `w0 + 10`, which is the
  same test as comparing with −10 (GNU as itself turns `cmp w0, -10` into `cmn w0, 10`,
  `docs/machine.md`).

## Terms

Lesson 1: *compare*, *condition*, and the pairs' names (greater, less, higher, lower). Lesson 2:
*branch*, *label*, *taken* and *not taken*. Not yet: *call*, *link register*, *stack* (Module 9).

Instructions: lesson 1 adds `cmp`, `cmn`, `tst`, `ands`, `cset`, `csel`; lesson 2 adds `b`,
`b.cond` (and the `bcond` spelling), `cbz`, `cbnz`, `tbz`, `tbnz`.

## Figures

- **One compare, every condition**: the reader sets two values; the page runs `cmp` and shows the
  flags, then each condition beside its signed or unsigned meaning and whether it holds, read
  from the flags by the model.
- **Two listings compared**, `steeper_s` and `steeper_u`, with the one differing word marked.
- **A listing with arrows**: each branch drawn to its target, taken or not taken on the current
  run, and the instructions the run skipped greyed; from the trace.
- The stepper and the editor.

## Challenges

1. Lesson 1, answers: for `cmp` of two given patterns, which of `ge`, `cs`, `lt`, `cc` hold.
2. Lesson 2, write: `fuel_warning(litres, reserve)` returning 2 when empty, 1 below the reserve,
   0 otherwise, with branches (gate: `cmp`, `b.cond`, `cbz`, `b`, `mov`, `ret`). Tests include 0,
   the reserve itself, and a value with the top bit set, which only the unsigned conditions
   handle.

## Originality

The obvious examples are `max(a, b)` and an absolute value, with a flowchart. This module uses the
trip computer's gradient and fuel, shows GCC choosing `csel` and `cset` over branches for simple
`if`s, and finds the type in one condition word of two otherwise identical listings.

## The model against reality

Real processors predict branches and run ahead; the simulator runs one instruction at a time,
which gives the same results. The listing's arrows show the program's path, not the processor's
timing.
