# Fresh learner review: Same bits, two readings

Read-only review of lesson `one-pattern-three-readings` at `http://localhost:4290/assembly-lab/#/lesson/one-pattern-three-readings`, 18 October 2026. No earlier review notes consulted. Read CLAUDE.md, docs/style.md, docs/authoring.md, front-page prerequisites, Module 0 prose, all this lesson's prose/labels/questions/options/feedback/hints/model note, and relevant shared strings and structure.

## Candidates

### 1. Low: the first caption describes a different execution moment from the initial figure

Quote: “fuel_used_wrong(50, 38) as first written; w0 after its subtraction.”

Location: `content/lessons/one-pattern-three-readings.labels.ts:28`; used by the opening stepper in `content/lessons/one-pattern-three-readings.ts:61`.

Setup/evidence: fresh browser context, before pressing Next, on all four width/theme combinations. The caption says “after its subtraction”, but the displayed w0 is 50, the subtraction is marked “Runs next”, and the status says “Press Next to run the first instruction.” Pressing Next runs the subtraction; Reset returns to the initial value without changing the caption. The opening prose is correctly conditional (“After sub ...”); the fixed caption is the mismatch. This was reproduced with fresh contexts and Next/Back/Reset, not inferred from source alone.

Learner effect: a learner comparing the caption with the register can mistake the input for the subtraction's result, precisely where the lesson asks how the result's bits can have two readings. The status mitigates the problem, hence low severity.

Direction: make the caption describe the runnable example independent of its current state, or explicitly locate the promised post-subtraction state. Preserve the useful instruction-specific status.

Evidence screenshots: `/tmp/course-clarity-audit/reader01-first-375-light.png`, `/tmp/course-clarity-audit/reader01-first-1280-dark.png` (also both other combinations).

### 2. Low: instruction-stepping guidance still appears on direct bit editing

Quotes: badge “Stepped”; expanded note “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”

Locations: `content/lessons/one-pattern-three-readings.ts:108` (`register-reader` has `timeModel: STEPS`); shared wording `packages/views/src/strings.ts:10`. The two answer challenges also carry STEPS at lesson structure lines 128 and 173.

Setup/evidence: open the Stepped badge immediately above “Reading the bits”. Reproduced at 375 and 1280 pixels, in light and dark themes. This widget offers individual bit toggles and Clear bits; changing a bit updates the readings directly. There are no instruction-step controls. The same Stepped label is visible above the direct bit/number challenges.

Learner effect: the note describes an action the learner cannot perform in this figure, and blurs the difference between manually editing a pattern and running an instruction. This is the remaining instance of the recent guidance-placement problem, rather than a new issue with the actual readings.

Direction: choose badges and help according to the learner's action; keep the simulator stepping explanation with actual steppers. Do not duplicate that explanation above direct bit/answer editors merely because their calculations use the model.

Evidence screenshot: `/tmp/course-clarity-audit/reader01-badge-375-dark.png`; equivalent badge screenshots exist for all four combinations.

## Unsupported assumed knowledge

None found that blocks this lesson. Evidence: the front-page prerequisite explicitly requires binary/decimal conversion and small C functions with int/unsigned arguments and return (`apps/course/src/strings.ts:30-38`). Module 0 teaches registers, instruction operands, add/sub/ret, the simulator, and compiler settings; its generalisation explicitly explains -O0/-O1. This lesson defines hexadecimal digits and 0x, top bit, unsigned/signed readings, and set/clear before the bit exercises. The model note identifies the lower 32 bits and defers the upper half to the following lesson. I do not treat that deliberate preview as an assumed prerequisite.

## Actual browser coverage

Used fresh Chromium contexts at 375×900 and 1280×900 in both light and dark themes. Inspected opening figure and paired C/instructions; stepped Next/Back/Reset; committed the addition prediction and used its unlocked stepper; used Clear bits and a bit toggle; opened Show calculation; committed the listing comparison; expanded available source/compiler/reflection details; exercised blank and incorrect-answer feedback, invalid and valid hexadecimal input, and all five hints for both challenges. Read the resulting DOM text for each configuration. Opened the register reader's Stepped help separately in all four configurations. Captured first-figure and register-reader screenshots for all configurations and inspected representative phone/desktop images in both themes.

This was a focused learner review, not an exhaustive input or regression test. Successful challenge completion/persistence was read in the existing implementation/tests, not re-executed; no claim is made to have covered every saved-work state. No source changes made and no challenge solutions included here.
