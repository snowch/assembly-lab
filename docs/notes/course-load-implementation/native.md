# Native workflow and checked-add staging

Copyright © 2026 Christopher Snow

Implementation/drafting pass from the managing session's factual brief and the independently challenged course-load review. Independent learner/checker review is still required; this note is not that verdict.

## Checked facts and prior knowledge

- Module 12 uses the supplied assembly-only boot image in `apps/course/public/native/boot.s`, its linker script and recorded `module-12.evidence.json`. These assets are unchanged. The ordinary caller supplies the four familiar trip inputs, stores the result, selects a report and calls the UART routine.
- Existing recorded diagrams distinguish ELF stored content, reserved memory, startup stops and the possible board boot chain. No new hand-entered values or native instructions were added to the browser model.
- `_start` prepares the stack, clears `.bss`, calls the trip function and stores its result. The supplied UART routine depends on the prepared aligned stack. Its device-specific configuration and exception masks can be inspected after the first successful boot.
- Existing debugger commands connect to a paused machine, write/check a marker, run to prepared startup, then run to the function. Splitting these groups changes teaching order and reference placement, not command order or machine behaviour.
- Checked arithmetic already follows taught casts, flags, stores and conditional selection. Its final exercise applies a two-output contract: stored low sum bits and returned overflow status. Formatting and sanitizers are separate applications, not prerequisites to that attempt.

## Changes

- Placed the existing ELF memory diagram in the linker investigation. Introduced ELF/LOAD-segment vocabulary beside that first use rather than leaving its definition later.
- Placed the existing startup recording beside the core startup explanation. The later control-flow/board comparison remains with its environment discussion. Original interactive IDs and prediction gates are retained.
- Reduced the main startup reading to stack/storage/call/output/wait responsibilities. Preserved detailed exception masks, UART setup values, polling and hardware qualifications in a secondary device-inspection disclosure.
- Split first GDB commands into connect/entry, marker and prepared-startup checkpoints. Included the existing recorded startup states locally before the function-input command group. The function-input group now opens the prediction section, immediately before the familiar one-instruction question. No unsupported hash/deep-link behaviour was added to the router.
- Moved formatting and warning/sanitizer discussion to a post-exercise reflection detail. The main path now runs from checked-add explanation through a short contract reminder to its assembly attempt. Removed formatting from the opening question and required reflection summary so it does not become an untaught prerequisite.
- Synced canonical Module 11 and Module 12 prose records. Challenge IDs, initial/reference programs, native assets and recorded compiler data are unchanged.

## Editing and validation

Read the full affected lesson sequence and ran the two style closing passes: definitions precede their first required use; familiar arithmetic stays the native task; headings identify the stop; mandatory steps stay visible; optional device/formatting depth is explicit. The local startup recording is labelled recorded through existing copy and is not presented as a live QEMU process.

Focused run `npx vitest run content/lessons/module-11.prose.test.ts content/lessons/module-12.test.tsx`: original run 11/12 tests passed. The sole failure was the cross-course term gate detecting the concurrently edited opening's ordinary phrase “carry out”; it did not concern these changes and was sent to the opening author. The focused rerun after final staging edits passed 12/12 tests (2 files); this does not change the original failed command’s exit status. Formatting was run on all six owned TypeScript files.

No application build, native execution or browser matrix was performed by this drafting pass. The native binaries/commands/evidence are unchanged; the managing session owns the final build, full checks and independent built-site review, including initial prediction gates, startup stop selection and both themes/widths.
