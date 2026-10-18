# English review: Compare, and the signed or unsigned condition

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026. Review only; no course content changed. Scope: Module 4, lesson 1, `compare-and-choose`. Read as a learner who knows the front page's “Before you start” panel and the seven preceding lessons, with no later lessons assumed. Instructions: `CLAUDE.md` and `docs/style.md`.

## Findings

### 1. Medium: equal-input feedback suggests that choosing the other equal source fixes the result

Exact quote: “Equal values give the wrong one. Which source does `csel` take when the condition is yes, and which when it is no?”

Location: `content/lessons/compare-and-choose.prose.ts:74` (`lessFuelFeedback.equal`).

Effect: “the wrong one” suggests that one of the two equal input values is the wrong choice. The follow-up question then directs attention to the yes/no source order. With equal input values, exchanging those two sources cannot change the returned value. A learner following this diagnosis can reasonably keep changing the condition or source order without addressing why the code returned a value other than either input. This is a mechanism obscured by the wording, not a preference about tone.

Direction: distinguish an incorrect returned value on the equal-input test from selection of the wrong input; point the learner towards which values their sources actually hold, without implying that the two equal inputs have different correctness.

Validation: the branch selecting this sentence is the equal-arguments case in `packages/views/src/grader-feedback.ts:118`. Reproduced in the browser with an accepted program whose selection sources were a different register: the equal-input failure card displayed this exact feedback. No solution or expected challenge result is recorded here.

### 2. Low: “This” appears to retract the preceding GCC claim

Exact quote: “Two more instructions exist in the architecture: `tst` and `ands`. GCC 16.1 at `-O1` did not use either in any listing here. This is not a claim about GCC's output.”

Location: `content/lessons/compare-and-choose.prose.ts:125` (closed `warning_light, and tst and ands` note).

Effect: the nearest referent of “This” is the sentence about which instructions GCC used, which is explicitly a claim about GCC's output. The reader has to guess whether the qualification instead concerns the instruction descriptions that follow, or whether it withdraws the previous assertion. This makes the boundary between compiler evidence and architecture examples unclear.

Direction: name the particular examples or descriptions to which the qualification applies, and make clear their relationship to the preceding compiler claim.

## Prerequisite audit

Read the front-page prerequisite strings in `apps/course/src/strings.ts`, and the prose and relevant labels/listings of the preceding lessons in course order: `meet-the-machine`, `one-pattern-three-readings`, `constants-and-widths`, `adding-and-the-flags`, `subtracting-and-the-tick-counter`, `masks`, `shifts`.

The page assumes C arguments, returns, `int`, `unsigned`, comparisons and `if`; these are covered by the front panel. New C syntax is explained locally: `?:` in the question and `bool` in Generalisation. The latter's declaration does not need knowledge of headers to follow this lesson.

The assembly assumptions are supported by earlier teaching:

- Registers, operand order, function arguments/results and `ret`: Module 0's Investigation and Explanation. Its compiler note explicitly explains GCC and `-O1` (`meet-the-machine.prose.ts:16`).
- Hexadecimal, signed/unsigned readings and set/clear/top bit: Module 1's first Investigation. Its second lesson explains `w`/`x`, constants and optional `#` notation.
- NZCV, flag persistence, carry and signed overflow: Module 2's first lesson. Its second Investigation defines borrow, and its Explanation explicitly gives N/Z, V and C meanings after subtraction (`subtracting-and-the-tick-counter.prose.ts:77`).
- QEMU and “architecture”: Module 2's first model-versus-reality note defines both. The local note therefore does not introduce an unexplained tool.
- AND, masks, warning word and the service-due bit: Module 3's first Question/Investigation. Right shift and the top-bit-to-bottom operation: the following Shifts lesson.

The current lesson defines compare, condition, destination, the two selection sources, each condition rule, `cset`, and the optional `tst`/`ands` operations. `cmn`, `cset` and `vs` appeared in an earlier closed listing with an explicit promise of later explanation; this lesson supplies their meanings rather than relying on that listing alone. No additional unexplained prerequisite was found. The two findings above concern wording within locally explained material.

## Coverage and browser evidence

Read all learner-facing text in `compare-and-choose.prose.ts`, `compare-and-choose.labels.ts`, the lesson data and listings. This includes all ten sections, objectives, captions, option labels, each closed note, both predictions and their revealed explanations, both tasks, all five hints for each challenge, all three specialised failure messages, after-pass text, reflection answer and model-versus-reality note. Also read the relevant shared text in `packages/views/src/strings.branch.ts`, `packages/views/src/strings.ts`, `packages/machine/src/strings.ts`, `platform/lesson-runtime/src/strings.ts`, and `apps/course/src/runtime-strings.ts`.

Used Chromium against the existing build at `http://localhost:4220/assembly-lab/#/lesson/compare-and-choose`; no rebuild or full test suite. Inspected 1280-pixel desktop and 375-pixel phone views, each in explicit light and dark theme. Opened details including the condition disclosure and simulator notes. Checked every option of both predictions; revealed both complete hint ladders; exercised ordinary, top-bit and equal-input failure feedback, a disallowed instruction, blank/wrong final answers, and the passed construction's own stepper. Stepped the modified-function figure and changed the condition figure through its four presets. No horizontal page overflow in the four viewport/theme combinations. The responsive stage panels and condition cards preserve their reading order; neither finding is caused by wrapping or theme.

Temporary evidence, kept out of the course source:

- `/tmp/english07-browser.cjs` and `/tmp/english07-interactions.cjs`: isolated browser review scripts.
- `/tmp/english07-{1280,375}-{light,dark}.txt` and matching `.png`: opened lesson text and full-page captures.
- `/tmp/english07-{1280,375}-{light,dark}-interactive.txt`: revealed prediction, hint, feedback and figure text.
- `/tmp/english07-{1280,375}-{light,dark}-{own,conditions}.png`: inspected figure captures showing responsive reading order and themes.
- `/tmp/english07-equal.cjs`: isolated reproduction of the equal-input feedback.

No challenge solution or answer is included in this review. No English findings were added merely to meet a count.
