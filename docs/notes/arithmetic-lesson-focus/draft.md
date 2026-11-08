# Separate prose draft

This drafting pass read the checked-facts brief, `CLAUDE.md` and `docs/style.md`. It changes only the arithmetic lesson copy, the result-card strings and their exact canonical duplicates. It does not change model behaviour or interaction state.

## Decisions

- Remove `boundsTitle` and `bounds`, including the duplicate JSON entries. The removed general rules, explicit limits and later-lesson link have no replacement section.
- Keep `contract`, the return-zero question and its reasoning unchanged. The managing pass places the contract beside that closing question.
- Say “This negative result fits int.” beside the signed result. This makes the case-local validity explicit without introducing the later overflow term.
- Define unsigned wrap through the low result bits and their unsigned reading. This draws on the preceding four-bit calculation, adds no numerical range, and keeps the C guarantee distinct from the trip result’s meaning. Retain the qualification that the value can be valid in another calculation.
- Keep the no-type-tag explanation and no-automatic-warning statement unchanged.
- Narrow the compiler note’s C reference to the retained unsigned arithmetic rule, N3096 section 6.2.5 paragraph 11. The removed signed-arithmetic rules no longer need their section 6.5 reference here.

## Draft checks

Both closing style passes were applied to the revised strings in their source context. The retained-bit explanation connects the existing calculation to the returned value; the practical question still asks for the check before subtraction. The draft adds no numeric results, range limits, controls or C behaviour examples.

Source checks confirmed that `docs/sources.md` names N3096 section 6.2.5 paragraph 11 for unsigned arithmetic. The model/results claims use the checked facts in this task’s brief. A script confirmed the exact canonical call-comparison block matches its source file, and the deleted bounds fields are absent from the lesson copy. The canonical compiler reference and result strings match their source copies. `git diff --check` passed.

This is a drafting record, not an independent verdict. No browser checks or test suite were run in this pass. The managing pass owns final integration, tests and independent learner/technical review. Historical validation notes are unchanged.
