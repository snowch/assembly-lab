# Streamlining Putting it together

User accepted removing repeated introductory assessment after the four Fundamentals lessons.
Prior lessons already define and practise add operands, register reuse/subtraction order,
integer argument/result in w0 and return, and instruction sequencing/program-counter marker.

Checked model/listing facts are unchanged: trip_distance has add/add/sub/ret and four incoming
arguments; the existing facts/corpus tests pin its states. fuel_used repair retains three calls;
the missing-ret case falls into neighbouring fuel_used instructions in the explicitly arranged
memory; km_to_service remains the independent final trace. These supported calls already belong
to the GNU/QEMU corpus. No new program, call or instruction is introduced.

Remove trip-listing, arg-registers and predict-total, and its gate from step-trip. Keep one complete
paired stepper accessible immediately, with compiler references and optional notes formerly beside
the static listing. Keep the new-situation missing-ret prediction and its gate. Remove the closing
isolated-subtraction question/answer. Existing lesson/challenge/remaining-figure IDs stay stable.

Draft copy separately from these facts; preserve ten authoring sections and canonical prose.
The shared StepperFigure gains default-off optional compiler-reference and note properties;
other uses retain their existing behaviour. Preserve tests for real stepping, source association,
local scrolling, saved/reset states, notes, meaningful challenges and the missing-ret gate.
Obsolete total-question tests should be replaced with direct-entry and removed-UI assertions.

Independent learner/technical review and final built-page checking precede completion.

## Validation record

The initial focused unit run ended with 167 passes and two failures: a canonical-copy edit was
still in flight, and the old page test still expected both steppers to be locked. The completed
canonical record and explicit checks for the open walkthrough/ret gate passed on rerun:
5 files, 169 tests. This rerun does not change the first command's exit status.

The first focused browser inventory (four files, both projects) ended with 112 passes, two
project-specific skips and two failures. Both failures came from a new test incorrectly expecting
StepperFigure's execution position to survive reload; the existing component uses local state.
The test was corrected to check reset-on-reload, direct entry, stepping and reset without adding
a persistence feature. Its targeted desktop/phone rerun passed 2/2. An unnecessary whole focused
rerun was stopped (exit130); it is not counted as a pass. Full-suite results belong in the PR record.

A separate learner reader checked 375/768/1280 in both actual themes. It identified the stale
Prediction category above explanatory context. Scoped CSS hides just that category, preserving
the meaningful title and ten-section authoring structure; final phone/desktop light/dark checks
confirmed the correction and that the genuine failure prediction remains labelled and gated.
No program/call or supported arithmetic semantics changed.
