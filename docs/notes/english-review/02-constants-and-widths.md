# English review: Constants and widths

Reviewed 18 October 2026. Scope: Module 1, lesson 2 only, as a learner who has completed Module 0 and Module 1 lesson 1, with no knowledge of later lessons. Review only; no course content changed.

## Finding

### E02-1 — Low: the first build hint omits the distinction between bits and set bits

Source: `content/lessons/constants-and-widths.prose.ts:53`, first hint for **Build 1000000**.

> One `mov` holds a number whose bits fall in one 16-bit half. `movk` writes the other half without touching the first.

**Effect:** “whose bits” can mean all the bits of the number, including zeros. The learner has just seen a full 32-bit register split into two halves, so the wording can suggest that a suitable number occupies only half the register. The actual test taught in the motivation concerns the positions of the **set** bits. The earlier precise wording makes this recoverable, but the hint is the text a learner consults when already unsure.

**Correction direction:** Preserve the explicit distinction between set bits and all bits when restating the sufficient rule. Keep the preceding warning that this is a sufficient rule, not the complete set of accepted patterns. No challenge answer needs to change or be added.

No medium or high severity English findings. No additional findings based only on sentence length, preferred phrasing or a target count.

## Prerequisite check

Read `CLAUDE.md` and `docs/style.md`, including both closing passes. Read the front-page prerequisite panel in `apps/course/src/strings.ts:24–39`. It assumes small C functions using `int`, `unsigned`, arguments and `return`, and conversion between binary and decimal. Assembly experience and hexadecimal are not assumed.

Read the complete prose of the two preceding lessons, `meet-the-machine.prose.ts` and `one-pattern-three-readings.prose.ts`, and checked their role against the displayed lesson:

- Module 0 defines GCC as a C compiler, instruction, assembly language, listing, register, operand, memory, simulator/model and program counter. Its compiler note explains `-O1` and `-O0`. Its running/return explanations establish `w0` as the function result and explain `ret`.
- Module 1 lesson 1 defines hexadecimal and `0x`, four bits per digit, signed and unsigned readings, top bit, set and clear. Its construction explains the all-set pattern's two readings. Its model note already says registers hold 64 bits and the figures show the lower 32 used by `w` names.
- This lesson itself explains the `void` parameter syntax, constant, instruction width, upper/lower 16-bit halves, assembling/assembler/GNU assembler, the limited sufficient rule for one `mov`, `movk` and `lsl 16`, remainder with a worked decomposition, optional `#`, the two register names, clearing on a `w` write, `long` and the `u` suffix.

No additional missing prerequisite definition found. In particular, “set bits”, hexadecimal, GCC and `-O1` were verified in earlier teaching rather than treated as assumed external knowledge. Expansion of the mnemonic `lsl` is unnecessary for this lesson's specific syntax because its effect here is explicitly explained.

## Full text coverage

Read `constants-and-widths.prose.ts` in full, `constants-and-widths.labels.ts` in full and the learner-facing configuration in `constants-and-widths.ts`, including objectives, all ten section headings and prose, listing/figure captions, both predictions and every option, prediction result explanations, all three closed notes, both tasks and field labels, all five hints for each task, the post-success construction note, reflection and answer, and the model-versus-reality note.

Also read the applicable shared figure and feedback strings in `packages/views/src/strings.ts`, `strings.module1.ts`, `platform/lesson-runtime/src/strings.ts`, and assembler messages in `packages/machine/src/strings.ts`; traced the two graders in `grader.ts` and `readingGraders.ts`. Covered normal prediction match/mismatch, assembler refusal, blocked/empty answers, incorrect numerical answers, completed work, test counts, stepper start/end, register-half tags, and the shared “How the simulator steps” text. Arbitrary unrelated instruction diagnostics are outside this lesson's text coverage.

## Browser evidence

Used local Playwright against the existing build at `http://localhost:4220/assembly-lab/#/lesson/constants-and-widths`, with fresh contexts at 1280 × 900 and 375 × 900, in both light and dark themes. Did not rebuild or run the full test suite.

For all four combinations: loaded all ten sections; opened closed notes; committed both predictions (including an incorrect width prediction); opened all five hints in both challenges; ran the unassemblable starting program; exercised empty-answer blocking and incorrect whole-number answers; completed both challenges; exposed the saved-solution figure; and stepped the available register figures through their final instruction. Read extracted rendered text and inspected screenshots, including the 16-bit-half figure at each width/theme. No page-level horizontal overflow in any combination. At phone width, the two halves stack vertically with their upper/lower labels intact; the prose still explains the conceptual left/right bit order.

Local evidence files (temporary, not committed):

- `/tmp/english02.mjs` and `/tmp/english02-interact.mjs`: browser scripts.
- `/tmp/english02-{1280,375}-{light,dark}.txt` and corresponding `.png`: initial page, closed notes opened.
- `/tmp/english02-{1280,375}-{light,dark}-wrong.txt`: wrong-answer feedback with all hints revealed.
- `/tmp/english02-{1280,375}-{light,dark}-revealed.txt` and corresponding `.png`: completed/revealed page.
- `/tmp/english02-{1280,375}-{light,dark}-figure.png`: inspected stepped construction figure.

These files contain ordinary lesson interactions, including revealed solution text; this review deliberately does not reproduce challenge answers.
