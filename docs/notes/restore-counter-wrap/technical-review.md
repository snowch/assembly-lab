# Independent technical and sceptic review

Copyright © 2026 Christopher Snow

Reviewed independently of the drafter and implementer, using the inherited available model. The repository's recommended exact model name was unavailable. This is a source/native/browser review, not evidence from a novice learning study.

## Scope and evidence

Read `CLAUDE.md`, the review requirements in `docs/authoring.md`, the named sources in `docs/sources.md`, the actual counter-wrap model/component/strings/CSS, the mounting and joins in `pacing-1-4.ts`, both small arithmetic helpers, the changed subtraction introduction, state-store implementation, new component/browser regression checks, and the earlier addition/flag preparation. Reviewed the built elapsed-ticks page at `http://localhost:4458/assembly-lab/#/lesson/subtracting-and-the-tick-counter`.

- Ran the permanent `module1-four-bit` GNU/QEMU differential corpus with `AL_TOOLS=/workspace/native-tools`: one program, 14 calls, 42 instruction states, zero differences. It includes both displayed increments and the following miniature subtraction.
- Ran an independent temporary GNU/QEMU corpus for the width/flag qualification: three calls and nine instruction states, zero differences. It contrasts actual 32-bit flag-setting addition with the four-place display boundary and checks non-flag-setting addition with pre-existing flags. These temporary review files are outside the repository.
- Initial browser pass covered 1280px and 390px, light/dark, with actual theme tokens checked (`#f7faf8` and `#101b1a`). Verified initial stored reading/no completed carry, both keyboard advances, displayed operands/full sums, carry/stored split, disabled end control/focus, original prediction gate, reload and Reset. The miniature subtraction remains before the original prediction, and the ring remains after it. No page errors or page-level overflow occurred.
- A separate actual-browser state-isolation check typed a validly editable but incorrect function draft, committed the original prediction, advanced/reloaded/reset the counter, and compared stored challenge/prediction data. The draft and prediction survived. Injected legacy progress of three ticks renders the end of the new two-tick preparation while leaving the legacy slot at three until the learner acts; it does not overwrite saved work on render.
- After the control-position correction and rebuild, repeated the four desktop/phone/theme combinations at 1280×1000px and 390×1000px (the final review script used a 1000px viewport height at both widths). Advance's viewport Y coordinate stayed identical at initial/first/second states: 736.125px at 1280×1000, 885.046875px at 390×1000. Scroll position stayed unchanged, keyboard focus stayed on Advance, and end/reload/reset states were correct. The carry/stored split used the intended flex style at both widths. Viewed final screenshots for all four combinations; labels remain readable and the carry is visibly outside the solid stored-bit group.

The model's all-start/all-short-interval unit checks and other regression tests were inspected in source; their full-run results belong in the managing agent's verification record. I did not run the full suite or a physical Arm board, and did not inspect assistive-technology announcements with a screen reader.

## Findings and independent correction checks

1. **Low, canonical provenance mismatch.** `strings.counter-subtraction.ts` named `docs/notes/subtraction-transfer/reminder-copy.md` as canonical while its introduction had changed. The new restoration copy contained the replacement, but the named older record had the prior introduction. The smallest correction is to synchronise the named record and identify the follow-up. **Accepted and independently checked:** the old record now contains the current `Use the same {width}-bit counter...` introduction and a `Counter-wrap preparation restored` follow-up linking this new copy record. No arithmetic or learner-facing wording was changed by this correction.

2. **Moderate, learner finding relayed for sceptic review: moving controls.** The learner reviewer reported that a taller completed result above Advance moved the focused control down the phone viewport. The original component structure supports that finding: the variable-height result preceded `.al-controls`. Moving `.al-controls` before the variable result is the smallest correction and keeps the result beside its action. **Accepted and independently verified in the final build:** the measurements and keyboard checks above show stable control/scroll positions in all four combinations. No further layout change is requested.

No unresolved arithmetic, flag-width, state-preservation or original-gate defect was found within this scope. This is not a blanket accuracy or accessibility certification.

## Mechanism and prerequisite checks

Every shown number and bit pattern is supplied by `fourBitAddition` or `fourBitSubtraction`, backed by actual-width simulator instructions and the native corpus. The four-place carry is column 3's carry out, not the architectural carry of the real 32-bit instruction. The visible note explicitly says the carry belongs to the four-bit example, `adds` records carry at its actual register width, and `add` leaves C unchanged. The original later 32-bit inputs, interval bound and prediction gate remain intact; the small worked example does not expose that original answer.

No new unsupported prerequisite was found. The opening sentence defines a counter and its tick; the zero transition defines wrap. Four-bit notation, retained low bits and reading order were taught and used in earlier Module 1 work. The immediately earlier addition unit says a flag is separate from a register result, distinguishes `add`/`adds`, and qualifies its four-bit calculations as teaching miniatures rather than Arm registers. The next pane defines inversion by its 0/1 changes before using it. The register-width bridge is explicit before the real-width prediction. The restored pane demonstrates increment and retained-bit wrap; the next pane demonstrates a different operation using the same readings, and the original prediction/written function provide independent application. These observations establish the intended opportunity to learn, not that a novice has learned it.

## Review setup notes

One exploratory source-read command used a nonexistent `store.ts` path; the implementation was then located in `state.ts` with `rg` and read successfully. A filename filter that found no match exited nonzero before that correction. These were inspection setup mistakes, not failing product or native/browser checks. The completed native and browser commands above passed; no skipped browser combinations are counted as passed.
