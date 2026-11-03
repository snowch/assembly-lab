# Reading the bits: implementation technical review

3 November 2026. Independent review of the production integration, not a novice study.
The reviewer did not write or change the application implementation, lesson copy, or tests.
The review configuration was inherited from the managing session; no model override was
requested by this reviewer. This note records direct checks separately from reported results.

## Decision

The representation model, four-to-32-bit bridge, grading boundary and answer gates are
technically sound in the inspected implementation. The fresh tasks retain independent
starting patterns and response state. Written explanations are explicitly self-reviewed;
the page does not claim to have graded their meaning. No open technical blocker remains
in the inspected source or final rebuilt page. Final rebuild verification is recorded below.

The earlier planning reviews remain planning evidence. Neither these browser checks nor
the automated tests establish that a beginner can transfer the rule independently.

## Scope and sources

Read `CLAUDE.md`, `AGENTS.md`, `docs/authoring.md`, `docs/style.md`, the local
learning-design skill, this directory's brief and earlier planning reviews. Also read
`ReadingSequence.tsx`, `reading-sequence.ts`, `strings.reading-sequence.ts`, its CSS,
`readings.ts`, `complement.ts`, the lesson's pacing selection and helper, the retained
construction challenge and its prose, Appendix B's relevant prose, persistence and
challenge-gate helpers, the changed model/component/content/browser tests, and the
canonical implementation prose record.

The uncommitted skill and authoring-guide addition were included in scope. Their relative
links resolve. They require outcomes, prerequisites, fresh application and explicit limits
on evidence; they add no approval gate and do not claim that agent reviews validate learning.
The planning brief correctly treats the smaller example and transfer advantage as hypotheses.
No contradiction requiring another implementation change was found in those documents.

The primary [C23 draft N3096](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf)
was downloaded afresh and extracted locally for this review. Section 6.2.6.2 paragraphs
1–3 give positive binary unsigned weights, the negative highest signed weight and agreement
when that bit is clear; paragraph 6 names the representation two's complement. Section
6.2.5 identifies `int` as a signed integer type. The target's 32-bit `w0` context is already
established in Fundamentals and the course's recorded examples. The new copy's local
“Here, C’s int uses the signed reading” makes no claim that every C implementation has
32-bit `int`, that signed overflow wraps, or that selecting a reading executes an instruction.

## Verified implementation facts

- The examples call `fourBitReadings` or `readingsOfPattern`. The latter assembles and
  executes the existing supported `mov`/`movk` program before reading model state.
  `fourBitReadings` derives its two interpretations from equivalent 32-bit model states;
  the four-bit figure is expressly a representation example, not an Arm register.
- The essential worked route shows the clear and set highest positions, the fixed-pattern
  signed/unsigned weight comparison, zero contributions and complete short sums. The
  four-bit tests cover all sixteen patterns. The new facts tests pin the selected worked
  and fresh cases against model results without putting fresh totals in initial feedback.
- The bridge names bit 3 and bit 31, supplies both grouped highest weights, and works a
  new 32-bit highest-only pattern. Its prose explicitly says this is a newly chosen width
  and pattern, not extension of the earlier negative pattern. Lower weights remain positive.
- The independent task uses its own fixed 32-bit pattern. Its displayed bit groups match
  that pattern, including the lower set bit. The feedback distinguishes selecting a reading
  from clearing a stored bit, and distinguishes a position's unchanged weight from its
  now-zero contribution. No instruction or C conversion is implied.
- `ReadingAttempt` validates persisted field types. Invalid shapes fall back to empty
  responses. A stored `submitted` flag alone cannot reveal feedback: fields are revalidated.
  Correctness is recomputed from parsed numbers and current model examples, not a saved
  success flag. ASCII and typographic minus signs and correctly grouped decimal commas
  are accepted; hexadecimal, fractions, malformed groups and mixed text are rejected.
- Practice and transfer occupy separate lesson-store slots. Editing a field retracts that
  task's feedback. Resetting one task leaves the other intact. Exploration state is separate;
  changing or resetting it cannot rewrite the independent pattern or any response.
- Exploration opens after a complete practice attempt, including an incorrect one. This is
  an attempt gate, not a claim of mastery. It closes when practice is edited or reset.
  The transfer task and its feedback do not depend on that optional explorer.
