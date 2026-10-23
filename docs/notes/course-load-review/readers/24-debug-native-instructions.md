# Reader 24: Follow startup and debug the boot image

Copyright © 2026 Christopher Snow

Module 12, registry position/order 24 (second Module 12 lesson), id `debug-native-instructions`. Independent bounded learning-load review against the supplied brief and snapshot. No app changes, native execution, rebuild, external compiler requests or challenge solutions.

## Prior knowledge and novelty

Reviewed the actual earlier-lesson registry in `/tmp/course-load-review/lessons.json`, especially `from-function-to-executable`, rather than assuming this is the first native lesson. The learner already knows the trip calculation, register widths, writes, program counter, calls/return addresses, branches, storage, stack frames, instruction stepping and browser exercises. The preceding lesson supplies the Linux tool setup, assembly/link/boot procedure, ELF sections/segments, startup clearing, stack preparation, QEMU loading, UART output, shutdown controls and deliberate arithmetic fault. Those are synthesis here, not newly introduced mechanisms.

New work is controlling QEMU through GDB: two concurrent terminal roles, connecting to a paused target, setting breakpoints, continuing versus instruction stepping, examining registers/instructions/memory in several formats, deliberately writing a marker before startup, and detaching. The revised native test caller adds `.set` and `.include`, with local explanations. Optional Linux `svc` is explicitly separate from the core path.

The first browser prediction requires only familiar addition and low-register interpretation. It is appropriately small. The first *native* task, preceding it, is substantially more demanding: enter and interpret a complete GDB connection/startup/function sequence before the first local checkpoint. That distinction matters more than the number of figures or prediction gates.

## Confirmed findings

### Medium: first debugger operation bundles distinct stops before their explanations

Evidence: motivation says “At GDB's `(gdb)` prompt, enter:” followed by one uninterrupted block beginning `target remote 127.0.0.1:1234`, writing the result marker, continuing to `boot_ready`, then continuing to `trip_distance`. Definitions and interpretation follow the block: “`target remote` connects GDB to QEMU”, “`set {unsigned int}&result ...` deliberately writes a test marker”, and “`break boot_ready` selects the stop after stack setup and `.bss` clearing.” Source: `content/lessons/debug-native-instructions.prose.ts`, `PROSE.connection` (line 10). Reproduced in all four fresh browser configurations before any prediction.

The learner must distinguish debugger actions from guest instructions, remember which output belongs to which stop, interpret register versus memory inspection, and move between the page and two terminals. Startup and arithmetic are familiar, but these debugger operations are not yet practised. The block is runnable and its subsequent explanations are accurate; the issue is avoidable operational tracking, not an inability to solve the addition prediction.

Smallest direction: split this same sequence at the existing semantic checkpoints: connect/inspect entry; write/check marker; continue/inspect prepared startup; continue/inspect function inputs. Put each existing interpretation with its group before advancing. Retain the single familiar boot image and full native workflow. No need to introduce every GDB command in a separate lesson.

### Low: startup comparison requires an unlocated previous-page figure

Evidence: “Compare `sp` with `stack_top` in the recorded startup figure.” The current lesson has two arithmetic native comparisons, neither a startup figure. Checked its complete lesson data and `NativeFigure.tsx`: both instances supply program/recorded registers/PC offsets but no `boot` prop. The figure exists in the preceding lesson as `native-boot-startup`; its `boot` and `bootLabels` props provide the recorded startup states. Thus the requested comparison is possible but its location is implicit.

Reproduction: fresh current page, motivation, before first prediction; look for the named startup figure, then inspect all later sections. On a phone this adds a page-navigation/context-restoration task during a two-terminal operation. Smallest direction: identify and link the previous lesson's exact startup figure, or carry the relevant recorded checkpoint locally. This is a cross-reference obstacle, not missing teaching of stack setup.

## Keep

- Keep the familiar arithmetic function. New debugger control is practised against old computation, rather than also introducing a new algorithm or ISA mechanism.
- Keep “Instruction just executed” separate from “Next instruction” and the relative PC. These directly support the lesson's central temporal distinction. The four original stops were stepped through, including return, and reset successfully.
- Keep the restrained native/model comparison: four registers, one stop selector, explicit write marks and a short recording disclaimer. At 1280px the sides align; at 375px the two compact groups stack legibly. This is useful comparison, not evidence of overload just because values appear twice.
- Keep both prediction gates. Before checking, each comparison is replaced by “Check your prediction above first.” Checking an incorrect prediction gives feedback and opens exploration. Familiar addition is an appropriate first attempt; the fault prediction asks for a temporal location rather than a new arithmetic skill.
- Keep shutdown guidance before the requested fresh error session and explicit distinction between ordinary `boot.elf` and revised `challenge.elf`. The final task is a legitimate synthesis of editing, browser tests, rebuilding and native checking; its length alone does not justify removal.
- Keep the optional Linux environment comparison optional. Core debugging does not depend on learning Linux system calls.

## Assumed knowledge / recommendations / rejected suspicions

No confirmed high-severity prerequisite gap. GDB, breakpoints, port, `stepi`, inspection commands and the new assembler directives receive local explanations. “Loopback address” is used without a direct definition; “on this computer” gives enough context for executing this task, so this is at most a minor terminology polish, not an overload finding. The typed debugger memory-write expression is explained by its effect; learning its full grammar is not necessary here.

A possible design improvement is a compact persistent terminal/stop checklist for the native workflow. This is a recommendation, not evidence that every learner needs a new interface. Similarly, the modified-run caption asks learners to use the original figure above to compare divergence; this introduces scrolling, but the tiny familiar program and explicit temporal prediction make the comparison reasonable. I do not classify the repeated figures as a substantial fault from their count alone.

## Browser evidence and limits

Built route: `http://localhost:4210/assembly-lab/#/lesson/debug-native-instructions`. Playwright Chromium, fresh contexts at 375×900 and 1280×900, each OS colour scheme light/dark. Verified actual body colours: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`; page horizontal overflow false in all four. Reviewed all ten rendered sections, optional Linux/reflection disclosures and model-versus-reality note.

In all four configurations: initial locked comparisons; deliberately incorrect first prediction and feedback; original recording through all four steps/return; original reset; incorrect divergence prediction and feedback; modified recording through its third arithmetic instruction; ordinary details opened. Additional dark-theme element screenshots at both widths show the original first-step comparison. Additional fresh 375px light context ran the supplied challenge starting point, inspected failing-test feedback and opened only the first hint. No challenge solution submitted or reproduced here.

Artifacts: `/tmp/course-load-review/debug-native-instructions-browser.cjs`, `-browser.log`, `-detail.cjs`, `-attempt.cjs`, `-attempt.log`; screenshots with matching lesson prefix include each width/theme `-initial`, `-returned`, `-failure-disclosures`, width `-detail`, and `-375-attempt`.

Source review: complete lesson prose/labels/schema and arithmetic listings, `NativeFigure.tsx`, startup diagram implementation, and relevant earlier registry data. Native evidence is recorded data; I did not launch the learner's GDB/QEMU commands or assess native installation failure recovery. Did not exercise successful challenge submissions, all hints, alternate editor modes, every browser control or optional downloadable Linux execution. The command-sequencing finding is based on the rendered instructional structure, not a claimed observed native runtime failure.
