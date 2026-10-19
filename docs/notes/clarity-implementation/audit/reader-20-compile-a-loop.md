# Independent learner review: lesson 20, Compile a loop and follow its branches

Read-only review of `compile-a-loop`, using the current built site at `http://localhost:4290/assembly-lab/#/lesson/compile-a-loop`. No previous review notes read. Read CLAUDE.md, docs/style.md and docs/authoring.md; front-page Before you start; the complete immediate prerequisite `from-c-to-instructions.prose.ts`; target structure, all prose, labels, options, feedback, hints, reflection answer, model note, relevant shared compiler/editor/prediction/listing strings and compiler diagnostics. Consulted earlier register, loop, shift and instruction definitions. A bulk read of earlier prose was output-truncated; I do not claim a fresh exhaustive read of all nineteen earlier lessons.

## Finding 1 — low: prediction cards still explain stepping before there is a stepper

- Exact visible text: **“STEPPED”**, caption **“Predict the total before running the loop.”** Opening the badge shows **“Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”** The actual question below is **“What does accumulated_charge(3, 4) return?”**
- Source: `content/lessons/compile-a-loop.ts:13-16` sets the shared prediction factory to `timeModel: "steps"` without a prediction role; the same factory supplies the Failure Experiment prediction. Shared wording is `packages/views/src/strings.ts:8-13`.
- Setup/state: clean lesson, before committing either prediction. Phone 375 light: opened first prediction's Stepped button; screenshot `/tmp/course-clarity-audit/reader20-prediction-note.png`. Initial DOM confirms the same badge on the failure prediction. Both predictions have answer choices and Check your prediction, with no step controls. The Investigation separately has the genuine compiler stepper and the same guidance.
- Learner effect: the extra explanation interrupts the act of predicting and suggests that this card can be stepped. This repeats the placement problem the user identified in the introductory lesson. The question itself has adequate immediate inputs and a clear return-time target; it does not have the ambiguous execution-moment problem.
- Direction: distinguish prediction cards from steppers in this lesson's interactive metadata, and retain stepping guidance with the Investigation controls. No prose rewrite needed.

## Assumed knowledge

No additional unsupported technical knowledge found. Evidence:

- Before you start explicitly includes unsigned parameters, return, for and while.
- `counting-up.prose.ts:12-13` defines loop, body and iteration and describes initialisation, condition and update; its investigation explains a backward branch.
- `from-c-to-instructions.prose.ts`, motivation, defines working registers as holding “temporary values needed while evaluating an expression”; investigation explains the C evaluator followed by the A64 simulator; model note identifies the unsigned subset and fixed register assignments.
- `meet-the-machine.prose.ts`, compiler note, defines GCC, Compiler Explorer and `-O1` before this lesson's optional note uses them.
- This lesson's generalisation explicitly distinguishes repeated shifts from one shift by 32, so that final task does not depend on a later lesson's C-boundary explanation.

## Actual browser coverage

Chromium, width375/1280, height850, light/dark: inspected initial screenshots and an actual one-instruction run in all four configurations, with C pairing, next-instruction card, registers and controls. Chose and checked one prediction, ran the unlocked Investigation, and pressed Next once in each configuration. Read initial and unlocked page text. Opened first construction hint and prediction badge on phone light. No horizontal document overflow in any configuration. Screenshots `/tmp/course-clarity-audit/reader20-{375,1280}-{light,dark}-{initial,step}.png` were visually inspected. Paired source/assembly and current-step controls were legible in both themes and layouts.

Not covered: solving either challenge, all source/input edits, full-loop completion, all hint disclosure interactions, live GCC requests, exhaustive keyboard/accessibility checks. All target hint and feedback text was read in source. No code or lesson edits made.
