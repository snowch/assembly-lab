# Carry-flag preview

User-approved scope: replace the repeated closing explanation after the four-place width diagram with a brief preview linking to Module 2. Do not add a flag exercise or repeat the carry visualisation.

The learner has followed four-bit carrying and the width boundary. The preview names C as a one-bit carry flag and distinguishes Arm `adds` from `add`; detailed flag use stays in Module 2. It explicitly refers to an Arm register's width, rather than treating the four-bit miniature as an Arm register.

Facts checked against `packages/machine/src/run.ts` (`addWithCarry`), the existing `adding-and-the-flags.prose.ts` and its executable facts tests. The canonical draft is synchronised. A separate agent drafted the change.

`flag` is now first defined in this lesson's vocabulary metadata. The existing named-before-taught mechanism permits this specific forward preview of `adds`; editor instruction availability still starts in Module 2. Existing gate tests explicitly verify that distinction.

Focused verification: 55 tests passed across the four-bit lesson, instruction introduction and addition-flag facts files. Formatting, diff checks and production build passed. Independent review covers the rendered paragraph and its link at phone/desktop widths in both themes. Full checks also run on the PR; their status must not be inferred from these focused results.
