# First stepper validation

## Scope and prose process

The compact mode is enabled only for Meet the machine's first stepper. Default stepper behaviour and the missing-ret experiment remain unchanged. Arithmetic summaries use `flowAt` values from the real trace. Register cards retain the write marker. Optional details expose the existing read/write explanation, with the operand schematic available after the first instruction runs. A step change recreates the closed disclosure.

A separate drafting agent read `brief.md` and `docs/style.md`, supplied the result formatter, feedback, disclosure label and replacement investigation instructions. The managing pass shortened incorrect feedback to avoid repeating the destination in the result. The investigation now treats the first question as a check of the earlier prediction and explains free stepping after it. The canonical Module 0 prose record was synchronised; the removed standalone caption and unused operation label were removed from lesson data. No ISA or C semantics changed.

## Verification history

- Initial focused unit run: 59 passed, 3 failed, exit 1. All three failures concerned the canonical prose record and assertions still expecting the removed standalone caption/operation label; state/mechanism tests passed. Updated the canonical record and removed-caption expectations while retaining checks for every remaining caption and prose line.
- Focused rerun: 3 files, 62 tests passed, exit 0 (`/tmp/stepper-unit-rerun.log`). Includes the new compact-mode regression covering initial concealment, wrong/correct first choice, computed results, closing details on movement, Back/Reset and return.
- Production build: passed, exit 0 (`/tmp/stepper-build-final.log`).
- Typecheck: passed (`/tmp/stepper-typecheck-final.log`).
- Changed-source Prettier check, copyright check, platform integrity check and `git diff --check`: passed.

Full unit and full Meet the machine browser results are recorded below. These focused and unit checks are separate from the complete cross-course browser suite and GitHub CI.

- Initial complete unit run: 138 files passed, 1 failed; 2,784 tests passed, 1 failed; exit 1 (`/tmp/stepper-all-unit.log`). The string-review metadata test found missing DRAFT markers on the reused Add/Subtract operation labels. Added the markers; no runtime behaviour changed. The complete unit rerun result is recorded below.

- Full Meet the machine browser file: **104 passed, 2 skipped**, exit 0, 5.2 minutes (`/tmp/stepper-browser.log`). Covers both project widths, new compact-flow cases in both themes, existing model/register/paired-listing checks, predictions, missing-ret experiment and exercises. Skips are retained project-specific cases, not ignored failures.

- Complete unit rerun: **139 files, 2,785 tests passed**, exit 0 (`/tmp/stepper-all-unit-rerun.log`). No skips or failures.

Independent learner and technical reviews passed in actual light/dark themes at phone/desktop widths; see their separate notes. The managing session also visually inspected the final dark-phone executed-step screenshot. Only DRAFT metadata comments changed after the reviewed production build; runtime code remained unchanged. The complete cross-course browser suite was not rerun locally; GitHub CI runs it on the PR.
