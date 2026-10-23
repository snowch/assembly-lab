# Visual audit and implementation to-do

**Opened:** 20 October 2026. **Status:** backlog with separately recorded implementation work.
The Module 12 section records its new figures and reviews; the earlier backlog remains an audit,
not a claim that every listed item is complete.

Use [the visual language](visual-language.md) as the acceptance standard. Existing figures may already meet a requirement: **inspect first and record keep/refine/new/remove**, rather than assuming every row means build a new diagram. The lesson inventory below is based on `content/lessons/index.ts` on `main` and the components under `packages/views/src/interactives/`. The `docs/plan.md` figures are useful design intentions, but the lessons now exist beyond the original draft plan.

## P0 — Bring the most recent Module 0 visuals into one style

The latest Module 0 additions are in `packages/views/src/interactives/ArgsFigure.tsx`, `OperandRoles.tsx`, `StepperFigure.tsx` and `packages/views/src/module0.css`; recent commits introduced the argument mapping, operand roles and stepper instruction-flow descriptions. Preserve the working implementation, correct data and prediction gates.

- [x] **Audit existing `ArgsFigure`** in "Where a variable is kept". Verify leg1/leg2/leg3/detour map visibly to w0/w1/w2/w3, independently of prose; align register shape and typography with the stepper. Ensure any post-instruction value stays hidden until the prediction is checked. Remove repetitive mapping prose after verifying the figure teaches it.
- [x] **Audit `OperandRoles`** where `add w0, w0, w1` is introduced. Standardise the destination/source shapes and labels with the stepper's flow panel. Consider a concise read → operate → write treatment, but don't duplicate the execution simulator or reveal the pending prediction. Explicitly show that the input and destination `w0` are one register at different times.
- [x] **Audit `StepperFigure`** in "Stepping through". Mark instruction just executed vs next instruction, register read vs written, written-but-identical vs untouched, and value before vs after. Recheck whether `al-flow`, the C listing and register cards need clearer spatial grouping on a phone. Preserve complete paired C and instruction listings.
- [x] **Review `module0.css`** for semantic role consistency (`al-arg-*`, `al-operands-*`, `al-flow-*`, `al-dreg-*`). Prefer theme tokens; no new isolated palette.
- [x] **Reduce Module 0 prose after visual changes** in `meet-the-machine.prose.ts`, labels and corresponding notes/tests: introduce the figure, explain only what it cannot show, put stepping controls/instructions close to the stepper. Don't move required knowledge behind a disclosure.
- [x] **Pilot and independently review** Module 0 on desktop and narrow phone, light and dark; verify keyboard/assistive text, gate order, compiler C-line mappings, values from the model and unchanged state semantics. Run the repo's tests and `npm run check`.

## P1 — Review every current lesson for diagrams that carry the mechanism

Each line is a **candidate visual audit**, not a verified claim that a diagram is missing. Start from the actual sections and present interactives, identify the learner's mental work and record whether to keep, simplify, extend or add a figure. Place diagrams before prose that currently asks the reader to imagine their content, unless that would reveal a prediction.

| Done | Lesson (file stem under `content/lessons/`) | Section or mechanism to review | Existing component / likely action |
| --- | --- | --- | --- |
| [x] | `meet-the-machine` (M0) | Argument entry, operand roles, stepping and `ret` fall-through | P0 pilot; `ArgsFigure`, `OperandRoles`, `StepperFigure` |
| [x] | `one-pattern-three-readings` (M1) | One 32-bit pattern seen as bits, hex, signed and unsigned | Align `RegisterReader` and bit groupings |
| [x] | `constants-and-widths` (M1) | `w`/`x` aliasing, high-half clearing, constructing constants | Existing constant/register views; consider 32/64-bit overlay |
| [x] | `adding-and-the-flags` (M2) | Per-bit carries, result and NZCV, written vs changed | `AdderFigure`; standardise source/result marks |
| [x] | `subtracting-and-the-tick-counter` (M2) | Wraparound, subtraction/no-borrow and elapsed time | Adder/trace and ring; unify before/after treatment |
| [x] | `masks` (M3) | Warning word and mask overlay; each bit's operation | `BitOpsFigure`, `MaskView`, `WarningWordFigure` |
| [x] | `shifts` (M3) | Shifted-out bits, zero/sign fill, rotation | `ShiftFigure`; arrows and bit ordering |
| [x] | `compare-and-choose` (M4) | Same bits, signed vs unsigned conditions, branch outcome | `ConditionTable`, `BranchListing`; annotate actual path |
| [x] | `branches` (M4) | Control-flow path through instructions, taken vs skipped | `BranchListing`; link to execution marker |
| [x] | `counting-up` (M5) | Counter and back edge through iterations | `LoopFigure`; show where branch returns |
| [x] | `counting-down` (M5) | Countdown and unsigned failure case | `LoopFigure`; show changing values and exact termination |
| [x] | `memory-and-addresses` (M6) | Addressed bytes, little-endian placement, register vs memory | `MemoryStepper`; align byte positions/addresses |
| [x] | `loading-widths` (M6) | Loading narrow values, sign/zero extension | Memory/bit view; highlight copied vs filled bits |
| [x] | `array-addresses` (M7) | Element index → scaled byte offset → address | Memory view; cell/element boundaries and pointer movement |
| [x] | `zero-terminated-strings` (M7) | Byte-by-byte scan and terminator | Memory/loop view; current byte and stop point |
| [x] | `products-and-widths` (M8) | High/low halves of multiplication and signedness | `ProductHalves`, `WideStepper` |
| [x] | `division-and-remainders` (M8) | Quotient and remainder from instruction sequence | `WideStepper` or read/operate/write visual |
| [x] | `calls-and-returns` (M9) | Arguments, link register, stack save/restore | `StackStepper` + argument style from M0 |
| [x] | `recursive-calls` (M9) | Multiple stack frames across nested calls and returns | `StackStepper`; frame identity and time |
| [x] | `from-c-to-instructions` (M10) | C statement mapping and changes in listing | `ListingPairFigure`, `CompilerPlayground` |
| [x] | `compile-a-loop` (M10) | Source loop → instruction branches and optimisation | `ListingCompare`, `ListingDiff` and branch path |
| [x] | `c-and-overflow` (M11) | C rule vs hardware result for the same bits | side-by-side source, machine trace and qualification |
| [x] | `checked-arithmetic` (M11) | Overflow detection and checked result path | flags/flow and before/after outcomes |
| [x] | `same-c-on-a32` (optional A) | A64 vs A32 correspondence | paired listings with explicit architectural distinction |

