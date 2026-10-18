# Independent final integration code review

Reviewer: `final_code_review`, a separate agent that did not author these changes.
Reviewed the working tree on 18 October 2026 by reading the implementation first,
then running focused tests and an independent runtime probe. This is a technical
review of shared integration code, not a learner browser review or a release verdict.

## Findings

1. **Medium: a bounded machine run is reported as a different returned result.**
   `packages/views/src/compilerRun.ts:29–34` treats every machine stop other than
   return as an evaluator/simulator mismatch and discards the stop reason. The
   playground consequently uses its generic machine-failure message, while
   `grader-c.ts:24` says the function returned a different value even when it did
   not return at all.

   Independent reproduction:

   ```c
   unsigned f(unsigned n) {
     unsigned total = 0;
     for (unsigned i = 0; i < n; i++) {
       total = total + 1;
     }
     return total;
   }
   ```

   With argument 800, `interpretC` succeeds with value 800 after 9611 evaluator
   steps. `runC` reports `stage: "machine"` with no diagnostic because the emitted
   A64 run reaches its independent 10000-instruction budget. Smaller inputs
   100, 500, 600 and 700 return successfully. The budgets need not be identical;
   the problem is losing the reason and describing a stopped run as a wrong return.
   Smallest correction: retain the machine stop reason and give a distinct
   execution-limit message in both the playground and C grader. Preserve the
   mismatch report for a returned value that actually disagrees.

2. **Low: a process requirement reads as a completed-review claim.**
   `docs/notes/course-completion-plan.md:22–25` says each module “has” independent
   reviews and every executable example “is checked” while final checks are still
   underway. State these as requirements, or retain completed wording only once
   the corresponding review and release evidence exists. This does not affect
   program behaviour.

3. **Medium: ordinary C test failures hide their useful values.**
   `grader-c.ts` supplies both actual/expected values and the generic `detail`
   “The function returned a different value from the one required by this test.”
   `platform/lesson-runtime/src/VerdictView.tsx:53–54` deliberately treats a
   detail as a replacement for the input/actual/expected table. Consequently a
   learner cannot see which input failed or compare the two results. The root
   session identified this issue; this reviewer independently confirmed the
   grader and platform contract. Smallest correction: omit generic detail for
   ordinary numeric mismatches, retaining detail for compiler/runtime diagnostics.

## Checks and rejected concerns

- Caller seeds are restricted to x19–x29, normalised to 64 bits and reset between
  runs. They cannot replace arguments, the return sentinel or sp. The memory
  grader compares exact full-width values and the restored stack pointer.
- Required-call checking examines executed BL instructions and their resolved
  target. An unreachable BL, an ordinary branch, a missing label and a call to
  another function do not satisfy it.
- Optional chapter A uses numeric lesson key 12 consistently in the plan lookup,
  lesson grouping and static publication status. Its visible description now
  promises recorded comparison rather than running an unavailable A32 simulator.
- C challenge grammar does not enter the assembly instruction gate. C challenges
  route to the C editor and grader; existing assembly challenges keep their gate.
- The C editor's text and statement controls edit the same source artifact. The
  playground compiles that source, uses generated line mappings and checks the
  executed C path before running A64. Invalid arguments and arithmetic are refused.
- Compiler Explorer is called only from an explicit button handler. The disclosure
  and privacy link precede that control. The source-preserving link is constructed
  locally, successful responses are cached, failed responses are not cached, and
  stale responses for another source are not displayed. Local work remains usable
  when the request fails. No automatic request on editing or mounting was found.
- The recorded-answer grader reads actual retained instruction text. Only its
  explicitly A64 result query runs a simulator; the A32 comparison is not presented
  as a second executable machine.
- `ListingFigure.afterChallenge` grades current saved work rather than trusting
  a saved completion mark. The Module 11 solution listing unlocks after a passing
  artifact and locks again after replacing it with failing work. Its relocated
  figure no longer exposes the final assembly before that exercise.
- The optional LCS alignment in `ListingPairFigure` keeps an unchanged `ret`
  unmarked when the other compilation inserts instructions. Existing positional
  comparisons retain their original behaviour.
- The strengthened Module 8 consumption case sets nonzero upper bits of x1 while
  retaining the specified low w1 input. It now detects the missing zero-extension
  instruction rather than silently testing only zero-filled argument registers.
- Stack frames come from executed SP changes, saved-register labels come from
  actual stores, and their values come from reconstructed memory. Partial
  overwrites remove stale whole-register annotations. Recursive and sequential
  calls have distinct invocation ordinals; x30 targets use actual assembled
  addresses. The helper author confirmed these edits were final for review.
- The revised Module 0 motivation directly describes following calculations and
  locating results. It no longer implies that C and its compiled implementation
  generally disagree. The new remainder definition is accurate for the stated
  non-negative division and agrees with its term metadata. The low-half metadata
  records the earlier memory-lesson use.

## Validation

Two focused Vitest runs passed **101 tests in 14 files**: caller contracts, dynamic
calls, compiler execution/editor/network, recorded queries, stack helpers and
view, plan mapping, instruction introduction, Module 8 and Module 11 integration,
and the static front page. The separate runtime probe above reproduces finding 1.

