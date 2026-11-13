# Compact checked result: facts and scope

The user approved removal of both section06 expandable panels (Read the same stored bits; Inspect the addition columns), replacing them with a compact comparison in checked feedback and a direct route to section07 practice. Keep the earlier optional four-bit carry/circuit teaching visual.

## Checked model facts

- `flagsModel(PLUS,32,0x7fffffff,1)` runs the recorded addition through the existing simulator. Both input readings are positive, and both exact sums are2147483648. The result bits are0x80000000, unsigned2147483648 and signed−2147483648. C=0, V=1. Existing facts/model tests pin these results.
- The exact signed sum exceeds the signed32bit maximum; the stored negative reading itself is valid. Do not say the stored negative number is outside the signed range. Distinguish the exact sum from the value represented by the result bits.
- All displayed values must come from the same existing model, formatted with the current commas/minus sign. Keep numerical answers out of authored labels.
- Existing `state.arm.draft/committed` and the canonical predict-readings slot gate feedback. No committed prediction, no result. An edited unchecked draft hides stale feedback; reload and clear must retain current semantics. Malformed presentation-only state cannot open this gate.

## Design and learning objective

The learner has already met signed/unsigned readings, hex, the flags and four-bit carry examples. This section transfers the range question to a32bit instruction, then moves to fresh practice. Remove repetitive interaction; show the result hex once and both decimal readings together after checking, with a short local match/difference explanation tied to the exact sum. Keep existing range/flag feedback if needed without repeating whole paragraphs. Update any feedback inviting the learner to open removed panels.

Preserve the default-Hex starting-input control, both range cards, prediction choices/grades, practice exercises and earlier optional circuit visual. Remove obsolete section06 rendering/handlers/strings; no shared platform or simulator change. Legacy stored presentation fields may remain ignored for backwards compatibility. Inspect sibling uses and canonical records/tests before deleting helpers or copy.

Required process: separate copy drafting from these checked facts; independent learner/UX and technical/sceptic review of the actual built lesson at phone/desktop in actual light/dark. Verify initial, empty-submit, wrong/correct checked, edited, reloaded, cleared and legacy saved states; all input formats; practice integrity; no page overflow or early answers. Replace tests for the deliberately removed UI with meaningful checks of the new checked result and preserved gates/state. Keep historical failures separate from later passes. Run full npm run check, exact-head CI, merge and verify the public merged deployment.
