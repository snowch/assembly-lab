# Check 24: Follow startup and debug the boot image

Copyright © 2026 Christopher Snow

Independent learner/checker review of `debug-native-instructions`, Module 12, on the supplied final build at `http://127.0.0.1:4322/assembly-lab/#/lesson/debug-native-instructions`. No application edits, build, native execution, external compiler requests or challenge solutions.

## Verdict

The medium debugger-sequencing finding and the low startup-reference finding are closed. No remaining finding in the checked scope. The original low finding below is retained with its independently checked closure.

### Low: the local recording does not identify stack_top

Rendered direction: “Compare `sp` with `stack_top` in the recorded startup figure below.” The local figure actually shows only “Next instruction address (PC)”, “Stack pointer (SP)” and “Stored result (32-bit word)”. Selecting all three stops changes those values but never exposes `stack_top` or a labelled stack boundary. This holds at 375px and 1280px, in both actual themes.

The prepared-stop SP agrees with `boot.stackTop` in `module-12.evidence.json`; this is a missing visible reference, not a numerical disagreement. `NativeFigure.tsx` renders `startupStops` but does not render `boot.regions`. The source linker script names the boundary, and the preceding lesson teaches it, but the explicit direction points to a local label absent from that figure.

Direction: make the requested comparison possible by identifying the recorded stack boundary locally, or direct the comparison to the labelled prepared-startup SP actually present. Preserve the existing recorded values and native commands. Evidence: `/tmp/course-load-implementation/check24-startup.png`, plus BOOT entries in `check24-new.log`.

## Confirmed corrections and preserved behaviour

- The first native workflow is now four distinct groups: “Connect and inspect the entry point”, “Mark the storage before startup”, “Run to the prepared startup stop”, then “Run to the function inputs”. Each group has interpretation and a check before the next group. The last group opens the prediction section, immediately beside the familiar arithmetic question. Terminal roles and closing/restarting instructions remain visible.
- “Recorded loading and startup” is local, before the function group. All three startup selectors work; marker, cleared storage and final saved storage match the recorded evidence. Copy explicitly says “The diagram is a recording, not a machine running in this page.” It does not claim a browser native process.
- Fresh arithmetic comparisons are gated. A dedicated fresh inspection found zero `[data-native-side]` groups and two messages: “Check your prediction above first. The figure opens once you have checked it.” Checking intentionally incorrect predictions opens the figures with explanatory feedback.
- Original and modified comparisons each traversed all five stops, including return, then reset. Both sides agree with their respective evidence rows. The original and modified runs first differ at the designated arithmetic stop. The executed-instruction label, next-instruction label, relative PC and return-to-caller state stay distinct; reset restores inputs and the initial instruction.
- The initial challenge was run unchanged in each configuration. It reports one of four tests passing and useful failed-case feedback. The task distinguishes the original caller from the revised test image and defines `.set`/`.include` beside their use. No solution, extra hint or modified submission was tested.

## Prerequisites and reading

Read AGENTS.md/CLAUDE.md, all ten current lesson sections, prose/labels/schema, `native.listings.ts`, the complete immediately preceding `from-function-to-executable` lesson, the earlier-lesson registry/review context, recorded Module 12 evidence, `NativeFigure.tsx`, native verifier/README and source references. Earlier lessons supply arithmetic, register views, PC, calls, return addresses, memory, aligned stack and instruction stepping. The preceding native lesson teaches Linux terminals/tool setup, assembly/linking, ELF loading, stack/storage startup, UART output and QEMU shutdown. This lesson locally introduces debugger, GDB, breakpoint, port, stepping and inspection operations. No new blocking prerequisite gap was found. “Loopback address” is supported operationally by “on this computer”; full expression grammar for GDB’s marker command is unnecessary for its explained use.

The split command groups preserve the original command sequence and operands. Checked the source semantics against the existing verifier’s paused connection, marker, prepared stop, function breakpoint, instruction steps, halt and detach path. Public native assets and recorded evidence have no working-tree diff. This is source verification, not a claim that these commands were newly executed.

## Browser evidence and limits

Fresh Playwright Chromium contexts at 375×900 and 1280×900, each light/dark. Actual body backgrounds were `rgb(243, 246, 245)` and `rgb(16, 22, 21)` respectively; no document horizontal overflow in any configuration. Read all ten rendered sections and opened optional Linux/reflection disclosures. Checked startup selections, deliberately incorrect predictions, both five-stop arithmetic comparisons and resets, and the unchanged challenge failure state in each configuration. Reviewed saved phone screenshot and focused startup image; full-page screenshots capture all four configurations.

Artifacts: `/tmp/course-load-implementation/check24-new.cjs`, `check24-new.log`, `check24-{375,1280}-{light,dark}-checked.png`, and `check24-startup.png`. An earlier adapted exploratory script (`check24.cjs`) selected the newly inserted startup figure as if it were arithmetic and timed out waiting for its Next button. The corrected script targets figures containing native comparison sides and completes the matrix; the exploratory timeout is not a product failure.

No native GDB/QEMU process, tool installation, downloadable Linux example or successful challenge submission was exercised. No full test suite or build was run by this checker. These checks concern the supplied final lesson build and the described states; later edits affecting it require focused rechecking.

## Final focused recheck: startup reference closed

Rechecked the replacement production build at port 4322 (announced assets `index-DCRONSzr.js` / `index-l0iwkmlu.css`) in four fresh Chromium contexts: 375×900 and 1280×900, each actual light/dark. The local recording now displays “Initial stack pointer: stack_top” with `0x40082010` at every startup stop. At entry the current SP remains `0x0`; at prepared startup and halt it is `0x40082010`, equal to the reference. The persistent label distinguishes the initial reference from the selected stop’s current SP. No write marking is present; source explicitly supplies `written={false}`. Its value is the exclusive end of the existing recorded stack region, matching `boot.stackTop`; no new native measurement is claimed.

All three startup selectors work in all four contexts, with the existing PC/result states preserved. Actual body background colours match the earlier light/dark values; no document horizontal overflow. The focused phone screenshot is legible. The low finding is closed. No broader workflow repeat was necessary for this local reference addition.

Evidence: `/tmp/course-load-implementation/check24-reference.cjs`, `check24-reference.log`, and `check24-reference-{375,1280}-{light,dark}.png`. No application edit, build or native execution by this checker.
