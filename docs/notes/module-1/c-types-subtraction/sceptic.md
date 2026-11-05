# Sceptic review: C types and one subtraction

Copyright © 2026 Christopher Snow

Independent reviewer; did not author the lesson, strings, interaction or tests. Reviewed the
current diff, actual GCC request/response JSON, the model glue, source-association rules and
N3096 §§6.2.5p11 and 6.5p5. This is an agent review, not observation of a fresh learner.

## Findings challenged

The reader's pre-implementation risks in `review.md` are justified but are addressed by the
current page:

- The page locally states that both C types use 32 bits on this target, explains bare
  `unsigned`, distinguishes a valid negative signed result from overflow, and states the
  unsigned wrapping and undefined signed-result rules. Earlier bit-reading lessons alone
  would not establish these C guarantees. Retain the local explanation.
- The caption says "Two independent calls with planned = 3 and travelled = 5". The control
  labels and result captions distinguish starting arguments from final `w0` bits. Neither
  returned value feeds the other call: `traceOf` creates separate model runs.
- The prediction asks only whether the recorded instructions differ. In the tested build,
  no instruction listing or computed return card appears before commitment. Numeric C-rule
  prose elsewhere on the page is not an answer to this instruction-choice question.
- GCC's original source references point to line 4. `sourceLines: [[3], [3]]` correctly links
  the subtraction and return to the displayed return expression. Original references remain
  unmodified in the recorded JSON/listing. Routine compiler-reference details are not required.

## Independent technical pass

Both recorded functions subtract planned minus travelled; their actual instructions are
identical. The selected signed expression is representable. The same low 32 machine-result
bits have different signed/unsigned C readings. The page does not run undefined signed C
arithmetic as a demonstration of a C guarantee, equate a negative result with overflow, or
call unsigned wrapping undefined behaviour. The final three-bullet C explanation remains
consistent with N3096.

The generic `ListingCompare` path without `callComparison` retains its existing C panes,
line comparison, markings, summary and optional checked-source pairs. The extra slot is
namespaced under the figure id. A restored call action recomputes its value through the
current recordings and arguments rather than persisting derived numbers. Reset calls clears
only that action; resetting the lesson clears the prediction and call slots. `SOURCE_LESSONS`
and its legacy recordings remain present; only the published paced page is replaced.

Prerequisite objections rejected with earlier teaching:

- AArch64 is defined in `fundamentals.prose.ts`: "AArch64, Arm’s 64-bit mode."
- Function arguments, GCC, `-O1`, `ret` and result location are taught in its complete-function
  example: "the argument arrives in `w0` and the integer result is left in `w0` too."
- It then teaches two arguments: "the first arrives in `w0` and the second in `w1`."
- Subtraction order is explicit there: "Subtraction keeps the input order: second minus third."
- The front page permits "`int` and `unsigned` arguments, and `return`." The new page teaches
  the additional target-width and C-arithmetic qualifications locally.

No further material missing prerequisite was found. The new first application combines one
already demonstrated subtraction with a type reading; restoring the old additional constant
or a second subtraction walkthrough would add repetition rather than repair a missing bridge.

## Accepted issues and smallest corrections

1. **Browser test contract, material:** the old browser tests initially required removed
   `run-fuel-used`, `predict-add-12` and `step-add-12` figures on the published route. Keep the
   route id, rewrite these expectations for its new comparison, retain gates/model values/
   reset/restore/theme/phone checks, and retain legacy source/component coverage. The revised browser tests now assert both
   prediction choices, complete paired source,
   the separate call gate, returned model bits/readings, reset and restored state, alongside
   width/theme checks. Source inspection confirms the intended checks were preserved for
   the replacement activity. Final suite results belong in the verification record.
2. **Commit layout, minor:** removing the initial C panes and recreating them after the
   prediction moved the content above the keyboard user. At 375px the browser changed
   scrollY from 1198 to 865 on commitment. Smallest correction: retain the source/listing
   container at the same position before and after commitment. The UI author kept the paired source
   container before the prediction. Independently
   checked the rebuilt page in both phone themes: commitment now keeps scrollY at 1242
   before and after. This finding is closed.

A shared prediction button losing DOM focus when it becomes disabled is not a new regression.
The call button similarly becomes disabled after running; its next Tab reaches Reset calls,
and the call itself did not scroll the page. No keyboard trap was found. Each result has a
function-specific preceding caption, and its noninteractive bit group exposes the `w0`/hex
name while hiding the individual decorative bit spans. Identical group names alone do not
make the two results indistinguishable in document reading order. No screen-reader session
was performed.

## Actual browser evidence and limits

Preview: `http://localhost:4321/assembly-lab/#/lesson/arithmetic-on-register-bits`.
At 375×812, both requested themes also rendered as the corresponding actual `data-theme`.
Inspected screenshots of both rendered themes. Keyboard-tested the wrong prediction, submit,
call, reload restore, and call reset. Initial, ready, returned and restored states matched the
model; no returned cards appeared before the call. Document client/scroll width was 375/375;
no page or console errors occurred. The complete paired listing uses contained horizontal
scrolling. Screenshots are in `/workspace/scratch/c-types-subtraction/sceptic-{light,dark}.png`.
The separate reader covers desktop and the complete four-way rendering matrix.

Final rebuilt-page recheck passed at 375×812 in light and dark. Commitment preserved scrollY
1242; the call preserved scrollY 1944. Reset, rerun and reload-restored results remained correct.
Each paired listing had 588 pixels of content in a 317-pixel contained scroll region. Manually
scrolled the first listing to inspect both actual instruction associations, each C line 3.
Inspected final screenshots `sceptic-final-light.png` and `sceptic-final-dark.png` in the same
scratch directory. Accessibility snapshots expose each function caption, its `w0`/hex group
and its distinct typed return value in document order.

No unresolved material review finding remains. Final suite results are recorded separately by
the managing session. No fresh learning participant was available; understanding and transfer
have not been established by these checks. Native and full-suite results reported by other sessions are not represented here as my own runs.
