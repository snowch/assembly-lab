# Returned-bit reference: independent technical review

Reviewed 8 November 2026 at `a7bff2de85ed1eeb8f3199b42dedf98126dc9fb0`.
The reviewer read `git diff main...HEAD` before the change brief or drafting notes,
then followed `CLAUDE.md`, `docs/authoring.md` and the relevant visual-language rules.
This was a separate GPT-6.1 Sol technical-review agent at Extra High effort,
spawned without the author's conversation history, with no authoring role.
No source changes or commits were made by this reviewer.

## Findings

No supported correctness or regression finding in this change. No severity-rated
fix is requested. The following concerns were challenged and rejected on the
evidence below; they do not remain open findings.

| Concern | Evidence and disposition | Direction |
| --- | --- | --- |
| The repeated word could be another execution, copied answer or independent state. | `ListingCompare.tsx:369–383` runs each recorded listing independently through `traceOf`; only a `returned` stop supplies `wValue(final, 0)`. `CallResults` derives `word` only when the first result is non-null and both returned words match (`152–157`). Both strips receive that same `word`; the added strip introduces no state or execution. | Retain this single shared value path. |
| Bit 31 could be marked at the wrong end, or the other 31 positions omitted. | `BitRow` renders the padded 32-bit `bitsOf(value)` in four groups and assigns positions with `31 - (g * 8 + i)`. The new `picked` set is exactly `{31}`. Both DOM and built-browser checks find 32 digits, the highest position alone marked, and matching hexadecimal. The labels correctly name bit 31 and bits 30–0. | No correction. |
| The strip could disagree with the contributions and sums. | The reference, `lower`, `top`, signed/unsigned top contributions and totals all derive from `word` in the same render. Existing tests cover negative, positive and zero results; the independent equal-type cases below also cover a set highest bit and a large lower contribution. | No correction. |
| A fault, differing words, prediction-only state or reset could expose a misleading shared reference. | The added reference remains inside `workedReadings && word !== undefined`. The passing calls suite covers prediction/call gates, different results, a fault, opt-out, reset and lesson reset. The built page independently hides both strips before execution and after Reset comparison. | No correction. |
| Restored completion could preserve an obsolete word. | The stored slot records the call action, not the word. The passing restoration test restores the action with changed arguments `7, 2`, recomputes the reference as `0x5`, and updates table totals to 5 and top contributions to zero. Built-browser reload also restores matching strips. | No correction. |
| The repeated explanation could imply different weights for two functions with the same return type, or a negative contribution from a clear bit. | The new caption makes no different-type claim. The existing differing-reading heading and type comparison remain conditional. A clear highest bit retains the explicit zero-contribution statement. Independent signed/signed and unsigned/unsigned cases pass with positive, zero and negative/wrapped results; their table contributions and heading remain appropriate. | No correction. |

## Recorded output and model provenance

The unchanged `TRIP_REMAINING` and `TRIP_REMAINING_U` definitions in
`content/lessons/module-1.listings.ts:101` match the recorded requests and responses
under `docs/notes/module-1/c-types-subtraction/`. Both responses identify GCC 16.1.0
and contain `sub w0, w0, w1` followed by `ret`; the requests specify `-O1 -g`.
Their original line-4 references remain in the recordings and listing data, and
the checked teaching associations remain C line 3. The change does not alter
either program, its inputs, source associations or C/ISA claims.

`traceOf` assembles the recorded instructions and calls the machine's `run`.
`wValue` extracts the low 32 bits with `BigInt.asUintN(32, ...)`; `bitsOf` pads the
same unsigned word to 32 digits and `hex` renders the same word. For the page's
independent calls with arguments `3, 5`, both model results are `0xfffffffe`.
The two C readings remain −2 and 4,294,967,294. The existing GNU/QEMU corpus
`scripts/real-tools/corpus/module1-c-types.{s,json}` includes both page calls.
This review inspected that corpus and the recorded output; it did not rerun GNU
or QEMU or re-fetch the architecture and C standards for this presentation-only
change.

