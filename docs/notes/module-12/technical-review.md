# Module 12 independent technical review

Source review on 22 October 2026 by a separate reviewer who did not draft or implement
these lessons. Read issue #16, the public native sources, native verifier, source brief,
lesson structure/prose/labels, prediction measures, comparison view, grader and curriculum
migration. This initial pass is source-only: native execution evidence was not yet generated
and the final built page was not yet available. Findings below require independent checking
after correction; they are not claims that the external commands have been run.

## Necessary corrections

1. **High: test the evidence and download learners actually receive.**
   `scripts/native/check.py` computes fresh register stops and outputs, but normal CI never
   reads `module-12.evidence.json` or `assembly-lab-native.zip`. A stale recording or bundle
   can therefore ship while all native checks pass. The browser reads that JSON, and the
   lesson tells the learner to download that zip. Compare the stable recorded observations
   with a fresh run, and compare archive contents with the public source files. Tool-version
   differences need not fail the arithmetic comparison. Keep `--record` as the explicit
   update operation.

2. **Medium: establish the optional image's actual load layout.**
   The verifier builds `boot` with the checked linker script but never reads its ELF header
   or program headers. The optional note says the image loads at `0x40080000` and begins
   at its recorded entry. Assert that entry and all loadable segments belong to the selected
   virt RAM, and record enough header/segment facts to support this claim. Inspect the
   standalone ELF's target/static/no-interpreter facts too. Successful output is useful
   evidence of execution but does not replace the requested ELF/load-address checks.

3. **Medium: supply the explicitly requested recovery paths.**
   The lesson provides GDB port/cleanup guidance and says to rebuild, but has no recovery
   guidance for a missing cross-tool command, running the foreign executable directly
   (`Exec format error`), a missing target dynamic linker after omitting `-static`, or an
   assembler syntax error. Add a short local troubleshooting disclosure naming each error,
   its likely cause and the specific command/step to retry. This is required by issue #16
   and helps a learner with no previous terminal workflow continue the exercise.

4. **Medium: show the instruction corresponding to each comparison stop.**
   `NativeFigure` displays a named stop, relative PC and register pair, but neither the actual
   next instruction nor the instruction just executed. For example, “After the third
   arithmetic instruction” does not let the learner inspect which instruction differs.
   Derive current/last instruction text from `viewAt` and the checked listing, distinguish
   their moments, and reuse the paired C/assembly view if C is shown. This completes the
   requested same-input/current-instruction/register comparison without making the learner
   reconstruct instruction order from prose.

5. **Medium: require debugging in the independent closing task.**
   `debug-native-instructions.prose.ts` finalTask currently asks for browser tests, rebuilding
   and running the native caller, but never asks the learner to debug a failing case or
   explain the register change. Add concise directions to stop on a native failing case,
   step to the relevant correction instruction, inspect the value, repair and rerun, then
   explain the observed change. Existing behavioural tests should remain the grader; no
   text-matching explanation grader is needed.

6. **Medium: expose the tested tool versions beside the recording.**
   The prose names Ubuntu 24.04, but the comparison consumes only evidence register rows
   and PC offsets. Exact generated GCC/QEMU/GDB versions are not visible or linked for the
   learner. A collapsed reference-run detail sourced from the generated environment/version
   record, or a direct evidence download, would distinguish the tested run from other tool
   versions without adding a long explanation.

## Facts and design verified in source

- The downloaded assembly function genuinely supplies the called symbol; `main.c` does not
  implement a C substitute. The correct and incorrect functions use defined small signed
  arithmetic inputs, and changing subtraction to addition yields a deterministic error.
- The build commands separate C/assembly objects and link statically; `-g`, `-O0`, `-c`,
  `-o`, `-static` and `-no-pie` are explained. The initial native verifier uses the same flags.
- GDB is loaded with the executable, uses `target remote` and `continue`, not `run`, steps
  instructions with `stepi`, and inspects `x` names with an explicit low-32-bit distinction.
  The recorded parser masks x0–x3 and checks instruction-relative PCs and return into main.
  Actual breakpoint/register syntax remains pending native execution.
- Linux `write` and `exit` use 64/93, arguments in x0 onwards and register 8 for the number;
  source and prose distinguish Linux service requests from return and direct UART I/O.
  The write example correctly limits its claim and notes short-write/error handling.
