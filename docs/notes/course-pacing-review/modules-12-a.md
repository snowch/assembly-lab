# Pacing review: Modules 12, 13 and optional A

Copyright © 2026 Christopher Snow

Review only. No lesson, component, exercise or native source changed. The unrelated
`docs/notes/module-12/pi-sources-brief.md` was left untouched.

## Disposition

| Module | Recommendation | Reason |
| --- | --- | --- |
| 12, Running ARM64 outside Assembly Lab | Reduce first-page concept load; a build/boot versus loading/startup boundary is justified. Keep the debugger capstone together. | Making a runnable image and explaining all of its preparation are distinct achievements. The second page's debugger session is a connected investigation. |
| 13, Running on Raspberry Pi 5 | Retain its existing preparation / boot-and-test pages. Make one small task-placement correction. | Physical actions supply the activity: wiring, building, copying, observing and restoring. Browser interaction counts would misrepresent this module. |
| A, The same programs on 32-bit ARM | Retain one optional comparative lesson. No restructuring needed. | Three short, familiar computations apply one reading method to another target. Optional reference listings prevent long return journeys. |

Module 0 establishes a useful rhythm, rather than a maximum length: one mechanism, a small
demonstration and fresh application. Its synthesis page then combines familiar mechanisms.
These later lessons may combine more because register use, arithmetic, branches, memory and
calls have already been taught. The new burdens are the external tool workflow and execution
environment in 12; board preparation and evidence in 13; target-specific reading rules in A.

## Ranked findings

### 1. Medium: separate making the first boot from explaining its complete layout

**Page:** `from-function-to-executable`, especially “Assemble and place the boot image” and
the transition to “Prepare the machine and send bytes” / “Loading, entry and firmware”.

The investigation starts with a concrete action: “Assemble the startup code and the function
separately, then link them”. It then introduces the linker script, entry point, ELF, five
sections, stack alignment, a catalogue of assembler directives, assembly-time selection and
LOAD segments before “Boot the linked program”. In particular, “The lines beginning with a
dot in the assembly are **directives** for the assembler” leads through eight spellings;
“The next lesson selects the other block for its test caller” adds a second lesson's concern.
After booting and the arithmetic-failure experiment, “Follow `_start` in `boot.s`” begins
another substantial goal: explain stack preparation, storage clearing, output and waiting.
The later inspection adds `readelf`, `objdump`, reset, boot ROM, firmware, bootloader, BIOS
and UEFI.

The burden is a change of learning goal within the page, not merely its word count. A learner
new to a Linux terminal must distinguish files, tool operations and the emulated computer,
then retain a memory-layout vocabulary before the first successful boot establishes why it
matters. The familiar arithmetic prediction usefully reduces computational novelty, but
does not practise those new tool and layout distinctions.

**Rendered evidence:** at 375 the investigation begins around y=5079 and the boot section
around y=7417 in the fresh, uncommitted page. At 1280 they begin around y=3256 and y=4742.
The intervening material is mainly explanation after the short assembly/link command block.
Both themes preserve that structure. These are layout observations, not reading-time estimates;
the learner does have real installation and build actions before the first boot. The fresh
boot instructions are prediction-gated, and were also inspected after checking the prediction.

**Smallest correction:** defer the full directive catalogue to the source inspection that uses
it; teach assembly-time `CHALLENGE` selection beside the revised test caller in the debugger
lesson. Keep the command flags, required file relationships and environment distinctions
beside the commands. Keep detailed device setup optional, as it already is. BIOS/UEFI naming
can stay in an optional comparison rather than extending the main QEMU workflow.

**Useful page boundary:** if page-level restructuring is chosen, finish a first page with a
successfully booted, deliberately broken and repaired trip check. Keep its build, reboot,
failure and repair cycle together. Put the file-to-memory inspection, recorded startup stops
and loading-versus-entry explanation on a following page, before the existing debugger page.
This separates “I can produce and rerun this image” from “I can account for its initial state”.
Move the deeper linker/section inspection with the second goal, retaining the minimal link
requirements on the build page. Do not split midway through a build command sequence or make
stack setup, clearing and the first call separate pages: those explain one startup path.

### 2. Low: the debugger capstone repeats a completed original-function trace

**Page:** `debug-native-instructions`, “Apply the correction twice”.

The page has already asked the learner to “Repeat this group through the two additions,
subtraction and `ret`”, inspect the saved result, close the session, then locate the deliberately
changed instruction's first divergence. The final task begins a new revision, but also requires:
“First inspect the original single-correction function in GDB. Restore it in `trip_distance.s`,
rebuild `boot.elf` and follow one call through the subtraction.”

Restoring a known source state is necessary after the deliberate failure. Requiring another
complete original-function session gives little new evidence to a learner who has just made
that trace. It adds QEMU/GDB restart work immediately before the new contract, separate test
caller and new executable filename. The rendered final exercise is visibly a substantial
procedure at both widths; its burden is the repeated external session, not the four-register
contract or the existence of a capstone.

**Smallest correction:** retain the restore/rebuild instruction, but let a learner who completed
the original trace use that observation when comparing contracts. Reserve the full replay for
resuming or rechecking. Keep the revised browser test, assembly-only test caller and native
failure-debugging path together. No extra lesson is needed for this finding.

### 3. Low: the preparation page's closing task depends on the next page's download

**Page:** `raspberry-pi-5`, “What carries across”.

“Open the two `trip_distance.s` files, from Module 12 and the Pi bundle in the next lesson”
asks for a source comparison before the Pi bundle has been provided on this page. The download,
extraction and source links occur in `raspberry-pi-boot` under “Build the Pi 5 image”.

