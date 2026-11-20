# Logical, shift, bit-field and extension guides

Copyright © 2026 Christopher Snow

## Separate drafting pass

Drafted from the checked brief, the original instruction catalog, the assembler form readers and docs/style.md. This pass owns only logic.ts and its focused semantic test. The global UI and independent reviews are separate work.

Covers25 instruction names,49 named forms and53 independent executable examples. Every original catalog syntax string remains represented. Shifted logical-register inputs and the unsigned extensions' alternate x destination spelling receive separate advanced forms.

## Teaching decisions

- Plain register and immediate forms come first. A shifted logical input is separate advanced material; it does not lengthen the basic register explanation.
- Logical examples use hexadecimal readings to show the selected bits. Flag-setting forms also watch NZCV; TST has no invented destination.
- Immediate-mask restrictions distinguish register capacity from operand encoding. The zero-mask rejection is checked with the parser, including BIC's complemented-mask diagnostic.
- Standalone shifts show a fixed amount, its largest accepted w amount, and a register amount whose low bits select the same shift as the fixed example. ASR uses a signed negative input; LSR uses an unsigned positive input. ROR visibly retains rotated bits.
- Field examples distinguish extract/insert, preserved destination bits and sign filling. SBFIZ uses a negative four-bit field, so high-bit sign filling is visible.
- Extension examples prepare non-zero input bits above the selected field. Separate W and X signed results expose upper-half clearing versus full sign extension. The alternate X spelling of UXTB/UXTH is explicitly described as the same W write.
- Examples use w8–w10/x8–x10, independently prepared. They neither read challenge data nor present exercise solutions. x28 remains reserved for the supplied return scaffold.

## Sources and limits

- packages/machine/src/forms.ts: logicHandler (601 onward), shiftHandler (702 onward), fieldHandler (735 onward), extendHandler (756 onward).
- packages/machine/src/regs.ts: logical-immediate pattern acceptance and register names.
- content/instruction-quick-reference.ts and its already checked official reference catalog: retained operation scope and syntax.
- The browser model computes before/after values. GNU/QEMU corpus generation and independent technical review belong to the parent integration pass.

## Checks completed in this drafting pass

- A standalone model sweep assembled and ran all53 complete scenarios to a normal return. It checked all45 rejected examples against their exact diagnostic keys. No failures.
- npx vitest run content/reference-guides/logic.test.ts:5 tests passed. These check original syntax coverage, all example and error scenarios, logical source preservation, low-bit variable shift semantics, field placement/sign effects, and narrow/wide extension behaviour.
- Prettier passed on the authored TS files.
- The initial concurrent repository typecheck reported missing control.ts and memory.ts, which were still being authored by other sessions. It reported no errors in this family. This attempt is not reported as a passing whole-repository typecheck.

No browser, physical-device, screen-reader or novice learning study was performed by this drafter. Before/after output is intended as optional reference evidence, not a substitute for the course's required teaching sequence.
