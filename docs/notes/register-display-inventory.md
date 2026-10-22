# Register display inventory

Source audit for issue #17, 22 October 2026. This inventory separates a register summary from a diagram whose shape teaches the operation. It records the source before the compact-summary implementation. It does not certify the rendered layout or replace the final independent phone, desktop and theme checks.

## Display families

| Family and source | Role | Scope for issue #17 |
| --- | --- | --- |
| `DecimalRegister` in `parts.tsx`, used by `StepperFigure` in decimal mode | Compact current-state summary: name, decimal value, recorded write | Use the compact shared summary contract. The introductory four values should occupy one row at ordinary phone widths. |
| `DecimalRegister` in `CompilerPlayground`, inside `.al-c-registers` | Compact current-state summary of the registers used by the emitted program | Use the same contract. Support more than four registers without squeezing every register into one row. |
| `.al-memory-register` in `MemoryStepper` | Compact current-state summary with a formatted `w` or `x` hexadecimal value | Use the same contract. Preserve exact width and the model's formatted value. |
| `.al-memory-register` in `StackStepper`, including `sp` | Compact current-state summary with hexadecimal values and the stack pointer | Use the same contract. Preserve the separate source of stack-pointer write information. |
| `RegisterRow` in `parts.tsx`, used by expanded `StepperFigure` | Expandable inspection of all 32 bits, grouped in four bytes | Keep the full teaching diagram. The compact grid must not affect the expanded rows. |
| `RegisterRow` in `SelectStepper`, `ConditionTable`, `ConstantTester`, `RunPrediction`, `LoopPrediction` and `CountPrediction` | Full bit patterns supporting instruction choice, immediate encoding, or a committed prediction | Keep full diagrams and prediction gates. Optional labelled 16-bit halves are part of the explanation. |
| `WideStepper`: `w16`, ordinary `x64`, and named `x64` modes | Full teaching diagrams for immediate halves, upper/lower 32 bits, aliases and clearing the upper half | Preserve their distinct groupings, names, labels and exact `bigint` values. |
| `RegisterReader` | Interactive 32-bit number representation, with signed/unsigned interpretations and calculation | Preserve bit controls and the calculation disclosure. This is not a passive summary. |
| `BitRow` and related rows in `bits.tsx`, `WordStepperFigure`, `SolutionStepper` | Bit movement, low-byte inspection, shifts, sources and results | Preserve cell groups, before/after relationships, and optional all-32-bit inspection. `.al-reg` is also used here, so it cannot become the compact-summary selector. |
| Register bytes in `MemoryStepper` and stack storage diagrams in `StackStepper` | Loaded/stored bytes, extension, saved register locations and return targets | Preserve address and byte boundaries. Only their separate register summaries belong in the compact strip. |
| `ArgsFigure` and `OperandRoles` | Argument-to-register mapping and source-to-destination operation flow | Preserve connections and role labels. Do not reduce them to passive name/value cards. |
| `ProductHalves` and division-parts diagrams | Product halves and the quotient/remainder relationship | Preserve the teaching shape and reveal gates. These are derived arithmetic diagrams rather than register summaries. |
| `FlagsRow` | Current N/Z/C/V flags and actual changes to their values | Keep separate. Its changed-bit comparison is deliberately different from a register write. |

## Minimal shared contract

A summary primitive should accept a register name, an already formatted `string | number` value, and a boolean meaning **the current instruction wrote this register**. `DecimalRegister` can remain a compatibility wrapper. The memory and stack callers can adopt the primitive while retaining their existing selectors where useful. Shared summary selectors must not alter `.al-reg`, `.al-bits`, `.al-wide`, or the byte diagrams.

The visual contract should provide the same name/value/status hierarchy, spacing, border and written treatment in every summary. An explicit shared container should wrap summaries according to their content. Four short decimal values should fit on one line at 360–430 CSS pixels; fewer values should not become stretched cards. Extra registers and long values should wrap into more rows. At narrower widths or enlarged text, a second row is preferable to cropped or truncated values. Do not give hexadecimal values an ellipsis. A fixed four-column grid is unsuitable for eighteen-character `x` values.

Keep values readable as complete tokens whenever space permits. The memory helper returns fixed-width hexadecimal strings: ten characters for `w` and eighteen for `x`. It uses `BigInt.asUintN` and must not pass through `Number`, which would lose high bits. Stack addresses remain formatted by the existing address helper. The primitive should not invent a second numeric formatting policy.

Written state needs a visible text mark as well as a border or colour. Reuse the existing string and preserve the distinction between a write and a numerical change. An empty reserved status line should not force every compact card to be tall. The heading, disclosure and summary strip together should be measured against the issue's approximate 90–110 pixel target for the ordinary four-value introductory example; that target is not a universal height limit for long values or enlarged text.

Existing `data-changed` attributes in register components mean a recorded write despite their historical name. Retain compatibility or migrate their selectors and tests deliberately. A new internal `written` prop is clearer. Do not change the actual-change semantics in `FlagsRow`.

## Write semantics to preserve

- `StepperFigure` and `CompilerPlayground` use `view.written`, not a comparison of the old and new values. Writing zero over zero must still say Written.
- `MemoryStepper` and ordinary stack registers use the same register-index write set for both `wN` and `xN` views of that register.
- `StackStepper` derives an `sp` write from the executed step's `writes` entries, because `sp` is not an ordinary numbered register.
- Executing `ret` does not write `w0`. The return value being held there is not a write marker.
- `SolutionStepper` already separates `kind="returns"` from `kind="wrote"`, and passes `written={kind === "wrote"}` to its bit row. Preserve this teaching distinction.

## Disclosure and verification

The existing introductory Show bits/Hide bits state is independent of the trace position. Keep that property across Next, Back, Reset and instruction removal. Use a button with the existing labels, `aria-expanded`, an associated controlled region, a visible keyboard focus and a phone target at least 40 pixels high. Expansion must reveal all 32 bits in four correct eight-bit groups for every displayed register.

Final independent verification should cover the actual built pages, with the rendered theme checked rather than inferred from preference. Inspect collapsed and expanded introductory states at 320, 360, 375, 390 and 430 pixels, landscape, tablet and desktop; also enlarged text or zoom. Include one, two, three, four and more-than-four summaries; signed decimal values; long hexadecimal `x` values; `sp`; initial, stepped, unchanged-write, return, reset and restored states. Record layout measurements and screenshots separately from source assertions. Check that the full teaching diagrams remain legible and retain their groupings.

The final implementation needs focused component and browser checks plus the complete `npm run check`. Record the full command's result separately from subsequent focused reruns, including failures and skips. This source audit performed no rendered checks and ran no test suite.
