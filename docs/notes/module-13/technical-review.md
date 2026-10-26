# Module 13 independent technical review

Copyright © 2026 Christopher Snow

Review scope: Pi 5 native source, selected boot/configuration contract, the two learner pages,
source schematics and build checks. This reviewer did not author those product changes.
Physical hardware is unavailable; no source inspection or build result is a boot measurement.

## Independent primary-source checks

Read the official Raspberry Pi documentation at commit
`41e24fbd459d47e7db979cd084676c790b60a3de`:

- `computers/raspberry-pi/bootflow-eeprom.adoc`: SoC ROM, EEPROM second-stage loader;
  Pi 5 has the old `start.elf` functionality embedded in the bootloader.
- `computers/config_txt/boot.adoc`: `kernel` selects an image filename; Pi 5 firmware is
  self-contained in EEPROM; `config.txt` marks a bootable partition; `os_check=0` is documented
  for bare-metal development; the default Arm stub is firmware/model/configuration-selected.
- `computers/legacy_config_txt/boot.adoc`: explicit `kernel_address` establishes the load
  address; the checked documentation gives the 64-bit default as `0x200000`, but this course
  does not rely on an implicit default.
- `computers/configuration/interfaces.adoc`: Pi 5 primary UART10 uses the dedicated three-pin
  connector marked UART. Its published CPU early-console address is `0x107d001000`.
  Linux device names and early-console commands are corroborating address documentation,
  not bare-metal operating-system services.
- `microcontrollers/debug-probe/introduction.adoc`: official probe has a USB/UART bridge,
  nominal 3.3 V I/O and an included JST-SH to JST-SH cable for the standard three-pin connector.
  Target power should be removed before connecting the probe unless ground is connected first.
- `microcontrollers/debug-probe/uart-connection.adoc`: host CDC UART device naming varies;
  `/dev/ttyACM0` is an example, not a guaranteed path.

Read official Raspberry Pi Linux `rpi-6.12.y` (resolved commit
`5bd564aaa8dc4b1b8ed11733c19ec8ece63a72cc`, 21 October 2026):
`arch/arm64/boot/dts/broadcom/bcm2712.dtsi` defines `clk_uart` as fixed 9,216,000 Hz and
connects it to UART10 as `uartclk`. The Pi 5 board DTS identifies the dedicated JST-SH
connector. This supports the chosen 115200-baud divisor calculation; it does not measure the
user's board clock or prove the selected EEPROM handoff.

Local fetched source copies are in `/tmp/pi5-tech-review`. One attempted fetch of the
short-link debug connector PDF followed redirects to HTTP 403; no PDF pin-order claim rests
on that attempt. The official probe introduction and connector-level schematic avoid a
fabricated pin order or orientation.

## Findings raised during implementation

1. **Medium, manifest selection.** The initial `config.txt` left the device-tree filename
   implicit while the proposed three-file card supplied only `bcm2712-rpi-5-b.dtb`. Current
   firmware also supplies a `bcm2712d0-rpi-5-b.dtb`, so implicit revision selection could request
   an absent file. Direction: explicitly select the same filename as the pinned manifest, or
   substantiate the exact firmware fallback. Sent to the native author for resolution.
2. **Qualification, UART inheritance.** The `uart_2ndstage` documentation promises firmware
   UART logging, not a universal bare-metal pinmux/reset/clock handoff contract. The recipe must
   expose its hardware-unverified status and check the user's actual EEPROM/serial result.
   This is a test boundary, not proof that the source profile is invalid.

## Resolutions and verification

- The manifest concern was resolved with `device_tree=` and Pi 5's explicit `os_check=0`,
  eliminating the DTB download entirely. Independently read official
  `computers/configuration/reference.adoc`, part 5.4: bare-metal and other operating systems can
  disable Device Tree usage with an empty `device_tree=`. The selected two-file profile remains
  a proposed hardware recipe, not an observed successful boot.
- The UART handoff qualification is visible in the build paragraph, model limitation and
  hardware-test checklist. The profile has source-supported constants and a runtime entry
  condition guard; a particular EEPROM's physical handoff still needs the user's test.
- EEPROM initially lacked a plain local definition. Final preparation prose defines it as
  rewritable storage that retains its contents without power. Boot ROM, firmware, bootloader,
  UART, assembler, linker, ELF and stack/BSS preparation were checked in preceding Module 12.
- The source archive initially omitted its hardware checklist; the final archive includes it.
- The image validator initially typed UART evidence without proving those values appeared in
  the image. It now decodes the actual UART-base literal and checks the assembled divisor and
  control-write sequence. These are substantive guards against an incorrect image constant.

Independent `scripts/pi5/check.py` execution passed initially. A later independent run failed
because the checklist had just changed after source-zip generation. The author regenerated the
archive after final checklist edits; the independent rerun then passed. The initial failure is
not reclassified. Final log: `/tmp/pi5-technical-native-final.log`.

