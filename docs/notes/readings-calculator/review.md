# Independent calculator and lesson-order review

Reviewed 3 November 2026 by an agent that did not write the application, lesson, copy or tests.
The reviewer changed only this note. No commit was made.

The brief was the approved typed-arithmetic calculator beside the answers, initially empty,
without reading or filling an exercise answer; optional exploration immediately after the
four-bit practice; and a lesson ending with “Make a negative number”, followed by the appendix
link. Reviewed `CLAUDE.md`, `docs/style.md`, `copy.md`, the complete current calculator and
ordering diff, shared answer rendering, handoff state, the practice/exploration gate and tests.

## Pass 1: learner and interaction

The revised sequence teaches the rule, asks for a fresh small-pattern attempt, offers the
optional exploration, then transfers the rule to a register and closes with construction.
The exploration is now next to the attempt that unlocks it. The final heading is “Make a
negative number”. “More about two’s complement in Appendix B” appears below the final exercise,
even before it is solved. The solved explanation remains gated. The link points to the existing
`twos-complement` lesson.

“Type your own calculation using the weights you chose” describes the actual interaction.
The disclosure opens to one empty field, format guidance and a Calculate button. No example,
placeholder or prefilled arithmetic reveals a task's answer. “Result” does not claim to be the
answer. Both closing style passes found the copy direct and the instructions sufficient for
this optional tool. The exact-division restriction appears before use.

Assumed knowledge checked: the front page's “Before you start” explicitly requires “basic
arithmetic” and a little C. Ordinary signs, parentheses and decimal numbers fit that prerequisite;
the accepted characters are listed beside the field. Signed and unsigned positional weights are
explained earlier on this page, and hexadecimal is the preceding lesson. No new unexplained
compiler setting, tool name, assembly convention or course term was introduced by this change.

### Finding L1: unreadable final calculator input in dark theme

**Severity: high. Status: corrected and independently verified.**

The input labelled “Calculation” below “its unsigned reading” initially inherited light text
while retaining a white browser input background. The arithmetic was nearly invisible at both
375 and 1280 pixels. The transfer task's input was readable because its surrounding component
provided input colours. Direction: give the shared Calculator input its own theme-aware colours
and ordinary input appearance, so both placements work independently of their ancestors.

The implementing agent added foreground, background, border, radius, padding and font size to
`calculator.css`, and strengthened the disclosure border. Fresh contexts on the rebuilt site
confirmed matching input appearance in both locations. Measured text contrast was 17.75:1 in
light and 14.42:1 in dark at both widths. Corrected screenshots were visually inspected; typed
arithmetic and keyboard focus are clear. This closes L1. No other learner finding remains.

## Pass 2: technical behaviour

The parser uses `bigint` throughout and returns decimal strings. It does not evaluate JavaScript,
read bit patterns, accept hexadecimal, or convert a result to a floating-point number. Ordinary
precedence, unary signs, grouped decimal commas and parentheses match the documented format.
Nonintegral intermediate division is refused rather than rounded. Zero division and malformed
or incomplete input return recoverable errors.

The 200-character input limit bounds literals, token count, nesting and multiplication work;
there is no exponent operator or other expansion mechanism. Boundary probes included a
200-digit literal, 199 unary signs, 99 nested pairs of parentheses, a large exact quotient,
malformed comma grouping, adjacent numbers, unsupported operators, empty parentheses and a
negative zero divisor. These passed without lost precision or an exception.

Calculator has no answer props or answer callback. It adds no form. Its Calculate button is
`type="button"`; Enter in its field prevents default and stops propagation before calculation.
Input edits clear the prior result and invalid state. Native details/summary supplies disclosure
semantics; labels, format descriptions, error state and live result region are connected.
Separate field keys within existing figure/challenge handoff scopes keep the calculators
independent. The keyed Fragment added to AnswerEditor inserts no wrapper DOM around existing
fields. Number fields opt in through lesson data; other shared answer renderers retain their
existing markup and behaviour. No additional shared-component fault was found.

## Browser evidence

Actual Chromium production build at `http://localhost:4173/assembly-lab/`, route
`#/lesson/same-bits-two-readings`. Fresh contexts covered 375-pixel phone and 1280-pixel desktop,
with `html[data-theme]` verified as light and dark. All four combinations passed after the fix:

- Both calculators initially closed; first opening presents empty input and no result.
- Enter calculates without checking the containing task or running challenge tests; answer
  inputs stay unchanged. Calculate clicks also leave exercise state alone.
- Exact arithmetic beyond Number's precise-integer range, a displayed result, stale-result
  clearing, division error, `aria-invalid`, independent calculator work, and retained work after
  closing/reopening were checked.
- Enter and Space toggle the disclosure from keyboard focus. Tab/Shift+Tab yields a visible
  3-pixel focus outline. Both summaries measure about 123 by 46 pixels. The phone Calculate
  button wraps below the input without clipping; desktop keeps the controls on one line.
- Exploration shows its gate before an attempt, stays locked after incomplete submission,
  unlocks after a complete numeric attempt, and relocks when practice is reset. No worked
  practice answer is reproduced in this review.
- Stage order is unsigned, signed, practice, explore, bridge, transfer. The appendix link is
  visible below the final exercise while its solved explanation is absent.
- Page scroll width equals viewport width: 375 and 1280 pixels. Both calculator panels fit their
  containers. A 200-digit displayed result wraps without panel or page overflow. No page errors.

Screenshots, executable review probes and the final four-combination result record are local
review artifacts in `/tmp/calculator-review/`. Inspected views include closed and expanded
transfer panels, results/errors, both final challenge placements, summary focus, the unlocked
exploration and the below-final appendix link. Before-fix dark screenshots are retained as
`before-375-dark-final.png` and `before-1280-dark-final.png`; final screenshots use the ordinary
width/theme filenames. These artifacts are not repository changes.

