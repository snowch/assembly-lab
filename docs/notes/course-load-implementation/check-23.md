# Independent checker 23: Build and boot an assembly program

Copyright © 2026 Christopher Snow

## Verdict

Both accepted medium-severity learner-load findings are closed in the reviewed built preview. No new blocking or medium-severity finding confirmed in this bounded pass. No app edits, build or native execution performed.

## Independent reading and prerequisites

Read AGENTS.md and CLAUDE.md, all ten current lesson sections, captions, prediction and exercise scope, optional details and model/reality note before implementation rationale. Read the original reader's findings as the check brief. Checked the entry prerequisites and relevant preceding calls/stack material, the Module 12 source references and checked boot brief, public boot.s and boot.ld, native listing/evidence structures, NativeFigure and NativeBootDiagrams. Did not use later-lesson knowledge to credit an explanation.

The learner brings arithmetic, register widths, branches, byte-addressed storage, string termination, call/return and aligned stack frames. Earlier calls-and-returns explicitly explains that the call instruction does not allocate a frame or save the previous return address, and that the browser starts its functions with a prepared stack. Native tools, terminal workflow, ELF, sections/segments, startup and device access are new here and receive local explanations. No additional untaught prerequisite blocker confirmed. Tool installation and device configuration remain substantial new material, but the repair reuses familiar arithmetic rather than demanding a new startup implementation.

## Accepted findings checked

### Medium, closed: placement support now accompanies linker investigation

“Assemble and place the boot image” explains boot.ld, its sections and LOAD segments, then says “Use the file-to-memory diagram to match sections to their addresses. Select a section to inspect its stored bytes or reserved space before following startup.” The corresponding figure is now in that investigation, ahead of the browser arithmetic stepper. It distinguishes stored bytes from reserved memory, gives the local LOAD-segment qualification and keeps section selection adjacent to its detail. Selected .bss in all four browser contexts; its explanation appeared immediately below its selected file/RAM row. The diagram remains locked before prediction commitment. No duplicate copy was introduced into generalisation.

### Medium, closed: essential startup path separated from optional device inventory

“Prepare the machine and send bytes” now directs “For this pass, follow stack setup, storage clearing and the function call. Keep the supplied device setup unchanged.” It describes uart_puts as the supplied output operation and points to the optional detail for device accesses. Exception classes, divisor/configuration values and detailed polling instructions are under “Inspect the supplied device and exception setup”, closed initially in all four contexts and successfully opened during checking.

“Recorded loading and startup” is in the same explanation section as entry/stack/storage reading. Selecting entry, prepared and final stops updates the local status and PC/SP/stored-result inspector. The figure explicitly says “The diagram is a recording, not a machine running in this page”, explains the debugger-inserted test marker and distinguishes it from loader-initialised memory. The model/reality note separately limits browser execution to the arithmetic function. These labels support inspection without implying live native execution.

## Browser evidence

Final preview: http://127.0.0.1:4322/assembly-lab/#/lesson/from-function-to-executable . Four fresh contexts: 375 and 1280 px, each with light and dark preferences. Actual body backgrounds were rgb(243, 246, 245) and rgb(16, 22, 21). Initial and interacted document widths matched viewport widths in each context.

Checked initial gate, selecting an uncommitted prediction, commitment, newly available placement/startup material, Reference run and troubleshooting disclosures, .bss selection, boot_ready flow-stage selection, all three recorded startup stops, optional device disclosure and starting repair tests. Selecting an option alone left startup locked; commitment unlocked it. The supplied repair failed meaningfully across multiple varied cases and displayed actual/expected values rather than treating successful assembly as success. Did not solve or disclose the repair.

Visually inspected the phone dark selected-memory figure and desktop light final-stop inspector in addition to rendered text/state inspection across the four contexts. File/RAM columns, addresses, selected section and record controls were readable; no page overflow observed. On the phone the diagram is tall, but preserves the relationship between the two columns and the local selection detail.

Reproduction scripts/logs and screenshots: /tmp/course-load-check/check23.cjs, check23.log, check23-extra.cjs, check23-extra.log and from-function-to-executable-{375,1280}-{light,dark}-{initial,committed,memory,boot}.png. Logs contain observed exercise feedback; this report deliberately omits challenge answers.

## Limits

Native commands and public sources were source-checked against the recorded brief; installation, extraction, assembly/link, QEMU boot and debugger reproduction were not rerun. This is not renewed native technical certification. Did not exercise every section/flow selection, second prediction commitment, arithmetic step/reset, solved or alternative repair, reload persistence, hint ladder, keyboard-only use or full accessibility compliance. No full-suite test claim. Later changes to shared styles affecting these figures require a focused recheck.
