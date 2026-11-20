# Verification

Copyright © 2026 Christopher Snow

Separate drafting and independent learner/technical reviews are recorded beside this file. All findings are closed. The new explorer is independent of the fixed subtraction worked pair and later prediction gates.

## Arithmetic and saved state

- Arm: five focused unit/component tests passed. Every starting reading and both directions agree with an independent integer oracle; repeated full turns keep a maximum of five readings. The existing exhaustive fixed-interval checks remain intact.
- Independent Arm GNU/QEMU execution emitted all 32 result/marker pairs and agreed with the bundled machine-backed model. The technical review records tool versions, native source and byte comparison.
- RISC-V: all 50 unit/integration tests passed. The new `test:counter` corpus compares all 32 operations against actual GNU/xv6 and independent QEMU execution, with no failures. CI runs it after installing QEMU.
- Both versions preserve their legacy displayed reading and history without rewriting legacy storage during render. New bounded history is stored separately on action; invalid and sparse histories fall back safely. Reset only changes this miniature. Other drafts, committed predictions and native observations are preserved.

## Browser checks

- Final Arm focused run: 12 passed across desktop/phone, both themes and explicit 320px cases. The cases cover both boundaries, continuing beyond them, full turns in both directions, labels from the last operation, decimal beneath bits, controls below the whole result, keyboard focus, restore/reset and independent elapsed-prediction state.
- Final RISC-V focused run: 10 passed, including live native/project isolation, legacy migration and blocked/corrupt storage. The final qualified feedback copy was rebuilt and rechecked.
- Independent learner review: 16 course/width/theme contexts across 320/390/1280/1440px, with actual theme colours checked. Both controls stayed at their own original coordinates, remained 44px high and below the readable display. No page overflow or runtime errors.
- Independent technical browser review: 12 course/width/theme contexts; correct carry/borrow reversal, bounded trail and complete turns, zero control movement. A suspected movement caused by the review harness taking a screenshot before measuring was rejected after document and scroll coordinates were compared.

Initial failures remain recorded separately: the first Arm focused run passed six and failed two because feedback's inherited line height exceeded its reserved height by 1.59375px; an explicit matching line height fixed that movement. The next run passed eight and failed four because a new theme assertion inspected a nonexistent CSS variable; it was corrected to compare actual body colours. The final run passed all twelve. RISC-V's first focused run passed six and failed four due to a new assertion assuming uncommitted prediction text survived navigation; existing app behaviour does not promise that. The corrected tests preserve the meaningful before-reload and Reset isolation checks; the final ten passed. No product persistence contract was weakened.

The first full local Arm check stopped at formatting four untracked review JSON artifacts. Their data was preserved and formatted, then the exact check script was restarted. Full exact-head CI is the merge gate; distinguish that complete run from any interrupted local run. Final source formatting, copyright and type checks passed before submission. RISC-V asset checks verified all 26 pinned assets.

## Limits

These are model/source/functional checks and independent agent reviews, not a novice learning study. They do not establish learning effectiveness. The four-bit explorer is explicitly a teaching view; it does not claim a four-bit architectural register, reverse a real timer, or execute the learner's editor program.
