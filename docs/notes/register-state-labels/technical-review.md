# Independent technical review

30 October 2026. Separate reviewer, assigned GPT-6.1 / Extra High in the brief. The reviewer
did not author the implementation and made no product edits. Sources read: `CLAUDE.md`,
`docs/authoring.md`, this change's `brief.md`, the shared trace and machine execution code,
all register-display component families, and the relevant lesson data.

## Findings and decisions

- **Accepted, medium: preserve the introductory caller's local starting moment.** The first
  implementation labelled local position 0 in `ReturningToCaller` as
  `After stp x29, x30, [sp, #-16]!`. The model state is indeed after that instruction, but
  `returning-to-caller.example.ts` deliberately hides this wrapper setup. The learner has not
  met stack storage. `startStep` is 1, and the next model instruction is the displayed
  `bl increment_int`, so the existing **Before the call** is an accurate, taught description
  of this state. The managing reviewer independently identified the same issue and requested
  this narrow exception. Subsequent positions must still name their actual last completed
  instruction, including `ret` back into the caller; the local prefix end must not say
  **Final values** because the wrapper trace has not returned. The corrected source preserves
  **Before the call** only at local position 0 and uses the shared helper afterwards. Independently
  verified in the final built site at both widths and in both actual rendered themes, including
  a full visible sequence, Back, reset, reload and migration of an older saved position.
- **Rejected: use Final values for any stopped trace.** `run.ts` stops for a return, budget
  limit or fault; only `returned` establishes completion. The helper correctly checks
  `view.stop?.kind === "returned"`. A limit, falling off the listing, or a failing next
  instruction retains **After** and the last successfully completed instruction. Zero
  successful steps retains **Before the first instruction**.
- **Rejected: apply execution labels to every register-like drawing.** The inventory includes
  prediction inputs, editable bits, width schematics, argument mapping, arithmetic columns,
  before/after comparisons, and native recordings. These retain their existing input,
  before/after, result or recorded-stop descriptions. For example, `ConstantTester` already
  states that after the typed `mov`, `w0` holds the drawn bits; `RunPrediction`,
  `CountPrediction` and `LoopPrediction` label their inputs **Registers before the run**.
  The single-operation `PrimitiveOperation` bank deliberately continues to show its inputs
  while a separate flow reveals the executed result; changing that bank's label to After
  would be false. Native model values gain the helper; recorded native values remain
  explicitly recorded and share the existing named stop.
- **Rejected: all nonzero presets need the caller exception.** The only other configured
  nonzero initial position is `StackStepper` at step 22 in `recursive-calls.ts`. This lesson
  displays the full listing and has already taught its stack instructions. Its bank should
  name the actual last completed instruction. Reset returns it to actual step 0, rather than
  to its preset, matching the existing controls.

## Source coverage

The shared helper reads the same `StepView` as its bank. `viewAt` clamps the requested position,
reconstructs registers and flags with `stateAfter`, and sets `stop` only at the trace endpoint.
The instruction text comes from `trace.result.steps[view.k - 1]`, not from the next listing
marker or the instruction's physical position in the listing. `run.ts` appends a step only
after successful execution, so faults cannot give the failed instruction's label to the bank.
Branches, backward branches, deleted lines and learner-written instruction order use that same
executed-step record.

All eleven executing bank families were read: `StepperFigure` (bits and decimal),
`WordStepperFigure`, `WideStepper` (all three modes), `MemoryStepper`, `StackStepper`,
`SolutionStepper`, `SelectStepper`, `CompilerPlayground`, `PrimitiveOperation` (function and
multi-operation bank), `ReturningToCaller`, and the browser-model side of `NativeFigure`.
Each passes its actual bank view and trace to the helper. Existing prediction/challenge gates
still return before rendering any bank or label. Scenario switches and deletion reset the
position; restored positions are reconstructed through the same view. No new independent
position state or live region was introduced.

