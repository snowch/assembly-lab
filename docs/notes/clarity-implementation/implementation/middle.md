# Lessons07–14 implementation closure

Changed only matching lesson prose/data/labels, module6 prose-sync test, and canonical modules4–7 prose. No platform edits or commits. Checked-facts brief: middle-brief.md. Authoring/model settings inherited; this is the separate drafting session. Fresh independent review remains required and is coordinated by root.

## Accepted issues implemented

- M4: equal-input failure now reports incorrect returned value and asks about actual source-register contents/overwrite, rather than exchanging equal input values.
- M6: inspected all16 hint ladders. Reworded positive instructions under Common mistake as concrete mistakes; replaced generic Smaller example rungs with checked reduced cases or instruction examples. Array/string ladders already fulfilled roles and are preserved.
- L8: explicitly identify tst/ands examples as course-written assembly; no apparent retraction of GCC statement.
- L9: remove undefined block from branch feedback.
- L10: define trace as recorded instruction sequence; describe instruction limit stopping simulated run.
- L11: give practical possible consequence of C termination permission (compiler may remove loop), without predicting specific other compiler output.
- L12: replace valid object/suitable type with storage for a value of declared type; readable address alone insufficient.
- L13: sensor layout limitation uses already introduced record/fields/storage vocabulary.
- N9: original cs and changed ge outcomes explicitly identify separate runs before describing register state.
- N10: main branch discussion introduces maybe_beep condition/function purpose without requiring optional note.
- N11: generic incorrect-result feedback no longer presupposes a branch or label; directs learner to last write to result.
- N12: move load stepping guidance from store investigation to committed load prediction immediately before its gated stepper.
- N13: all array MemoryStepper figures pass memory.elementBytes:4. Shared_ui owns group rendering/tests; memory.element canonical sample added here.
- N14: explain end-address stopping test replacing C count decrement, then w1 reuse for loaded elements. Compiler listing/source links unchanged.
- S1: every actual prediction card (including listing-change) has prediction role. Challenge figures have exercise role. Passive listings/runs have diagram role. ListingDiff function-choice, BranchListing input choices, condition table and loop-run selections have experiment role. Actual instruction steppers keep stepped model guidance.
- S2 local captions: three compare/branch captions distinguish outlined written registers from flags whose values changed.

## Checks/evidence

- First scoped run:283 tests passed, one canonical-interface failure caused by new shared Element label needing a sample. Added module6 sample + canonical appendix.
- Scoped prose/facts tests covered compare, branches, loops, memory and arrays; no fact changes/failures.
- Follow-up rendering/prose-sync check: see middle-tests-final.log (pending at report creation).
- Formatted owned lesson TS files; review copies synchronised through exact replacements. No raw listing/compiler/output edits.
- Existing facts reused for numeric hints: compare8/8; first iteration dim_up128,2,5 and dim_down128,3; load/store0x12345678; signedf9. Source tests already pin these.

## Review targets

Check prose in lesson order; particularly M4 feedback robustness, C termination permission L11, load guidance placement after commit, array grouping on375px and end-pointer explanation. Root will provide fresh build and independent readers. This author does not claim independent learner approval or completed built-site checks.

## Final scoped result

Follow-up rendering/prose-sync run:141 passed, one vocabulary-gate test caught new `calls beep` before call vocabulary is introduced. Changed that phrase to `runs beep`, preserving established wording. Exact affected suites rerun:59 tests passed across module4/module6 canonical checks and branches lesson tests. Remaining scoped suites passed previously. Added shared elementAddresses canonical line. `git diff --check` on owned files passed. Ready for independent built-site review.
