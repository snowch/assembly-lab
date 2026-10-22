# Independent technical review: assembly-only boot capstone

Copyright © 2026 Christopher Snow

Reviewed on 22 October 2026 by the separate `boot_technical` agent, which did not
write the lessons or their implementation. This review covers the revised Module 12
prose and labels, lesson structure, native source files, evidence recorder/verifier,
download bundle and the native figure. It follows the accuracy and sceptic requirements
in `CLAUDE.md` and `docs/authoring.md`.

## Technical evidence

- Independently read QEMU 8.2.2 `hw/arm/boot.c`. `arm_load_kernel` treats the supplied
  ELF as non-Linux; `do_cpu_reset` sets the PC to its ELF entry directly. The revised
  lesson correctly teaches this path and does not invent an executing reset stub,
  firmware image, PC BIOS or guest kernel.
- Independently read QEMU 8.2.2 `hw/arm/virt.c`: the selected machine's RAM base is
  `0x40000000`; the PL011 UART begins at `0x09000000` and occupies `0x1000` bytes.
  The lesson correctly qualifies these as properties of this machine.
- Independently read Trusted Firmware-A's firmware design documentation, including
  its cold-boot sequence and BL2 loading BL33, which can be UEFI. This supports the
  board-qualified explanation of ROM, firmware and bootloader stages and Arm UEFI.
  The UEFI specification website returned HTTP 403; it was not used as independently
  read evidence. The checked implementation sources are listed in `boot-facts.md`.
- Read the assembly and linker script: startup masks its selected exception classes,
  chooses a 16-byte-aligned stack, clears an eight-byte-aligned `.bss` range, supplies
  arguments, calls the separately assembled function and saves its result. UART
  output uses memory-mapped PL011 registers; there are no Linux syscalls or C runtime
  in the core image. The permanent halt loop is distinct from host emulator exit.
- Read the assembly-only native challenge table and browser challenge contract. Both
  require the three distances minus twice the correction for the same four cases.
  The native harness calls the learner's separately assembled function rather than
  providing another implementation of its arithmetic.

The later change in `introduced.test.ts` moves the existing one-instruction `adr`
prose exception from the second lesson to the first. Independently confirmed that
the first lesson now defines `adr` for message-address generation in native `boot.s`,
while its model-versus-reality note confines startup and UART execution to the external
tools. The second lesson no longer names that instruction. `TAUGHT`, the browser gate
and both challenges' `add`/`sub`/`ret` construct lists are unchanged. Moving this exact
exception follows the teaching location without allowing it in browser exercises or
broadening the test's exceptions. No test assertion was removed or weakened.
Independent focused verification, `npx vitest run content/lessons/introduced.test.ts`,
returned exit status 0 with one file and eight tests passing. This focused result does
not replace the managing session's full-suite result.

Independently executed:

```sh
/tmp/al-docker exec al-native-tools python3 /work/scripts/native/check.py
```

The Ubuntu 24.04 reference container returned exit status 0. This rerun freshly
assembled and linked the actual public sources, compared the resulting observations
with the saved evidence, checked the deterministic download against its source files,
verified initial entry and stack state, deliberate GDB marker clearing, initialised
data, original and modified five-stop function traces, return to `after_trip`, native
UART reports, two valid challenge solutions and rejection of the original function.
It also exercised the documented host console escape and checked the optional Linux
assembly example. This is emulated execution, not physical-board validation.

## Findings and dispositions

1. **Medium, corrected: memory was announced as a register.** The first boot figure
   used `RegisterSummary` for the `result` memory location. That component's accessible
   group name begins with `Register`, contradicting the mechanism. The correction
   uses a separate memory value group for `result`; PC and SP retain register groups.
2. **Low, corrected: qualify the selected memory ranges.** The figure shows text,
   `.bss`, stack and UART ranges while omitting message bytes and initialised data.
   Its range note now names them as selected ranges, says ends are exclusive and
   explicitly mentions the omitted image content. It does not claim to be a complete
   or proportionally scaled map.
3. **Low, corrected in drafting: exception wording.** The first draft grouped debug
   events under asynchronous events. The final wording names the debug, SError, IRQ
   and FIQ mask bits and locally defines interrupts and polling.
4. **Low, corrected: the initial entry stop.** The debugging explanation
   should tell the learner to inspect the initial `_start` stop, rather than suggesting
   that setting a breakpoint at the already-current entry and continuing is required.
   The final prose now says “In a fresh paused session, inspect the initial `_start`
   stop”, followed by the subsequent breakpoints. The main connection commands
   also inspect the correct initial stop.

