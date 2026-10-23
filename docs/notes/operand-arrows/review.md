# Operand connector review

Copyright © 2026 Christopher Snow

Independent reviewer: learner/browser review agent, 2026-10-23. Read `brief.md`, the CSS diff,
OperandRoles and the relevant visual-language rules. No learner-facing strings or operand
semantics changed, so no separate wording pass was needed. No app source was edited by this
reviewer.

Reviewed the actual production build through a separate preview on port 4187. Fresh Chromium
contexts covered 375 × 900 and 1280 × 900 in light and dark themes. Confirmed the actual
`data-theme` value in every context. Opened Meet the machine, confirmed the operand diagram
was hidden before prediction commitment, then revealed it through its normal control.
Screenshots were taken and visually inspected in all four combinations; they are in
`/tmp/operand-arrows-<width>-<theme>.png`. Structured computed-style and geometry evidence is
in `/tmp/operand-arrows-review.json`.

| Check | Light | Dark |
| --- | --- | --- |
| Shaft colour | rgb(81, 96, 93) | rgb(161, 173, 170) |
| Actual diagram background | rgb(255, 255, 255) | rgb(23, 30, 29) |
| Calculated contrast | 6.60:1 | 7.32:1 |
| Computed shaft width | 2 px | 2 px |
| SVG vector effect | non-scaling-stroke | non-scaling-stroke |

These values apply at both viewport widths. Contrast was calculated from the actual opaque
background and computed shaft colour using standard relative luminance. The non-scaling
stroke preserves a 2 px shaft despite the SVG viewBox stretching horizontally. Arrowheads
use the same theme colour as the shafts.

The previously faint connector now reads clearly in the dark phone view. Both read branches
are visible, merge into one arrow towards Add, and continue from Add towards Write. Shafts
and heads remain aligned and connected; the bolder treatment does not obscure the chips or
change the distinction between dashed reads and the accented write. Read/Add/Write labels
continue to convey the flow without depending on colour alone.

SVG endpoint measurements match each read chip's horizontal centre and lower edge exactly.
The merged arrowhead's centre matches Add's centre, and its lower tip meets Add's top edge.
The second connector starts at Add's centre/lower edge and its tip meets Write's centre/top
edge. The measured coordinate differences are zero at the tested widths. No diagram or page
horizontal overflow was observed: scroll/client widths are 375/375 and 1280/1280. No page
errors were observed.

Source scope is limited to the OperandRoles connector selectors. The change preserves the
existing grid geometry, arrowhead paths, labels and prediction gate. Sibling diagram shafts
already use ordinary pixel-scale widths; this review found no reason to change their styles.
No independent learner or visual blocker remains. This was a focused built-browser review,
not a full-suite or physical-device test.
