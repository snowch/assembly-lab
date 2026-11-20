# Independent technical review: zero start and optional subtraction

Copyright © 2026 Christopher Snow

The reviewer did not write the implementation or copy. Reviewed both repositories' local diffs, the current model sources, storage paths, copy and tests; then exercised the built lessons on owned ports 4561/4562. No implementation changes or commits were made by this reviewer. The findings below establish functional/source consistency, not novice learning effectiveness or physical-hardware behaviour.

## Source and model checks

- Fresh exploration and Reset now use a separate `COUNTER_EXPLORER_START = 0`. Arm's fixed `COUNTER_WRAP_START = 13` and three-tick worked subtraction remain unchanged. RISC-V's fixed `COUNTER_START = 14n` and `counterWrapState()` remain unchanged. The model's arithmetic functions have no diff.
- The required pane only exposes +1 and Reset. Its copy describes forward ticks and unsigned readings. Borrow terms and −1 are contained in an initially closed optional disclosure. Skipping that disclosure does not remove anything needed by the fixed elapsed-time example or its later exercise.
- The optional pane has its own state and Reset. Arm uses `counter-wrap:borrow-state-v1`, separate from the existing forward key. RISC-V uses `riscv-counter-borrow-v1:<lesson>`, separate from `riscv-counter-wrap-v2:<lesson>`. Each renderer scopes its queries to its own pane. Source inspection found no writes to program source, native CPU state, predictions or exercise outcomes.
- Existing valid saved histories remain intact. If an old forward history ends with subtraction, the forward pane preserves its stored value but suppresses that operation's marker. It does not relabel borrow as addition carry. The same filter prevents an opposite-direction saved operation from becoming the optional pane's borrow. After the next actual pane-specific operation, the matching marker is computed normally. A preserved trail is labelled as recent stored readings, not as newly executed forward ticks.
- Arm's visible carry note and the optional no-borrow C qualification remain correct: `adds` uses the actual register width; `subs` writes C=1 for no unsigned borrow; plain `add`/`sub` preserve flags. The four-bit markers are explicitly a teaching view. RISC-V correctly claims no carry or borrow flag. The optional decrement is explicitly an arithmetic operation, not time reversal or undo.
- The refined RISC-V wording “the lesson program uses 64-bit registers” is accurate and avoids an unsupported claim about whether the program sits above or below the miniature. Removing the unused JSON caption field changes no rendered route or state.

## Independent executable checks

Reassembled and ran the existing 64-byte Arm review corpus with GNU AArch64 as/ld and QEMU. It computes both directions for all 16 starting values. The increment's four-bit carry comes from bit 4 before masking; the decrement's borrow comes from actual `subs` plus `cset ..., lo`. All 32 result/marker pairs matched the current bundled course model and an independent integer oracle.

The current model bundle also checked fresh zero, rejection of sparse corrupt state, all old numeric tick migrations, preserved fixed Arm 13→0/three-tick arithmetic, and 160 steps in each direction returning to zero with at most five recent readings. An initial temporary inline review harness had a parenthesis typo and did not bundle; the corrected standalone harness passed. That harness setup error is not counted as a passing test.

Independently reran `npm run test:counter` in RISC-V: 32 actual xv6 comparisons and 32 independent QEMU comparisons passed, with no failures. Its unchanged native program and model confirm that the UI restructuring introduced no arithmetic change.

Raw sources and evidence are outside both repositories under `/workspace/work/counter-zero-review/`: `arm-counter.s`, the native executable and 64-byte output, the current model bundle/JSON, `riscv-native.log`, `technical-browser.mjs`, its result JSON and screenshots.

## Independent built-browser checks

Passed 12 contexts: both courses × 320/390/1440 px × actual light/dark themes. Actual opaque backgrounds were checked numerically, rather than inferred from the selected preference.

In every context:

- Fresh forward state showed 0000, decimal 0 and a dash under Carry out. It had two controls; borrowing stayed closed and absent from the visible forward pane.
- Sixteen keyboard presses returned the forward counter to zero with carry 1. Focus stayed on +1; its viewport position remained within 1 px of its own baseline. Results remained above the controls.
- Opening the optional pane supplied its own zero state and dash. One decrement showed 1111, unsigned 15 and borrow 1. Sixteen further decrements completed another turn. Its controls remained stationary and the forward value/marker did not change.
- Resetting either pane affected only that pane. Program drafts and a prediction input/selection remained unchanged; Arm's uncommitted elapsed prediction gate stayed closed, and RISC-V's native result remained unexecuted.
- No page overflow or page errors occurred.

Four additional phone restoration checks passed: each course restored a saved opposite-direction history without relabelling its marker, and each restored its old legacy progress. The optional pane remained independent. The next pane-specific operation then produced the correct marker.

The RISC-V test expectation change is justified: the new forward child is transparent by design, while `#counter-wrap` paints the visible panel. Reading that painted root's exact expected light/dark RGB retains the rendered-theme assertion; expecting the transparent child's computed background to be opaque would be a harness error, not a product failure.

## Findings

No open technical finding. The changed default, separate panes, marker filtering and storage compatibility agree with the requested route. Full-suite evidence belongs to the parent's checks; this review claims only the independently executed checks listed above. No human novice study was performed.
