# Carry flag C wording draft

Copyright © 2026 Christopher Snow

Separate drafting pass from `brief.md`, the current counter strings and `docs/style.md`. Only supporting wording is drafted here. No implementation or RISC-V files are changed.

## Preserved user choices

The visible labels remain exactly **Carry flag C after adds** and **Carry flag C after subs**, with instruction names formatted as code where the renderer supports it. The selected subtraction boundary paragraph, its model-rule lead and its two C=0/C=1 bullets remain unchanged. No physical-loan explanation is restored. No new controls, arithmetic, state format, disclosure or assessment gate is proposed.

Use **updates** when explaining the flag-setting instructions: C can become zero or one. Plain `add` and `sub` preserve C. The hypothetical four-bit rule must remain distinguishable from actual Arm instruction widths before or beside the displayed flag.

## Supporting draft

| Purpose | Draft |
| --- | --- |
| Main intro | Each tick adds one. This {width}-bit teaching counter shows how `adds` would update carry flag C at that width. The program below uses {realWidth}-bit registers. Read the stored bits as unsigned. |
| Main instruction | Press +1 to add a tick. Keep pressing until the stored reading returns to zero. Inspect Carry flag C after adds at the wrap. Reset starts at zero. |
| Normal addition feedback | The addition has no carry beyond the stored bits. This model updates carry flag C to 0. |
| Wrapped addition feedback | The {width} stored bits wrap to zero. This model updates carry flag C to 1 for the carry beyond them. |
| Main model/architecture note | In this {width}-bit model, the `adds` rule updates carry flag C to 1 for carry out and 0 otherwise. Real `adds` uses 32 or 64 bits; plain `add` preserves C. |
| Optional title | Optional: subtract one and inspect carry flag C |
| Optional intro | Subtracting one is a decrement. This separate {width}-bit counter shows how `subs` would update carry flag C at that width. It does not reverse time or undo earlier work. |
| Optional instruction | Press −1 once from zero. Inspect Carry flag C after subs and the stored reading. Keep counting down through further wraps. Reset starts this counter at zero. |
| Normal subtraction feedback | Subtracting one stays within the unsigned range, so this model updates carry flag C to 1. |
| Optional model/architecture note | This is a {width}-bit teaching model. Real `subs` updates carry flag C to 0 or 1 at its 32- or 64-bit width. Plain `sub` preserves C. |
| Initial status | Stored reading: {stored}. Carry flag C: no operation shown yet. |
| Addition status | Added one. Stored reading: {stored}. Carry flag C after adds: {c}. |
| Subtraction status | Subtracted one. Stored reading: {stored}. Carry flag C after subs: {c}. |

The addition note above tightens the initial message draft by naming the model and its rule explicitly. Width, pattern, readings and C values must come from the existing computed view. Keep the initial dash explanations: no addition or subtraction is shown yet. The normal subtraction sentence is only for the within-range branch; the selected below-zero sentence is only for the wrapped branch.

## Closing passes

Sentence pass: both intros identify the named instruction and carry flag C; directions name the user-selected fields; normal/wrapped addition reports whether C is updated to zero or one. Neither note uses the ambiguous phrase “sets C”. Status messages report C directly and do not ask the listener to invert a Borrow needed value.

Idea pass: the displayed flag is a hypothetical four-bit result, while actual Arm `adds`/`subs` operate at their real register width. The local notes retain that distinction, including plain instructions preserving C. The selected subtraction explanation and bullets retain the user's mechanism without a physical source of borrowed bits. Optionality and the elapsed-time route are unchanged.

This pass drafted wording from the supplied checked facts. It did not alter or rerun arithmetic or inspect the final rendering. Independent learner/technical review and final phone/desktop light/dark checks remain necessary. Passing checks and agent reviews do not establish novice learning effectiveness.

## Implementation edit

The main program location stays “later”, matching its position beyond the teaching figures, and the existing unsigned definition remains. Body prose uses the article “the carry flag C”. The rule stem now explicitly names how subs updates the carry flag C, while the user-selected boundary sentence and both C0/C1 bullets are unchanged. Normal subtraction feedback uses the shorter draft that directly states the model updates C to1; the result bits/unsigned reading remain visible immediately above. No arithmetic or saved-state change is involved.