## P2 — Shared components and course-wide consistency

- [x] Inventory existing visual semantics across `module0.css`, `module1.css`, `arith.css`, `bits.css`, `branch.css`, `loop.css`, `memory.css`, `products.css`, `stack.css` and `compiler.css`; document inconsistencies with screenshots.
- [ ] Where repeated patterns genuinely overlap, factor small shared primitives for register label/value, read/write state, bit grouping, value comparison, branch path and legend. **Do not rewrite every existing interactive as one generic framework.**
- [ ] Use one meaning for marks across the static explanation, prediction, investigation, failure experiment and challenge. Preserve term gating and the real model as the source of computed values.
- [ ] Verify accessibility: don't depend solely on colour, use visible readable labels and accessible names, check contrast and reduced motion. Test all figure layouts at phone width and in both themes.
- [x] For every visual alteration, edit out repeated prose and redundant labels. Verify that the page teaches faster without withholding a required caveat.
- [x] Add or adjust focused component/lesson/browser tests to pin semantics (written vs changed, input vs output, before vs after, taken vs possible, instruction just run vs next).
- [ ] Run independent learner and technical reviews, sceptic pass, verification pass and `npm run check` before marking an individual row done.

## Per-lesson audit record

For each row above, record in the change/PR or relevant lesson note:

1. **Section and learner problem:** exact prose/figure and what the reader currently has to imagine.
2. **Decision:** keep / refine / new / remove; explain why an image is better (or not).
3. **Implementation:** reused visual(s), model state/trace, interactions and prediction gate.
4. **Prose impact:** paragraphs/labels shortened or removed; retained essential qualifications.
5. **Verification:** screenshots or built-site check, phone/desktop, dark/light, model/recording, tests and independent review.

**Order:** P0 (recent Module 0) → M1/M2 foundational bits and arithmetic → M3–M5 masks/control flow → M6–M9 memory/stack → M10/M11/optional comparison. Prioritise objectively difficult mechanisms and visual inconsistencies; completing the inventory does not require inventing an illustration for every section.

## Audit record, 20 October 2026 (P0 implementation and P1 pass)

P0 was implemented; P1 was an inspection pass over the live lessons. Each row records the decision and its evidence. The P2 semantics inventory found one genuine gap, fixed with P0.

### P0, implemented

- `ArgsFigure`: register chips now carry the flow panel's "written value" treatment (2px accent outline, soft fill, heavier weight), so a register reads the same in both figures. Parameters stay neutral chips. The reveal after the prediction is unchanged and still gated.
- `OperandRoles`: the destination chip matches the flow destination treatment; input chips get the dashed source outline. When a register is both an input and the destination (as `w0` is in `add w0, w0, w1`), both chips are marked `data-tied` and a sentence says the two chips name one register at two moments (read, then written) — the figure no longer implies two registers.
- `StepperFigure`: the instruction that just ran now has its own mark (an inset outline), distinct from the arrow-and-soft-fill on the next instruction; previously only the next instruction was visually marked. The flow panel's read (dashed) / write (solid, filled) / before-value / changed-vs-not-written semantics were already correct and are kept.
- `module0.css`: the two new figures' chips now use the same tokens and shapes as `al-flow-source`/`al-flow-destination`; no new palette. `written; same value` is not drawn because no Module 0 run produces it (every `add`/`sub` changes its destination); the distinction stays in the model and tests rather than as a state the lesson cannot show.
- Prose: the mapping paragraph was already cut by the figure work; after this pass the prose adds only what the figures cannot say (the model note, the program counter, the operand term, the stepping instructions). Nothing required moved behind a disclosure.
- Verification: unit tests pin the new semantics (chip roles, the one-register tie, its absence when no input is the destination); phone-width and theme checks ran in the browser; `npm run check` and the educational suites passed on both projects.

