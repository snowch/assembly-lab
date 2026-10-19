# Whole-course learner clarity audit

Read-only review of pushed `6d757f5`, using the production build at `http://localhost:4290/assembly-lab/`. No course files were changed, committed or pushed. This report identifies improvement directions; it does not draft learner prose or disclose challenge solutions.

## Scope and evidence

All 24 lesson reports are complete, with one fresh independent reader per lesson. The target reading covers prose, labels, questions/options, explanations, feedback, hints, model notes and relevant component strings. Each reader checked actual Chromium at 375 and 1280 pixels in light and dark themes, then representative interactions and candidate-specific states. Details and limitations are in the individual records. This does not mean every possible input, hint, saved state or successful solution was executed in all configurations. Prerequisite assessment uses the front-page panel and earlier definitions; some readers reread all earlier prose, others explicitly focused on relevant earlier passages. The independent sceptic checked candidates against sources, prerequisites and prior reviews, reduced overcalled severities and retained unresolved old issues when a fresh reader missed them.

No automated suite was rerun because this was an observational review of unchanged application code. Browser probes establish the stated visible states, not a new regression certificate.

## Prioritised improvements

The main opportunities are local fixes to the teaching sequence and the meaning of interface labels. These six groups combine repeated occurrences rather than counting each badge or hint as a separate defect.

1. **Make guidance describe the action the learner can perform.** Many later prediction cards still carry Stepped and the one-instruction-per-step disclosure; the correction only reached two introductory cards. More seriously, adders use that same explanation while Next column reveals part of one instruction's arithmetic. Change figure roles/help according to the action. Preserve stepping help on real instruction steppers. In A32, also correct “Run the A64 version” before its stepper has been unlocked (`same-c-on-a32.prose.ts:13`). Representative sources: `packages/views/src/strings.ts:11`, `content/lessons/adding-and-the-flags.ts:95`, `content/lessons/constants-and-widths.ts:82`. Final severity: medium for the wrong adder step unit, low for generic misplaced help. See readers 00–23 and shared S1.

2. **Identify the exact run and state represented by every value.** The opening caption in Same bits, two readings says after subtraction while fresh/reset state shows before it (`one-pattern-three-readings.labels.ts:28`). Masks silently switches its prediction illustration from one input to another (`masks.ts:93,96`), and its reflection leaves independent versus successive operations ambiguous (`masks.prose.ts:115`). A recursive figure already starts at its deepest call while the prose says to advance there (`recursive-calls.prose.ts:18`, `.ts:132`). Completed RunPrediction cards retain unlabelled initial registers (`RunPrediction.tsx:125–131`). The shared Changed label actually marks writes, including a write that leaves the value unchanged (`trace.ts:128–139`, `strings.module0.ts:54`). Phone before/after labels can wrap into tiny word fragments (`bits.css:479–489`). State labels, accurate write/change language and readable mobile layout would address the same learner problem together. Final severity: medium for mixed inputs, write/change semantics and unreadable temporal labels; low for remaining local state qualifiers. See readers 01/03/05/06/18 and shared S2/S3.

3. **Keep explanations beside the figure or rule they explain.** Ring guidance is separated from the ring by the subtraction/borrow explanation (`subtracting-and-the-tick-counter.prose.ts:27–45`). “Step through the load” appears after its load figure and above a store (`memory-and-addresses.prose.ts:24`). Division-by-ten guidance and its figure surround unrelated fuel-calculation material (`division-and-remainders.prose.ts:36,38`; structure 175–213). Calling-convention setup is hidden in optional compiler provenance despite main text relying on it (`calls-and-returns.prose.ts:9,18`); branches likewise assumes the optional maybe_beep example (`branches.prose.ts:100–108`). These are low-severity local sequence problems. Move the minimum required explanation, retain optional provenance, and preserve prediction gates. See readers 04/08/11/16/17.

4. **Make help match the actual control, submission and hint heading.** Module 0 says open a register, while a shared Show the bits button changes all displays (`meet-the-machine.prose.ts:52`). Grouped hexadecimal copied from the lesson is rejected without naming spaces as the problem (`constants-and-widths.prose.ts:24`, `ConstantTester.tsx:26`). Branch-free starter feedback asks which branch sent the run to a label (`branches.prose.ts:74`). Existing hint ladders put correct instructions under Common mistake and general advice under Smaller example (old M6); one products hint says Its operands without naming the instruction (old L14). Prefer state-sensitive feedback and explicit, correctly placed help. Preserve the platform copy. See readers 00/02/08/15 and the existing M4/M6 backlog.

