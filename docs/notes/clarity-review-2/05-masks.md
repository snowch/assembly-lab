# Second clarity review: Masks and fields

Reviewed 18 October 2026. Independent reader; review only. Read the whole lesson before consulting the first English review. Assumed only the front-page prerequisites and the five earlier lessons. The existing three retained findings remain applicable; one further occurrence of the already retained hint-heading pattern is identified below. No wholly new category of problem found.

## Findings

### C05-1 — Low: the prediction points to a listing that is not displayed there

Quotes: “In this C, `w` is the warning word.” ([prose](../../../content/lessons/masks.prose.ts), line 25); “A prediction about the constant in the listing.” ([labels](../../../content/lessons/masks.labels.ts), line 69).

The section provides inline C expressions and an assembly instruction, but no separate listing. A reader can answer the prediction from the supplied text, yet “the listing” sends them looking for a missing figure. This is a referent problem, not missing knowledge of the term: Module 0 defines a listing at `meet-the-machine.prose.ts:11`.

Direction: identify the inline expression/instruction directly. A new listing is unnecessary. Duplicates retained **L5**, still open.

### C05-2 — Low: the post-run introduction misnames the value being displayed

Quote: “Step through your own instructions below: the figure shows the word after each one, and which bits it cleared, moved or combined.” (`content/lessons/masks.prose.ts:65`).

The task assigns the warning word and new gear to different registers. The figure shows the register written by the current instruction, including intermediate gear values. In the browser, the first instruction of a passing submission displayed “w1 before” and “w1 after”. Calling every display “the word” can make a learner mistake that intermediate for the warning word.

Direction: describe the displayed register/value and distinguish intermediate gear values from the warning word. Duplicates retained **L6**, still open.

### C05-3 — Low: the application sentence assumes three representations

Quote: “Status words, packed dates and colours keep several small numbers in one word in the same way.” (`content/lessons/masks.prose.ts:83`).

The prerequisite panel and earlier lessons do not explain packed dates, status words or colour components. A learner understands the warning-word example but has to supply the component numbers for every application named in this sole generalisation sentence.

Direction: explain one representation by naming its component values. Duplicates retained **L7**, still open.

### C05-4 — Low: correct requirements appear under “Common mistake”

Quote under that heading: “Bits outside 4 to 6 must stay unchanged. Bits 4 to 6 must hold the low 3 bits of `g`.” (`content/lessons/masks.prose.ts:58`). The second challenge similarly puts “Each result starts from `0x2a`, not from the one before.” under that heading (line 94).

These are correct requirements, rather than descriptions of a mistake. The literal heading asks the reader to interpret the following text as something to avoid. The task itself resolves the intended meaning, so this instance is low severity, but the heading makes the help less direct.

Direction: make the hint identify the mistake it addresses, preserving the shared platform. This is an additional occurrence of retained **M6**, not a new independent problem category.

## Coverage and prerequisites

Read `masks.prose.ts`, `masks.labels.ts`, lesson wiring in `masks.ts`, and relevant shared figure strings in `packages/views/src/strings.ts`. Covered all ten sections, objectives, captions, both prediction explanations, both challenges and all ten hints, ordinary and chained-answer feedback in source, both closed notes, the post-run and post-pass text, and the model-versus-reality note.

Earlier-course checks: Module 0 defines GCC, listings, operands and the result register; `one-pattern-three-readings.prose.ts:27–31` establishes bit positions, signed/unsigned readings and set/clear; `constants-and-widths.prose.ts:42–43,61–66` establishes the previous `lsl` use and the two register widths. Carry across columns is the preceding arithmetic material. This lesson explains the new bit operators, mask and field locally. Its unestablished assumed knowledge is the application vocabulary in C05-3. No later chapter was used to excuse a gap.

After forming these findings, compared [the earlier lesson review](../english-review/05-masks.md) and [ranked master review](../english-review/README.md). L5–L7 survive with their accepted low severity. C05-4 extends M6's coverage. None revives one of the earlier rejected suggestions.

## Browser evidence and exact interactions

Used Playwright Chromium against the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/masks`, at **1280 × 900 and 375 × 900**, each in light and dark themes. Background colours confirmed both themes; document width matched viewport width in all four cases.

In each configuration: loaded the lesson, opened details, committed an incorrect answer to both predictions, ran the initial assembly submission, ran blank then zero-valued answers for the second challenge, revealed all five hints on each challenge, then submitted a passing assembly program and stepped its first instruction. Read the revealed compiler comparison and inspected the first-step screenshot in each configuration. Full initial and revealed rendered-text captures cover the surrounding prose. No claim is made that every input or every function selector was exercised; specialised feedback not triggered was reviewed in source.

Local evidence:

- Scripts: `/tmp/clarity2-05.cjs`, `/tmp/clarity2-05-extra.cjs`.
- Rendered text: `/tmp/clarity2-05-{1280,375}-{light,dark}-{initial,revealed,passed}.txt`.
- Screenshots: `/tmp/clarity2-05-{1280,375}-{light,dark}-{initial,challenge,step}.png`.

Evidence captures include exercise answers; this report intentionally does not reproduce them. No code, build output or lesson prose was changed.
