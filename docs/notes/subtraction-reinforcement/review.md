# Independent review: subtraction reinforcement

Review date: 6 November 2026. Reviewer: a separate agent that did not write the
product change or its copy, using the inherited model configuration. No model
substitution was requested. Learner and technical passes are recorded separately.
The author’s explanation of why the change works was not used as evidence.

## Scope and preparation

Read `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`,
`docs/visual-language.md`, `.agents/skills/learning-design/SKILL.md`, the actual
Arithmetic on register bits lesson, its recorded trip functions, and the preceding
Arithmetic with four bits lesson and component. Source checks also covered the
machine arithmetic record, `arith.ts`, trace execution and the new helper/component.
The linked architecture and C source register in `docs/sources.md` was read; no new
architecture or C-standard claim is introduced by this arithmetic reminder.

## Learner pass

Preparation distinguishes defining the rule from demonstrating and practising it:
Arithmetic with four bits defines inversion, adding one, retaining the available
places and adding the opposite; shows a complete small subtraction; and includes a
fresh application. Its closing bridge says the same rule uses 32 places and that
`sub` performs subtraction as one instruction. Arithmetic on register bits names
that earlier calculation before this comparison.

The prerequisite knowledge needed by the added panel is binary place order,
inversion, the opposite pattern, fixed-width retention, the `w0` result view and
the distinction between bits and their signed/unsigned readings. These are taught
in the preceding route; no newly unexplained term was found in the added copy.
The four-bit example is the smaller complete candidate for this same calculation.
Repeating its rule at 32 bits is a useful explicit bridge: it removes the need to
mentally extend the four-bit pattern while comparing the C readings. This is a
review judgement, not evidence from a novice participant.

The final built page was inspected in Chromium at 1280 and 375 CSS pixels, in
actual light and dark themes. The added panel follows Call both functions, remains
visible without a disclosure, ends in the existing single shared returned-word
view, and precedes the two typed result cards. Labels identify each input and the
inversion/add-one/addition sequence. The result retains the established register
styling. All 32 columns are visible at both representative widths and aligned
between each calculation row and the returned word. The panel is about 544px high
on desktop and 595px on the phone; it remains a single short worked reminder rather
than adding another activity.

No blocking learner finding survived the built-page pass. This is an independent
agent review, not evidence that a novice can now perform a fresh subtraction.

## Technical pass

The helper takes operands from the actual subtraction record that supplied the
last write to `w0`, rather than assuming the starting arguments are the operands.
It requires returned traces, a 32-bit SUB with incoming one, matching arithmetic
records and matching assembled operations. The auxiliary ADD runs construct the
opposite and verify the retained result. These are mathematical working, not
additional instructions executed by the source functions or a pipeline diagram.

Independent executable checks used Vite SSR imports, without running a build or
suite. Expected fields were calculated independently with BigInt masking,
inversion, modular negation and subtraction. Nine input pairs covered the lesson
case, zero inputs, subtracting zero, subtracting one from zero, all-one words and
the high-bit-only word in both operand positions. All first/second/inverted/
opposite/result fields matched, including the opposite of zero retaining zero.

The helper rejected an empty trace list, a single trace, different operands with
the same returned word, ADD with the same returned word, a later overwrite of
`w0`, nonreturning execution, an actual invalid-memory fault, 64-bit subtraction,
and different assembled programs with matching final arithmetic.

### Findings and disposition

1. **Medium, reminder navigation.** The first source version used
   `href="#/lesson/arithmetic-with-four-bits"`; the actual lesson id is
   `four-bit-arithmetic`. The title alone could not make a numbered reminder link
   resolve. Direction: use the actual lesson id. Reported to the implementer;
   corrected in source. Verified in the final built page: the visible label is
   “Module 1, lesson 3: Arithmetic with four bits”; following it opens that lesson.
   The original finding is closed.

No other technical finding from the source and executable edge-case pass.

