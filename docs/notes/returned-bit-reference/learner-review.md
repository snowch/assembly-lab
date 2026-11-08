# Independent learner and UX review

Reviewed 8 November 2026 by a separate GPT-6.1 agent at high effort. The reviewer did not write or edit the lesson, and inspected the actual `main...HEAD` diff and lesson before receiving an account of why the change works. Build footer: `a7bff2d`.

## Scope and preparation

Read `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the local learning-design skill, and the relevant visual-language rules. Read the front page's “Before you start” requirements and Module 0's register, operand, compiled-function and subtraction preparation in source. Read the three earlier Module 1 lessons in source: Reading hexadecimal; Signed and unsigned readings (including its current `READING_SEQUENCE` content); Arithmetic with four bits. No author rationale or change brief was used to form the initial judgement.

Inspected the built Arithmetic on register bits lesson at `http://localhost:4518/assembly-lab/#/lesson/arithmetic-on-register-bits`, at 1280 × 900 and 375 × 900, with the actual Light and Dark selections. The browser's system colour preference was deliberately opposite the selected theme. Computed body background and foreground colours confirmed that the requested theme actually rendered.

The outcome is to choose C return types and checks that fit the meaning of the trip result. The new strip supports the narrower action of locating the highest bit and relating that stored bit to the two contribution calculations. General signed-overflow rules and later instructions remain deferred.

## Finding

**L1, low: the introductory description still promises one display of the bits.**

Location: “Run and compare”, before the Run comparison button. Quote: “Their matching returned bits appear once, with a separate C reading for each return type.” After execution the original strip remains under “Subtraction in bits”, while the new strip says “The same returned w0 bits, shown again.” Both are present in every reviewed width and theme.

Effect: the instruction no longer describes the resulting page. A reader can recover from the new caption, so this is a local wording inconsistency rather than a mechanism or prediction-gate fault.

Evidence: `content/lessons/pacing-1-4.copy.ts`, `COPY.arithmeticBits.callIntro`; `/workspace/scratch/returned-reference-initial.png`; the arithmetic and explanation captures listed below. Correction direction: describe one shared result and its repeated reference without promising a single display. Keep the canonical prose record synchronised. Status: accepted and corrected. A separate drafting agent removed the stale display-count promise. Independent source verification found the replacement, “Their matching returned bits appear with a separate C reading for each return type.”, in both `pacing-1-4.copy.ts` and `docs/notes/course-pacing-implementation/copy.md`, and found no remaining “appear once” in those files. Browser verification of the final rebuilt copy belongs to the final checker; this review's screenshots show the reviewed `a7bff2d` layout.

## Learning sequence and assumptions

The preparation defines a set bit's contribution and then demonstrates and practises signed and unsigned readings on four-bit patterns. It explicitly bridges to bit 31 in a 32-bit register and asks for a fresh register reading. Arithmetic with four bits demonstrates the same subtraction used here and includes a fresh subtraction exercise. Module 0 has already defined `sub`, argument registers and the returned `w0` value. Reading hexadecimal provides the compact representation reused by both strips.

Consequently, the new reference does not compose unpractised arithmetic and representation mechanisms. A further miniature would repeat preparation rather than supply a missing bridge. Its one marked highest bit and the unchanged lower bits map directly to the table's two contribution rows. The table compares the readings, while the vertical sums show how the contributions combine. The strip has a distinct job: the reader can see the source pattern while reading those calculations, especially after scrolling on a phone.

No unsupported prerequisite was found in the added caption or labels. “Highest bit”, bit numbering, signed/unsigned weights, `w0` and hexadecimal were taught earlier. The new dotted outline has a matching dotted symbol beside “Bit 31 (highest bit)”; identifying the mark does not require knowing a later lesson's selection interaction. The strip uses non-interactive spans, has no pointer cursor, button, input or tab stop, and its caption identifies it as an already returned result. It does not imply another execution or an editable state.

The page's closing question asks for a different return policy rather than another reading of the worked result. This review did not open or reproduce its answer. It is a fresh application opportunity, not evidence that a novice can successfully transfer the rule.

## Browser evidence

For all four width/theme combinations, followed the visible route: select the identical-instructions radio, Check your prediction, then Run comparison. Before checking, Run comparison was disabled and neither result explanation nor new strip existed. After checking, the result explanation remained absent until Run comparison. After running, exactly one new reference appeared.

The repeated strip contains the same 32 bit digits and hexadecimal value as the existing returned-result strip, in the same order. Only bit 31 has the dotted outline. Its explanation identifies the currently set highest bit, the legend names bit 31 and bits 30–0, and the table and sums use matching contributions and totals. This was checked against the browser DOM and the two rendered strips; the simulator's technical semantics are the separate technical review's remit.

At 375 px the reference occupies x = 16–359 and its bit row x = 28–347. All 32 digits and both labels fit. The table and both stacked sums remain legible. Page scroll width equals viewport width at both 375 and 1280 px; no descendant of the new reference overflows its own width. The dotted frame and legend remain visible in actual light and dark themes without relying on fill colour alone.

Reload after execution restored the reference. Reset comparison removed it and all result explanation, while preserving the already checked prediction. Running again returned a single reference. No stale result or duplicate reference appeared.

Keyboard checks used Space on the radio, Tab to Check your prediction and Enter to submit. Enter also activated Run comparison. The reference adds no focusable element. Existing action-button replacement returns native focus to the body after submission/run; focus retention was not changed by this patch. The rendered accessibility snapshot exposes the reference caption, a register group named with its hexadecimal value, both bit-group labels and the highest-bit state sentence. The visual digits are hidden from assistive technology by the shared BitRow primitive. No real screen-reader, zoom, forced-colours or touch-device study was performed.

Screenshots are outside the repository:

- `/workspace/scratch/returned-reference-375-light-explanation.png`
- `/workspace/scratch/returned-reference-375-dark-explanation.png`
- `/workspace/scratch/returned-reference-1280-light-explanation.png`
- `/workspace/scratch/returned-reference-1280-dark-explanation.png`
- Matching `returned-reference-{375,1280}-{light,dark}-arithmetic.png` and `-viewport.png` captures compare the original result strip and new reference in context.

Measured states: `/workspace/scratch/returned-reference-review.json`. Browser scripts: `/workspace/scratch/returned-reference-review.cjs` and `/workspace/scratch/returned-reference-keyboard.cjs`. The first keyboard script attempt timed out while trying to read a removed focused button; the corrected diagnostic checks `document.activeElement` and completed the activation and rerun checks. The first layout-script attempt used an overly exact theme label locator and timed out; the rerun selected the actual visible theme control. These tooling failures are not lesson failures.

No source edits, source test suite, build or commit were performed by this reviewer. The four-state browser run passed its focused interaction/layout observations. Agent review is not a novice study and does not establish learner effectiveness.

## Decision

Keep the reference strip, its local caption and the highest-bit key. L1's display-count wording has been corrected and independently verified in source. No blocking learner or layout fault was found in the added reference. Novice transfer and full assistive-technology behaviour remain untested.
