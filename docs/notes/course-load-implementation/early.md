# Early lesson changes: Modules 1–4

23 October 2026. Separate drafting/implementation pass from the managing session's checked-fact brief. Read the binding repository guidance, style/authoring rules, visual language and the early independent review findings. No lesson ids, stored challenge ids, compiler records, C source associations, allowed instruction families or final synthesis tasks were removed.

## Facts and source checks

- `and`, `orr` and `eor` treat each pair of bits independently (`logic-shifts-masks.listings.ts`, the bit-operation model and existing mask facts tests). The gear occupies bits 4–6. `GEAR_OF` extracts those three bits; its `x0` notation does not require widening the stored field.
- `SET_GEAR` is existing recorded GCC output, already in the model and real-tools corpus. Its model result for the bounded preparation case is pinned in `masks.facts.test.ts`, including preservation of warning bits. The new prediction never shows the implementation's instruction listing.
- The shared `FieldReadingFigure` already computes both the selected field and result from its program/call. Required field prose can therefore accompany that figure after the basic experiment rather than precede the experiment.
- The bit reader computes its readings by writing the chosen pattern through the model. Its default is all zeros. A separate optional scratch instance can start there, with no target pattern or automatically supplied challenge answer.
- `adds` computes N from the result's highest bit, Z from a zero result, C from top-bit carry out and V from differing carry in/out. Existing arithmetic/facts tests hold those rules; the new local reference repeats them beside the independent exercise.
- Complete paired listings remain in the compare/branch lesson figures. Removing prose copies does not alter the recorded source or provenance. Compiler original line references can remain in a closed note without interrupting branch mechanics.

## Changes and learner purpose

1. Masks now offers the three-operation experiment before field/extraction prose. The experiment's choices are only the three basic warning operations; the field explanation is rendered locally immediately before its own computed diagram. Both respect the preceding prediction commitment.
2. A small in-range field-replacement prediction precedes the general assembly construction. It rehearses clearing old field bits, positioning the new field and keeping surrounding warnings. Feedback explains the result only after commitment, then introduces source containment as the additional general-case requirement. The existing unrestricted editor, own-code stepper, graduated hints and post-pass GCC comparison remain.
3. The first bit-pattern construction has an adjacent optional scratch register, initially closed and all zero. Its caption and directions distinguish scratch changes from submitted answers. The earlier investigation remains available; the local support removes the need to scroll back to it.
4. The first independent flag exercise has a compact rule reference. The constants final task lets the visible listing carry its instruction sequence rather than repeating it in prose.
5. Compare and branches retain one paired introductory presentation instead of also printing complete raw C/assembly blocks in the opening prose. The branch source-attribution discrepancy is in the compiler note. Essential branch/label guidance stays in the main path.

Changed prose and labels were synchronised with canonical Module 1–4 records. Both style closing passes were applied to the new text: direct statements, short paragraphs, local essential definitions, meaningful first attempt, one feedback moment, no new architecture claims or worked challenge program disclosed.

## Validation and limits

Focused unit/content tests cover canonical strings, term gates, exact model results, lesson shape, prediction dependencies, initial closed scratch state, field-notation gating and diagram ordering. Earlier test runs exposed stale initial locked-count expectations after gating the field diagram, and the new preparation result needed a number-source pin; those expectations/facts were corrected while preserving their checks. A concurrent Module 0 ordinary-language `carry` term-gate failure was reported to its owner, and shared comparison navigation text appended to the Module 1 lesson record was reported to its owner for relocation rather than weakening the canonical-prose test.

No global build, browser visual audit, external compiler call or native run was performed by this implementation agent. Independent built learner/technical checks, full-suite and real-tools results belong to the managing session's final verification record. This note does not certify learning outcomes or replace the independent review.