## Built-page verification

Reviewed the frozen production build served at
`http://localhost:4391/assembly-lab/`. Its entry bundle was
`index-DZi_hwN2.js`, SHA-256
`eb291788497eb0d6b1d0b95c7b4e29577e37186a8f30ab91bb150f54c91c1124`.
No product edit occurred during the browser pass.

An independent Playwright harness exercised eight combinations: 1280/375px,
light/dark, and matching/wrong prediction. Each run checked:

- The initial page contains neither the calculation, return bits/cards nor
  revealed instruction listings; Call both functions is disabled.
- Checking either prediction reveals the listings and enables calling, while
  calculation and results remain absent until the call.
- Calling shows the computed input, inversion, opposite and result patterns,
  exactly one returned-word view, and the calculation before the typed cards.
- All five calculation patterns and the returned 32 bits match independent
  expected words. The maximum difference between corresponding digit centres
  across all rows is 0px. The calculation and page have no horizontal overflow at
  either representative width. Bits render at 12px and remain distinguishable.
- Reload restores the called state. Reset calls removes calculation and results
  while preserving the committed prediction/listings. Reload preserves that reset,
  and calling again restores the same calculation.
- The corrected link has its generated lesson number and navigates to the actual
  prerequisite. No page errors or console errors occurred.

The screenshot pass viewed the called panel in all four width/theme combinations,
the surrounding comparison on phone in both themes, and the desktop comparison in
light theme. Actual `html[data-theme]` matched each requested theme. Screenshots and
state measurements are in `review-images/`; `measurements.json` records all eight
runs.

Two extra 320px runs checked actual light/dark themes and keyboard Enter activation
of prediction checking, calling, resetting and reminder navigation. The page stays
320px wide. At this width the calculation has 272px content within a 262px contained
horizontal scroll, so its rightmost bits and part of its hex value require a small
scroll. This narrower-width caveat is visible in `320-*-called.png`; no full-width
32-column fit is claimed there. `extra-measurements.json` records these runs.

## Coverage and limitations

Source, focused executable helper checks and the browser states above are complete.
No full-suite result is claimed by this review; the managing session records its
own checks. This pass did not rerun GNU/QEMU or consult a newly retrieved Arm
manual; the added reminder displays an existing model subtraction and equivalent
modular additions, and makes no implementation-pipeline claim. No human novice
session, screen-reader session, other browser engine, real-device run or zoom
review was conducted. Keyboard activation was checked; full tab-order and
assistive-technology usability are not claimed.

Decision: keep the reinforcement. The arithmetic, visible sequence, result-card
placement and prediction/call lifecycle satisfy the requested change at the
reviewed representative widths. The reminder-link finding is closed. The 320px
contained-scroll caveat and absence of direct novice evidence remain explicit.


## Follow-up source review

Reviewed the managing session’s `brief.md`, `validation.md`, the explicit
`workedSubtraction: true` lesson opt-in and strict composition expectation, and
the expanded helper tests after the first browser pass. The brief accurately
distinguishes prerequisite practice, the 32-bit bridge and the C-contract
reflection. The composition test pins the requested lesson flag without changing
legacy comparisons; the schema default stays false and an interaction test
explicitly checks the opt-out.

The helper additions cover distinct inputs producing the same returned word, and
identical pairs of ineligible faulting, subsequently overwritten and 64-bit traces.
The identical-pair cases are useful because the assembled-operation comparison
cannot reject them first; they exercise the actual returned-subtraction checks.
The last-write search now uses a reversed copy of the steps; it preserves the
trace and has the same search order as the earlier `findLast` version. These are
source checks; no new suite execution is claimed by this reviewer.

The validation note’s statement about the forthcoming full check was changed to
say execution was pending, so a planned run does not read as completed evidence.
No product correction or additional source finding was needed. Final-build smoke
confirmation remains pending the managing session’s rebuilt artifact.
