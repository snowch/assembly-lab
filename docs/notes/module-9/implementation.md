# Module 9 implementation record

Two lessons: `calls-and-returns` and `recursive-calls`. Each has the ten standard sections, two
predictions and two written exercises. The first introduces BL, STP and LDP; RET is revisited with
its actual link-register semantics. The second adds no instructions.

The existing listing, memory-prediction, bounded stop prediction and assembly challenge components
are reused. `StackStepper` adds a computed stack diagram because a register-only stepper would leave
the core mechanism in prose. It uses actual SP writes to identify active allocation intervals and
`memoryAt` to reconstruct their bytes at any trace position. Backward stepping undoes stores.
Prediction gates prevent initial display of stack state; an instruction slider makes deeper calls
accessible on a phone without many repeated taps. Full x19/x29/x30 and SP are visible alongside w0.

Written cases use nonzero 64-bit caller seeds for x19 and x29, exact preservation checks, and an
explicit SP expectation. This catches saving only w19, omitting a restore and returning with stack
space still allocated. Each reference is tested with zero, ordinary inputs and unsigned boundaries.
The fade-sum UINT_MAX case deliberately exercises defined wraparound.

Initial focused checks: 28 compiler/model facts tests and 4 stack UI tests passed. Additional lesson,
canonical prose and browser validation are recorded by the completion review after integration.

Prose and labels are drafted by a separate agent from `brief.md`; the implementation agent does not
supply finished learner paragraphs. Independent technical and learner reviews are managed by the
parent task. The curriculum keeps its trip-computer examples and avoids factorial/Fibonacci.

The four written exercises also require an actual executed BL to their named helper or recursive
entry. Merely leaving an unreachable call in the source does not satisfy this condition. The zero
recursive cases are exempt because they should return without recursion. `callContract.test.ts`
checks a real call, an unreachable BL, a plain branch and a call to a different function. Lesson tests
reject otherwise-correct inline and iterative substitutes. Feedback is separately drafted in
`strings.stack.ts` and included in the canonical text. All four complete references have also been
built from an empty editor using touch controls, including pair stores/loads and indexed SP operands.

Integrated focused validation: **69 tests passed** across compiler/model facts, canonical prose,
lesson contracts, dynamic call requirements, caller-state seeds, stack figures and complete touch
editor construction. The browser suite exercises both lessons at desktop and phone widths, both
themes, trace-derived stack bytes/registers, prediction persistence, all four challenges and a full
phone-built nested call. Its first run used a build made during shared edits: the newly introduced
call-check feedback was missing from that bundle, so the two fade-sum exercise cases need the final
rebuilt-site run. The source-level checks above already include the completed feedback implementation.

## Stack annotation follow-up, 18 October 2026

The stack figure now identifies each invocation by its executed call ordinal.
The initial invocation is call 1; each taken linking branch creates a new ordinal.
A return to the recorded caller address restores the preceding invocation.
Allocations keep their owning invocation, even when several calls share the same
function name or later calls reuse the same stack addresses.

Saved-register labels come from decoded store operands and the simulator's actual
store addresses and sizes. They do not assume GCC's frame layout. A partial
overwrite removes the previous whole-register annotation. Each label encloses
only its stored bytes; bytes outside those slots remain visible separately.
The displayed saved value is reconstructed from the memory at the selected step.
The lesson's incoming x19 explanation is therefore distinct from the current x19
register value and from later stores to the same address.

The current x30 address is mapped through the assembled listing to its actual
instruction. Addresses outside that listing are explicitly identified as such.
Backwards stepping recomputes the annotation from the selected machine state.

Validation: 16 helper, view and canonical-copy tests passed, including recursive
saved values 0, 7, 3 and 1 while current x19 holds 0; alternate stack layouts;
pointer-addressed stores; partial overwrite; reused stack addresses; and x30
changes after calls, backwards steps and restoration. Typecheck and formatting
passed. A separate Vite development server was checked at 375 and 1280 pixels in
light and dark themes with no design or overflow findings. Production assets were
not rebuilt during this check; final built-site verification remains a separate
course completion step.
