# Visual audit and implementation to-do

**Opened:** 20 October 2026. **Status:** backlog; no lesson changes are claimed complete here.

Use [the visual language](visual-language.md) as the acceptance standard. Existing figures may already meet a requirement: **inspect first and record keep/refine/new/remove**, rather than assuming every row means build a new diagram. The lesson inventory below is based on `content/lessons/index.ts` on `main` and the components under `packages/views/src/interactives/`. The `docs/plan.md` figures are useful design intentions, but the lessons now exist beyond the original draft plan.

## P0 — Bring the most recent Module 0 visuals into one style

The latest Module 0 additions are in `packages/views/src/interactives/ArgsFigure.tsx`, `OperandRoles.tsx`, `StepperFigure.tsx` and `packages/views/src/module0.css`; recent commits introduced the argument mapping, operand roles and stepper instruction-flow descriptions. Preserve the working implementation, correct data and prediction gates.

- [ ] **Audit existing `ArgsFigure`** in "Where a variable is kept". Verify leg1/leg2/leg3/detour map visibly to w0/w1/w2/w3, independently of prose; align register shape and typography with the stepper. Ensure any post-instruction value stays hidden until the prediction is checked. Remove repetitive mapping prose after verifying the figure teaches it.
- [ ] **Audit `OperandRoles`** where `add w0, w0, w1` is introduced. Standardise the destination/source shapes and labels with the stepper's flow panel. Consider a concise read → operate → write treatment, but don't duplicate the execution simulator or reveal the pending prediction. Explicitly show that the input and destination `w0` are one register at different times.
- [ ] **Audit `StepperFigure`** in "Stepping through". Mark instruction just executed vs next instruction, register read vs written, written-but-identical vs untouched, and value before vs after. Recheck whether `al-flow`, the C listing and register cards need clearer spatial grouping on a phone. Preserve complete paired C and instruction listings.
- [ ] **Review `module0.css`** for semantic role consistency (`al-arg-*`, `al-operands-*`, `al-flow-*`, `al-dreg-*`). Prefer theme tokens; no new isolated palette.
- [ ] **Reduce Module 0 prose after visual changes** in `meet-the-machine.prose.ts`, labels and corresponding notes/tests: introduce the figure, explain only what it cannot show, put stepping controls/instructions close to the stepper. Don't move required knowledge behind a disclosure.
- [ ] **Pilot and independently review** Module 0 on desktop and narrow phone, light and dark; verify keyboard/assistive text, gate order, compiler C-line mappings, values from the model and unchanged state semantics. Run the repo's tests and `npm run check`.

## P1 — Review every current lesson for diagrams that carry the mechanism

Each line is a **candidate visual audit**, not a verified claim that a diagram is missing. Start from the actual sections and present interactives, identify the learner's mental work and record whether to keep, simplify, extend or add a figure. Place diagrams before prose that currently asks the reader to imagine their content, unless that would reveal a prediction.

