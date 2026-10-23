# Operand connector validation

The connector paths used `vector-effect: non-scaling-stroke` with a stroke width of `0.12`, leaving a 0.12 CSS pixel shaft regardless of SVG scaling. The correction uses a 2px non-scaling stroke and the existing `--fg-muted` theme token for both shafts and heads. No model, diagram geometry, prediction gate or learner-facing text changed.

`OperandRoles` currently appears in Meet the machine. Inspected sibling arrow styles in `branch.css` (2–4px strokes) and `module0.css` (argument arrowheads); the fractional non-scaling stroke issue was confined to `.al-op-line`.

Focused validation:

- Production `npm run build`: passed, exit 0 (`/tmp/operand-arrows-build.log`).
- Prettier check of `packages/views/src/module0.css`: passed.
- Existing operand-flow Playwright test: 2 passed, desktop and phone, exit 0 (`/tmp/operand-arrows-browser.log`). Checks rendered connector alignment and no page overflow.
- `git diff --check`: passed.

The full suite was not rerun for this CSS-only change. Independent built-site visual review is recorded in `review.md`.