- The optional source polls PL011 UARTFR offset 0x18, TXFF bit 5, and writes UARTDR at
  offset zero. The command retains the default -nographic multiplexer for Ctrl-A X.
  The source brief carefully separates QEMU's model from physical UART configuration.
  Actual serial output and interactive escape remain pending native execution.
- Browser predictions use model measurements; recorded comparison figures are gated by
  committed prediction state. The two new ModelPrediction modes compute the selected
  register at a step and the first differing register result. For these four-instruction
  functions the measured answers are the first addition result and third arithmetic step.
- The closing browser grader compares register bit patterns, including the negative case,
  and native verify-challenge.c uses matching four inputs/expected values. The native
  verifier tries two different passing instruction sequences and rejects the old function.
- Core Module 12 is inserted before optional A32. The A32 lesson keeps its route/id while
  its internal module number becomes 13. The public download tree is included by the
  existing recursive offline precache implementation.

## Scope limits

No built-site, keyboard, theme, layout or final evidence assertions are made in this initial
record. Test completeness, tool versions, exact native results and the accepted corrections
will be reviewed after the native run and production build are available.

## Final verification and finding disposition

Independent verification on 22 October 2026 against the completed production build 4,
served at port 4182, and the checked public native sources:

1. **Accepted and verified.** Normal native checking now reads the saved evidence and
   compares stable outputs/statuses, original and broken register stops/PC offsets, standalone
   and UART output, and challenge result. It checks exact archive member names and every
   member's bytes against the public source files. Version strings can vary without making
   equivalent arithmetic evidence fail. The separate --record operation remains explicit.
2. **Accepted and verified.** Standalone and boot ELF headers are checked for AArch64,
   little-endian EXEC and absence of INTERP. Boot entry is asserted as 0x40080000; all
   loadable physical segments and their memory sizes are bounded by the selected 128 MiB
   RAM range. Actual UART output and Ctrl-A X termination are also checked.
3. **Accepted; mounting verified, prose independently reviewed elsewhere.** The construction
   now mounts the troubleshooting disclosure. This reviewer drafted that small text and does
   not claim its independent prose review; root and the separate learner reviewer own that
   review. The final browser build contains one accessible “If a command fails” disclosure.
4. **Accepted and verified in source and browser.** The comparison derives the next and
   just-executed instructions from the model trace. At the changed third step it names
   add w0, w0, w3, shows PC +12 with ret next, and records 262. The original figure names
   sub w0, w0, w3 and records 232 at the corresponding step.
5. **Accepted and verified in source.** The closing task now first uses the unchanged
   single-correction function to guarantee a failing native case, asks the learner to step
   it in GDB and explain the register write, then implement and test the revised function
   in both environments. It retains behaviour-based grading and matching cases.
6. **Accepted and verified in browser.** The build-pipeline figure's Reference run disclosure
   displays the generated Ubuntu environment and actual GCC, binutils, QEMU and GDB versions.

Executed independently, without --record:

```
/tmp/al-docker exec --user 1000:1000 -w /work al-native-tools python3 scripts/native/check.py
```

Exit 0: ELF checks, original/broken GDB traces, two different passing challenge solutions,
rejection of the unchanged function, standalone Linux output, optional UART output and console
exit, saved evidence and archive comparisons all passed. This is QEMU execution evidence,
not a physical Arm hardware test.

Browser verification used fresh contexts at 375px and 1280px in both light and dark themes;
checked actual html theme attributes, not only requested preference. Opened reference versions,
checked both first-lesson predictions/unlocks, and exercised both debugger comparisons from
initial breakpoint through each arithmetic instruction and ret, then Reset. Selecting an answer
without commitment kept comparisons locked. Keyboard Enter advanced the focused Next control;
focus remained there while enabled. Original values 120/205/247/232 and modified final 262
matched recorded and independently computed sides. Ret cleared written markers without changing
the result. Opened the optional UART disclosure. No page exceptions or horizontal document
overflow were observed. Inspected rendered phone/desktop screenshots in both themes, including
actual third-instruction comparison states. Screenshots from this independent pass are under
/tmp/module12-after-native-gdb-*.png in the execution workspace.

An initial browser attempt occurred while a concurrent build had temporarily removed preview
assets and timed out before finding the lesson figure; it was not a successful browser run.
The stable-build passes above completed successfully. Minor later optional-note wording defines
RAM, the monitor and serial transmission speeds; reviewed that last copy in source. Its command,
addresses, polling semantics and escape sequence are unchanged from the rendered/native checks.

