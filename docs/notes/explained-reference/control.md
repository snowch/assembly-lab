# Conditional, product and control-flow reference drafting

Copyright © 2026 Christopher Snow

## Scope and checked facts

This separate drafting pass covers the31 assigned browser instruction names: conditional selects and aliases, products and division, direct/conditional/register branches, returns and nop. It contains32 form groups,47 independent displayed-instruction examples and32 rejected-operand examples. Every syntax string declared for these names in the existing catalog remains present.

Read the checked implementation brief, reference-guide types, the current instruction reference, repository authoring/style guidance and parser handlers in packages/machine/src/forms.ts. Existing official sources remain linked by the catalog. Parser checks cover matching widths, allowed register roles, condition aliases, immediate bit positions and branch alignment. Observed values come from running the model rather than prose arithmetic.

## Drafting decisions

- Conditional aliases prepare a distinct destination value before the test, so a false CSET/CSETM visibly writes zero instead of merely leaving an already-zero display.
- Conditional selects and aliases demonstrate both outcomes of ne using separately prepared comparison flags. They show that the instruction reads existing flags and preserves both input registers and the flags.
- Widening products use inputs whose product needs more than32bits. Signed and unsigned high-product examples use the same input bits to demonstrate different interpretations.
- Division includes an ordinary quotient and a separate zero-divisor example. Signed quotient readings expose truncation towards zero.
- Conditional branches demonstrate taken and not-taken paths. Prepared targets skip an intervening instruction. PC is observed as well as the tested register or flags.
- Calls show the return-address register write. Return forms show the default x30 and an explicit named x register separately. The examples prepare safe local return targets; they do not imply that ret fetches from memory or the stack.
- Essential operand widths and conditions remain visible; architecture displacement limits and alias details are optional advanced rules. No exercise solution, test input, expected answer or learner artifact was accessed.

## Verification and original failure

Focused command: `npx vitest run content/reference-guides/control.test.ts`.

Initial run:82passed,2failed. All47 prepared scenarios returned and all32 rejected operands produced their stated error keys. The two semantic assertions read stateAfter as a step count; its API takes an inclusive step index. Corrected the test helper to use focusIndex−1 before and focusIndex after. Passing rerun:84tests. The final destination-preparation refinement also passed all84 focused tests. The original failures are test-helper failures and remain separate from the successful rerun.

The focused checks also assert conditional-select flag preservation, signed/unsigned high-product results, taken/fall-through PC selection, call resume-address writes and both return targets. Full before/after rendering and native GNU/QEMU corpus verification are handled by the common model/corpus pass. This drafting pass has not performed a learner study or a browser accessibility audit; independent review is still required.
