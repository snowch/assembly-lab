# Focus the synthesis lesson, 30 October 2026

## Scope and checked facts

User authorised removing the repeated fuel_used repair, keeping the missing-return experiment,
and introducing assembly editing where writing instructions is the learning objective.

The retained lesson is Putting it together (meet-the-machine). Prerequisites are the Fundamentals
lessons in content/lessons/index.ts. Read the actual page and prerequisites before assessing it.
The independent trace remains. The adjacent correct fuel_used program remains necessary to the
missing-return experiment; its recorded listing and model results are in meet-the-machine.listings.ts
and meet-the-machine.facts.test.ts. It must not be deleted with the repair exercise.

The first remaining assembly-write task is build-1000000 in Constants and widths. Its existing
worked mov/movk figure prepares instruction writing. Editor control labels are defined in the
course and platform strings files; the editor supports Text, Tap and Run tests.

Same bits, two readings previously referred to the removed Module 0 repair. Inspect its new
self-contained setup and unchanged recorded fuel_used_wrong listing.

## Process

A separate drafting agent, synthesis_prose, drafted the experiment setup, first-editor guidance,
and dependent lesson introduction from a checked fact brief, applying docs/style.md. The managing
session integrated the drafts and removed the repair, its objective and obsolete exercise checks.
Existing model/listing tests and the generic editor and Constants and widths browser tests remain.
Platform and simulator code are unchanged.

## Independent learner review

Reviewed independently by `synthesis_review` (inherited GPT-6 agent), in a separate learner pass.
Read the preceding Fundamentals copy and the three affected built pages. Browser matrix: 375 × 900
and 1280 × 900, with explicitly selected light and dark themes; checked the actual HTML theme and
inspected screenshots in both widths and themes.

The synthesis now has three useful sections: the complete trip walkthrough, the missing-return
experiment, and the independent trace. The removed repair has no surviving visible heading,
objective, editor or challenge. The earlier addition, argument/result, return and subtraction
examples define and demonstrate the mechanics needed here; they also give fresh-input practice.
The new experiment introduces a distinct execution-path failure. A still smaller arithmetic
repair would repeat that preparation rather than provide a missing bridge.

The experiment identifies the neighbouring function and its instructions before asking for a
prediction. It does not state the observed outcome before commitment. The gate stays shut until
the prediction is committed. Browser checks covered an initial main step, wrong prediction and
feedback, deletion switch, the complete missing-return run, Back, Reset, and reload. Ordinary reload
preserves the prediction but resets transient stepping and the deletion switch, matching the
existing handoff contract. The independent trace rejects a wrong response and accepts a correct
one. No page overflow or page errors occurred in any of the four configurations.

The following lesson now explains its reversed fuel subtraction locally. Its starting inputs and
complete C are visible; stepping demonstrates both readings without requiring the removed exercise.
Constants and widths introduces the editor beside its writing task. The preceding mov/movk example
already demonstrates building a value from two halves, so an additional writing lesson is not
needed. Text and Tap labels match the controls. Verified switching modes, selecting a line, typing
and grading a program, and completion after reload; separately verified solving with touch buttons
alone at phone width in both themes.

Assumed knowledge: register inputs/destination, argument order, result register, caller/return,
constants and sequential instructions all have preceding Fundamentals examples. Compiler/GCC and
-O1 are introduced by A tiny function. Memory is defined before this experiment and earlier in One
addition. In the later editor task, mov, movk, halves and lsl 16 are taught before the task. No newly
unexplained prerequisite was found.

Accepted low-severity clarity finding: the setup said “Here, `fuel_used` follows `trip_distance`
in memory. Its instructions are …”. Two function names made “Its” needlessly ambiguous. The managing
session replaced it with an explicit `fuel_used` reference. Source and canonical copy agree. Rechecked the final build on port 4403 at both widths and
both themes: explicit function reference, prediction gate and layout all passed.

