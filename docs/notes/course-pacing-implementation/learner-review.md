# Independent learner review: course pacing implementation

Reviewed `CLAUDE.md`, `docs/style.md`, the implementation brief, the consolidated pacing review
and its Module 10 / Modules 13–A rechecks, the split helpers and canonical copy, and the assembled
published lesson sequence. The reviewer did not draft or implement the lesson changes. This
note is the reviewer’s only repository edit.

## Accepted findings and corrections

The first integrated candidate had 63 pages. These findings concern completed activity cycles
and the point at which a learner can finish; displayed word counts were a diagnostic only.
No challenge answer is reproduced here.

| Priority | First-candidate finding and direction | Correction independently checked in the final build |
| --- | --- | --- |
| Medium | Subtraction’s “What you now know” summary preceded a newly appended negation prediction. It stated the outcome before the activity and introduced new work under a closing heading. Put the activity before its summary. | Counter and subtraction-arithmetic units are separate; the negation activity precedes its reflection. |
| Medium | Flags completed its column/flag practice before starting “Running add instead of adds” and a separate overflow construction. Keep all four flags together, but provide an earlier completion point. | “Addition and its flags” ends with flag practice; “Flags and overflow” owns stale flags and overflow application. |
| Medium | The counter application led into “How an adder subtracts”, multiple full arithmetic views and signed negation before completion. A drill-down label did not make this a separate stopping point. | “Measuring elapsed ticks” ends after its application and check; “Subtraction flags and negation” owns the arithmetic comparison. |
| Medium | Shifts moved from a complete basic shift/type-choice activity into “How GCC divides by 2”, rounding differences and a compiler-correction trace. Preserve the trace on a separate focused unit. | “Choosing a shift” and “Shifts and signed division” have distinct goals and checks. |
| High | Branches finished `describe`’s path investigation, then required “Three outcomes from two tests”, a changed-boundary experiment, register/bit branches and another count check on the same page. Preserve the complete trace, not every separate goal in one unit. | Following a branch, writing zero/threshold branches, and testing registers/bits are three units. The main trace and its boundary/count checks stay together. |
| Medium | Memory finished a first load/store task before a width-overwrite prediction, narrow/wide comparisons and a second copy task. Give the transfer-width goal a separate completion point. | “Memory and addresses” and “Choosing a transfer width” are separate; byte order, valid storage and pointer-overwrite guidance remain local where needed. |
| Medium | Recursion finished the complete `fade_sum` trace, frame inspection and base-branch repair before an unchanged-argument failure and a different count construction. Split at the completed first investigation. | “Following recursive calls” retains the complete down/back trace; “Making recursive progress” owns the failure and application. |
| Medium | Native layout moved from ELF/directive/LOAD inspection into stack, BSS, UART and firmware responsibilities. Native debugging then required three complete external workflows before a finish point. | File loading and runtime preparation are separate. Connecting/checking startup, stepping the complete function/saved result, and diagnosing/repairing a changed image are three debugger units. |

The managing session accepted all these findings. Original 63-page evidence is preserved in
`/tmp/pacing-implementation-learner-first-build`, including initial text and measurements at
375/1280 in both actual themes. That initial inventory found no page errors or horizontal
page overflow. It is not final-build verification.

## Final candidate review

The final candidate has 73 published lessons. Build `/tmp/pacing-build3.log` completed in
25.81 seconds and is served at `http://localhost:4415/assembly-lab/`. Source is frozen for the
final pass. Independent final evidence is kept separately under
`/tmp/completion-learner-pacing-final`.

Source review confirms that the new units retain real exercises, predictions, computed runs,
comparisons or practical checkpoints. Short construction units are deliberate practice, not
empty fragments. The native debugger units each supply fresh process/connection setup and
session-close instructions. Their diagnostic unit may reuse the instruction-stepping technique
taught immediately before it; it does not require a terminal session to have remained open.
Recordings remain labelled as recordings, and Pi hardware verification remains explicitly pending.

Final rendered verification is complete:

- Loaded all 73 routes at **375 × 812 and 1280 × 800**, in **light and dark**. Checked each
  actual theme and computed background, the expected lesson title, initial visible text, heading
  and section positions, and page width. All 292 initial route checks completed with no page
  errors or page-level horizontal overflow.
