# Make the subtraction method findable

The user identified a general procedure buried inside instructions for the worked example. The learner should be able to find the method again and apply it to the existing fresh subtraction exercise.

A separate drafting agent moved the generic three-step procedure into a neutral, always-visible panel before the worked example. It identifies the second input as the one inverted, emphasises adding one, then adds that opposite pattern to the first input. Four-bit retention and discarded extra carries are stated inside the panel. The example, explanation and assessment retain their existing values and order.

The model facts are in `packages/views/src/four-bit-arithmetic.ts` and its existing exhaustive tests. “Opposite pattern” describes fixed-width cancellation without promising that every signed negation fits. Prior bit readings, addition and width preparation remain the prerequisites. The change adds no instructional stage or control. Role reviews are not a novice study.

Focused verification: 21 tests passed across the lesson, arithmetic model and instruction-introduction files; the four educational browser cases passed at desktop/phone in light/dark. Formatting, diff checks and production build passed. The first build preceded a final bolding refinement; the final build was independently rechecked rather than inferred from the first rendering.

The full repository check was also started locally. Full CI results for the final commit are recorded on the PR separately from these focused results. The unrelated untracked Pi brief is outside this change.

Independent learner and technical review found no material issues. The final production build was inspected at 375/1280 pixels in light/dark, including the final **Add one** emphasis, ordered-list semantics, input order, local width rule, containment and assessment gate. Evidence is in `/tmp/subtraction-method-review/review.md`; no screen-reader application or novice study was performed.
