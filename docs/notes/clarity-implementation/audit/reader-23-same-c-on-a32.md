# Independent learner review: lesson 23, The same C on 32-bit Arm

Read-only review, 18 October 2026. No prior review notes read. No lesson edits.

## Coverage

Read CLAUDE.md, docs/style.md and docs/authoring.md; the front-page Before you start; all target prose, labels, options, feedback, hints, model note and lesson wiring; recorded A32/A64 examples and relevant shared prediction/listing/recorded-exercise strings. Read the immediately preceding checked-arithmetic prose and relevant prerequisite prose in calls-and-returns, division-and-remainders, compare-and-choose and constants-and-widths. Searched the earlier lesson prose/labels for the suspect terminology. This was not a new complete reading of every earlier chapter.

Actual Chromium browser: http://localhost:4290/assembly-lab/#/lesson/same-c-on-a32 at 375×900 and 1280×900, light and dark, fresh contexts. Captured whole pages and inspected stepper screenshots in all four configurations. In each configuration checked a prediction, advanced the limit stepper twice, opened the first construction hint and the saved-register note. Also opened the prediction's Stepped badge on phone light. No exhaustive challenge solving, hint ladder execution or all-input coverage. All target hint and feedback strings were read in source; the first hint was exercised in-browser. No horizontal page overflow in the four configurations.

Evidence: /tmp/reader23-{375,1280}-{light,dark}.png and .txt; /tmp/reader23-{375,1280}-{light,dark}-{step,hint,division}.png; /tmp/reader23-prediction-guidance.png.

## Findings

### 1. Medium: the prediction tells the learner to run a version that is locked until they predict

Quote: “Run the A64 version with distance 80 and limit 50. Use the C function and the comparison to decide which input becomes the result.” (content/lessons/same-c-on-a32.prose.ts:13). The prediction card is labelled “Stepped”; opening that badge says “Each step runs one instruction in the simulator.” The next section's actual stepper says “Check your prediction above first. The figure opens once you have checked it.”

Setup/state: fresh page, before committing the first prediction. Observed across all four configurations; opened the badge on phone light. Source: content/lessons/same-c-on-a32.ts:65–68 declares run-prediction/timeModel steps without the prediction role, while the investigation stepper at :96 is gated after this question.

Learner effect: the action requested by the prose is unavailable. A learner can search for Next or try the next section before discovering that the required sequence is the opposite. The generic Stepped guidance reinforces the wrong immediate action. The question itself clearly asks for the returned value; this is not an execution-moment ambiguity in the question.

Direction: make the predict-before-run order explicit in this section, and apply the prediction-specific role treatment to this prediction. Keep step guidance with the actual investigation controls.

### 2. Low: “immediate” is assumed rather than connected to the taught word “constant”

Quote: “it writes a 16-bit immediate into the low half of a register and clears the upper half.” (content/lessons/same-c-on-a32.prose.ts:38).

Setup/state: Explanation, ordinary reading before interacting with the marker pair. The sentence's concrete instruction makes the intended value inferable, so this does not block the exercise.

Learner effect: an unnecessary synonym makes a known mechanism sound like a new kind of value. The front-page prerequisites do not include assembly terminology. The constants-and-widths motivation defines “A number written inside an instruction is a constant.” A search of earlier prose/labels finds “16-bit immediate” in from-c-to-instructions.prose.ts:11, but that occurrence also supplies no definition. Prior occurrence is not prior explanation.

Direction: use the established term or explicitly connect the two terms at the first earlier use, then keep usage consistent.

## Assumed-knowledge check

Unsupported item: immediate, as above. “Mnemonic” is unfamiliar vocabulary, but the immediate construction context says “instruction names”, and the next sentence says to omit registers/operands; the first hints reinforce that distinction. I do not treat this as a separate missing-knowledge finding.

Prior-definition evidence supporting the rest:

- compare-and-choose.prose.ts explains the ternary expression as choosing one value or the other; its explanation gives cs and ls and their flags. The A32 section itself explains the condition suffix.
- calls-and-returns.prose.ts defines link register, calling convention, stack/frame, alignment and leaf function. This lesson supplies the differing A32 names and eight-byte rule beside the relevant record in the optional note.
- constants-and-widths.prose.ts explains void, low/upper halves, the w/x relationship and optional # before a number.
- division-and-remainders.prose.ts defines divisor/quotient and integer division's discarded fraction.
- Module 0's compiler note explains -O1; this lesson's compiler note explains -marm and -march=armv7-a.
- The target's opening explains execution state and A32; the later prose explicitly distinguishes a library-helper name from an instruction.

## What worked

The numerical question identifies a whole function call and asks what it returns. Argument versus result registers are explicit. The A32 records and A64 execution are distinguished repeatedly where needed. C/assembly pairs remained readable on phone and desktop; stepping highlighted the relevant C operation and current instruction with controls nearby. The saved-register note belongs beside the division record. No additional substantive findings forced.
