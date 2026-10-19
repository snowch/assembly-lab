# Checked brief: lessons 15–23

Objective: remove ambiguous timing, guidance placement and terminology while preserving the executable examples and prediction gates. Learners know the front-page C subset and previous lessons only. Apply docs/style.md sentence and explanation passes; plain British English, precise state/operation references, no pre-gate answers.

Checked facts and evidence:
- products.listings.ts and products.facts.test.ts: madd's ordered operands are destination, two factors, addend; the last wide_product case is 7 × 6, with a product that fits in 32 bits. Name madd in the hint and distinguish product width in the label (L14/L15).
- division-and-remainders.ts: constant division figure is in generalisation while its paragraph is in explanation; fuel advice intervenes. Keep edge explanations with their figures, constant explanation with its figure, fuel advice with final task (N15).
- AAPCS64 2025Q4, Parameter Passing C.9 and following bullets: arguments use low register bits; unused bits unspecified. Retrieved source at /tmp/course-clarity-implementation/aapcs64.rst. Division final-case rule sets nonzero x1 upper bits. A write to w1 zeroes upper x1; an input contract naming w1 is not such a write. Explain this distinction (M5).
- calls.listings.ts/report compiler record and docs/notes/module-9/listings.md: stp x29,x30 allocates32 bytes, stores8-byte values at new sp and sp+8; x19 at sp+16. Frame and calling-convention definitions must precede guided stack inspection. Two initial report steppers duplicate one run. Consolidate after definitions, retaining prediction gate (M3/L16/N16/N17).
- recursive-calls.ts initialStep22 and calls.facts.test.ts/module9 recorded runs: investigation starts with four active frames, not at call entry. Explain preset and use Back for descent/Next for returns (N18).
- from-c-to-instructions listing copies register inputs into working registers, not memory loads. movz's 16-bit constant is an immediate (N19/L17).
- GCC16.1 invoke.texi/retained module11 brief: undefined sanitizer recovery continues execution after a report; it does not repair the operation. -fno-sanitize-recover=undefined terminates detected runs (L18).
- same-c-on-a32.ts: A64 stepper follows gated prediction. Ask for prediction first; run after checking (N20).
- Accepted M6 extra occurrences: division write hint2, calls final hint2, recursion final hint2, local compiler write hint2, compile-loop write hint2 state correct rules beneath Common mistake. Recast as the actual erroneous action, preserving hint assistance. Third hints already use concrete small examples.
- All simulator-backed prediction kinds in this scope lack role metadata. Set role prediction on these actual predictions; retain existing timeModel and gates. A32 recorded-only prediction also is prediction but has timeModel none.

No instruction or numeric result changes; existing facts/contracts/canonical tests are relevant. Root handles shared component implementation and independent built-site reviews.