5. **Correct the remaining explanations that can teach the wrong mechanism.** These are mostly verified existing review findings, not new discoveries: subtraction's full sum omits the first input and second operand conflicts with assembly numbering (`subtracting-and-the-tick-counter.prose.ts:41–42,100`, old M1/M2); paired 64-bit stores are described as going to consecutive addresses without explaining the eight-byte spacing (`calls-and-returns.prose.ts:18`, old M3); widening a divisor does not explain the distinction between receiving a value through a narrow argument and executing a write to a w register (`division-and-remainders.prose.ts:38–40`, old M5); the shifts note blurs implementation-defined and undefined C operations (`shifts.prose.ts:19`, old M7). These medium findings should be fixed before cosmetic prose. The already-reviewed original sources/standards remain authoritative.

6. **Explain compiler transformations where pairing alone cannot explain them.** In the array sum, GCC replaces a changing C count with an end-pointer comparison; w1 then holds loaded data and the C decrement has no separate instruction (`arrays.listings.ts:12–17`, `array-addresses.prose.ts:36–38`). The checked pairing correctly preserves that output, but a short local explanation would answer why the register's role changes. Visible four-byte array element boundaries/indices would also make index-to-address conversion easier (`memory.css:35`). Both are low-severity teaching improvements; preserve the real compiler output and avoid inventing a one-to-one mapping. See reader13.

Other small accepted items remain in the ledger: use copying rather than memory-load terminology for register moves, explicitly distinguish original/modified comparison runs, define trace as a noun at first use, name the control for bits, and render the compiler status's code formatting rather than literal backticks. None requires a broad course rewrite.

## Earlier review reconciliation

The earlier English/clarity review held 30 open English findings plus a separate stale front-page status observation. Recent changes resolve L1 (total question moment), L3 (theme-specific line chip) and L4 (premature model-note terminology). The remaining 27 are an existing backlog, not 27 newly reproduced browser failures. Fresh readers rediscovered some; root and sceptic checked important mechanisms in current source. Do not infer that an old issue was fixed because a fresh reader did not mention it.

Old high-value items still needing correction include M1/M2 subtraction operand/full-sum wording, M3 spacing of 64-bit paired stores, M4 misleading equal-input corrective feedback, M5 narrow incoming argument guarantee, M6 hint-heading/content roles, and M7 distinction between C implementation-defined and undefined operations. The new findings extend the same kinds of learner confusion rather than replacing this backlog.

## Reader coverage

| Lesson | Report |
| --- | --- |
| 00 meet-the-machine | [Reader](reader-00-meet-the-machine.md) |
| 01 one-pattern-three-readings | [Reader](reader-01-one-pattern-three-readings.md) |
| 02 constants-and-widths | [Reader](reader-02-constants-and-widths.md) |
| 03 adding-and-the-flags | [Reader](reader-03-adding-and-the-flags.md) |
| 04 subtracting-and-the-tick-counter | [Reader](reader-04-subtracting-and-the-tick-counter.md) |
| 05 masks | [Reader](reader-05-masks.md) |
| 06 shifts | [Reader](reader-06-shifts.md) |
| 07 compare-and-choose | [Reader](reader-07-compare-and-choose.md) |
| 08 branches | [Reader](reader-08-branches.md) |
| 09 counting-up | [Reader](reader-09-counting-up.md) |
| 10 counting-down | [Reader](reader-10-counting-down.md) |
| 11 memory-and-addresses | [Reader](reader-11-memory-and-addresses.md) |
| 12 loading-widths | [Reader](reader-12-loading-widths.md) |
| 13 array-addresses | [Reader](reader-13-array-addresses.md) |
| 14 zero-terminated-strings | [Reader](reader-14-zero-terminated-strings.md) |
| 15 products-and-widths | [Reader](reader-15-products-and-widths.md) |
| 16 division-and-remainders | [Reader](reader-16-division-and-remainders.md) |
| 17 calls-and-returns | [Reader](reader-17-calls-and-returns.md) |
| 18 recursive-calls | [Reader](reader-18-recursive-calls.md) |
| 19 from-c-to-instructions | [Reader](reader-19-from-c-to-instructions.md) |
| 20 compile-a-loop | [Reader](reader-20-compile-a-loop.md) |
| 21 c-and-overflow | [Reader](reader-21-c-and-overflow.md) |
| 22 checked-arithmetic | [Reader](reader-22-checked-arithmetic.md) |
| 23 same-c-on-a32 | [Reader](reader-23-same-c-on-a32.md) |

## Sceptic details

See [sceptic ledger](sceptic-ledger.md) for accept/reject/reduce decisions, baseline overlaps and the corrected reader13 badge observation. [Shared review](shared.md) independently investigates cross-cutting figure roles, write-versus-change labels, temporal captions and compiler formatting. Reports preserve their initial severity; the ledger/summary controls the final severity.
