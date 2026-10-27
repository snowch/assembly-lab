# Showing the call before the return

Copyright © 2026 Christopher Snow

## Scope

The existing complete wrapper is unchanged. The teaching range now includes BL, showing the
source of the return address rather than starting after the call. Caller instructions, function
listing, shared registers and the X30 target all read the same trace. Existing stored offsets
are migrated to retain the same machine state; reset starts before BL.

The opening joins the preceding lesson's result register to the shared bank, and the explanation
distinguishes AArch64 BL/RET semantics from the integer-result calling convention. The instruction
gate now first teaches BL here. Module 9 still develops saving the return address and register
preservation with the stack. Prose was written in a separate drafting pass; independent learner
and technical reports accompany this note.

## Checks completed

- Focused content and instruction gates: 4 files, 30 tests passed (4.76 s).
- GNU/QEMU: unchanged full wrapper, 4 calls, 32 instruction states, zero differences (0.1 s).
- Build passed (16.96 s); existing bundle-size advisory retained.
- Focused educational browser checks: 6 passed (26.5 s), desktop/phone, both themes,
  all four instructions, target/write markers, shared-register visibility, back/reset/reload
  and legacy saved progress migration. /tmp/bl-browser.log.
- Full npm run check started separately; its result is recorded in the PR after completion.

## Attempt history

Initial focused content and browser checks passed. The first full check stopped in its unit
phase: 17 files failed, 141 passed; 19 tests failed, 2927 passed (163.57 s). The new BL
reference named branch before its declared first lesson, causing repeated course-wide term-gate
failures. The drafting pass added a local definition and the lesson now declares the term. A
constant lesson test also listed the old prerequisite instruction set: its expectation now includes
BL while retaining the disallowed-instruction assertion. A canonical prose check overlapped the
drafting correction and compared the prior imported text to the updated record. All are kept in
/tmp/bl-check.log; the corrected full check runs separately in /tmp/bl-check-final.log.

The first manual preview command passed
arguments through the root npm wrapper incorrectly and selected Vite's default port. It was
stopped immediately; reviewers and tests used the explicit workspace preview at port 4399.

## Corrected final build

The branch definition is now local to its first call example and declared in the lesson's
vocabulary. Corrected focused content/gate rerun: 3 files, 39 tests passed (16.79 s),
/tmp/bl-term-corrected.log. Final production build passed (12.93 s). Independent reviewers
rechecked the changed paragraph in that build; their reports preserve the initial missed term
and the follow-up verification. The earlier activity and exercise checks cover the unchanged
component. The final full check is separate from both focused runs and the failed first attempt.
