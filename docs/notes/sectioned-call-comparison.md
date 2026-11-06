# Sectioned C call comparison

## Brief and checked facts

The user approved the interactive layout mock, then requested implementation and merge.
The learning-design skill (`.agents/skills/learning-design/SKILL.md`), authoring rules,
style checklist and visual-language guidance apply. No separate UX skill is installed.

Outcome: explain why the recorded calls return identical bits but different C values,
then identify the check needed by the existing zero-beyond-plan return rule. This change
reorganises the presentation; it adds no instruction, assessment or execution stage.

Preparation was read in source: Module 0 teaches functions, arguments, `w0`/`w1`, `sub`
and `ret`. Module 1 lesson 2 defines, demonstrates and practises bit readings; lesson 3
demonstrates subtraction through inversion and addition in four places, with independent
practice and an explicit bridge to 32 places. The current lesson supplies the C type rules,
target width and distinction between unsigned wrap and undefined signed overflow.

The recorded `TRIP_REMAINING` and `TRIP_REMAINING_U` listings both use `sub w0, w0, w1`
and `ret`, associated with numbered C line 3. Both independent model calls with arguments
3 and 5 return `0xfffffffe`: −2 signed, 4,294,967,294 unsigned. The existing model-derived
working produces the inverse 4,294,967,290 and opposite 4,294,967,291. Preserve those
helpers, original source, source associations and compiler disclosure. No new numeric
claim is needed.

## Layout and prose process

Remove the composite figure's single enclosing card. Source, prediction and call controls
have separate panels. The computed subtraction and C interpretation become sibling
sections below the controls. Subtraction has two openly visible chunks within one local
working panel: construct the opposite, then add it. They explain one `sub`, rather than
execute further instructions. Keep one final returned word and the reminder link.

The two C value cards sit on the page canvas. Their weight derivation is a subsection
within the same interpretation section, using a local table panel. Essential type and
warning explanations remain visible outside that panel. Preserve original predictions,
call gates, reset, persistence, fault and different-result cases, and default comparisons.
Production reveals calculated sections after the explicit call, without the mock's
deliberate completed start or administrative reset controls.

A separate drafting agent supplied four headings from the checked-facts brief. Both
style passes were applied. Runtime strings and the canonical copy record are synchronised.
No other learner copy changes. The managing session handles wrapper styling and tests;
a separate implementation agent handles components and their styles. An independent
reviewer who authored neither checks the built lesson in distinct learner and technical
passes.

The design reduces the number of unrelated tasks inside one boundary. That is a design
hypothesis, not evidence from a novice study. Keep model calculations and required
explanations visible; no optional disclosure replaces the essential route.

## Verification

Independent learner and technical passes inspected the built lesson at 375 and 1280 px,
in both rendered themes. Initial, checked, called, reset and restored states were checked.
The reader accepted the hierarchy, prerequisite bridge and local reveal after the named
Call action. The technical pass independently ran the unchanged helpers and checked
all displayed patterns and numbers, complete C and line associations. Corresponding bit
centres had 0 px maximum deviation; numeric cells each occupied one text line and stayed
inside their bounds. No page overflow, console errors or unexpected scroll occurred.
Keyboard source scrolling and Enter/Tab through Check, Call and Reset were exercised.

The shared non-call comparison branch and fault/different-word/opt-out cases were read
in source and covered by focused component tests, rather than injected in the review
browser. No novice session, screen reader, forced-colour mode or physical device was
tested. Review artifacts are in the session's `/workspace/scratch/sectioned-live-review`.

Accepted finding: the reminder link became a single 25 px line at 416 px width. Its
corrected result/reminder selectors give links a 44 px minimum target without changing
their labels or destinations. The independent checker verified the final built correction
at 375, 416 and 1280 px in both themes: links meet 44 px, no page overflow, all numbers
on one text line within their cells, and unchanged bit-column alignment. Fresh, called
and reset states were rechecked; screenshots were refreshed.
No other learner or technical finding was raised.

Focused validation, before the link correction was rebuilt:

- TypeScript, formatting, copyright, platform integrity and build passed.
- Five unit files passed, 65 tests, including alternative inputs, fault, different-word,
  reset and persistence cases.
- The first browser command was interrupted after six failures in the new whole-number
  measurement and one interrupted test; 79 tests did not run. That test incorrectly
  counted enclosing inline-element rectangles as text lines. Measuring text-node
  rectangles corrected the test without changing a layout tolerance or product CSS.
- The next focused browser command exited 1: 82 passed and four failed, all the same
  416 px reminder-target finding in both themes and projects. Other flow and arithmetic
  checks passed. A passing final run does not change those original command results.

The first complete `npm run check` exited 1 in the unit stage: 184 files passed and one
failed; 3,212 tests passed and the unchanged first Module 13 test timed out at 34.6 seconds
against its existing 30-second limit. Build/browser stages were not reached in that command.
An isolated rerun of that unchanged file passed all seven tests in 6.64 seconds, with
1.81 seconds spent in tests. No timeout or assertion was relaxed. The corrected product
build also passed separately. The final focused layout command passed all 24 tests
across 360, 375, 416 and 1280 px in both themes and browser projects. These results do
not replace either failed command. The complete check is being rerun; its full-suite
result is recorded separately in the pull request's validation and check runs.