## Checks and limits

Independent focused command:
`npx vitest run packages/views/src/calculator.test.ts packages/views/src/Calculator.test.tsx`
passed 2 files and 21 tests before the later test additions. Ten additional independent parser
boundary/invalid-input probes passed. The final custom browser pass and the separate final
contrast/maximum-result pass each covered all four width/theme combinations successfully.

One initial measurement command timed out waiting for the Theme selector while the application
was being rebuilt. It exited 1. Its fresh retry after build completion passed all combinations;
that retry does not change the original exit status. There were no skipped checks in the
independent focused test or final browser passes.

This review did not run the full repository check, real-tool differential tests, a screen reader,
other browser engines or physical phone hardware. Update-restart restoration and every unrelated
shared answer-editor use were read in source rather than exercised anew. The managing session
records full-suite and broader browser results separately. No open finding remains in this scope.

## Final test-only delta

Source-reviewed the subsequent test corrections: Testing Library's two Calculate-button queries
now use its supported `name` option without Playwright's `exact` option. A string name still
matches the complete accessible name, so this preserves the intended button selection. The
educational test now receives Playwright's `isMobile` fixture and passes it to
`designProblems(page, isMobile)`, matching the helper's required signature and enabling its
phone target-size checks. Existing assertions remain. No finding; no application changes since
the rebuilt browser review. This addendum is source verification, not another browser or
full-suite run. The managing session records the running full check separately.

Source-reviewed the later stale assertion correction in `twos-complement.test.tsx`. The closing
section is now required to be a challenge, its last figure must be `make-minus-three-solved`,
and that figure's `after` content must equal the Appendix B Markdown link. This preserves the
link check and adds the approved closing placement, matching the source and the previously
verified rendered page. The old final-section-prose location was superseded by the approved
ordering change. No finding and no application change. The original full-suite failure and the
subsequent full-check run are recorded separately in `verification.md`.

## Incomplete full local browser run and independent trace diagnosis

The managing session stopped the subsequent local check after two browser timeouts. The log
records 3,139 passing unit tests and a successful build before browser testing. The browser
summary is **256 passed, 2 failed, 1 interrupted, 4 skipped and 1,173 not run**; the managing
session records exit 130. This is an incomplete local run with failures, not a passing full check.
Full GitHub CI remains the intended merge gate; its eventual result belongs in the separate
verification record.

Independently inspected both failure traces, snapshots and unchanged test/helper source without
launching another browser. Original artifacts are preserved in
`/workspace/scratch/calculator-interrupted-test-results/`; reviewer copies are also in
`/tmp/calculator-review/module10-failure/` and `/tmp/calculator-review/module12-failure/`.

### Module 10: change-c-calculation, desktop

The test at `module-10.spec.ts:66` reports `Test timeout of 60000ms exceeded` while the Run with
these inputs click at line 127 is pending, after deliberately entering a division-by-zero C
program. Earlier Next clicks consume 17.904 and 18.692 seconds in the test-runner trace. The
pending Run click begins 46.749 seconds after Before Hooks begins, and takes 28.216 seconds at
the test layer; the browser log includes 25.497 seconds between waiting for the control to be
visible/enabled/stable and reporting it stable. The browser trace stops during scrolling for
that action. No model or highlight assertion is recorded as failing.

The test trace continues after the timeout and teardown start: it records the expected zero
error, absent compiled steps, invalid-source fill and expected Line 1 diagnostic. The final
snapshot shows that diagnostic too. This later progress does not reverse the failure. All seven
recorded requests return 200 and take at most about 219 ms; there are no recorded console or
page-error events. The trace establishes long action delays, but does not establish their cause.

### Module 12: from-function-to-executable in light, desktop

The final error points to `openLesson`'s `page.evaluate` awaiting `document.fonts.ready` at
`module1.ts:28`, called from `module-12.spec.ts:49`. The chronology does **not** show a
60-second wait inside that font promise. The test-layer navigation immediately before it takes
63.720 seconds; the browser-layer navigation records 39.779 seconds. The overall test timeout
is emitted while navigation is pending. Navigation then returns during teardown, the expected
section-count assertion passes, and the fonts-ready evaluation starts and fails after 449.64 ms
with the already-exceeded test timeout.

The final snapshot contains the loaded lesson in the selected light theme. All four recorded
requests return 200, but the JavaScript bundle and Source Sans font requests report 12.448 and
11.922 seconds respectively. The trace contains no console or page-error events. This identifies
slow loading/navigation and the exhausted overall budget; it does not establish the underlying
reason for the delays or a defect in font readiness itself.

Both routes and their helpers are unchanged. Neither failed page mounts Calculator or
ReadingSequence, and the new CSS selectors are scoped to calculator elements. The shared bundle
does include the new component definitions, but these traces do not connect them to the delays.
There is no demonstrated direct behavioural connection to the reviewed changes. The evidence
also does not establish baseline behaviour, reproducibility or that either failure is a flake.
The interrupted third test was stopped by the managing session and was not diagnosed as another
failure here. No application, test or timeout changes were made for these diagnoses. Any focused
rerun result must remain separate from this interrupted run and its original failures.

The separate unchanged isolated rerun is now complete. Reviewed
`/workspace/scratch/calculator-timeout-rerun.log`: both original timed-out tests pass, Module 10
in 24.2 seconds and Module 12 in 8.2 seconds. No assertion, timeout or application change was
made for that rerun. It shows those cases completing in isolation; it does not explain the
original delays or make the incomplete full local run pass.
