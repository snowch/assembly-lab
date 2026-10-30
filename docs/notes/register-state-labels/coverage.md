# Register-state label inventory

Source inventory for the 30 October 2026 change. The search covered every interactive registered
in `packages/views/src/interactives/index.ts`, every `viewAt`/`stateAfter` use in view components,
every shared `RegisterRow`, `DecimalRegister` and `RegisterSummary` use, and custom register/bit
bank markup. No `platform/` source changes are needed.

## Executing register banks

All entries below use `RegisterStateLabel` and the same `StepView` from which their bank reads
its values. The component adds one ordinary paragraph, without another heading or live region.
The existing specialised headings and execution statuses remain.

| Interactive kind / component | Bank and modes | State-changing paths |
| --- | --- | --- |
| `stepper` / `StepperFigure` | `.al-registers`, decimal and bits, including registers-first and compact modes | Next, Back, Reset, prediction gate, removed-instruction switch, update handoff |
| `word-stepper` / `WordStepperFigure` | `.al-bitrows`, all registers together | Next, Back, Reset, call selection, prediction gate, update handoff |
| `wide-stepper` / `WideStepper` | `.al-wide`, `x64`, `x64-named` and `w16` | Next, Back, Reset, saved-solution gate, prediction gate, update handoff |
| `memory-stepper` / `MemoryStepper` | `.al-memory-registers`; extension/array/case modes share this bank | Next, Back, Reset, case selection, prediction gate, update handoff |
| `stack-stepper` / `StackStepper` | `.al-memory-registers`, stack pointer plus named registers | Next, Back, Reset, range position, `initialStep` preset, prediction gate, update handoff |
| `select-stepper` / `SelectStepper` | `.al-registers`; recorded/saved-solution choice | Next, Back, Reset, prediction/solution gates, update handoff |
| `solution-stepper` / `SolutionStepper` | `.al-cellrows`; completed instruction's affected register(s) | Next, Back, Reset, saved source and call selection, update handoff |
| `compiler-playground` / `CompilerPlayground` | `.al-c-registers` after successful local compilation | Next, Back, Reset, compiled source/arguments, update handoff |
| `primitive-operation` / `PrimitiveOperation` | `.al-primitive-call-registers` in function mode; `.al-primitive-registers` in multi-instruction operation mode | Run/check, Reset, restored lesson slot; artificial prefix boundary remains After the completed instruction |
| `returning-to-caller` / `ReturningToCaller` | `.al-returning-registers`, preserving “Registers shared by caller and function” | Next, Back, Reset; local position zero retains “Before the call”, keeping the hidden prologue outside this lesson; subsequent positions use the absolute trace position including `startStep` and migrated stored positions; prefix `endStep` does not imply return |
| `native-tools` / `NativeFigure` | `[data-native-side=model] .al-memory-registers` only, preserving browser-model title | Next, Back, Reset, prediction gate, update handoff |

`RegisterStateLabel` names `trace.result.steps[view.k - 1].text`, the completed instruction, so
branches, repeated instructions and skipped lines follow the actual execution trace. Zero
completed instructions gives “Before the first instruction”; only `view.stop.kind === returned`
gives “Final values”. Faults, limits and intentional prefixes retain “After” the last completed
instruction. The existing status explains an abnormal stop. `viewAt` clamps stale/restored
positions, and the label uses that same clamped view. `ReturningToCaller` deliberately begins
after a hidden stack-setup instruction that the course has not yet taught. Its local initial
position retains the existing truthful “Before the call” label rather than exposing that hidden
instruction; Back and Reset return to that local context. Later steps use the shared helper.

## Contextual displays retained

These displays already identify the shown moment or do not represent instruction execution.
Adding changing execution labels would describe different data from what they draw.

| Components | Existing role/context and treatment |
| --- | --- |
| `RunPrediction`, `CountPrediction`, `LoopPrediction` | Fixed call-input banks labelled “Registers before the run”, retained even after checking a prediction |
| `MemoryPrediction`, `PredictionBox`, `PredictionChoice`, `PredictionChallenge`, `ModelPrediction`, `ProbePrediction`, `RecordedPrediction`, `TracePrediction` | Questions, fixed call inputs and measured answer summaries, not steppable register banks; retain their explicit starting/after/end wording and gates |
| `PrimitiveOperation`, single-instruction operation mode | Top bank deliberately continues showing inputs after Run; retain “Before the instruction”. The computed output is separate and labelled “Output”; it is not the input bank's new state |
| `ArgsFigure` | Argument-to-register mapping; gated first-instruction reveal already separates before and after values |
| `OperandRoles`, `FlowPanel`, `WordStepperFigure.StepFacts`, primitive operation preview/result flow | Sources and destination before/after one named instruction, rather than another current-state bank |
| `ConditionTable` | Editable/fixed comparison inputs. `cmp` does not alter these register bits; derived flags have their own explicit after-comparison heading |
| `RegisterReader`, `RegisterViews` | Editable bit pattern/readings and static register-width schematic, respectively |
| `ConstantTester` | One-instruction assembled result; existing sentence names `mov w0, INPUT` and says “After it” |
| `BitOpsFigure`, `ShiftFigure` | Simultaneous input/mask/result or before/after rows. Editing bits/amount changes one computed operation, rather than stepping the instruction trace |
| `MaskView`, `WarningWordFigure`, `FieldReadingFigure` | Fixed input fields and computed result, with explicit on-entry/selected-bits/result context |
| `ClearCompare`, `BfiCompare` | Simultaneous old/moved/result comparisons, explicitly named; neither cycles a shared bank through execution |
| `SolutionStepper` full-32-bit detail | Explicit “wN before”/“wN after” rows tied to the instruction whose main bank carries the temporal label; no second temporal label for the same instruction bank |
| `MemoryStepper` byte-transfer/detail panels | Explicit before/after address-register summary and transferred byte positions, accompanying the single labelled current bank |
| `NativeFigure` recorded comparison/boot stops, `NativeBootDiagrams`, `BoardSchematic` | Recorded native state and source-checked schematic context retained; no model-execution label added to recordings |
| `AdderFigure`, `CounterRing`, `ProductHalves` | Arithmetic columns, circular readings and product/division diagrams. Their controls reveal a calculation or select a reading, without executing another instruction |
| `LoopFigure`, `ListingRuns`, `RunsList`, `BranchListing`, `ListingChange`, `ListingPairFigure`, `ListingCompare`, `ListingDiff`, `ListingFigure` | Listing/trace summaries and histories, rather than current register banks |

## Verification status

Implementation-focused component tests are in `packages/views/src/RegisterStateLabel.test.tsx`.
They exercise real model traces for branching, clamped presets, normal return, faults before and
after a completed instruction, limits, no-return fall-through and intentional prefixes. Control
tests cover Next, Back and Reset across bit/decimal, word, three wide modes, memory and stack
banks, plus a nonzero stack preset, primitive prefix/function boundaries, native model/recorded separation
and the local before-call exception. `update-handoff.test.tsx` also checks the label after restoring
a paused simulator and resetting it. They verify
code rendering and absence of a new live region.

Browser layout, all route coverage, independent reviews, full build and CI are owned by the
managing session and recorded separately. This inventory is a source inspection, not a browser
verification claim.
