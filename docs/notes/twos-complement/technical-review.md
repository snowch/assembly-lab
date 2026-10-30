# Two’s complement: independent technical review

Date: 30 October 2026. Reviewer: separate GPT-6.1-sol agent, Extra High (`xhigh`) effort, as recommended by `docs/authoring.md`. This reviewer did not write or edit the product change. The assessment began with the actual diff, repository rules, sources and executable model; the author’s two’s-complement brief and drafting rationale were not read.

## Verdict

Technically sound after correcting the canonical JSON record. The signed-reading definition, the fixed-width negation rule, the model-derived illustration and the exercise gates agree. The final built success note was independently rechecked in all four viewport/theme combinations, including its rendered `0xffffffff` code and success gate. No unresolved technical finding remains.

## Sources and technical checks

- [C23 draft N3096](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf), 6.2.6.2 paragraph 2: ordinary value bits keep the corresponding unsigned weights; the sign bit, when set, contributes −2^(N−1). Paragraph 6 calls this representation two’s complement and distinguishes older revisions. The supplied primary-source extraction `/tmp/twos-n3096.txt` was read at those clauses. This supports the definition directly. The course’s 32-bit `w0` example is target-specific; the text does not claim every C `int` has that width.
- `packages/views/src/readings.ts`: `stateHolding` runs the assembler/simulator; `readingsOf` reads that state; `topBitTable` separately runs the top-bit-only, remaining-bits-only and whole patterns. `worths` assigns the signed top bit its negative weight. The illustrated parts and totals are computed from the same model, not inserted into a drawing.
- `packages/machine/src/forms.ts`: `neg`/`negs` use subtraction with a zero first operand; `packages/machine/src/run.ts` inverts the second operand at the instruction width, adds the carry-in of one, masks the result and derives flags from that addition. For any 32-bit pattern x, inversion is 2^32−1−x; adding one and retaining 32 bits gives −x modulo 2^32. The new prose explicitly limits its claim to result bits, so zero and the smallest signed input are included without promising a representable positive signed result.
- The added facts test uses 37 distinct inputs, including zero, both signed limits, all ones, the lesson’s positive/negative example and every one-bit pattern. Both recorded `neg` and `negs` programs run for every input against independently calculated `BigInt` inversion-plus-one expectations. Existing facts tests separately check flags and the top-bit decomposition. The new test makes a meaningful arithmetic claim; it does not merely compare duplicated lesson text.
- Recorded GCC 16.1 `-O1` negation is in `content/lessons/module-2.listings.ts` and `docs/notes/module-2/listings.md`. Differential corpus files `scripts/real-tools/corpus/module2-gcc.{s,json}` and `module2-subs.{s,json}` contain the displayed `neg`/`negs` programs and zero/signed-minimum cases. This review inspected that coverage; it did not run GNU/QEMU and makes no new differential-pass claim.

## Term home, records and test preservation

`two’s complement` is introduced in the actual published split lesson `same-bits-two-readings`, after the signed top-bit weights and before the Module 2 use. The unsplit source lesson’s metadata is updated too. The same definition is present in the source prose, the paced copy and their canonical records. The success-only worked explanation is kept in Module 1’s canonical prose record; Module 2’s canonical record contains the identical inversion paragraph.

The existing browser solution assertion was updated for the new rendered text. Its wrong-answer check, absence before success, removal after invalidating work and Clear work, and restoration when work passes remain intact. Normalising source Markdown backticks before comparing rendered text is appropriate; a separate DOM assertion now requires `0xffffffff` to render as code. No tolerance or meaningful gate assertion was removed.

## Findings and sceptic decisions

Accepted and corrected: the paced canonical JSON string contained a literal paragraph break after “other bits.” This made the record invalid JSON and blocked its existing prose parity check. The smallest correction was to encode that break as `\n\n`, matching the TypeScript copy. Independent parsing first reported an invalid control character, and the original focused Vitest command exited 1 with the same error. After the correction, the record parsed and the same one-test command exited 0. This changed the record’s encoding, not learner-visible text.

