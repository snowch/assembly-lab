# English review: C overflow and machine results

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026. Scope: Module 11, lesson 1 (`c-and-overflow`), for unclear English only. No lesson or shared UI source was changed. No rebuild or test suite was run.

## Result

No confirmed unclear-English finding. There are no proposed rewrites or exercise answers in this note. This is not a technical certification of the C rules or compiler output.

## Coverage

Read `CLAUDE.md` and both passes of `docs/style.md`. Read all learner-facing lesson strings in `content/lessons/c-and-overflow.prose.ts` and `content/lessons/c-and-overflow.labels.ts`, their mounting and challenge configuration in `c-and-overflow.ts`, and the displayed records in `c-boundaries.listings.ts`. Checked the relevant shared prediction, listing, stepper, editor and grader strings in `packages/views/src/strings.ts`, `apps/course/src/runtime-strings.ts` and `platform/lesson-runtime/src/strings.ts` against the rendered page.

Coverage includes the objectives, all ten sections, captions, both prediction questions and their options, prediction explanations and match/mismatch feedback, both challenge tasks, all five hints for each challenge, all test labels and ordinary failed/passed test feedback, all three optional notes, the locked and unlocked figures, the reflection, and both simulator notes. Both steppers were advanced through their returns. Both supplied reference artifacts passed all six cases in each browser combination; they were used only to expose the completion text and gated listing.

## Prerequisite check

The learner was credited only with the front page's “Before you start” panel (`apps/course/src/strings.ts:24`) and the lessons preceding this one in `content/lessons/index.ts`. No later Module 11 lesson or Module 12 material was used to dismiss an assumed-knowledge concern.

Checked the relevant earlier explanations:

- GCC and `-O1`: `meet-the-machine.prose.ts:10` and `:16` explicitly introduce the compiler and explain the setting.
- Signed/unsigned readings, bit patterns and widths: Module 1; instruction results and overflow flags: `adding-and-the-flags.prose.ts:13` and its subsequent explanation of the flags.
- `cmp`, conditions and `cset`: `compare-and-choose.prose.ts:23`, `:46` and `:112`; branch and label syntax: `branches.prose.ts:24` and `:46`.
- Unsigned loops and wrap boundaries: `counting-up.prose.ts:14`; signed C overflow versus machine low-bit results: `products-and-widths.prose.ts:9`.
- Undefined division and the requirement to check before the operation: `division-and-remainders.prose.ts:9` and `:36`.
- The deliberately limited course compiler: the preceding Module 10 lessons, `from-c-to-instructions` and `compile-a-loop`.

The current lesson supplies its additional concepts: `INT_MIN`, `INT_MAX`, the header/include mechanism (`c-and-overflow.prose.ts:11`); the C language setting (`:9`); `-fwrapv` (`:18`); saturation and the branch-preserving compiler settings (`:38`); and digit-to-integer parsing (`:41`). No additional untaught prerequisite was confirmed.

## Browser evidence

Reviewed the existing build at `http://localhost:4220/assembly-lab/#/lesson/c-and-overflow` in Chromium with 1280 × 900 and 375 × 900 viewports, each in light and dark themes. Opened every details panel, checked both predictions with wrong and matching selections, opened all ten hints, ran the initial and completed challenges, and inspected the revealed listings and stepper status text. The page had no horizontal document overflow in any of the four combinations. The explanation text was visually inspected in all four combinations; phone wrapping preserved the meaning of the inequalities and their surrounding sentences.

Evidence is under `/tmp/english-21/`: `review.mjs`, `complete.mjs`, four `*-failed.txt` dumps, four `*-complete.txt` dumps, corresponding full-page screenshots, and four `*-reading.png` viewport screenshots. Temporary evidence contains disclosed exercise material; it is not reproduced here.

## Wording considered and retained

“Compare two compiler contracts” is immediately made concrete as an extra compiler guarantee in the opening paragraph. “Its corresponding branch” follows the separate positive- and negative-operand cases; the preceding branch lessons provide the control-flow vocabulary. The optional parser note now identifies the text-conversion task and states the repeated arithmetic operation. These phrases did not leave a material ambiguity after reading their immediate context.
