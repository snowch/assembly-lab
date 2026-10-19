# Course clarity fixes

Implementation of the [whole-course review](audit/summary.md), requested on
18 October 2026. The archived review describes the starting snapshot, `6d757f5`;
its statements that files were unchanged refer to that review, not this implementation.

## Scope

The work includes all accepted findings in the [sceptic ledger](audit/sceptic-ledger.md)
and [shared review](audit/shared.md), plus the unresolved findings retained from the
[first English review](../english-review/README.md) and
[second clarity review](../clarity-review-2/README.md). Already resolved L1, L3 and L4
are preserved rather than reopened. Rejected findings are not implementation tasks.

| Area | Accepted findings |
| --- | --- |
| Activity guidance | S1: prediction, calculation, experiment and exercise guidance must describe the actual controls |
| State and presentation | N1, N4, N6, N7, N8, N9, N18; S2/S3: identify inputs, moments and runs; distinguish writes from changes |
| Local sequence and definitions | N5, N10, N12, N15, N16, N17, N20: explain the relevant operation beside its figure and before requiring it |
| Controls and feedback | N2, N3, N11; S4: name actual controls, accept taught number notation, match submitted code, render code formatting |
| Compiler transformations and diagrams | N13, N14, N19: show array elements, explain register reuse, distinguish register copies from memory loads |
| Technical explanations | M1, M2, M3, M5, M7; L2, L11: subtraction, stack spacing, argument widths, C guarantees and flag wording |
| Hints and corrective feedback | M4, M6; L9, L14, L15, L16: hints fulfil their headings and feedback describes the actual failure |
| Remaining references and terminology | L5–L8, L10, L12, L13, L17, L18, 06-N1 |
| Diagnostics and front page | L19–L22 and the separate stale module-status observation |

## Process and verification

Separate drafting agents worked from checked facts and the accepted correction directions.
The canonical prose records remain synchronised with the lesson text. Independent
readers inspected one lesson each in the built site at phone and desktop widths, in
both themes. Technical review checked the changed claims and shared behaviour.
The platform copy, compiler records and checked source associations are preserved.

All accepted findings are implemented. The [independent verification](verification/summary.md)
records 24 fresh lesson reviews, shared-interface checks and sceptic decisions, including
the four follow-ups below. No accepted finding remains open. These checks cover the
requested corrections and representative interactions; the verification report states
their limits and a separate, pre-existing long-listing observation.

Formatting, copyright, platform integrity, TypeScript, all 2,747 unit/integration tests
and the final production build passed. The full browser run reported 1,018 passes,
23 skips and three failures. All three failed cases pass focused reruns after correcting
two obsolete expectations and an exact subpixel-position assertion. The original full
command exited 1; it was not rerun in full. See the [automated check record](verification/automated-checks.md)
for the commands, final-source coverage and repeat results.

Implementation records and checked briefs:

- [Lessons 00–06](implementation/early.md) and [facts](implementation/early-brief.md)
- [Lessons 07–14](implementation/middle.md) and [facts](implementation/middle-brief.md)
- [Lessons 15–23](implementation/late.md) and [facts](implementation/late-brief.md)
- [Shared interface](implementation/shared.md) and [facts](implementation/shared-brief.md)
- [Diagnostics and front page](implementation/diagnostics.md) and [facts](implementation/diagnostics-brief.md)

## Corrections during independent verification

- Array elements retain their labelled four-byte groups. On phones, each group uses
  two columns so addresses remain readable; desktop groups use four columns.
- The constants caption now tells the learner to step through the instruction,
  instead of describing its after-state while the figure still shows the input.
- The subtraction lesson introduces `subs`, borrow and its C flag before the ring
  displays them. The ring explanation remains beside the ring; the addition mechanism
  remains beside the arithmetic diagrams.
- The visible input-state heading also covers instruction-count and loop predictions,
  as well as arithmetic predictions. Checking an answer retains the labelled starting
  registers while the outcome reports the run's result.

These follow-ups preserve prediction gates, computed values and instruction order.
