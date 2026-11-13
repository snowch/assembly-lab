<!-- Copyright © 2026 Christopher Snow -->

# Optional flag logic copy: drafting pass

Drafted only the optional section beneath section04's selected comparison, from the checked facts in `brief.md`, the existing `flags-lesson/strings.ts` context, `CLAUDE.md` and `docs/style.md`. Suggested copy is in `/workspace/scratch/flags-logic-copy.ts`; no product files were edited in this pass.

Use the disclosure summary as the visible title; `title` can name the diagram for accessibility without adding another visible heading. Keep the limitation, A/B/R legend and full-adder explanation beside the drawing. The flag rules can label their signal paths. Place `xorDefinition` and `norDefinition` by their gates. `xorWhy` and its short positive/negative explanations belong beside the optional visual. They explain why the carries differ rather than repeating the V rule. They remain within the outer disclosure, so the required lesson does not gain another reading step. The positive/negative statements use generic top-bit identities, not selected-example result values.

`diagramDescription` uses the selected model's input/result bit strings, carries and flags. `{carries}` lists column carry-outs from the lowest bit upwards; the renderer must make that convention explicit in its interpolation or use a more detailed per-column description. No selected-example results are supplied by this draft. Literal truth values in gate definitions describe the rules, not an example's answer.

The brief's NAND correction belongs in the direct response to the user's question. The section introduces only the XOR and NOR gates it draws, so it does not need another gate definition. The explanation ties unequal top carries to the same-sign/opposite-result-sign overflow condition, then traces the two overflow directions through the sign-bit addition. It makes no claim about Arm's physical implementation.

Both style closing passes were applied to the proposed section: sentences and definitions first, then the order from inputs through addition to flags. This is a drafting record, not an independent review or a built-site verification. Browser review and technical verification remain with the implementation pass.

## Contained scrolling follow-up

Suggested visible cue: “Scroll sideways to see the full diagram.” Show this only when the diagram exceeds its contained viewport. Suggested accessible region label: “Flag logic diagram”. The label identifies the content; the visible cue explains the available action. These are copy suggestions only; this pass did not edit the product or verify keyboard scrolling.

The implementation pass also tightened the sign explanation to compare sign bits, described the zero-sign input case as non-negative, and expanded the diagram's FA abbreviation. These changes preserve the brief's generic overflow condition, including a retained result of zero after negative overflow.
