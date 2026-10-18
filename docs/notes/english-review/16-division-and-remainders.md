# English review: Division and remainders

Copyright © 2026 Christopher Snow

Review only, 18 October 2026. Reader position: Module 8 lesson 2, after `products-and-widths`, with only the front page's prerequisites and earlier lessons. No learner-facing text or code changed. Read against `CLAUDE.md` and both closing passes in `docs/style.md`.

## Finding

### 1. Medium: the reason for preparing the wider divisor is missing

- Exact quote: “For a 64-bit division, also ensure the divisor is a 64-bit unsigned value: writing `w1` clears the upper half of `x1`.”
- Location: `content/lessons/division-and-remainders.prose.ts:38`, generalisation. Related task wording at `:40`: “`w1` holds unsigned distance in metres.”
- Effect: the reader knows that writing a `w` register clears the upper bits, but is not told that receiving an argument described through `w1` leaves the initial upper half of `x1` unspecified. Naming the argument through `w1` can reasonably look like the same sort of write that earlier lessons say clears those bits. The instruction to “ensure” the wider value therefore arrives without the reason the current register contents need attention. This matters in the actual exercise: the first test supplies a wider register value while specifying the distance only through its low half (`content/lessons/division-and-remainders.ts:272–279`). The failed-test display then names `x1`, although the task names `w1`.
- Prior-definition check: `constants-and-widths.prose.ts:66` explicitly teaches “Writing a `w` name always clears the upper 32 bits of the `x` register.” `loading-widths.prose.ts:13` defines zero extension, and `array-addresses.prose.ts:36` explains widening a count for address arithmetic. These explain the operation, but not the initial state of the unused argument bits. `products-and-widths` uses two narrow inputs directly for widening multiplication and does not need this distinction. The later calls lesson is outside this reader's knowledge.
- Direction: explain what is and is not guaranteed by an input specified through a `w` name, and connect that guarantee to the reason for preparing a wider divisor. Keep the implementation for the learner to construct.

No additional wording findings survived the prerequisite check. In particular, `msub`, unsigned widening multiplication, signed ranges, zero extension, hexadecimal, condition flags, GCC and its optimisation setting all have earlier explanations. The division terms and rounding rule are explained on this page.

## Coverage and prerequisite evidence

Reviewed all ten sections, objectives, both expandable notes, figure captions, diagram labels, prediction questions/options/explanations, both exercise tasks, every test label, all five hints in each exercise, reflection and model-versus-reality note. Sources: the lesson's `.ts`, `.prose.ts` and `.labels.ts`; `products.listings.ts`; `packages/views/src/strings.products.ts`; shared stepper, prediction, grading and editor strings; `platform/lesson-runtime/src/strings.ts`; and `apps/course/src/runtime-strings.ts`.

Checked the front page's “Before you start” in `apps/course/src/strings.ts`: small C functions with integer arguments, returns, conditions, loops and indexed arrays; binary arithmetic; no assembly prerequisite. Used course order in `content/lessons/index.ts` through `products-and-widths`. Checked earlier explanations relevant to this lesson: Module 0's compiler/settings and argument/result registers; Module 1's signed readings, remainder and register widths; arithmetic flags and overflow; shifts; branches and labels; memory target/byte order; loading widths and extension; array indexing; and the preceding multiplication lesson's full products, casts, `msub` and undefined signed multiplication. No later lesson was used to excuse a missing explanation.

The remaining assumed knowledge not established earlier is the initial status of the upper argument bits, recorded in finding 1. The page otherwise supplies the new division vocabulary and instruction behaviour it needs.

## Browser evidence

Reviewed the existing built site at `http://localhost:4220/assembly-lab/#/lesson/division-and-remainders` using Chromium with 1280 × 900 and 375 × 900 viewports, each in Light and Dark. Opened both details, checked both predictions to expose feedback and gated figures, opened all ten hints, and ran the supplied starting programs to inspect failed-test feedback. Inspected rendered text and screenshots, including the division diagram and the expanded exercise panels. All four combinations had no document-level horizontal overflow; wording findings were the same in both themes and widths.

Local review artifacts: `/tmp/english16.mjs`, `/tmp/english16-browser.txt`, `/tmp/english16-{1280,375}-{Light,Dark}.png`, and corresponding top-of-page crops. These are review evidence, not course assets. No rebuild or full test suite was run.
