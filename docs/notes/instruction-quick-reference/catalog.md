# Browser instruction reference catalog

Copyright © 2026 Christopher Snow

## Scope and checked sources

The catalog is course-owned reference material, separate from challenge initial code, tests,
reference artifacts, answers and hints. Its 83 entries cover the machine's current
`subsetMnemonics()` exactly. The list says which instruction names are available in the browser;
an exercise's allow-list remains the authority for what a learner may submit there.

Syntax and operand limits were checked against `packages/machine/src/forms.ts`, the register,
condition and immediate parsers in `regs.ts`, and GNU as. Each family describes common forms and
its relevant limits; this is not a transcription of the complete Arm ISA. The existing official
form catalog supplies exact source links for taught forms. Extra browser-supported names link
to the already checked official DDI0602 2026-09 Base Instructions index, rather than guessed URLs.
The index returned HTTP 200 on 2026-11-19.

Important qualifications retained beside the affected entries:

- add/sub immediate limits apply to magnitude because GNU-style negative immediates reverse the operation.
- register and immediate logical forms have different stack-pointer/zero-register restrictions.
- a w-register write clears the upper half of its x register.
- the browser does not check ADRP's real architecture displacement limit.
- memory instructions need mapped addresses. Writeback overlap cases are not recommended as portable processor examples.
- the reference's examples use unrelated registers and do not supply exercise solutions.

## Verification

First focused run: 87 Vitest checks passed. After adding the execution-corpus coverage assertion,
the rerun passed 88 checks. No failed initial run was discarded. The final wording-only edit to
notation and the logical register-form qualification is verified in the later parent check.

- The tests compare the catalog list with `subsetMnemonics()` and assemble every example.
- Boundary tests accept and reject add/sub immediates, including the learner's rejected
  4294966296, and check representative width, zero-register, SP, shift, field, memory and branch limits.
- GNU as accepted all 100 displayed snippets on 2026-11-19. This separate syntax check did not execute them.
- `quick-reference-examples.s` embeds every snippet with mapped data and safe branch/return targets.
  The matching JSON calls each entry with non-zero flags. The test pins the exact displayed
  snippets in this corpus, allowing only distinct local-label names.
- `AL_TOOLS=/workspace/native-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --corpus --only quick-reference-examples`
  passed: 1 program, 100 calls, 914 instruction states compared, zero differences.

The execution check covers the displayed examples in their supplied contexts. It does not claim
that every allowed operand combination or every architecture overlap case was executed. The
existing machine corpus remains the broader simulator differential test. Browser inspection,
independent learner/technical review, full-suite results and any later fixes belong in the parent
verification record. Passing tests do not establish that learners understand the reference.
