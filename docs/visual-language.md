# Visual language for Assembly Lab

**Status:** proposed design standard, 20 October 2026. Implement via the [visual audit and backlog](visual-audit.md); this document does not certify that existing figures have been reviewed or changed.

## Purpose

Assembly Lab teaches changes to registers, bits, flags, execution paths and memory. Whenever prose asks the reader to hold a layout or a sequence of changes in their head, consider a figure. Aim to **replace mental bookkeeping**, not decorate the page or duplicate the simulator.

The interactive machine is the source of truth. These rules extend, and never weaken, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the lesson term gates or the existing figure contracts.

The visual system must work across lessons, from the first `w0` example to calls and stack frames. **Reuse and unify the components already in `packages/views/src/`** before building new ones.

## Visual roles and semantics

| Role | Required treatment | Meaning |
| --- | --- | --- |
| **Read / source** | Dashed-outline chip or explicit `Read` label; optional muted tint | Current value consumed by this instruction |
| **Write / destination** | Solid, prominent outline or filled chip; explicit `Written` label | Register or memory location targeted by the instruction |
| **Value changed** | Before → after comparison plus `Changed` label/mark | Bits or value differ from before |
| **Written, unchanged value** | `Written; same value` mark, distinct from untouched | Instruction wrote a destination but produced identical bits |
| **Untouched** | Neutral style plus `Not written` only where needed | State not written at this step |
| **Next instruction** | Single, labelled execution marker | Program-counter position before the next step |
| **Instruction just executed** | Separate highlight from the next marker | The operation whose effects are visible |
| **Predicted / unknown** | Question/hidden state without result styling | Learner has not committed an answer |
| **Revealed result** | Normal destination/comparison treatment after gate | Computed result, not a guess |

Colour is **supplementary**. Do not use it alone to encode a read, write, bit change, branch choice, success, or error. Prefer the current application's `--accent`, `--accent-soft`, `--border`, `--border-strong`, `--bg-raised` and foreground tokens. The earlier conceptual palette (blue source, teal destination, amber changed, grey inactive) is a guide to contrast, **not a set of hard-coded hex colours**. If more semantic tokens are necessary, define them centrally, with light/dark and high-contrast checks.

The existing `.al-flow-source` dashed outline and `.al-flow-destination` solid accented outline are the starting point. Make other figures consistent with their meanings without regressing existing accessibility. **A write is not necessarily a change**: preserve this distinction in code, text and tests.

## Visual grammar

- **Registers:** monospaced `w0`, `w1`, `x0`; register *name* separate from current *contents*. Show `w0` and `x0` as views of the same register, never as two independent stores.
- **Bits:** align cells, label bit significance and group 32-bit patterns into four bytes; use a 32/32 split for 64-bit views where pedagogically helpful. Keep endian ordering explicit when moving from register bits to addressed memory.
- **Operands:** an instruction has an operation and ordered operands. Identify destination and sources in-place. The same register can be both source and destination; draw one pre-execution read and one post-execution write rather than implying two registers.
- **Movement:** solid arrowheads for data movement. Use a visually distinct, labelled treatment for branches/control flow; distinguish possible path from path actually taken.
- **Time:** before/after or step index must be visible whenever comparing state. If the reader clicks `Next`, the figure must make it clear what just ran and what runs next.
- **C-to-assembly mapping:** keep complete numbered C and checked instruction associations in the shared paired listing; never imply one C statement always equals one instruction. Preserve the project's horizontally contained layout on phones.
- **Typography:** code/values monospace; explanatory labels in normal text; short captions. Avoid all-caps label proliferation and tiny text in diagrams.
- **Shape/spacing:** use existing theme spacing and border-radius tokens. Prefer simple containers and whitespace over nested cards, repeated legends and elaborate illustrations.

## Figure anatomy

A teaching figure typically contains:

1. A short, specific title: what the learner is seeing.
2. The mechanism (bits, paths, mappings, state) in the primary visual.
3. A compact legend *only if* the marks are not already explained in place.
4. One takeaway/caption anchored to the actual state and moment being shown.
5. Controls adjacent to the part they change, with predictable focus and no surprise scrolling.

Keep essential definitions visible before first use. Do not force the reader to expand notes for information needed by the next question. After adding a visual, edit the prose **down**: remove duplicate explanation and keep brief instructions or technical qualifications that the visual cannot communicate accurately.

