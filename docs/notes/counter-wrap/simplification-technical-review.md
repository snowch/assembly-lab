# Elapsed-counter revision: independent technical review

Copyright © 2026 Christopher Snow

## Final scope and status

Reviewed the final `CounterRing` elapsed purpose, its model-derived explanation, the paced elapsed/flags lesson split, compatibility task wording, removed four-bit component/registration and revised tests. This supersedes the initial component-only simplification reviewed earlier in this branch. The final elapsed page retains the original 32-bit subtraction and ring; addition and borrow teaching are no longer inserted into that route.

No remaining material technical finding. This verdict covers arithmetic, widths, gate/state behaviour and preserved graded obligations. It is not a claim of measured learning effectiveness; the independent whole-lesson learning-design review is separate.

## Technical findings and sceptic assessment

- The elapsed summary and full-turn rule render inside the existing prediction gate. Before a prediction is committed, the built DOM contains neither the summary nor its result. The summary uses the same `now`, `then` and model-produced distance as the ring. It is not a scripted result or a second example.
- For a normally advancing unsigned counter whose interval is less than its range, retaining the subtraction's low-width bits gives the forward distance. For a wrapped pair, the split forward distance equals `now - then` plus one whole range, which has the same retained low bits. The new rule states both the normal-advance and less-than-one-turn bounds. The original model and 32-bit width are unchanged.
- `purpose: elapsed` suppresses only the separate flag run's displayed C row. The default arithmetic purpose still renders C and retains its original assertion. The internal borrow calculation is unchanged; it is not presented as a flag written by the displayed ordinary subtraction.
- Moving the borrow introduction to the following flags lesson is technically coherent: that lesson now defines the term before its adders and explanations use it. The original combined C reflection remains there; this route's fresh reflection asks about the interval and its bound.
- The construction's five allowed instructions, palette, starter, reference, four graded calls and their expected results are unchanged. Only its task text is overridden, including a local definition of the accepted flag-setting subtraction form. Existing valid source remains valid and uses the same lesson/challenge storage identities.
- Removing duplicate readout assertions is not weakening an arithmetic or gate requirement. The obsolete miniature/component tests were removed with that component; the retained ring tests still assert the default flag row, while the added elapsed-purpose test asserts its deliberate absence and same-input summary.

## Independent final verification

- Ran the six counter-ring tests in `arith.figures.test.tsx`: **6 passed; 27 other tests were outside the name filter and reported skipped**. This is a focused result, not a full-suite pass.
- Executed the current published challenge through its real grader. Its accepted instruction list, test cases, palette, starter and reference match the unchanged original source challenge. The reference and its same-result flag-setting variant pass all calls; the incomplete starter is rejected. No challenge answer is reproduced in this record.
- Independently checked 20 boundary/wrap intervals through the unchanged ring model. Its result agrees with exact low-32-bit subtraction and, for wrapped pairs, the two forward segments. The intervals include zero, one tick, a larger short interval and the largest permitted interval.
- Real Chromium against the final production build at `localhost:4395`, at 1280×900 and 390×900, in both explicitly selected and rendered light/dark themes. All four combinations passed: miniature absent, original prediction gate closed, new summary absent before commitment, same-input summary visible afterwards, C row absent, full-turn explanation/bound visible, committed prediction and summary restored on reload. No page errors or horizontal overflow. The following flags route still renders its borrow explanation and subtraction figure.

## Earlier component-only pass, superseded

Before the whole-page flow decision, the simplified four-bit component passed its three focused unit tests and four browser combinations. Those results applied to that earlier implementation; they are not claimed as final coverage after its removal. The first browser harness used an IPv4 address while Vite listened on localhost/IPv6 and failed before loading the page. Its corrected run passed. That setup failure was not a product failure.

Full suites, native comparisons, final learner review and deployment verification are recorded by the parent. Functional verification does not prove understanding.
