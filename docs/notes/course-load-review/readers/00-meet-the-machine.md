# Meet the machine: independent learning-load review

Module 0, course order 0. Snapshot f1fdf35. Reviewer: independent GPT-6.1 reader session, inherited effort. Review only; no production edits. Read AGENTS.md, CLAUDE.md, review brief, authoring rules, all ten lesson sections, labels, recorded listings, ArgsFigure, TracePrediction and StepperFigure implementations. No later-lesson knowledge assumed.

## Entry knowledge and new mechanisms

The entry panel (`apps/course/src/strings.ts:32–51`) permits small C functions, `int`/`unsigned`, arguments, return, conditionals, loops, arrays, basic arithmetic and binary/decimal conversion. It explicitly says “You do not need any assembly experience” and “You do not need a compiler”. There are no earlier lessons.

| Stage | What the learner must already use | Newly introduced mechanism |
| --- | --- | --- |
| Question / motivation | Read C arithmetic and return | Compiler-to-instruction translation; assembly/listing; paired source association; function label |
| Prediction | C variable and argument values | Registers; argument-to-register mapping; reuse of argument storage for an intermediate result |
| Investigation | Mapping and basic addition | Operand order/read versus write; state changing one instruction at a time; next-instruction marker/program counter; decimal registers and optional bits |
| Construction | Practised read/write rule, sequential arithmetic and result location | Change operand order in assembly through an editor |
| Failure experiment | Sequential stepping and the effect of a return | Instructions occupy memory; execution can cross a function boundary when return is removed |
| Explanation / generalisation | Earlier observed behaviour | Consolidated calling convention; compiler optimisation changes implementation strategy |
| Challenge / reflection | Follow consecutive register writes; preserve unwritten registers | Literal-number operand syntax, explained locally; transfer operand rule to a different destination |

The candidate prerequisite gap is narrow: the first prediction assumes a convention about operand positions that has not yet been supplied. GCC, optimisation settings and the compiler tool are explained where used; the optional command is not an execution prerequisite. Binary conversion is allowed by the entry requirements. Four registers/four instructions do not, by themselves, establish excessive novelty.

## Candidate finding for independent sceptic review

**M0-1 — Medium candidate: first prediction can be read as requiring a syntax convention before the learner has learnt it.**

Exact task: “After the first instruction runs, where is the value of `total` kept?” (`meet-the-machine.prose.ts:43`). The nearby preparation says only “It adds two register values and stores the result” (`:40`) and shows the argument mapping. Neither tells a beginner which position names the output or that the same register can be read before being overwritten. Matching the C line to the instruction identifies an operation, not the destination convention.

The missing explanation appears later: “For `add` and `sub`, the first operand names the register written; the other two supply the input values” (`packages/views/src/strings.module0.ts:13–14`). StepperFigure renders it only after the first step (`data.compact && data.flow && view.k === 1`), and that stepper stays locked until this prediction is checked (`StepperFigure.tsx:225ff`). ArgsFigure's before/after explanation is also withheld until the prediction is committed. Thus the reasonable first-time learner must infer an arbitrary syntax convention, select from options and interpret a storage-reuse idea simultaneously. Contrast the later failure experiment's explicit permission to guess: “This is a new situation. Make your best prediction, even if you're unsure.”

Reproduced in all four fresh contexts: initial prediction and locked investigation, then commit and first step exposing the rule. No challenge answer is required to demonstrate this sequencing gap.

The concern is framing, not the mere use of prediction before explanation. A best guess can be pedagogically useful here: the options expose plausible storage misconceptions, any committed choice unlocks the same explanation and stepper, and the learner is not required to retry until correct. The candidate harm is that the first-ever “Check your prediction” can imply that choosing correctly should be possible from the supplied rule, which it is not. The introductory lead contains no explicit best-guess invitation. Incorrect-option feedback appears only after commit, alongside the complete explanation, so it does not strand the learner behind another gate. A sceptic should reject or downgrade this candidate if that single low-stakes diagnostic guess is judged adequately signalled by the word “prediction”.

