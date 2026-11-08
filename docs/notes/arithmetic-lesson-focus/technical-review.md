# Independent technical review

Copyright © 2026 Christopher Snow

Reviewed the actual working-tree diff on `fix/arithmetic-lesson-focus` before the
implementation brief or drafting rationale. This reviewer did not draft or edit the
implementation. The separate review session used GPT-6.1 Sol (`gpt-6.1-sol`), Extra
High effort (`xhigh`), with `fork_turns: none`, as selected under the authoring
guidance. Read `AGENTS.md`, `CLAUDE.md`, the authoring/style/source guidance, affected
lesson data, prior four-bit preparation, recorded listings and existing tests.

## Technical judgement

No unresolved technical finding remains in the reviewed change.

The focused lesson retains the necessary qualifications for its fixed inputs. Both
recorded functions receive planned 3 and travelled 5, execute `sub w0, w0, w1` then
`ret`, and return the same low 32 bits. The signed result is representable. The new
case-local sentence, “This negative result fits int”, is accurate. The unsigned
explanation describes the low-bit/modulo result and explicitly identifies it as
defined C behaviour. The paragraph about parameter types choosing the subtraction
rules and the return type choosing the reading remains. Neither function checks a
trip overrun, and the explicit absence of an automatic warning remains visible after
the calls.

Checked N3096 §§6.2.5p11 and 6.5p5 in the existing local draft text at
`/workspace/scratch/c-types-subtraction/n3096.txt`. The narrower learner-facing
citation correctly supports the retained unsigned claim. The target-specific
32-bit types and exact compiler/version/settings remain local to the comparison.
The recording tests compare the displayed functions and instructions to the
stored Compiler Explorer responses. Existing machine facts check both initial
flag patterns; a fresh targeted GNU/QEMU comparison independently agrees for both
displayed calls.

The closing contract remains before its question and optional reasoning. Checking
the unsigned operands before subtraction prevents the below-zero wrap. This
question asks for an application policy and check; it does not promise that a
change of type inserts checking instructions.

## Term homes and records

The published homes are meaningful: `wrap` is named with the fixed unsigned
subtraction in Module 1; `overflow` has the existing mathematical signed-range
definition in Module 2's addition investigation; `undefined behaviour` has the
existing “C places no requirements on that case” definition in Module 8's product
motivation, before the division qualification uses it. Module 11 still explains
signed C overflow, compiler consequences, and checks before arithmetic.

The authoring `SOURCE_LESSONS` catalogue remains a provenance sequence, not an
alternative set of published pages. Its existing addition/subtraction metadata and
local product definition have not been rewritten to mirror the split pages.
Both published and source catalogues pass their existing term gates. Source
`undefined behaviour` has a definition in products but no declared metadata home;
the gate alone therefore cannot establish that term's preparation. Source prose
was inspected for its definition and following uses as well.

Exact canonical JSON and call-comparison source-string checks pass. No removed
`boundsTitle`/`bounds` use remains in active copy or lesson structure. Historical
review/validation records are evidence of their own revisions and need not be
rewritten as current lesson prose.

## Findings accepted

| Severity | Finding and effect | Correction / verification |
| --- | --- | --- |
| Medium | `adding-and-the-flags.test.tsx` still expected only carry/flag and described an earlier C overflow definition. The test failed against the intended new home. | Managing session updated the existing expectation and title, retaining the whole-course term-gate assertion. Independently reread the diff; final focused rerun passed. |
| Medium | The numeric-facts test excluded only the old standard citation. Revised section/paragraph digits were incorrectly treated as arithmetic facts, producing `[6, 11]`. | Managing session narrowly changed the reference exclusion to the new citation. The arithmetic-number pinning assertion remains intact. Independently reread the diff; final focused rerun passed. |
| Low | The current canonical checked-facts brief still described the removed local bounds prose and old overflow/undefined-behaviour homes. This contradicted the active lesson and metadata. | Managing session updated the preparation, misconception, scope, term and inspection statements. Independently reread the final brief, including its `- Terms:` statement: it now matches the active lesson and term homes. |

## Findings rejected

- **Restore the general signed-overflow rules here.** The page makes claims about
  two recorded functions and one representable signed call, not a guarantee that
  arbitrary signed C arithmetic wraps. The local validity/wrap distinctions and
  type-role qualification remain. No overflowing signed C example is executed or
  described as guaranteed. The later product/division and Module 11 qualifications
  remain where those cases arise.
- **Keep overflow and undefined behaviour in Module 1 metadata after removing
  their explanation.** Metadata should follow an actual definition. The new
  published homes contain those definitions; a term-gate exemption is unnecessary.
- **Add tests or change the comparison model for this removal.** Existing tests
  already check the recordings, calculated values, flags, predictions, execution,
  reset/restoration and canonical strings. The relevant stale expectations can be
  corrected without changing those behaviours or adding implementation-mirroring
  tests.

## Verification and limits

- Initial independent focused run: 6 files, 114 tests; 112 passed and 2 failed for
  the stale expectations above. Exit status 1 is preserved in
  `/workspace/scratch/arithmetic-focus-technical-tests.log`.
- Final rerun of affected addition/facts/canonical checks: 3 files, 58 tests passed,
  exit 0; `/workspace/scratch/arithmetic-focus-technical-rerun.log`.
- Separate published/source term-gate and pacing/provenance checks: 2 files,
  17 tests passed, exit 0;
  `/workspace/scratch/arithmetic-focus-technical-sequences.log`.
- Fresh `AL_TOOLS=/workspace/scratch/arm-tools npm run check:real-tools -- --only
  module1-c-types --corpus`: 1 program, 2 calls, 6 instruction states, zero
  differences, exit 0; `/workspace/scratch/arithmetic-focus-technical-qemu.log`.
- Final precommit `npm run typecheck`, Prettier check of all changed TypeScript
  files and `git diff --check` passed, each exit 0. Cross-checked the validation
  summary against the root focused/browser/build logs and the learner review;
  its original-failure, rerun and browser/source distinctions are accurate.

This is a source, standard, recording and executable-model technical review. No
browser states were personally inspected in this pass; the proposed preview port
was not serving when checked. Phone/desktop, actual themes and final rendered
state verification belong to the separate learner/checker record. No complete CI
suite, fresh compiler-network request, physical hardware run or beginner learning
observation is claimed here. Final committed-build and full-suite outcomes must
be reported separately by the managing session.
