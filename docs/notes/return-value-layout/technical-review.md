# Independent technical review: returned-value layout

Reviewed 8 November 2026 in `/workspace/assembly-lab-return-values`, relative to `e7c24d4`,
by the separate `gpt-6.1-sol` reviewer session with `xhigh` reasoning. The reviewer read the actual
diff before the layout brief or author explanations. The original worktree and its running check
were not changed. No implementation edits, commits or delegated work were made by this reviewer.

## Verdict

No remaining technical blocker. The new callout, table and sums derive their numbers from the
same successful shared model word.
The heading follows the numeric readings, so equal readings do not acquire a claim that they
differ. Prediction and execution gates, independent calls, reset and restoration remain intact.

## Accepted and resolved findings

**T1, blocking check failure, corrected: a new test passed `Element` to `within`.** The reviewer
independently ran `npm run typecheck`; it exited 2 with TS2345 at
`packages/views/src/interactives/ListingCompare.calls.test.tsx:357`. The newly added
`within(explanation)` needed an `HTMLElement`. This did not affect runtime behaviour, but it
would stop the repository's required check. The managing session applied the local cast,
consistent with the existing bridge query. The reviewer re-read that correction and reran the
updated component suite and strict typecheck successfully.

**Previously detected display defect, corrected before this review: negative zero.** The initial
author-run focused log records the restored clear-top-bit case rendering `−0` for the signed top
contribution. Current `contribution` returns `"0"` whenever `value === 0`, which includes JavaScript
negative zero. The positive and zero-result component cases and additional reviewer checks confirm
that table and sum contributions now agree. The initial failed command remains a failed command.

## Rejected concerns and evidence

- **The new heading does not falsely promise different numbers.** `readingsDiffer` compares actual
  `read(call)` values only after a shared word exists. A set top bit with signed/unsigned types
  produces the different-numbers heading. A clear top bit or two signed readings produces the
  neutral heading. A first-call non-null assertion is safe here because `shared` requires that
  first call and word to exist, and the `&&` expression short-circuits otherwise.

- **The table shows contributions, not two inconsistent weights.** The lower contribution is
  `unsignedOf(word) % 2 ** 31`. The top contribution is the actual top bit multiplied by the
  selected type's signed or unsigned weight. A clear bit contributes zero in either reading;
  the new local sentence says so. A set bit contributes its weight. Every displayed total remains
  `read(call)`, rather than a typed example answer. All calculations are exact in this 32-bit range.

- **The duplicate arithmetic remains tied to the model.** The table and stacked sums call the
  same formatting and contribution helpers. The independent scratch checks additionally derive
  lower bits, top bit and signed totals with BigInt masks/conversions and compare all three rows
  in both representations. These cover equal signed negative readings, a word with only bit 31
  set, zero, the largest clear-top-bit word and all bits set. They also check the heading and
  exclude `−0`. The final bit-31-only fixtures use `[-2147483648, 0]`, so the signed model example
  has a representable input and subtraction result.

- **Existing error and gate handling is retained.** `CallResults` still receives results from
  two separate `traceOf` calls with the same argument list. Shared-word explanation still requires
  every successful returned word to match. Differing results keep separate words; a fault keeps
  its error and cannot borrow the successful word. Existing focused tests retain their assertions
  for initial and committed gates, differing words, faults, optional working, reset, full lesson
  reset and restoration with changed arguments. The new `[5, 5]` case checks zero lower bits,
  zero top contribution and zero returned value in both readings and sums.

- **The type explanation remains locally qualified.** The new callout concerns how C return
  types read a returned word. It does not claim that a return type determines expression
  arithmetic. The adjacent retained text explicitly distinguishes parameter arithmetic rules
  from the return reading, and retains the lack-of-overrun-warning qualification. The recorded
  C functions and GCC responses are unchanged. Their recording/corpus test and the existing model
  facts test passed independently. `docs/sources.md` retains the target-specific AAPCS64 and C
  arithmetic references; this layout introduces no ISA or C arithmetic semantics.

- **The unpadded positive hex word is consistent.** The initial new test expected `0x00000006`,
  while both the established `hex` helper and rendered bit-row label use `0x6`. The revised
  expectation uses that helper. This changes the stale test assumption while retaining the actual
  model word comparison; padding is not needed to establish a 32-bit word because the bit grid
  and local bit labels already supply the width.

## Built browser and accessibility checks

The reviewer drove the built page at preview port 4520 using Chromium at 1280×900 and 375×900,
in both light and dark themes. The actual root `data-theme` and computed colours were checked.
All four runs checked initial, committed, returned, restored-after-reload and reset states.
The explanation stayed absent until Run comparison. Reload restored both sums; Reset comparison
removed the explanation and re-enabled the action. There were no console or page errors.

