# Module 0 plan: Meet the machine

The plan for Module 0, written before it is built, as `docs/plan.md` ("How each module is built")
requires. It assumes the plan's recommendations (A64, the trip computer).

## What the module does

One lesson, `meet-the-machine`. The learner sees a short C function from the trip computer and
the four instructions GCC made from it, steps them one at a time on the simulator, and finds out
what an instruction is: it reads registers, writes one, and the next instruction runs. They fix a
compiled function whose operands are the wrong way round, watch the machine run past a deleted
`ret` into the next function, and trace a five-instruction function on their own.

## The programs, and where they come from

All three are GCC listings, recorded in `docs/notes/module-0/listings.md` (ARM64 GCC 16.1.0,
`-O1`). The lesson shows the C without the recorded file's first line (its copyright comment), so
the lesson's C line numbers are the recorded ones minus one; the facts test checks that mapping.

| Program | C | Listing |
| --- | --- | --- |
| `trip_distance` | three statements: `leg1 + leg2`, then `+ leg3`, then `- detour` | `add w0, w0, w1` / `add w0, w0, w2` / `sub w0, w0, w3` / `ret` |
| `fuel_used`, as written by mistake | `return at_end - at_start;` | `sub w0, w1, w0` / `ret` |
| `fuel_used`, correct | `return at_start - at_end;` | `sub w0, w0, w1` / `ret` |
| `km_to_service` | four subtractions | `sub w0, w0, w1` / `sub w0, w0, w2` / `sub w0, w0, w3` / `sub w0, w0, #50` / `ret` |

The arguments the lesson uses, in kilometres and litres, chosen so that every value stays small
and positive (signed and unsigned readings are Module 1's): `trip_distance(120, 85, 42, 15)`;
`fuel_used(50, 38)`, `(45, 45)`, `(60, 5)`; `km_to_service(30000, 28750, 140, 390)`.

## Facts the lesson rests on (each produced by the simulator, and pinned by a facts test)

- `trip_distance(120, 85, 42, 15)`: after the first instruction `w0` is 205, after the second 247,
  after the third 232; `w1`, `w2` and `w3` never change; four instructions run; `ret` ends the run.
- The prediction "where does the machine keep `total`?" has the answer: in `w0`, over `leg1`. The
  trace shows the first `add` writing `w0`.
- With `ret` deleted from `trip_distance`, the machine runs the next instruction in memory,
  `fuel_used`'s `sub w0, w0, w1`, so `w0` becomes 232 − 85 = 147, and that function's `ret` ends
  the run: five instructions run and the result is 147.
- The mistaken `fuel_used(50, 38)` returns −12, and its tests fail; the corrected one returns 12,
  0 and 55 for the three calls.
- `km_to_service(30000, 28750, 140, 390)`: `w0` is 1250, 1110, 720, then 670 at the end; `w1` is
  still 28750 at the end.
- GCC's line record gives the last subtraction of `trip_distance` and of `km_to_service` the line
  of the closing brace, not the line of the statement it computes. The figures show the record as
  it is; the lesson says so in a `details` note and does not guess why.

## Terms the lesson introduces (the term gate)

*instruction*, *register*, *listing* (a compiler's listing), *assembly language*, *operand*,
*program counter*. Not yet: *flag*, *hexadecimal*, *signed*, *memory address*, *stack*, *link
register*, *calling convention* (the lesson says "the function's arguments arrive in `w0`, `w1`
and on, and its result leaves in `w0`" without naming the convention).

Instructions the lesson's assembler allows: `add`, `sub`, `ret`.

## The figures

| Figure | Section | What it shows, all from the simulator's trace |
| --- | --- | --- |
| a C function beside its listing | question | the C with its lines, the listing, and which C line each instruction is recorded against; static, from the recorded listing |
| prediction: where does `total` live? | prediction | four options; the answer comes from running the first instruction |
| the stepper | investigation | the listing with the instruction that runs next marked (the program counter, drawn as a marker, not as a number: hexadecimal is Module 1's), the recorded C line lit, `w0` to `w3` each as 32 bits and as a decimal number, the changed register outlined; next, back, reset |
| the stepper, with a "delete `ret`" switch | failure experiment | the same figure over `trip_distance` followed by `fuel_used`; the switch removes the line and reruns; the learner predicts first |
| the assembly editor | construction | the mistaken `fuel_used` listing, editable, run against three calls; the verdict per call |
| an answers challenge | challenge | `km_to_service`'s listing and the call; two fields: `w0` at the end, and `w1` at the end |

The stepper and the editor are reused by every later module, so they are built as general
figures: the stepper takes a listing, a call, the registers to draw, and the recorded C; the
editor takes a starting listing, calls with expected results, and the instruction gate.

## Challenges

1. **Fix `fuel_used`** (write, graded by running): starting point `sub w0, w1, w0` / `ret`, which
   fails all three calls but `(45, 45)`; reference `sub w0, w0, w1` / `ret`. Five hints, from "which
   operand does `sub` subtract from which?" to the whole answer.
2. **Trace `km_to_service`** (answers): `w0` at the end, 670; `w1` at the end, 28750. Five hints.
   The grader's feedback for a wrong `w1` says that a `sub` writes only its first operand, never
   the value it was given.

## Originality

The obvious first program in an assembly textbook or tutorial is "hello, world" through a system
call, or adding two numbers held in registers set by `mov`. This lesson starts from C a reader
might write, a three-statement function, uses the compiler's own listing rather than hand-written
assembly, and finds out what an instruction is by stepping it. Its failure experiment (running
past a deleted `ret` into the next function) and its operand-order fix are its own. The trip
computer is the course's running situation; its quantities differ from digital-design's.

## The model against reality

The simulator runs one instruction per step. A real processor overlaps many, reorders them and
predicts branches; what it guarantees is the result the steps give, which is all this lesson uses.
GCC at `-O1` is one compiler at one setting; at `-O0` the same C makes twenty instructions for
`trip_distance`, which keep every variable in memory (recorded in `docs/notes/module-0/listings.md`,
not shown in this lesson).
