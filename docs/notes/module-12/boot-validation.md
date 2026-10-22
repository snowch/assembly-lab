# Chapter 12 assembly-only boot revision

Copyright © 2026 Christopher Snow

The author clarified that the capstone should build an assembly-only bootable program and
teach how execution reaches it. The previous C/Linux-led path has been replaced by a direct-loaded
QEMU `virt` ELF, linked from startup/output assembly and the familiar trip function. The existing
lesson route IDs and browser exercise contracts remain stable.

## Scope and executable evidence

The default build uses GNU `as` and `ld`, without GCC, a C runtime or guest Linux. The lesson
explains source/object/executable files, the linker script, ELF load segments versus entry,
QEMU direct loading, initial stack setup, clearing `.bss`, loaded `.data`, assembly calls,
memory-mapped UART output and the halt loop. The physical-board comparison distinguishes reset,
boot ROM, firmware and bootloader responsibilities, legacy PC BIOS and Arm UEFI. It explicitly
identifies the chosen image as a QEMU direct-loaded image rather than a portable disk image.

The recorded startup panel displays measured PC/SP and result storage at entry, after startup
and after serial reporting. Its initial nonzero marker is explicitly a debugger injection.
The address diagram shows selected, unscaled, exclusive-end regions. Function comparisons use
actual full-system GDB stops beside independent browser-model values. The model does not pretend
to execute startup, devices or firmware.

`boot-facts.md` records checked sources and exact native commands. The native author ran the
record-refresh command and normal verifier successfully. The independent technical reviewer
also ran `/tmp/al-docker exec al-native-tools python3 /work/scripts/native/check.py`, exit 0.
This checks public source assembly/linking, direct entry, ELF segments, stack alignment, explicit
BSS clearing, loaded data, good/broken GDB states, return to the assembly caller, UART success/failure,
two valid challenge solutions, rejection of the original function and the actual host console escape.
The deterministic source download matches its sources. No physical board was tested.

## Authoring and independent review

A separate drafting agent revised each lesson from the native sources and checked brief;
the canonical prose/labels record is `prose.md`. Separate reviewers read one lesson each in the
built browser. A third reviewer checked architecture, tool behaviour and executable evidence.
All used the session's available model; no model override was requested. Their review notes
record prerequisites, source-only limits, screenshots, accepted findings and final verification.

Accepted findings include the memory value's incorrect accessible register label, phone overflow
from a long QEMU command, an invisible selected startup stop and definitions appearing too late.
The fixes distinguish memory from registers, constrain the native figure's grid, provide selected
styling and a visible current-stop status, and define the terms locally. The independent review
notes record original measurements and final checks separately.

## Repository checks

- `npm run typecheck`: exit 0.
- Focused Vitest command for Module 12, plan and source links: 3 files, 91 tests passed, exit 0.
- First `npm run check`: exit 1 at the unit stage, 137 files passed and one failed;
  2769 tests passed and two failed. Both failures were in the lesson-order instruction check:
  the native-only `adr` explanation had moved from the old second-lesson Linux source to the
  first-lesson boot source, but its explicit exception still named the old lesson. The exception
  now names the actual first lesson; the browser instruction gate and challenge permissions did
  not change. The focused instruction-order rerun passed all 8 tests, exit 0.
- Second local `npm run check`: formatting, copyright, platform integrity, types,
  all 138 unit files / 2771 tests and production build passed. After the complete CI run
  passed on the same implementation, the duplicate local browser run was stopped with
  Ctrl-C: 721 passed, 18 skipped, 350 did not run and one interrupted; command exit 130.
  No browser assertion failed. This local command is not recorded as a full passing run.
- [Full CI run 39849622595](https://github.com/snowch/assembly-lab/actions/runs/39849622595)
  passed on implementation commit `68b29b2b87579603f9e157e6fd11624ace933a18`. The check-job
  log (job `120071982677`) confirms that checkout, 138 unit files / 2771 tests passed,
  1067 browser tests passed, 23 skipped, and “All checks passed”. The separate `native-lessons`
  and `real-tools` jobs also passed. The final record update changes documentation only.
- Production builds passed. Final focused browser verification is recorded by the independent reviewers: both lessons at 375px and 1280px in light and dark themes, with prediction gates, stepping, reset, challenge rejection/success and restored work. The corrected phone page measures 375/375, and startup states match the evidence.

Exploratory browser probes included navigation and selector timeouts. The review notes record
failed attempts and corrected reruns separately; concurrent builds were possible context rather
than an established cause. No assertions or timeouts were weakened to obtain a pass.
