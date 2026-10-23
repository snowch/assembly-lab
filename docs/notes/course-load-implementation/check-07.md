# Compare and choose: independent learner/checker review

Copyright © 2026 Christopher Snow

23 October 2026. Bounded independent review of `compare-and-choose` at the final production preview, `http://127.0.0.1:4322/assembly-lab/#/lesson/compare-and-choose`. Read AGENTS.md/CLAUDE.md, the entry requirements, prerequisite teaching references, all ten lesson sections, objectives, tasks, model-versus-reality note, recorded programs and relevant listing, prediction, select-model, panel and stepper sources. No application edits, build, external compiler request or challenge answer submission.

## Findings and correction checks

No new confirmed high, medium or low finding in the checked states.

The opening duplication correction is confirmed: “The paired listings below show the functions and the instructions GCC recorded” leads to one paired example in the question section. The old separate raw assembly block is absent. The later prediction still repeats the paired example and results beside its controls; this is retained repetition, so this check does not claim all repetition across the two sections was removed. Direction: keep the single introductory representation and preserve the local prediction context.

The flag duplication correction is confirmed. The failure-stepper caption promises “with the flags under the registers”. Before execution there is no flag row and each stage says “Not run yet”. After the compare there is exactly one full flag row, inside “1. Compare”, followed by “No register written”; the condition and select remain unexecuted. Its displayed flags agree with the recorded model trace and the local explanation. After the select the condition and selection become visible. Back returns to compare-only disclosure; Reset hides all three stage bodies and the flag row. Direction: retain these execution boundaries and the single flag representation.

The investigation still carries the complete “Compare”, “Condition”, “Select” chain. Both function controls work; switching to the unsigned function retains the compare inputs/flags while displaying its different condition and selected source. Chosen and unused sources remain labelled. The causal chain is readable in stacked phone panels and adjacent desktop panels.

## Prerequisites and answer boundaries

No confirmed missing external prerequisite. The entry panel permits C functions, `int`/`unsigned`, returns and `if`; Module 0 introduces GCC, `-O1`, argument/return registers, operand syntax and assembly editing. Modules 1–3 supply hexadecimal, signed/unsigned readings, top bits, register widths, subtraction flags, no-borrow and shifts. The local conditional-expression definition precedes its use. `cmp`, condition rules and source selection are taught before construction; `bool` and `cset` are defined locally in the later generalisation. Optional `cmn`, `tst` and `ands` notes are not necessary for a first exercise attempt. No later branching knowledge is required: “No instruction is skipped” is explicit.

The first prediction has no outcome initially or after selecting a radio option; its comparison figure is locked until commitment. The failure prediction likewise has no outcome on selection, and its stepper remains locked until commitment. Source inspection confirms comparison differences, return values, conditions and selected sources derive from assembled programs and machine traces. The successful own-code stepper remains gated by the construction result. No challenge solution or final exercise answers were entered or recorded in this note.

## Browser evidence and limits

Used four fresh Chromium contexts: 375×900 and 1280×900, each in actual light and dark themes. Verified html theme attributes and body backgrounds: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`. All four completed initial, selected-but-uncommitted, committed, unsigned investigation, failure-stepper initial, compare, select, Back and Reset states. Each had no page error and no document horizontal overflow initially or after the interactions. The paired listing remains a contained horizontally scrollable unit on the phone.

Evidence: `/tmp/check07.cjs`, `/tmp/check07-results.json`, rendered initial text `/tmp/check07-{width}-{theme}-initial.txt`, and screenshots with the same prefix and `initial`, `stages`, `before`, `compare` and `select` suffixes. Visually inspected representative phone light compare, phone dark investigation and desktop dark investigation screenshots; the four-context logs additionally check theme, locks, stage disclosure, flag-row counts and overflow. All ten sections were read in source and the rendered initial text was retained.

This is a focused checker run, not a full-suite result, simulator conformance test, exhaustive visual/accessibility audit or measurement of learning outcomes. Construction submission/success and its own-code stepper, full hint ladders, every explorer preset, restoration, invalid input and every keyboard path were not browser-exercised. Those limits do not alter the confirmed opening and failure-stepper corrections.
