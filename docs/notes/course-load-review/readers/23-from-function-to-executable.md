# Reader 23: Build and boot an assembly program

Module 12, first lesson; course position 23 (zero-based registry position, not the lesson's within-module `order: 0`). Review of the built preview and current sources, against the entry panel and preceding lessons only.

## Overall assessment

The first prediction and repair are reasonable late-course synthesis. They reuse an exceptionally small familiar arithmetic function rather than asking the learner to invent startup and device code. No high-severity first-attempt blocker confirmed. There is, however, substantial new systems material surrounding that manageable task. The main improvement is to stage the explanation of the supplied infrastructure, not to shorten the capstone indiscriminately or separate familiar instructions into more lessons.

## Prerequisites and novelty

Entry panel (`apps/course/src/strings.ts`, `prereqs`) promises basic C functions/control flow/arrays and binary arithmetic; it explicitly says “You do not need a compiler; the lessons run in your browser.” Earlier lessons provide register widths, hexadecimal, arithmetic/flags, masks, conditional selection and branches, loops, byte-addressed memory, indexed loads/stores, zero-terminated strings, and calls with aligned stack frames and preserved return addresses. Modules 10–11 add C compilation and checks. Module 9 explicitly explains that the call instruction does not allocate the frame or save the previous return address. Those are appropriate foundations for this lesson's function, caller, zeroing loop and UART string loop.

Genuinely new here: native Linux terminal/tool workflow; separate assembly and linking; object/executable files; linker scripts, sections, symbols and directives; ELF entries, segments and loading; QEMU system mode and host/guest distinction; initial stack/storage setup without a caller; exception masking, polling, memory-mapped device registers, UART configuration and waiting without process exit; physical-board boot/firmware comparison. Most are defined locally, so novelty is not automatically missing prerequisite knowledge. `msr`, `adr`, `wfi` and `ldr =name` are new native mechanisms and are not browser execution practice. The lesson correctly says so. Empty `introduces: []` is not evidence of an easy lesson.

## Confirmed findings

### Medium: the required startup reading combines a new execution boundary with detailed device configuration

Location: section “Prepare the machine and send bytes”, `content/lessons/from-function-to-executable.prose.ts:26`; supplied `apps/course/public/native/boot.s`.

The direction is “Follow `_start` in `boot.s`.” Its first bullet introduces “debug, SError, IRQ and FIQ exceptions”, handlers, masking and polling; the same section later requires tracking the UART base address, control-register enable value, integer/fractional baud divisors, line format, transmit-buffer status and byte writes. For example: “Offsets `0x24` and `0x28` hold the integer and fractional baud-rate divisors; this source writes 1 and 0.” It also introduces `adr` and `wfi`.

These are several genuinely new mechanisms, unlike the already practised call/stack/string operations between them. The learner must connect linker-defined addresses to startup memory, then switch to device-specific status/configuration while also consulting a separate source file. The first prediction provides arithmetic practice, but no intermediate task checks the new startup/loading boundary before this detailed device explanation. This is confirmed explanation load, not a claim that the tiny repair itself is impossible.

Smallest direction: make the supplied serial routine a named trusted output boundary for the first successful build; first trace entry → prepared stack/storage → call → saved result. Then inspect the polling loop with its familiar string operations. Put the divisor/configuration recipe and exception-class inventory in an explicitly secondary inspection step, retaining the local hardware qualifications. No need to remove the working capstone or teach all those opcodes individually.

### Medium: visual support for placement and startup arrives after the corresponding source-following task

Locations: “Assemble and place the boot image” (`...prose.ts:17`), “Prepare the machine and send bytes” (`:26`), “Loading, entry and firmware” generalisation text (`:28`); figure placement in `content/lessons/from-function-to-executable.ts:140–170`.

The investigation asks “Open `boot.ld`” and introduces five section kinds, stack reservation/alignment and many assembly directives. Its accompanying unlocked interactive is captioned “Follow the assembly function in the browser model.” That figure explains familiar arithmetic, not the new file-to-memory relationship. The later generalisation finally offers “From ELF file contents to memory” and “Recorded loading and startup”.

Following the current sequence, the learner must initially retain the section-to-memory mapping and linker's responsibility in prose while switching to the linker file, then follow the new startup path in another file. The later diagrams do carry exactly this bookkeeping well. On the phone the temporal separation is especially large; this is not evidence against the page merely being long.

Smallest direction: introduce the section mapping beside the first `boot.ld` inspection, and the startup-stop recording beside the stack/storage explanation. Keep their controls and prediction gates. The full section/segment and physical-board comparisons can remain later. Avoid adding another duplicate diagram.

## Design recommendations, not confirmed blockers

The generalisation introduces ELF headers/segments and disassembly, then boot ROM, firmware, bootloader, BIOS and UEFI. It carefully says “Neither runs in this QEMU direct-ELF path.” The comparison is valuable, but explicitly making it a second pass after successful direct-ELF boot would give the learner a clearer stopping point. This is scope/staging advice, not evidence that firmware knowledge is required to complete the arithmetic challenge.

Terminal setup is a new burden relative to the entry promise. The lesson explains terminal, installation, extraction, command flags and exit controls, and supplies an error disclosure. I did not confirm a missing shell prerequisite that blocks the given command sequence. Do not inflate the number of tool names into a high-severity finding.

## Keep

- Familiar four-instruction function and labelled inputs isolate new deployment work from new arithmetic. Prediction is a retrieval task at the right level for this stage.
- Prediction gates prevent the model/result and boot material opening before commitment. The unchanged initial and modified-function attempts are separate.
- Complete supplied files make the first boot reproducible without requiring a new startup implementation. The repair scope explicitly preserves labels/directives.
- “The diagram is a recording, not a machine running in this page” and the GDB test-marker explanation distinguish evidence from simulation. Recorded entry/prepared/halted stops expose why startup matters.
- File-to-memory arrows distinguish stored bytes from reserved memory; the segment note explicitly distinguishes section names from loader segments. Stack-frame and device regions are shown separately. Selection exposes one local detail rather than every explanation at once.
- “If a command fails” and the distinction between editing source, rebuilding an executable and restarting a machine are directly useful to a first native workflow.

## Browser evidence and reproducible states

URL: `http://localhost:4210/assembly-lab/#/lesson/from-function-to-executable`.

Fresh contexts for every combination of 375/1280 px and light/dark preferences. Actual body backgrounds were light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`, not merely requested preferences. Initial document widths matched viewport widths. Inspected initial page, uncommitted choice, committed first prediction, unlocked native/model material, open “Reference run” and “If a command fails”, selected `boot_ready` flow node, selected `.bss` file/memory row, and all three recording stops. Compared initial recording with stack/storage prepared and final halt states. No native commands were executed.

Reproduce: choose an option in the first prediction, press “Check your prediction”; open the two named disclosures; select `boot_ready` in the control-flow schematic and `.bss` in the file/memory diagram; select the middle then final stop in “Recorded loading and startup”. Selecting a stage is accurately labelled as inspection rather than execution. On phone the diagram's addresses wrap within the contained file/RAM columns; no page overflow observed. Light/dark record controls and selected section remain distinguishable.

Artifacts: `/tmp/course-load-review/from-function-to-executable-browser.cjs`, `from-function-to-executable-post.cjs`, corresponding `.log` files, and `from-function-to-executable-{375,1280}-{light,dark}-{initial,chosen,committed,memory,boot}.png` (all under the same temporary directory). Visually inspected the phone dark memory diagram and desktop light recording crops in addition to rendered-page text/state inspection.

## Read-only coverage and limits

Read all ten sections, model/reality note, challenge scope (without reproducing its answer), relevant NativeFigure/NativeBootDiagrams implementations and labels; inspected `boot.s`, `boot.ld`, `trip_distance.s`, the recorded boot image regions/segments/flow/stack/startup stops in `module-12.evidence.json`. Checked preceding registry objectives and relevant prior explanatory sections against the entry panel. No later lesson knowledge credited.

Second prediction commitment, failed/solved repair feedback, individual browser arithmetic stepping/reset, every flow node, `.stack` selection, native installation/build/boot/debugger reproduction and downloadable archive extraction were not exercised. Their mechanisms/scope were source-only. No external compiler, installation, rebuild, or production edits. Findings are learner-load observations; they do not certify native technical correctness or accessibility compliance.
