# Adding and the flags: approved-layout integration brief

The user approved the v4 interactive proposal after comparing it with their imported full-page v8 mock. The integration should retain the approved page's panel structure, typography, arithmetic drawings and sequence. It should use the course model, saved work and graders rather than the prototype's standalone storage or bundled simulator.

## Outcome and scope

Given a fresh addition, the learner identifies N and Z from the stored result, checks the exact unsigned sum with C, and checks the exact signed sum with V. The learner then applies those rules to three independent 32-bit additions. Choosing the flag appropriate to the program's numbers is part of the task; visiting each tab is not evidence of success.

This page covers addition. C's subtraction meaning, flag persistence across later instructions and the smallest-overflow challenge belong to the following published lesson, `flags-and-overflow`. The heading **C is for unsigned. V is for signed.** must remain prominent, with the addition context immediately beside it.

## Prior preparation

- Module 0 introduces `add`, a destination register, incoming arguments and returning a value.
- Module 1's signed/unsigned lesson teaches two readings of one stored pattern and the top bit's contribution.
- Module 1's four-bit arithmetic lesson demonstrates carrying, retaining the low four bits and the signed/unsigned ranges of the miniature.
- The later Module 1 lessons introduce register width and the course's programmer calculator.

Four-bit examples here are teaching miniatures. They do not claim that Arm has four-bit registers or that the miniature's calculated flags are the processor's real 32-bit NZCV state. The visible bridge to the real instruction identifies bit 31, the 32-bit ranges and `adds w0, w0, w1`.

## Checked facts and worked examples

The approved prototype used the actual `fourBitFlags`, `columnWork` and machine `assemble`/`run` implementation. Production must call those modules directly. The complete prototype review is in `/workspace/scratch/flags-proposal-mock-v4/technical-review.md`; it is prior prototype evidence, not verification of the production integration.

- A stored four-bit pattern `1001` reads as 9 unsigned and −7 signed. The N illustration emphasises the highest bit; the Z illustration uses `0000`.
- C reports carry out for an addition. V reports whether the exact signed sum lies outside the signed range; the carries into and out of the top bit provide the corresponding bit-level check.
- The small comparisons use the model inputs `(15, 1)`, `(7, 1)`, `(8, 8)` and `(8, 15)`. They distinguish C only, V only, both flags and too-negative signed overflow.
- The fresh miniature uses `(5, 12)` and supplies its stored result. Its program uses unsigned counts. The learner predicts all four flags and chooses the program's range-check flag.
- The real prediction uses the recorded `plus` program with inputs `0x7fffffff` and 1. A valid committed prediction opens the investigation even when the prediction is wrong.
- The three real applications retain the published challenge's program and inputs. The completion and follow-up gates must grade current work again, including after editing saved answers.

## Visible route

1. Read one pattern two ways as a brief reminder.
2. Define both N and Z visibly, then inspect each using the original focused tabbed illustration.
3. Define C and V for addition visibly. Keep a complete V example visible even if the learner does not select the V illustration tab.
4. Compare the original centred arithmetic drawing, the two exact sums and the program's appropriate flag in one focused panel.
5. Attempt the fresh four-bit application.
6. Commit a real 32-bit range prediction. Inspect its immutable result reading and genuine column trace afterwards.
7. Predict the four flags for each fresh 32-bit case, one case at a time. Regrade the current work before opening the follow-up.

Definitions, ranges and the complete worked V example must stay visible outside optional tabs or disclosures. Optional carry mechanisms and the expanded 32-bit trace may remain local. Revealing a column is not another execution of `adds`.

## Misconceptions to test

These are design hypotheses, not observed novice behaviour:

| Plausible wrong rule | Evidence that distinguishes it |
| --- | --- |
| A negative stored signed reading proves overflow. | The N example and a fitting signed sum with its top bit set. |
| C and V always have the same value. | The C-only and V-only comparisons and the fresh unsigned-program question. |
| A set V means only a sum that is too positive. | The too-negative signed example. |
| Changing signed/unsigned display changes the addition. | The result explorer preserves its bits and flags while changing only the reading. |
| Visiting all three cases completes the exercise. | Current submitted answers must pass the existing grader; editing one invalidates its completion. |

## Draft and review record

This is a separate production copy pass from the approved prototype. `packages/views/src/flags-lesson/strings.ts` contains the imported authored markup, reviewed prototype copy and the short prerequisite summaries drafted in the previous separate pass. The static template removes prototype controls and leaves model-result targets empty. The controller must fill them from the course model before interaction. The internal section anchors need scoped scrolling so they do not replace the course's hash route.

The prototype was inspected in Chromium at 375, 834 and 1280 px in light and dark themes. Production must receive fresh independent learner and technical browser reviews and its own focused/full checks. A comparison of geometry or passing tests does not establish that a novice can learn from the page. No novice study or screen-reader validation is claimed here.