No blocking technical findings remain. Full-suite results belong to the managing session's
separate validation record; this review does not claim a full-suite run.

## Engineering-record and instruction-boundary addendum

Independently reviewed the managing session's `issues-16-17-validation.md`, native README,
CLAUDE/model-plan amendments and instruction-inventory changes at ed9d8cc. The native-only
exception is narrow: labelled GNU/QEMU/GDB observations are permitted; Linux startup,
syscalls and UART remain outside the browser model; ordinary supported arithmetic still
requires the original differential check. Both new TAUGHT entries are empty, their browser
challenges allow only add/sub/ret, and the adr prose exception affects only the inventory
assertion, not introducedBy or the assembler/editor gate. Existing inventory coverage and
exception-presence assertions remain. No machine implementation changes expand that boundary.

Compared the engineering record with actual logs: `/tmp/issues-real-tools.log` reports
193 programs, 2264 calls and 284710 instruction states, zero differences, plus 15 files,
39675 assembler lines, 184 outside the subset and zero disagreements. The ordinary
`/tmp/al-native-fresh.log` reports successful native checks. `/tmp/issues-focused-browser3.log`
reports 12 focused passes. The measured 115.671875px summary height is present in the
independent register review's measurement JSON. `/tmp/issues-full-check.log` records passing
formatting, integrity/type stages, 138 unit/integration files and 2770 tests, production build,
and the start of the 1090-test browser suite. That suite is still progressing at this review;
no full-suite completion is claimed. The validation document correctly preserves its pending
status and distinguishes earlier development failures from later focused passes.

No necessary correction found in these engineering/inventory changes. This addendum is a
source/log review; it adds no new rendered-page or full-suite claim.

## Later full-suite findings: SP identity and optional navigation

The earlier source/focused review found no remaining blockers within its stated coverage.
The subsequent full browser run nevertheless exposed a shared-summary regression and a
stale navigation assertion; the earlier focused approval does not override those failures.
Reviewed both corrections independently in source and the rebuilt page:

- StackStepper had supplied the descriptive “Stack pointer (sp)” as RegisterSummary.name,
  changing the established data-register="sp" identity. RegisterSummary now accepts a
  separate optional label, defaulting to name. StackStepper passes name="sp" and its
  existing descriptive label separately. The visible label and accessible group name are
  preserved; value and recorded-write inputs are unchanged. Added component tests check
  both primitive identity/label separation and an actual StackStepper value against the
  model. These assertions strengthen coverage rather than deleting the old SP contract.
- The shell's optional-A32 previous-title assertion still named Module 11. The actual
  curriculum correctly inserts the native capstone before A32. The test now asserts the
  preceding lesson's title from course order and explicitly pins its id as
  debug-native-instructions. It retains checking missing next navigation, following the
  previous link, the resulting page heading and absence of browser errors. This checks
  the intended new order rather than weakening navigation behaviour.

Independent browser recheck at 375px and 1280px, actual light and dark themes, for both
calls-and-returns and recursive-calls: exactly one canonical data-register="sp" summary,
existing descriptive visible/accessible name, initial 0x430000 and unmarked; after first
stack write 0x42ffe0 and marked Written; after final ret 0x430000 with no written mark;
Reset restores the same initial value/marker. No document overflow observed. Followed
optional A32's previous link to the final native lesson and its next link back to A32 in
all four contexts. All checks passed. The managing session's focused browser log also
records six passing model/navigation cases across desktop and phone; the complete suite
still requires its separate final result.

## Final validation-record confirmation

Independently checked the final validation document against CI run 39792081414 and job
119870402584 logs. The completed standard workflow succeeds on
f3b86e39a6332d09915dc9271ac63fb88b00cf13: 138 files, 2771 unit/integration tests,
1067 browser passes and 23 skips, followed by “All checks passed”. The run's real-tools
and native-lessons jobs also report success. Only validation/review documents differ from
that implementation commit.

The local logs separately retain the earlier interrupted full run's three failures and exit
130 counts. The additional four-worker run completed with 1066 passes, 23 skips and one
failure: loading-widths on phone exceeded its 60000ms overall test budget, without a reported
value/assertion mismatch. Its unchanged one-worker focused rerun passed in 18.0s (22.5s command
time). The final validation document reports both failed local commands as failures and
attributes the complete passing check to standard CI; it does not reinterpret focused
reruns as full-suite local passes. No test rerun, implementation change or timeout increase
was made for this bounded source/log review. No necessary correction found.
