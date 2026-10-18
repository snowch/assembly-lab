# Independent course integration review

Reviewer: separate Codex agent `finish_m11`, reviewing root-authored integration code. This is
not a review verdict on Module11, which this agent implemented. Reviewed current working-tree
changes on 17 October2026 by reading source, then running focused tests. The managing session's
explanation was not used as evidence for correctness.

## Scope

- Machine `Call.preserved` and initial-state seeding in `run.ts`.
- `packages/views/src/caller-contract.test.ts` and the seed/stack integration in the memory grader.
- Numeric lesson-module mapping in `content/plan/plan.ts` and its tests, including optional A=12.
- Assembly-versus-C construct gating in `content/lessons/introduced.ts` and tests.
- Shared lesson registration, instruction declarations and unsigned failure-card membership.
- `docs/notes/course-completion-plan.md`.
- Root-authored Module7 educational browser tests.

## Findings

1. **Medium, learner-facing plan mismatch.** The optional module's line still said “Run the
   course's programs on 32-bit ARM, and see what changed.” The plan and intended implementation
   explicitly use recorded A32 listings without an A32 simulator. A learner would reasonably
   expect executable A32 controls. Direction: describe comparison/reading of recorded compiler
   output. Root assigned this correction to the independent prose writer; final wording must be
   checked after it lands.

2. **Medium, browser-test assumption.** Module7's layout test advanced each memory stepper by
   exactly one instruction, then required a memory-transfer panel. Several string listings
   begin with a register move, which correctly has no memory transfer. Direction: advance to an
   actual load before testing the load diagram. Root changed the test to find the first model
   step with a load and advance through that instruction. Source recheck confirms the
   assertion now matches the traced program. The browser rerun remains the root session's check.

3. **Low, missing direct regression for C construct separation.** The new grader-name filter
   correctly avoids putting C grammar names into the assembly instruction set. Existing tests
   were changed to use the same filter, but there is no small synthetic mixed-C/assembly test
   showing the behaviour that motivated the change. Direction: add a minimal regression that
   an assembly challenge receives only machine instructions, while a C challenge keeps its
   own editor metadata and grammar names. This is a coverage improvement, not a demonstrated
   implementation defect.

4. **Low, stale source comment.** `lessonsOf` still says “The optional chapter has none yet.”
   That comment becomes false as soon as the new chapter is registered. Remove that mutable
   repository-state claim or describe the function without it.

## Checks and rejected concerns

- The caller seed range is checked before indexing: only x19–x29 are allowed. It excludes
  argument registers, x30 and sp, normalises values to64bits, and starts each run independently.
  Seeds do not overwrite the return sentinel. Focused caller-contract tests pass and exercise
  nonzero high-bit values, independent initialisation and stack leaks.
- The optional mapping keeps numeric schema keys separate from visible labels. `moduleByNumber`
  and `lessonsOf` agree; the tests now map publication status through that same public mapping
  and explicitly cover A=12. No platform file was changed.
- Restricting instruction metadata to `run-registers` challenges matches the current course's
  assembly grader. Answer-only and C-language challenges do not need the assembly tap gate.
  No unsupported current assembly grader was silently excluded.
- New unsigned failure-card entries match the registered challenge contracts. Module11's
  unsigned byte-fit exercise was added; its signed checked-add exercise correctly remains
  outside that list.
- Module7 wrong submissions are substantive modifications, not no-op string replacements.
  The bounded-length variant moves the count increment before the terminator test; the other
  three alter scale, stride or marker filtering. Reload tests replace saved artefact text and
  verify that completion is regraded rather than trusted.
- A longer timeout for all-instruction browser checks changes only test scheduling, not the
  required model-state comparisons. Those comparisons still check every displayed register
  and fixture byte at every step and after rewind/reset.

Focused validation: the combined run containing caller-contract, plan, instruction-gate,
Module11 integration/facts and memory-figure tests passed71tests in6files. The root-authored
integration portions passed within that run. This source review does not replace the scheduled
phone/desktop, light/dark learner reviews or the full repository checks.
