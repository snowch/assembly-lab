# English review: Masks and fields

Reviewed 18 October 2026. Review only; no course changes. Scope: Module 3, lesson 1, as a learner who has completed the five preceding lessons and knows only the front page's prerequisites. Applied both reading passes in `docs/style.md` and the reader rules in `CLAUDE.md`.

## Findings

### 1. Medium: references to C and a listing have no visible target at the prediction

Exact quotes: “In this C, `w` is the warning word.” (`content/lessons/masks.prose.ts:25`); “A prediction about the constant in the listing.” (`content/lessons/masks.labels.ts:69`).

The prediction section has prose and answer choices, but no C block or assembly listing. The first displayed C is in the investigation's function selector, further down the page. The inline expressions do convey the immediate operation, so this is not a claim that the prediction cannot be answered. The problem is the demonstrative “this” and definite “the listing”: they send a beginner looking for a code example that the section does not contain. The same gap appears at both browser widths and in both themes.

Correction direction: identify the inline expression and instruction directly, or provide the particular C/listing being referred to at this point. Keep the prediction unrevealed.

Prerequisite check: “listing” itself is explained in `meet-the-machine.prose.ts:11`; GCC and its setting are explained at lines 16–18. Re-explaining either term would not repair the missing referent.

### 2. Low: the stepper introduction calls every displayed intermediate value the word

Exact quote: “Step through your own instructions below: the figure shows the word after each one, and which bits it cleared, moved or combined.” (`content/lessons/masks.prose.ts:65`).

The task has distinguished the warning word in `w0` from the new gear in `w1` (`masks.prose.ts:54`). The stepper displays the register written by each instruction, including the new gear in `w1`, rather than the warning word after every instruction. A learner following the instruction to watch “the word” can mistake a gear intermediate for the current warning word, or wonder why the named word has disappeared. Browser verification: after the first instruction of a passing submission, the rows are `w1 before` and `w1 after`.

Correction direction: describe the displayed register/value and distinguish gear intermediates from the warning word. Preserve the existing instruction-by-instruction explanation.

Prerequisite check: Module 0 explains that an instruction writes its first operand; it does not make the two arguments interchangeable. This lesson's own task explicitly assigns them different meanings.

### 3. Low: the generalisation relies on application jargon instead of showing the application

Exact quote: “Status words, packed dates and colours keep several small numbers in one word in the same way.” (`content/lessons/masks.prose.ts:83`).

“Status words” and “packed dates” have not been explained in the prerequisites or earlier lessons. A learner can understand the warning word without knowing what a packed date contains, or that a colour can be represented by several component numbers. This sole sentence in “Fields in real code” names applications without providing enough detail to transfer the field idea to any of them.

Correction direction: explain one concrete representation in plain language, identifying the smaller numbers stored together; avoid requiring knowledge of all three application labels.

Prerequisite check: the front page promises small C functions, basic arithmetic and binary conversion (`apps/course/src/strings.ts:26–40`). The earlier lessons explain bits, readings, widths and arithmetic flags, not these representations. No later lesson was used to excuse this gap.

## Coverage and prerequisite evidence

Read all learner strings in `masks.prose.ts` and `masks.labels.ts`, the lesson wiring in `masks.ts`, and the displayed C/assembly in `logic-shifts-masks.listings.ts`. Read the figure components and relevant shared strings in `packages/views/src/strings.ts`, including warning labels, bit-operation rules and column controls, locked states, comparison labels, stepper status, input errors and challenge feedback. Covered all ten sections, objectives, captions, both predictions and their feedback, both closed notes, both challenges and all five hints for each, the post-run introduction, post-pass `bfi` explanation, ordinary and chained wrong-answer feedback, and the model-versus-reality note. Review notes deliberately omit challenge answers.

Read the front page's “Before you start” panel and the prose of all five preceding lessons: Meet the machine; One pattern, three readings; Constants and widths; Adding and the flags; Subtracting and the tick counter. Checked the following rather than reporting them as missing knowledge:

- Hexadecimal, signed and unsigned readings, top bit, set and clear: `one-pattern-three-readings.prose.ts:23–31`.
- The `w`/`x` names and upper-bit clearing: `constants-and-widths.prose.ts`, failure experiment and reflection.
- `lsl 16` in `movk`, optional `#`, and the `u` suffix: that lesson's construction and generalisation.
- GCC, listing, operands, result register and return: Module 0.
- Carry between columns: Adding and the flags, investigation; inversion of bits during subtraction: Subtracting and the tick counter, investigation.

The lesson supplies its mask/field definitions and the new C bit operators. No extra complaint was raised merely because the instruction mnemonics are new. The application vocabulary in finding 3 is the remaining assumed knowledge identified by this review.

## Browser evidence

Used the existing build at `http://localhost:4220/assembly-lab/#/lesson/masks`, with installed Playwright Chromium. No rebuild or full test suite. Own scripts: `/tmp/review-masks.mjs` and `/tmp/review-masks-extra.mjs`.

At 1280 × 900 and 375 × 900, each in light and dark themes: loaded the lesson; committed predictions; opened closed notes; revealed all five hints for both challenges; submitted failing work and then a passing assembly submission; opened the learner stepper and GCC comparison; stepped the submission; read the failure experiment and result comparison. Inspected screenshots across all four width/theme combinations and rendered text captures. Also selected each of the four investigation functions and checked invalid-input feedback. Read all specialised feedback in source, including the chained-result case.

Evidence retained locally: `/tmp/masks-{1280,375}-{light,dark}.txt` and `.png`; sectional screenshots `/tmp/masks-{word,bits,bfi}-{1280,375}-{light,dark}.png`; `/tmp/masks-first-step.png`; additional feedback/function captures under `/tmp/masks-*.txt`. Evidence contains exercise solutions and is not copied into this review. Wording findings persisted across responsive layouts and themes; no theme-specific English finding was identified.
