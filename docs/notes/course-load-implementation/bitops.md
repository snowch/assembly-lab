# Bit-operation columns: implementation record

Copyright © 2026 Christopher Snow

## Checked facts and drafting brief

The managing session supplied the checked-fact brief for the accepted reader05 / sceptic-early phone finding. The investigation's first functions operate on low bits 0–6. The simulator run and selected column determine the exact effects. High input bits and complement masks still require all 32 bits to remain inspectable. A readable low-eight-bit view may be the default if column navigation reveals higher selected columns and the unchanged-bit table retains its evidence. Prediction gates must remain intact.

This implementation is a separate pass from that brief. It reuses `BitCells`, `bitsFrom`, existing bit-range labels and `MaskView`'s full-word disclosure label. No learner-facing strings were drafted or changed. The prior knowledge is the lesson's existing word, mask and column reading; the change adds no terminology. The implementation follows `docs/style.md` and `docs/visual-language.md`.

## Change

`BitOpsFigure` now shows one numbered byte in the shared large-cell treatment, initially bits 7–0. Selecting a bit by the existing Higher/Lower controls, arrow keys or a column press draws that selected bit's eight-bit group. The same model values and marks populate both views. Before/after values remain complete 32-bit numbers.

The existing 32-bit rows, ruler, changed marks and keyboard column navigation remain within the existing “Show all 32 bits” disclosure pattern. The input controls, function selection, readout, computed result, changed-bit statement, unchanged key entries and prediction gate retain their previous behaviour. There are no new CSS rules, global registry changes, lesson programs or answer-gate changes. No lesson prose was removed because the accepted fix concerns the figure's cell size.

## Verification

Implementation-session focused rerun: `npx vitest run packages/views/src/module3.test.tsx packages/views/src/module3.rework.test.tsx` passed 83 tests in two files. New isolated `npx vitest run packages/views/src/bitops.focus.test.tsx` passed three tests: readable initial byte with high input-bit retention and model result, selection crossing byte boundaries with exact column readout and pointer selection, and unchanged prediction gating. The original full-word and column tests remain meaningful and pass.

No production build or browser check was run by this implementation session. Actual phone/desktop layout and both rendered themes, independent learner/technical review, canonical record synchronisation and final-build verification remain with the managing session. Passing DOM checks do not establish those browser outcomes.
