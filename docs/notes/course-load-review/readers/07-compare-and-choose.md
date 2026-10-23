# Compare, and the signed or unsigned condition

Module 4, first lesson; course position 8 (zero-based inventory order 7), `compare-and-choose`. Review of the shared built snapshot, not an implementation proposal. Read AGENTS.md, CLAUDE.md, the review brief, lesson data and relevant rendering/recorded-program sources.

## Judgment

No confirmed high or medium overload finding. The central compare/condition/select combination belongs together here. The learner has already practised signed and unsigned readings, subtraction flags and no-borrow, register destinations, and writing/testing short assembly. The new work is interpreting those familiar flags with a condition, then using the result to select a register. Requiring this combination is not equivalent to requiring three wholly new mechanisms.

The first prediction asks which part of a compiler listing changes, not for hand execution of an unexplained `csel`. Its local preparation explicitly limits the required fact: “For now, the one fact you need is that `csel` picks one of two registers.” `cmp` is explained before the prediction as familiar `subs` without a register result. This makes the prediction a reasonable hypothesis about the course thesis. It is not enough evidence to call this prediction unanswerable merely because the condition rules come later.

## Prerequisites and novelty

Earlier lessons provide C functions and returns, GCC and its `-O1` setting, argument/return registers, assembly operand order, hexadecimal, 32-bit signed/unsigned readings, top bits, `add`/`sub`/`adds`/`subs`, NZCV, carry/no-borrow and signed overflow, masks, shifts and assembly editor/testing conventions. Module 2's optional overflow example has already displayed `cset` and `vs`; this lesson now explains conditional result production directly. Module 3 has just used a C-type comparison to motivate different compiler instructions, so the opening contrast is familiar in form.

New: `cmp` as subtraction that preserves no result; named signed/unsigned condition rules; `csel` source order and selection without skipping; a broader family of conditions and aliases; C `bool` and the main explanation of `cset`. The conditional C expression is explained on arrival: “`a > b ? a : b` means …”. `bool` is also defined locally. No confirmed unprovided prerequisite needed for a first attempt. `cmn`, `tst` and `ands` are optional notes; none is necessary for either exercise. Branching is not silently assumed: “No instruction is skipped” is explicit.

## Confirmed findings

### Low: the opening task is restated in several complete representations

Location: question section, “GCC compiled `steeper_s` to the three instructions below”, `#ix-steeper-runs`, and prediction `#ix-predict-steeper-change`. The first section gives two complete C functions, a raw assembly block, and a paired listing with both return results. The prediction then repeats that paired listing and both results before the choices. Reproduced in fresh contexts at both widths/themes; initial full-page screenshots and browser text log retain the evidence.

Competing work: identify what is known about the two functions, find the actual response controls, and decide whether the repeated listings describe a new run. Inputs and labels remain consistent, so this is repetition and navigation cost, not a prerequisite gap or contradictory state. It is most noticeable on the phone, where each complete listing consumes another vertical segment before the attempt.

Smallest direction: retain one paired C/assembly/result representation immediately with the prediction and keep only the question's necessary setup before it. Preserve compiler provenance and the signed/unsigned contrast. No need to split compare and select into separate lessons.

### Low: the failure walkthrough repeats the flag display at the same step

Location: `#ix-step-steeper-ge`, after one Next; caption says “with the flags under the registers”, and the expanded stage below says “Flags after the compare”. Both show the same NZCV state, above and inside “1. Compare”. `packages/views/src/panels.tsx` (`CompareBody`) and the shared stepper produce these parallel representations. Evidence: `compare-and-choose-375-dark-step.png`, with equivalent states captured in the other width/theme combinations.

Competing work: read the paired listing/current instruction, inspect register bits and the upper flags, then descend to compare inputs and an identical second flag row. On the phone this puts the upcoming condition/select stages farther from the execution controls. The repeated flags are consistent, so no evidence of state ambiguity or blocked practice.

Smallest direction: let the staged compare explanation carry the flags when that panel is open, or otherwise avoid drawing the same full flag row twice. Keep the input readings and the “No register written” explanation; those carry distinct information.

## Keep

- The investigation's “Compare”, “Condition”, “Select” stages externalise the complete causal chain. On desktop the stages align; on phones they stack in the same order. The chosen source, the unused source and the destination result are individually labelled. Changing `steeper_s` to `steeper_u` visibly preserves comparison flags while changing the rule and source selection. This is useful related information, not arbitrary visual density.
- The first construction asks for a different choice using the demonstrated machinery. It can use the taught unsigned condition with rearranged sources; it does not require memorising the later condition catalogue. Starting with only `ret` makes the learner build the decision, and the successful-solution walkthrough remains locked. Do not replace this with an automatic worked solution before an attempt.
- The failure experiment changes the condition on a clearly named input pair, with its own prediction gate and subsequent stepping. Rules taught on the earlier pair do not spoil this new application.
- The condition explorer initially groups six conditions by equality, unsigned and signed ordering. “Conditions beyond the first six” is closed. Operand reversal is announced explicitly: “The figure below uses `cmp w0, w1`, the reverse of `steeper_s`'s `cmp w1, w0`.” This is an appropriate later generalisation.

## Design recommendations, not confirmed faults

The prose before the condition explorer introduces the additional strict/non-strict conditions even though their figure rows are initially closed. If reducing the reference burden becomes a priority, place those additional rules with that disclosure. The closing exercise asks about four core conditions, so there is no evidence that learners must master the whole catalogue before attempting it.

The generalisation section combines `bool`, `cset`, a compiler's treatment of `if`, and the familiar top-bit shift. It is longer than the core mechanism but mostly compares familiar operations; `tst`/`ands` remain optional. Consider a separate optional compiler-comparison note only if learner observation shows this distracts from the final conditions exercise. Section length alone does not justify a severity finding.

No confirmed answer disclosure before a meaningful challenge attempt. The surrounding taught rules are legitimate preparation. The investigation prose is visible below the first prediction and states the signed/unsigned distinction, but the lesson does not force a learner to read ahead before answering; this is not evidence of excessive novelty.

## Coverage and limits

Read all ten sections, objectives, challenge tasks, model-versus-reality note and program records; inspected `ListingRuns`, `ListingChange`, `ListingDiff`, `ConditionTable`, `SelectStepper` and the compare/condition/select panel implementation. Prerequisite assessment uses only the first seven lessons and stated entry context, not branches or later chapters.

Browser: fresh Chromium context for each 375×900/1280×900 and light/dark preference. Verified actual rendered backgrounds (`rgb(243, 246, 245)` and `rgb(16, 22, 21)`), not just requested preference; document width matched viewport in all four combinations. Initial full-page state; first prediction committed with an intentionally incorrect choice; signed/unsigned investigation toggle; second condition preset and expanded secondary conditions; failure prediction committed, compare step, select step, reset; untouched construction submitted to tests and first hint opened. Opened normal compiler, `cmn`, complete-condition, `warning_light`/`tst`/`ands`, and reflection disclosures. Screenshots cover initial, committed, investigation, expanded condition and stepped states. Scripts/logs/screenshots are `/tmp/course-load-review/compare-and-choose-*`.

Successful construction and its unlocked own-code stepper were source-only; no challenge solution was entered or included here. The final four-condition exercise was read, not answered. Did not invoke external compilers, rebuild, edit application content or run simulator conformance tests. Screenshots are evidence of the tested states, not an exhaustive accessibility or pixel audit. A shared offline-save notice appeared in fresh contexts; no lesson-specific cognitive-load conclusion is drawn from it.