Screenshots of the complete revised explanation were inspected in all four combinations:
`/workspace/scratch/return-values-technical/{1280,375}-{light,dark}.png`. Numeric signs are explicit,
and the total has a border and label as well as colour. The sum cards are side by side at desktop
width and stacked on the phone. The page's scroll width equalled its client width, 1280 and 375
pixels respectively. On the phone, the table measured 317 pixels inside a 343-pixel panel; the
two sum cards also measured 343 pixels and had no content overflow. Table digits measured 12
pixels on the phone and 15 pixels on desktop. Computed total-row text/background contrast was
6.81:1 in light and 7.78:1 in dark.

The browser accessibility snapshot exposes the table name “Contributions to each C value”, both
type column headers and all three row headers. The markup uses `scope="col"` and `scope="row"`.
Each sum has its type heading and a definition list whose visually hidden terms remain exposed
as “Lower 31 bits”, “Highest bit (bit 31)” and “Returned value”. The reminder link remains visible
and exposes the correct signed/unsigned-readings destination. These are browser semantics checks,
not a claim of testing a screen reader. Full observations and the accessibility snapshot are in
`/workspace/scratch/return-values-technical/browser-observations.json`.

An exact source-to-Markdown comparison confirmed that the complete canonical
`CALL_COMPARISON_STRINGS` block in `docs/notes/course-pacing-implementation/copy.md` matches the
source, including the conditional heading, hex callout and clear/set-bit sentences.

## Command results and limits

- The original author-run `/workspace/scratch/return-values-focused.log` records 2 failed and 12
  passed tests across 2 files. One failure was the padded-hex expectation; the other was actual
  negative-zero display. The first subsequent author-run final log records 14 passing tests.
  Those results are separate; the rerun does not change the original exit status.
- The final managing-session all-cases log, `return-values-focused-allcases.log`, records 15
  passing tests across 2 files after the added zero-result case. Its separate canonical log
  records 2 passing tests; its production-browser log records 10 passing desktop/phone tests.
  The reviewer read those logs and kept them separate from the independent runs below.
- Independent repository-focused run: `ListingCompare.calls.test.tsx`, `subtraction-work.test.ts`,
  `one-pattern-three-readings.facts.test.ts` and `c-types-subtraction.test.ts`: 4 files, 55 tests
  passed. This preceded the added `[5, 5]` case.
- Independent rerun after the test cast and `[5, 5]` addition: `ListingCompare.calls.test.tsx`,
  12 tests passed.
- Reviewer-only scratch suite: 18 tests passed, comprising the copied current 12 component cases
  and 6 additional edge cases. After selecting the representable signed bit-31-only inputs,
  the narrowed final run passed all 6 edge cases, with the 12 copied component cases skipped by
  the name filter. These skips do not replace the separate complete 12-test component run.
  Initial scratch harness attempts failed on module resolution and JSX configuration, before
  exercising the app. Those harness failures were corrected outside the repository. The first
  browser harness also timed out on this reviewer's incorrect “Check prediction” selector;
  correcting it to the actual “Check your prediction” control produced the four successful runs.
- `node scripts/sync-platform.mjs --check`, `git diff --check`, and the exact canonical-string
  comparison passed independently. No platform implementation file changed.
- The final independent `npm run typecheck` passed after the managing session's test-only cast.
  The earlier TS2345 command remains an exit-2 failure and is recorded in T1 above.
- The managing session's final build log records a successful build, with dependency annotation
  and bundle-size warnings. The browser checks above used that built page. The reviewer did not
  run another build, the full repository check, or the GNU/QEMU differential command. Full-suite
  and deployment results remain separate. No beginner-comprehension study was performed.

## Final small-delta check

The reviewer also checked the subsequently added `validation.md` against the original focused
failure log, final all-cases, canonical, production-browser and typecheck logs, and the independent
learner report. It preserves the original failures, identifies the real negative-zero defect and
the stale padded-hex expectation separately, records the test-type correction, and makes no claim
of a full course-wide or public-site pass. Its independent-check summaries agree with the two
review reports. No correction is required.

The final CSS deletion removes only `.al-compare-weight-table td span`. A repository-wide search
found one table using that class, in `ListingCompare`; every final data cell contains a text
value directly, with no descendant span. The remaining spans belong to other elements, including
sum-card headings, and never match the removed selector. Its deletion therefore changes no
rendered style in the reviewed states and does not invalidate the earlier browser measurements.
`git diff --check` passed again after these deltas. No other implementation delta was found.
