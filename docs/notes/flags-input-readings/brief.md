# Flags input-reading selector: checked facts

The user approved a three-option control for the starting inputs in section06 of Adding and the flags, and explicitly requested implementation and merge. Hex stays the default. Approved labels: Display inputs as; Hex; Unsigned decimal; Signed decimal. The short same-bits/different-reading note reinforces that the display choice is not an instruction mode or a prediction answer.

## Facts and boundary

- `flags-lesson/model.ts` already obtains each input's hex, unsigned and signed strings from `calculatorReading` and width-normalised bits. The current recorded addition starts with 0x7fffffff and1. Both inputs have their sign bits clear, so their signed/unsigned decimal readings are identical. Format decimal values with the course's comma grouping and minus sign.
- `controller.ts` memoises the recorded32bit model in arm(). Rendering the input expression may read its input properties; it must not expose its result or flags before the prediction gate. The instruction, both decimal range cards and the question retain their meaning.
- Update only the displayed starting-input expression and active button. Preserve draft/checked predictions, feedback, result inspection, selected result reading, revealed columns and focus. The new buttons must be type=button and outside the prediction form.
- The display preference is transient presentation, starting at Hex on fresh load. Clear prediction clears the prediction/inspection but need not discard the current display preference. Existing saved work restores normally; no new store slot or schema change.
- Scope is the pictured section06 input line. The later practice equation is a separate activity and is inspected as a sibling, not silently expanded by this request. Reuse model input readings; do not add an independent arithmetic model or change grading.

## Learner and UI

The learner has already met hexadecimal and signed/unsigned readings and has this lesson's earlier four-bit examples. Goal: remove manual hex conversion while keeping the learner's range prediction. Show the active reading clearly, retain both range cards, and give a short local explanation for the identical decimal values in this particular example. Never display the exact sum or returned bits/flags early.

Use a compact native button group with an accessible label and one pressed option. It must work with Enter/Space and pointer input, remain legible at320/375/834/1280px in actual light/dark and system themes, preserve focus, and contain the equation/controls without page overflow. The input expression can announce changes politely. Follow docs/style.md and visual-language.md.

CLAUDE.md requires a separate learner-copy drafting pass, independent learner/UX and technical reviews in the built lesson, and meaningful verification. Check initial, draft, committed, stepped, clear and restored states. Test real negative/high-bit-set model readings even though the current two decimal modes agree. Preserve the existing assertions, run required checks and exact-head CI, merge, wait Pages and verify the public merged source. Record focused/full failures and skips separately from later passes.
