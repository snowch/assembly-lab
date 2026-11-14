# Remove the repeated flags follow-up

## Checked facts and scope

- The visible lesson uses the course-owned flags presentation in `packages/views/src/flags-lesson`.
- Six registered practice cases ask learners to predict N, Z, C and V after a 32-bit addition. Each answer is checked against the model and committed through the registered challenge grader.
- The extra card repeats the first practice case with its operands swapped. The result, flags and carries do not change; the card supplies a completed calculation and asks for no new prediction.
- Earlier lesson sections already explain the two readings, the carry rule, and the meanings of all four flags. The recap repeats those four checks after practice.
- Remove the extra card, its rendering function, obsolete strings/styles, and the matching unused canonical lesson figure. Preserve the six cases, per-case feedback, hints, answer invalidation, saved-work regrading, recap, lesson completion and navigation.
- Replace aggregate feedback with a description of current checked answers, without promising another unlock. Separate drafting pass: carry_copy; wording reviewed against `docs/style.md`.

## Learning decision

The outcome remains predicting and checking flags for unfamiliar additions. Prerequisites remain the earlier bit-reading, range and carry explanations. Reversing the inputs could demonstrate commutativity, but this card offers no comparison task and repeats a completed case. That observation motivates removal; it is not evidence from a novice study. Commutativity is outside this change's learning objective.

Source inspected: presentation/controller/state, registered challenge, canonical lesson/prose and existing educational tests. Browser checks and independent learner/technical review follow implementation, using phone/desktop in both themes. Preserve meaningful grading, persistence and equation-layout coverage while deleting checks of the removed card.

## Implementation validation

- Separate copy draft adopted for current completion and incomplete-practice feedback.
- Targeted canonical lesson/fact/prose tests passed after updating the removed figure's expectations. The initial run had one failure: an old assertion still counted two locked adders. The remaining investigation has one locked adder; its prediction gate is still asserted.
- The flags browser suite passed all 46 tests on desktop and phone, including both themes, equations at five widths, all six cases, registered grading, hints, restoration, malformed/forged work, edit invalidation and reset.
- Obsolete follow-up layout assertions were removed. The remaining per-case signed/unsigned equations still have the same overlap, wrapping and alternative-font checks.
- Full repository checks and remote CI are required on the committed implementation before merge. Their final results will be recorded on the pull request.
