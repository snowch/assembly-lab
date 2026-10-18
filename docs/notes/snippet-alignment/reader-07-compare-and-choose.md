# Independent reader: lesson 07, Compare and choose

Copyright © 2026 Christopher Snow

Reviewed against `CLAUDE.md`, both closing passes in `docs/style.md`, and the snippet-alignment brief. I read as a learner who has completed Before you start and lessons 00–06 only. This is an independent reader pass; I did not edit implementation or tests.

## Result

No new actionable snippet-alignment finding. The changed figures retain both complete C functions, pair the signed function with its instructions, and keep the unsigned listing behind its prediction gate. The caption explicitly says “The C of both functions, steeper_s's three instructions”, so the unpaired unsigned C line is understandable. On a phone, each source group stays with its instruction group; wrapped function signatures remain readable. The separate `ret` explanation, “Returns to the code that called this function”, distinguishes returning control from calculating the C result.

After stepping the failure experiment, the single C line containing the whole function is highlighted. It contains the comparison and return expression, so the highlight identifies relevant source rather than an isolated brace. The next-instruction arrow advances through all three instructions. On this one-line source, finer statement-level highlighting is not available, but no false C line is selected.

The comparison retains its two marked differing operands in both themes and at both widths. The compiler-line disclosure is optional, plainly labelled, and its records remain separate from normal highlighting. No horizontal document overflow or page error occurred in the checked states.

## Considered and rejected

I initially questioned the failure experiment's compiler-detail provenance. Its disclosure says:

> These are the compiler's original line references. They may point to a brace instead of the C operation an instruction carries out.

The nearby experiment text says:

> The figure runs steeper_u with its last operand changed from cs to ge.

The caption likewise says “steeper_u with ge in place of cs”. The altered instruction retains the original compiler line tag. The disclosure promises original **line references**, not an unmodified original listing. Given that nearby qualification and the unchanged tags, this is not an inaccurate claim. No fix requested; no severity assigned.

The baseline review `docs/notes/clarity-review-2/07-compare-and-choose.md` already records the equal-input feedback, ambiguous optional GCC qualification, and Common mistake hint mismatch. Those are not new alignment findings. I did not duplicate the separately reported comparison-disclosure phone target issue.

## Prior knowledge and new words

No new unexplained prerequisite found in this pass. Checked support:

- Before you start lists small C functions using `int`, `unsigned`, arguments, `return`, `if` and `else`; basic binary arithmetic is assumed there.
- `meet-the-machine.prose.ts` introduces GCC as a C compiler, assembly instructions and listings. Its compiler note defines `-O1` as an optimisation setting and explains `-g` and compiler C references. Its figure note explicitly distinguishes those references from the statements an instruction carries out.
- Earlier pattern/width lessons supply signed and unsigned readings, hexadecimal patterns and 32-bit registers. `adding-and-the-flags.prose.ts` supplies signed overflow and defines architecture and QEMU in its model note. `subtracting-and-the-tick-counter.prose.ts` explicitly defines borrow and C's subtraction meaning.
- Earlier masks/shifts lessons supply AND and `lsr`; the shift lesson explicitly introduces the C shift operators and their bit movement.
- This page itself explains the conditional expression `a > b ? a : b`, compare operand order, `cmp`, condition, select sources, `bool`, `cset`, and its optional `tst`/`ands` instructions. No later lesson was used as a prerequisite.

## Actual browser coverage

Used installed Playwright with headless Chromium. Primary immutable URL:
`http://127.0.0.1:4263/assembly-lab/#/lesson/compare-and-choose`.
Repeated the same narrow interactions on the updated immutable preview:
`http://127.0.0.1:4264/assembly-lab/#/lesson/compare-and-choose`.
Both previews were checked at 1280 × 900 and 375 × 900, in explicit light and dark themes.

In every configuration I checked the initial comparison/stepper locks, verified the unsigned instruction was absent from the first prediction, submitted the first radio choice through each prediction's real Check your prediction button, opened visible native details, and stepped the failure experiment through its three instructions. No progress seed or DOM reveal bypass was used. Both comparisons and the failure stepper unlocked through those legitimate commitments. Both differing operands remained marked. Document scroll width equalled viewport width in every run; there were no page errors.

I captured initial paired figures, revealed comparisons, and the failure stepper before and after its compare. I visually inspected screenshots spanning all four viewport/theme combinations, including wrapped phone C source, light/dark highlights, compiler details and stacked comparison stages. A separate focused 4264 DOM check recorded highlighted C line 1 after each instruction and the next-instruction sequence. The source is one line; no closing-brace-only highlight occurred.

Limits: I read surrounding lesson prose and opened notes, but did not submit construction solutions, unlock the own-solution stepper, exercise every hint, or run full test suites. The final challenge's existing assembly-only figure was visible and had no invented C pane. The broad automated `states` query in the main script returned empty arrays because it did not target `data-lit`; the separate highlight check and viewed screenshots provide the actual highlight evidence.

Evidence (temporary local artifacts):

- `/tmp/snippet-reader07.mjs`, `/tmp/snippet-reader07-4264.mjs`: browser scripts.
- `/tmp/snippet-reader07/report.json`, `/tmp/snippet-reader07-4264/report.json`: gates, overflow, marks, errors and compiler-detail text.
- `/tmp/snippet-reader07-highlights.mjs`, `/tmp/snippet-reader07-4264/highlights.json`: focused highlight check.
- `/tmp/snippet-reader07/{1280,375}-{light,dark}.txt` and matching files under `/tmp/snippet-reader07-4264/`: opened page text.
- Screenshot sets in both directories use `{1280,375}-{light,dark}-{initial,comparison,step-initial,step-cmp}.png`.
- Specifically viewed: `/tmp/snippet-reader07/1280-light-comparison.png`, `/tmp/snippet-reader07/1280-dark-step-cmp.png`, `/tmp/snippet-reader07/375-light-initial.png`, `/tmp/snippet-reader07/375-dark-step-cmp.png`, `/tmp/snippet-reader07/1280-dark-initial.png`, `/tmp/snippet-reader07-4264/375-dark-comparison.png`, `/tmp/snippet-reader07-4264/1280-light-initial.png`, and `/tmp/snippet-reader07-4264/375-light-step-cmp.png`.
