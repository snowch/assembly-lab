# Pi 5 preparation lesson: independent learner review

Copyright © 2026 Christopher Snow

Reviewer: `/root/pi5_prep_learner`, separate from implementation and drafting.
Scope: `raspberry-pi-5` only, as a learner who has completed the preceding course through Module 12. No physical hardware test is performed by this review.

## Source pass

Read the lesson prose, labels, structure, shared schematic renderer and visual styling, Module 12's source/ELF/startup/device/firmware explanations, and the repository style/authoring/visual rules. Review uses the displayed lesson and its prerequisites, not the implementation author's explanation of why it works.

### Finding P1: unexplained EEPROM storage

- Severity: medium, prerequisite gap.
- Quote: “Pi 5's EEPROM bootloader includes firmware work that older Pi boards load from separate `start.elf` files.” The diagram separately names “EEPROM bootloader”.
- Effect: the learner has a definition of boot ROM, firmware and bootloader from Module 12, but cannot tell what the new EEPROM identifies or why it is another stage after ROM.
- Evidence: all preceding learner prose/labels contain no EEPROM definition; Module 12 generalisation defines only boot ROM, firmware, bootloader, BIOS and UEFI.
- Direction: define the kind of on-board storage locally and relate it to the bootloader before the diagram. No full acronym lesson is needed.
- Disposition: accepted. The separate draft now defines EEPROM as rewritable storage retaining contents without power before the diagram. Independently verified in the final built page at both widths and themes.

### Finding P2: ambiguous image versus control handoff

- Severity: low, mechanism clarity.
- Quote: “The selected image passes through the firmware's Arm startup code, called its **Arm stub**, before our `_start` runs.”
- Effect: “image passes through code” can be read as processing or transforming the image bytes, while the diagram shows control passing through startup stages.
- Direction: describe the Arm stub executing before the selected image's entry, and make the control transfer explicit.
- Disposition: accepted. The separate draft now says the Arm stub runs before handing control to the image entry. Independently verified in the final built page at both widths and themes.

## Prior knowledge audit

- Already taught: a register, memory, address, AArch64 instruction execution, assembly source, caller/function/return, stack and `.bss`, GNU assembler and linker, ELF entry/loading information, QEMU system mode, UART/serial byte output, board-specific device setup, boot ROM, firmware and bootloader. These are all used in Module 12 before this lesson.
- Defined here: raw image; Arm stub; the Debug Probe's purpose for serial data; U versus D sockets; dedicated UART connector versus the large GPIO header; probe USB power versus the Pi's own supply; meaning and limits of a source-checked schematic.
- Ordinary hands-on prerequisites are explicit: Pi 5, supply, official probe with included cables, spare microSD and reader, Linux/Ubuntu terminal and existing GNU tools. Recognising marked sockets is aided by official photographs; no guessed pin order is required.
- The EEPROM gap P1 is now locally defined; no remaining prerequisite gap was found in this preparation lesson.

## Mechanism and progression

Module 12 already gives a small complete bootable program and separately traces startup and output; this lesson ports that familiar function rather than composing unfamiliar arithmetic with unfamiliar devices. The separate probe connection schematic and boot path are appropriate small bridges before building the physical image. A still smaller arithmetic example would not teach the new board boundary. All preparation is visible without an activity completion gate.

## Closing style passes

Sentence scan: short direct commands and specific headings; no decorative metaphor or generic simulator boilerplate. The technical image/control phrase is tracked as P2. Idea pass: the learner can distinguish unchanged arithmetic from load/startup/device choices, locate required parts, identify the two relevant connectors and explain why source/build checks do not prove physical operation. The final local EEPROM definition closes the missing term. The diagrams carry the output route and boot sequence, reducing the number of simultaneous relationships held in prose.

## Built-page verification

Production site: `http://localhost:4398/assembly-lab/#/lesson/raspberry-pi-5`. Browser script `/tmp/pi5-prep-review.cjs` completed successfully in all four contexts: 375/light, 375/dark, 1280/light and 1280/dark. Results are in `/tmp/pi5-prep-review-results.json`.

- Actual `html[data-theme]` and computed body background confirmed the requested theme, rather than merely checking a saved preference.
- Document scroll width equals viewport width in every context (375 or 1280). No duplicate IDs, `.al-problem`, `.al-locked` or page exceptions were found.
- All prerequisites, P1/P2 corrections, connector instructions and hardware-pending qualification are visible without opening details or completing another activity.
- Serial route is Pi → probe → computer. It lays out vertically on the phone and horizontally on desktop, with strong direction arrows in both themes. Boot route stays ordered ROM → EEPROM bootloader → Arm stub → image startup → function → serial report. Its labels explicitly identify it as a source-checked schematic rather than a board recording.
- Captured full-page screenshots and diagram crops: `/tmp/pi5-prep-{375,1280}-{light,dark}.png` plus `-serial.png` and `-boot.png`. Directly viewed serial crops in all four contexts and boot crops at phone/dark and desktop/light; all four contexts were measured in the browser. Node text, borders and arrow shafts/heads are legible.
- The official product, cable-picture and boot-documentation links have the intended HTTPS targets. This browser pass inspected their hrefs; it does not claim an independent physical wiring test or fresh external-doc verification.
- Previous lesson points to `debug-native-instructions`, next lesson points to `raspberry-pi-boot`. Navigated to the latter and back, then reloaded; the preparation remains visible and the selected theme persists.

Both accepted findings are closed in the actual built page. No rejected findings or remaining learner blockers. This verdict is limited to the preparation lesson and browser presentation. Firmware behaviour, connector wiring on a real board and physical serial operation remain untested here.
