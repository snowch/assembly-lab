# Independent learner review: 21, C overflow and machine results

Read-only review, 18 October 2026. No previous review notes consulted. Read CLAUDE.md, docs/style.md, docs/authoring.md; front-page prerequisites; course-order index; preceding compile-a-loop prose; all target prose, labels, options, feedback, hints, model note, structure and recorded listings; relevant shared strings. Earlier definition spot-checks included hexadecimal, flags, comparisons and the local compiler. I did not reread all 21 preceding lessons.

Browser: http://localhost:4290/assembly-lab/#/lesson/c-and-overflow. Initial page rendered and screenshots examined at 375×900 and 1280×900, with system light and dark themes. No horizontal overflow in any configuration. In phone/light, selected a prediction, checked it and inspected the feedback/unlocked stepper. Did not solve challenges, exhaust hints or all controls. Full-page screenshots: /tmp/reader21-{375,1280}-{light,dark}.png; committed-prediction screenshot /tmp/reader21-prediction.png; text/interaction log /tmp/reader21-browser.txt. A later attempt to capture viewport-only screenshots timed out waiting for a heading; the original four full-page captures and successful interaction are the browser evidence.

## Finding (low): prediction cards still carry the stepping explanation

Quote/state: before any answer, the badge reads “STEPPED” above “Predict the bits from a direct A64 addition.” The same occurs above “Predict the result required when signed wrapping is enabled.” These are predictions, with radio answers and a Check your prediction button; their actual stepper immediately below is separately locked until checking.

Source: content/lessons/c-and-overflow.ts:51-54 and the `predict-wrap-increment` interactive around line 127; both set timeModel to steps and omit the prediction role. The runtime's model badge/note is consequently used (platform/lesson-runtime/src/LessonView.tsx:93-118). Shared note in packages/views/src/strings.ts:10-11: “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” Source confirms the note is attached to these badges; I did not expand it during this browser pass.

Learner effect: the question card advertises stepping before the learner can step. This repeats the guidance-placement issue, although the adjacent stepper and explicit question keep it from blocking the exercise.

Direction: use the existing prediction role for these two cards; retain simulator guidance at the actual stepper. This is a shared consistency fix, not a request to restructure the lesson.

## No further substantive finding

The execution moment is clear: the first prediction names the exact instruction and its initial register value immediately above the question; the later one explicitly asks for the compiled function's return and names the input and compiler option immediately above. The distinction between register bit pattern and signed reading is explained in feedback. Paired source/instruction rows are visible in both widths; there is no misleading assertion that compiler references identify the instruction's execution time.

## Assumed knowledge

No unsupported prerequisite identified in the sampled evidence. The front page allows small C functions, returns, conditions and loops. Hexadecimal is introduced in one-pattern-three-readings.prose.ts:25 (“A 0x in front marks a number as hexadecimal”); comparison truth values in compare-and-choose.prose.ts:110 (“gives 1 if it is true and 0 if it is not”). compile-a-loop explains source highlighting and separate source-language and machine rules. This lesson defines limits.h/INT_MIN/INT_MAX and undefined behaviour in its motivation, introduces -fwrapv with its guarantee before use, explains the extra branch-preserving options where they appear, and defines saturation and text parsing locally. “Compiler contracts” in the heading is immediately explained as the setting's extra guarantee; I do not flag it as an unexplained prerequisite.
