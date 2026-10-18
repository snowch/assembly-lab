<!-- Copyright © 2026 Christopher Snow -->

# English review: Recursive calls and separate frames

Scope: Module 9, lesson 2 (`recursive-calls`). Review only; no course text changed.

## Findings

No substantive English finding survived the prerequisite and context checks. The page explains the new mechanism in a usable order: self-call and stopping input, preservation across the next call, separate frames, return order, progress towards the base case, and the distinction between retaining a brightness and counting a level. No rewrites or exercise answers are included here.

## Prerequisite verification

Read the binding `CLAUDE.md` and `docs/style.md`, the front-page “Before you start” panel (`apps/course/src/strings.ts:24`), and course order (`content/lessons/index.ts`). Checked earlier teaching through `calls-and-returns`; no later lesson was used to supply knowledge.

The front page assumes small C functions using integer arguments, returns, conditionals, loops and indexed arrays, plus binary arithmetic. Relevant earlier definitions checked:

- GCC and the optimisation setting: `meet-the-machine.prose.ts:10,16–18`. The immediately preceding lesson explains `-fno-inline` and inlining at `calls-and-returns.prose.ts:9`.
- Hexadecimal and set bits: `one-pattern-three-readings.prose.ts`, investigation. Unsigned wrapping follows earlier arithmetic teaching.
- Constants and optional `#`: `constants-and-widths.prose.ts:46`. The `w` and `x` names are views of the same register, with upper-bit clearing, at `:61–66`.
- Unsigned right shift and halving with the remainder dropped: `shifts.prose.ts:35`. Thus odd brightnesses do not require a fresh rounding explanation here.
- Labels and conditional branches, including `cbz` and `cbnz`: `branches.prose.ts`, construction and generalisation (`:55,91`).
- Memory, addresses and little-endian byte order: `memory-and-addresses.prose.ts`; indexed load/store syntax and pointer updates: `array-addresses.prose.ts:18`.
- Caller and callee: `calls-and-returns.prose.ts:6`; link register, return address, stack and stack pointer: `:11`; stack frame, invocation, pair saves/restores, frame pointer and preservation requirements: `:18`; argument/result registers and values surviving calls: `:36`.

Recursion and base case are defined on this page before the exercises. “Child’s result” in the explanation refers to the already-described next recursive call; the adjacent discussion identifies the returned register and original brightness. This does not require an independent tree vocabulary lesson. No unexplained assumed knowledge was found that materially obstructs these tasks.

## Complete coverage

Read every learner string in `recursive-calls.prose.ts`, `recursive-calls.labels.ts` and the lesson wiring in `recursive-calls.ts`: objectives, ten sections, captions, options, both questions and explanations, both tasks, all five hints for each task (including final solution hints), all ten test labels, compiler details, reflection answer and model-versus-reality note. Read the displayed C and assembly and starter/reference text in `calls.listings.ts`.

Also checked shared stack labels and required-call feedback (`packages/views/src/strings.stack.ts`), stepper/prediction/editor/grader copy and simulator model note (`packages/views/src/strings.ts`), the relevant loop-prediction copy (`strings.loop.ts`), stop-message routing and register-grader failure paths (`messages.ts`, `grader-memory.ts`), machine stop feedback, and platform challenge/hint/failure headings (`platform/lesson-runtime/src/strings.ts`, `apps/course/src/runtime-strings.ts`). Read the rendered failure cards as well as their source paths. Both style passes were applied: sentence clarity and whether the mechanism arrives with enough information to use it.

## Browser evidence

Used the existing build at `http://localhost:4220/assembly-lab/#/lesson/recursive-calls` in Chromium at **1280 × 900** and **375 × 900**, each in **light and dark** themes. Opened details, checked both predictions, unlocked all stack figures, moved each stack slider to the recording end, ran both unchanged starters to expose failure feedback, and revealed all ten hints. Read rendered prose and feedback in all four configurations. Screenshots were inspected at desktop and phone widths across the two themes. No horizontal document overflow was reported in any configuration. No rebuild or full test suite was run.

Temporary browser artifacts: `/tmp/english18.mjs`, `/tmp/english18-crops.mjs`, `/tmp/english18-{1280,375}-{Light,Dark}.txt`, full-page screenshots with the same stem, and `/tmp/english18-top-{1280,375}-{Light,Dark}.png`. These local interaction artifacts contain revealed exercise material; this review does not reproduce it. Successful exercise grading was not part of this English review.
