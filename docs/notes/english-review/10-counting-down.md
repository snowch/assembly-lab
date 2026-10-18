# English review: Counting down, and knowing when to stop

Copyright © 2026 Christopher Snow

Review only, 18 October 2026. No course text or code changed. Reader position: Module 5 lesson 2, after `counting-up`; no later lessons assumed. Read against `CLAUDE.md` and both closing passes in `docs/style.md`.

## Findings

### 1. Medium: the C-standard note leaves the compiler permission abstract

- Exact text: “lets a compiler assume termination for such a loop if it performs none of the specified observable operations” and “Another compiler need not preserve a never-ending run of this C loop.”
- Location: `content/lessons/counting-down.prose.ts:60` and `:61`, expanded “What the C standard permits”.
- Effect: the reader can follow the condition but cannot tell what “assume termination” permits the compiler to do to the generated program. “Need not preserve” repeats the permission without making its practical consequence concrete. The preceding main paragraph explicitly contrasts recorded assembly with other compilers, so this note is where that distinction needs to become understandable.
- Prerequisite check: the front panel assumes reading small C functions, not C abstract-machine rules. Module 0 explains compiler optimisation settings and shorter output, but does not explain the permission to assume that a loop ends. Searches across all ten earlier lessons found no earlier explanation of termination assumptions, observable operations or local variables. Input/output and local-variable terminology also arrives inside this one sentence rather than being grounded in the displayed function.
- Direction: explain the consequence for generated code in ordinary language, and identify the relevant changes in this function. Keep the qualification about what this specific GCC listing proves. No additional standard terminology is needed unless it is explained.

### 2. Low: a hint heading can make a correct instruction look like the mistake

- Exact rendered pairing: “COMMON MISTAKE” followed by “Put a label before the shift so a branch can repeat it.”
- Locations: heading in `platform/lesson-runtime/src/strings.ts:122`; hint in `content/lessons/counting-down.prose.ts:31`.
- Effect: the heading categorises the positive instruction as a common mistake. A learner opening hints to correct a failed submission can reasonably read this as something to avoid. The following “SMALLER EXAMPLE” also introduces advice about the current program rather than an example, but the misleading mistake label is the actionable problem.
- Direction: align the hint's content with its fixed heading, or give that rung a heading that describes the advice. Do not change the loop mechanism.

## Prerequisite and assumption checks

Front page `apps/course/src/strings.ts:24–39`: basic C arguments, return, if/else, for/while and array indexing; binary/decimal conversion; no assembly experience. Earlier lessons establish registers and argument/result placement, GCC/listings and `-O1`, unsigned range and hexadecimal, subtraction wrapping and NZCV, logical right shift, comparisons and unsigned `cs`, labels and taken branches, `cbz`, and GCC/Arm dotted branch spelling. `counting-up` establishes body/iteration, the dimming scenario, compound shift assignment, first-entry checks and trace limits. `counting-down` itself explains `ticks--` and the previously unassumed `do` loop before asking the reader to use them. These are not findings. The only unexplained assumed knowledge found is in the optional standard note described above.

## Coverage and browser evidence

Source reviewed in full: `counting-down.prose.ts`, `counting-down.labels.ts`, `counting-down.ts` and its `loops.listings.ts` programs; applicable shared prediction, loop, stepper, editor, model-note and verdict wording. Both five-rung hint ladders, both prediction explanations, both challenge tasks, captions, options, detail panels, reflection answer and model-versus-reality note were included. `finalFeedback` exists in prose but is not wired to these challenges; it was read without claiming it appeared in the browser.

Built page: `http://localhost:4220/assembly-lab/#/lesson/counting-down`. Chromium at widths 1280 and 375, height 900, explicitly selected Light and Dark themes. In each of the four combinations opened every details panel, submitted both predictions, opened all five hints for each challenge, and ran both starter programs to inspect failed-test feedback. Read unlocked stepper/run controls and loop summaries. Prediction mismatch feedback, instruction-limit explanation, actual/expected verdicts and all hint labels were visible. No additional English finding arose from the viewport/theme changes.

Artifacts: `/tmp/english10.cjs`; full-page screenshots and extracted rendered text `/tmp/english10-{1280,375}-{light,dark}.{png,txt}`. The artifacts contain exercise solutions and are intentionally outside this review note. No build or full test suite was run.
