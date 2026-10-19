# Independent learner review: 19 — From C to instructions

Read-only review. No earlier review notes consulted. Read CLAUDE.md, docs/style.md, docs/authoring.md, front-page prerequisites, index.ts ordering, the preceding Recursive calls prose, and relevant earlier definitions in Meet the machine, Constants and widths, Memory and addresses, and Products and widths. Read the whole target prose and labels, both challenge tasks and hint ladders, prediction feedback, model note, compiler/editor/diagnostic strings, and relevant shared listing/prediction strings.

## Browser coverage

Actual Chromium at http://localhost:4290/assembly-lab/#/lesson/from-c-to-instructions, widths 375 and 1280, height 900, light and dark, fresh page state per configuration. Inspected opening C/assembly pairing and prediction context; opened the prediction badge; checked one deliberately incorrect prediction; compiled and ran the local source and advanced two instructions; opened first construction hint and ran the unchanged starter to inspect feedback. Screenshots and page text: `/tmp/course-clarity-audit/19-{375,1280}-{light,dark}-{opening,prediction,step}.png` and matching `.txt`. Visually inspected screenshots spanning all four configurations. No document horizontal overflow. Did not exercise every input, solve challenges, use network GCC, or traverse every generated instruction. Hidden hint/model/diagnostic wording reviewed in source, not exhaustively triggered in browser.

## Findings

### 1. Medium — prediction still offers stepping guidance before a question with no stepping controls

Quote: badge **“STEPPED”**, expanding **“Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.”** The following card asks **“What does trip_charge(6, 4) return?”**

Location: `content/lessons/from-c-to-instructions.ts:14`–16, prediction helper's `trace-prediction`/`timeModel: "steps"` with no prediction role; text in `packages/views/src/strings.ts:10`–13. Applies to the failure prediction through the same helper.

State/setup: initial unanswered prediction, click Stepped badge. Reproduced at all four configurations; screenshots `19-375-light-prediction.png` and `19-1280-light-prediction.png` make placement especially clear.

Learner effect: the lesson asks for a function result, but presents execution-step guidance immediately above it where there are no Next/Back controls. This repeats the placement problem recently removed from the introductory prediction. The caption does identify prediction, so this is guidance placement rather than an ambiguous numerical question.

Direction: give prediction figures their reader role consistently and keep stepping guidance with the investigation's actual stepper.

### 2. Low — “load inputs” conflicts with the previously taught meaning of load

Quote: **“The generated instructions load inputs into working registers, perform the multiplication, and copy the product into the local variable's register.”**

Location: `content/lessons/from-c-to-instructions.prose.ts:11`, Motivation second paragraph.

State/setup: read Motivation beside the initial listing; optionally compile/run and step the first two instructions. Those instructions are register-to-register `mov`, with no memory access. The prior Memory and addresses lesson explicitly defines **“A load copies bits from memory into a register.”** (`content/lessons/memory-and-addresses.prose.ts:25`).

Learner effect: a learner who has just learned the load/store distinction may look for a missing memory source or conclude that a `mov` is a load instruction. The surrounding paragraph already assigns the input values to registers, so the mechanism is easy to state consistently.

Direction: identify these operations as copying the input values between registers, reserving the taught load terminology for memory transfers.

### 3. Low — “immediate” is used before the course explains this assembly term

Quote: **“movz places a 16-bit immediate in a selected part of the destination and clears the other bits.”**

Location: `content/lessons/from-c-to-instructions.prose.ts:11`, Motivation third paragraph.

State/setup: ordinary initial reading; no interaction required. This is the first learner-prose occurrence of the noun “immediate” in course order (the other occurrence is the later A32 lesson). Earlier constants teaching says **“A number written inside an instruction is a constant.”** (`content/lessons/constants-and-widths.prose.ts:16`). Front-page prerequisites include no assembly vocabulary. Diagnostic key names and originality notes are not learner explanations.

Learner effect: a new noun appears while the learner is also distinguishing mov, movk and movz. They already know the required concept as a constant, but must infer that this new word means the same kind of operand.

Direction: use the already taught term, or explain the new assembly term at this first occurrence.

## Assumed knowledge and findings not raised

Unsupported knowledge: “immediate”, finding 3. No additional unsupported knowledge finding within reviewed material. The local C evaluator's role is explained in Investigation (checks C operations before the A64 run), though its name is new. Working values are defined immediately as temporary values needed to evaluate an expression. Module 0 explains GCC, Compiler Explorer and -O1; Constants and widths explains movk, # and register widths; Products and widths explains multiplication and unsigned wrapping; calls and returns are prior topics. C functions, unsigned parameters, return and if are front-page prerequisites. The questions specify a function call and return result, so unlike the earlier total question they do not leave the execution moment unspecified. The investigation's Next instruction and Ran status visibly distinguish the upcoming operation from the last executed one. C/assembly relationships are visible in paired groups on desktop and stacked groups on phone.
