# Subtraction and reuse: independent learner review

Reviewed the built lesson at http://localhost:4324/assembly-lab/#/lesson/subtraction-and-reuse,
24 October 2026. Reviewer did not draft or implement the changes. Prerequisites were the
front-page entry requirements, One addition and A tiny function; later lessons were not used.

## Findings

No blocking learner or layout finding found in this pass.

- “In `add w0, w0, w1`, both appearances of `w0` name the same register” establishes reuse
  before the worked addition. Its initial operand path shows the old inputs and an unknown
  write, so the learner sees the relationship without receiving the calculated result.
- “The next figure starts a separate example” and “This example starts afresh” make the
  changed inputs explicit. Executing the first figure did not change the second figure.
- “`sub` subtracts its third operand from its second” precedes the subtraction. The drawn
  minus sign follows that same source order. After execution, the result treatment is solid
  and the input labels retain their old values, making read-before-write interpretable.
- The short paragraphs after the figures read as one explanation, without the previous
  repeated chapter breaks. Three visible section headings separate subtraction, practice
  and reflection. The underlying authoring-section headings remain accessible, without
  consuming visual space.

Rejected potential finding: the figure repeats its source values below the initial register
chips. The chips establish the initial machine state; the path associates those values with
ordered reads and an unknown write. This is useful distinction, not another prose walkthrough.
No additional static diagram is needed for this single-operation example.

## Prior knowledge audit

The lesson assumes register names, operands, destination, addition and instruction execution.
One addition teaches those. It assumes no new C feature, compiler flag, tool command, calling
machinery or later instruction. `sub` is explained before it must be used. No unexplained
prerequisite term was found.

Reuse is defined, demonstrated with one complete arithmetic operation, and then applied to
subtraction. A smaller complete example would be the same one-operation addition already
present. The separate subtraction is a useful bridge to the fresh-input exercise; a whole
function would add unnecessary mechanisms here.

## Built-page checks

Playwright Chromium, fresh storage for each of six contexts: 375, 768 and 1280 CSS pixels,
light and dark. Confirmed actual `html[data-theme]` for each context. Read the whole lesson;
inspected full-page phone screenshots in both themes and geometry at all widths.

In each context checked initial operand paths with unknown destinations, both independently
executed figures, persisted results after reload, reset and persisted reset. Initial practice
fields were blank and no practice answer was exposed by the worked figures. No page-level
horizontal overflow or page errors occurred. Ten authoring sections remain; seven supporting
headings have a one-pixel clipped box while the three main headings remain full size.

Evidence outside the repository: `/tmp/read-subtraction.mjs`,
`/tmp/subtraction-reader-results.json` and `/tmp/subtraction-{light,dark}-{375,768,1280}.png`.
This was a focused learner/layout check, not the full educational suite or an independent
hardware test. Challenge grading was not rerun in this reader pass.
