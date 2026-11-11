# Instruction context above the carry calculation

11 November 2026. The author missed the assembly instruction when it appeared only in a small
caption. The figure now shows its selected instruction at the top, before the carry rows and
any result summary. A short line identifies the source operands, destination and flag effect.
The caption is shorter. The header remains stable while columns are revealed.

The learning-design pass used `.agents/skills/learning-design/SKILL.md`. The observable goal
is to identify the instruction and connect its sources, destination and flags to the displayed
calculation. Operand roles were practised in Module 0; bit weights and the carry rule were
practised in Module 1. The existing fresh flag exercises remain the independent application.
This change adds no controls, arithmetic rules or assessment answers. Its discoverability
benefit is a hypothesis supported by the author's observation and browser reviews, not a
novice study or proof of learning effectiveness.

The header reads `step.text` from the same model step as the carry record. Its explanation
uses the parsed instruction's operands and flag-setting operation. Only the plain 32-bit,
three-general-register form receives the operand explanation. Aliases, immediate operands,
shifts that change a source, zero-register operands and other widths retain the exact
instruction without an inapplicable explanation. Subtraction keeps its operand order.
Flag-setting is read from the parsed operation, not inferred from whether flag values changed.
The panel uses theme tokens, normal label text and monospace code, without an execution arrow
or the highlight meaning “just executed”. Existing prediction and challenge gates apply before
any header renders.

The shared component covers both addition figures in the published M2, L1 and all three
subtraction figures in M2, L4, “Subtraction flags and negation”. Source lessons are split by
`pacing-1-4.ts`; the subtraction figures are not on the published tick-counter page. Both
canonical prose and the changed caption are synchronised.

A GPT-6.1 Sol Medium drafting agent supplied the strings from checked facts. Separate Sol High
learner and Sol Extra High technical reviews assessed the built lessons and model. Findings
and final verification are recorded in the pull request, including any unresolved limitation.

Root focused checks passed six files and 207 tests. The initial typecheck found a TypeScript
narrowing error in the new guard; using a local operation binding corrected it and the next
typecheck passed. The first browser probe targeted the unsplit tick-counter route and was
stopped while waiting for an absent figure. The corrected probe used the actual published
subtraction lesson and passed all six viewport/theme cases: 360, 375 and 1280 pixels, light
and dark. Checks covered initial gates, committed state, the unchanged header through column
steps, Show all, Reset and reload, displayed flags, source/destination text, subtraction order,
header-before-summary ordering and no page overflow or browser errors. The instruction is
18 px in every measured case. These are automated browser checks; screen-reader testing and
observation of a new learner were not performed. Full-suite results, exact-tree CI, merge and
public deployment verification are recorded separately in the pull request.
