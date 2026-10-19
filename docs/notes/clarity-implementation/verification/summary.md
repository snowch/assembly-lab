# Independent verification of the clarity fixes

## Verdict

All accepted findings from the whole-course review and its retained earlier backlog are addressed within the reviewed scope. No accepted correction remains open. The verification also found and closed four small followups: mobile array address readability, one remaining after-state caption, subtraction definitions appearing after their diagram, and missing visible input-state labels in two sibling prediction components.

This verdict combines 24 fresh one-lesson readers, an independent shared-interface/diagnostics checker, and a coordinating sceptic. Reviewers did not author the course changes. They read actual lessons and relevant earlier prerequisites before reconciling the accepted issue list. Model and effort were inherited from the active session; no specific model identity is asserted beyond that. No learner source was edited by reviewers.

## What was checked

Each lesson was checked in real Chromium at 375 and 1280 pixels, light and dark. Final evidence uses explicit raw theme preferences and verifies the actual theme; corrected probe mistakes are disclosed in the affected reports. Readers inspected prose, labels, questions, explanations, feedback, hints, model notes and relevant changed interactions, including prediction gates and before/after states. They checked relevant prior teaching against the front-page prerequisite contract. Some read all earlier prose; others read the passages needed for that lesson. No later lesson was used to excuse a missing prerequisite.

The shared checker verified role assignments for all 48 prediction figures, all 48 exercise figures and five arithmetic diagrams. Real instruction steppers retain their stepping guidance. It reproduced an unchanged-value register write marked Written, grouped hexadecimal input, readable temporal labels, visible initial-state headings, array byte grouping/read highlights and compiler code formatting. Changed assembler diagnostics were checked through actual model calls; the stale front-page claim is gone.

The coordinator checked changed technical claims against recorded programs, simulator behaviour and the repository's named sources. The subtraction sum includes both inputs; paired 64-bit stores occupy adjacent eight-byte regions; AAPCS64's incoming narrow-argument guarantee is distinguished from an executed w-register write; C shift guarantees and GCC extensions are separated; loop-removal permission is expressed as a permitted compiler choice. See [technical evidence](technical-precheck.md) and [sceptic decisions](sceptic-ledger.md).

## Followups closed during checking

- Array element boundaries retain all four bytes. Phone layout uses two internal columns so each hexadecimal address stays whole; desktop keeps four columns. Independent shared checker reran all four configurations after the change.
- The constants caption describes stepping through the instruction, matching the initial, executed and reset states. Original independent reader rechecked all four configurations.
- The subtraction lesson now defines subs and borrow/C before the ring displays them, while each diagram keeps its nearby explanation. Original independent reader rechecked order, gates and arithmetic connection in all four configurations.
- CountPrediction and LoopPrediction now show the same visible before-run heading as RunPrediction. Independent readers checked initial and committed states in counting-up, counting-down and branches on the final build, preserving inputs and gates.

## Builds and limits

Initial checks used production preview4291. The last additive input-heading patch used a separate final production preview4292. Unaffected earlier checks remain valid; affected Count/Loop figures received explicit final4292 checks. Later lesson readers used4292. Individual reports state the actual target and interactions.

This is representative verification of the requested corrections, not exhaustive certification of every input, successful exercise solution, saved state, hint disclosure or accessibility behaviour. Many hints/feedback branches were read in source; each report distinguishes those from actual browser execution. No new whole-ISA differential or external sanitizer/compiler-service run was performed by these readers. Root records automated tests separately; this report does not claim a full check script exit status.

One pre-existing shared listing observation remains outside this correction scope: when a long recursive listing unlocks offscreen, its initial internal viewport can show complete C/notes before instruction rows. The instruction remains named beside the controls and stepping reveals its row. The accepted preset-state wording is correct; this was not treated as a newly introduced clarity regression. See reader18 and the sceptic ledger for the scope decision.

## Lesson coverage

| Lesson | Independent record | Result |
| --- | --- | --- |
| 00 meet-the-machine | [Reader](reader-00-meet-the-machine.md) | Accepted fixes verified; no open accepted finding |
| 01 one-pattern-three-readings | [Reader](reader-01-one-pattern-three-readings.md) | Accepted fixes verified; no open accepted finding |
| 02 constants-and-widths | [Reader](reader-02-constants-and-widths.md) | Accepted fixes verified; no open accepted finding |
| 03 adding-and-the-flags | [Reader](reader-03-adding-and-the-flags.md) | Accepted fixes verified; no open accepted finding |
| 04 subtracting-and-the-tick-counter | [Reader](reader-04-subtracting-and-the-tick-counter.md) | Accepted fixes verified; no open accepted finding |
| 05 masks | [Reader](reader-05-masks.md) | Accepted fixes verified; no open accepted finding |
| 06 shifts | [Reader](reader-06-shifts.md) | Accepted fixes verified; no open accepted finding |
| 07 compare-and-choose | [Reader](reader-07-compare-and-choose.md) | Accepted fixes verified; no open accepted finding |
| 08 branches | [Reader](reader-08-branches.md) | Accepted fixes verified; no open accepted finding |
| 09 counting-up | [Reader](reader-09-counting-up.md) | Accepted fixes verified; no open accepted finding |
| 10 counting-down | [Reader](reader-10-counting-down.md) | Accepted fixes verified; no open accepted finding |
| 11 memory-and-addresses | [Reader](reader-11-memory-and-addresses.md) | Accepted fixes verified; no open accepted finding |
| 12 loading-widths | [Reader](reader-12-loading-widths.md) | Accepted fixes verified; no open accepted finding |
| 13 array-addresses | [Reader](reader-13-array-addresses.md) | Accepted fixes verified; no open accepted finding |
| 14 zero-terminated-strings | [Reader](reader-14-zero-terminated-strings.md) | Accepted fixes verified; no open accepted finding |
| 15 products-and-widths | [Reader](reader-15-products-and-widths.md) | Accepted fixes verified; no open accepted finding |
| 16 division-and-remainders | [Reader](reader-16-division-and-remainders.md) | Accepted fixes verified; no open accepted finding |
| 17 calls-and-returns | [Reader](reader-17-calls-and-returns.md) | Accepted fixes verified; no open accepted finding |
| 18 recursive-calls | [Reader](reader-18-recursive-calls.md) | Accepted fixes verified; no open accepted finding |
| 19 from-c-to-instructions | [Reader](reader-19-from-c-to-instructions.md) | Accepted fixes verified; no open accepted finding |
| 20 compile-a-loop | [Reader](reader-20-compile-a-loop.md) | Accepted fixes verified; no open accepted finding |
| 21 c-and-overflow | [Reader](reader-21-c-and-overflow.md) | Accepted fixes verified; no open accepted finding |
| 22 checked-arithmetic | [Reader](reader-22-checked-arithmetic.md) | Accepted fixes verified; no open accepted finding |
| 23 same-c-on-a32 | [Reader](reader-23-same-c-on-a32.md) | Accepted fixes verified; no open accepted finding |

Shared evidence: [shared technical checker](shared-technical.md). Full acceptance/rejection and followup rationale: [sceptic ledger](sceptic-ledger.md). Temporary screenshots/scripts are evidence artifacts, not tracked course content or an answer guide.
