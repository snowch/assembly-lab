# Independent reader/checker: lesson 10, Counting down

Reviewed only `counting-down` at `http://localhost:4291/assembly-lab/#/lesson/counting-down`, 2026-10-18. No content or implementation edits. Actual source/prose/labels/hints/feedback read before the accepted audit and coverage plan; no author justification used.

## Verdict

**Local accepted corrections pass.** L11 now supplies a practical consequence of the compiler's permission, without promising another compiler's output. M6's two changed hint ladders have appropriate content for their named rungs. Figure roles distinguish predictions, experiments, exercises and instruction steppers; gates continue to work. A shared residual before-run-label issue was reproduced in the stable build and sent to the coordinator; it is already tracked from reader09 and should count once, not once per lesson. Final shared-build recheck remains necessary.

## Accepted corrections checked

- L11, `counting-down.prose.ts`, `generalisationNote`: “For example, a compiler may remove this loop instead of emitting instructions that repeat forever.” This supplies the previously missing consequence. The surrounding note distinguishes a variable-reading condition from a constant expression, identifies the restricted local-variable example, and keeps the claim about recorded GCC separate. Expanded note checked in Chromium in all four configurations. It remains optional elaboration; the main lesson's countdown reasoning does not depend on mastery of the C standard's permissions.
- M6, `writeHints` and `finalHints`: the second rungs now describe actual mistakes and consequences; the third rungs give specific reduced cases. All five rungs of both ladders opened in all four configurations. No solution text reproduced here.
- S1: prediction figures visibly say Prediction, selectable runs say Experiment, code challenges say Exercise, and actual steppers retain Stepped. Prediction-gated steppers showed their locked message initially and unlocked after checking an answer. No premature answer from these shared role changes.

## Shared residual finding

**Low; already grouped with reader09 / N4.** In the tested stable build, the loop prediction keeps its initial register cards after feedback says “The loop body ran 3 times.” The cards show only register names and their starting values, without a visible qualifier identifying the before-run state. Caption identifies the call, but does not identify the register cards' execution moment. This is the same state-context problem as the accepted RunPrediction finding.

Location: `packages/views/src/interactives/LoopPrediction.tsx`, initial input register region. Reproduced at 375/1280 in light/dark. Evidence: `reader10-375-light-after.png`, `reader10-1280-dark-after.png`, and corresponding light/dark counterparts. Direction: make the initial-state qualifier visible beside the retained inputs, preserve the gate. Source now contains a shared before-run heading added during review; that source change was not in the tested build, so this report does not certify it yet.

## Prerequisite assessment

Assumed knowledge is supported by the front page and relevant earlier lessons: reading small C functions with unsigned values and loops; binary arithmetic; registers and flags; unsigned wrapping subtraction and `subs` (lesson04); logical shift and C `>>` (lesson06); condition codes and branches/`cbz` (lessons07–08); loop body/iteration, `>>=`, `bne`, and trace (lesson09). `ticks--` and the before/after-test distinction of a `do` loop are explained locally. The optional standard note gives the relevant meaning and consequence of its compiler permission. No new untaught prerequisite blocks the accepted changes.

## Actual browser coverage and limits

Real Chromium, fresh browser context for each of 375×812 and 1280×812, light and dark. Theme set using raw `assembly-lab:v1:theme` and asserted against `html[data-theme]`. Read entire rendered page; screenshots inspected at both widths and themes. In each configuration: checked initial gates; submitted first option in each prediction to expose the explanatory feedback; advanced the first stepper four instructions and reset; ran both unchanged exercise starters; opened all ten hints; expanded the C-standard note. No page errors or page-level horizontal overflow observed.

Did not submit reference solutions, exhaust all selectable runs or advance every trace to completion. Did not rerun the automated suite or compiler/QEMU checks. Technical assessment here is the local explanatory contract and its consistency with existing recorded listings and previously introduced operations; independent full technical verification belongs to the coordinator.

Artifacts: `reader10-evidence.json` and `reader10-{375,1280}-{light,dark}-{initial,after,standard}.png` in this directory. Browser probe script `check10.mjs` records the exercised states. Evidence artifacts contain actual rendered UI, including hints; this report deliberately does not reproduce challenge answers.

## Final-build recheck: shared residual closed

Rechecked `http://localhost:4292/assembly-lab/#/lesson/counting-down` after the shared heading correction. In fresh Chromium contexts for all four width/theme combinations, asserted theme, checked “Registers before the run” is visibly present before submission, submitted the first prediction, and checked the same heading remains visible with its retained input cards after the outcome. Phone light and desktop dark screenshots independently inspected; heading is readable and aligned with the input region. Evidence: `reader10-final-evidence.json` and `reader10-final-{375,1280}-{light,dark}-after.png`.

**Final verdict: all accepted lesson10 fixes pass; no remaining finding from this review.** Prior shared residual above records the evidence and is now closed. Local prose/hint checks remain the all-four-configuration checks on4291; final4292 recheck targets the only subsequent shared change.
