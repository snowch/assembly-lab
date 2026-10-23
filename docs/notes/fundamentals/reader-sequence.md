# Independent learner review: Instructions in sequence

Copyright © 2026 Christopher Snow

Reviewed on 23 October 2026 by a separate learner reader who did not author the lesson,
component or implementation. Prerequisites were the front page's C basics and the three
preceding Fundamentals lessons. No later lesson was treated as prior knowledge. The author's
implementation rationale was not read before forming this assessment.

## Findings

No blocking or medium-severity learner finding confirmed.

Low severity, hint specificity: the third hint is labelled “SMALLER EXAMPLE” but says
“In the worked figure, the two instructions shared one changing set of registers.” It refers
back to the example without giving a concrete smaller case. The learner receives another
statement of the mechanism rather than a smaller calculation to follow. Direction: use an
already-checked concrete step from the worked example, preserving the fresh challenge's answer.
This follows CLAUDE.md's requirement that a smaller-example hint give a concrete smaller case.
The same reminder-only pattern in the sibling hints should be inspected by their reviewers.

The page isolates one new mechanism:
the second instruction reads the state left by the first. The preceding lessons have already
shown the two arithmetic instructions and reading before replacement.

The explanation repeats this mechanism in several short sections, but each has a distinct job:
identify the dependency, pause after the first instruction, reject restarting from original
inputs, then trace a fresh call. I considered excessive repetition as a low-severity candidate
and did not recommend a change: none adds another competing representation or activity, and
the mandatory ten sections remain brief.

The sentence “The marker ▸ shows which instruction runs next” appears before the worked figure,
with the program-counter definition beside it. The figure distinguishes “Just ran” and “Runs
next”; the marker moves to the second line after one step and disappears at the stated end of
the arithmetic prefix. The displayed register state and the read/write diagram agree.

The worked example is small and complete for its stated purpose: two arithmetic instructions,
explicit starting inputs, one current register set, and local run/reset controls. A one-instruction
candidate would not demonstrate the dependency. The challenge changes the inputs while
preserving the structure, so it practises carrying intermediate state rather than copying the
worked final values. Fresh challenge answers are not disclosed in ordinary prose. Progressive
hints reserve explicit answers for the final hint.

## Assumed knowledge not taught

None confirmed. Registers, operands, add/sub input order, reading then writing the same register,
caller, and return have been introduced in the preceding lessons. Program counter is introduced
locally before use. “State” is made concrete as the register values and next-instruction position.
The challenge requires only arithmetic and the operand rules already demonstrated. The page
states that the arithmetic prefix is not a complete function.

## Browser evidence

Built preview: `http://127.0.0.1:4322/assembly-lab/#/lesson/instructions-in-sequence`.
Four independent fresh browser contexts covered widths 375 and 1280, each in light and dark.
The actual `html[data-theme]` matched the requested theme in every context.

In each context I exercised initial, first-step and second-step states; reloaded the completed
worked example and confirmed its saved position; reset it to the initial state; submitted a wrong
fresh challenge answer and the checked reference. Wrong answers failed and the reference passed
in every context. No page errors or horizontal document overflow occurred. A separate phone
context opened all five hints in order.

Screenshots were directly viewed, not merely captured: phone light first step, phone dark second
step, desktop light initial and completed challenge, desktop dark first step, and phone hints.
They show legible high-contrast marker/line labels, a single current register set, and an unclipped
read/write diagram. The challenge labels render register names as code without literal markup.

Artifacts are local under `/tmp/sequence-review/`: `results.json`, `page.txt`, the four-context
state screenshots, challenge screenshots and `hints.png`. Scripts `review.mjs` and `hints.mjs`
record the actions. Challenge answers are intentionally omitted from this review.

## Limits

This is a learner review of one lesson and its relevant prerequisite copy, not a full-course
technical audit or full browser-suite run. Five hints were exercised on phone light; initial,
stepped, reset, restored, wrong-answer and reference states were exercised in all four contexts.
No source files, build output or application behaviour were changed by this reader.
