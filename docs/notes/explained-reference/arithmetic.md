# Arithmetic and move form drafting

Copyright © 2026 Christopher Snow

## Scope and drafting facts

Separate drafting pass for `content/reference-guides/arithmetic.ts`, following the checked brief, CLAUDE.md and docs/style.md. Covers add/adds/sub/subs, cmp/cmn, neg/negs and mov/movz/movn/movk: 12 instruction names,36 form groups,70 independent valid scenarios and40 rejected operand examples.

Checked the original `content/instruction-quick-reference.ts` and official form links in `content/instruction-reference-catalog.ts`, then the actual browser parser:

- `packages/machine/src/forms.ts`: addsubHandler, shiftedSource, mov, immediateMove and wide handlers.
- `packages/machine/src/regs.ts`: register width/role parsing, immediatePattern and logical bitmask encoding.
- `packages/machine/src/strings.ts`: the exact diagnostic keys used by rejected examples.

The original syntax strings are retained. Additional shifted-register and explicitly shifted-immediate variants are named and demonstrated. ADD-family immediate limits, the4096/4097 distinction and the screenshot's4294966296 unsigned32-bit value are pinned by tests.

## Learning and wording choices

Each form defines the operands it needs, then demonstrates one instruction using independent prepared inputs. Register, immediate and shifted-register forms remain directly available. Extended-register forms are marked advanced. SP restrictions, optional extension variants and negative-immediate alias details are advanced rules rather than a combined leading block.

The immediate examples distinguish register capacity from what one instruction can encode. They do not give the elapsed exercise's algorithm or suggest disallowed instructions as its solution. Constants use unrelated w8/w9/x8/x9 registers. The mov entry mentions multi-instruction construction only with the local qualification “where those instructions are allowed”.

Examples explain the mechanism without supplying hand-calculated result strings. Register and flag values are to be rendered from the executable model, using the shared runner. Signed-extension and negation examples request signed readings; bit-placement examples request hexadecimal readings. Flag-writing operations begin with a prepared nonzero flag state so the before/after view can show replacement even for an otherwise ordinary positive result.

## Verification and original failures

Initial focused test run:23 passed,2 failed. I had guessed a distinct `shift.noRor` key for neg/negs. The parser uses `shift.notAllowed`; corrected the metadata after checking shiftedSource. This original run remains a failure.

Passing rerun: `npx vitest run content/reference-guides/arithmetic.test.ts`,25 tests passed. Checks cover every retained syntax, exactly one focused instruction per valid scenario, successful finite return, rejected examples' exact diagnostics, the immediate boundary distinction and the equivalence of implicit/explicit shifted-immediate arithmetic.

GNU syntax check with the local AArch64 assembler: all54 initial valid scenarios assembled; all40 rejected snippets were rejected. After the shift examples below were added, all70 valid scenarios assembled again. Temporary checker source and output were under `/tmp/arithmetic-reference-*`.

GNU/QEMU differential execution and before/after rendering are performed by the shared model/native pass. This drafting pass has not claimed those results. Independent learner and technical reviews and built phone/desktop theme checks remain the parent's separate passes. No learner study or learning-effectiveness claim is made.

## Meaningful right-shift variants

Added16 further scenarios after the parent accepted the coverage improvement: lsr and asr examples for each arithmetic, comparison and negation shifted-register group. Their common prepared negative input distinguishes filling high bits with zero from copying the sign bit. Hexadecimal readings show the stored bit patterns without silently changing their interpretation. The shift names are defined locally in short rules. Latest focused rerun still passed25 tests and GNU assembled all70 scenarios. The common rejected examples are unchanged.

## Error-lookup rule ordering

The independent learner review found that the immediate encoding limit could remain below the initial drawer view after opening error help. Reordered the immediate groups for add/adds/sub/subs and cmp/cmn so the actual0–4095 or multiple-of4096 bound is first. Placeholder, role and width definitions remain visible immediately afterwards. No example instruction, preparation, rejection, observation or native program changed. The shared view separately handles the internal scroll target.