- Committed predictions on 24 representative units at all four width/theme combinations:
  arithmetic/readings; both addition units; counter/subtraction arithmetic; fields; both shift
  units; all three branch units; before/after-body loops; transfer widths; array traversal; both
  recursion units; generated-code reading and loop-boundary editing; both native layout units;
  all three debugger units; A32 conditions. Each combination committed 22 local predictions and
  sampled stepping/reset on 17 units. Exercise-dependent comparisons stayed locked where the
  associated exercise had not been passed. No page overflow appeared in these states.
- Independently checked 12 explicit initial-to-committed transitions across the four combinations:
  negation’s stepper, the moved eight-byte memory figures, and both local original/modified GDB
  recordings remain gated by the prediction on their own page. Negation’s prediction now occurs
  before the closing reflection at both widths. The original ordering finding is closed.
- Inspected actual initial/revealed screenshots of the new joins and moved figures in both
  themes. A focused 36-figure check covered the signed/unsigned reader, negation, service bit
  test, signed division correction, byte store, recursive failure and native GDB comparisons.
  Thirty-two step/reset pairs completed; the four reader views were inspection only. The
  computed bit/byte diagrams and complete recorded/model traces remain readable and locally
  explained. Native original and modified recordings now sit on the diagnostic page together.
- Read the rendered native command sequences and their joins. Each debugger unit starts from
  explicit source/build artifacts, supplies fresh QEMU/GDB launch commands and gives connection and
  breakpoint setup. Each offers a safe session-close point. The diagnostic unit reuses `stepi`
  and register inspection learned on the immediately preceding page; that is taught prerequisite
  knowledge, not an assumption that a previous terminal session survived navigation.
- Checked the assembled 73-page source catalogue for moved prediction and challenge dependencies:
  no checked `after` or `afterChallenge` dependency points to a figure or challenge on another page. The short constant,
  loop, compiler-construction and A32 units retain their local contracts or concrete comparison
  checkpoints. Reading-only/native stages have a practical ending rather than an empty heading.

All accepted findings are closed in the final build. The new stopping points follow changes of
learning goal while preserving complete traces. A few units remain longer than Module 0’s
261–647-word initial range. For example, subtraction arithmetic has three computed adder views;
counting their bit/column labels inflates its displayed total. Native diagnostic work repeats
necessary fresh-session commands. These are explicit focused investigations, not evidence that
every page now has equal length. No new blocking assumption about prior knowledge, correctness or a standalone goal was found
within the agreed review scope.

Final evidence: `inventory-{375,1280}-{light,dark}.json`,
`revealed-{375,1280}-{light,dark}.json`, `gate-checks.json`, `figure-checks.json`, rendered text and
screenshots under `/tmp/completion-learner-pacing-final`. The final all-page inventory is separate
from the original 63-page evidence. An earlier disposable revealed-state attempt was abandoned
before complete coverage; a later attempt failed on an artifact-directory setup error after a
shared scratch-filename collision. Neither supplies a passing result. The successful final
runs use uniquely named scripts and the separate evidence directory above.

## Limits and status

This is a learner/pacing review, not an independent ISA, C-standard or native-hardware audit.
No physical Pi test, external compiler-service call or live QEMU/GDB command was run by this
reviewer. No writing/answer challenge was solved in this pass; prediction choices were used to
inspect gated content, not to establish challenge grading. Root owns full-suite and
exercise-reference verification. Closed optional explanations, all hint/feedback paths and every
possible widget input were not exhaustively exercised. Initial inventories count
visible code, figure labels and controls as well as prose; they are not reading-time estimates
or fixed lesson-size limits. Saved-work migration is outside the user’s requested scope.

Status: the 73-page review is complete; a focused final-build cross-reference recheck is pending
after the managing session’s full browser run found the Module 0 width-name link below.


## Final cross-reference recheck

**Medium, reported by the managing session’s full browser run:** Module 0’s “You will experiment
with both names” link still named “Constants and widths” and targeted `constants-and-widths`.
That route now teaches loading a constant, while the promised “Two names, one register” section
is on “Writing w and x registers”. The source and existing browser expectation confirmed the
stale destination. Direction: retarget the link to the already reviewed `register-widths` unit,
using its approved title, and synchronise the canonical record and test. No other page behaviour
is affected; the 73-page audit above remains valid. Focused replacement-build verification is
pending.

## Final replacement-build learner recheck

An independent learner reviewer re-read `AGENTS.md`, `CLAUDE.md`, `docs/style.md`, the
implementation brief and the earlier evidence above. This narrow pass covers the two changes
made since the completed 73-page review. The reviewer made no product or test edits and did
not rebuild. The replacement build in `/tmp/pacing-build4.log` completed in 10.76 seconds; it
was served independently at `http://localhost:4435/assembly-lab/`.

