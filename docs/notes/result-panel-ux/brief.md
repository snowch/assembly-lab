# Result comparison UX

Copyright © 2026 Christopher Snow

## Available guidance

The user requested a UX/design skill. Discovery checked workspace skills and installed cloud/executor catalogs; no dedicated UX/design skill is installed. Apply the available repository learning-design skill with docs/visual-language.md, authoring.md, style.md and CLAUDE.md. This is a concrete design/learning review and implementation, not a claim to have invoked an unavailable skill or validated novice learning.

## Observed problem and outcome

Screenshot 4567 shows the same returned register word twice, two low-emphasis result lines, then several long paragraphs repeating the comparison before displaying its mathematical cause. The reader has to retain both values while reading their explanations. Outcome: identify the shared stored pattern, connect its signed/unsigned readings to the visible bit weights, and see why a defined unsigned result does not express this trip's overrun.

Prior teaching: signed/unsigned weights and 32-bit bridge, four-place arithmetic and the function call convention. Keep the current C-type/instruction prediction and call execution gates. The existing functions, arguments, recordings and model remain unchanged. Values must be computed from each independent trace; only display one common word after comparing equal returned model values. Divergent/fault cases need truthful separate results.

## Design decisions to review

- One common returned word with register/hex/bits label when the model actually reports equality.
- Two compact result groups: C type, grouped decimal value, and its meaning adjacent. The signed negative can express a trip beyond the plan and fits the signed range. The unsigned arithmetic is defined wrapping, but its returned number does not express that overrun. Use neutral styling, not an invalid/error appearance for valid unsigned C arithmetic.
- Essential cause remains visible: common lower-bit contribution, signed/unsigned highest-bit weights and their contributions, then computed totals. Avoid a second wall of prose or hiding the mechanism in optional details.
- Consolidate the type/no-warning qualifications; no type tag lives in the register, parameter types govern the C expression here, and a returned number does not identify whether unsigned wrapping occurred. Preserve the numbered prerequisite link.
- No new controls, speculative animations, hardware state or arithmetic programs. Preserve reset/restoration, source pairing, keyboard navigation and model-driven recomputation. Use existing theme tokens and shared bit renderer.

## Evidence plan

Capture baseline panel at phone/desktop widths. Independent browser reviewer checks final phone/desktop light/dark, visible math, gates, reset/restoration and numbered link. Focused component tests cover equality/difference, changed inputs and faults; educational checks retain exact model results while replacing the obsolete expectation of duplicate bit rows. Record initial failures separately from final passes. Full exact check and CI are separate; merge only when green under the user's standing authorisation.
