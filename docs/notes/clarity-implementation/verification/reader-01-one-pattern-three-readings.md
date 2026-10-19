# Independent reader/checker: lesson 01, Same bits, two readings

Reviewed the built page at `http://localhost:4291/assembly-lab/#/lesson/one-pattern-three-readings`. No lesson or application edits. This reader did not author the changes and read the lesson before reconciling the audit's accepted items. Model/effort inherited from the review coordinator; no override requested.

## Result

No surviving finding within the requested changes or clear introduced regressions. The local caption correction and applicable shared role/write-language changes are accepted.

- **N1 accepted.** `content/lessons/one-pattern-three-readings.labels.ts`, `captions.fuelRun`, now says: “fuel_used_wrong(50, 38) as first written. Press Next to see what its subtraction writes to w0.” In all four browser configurations the fresh figure displays its input registers and “Press Next to run the first instruction.” After Next it displays the subtraction's result and identifies the instruction run. Reset restores the original state and instruction. The caption describes an action and no longer claims the initial figure is already after subtraction.
- **S1 applicable occurrences accepted.** Both prediction cards display “Prediction”; the register reader displays “Experiment”; the two answer exercises display “Exercise”. The two instruction steppers retain “Stepped”. The add-12 stepper remains gated until a prediction is checked, and the compiler comparison keeps instructions hidden until its prediction is checked. Labels now match actual learner actions.
- **S2 applicable wording accepted.** `captions.stepAdd12` says “A register with an outline was written by the last instruction.” After stepping, the outline corresponds to the instruction's written register. This avoids claiming every write changes the value. This lesson does not contain a convenient unchanged-value write; that shared edge case requires the separate shared-component reviewer.
- **Hint roles checked in source.** Both local ladders give a concept, a mistake, a concrete already-taught example, partial help and then a solution in the expected order. No remaining local M6 mismatch found. The browser's incomplete-submission response names the missing number field; the first hint is under “The concept”.

## Actual coverage

Read `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, the front-page prerequisite panel in `apps/course/src/strings.ts`, lesson 00 teaching prose, and lesson 01 structure, prose, labels, questions/options, explanations, tasks, all hints and model note. Read relevant `TracePrediction`, `RegisterReader` and reading-grader source. Then read the accepted audit summary and verification coverage plan.

Real headless Chromium at 375×900 and 1280×900, each in light and dark theme selected through `assembly-lab:v1:theme`. In every configuration: inspected initial layout; ran the opening subtraction and reset; checked the add-12 prediction and advanced its unlocked stepper; cleared the register reader and opened its calculation; checked an incorrect compiler-comparison prediction and inspected revealed feedback/listings. Inspected saved screenshots of the key phone/desktop states in both themes. The browser recorded no page errors or document horizontal overflow. A further 375px light check submitted the first exercise incomplete and opened its first hint.

Full-page initial screenshots and figure screenshots are in `reader01-evidence/`; `check.cjs` reproduces the four-configuration probe, and `results.json` records state, gating, roles, overflow and page errors. No challenge solution is reproduced in this report. Screenshots are private review evidence and may include prediction outcomes.

## Assumed knowledge

No newly untaught prerequisite found. The front page explicitly supplies C `int`/`unsigned`, arguments/return, and binary/decimal conversion. Lesson 00 teaches registers, instruction operands, subtraction order, stepping, compiler output and optimisation settings. This lesson introduces hexadecimal, bit groups, top bit, signed/unsigned readings and set/clear where needed. The later width material is clearly deferred in the model note rather than required for an exercise here.

## Limits

This is a targeted independent content and interaction check, not an exhaustive input or persistence test. All hint text and exercise feedback generation were read, but only the first hint and incomplete-submission browser branch were opened. Successful exercise submissions, all incorrect answer permutations, reload persistence, online compiler calls, keyboard/accessibility audit and hardware differential checks were not repeated. Root/shared reviewers own broad automated and shared edge-case validation.

Coordinator supplemental theme check: on final4292, independently opened fresh contexts at375/1280 with raw light/dark preference and asserted actual html data-theme; all four matched. This supplements the reader's raw-storage script and visual theme evidence without changing its interaction verdict.
