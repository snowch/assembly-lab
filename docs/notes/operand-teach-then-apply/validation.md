# Teach, then apply: validation

This correction supersedes the initial-only check and optional-only schematic in the earlier stepper-simplification record. Those earlier results remain a history of that version, not verification of this revision.

The first execution now supplies the worked example without a register question. Its model-derived result is followed by the operand convention and automatically visible schematic outside the closed detailed explanation. Questions name the next arithmetic instruction, after the teaching content and before compact controls. A next-instruction label stays beside the controls when no question applies. `ret` and the completed run never ask for a register. Back and Reset restore the state for the selected trace position and clear old choices/verdicts. Other steppers retain their defaults.

A separate drafting agent read the checked brief and style rules and supplied the revised investigation paragraphs and after-execution convention. Both were integrated and the canonical Module 0 prose record was synchronised. No machine arithmetic, recorded program, prediction answer, register-write semantics or platform source changed.

Completed checks:

- Typecheck: passed, exit 0 (`/tmp/operand-apply-typecheck.log`).
- Focused unit suite: 4 files / 65 tests passed, exit 0 (`/tmp/operand-apply-unit.log`). The compact regression now verifies no initial question/diagram, automatic first teaching outside details, different next instruction, question/control order, wrong/correct later choices, no ret question, Back/Reset and closed details on movement. Existing default per-step question tests remain.
- Production build: passed (`/tmp/operand-apply-build.log`).
- Changed-source formatting, copyright, platform integrity and diff-whitespace checks passed.

Full lesson-browser results are recorded below. The complete cross-course browser suite runs in CI. Independent reviews are recorded separately.

- Full unit suite: **139 files / 2,785 tests passed**, exit 0 (`/tmp/operand-apply-all-unit.log`). No skipped or failed tests.

- Complete Meet the machine browser file: **104 passed, 2 existing project-specific skips**, exit 0 (`/tmp/operand-apply-browser.log`, 5.4 minutes). Includes phone/desktop and new teach-then-apply cases in both themes, automatic diagram geometry, model/register values, default missing-ret experiment, exercises and layout checks.

Independent learner and technical reviews both passed; their notes distinguish actual browser verification from source-only checks and physical-device limitations. No failed local check occurred in this revision.
