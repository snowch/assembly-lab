# Independent reader/checker: lesson 15, Products and their widths

Verdict: **accepted corrections verified; no new supported clarity finding or introduced regression found in this scoped review.** Read-only; no course edits.

Read CLAUDE.md, docs/style.md and docs/authoring.md; first read the current target source (all prose, labels, hints, options, model note, structure and recorded listings) and actual page, then the previous audit summary and verification coverage plan. No author justification read. Prerequisite assessment used the front-page Before you start panel and relevant earlier instruction/register/number/type/cast definitions; it was not a reread or rerun of all previous lessons.

## Accepted fix reconciliation

- **L14, hint referent: fixed.** `content/lessons/products-and-widths.prose.ts:27` says “The operands of `madd` are destination, first factor, second factor and value to add.” Its named instruction removes the former ambiguous “Its”. Revealed the first four construction hints in Chromium in all four configurations; the fourth is under Part of the answer, and the earlier Concept, Common mistake and Smaller example content fits those headings. No fifth-hint/challenge solution reproduced in this report.
- **L15, test label: fixed.** `content/lessons/products-and-widths.labels.ts:86` says “Keep a product that fits in 32 bits”. It describes the property of that case rather than treating every test product as requiring more than 32 bits. Verified it in the built final-exercise failure output in all four configurations, using a return-only submission to make that particular case fail. The supplied starter passes that small-product case, so its normal failed-test list does not show the label; that is expected filtering, not a missing label.
- **Shared figure roles: fixed here.** Both prediction cards visibly say Prediction, without the instruction-step disclosure. Exercises say Exercise and listings/halves diagram say Diagram. Real steppers retain Stepped. The two predictions initially gate dependent results; checking both unlocks the associated examples. Confirmed first step's current instruction and C association remain aligned and highlighted.

## Prerequisites / assumed untaught knowledge

No unsupported assumption found in the changed material or relevant surrounding explanation. The front page provides small C functions, integers, control flow, arrays and arithmetic. Earlier course passages supply the additional concepts used here:

- `meet-the-machine.prose.ts:54`: “An instruction's parts after its name are its operands.” Same lesson explains GCC and `-O1` at line 16.
- `one-pattern-three-readings` teaches hexadecimal and signed/unsigned readings.
- `constants-and-widths.prose.ts:61–64` explains the w/x views of one register, and line 72 introduces long's target width.
- `memory-and-addresses.prose.ts:10–14` supplies target integer widths, unsigned type names and narrow writes clearing upper bits.
- `loading-widths.prose.ts:47` defines a C cast as a requested conversion; surrounding passages explain extension.
- This lesson defines product and high/low halves and introduces the new multiplication instructions before requiring them in exercises.

The first prediction's immediate setup identifies the multiplication and result width, so its question does not need a second execution-time qualifier. The failed-widening prediction explicitly asks for the returned value. No redesign finding is raised for either.

## Actual browser coverage and limits

Final production app: `http://localhost:4292/assembly-lab/#/lesson/products-and-widths`. Real Chromium, fresh contexts at 375×900 and 1280×900, both light and dark. Theme set with the raw localStorage value and asserted against `html[data-theme]`.

In every configuration: captured initial page text and prediction image, checked both predictions, unlocked dependent figures, advanced the first multiplication once, revealed four construction hints, ran a deliberately incomplete final submission to display the corrected test label, captured resulting states. No page errors and no horizontal document overflow. Visually inspected representative targeted screenshots covering all four configurations; readable hints, code pairing, controls and feedback.

This is representative interaction verification, not exhaustive simulator/Arm/C validation or testing of every figure/input/saved state. All hints were read in source; the final hint was not revealed in the browser. No successful challenge solution was entered. No build or full test suite run by this reviewer.

Artifacts: `reader15-artifacts/{375,1280}-{light,dark}-{initial.txt,prediction.png,step.png,hints.png,tests.png}` and `reader15-artifacts/evidence.json` beside this report. Screenshots record the application outputs; this report intentionally omits challenge answers.
