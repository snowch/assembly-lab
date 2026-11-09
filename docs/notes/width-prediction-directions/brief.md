# Width prediction directions

## Scope and checked facts

Correct the opening of Writing w and x registers. The existing phrase “The figure runs” points at a display that is still gated. The user requested explicit instructions and authorised merge.

- Outcome: predict the full x3 value after the second instruction, then discover the step-by-step display without searching for an already-visible figure.
- Preparation: earlier lessons cover mov, register bits and numeric readings. The local opening defines x3 and w3 as names for all 64 and the lower 32 bits of the same register.
- The assembly-only WIDTHS listing is recorded in content/lessons/module-1.listings.ts. Existing constants-and-widths facts tests pin both instructions and their register effects.
- constants-and-widths.ts connects predict-width to x3-halves with the after gate. The visible commit button is Check your prediction (packages/views/src/strings.ts).
- A checked prediction unlocks the display regardless of correctness. The learner need not answer correctly to open it.
- The second instruction's upper-bit effect stays behind the prediction. No program, options, gate, model, figure, caption or assessment changes are required.
- Likely misconception, supported by the user's question: the opening refers to an immediately available figure. Describe the sequence before asking for a prediction, then name the control that opens the display.

## Drafting and validation plan

Apply docs/style.md. A separate GPT-6.1 Sol Medium drafting pass works from checked facts. The managing editor checks the whole affected lesson and both closing passes. Keep canonical prose synchronised. Obtain independent learner High and technical Extra High reviews on the final built page, phone/desktop and actual light/dark themes. Check initial, submitted, stepped, reset and restored states. Reuse existing facts/canonical tests and prediction-gate browser coverage; do not add tests that merely mirror the sentence.

This is a bounded wording correction, not evidence of learning effectiveness. Reviewers should distinguish new regressions from unrelated existing course findings and record missing coverage.

## Added purpose for shifted ADD

The user's next correction concerns the same lesson: the shifted-constant example explains how but not why. Add a purpose paragraph before the mechanics. Arm ADD (immediate) and docs/machine.md establish a 12-bit constant optionally scaled by 4096; the existing operand-additions listing/model tests pin the current example. The benefit is a larger encoded fixed amount in one ADD without first loading it into another register. Do not imply arbitrary constants fit, infer specific processor timing, or claim that an unshifted-looking source spelling for 4096 cannot assemble: GNU as can infer the shift. Existing range and shift restrictions remain visible. Obtain a separate draft and final independent learner/technical rechecks.
