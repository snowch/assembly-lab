# Raspberry Pi 5: source and build facts

Copyright © 2026 Christopher Snow

Checked 26 October 2026. The target is the user's Raspberry Pi 5 Model B, with the official Debug Probe and its supplied JST-SH-to-JST-SH cable. This is an explicitly unverified hardware profile. No Pi was connected here. GNU tools assembled and linked the files and checked their layout; QEMU user mode executed only the unchanged portable arithmetic. No Pi 5 firmware, UART clock, pin routing, EEPROM, SD loading or physical serial output was executed or recorded.

## Primary sources read

The documentation tree API still resolved to commit `41e24fbd459d47e7db979cd084676c790b60a3de` when fetched in this pass. Relevant sections were read from the actual source files:

- [EEPROM boot flow](https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/raspberry-pi/bootflow-eeprom.adoc): SoC ROM starts the SPI EEPROM loader; the loader selects boot media; Pi 5 has the `start.elf` functionality embedded rather than loading separate `start.elf`/`fixup` files.
- [Boot configuration](https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/config_txt/boot.adoc): `kernel` selects a file; `armstub` defaults to firmware-selected low-level initialisation code; Pi 5 is 64-bit only; `os_check=0` explicitly permits bare-metal development; `uart_2ndstage=1` requests firmware UART logging. That last option does **not** document a complete guaranteed UART handoff state.
- [Legacy boot options, kernel_address](https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/legacy_config_txt/boot.adoc): explicit image load address. This profile selects `0x200000` rather than teaching an assumed default.
- [Device Tree configuration, part5.4](https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/configuration/reference.adoc#part5.4): `device_tree=` disables Device Tree loading; the earlier overview specifically identifies simple bare-metal kernels as a use. This avoids relying on the firmware's revision-dependent choice between BCM2712 DTB names. The program does not read a Device Tree or use Linux drivers.
- [UART interfaces](https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/configuration/interfaces.adoc): Pi 5's dedicated three-pin connector labelled UART exposes PL011 UART10; the early-console table gives CPU physical address `0x107d001000`. The course does not run an `earlycon` Linux command; the documented address corroborates the device address used in assembly.
- [Firmware inspection](https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/computers/configuration/firmware.adoc): `sudo rpi-eeprom-update` with no update flags reports the current version; `rpi-eeprom-config` with no arguments reads the running configuration. The course does not use `-a`, `--edit` or `--apply`.
- [Debug Probe introduction](https://github.com/raspberrypi/documentation/blob/41e24fbd459d47e7db979cd084676c790b60a3de/documentation/asciidoc/microcontrollers/debug-probe/introduction.adoc): 3.3 V I/O, USB UART bridge, supplied USB cable and JST-SH-to-JST-SH cable. The UART connection uses the port marked U, not the SWD port. Follow the keyed connectors; do not substitute Pi 4 GPIO40-pin wiring.
- [Official BCM2712 device description](https://github.com/raspberrypi/linux/blob/5bd564aaa8dc4b1b8ed11733c19ec8ece63a72cc/arch/arm64/boot/dts/broadcom/bcm2712.dtsi): `clk_uart` is a fixed 9,216,000 Hz clock; UART10 uses it and has the PL011 register layout. Its bus address is translated by the containing ranges; use the CPU physical address above, not the raw bus address `0x7d001000`.
- [Official Pi 5 Model B device description](https://github.com/raspberrypi/linux/blob/5bd564aaa8dc4b1b8ed11733c19ec8ece63a72cc/arch/arm64/boot/dts/broadcom/bcm2712-rpi-5-b.dts): UART10 is identified as the debug UART on the JST-SH connector. These are inspected source facts; this module does not boot Linux or download/ship the DTB.
- [Arm PL011 Technical Reference Manual, DDI0183](https://developer.arm.com/documentation/ddi0183/g): UARTDR/FR/IBRD/FBRD/LCR_H/CR/IMSC/ICR and the baud divisor relation. The register policy matches Module 12's independently checked PL011 programming model, with Pi 5's distinct base and clock. Linux's documented mmio32 mode is respected with 32-bit device accesses.

## Profile and qualifications

`apps/course/public/native/pi5/config.txt` fixes the image filename and load address, selects Pi 5, disables the OS compatibility check and DTB loading, and requests firmware UART logging. There is no EEPROM rewrite, custom Arm stub, RP1/PCIe setup, Linux kernel, C runtime, initramfs or firmware binary download. The initial spare-card recipe is the **first FAT32 partition**, containing exactly the two boot files listed in the build evidence. It remains a proposed physical boot recipe until the hardware checklist is completed. The ordinary EEPROM SD boot path must already work on the board; custom secure boot or unusual boot order is outside this first profile.

`boot.s` masks exceptions, parks non-primary affinity cores, accepts EL1 or EL2, checks that the current exception level's MMU-enable and big-endian-data bits are clear, selects that level's stack, reserves its own aligned stack and clears `.bss`. It neither assumes a universal entry level nor performs an unnecessary EL transition. EL3, an enabled MMU or big-endian data parks without serial output. EL0 cannot execute the privileged startup and is outside this firmware handoff profile. It records the observed entry level and prints it dynamically if UART output works.

The native-only system-register, barrier and device instructions do not expand the browser assembler's supported instruction set. A UART example naturally composes startup and device access; Module 12 has already demonstrated startup, `.bss`, stack establishment and PL011 polling. This module changes the physical loading/device contract rather than replacing the browser model.

For UART10 the profile waits for existing firmware transmission to finish, disables the device, masks/clears UART interrupts, writes integer/fractional divisors 5/0, selects eight data bits, FIFO, no parity and one stop bit, then enables the transmitter. The divisor is exact: `9,216,000 / (16 × 115,200) = 5`. The clock and route must actually be available at handoff. `uart_2ndstage=1` and a connected cable are intended to exercise the firmware path, but the static build cannot prove that a particular EEPROM firmware preserves the required clock/reset/routing state. A blank terminal must not be diagnosed as an arithmetic failure.

The report follows the **actual** function result, comparing it to 232; it does not merely print a constant success string. Changing the third arithmetic instruction to ADD produces 262, selecting the failure report. Neither string is presented as a recorded board result. The first line also reports the measured entry EL as a single digit.

## Build checks

`python3 scripts/pi5/check.py` builds in a temporary directory and checks:

- byte-identical `trip_distance.s` with Module 12;
- ELF AArch64, little-endian, entry/load origin `0x200000`, allocated sections and PT_LOAD coverage;
- raw binary byte mapping, length, hash and omission of NOBITS `.bss`/stack;
- an aligned reserved stack, aligned complete `.bss`, result and entry-level slots;
- critical entry/device instructions, report bytes and exact UART divisor;
- an arithmetic-only Linux user-mode QEMU harness: original function returns the expected value; changed third instruction fails the comparison;
- the two-file staging target and its generated checksums;
- deterministic source-zip contents against the public source files.

`--record` refreshes `build-evidence.json` and `assembly-lab-pi5.zip`. The evidence says **build checks only**. It records tool versions separately; normal CI verifies file facts without requiring those exact installed version strings. The zip contains only the course's own sources and checklist, not third-party firmware or machine images. The learner builds the image locally. There are no embedded private credentials, board identifiers or host-device paths.

During verifier development, one first run failed because the reused ELF-layout helper does not return a separate `entry` key. The assertion was corrected to use its already entry-checked first section address. No product source or test expectation was relaxed. The following record/check runs passed; that first failed run remains distinct from final results.
