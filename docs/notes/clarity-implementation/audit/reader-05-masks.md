# Independent learner review: 05 Masks and fields

Read-only review of `masks`, using CLAUDE.md, docs/style.md, docs/authoring.md and the stated front-page prerequisites. Read the preceding five lessons' prose and labels in index.ts order (Meet the machine through Subtracting and the tick counter), then all masks prose, labels, options, feedback, hints, model note, challenge definitions and the associated figure strings/components. No previous review reports were consulted.

## Actual browser coverage

Built site: http://localhost:4290/assembly-lab/#/lesson/masks. Fresh Chromium contexts at 375×900 and 1280×900, each light/dark. Read initial page and post-interaction text. Expanded the first prediction's Stepped note; committed both predictions; tried all four bit-operation functions, changed the starting word, selected a bit; opened all five hints for each challenge; ran starting assembly, then a passing implementation, and stepped the learner solution; opened the failure experiment stepper; submitted wrong trace answers; expanded compiler/reflection details. Read gated GCC comparison after passing. No horizontal document overflow in any configuration. Not an exhaustive input, keyboard, persistence or accessibility test. Browser interactions/extracted text covered all four configurations; visually inspected phone light prediction, phone dark bit-operation panel, desktop light solution, desktop dark prediction, plus source and rendered text for the others.

Evidence: `/tmp/masks-{375,1280}-{light,dark}-{prediction,bitops,solution}.png`; full rendered text `/tmp/masks-{375,1280}-{light,dark}-complete.txt`; first prediction's outcome `/tmp/masks-375-light-two-inputs.png`. Scripts `/tmp/masks-interact.mjs` and `/tmp/masks-outcome.mjs`.

## Findings

### 1. Medium: one prediction's feedback silently changes its example input

Exact visible text: “The simulator ran the function on a word with every bit set.” The first diagram is labelled “w0 before” with `0xffffffff (4294967295)`. Immediately below, another diagram is also labelled “w0 before”, now with `0xf (15)`. There is no sentence identifying this as a different call. The concluding prose says “The figure shows the low eight bits of the word, the mask and the result, with bit 2 marked.”

Location: `content/lessons/masks.ts:93` supplies the first call, while `content/lessons/masks.ts:96` supplies a different word to the mask diagram. `packages/views/src/interactives/ProbePrediction.tsx:120` renders the second diagram without a transition. `content/lessons/masks.prose.ts:35` describes the figure.

State/setup: check any answer to “Why is the constant −5?”; both diagrams appear, in all four configurations. This is not an arithmetic defect. The input switch is confirmed in the component data and the actual browser.

Learner effect: the learner may read the second diagram as an enlargement of the first run, yet the low eight input bits differ. The repeated before/after labels obscure which call each result belongs to. This reproduces the recent need to specify the state and moment being discussed.

Direction: either use one input consistently in both views, or explicitly identify the second example and its starting input before showing it. Preserve the prediction gate.

### 2. Low: prediction cards still offer a stepping explanation despite having no stepping control

Exact visible text: “STEPPED” above “A prediction about the constant in the listing.” Expanding it reveals “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” This sits directly before “Why is the constant −5?” and its choices. The same badge occurs over the failure prediction and static warning-word/field-reading diagrams.

Location: `content/lessons/masks.ts:86` assigns the stepping model to `predict-minus-five`; the equivalent failure prediction appears at `content/lessons/masks.ts:181`. Wording: `packages/views/src/strings.ts:11` and `:14`.

State/setup: fresh lesson, expand first prediction badge. Actual phone/desktop light/dark screenshots retained.

Learner effect: learners are directed to a stepping concept at a point where they can only choose and check an answer. The badge can also read like a completed state. This is the same misplaced-guidance pattern recently corrected in Module 0, still present here.

Direction: extend the prediction-role treatment to these prediction cards; reserve the instruction-step explanation for figures with actual stepping controls. Assess static diagrams separately rather than automatically labelling every simulator-computed figure Stepped.

### 3. Low: the reflection omits whether its two instructions start independently

Exact question: “The warning word is `0x47`. What does `ubfx x0, x0, 4, 3` give, and what does `eor w0, w0, 4` give?”

Location: `content/lessons/masks.prose.ts:115`.

State/setup: reflection, before opening Answer. Its answer assumes two independent operations on the original word. Earlier in the lesson, the trace challenge explicitly says “Start with `0x2a` separately for each instruction. Do not use one instruction's result as the next instruction's input.” (`:91`). The reflection does not repeat or reference that condition.

Learner effect: both operations write the same physical register, as Module 1 taught. A learner reasonably treating them as successive instructions gets a different second result. This tests guessing the question's execution setup as well as understanding the operations.

Direction: specify that both operations begin from the original word, or explicitly state a sequence and align the answer to it. Do not rely on the earlier challenge's local instruction to establish a convention for every subsequent question.

## Assumed knowledge

No additional unsupported prerequisite found that merits a separate finding. Module 0 introduces registers, operands, return placement, compiler/version/optimisation settings and the simulator; Module 1 explains hexadecimal, signed patterns, `w`/`x` names and unsigned literal suffixes. This lesson explains its C bit operators, names DOOR_OPEN/FUEL_LOW, gives operational rules for AND/OR/exclusive OR before the construction challenge, and defines mask, field, left shift and field extraction. The later `bfi` comparison explains its operand meanings when unlocked. The question's use of OR/exclusive OR before their fuller rules does not demand those rules to answer the first AND prediction. “Status words” and “packed dates” are illustrative applications rather than an assumed skill needed for an exercise.

## Things that were already clear

The construction task specifies where both arguments arrive and where the result must go. The main trace task explicitly separates the three initial states. Failure prediction prose supplies both the call and the exact modified instruction sequence. The stepper says what ran and what runs next, keeping before/after values distinct. These are useful existing patterns to apply to the findings above.
