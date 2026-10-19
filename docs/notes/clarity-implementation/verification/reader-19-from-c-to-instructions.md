# Independent reader/checker: 19 — From C to instructions

Verdict: **PASS for the accepted corrections and representative changed states.** No new actionable clarity regression found. Read-only; no course files edited.

## Reading and scope

Read the current lesson prose, labels, structure, both tasks and all ten hints before consulting the audit and coverage plan. Read CLAUDE.md, docs/style.md and docs/authoring.md; prerequisites were checked against the front-page panel and relevant earlier lessons: Module 0 compiler settings, Constants and widths (mov/movk/constants), Memory and addresses (load/store meaning), and the previously taught multiplication, unsigned wrapping and call/return concepts. No later lesson knowledge assumed. Read the local compiler/editor strings and relevant CompilerPlayground rendering. Subsequently reconciled the whole-course audit, coverage plan and prior lesson19 finding evidence. No author self-justification consulted.

## Browser evidence

Actual Chromium at `http://localhost:4292/assembly-lab/#/lesson/from-c-to-instructions`; fresh context for each of 375/1280 × light/dark, height960. Set `assembly-lab:v1:theme` to the raw theme string and asserted the resulting HTML `data-theme` in every configuration.

In all four configurations read initial rendered text, observed the gated investigation, submitted a deliberately incorrect prediction, compiled the unlocked local C source, ran with its default inputs and advanced the first instruction. Checked the rendered step status, its code element, written-register label and instruction/source context. Inspected all four step screenshots visually; phone initial full-page overview also inspected. No document horizontal overflow in these states.

Artifacts: `19-{375,1280}-{light,dark}-initial.png`, `-initial.txt`, `-step.png`, `-after.txt`; execution record `19-browser.log`; reproducible probe `probe19.mjs`, all in this directory. The full-page screenshots are overview artifacts; detailed visual judgement relies on the separate step images and rendered-text capture.

## Accepted corrections

- **L17 immediate — fixed.** Motivation now defines the term immediately before using it: “An immediate is a constant written in an instruction.” This connects the new assembly noun to the already-taught constant concept. The following movz/movk explanation is consistent with the earlier partial-register construction lesson.
- **N19 copying versus memory load — fixed.** Motivation says “The generated instructions copy inputs into working registers”. The displayed and executed first instruction is a register-to-register move, agreeing with the claim and preserving the earlier definition of a load as a memory transfer.
- **S4 compiler status formatting — fixed.** After the first step, the browser displays “Ran mov w8, w0.” with the instruction inside one code element and no literal backticks. The next-instruction context uses matching formatting. Verified in all four configurations.
- **S1 roles — fixed in this lesson.** Both prediction helpers have `role: "prediction"`; initial rendered page labels them PREDICTION. Assembly/C challenges use EXERCISE. Compiler playgrounds retain STEPPED because their unlocked Next control executes an instruction. Initial investigation is locked until its prediction is checked; the unattempted failure prediction still locks its own playground.
- **S2 shared write label — consistent here.** First step labels its written destination “Written”, not “Changed”. This run changes the value, so it does not independently establish the unchanged-value edge case checked elsewhere.
- **M6 hint roles — source review passes for this lesson.** Both ladders give the concept, a real mistake to avoid, a concrete small input example, partial guidance and the final answer in the fixed platform order. No answer content is reproduced in this report.

## Assumed knowledge

No additional untaught-knowledge finding within the reviewed scope. C unsigned parameters, locals, return and if are covered by the entry panel and preceding course; arithmetic wrapping and multiplication have prior lessons. Working/intermediate values are defined in the same paragraph as first use. The C evaluator's role is explained before the interactive run instructions. GCC, Compiler Explorer and optimisation settings have Module0 explanations. The new immediate term is now defined locally.

## Limits

This was a focused reader/checker pass, not an exhaustive UI or compiler correctness test. Did not send code to Compiler Explorer, solve challenges, reveal every hint in the browser, run every generated instruction, exercise edited C variants, or test all inputs/saved states. Hints and failure/model explanations were reviewed in source and rendered page text where available. No build or full test suite run by this reader. No issue requiring a rewrite or correction was found in this pass.
