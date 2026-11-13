# Input display implementation and verification

The section06 starting-input expression now reads the existing model's input readings. A native fieldset offers Hex, Unsigned decimal and Signed decimal. Hex is the transient default; changing it updates only the expression, pressed buttons and matching-readings note. The instruction, range cards, prediction state, grading and result inspection are unchanged. No platform files or storage schema changed.

The later practice input expression was inspected as a sibling. It remains a separate exercise; this request adds the display choice to the pictured section06 prediction only. The formatter's high-bit-set tests check differing decimal readings even though the current supplied inputs are positive in both readings.

## Completed focused checks

- TypeScript strict check passed.
- Six formatter tests passed, including signed negative and unsigned high-bit-set inputs.
- Candidate1 production build passed. Existing bundle-size and dependency annotation warnings remain.
- Independent learner/UX and technical browser review records are in this directory. These are separate from the manager's checks.
- Manager viewed candidate1 phone-light and desktop-dark screenshots. The three controls remain compact, labels wrap inside their buttons and both range cards remain visible.
- New focused browser tests passed all four phone/desktop and light/dark cases. They cover 320/375/834/1280px, fallback-font labels, keyboard activation/focus, early-answer gates, draft/checked state, signed result reading, all bits, revealed columns, clear and restored work.

## Historical test-driver failure

The first focused Playwright command exited1: all four cases failed a fresh-Hex assertion on the second width. Navigating to an unchanged hash does not remount the lesson, so the script was still looking at the previous width's chosen display. Added an explicit reload before each fresh-default check. This preserves the intended transient display behaviour and every numeric/geometry/state assertion. Also changed a multi-detail attribute assertion into one assertion per detail to avoid a strict-locator error. No product source changed in response. The second command passed4/4; the original failure remains recorded separately.

The learner review records its separate system-theme driver mistake and subsequent corrected pass. No screen-reader speech or physical-device test was run.

Full repository checks, exact-head CI and public deployment verification will be reported on the pull request after they finish; the focused results above do not stand for those checks.
