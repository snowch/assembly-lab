# C and assembly correspondence inventory

Technical inventory before the snippet-alignment change. Read `CLAUDE.md` and `docs/style.md`; inspected parsed lesson data and renderer implementations. This is a source review, not a browser review or a verdict on the eventual implementation.

## Scope

The 24 parsed lessons contain **104 distinct `{c, listing}` pairs**: **74 with C** and **30 assembly-only**. The C-backed pairs contain 295 tagged instruction occurrences. Fifty-one of those pairs have at least one compiler source tag pointing to a standalone brace, and ten have a source-tag sequence that moves backwards. These are diagnostic indicators, not counts of proven incorrect compiler metadata. All 74 C-backed pairs match exports from `content/lessons/*.listings.ts`; no independent inline C/listing records were found outside those modules. Repeated uses of a pair count once. Generated compiler results and standalone assembly strings are additional presentation paths.

| Lesson | Distinct pairs | With C | With brace tags |
| --- | ---: | ---: | ---: |
| meet-the-machine | 3 | 3 | 3 |
| one-pattern-three-readings | 3 | 3 | 0 |
| constants-and-widths | 4 | 1 | 0 |
| adding-and-the-flags | 2 | 0 | 0 |
| subtracting-and-the-tick-counter | 3 | 1 | 0 |
| masks | 7 | 5 | 0 |
| shifts | 5 | 4 | 0 |
| compare-and-choose | 5 | 4 | 0 |
| branches | 2 | 2 | 2 |
| counting-up | 2 | 2 | 2 |
| counting-down | 4 | 3 | 2 |
| memory-and-addresses | 7 | 6 | 6 |
| loading-widths | 12 | 10 | 10 |
| array-addresses | 6 | 2 | 2 |
| zero-terminated-strings | 3 | 1 | 1 |
| products-and-widths | 7 | 4 | 4 |
| division-and-remainders | 6 | 4 | 4 |
| calls-and-returns | 2 | 1 | 1 |
| recursive-calls | 2 | 1 | 1 |
| from-c-to-instructions | 2 | 2 | 0 |
| compile-a-loop | 2 | 2 | 0 |
| c-and-overflow | 4 | 3 | 3 |
| checked-arithmetic | 5 | 4 | 4 |
| same-c-on-a32 | 6 | 6 | 6 |

## Renderer coverage

- `ListingView` is the main shared renderer. Static listings, register/word/wide/memory/stack steppers, run/count/loop predictions, compiler playground, listing changes and answer-editor source listings use it. Today it shows full C and assembly in independent columns and highlights raw compiler source tags.
- `ListingPairFigure` has its own C-above-assembly renderer. It also marks differences between the two assembly listings, including optional common-instruction matching. It needs the same source correspondence treatment without losing those difference marks.
- `ListingCompare` has its own C panes and reveals its assembly comparison only after a prediction. Source correspondence must not reveal the hidden instructions early.
- `ListingDiff` intentionally compares assembly operands; `BranchListing` draws branch paths with fixed-height rows; `SelectStepper` intentionally suppresses C. These are assembly-focused views of programs, not currently promises of C/assembly row alignment. If C is added, preserve their path geometry, comparison marks and prediction gates.
- `CompilerPlayground` displays dynamically generated local compiler instructions through `ListingView`, but also has a separate next-instruction/source panel that reads `cLine`. Its local compiler has a real emitted `lineMap`. Optional online GCC output is currently plain text; do not invent a semantic mapping for arbitrary network output.
- `RecordedPrediction`, several arithmetic diagrams and solution editors show isolated assembly, rather than paired C. Keep them assembly-only where there is no honest C source association.

## Design constraints and recommendation

Keep the recorded GCC tag unchanged as compiler evidence. Add a separate reviewed source association for teaching. Display actual C text in shared rows with the instructions it explains; allow several instructions per C statement and multiple source lines per instruction. Preserve instruction order, label positions and stable instruction identity. Repeat a source fragment when the compiler returns to it later. Show the complete source separately so repeated fragments cannot be mistaken for the original C program order.

Do not sort instructions by C line: branches, loop tests and recursive returns are laid out in execution-block order. Do not map every brace tag to the preceding source line automatically: a function prologue saves registers, an epilogue restores them, and neither executes the nearest arithmetic expression. Represent this bookkeeping honestly, with an appropriate label or unmapped group. An instruction can support several statements: `subs` can decrement a loop counter and produce the flags for its test; pointer end-address setup can implement a loop bound; a shared return can serve several C return paths.

For a changed or broken assembly example that retains the original C, describe the association as the C the instructions are intended to implement. Do not imply that an intentionally wrong instruction is equivalent to that source statement. Existing prediction and challenge gates remain mandatory.

The principal implementation risks are:

1. `RecordedSchema` currently strips unknown fields. New source metadata must survive schema parsing, direct answer-editor reads and compiled-program conversion.
2. Positional metadata can drift when `deleteLine` removes an instruction, when a listing is combined with a second function or when an instruction is replaced. Carry source association with parsed instruction identity or explicitly update the transformed program's map.
3. Source wrapping on narrow screens changes row heights. Use one shared grid/group per correspondence; independent panes will drift again. A narrow layout should keep each C fragment directly before its instruction group.
4. Preserve next/last-run highlighting and its exact instruction identity, not just a C line shared by several instructions. Highlight the same source association in both the listing and any separate next-instruction panel.
5. Do not duplicate assembly into both visible and hidden DOM trees merely to provide source details. Existing tests and assistive readers may count or read the instructions twice.
6. Tests must verify the original instruction sequence and raw compiler tags survive unchanged, every paired snippet receives coverage, reordered/control-flow cases stay honest, and prediction-gated listings remain hidden until the learner answers.

## Cases needing particular semantic care

- `TRIP_DISTANCE`: subtraction belongs to displayed line 5; return control belongs to the return statement on line 6, although GCC tags both with line 7.
- `DIM_DOWN` / `DIM_DO`: decrement-and-flags contributes to both the decrement statement and the loop test.
- `SUM_TRIPS`: GCC uses an end pointer instead of decrementing `count`; do not claim a direct instruction for every original C statement.
- `LABEL_LENGTH`: the exhausted-capacity path can put `capacity` directly into the return register, rather than literally execute `length = 0` suggested by its raw tag.
- `REPORT` and `FADE_SUM`: saved registers, frame setup and shared returns need bookkeeping or multiple-source treatment; a nearest-line repair would be false.
- `CAN_INCREMENT`: optimised constant output represents the whole defined C result, not a visible arithmetic operation corresponding one-to-one with source.
- A32 division helper calls and register saving are not interchangeable with the A64 single division instruction, even though both implement the same C expression.
