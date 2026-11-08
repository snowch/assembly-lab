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

## Full-suite touch-target finding

The first push CI completed with 188 unit files / 3243 unit tests passing, then 1425 browser cases passing, 20 existing skips and one phone layout failure. The new native disclosure summary was 28 pixels tall, below the existing 40-pixel control minimum. The initial focused browser selection did not include that broad post-interaction layout case, and both reviewers missed the size. This is a product defect, not a stale expectation.

The correction gives the summary a minimum height of 44 pixels and padding while preserving its native disclosure marker and keyboard behaviour. The worked-example browser case now measures its minimum target size explicitly; the existing design assertion remains unchanged. Recheck the broad page-layout cases alongside the state/gate regressions and obtain independent targeted browser verification before merging. Final rerun and publication evidence is recorded in the pull request.

The rebuilt focused browser run passed 28 cases across desktop and phone, including all three broad layout cases per viewport. The learner/UX reviewer independently measured exactly 44 pixels in closed/open/reclosed states at 1440 by 1000 and 390 by 844 in actual light/dark themes. Native list-item markers, Enter/Space toggling, visible focus and zero overflow were preserved. The technical follow-up and final CI outcomes are recorded in the pull request.
