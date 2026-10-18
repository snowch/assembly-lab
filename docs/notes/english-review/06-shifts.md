# English review: Shifts, and the type that picks one

Reviewed 18 October 2026. Review only; no course content changed. Read against `CLAUDE.md` and both passes in `docs/style.md`. Severity: medium means a meaningful obstacle to understanding; low means a local ambiguity that is unlikely to block the lesson.

## Finding

### 1. The first C note assumes the meaning of two different kinds of language rule

- **Severity:** medium.
- **Location:** `content/lessons/shifts.prose.ts:19`, “What C says”.
- **Exact quote:** “For a negative `int`, the C standard leaves the result of `>>` to the implementation. GCC defines it as an arithmetic shift. For a signed `int`, C leaves some left shifts undefined, a negative value among them. GCC defines them, but this lesson's examples stay within what C defines.”
- **Effect:** “the implementation” has no established referent for this learner. More importantly, the note relies on the distinction between a result that the compiler must specify and an operation for which the C standard makes no guarantee. Neither distinction has been taught. The repeated “defines” makes both cases sound alike, and “a negative value among them” grammatically places a value among shifts. A reader cannot reliably tell whether the warning is about choosing a compiler, choosing a negative input, or an instruction that does not work.
- **Correction direction:** Identify what “implementation” means here, briefly distinguish the two C rules in ordinary language, and make the negative-input condition attach explicitly to the left-shift operation. Preserve the distinction between C's guarantees and GCC's choices; no wider C standards discussion is needed.
- **Prior-definition check:** The front-page “Before you start” assumes small C functions, `int`/`unsigned`, conditionals, loops, arrays and binary arithmetic. It does not assume knowledge of the C standard's categories of behaviour. Read the six preceding lessons' prose and notes and searched their prose/labels for “implementation”, “undefined” and “standard”; no earlier learner-facing definition supplies this distinction. Module 0 explains GCC and its optimisation setting, which does not explain these terms.

## Prerequisite audit

Read the front-page prerequisite panel in `apps/course/src/strings.ts`, and the preceding lessons in course order: Meet the machine; One pattern, three readings; Constants and widths; Adding and the flags; Subtracting and the tick counter; Masks and fields. No later lesson was treated as prior knowledge.

The following potentially unfamiliar expressions already have adequate prior teaching, so they are not findings:

- GCC, listing, instruction, register, operands, `ret`, simulator and `-O1`: Module 0, particularly its question, investigation and compiler note.
- Hexadecimal, signed/unsigned readings and top bit: One pattern, three readings, investigation.
- Upper/lower halves, `movk`, `lsl 16`, constants, `#`, and the shared `w`/`x` register: Constants and widths, motivation, construction and failure experiment.
- Word, bit numbering, `<<`, `>>`, and standalone `lsl` with zero filling and lost bits: Masks and fields, question, prediction and investigation.
- QEMU: Adding and the flags, model-versus-reality note.

The shifts lesson supplies the new logical/arithmetic shift rules, repeated halving and rounding, C integer division's rounding, and the read-only formation of a shifted operand. The explanation of the adjustment before division includes both odd and even negative inputs. These mechanisms did not require an additional missing-step finding.

## Source coverage

Read all learner text in `shifts.prose.ts`, `shifts.labels.ts` and its assembly in `shifts.ts`, including objectives, headings, both closed notes, both predictions and all their choices/explanations, both challenge tasks, every field/test/group label, all five hints for each challenge, all operation-specific failure feedback, reflection and model-versus-reality note. Checked the visible compiler listings in `logic-shifts-masks.listings.ts` through the built page.

Also read the applicable shared text in `packages/views/src/strings.ts`, `platform/lesson-runtime/src/strings.ts`, and `apps/course/src/runtime-strings.ts`: shift controls/errors/legend/result, prediction outcome text, stepper controls/status/operand facts, challenge validation/verdicts, hint headings, simulator model note and theme/navigation labels. No exercise answers are reproduced in this review.

## Browser evidence

Used the already-built `http://localhost:4220/assembly-lab/#/lesson/shifts` in local headless Chromium through Playwright, at 1280 × 900 and 375 × 900, each in light and dark themes. No rebuild or full test suite was run.

At each of the four combinations, opened the notes, checked both predictions, unlocked both dependent figures, submitted deliberately incorrect answers in both challenges to expose every failure feedback category, and opened all five hints in both ladders. Read the resulting full-page text and inspected screenshots. Also stepped the division figure to expose the before/operand/after facts at phone width. All four document widths equalled their viewport widths. The English finding appears identically in all four presentations; no additional wording ambiguity arose from wrapping or theme.

Temporary evidence files (outside the repository): `/tmp/shifts-1280-light.png`, `/tmp/shifts-1280-dark.png`, `/tmp/shifts-375-light.png`, `/tmp/shifts-375-dark.png`, matching `.txt` page captures, and `/tmp/shifts-step.png`. Browser scripts: `/tmp/review-shifts.cjs` and `/tmp/shifts-detail.cjs`.
