# Independent checker: 02 Constants and widths

Read-only check of the implementation at `http://localhost:4291/assembly-lab/#/lesson/constants-and-widths`. No lesson, code or tests edited. Read CLAUDE.md, docs/style.md and docs/authoring.md; independently read lesson prose, labels, structure, hints and relevant figure implementations, plus the front-page prerequisites and full earlier lesson 00/01 prose before consulting the accepted audit/coverage list. No author self-justification used.

## Verdict on accepted fixes

- **N3 grouped hexadecimal: verified fixed.** Copying the displayed grouping into the tester now gives an assembly-fit result. `0x0001 0000` is accepted, `0x0001 1170` gives the assembler's refusal rather than the number-format error, uppercase hexadecimal groups work, malformed hexadecimal and decimal with an internal space remain rejected. The normalized instruction in success/refusal feedback agrees with the supplied value. Checked all four configurations.
- **S1 roles: verified fixed locally.** Both prediction cards show Prediction; the number tester shows Experiment; both exercises show Exercise. Actual Next/Back/Reset figures retain Stepped. Prediction gates remain closed initially and open only after checking. The solution stepper remains locked after running the failing starter.
- **S2 semantics: verified relevant local state.** After the width example's second instruction, the lower half is marked written while the upper is marked cleared. In this example the lower bits are unchanged, so written describes the event accurately.
- The clearer assembler diagnostic is present when the starting build program cannot assemble; it identifies that no single instruction can put the supplied constant in a register.

## Additional residual finding

### Low: a motivation caption still describes the after-state while showing the before-state

**Quote/location:** `content/lessons/constants-and-widths.labels.ts:34`: “w0 after mov w0, 30000, in two halves of 16 bits.”

**Actual state:** The fresh/reset figure shows `w0` as zero, the first instruction marked Runs next, and “Press Next to run the first instruction.” After Next, its value matches the caption.

**Effect:** The caption moment conflicts with the visible value until the learner steps. This is the same type of state-label ambiguity as accepted N1 in the preceding lesson. It is an existing residual, not a regression introduced by the N3 implementation.

**Evidence:** Reproduced initial/reset at 375 and 1280 in light/dark. Screenshots `02-375-light-initial.png`, `02-1280-dark-initial.png` and corresponding other configurations. Initial source is `constants-and-widths.ts`, `service-halves`, with no preset step.

**Direction:** Make the caption describe the progression or the specific action needed to inspect the after-state. Preserve the actual initial state and authentic instructions.

## Assumed knowledge

No newly unsupported prerequisite found in the changed content. The front page provides small C functions and binary arithmetic. Earlier lessons teach hexadecimal, set/clear, signed/unsigned readings, arguments/results, operand positions and compiler settings. This lesson explains void, assembler, constant, lsl 16 in this operand form, remainder, optional #, the two register widths, long and the unsigned suffix when they appear. The grouped notation no longer requires learners to infer an undocumented input restriction.

## Actual browser coverage and limits

Used actual Chromium at 375×900 and 1280×900, each light/dark, setting `assembly-lab:v1:theme` before reload. In every configuration checked fresh gates, both predictions, accepted/refused/malformed/empty tester entries, all three available example steppers through their final state, Back and Reset, and failed initial build submission. Inspected screenshots covering phone/desktop and both themes. No browser page errors or page horizontal overflow in these states. Read all hints, prose and feedback sources; did not open every hint/details in every browser, complete either challenge, unlock learner-solution playback, or test persisted challenge restoration. Did not run a build or automated suite.

Evidence: `check-02.mjs`, `02-browser.json` and `02-*-{initial,hex,width}.png` in this directory. No challenge solutions are included in this report.

## Final-build recheck: residual caption closed

Independently rechecked the corrected production build at port 4291 in fresh Chromium contexts at 375 and 1280, light and dark. Explicit assertions confirmed the actual `html[data-theme]` matched each intended theme. The caption now reads “Step through mov w0, 30000 and inspect w0 in two halves of 16 bits.” It accurately describes the activity before execution, after Next and after Reset. Initial and reset states match; Next executes the displayed instruction and supplies its result. Visual inspection confirms readable phone/dark and desktop/light captions. No source edits by this checker. This closes the additional residual finding above; no open finding remains from this lesson's check. Evidence: `02-final-caption.json`, `02-final-*-reset.png`.
