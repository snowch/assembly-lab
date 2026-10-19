# Independent reader/checker: lesson 22, checked arithmetic

Reviewed the final production app at `http://localhost:4292/assembly-lab/#/lesson/checked-arithmetic`. Read-only; no lesson edits. I did not author these changes or read the author's justification. I first read the actual prose, labels, lesson structure, hints and relevant earlier prerequisites, then the accepted audit summary and coverage plan.

## Verdict

**Accepted fixes verified. No surviving new clarity finding or introduced regression in the reviewed states.**

- **L18, recovery behaviour: fixed.** The visible optional note now says, “GCC normally lets execution continue after many reports. This is called recovery; it does not repair the invalid operation or make its result valid.” It then states what `-fno-sanitize-recover=undefined` changes. This explains the practical meaning of the option instead of assuming the learner knows recovery. Location: `content/lessons/checked-arithmetic.prose.ts`, `generalisationNote`. Readable on both widths and in both themes.
- **N4, initial register state: fixed.** “Registers before the run” is a visible heading above the prediction's input register, initially and after checking a choice. The result feedback describes the state when the run ended. The unchanged input display no longer appears to be the final register. Location: `packages/views/src/interactives/RunPrediction.tsx`, input section; observed on `#ix-predict-narrow-gradient` in all four configurations.
- **Shared roles: fixed here.** The prediction uses the plain Prediction badge; the dependent instruction figure retains Stepped. Both prediction figures declare the prediction role. The exercises declare exercise. This matches their respective actions.
- **Prediction gate preserved.** The initial dependent stepper says to check the prediction above first. After committing a choice, the stepper opens and Next executes an instruction. No post-run explanation was visible before commitment in the inspected prediction.
- **Hint roles:** source reading of both ladders found the common-mistake hint describes an actual error, and the smaller-example hint supplies a concrete example. No corrective issue remains within this review's scope.

## Assumed knowledge

No newly unexplained required knowledge found. The front page supplies simple C functions, integer/unsigned inputs, control flow and arrays. Relevant earlier lesson passages establish byte types and casts (`loading-widths`), pointers and byte-addressed storage (`memory-and-addresses`), arithmetic flags and conditional results, and `INT_MIN`/`INT_MAX`, headers and undefined signed overflow (`c-and-overflow`). This lesson itself explains integer promotion, printf's format string and integer codes, the boolean result, checked addition, sanitizer and recovery. The details' C/compiler terminology is consistent with preceding instruction/compiler lessons; learners need not execute the external sanitizer runtime to complete this lesson.

## Browser evidence and limits

Actual Chromium via Playwright at widths 375 and 1280, light and dark, fresh contexts. Theme stored as a raw string and `html[data-theme]` asserted. In each configuration I observed the initial prediction, its gated stepper, a submitted choice and feedback, the opened stepper after one Next, and the expanded warnings/sanitizer note. No page errors or horizontal page overflow in those runs. Screenshots were inspected for the changed labels and explanation.

Artifacts next to this report:
- `22-{375,1280}-{light,dark}-{initial,after,step,recovery}.png`
- `22-{375,1280}-{light,dark}-page.txt`
- `22-evidence.json`

I read both exercise tasks and all hints in source; I did not solve the exercises, exhaust every prediction choice, run all memory-stepper states, follow external compiler links or retest GCC's sanitizer runtime. No build or automated suite was run. This verdict concerns the accepted corrections and clear regressions, not a fresh exhaustive ISA/C certification.
