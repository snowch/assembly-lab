# Second clarity review: Division and remainders

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 against the [brief](brief.md), `CLAUDE.md` and both
closing passes in `docs/style.md`. Reader position: lesson 16, after
`products-and-widths`, with the front-page prerequisites and earlier lessons only.
No learner-facing text or code was changed.

## Result

The division vocabulary, rounding explanation and distinction between C rules and
instruction results are clear. The outstanding medium issue **M5** remains. One
additional occurrence belongs to existing shared issue **M6**; it is not a new
issue category. No other finding survived the prerequisite check.

### M5 retained — medium: the wider divisor needs an explained input guarantee

- Quote: “For a 64-bit division, also ensure the divisor is a 64-bit unsigned
  value: writing `w1` clears the upper half of `x1`.”
- Location: [division-and-remainders.prose.ts](../../../content/lessons/division-and-remainders.prose.ts),
  line 38, generalisation. The final task at line 40 says “`w1` holds unsigned
  distance in metres.”
- Learner effect: the instruction explains how a write affects the upper bits,
  but not why the incoming register needs preparation. A value specified through
  `w1` can look like a write to `w1`. The first exercise test deliberately supplies
  an `x1` value with upper bits present, while the distance occupies its low half
  (`division-and-remainders.ts:272–279`). Its rendered failed-test inputs therefore
  name `x1`, although the task describes `w1`.
- Prerequisite check: `constants-and-widths.prose.ts:66` teaches “Writing a `w`
  name always clears the upper 32 bits of the `x` register.”
  `loading-widths.prose.ts:13` defines zero extension; `array-addresses.prose.ts:36`
  explains extending a count for address arithmetic. None says that specifying a
  narrow incoming argument is different from executing a write, or guarantees the
  incoming upper bits. The preceding multiplication lesson reads narrow operands
  directly, so it does not supply that missing distinction.
- Direction: state what an input described through a `w` register guarantees and
  connect that guarantee to the need to prepare a wider divisor. Leave the exercise
  implementation for the learner.

### M6 additional occurrence — low here: a correct action is headed “Common mistake”

- Quote: “Keep the original dividend available for the final subtraction.”
- Location: `division-and-remainders.prose.ts:25`, second hint for
  `write-remainder`. The visible heading comes from
  `platform/lesson-runtime/src/strings.ts:122`.
- Learner effect: the heading labels the recommended action as a mistake. A reader
  asking for help has to decide whether to follow the instruction or its heading.
- Direction: make this hint identify the mistake and its consequence, or use an
  accurate supported heading. Do not edit the vendored platform directly. Merge
  this occurrence into M6 rather than counting another medium issue.

## Coverage and prior knowledge

Read all ten sections, objectives, captions, prediction questions and feedback,
both tasks, all ten hints, test labels, both expandable notes, reflection and the
model-versus-reality note. Reviewed the lesson's prose, labels and assembly wiring,
and the shared division-diagram labels in `packages/views/src/strings.products.ts`.
Read rendered stepper, prediction, hint and failed-test text during the interactions
below.

The page defines dividend, divisor, quotient, remainder and rounding towards zero.
Earlier lessons supply hexadecimal, signed interpretation, condition flags,
register widths, zero extension, branches, widened products, `msub`, C casts and
undefined signed overflow. Module 0 supplies the compiler and optimisation-setting
context. Apart from M5's incoming upper-bit guarantee, no additional unexplained
assumption was found. The negative diagram's signed labels are consistent with
the nearby explanation that its lengths show the dividend's size.

The source assessment was formed before consulting the
[first reader report](../english-review/16-division-and-remainders.md) and
[retained issue list](../english-review/README.md). M5 is unchanged from that
review; the hint-heading occurrence is further evidence for its existing M6.

## Browser evidence

Used Chromium on the immutable preview at
`http://127.0.0.1:4253/assembly-lab/#/lesson/division-and-remainders`, at
1280 × 900 and 375 × 900, each in light and dark themes.

In every configuration, opened the details, submitted each of the three options
for both predictions, exposed all ten hints, ran both supplied starting programs,
and stepped all seven instruction figures to their terminal state. Read the
resulting text and inspected screenshots of the page, division diagram and final
exercise. No alternative exercise programs were entered and not every possible
assembler diagnostic was exercised. Document width matched viewport width in all
four configurations.

Local evidence: `/tmp/clarity2-16.mjs`, `/tmp/clarity2-16-browser.log`, rendered-text
captures `/tmp/clarity2-16-{1280,375}-{light,dark}.txt`, and corresponding
`-start.png`, `-diagram.png` and `-challenge.png` screenshots. These are temporary
review artifacts, not course assets. No rebuild or full test suite was run by this
reader.
