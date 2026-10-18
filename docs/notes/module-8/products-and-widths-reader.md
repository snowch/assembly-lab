# Products and their widths: independent reader and technical review

Reviewed 18 October 2026 by a separate agent using the session's inherited model and effort. The reviewer did not draft or edit the lesson. The review assumed only the front-page prerequisites and Modules 0–7. No production files were changed.

## Scope and evidence

Read the actual built lesson at `http://localhost:4200/assembly-lab/#/lesson/products-and-widths`, its prose, labels, lesson structure, compiler records and figure helpers. Reviewed against `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and the named sources before reading an author's review account.

Browser inspection used Chromium at 1280×800 and 375×812, each in light and dark themes. Full-page and figure screenshots, interaction scripts and observations are retained in `/tmp/reader-products`. The product-halves diagrams and signed-width stepper were inspected visually. No horizontal page overflow, undersized visible controls or browser exceptions appeared in those four configurations.

Both predictions initially lock the eight dependent figures. Checking a prediction releases the corresponding figures, including when the prediction is wrong; feedback explains the result. No unconditional later text prints a prediction's numeric answer. All seven steppers were advanced to completion and reset. The instruction, register-width and product-half displays agree with the executable examples.

Both written exercises reject their initial work, accept valid work and retain completion on reload. Both text/tap round trips preserve the program. Both five-hint ladders were opened and read. The wide-product instruction was also constructed using the phone's operand chips and graded successfully. These checks do not publish the exercises' answers.

Independent checks run:

- `npx vitest run content/lessons/products.facts.test.ts content/lessons/module-8.test.tsx packages/views/src/products.test.ts`: 82 tests passed.
- A temporary copy of the Module 8 corpus, checked with GNU tools and QEMU using `/tmp/course-tools`: 14 programs, 57 calls and 232 instruction states, with zero differences. The temporary corpus also includes the companion division lesson; the review judgement here concerns only products.
- The facts tests compare the displayed GCC source, instructions and source-line mapping against the raw compiler responses. The multiplication records use GCC 16.1 at `-O1`; course-authored examples are identified separately.
- C23 draft N3096, sections 6.2.5 paragraph 11, 6.5 paragraph 5 and 6.5.5 paragraphs 4–5, checked in `/tmp/course-n3096.txt`: unsigned reduction, signed arithmetic overflow and operand conversion before multiplication. QEMU evidence checks the instruction widths, signed and unsigned high halves, low-half agreement and unchanged condition flags.

## Finding

**P2 — define “undefined behaviour” when the warning first uses it.**

Built-page quote, in “The compiler and integer widths”:

> A signed multiplication whose result cannot be represented has undefined behaviour. The hardware's low-bit result does not make that C operation defined.

The warning is correct, but the learner has not yet been told what the technical phrase means. Module 3 says C leaves some shifts “undefined”; it does not explain the consequences of that classification. Module 11 supplies the definition later. A reader could mistake the warning for an unspecified numeric result or a guaranteed run-time error.

Direction: explain the absence of a C-language guarantee beside the term here. A full discussion of optimisation is unnecessary for this lesson.

The managing agent independently accepted this issue during review and added a plain-language definition to the source and canonical prose. That edit was not part of the stable build reviewed here. Its final browser verification remains the checker stage.

No further blocking correctness, exercise, gating or layout finding was identified.

## Assumed-knowledge audit

The following apparent prerequisites have earlier explanations, so they are not findings:

- GCC and `-O1`: Module 0 identifies GCC as a C compiler and explains the setting under “Which compiler?”.
- Operand order: Module 0 defines operands and identifies the first as the destination. This lesson spells out the multiply-add and multiply-subtract roles before use.
- Signed and unsigned bit readings, hexadecimal and an all-ones negative value: Module 1 explains these readings and their ranges.
- `w`/`x` widths and clearing the upper bits on a `w` write: earlier register-width and memory lessons teach this, and the motivation repeats the relevant rule.
- Condition flags: Module 2 introduces them. This lesson states which multiplication instructions leave them unchanged.
- AArch64 Linux, little-endian order and the target's `long` width: Module 6 states these target choices. The opening note here repeats the relevant integer widths.
- Casts and sign extension: “Loading different widths” defines a cast as a conversion request, defines sign extension, and shows conversion to `long`.
- Product and product halves: defined on this page before the diagram or exercise depends on them.

The only untaught term found doing essential explanatory work was “undefined behaviour”, recorded above.

## Clarity assessment

The main explanation is plain and concrete. It connects discarded bits to a register write, then motivates wider multiplication before introducing high-half instructions. The distinction between converting an operand and widening an already truncated result is explicit. The paired diagram makes the shared low half and different high halves visible. Neither the prose nor the figures suggest that a wider destination automatically changes the multiplication's input interpretation.

The learner has enough information to attempt both exercises without outside reference. No additional rewrite is recommended beyond resolving and checking the terminology finding.
