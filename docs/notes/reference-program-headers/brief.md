# Program headers in the reference

Copyright © 2026 Christopher Snow

## Request and learning objective

The author asked whether both courses cover `.text`, `.global reference_example` and `reference_example:`. The local objective is to read the complete prepared example without confusing an assembler directive or a label with an executed instruction. A learner knows simple C and small binary numbers. The reference is available before the native-program chapter.

## Checked facts and existing coverage

- `content/reference-guides/model.ts` generates exactly this header, supplies setup/cleanup, and chooses `reference_example` as the example runner's entry. The header therefore describes the actual program, not an invented snippet.
- GNU assembler `.text` selects the text section; `.global` and `.globl` give a symbol global binding; a label defines a position. Binding does not itself call the symbol or select an executable entry point. Sources: GNU as manual, Sections; Global; Labels. These are assembler/linker facts, not CPU opcodes.
- `content/lessons/branches.prose.ts` already defines a label before branch exercises.
- `content/lessons/from-function-to-executable.prose.ts` already introduces assembler directives, sections, `.global` and linker-script `ENTRY(_start)`. That is Module 12, too late to serve as the only explanation beside a globally available reference example.

## Change

A compact three-line definition list appears inside the existing optional Complete example program disclosure, before its source. It defines the assembler, directives, labels and the selected entry separately. It says the name was chosen for the example and the editor is unchanged. Core lesson prose and all prediction/exercise gates remain unchanged.

The RISC-V companion copy adds its own distinction: the course's supplied linker script selects `_start`, whereas `reference_example` is just an illustrative label. No claims of interchangeable runtime startup or syscall conventions.

## Verification

The existing explained-reference browser flow now checks the three exact header lines and the no-automatic-entry qualification while retaining computed-state, source highlighting, readable code, no overflow, focus, Escape and saved-draft assertions. The parent records final browser/CI and independent review results. These checks establish interface behaviour, not learning effectiveness; no novice study was run.

Author verification on 20 November 2026:

- `npm run typecheck`: passed.
- `npm run build`: passed; existing Rollup annotation/chunk-size warnings only.
- First focused browser command exited 1: four failures from an existing selector now matching both new inline header code and the full source. Narrowing it to `.reference-complete-example pre > code` preserves the original newline assertion.
- Rerun `AL_PORT=4182 npx playwright test tests/educational/explained-reference.spec.ts --reporter=line`: 4 passed, desktop 1280×800 and phone 375×812, light/dark preference flows. No skips. Retained keyboard/focus, saved draft, overflow, model-output and highlight assertions.
- GNU as/readelf: `.text` header assembled; `reference_example` and `alternate_entry` both had GLOBAL binding in the text section. Linking with `ld -e alternate_entry` produced entry `0x400080`, matching `alternate_entry`, while `reference_example` was `0x400078`. This confirms exported-symbol binding and entry selection are distinct. These addresses are verification data, not learner-facing constants.