No source implementation was changed by this reviewer. Browser checks, full
repository validation, the complete real-tools corpus and deployment verification
remain separate release requirements. Finding fixes require a subsequent recheck.

### Follow-up stack verification

The final saved-slot grouping change was read after it landed. Each labelled group
contains exactly the bytes written by that store; unlabelled gaps remain visible.
The supplied phone screenshot confirms that a saved x19 label no longer appears
to include trailing unused bytes. Independently reran the final stack helper and
view suites: **11 tests passed**. No further stack finding was identified.

## Final fix verification

All three findings above are resolved in the reviewed working tree.

- **Finding 1:** `runC` now preserves the machine's structured stop reason. Both
  the playground and C grader use the existing stop sentence for an instruction
  limit or fault, while a returned-value disagreement retains its distinct
  message. The original 800-iteration reproduction now yields
  `{ kind: "limit", steps: 10000 }`. An independent grader probe reports:
  “The simulator stopped at its instruction limit of 10000. The function has
  not returned.”
- **Finding 2:** the completion plan now requires each module to have its reviews
  and every executable A64 example to be checked. It does not claim that those
  release steps have already finished.
- **Finding 3:** ordinary numeric C mismatches omit generic detail. The rendered
  verdict now shows the test inputs, actual return and expected return. Compiler
  and runtime diagnostics still use detail rather than empty value tables.

The related statement-editor changes were also read and exercised. Selecting a
fully representable statement loads its actual operands into the controls. A
replacement preview precedes application, other source lines are retained, and
complex expressions that the controls cannot represent require an explicit
choice before replacement. The compiler step controls now have the actual next
instruction and associated C source beside them, derived from the current trace.

Independent focused validation passed **43 tests in four files** covering the
compiler run, rendered playground, statement editor and Module 10 integration.
The production build at `http://localhost:4205/assembly-lab/` was then driven in
Chromium at widths 375 and 1280, in both light and dark themes. In all four modes:

- the 800-iteration case showed the instruction-limit explanation;
- a failed C challenge showed its values table;
- selecting and editing a declaration changed only that source line;
- stepping showed the actual next instruction and its C source near the controls;
- no page error was reported.

This closes the findings from this technical review. It does not replace the
full learner reviews, repository check, real-tools run or deployment verification.

## Completion-document review

Independently read `course-completion-fixes.md` against the retained lesson reader
reports and the implemented changes. Its accepted findings and decisions accurately
describe the corrections. The latest string and recursion model notes retain the
technical limits while replacing unexplained memory-mapping and operating-system
phrases with plain descriptions of prepared memory and finite stack space. The
source and canonical prose agree on those descriptions.

The totals in `course-real-tools-validation.md` exactly match the successful output
in `/tmp/course-real-tools-final.log`: 191 programs, 2,256 calls, 284,666 instruction
states and zero differences; 15 instruction-line files, 39,675 lines, 184 outside
the subset and zero acceptance disagreements. The extracted tools independently
report GNU assembler 2.44 and QEMU 10.0.13; retained Debian package metadata matches
the package versions named in the record. This verifies the recorded result and
tool identities, not a second execution of the full differential corpus.

One documentation follow-up was sent to the managing session: the completion
decision record refers to two final page-check reports, so those reports should be
linked when filed. No technical blocker was found in either completion document.

### Release validation record

Independently checked `course-completion-validation.md` against
`/tmp/course-final-check2.log`, `/tmp/course-real-tools-final.log`, the registered
lesson list and both filed final page-check reports. The 11 added lessons and
24-lesson course total are correct. Formatting, copyright, platform integrity,
TypeScript, 2,628 unit/integration tests in 131 files and the production build are
confirmed in the check log. The GNU/QEMU counts match the separate real-tools log.
The approximate bundle sizes match Vite's 1,465.42 kB / 433.27 kB gzip output.
Independently reran the staged diff whitespace check and confirmed no staged or
unstaged platform changes.

Both final page-check reports are now filed and linked from the decision record.
Their 4207 follow-ups explicitly verify the static-listing badge correction while
retaining stepping badges on executed figures. The validation record accurately
limits these checks and leaves the full browser suite marked as still running.
No correction is needed to its current claims; final browser totals must come from
the completed check log before replacing that pending sentence.

### Final completed-check verification

The completed `/tmp/course-final-check3.log` confirms 2,628 unit/integration tests
in 131 files, 1,001 browser tests passed, 23 intentional viewport-specific skips,
and the final “All checks passed.” message. The skip conditions in the browser
sources select the relevant desktop or phone interaction mode. The updated
completion-validation record reports these totals accurately and no longer leaves
the browser suite pending.

The separate Module 11 phone rerun records nine passing tests in
`/tmp/course-module11-final-browser.log`. The final page-check report independently
records eight display-mode checks after the prose-link touch-target correction,
including 44-pixel phone targets and unchanged desktop flow. These records support
the stated correction and validation scope. The staged diff whitespace check also
passes. No unresolved finding remains in this technical and documentation review;
commit publication and deployment verification are subsequent release actions.
