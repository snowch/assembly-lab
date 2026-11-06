# Returned-result panel technical review

Copyright © 2026 Christopher Snow

Independent source review, 6 November 2026. This reviewer did not implement the
panel or draft its replacement strings. This pass supplements the independent
browser review in `review.md`; it does not repeat or claim its browser checks.

## Scope and evidence

Read `AGENTS.md`, `CLAUDE.md`, the review rules in `docs/authoring.md`,
`docs/style.md`, `docs/visual-language.md`, `docs/sources.md`, and this change's
checked brief and existing review. Inspected the final `ListingCompare.tsx`,
call-comparison strings and CSS diff, focused call tests, published configuration
in `pacing-1-4.ts`, the recorded trip listings, trace adapter and bit helpers.
The current published call comparison is the sole content use of
`callComparison`: signed versus unsigned, with worked readings and trip context.

## Findings

1. **Low, schema-supported same-type configuration.** The new sentence “Only the
   top-bit weight changes sign” is unconditional whenever the worked table is
   shown. The schema accepts equal `leftType` and `rightType`; in that case the
   correctly computed columns have the same sign, contradicting the sentence.
   This did not affect the published signed/unsigned activity. The smallest fix
   was to include the sign-change sentence only when the types differ, retaining
   the addition instruction for either case, and pin the same-type state with a
   focused component assertion. New controls or broader type support were not
   needed.

   **Closed by independent source verification.** The final implementation splits
   the two sentences and includes the second only when the two call types differ.
   The new same-type test uses separately named signed functions, compares each
   card with its independent model trace, checks totals of 6 and 6, retains the
   addition instruction and rejects the sign-change sentence. The existing mixed
   signed/unsigned test explicitly retains that sentence. The published activity
   therefore keeps exactly the same visible wording. The engineer reports the
   two focused files passed 11 tests and typecheck passed; this reviewer inspected
   the final source and assertions without repeating that run.

No open technical finding remains for the reviewed result panel.

## Confirmed source behaviour

- Each function is separately passed to `traceOf` with its own entry name and
  the same starting arguments. Each result is taken from that trace's final
  `w0` only when its stop reason is `returned`. No comparison result is inferred
  from matching assembly or from the first call alone.
- A shared word requires a successful first call and equality of every returned
  word. Any fault prevents sharing and the same/different summary; a successful
  other call retains its own word and value. Two successful unequal returns show
  separate words and the different-bits summary, without a shared-weight table.
- `unsignedOf` normalises the 32-bit word. The lower contribution is its remainder
  modulo 2^31 and the top bit is its quotient rounded down. The signed/unsigned
  contributions use the respective signs of 2^31; totals use the existing
  signed/unsigned bit helpers. A zero top bit shows both zero contributions and
  the distinct weights. Values and displayed decimal groups are computed rather
  than fixed to the trip example.
- For the unchanged recorded `sub w0, w0, w1; ret` functions with arguments 3 and
  5, the model word is `0xfffffffe`: the shared lower contribution is 2147483646,
  the signed top contribution is -2147483648 and the unsigned contribution is
  +2147483648. The totals are -2 and 4294967294. The focused tests compare the
  rendered word with each independent model run and check these contributions.
- Trip-overrun interpretation requires worked readings, trip context, one shared
  successful word, exactly two nonnegative signed-range arguments, negative
  mathematical subtraction and agreement of that subtraction with the signed
  returned reading. The unchanged recorded functions contain no intermediate
  arithmetic. Their signed difference fits `int`; unsigned subtraction wraps as
  defined in the C source rules recorded by `docs/sources.md`. No unsigned value
  is labelled as an execution error. Both result cards use neutral shared styles.
- Positive differences and changed restored inputs recompute both readings and
  the weight table. They do not retain the negative-trip or unsigned-wrap copy.
  Fault and unequal-result fallbacks likewise omit those claims.
- Prediction commitment and the explicit call remain separate gates. The store
  still contains the prediction and the call-action boolean, rather than cached
  result numbers. Resetting calls clears that boolean; lesson reset also clears
  the prediction. Restoring a call recomputes from current listings and arguments.

## Rejected concerns and limits

- Sharing the displayed word does not merge the executions: the equality test
  occurs after both independent traces return.
- Absence of a top-weight row when the top bit is one does not hide its weight:
  a set bit's displayed contribution equals that weight. When it is zero, the
  separate weight row preserves the signed/unsigned distinction.
- The signed-range and subtraction-rule prose is supported for the current
  recorded functions. It is not a general analysis of arbitrary C functions or
  intermediate overflow; `tripContext` remains an author assertion about this
  activity, as it was before this change.
- Existing focused tests cover equality, inequality, a non-returning call,
  positive results, changed-input restoration, both gates and reset. Their
  reported passing run is separate evidence from this source inspection. The
  managing session owns the exact full check and CI outcome.
- No additional browser, screen-reader, real-hardware or novice-learning test
  was run in this technical pass. The four browser configurations and their
  limits remain recorded by their independent reviewer in `review.md`.
