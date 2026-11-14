<!-- Copyright © 2026 Christopher Snow -->

# Dedicated carry explanation

The user reviewed the implemented callout and found it lost among the comparison content. This supersedes the placement decision in `../v-carry-rule/brief.md` and its expert assessment; that review did not establish discoverability or learning effectiveness. The user now requests a dedicated pane that teaches why unequal carries mean signed overflow.

Outcome: explain how the sign-bit column can produce an incompatible stored sign, relate that to exact signed range, and apply the carry criterion on fresh inputs. Prerequisites remain the earlier signed/unsigned reading, retained width and column-carry lessons. V's range meaning is introduced immediately before this pane. Physical circuits and XOR gates remain optional background.

Route: range meaning; new visible carry pane; existing programme-choice comparisons; independent small and 32-bit practice. Both overflow directions must be fully visible without choosing a tab or opening a disclosure. Add the pane to both outlines and consecutive next links. Remove the earlier callout from the comparison so it no longer competes with programme-choice teaching.

Facts and source: `flagsModel`/`fourBitFlags` provide columns, retained bits, signed exact sum and V. In the positive overflow example (7,1), top bits 0,0 and incoming carry 1 yield kept sign 1, outgoing carry 0. In negative overflow (8,15), top bits 1,1 and incoming 0 yield kept 0/outgoing1. Two non-negative inputs cannot sum to a negative number; two negative inputs cannot sum to a non-negative number. Retained bits with an incompatible sign therefore fail to represent the exact sum. For equal input signs, matching carries preserve that sign; different signs always yield matching carries and a fitting exact sum. Architecture provenance remains Arm AddWithCarry in `docs/sources.md` and `docs/notes/flag-primer/technical-review.md`. Do not claim a physical processor implements a ripple-carry circuit.

Hypotheses: a highlighted rule surrounded by unrelated tasks is overlooked (supported by author feedback); any carry means V (not observed in novices); negative stored result means overflow (not observed). Model-generated two-case figures make sign changes and their causes visible. Existing C-only comparison and a fresh (13,4) self-check distinguish outgoing carry from overflow. Do not use the existing miniature (5,12) as a worked example or leak later prediction answers.

Separate drafting: `carry_copy` supplied the fact-based copy for title, lead, two causal paragraphs, matching/opposite-sign explanation and fresh-check prompt/feedback. Keep that wording with short example headings and model-derived templates. Use one focused pane; stacked examples on phones. Numbers and figures must come from the course model. No second simulator or authored example answers.

The fresh self-check invites a reason before revealing the model explanation; opening it is not evidence of learning. Success evidence would be a novice explaining a fresh unequal-carry and matching-carry case without coaching. No novice study is available. Browser verification and independent reviews remain expert evidence only.

Pre-implementation evidence: user's screenshot/feedback, preceding callout browser checks, actual source and existing optional-circuit explanation. New geometry needs fresh browser checks at 320/375/1280px in both themes. Check essential text with all optional details closed, arithmetic, outlines, keyboard reveal, and unchanged saved work/gates.

## Final implementation and checks

The dedicated pane is section 04, after range interpretation and before programme-choice comparison. Both outlines and consecutive next links include it; following sections are renumbered through 08. The earlier comparison callout is removed. Both sign-change derivations remain visible, with complete input/result patterns and enlarged model-derived sign columns. A fresh matching-carry self-check reveals its reasoning on demand. The existing optional circuit explanation remains available.

Separate drafting: `carry_copy`. Independent learner/interface and technical review: `carry_review`, with findings and the accepted accessible-name correction recorded in `review.md`. The final bit patterns use `role="img"` with contextual accessible names.

Validation:

- Typecheck, scoped Prettier, copyright and `git diff --check`: passed.
- Focused unit/integration command: `npx vitest run packages/views/src/flags-lesson content/lessons/adding-and-the-flags.test.tsx`, 5 files / 50 passed, no failures/skips.
- Initial build `index-VZ_BjEoe.js`: complete flags lesson browser file passed 46 tests in 3.0 minutes, no failures/skips. Existing work, grading and gates remain covered.
- Final build `index-CgauTEBe.js`: passed after the accessible-pattern correction, with the same CSS. Dedicated-pane browser rerun with accessible-role assertions passed all four phone/desktop light/dark contexts, no failures/skips. Typecheck and formatting were rerun after the correction. No product edits followed these checks.
- Independent review inspected 14 width/theme contexts and exhaustively checked all 256 four-bit input pairs against signed range and carry inequality. Final focused review rechecks accessible names and clean screenshots; see `review.md`.

The first preview inspection encountered a stopped server before page load; restarting the preview resolved it. This is not a product/test failure. Build logs retain the existing third-party annotation and chunk-size warnings. No repository-wide check, GNU/QEMU rerun, novice study or screen-reader session was performed. Local changes only: not committed, pushed or published.
