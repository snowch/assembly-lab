# Verification: zero start and optional borrow

Copyright © 2026 Christopher Snow

## Functional checks before independent review

Arm: eight focused unit/component checks passed across counter-wrap and counter-subtraction. Typecheck and production build passed. Twelve browser checks passed: default forward route, optional independent subtraction, full cycles, keyboard Enter/Space, reload, Reset, saved prediction/ring gates and unchanged elapsed flow. This includes phone/desktop in actual light/dark and explicit 320px controls-below-result checks with less than 1px movement tolerance inherited from the prior measured zero-drift layout.

RISC-V: all 50 Node tests passed, including all 32 actual xv6 operation/result-marker pairs and the original lesson/edited examples. Twelve focused browser checks passed at desktop and phone in actual light/dark, plus explicit 320px, independent panes, native lesson runs/project transfers, saved source/prediction preservation, legacy restoration and blocked storage. The initial focused browser command had eight passes and four failures: the theme assertion was measuring the new transparent inner forward pane rather than its unchanged themed outer card. Corrected the test selector to the actual painted card; the complete rerun passed. No product theme CSS or assertion values were weakened.

Fixed worked examples, native arithmetic, challenge programs and prediction answers are unchanged. No full local check has been claimed; complete CI results will be recorded for the final commit. Copyright and git whitespace checks passed. The first full local formatting check failed only on the learner reviewer’s transient, untracked JSON artifact; that owned artifact directory was moved outside the repository, and the full formatting check then passed. Unrelated artifacts were preserved.

## Learning evidence

Independent learner/technical reviews are separate records. No human novice study was conducted. Passing tests establish arithmetic/UI behaviour, not learner understanding. No screen-reader session was performed; native disclosures, keyboard interaction and live status behaviour were inspected in browser/source.

## Independent final review

No open findings remained in the final learner and technical reviews. Each independently checked twelve course/width/theme contexts and additional restoration/preservation cases. Both measured zero control movement and no overflow/errors. The technical reviewer also rechecked all 32 Arm GNU/QEMU pairs and all 32 RISC-V xv6 plus independent QEMU pairs. Fixed worked examples remained at their original inputs. See learner-review.md and technical-review.md for exact scopes and limitations.
