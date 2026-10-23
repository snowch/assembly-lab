# Small function after the first addition

Copyright © 2026 Christopher Snow

User request: add `increment_int` immediately after the first worked addition, before the remaining operand exercises and whole-function synthesis. The Pi extension remains separate work; its source brief is not part of this change.

## Evidence and implementation

GCC 16.1.0 for AArch64, through Compiler Explorer's `carm64g1610` with `-g -O1 -fno-verbose-asm`, compiled the retained C into `add w0, w0, 1` and `ret`. Source, request and raw response are retained in `increment/`; the listing record preserves the closing-brace debug references separately from the checked return-expression associations.

The new worked activity runs the existing machine model. Its caller has supplied one argument at entry, waits while `add` prepares the result in `w0`, and resumes only after the trace returns. This introduces no additional caller program, `bl`, link register or stack mechanics. Existing arithmetic predictions and the trip function remain later practice. Saved activities now carry a stable program entry, with legacy numeric positions interpreted against the original operation-only sequence.

Separate copy and implementation passes: [draft](increment-draft.md), [view](increment-view.md). Independent source review: [technical review](increment-technical.md). Final independent built checks: [learner check](increment-reader.md).

## Commands and outcomes

- Author's primitive component unit run: seven tests passed.
- First integrated five-file unit run: **143 passed, one failed**, exit 1. The term gate correctly rejected `caller` before its old Module 9 introduction. The correction moves its introduction to the new local definition, adds the locally defined `argument`, updates the explicit term-list expectation and module plan, and removes the later duplicate introduction. No term-gate exemption was added.
- Subsequent seven-file unit run: **162 passed (9.66 seconds)**, including the affected Module 9 metadata/prose checks. This does not change the earlier failed command's outcome.
- GNU/QEMU new-program differential check: **one program, five calls, 15 instruction states, zero differences**. The cases stay in the C-defined range for signed increment.
- Formatting, copyright, platform consistency, strict types and production build passed. The production build completed in 9.89 seconds before browser checks.
- Complete Module 0 desktop/phone browser file on the first build: **104 passed, two intentional viewport-specific skips (2.7 minutes)**. This file covers the new function and the existing predictions, synthesis, challenge editing, reload/clear, return experiment and themes.
- The independent four-context learner check passed execution, gating, saved work and design measurements, but upheld a medium phone discoverability finding: the complete assembly pane was offscreen inside the required paired listing with no local scroll control. Automated value/design checks did not establish discoverability. The technical sceptic independently upheld the finding.
- Correction: a local **Show instructions / Show C** toggle scrolls the existing paired listing's contained viewport. It keeps the complete numbered C and assembly, changes no execution state, retains keyboard focus and resets its presentation state on restart/stage changes. Copy was separately drafted. No global listing renderer, timeout, design threshold or source association changed.
- Post-correction focused unit run: **144 passed across five files (7.29 seconds)**. The earlier Module 9 checks remain the separate 162-test result above. Formatting, copyright, platform consistency, strict types and a new production build passed; the new build completed in 13.04 seconds.
- Final affected browser rerun: **six passed (37.4 seconds)**, across both projects and both theme paths, including actual pane visibility, focus, page position, execution/result gates and reload. Independent final phone/desktop/light/dark recheck passed on assets `index-B7pdy9O1.js` / `index-DRyjSuVo.css`. Keyboard, touch and pointer navigation reveal the named pane, preserve focus and page position, and reset on restart/re-entry. Exact code, source tags, 7→8→8, caller gating, partial/returned reload and containment remain correct. Visible controls measured 44px and text at least 12px. The original phone finding and harness setup failures remain in the reader record. No required finding remains in the bounded checked states.

No full-course rerun, physical hardware test or measured novice learning outcome is claimed by these local focused results. CI remains required for the pull request.
