# Independent checker: lesson 09 counting-up

Read-only review of the current implementation at http://localhost:4291/assembly-lab/#/lesson/counting-up. I did not author these changes. Read CLAUDE.md, docs/style.md and docs/authoring.md; read target prose, labels, structure, all hints/feedback and recorded loop listings before reading the accepted audit/verification plan. Prerequisites checked against the front-page panel and relevant earlier passages in lessons 00–08. No application edits, build or full suite.

## Verdict

The accepted local L10 and M6 fixes pass. Shared prediction/exercise/experiment roles pass on this page; real stepping help remains attached to the real stepper. The low shared N4 sibling occurrence originally found in CountPrediction is now closed after checking the final build at port 4292. No unresolved findings remain for this lesson within the reviewed scope. The original observation and final recheck are retained below.

## Accepted fixes checked

- L10: model note now says, “A trace is the recorded sequence of instructions the simulator ran.” The following limit explanation distinguishes a simulator stop from function termination. Browser-expanded note verified in all four configurations.
- M6: construction “Common mistake” now identifies signed-order/equality mistakes, while “Smaller example” follows one iteration rather than giving general instructions. The final challenge's corresponding rungs name a counting mistake and walk an empty-interval example. Read all ten hints in source; opened first three rungs of both ladders in all four configurations. Headings match content.
- S1: both prediction cards show Prediction. Loop-history figures show Experiment; challenges show Exercise. Actual instruction stepper still shows Stepped. Its gate is present before prediction and removed after checking it in all four configurations.
- N4 on RunPrediction: changed-loop card visibly says “Registers before the run”, retained after checking; the outcome describes the completed run separately.
- C/instruction pairing remains readable in both widths. After four steps, the increment instruction and the corresponding C increment are highlighted together. No introduced step-count or register-role mismatch observed.

## Finding

### 09-F1 — Low, now closed: CountPrediction retains input values without a visible time qualifier

Exact visible outcome starts “The simulator ran the function.” Its register display above still shows the call's initial values, headed only `w0`, `w1`, `w2`. Location: `packages/views/src/interactives/CountPrediction.tsx:42–52`; the before-run phrase is only an `aria-label` at line 43, and values always come from `data.call.args` at line 48.

Effect: a sighted learner checking the prediction can read the remaining register cards as results of the run. The subsequent explanation describes later brightness values, so the diagram/text require the learner to infer that the cards are still inputs. This is the same concrete state-label problem as accepted N4, in a sibling component left unchanged. The second prediction on this same lesson now demonstrates the clearer visible label.

Evidence: reproduced after checking the first prediction in all four configurations. Screenshots `09-{375,1280}-{light,dark}-after.png`; compare `09-375-dark-failure.png`, which has the corrected visible heading. Direction: apply the shared visible before-run label to CountPrediction's initial register group while preserving its prediction gate and input values. No answer or outcome logic change is required.

## Assumed knowledge

No remaining unsupported prerequisite found in the reviewed material. Front page includes for/while and unsigned C arguments. Target text explains `>>=`, loop/body/iteration and increment syntax. Earlier shifts explains logical-right-shift halving; compare-and-choose gives unsigned/equality conditions; branches introduces labels, taken/not-taken and compact GCC branch spelling; Module 0 introduces argument registers, return and compiler settings; subtraction explains tick/wrap. Trace is now defined where the noun matters.

## Browser evidence and limits

Real Chromium, 375×900 and 1280×900, light/dark, fresh contexts. Set `assembly-lab:v1:theme` as raw string and asserted `html[data-theme]`. In every configuration: inspected initial page/prediction, checked first prediction, verified gate transition, stepped four instructions, inspected history figure, opened first three hints on both exercises, checked changed-loop prediction and opened model note. No page horizontal overflow or page errors observed. Screenshots and initial text captures are `09-*`; script `check09.mjs`; machine observations `09-evidence.json`. Visually inspected representative screenshots covering both widths and both themes, including initial/after/step/history/hints.

I did not run successful challenge solutions, every input, every saved-state combination, keyboard-only operation or all final hint rungs in the browser. Source review of hints/feedback is not an exhaustive exercise-grader certification. No challenge answers are reproduced in this report.

## Final-build recheck: 09-F1 closed

Rechecked http://localhost:4292/assembly-lab/#/lesson/counting-up in real Chromium at 375×900 and 1280×900, light and dark. Raw theme storage was set and `html[data-theme]` asserted in every fresh context. The visible heading “Registers before the run” now appears above CountPrediction input registers before checking and remains after checking. Register contents remain initial inputs as the heading promises; the following stepper gate is closed before checking and opens afterwards. No page overflow or page errors.

Also performed a narrow shared-component regression check at http://localhost:4292/assembly-lab/#/lesson/branches in the same four configurations. Its CountPrediction likewise has the visible heading before/after checking, keeps input values and preserves its gate. This is a shared-component patch check only, not a second full lesson review.

Evidence: `recheck09.mjs`, `09-final-evidence.json`, and `09-final-{counting-up,branches}-{375,1280}-{light,dark}-{before,after}.png`. Visually inspected screenshots covering both widths/themes. No source edits.