The exact call-comparison source block in
`docs/notes/course-pacing-implementation/copy.md` was extracted and compared with
`strings.call-comparison.ts`: it matches byte for byte after the file's final
newline. No live `sharedPattern` reference remains in the changed source or
canonical copy.

The learner review subsequently found the old `callIntro` promise that the bits
“appear once”. The drafting agent's unstaged correction in
`content/lessons/pacing-1-4.copy.ts` was inspected independently: it removes only
“once,”. The canonical JSON block's `arithmeticBits.callIntro` was parsed and
compared with that source string; they match exactly. The corrected description
accurately permits the repeated reference and changes no model or interaction
claim. This final copy correction was checked in source; the four browser checks
below used the earlier committed build, so its final rebuilt rendering still
requires the integration checker.

The adjacent `validation.md` was also checked after the independent assessment.
Its available focused-unit log corroborates 3 files and 24 passing tests after
the copy correction; its browser log corroborates 70 passing tests, and its
build log records a successful production build. The additional browser JSON
records the stated eight width/theme combinations with restoration, reset, no
errors and matching page/viewport and reference scroll/client widths. These
records are consistent with the narrower independently executed checks below.
The earlier 14-test run and strict-TypeScript result remain managing-session
reports, not independently repeated checks by this reviewer. The validation
record correctly reserves the final corrected build, full checks and deployment
for the integration pass.

## Independent execution and browser verification

- `npm test -- packages/views/src/interactives/ListingCompare.calls.test.tsx`:
  **12 passed**, exit 0, no skips. This includes model-derived negative, positive
  and zero words, the new mark and hexadecimal assertions, restoration with
  changed inputs, equal types, differing results, a fault, both gates and resets.
- A temporary independent Vitest harness outside the repository source ran
  **8 passing cases**, exit 0, no skips: signed/signed and unsigned/unsigned
  comparisons, each with arguments `3, 5`, `8, 2`, `5, 5` and `0, 2147483647`.
  It compared both strips with independently run model words, checked that only
  position 31 was marked, and checked heading, lower contributions, top
  contributions and totals for the chosen types. It exercised the shared-word
  route without subtraction working as well as the lesson route covered above.
- Chromium 141 drove the built lesson at
  `http://localhost:4518/assembly-lab/#/lesson/arithmetic-on-register-bits` at
  **375px and 1280px, in both light and dark themes**. The actual `html` theme
  attribute was checked. All four reference screenshots were visually inspected.
  Both strips show the same 32 digits and `0xfffffffe`; bit 31 has the rendered
  2px dotted foreground frame and the matching labelled swatch. Labels and digits
  fit, with zero page or reference horizontal overflow in all four states.
- Those browser checks covered fresh, prediction committed, returned, reloaded
  and Reset comparison states. No page errors occurred. The reference contains
  no controls or focus stops. Its accessibility snapshot exposes the repeated-word
  caption, `w0: 0xfffffffe`, both position labels and the highest-bit statement;
  it preserves the shared primitive's read-only semantics.

Transient scripts, observations and screenshots are under
`/workspace/scratch/returned-reference-technical/`. The first browser harness
attempt was stopped after using the reviewer's incorrect button label `Check`;
the corrected four-state-matrix run exited 0. The independent test harness first
failed to load its own config import, then had two failures because its numeric
oracle rendered JavaScript negative zero as “−0”. The implementation correctly
renders zero as “0”. After fixing those harness defects, all eight cases passed.
These earlier command failures remain failures; they were not product findings.

The reviewer did not run the full check, exact-head CI, deployment verification,
GNU/QEMU suite, or a human learner study. Different/faulting programs, changed-input
restoration, zero and positive results were executed in component tests, not
injected into the published browser lesson. Full-suite and deployment results
belong in the integration record; these focused checks establish the reviewed
presentation and data path, not novice learning effectiveness.
