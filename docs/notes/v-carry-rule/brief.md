<!-- Copyright © 2026 Christopher Snow -->

# Visible signed-overflow carry rule

## Learning and interface brief

The user asked to evaluate clutter in the signed-range pane, preview the recommended arrangement, then resume. Keep section 03's range explanation unchanged. Strengthen the existing section 04 comparison beside its carry diagram rather than adding another pane.

Outcome: given a fresh addition and its top carries, determine V and explain whether the exact signed sum fits. Defer XOR and circuit implementation to the existing optional disclosure.

Preparation: Module 1 teaches the leftmost bit's signed meaning, four-bit ranges, column addition and carrying. This lesson introduces V's signed-range meaning before section 04. Familiarity with carrying does not demonstrate the learner can use the two top carries to determine V.

Checked facts: `flagsModel` takes `carryIn` and `carryOut` from the highest column, with flags from `fourBitFlags` or the real 32-bit trace. Existing example (7,1) has different carries and V set; (15,1) has matching carries and V clear. The existing `strings.logic.ts` and canonical `adding-and-the-flags.prose.ts` explain this same carry criterion. See the existing flags-logic technical review and `docs/sources.md` for Arm AddWithCarry provenance. This change does not claim a physical CPU circuit implementation.

Likely misconception, still a hypothesis: any outgoing carry means signed overflow. The existing C-only example demonstrates outgoing carry with V clear; V-only demonstrates V set with C clear. The fresh four-bit exercise and real 32-bit cases provide independent application, though their answers alone cannot establish carry-based reasoning. A novice test should ask for that explanation on a fresh example.

Visible route: signed range and worked example, then the highlighted carry rule beside the existing model-generated top carries and dynamic verdict, then fresh practice. Keep all definitions visible before use and outside optional disclosures. Keep both carries, the bits and verdict together. Preserve presets, their current default, prediction gates and storage. No new controls, pane or XOR terminology.

Separate drafting pass: agent `carry_copy` read the repository guidance and suggested the exact highlighted rule and sign-bit definition. Use those sentences; retain the existing comparison headings rather than adding another heading. The caption defines the sign bit directly.

Evidence before implementation: screenshot supplied by user, live source and earlier production-review records. No fresh browser inspection yet; final build requires phone/desktop and light/dark checks. This is expert design work, not observed novice learning evidence.

## Final validation

- Scoped Prettier check, copyright check and `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npx vitest run packages/views/src/flags-lesson content/lessons/adding-and-the-flags.test.tsx`: 5 files, 50 tests passed; no failures/skips.
- `npm run build`: passed, with existing third-party annotation and chunk-size warnings.
- `AL_PORT=4175 npx playwright test tests/educational/flags-lesson.spec.ts`: 42 passed in 2.7 minutes; no failures/skips. This is the complete flags lesson browser file, not the repository-wide suite.
- Independent learner/interface and technical browser review: no blocking findings; see `review.md`. Screenshots/evidence cover 320, 375 and 1280px in light/dark, keyboard controls and all four presets.

No subsequent product edits followed the built-site checks. No full repository check, QEMU rerun, novice study or assistive-technology testing was performed for this wording/style change. Changes remain local; no commit, push or publication was performed.
