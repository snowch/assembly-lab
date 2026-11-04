# Independent technical review

Reviewed 4 November 2026 by the separate technical-review agent, using GPT-6.1 Sol
at Extra High effort. The reviewer did not draft or edit the implementation and
formed the assessment from the lessons, prerequisites, model and tests before
reading any author or drafting notes. No author or drafting notes were needed.

The final prose has no outstanding technical findings. One input-identification
finding was accepted, corrected and independently verified in the built site.

## Scope and evidence

Read `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and `docs/sources.md`; the
actual three changed prose modules; their lesson structure, facts, prose-fidelity
and grading tests; the four-bit arithmetic and complement models and tests; the
relevant figure implementation and strings; the preceding signed/unsigned
reading guidance; and the published consumers in `pacing-1-4.ts` and `index.ts`.
The affected published routes are `four-bit-arithmetic`, `constants-and-widths`,
`building-constants` and `twos-complement`.

The changed prose preserves these checked meanings:

- Four-bit weights and signed limits agree with the representation model. The
  small figures remain explicitly distinguished from Arm registers.
- Addition starts at bit 0 on the right with incoming carry 0, includes that
  carry in each sum, retains the low bit and passes the carry left. The model
  tests check the column order, carries and result independently for all 256
  operand pairs.
- Fixed-width subtraction inverts the second operand, adds one, then adds the
  retained opposite pattern to the first operand. The cancellation explanation
  and worked signed reading agree with the model. The signed values used in the
  worked example fit the stated width; the lesson keeps that qualification.
- The appendix retains the condition that a signed opposite must fit at the
  original width. Its worked pattern, zero, minimum signed value, four-bit
  limits and 32-bit limits agree with the representation and negation tests.
- The split-halves procedure still applies to a non-negative 32-bit integer.
  Division by 65536, the whole-number quotient and the remainder give its upper
  and lower 16-bit halves. The worked value and `mov`/`movk` behaviour agree with
  the facts tests and recorded listing.
- Revealing arithmetic columns remains distinct from executing instructions.
  The four-bit direction says so explicitly; the appendix describes computing
  all negation stages together and says it does not execute Arm instructions.
- The formatting changes preserve the existing prediction, hint and solution
  gates. They add no exercise answer to the prose before a gate.

## Findings and disposition

### Accepted: identify both subtraction inputs before using their roles

Severity: low. The initial revision began “Subtract 5 by adding its opposite”
and then instructed the learner to invert “the second input” and add to “the
first input”. The following caption identified the full calculation, but the
ordered procedure used both roles before supplying both operands. A reader
following the procedure in order had to look ahead to establish its inputs.

Direction: establish the two worked operands before the list.

The managing agent changed the lead to “Calculate `0011` (3) minus `0101` (5) by
adding the opposite of 5:”. Independent source and final-preview checks confirm
that this sentence precedes the three steps at both viewport widths and in both
themes. It names the correct operands and does not expose the later exercise's
answer. Closed.

### Considered and rejected: carry direction is ambiguous

The definition says a carry is “a bit passed left from the previous column”.
Read together with “Start at the right with carry 0” and “Pass the carry to the
next column on the left”, the procedure establishes the traversal and the
meaning of the preceding column. The actual figure starts with carry 0 at the
right, reveals that column first and carries left. No corrective edit is needed
for technical correctness.

## Independent verification

Focused command:

```sh
npm test -- packages/views/src/four-bit-arithmetic.test.ts packages/views/src/complement.test.ts content/lessons/four-bit-arithmetic.test.tsx content/lessons/twos-complement.test.tsx content/lessons/constants-and-widths.facts.test.ts content/lessons/constants-and-widths.test.tsx
```

Result: exit 0; 7 test files and 80 tests passed. The filename selection also
includes the four-bit component tests. This is a focused run, not a full-suite
result. The managing session records the required full check separately.

Chromium drove the production preview at
`http://localhost:4173/assembly-lab/` after the managing agent announced the final
build. Checked all four affected routes at 1280 × 800 and 375 × 812, each in light
and dark themes: 16 combinations. Verified the actual `data-theme` and distinct
rendered background colours, rather than only the stored preference. The preview
carried the final prose, including the corrected subtraction lead; its footer
revision was not used as an assertion against a later documentation commit.

In every combination:

- Confirmed real unordered and ordered list elements and their intended item
  counts. Inspected all 20 saved screenshots of the changed addition,
  subtraction, prediction, split-halves and negation prose.
- Checked four-bit addition initially, after one column, after all columns and
  after Reset. The original carry, traversal, retained result and disabled end
  control agree with the explanation.
- Checked that blank arithmetic practice remains blocked and its solved note
  remains hidden.
- Checked the constant prediction before selection, after selection and after
  checking. Selection alone does not reveal the outcome or open the tester.
- Stepped and reset the worked `mov`/`movk` example. An invalid construction
  submission leaves its solved note hidden and its solution stepper locked.
- Checked appendix negation initially, at zero, at the signed minimum and after
  Reset. The feedback preserves the range and truncation qualifications.
- Observed no page errors, console errors or horizontal page overflow.

Transient browser evidence is in `/tmp/arithmetic-technical-review/`: 20 PNG
screenshots and `results.json`. These files are local review evidence and are
not committed.

This focused browser pass did not submit successful exercise solutions or drive
restored completions. Grading and reference-solution behaviour were exercised by
the focused tests. Existing GNU/QEMU corpus coverage was read in source; this
review did not run a new differential test or fetch fresh Arm/C source material.
The editorial change introduces no new architecture or C-semantics claim.
