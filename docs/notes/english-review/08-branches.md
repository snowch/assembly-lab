# English review: Branches, and the run that skips

Copyright © 2026 Christopher Snow

Review only, 18 October 2026. No course text changed. Read against `CLAUDE.md` and both passes in `docs/style.md`. The learner has completed the front page and the eight earlier lessons, ending with Compare and choose; no later lesson is assumed.

## Finding

### 1. Low: “block” has no learner-facing meaning yet

Exact quote: “The run for a `litres` of 0 went on into the next block instead of returning. Does every block end in `ret` or `b`?”

Location: `content/lessons/branches.prose.ts:71` (`fuelWarningFeedback.fellThrough`).

Learner effect: the feedback directs the learner to check the end of every “block”, but neither the front-page prerequisites nor the preceding lessons nor this lesson explain which instructions constitute a block. A novice cannot reliably identify the unit the question asks them to inspect, particularly when labels and the C's braces are both on this page. This matters at a point where the learner has already made an execution-order mistake.

Direction: identify the relevant groups of instructions using the labels and execution sequence already taught, or explain the intended meaning of “block” before relying on it in corrective feedback. Do not assume that knowing C `if` statements supplies the assembly meaning.

Verification: searched every earlier prose file for `block`; none uses or defines it. Reproduced the feedback in the browser with a deliberately faulty zero-input path that continues into a following label. The quoted sentence was present at both widths and in both themes. Review contains no challenge solution.

## Prerequisite audit

The front page permits small C functions with `int`/`unsigned` arguments, `return`, `if`/`else`, loops and arrays, and binary/decimal arithmetic. It does not permit prior assembly knowledge.

Earlier teaching checked directly:

- Meet the machine explains GCC, listings, instructions, operands, register argument order, `w0` as result, `ret`, the program counter and continuing into following instructions; its compiler note explains `-O1`.
- One pattern, three readings explains hexadecimal, signed and unsigned readings, top bits, and set/clear.
- Constants and widths explains `mov`, register widths and the GNU assembler (“the program GCC uses to turn its listings into instructions”, line 32).
- Adding and the flags and Subtracting and the tick counter explain NZCV, flag persistence, arithmetic and borrow.
- Masks explains bit numbering and the warning word's service-due bit (question, line 17); Shifts explains moving bits.
- Compare and choose explains `cmp`, `cmn`, `csel`, `cset`, signed/unsigned conditions, and the `warning_light` example. Its explanation gives the `gt`, `ge`, `lt` and `cc` rules used here.

This lesson explains labels, branches, taken/not taken, `wzr`, conditional-branch spelling, `cbz`, bit-test branches and its new `void` return type where used. No additional missing prerequisite found beyond “block”. “GNU assembler”, `-O1`, hexadecimal and the service-due bit are not findings because the preceding teaching supplies them.

## Complete coverage

Read all of `branches.prose.ts`, `branches.labels.ts`, `branches.ts` and `branches.listings.ts`, the applicable shared figure/editor/prediction/grading strings in `packages/views/src/strings.ts` and `strings.branch.ts`, and the runtime strings. Covered all ten sections, objectives, headings, captions, listing labels, field groups, both prediction questions/options/explanations, both challenges, all five hints for each challenge, all five fuel-warning feedback variants, the count feedback, all disclosure summaries and bodies, reflection question/answer, simulator stepping note and model-versus-hardware note. Source-only answer text was reviewed without reproducing solutions here.

Actual browser review used the already-built site at `http://localhost:4220/assembly-lab/#/lesson/branches`, at 1280 × 900 and 375 × 900, in light and dark. Initial and revealed views were captured for all four combinations. Opened disclosures, checked both predictions, stepped both runs to completion, revealed all ten hints, ran failing code and numeric submissions, and separately exercised each specific fuel-warning feedback variant. Read the rendered text and inspected full-page desktop-dark and phone-light screenshots. The presentation did not introduce another English ambiguity.

Evidence (temporary local artifacts):

- `/tmp/english08.cjs`, `/tmp/english08-browser.txt`, `/tmp/english08-{1280,375}-{light,dark}.png`: initial page states.
- `/tmp/english08-states.cjs`, `/tmp/english08-states-{1280,375}-{light,dark}.{txt,png}`: disclosures, predictions, completed steppers, hints and failed challenge cards.
- `/tmp/english08-feedback.cjs`, `/tmp/english08-feedback-{1280,375}-{light,dark}.txt`: targeted feedback states, including the reported wording.

No build or full test suite run; this was a text and browser review.
