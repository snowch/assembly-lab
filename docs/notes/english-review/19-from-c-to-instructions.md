<!-- Copyright © 2026 Christopher Snow -->

# English review: From C to instructions

Scope: Module 10, lesson 1 (`from-c-to-instructions`), review only. No course text changed. Low severity means a local comprehension obstacle rather than a blocked exercise.

## Finding

1. **Low: “immediate” arrives without its meaning.** `content/lessons/from-c-to-instructions.prose.ts:11`: **“`movz` places a 16-bit immediate in a selected part of the destination and clears the other bits.”** The learner has been taught the underlying idea under a different name: `constants-and-widths.prose.ts:16` says **“A number written inside an instruction is a constant.”** It also explains optional `#` at line 46. Neither that lesson nor the earlier learner-facing prose and figure strings explains “immediate”. The new noun can therefore sound like another kind of value rather than the constant already familiar from the displayed instruction. This obstructs the first explanation of the newly encountered `movz`, although the surrounding discussion of constants helps. Direction: connect the new term explicitly to the number written in the instruction, or use the established wording. No instruction or exercise answer needs changing.

## Prerequisite verification

Read `CLAUDE.md`, `docs/style.md`, the front-page “Before you start” panel in `apps/course/src/strings.ts`, the target lesson source, and earlier teaching relevant to its vocabulary and operations. Checked prior explanations rather than treating familiarity with assembly or compiler implementation as learner knowledge.

- GCC, compilation, listings and `-O1` are explained in `meet-the-machine.prose.ts:10–18,97`. The local compiler note identifies the different compiler used here.
- Operands are defined in `meet-the-machine.prose.ts:51`. Constants, optional `#`, and the two 16-bit halves used by `movk` are explained in `constants-and-widths.prose.ts:16,42–46`. Finding 1 concerns the new name, not an absent explanation of constants.
- Signed/unsigned readings and hexadecimal are taught in Module 1. Unsigned wrapping is explained by the earlier arithmetic lessons; `products-and-widths.prose.ts:9` explicitly gives the unsigned multiplication rule.
- Parameters and the return register are familiar from earlier lessons. Module 9’s `calls-and-returns` and `recursive-calls` explain calls, saved values and return values. No calling-convention knowledge beyond those lessons is needed here.
- The front-page C check itself includes local declarations and initialisation. `if`/`else`, loops and `return` are stated prerequisites. The task explains the cap and when it applies.
- Intermediate working values receive an immediate plain-English explanation in this lesson. The investigation explains that the C operations are checked before assembly executes, and the completed run identifies the two results being compared. I did not retain a separate finding about “C evaluator”.

The unexplained prerequisite assumption retained by this review is the assembly sense of “immediate”. No additional assumed-knowledge finding survived the checks.

## Coverage and browser evidence

Read all target prose, objectives, section headings, captions, prediction options and explanations, both exercise tasks, all five hints for each exercise, test labels, reflection answer, compiler detail and model-versus-reality note in `from-c-to-instructions.prose.ts`, `.labels.ts` and `.ts`. Read the generated listing/source definitions in `c-compiler.listings.ts`, `packages/views/src/strings.compiler.ts`, `packages/compiler/src/strings.ts`, and the editor/playground components that select those messages. Also read the shared challenge/hint feedback in `platform/lesson-runtime/src/strings.ts` and course runtime overrides.

Used the already-built site at `http://localhost:4220/assembly-lab/#/lesson/from-c-to-instructions` with Chromium at **1280 × 900** and **375 × 900**, each in **light and dark** themes. In all four configurations, opened details, checked both predictions (one mismatch and one match), revealed all ten hints, ran both starting-code test failures, compiled and ran both playgrounds to completion, and switched all C editors to statement controls. Read the resulting page and editor text. Inspected viewport screenshots in all four configurations. The wording finding is unchanged by width or theme.

Additional browser checks read successful feedback for both exercises, the missing-variable diagnostic, an executed divide-by-zero diagnostic, and the optional GCC comparison failure message. The GCC request was intercepted and aborted locally to exercise the failure wording; no code was sent to Compiler Explorer. All compiler/evaluator diagnostic strings were reviewed in source, including limits and unsupported syntax. No rebuild or full test suite was run.

Temporary evidence: `/tmp/english19.cjs`, `/tmp/english19-extra.cjs`, `/tmp/english19-finish.cjs`; `/tmp/english19-{width}-{theme}.txt`, `/tmp/english19-editor-{width}-{theme}.txt`, corresponding full-page `.png` files, and `/tmp/english19-top-{width}-{theme}.png`; `/tmp/english19-diagnostics.txt` and `/tmp/english19-success-and-gcc-failure.txt`. Temporary interaction evidence includes exercised answers; this note supplies no challenge solution.
