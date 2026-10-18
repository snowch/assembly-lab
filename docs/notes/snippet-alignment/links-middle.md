# Checked source associations: comparison, branches, loops and memory

This pass adds `sourceLines` to all 30 exports with C in the five files below.
Each entry corresponds to one instruction, excluding labels. Numbers refer to
lines of the displayed C. The original C, assembly text and GCC `C` tags are
unchanged. These associations identify operations served by an instruction;
they are not new compiler debug records.

## Covered exports

- `compare-and-choose.listings.ts`: `STEEPER_S`, `STEEPER_U`, `STEEPER_BOTH`,
  `STEEPER_U_GE`.
- `branches.listings.ts`: `DESCRIBE`, `DESCRIBE_BGE`.
- `loops.listings.ts`: `DIM_UP`, `DIM_DOWN`, `DIM_DO`, `DIM_WRONG_GCC`,
  `DIM_UP_BEQ`.
- `memory.listings.ts`: `READ_DISTANCE`, `SAVE_DISTANCE`, `READ_FUEL`,
  `READ_GRADIENT`, `READ_PULSE`, `READ_OFFSET`, `READ_OFFSET_LONG`,
  `READ_GRADIENT_LONG`, `READ_LONG`, `SAVE_FUEL`, `SAVE_PULSE`, `SAVE_LONG`,
  `SIGNED_BYTE`, `UNSIGNED_BYTE`, `SIGNED_LONG`, `ADD_ADJUSTMENT`.
- `arrays.listings.ts`: `READ_TRIP`, `SUM_TRIPS`, `LABEL_LENGTH`.

Assembly-only programs retain no C associations. The edited failure experiments
reuse the associations of the corresponding original operations, without a claim
that the altered condition implements the C correctly.

## Cases requiring more than a single source line

The comparison examples contain their entire function on one C line. Their three
instructions associate with that line. In `STEEPER_BOTH`, only the first function
produced the displayed assembly, so the second C line has no association.

In `DESCRIBE`, `cmn` tests the second C condition on line 5. Loading `-2` serves
line 6, and `csel` combines the condition and the two possible results on lines
5, 6 and 7. The shared `ret` serves all three return statements, lines 4, 6 and
7. The final branch transfers to that shared return and associates with line 4.
No association uses the closing brace merely because GCC tagged it.

In `DIM_DOWN`, `subs` both decrements `ticks` and supplies flags for the loop
test. It therefore associates with lines 4 and 6. In `DIM_DO`, the equivalent
instruction associates with lines 6 and 7. The conditional branches associate
with their loop conditions. `DIM_WRONG_GCC` contains only an unconditional loop:
the optimised-away shift and decrement acquire no invented instructions.

The memory readers, casts and addition put their result in the result register
before `ret`. Both instructions associate with their explicit return statement.
For void stores, `str` associates with the assignment and `ret` has an empty
association because the displayed C has no explicit return statement.

In `SUM_TRIPS`, moving the incoming pointer out of the result register is support
work and has an empty association. GCC changes the count-based loop into an
end-pointer loop. The endpoint calculation and pointer comparison serve the
loop condition. The postindexed load and addition serve the array-read,
pointer-increment and accumulation statement on line 5. There is no separate
instruction that decrements `count`; line 6 consequently has no direct
association. The zero-count path copies the known-zero count to the result
register, implementing the initial `total = 0` on line 3. Its branch serves the
return on line 8.

In `LABEL_LENGTH`, the first pointer copy is support work. The load and zero-test
serve the termination check on line 5. The later `mov x0, x1` has two purposes:
for an initially zero capacity, it implements the zero initialisation; when the
loop has reached capacity, it provides that final length as the result. It
therefore associates with lines 3 and 8. This is a static relation covering both
paths, not a claim that both source operations execute every time it runs.

## Verification

- Imported all five listing modules and checked every C-backed export for a
  complete instruction-count match and in-range integer C line references:
  30 exports passed.
- Ran the five existing facts test files: 230 tests passed. These retain checks
  against recorded compiler listings and simulator behaviour.
- Formatted the five edited TypeScript files with Prettier.

The mapping decisions still require the independent technical review described
in the alignment brief. This note does not claim browser validation.
