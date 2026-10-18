# Independent technical review of source associations

Reviewed the alignment brief, inventory and all three mapping implementation
records, then independently read the C, assembly and new associations in every
static listing export. This is a source and semantic review. It does not claim
browser validation or replace the independent lesson readers.

## Coverage and checks

All **86 static exports with C** were checked, including exports used only by
facts tests or challenges. The count by listing file is:

| File | C-backed exports |
| --- | ---: |
| `meet-the-machine.listings.ts` | 3 |
| `module-1.listings.ts` | 5 |
| `adding-and-the-flags.listings.ts` | 1 |
| `subtracting-and-the-tick-counter.listings.ts` | 3 |
| `logic-shifts-masks.listings.ts` | 15 |
| `compare-and-choose.listings.ts` | 4 |
| `branches.listings.ts` | 2 |
| `loops.listings.ts` | 5 |
| `memory.listings.ts` | 16 |
| `arrays.listings.ts` | 3 |
| `products.listings.ts` | 8 |
| `calls.listings.ts` | 2 |
| `c-boundaries.listings.ts` | 13 |
| `a32.listings.ts` | 6 |

An independent script imported the current exports and the versions at HEAD.
It confirmed:

- All 86 C strings and listing strings are unchanged, byte for byte. That
  includes every original GCC source tag, instruction and label.
- Every map has exactly one entry per instruction, excluding labels. Every
  linked line is an integer within the displayed C source.
- All 35 assembly-only exports in these files remain without source maps.
- The 86 static exports match **70 of the 74 distinct C-backed pairs** in the
  parsed lesson inventory. Export counts include unused and repeated examples;
  they are not counts of distinct figures.

The remaining four used pairs are `TRIP`, `WRONG_TRIP`, `ACCUMULATED` and
`WRONG_ACCUMULATED` in `c-compiler.listings.ts`. A separate check loaded each
through Vite, compiled its own C and compared every instruction's association
with the compiler's emitted map. All four agreed: respectively 9, 7, 21 and 21
instruction associations. Removing the displayed C tags reproduced the local
compiler's listing exactly. The new `recordedC` loop skips labels and empty
lines when constructing instruction associations.

The temporary checks were `/tmp/snippet-mapping-review.mjs` and
`/tmp/snippet-dynamic-map-review.mjs`. These are review evidence, not repository
regression tests. No full suite, build or real-tool differential run was started
by this reviewer; this change does not alter the recorded instructions.

## Semantic conclusions

No correction to the 86 static maps is required. In particular:

- The introductory subtraction now links to its actual C subtraction, and
  `ret` links to the return statement. The two raw GCC C7 tags survive.
- Composite sources use displayed line positions, including the second
  function in the trip/fuel example and the four separate shift functions.
- One-line functions legitimately have several instructions linked to the
  same entire function line. This is a coarse relation, not a claim that C
  contains an explicit operation for every instruction.
- Decrement-and-flags instructions in the countdown loops link both the
  decrement and the condition. The shared returns in `DESCRIBE`,
  `SAFE_INCREMENT_BRANCH` and `FADE_SUM` link their alternative return
  statements; no closing brace is treated as an arithmetic operation.
- `SUM_TRIPS` uses an end pointer to implement the loop condition. Its pointer
  copy is unmapped support work, and no invented decrement instruction is
  attached to `count--`. Both the initial zero and zero-count result paths
  have defensible associations.
- `LABEL_LENGTH`'s shared capacity-to-result move covers two paths: zero
  initialisation when capacity is zero, and supplying the final length when
  capacity is reached. Linking lines 3 and 8 is a static relation over those
  paths, not a claim that both statements run at that instruction.
- Saved-register and frame operations in calls and recursion are unmapped.
  The shared recursive result move links both possible return statements.
- `PROMOTED_GRADIENT` links the sign extension of its incoming narrow
  parameter to the declaration, not to a nonexistent cast. The subsequent
  addition links to the return expression.
- Constant-folded comparisons and reciprocal multiplication link to the
  source expression they implement, without pretending that eliminated
  arithmetic still has a separate instruction.
- A32 division keeps its stack save unmapped. Its helper call implements the
  division, and its combined restore/return serves the explicit C return.
  The other A32 maps follow their conditional or constant return expressions.
- Void stores link the store to the assignment, while the implicit return
  remains unmapped because the displayed C has no return statement.

## Finding and disposition

The first version of the unmapped-instruction message said:

> No separate C statement. This instruction supports the function's other operations.

**Medium, corrected in source.** `FUEL_USED_WRONG_PLUS_12` intentionally inserts
an extra addition absent from the C. Its empty association is correct, but the
message claimed useful support work that this instruction does not perform.
The manager changed the message to:

> No C statement is linked to this instruction.

I re-read that change in `packages/views/src/strings.ts`; it accurately covers
bookkeeping, implicit returns and intentionally added instructions. Browser
confirmation belongs to the independent readers/checkers.

The changed-condition experiments `STEEPER_U_GE`, `DESCRIBE_BGE` and
`DIM_UP_BEQ` retain links to the operations the modified instructions are
intended to implement. This is defensible because each is explicitly introduced
as changed assembly in its existing lesson prose and captions. The shared
wording says that instructions “relate to” a line, rather than claiming exact
C equivalence. Do not strengthen that wording to promise equivalent execution.
These figures still require visual review with their surrounding explanation.

## Limits of this verdict

The maps are static source associations. Multiple linked lines do not specify
which path is active on a particular run, and mappings do not prove equivalence
for intentionally broken programs or C inputs with undefined behaviour. This
review does not certify row alignment, highlighting, prediction gates,
accessibility, phone wrapping or mapping preservation after interactive edits.
Those are renderer and browser-review responsibilities.