- Explanations must contain non-whitespace text before feedback appears. A deliberately
  incorrect explanation with correct numeric readings receives numeric-match feedback plus
  “Only your numeric readings are checked automatically.” There is no semantic prose grade.
- The published legacy `two-readings-each` quiz is replaced. The distinct `make-minus-three`
  challenge remains. Its solution note still regrades saved work through `passedChallenge`;
  no worked new example or optional small explorer reveals its 32-bit solution beforehand.

## Browser evidence

Used headless Chromium against the production build served at
`http://localhost:4173/assembly-lab/#/lesson/same-bits-two-readings`.
Direct runtime checks covered light and dark at 1280px, light at 375px and dark at 320px.
The actual `html[data-theme]` value was checked, rather than assuming the selected preference
had taken effect. Initial and submitted figures had no measured horizontal overflow.

The deeper state checks ran at light 1280px and dark 320px: absent fresh feedback and
construction solution in initial DOM; invalid-number and whitespace explanation gates;
incorrect and correct numeric attempts; explicit prose self-review; keyboard submission;
keyboard disclosure and bit toggle; independent exploration reset; practice reset without
transfer loss; exact restoration of all transfer fields and feedback after reload; regrading
a modified saved numeric answer; and rejection of a malformed saved practice object.
No page or console error was observed in those checks.

After the final rebuild, repeated the affected invalid/submitted states in both themes at
1280px and 320px. Valid numbers plus whitespace prose now produce the corrected message
including “complete each explanation”, with feedback still withheld. Valid completion then
reveals the intended numeric feedback. All populated practice inputs and the textarea had
computed text/background contrast above 4.5:1: about 17.75:1 light and 14.42:1 dark. Inputs
were 44px high and the textarea 96px; the focused input had a 2px solid outline in each theme.
The saved-response note resolved to a 576px maximum width, shrinking to the figure on phone.
No horizontal page overflow or page/console error occurred. A final dark 320px screenshot
was visually inspected for populated-field readability and the visible focus outline.

The retained construction challenge was separately exercised at 375px: untouched fields,
32 bit controls, a failing pattern without solution disclosure, grouped numeric input,
successful solution-note reveal, reload, and tampering the saved pattern. Tampering removed
both completion and the solved note. No page error was observed.

Chromium's accessibility snapshot exposed the practice matrix as a named table with rows,
row headers and cells; the `display: contents` rows were present. Form fields were operable
by their visible accessible names. Enter submitted a task and opened its disclosure; Space
toggled the focused bit and updated `aria-pressed`. Feedback is within a polite status region.
These checks do not establish screen-reader announcements or full assistive-technology support.

## Findings and disposition

**T1. Medium, resolved: stale assertions still expected the retired published quiz.**
The first focused test run failed at the old quiz's `reference` and `tests` lookups and at
the old published hexadecimal-text expectation in `one-pattern-three-readings.facts.test.ts`.
The published challenge was intentionally removed, so restoring it would have reintroduced
the duplicate assessment. The managing session removed the obsolete active-quiz obligations
and retained the construction/model checks. The revised focused run passed. The new form's
model, rendering, negative-input and restoration assertions now cover its replacement behavior.

**T2. Low, resolved in the final build: missing explanation feedback.**
With valid numeric fields and a whitespace-only explanation, the initial build said
“Enter decimal whole numbers” even though the explanation caused the refusal. This did
preserve the gate, but could direct a learner to change the wrong fields. The revised string
adds “and complete each explanation”; its canonical copy is synchronized. The final rebuilt
page showed the corrected message in the same state in all four theme/width combinations.

**T3. Learner-review correction independently verified: populated dark fields.**
The learner reviewer reported pale text on the fields' white browser-default background.
The managing session added explicit theme-token foregrounds, backgrounds, borders and
padding. This technical review did not measure the original color pair. It did measure the
final computed colors and contrast in both themes and widths as recorded above, and checked
the final dark phone screenshot. The corrected populated fields and focus indicator are legible.

Rejected concerns, with reasons:

- The miniature does not invent a four-bit Arm processor: its visible limit and model-backed
  representation are explicit. Its internal extension technique is not learner-facing teaching.
- The bridge does not silently zero-pad a negative value. It explicitly introduces another
  pattern and explains that adding clear positions changes which position has negative weight.
