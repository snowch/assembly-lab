# Shared interface implementation closure

Author: delegated shared UI agent; parent supplied independent review findings. Checked-fact brief: shared-brief.md. Read CLAUDE.md, docs/style.md and docs/authoring.md. No platform or lesson source files changed by this agent.

## Accepted fixes implemented

- S1: added shared Prediction/Calculation/Exercise/Experiment/Diagram role labels and Book roleNotes mapping. Calculation note explains column reveals are parts of one instruction. Lesson authors and parent apply roles to the appropriate figures.
- S2: tracked register writes now read Written / Written by the last instruction / was written, including Module0 read/write panel and arithmetic stepper. Flag and bit changes retain change wording because they compare values. Same-value write regression confirms destination remains marked and flags unmarked.
- S4: CompilerPlayground instruction status uses withCode, with the helper imported. Existing compiler test now advances and asserts a code span with no visible backticks.
- N3: ConstantTester accepts grouped hexadecimal digits, removes whitespace after validation, and passes normalized instruction to the assembler. Decimal grouping, malformed prefixes and instruction text remain rejected. The assembler still decides whether the constant fits; displayed instruction uses normalized form.
- N4: RunPrediction input registers have a visible Registers before the run label, retained after checking.
- N6: BitRow labels and values occupy separate rows at narrow widths. Before/after wording remains intact, desktop retains three-column layout.
- N13: optional memory.elementBytes and memory.firstElement declare array groups. Elements keep their byte addresses, values, access highlighting and transfer associations; four-byte elements do not split across diagram rows. No type inferred for ordinary memory. Schema rejects partial groups. Element index and grouping explanation live in strings.memory.ts. Middle author adds elementBytes4 to array examples and syncs canonical docs/tests.
- old L22: Tap mode message names Tap mode rather than chips.

## Verification

- 106 tests passed across module1Figures, module0, stepper.changes, memoryFigures and arith.figures.
- 45 initial compiler/strings/canonical checks passed; compiler first run caught a missing withCode import, corrected. Memory canonical initially lacked new grouping sentence, middle author synchronized it.
- Compiler and memory canonical rerun: 7 tests passed. Compiler test additionally extended to assert rendered code span/no literal backticks; final rerun recorded by parent or follow-up message.
- New meaningful regressions cover grouped hex vs malformed text/assembler refusal, same-value register write, and grouped memory bytes retaining write/rewind semantics.
- Independent browser checks required for temporal labels and grouped memory at375/1280 in both themes; parent arranging checkers against built snapshot. This author does not claim an independent verdict.

Canonical changes coordinated with early author for module2 register status and middle author for module6 new memory labels. No commit made.
