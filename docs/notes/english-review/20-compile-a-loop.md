# English review: Compile a loop and follow its branches

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026. Scope: Module 10, lesson 2, `compile-a-loop`, at `http://localhost:4220/assembly-lab/#/lesson/compile-a-loop`. Review only; no course content or implementation changed, no rebuild or full test suite run.

## Findings

No confirmed unclear-English finding. No severity assigned and no replacement prose proposed. The lesson's counter, loop condition, empty case and repeated-operation explanations have identifiable referents and a progressive explanation for the assumed learner.

## Coverage

Read `CLAUDE.md` and `docs/style.md`. Read every learner-facing field in `content/lessons/compile-a-loop.prose.ts`, `compile-a-loop.labels.ts` and its lesson definition: all ten sections, objectives, captions, both prediction questions and explanations, both expandable notes, both challenge tasks, all five hints for each challenge, test labels, reflection and model-versus-reality note. Read the generated C/assembly displayed in the browser.

Also read the shared prediction/listing/stepper/model strings in `packages/views/src/strings.ts`; all C editor, statement builder, playground, comparison and C-grader messages in `packages/views/src/strings.compiler.ts`; all compiler/evaluator diagnostics in `packages/compiler/src/strings.ts`; runtime challenge/hint messages and course overrides. Checked the machine instruction-limit message used by this page. This includes text not present until a prediction, compilation, test or editor operation has occurred.

The browser pass covered both predictions and their feedback; unlocked both playgrounds; expanded the notes and supported-C details; revealed every hint in both challenges; ran both untouched challenge starts and read their failure cards. Opened the statement builder, its line list, replacement controls and preview, and the optional GCC disclosure. Did not send C to Compiler Explorer. Compiled and ran the original loop, stepped through the backward branch and inspected the next-instruction/source-line display. Exercised invalid C syntax, an invalid shift and a machine execution limit, reading the resulting diagnostics.

## Prerequisite audit

Assumed only the front page's “Before you start” panel and the earlier lessons in `content/lessons/index.ts`, through `from-c-to-instructions`. Did not use the later C-overflow or A32 lessons to justify vocabulary.

Verified the relevant earlier explanations:

- Front-page prerequisites (`apps/course/src/strings.ts:26–39`) include reading unsigned parameters, returns, conditions and `for`/`while` loops.
- `meet-the-machine.prose.ts:16–18` explains GCC's version and `-O1` setting. The present note does not assume an unexplained compiler option.
- `branches.prose.ts:23–27` defines labels and taken branches; lines 55–57 explain `cbz`, label naming and the optional `.L` prefix. Generated `.Lcourse` labels therefore require no new syntax convention.
- `counting-up.prose.ts:12–13` defines loop, body and iteration and explains the initialisation/test/update sequence of `for`. Its reflection at lines 67–68 explicitly connects earlier instructions with repeating work.
- `counting-down.prose.ts:22` connects `subs` and the following branch; lines 43–48 distinguish finite long runs, limits and wrapping; lines 46–48 explain the initial `while` test and unsigned wrap. Its note at line 60 already introduces termination as the stopping property of a loop.
- `shifts.prose.ts:14,23` supplies unsigned right shifting and its meaning. The present lesson itself explains the distinction between a repeated valid shift count and one invalid large count (`compile-a-loop.prose.ts:38,52`); it does not require the later overflow lesson.
- `from-c-to-instructions.prose.ts:9,11,18,54` explains the local compiler, fixed patterns, working/temporary registers, C evaluator before assembly, source-line mapping, supported subset and limits. The current use of those ideas is a continuation.

No additional unexplained assumption was confirmed. “Budget” is attached to the execution-limit explanation in the opening note. “Boundary” is made concrete by the displayed comparison and the changed comparison. “Empty case” is accompanied by the zero-count example. These were checked as possible jargon/referent issues and were not retained as findings.

## Browser evidence

Playwright used the already-running build, separately at 1280 × 900 and 375 × 900 with light and dark colour schemes. Expanded-page screenshots and text captures are `/tmp/english20/1280-light.*`, `1280-dark.*`, `375-light.*` and `375-dark.*`. No document horizontal overflow occurred in these four states.

Additional interactive passes used 1280 × 812 and 375 × 812 in both themes. Visually inspected all four `/tmp/english20/step-<width>-<theme>.png` screenshots. The current instruction and its associated C line are repeated beside the controls, including on the phone. Detailed builder, compiled-run and diagnostic text is in `/tmp/english20/states-<width>-<theme>.txt`; scripts are `review.mjs` and `states.mjs` in that directory.

Checked previously plausible issues against this build rather than carrying them forward: the maximum-count paragraph now says “When the input count equals that maximum” (`compile-a-loop.prose.ts:36`); failed C tests display Inputs, Actual and Expected; the finite large-input run identifies the simulator's instruction limit and says the function has not returned. None supports a current English finding.

This is a clarity review, not an independent proof of the compiler or instruction set. Browser captures contain the lesson's own answer disclosures; this note does not reproduce challenge answers.
