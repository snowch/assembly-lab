# Independent reader/checker: 03 Adding, and the four flags

## Verdict

No remaining accepted local issue or clear introduced regression found in the reviewed scope. L2, N4 and the lesson's S1/S2 occurrences pass. This is an independent read and browser check, not an exhaustive test of every challenge submission.

## Reading and prerequisites

Read CLAUDE.md, docs/style.md and docs/authoring.md, the complete lesson prose, labels, structure, options, explanations and both hint ladders. Read the front page's Before you start contract and preceding lessons 00–02 prose before reconciling the audit summary and coverage plan. Did not read the change author's justification.

The assumed knowledge is basic C functions/int/unsigned/return and binary arithmetic from the front page; registers, operands, instruction order, simulator controls, flags as individual stored bits introduced on this page; signed/unsigned readings and hexadecimal from lesson01; w/x widths from lesson02. Module0 explains GCC and -O1. The optional compiler example names two new instructions but explicitly defers their explanation and does not require learners to use them. No additional untaught prerequisite was found that prevents this lesson's tasks.

## Accepted fixes checked

| Item | Exact wording/location | Evidence and judgment |
| --- | --- | --- |
| L2: writing a flag vs changing its value | `adding-and-the-flags.prose.ts:80`: “Every `adds` writes all four flags. The flags keep their values until another instruction writes them.” | Motivation, explanation, generalisation and reflection consistently use writing for the operation. The failure experiment identifies changed flag values separately from written registers. Actual step status says the flags were not updated by add. This preserves the distinction and matches the observed run. |
| N4: initial registers still visible after prediction | `RunPrediction.tsx:125–126`, visible “Registers before the run” | Heading visible before and after checking both predictions in all four configurations. Inputs remain clearly identified as the pre-run state even beside completed feedback. |
| S1: calculation columns are not instruction steps | `strings.ts:24`: “The controls reveal the arithmetic one column at a time. These columns are parts of one instruction's calculation. They are not separate instructions.” | Investigation adder has Calculation badge, opens this explanation, and Next column reveals one arithmetic column. Both prediction cards have Prediction badges; the real instruction stepper retains Stepped. Data assigns Calculation to the gated follow-up adder too. |
| S2: register write vs change | `adding-and-the-flags.labels.ts`, stepAdd caption: “An outlined register was written by the last instruction. An outlined flag changed value.” | First/second instruction and Back display the corresponding written register and status. The add instruction leaves flags intact; visual outline semantics agree with caption. This lesson checks consistency of the shared fix; the unchanged-value write edge case is outside this local run and belongs to shared verification. |
| M6 hint roles | Both lesson hint ladders in prose | Common mistake entries identify a misconception, and Smaller example entries give concrete additions. No new mismatch found. Hints read in source; not every rung opened in browser. |

## Browser coverage

Built app: http://localhost:4291/assembly-lab/#/lesson/adding-and-the-flags . Chromium at 375×900 and 1280×900, light and dark. All four runs verified actual `html[data-theme]` equals requested theme. No page horizontal overflow.

In each configuration: initial prediction and gated adder/stepper; chose and checked both predictions; inspected completed feedback and visible input-state heading; opened Calculation explanation; advanced one column; advanced real stepper through adds then add; moved Back. Viewed the resulting screenshots for readable labels and controls on phone and desktop in both themes. Source read covers the entire lesson and its reflection/model note. The separate flag challenge, smallest-overflow exercise and success-gated follow-up adder were not solved/exhaustively exercised. Compiler details were read in source; no external compiler request was sent. No full suite or build run by this reviewer.

Evidence: `reader03-browser.cjs`, `reader03-browser.json`, `reader03-{prediction,adder,step}-{375,1280}-{light,dark}.png` in this directory. First probe incorrectly JSON-encoded the theme storage value; it was corrected to raw theme strings and rerun completely. Final JSON/screenshots replace the invalid probe and record actual theme values.

## Findings

None requiring another fix within this lesson's accepted scope. No challenge solutions are included in this report; screenshots/interaction logs naturally contain the page's feedback after an attempted prediction.
