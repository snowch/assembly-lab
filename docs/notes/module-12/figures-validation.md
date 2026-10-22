# Chapter 12 figure validation

Copyright © 2026 Christopher Snow

The author requested the proposed boot-handoff and ELF-to-RAM figures. The first lesson now
contains both, after the ELF and firmware definitions and behind the existing trip-result
prediction gate. The old selected-address cards are replaced; the startup snapshots, model/native
function comparison and exercise contracts remain.

The boot schematic follows checked responsibility boundaries and selected GDB addresses. Its
host loader and guest program are separate from the qualified physical-board example. Control
arrows and file-loading arrows have visible legends. The file/RAM figure pairs each section's
stored bytes or memory-only reservation with its actual address range. It includes actual LOAD
segment sizes, an independently measured downward stack frame and a separate UART region.
Address gaps and exclusive ends are explicit; row heights represent no byte scale.

The native author updated the ELF parser and GDB recording, then ran record and normal checks
successfully. The independent technical reviewer reran the native verifier successfully and
checked QEMU's zero-fill implementation and the source-qualified firmware comparison. The
public native sources and deterministic zip are unchanged.

A separate drafting pass supplied labels and shortened the first lesson's repeated generalisation.
Independent learner and technical reviews cover the built phone/desktop light/dark states,
selection, keyboard input, address reading and prediction gates. The accepted learner finding
was that a selected control's explanation appeared below the viewport. Explanations now appear
inline after their control, with expanded state and linked accessible regions. The technical
review also corrected the RAM label and the section controls' accessible numeric descriptions.

## Check history

- Final `npm run typecheck`: exit 0.
- Focused Module 12/instruction-order tests passed before and after the refinement: 2 files,
  16 tests, exit 0 on each run.
- The first local `npm run check` passed formatting, copyright, platform integrity, types,
  138 unit files / 2774 tests and build. It was stopped to address the accepted inline-detail
  finding: 50 browser tests passed, 1 skipped, 1038 did not run and 1 interrupted, exit 130.
  No assertion failed; this command is not a full passing run.
- Final focused browser run: all 8 Module 12 tests passed, exit 0, at desktop/phone
  widths in both themes. This includes the new keyboard and attached-explanation checks,
  prediction gates, all section selections, original startup states and challenge restoration.
- Independent final learner review measured adjacent explanations at 0 pixels (one 0.75-pixel
  loader rounding case), no keyboard-triggered page scroll and focus retained in all four
  width/theme combinations. The technical reviewer independently measured the same correction.
- Final full check is running; its outcome will be recorded after completion.

Review pages are immutable copies of the production build, served at separate local ports to
avoid asset replacement during full-check rebuilds. Review records distinguish directly viewed
screenshots, browser interactions, source reading and native command evidence. No physical board
or firmware image was executed.
