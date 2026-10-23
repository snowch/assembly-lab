# Reader 06: Shifts, and the type that picks one

Module 3, second lesson; course index 6 (zero based). Reviewed built commit f1fdf35 at `/assembly-lab/#/lesson/shifts` against the review brief. Read AGENTS.md, CLAUDE.md, style/visual guidance, all ten sections, parsed lesson and earlier lessons, the recorded listings, ShiftFigure, ProbePrediction, WordStepperFigure and ListingPairFigure. No app changes or external compiler calls.

## Prerequisites and novelty

The preceding six lessons already teach register operands, in-place writes, stepping, 32-bit signed/unsigned readings, hexadecimal, top-bit significance, fixed-width truncation, constants, arithmetic and masks/fields. In particular, Masks teaches `lsl` and lost/zero-filled bits, uses C `>>` for field extraction, and relates this to the earlier `movk ... lsl 16`. Thus three listed opcodes here do not mean three wholly new mechanisms.

The new core is choosing zero fill or sign-bit fill for right shifts, interpreting negative results and rounding, then forming a shifted register operand within `add` to correct division rounding. C signed division rounding is taught beside the first numerical challenge, rather than assumed. GCC and `-O1` were explained in Module 0. I found no additional required but untaught tool, C feature or assembly convention in this lesson.

The first task is one conceptual choice: “Which general rule does GCC use for the top bit when shifting an int right?” Its negative bit pattern is supplied. It does not require calculating the large decimal result or implementing a program. A prediction before the detailed rule is a reasonable elicitation here, not excessive novelty.

## Confirmed finding

**Low — duplicate starting register persists after prediction feedback.** In `#ix-predict-fill`, after choosing “A 0” and checking, “w0 when the call starts” remains above the choices, while feedback adds “w0 before” with the identical pattern and then “w0 after”. `ProbePrediction.tsx` renders `showStart` independently of the committed outcome. This occurs at both widths and themes; see `shifts-1280-light-committed.png` and phone equivalent in `/tmp/course-load-review/`. The learner must distinguish two presentations of the same time point while comparing changed bits, the mismatch message and the accompanying two-operation explanation. It is avoidable duplication, not a missing prerequisite or a blocked attempt. Smallest direction: retain one starting row after commitment, adjacent to the result, while preserving the chosen answer and feedback.

No high or medium overload finding survived comparison with the earlier teaching and actual interactions.

## Design recommendations, not confirmed faults

- The investigation opens on `lsl`, because ShiftFigure selects `ops[0]`, immediately after feedback about `asr` on the same word. Consider opening on that just-observed `asr`, then inviting `lsr` comparison before revisiting familiar left shift. The current selected chip and direction sentence are explicit, so this is a continuity improvement, not a misleading-state finding.
- “Work out six results for 21 and −21, then give them” is the largest attempt. It combines two new right shifts and the locally taught division rounding rule with familiar bit readings. Inputs are grouped, rules are visible and the editable experiment can compute the shifts, so six fields alone does not prove overload. If learner evidence shows difficulty, check the positive group before introducing the negative group; retain the final comparison. Do not split every opcode into a lesson.
- At 375px the full-width bit rows fit, but individual cells are narrow. The explicit “Fell off” and “Filled with” strings successfully carry the important local detail. Keep these summaries if any future compact presentation is introduced.

## Sequence and treatments worth keeping

1. The opening paired functions differ in one operation; familiar register width and types isolate the new distinction.
2. Prediction selection reveals nothing until “Check your prediction”; both the experiment and later division stepper stay gated until their corresponding prediction is committed. A wrong committed choice still permits investigation.
3. Feedback provides a concrete worked right shift before independent experimentation. The investigation marks loss and fill separately with × and +, direction and a textual rule, rather than relying on colour.
4. The numerical challenge teaches C `/` rounding locally: “For two int values, C's / gives a whole number and rounds towards zero.” These are different inputs from the worked example, so this instruction is useful scaffolding, not disclosure of challenge answers.
5. Wrong numerical attempts receive named, operation-specific rule feedback, not numeric solutions. Hints are a separate action.
6. “In the add, the last operand is w0, lsr 31” explains the new operand syntax and explicitly says forming it does not change `w0` before asking what the instruction adds. The later stepper shows the operand between register-before and register-after values. Familiar addition plus a now-practised shift is a justified synthesis. The two calls separate negative and positive behaviour without demanding another program.
7. The type summary, return to familiar `movk`, final instruction-selection task and reflection consolidate rather than introduce additional mechanisms.

## Browser evidence and limits

Fresh contexts at 375×900 and 1280×900, each with light and dark system preferences. Actual rendered colours were checked separately: light body background `rgb(243, 246, 245)` / text `rgb(16, 26, 24)`; dark `rgb(16, 22, 21)` / `rgb(232, 238, 237)`. The application leaves `html.dataset.theme` unset in system mode; screenshots and computed colours confirm that the requested themes actually rendered. Page scroll width matched 375 and 1280.

In every context: inspected the initial page and both locked downstream figures; committed a wrong first prediction; used `asr` then `lsr`, changed distance to 2; submitted zeros in all six numerical fields and opened the first hint; committed the second prediction; stepped the negative call through its two arithmetic instructions, switched to the positive call and stepped its first instruction; opened “What C says” and reflection “Answer”. Screenshots cover initial full page, committed first prediction, investigation and first negative step. The phone stepper retains paired C/instructions in a horizontally contained listing; the screenshot begins at its C side, not an absent assembly pane.

Did not browser-test every shift distance/input, final challenge submissions, full hint ladders, return/reset/reload persistence or external compilation. Final task and remaining feedback/hint structure were source-read only. This is an instructional-load review, not numerical or full regression verification. Scripts/log/screenshots use the `shifts-` prefix under `/tmp/course-load-review/`.
