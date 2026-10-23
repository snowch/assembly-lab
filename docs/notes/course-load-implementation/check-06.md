# Shifts: independent learner/checker review

Copyright © 2026 Christopher Snow

23 October 2026. Bounded review of `shifts`, the second lesson of Module 3, against the final production preview on port 4322. Read AGENTS.md/CLAUDE.md, the front-page prerequisites, earlier lesson prose, all ten shifts sections and their challenge definitions, recorded listings, and the relevant probe, shift, bit-row and word-stepper implementation. No application edits, build, compiler request or challenge answer submission.

## Final-build checks

Four fresh Chromium contexts: 375×900 and 1280×900, each light and dark. The actual html theme and body background confirmed the requested themes: light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. No page errors occurred. Document scroll width matched viewport width in all four final states.

The initial prediction shows exactly one starting register row, labelled “w0 when the call starts”, with the stated input's bits. There is no outcome before commitment, including after selecting a choice. The experiment and later division stepper are locked. Committing a deliberately incorrect prediction removes the starting row and leaves exactly one before/after pair. Its model values agree with the explanation, and only bit columns 2 and 0 carry changed marks. The deduplication is confirmed.

The experiment opens after commitment. Selected all three instruction presets and shift distance 3. Their directions, lost/fill columns, hexadecimal results and signed/unsigned readouts agree with each operation; each has exactly three lost and three filled columns. Complete values remain visible. The comparison initially shows complete numbered C beside instructions with checked line tags, differing instructions retain their marks, and both comparison buttons operate. At phone width each listing is contained and scrollable (315px viewport, 588px content); it does not make the page overflow.

Committed the later prediction and stepped the negative-input division through both arithmetic instructions and return. Status, register values and operand facts agree with the recorded program. Reset returns to step zero and removes step facts. Selecting the positive-input call restarts the trace; its first add writes the unchanged register value, retains the write outline, and shows a zero shifted operand. This correctly distinguishes a write from changed bits. Numbered C and instruction associations remain available during stepping.

## Findings, narrow closure and rejected extension

- **Medium, opening-note disclosure, resolved:** the original optional “What C says” note stated GCC's exact top-bit fill rule before the prediction asking for that rule. The accepted narrow correction removes the two redundant GCC-rule sentences from that note. The C qualification and signed-left-shift caveat remain. In the latest final build, all four fresh viewport/theme combinations confirm that opening the note no longer supplies the fill rule. The prediction still has one Start row and no outcome initially, then no Start row and exactly one before/after pair after commitment. The later investigation still teaches the shift rules. This closes the narrow accepted finding without removing needed teaching.
- **Rejected broader disclosure claim:** the original note also treated subsequent investigation teaching as a page-wide spoiler. Later general explanation is not automatically evidence that a prediction is improperly disclosed; the earlier sceptical review rejected that blanket interpretation. No new gate on the investigation prose is recommended. The accepted correction concerns only the redundant direct answer in the optional note before the prediction.
- **Low, existing phone readability limitation, optional:** beneath “Struck through and marked ×: bits that fall off. Dashed and marked +: bits the shift filled in”, all 32 columns occupy narrow cells. At 375px a representative cell measures 8.09px wide by 21.59px high with a 12px font; adjacent fill marks appear crowded. Numeric results and explicit lost/filled strings remain readable, so the mechanism has clear-text support. This is unchanged by row deduplication, not a confirmed regression or blocking finding. An enlarged selected group or contained full-width inspection could improve it in future. No overflow finding is asserted.

## Prerequisites

No confirmed untaught external prerequisite. Module 0 supplies GCC, optimisation settings, operands, arguments/results, listing syntax and stepping controls. Module 1 supplies hexadecimal, signed/unsigned readings, register widths and `movk` placement. The preceding masks lesson supplies word, bit numbering, C bit operators and standalone `lsl`. This page introduces `>>`, the right-shift names and their rules, division rounding, and the shifted-last-operand syntax locally. The C qualification about signed shifts is available in the opening note. No later lesson is needed for the checked interactions.

## Evidence and limits

Final narrow recheck: `/tmp/check06-final.cjs` and `/tmp/check06-final-results.json`, run sequentially against the latest port-4322 build after the opening-note change. Actual light/dark theme attributes and backgrounds were checked again at both widths. Only the opening note, initial/committed prediction rows and retained later teaching were rerun; the broader original checks below were not repeated because the edit was confined to note prose.

Original harness and observations: `/tmp/check06.cjs`, `/tmp/check06-results.json`, `/tmp/check06-metrics.cjs`. Initial rendered text and screenshots use `/tmp/check06-{width}-{theme}-`. Visually inspected representative phone light committed/shift states, phone dark positive-input stepping, and desktop dark comparison. All four contexts exercised the same bounded interaction sequence.

No full suite was run. Every distance, arbitrary/invalid input, restored work, keyboard-only interaction, challenge grading, hints and challenge solutions remain untested in the browser. Challenge/model definitions were read only; no challenge answers are recorded here. This check confirms the requested gate, row deduplication, model values, comparison, stepping and reset states; it does not establish improved learning outcomes. The accepted opening-note finding is independently closed; the broader gate concern is rejected and the unchanged grid limitation remains optional.
