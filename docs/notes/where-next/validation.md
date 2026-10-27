# Where next validation

Copyright © 2026 Christopher Snow. All rights reserved.

The optional page was drafted separately and received independent learner and technical
reviews of the built course. Their reports retain findings, corrections and final approval.
The external Playground starter was also imported and run on the actual website at phone
and desktop widths; its fixed exit-status check passed. No physical-board test is claimed.

Local verification:

- Full unit/integration run: 156 files, 2,933 tests passed (183.44 seconds), before the final
  layout, static-summary and copy corrections. `/tmp/where-next-units.log`.
- Final focused rerun after those corrections: 3 files, 22 tests passed (12.68 seconds).
  `/tmp/where-next-focused-final.log`; this does not replace the earlier full run.
- GNU/QEMU comparison of the starter: one call, 14 states including the initial state,
  zero differences. Its original trip function is unchanged. The model executes 13
  instructions; the external application additionally executes its own exit trampoline.
- Final production build passed (9.55 seconds). Format, strict types, copyright,
  platform integrity and whitespace checks passed.
- Initial broader browser run: 54 passed, 5 failed, 1 intentional skip. Desktop reading
  measure guards found an overly wide discovery paragraph and a flex action paragraph;
  the paragraph was constrained and the action group changed to a div. Both no-JavaScript
  footer assertions still expected four links after adding the fifth. They were corrected,
  and a working static summary/anchor was added. No guard or tolerance was weakened.
  `/tmp/where-next-browser.log` retains this failed attempt.
- Corrected browser rerun: 59 passed, 1 intentional skip (3.7 minutes), covering the shell,
  new page in both themes and viewports, no-JavaScript navigation, and the whole-course
  offline save including the previously unvisited page and byte-checked starter.
  `/tmp/where-next-browser-rerun.log`.

Independent final reviews additionally exercised 320-pixel keyboard code scrolling, the
no-JavaScript summary at both widths, reload/navigation, source/download identity and
fresh-cache offline access. Their harness-only failures are recorded in the review reports.
External offline availability, future external interface compatibility and CPU timing are
outside this verification. CI and deployment outcomes are recorded on the pull request.
