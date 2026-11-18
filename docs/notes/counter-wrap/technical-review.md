# Counter-wrap bridge: independent technical and sceptic review

Copyright © 2026 Christopher Snow

## Scope and evidence

Reviewed the new model, React figure, canonical strings, lesson declaration, published pacing selection, storage API, unit tests and browser test. Read the existing machine-backed four-bit ADD/SUB helpers and machine addition/flag implementation. This review did not author the implementation or learner copy.

The miniature derives each increment from the existing 32-bit machine's ADD result and selects its low four bits; it reads the carry from the fourth arithmetic column, not from the architectural C flag. SUB similarly supplies the low four bits for the elapsed interpretation. Four-bit inputs cannot overflow the underlying 32-bit ADD calculation. The retained arithmetic agrees with modulo sixteen throughout the supported domain.

Independently ran `npx vitest run packages/views/src/counter-wrap.test.tsx`: three tests passed. Its exhaustive model case covers every initial four-bit reading and every non-negative interval shorter than one full turn. Separate cases cover invalid inputs, the prediction gate, bounded controls, independent saved work and restoration/reset.

Inspected the Arm ADD and ADDS operation pseudocode as reproduced at the Stanford Arm instruction-reference mirror on 18 November 2026: ADD discards returned flags, whereas ADDS writes PSTATE N/Z/C/V. Both use the selected instruction data size. These agree with the existing course machine and the architecture note. No claim is made that the fourth-column carry is a real 32-bit carry flag.

## Findings and sceptic assessment

- **Blocking integration omission, accepted and corrected.** The learner review found the new source figure absent from the built page. The source lesson is transformed through an explicit published figure selection. Confirmed the final `pacing-1-4.ts` selection includes `counter-wrap` immediately before `counter-ring`, and independently confirmed the miniature exists in the rebuilt published lesson and respects its preceding prediction gate.
- **Minor ambiguous ring reference, accepted.** Inserting a miniature before the ring made “The figure draws them that way” ambiguous. Naming the ring is the smallest sufficient correction. The independent learner reviewer confirmed the corrected “The ring below draws them that way” in the final built page. No instruction or arithmetic change was needed.
- No additional material arithmetic, width, flag, state or answer-gate fault found. Invalid saved tick values fall back to the initial model; the bridge owns a distinct lesson-store slot. Reset does not erase another slot or the committed prediction.

## Browser checks and limits

Independently used Chromium at a 390×844 viewport on a local production preview server. Confirmed that the published bridge is initially locked, then appears after committing the prediction. Advanced through each tick and checked stored bits, the completed addition's separate carry, the final interval explanation and its less-than-one-turn assumption. The page had no horizontal overflow. The live status names the stored reading and last completed addition separately.

A supplementary fresh-browser restoration attempt timed out while locating the preceding prediction radio. This attempt is recorded as failed, not a passed restoration check; a separate diagnostic load showed the lesson and its prediction radios present. A subsequent independent fresh-browser rerun passed: the boundary state restored after reload, Reset returned the initial stored bits, and the committed prediction remained selected throughout. The initial failed attempt remains recorded separately. Full-suite, real-tool differential and theme/desktop results are owned by the parent and learner reviewer, not implied by this focused technical pass. Functional checks do not establish learning effectiveness.