The recorded marker is explicitly attributed to a debugger write before startup,
and the prose acknowledges ELF-loader zero filling. A claim that the figure presents
uninitialised RAM as naturally observed garbage is therefore rejected by the actual
text: “the marker lets you test the startup loop itself”. The memory map is explicitly
device-specific and the final reflection asks the learner to check a board's handoff,
RAM and clock/device requirements. A claim that this lesson promises universal physical
board or disk boot is likewise unsupported.

## Browser verification

Checked the built preview at `http://localhost:4182/assembly-lab/`, in fresh Chromium
contexts at 375 pixels in light and dark themes and at 1280 pixels in light theme.
Opened both routes, committed the prediction, selected all three startup records and
advanced the native comparison through its five stops. Inspected screenshots of
the startup panel and completed comparison at those sizes/themes. The displayed PC,
SP, stored value, memory ranges and returned arithmetic values agree with the source
record. The final comparison correctly identifies return to the assembly caller.

The memory value now renders as a distinct `data-memory="result"` group, without a
`Register` accessible name; PC and SP remain register groups. The selected-range
qualification is visible, including exclusive ends and the omitted message/data
content. The first-lesson reader separately found a construction-panel phone-width
overflow and missing persistent visual selection of the startup snapshot. Parent
fixes for those findings need a final rebuilt-page check.

Two initial exploratory probes failed: one raced course loading and timed out waiting
for the prediction selector; another used the wrong button name “Check prediction”
instead of the visible “Check your prediction”. The corrected probe completed the
three size/theme combinations above, then timed out waiting for lesson sections in
its fourth fresh context. These probes are not a passing full-suite run. Final
1280-pixel dark-theme and fix verification were then completed on the stable final
preview (`index-DfqNXiIw.js`) as follows.

### Final rebuilt-page check

The final focused browser probe returned exit status 0. It opened both lessons at
375 pixels/light and 1280 pixels/dark, verified each actual rendered theme, committed
their predictions, selected all three startup states and advanced all five native
comparison stops. Recorded and model register values agreed at every stop. The startup
values were entry PC `0x40080000`, SP zero and marker `0xa5a5a5a5`; ready PC `0x40080024`,
SP `0x40082010` and zero result; halted PC `0x40080054`, the same SP and result `0xe8`.
Those displayed values match the checked native evidence. The `result` group has the
accessible label “Stored result (32-bit word)” and is not a register group.

Inspected final phone/light and desktop/dark screenshots. The selected startup button
now has a persistent accent fill and an inset underline, with the selected stop also
written beneath the buttons. Both lessons measured document width equal to viewport
width after opening the formerly overflowing construction content: 375/375 and
1280/1280. The final probe captured no browser console errors or page errors. Local
definitions of GDB and baud rate and the earlier `stepi` explanation are present in
the final source; no remaining technical blocker was found. The learner reviewers'
separate final checks cover their other size/theme combinations and reading findings.

## Independent confirmation of final CI and validation record

Independently fetched the raw GitHub log for check job `120071982677` in
[run 39849622595](https://github.com/snowch/assembly-lab/actions/runs/39849622595).
The checkout log names implementation SHA `68b29b2b87579603f9e157e6fd11624ace933a18`.
The same job records 138 unit/integration files and 2771 tests passing, then 1067
browser tests passing with 23 skipped and the final line “All checks passed”.
Independently fetched run/job status with `gh run view`: the run is completed with
success on that SHA, and `check`, `native-lessons` and `real-tools` are each completed
with success. These are directly checked remote results, not an inference from an
aggregate green badge or a focused rerun.

Read the final `boot-validation.md` and the managing session's local log files.
`/tmp/assembly-boot-check.log` directly records the earlier unit failure: 137 files
passed, one failed, 2769 tests passed and two failed in the stale ADR exception checks.
`/tmp/assembly-boot-gate.log` records the corrected focused run, eight tests passing.
`/tmp/assembly-boot-check-final.log` directly records all 138 unit files / 2771 tests
passing and the production build passing; its browser tail records 721 passed,
18 skipped, 350 not run and one interrupted test. It does not record that local
command as a complete passing run. The managing session separately reported the
shell command's interrupted exit status as 130; that status is session-reported,
while the interrupted browser totals were directly read from the log. The first
local command's exit status 1 is likewise reported by the managing session and is
consistent with its directly observed failed-test log.

The distinction in `boot-validation.md` between the failed first local command,
focused correction, interrupted duplicate local command and complete successful
CI run is accurate. At this final review, local HEAD was the verified SHA and the
only pending changes were documentation recording these results. No additional
test run was requested or performed for this documentation-only confirmation.