## Static explanation versus computed interactive

- **Static schematic:** appropriate for relationships such as argument positions or the general operand convention. It must not pretend to be an execution result; if it uses concrete machine values, trace them back to the model/recorded listing and pin them by tests.
- **Interactive view:** for state that could be computed (registers, flags, carry columns, instruction flow, byte layout, stack), use the real assembler/simulator and the existing view/trace helpers. Never script plausible changes independently.
- **Prediction gate:** a teaching illustration *before* the question may teach the general rule but must not expose that question's specific answer. A later reveal must use the same input/run unless explicitly labelled otherwise.
- **Accuracy:** show precisely the width, signedness and state moment of an example. C variable names are not architectural register names; don't imply permanent mappings when the register is reused.
- **Progressive disclosure:** Module 0 may show decimal registers and a basic instruction; Module 1 introduces bit readings. Do not give the reader vocabulary or notation a later lesson has not taught.

## Reuse targets in the current codebase

These are **existing components**, not a new implementation plan to duplicate them:

| Visual pattern | Existing starting point | Example use |
| --- | --- | --- |
| Function arguments → registers | `ArgsFigure` | Module 0 entry convention; Module 9 calling convention |
| Operand roles and in/out | `OperandRoles`, `StepperFigure` flow panel | Modules 0, 2, 3, 8 |
| Register and three readings | `RegisterReader`, `StepperFigure` | Modules 0–3, 6 |
| Bits, masks and arithmetic | `BitOpsFigure`, `AdderFigure`, `ShiftFigure`, `MaskView` | Modules 1–3 |
| Branches and loops | `BranchListing`, `LoopFigure`, `ConditionTable` | Modules 4–5 |
| Memory and addresses | `MemoryStepper`, `MemoryPrediction` | Modules 6–7 |
| Wide results | `ProductHalves`, `WideStepper` | Module 8 |
| Stack, calls, return | `StackStepper` | Module 9 |
| C and instruction comparison | `ListingPairFigure`, `ListingCompare`, `CompilerPlayground` | Modules 0, 10–11 |

Component names are implementation anchors, not a requirement to force unrelated figures into the same API. Extract shared primitives (register chip, operand mark, bit cell, before/after label, execution marker) only when real repeated use justifies them.

## First pilot: Module 0

1. **Where a variable is kept.** Keep the current `ArgsFigure` mapping of `leg1 → w0`, `leg2 → w1`, `leg3 → w2`, `detour → w3` as a reusable visual pattern. Check its layout at phone widths and distinguish parameter, register and live value. Cut prose that merely restates the mapping.
2. **Operands.** Keep `OperandRoles` as the basis for the in-place destination/source convention. Audit a visual read–operate–write sequence for `add w0, w0, w1`, clarifying that pre-read `w0` and post-write `w0` are the same register. Do not leak the prediction result.
3. **Stepping through.** Consolidate multi-paragraph instructions around the existing `StepperFigure`. Draw the last instruction's reads, write, before/after values and the next execution marker consistently; show untouched state without clutter. Make `Show the bits` a deliberate progressive reveal.
4. **Recent additions to harmonise:** `ArgsFigure.tsx`, `OperandRoles.tsx`, `StepperFigure.tsx` and the `al-args`, `al-operands`, `al-flow` and register styles in `module0.css`. These already exist; **review and align**, do not remake them.

## Authoring and review

For every implemented lesson and each newly proposed figure:

- Record *what the learner must currently imagine*, what the figure will make visible, and which prose is removed.
- Review the visual alongside its prediction, source listing, captions, feedback and simulator trace.
- Check all 10 lesson sections, especially the prediction → investigation transition; an answer should never appear early.
- View in light/dark, desktop/phone; ensure no page-level horizontal overflow, readable bit/address labels, touch targets, meaningful accessible names and reduced-motion support.
- Reuse semantic tokens and component primitives; test visual semantics as well as numeric output.
- Follow the existing independent reader, sceptic, technical reviewer and checker stages and `npm run check`.

A diagram is **done** when it eliminates an unnecessary mental step, is consistent with the real machine, leaves the page shorter or clearer, and survives independent learner review. Track proposed and completed work in [the visual audit](visual-audit.md).
