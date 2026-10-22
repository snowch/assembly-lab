# Learner review: From a function to an executable

Independent reader; did not draft or implement this lesson. Reviewed the built page at
`http://localhost:4182/assembly-lab/#/lesson/from-function-to-executable` on 22 October 2026.
Assumed the front-page prerequisites and Modules 0–11, with no command-line experience.
Read the lesson and earlier prerequisite explanations before inspecting implementation details;
did not use the author's justification. This is the initial review, before fixes.

## Findings

1. **High — first prediction answer visible before commitment.** The later construction section
   says “Expected output for these files” and prints the exact result sought by “What signed
   value does the function return in `w0`?”. Its following explanation also states the native
   caller's exact expected result. Initially the model stepper is locked, but this later static
   text is already visible. A learner can copy the answer rather than predict. Gate the exact
   output and numerical check until this prediction has been checked, or revise the activity
   so its answer is not disclosed elsewhere on the initial page.

2. **Medium — diagram uses names before explaining them.** The early diagram says “GCC drives
   GNU ld with startup code and libc”, and labels stages “ELF executable” and “Linux process”.
   `ld` and `libc` are not identified there. ELF and process are explained later under
   “Inspect the executable”. The earlier course does not supply these tool/format names.
   Prefer known words in the early diagram, or give the needed meanings beside it. Repeating
   an unfamiliar tool's name does not explain which job it performs.

3. **Medium — assembler source wrapper not explained.** The page asks “What else must surround
   those instructions” and later directs “edit only the third instruction in trip_distance.s”.
   The linked source also contains `.text`, `.global`, `.type`, `.p2align`, `.size` and `.section`.
   A learner who has only edited browser instruction bodies has not learned what these lines
   are or why they must stay. Explain locally that these are directions to the assembler,
   distinguish them from instructions that execute, and identify which source lines form the
   editable function body. Full syntax can remain optional.

4. **Low — troubleshooting task reference lacks a lesson boundary.** The separate draft says
   “Use verify-challenge.c for the final twice-correction task”. This lesson's built task is a
   different repair. Identify that this advice belongs to the next lesson's final task, so
   learners do not select the wrong native verification file here. Draft reviewed in source;
   the disclosure was not mounted in the reviewed build.

## Untaught assumptions checked

The new terminal, `sudo`, package installation, `unzip`, `cd`, output option, compile-only option,
debug information, optimisation setting, static linking, executable path and exit-status command
all have local explanations. `printf` was taught in Module 11; register arguments, return values,
operand order, signed readings and C/assembly pairing were taught earlier. These are not findings.

Remaining assumptions: the early tool/format names in finding 2 and assembler-directive distinction
in finding 3. “Guest Linux kernel” and “segments” also arrive without plain definitions; they are
secondary context here, but should be simplified or defined if the learner is expected to use them.
The native exercise presupposes access to an Ubuntu/Linux terminal or an existing WSL2 setup.
The page states its platform requirement and excludes PowerShell/macOS commands, but does not
teach installing WSL2. This is a stated environment boundary rather than an invisible assumption.

## Rendered checks

Used Chromium at 375px and 1280px, in both light and dark themes. Confirmed the actual `data-theme`
for each case. Exercised initial predictions and locked steppers, keyboard Space/Enter to choose
and commit the first prediction, keyboard stepping, Reset, both prediction commitments, a failed
challenge submission, a passing submission and restored completion after reload. The original
challenge failed for the initial program and passed after repair; restored completion remained
passing. No document overflow or page exceptions in these four configurations.

Inspected screenshots of the phone pipeline, phone dark stepped function and desktop prediction.
The phone paired listing intentionally scrolls internally; the step status and register summary
remain readable beside the controls. Focus remained visible after keyboard stepping. Selected
screenshots are in `review-images/function-*.png`; other state captures are in the workspace's
scratch directory. Screenshots contain no challenge solution.

Read all lesson prose, its source files and the troubleshooting draft. Did not execute the native
terminal commands for this learner review; native accuracy and tool recordings require the
separate technical check. Did not review the next lesson, test a fresh WSL installation, or claim
full-suite results. Final corrected build and mounted disclosure still need an independent recheck.

## Fix verification, first rebuilt page

Fresh Chromium page at the same preview URL confirms finding 2 corrected: the early diagram
uses “Executable file” and “Running program”, and describes linking with the C library without
requiring the unexplained `ld`/`libc` names. Finding 3 is corrected by the essential investigation
paragraph defining directives, their distinction from executed instructions, and the instruction
body that may be edited. The paragraph also identifies the individual surrounding directives.
“Guest Linux kernel” now has a local definition. The pipeline's Reference run disclosure opens
and shows the checked Ubuntu/tool versions. Updated phone screenshot is in the workspace scratch
review directory.

At this first recheck, finding 1 remained reproducible: construction output was still static;
the troubleshooting disclosure was not yet mounted. Reported that observed build/source state
rather than treating the requested fixes as complete. A later final-build check is needed for
those two findings.

## Final fix verification, build 4

Rechecked the completed build after `/tmp/issues-native-build4.log` reported a successful build.
Fresh browser contexts at 375px and 1280px in light and dark themes confirm finding 1 corrected:
`native-run-output` shows the locked message before commitment and does not expose the expected
output or exact native success check. Checking the first prediction reveals the native commands,
output and explanation; reload restores that revealed state. This checks the actual rendered
content, not only the prediction-stepper gate.

Finding 4 is corrected: “If a command fails” is now a mounted, initially collapsed construction
note. Keyboard Enter opens it. Its five error/rebuild directions are readable, identify the action
to take and omit the confusing later-task reference. Opening it while the prediction is still
locked does not disclose the prediction result. Inspected the phone dark-theme screenshot and
retained it as `review-images/function-troubleshooting-phone-dark.png`; inspected the revealed
native output on desktop light as well.

All four width/theme combinations had the requested actual theme, no document overflow and no
page exceptions. The earlier independently checked plain-word pipeline, Reference run disclosure
and essential directive explanation remain present. All four reported findings are now resolved
in the rendered build. The secondary word “segments” remains context in the ELF-inspection
paragraph; this was not a blocking finding. Native command execution and fresh WSL setup remain
outside this learner review, as recorded above.
