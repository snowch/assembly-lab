# Checked facts and editing scope: lessons 07–14

Objective: learners can connect a particular run and memory/register state to the correct instruction, and use hints without reversing their meaning. Prior knowledge: Modules0–3 register widths, bit operations, flags; each subsequent lesson may assume only earlier lessons. Use docs/style.md, preserve gates and real compiler output.

Sources checked: CLAUDE.md, docs/authoring.md/style.md; full audit summary and sceptic ledger; retained English-review and second-review records; lesson prose/data and arrays.listings.ts. Existing canonical prose tests require word-for-word agreement.

- compare-and-choose: cmp/csel allowed programs may overwrite source contents; a failed equal-input test establishes incorrect returned value, not wrong choice between still-equal source values. Modified ge and original cs examples run separately. tst/ands examples are course-authored, whereas warning_light listing is recorded GCC output.
- branches: starter has no branch. Generic result feedback must not claim a branch executed. Labelled groups are taught but block is not. maybe_beep setup is currently only in optional note; main comparison needs minimum visible setup. Existing boundary examples describe -10 and zero litres.
- hint headings fixed by platform: concept, common mistake, smaller example, part, answer. Keep platform unchanged. Inspect all16 ladders; change only mismatching second/third hints. Reuse already pinned values/examples (8/8 conditions; dim128,2,5; dim128,3; memory78/56/34/12; gradientf9).
- counting-up: simulator records a bounded sequence of instructions, conventionally trace. Define that term before counting-down uses it.
- counting-down: C N3096 6.8.5p4 permits assumption of termination under stated conditions; does not require other compilers to retain infinite execution. Explain possible removal without claiming another compiler's specific output.
- memory: existing prediction unlocks load stepper before investigation. Put load guidance after committed prediction beside that stepper; investigation teaches store. C access requires appropriate existing storage/type; pointer readability alone insufficient. Sensor byte layout deliberately fixed for exercise, no structures/allocation prerequisites needed.
- arrays: recorded sum_trips computes end pointer once from incoming w1 count; ldr later writes element to w1; cmp compares moving x2 with end x3, replacing source C decrement. Keep compiler/listing/source associations unchanged. Array elements four bytes; shared_ui will add memory.elementBytes grouping prop.
- predictions: actual cards in these eight lessons get role prediction, including listing-change; actual steppers retain instruction guidance. No hint answers exposed before learner opens hints.

This implementation agent is a separate drafting session from the coordinating review session; model/effort inherited. Independent fresh reader/checker stage follows.
