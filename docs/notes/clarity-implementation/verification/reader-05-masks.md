# Lesson 05: Masks and fields — independent fix check

Verdict: **accepted local fixes pass; no new blocking or clarity finding identified.** This is an independent read/check, with no course edits and no author rationale consulted. Read CLAUDE.md, docs/style.md and docs/authoring.md, then the lesson's complete prose, labels, hints, feedback and structure before reconciling the audit and coverage plan.

## Accepted fixes checked

- **L5 — inline references:** the prediction explains “GCC compiled that line to …”; its caption identifies “the constant in” the inline instruction. The wording no longer implies an absent listing figure. Initial cards checked in all four browser configurations.
- **L6 — intermediate register identity:** after running the starter, the displayed guidance says “When an instruction writes a register, the figure shows its bits before and after. This may be the new gear in w1 or the warning word in w0.” This correctly describes the register-dependent figure rather than promising the warning word after every instruction. The actual opened starter figure labels both incoming registers explicitly. Source and rendered guidance agree.
- **L7 — field application:** “A colour can keep its red, green and blue amounts in separate fields of one word” gives the component quantities and explains how the extraction instruction applies. The example requires no graphics API knowledge.
- **N7 — input identity:** after committing the first prediction, the full-width before/after rows and the enlarged low-eight-bit diagram show the same original word. `masks.ts` uses the same input for `call.args` and `maskView.word`; the built before/after values and bits agree. No silent input substitution remains.
- **N8 — independent operations:** the reflection now explicitly says “Start with that value separately for each instruction.” The separate-start task and its corrective hint/feedback are consistent.
- **Shared roles and timing:** both prediction cards display Prediction, the manual challenges Exercise, and real steppers Stepped. Outcomes and dependent experiments remain gated before committing. Mobile before/after labels are intact words above their bits, and both themes remain readable. The failure-stepper caption describes a register outline as a write, preserving the distinction between writing and changing a value.
- **Hint roles:** the first two construction hints render under The concept and Common mistake; the latter describes an actual error before advising how to avoid it. The full two hint ladders were also read in source. No accepted hint-heading issue remains in this lesson.

## Browser evidence and coverage

Chromium against `http://localhost:4291/assembly-lab/#/lesson/masks`, 375×900 and 1280×900, light and dark. Each context explicitly set raw localStorage theme and asserted `html[data-theme]`. Fresh contexts avoided persisted lesson progress.

In all four configurations: read rendered initial page; captured the gated initial prediction; committed the first prediction and examined its before/after and enlarged mask display; committed the failure prediction; ran the unmodified construction starter to unlock its stepper; opened the first two construction hints. No horizontal document overflow in the post-prediction state. Inspected screenshots for phone and desktop themes, including the shared temporal label layout.

Evidence: `05-{375,1280}-{light,dark}-{initial,after,failure,hints,solution}.png`, associated initial/after/solution text captures, and reproduction scripts `check05.mjs` / `check05-controls.mjs` in this directory. Earlier script attempts used the wrong figure ID and timed out before interaction; corrected scripts completed all four configurations.

Limits: did not submit a passing construction solution, exhaust every hint in the browser, execute all possible bit-operator inputs, or audit every grader outcome. Passing-only comparison prose and all hints/feedback were reviewed in source. No automated suite, build, or repository changes performed.

## Prerequisite assessment

No new unexplained prerequisite found that blocks the changed material. Front-page assumptions cover small C functions, unsigned arguments and binary conversion. Earlier lessons explain hexadecimal, signed/unsigned bit readings, set/clear bits, instruction operands, register widths and the w/x relationship; constants lesson explains movk's lsl placement and unsigned constant suffix. This lesson introduces the C bit operators, mask, field, bit numbering and the assembly operations in context. Compiler optimisation notation is optional provenance and was explained in Module 0. The colour example needs only the stated idea of separate component amounts.
