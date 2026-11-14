<!-- Copyright © 2026 Christopher Snow -->

# Independent review: remove the reversed-input follow-up

Reviewer: separate `carry_review` agent, which did not implement or draft the removal. Inspected the actual diff and initial built practice before the author's brief, under the repository authoring/learning-design guidance. No product or test edits made. This review covers the follow-up removal, before the separately requested calculator layout revision.

## Learner and interface pass

The six-case practice now leads directly to the existing four-rule recap and shared completion/Previous/Next lesson controls. There is no remaining locked or unlocked reversed-input card, empty heading or promise that completing practice opens another addition. Aggregate feedback describes whether the current answers have been checked correctly.

The removed card repeated a practice case with swapped operands, supplied its result and asked for no new prediction. Its removal does not remove an essential definition or a distinct application task. Earlier sections still define N/Z, unsigned C, signed V, signed range and the two top carries. The dedicated carry pane and comparison examples remain. No new term or prerequisite gap was introduced. Learning effectiveness remains untested with a novice.

Independently drove the built candidate `index-UejZ7MoE.js` at port 4204 in eight Chromium contexts: 320/375/834/1280 CSS pixels in light/dark. In each context:

- Fresh practice has six unchecked cases, no result feedback and incomplete aggregate status. Visiting all six cases does not mark them complete.
- An incorrect submission is rejected and Next remains disabled for that case. All six correct submissions produce complete aggregate status and six correct case marks.
- Reload retains the checked work and completion. Editing a passed answer clears its checked feedback, invalidates aggregate completion and disables Next. Reload preserves that invalidated choice; correcting and checking it restores completion.
- The hint ladder still reveals its first hint without changing grading. Clear practice answers removes submitted choices/completion; the cleared state survives reload. Its existing challenge-reset behaviour is unchanged.
- The follow-up remains absent in fresh, complete, edited, reset and restored states. The recap still has four rules, with one shared completion control and one Previous/Next lesson pair.

The earlier Arm prediction is unrevealed on a fresh page. Recorded completed-practice state still has no committed Arm prediction in every context, so finishing practice has not committed an earlier prediction on the learner's behalf. Source inspection confirms its separate reveal gate is unchanged. Feedback/hint answers remain subject to their existing submission/reveal conditions.

The dedicated carry pane still shows the negative-overflow sign column correctly. The existing header calculator still accepts mixed hex/binary entry and gives the expected distinct C/V result for its tested addition. A real Next/Previous lesson round trip restores the reset practice state. No page overflow or page errors occurred. Phone-light and desktop-dark ending captures show the clean transition from practice/hints to recap and shared navigation.

## Technical pass

The change removes only the derived reversed-input model, rendering function, markup, dedicated strings and scoped styles from the flags presentation. `renderPracticeStatus` still updates feedback, current case marks, Next availability, aggregate state and `data-complete`; it no longer calls the removed renderer. The six model inputs, registered challenge grader, case commits, answer invalidation, saved-state schema and hint storage were not changed. No migration is required for a new or removed follow-up state field, because that card was derived from the existing aggregate rather than stored independently.

The canonical lesson's construction section keeps its registered `predict-flags` challenge mount and removes the matching `add-carry-out` adder figure. The unused fixed call, caption and `flagsAfter` prose are removed. The canonical prose record in `docs/notes/module-2/prose.md` removes the same gated caption/explanation. No remaining presentation reference to that figure or removed copy was found. The real prediction and other lesson's gated material remain; the test diff preserves closed-note checks and limits gated-text assertions to lessons that still have such a figure.

Canonical consistency here was inspected in source and exercised indirectly by the actual published lesson/registered grading path. The managing session separately reports 92 focused canonical tests, 30 module-2 prose tests and all 46 focused browser tests passing. This reviewer did not rerun those commands or the full suite. A review-only attempt to bundle the entire content barrel with esbuild encountered its resolution of the case-distinct Calculator/calculator modules; it is not treated as a canonical runtime check or a product failure. The actual project typecheck/build and browser lesson load use the repository pipeline.

## Findings and challenged concerns

No blocking learner/interface or technical finding; no correction requested.

- Rejected: removing the extra card removes all teaching of unsigned carry or carry inequality. Their definitions, dedicated pane and comparison examples remain earlier, and were inspected in the built page. The six-case feedback still provides checked applications.
- Rejected: practice completion can now be inferred merely from visiting tabs. The current grader still requires a checked correct answer for every case; browser visits, incorrect answers and edits demonstrate the distinction.
- Rejected: removing a gated card should remove grading or saved work. The card consumed aggregate state but did not define the challenge or its commits. Real completion/edit/reload/reset checks confirm the retained grading and persistence.
- Rejected: the end of the lesson needs a replacement activity to fill the removed space. The existing recap and shared lesson navigation already provide a complete ending; an extra repeated calculation would not add the removed card's missing learning task.

## Evidence and limits

Scripts, eight-context JSON and captures are under `/workspace/output/flags-followup-removal-review/`. `browser.json` records completed saved work, restored case marks, geometry, actual theme, errors and asset identity. `completion-state.json` verifies six checked cases with the earlier Arm prediction still uncommitted. `initial-practice.png`, `*-complete.png` and `*-ending.png` show the relevant visible states. Capture-only CSS hides the sticky shell header for tall ending/element images after normal checks; product styles were not changed.

No novice study, assistive-technology user test, physical-device or zoom/high-contrast check was performed. Expert review and passing browser interactions do not establish learning effectiveness or full accessibility conformance. Full fixed-revision checks, later calculator work and publishing remain the managing session's responsibility.