The final native source masks exceptions, parks secondary cores, checks privileged EL1/EL2,
MMU-disabled and little-endian entry, chooses its own aligned stack, clears complete BSS and
uses the unchanged portable function. Manual source inspection checked call-preserved values,
actual-result comparison/message selection, word-wide UART accesses, divisor/control writes,
FIFO polling and the final waiting loop. The independent validator assembled/linked the actual
public files, checked raw/ELF layout, ran original/broken arithmetic-only QEMU calls and checked
the source archive. It did not execute Pi firmware or devices.

The plan adds Module 13 after QEMU; optional A moves to numeric schema module 14 but retains
its lesson ID. Runtime storage keys use book/lesson IDs, so this move does not rename its saved
work. No platform source was changed.

## Built-site inspection

Reviewed the production preview at `http://localhost:4398/assembly-lab/`, both lessons at
375 and 1280 pixels in actual light and dark themes: eight page contexts. Browser script
`/tmp/pi5-technical-browser.mjs`, results `/tmp/pi5-technical-browser.json`, and screenshot/text
artifacts `/tmp/pi5-technical-raspberry-pi-*.png` and `.txt` retain the inspection.

Both preparation diagrams and the image-build diagram are visible, labelled as source
schematics and show directed relationships. The page never overflows sideways; diagram nodes
remain within the viewport. No page errors, figure problems or prediction locks appeared.
The visible lessons define the selected Linux/Ubuntu host path, distinguish UART serial from
instruction debugging, identify U versus D and UART versus the GPIO header, show matching
link/load choices and leave all physical results pending. Ordinary source output expectations
are not labelled recordings. The working/broken/restored procedure rebuilds and replaces the
image explicitly. The observed privilege level is not filled from an assumed firmware default.

The optional Raspberry Pi OS identification commands were also inspected in official
`raspberrypi/rpi-eeprom` source: default `rpi-eeprom-update` reaches status/version reporting;
update/apply modes require arguments. Default `rpi-eeprom-config` prints the current config.
The visible directions explicitly forbid adding update/edit flags and permit unknown details.

All six learner-facing local downloads returned successfully. The four assembly/config/linker
files matched current public sources. The zip and checklist in that preview were stale after
the just-completed final checklist regeneration; root was notified to rebuild before release.
After the final production rebuild, all six downloads matched the current public source bytes,
including the refreshed zip and checklist. Every one of the archive's six members also matched
its public source. Final download evidence: `/tmp/pi5-technical-downloads-final.json`. The
independent native verifier passed again after that refresh. The browser script then reran all
eight final-build page contexts successfully; `/tmp/pi5-technical-browser-final.json` records
actual themes, rendered diagrams, links and absence of page errors/overflow. No learner-copy or
technical blocker remains.

## Evidence limits

The course supplies a physical test, not a physical result. No Pi, EEPROM image, dedicated UART
clock/reset/pin routing, power supply, cable, actual SD boot or serial capture was exercised
here. Physical instruction stepping through the Debug Probe was neither implemented nor
claimed. The connector diagram deliberately avoids invented left/right pin ordering; marked
sockets, keyed cable and official pictures identify the connection.


## Sceptic pass on the independent learner findings

Read the preparation and boot learner reviews against the actual built text and prerequisite
source. All four findings survive scrutiny and their smallest corrections are present:

- **P1, EEPROM:** upheld. Module 12 defines ROM/firmware/bootloader but not EEPROM; the new
  local persistent-rewritable-storage definition closes the exact missing prerequisite.
- **P2, image/control transfer:** upheld as clarity, not an incorrect instruction claim. The
  final wording describes the Arm stub executing before handing control to `_start`. It no
  longer suggests the image bytes pass through code as a transformation.
- **BL1, partition/root:** upheld. Earlier source/terminal work does not teach disk layout.
  The final page defines the region and top-level directory, identifies the supported Ubuntu
  utility, requires the spare-device/FAT32 check and stops before unidentified erasure. The
  review did not execute the actual Ubuntu Disks interaction; that limit is retained.
- **BL2, identifiers:** upheld. The final preparation provides read-only default identification
  commands, the reflection names the footer commit and actual image checksum command, and
  unavailable board details remain unknown rather than guessed.

The learner reviewers' non-findings also hold: another browser arithmetic quiz would duplicate
prior content without testing this board; supplied UART setup can remain a qualified device
operation after Module 12; the preceding visible wiring lesson need not be repeated. The build
schematic locally carries the distinct source/object/ELF/raw/card relationship. No rejected
reader finding was converted into an unrecorded product change.

The binding root guidance now explicitly permits Module 13 source-checked schematics and its
separate build-only checker, while retaining actual hardware evidence as a separate requirement.
The CI native job runs that checker. The plan/source docs identify the module and validation
boundary consistently. No browser ISA or copied platform implementation was expanded.

**Independent verdict:** approved for release as a hardware-unverified Pi 5 extension, with the
provided physical test to be performed and recorded on the user's board. This approval is for
source accuracy, assembled artifact consistency and final built presentation; it is not a
claim of successful physical boot.
