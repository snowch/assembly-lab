# Module 13: Raspberry Pi 5 (lesson text)

Copyright © 2026 Christopher Snow

Drafted separately from the native source and checked fact briefs. This record contains the current learner-facing prose and labels verbatim. Native file checks and physical-board verification are distinct.

## PI_PREP_PROSE.question

The trip calculation already runs on QEMU. Move that same assembly function onto a Raspberry Pi 5. The work changes around it: firmware loads the image, startup prepares the processor, and a physical serial connection carries the report.

**Hardware verification is pending.** The build checks inspect the image's files and layout. They do not establish that the Pi boots it or sends readable serial output. The next lesson gives you that physical test.

## PI_PREP_PROSE.motivation

Complete Module 12 first. Use these parts:

- A Raspberry Pi 5 and its suitable power supply.
- An [official Raspberry Pi Debug Probe](https://www.raspberrypi.com/products/debug-probe/), including its USB cable and three-pin-to-three-pin serial cable.
- A spare microSD card and a card reader. Keep your usual Raspberry Pi OS card separate.
- A Linux computer with the GNU tools from Module 12 and a USB port for the probe. The commands use an Ubuntu terminal. Downloading the bundle and installing tools needs an internet connection.

The Debug Probe carries serial bytes between the Pi and your computer. We use that connection to read output, not to step the processor. The probe receives power over USB; power the Pi through its normal power supply.

If you have a normal Raspberry Pi OS card, record the board and bootloader before swapping it out:

```sh
cat /sys/firmware/devicetree/base/model
sudo rpi-eeprom-update
rpi-eeprom-config
```

These commands read identification and settings; do not add update or edit flags. Keep the output with your test record. If that information is unavailable, record it as unknown.

## PI_PREP_PROSE.investigation

With the Pi and probe disconnected from power, connect the supplied three-pin cable between the probe's **U** socket and the Pi 5 connector labelled **UART**. This dedicated connector is separate from the large GPIO header. The probe's **D** socket is for a different debugging connection.

Match the keyed plugs to their sockets and do not force them. Use the [official probe picture and cable guide](https://www.raspberrypi.com/documentation/microcontrollers/debug-probe.html#about-the-debug-probe) to identify them. The schematic shows the connection and output direction; it is not a pin-orientation drawing or a recording of a Pi run. Leave the Pi powered off until the next lesson's terminal is ready.

## PI_PREP_PROSE.explanation

The diagram follows this example's normal microSD boot path. The Pi stores its bootloader in **EEPROM**, rewritable storage that keeps its contents without power. Pi 5's bootloader includes firmware work that older Pi boards load from separate `start.elf` files. The firmware's Arm startup code, called its **Arm stub**, runs before handing control to our image's `_start`.

The next lesson supplies a raw image: instruction and data bytes without ELF loading information. The firmware configuration and linker script must agree about where those bytes go. Our startup then prepares its own stack and clears `.bss`, as it did in QEMU.

The Pi's firmware and devices belong to this board. Reusing QEMU's UART address or assuming its initial processor state would not port the program.

## PI_PREP_PROSE.reflection

Open the two `trip_distance.s` files, from Module 12 and the Pi bundle in the next lesson. The arithmetic instructions stay the same. Identify the files that instead choose the load address, prepare startup and send the report. Those are the parts to inspect when moving this function to another board.


## PI_PREP_PROSE.originalityNote.textbookExample

A bare-metal board exercise that begins again with an unrelated greeting.

## PI_PREP_PROSE.originalityNote.howThisDiffers

The learner ports the already tested trip function from the preceding QEMU capstone. Connection and boot-chain schematics separate unchanged arithmetic from firmware loading, board startup and serial output.

## PI_PREP_LABELS.title

From QEMU to Raspberry Pi 5

## PI_PREP_LABELS.objectives.0

identify the unchanged function and the board-specific startup and output;

## PI_PREP_LABELS.objectives.1

connect the Debug Probe to the Pi 5's dedicated UART;

## PI_PREP_LABELS.objectives.2

trace the selected boot path from firmware to our assembly program.

## PI_PREP_LABELS.titles.question

The same function on a physical board

## PI_PREP_LABELS.titles.motivation

What you need

## PI_PREP_LABELS.titles.investigation

Connect the serial cable

## PI_PREP_LABELS.titles.explanation

From power-on to our program

## PI_PREP_LABELS.titles.reflection

What carries across

## PI_PREP_LABELS.captions.serial

The serial report travels from the Pi, through the probe, to your terminal.

## PI_PREP_LABELS.captions.boot

The selected normal microSD boot path, from board startup to the trip report.

## PI_PREP_LABELS.serialDiagram.kind

serial

## PI_PREP_LABELS.serialDiagram.title

Pi 5 serial connection

## PI_PREP_LABELS.serialDiagram.note

Connection schematic. Identify the marked sockets on the actual devices before connecting the supplied cable.

## PI_PREP_LABELS.serialDiagram.nodes.0.id

pi

## PI_PREP_LABELS.serialDiagram.nodes.0.title

Raspberry Pi 5

## PI_PREP_LABELS.serialDiagram.nodes.0.detail

Dedicated three-pin connector labelled UART

## PI_PREP_LABELS.serialDiagram.nodes.1.id

probe

## PI_PREP_LABELS.serialDiagram.nodes.1.title

Debug Probe

## PI_PREP_LABELS.serialDiagram.nodes.1.detail

Socket labelled U; powered by USB

## PI_PREP_LABELS.serialDiagram.nodes.2.id

computer

## PI_PREP_LABELS.serialDiagram.nodes.2.title

Your computer

## PI_PREP_LABELS.serialDiagram.nodes.2.detail

Terminal receiving the serial report

## PI_PREP_LABELS.serialDiagram.links.0.from

pi

## PI_PREP_LABELS.serialDiagram.links.0.to

probe

## PI_PREP_LABELS.serialDiagram.links.0.label

Serial output · supplied three-pin cable

## PI_PREP_LABELS.serialDiagram.links.1.from

probe

## PI_PREP_LABELS.serialDiagram.links.1.to

computer

## PI_PREP_LABELS.serialDiagram.links.1.label

USB serial data

## PI_PREP_LABELS.serialDiagram.footnote

Connect with power off. Use the dedicated UART connector, not the GPIO header or the probe's D socket. [Official connector and cable pictures](https://www.raspberrypi.com/documentation/microcontrollers/debug-probe.html#about-the-debug-probe).

## PI_PREP_LABELS.bootDiagram.kind

boot

## PI_PREP_LABELS.bootDiagram.title

The Pi 5 boot path used here

## PI_PREP_LABELS.bootDiagram.note

A source-checked schematic of the selected microSD path, not a recording of the board.

## PI_PREP_LABELS.bootDiagram.nodes.0.id

rom

## PI_PREP_LABELS.bootDiagram.nodes.0.title

Boot ROM

## PI_PREP_LABELS.bootDiagram.nodes.0.detail

Begins the board's boot process

## PI_PREP_LABELS.bootDiagram.nodes.1.id

eeprom

## PI_PREP_LABELS.bootDiagram.nodes.1.title

EEPROM bootloader

## PI_PREP_LABELS.bootDiagram.nodes.1.detail

Includes Pi 5 firmware; reads the selected microSD image

## PI_PREP_LABELS.bootDiagram.nodes.2.id

stub

## PI_PREP_LABELS.bootDiagram.nodes.2.title

Firmware's Arm stub

## PI_PREP_LABELS.bootDiagram.nodes.2.detail

Prepares the handoff to the image

## PI_PREP_LABELS.bootDiagram.nodes.3.id

startup

## PI_PREP_LABELS.bootDiagram.nodes.3.title

Our _start

## PI_PREP_LABELS.bootDiagram.nodes.3.detail

Prepares the stack and clears .bss

## PI_PREP_LABELS.bootDiagram.nodes.4.id

trip

## PI_PREP_LABELS.bootDiagram.nodes.4.title

trip_distance

## PI_PREP_LABELS.bootDiagram.nodes.4.detail

Runs the unchanged assembly calculation

## PI_PREP_LABELS.bootDiagram.nodes.5.id

uart

## PI_PREP_LABELS.bootDiagram.nodes.5.title

Serial report

## PI_PREP_LABELS.bootDiagram.nodes.5.detail

Our caller checks the returned result and sends a message

## PI_PREP_LABELS.bootDiagram.links.0.from

rom

## PI_PREP_LABELS.bootDiagram.links.0.to

eeprom

## PI_PREP_LABELS.bootDiagram.links.0.label

Board boot

## PI_PREP_LABELS.bootDiagram.links.1.from

eeprom

## PI_PREP_LABELS.bootDiagram.links.1.to

stub

## PI_PREP_LABELS.bootDiagram.links.1.label

Firmware startup

## PI_PREP_LABELS.bootDiagram.links.2.from

stub

## PI_PREP_LABELS.bootDiagram.links.2.to

startup

## PI_PREP_LABELS.bootDiagram.links.2.label

Image handoff

## PI_PREP_LABELS.bootDiagram.links.3.from

startup

## PI_PREP_LABELS.bootDiagram.links.3.to

trip

## PI_PREP_LABELS.bootDiagram.links.3.label

Function call

## PI_PREP_LABELS.bootDiagram.links.4.from

trip

## PI_PREP_LABELS.bootDiagram.links.4.to

uart

## PI_PREP_LABELS.bootDiagram.links.4.label

Return, check and send

## PI_PREP_LABELS.bootDiagram.footnote

Other boot media, recovery and secure-boot paths are outside this exercise. [Raspberry Pi boot documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#boot-sequence).

## PI_BOOT_PROSE.question

Build the Pi 5 image, boot it from a spare card and capture its serial report. Then deliberately break the calculation and test whether the report detects it.

**Hardware verification is pending.** Expected messages below come from the source, not a recorded Pi run. Keep your normal Raspberry Pi OS card available.

## PI_BOOT_PROSE.investigation

[Download the Pi 5 source bundle](native/pi5/assembly-lab-pi5.zip) into a folder where you can open your Ubuntu terminal. Use that terminal to install the serial tool, extract the bundle and build it. Keep the GNU tools, `make` and `unzip` installed in Module 12:

```sh
sudo apt-get install picocom
unzip assembly-lab-pi5.zip
cd assembly-lab-pi5
make
make card-files
```

`make` runs the GNU assembler, linker and `objcopy`. The last tool converts `boot.elf` into the raw bytes in `assembly-lab-pi5.img`. No C compiler is used. `make card-files` stages the two boot files and writes `SHA256SUMS`, a record of their SHA-256 checksums. Each checksum is a fingerprint of the file's bytes. Neither command writes to a card. Stop if a build command fails.

Compare [boot.ld](native/pi5/boot.ld) with [config.txt](native/pi5/config.txt). Both select `0x200000` as the image's address. `kernel=assembly-lab-pi5.img` selects our filename; it does not turn our program into Linux. The `.img` file has no ELF entry or loading information for firmware to read. Keep these address and filename choices together. `device_tree=` disables loading a device-description file, which this small bare-metal image does not use.

The unchanged [trip_distance.s](native/pi5/trip_distance.s) is linked with [boot.s](native/pi5/boot.s), which supplies this board's startup and UART output. Keep the supplied device setup unchanged for the first hardware test. `uart_2ndstage=1` requests firmware diagnostics on the serial connection. This example depends on firmware preparing that UART path; its clock and connector routing still need confirmation on the physical board.

## PI_BOOT_PROSE.construction

Use a spare card whose first partition, a separately formatted region, uses the FAT32 filesystem the bootloader can read. Preparing or formatting a card can erase it; check that you have selected the spare card in your computer's disk utility. In Ubuntu Disks, select the spare card by its capacity and device name. Select its first partition and use the partition-format action to choose FAT. This erases that partition. Check that the result is FAT32 before copying files. If you cannot identify or prepare that partition, stop before erasing anything.

Copy these two files from `card-files/` into the partition's root, its top-level folder:

- `config.txt`
- `assembly-lab-pi5.img`

This Pi 5 path does not require a device-description file or separate `start.elf` and `fixup.dat` files. Keep `SHA256SUMS` on your computer as a record of the copied build. Safely eject the card, then insert it while the Pi is powered off.

Connect the probe to your Linux computer over USB. Find its serial-device path:

```sh
ls /dev/serial/by-id/
```

Identify the entry that appears when you connect the probe. Set `PORT` to that entry's full path, replacing the example placeholder below, then open the terminal:

```sh
PORT=/dev/serial/by-id/replace-with-your-probe-entry
picocom --baud 115200 --databits 8 --parity n --stopbits 1 --flow n "$PORT"
```

These settings mean 115200 bits per second, eight data bits, no parity, one stop bit and no flow control. If access is denied, close this attempt and repeat the `picocom` command with `sudo` before it. This USB-device sequence is for Linux; a Windows WSL terminal does not automatically receive the probe's USB connection.

With the cable already connected to the Pi's UART connector and the terminal listening, power the Pi normally. Firmware diagnostics may appear first. Our program is written to print its measured entry **exception level**, which controls access to processor-management operations, followed by its trip check:

```text
Assembly Lab Pi 5: trip check passed
```

The caller supplies the same four inputs as Module 12, calls the function and compares its returned value before choosing the message. A passing line is evidence of that call and output path on your board, not a test of every possible input. Save the actual output. Press Ctrl-A, release it, then Ctrl-X to close picocom. The Pi's program stays in its waiting loop; remove Pi power before changing the card or cable.

## PI_BOOT_PROSE.failureExperiment

Power the Pi off and return the card to your computer. Change the third arithmetic instruction in `trip_distance.s` from `sub w0, w0, w3` to `add w0, w0, w3`. Run `make` and `make card-files` again. Replace the card's image with the newly built `assembly-lab-pi5.img`, safely eject it and repeat the boot with the serial terminal already open.

The expected source-selected report is now `Assembly Lab Pi 5: trip check failed`. Capture what the board actually sends. Restore the subtraction, rebuild, replace the image and boot once more. A fresh passing report after restoration helps establish that you tested the new image each time. Editing the source on your computer does not change the card or the running Pi.

## PI_BOOT_PROSE.explanation

Use the earliest evidence you have:

- **No probe device:** check its USB data connection and host access before investigating the Pi's code.
- **Firmware messages but no Assembly Lab line:** inspect the card's filenames, load address and new image. Startup accepts entry at EL1 or EL2, two exception levels, with address translation disabled. Address translation maps a program's addresses to other memory addresses. Other entry conditions stop this image without output. Firmware output alone does not establish that our startup ran.
- **Unreadable characters:** check the terminal's speed and line settings against the supplied UART setup. A successful assembly does not test the physical serial clock.
- **A trip-check failure:** our caller reached its comparison and chose the failing report. Inspect the arithmetic and make sure the card contains the intended build.
- **No bytes at all:** a missing report does not locate the fault. Recheck the dedicated connector, cable, power, card and terminal before concluding that the arithmetic failed.

The [Pi 5 sources and hardware-test record](native/pi5/HARDWARE-TEST.md) distinguish the checked file layout from the still-unverified firmware handoff and serial path. Do not use Module 12's QEMU `virt` run as evidence that this board-specific image boots.

## PI_BOOT_PROSE.reflection

Record your Pi model, EEPROM version, source revision, image checksum, terminal settings and actual serial capture. Use the optional Raspberry Pi OS commands in the previous lesson for board and EEPROM details, or record unknown. Copy the commit shown in the course footer as the source revision. Run `sha256sum assembly-lab-pi5.img` in the source directory for the image's fingerprint. Keep the working, broken and restored runs separate. Repeat the restored image from a fresh power-on.

Which observation shows that our code ran? Which shows that the arithmetic check rejected the deliberate error? If a stage is still unobserved, record it as unverified. Your hardware test completes the evidence that a build alone cannot provide.


## PI_BOOT_PROSE.originalityNote.textbookExample

A hardware greeting printed without checking a calculation or a deliberately broken image.

## PI_BOOT_PROSE.originalityNote.howThisDiffers

The learner builds a board-specific wrapper around the known trip function and records working, broken and restored cold boots. Each observation identifies what file checks establish and what requires physical evidence.

## PI_BOOT_LABELS.title

Boot and test your Pi

## PI_BOOT_LABELS.objectives.0

build an assembly-only image with matching load and link addresses;

## PI_BOOT_LABELS.objectives.1

boot from a spare card and capture the actual serial report;

## PI_BOOT_LABELS.objectives.2

test a broken calculation and distinguish observed results from unverified stages.

## PI_BOOT_LABELS.buildDiagram.kind

boot

## PI_BOOT_LABELS.buildDiagram.title

Source files to card image

## PI_BOOT_LABELS.buildDiagram.note

The file transformations run by the supplied Makefile. This schematic does not execute the build.

## PI_BOOT_LABELS.buildDiagram.nodes.0.id

source

## PI_BOOT_LABELS.buildDiagram.nodes.0.title

boot.s + trip_distance.s

## PI_BOOT_LABELS.buildDiagram.nodes.0.detail

Board startup and unchanged arithmetic

## PI_BOOT_LABELS.buildDiagram.nodes.1.id

objects

## PI_BOOT_LABELS.buildDiagram.nodes.1.title

boot.o + trip_distance.o

## PI_BOOT_LABELS.buildDiagram.nodes.1.detail

Separate assembled object files

## PI_BOOT_LABELS.buildDiagram.nodes.2.id

elf

## PI_BOOT_LABELS.buildDiagram.nodes.2.title

boot.elf

## PI_BOOT_LABELS.buildDiagram.nodes.2.detail

Linked using boot.ld at 0x200000

## PI_BOOT_LABELS.buildDiagram.nodes.3.id

raw

## PI_BOOT_LABELS.buildDiagram.nodes.3.title

assembly-lab-pi5.img

## PI_BOOT_LABELS.buildDiagram.nodes.3.detail

Raw instruction and data bytes

## PI_BOOT_LABELS.buildDiagram.nodes.4.id

card

## PI_BOOT_LABELS.buildDiagram.nodes.4.title

Card root

## PI_BOOT_LABELS.buildDiagram.nodes.4.detail

config.txt selects the image and the same load address

## PI_BOOT_LABELS.buildDiagram.links.0.from

source

## PI_BOOT_LABELS.buildDiagram.links.0.to

objects

## PI_BOOT_LABELS.buildDiagram.links.0.label

GNU assembler

## PI_BOOT_LABELS.buildDiagram.links.1.from

objects

## PI_BOOT_LABELS.buildDiagram.links.1.to

elf

## PI_BOOT_LABELS.buildDiagram.links.1.label

GNU linker + boot.ld

## PI_BOOT_LABELS.buildDiagram.links.2.from

elf

## PI_BOOT_LABELS.buildDiagram.links.2.to

raw

## PI_BOOT_LABELS.buildDiagram.links.2.label

objcopy -O binary

## PI_BOOT_LABELS.buildDiagram.links.3.from

raw

## PI_BOOT_LABELS.buildDiagram.links.3.to

card

## PI_BOOT_LABELS.buildDiagram.links.3.label

Copy image + config.txt

## PI_BOOT_LABELS.buildDiagram.footnote

Keep the raw-image load address in config.txt equal to the link address in boot.ld.

## PI_BOOT_LABELS.titles.question

From build checks to a hardware test

## PI_BOOT_LABELS.titles.investigation

Build the Pi 5 image

## PI_BOOT_LABELS.titles.construction

Prepare the card and capture output

## PI_BOOT_LABELS.titles.failureExperiment

Break, rebuild and restore

## PI_BOOT_LABELS.titles.explanation

Find the first missing evidence

## PI_BOOT_LABELS.titles.reflection

Keep the test record