Final screenshot finding (medium): the paragraph after the gated experiment is visible before
prediction commitment: “A function name does not make the processor stop … Removing that return
lets the next function's instructions run …”. It explains the prediction's mechanism while the
figure itself is locked. This is inherited markup, but it conflicts with the no-answer-leak rule.
Accepted correction: the managing session deleted this duplicate paragraph, its unused prose
export and canonical copy. The prediction's post-commit explanation already covers the mechanism.
Rechecked the rebuilt final output on port 4403 in all four viewport/theme combinations: the
mechanism paragraph is absent before commitment; the prediction feedback explains it after
commitment; the experiment then unlocks. No blocking findings remain.
Both sentence and explanation passes in docs/style.md were applied.

## Independent technical review

A distinct technical pass checked `meet-the-machine.listings.ts` against the recorded module-0
GCC listing, and checked the retained facts tests and simulator's sequential PC/RET implementation
in `packages/machine/src/run.ts`. The combined trip/fuel listing, original source references,
checked C associations, prediction measurement and deletion target remain unchanged. Removing the
repair definition does not remove the neighbouring function or alter its model execution. Browser
state and register results agree with those model expectations; review notes omit exercise answers.

The page retains the same independent trace definition and grader. Removing the repair also removes
its obsolete hints, feedback, objective and tests. Existing Constants and widths browser cases
cover typing, tapping, building from empty, invalid input, allowed instructions, reload and reset.
Shared AssemblyEditor unit tests preserve mode and chip behaviours. The new generic grader test
keeps the deleted lesson's useful distinction between matching misconception feedback and other
wrong results; it also checks the correct program still passes. Therefore the removed course-specific
repair tests do not remove the shared editor/grader safety net.

The dependent signed/unsigned lesson's recorded program and interpretations remain unchanged.
Its introduction and originality note no longer claim the learner encountered the removed repair.
The course plan and canonical prose records match the new activity sequence. The introduced-term
test now takes its assembly fixture from Constants and widths and checks its mov gate; the test
still distinguishes C grammar and editor data from the assembly gate. No product or platform
implementation was changed by this reviewer.

Accepted low-severity source-maintenance finding: comments on the retained FUEL_USED text fixtures
still described a current construction challenge/reference. The managing session changed them to
recorded/model fixtures. Verified the revised comments in source.

Independent browser scripts: `/tmp/review-synthesis.mjs`, `/tmp/review-synthesis-tap.mjs`,
and `/tmp/review-synthesis-final.mjs` (final copy and disclosure recheck).
The first script initially asserted that ordinary reload preserved transient steps; that assertion
failed. Inspection of `update-handoff.ts` confirmed ordinary reload intentionally resets these states,
while update handoff preserves them. Corrected the review harness expectation; all four configurations
then passed. This was a harness assumption, not a product regression. Screenshots inspected include
prediction setup, later subtraction output and the open Tap editor. Full CI and GNU/QEMU differential
execution are the managing session's validation, not claimed as independently rerun here.

## Validation

- TypeScript passed. Production build passed (initial 8.57 s; final disclosure-fix build 10.71 s).
- Focused content unit run: 209 passed across 10 files. Generic grader regression: 23 passed.
- Initial full unit run: 156 files passed, 2 failed; 2,935 tests passed, 3 failed.
  One failure was a stale instruction-gate test fixture selecting the removed writing task; it now
  selects Constants and widths and retains the assembly-versus-C distinction. Two prose parity
  failures occurred because the clarity edit changed canonical copy while the test process held
  the older imported prose. Both source and canonical copy now match. Focused rerun of both
  affected files: 20 passed. The original full-run failure is retained here.
- Final content/gate-fixture unit rerun after the disclosure fix: 58 passed across 4 files.
- Prettier and git diff --check passed.
- Three-lesson browser suite is running; results to be recorded in the PR alongside full CI.
- Full branch CI, merge and deployed-page verification are pending; final evidence will be recorded
  in the PR to avoid another commit solely for the run's outcome.