This adds a forward trip to an otherwise useful stopping point: the parts and connection are
identified and the Pi is deliberately left powered off. A learner must either leave the page
to complete its closing activity or carry an unfinished task into the next one.

**Smallest correction:** place this comparison just after extraction on the build page, where
both sets of files are available. Retain the existing preparation/boot boundary. This is task
placement, not a reason to remove hardware preparation or split the boot cycle further.

## Retain, trim and rejected over-calls

**Build and boot an assembly program:** retain the familiar trip inputs and arithmetic repair;
they let a new toolchain surround a known computation. Retain the explicit QEMU/host distinction,
rebuild requirements, stop controls, troubleshooting and source-versus-recording labels. Apply
finding 1 before adding still more pages. The opening does contain installation and extraction
actions: calling it an entirely passive lead-in would be inaccurate.

**Follow startup and debug the boot image:** retain entry inspection, the debugger-written test
marker, prepared-startup stop, function breakpoint, instruction stepping, stored-result check
and first-divergence experiment as one connected session. The initial section is long on a
phone, but it alternates commands, expected observations and subheadings. Splitting it before
the function breakpoint would leave a paused remote session as the page handoff. The existing
“Inspect the saved result and close the session” is a real pause before the deliberate failure.
Keep Linux syscall comparison optional. Apply only the targeted replay trim in finding 2.

**From QEMU to Raspberry Pi 5:** retain the parts list, power-off connection instructions,
source-checked connection schematic and boot-path schematic. They carry spatial and sequence
information instead of forcing the learner to infer it. Keep the firmware/board qualification
local. The Linux/WSL USB qualification in the following page matters when opening the terminal;
do not shorten it away. Move only the forward-dependent comparison in finding 3.

**Boot and test your Pi:** retain build, staged files, card preparation, listening terminal,
first boot, deliberately broken boot and restored cold boot. This is one controlled hardware
experiment, despite its largely prose-and-command presentation. Card preparation and serial
capture are different operations within one boot, with concrete prerequisites. Keep the record
of working/broken/restored runs and the earliest-evidence troubleshooting. No page split is
required; a successful build/staged `card-files` directory is an available practical pause.
The pending hardware-verification statements are necessary evidence limits, not removable
repetition. They prevent a successful source build being mistaken for a board test.

**The same C on 32-bit Arm:** retain the limit comparison, syntax-acceptance experiment,
constant example and division helper. New names appear beside familiar C, and the lesson
repeatedly distinguishes static A32 records from executable A64. Those qualifications serve
different local comparisons. The repeated exercise listings are collapsed reference panels,
not repeated compulsory exposition. Keep them: the phone already requires contained horizontal
listing navigation, and a forced return to an earlier listing would add navigation work.
The A32 saved-register explanation is optional. There is no need to teach an entire second ISA,
and no evidence here warrants turning the three short comparisons into three lessons. If a
future extension adds substantial A32 calling-convention work, the end of the syntax experiment
would be the defensible boundary before target features and helper calls; that is not a current
restructuring recommendation.

## Coverage and limits

- Read `CLAUDE.md`, `docs/style.md`, this review's brief, the plan's module order, all five
  assigned lessons' `.ts`, `.prose.ts` and `.labels.ts`, and their native/A32 listing data.
  Read Module 0's fundamentals configuration/prose, return-to-caller prose and synthesis prose
  to establish the revised rhythm. The prerequisite order is 12 after C/machine disagreements,
  13 explicitly after 12, and A optional after the parts. This was not a new technical audit of
  every earlier lesson or of the Arm/native source evidence.
- Used the existing production preview at `http://localhost:4411/assembly-lab/`. Opened all
  five assigned pages plus `one-addition` in fresh browser contexts at 375×812 and 1280×800,
  with both light and dark selected. Confirmed the actual root theme and computed body
  backgrounds (`rgb(243,246,245)` light; `rgb(16,22,21)` dark), rather than inferring theme from
  preference. All six initial page states had viewport-width document scroll widths.
- Read rendered main text and section positions for every page/configuration. Visually inspected
  focused screenshots of the first build page's opening/investigation, debugger opening/final
  task, Pi preparation's connection section, Pi boot's card/capture section and A32's
  division/final-task transitions in all four width/theme combinations. The Module 0 visual
  comparison used its addition investigation at 375 light and 1280 dark; the other two Module 0
  configurations were DOM/text checks. Other Module 0 lessons were source-only for this review.
- In a second pass at all four configurations, checked the first prediction on each of the
  build/debug/A32 pages; confirmed build commands became available; opened the build page's
  device detail; opened A32 saved-register and local reference panels; advanced the A64 average
  once. Read the relevant `NativeFigure` and `ListingPairFigure` source to check gating and
  collapsed-reference interpretation. Did not submit final exercises, reveal their answers,
  test all hints, step every recording, inspect every memory-section selection, or check resets,
  restored progress and offline states. Supplementary details not named above were read in source.
- Temporary browser text, metrics and focused screenshots are in `/tmp/pacing-12a/`; they are
  inspection artefacts, not committed product files. Page-height observations describe fresh
  gated states and change when gates/details open. They are not complete-content lengths.
- No installation, native build, QEMU/GDB session, card preparation, physical wiring or Pi boot
  was performed. Expected terminal/hardware behaviour was read as lesson content. The Pi still
  explicitly states hardware verification is pending. No full suite or hardware claim follows
  from this pacing review, and no tests were needed for the review-note-only change.
