# Clear prediction and test feedback

The user reported that choosing 70000 produced an aggregate verdict about 65536 and three errors, then requested the same review for every page's tests. This is separate from the compact-reference change, merged as PR106.

## Learning design

The learner should identify which submitted field or choice differs, connect it to the measured result or relevant rule, and make a reasoned correction. Previously taught mechanisms remain the prerequisites: register writes and returns, bit weights/readings, flags and conditions, instruction paths, and recorded A32/A64 comparisons. Feedback does not introduce a new lesson sequence or grading shortcut.

An assembler rejection and failure of the sufficient one-half rule are distinct facts. A range-invalid answer is not an observed flag result. A correct bit pattern is not always a correct signed number when the task requests a particular reading. A numeric answer need not use the same textual spelling as the model's decimal output.

## Checked facts and fixes

- Constants/halves and assembler results are pinned in constants-and-widths.facts.test.ts. ModelPrediction still asks the assembler after commitment; it now addresses the selected candidate, computes its halves, and preserves the rule's qualification. Prediction state, option identity, gates and restoration remain unchanged.
- gradeSmallest used flagClear for out-of-domain values before measuring a flag. Domain validation now has its own message; valid inputs keep measured flag feedback.
- compare-shifts explicitly requests signed decimal readings. Its cases now opt into exact signed-number comparison. Existing pattern-mode challenges retain their intentional modular equivalences.
- The shared decimal parser already accepts the course's minus sign and correctly grouped decimals. Answer, arithmetic and branch graders reuse it. Hexadecimal answer and recorded-number modes accept grouped hexadecimal. Recorded a64-result queries compare exact numeric values while token queries remain textual.
- Branch condition feedback uses model-observed flags and existing CONDITION_ROWS rules. Count feedback gives the submitted count and high/low direction, preserving authored path-counting guidance without printing the expected count.
- Recorded A32 fields receive query-specific actions, not checking-process prose. Invalid numerical notation has a format message. Expected tokens/results remain withheld.
- Reading failures identify the field and interpretation. Register/instruction defaults point to the requested operation and moment; the shifts instruction exercise receives its own type/direction guidance without referring to its hidden listing.
- The fuel-warning diagnostic describes the observed write before a test, without claiming that an unchanged mov lost the input. A stale earlier-in-this-lesson reference now links to the actual earlier lesson.

## Process and evidence limits

Three separate GPT-6.1 Sol High source audits covered all 75 published lessons. An Extra High shared-grader review checked every dispatched mode. Two Medium drafting passes supplied copy from checked facts, followed by engineering accuracy edits. Independent final source reviews and complete CI verification are required before merge.

The execution environment is unavailable. No local final build, manual browser inspection, screen-reader session or human novice study is claimed. CI executes the actual complete build and desktop/phone browser suite. Full-suite outcomes, including failures/skips and corrected expectations, will be recorded separately in the PR. The pinned platform, assembler, simulator, compiler recordings and hardware claims are unchanged.