Rejected concerns:

- “The top bit is a separate minus sign.” N3096’s negative positional weight and the live top-bit/remaining-bits sums contradict that reading; the new definition makes the distinction explicit.
- “Invert and add one fails at zero or the signed minimum.” That concern would apply to an unqualified mathematical signed result. The page instead states the 32-bit result-bit rule and says to retain only the low 32 bits; the model edge tests check those cases.
- “The new worked answer bypasses the exercise.” In the built page it stays absent before testing and after a failing submission, appears only after success and disappears when work ceases to pass or is cleared. The general signed-weight definition teaches the method without exposing that exercise’s bit pattern.
- “The inversion sentence reveals the negation prediction result.” It gives the general rule. The concrete outcome and model feedback remain hidden until commitment, and the following stepper remains locked. Selecting an option alone does not reveal them.

No unresolved technical finding remains in the reviewed change.

## Verification record

Actual browser: Chromium served from this reviewer’s own Vite preview on port 4462, without rebuilding or changing product/test files. Independent browser script and screenshots are under `/tmp/twos-technical-browser/`; the script is `/tmp/twos-technical-browser.mjs`.

For both affected lessons, the script exercised 375×812 and 1280×800 viewports in explicit light and dark themes. It checked the rendered `data-theme` plus computed colours: light background `rgb(243, 246, 245)`, dark background `rgb(16, 22, 21)`. At all four combinations both pages’ scroll width equalled the viewport width, and no console or page error was recorded.

The browser inspected the initial top-bit diagram and changed it through zero, top-bit-only, top-bit-plus-one, largest positive and all-ones states; it opened Show calculation. It exercised the Make −1 note through initial, failing, passing, restored, edited and cleared states. It checked the negation prediction before selection, after selection and after commitment, then executed the instruction and matched the register/flags to the model. Screenshots were visually inspected for the reading diagram in all four combinations and for initial/stepped negation states covering both widths and themes. These are actual browser checks, not inferred from source.

Source/executable checks run by this reviewer:

- Five focused Vitest files passed: 140 tests, no skips (`/tmp/twos-technical-focused.log`): readings model, Module 1 facts, Module 2 facts, and both canonical module prose checks.
- Paced canonical parity: initial command failed, 1 test, exit 1 (`/tmp/twos-technical-canonical-initial.log`); corrected focused rerun passed, 1 test, exit 0 (`/tmp/twos-technical-canonical-final.log`). The successful rerun does not alter the original failure’s result.
- Term-home/schema/challenge lesson test passed: 14 tests, no skips (`/tmp/twos-technical-term-home.log`).
- The existing changed browser test was run unchanged against the final build, with a temporary external configuration pointing at port 4462 and output under `/tmp`: desktop and phone both passed, 2 tests, no skips (`/tmp/twos-technical-exact-browser.log`).
- Final built success-note audit passed in all four combinations, including initial/failing/passing/restored/edited/cleared states and the explicit code element (`/tmp/twos-technical-final-note.log`, `/tmp/twos-technical-browser/final-note-results.json`). The final success-note screenshots were visually inspected in all four combinations. The final asset was `index-DjEszgly.js` (SHA-256 `609c250bdb6d11e19c518bf9c3b4930d8f9dec4903304c050fbd349ce24580b6`).
- `git diff --check` passed.

Ad hoc browser-harness setup failures concerned accessible button names and matching an entire figure’s caption instead of its note; these were corrected before the completed checks reported above. They did not require product edits. The initial final-note harness failure is retained at `/tmp/twos-technical-final-note-initial-harness.log`.

The full repository suite, a fresh GNU/QEMU run and native hardware were not run by this reviewer. The managing session records its own broader checks separately. This note does not certify unrelated lessons or the entire course.
