# Source associations for products, calls, C boundaries and A32

This implementation record covers the mappings in `products.listings.ts`,
`calls.listings.ts`, `c-boundaries.listings.ts` and `a32.listings.ts`. It is an
implementation account for independent technical review, not an independent
review or a browser verdict.

Each `sourceLines` entry belongs to one instruction, in original listing order;
labels consume no entry. The numbers address the displayed C, starting at one.
The original C, assembly and recorded GCC tags remain byte-for-byte unchanged.
The maps describe which C operations the instructions implement, rather than
claiming that GCC emitted these source references.

## Covered exports

- Products: `SCALE_PULSES`, `QUOTIENT_UNSIGNED`, `QUOTIENT_SIGNED`, `SCALED_TOTAL`,
  `REMAINDER_SIGNED`, `WIDE_SIGNED`, `WIDE_UNSIGNED`, `GROUPS_OF_TEN`.
- Calls: `REPORT`, `FADE_SUM`.
- C boundaries: `CAN_INCREMENT`, `CAN_INCREMENT_WRAP`, `INCREMENT_LIMIT`,
  `SAFE_INCREMENT_BRANCH`, `NARROW_FUEL`, `NARROW_GRADIENT`, `FUEL_FITS`,
  `CHECKED_TRIP`, `NEGATE_GRADIENT`, `UNSIGNED_SUM_OVERFLOW`, `UNSIGNED_SUB_WRAP`,
  `PROMOTED_GRADIENT`, `MIXED_LIMIT`.
- A32 comparison: `LIMIT_TRIP_A32`, `LIMIT_TRIP_A64`, `SERVICE_MARKER_A32`,
  `SERVICE_MARKER_A64`, `AVERAGE_TRIP_A32`, `AVERAGE_TRIP_A64`.

There are 29 static C-backed exports in these files. Their assembly-only exports
remain without source associations.

## Semantic cases

The product and division examples each have one return expression. All their
instructions, including the return of control, serve that statement. In
`GROUPS_OF_TEN`, constructing the reciprocal constant, multiplying and shifting
all implement division by ten; this does not claim that C contains each of those
individual operations. In `REMAINDER_SIGNED`, the division and multiply-subtract
together implement the remainder expression.

`REPORT` includes two functions. The shift and first return serve line 3. The
call, addition and final return serve line 7. Frame setup, stack saving/restoring
and the move preserving `reserve` across the call are bookkeeping, with empty
associations. They do not execute either C return expression.

`FADE_SUM` first saves registers and preserves `brightness` across a possible
recursive call; these have empty associations. The conditional branch tests
line 3. The shared move to the return register and shared return of control
serve both return statements, lines 4 and 5. The shift, recursive call, addition
and branch into that shared return sequence serve line 5. The shared result
move therefore does not pretend that the closing brace performs an addition,
and the zero path does not pretend to execute the recursive expression.

`SAFE_INCREMENT_BRANCH` shares its final return between lines 5 and 6. Its
constant, comparison and conditional branch serve the line 4 condition; the
addition serves line 6. `CAN_INCREMENT` represents the optimised result of the
whole return expression, not a remaining addition instruction. The wrapping
variant, limit checks, conversions, checked addition and unsigned comparisons
are associated with their respective return expressions.

`PROMOTED_GRADIENT` is the exception to the single-expression arrangement:
`sxtb` enforces the signed-char parameter value declared on line 1 before the
addition on line 3. Its raw GCC tag is the opening brace, line 2. The teaching
association is line 1; it is not an invented source-level cast in line 3.

In the A32 division listing, `push` is unmapped register-saving bookkeeping;
the helper call serves the division expression on line 3. `pop {r4, pc}` both
restores a saved register and returns control, so it maps to the explicit
return statement on line 3. The equivalent A64 instruction and `ret` both map
to that same statement. A32 conditional moves and A64 conditional selection
serve their shared C conditional expression without implying identical
instruction sequences.

## Locally compiled examples

`c-compiler.listings.ts` needs no hand-authored maps. Its `TRIP`, `ACCUMULATED`,
`WRONG_TRIP` and `WRONG_ACCUMULATED` exports call `compiledProgram`, which invokes
`compileC` and `recordedC`. The common `recordedC` conversion must attach the
compiler's actual emitted source map. This preserves the changed-source cases
and arbitrary learner edits without duplicating a positional table here.

## Checks performed

A structural check decoded all 29 C/listing pairs, counted instruction lines
excluding labels, confirmed one map entry per instruction and checked every
source reference against the displayed C line count. Removing the added
`sourceLines` properties reproduced each original file exactly. Prettier passed
for the four edited listing files. No compiler records, execution semantics,
standalone assembly or learner prose changed in this subtask.
