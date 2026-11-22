<!-- Copyright © 2026 Christopher Snow -->

# Two-pane layout follow-up

The user found the combined worked explanation and real-width calculation too long and requested two panes. The existing four-bit explanation now occupies its own card. The existing 32-bit bridge starts a separate card with the actual instruction, arithmetic columns, flags and controls. Both remain visible in the same lesson section and existing interactive ID; no new disclosure, prerequisite, grading rule, storage key or learner-facing wording is introduced.

The adder's existing gates still return before either card renders. Its state remains owned by the same component. Other adders return their original single calculation view. App styling removes the enclosing card only for this two-card wrapper and applies the normal card treatment to its children, including the existing phone padding. Scoped figure styles move the real-width heading with its explanation.

Tests retain the original binary rows, carry/result checks, 32-bit constants, reset behaviour, default/gated fixtures and header containment. Their selectors now check the constants in the second card. Browser checks additionally require two bordered cards, a visible gap and an unbordered outer wrapper. Independent learner and technical layout reviews and final validation are recorded in the pull request; these checks do not establish learning effectiveness.

Final focused verification passed 49 unit/component/lesson checks and four browser checks, plus TypeScript, formatting, copyright, platform integrity and the production build. The first browser attempt stopped before running tests because its chosen local port was already occupied; the rerun used a free port. That startup failure is not counted as a passing run. Independent learner review checked six actual size/theme contexts, exact retained text, both card boundaries, header containment, controls, gates and partial-answer persistence with no finding. This layout reuses the previously drafted wording unchanged; no new copy draft or learner state migration was needed.
