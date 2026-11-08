# Returned-value explanation: checked learning and layout brief

The user supplies `4592.jpg` and asks to improve the last section using that mock. This follows the comparison/count wording task, which is independently reviewed and running unchanged in a separate worktree/PR102. This branch begins at its reviewed commit; do not modify the original worktree or its running check.

## Observable outcome and preparation

The learner can explain how the same returned w0 pattern produces the two C values by adding the lower 31 bits' contribution and bit 31's contribution. Earlier Module 1 lessons teach bit weights, signed/unsigned readings and four-bit arithmetic. This page applies those to two actual recorded C functions. It does not introduce flags, new arithmetic or a new assessment. The closing return-zero question remains the fresh application: choose an explicit check from the intended function meaning. No beginner study is available; clarity review is a hypothesis, not proof of learning.

## Checked facts and interaction

- Read `ListingCompare.tsx`, `strings.call-comparison.ts`, `module1.css`, `content/lessons/pacing-1-4.copy.ts`, existing component/browser tests and docs/style.md. The preceding independent reviews and current built checks cover the existing structure; this revised last section still needs its own built inspection.
- `CallResults` gets successful returned words from two independent simulator traces. It shares the bit display only when every computed word matches. Results and explanation remain behind prediction plus Run comparison. Reset hides results, restoration recomputes them, differing words and faults keep separate displays.
- All bit values, hex, lower-bit totals, top contributions and returned C values must derive from `word`, `signedOf`/`unsignedOf` and the existing 32-bit model; never type example totals into layout/copy.
- The current generic explanation also supports a clear top bit and equal return types; do not assert two different numbers or a negative top contribution when the selected types/bit do not produce that.
- The mock requests a descriptive heading, local explanation, a shared-word callout, an aligned contributions table with an emphasized total row, and signed/unsigned stacked sums. Keep the result cards above. Preserve local type-rule/no-warning qualifications and the reminder link.

## Learning / UX decisions

Likely confusion: the lower bits changed meaning too, or the top bit is a separate minus sign. Put equal lower contributions in each table column, then the signed/unsigned top contributions directly below. The stacked sums add a distinct job: vertically align the actual arithmetic, using the same computed values; do not add another bit-grid or repeat the whole source code. Clearly distinguish bit weight from contribution if bit31 is zero. Use visible labels and sign characters, not colour alone.

At phone width, stack the two sum cards as needed and keep the table inside its panel; no page overflow or squeezed unreadable digits. Desktop can keep cards side by side. Use existing visual tokens and proper table headings/row labels. Keep the user-requested fully visible explanation rather than adding a new disclosure/control.

Check initial/committed/result/reset/restored states, positive and negative differences, matching equal types, differing words and fault handling. Browser acceptance: actual light/dark at phone/desktop, contained widths, reachable reminder link, correct headings and no errors. Source/model tests must check every displayed contribution and total; do not weaken prediction or result gates to accommodate the layout. Independent learner/UX and technical reviews follow the separate prose draft.
