# Technical review: function context before parameter explanations

Reviewed 30 October 2026 by an independent Codex agent using the managing session's
inherited model and effort. The reviewer did not draft or edit the product changes.
Scope follows [the checked brief](brief.md): the `km_to_service` introduction in
`content/lessons/meet-the-machine.prose.ts` and its canonical record in
`docs/notes/module-0/prose.md`.

## Findings

No technical findings. No implementation correction is required.

- The rendered declaration is valid C and agrees with the recorded definition: an
  `int` result and four `int` parameters, ordered `service_at`, `odometer`,
  `trip_so_far`, `planned`. The declaration precedes the four input explanations.
- The bullet meanings and kilometre units agree with the recorded calculation.
  In particular, “the odometer reading before the current trip began” excludes
  the separately supplied current-trip distance.
- “It keeps 50 km spare” agrees with the recorded final subtraction. The model
  subtracts the initial reading, current-trip distance, planned-trip distance and
  reserve from the service threshold.
- “The arguments arrive in `w0` to `w3`, in that order” agrees with the lesson's
  incoming-register mapping and the model call. The previously taught result in
  `w0` remains consistent with the recorded instructions and return behaviour.
- The introduction matches the canonical prose exactly. A comparison with `HEAD`
  confirmed that the exercise task, caption, fields, hints, feedback, reference,
  listing and checked C-line associations are unchanged. The introduction gives
  no register result for the tracing task.

## Checks performed

Read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, the relevant authoring and review
guidance, the brief, the lesson prose/structure/labels, `KM_TO_SERVICE`, the
[recorded GCC listing](../module-0/listings.md), and the existing lesson facts and
prose checks. The source check covered the complete challenge, including content
that remains hidden in its initial browser state.

Ran the recorded assembly directly through the repository assembler and simulator
with the exercise's inputs. It returned after five instructions; the result
agreed with the stated calculation and reserve, and the other input registers
retained their incoming values. Ran `cc -std=c11 -Wall -Wextra -Werror -pedantic
-fsyntax-only` on the browser-extracted declaration and then on that declaration
followed by the recorded definition. Both syntax checks passed.

Inspected the final built page at
`http://localhost:4411/assembly-lab/#/lesson/meet-the-machine` in Chromium at
375 × 812 and 1280 × 900, each in light and dark themes. Selected each explicit
theme while emulating the opposite system preference. Verified the actual root
theme and computed body colours: light used `rgb(243, 246, 245)` and dark used
`rgb(16, 22, 21)` backgrounds. All four combinations passed the browser assertions
and were inspected in screenshots.

- The declaration rendered as a C code block, without literal Markdown fences.
  At 375 pixels its block was 343 pixels wide, its text was contained, and the
  page scroll width remained 375 pixels. Desktop page width remained 1280 pixels.
- The declaration, units and four bullets precede the example call and tracing
  task. Their order and wrapping remained readable in both themes.
- The exercise retained all seven numbered C lines and all five assembly
  instructions, with checked C-line tags `3`, `4`, `5`, `6`, `6`. The panes stayed
  beside one another. On the phone, scrolling the containing listing exposed the
  complete instruction pane without widening the page.
- The initial fields were blank, the status was “No tests run yet”, no hints
  were revealed, and no completion or final answer was visible. There were no
  console or page errors in these four fresh browser contexts.

Evidence and ad hoc review scripts are under `/tmp/service-technical-review/`,
`/tmp/service-technical-browser.mjs` and `/tmp/service-technical-model.mts`.
The first ad hoc browser invocation exited nonzero because the script tried to
scroll the inner grid rather than the outer scroll container; its corrected
invocation passed all four combinations. The first model/source invocation
exited nonzero because its declaration comparison retained whitespace after the
opening parenthesis; the corrected comparison and combined C syntax check
passed. Neither issue required a product edit.

This reviewer did not rerun the full test suite, GNU/QEMU differential checks,
graded submissions, hint progression or saved-state/reset interactions. Existing
tests were read for those contracts; the managing session records its own suite
results separately. Browser verification here covers the changed introduction
and the fresh, unsubmitted exercise in the final build.
