# Issue #18: stage the first subtraction

## Choice and checked brief

Considered A (stage the existing fuel example) and B (record a straightforward `difference(38,50)`).
The independent baseline learner pass preferred B if A still required remembering operand direction
and the earlier deliberate bug. Module 0 already teaches argument order and destination-first
operands. A became viable once those facts were shown beside the actual before-state, with the
historical input values retained after stepping. The independent rendered review found the staged
example understandable with no blocking findings. Chose A: the figure carries the retrieval work
and preserves the earlier running example. B would remove the deliberate-bug context, but the
rendered A no longer asks the learner to reconstruct its mapping or subtraction mentally.

Checked sources: `module-1.listings.ts` and recorded GCC 16.1.0 `-O1` output in `listings.md`;
`flowAt`, `viewAt`, `wValue` and `wValueAsInt`; existing lesson facts, source-link and listing tests.
The first instruction reads w1=38 minus w0=50. Its one 32-bit result reads as signed −12 or
unsigned 4294967284. The new figure takes every displayed value from those model states. There
is no new compiler output, source association or program. The new optional mode validates that
its program is one 32-bit subtraction followed by `ret`, and that it reads that destination.

## Separate drafting and reviews

Separate drafting agent wrote the short question, motivation, prediction scaffold, caption and
figure labels from checked facts and project style. Root edited the implementation and synchronised
the canonical prose. Separate learner and technical agents reviewed the work without writing it.
Agents used the parent session's available model/effort; model overrides were not used. This
substitutes for the model recommendations in `docs/authoring.md` while preserving independent passes.

Accepted findings and corrections:

- Baseline learner: prose narrated a completed subtraction above initial input registers. Replaced
  it with an instruction to step; the figure labels Before/After and shows argument mapping only
  before execution. Reset restores that state and removes result readings.
- Baseline learner: the simulator's decimal interpretation was unspecified. Labelled it unsigned
  decimal, and show signed/unsigned readings of the same current w0 bits after execution.
- Baseline learner: addition arrived before a concrete dual reading. The pair now appears after
  the first subtraction; prediction prose explicitly starts from that result. Hex and the single
  optional calculation disclosure stay in the investigation.
- Technical reviewer: present-tense source values beside the post-step register could confuse
  moments again. Changed Will read/will write to Read/wrote after stepping.
- Technical reviewer: a later independently accessible construction hint revealed the add-12
  result before prediction commitment. A separate drafting pass replaced it with the already
  taught signed reading of the example pattern. The browser regression opens that hint while
  the prediction remains locked.

No blocking findings rejected. Low learner observation retained: on a phone the paired listing
requires its intended internal horizontal scroll to reach the assembly. The visible numeric
operand panel carries the subtraction while maintaining the course's C/assembly pairing rule.

## Verification

Independent learner rendered review covered 360, 375 and 1280px, actual light and dark themes,
before/after/reset, prediction locked, selected but uncommitted and checked, and optional calculation
open. Screenshots inspected on phone and desktop. No page errors or document overflow found.
Technical review confirmed compiler/source associations, model values and unchanged prediction
measurement/gate in source, and checked the earlier build at 360/1280px light. Final build checks
and suite results are recorded below after completion.

Initial focused lesson run: 3 files, 64 tests passed. An initial focused browser command failed
to start because the preview server occupied its port; no tests ran. The first full check passed
formatting, copyright, platform integrity and types, then was interrupted after prose-sync tests
observed files during the final hint edit. Its exit status was 130; this is not a successful
full-suite run. Final results follow separately.

Final independent technical browser verification: 360px/dark and 1280px/light, actual themes
confirmed and screenshots inspected. Checked initial/final tense, `ret`, Reset and the third
construction hint while add-12 remained locked. Correct values, no leak and no document overflow.
The prose-sync test rerun passed 7/7 after synchronising the changed hint.

The first viewport-matrix browser run completed with 4 failures and 2 passes: the desktop project
had no touch context when the shared helper tried to tap at phone widths. Enabled touch for this
explicit viewport matrix; production code was unaffected. The corrected run is recorded separately.

Corrected focused browser matrix: 6/6 passed, covering 360/375/1280px and light/dark, including
later hints while prediction is locked. The next full check exited 1: 135 files passed, one failed;
2753 tests passed and two failed. Both failures were the old figure-string bookkeeping test,
which expected exactly 22 strings and a DRAFT mark for all of them. Updated it to retain the
22 legacy draft marks and separately identify the 13 newly reviewed labels; all emptiness,
em-dash and number-notation assertions remain. No arithmetic or lesson test failed.

Final unit/integration run: all 136 files and 2755 tests passed. Focused string review test:
3/3 passed; the independent technical reviewer confirmed that the review bookkeeping change
preserves the legacy invariants. The production build passed. The full browser suite is running
1074 tests with the repository's configured single worker; its final result will be appended.

The full browser run exposed a pre-existing stale assertion in Module 0's ret-prediction test:
its other prediction still expected “Where will the C variable”, while baseline lesson copy
already asks “After the first instruction runs, where is the value of total kept?”. The trace
confirmed the rendered question was the intended current copy. Updated the assertion to the
exact current question and explicitly assert absence of the discovery invitation. No Module 0
learner copy changed. Focused desktop/phone rerun: 2/2 passed. The full run was interrupted to
restart with that fix: 678 passed, 1 failed, 2 interrupted, 18 skipped, 375 did not run, exit 130.
Earlier progress updates missed the failure in buffered output; this record corrects that.

## Final results

The authoritative full check passed in GitHub CI on code commit
`ec1489881cbb85dd36420e430d2085b3e383aac7`:
[Check run 122](https://github.com/snowch/assembly-lab/actions/runs/39755155174).
The workflow runs `scripts/check.sh`, the same script as `npm run check`, on Node 22.
Formatting, copyright, platform integrity, strict types and the production build passed;
all 136 unit/integration files and 2755 tests passed; browser tests reported **1051 passed,
23 skipped**, followed by **All checks passed**. No failures or retries were reported.

The separate GNU/QEMU job passed on the same commit: 191 programs, 2256 calls and 284666
instruction states compared with zero differences; 15 assembler files and 39675 lines checked,
184 outside the supported subset, with zero disagreements.

The final local run independently passed all unit/integration tests and the build, and reached
805 browser passes with no failures before it was deliberately stopped once the full CI run
passed. Its final status was exit 130: 805 passed, 21 skipped, 1 interrupted, 247 did not run.
This is partial local coverage, not a local full-suite pass. The CI result above supplies the
complete full-suite verification. Final documentation changes only record these results.