- A complete wrong attempt may reveal model feedback and open exploration. The brief asks
  for feedback after an attempt, rather than requiring correctness before seeing an explanation.
- Mere supplied positional weights are not answer leakage. Initial task totals and worked
  task sums are absent; the supplied weights are the stated assessment support.
- Free prose is not falsely certified: only numeric readings receive an automatic match
  verdict, and the feedback explicitly states the explanation-review limit.
- A persisted historical quiz artifact cannot unlock a new task or its feedback; these use
  distinct validated slots. The retained construction note depends on current valid work.

## Test record and limits

First focused command:

```text
npm test -- packages/views/src/reading-sequence.test.ts packages/views/src/interactives/ReadingSequence.test.tsx packages/views/src/readings.test.ts packages/views/src/complement.test.ts content/lessons/one-pattern-three-readings.facts.test.ts content/lessons/pacing.test.ts content/lessons/twos-complement.test.tsx
```

Exit 1: 6 files passed, 1 failed; 59 tests passed, 3 failed; no skips reported. All three
failures were the stale assertions recorded as T1. This original exit status remains a failure.

Post-correction focused command:

```text
npm test -- packages/views/src/reading-sequence.test.ts packages/views/src/interactives/ReadingSequence.test.tsx packages/views/src/readings.test.ts packages/views/src/complement.test.ts content/lessons/one-pattern-three-readings.facts.test.ts content/lessons/one-pattern-three-readings.test.tsx content/lessons/pacing.test.ts content/lessons/twos-complement.test.tsx content/lessons/reading-sequence.prose.test.ts
```

Exit 0: 9 files and 71 tests passed; no failures or skips reported. Both runs identified
Vitest 4.1.12. `git diff --check` also passed at this review checkpoint.

After the final copy/style rebuild, reran
`npm test -- packages/views/src/interactives/ReadingSequence.test.tsx content/lessons/reading-sequence.prose.test.ts`:
exit 0, 2 files and 5 tests passed, with no failures or skips. The affected browser states
were rechecked separately as described above. Final `git diff --check` passed.

No independent full application suite or new GNU/QEMU differential run was performed by
this reviewer. The managing session records its broader checks separately. Browser probes
above were direct Playwright scripts, not a claim that the full educational suite passed.
No screen reader or novice participant was used. Persisted slots retain the latest response,
not a history of first attempts; the planned formative session must record first attempts and
help separately, as its protocol already requires. The educational value of the four-bit step,
negative-number arithmetic support and independent transfer remain empirical questions.

## Independent investigation of the offline restart failure

The managing session's second full local check encountered a phone failure in
`safe restart preserves each tab's current simulation view and unfinished answer`.
That full-run failure remains a failure. Its original trace was preserved at
`test-results/offline-lifecycle-safe-res-4bf2f--view-and-unfinished-answer-phone/trace.zip`.
Independent trace inspection places the failure at the first tab's release assertion,
not the second: after about 5.26 seconds, the first tab still showed the old document,
an inert interaction area and update-progress text, without a reload request.

The trace also shows substantial delays before restart: a simple step-index assertion
took 12.60 seconds, reading status text took 3.95 seconds, and waiting for update readiness
took 15.92 seconds. The offline protocol, handoff helper and exact test had no source diff.
The protocol checks participating tabs and cached assets before committing the reload;
clicking Restart to update alone does not establish that those asynchronous checks finished.

Against the same built distribution, the unchanged exact phone case passed once on
`AL_PORT=4197` with output in `/tmp/readings-offline-restart-focused` (9.1 seconds).
Three further unchanged repeats with tracing passed in 8.1, 8.5 and 7.4 seconds
(37.3 seconds total), with artifacts in `/tmp/readings-offline-restart-repeated`.
The repeated first-tab release waits were approximately 2.14, 2.03 and 2.14 seconds;
the subsequent second-tab checks each took less than 0.1 seconds. Both focused commands
exited 0. No application code, test assertion or timeout was changed for this investigation.

These observations strongly support a resource or scheduling timing failure; they do not
prove its underlying cause or establish a deterministic regression in the new lesson.
The focused passes do not replace the failed full run. The managing session requires a
green full GitHub CI result before merge.
