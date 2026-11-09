# Constant-building calculator: checked-facts brief

## Request and outcome

After the two-half visualization was merged and verified live in PR110, the user proposed a bit scratchpad, then chose Calculator only in an explicit preference answer. They also identified that the text asserts the upper-half multiplier without explaining why it is 65536. The authorized scope is an optional calculator local to Build 1000000 and a visible explanation of that positional weight, followed by independent review, checks, merge and live verification. Do not add a bit picker.

The outcome remains constructing a fresh constant with mov/movk while preserving the other half. Decimal arithmetic speed is not the assessment. Keep all essential mechanism guidance visible, the same worked example, hint ladder, challenge identity and gated solution. General division instructions and a full binary conversion tool are deferred.

## Preparation and facts

- Earlier pages teach bit 0 on the right, doubling the weight with each position left, hexadecimal and the two 16-bit halves. The lowest position in the upper half is bit 16; its weight is sixteen doublings from 1, or 2^16 = 65536. An upper-half value counts groups of that amount. Existing model/facts cases pin mov w0,65536 as 0x0001 0000 and the 2/3 worked example as 131075.
- Positive w0 values decompose as upper times 65536 plus lower, with lower in 0..65535. The existing procedure divides to find the whole-number part, then multiplies and subtracts to find the remainder. Keep the worked decomposition distinct from the exercise target.
- Existing Calculator.tsx and calculator.ts provide blank, optional, bounded BigInt scratch expressions, no eval, no answer/bit/register callbacks. Their default division rejects nonintegral results. It cannot implement this page's divide-and-ignore-decimals direction unchanged.
- Introduce an opt-in whole-number-division mode for this exercise only. BigInt division keeps the whole-number part (towards zero; for this positive-number procedure this is the required lower whole number). Preserve exact division and its errors on existing reading pages. No global arithmetic semantic change or mode selector is needed. Do not add new operator syntax.
- The local helper and format text must explain division's result and the input format before use. Replace the reading calculator's context-specific weights helper in this mode. Align the procedure with the whole-number result actually shown.
- Mount the existing calculator beside the assembly editor for this challenge, before code entry, via an opt-in initial.data setting. Leave its calculation empty, never read the challenge's target/answer, never fill the editor or generate instructions. Calculation/Enter must not submit Run tests or affect grade, hints, saved solution gate or assembly state.

## Learning hypotheses and checks

The user observed a missing causal bridge. The original review missed that burden; a new independent early learning review confirms the need for the bit16/doubling explanation and calculator-specific division guidance. Clicking a calculator is not evidence of understanding. The existing independent assembly task remains the application, and a future novice session would ask why the multiplier is 65536 and how to preserve the other half.

Use separate Medium drafting for the new prose and UI words under docs/style.md. Independent High learner/UX and Extra High technical reviews must check the actual built page and earlier preparation. Record source-only/browser checks separately. Cover phone/desktop, actual light/dark, blank/valid/inexact/invalid arithmetic, keyboard and at least44px targets, Text/Tap, unchanged editor/grade/gate, hints and restored code. Inspect the exact-division calculator sibling. Test negative truncation/zero division and the 32-bit upper/lower boundary with the model even though the lesson procedure is explicitly positive.

Preserve PR110's product touch-target failure and corrected final passing evidence in its record; do not reinterpret that failure as a pass. Full CI for the new head and public deployment verification are required. No novice or assistive-technology study is available. No platform/ edit is authorised or needed.