**Rendered checks passed at 375 × 812 and 1280 × 800 in both actual light and dark themes.**
The browser checked `data-theme` and the computed body backgrounds: `rgb(243, 246, 245)` in
light and `rgb(16, 22, 21)` in dark. Screenshots of the changed text, local activities and
compiler disclosure were also inspected.

- Eight link flows covered Module 0 before and after pressing **Run the instruction**, at each
  width/theme combination. “Writing w and x registers” targets `#/lesson/register-widths` and
  opens the lesson with that exact title and its “Two names, one register” section. On each
  fresh destination, the width stepper stayed locked until its own prediction was checked.
  Two instruction steps and Reset then worked. The source link and canonical prose also agree.
  This closes the medium cross-reference finding above.
- Four “Changing a C calculation” flows checked the initial generalisation text. The principle
  beginning “Compare compiler output by following the values and the paths that run” and the
  warning that a shorter listing proves neither correctness for every input nor faster execution
  remain visible. The GCC instruction-subset qualification remains immediately below. Only the
  intervening service-administration paragraph was removed; the join reads coherently and adds
  no new assumed prior knowledge.
- Each changed-C flow preserved its local prediction gate, then compiled the supplied changed
  function, ran it with the displayed inputs, stepped one generated instruction and reset to
  instruction zero. The generated C and instruction views remain paired; the desktop screenshots
  show the related C statement and instruction highlighted together, and the phone page remains
  within the viewport.
- Opened **Compare with GCC** in all four changed-C flows. The disclosure still states that
  pressing the button sends the source to Compiler Explorer and that the lesson works without
  sending it. Its privacy-policy link, attribution, same-source link and explicit send button
  remain visible. No send button was pressed, and no external request was observed.

All twelve completed flows had zero browser page errors and zero page-level horizontal
overflow. Passing evidence is in `/tmp/completion-final-learner-b4-recheck-pass/`: `results.json`,
rendered changed-C text and width/theme/state screenshots. Its script and successful command log
are `/tmp/completion-final-learner-b4-recheck-pass.cjs` and
`/tmp/completion-final-learner-b4-recheck-pass.log`.

The first disposable focused attempt exited 1 on an exact-text locator for the compiler privacy
paragraph, which also contains the privacy link. That was a reviewer harness error, not a product
finding. Its partial screenshots remain separately in `/tmp/completion-final-learner-b4-recheck/`;
the corrected rerun above supplies the passing result. It does not change the first attempt’s
exit status.

**Status: ready from the learner/pacing review.** This appendix supersedes the pending
cross-reference status above. The completed 73-page evidence remains valid outside these two
narrow changes. This pass did not rerun the full suite, solve writing challenges, contact the
external compiler, run native tools or test physical hardware; the earlier limits still apply.

## Final label-only follow-up, build 5

The later semantic-link audit found two remaining links whose route was correct but whose label
still used the old combined lesson title. The independent learner reviewer checked the replacement
build from `/tmp/pacing-build5.log` (20.95 seconds) on the existing preview at
`http://localhost:4435/assembly-lab/`. No rebuild or product/test edits were made by this reviewer.

All **eight contextual link flows passed**: the link in “Returning to the caller” and the
preparation link on “Where next?”, each at **375 × 812 and 1280 × 800 in light and dark**.
Each now reads “Saving a return address”, retains `#/lesson/calls-and-returns`, and opens the
lesson whose heading is exactly “Saving a return address”. The surrounding explanation still
promises the call/return-address rules the destination teaches. Actual themes were checked by
`data-theme`, computed body colour and inspected screenshots. Neither source nor destination
had page-level horizontal overflow, and no browser page error occurred. Canonical prose contains
the same updated labels. No activity states were rerun for these label-only changes.

Evidence: `/tmp/completion-final-learner-b5-labels/results.json`, source/target screenshots in
that directory, and the script and passing log at `/tmp/completion-final-learner-b5-labels.cjs`
and `/tmp/completion-final-learner-b5-labels.log`. The earlier 73-page and build-4 focused evidence
is retained above; full-suite results and test-harness reruns belong to the managing session’s
check record.

**Final status: ready from the learner/pacing review.** The two last label corrections are
independently verified in the final build. No new learner finding or unexplained prerequisite
was introduced by these changes. The earlier review limits still apply.
