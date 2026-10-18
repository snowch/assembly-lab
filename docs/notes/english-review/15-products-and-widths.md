<!-- Copyright © 2026 Christopher Snow -->

# English review: Products and their widths

Scope: Module 8, lesson 1 (`products-and-widths`), review only. No course text changed. Low severity means a local comprehension obstacle; neither finding blocks the main explanation or exercises.

## Findings

1. **Low: an instructional hint has no named referent.** `content/lessons/products-and-widths.prose.ts:27`: **“Its operands are destination, first factor, second factor and value to add.”** The preceding hint discusses a zero product and an existing total. None of the earlier hints names an instruction, and the task allows both separate multiplication/addition and a combined instruction. A learner seeking help must infer which instruction “Its” describes before the operand order becomes useful. The investigation does introduce the combined instruction, so this is a local referent problem rather than missing instruction teaching. Direction: identify the instruction whose operands the hint describes.

2. **Low: the small-case test label describes a property shared by every input.** `content/lessons/products-and-widths.labels.ts:86`: **“Multiply inputs that also fit in 32 bits”**. The task has already said the inputs are unsigned 32-bit values. Checked against all five `wideCases` in `products-and-widths.ts`: every input fits in 32 bits. The label therefore does not distinguish the final small-product case from the larger-product cases. It can confuse which width the test checks, precisely the distinction this lesson teaches. Direction: identify whether the distinguishing width belongs to the inputs or the product, and make the label describe that distinction. No test values or solutions need changing.

## Prerequisite verification

Read `CLAUDE.md`, `docs/style.md`, the front-page “Before you start” panel in `apps/course/src/strings.ts`, lesson order in `content/lessons/index.ts`, and earlier lesson prose through `zero-terminated-strings`. Used only the panel and earlier teaching when checking assumed knowledge.

Checked rather than flagged:

- GCC and `-O1`: `meet-the-machine.prose.ts:10,16–18` explains the compiler and optimisation setting.
- Operands: `meet-the-machine.prose.ts:51` defines the parts following the instruction name. Finding 1 concerns which instruction, not the term itself.
- Signed/unsigned readings, hexadecimal and bit significance: `one-pattern-three-readings.prose.ts:24–33`.
- `w`/`x` views and upper-bit clearing, and `long`: `constants-and-widths.prose.ts`, including `:72` for the type.
- Unsigned wrapping and signed overflow: earlier arithmetic lessons; the local compiler note explicitly explains undefined behaviour rather than assuming the phrase is already understood.
- AArch64 Linux and target-dependent sizes: `memory-and-addresses.prose.ts:11`; little-endian byte order: `:16`.
- Sign extension: `loading-widths.prose.ts:14`; casts and conversion syntax: `:47`.
- Product and high/low halves receive local explanations. Each new multiplication instruction has its operation described locally. The before/after conversion distinction is explained beside the widening examples.

No additional unexplained prerequisite assumption survived these checks.

## Coverage and browser evidence

Read all learner prose, objectives, section headings, captions, option labels, both challenge tasks, all five hints for each challenge, both prediction explanations, reflection answer, compiler detail and model-versus-reality note in `products-and-widths.prose.ts`, `.labels.ts` and `.ts`. Read the displayed functions in `products.listings.ts`, product diagram labels in `packages/views/src/strings.products.ts`, relevant stepper/prediction/editor/grader strings in `packages/views/src/strings.ts`, memory-stepper strings in `strings.memory.ts`, and runtime feedback/hint headings in `platform/lesson-runtime/src/strings.ts` and `apps/course/src/runtime-strings.ts`.

Used the already-built site at `http://localhost:4220/assembly-lab/#/lesson/products-and-widths` with Chromium at **1280 × 900** and **375 × 900**, each in **light and dark** themes. Opened every details panel, checked both predictions (a matching and a mismatching prediction), revealed all ten hints, ran both exercises' starting-code failures and successful tests, and stepped every stepper to its return. Read initial, failed and completed rendered text, including per-test failure cards. Inspected screenshots at both widths and themes; findings are the same in all configurations. No course edits, rebuild or full test suite.

Temporary evidence: `/tmp/english15.mjs`, `/tmp/english15-crops.mjs`; `/tmp/english15-initial-{width}-{theme}.txt`, `/tmp/english15-failed-{width}-{theme}.txt`, `/tmp/english15-{width}-{theme}.txt`; full-page screenshots `/tmp/english15-{width}-{theme}.png` and top-of-page viewport screenshots `/tmp/english15-top-{width}-{theme}.png`. These temporary interaction artifacts include exercised answers; this review records no challenge solutions.