| Done | Lesson (file stem under `content/lessons/`) | Section or mechanism to review | Existing component / likely action |
| --- | --- | --- | --- |
| [ ] | `meet-the-machine` (M0) | Argument entry, operand roles, stepping and `ret` fall-through | P0 pilot; `ArgsFigure`, `OperandRoles`, `StepperFigure` |
| [ ] | `one-pattern-three-readings` (M1) | One 32-bit pattern seen as bits, hex, signed and unsigned | Align `RegisterReader` and bit groupings |
| [ ] | `constants-and-widths` (M1) | `w`/`x` aliasing, high-half clearing, constructing constants | Existing constant/register views; consider 32/64-bit overlay |
| [ ] | `adding-and-the-flags` (M2) | Per-bit carries, result and NZCV, written vs changed | `AdderFigure`; standardise source/result marks |
| [ ] | `subtracting-and-the-tick-counter` (M2) | Wraparound, subtraction/no-borrow and elapsed time | Adder/trace and ring; unify before/after treatment |
| [ ] | `masks` (M3) | Warning word and mask overlay; each bit's operation | `BitOpsFigure`, `MaskView`, `WarningWordFigure` |
| [ ] | `shifts` (M3) | Shifted-out bits, zero/sign fill, rotation | `ShiftFigure`; arrows and bit ordering |
| [ ] | `compare-and-choose` (M4) | Same bits, signed vs unsigned conditions, branch outcome | `ConditionTable`, `BranchListing`; annotate actual path |
| [ ] | `branches` (M4) | Control-flow path through instructions, taken vs skipped | `BranchListing`; link to execution marker |
| [ ] | `counting-up` (M5) | Counter and back edge through iterations | `LoopFigure`; show where branch returns |
| [ ] | `counting-down` (M5) | Countdown and unsigned failure case | `LoopFigure`; show changing values and exact termination |
| [ ] | `memory-and-addresses` (M6) | Addressed bytes, little-endian placement, register vs memory | `MemoryStepper`; align byte positions/addresses |
| [ ] | `loading-widths` (M6) | Loading narrow values, sign/zero extension | Memory/bit view; highlight copied vs filled bits |
| [ ] | `array-addresses` (M7) | Element index → scaled byte offset → address | Memory view; cell/element boundaries and pointer movement |
| [ ] | `zero-terminated-strings` (M7) | Byte-by-byte scan and terminator | Memory/loop view; current byte and stop point |
| [ ] | `products-and-widths` (M8) | High/low halves of multiplication and signedness | `ProductHalves`, `WideStepper` |
| [ ] | `division-and-remainders` (M8) | Quotient and remainder from instruction sequence | `WideStepper` or read/operate/write visual |
| [ ] | `calls-and-returns` (M9) | Arguments, link register, stack save/restore | `StackStepper` + argument style from M0 |
| [ ] | `recursive-calls` (M9) | Multiple stack frames across nested calls and returns | `StackStepper`; frame identity and time |
| [ ] | `from-c-to-instructions` (M10) | C statement mapping and changes in listing | `ListingPairFigure`, `CompilerPlayground` |
| [ ] | `compile-a-loop` (M10) | Source loop → instruction branches and optimisation | `ListingCompare`, `ListingDiff` and branch path |
| [ ] | `c-and-overflow` (M11) | C rule vs hardware result for the same bits | side-by-side source, machine trace and qualification |
| [ ] | `checked-arithmetic` (M11) | Overflow detection and checked result path | flags/flow and before/after outcomes |
| [ ] | `same-c-on-a32` (optional A) | A64 vs A32 correspondence | paired listings with explicit architectural distinction |

## P2 — Shared components and course-wide consistency

- [ ] Inventory existing visual semantics across `module0.css`, `module1.css`, `arith.css`, `bits.css`, `branch.css`, `loop.css`, `memory.css`, `products.css`, `stack.css` and `compiler.css`; document inconsistencies with screenshots.
- [ ] Where repeated patterns genuinely overlap, factor small shared primitives for register label/value, read/write state, bit grouping, value comparison, branch path and legend. **Do not rewrite every existing interactive as one generic framework.**
- [ ] Use one meaning for marks across the static explanation, prediction, investigation, failure experiment and challenge. Preserve term gating and the real model as the source of computed values.
- [ ] Verify accessibility: don't depend solely on colour, use visible readable labels and accessible names, check contrast and reduced motion. Test all figure layouts at phone width and in both themes.
- [ ] For every visual alteration, edit out repeated prose and redundant labels. Verify that the page teaches faster without withholding a required caveat.
- [ ] Add or adjust focused component/lesson/browser tests to pin semantics (written vs changed, input vs output, before vs after, taken vs possible, instruction just run vs next).
- [ ] Run independent learner and technical reviews, sceptic pass, verification pass and `npm run check` before marking an individual row done.

## Per-lesson audit record

For each row above, record in the change/PR or relevant lesson note:

1. **Section and learner problem:** exact prose/figure and what the reader currently has to imagine.
2. **Decision:** keep / refine / new / remove; explain why an image is better (or not).
3. **Implementation:** reused visual(s), model state/trace, interactions and prediction gate.
4. **Prose impact:** paragraphs/labels shortened or removed; retained essential qualifications.
5. **Verification:** screenshots or built-site check, phone/desktop, dark/light, model/recording, tests and independent review.

**Order:** P0 (recent Module 0) → M1/M2 foundational bits and arithmetic → M3–M5 masks/control flow → M6–M9 memory/stack → M10/M11/optional comparison. Prioritise objectively difficult mechanisms and visual inconsistencies; completing the inventory does not require inventing an illustration for every section.
