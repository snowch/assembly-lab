# Keeping the carry explanation small

Copyright © 2026 Christopher Snow.

The author approved removing the closing 32-bit register/ALU activity after finding it overcomplicated the lesson. The 3 + 3 walkthrough remains: its second column adds both operand ones and an incoming carry one. A short setup and two bullets explain the two output bits and their destinations. No new control, diagram, display mode, lesson or quiz was added.

The page keeps its separate width boundary, invert/add-one subtraction method, fresh 6 − 3 exercise, saved answers, hints and answer gate. Its closing sentence again leads directly to 32-place subtraction on the next page. The unused activity registration, component, helper, stylesheet, copy and activity-only tests were removed. The native primitive program and useful differential boundary cases remain. Historical `architecture-*` notes describe the earlier implementation and review; this change supersedes that activity rather than rewriting those records.

Bit Lab keeps its gate and ALU activities. Its one cross-course paragraph now points to the existing Module 0, lesson 1, One addition, whose inputs/destination match the paragraph's promise. Two unused prototype link constants and their canonical snapshot were removed. No Bit Lab model, grading, storage or interaction changes.

The repository learning-design skill was applied before implementation. No standalone UX skill was available after discovery; the learning skill's attention, state and access criteria and the visual-language guidance support an independent learner/UX review. Copy was drafted separately (GPT-6.1 Medium), with independent learner/UX (High) and technical (Extra High) reviewers. Their separate notes record the actual evidence and the distinction between expert review and observed novice learning.

## Validation at the implementation stage

- Strict TypeScript and production build passed after removing the unused activity.
- Focused existing lesson/model/view tests: 3 files, 13 tests passed.
- Independent numeric checks exercised all eight operand-bit/incoming-carry combinations against integer arithmetic, plus width and signed-subtraction boundaries. No model change was needed.
- Independent learner/UX final-build review passed 375/1280 in actual light/dark themes plus 700 light. Initial, bit 0, the three-one bit 1 case, completion/reset, complete carry-arrow endpoints, keyboard focus/scroll and the existing exercise's gates, grading, reload and clear were checked. No supported visual or instructional finding required a product correction.
- Independent technical final-build spots passed 375/1280 in both actual themes: initial, bit 0, the three-one bit 1 case and its carry into bit 2, completion/reset, the width boundary and a closed fresh solution gate. Complete connector endpoints measured zero error and no document overflow or page errors occurred. Its initial ad hoc browser probe queried an attribute on the wrong wrapper; the corrected probe passed on the unchanged build. That harness correction is recorded in the review, not treated as a product fix.
- The full local command has passed formatting, copyright, platform integrity, strict TypeScript and all 185 unit files / 3,213 tests. Its build/browser stage and CI results are pending at this record's commit. The pull request validation record carries their final outcomes separately from these focused checks. Bit Lab's full local check already passed 101 unit tests and 48 browser tests for its limited link/copy cleanup.

No existing test timeout or assertion was relaxed. Removing tests belonging only to the deleted activity is distinct from the retained arithmetic/exercise tests above. No platform files were changed. No physical-device, screen-reader speech or novice-learning study is claimed.