Sibling and wrapper inventory also covered `ArgsFigure`, `RegisterReader`, `RegisterViews`,
`ConditionTable`, `RunPrediction`, `CountPrediction`, `LoopPrediction`, `ConstantTester`,
`BitOpsFigure`, `ShiftFigure`, `MaskView`, `ProbePrediction`, `WarningWordFigure`,
`BfiCompare`, `ClearCompare`, `FieldReadingFigure`, `ProductHalves`, the loop-history display,
and native boot displays. These are fixed-moment views, calculations, editable inputs or
recordings; no additional executing bank was found outside the eleven families above.

## Validation

- Focused source/unit run: `npx vitest run packages/views/src/RegisterStateLabel.test.tsx
  packages/views/src/trace.test.ts packages/views/src/update-handoff.test.tsx` passed:
  3 files, 34 tests, exit 0. This is a focused result, not a full-suite result. It covers
  actual branch order, clamped positions, zero-step faults, failed-next-instruction faults,
  limits, fall-through faults, prefix stops, returned endpoints, code formatting, no added
  live announcement, core control cycles, a nonzero preset and existing handoff restoration.
- Final focused rerun of that command passed after the caller correction and added tests:
  3 files, 36 tests, exit 0. It also directly asserts the restored stepper label and reset
  label after a coordinated view-state handoff.
- Final production build checked in Chromium at `http://localhost:4411/assembly-lab/`,
  with 1280- and 375-pixel viewports. Each of the following ran in light and dark, with the
  actual `html[data-theme]` asserted. The checked build ID was
  `246345ae9bbe454bb754d9125c2f86907f6ce697dca03f298bcc70c36a5e7010`
  (`index-CJ59SXs3.js`, `index-C3TizJQK.css`).
  - Caller: every visible state and both drawn data registers matched the trace; prefix end
    remained After; Back, reset, saved reload and the older saved-position migration matched.
  - Recursive stack: the gated label stayed absent before commitment, preset step 22 named
    the actual completed instruction, Back named step 21, and Reset named the initial state.
    The deliberate 32-step limit retained After alongside the limit status.
  - Local compiler: the gated bank stayed absent before commitment; every step's label and
    `w0` matched the compiled model trace. Return, Back and Reset worked. Editing the source
    to incomplete C removed the bank and its temporal label.
  - Native comparison: only the model side received the new label. Every model step and all
    four drawn registers matched its trace; Final values appeared only on return. Back and
    Reset worked. Recorded values and recorded startup displays gained no execution label.
  - Static introductory operation: running the instruction left its input bank and
    **Before the instruction** label intact, while the separate result was revealed.
  - Learner solution: an actual submitted one-instruction program without `ret` stopped at
    its fall-through fault. The label named its completed instruction as code, retained After,
    and did not claim Final values. Selecting another call restored the initial label.
  These corrected final browser scripts exited 0. The main script observed no page errors;
  both scripts measured no page-level horizontal overflow in the checked states.
- Three exploratory browser script runs exited 1 because of harness mistakes: an incorrect
  prediction-button name, an `innerText`/`textContent` comparison, and a paraphrased expected
  fault status. Their original exit statuses remain failures. Correcting those harness
  expectations required no product edits; the final reruns above passed.
- Browser limits: `StepperFigure`, `WordStepperFigure`, all three `WideStepper` modes,
  `MemoryStepper` and `SelectStepper` were audited in source here, with core control cycles
  also covered by the focused unit run. This reviewer did not independently drive those
  families in the final browser. Zero-step faults, a faulting next instruction, and branch
  ordering were checked by model/unit tests rather than by this browser pass. The coordinated
  service-worker restart itself was not exercised here; its restored label was checked in
  the handoff unit test. Root's course-wide browser and CI results are separate.
- No full CI, GNU/QEMU differential, native hardware, or comprehensive visual-layout result
  is claimed by this reviewer.

No unresolved correctness or executing-bank coverage finding remains in the reviewed change.
