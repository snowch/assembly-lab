# Connecting addition to the instruction

Copyright © 2026 Christopher Snow.

## Scope and mechanism

The approved architecture mock is integrated into the existing four-bit arithmetic lesson. Its worked addition now uses 3 + 3, so bit 1 demonstrates two operand ones and an incoming carry one. Both outputs are one; the retained four-bit result is 0110. The fresh subtraction exercise and its identifiers remain unchanged.

The closing activity runs the existing `primitive_add` program's first instruction, `add w2, w0, w1`. The simulator supplies the before/after registers, write record, unchanged flags and arithmetic columns. Its `ret` belongs to the test harness and is not executed by the figure's Run ADD control. Column selection inspects this operation rather than executing another instruction.

The full 32-bit result stays visible. The selected detail covers only bits 3 to 0. For 15 + 1, its bit-3 carry continues into bit 4 and w2 holds 16. At the actual 32-bit boundary, 0xffffffff + 1 writes zero. A write remains marked even when the written value equals the previous value. Decimal and hexadecimal inputs are validated before loading them; an invalid pending draft does not replace the running model's inputs.

The register-to-ALU-to-destination diagram is a functional explanation of this instruction. It does not claim a physical processor layout or model timing. The local definition introduces ALU, and the cross-course link opens Bit Lab's gate-level explanation. Source and canonical-copy records are in `architecture-brief.md` and `architecture-copy.md`.

No platform, ISA, flag semantics or storage namespace changes. The new interactive uses the lesson store for its own inputs, execution moment and selected column. Existing graded work remains in its existing slots.

## Validation record

- Focused model/view tests: five files, 54 tests passed. They include all eight three-input column combinations, full-width boundaries, one destination write, unchanged flags, restore/reset and exact canonical copy.
- Focused built browser tests: 18 passed. The new activity covers 375, 700 and 1280 pixels in light/dark themes, keyboard focus, stable scroll, input validation, full-width arithmetic, carry into bit 4, reload and reset. The existing four-bit walkthrough and fresh exercise also pass.
- The first focused browser command was stopped with exit 130 before running tests because its selected port overlapped Bit Lab's test server. The final run used a separate port; it does not change that cancelled command's outcome.
- The exact existing assembly program and six boundary calls are pinned in the GNU/QEMU differential corpus. The local native tools are unavailable; native differential execution is delegated to the existing CI job.
- Production typecheck/build and focused formatting passed before the full check. Full-suite and independent final-build review results are recorded below once complete.

These checks are browser automation and independent editorial/technical review, not evidence from a novice learning session, a physical phone or screen-reader speech testing.

## Independent findings and full-check progress

The independent production review checked both courses, their prerequisites and the model records, then exercised 375/1280 in both themes plus 700 light. A separate 961-pixel Assembly check verified the two-column breakpoint with maximum-width decimal values. The expert review found no arithmetic or lesson-order blocker in this course. Separate learner and technical reports preserve the evidence and review limits.

One accepted visual finding concerned the selected bit button in dark mode: the generic hover background replaced the accent background while leaving the accent foreground. A scoped selected-hover rule now preserves the selected palette. The browser matrix adds an assertion comparing its actual hovered and unhovered colours after normal CSS transitions finish. Final independent rebuilt verification passed at 375/700/1280 in both themes: selected idle/hover palettes agree, text contrast exceeds 4.5, and keyboard focus and scroll remain stable. This finding is closed.

The first full `npm run check` exited 1: 185 unit files and 3,225 tests passed, while the existing `bitops.focus.test.tsx` selected-byte focus test exceeded its unchanged 30-second timeout during the full run. Its isolated rerun passed all three tests in 6.30 seconds without code or assertion changes. Formatting, copyright, platform integrity and TypeScript passed before that unit-stage failure; build/browser stages were not reached by that command. A full-command rerun follows the final hover build.

The full-command rerun and CI are in progress at this record's commit. The pull request's validation record carries their final outcomes separately from the original failure and focused passes above. No timeouts or existing assertions were relaxed.
