# C integer types and register widths

The user approved moving the Constants and C types digression out of M1 L7 into an optional appendix, retaining the main width takeaway and a discoverable link, then merging and verifying the live course. Apply the local learning-design skill and the authoring/style/visual guidance. Existing authorisation covers implementation and merge.

## Outcome and preparation

The main lesson's outcome stays predicting how a write through a w name affects its x register. The existing width experiment and Four instructions exercise teach and check that mechanism; no C type detail is required for the exercise. Keep the width rules in the existing reflection, remove the separate C-type section, and add one optional appendix link with the recap. Avoid adding a second miniature recap section.

The appendix is a reference after M1 L7. Its outcome is explaining why the recorded int/unsigned examples load the same 32 bits while the long example uses 64 bits. State its preparation and link back to the register-width and signed/unsigned lessons. Preserve existing examples, avoid new instructions, controls, tasks or C conversion/overflow rules. No optional appendix knowledge becomes required by the main lesson. Independent reviews and browser checks are not novice learning evidence.

## Checked facts

- docs/notes/module-1/listings.md records ARM64 GCC 16.1.0, -O1, fetched 16 October 2026. no_reading returns int -1 and all_ones returns unsigned 4294967295u. Each gives mov w0, -1 then ret. no_reading_long returns long -1, giving mov x0, -1 then ret. Preserve these C and instruction records exactly; display each complete numbered C beside its own instructions using ListingFigure, including on phones. Their original C tags are offset to the single displayed C line, as existing recorded extracts do.
- scripts/real-tools/corpus/module1-constants.s already runs all three bodies through GNU/QEMU. Existing module-1.listings.test.ts pins compiler bodies; constants-and-widths.facts.test.ts pins all-ones results and 32-bit write clearing. Extend the existing record-fidelity tests to the newly displayed extracts; do not invent compiler output or hand-draw execution states.
- AAPCS64 2025Q4 (ARM-software/abi-aa tag 2025Q4, aapcs64/aapcs64.rst), read into /tmp/c-integer-types-aapcs64.rst: LP64 has 32-bit int and 64-bit long. It also describes other data models; qualify these as the selected GCC target's sizes, never all AArch64 or all C systems.
- C23 draft N3096 6.4.4.1 syntax and p6 (local checked text /workspace/scratch/c-types-subtraction/n3096.txt): u/U is an unsigned suffix; the first fitting unsigned type determines a decimal u constant. On this selected target 4294967295u fits unsigned int. Do not generalise u to always mean unsigned int for larger values. unsigned on its own is unsigned int (already taught in M1 L4).
- C types are language-level: distinguish width and interpretation. A register carries bits without a C type tag. Do not imply every return type always forces a particular instruction or that writing w0 fills all 64 bits with ones.

## Implementation and validation

Publish Appendix C in the plan with a separate route c-integer-types, using the existing optional-module and short-lesson schema. Keep all existing appendix identities and M1 lesson order. Keep reference prose compact, grouped by width and by readings, with the three paired recorded listings. Remove the original generalisation section from source and published lesson, synchronise canonical module prose/labels/objectives, and retain existing width recap plus one optional link. A separate Medium drafting pass supplies new text from these facts; independent High learner/UX and Extra High technical/sceptic reviewers inspect the built final pages at phone/desktop in actual light/dark themes, including keyboard link navigation, prediction gate, saved/reset states and paired listing overflow.

Preserve existing challenge/tests and prediction gating. Adapt only genuine inventory/record expectations for the added appendix and source-section removal. Run appropriate focused tests and the required full check; keep first failures, focused reruns, full totals and skips distinct. Commit final source before the full check for stable build identity. Required PR CI must pass before merge. Verify exact tested/merged tree, Pages deployment/release and the actual public lesson/link/appendix. No new visual or incrementer is needed for this relocation.
