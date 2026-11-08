# Returned-bit reference copy draft

Drafted separately from the implementation against the checked facts in
`brief.md`, the current comparison source and `docs/style.md`.

Replace the hexadecimal-only `sharedPattern` callout with a repeated bit reference.
The three new keys are:

- `returnedReferenceCaption`: “The same returned w0 bits, shown again.”
- `returnedReferenceTop`: “Bit 31 (highest bit)”
- `returnedReferenceLower`: “Bits 30–0 (lower 31 bits)”

The caption identifies the repeated word without suggesting another execution or a
second result. The labels name both groups directly and connect them to the
existing contribution rows. Bit positions describe the fixed register layout;
no result digits, values or contributions are supplied by this copy.

Remove `sharedPattern` when the new reference replaces its callout. Its C-type
explanation remains in `readingTypes`, which distinguishes parameter types and
subtraction rules from the return type and returned value’s reading.
`topBitState` is unchanged: a clear highest bit contributes zero in either reading.

The exact source block in `docs/notes/course-pacing-implementation/copy.md` is
synchronised with `strings.call-comparison.ts`. Both style closing passes were
applied to these labels and caption. This pass changes copy only; browser checks
and independent learner and technical reviews remain with the integration pass.

## Intro count correction

The learner review found that `COPY.arithmeticBits.callIntro` still said the
matching returned bits “appear once”. The repeated reference makes that count
stale. The source is `content/lessons/pacing-1-4.copy.ts`; its canonical text is
in `docs/notes/course-pacing-implementation/copy.md`.

Remove only “once,” from the final sentence:

> Their matching returned bits appear with a separate C reading for each return type.

The prediction instruction, **Run comparison** guidance and statement that both
functions run independently from the same starting arguments are unchanged.
The revised sentence describes the shared bits and separate readings without
counting their appearances. Independent verification remains with the reviewer.
