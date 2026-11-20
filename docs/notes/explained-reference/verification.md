# Verification record

Copyright © 2026 Christopher Snow

Functional checks and independent agent reviews are evidence of implementation behaviour, not evidence of learning effectiveness. No human novice or screen-reader study was run.

## Initial failures and supported corrections

- First root focused unit run:330passed/1failed because author scenarios changed after generated native fixtures were written. Final fixture regeneration and focused rerun:331passed. This does not change the first run's status.
- Initial typecheck ran while separate UI-copy drafting was incomplete and failed on missing reading/more-example labels. The completed copy file and subsequent typecheck passed.
- First focused browser run:6passed/4failed. New error-help tests exposed that encoding rules remained below the initial viewport. Independent learner and technical reviewers confirmed the actual encoding bullet was below the fold. Reordered the immediate bound first and added drawer-only scrolling beneath a sticky search/header. Keep focus on the visible search field and preserve page position.
- Independent learner review found complete-program highlighting put the following label on the same visual row. Moved the newline outside the inline highlight and retained original short local-label names in the teaching listing.
- The complete-program code inherited two font scales (10.32px). Removed nested scaling, preserving12px in the optional listing.
- Independent technical review found an unconditional claim that non-writeback memory forms leave the base unchanged. Loads may also use their base as destination. The correction distinguishes address writeback from destination writes.

## Native and focused evidence

The final scenario corpus covers83 instruction names,176 form groups and275 independent examples. GNU/QEMU differential execution:275calls,2143instruction states,zero differences. Invalid operand examples are checked against the model and GNU acceptance. Native corpus equality tests pin every displayed scenario and selected memory size to its checked source.

Final built browser reruns, independent corrections and complete exact-head CI/publication are recorded as they finish (the final PR records CI and publication results without changing the verified code tree).

## Corrections verified before full regression

- Corrected-model/target/family focused checks:343passed across8files. The extra memory overlap cases and extension/bitfield target cases are included.
- Final core browser rerun:10passed across desktop/phone projects and actual light/dark. It verifies entire encoding bullet within the viewport, not merely the top of its list.
- First drawer-scroll correction still failed4newcases (6existingchecks passed): its animation frame ran before matching search state committed. Added the committed lookup dependency, then independently verified the exact encoding rule in812px viewports with search focused and the underlying page unmoved.
- Full prepared code now preserves original short label spellings and the newline following its inline highlight. Optional code and highlight render at12px; memory content labels include access size and remain distinct from label addresses.
- A final learner-review gate-error case found that scrolling to an operand form could hide the instruction-disallowed warning. Gate errors now land at the instruction entry, keeping that warning visible; operand errors retain their form-specific landing.

All displayed native example programs remain unchanged by these presentation/prose corrections. Final exact-head CI and public release checks are recorded in the PR validation record.

Final gate-aware focused browser rerun:10passed. It includes four size/theme workflows for both the original invalidADD constant and a valid MOV excluded by the elapsed exercise. Operand errors expose the encoding rule; gate errors retain the explicit instruction-limit warning.
