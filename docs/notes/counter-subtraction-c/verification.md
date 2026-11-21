# Verification: C after subs in the counter

Copyright © 2026 Christopher Snow

## Focused local checks

Eight counter-wrap/counter-subtraction unit/component tests passed. The exhaustive operation test now checks carryOut for every four-bit input and both directions, independently of the inverse borrow marker. Component checks verify C0 for the wrapped decrement, C1 for an ordinary decrement, selected visible prose/rule bullets, spoken C status, restored state and independent Reset/preservation. Typecheck, production build, full formatting, copyright and whitespace checks passed.

The first focused unit command had seven passes and one failure: the expectation included canonical backtick markup, while the component correctly rendered it as inline code. The expected text was corrected to the user-approved visible sentence; the complete focused rerun passed. The original failure is not counted as a pass. No arithmetic or UI behaviour changed for that correction.

The focused browser run covers the forward model, C0/C1 across a complete optional decrement cycle, rule placement immediately below the explanation, both independent Resets, reload, committed predictions, old-state isolation, keyboard controls and unchanged elapsed flow. Actual phone/desktop light/dark and explicit320px checks are included. All twelve focused browser tests passed. Independent learner and technical review records are included alongside this note; no open findings remain. Both independently checked actual320/375/1440 light/dark contexts, plus saved-work/restoration fixtures. Controls stayed below results with zero measured movement, while the selected result sentence and bullets stayed together below the controls. The learner review also checked committed code/prediction preservation. The technical reviewer reassembled all16 decrements at both W and X widths under GNU/QEMU, and checked four ordinary-sub flag-preservation cases. Its current model/native comparison confirms C directly without generalising the helper’s addition carry to other subtrahends. Full final-commit CI and live revision checks will be recorded in the pull request.

## Learning evidence

The user identified the physical-borrow-source misconception in the previous feedback and asked to think directly in terms of C. This patch removes that claim and aligns the display with the bit used by Arm code. Functional tests and independent agent review do not prove learning effectiveness. No human novice study or screen-reader-user test is claimed.
