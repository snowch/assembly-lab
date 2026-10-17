# Module 5 plan: Loops

Written 17 October 2026 after the author requested Module 5. The course continues under the
recommendations recorded in the main plan: A64, a trip computer and recorded GCC examples.

## Lessons and prior knowledge

Two lessons use the dashboard's brightness setting. Each tick halves its unsigned value,
dropping the remainder. This is the logical right shift already taught in Module 3.

1. **Counting up** (`counting-up`): identify the body of a loop, count its executions, follow
   the backward branch, and distinguish the entry test from the repeat test. Write a loop for
   an interval whose end is excluded. Predict returned values and instruction counts.
2. **Counting down** (`counting-down`): use `subs` and the flags it writes to repeat until zero.
   Compare the initial test in `while` with the final test in `do`. Diagnose an always-true
   unsigned comparison. Write a loop that stops when either ticks or brightness reaches zero.

The learner already knows register widths, unsigned wrap, `lsr`, arithmetic flags, comparisons,
labels, conditional branches, `cbz` and return. No new instruction is introduced. The new terms
are loop, body and iteration. Explain `>>=` and `++`/`--` when they first occur in the displayed C.
Memory, calls, the stack and multiply instructions remain outside these lessons.

## Evidence and programs

`module-5/listings.md` records the actual GCC 16.1.0 output at `-O1`, with source maps and raw
Compiler Explorer requests/responses under `module-5/compiler/`. `loops.listings.ts` keeps
compiler output separate from course-authored references and deliberately broken programs.

- `dim_up`: an unsigned interval guarded before its body. The loop's final test can use equality
  because the guard established order and the counter advances one at a time.
- `dim_down`: a zero guard followed by logical shift, subtraction with flags and a backward branch.
- `dim_do`: the same operation with the test after the body. Zero underflows the counter, causing
  a full counter cycle before return; this is finite, though too long for an interactive run.
- `dim_wrong`: the recorded GCC result for a comparison that is always true for an unsigned value.
  C's permission to assume termination in some loops must be distinguished from this compiler's
  output. N3096 section 6.8.5 supplies the qualification.
- Course-authored mistakes and references: a changed repeat condition, an unsigned comparison
  with zero after decrement, ordinary counting loops, and a loop that stops once brightness is zero.

The facts tests pin examples, counts, flags, boundary cases and the correspondence with recorded
listings. The differential corpus compares complete executions or explicitly bounded prefixes
with GNU as and QEMU. A bounded prefix does not establish whether execution eventually returns.

## Figures and challenges

Reuse the listing, prediction, stepper, editor and existing return/count grading components.
The stepper marks the next instruction after a backward branch. A new loop figure plots executed
body instructions against selected inputs and shows the brightness history from the simulator.
It distinguishes a returned run from an observed prefix stopped by the instruction budget.

Do not reuse the branch overview's aggregate taken/not-taken state for a loop: the same branch
can be taken repeatedly and then not taken. Count body instructions, not taken backward branches.
Keep figures gated by predictions and keep the final answer exercise's input pairs out of them.

Each lesson has a construction and a final challenge. Tests include no iterations, one iteration,
several iterations, reversed or equal interval endpoints, and unsigned boundary values. Near-limit
intervals finish in a few steps. The final countdown exits once the brightness is zero, so a maximum
tick argument does not require billions of simulated operations.

## Originality and scope

Avoid factorial, Fibonacci and summing a sequence as the teaching example. The dashboard setting
connects repeated shifts to the existing trip computer, then uses the zero brightness state to
justify a second exit. A repeated-distance-addition candidate was rejected because this GCC
setting introduced `madd`, outside the learner's current instructions.

The figures show architectural state and instruction execution counts, not processor timing.
The simulator deliberately stops long runs. Never label that limit as proof of an infinite loop.

## Drafting and review

Use the current process in `CLAUDE.md` and `docs/authoring.md`: checked facts, separate drafting,
accuracy and clarity editing, independent learner and technical reviews, then verification in
the built site. Use the session's selected model and inherited effort; no model override is needed.
Record accepted/rejected review findings and final validation in `module-5/review.md`.