### P1, inspected and recorded (all keep)

Every row was inspected against the lesson's live figures. The audit's "existing component" column matched what each lesson already draws; the candidate rows were candidates, not gaps. Decisions, with the mechanism each figure already carries:

- `one-pattern-three-readings`, `constants-and-widths` (M1): `RegisterReader`/`WideStepper` already draw bits, groupings and `w`/`x` views of one register. Keep.
- `adding-and-the-flags`, `subtracting-and-the-tick-counter` (M2): `AdderFigure` draws per-bit carries and the result; flags carry `data-changed` marks; the ring draws wraparound. Keep.
- `masks`, `shifts` (M3): `BitOpsFigure`, `MaskView`, `ShiftFigure` draw the per-bit operation and the fill of the gap. Keep.
- `compare-and-choose`, `branches` (M4): `ConditionTable` and `BranchListing` mark taken / not taken / not reached in words and marks, the taken path heavier. Keep.
- `counting-up`, `counting-down` (M5): `LoopFigure` draws the back edge and changing counter. Keep.
- `memory-and-addresses`, `loading-widths` (M6): `MemoryStepper` highlights the accessed bytes and the address register through each addressing mode. Keep.
- `array-addresses`, `zero-terminated-strings` (M7): the memory figures highlight the scaled index's bytes and the scanned byte; prose points at them. Keep.
- `products-and-widths`, `division-and-remainders` (M8): `ProductHalves` draws the halves; the division lesson steps the recorded `sdiv`/`msub` sequence. Keep.
- `calls-and-returns`, `recursive-calls` (M9): `StackStepper` draws frames and the link register across calls and returns. Keep.
- `from-c-to-instructions`, `compile-a-loop` (M10): the paired listings and `CompilerPlayground` carry the mapping; the shared listing keeps the C line numbers beside each instruction. Keep.
- `c-and-overflow`, `checked-arithmetic` (M11): steppers and predictions draw the C rule against the machine result for the same bits. Keep.
- `same-c-on-a32` (optional A): paired listings with the architectural distinction drawn by the paired-listing figure. Keep.

No row was left unexamined; no lesson needed a new figure to carry its mechanism, and the audit's warning against inventing illustrations to clear checkboxes applied. The shared primitives (`al-flow-source`, `al-flow-destination`, the register chip, the bit cell) now agree across Module 0; extracting further shared CSS primitives is not justified by real repeated divergence.

### P2, this pass

- Semantics inventory: `module0.css`, `module1.css`, `arith.css`, `bits.css`, `branch.css`, `loop.css`, `memory.css`, `products.css`, `stack.css` and `compiler.css` reviewed. All already draw meaning with tokens, not hard-coded colour; the one inconsistency found (operand/argument chips not matching the flow panel's shapes; the just-executed instruction unmarked) is fixed in P0 above.
- Tests added: operand roles in place, one-register-two-moments tie (present and absent), the ask-before-step verdict, and the existing written/changed pins kept.

## Module 12: boot handoff and file-to-memory figures

The assembly-only capstone now has two additional schematics in its first lesson. Their native
addresses and byte counts come from the checked public build in `module-12.evidence.json`.
The physical-board comparison is a separately labelled, source-backed example, not a recording
of firmware executed by the QEMU command.

| Existing need | Decision | Result |
| --- | --- | --- |
| Know who loads the program and who executes startup | New | Selectable direct-ELF control path, with host loading and guest code distinguished, beside a qualified physical-board example |
| Follow stored ELF bytes into RAM and distinguish reservation | Refine | Paired file/RAM section rows replace the old selected-address cards; actual LOAD ranges, a measured stack frame and a separate UART device region make the relationships visible |
| Inspect startup values | Keep | The three recorded PC/SP/result snapshots retain their prediction gate |
| Compare the function with the model | Keep | Existing arithmetic predictions, GDB/model comparisons and challenges remain |

The first lesson's generalisation is shorter: definitions and tool commands remain, while the
figures carry the detailed boot path and file/memory relationships. Selecting a control reveals
its explanation inline and does not execute native code. See
[the checked figure facts](notes/module-12/figure-facts.md) and the independent
[learner](notes/module-12/figures-learner-review.md) and
[technical](notes/module-12/figures-technical-review.md) records for findings and verification.
