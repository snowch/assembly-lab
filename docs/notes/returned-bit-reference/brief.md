# Returned bits beside their interpretation

## Scope and checked facts

- The user approved repeating the returned word below the explanation heading, with bit 31
  distinguished from bits 30–0 and hexadecimal alongside it. Replace the hex-only callout.
- `ListingCompare.tsx` runs both recorded functions through the model. `CallResults` derives a
  shared word only when both calls succeed and their returned values match.
- `BitRow` renders all 32 bits from that value. It already supports a dotted reading mark.
- The existing explanation computes the lower bits and highest bit from the shared word.
  Its contributions, table and sums must remain tied to that same word.
- A clear highest bit contributes zero in either reading. Retain that qualification.
- No reference is shown before execution, after reset, for differing results or for a fault.

## Learning design

The outcome remains explaining how the same returned bits produce two C values using the
weights taught in Module 1, lesson 2. Four-bit arithmetic prepares the subtraction working.
No new mechanism, terminology, controls or assessment is needed for this presentation change.

The earlier bit strip concludes the subtraction working. The repeated strip provides a local
reference for the interpretation below the return-value cards. This removes a scroll-and-remember
step. The possible misconception is that the two readings involve different stored bits;
both strips must therefore display the same computed word, never independent state.

Use a compact, read-only reference. Label the marked highest bit and the other positions without
arrows. Keep the explanation, contribution table and sums visible. Use the existing theme and
diagram vocabulary. Draft labels separately against `docs/style.md`, then obtain independent
learner/UX and technical reviews under `docs/authoring.md`.

## Verification planned

Check model-derived digits in both strips for negative, positive and zero results, including
restoration, reset, faults and different results. Inspect the built lesson on phone and desktop
in both themes for clipping, readability and unwanted controls. Run the required full check and
exact-head CI before merging; verify the deployed merge. Agent review and browser checks do not
establish novice learning effectiveness; no human learner study is part of this change.