Smallest direction if accepted: explicitly frame this first item as exploratory, matching the later failure experiment. A stronger sequencing option is to make operand destination/read-before-write available before this prediction through the existing worked first step; then ask a transfer question on the next instruction. Alternatively make this first item explicitly exploratory and avoid implying that correct inference is expected. Keep the current register-to-variable conceptual point. This is not grounds to split add/sub/return into separate lessons.

## Design recommendation, not a confirmed second overload finding

The first worked step is long: at 375px the default screenshot spans about 1,100px; opening “Explain this step” produces a measured 1,315px figure. At 1280px the default figure is about 1,040px tall. The learner encounters the paired listing, equation, registers, operand rule and diagram, optional reads/writes, then the next question and controls. On phone the complete pair is a contained horizontal scroller, initially displaying the C side; the instruction side is offscreen horizontally. This makes cross-checking source/instruction/register views cost additional movement.

If observation with beginners confirms tracking problems, move or group the existing operand diagram and the next-register check more tightly, or make the worked-first-step/next-attempt transition explicit. Preserve access to the full listing and complete C. Do not remove the function simply because it has four instructions. The later second-step figure measured only 717px high, the optional detail closed automatically on advancing, and the next instruction is repeated beside its question: these materially reduce the suggested risk. Height alone is not evidence that learners cannot do the task.

## Treatments worth keeping

- Decimal register values are the default; “Show the bits” is optional. No need to decode 128 bits to practise operand roles.
- The first step supplies a computed equation and a diagram of reads and write, including the two appearances of one register. Later steps ask a focused register question rather than requiring a complete manual trace immediately.
- “Explain this step” is closed by default and resets to closed for the next step. The expanded panel describes the past instruction while the separately labelled question identifies the next instruction.
- The construction challenge is only a two-instruction function and asks for one meaningful edit after stepping practice. It introduces editing without introducing another arithmetic mechanism.
- The failure experiment announces uncertainty, preserves a prediction gate and uses already-practised arithmetic to investigate control flow. Its additional function is purposeful rather than gratuitous panel density.
- The final trace combines practised subtraction/state tracking and locally explains the number operand. Its length is appropriate synthesis; no independent evidence supports shortening it solely on instruction count.
- Compiler provenance and original line references stay in disclosures. The main task does not require using a local compiler or understanding its command options.

## Browser evidence and limits

Preview: `http://localhost:4210/assembly-lab/#/lesson/meet-the-machine`. Independent fresh Chromium contexts at 375×900 and 1280×900, system light and system dark. Verified actual body backgrounds: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`. Both themes visually inspected through saved figure screenshots. Document scroll width equalled viewport width in all four contexts after normal introductory disclosures opened.

All four contexts exercised: initial page and prediction gate, first prediction commit, first instruction, default worked explanation, “Explain this step” open, next-instruction register choice, second instruction with an intentionally incorrect register choice, auto-closed detail, and Reset. Opened both ordinary introductory notes. Additional fresh phone/dark context exercised completion, optional bits, failure prediction commit, removal switch and completion of the altered run. Did not send code to external services.

Artifacts: `/tmp/course-load-review/meet-the-machine-browser.cjs`, `meet-the-machine-post.cjs`, `meet-the-machine-extra.cjs`; screenshots `meet-the-machine-{375,1280}-{light,dark}-{initial,first,detail,second}.png`; extra `meet-the-machine-375-dark-complete-bits.png` and `meet-the-machine-375-dark-removal-complete.png`. Source capture `meet-the-machine-views.txt`.

All ten sections and both challenge definitions read. Editor modes, challenge grading/hints, reflection answer disclosure and local compiler commands were source-only; no challenge submitted, no hints/answers opened, no external compiler call. This is an instructional-load review, not an ISA correctness audit or measured beginner usability study. No claim that the course reveals challenge answers before an attempt is supported here.
