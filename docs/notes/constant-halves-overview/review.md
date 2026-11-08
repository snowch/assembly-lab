# Constant halves overview: implementation and checks

## Learning and layout decision

Keep the existing model, worked program and fresh construction challenge. Opt the two figures on Building a constant into a compact display of the same w0 state. Its two 16-bit slices stay beside each other on phones and desktops; the existing nibble/bit display is optional detail. Width, bit positions and Written/Kept words supplement solid/dashed outlines. The initial view has no write mark. The instruction listing, current-state label, controls and live status still identify the moment being shown.

The checked-facts brief precedes implementation. GPT-6.1 Sol at Medium effort separately drafted the labels, shorter introduction, caption and solved-work guidance. The managing session retained the existing upper/lower labels and made bit ranges separate labels rather than repeating the half name. Essential movk placement syntax remains visible before the figure, and the arithmetic procedure remains beside the later exercise. Both sentence and whole-idea style passes were applied. The duplicate written-out worked values were removed; the figure computes them instead. Canonical Module 1 prose was synchronised.

The visible route teaches the mechanism without opening individual bits. Optional detail changes only the representation, never execution or learner answers. The exercise and its hint/solution gates retain their existing programs and grading. The prior detailed w16 and 64-bit modes retain their default layout.

## Write semantics correction

Inspection found that halves16 inferred movk's selected half by comparing values. An identical write could therefore be marked kept. It now uses the decoded shift field to identify the written half. Five regression cases cover identical shifted and unshifted movk writes, identical whole writes, another register and a 64-bit movk outside the displayed low 32 bits. This aligns the marks with the existing simulator and official Arm MOVK semantics checked in the preceding reviews. No instruction semantics or corpus programs changed.

## Checks before CI

- Strict TypeScript checking and production builds passed.
- Initial focused unit command: eight files passed; the facts inventory failed because it still required two hexadecimal strings removed from prose. No model result changed. The inventory was updated to match the removed text, retaining its numerical model checks.
- Focused rerun: ten files, 178 tests passed, including the half-write regression, compact/detail state synchronisation, existing detailed/64-bit figures, facts, canonical prose and pacing.
- Production browser regression: 22 desktop/phone cases passed, covering worked stepping, bit disclosure keyboard operation, mobile layout, solution gating, alternative passing programs and restored work. Theme checks in this command cover the prior detailed figure; the independent reviews check the compact display in both actual themes. Full CI/publication evidence is recorded in the pull request.

Separate GPT-6.1 Sol High learner/UX and Extra High technical reviewers inspect the built lesson, prerequisites, sources and affected states without drafting the change. Their results must be resolved before merge. Agent checks are not observed novice learning. No screen-reader user study or physical hardware execution is claimed.
